import { REDIS_DEFAULT_EXPIRY } from "../resources/constants.js";

import { mySQL } from "../services/mysql-service.js";

/**
 * Function which is used to list contact based on different filter conditions
 * @param {string} contactId
 * @param {{searchKey: string}} filters
 * @param {string[]} select
 * @param {number} skip
 * @param {number} limit
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const listContacts = async ({ searchKey }, select, skip = 0, limit = 10, { mysqlService, redisService }) => {
    const redisKey = `contact.${contactId}.list.` + base64Helper.jsonToBase64({ searchKey, skip, limit, select });
    const redisData = await redisService.get(redisKey);
    if (redisData) return JSON.parse(redisData);
    
    let query = mysqlService
        .selectFrom('contact')
        .select(select || ["contact_id", "contact_name","contact_email", "contact_phone","contact_address", "created_at", "updated_at"])
        .where((st) => st.and([ st("is_deleted", "=", false) ]))
        .orderBy('contact_name')
        .limit(limit)
        .offset(skip);
    
    // search key
    if (searchKey) {
        query = query.where((eb) => eb.or([queryHelper.to_tsvector(eb, "contact.contact_name", searchKey) , 
        queryHelper.to_tsvector(eb, "contact.contact_email", searchKey) ]));
    }
    const response = await query.execute();
    await redisService.set(redisKey, JSON.stringify(response), REDIS_DEFAULT_EXPIRY);
    return response;
    };

/**
 * Function which is used to get contact by id
 * @param {number} contactId
 * @param {string[]} select
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const getContactById = async (contactId, select, { mysqlService, redisService }) => {
    const redisKey = `contact.${contactId}.` + base64Helper.jsonToBase64({ contactId });
    const redisData = await redisService.get(redisKey);
    if (redisData) return JSON.parse(redisData);
    
    const response = await mysqlService
        .selectFrom("contact")
        .select(select || ["contact_id", "contact_name","contact_email", "contact_phone","contact_address", "created_at", "updated_at"])
        .where((st) => st.and([ st("contact_id", "=", contactId), st("is_deleted", "=", false) ]))
        .execute();
    
    const data = response?.[0] || null;
    await redisService.set(redisKey, JSON.stringify(data), REDIS_DEFAULT_EXPIRY);
    return data;
    };

/**
 * Function which is used to create a contact item
 * @param {string} fname
 * @param {string} lname
 * @param {string} email
 * @param {string} message
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const createContact = async ({ fname, lname, email, message }, select, { mysqlService, redisService }) => {
    const response = await mysqlService
        .insertInto("contact")
        .values({
            fname: fname,
            lname: lname,
            email: email,
            message: message
        })
        .execute();

        const result = await mysqlService.selectFrom("contact")
        .select(select || ["contact_id", "fname","lname", "email", "message", "created_at", "updated_at"])
        .where((st) => st.and([ st("contact_id", "=", response[0].insertId) ]))
        .execute();
    
        const data = result?.[0] || null;
        await redisHelper.delRegex(`contact.${contactId}*`, { redisService });
        return data;
    };

/**
 * Function which is used to update a contact item
 * @param {number} contactId
 * @param {string} contactName
 * @param {string} contactEmail
 * @param {string} message
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const updateContact = async (contactId, contactName, contactEmail, message, { mysqlService, redisService }) => {
    const response = await mysqlService
        .update("contact")
        .set({ contact_name: contactName, contact_email: contactEmail, message: message })
        .where((st) => st.and([ st("contact_id", "=", contactId), st("is_deleted", "=", false) ]))
        .execute();
    
    const data = response?.[0] || null;
    await redisHelper.delRegex(`contact.${contactId}*`, { redisService });
    return data;
    };


/**
 * Function which is used to delete a contact item
 * @param {number} contactId
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const deleteContact = async (contactId, { mysqlService, redisService }) => {
    const response = await mysqlService
        .update("contact")
        .set({ is_deleted: true })
        .where((st) => st.and([ st("contact_id", "=", contactId), st("is_deleted", "=", false) ]))
        .execute();
    
    const data = response?.[0] || null;
    await redisHelper.delRegex(`contact.${contactId}*`, { redisService });
    return data;
    };