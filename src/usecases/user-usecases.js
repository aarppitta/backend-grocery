import { REDIS_DEFAULT_EXPIRY } from "../resources/constants.js";
import base64Helper from "../helpers/base64-helper.js";
import redisHelper from "../helpers/redis-helper.js";
import jwt from 'jsonwebtoken';

/**
 * Function which is used to get the list of users
 * @param { string } userId
 * @param {{searchKey: string}} filters
 * @param { Object } select
 * @param { number } skip
 * @param { number } limit
 * @param { { mysqlService:any , redisService:any } } dependencies
 * @returns
 */
export const listUsers = async (userId, filters, select, skip, limit, { mysqlService, redisService }) => {
  const redisKey = `user.${userId}.list.` + base64Helper.jsonToBase64({ userId, filters, select, skip, limit });
  const redisData = await redisService.get(redisKey);
  if (redisData) return JSON.parse(redisData);

  const response = await mysqlService
    .selectFrom("user")
    .select(select || ["user_id", "name", "email"])
    .where("user_id", "<>", userId)
    .where("is_deleted", "=", false)
    .where("name", "like", `%${filters.searchKey}%`)
    .orWhere("email", "like", `%${filters.searchKey}%`)
    .limit(limit || 10)
    .offset(skip || 0)
    .execute();
  
    const data = response || null;
    if (data) await redisService.set(redisKey, JSON.stringify(data), REDIS_DEFAULT_EXPIRY);
    return data;
};


/**
 * Function which is used to get user by id
 * @param { string } userId
 * @param {{searchKey: string}} filters
 * @param { Object } select
 * @param { number } skip
 * @param { number } limit
 * @param { { mysqlService:any , redisService:any } } dependencies
 * @returns
 */
export const getUserById = async (userId, select, { mysqlService, redisService }) => {
  const redisKey = `user.${userId}.` + base64Helper.jsonToBase64({ userId });
  const redisData = await redisService.get(redisKey);
  if (redisData) return JSON.parse(redisData);

  const response = await mysqlService
    .selectFrom("user")
    .select(select || ["user_id", "name", "password", "email"])
    .where("user_id", "=", userId)
    .limit(1)
    .execute();
  
    const data = response?.[0] || null;
    if (data) await redisService.set(redisKey, JSON.stringify(data), REDIS_DEFAULT_EXPIRY);
    return data;
};

/**
 * Function which is used to get user by email
 * @param { string } email
 * @param { Object } select
 * @param { { mysqlService:any, redisService:any } } dependencies
 * @returns
 */
export const getUserByEmail = async (email, select, { mysqlService, redisService }) => {
  const redisKey = `user.${email}.` + base64Helper.jsonToBase64({ email });
  const redisData = await redisService.get(redisKey);

  if (redisData) return JSON.parse(redisData);

  const response = await mysqlService
    .selectFrom("user")
    .where("email", "=", email)
    .select(select || ["user_id", "name", "password", "email"])
    .limit(1)
    .execute();
  
    const data = response?.[0] || null;
    if (data) {
      await redisService.set(redisKey, JSON.stringify(data), REDIS_DEFAULT_EXPIRY);
  
      // Create a token
      const token = jwt.sign({ id: data.user_id }, 'secret', { expiresIn: '1h' });
  
      // Add the token to the data object
      data.token = token;
    }
  
    return data;
};

/**
 * Function which is used to create a new user account
 * @param { string } name
 * @param { string } email
 * @param { string } password
 * @param { string } display_name
 * @param { string } gender
 * @param { { mysqlService:any, bcryptService, redisService:any } } dependencies
 */
export const createUser = async ({name, email, password, display_name, gender}, select ,{ mysqlService, bcryptService, redisService }) => {
  //const hashedPassword = await bcryptService.hash(password);
  // const displayName = name.toLowerCase();
  // const normalizedName = stringHelper.camelize(name);
  
  const response = await mysqlService
  .insertInto("user")
  .values({
    name : name,
    display_name: display_name,
    email: email,
    password: password,
    gender:gender,
  }).execute();

  const result = await mysqlService.selectFrom("user")
  .select(select || ["user_id", "name", "display_name", "email", "gender", "password", "created_at", "updated_at"])
  .where((st) => st.and([st("user_id", "=", response[0].insertId)]))  
  .execute();
  
  const data = result?.[0] || null;
  await redisHelper.delRegex(`user.${email}*`, { redisService });
  return data;

};

/**
 * Function which is used to update the user password
 * @param { number } userId
 * @param { string } password
 * @param { string } name
 * @param { string } email
 * @param { { mysqlService:any, bcryptService, redisService:any } } dependencies
 */
export const updateUser = async (userId, password, { mysqlService, bcryptService, redisService }) => {
  const hashedPassword = await bcryptService.hash(password);
  const result = mysqlService
    .updateTable("user")
    .set({
      password: hashedPassword,
      updated_at: new Date(),
    })
    .where("user_id", "=", userId)
    .executeTakeFirst();


    //update the user data in redis
    const user = await redisService.get(`user.${userId}`);
    if (user) {
      user.password = hashedPassword;
      await redisService.set(`user.${userId}`, JSON.stringify(user), REDIS_DEFAULT_EXPIRY);
    }
    return result;
};

/**
 * Function which is used to delete the user 
 * @param { number } userId
 * @param { string } name
 * @param { { mysqlService:any, redisService:any } } dependencies
 */

export const deleteUser = async (userId, { mysqlService, redisService }) => {
  const response = await mysqlService
    .updateTable("user")
    .set({
      is_deleted: true,
      updated_at: new Date(),
    })
    .where("user_id", "=", userId)
    .returning(["user_id", "update_at"])
    .execute();

    //delete the user data in redis
  
    await redisService.del(`user.${userId}`);
    await redisHelper.delRegex(`user.${userId}*`, { redisService });
    return response;
  };