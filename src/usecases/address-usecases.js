
import { REDIS_DEFAULT_EXPIRY } from "../resources/constants.js";
import { mySQL } from "../services/mysql-service.js";
import redisHelper  from "../helpers/redis-helper.js";
import base64Helper from "../helpers/base64-helper.js";
import { sql } from "kysely";
/**
 * Function which is used to list address based on different filter conditions
 * @param {string} userId
 * @param {{searchKey: string}} filters
 * @param {string[]} select
 * @param {number} skip
 * @param {number} limit
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */
export const listAddresses = async (userId, { searchKey }, select, skip = 0, limit = 10, { mysqlService, redisService }) => {
  const redisKey = `address.${userId}.list.` + base64Helper.jsonToBase64({ searchKey, skip, limit, select });
  const redisData = await redisService.get(redisKey);
  if (redisData) return JSON.parse(redisData);

  let query = mysqlService
    .selectFrom('address')
    .select(select || ["address_id", "address_type","address_line_1", "address_line_2","city", "state", "country" , "pincode" , "mobile", "created_at", "updated_at"])
    .where((st) => st.and([ st("is_deleted", "=", false) , st("user_id", "=", userId) ]))
    .orderBy('address_type')
    .limit(limit)
    .offset(skip);

  // search key
  if (searchKey) {
    query = query
    .where(sql`CONCAT(address_type, address_line_1, address_line_2, city, state, country, pincode, mobile) LIKE ${`%${searchKey}%`}`) ;
  }
  const response = await query.execute();
  await redisService.set(redisKey, JSON.stringify(response), REDIS_DEFAULT_EXPIRY);
  return response;
};

/**
 * Function which is used to get address by id
 * @param {string} userId
 * @param {string} addressId
 * @param {string[]} select
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const getAddressById = async (userId, addressId, select, { mysqlService, redisService }) => {
  const redisKey = `address.${userId}.${addressId}.` + base64Helper.jsonToBase64({ addressId });
  const redisData = await redisService.get(redisKey);
  if (redisData) return JSON.parse(redisData);

  const response = await mysqlService
    .selectFrom("address")
    .select(select || ["address_id", "address_type","address_line_1", "address_line_2","city", "state", "country" , "pincode" , "mobile" , "created_at", "updated_at"])
    .where((st) => st.and([ st("address_id", "=", addressId), st("is_deleted", "=", false) , st("user_id", "=", userId) ]))
    .execute();

  const data = response?.[0] || null;
  if (data) await redisService.set(redisKey, JSON.stringify(data), REDIS_DEFAULT_EXPIRY);
  return data;
};

/**
 * Function which is used to create a new address item
 * @param {string} userId
 * @param {{ address_type:string , address_line_1:string, address_line_2:string,  city : string  , pincode :string , mobile:string }} addressItem
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */
export const createAddress = async (userId, { address_type, address_line_1, address_line_2, city ,state, country , pincode , mobile  }, select, { mysqlService, redisService }) => {
  const response = await mysqlService
    .insertInto("address")
    .values({
      address_type: address_type,
      address_line_1: address_line_1,
      address_line_2: address_line_2,
      city:city,
      state:state,
      country:country,
      pincode : pincode,
      mobile:mobile,
      user_id: userId,
    }).execute();

    const result = await mysqlService.selectFrom("address")
    .select(select || ["address_id", "address_type","address_line_1", "address_line_2","city", "state", "country" , "pincode" , "mobile", "created_at", "updated_at"])
    .where((st) => st.and([st("address_id", "=", response[0].insertId)]))
    .execute();

  const data = result?.[0] || null;
  await redisHelper.delRegex(`address.${userId}*`, { redisService });
  return data;
  }

/**
 * Function which is used to update a address item
 * @param {string} userId
 * @param {string} addressId
* @param {{address_type: string , address_line_1 : string , address_line_2 :string , city : string , state : string , pincode :string , mobile:string }} addressItem
 * @param {string[]} select
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */
export const updateAddress = async (userId, addressId, { address_type , address_line_1 , address_line_2 , city ,state , country , pincode , mobile }, select, { mysqlService, redisService }) => {
  const updateObject = { updated_at: new Date() };
  if (address_type) updateObject.address_type = address_type;
  if (address_line_1) updateObject.address_line_1 = address_line_1;
  if (address_line_2) updateObject.address_line_2 = address_line_2;
  if (city) updateObject.city = city;
  if (state) updateObject.state = state;
  if (country) updateObject.country = country;
  if (pincode) updateObject.pincode = pincode;
  if (mobile) updateObject.mobile = mobile;
  
  const response = await mysqlService
    .updateTable("address")
    .where((st) => st.and([st("address_id", "=", addressId) , st("user_id", "=", userId) , st("is_deleted", "=", false)]))
    .set(updateObject)
    .execute();

    const result = await mysqlService.selectFrom("address")
    .select(select || ["address_id", "address_type","address_line_1", "address_line_2","city", "state", "country" , "pincode" , "mobile", "created_at", "updated_at"])
    .where((st) => st.and([st("address_id", "=", addressId)]))
    .execute();
    
  const data = result?.[0] || null;
  await redisHelper.delRegex(`address.${userId}*`, { redisService });
  return data;
  
};

/**
 * Function which is used to delete a address item
 * @param {string} userId
 * @param {string} addressId
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */
export const deleteAddress = async (userId, addressId, { mysqlService, redisService }) => {
  const response = await mysqlService
    .updateTable("address")
    .where((st) => st.and([st("address_id", "=", addressId), st("user_id", "=", userId)]))
    .set({
      is_deleted: true,
      updated_at: new Date(),
    })
    .execute();

  await redisHelper.delRegex(`address.${userId}*`, { redisService });
  return response != null ? {'address_id':addressId} : null;
};