import { REDIS_DEFAULT_EXPIRY } from "../resources/constants.js";

import { mySQL } from "../services/mysql-service.js";

/**
 * Function which is used to list of wishlist based on different filter conditions
 * @param {string} userId
 * @param {string} productId
 * @param {{searchKey: string}} filters
 * @param {string[]} select
 * @param {number} skip
 * @param {number} limit
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const listWishlists = async (userId, productId, { searchKey }, select, skip = 0, limit = 10, { mysqlService, redisService }) => {
    const redisKey = `wishlist.${userId}.list.` + base64Helper.jsonToBase64({ searchKey, skip, limit, select });
    const redisData = await redisService.get(redisKey);
    if (redisData) return JSON.parse(redisData);
    
    let query = mysqlService
        .selectFrom('wishlist')
        .select(select || ["wishlist_id", "product_id","category_id", "created_at", "updated_at"])
        .where((st) => st.and([ st("is_deleted", "=", false) , st("user_id", "=", userId) , st("product_id", "=", productId) ]))
        .orderBy('wishlist_id')
        .limit(limit)
        .offset(skip);
    
    // search key
    if (searchKey) {
        query = query.where((eb) => eb.or([queryHelper.to_tsvector(eb, "wishlist.product_id", searchKey) , 
        queryHelper.to_tsvector(eb, "wishlist.category_id", searchKey) ]));
    }
    const response = await query.execute();
    await redisService.set(redisKey, JSON.stringify(response), REDIS_DEFAULT_EXPIRY);
    return response;
    };

/**
 * Function which is used to get wishlist by id
 * @param {string} userId
 * @param {number} wishlistId
 * @param {string[]} select
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const getWishlistById = async (userId, wishlistId, select, { mysqlService, redisService }) => {
    const redisKey = `wishlist.${userId}.${wishlistId}.` + base64Helper.jsonToBase64({ wishlistId });
    const redisData = await redisService.get(redisKey);
    if (redisData) return JSON.parse(redisData);
    
    const response = await mysqlService
        .selectFrom("wishlist")
        .select(select || ["wishlist_id", "product_id","category_id", "created_at", "updated_at"])
        .where((st) => st.and([ st("wishlist_id", "=", wishlistId), st("is_deleted", "=", false) , st("user_id", "=", userId) ]))
        .execute();
    
    const data = response?.[0] || null;
    await redisService.set(redisKey, JSON.stringify(data), REDIS_DEFAULT_EXPIRY);
    return data;
}

/**
 * Function which is used to create wishlist
 * @param {string} userId
 * @param {number} productId
 * @param {number} categoryId
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const createWishlist = async (userId, productId, categoryId, { mysqlService, redisService }) => {
    const response = await mysqlService
        .insertInto("wishlist")
        .columns("user_id", "product_id", "category_id")
        .values(userId, productId, categoryId)
        .execute();
    
        const data = response?.[0] || null;
        await redisHelper.delRegex(`cart.${cartId}*`, { redisService });
        return data;
};
/**
 * Function which is used to update wishlist
 * @param {string} userId
 * @param {number} wishlistId
 * @param {Object} update
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const updateWishlist = async (userId, wishlistId, update, { mysqlService, redisService }) => {
    const response = await mysqlService
        .update("wishlist")
        .set(update)
        .where((st) => st.and([ st("wishlist_id", "=", wishlistId), st("is_deleted", "=", false) , st("user_id", "=", userId) ]))
        .execute();
    
        const data = response?.[0] || null;
        await redisHelper.delRegex(`wishlist.${wishlistId}*`, { redisService });
        return data;
}

/**
 * Function which is used to delete wishlist
 * @param {string} userId
 * @param {number} wishlistId
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const deleteWishlist = async (userId, wishlistId, { mysqlService, redisService }) => {
    const response = await mysqlService
        .update("wishlist")
        .set({ is_deleted: true })
        .where((st) => st.and([ st("wishlist_id", "=", wishlistId), st("is_deleted", "=", false) , st("user_id", "=", userId) ]))
        .execute();

    const data = response?.[0] || null;
    await redisHelper.delRegex(`wishlist.${wishlistId}*`, { redisService });
    return data;
};