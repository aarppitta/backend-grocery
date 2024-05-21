import { REDIS_DEFAULT_EXPIRY } from "../resources/constants.js";

import { mySQL } from "../services/mysql-service.js";

/**
 * Function which is used to list payment based on different filter conditions
 * @param {string} userId
 * @param {{searchKey: string}} filters
 * @param {string[]} select
 * @param {number} skip
 * @param {number} limit
 * @param {{mysqlService: any, redisService: any}} dependencies
 *  @returns
 */

export const listPayments = async (userId, { searchKey }, select, skip = 0, limit = 10, { mysqlService, redisService }) => {
    const redisKey = `payment.${userId}.list.` + base64Helper.jsonToBase64({ searchKey, skip, limit, select });
    const redisData = await redisService.get(redisKey);
    if (redisData) return JSON.parse(redisData);
    
    let query = mysqlService
        .selectFrom('payment')
        .select(select || ["payment_id", "payment_name","payment_description", "created_at", "updated_at"])
        .where((st) => st.and([ st("is_deleted", "=", false) , st("user_id", "=", userId) ]))
        .orderBy('payment_name')
        .limit(limit)
        .offset(skip);
    
    // search key
    if (searchKey) {
        query = query.where((eb) => eb.or([queryHelper.to_tsvector(eb, "payment.payment_name", searchKey) , 
        queryHelper.to_tsvector(eb, "payment.payment_description", searchKey) ]));
    }
    const response = await query.execute();
    await redisService.set(redisKey, JSON.stringify(response), REDIS_DEFAULT_EXPIRY);
    return response;
    };

/**
 * Function which is used to get payment by id
 * @param {string} userId
 * @param {number} paymentId
 * @param {string[]} select
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const getPaymentById = async (userId, paymentId, select, { mysqlService, redisService }) => {
    const redisKey = `payment.${userId}.${paymentId}.` + base64Helper.jsonToBase64({ paymentId });
    const redisData = await redisService.get(redisKey);
    if (redisData) return JSON.parse(redisData);
    
    const response = await mysqlService
        .selectFrom("payment")
        .select(select || ["payment_id", "payment_name","payment_description", "created_at", "updated_at"])
        .where((st) => st.and([ st("payment_id", "=", paymentId), st("is_deleted", "=", false) , st("user_id", "=", userId) ]))
        .execute();
    
    const data = response?.[0] || null;
    await redisService.set(redisKey, JSON.stringify(data), REDIS_DEFAULT_EXPIRY);
    return data;
    };

/**
 * Function which is used to create payment item
 * @param {string} userId
 * @param {string} paymentId
 * @param {string} payment_name
 * @param {string} payment_description
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const createPayment = async (userId, { payment_name, payment_description }, { mysqlService, redisService }) => {
    const response = await mysqlService
        .insertInto("payment")
        .columns("user_id", "payment_name", "payment_description")
        .values(userId, payment_name, payment_description)
        .execute();
    
        const data = response?.[0] || null;
        await redisHelper.delRegex(`payment.${paymentId}*`, { redisService });
        return data;
    };

/**
 * Function which is used to update payment based on different filter conditions
 * @param {string} userId
 * @param {number} paymentId
 * @param {string} payment_name
 * @param {string} payment_description
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const updatePayment = async (userId, paymentId, { payment_name, payment_description }, { mysqlService, redisService }) => {
    const response = await mysqlService
        .update("payment")
        .set({ payment_name, payment_description })
        .where((st) => st.and([ st("payment_id", "=", paymentId), st("is_deleted", "=", false) , st("user_id", "=", userId) ]))
        .execute();
    
        const data = response?.[0] || null;
        await redisHelper.delRegex(`payment.${paymentId}*`, { redisService });
        return data;
    };

/**
 * Function which is used to delete payment item
 * @param {string} userId
 * @param {number} paymentId
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const deletePayment = async (userId, paymentId, { mysqlService, redisService }) => {
    const response = await mysqlService
        .update("payment")
        .set({ is_deleted: true })
        .where((st) => st.and([ st("payment_id", "=", paymentId), st("is_deleted", "=", false) , st("user_id", "=", userId) ]))
        .execute();
    
        const data = response?.[0] || null;
        await redisHelper.delRegex(`payment.${paymentId}*`, { redisService });
        return data;
    };