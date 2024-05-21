import { REDIS_DEFAULT_EXPIRY } from "../resources/constants.js";
import redisHelper  from "../helpers/redis-helper.js";
import base64Helper from "../helpers/base64-helper.js";
import { mySQL } from "../services/mysql-service.js";
import { sql } from "kysely";


/**
 * Function which is used to list of category based on different filter conditions
 * @param {{searchKey: string}} filters
 * @param {string[]} select
 * @param {number} skip
 * @param {number} limit
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const listCategories = async ({ searchKey }, select, skip = 0, limit = 1, { mysqlService, redisService }) => {
    const redisKey = `category.${searchKey}.list.` + base64Helper.jsonToBase64({ searchKey, skip, limit, select });
    const redisData = await redisService.get(redisKey);
    if (redisData) return JSON.parse(redisData);
    
    let query = mysqlService
        .selectFrom('category')
        .select(select || ["category_id", "name","image","description", "created_at", "updated_at"])
        .where((st) => st.and([ st("is_deleted", "=", false) ]))
        .orderBy('name')
        .limit(limit)
        .offset(skip);
    
    // search key
    if (searchKey) {
        query = query
        .where(sql`CONCAT(name,image,description, created_at, updated_at) LIKE ${`%${searchKey}%`}`) ;
    }

    const response = await query.execute();
    await redisService.set(redisKey, JSON.stringify(response), REDIS_DEFAULT_EXPIRY);
    return response;
    };

/**
 * Function which is used to get category by id
 * @param {number} categoryId
 * @param {string[]} select
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const getCategoryById = async (categoryId, select, { mysqlService, redisService }) => {
    const redisKey = `category.${categoryId}.` + base64Helper.jsonToBase64({ categoryId });
    const redisData = await redisService.get(redisKey);
    if (redisData) return JSON.parse(redisData);
    
    const response = await mysqlService
        .selectFrom("category")
        .select(select || ["category_id", "name","image","description", "created_at", "updated_at"])
        .where((st) => st.and([ st("category_id", "=", categoryId), st("is_deleted", "=", false)]))
        .execute();
    
        const data = response?.[0] || null;
        if (data) await redisService.set(redisKey, JSON.stringify(data), REDIS_DEFAULT_EXPIRY);
        return data;
    };

/**
 * Function which is used to create a new category item
 * @param {string} userId
 * @param {string} productId
 * @param {string} category_name
 * @param {string} category_description
 * @param {string} category_image
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
*/

export const createCategory = async (userId,{ name, description, image},select, { mysqlService, redisService }) => {
    const response = await mysqlService
        .insertInto("category")
        .values({
             name:name, 
             description:description, 
             image:image
            })
            .execute();

    const result = await mysqlService.selectFrom("category")
    .select(select || ["category_id", "name","description","image", "created_at", "updated_at"])
    .where((st) => st.and([ st("category_id", "=", response[0].insertId)]))
    .execute();

    const data = result?.[0] || null;
    //not require to set redis key as it is not depend on user id   
    //await redisHelper.delRegex(`category.${user_id}*`, { redisService });
    return data;
    };


/**
 * Function which is used to update a category item
 * @param {string} categoryId
 * @param {string} name
 * @param {string} image
 * @param {string} description
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const updateCategory = async (categoryId, { name, image, description }, { mysqlService, redisService }) => {
    const updateObject = { updated_at: new Date() };
    if (name) updateObject.name = name;
    if (image) updateObject.image = image;
    if (description) updateObject.description = description;

    const response = await mysqlService
        .updateTable("category")
        .where((st) => st.and([ st("category_id", "=", categoryId), st("is_deleted", "=", false)  ]))
        .set(updateObject)
        .execute();

    const result = await mysqlService.selectFrom("category")
    .select(["category_id", "name","description","image", "created_at", "updated_at"])
    .where((st) => st.and([ st("category_id", "=", categoryId)]))
    .execute();
    
    const data = result?.[0] || null;
    await redisHelper.delRegex(`category.${categoryId}*`, { redisService });
    return data;
    };

/**
 * Function which is used to delete a category item
 * @param { number } categoryId
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const deleteCategory = async (categoryId, { mysqlService, redisService }) => {
    const response = await mysqlService
        .updateTable("category")
        .where((st) => st.and([ st("category_id", "=", categoryId)]))
        .set({ 
            is_deleted: true,
        })
        .execute();
    
    await redisHelper.delRegex(`category.${categoryId}*`, { redisService });
    return response != null ? {'category_id':categoryId} : null;
    };