import { REDIS_DEFAULT_EXPIRY } from "../resources/constants.js";
import { mySQL } from "../services/mysql-service.js";

/**
 * Function which is used to list cart based on different filter conditions
 * @param {string} userId
 * @param {{searchKey: string}} filters
 * @param {string[]} select
 * @param {number} skip
 * @param {number} limit
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */


export const listCarts = async (userId, { searchKey }, select, skip = 0, limit = 10, { mysqlService, redisService }) => {
    const redisKey = `cart.${userId}.list.` + base64Helper.jsonToBase64({ searchKey, skip, limit, select });
    const redisData = await redisService.get(redisKey);
    if (redisData) return JSON.parse(redisData);
    
    let query = mysqlService
        .selectFrom('cart')
        .select(select || ["cart_id", "product_id","category_id", "quantity", "created_at", "updated_at"])
        .where((st) => st.and([ st("is_deleted", "=", false) , st("user_id", "=", userId) ]))
        .orderBy('cart_id')
        .limit(limit)
        .offset(skip);

    // search key
    if (searchKey) {
        query = query.where((eb) => eb.or([queryHelper.to_tsvector(eb, "cart.product_id", searchKey) , 
        queryHelper.to_tsvector(eb, "cart.category_id", searchKey) ]));
    }
};

/**
 * Function which is used to get cart by id
 * @param {string} userId
 * @param {number} cartId
 * @param {string[]} select
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const getCartById = async (userId, cartId, select, { mysqlService, redisService }) => {
    const redisKey = `cart.${userId}.${cartId}.` + base64Helper.jsonToBase64({ cartId });
    const redisData = await redisService.get(redisKey);
    if (redisData) return JSON.parse(redisData);
    
    const response = await mysqlService
        .selectFrom("cart")
        .select(select || ["cart_id", "product_id","category_id", "quantity", "created_at", "updated_at"])
        .where((st) => st.and([ st("cart_id", "=", cartId), st("is_deleted", "=", false) , st("user_id", "=", userId) ]))
        .execute();
    
    const data = response?.[0] || null;
    await redisService.set(redisKey, JSON.stringify(data), REDIS_DEFAULT_EXPIRY);
    return data;
}

/**
 * Function which is used to create cart
 * @param {string} userId
 * @param {{product_id: number, category_id: number, quantity: number}} data
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const createCart = async (userId, { mysqlService, redisService }) => {
    const response = await mysqlService
        .insertInto("cart")
        .columns(["user_id", "product_id", "category_id", "quantity"])
        .values([userId, data.product_id, data.category_id, data.quantity])
        .execute();

        const result = response?.[0] || null;
        await redisHelper.delRegex(`cart.${cartId}*`, { redisService });
        return result;
}

/**
 * Function which is used to update cart
 * @param {string} userId
 * @param {number} cartId
 * @param {{product_id: number, category_id: number, quantity: number}} data
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const updateCart = async (userId, cartId, { mysqlService, redisService }) => {
    const response = await mysqlService
        .update("cart")
        .set({ product_id: data.product_id, category_id: data.category_id, quantity: data.quantity })
        .where((st) => st.and([ st("cart_id", "=", cartId), st("is_deleted", "=", false) , st("user_id", "=", userId) ]))
        .execute();

    const data = response?.[0] || null;
    await redisHelper.delRegex(`cart.${cartId}*`, { redisService });
    return data;
};

/**
 * Function which is used to delete cart
 * @param {string} userId
 * @param {number} cartId
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const deleteCart = async (userId, cartId, { mysqlService, redisService }) => {
    const response = await mysqlService
        .deleteFrom("cart")
        .where((st) => st.and([ st("cart_id", "=", cartId), st("is_deleted", "=", false) , st("user_id", "=", userId) ]))
        .execute();

    const data = response?.[0] || null;
    await redisHelper.delRegex(`cart.${cartId}*`, { redisService });
    return data;
};