import { REDIS_DEFAULT_EXPIRY } from "../resources/constants.js";

import { mySQL } from "../services/mysql-service.js";

/**
 * Function which is used to list orders based on different filter conditions
    * @param {string} userId
    * @param {{searchKey: string}} filters
    * @param {string[]} select
    * @param {number} skip
    * @param {number} limit
    * @param {{mysqlService: any, redisService: any}} dependencies
    * @returns
    */

export const listOrders = async (userId, { searchKey }, select, skip = 0, limit = 10, { mysqlService, redisService }) => {
    const redisKey = `order.${userId}.list.` + base64Helper.jsonToBase64({ searchKey, skip, limit, select });
    const redisData = await redisService.get(redisKey);
    if (redisData) return JSON.parse(redisData);
    
    let query = mysqlService
        .selectFrom('orders')
        .select(select || ["order_id", "order_name","order_description", "order_price","order_quantity", "created_at", "updated_at"])
        .where((st) => st.and([ st("is_deleted", "=", false) , st("user_id", "=", userId) ]))
        .orderBy('order_name')
        .limit(limit)
        .offset(skip);
    
    // search key
    if (searchKey) {
        query = query.where((eb) => eb.or([queryHelper.to_tsvector(eb, "order.order_name", searchKey) , 
        queryHelper.to_tsvector(eb, "order.order_description", searchKey) ]));
    }
    const response = await query.execute();
    await redisService.set(redisKey, JSON.stringify(response), REDIS_DEFAULT_EXPIRY);
    return response;
    };

/**
 * Function which is used to get order by id
 * @param {string} userId
 * @param {number} orderId
 * @param {string[]} select
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const getOrderById = async (userId, orderId, select, { mysqlService, redisService }) => {
    const redisKey = `order.${userId}.${orderId}.` + base64Helper.jsonToBase64({ orderId });
    const redisData = await redisService.get(redisKey);
    if (redisData) return JSON.parse(redisData);
    
    const response = await mysqlService
        .selectFrom("orders")
        .select(select || ["order_id", "order_name","order_description", "order_price","order_quantity", "created_at", "updated_at"])
        .where((st) => st.and([ st("order_id", "=", orderId), st("is_deleted", "=", false) , st("user_id", "=", userId) ]))
        .execute();
    
    const data = response?.[0] || null;
    await redisService.set(redisKey, JSON.stringify(data), REDIS_DEFAULT_EXPIRY);
    return data;
    };


/**
 * Function which is used to create a new order item
 * @param {string} userId
 * @param {string} order_name
 * @param {string} order_description
 * @param {number} order_price
 * @param {string} order_category
 * @param {string} order_specifications
 * @param {number} order_quantity
 * @param {string} order_image
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const createOrder = async (userId, order_name, order_description, order_price, order_category, order_specifications, order_quantity, order_image, { mysqlService, redisService }) => {
    const response = await mysqlService
        .insertInto("orders")
        .columns("user_id", "order_name", "order_description", "order_price", "order_category", "order_specifications", "order_quantity", "order_image")
        .values(userId, order_name, order_description, order_price, order_category, order_specifications, order_quantity, order_image)
        .execute();
    
        const data = response?.[0] || null;

        await redisHelper.delRegex(`order.${orderId}*`, { redisService });
        return data;
    };


/**
 * Function which is used to update order by id
    * @param {string} userId
    * @param {number} orderId
    * @param {{mysqlService: any, redisService: any}} dependencies
    * @returns
    */

export const updateOrder = async (userId, orderId, { mysqlService, redisService }) => {
    const response = await mysqlService
        .update("orders")
        .set({ order_name, order_description, order_price, order_category, order_specifications, order_quantity, order_image })
        .where((st) => st.and([ st("order_id", "=", orderId), st("is_deleted", "=", false) , st("user_id", "=", userId) ]))
        .execute();
    
    const data = response?.[0] || null;

    await redisHelper.delRegex(`order.${orderId}*`, { redisService });
    return data;
    };

/**
 * Function which is used to delete order by id
    * @param {string} userId
    * @param {number} orderId
    * @param {{mysqlService: any, redisService: any}} dependencies
    * @returns
    */

export const deleteOrder = async (userId, orderId, { mysqlService, redisService }) => {
    const response = await mysqlService
        .update("orders")
        .set({ is_deleted: true })
        .where((st) => st.and([ st("order_id", "=", orderId), st("is_deleted", "=", false) , st("user_id", "=", userId) ]))
        .execute();
    
    const data = response?.[0] || null;
    await redisHelper.delRegex(`order.${orderId}*`, { redisService });
    return data;
    };
