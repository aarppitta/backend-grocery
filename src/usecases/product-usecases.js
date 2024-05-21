import { REDIS_DEFAULT_EXPIRY } from "../resources/constants.js";
import { sql } from "kysely";
import base64Helper from "../helpers/base64-helper.js";
import redisHelper from "../helpers/redis-helper.js";

/**
 * Function which is used to list address based on different filter conditions
 * @param {{searchKey: string}} filters
 * @param {string[]} select
 * @param {number} price
 * @param {string} description
 * @param {string} specifications
 * @param {string} image
 * @param {number} stock
 * @param {string} isFeatured
 * @param {number} skip
 * @param {number} limit
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */


export const listProducts = async ({ searchKey }, select, skip = 0, limit = 10, { mysqlService, redisService }) => {
    const redisKey = `product.${searchKey}.list.` + base64Helper.jsonToBase64({ searchKey, skip, limit, select });
    const redisData = await redisService.get(redisKey);
    if (redisData) return JSON.parse(redisData);
    
    let query = mysqlService
        .selectFrom('product')
        .select(select || ["product_id", "name", "price","description","specifications","image","stock","isFeatured", "created_at", "updated_at"])
        .where((st) => st.and([ st("is_deleted", "=", false)]))
        .orderBy('name')
        .limit(limit)
        .offset(skip);
    
    // search key
    if (searchKey) {
        query = query
        .where(sql`CONCAT(name,price,description,specifications,image,stock,isFeatured, created_at, updated_at) LIKE ${`%${searchKey}%`}`) ;
    }
    const response = await query.execute();
    await redisService.set(redisKey, JSON.stringify(response), REDIS_DEFAULT_EXPIRY);
    return response;
    };

/**
 * Function which is used to get product by id
 * @param {string} productId
 * @param {string[]} select
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const getProductById = async (productId, select, { mysqlService, redisService }) => {
    const redisKey = `product.${productId}.` + base64Helper.jsonToBase64({ productId });
    const redisData = await redisService.get(redisKey);
    if (redisData) return JSON.parse(redisData);
    
    const response = await mysqlService
        .selectFrom("product")
        .select(select || ["product_id", "name", "price","description","specifications", "image","stock", "isFeatured", "created_at", "updated_at"])
        .where((st) => st.and([ st("product_id", "=", productId), st("is_deleted", "=", false)]))
        .execute();
    
    const data = response?.[0] || null;
    if (data) await redisService.set(redisKey, JSON.stringify(data), REDIS_DEFAULT_EXPIRY);
    return data;
    };

/**
 * Function which is used to create a new product item
 * @param {string} name
 * @param {number} price
 * @param {string} description
 * @param {string} specifications
 * @param {string} image
 * @param {number} stock
 * @param {boolean} isFeatured
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const createProduct = async ({ name,price, description ,specifications, image, stock, isFeatured },select, { mysqlService, redisService }) => {

    const response = await mysqlService
        .insertInto("product")
        .values({
            name:name,
             price:price, 
             description:description,
             specifications:specifications, 
             image:image, 
             stock:stock, 
             isFeatured:isFeatured
            })
        .execute();
    
    const result = await mysqlService.selectFrom("product")
    .select(select || ["product_id","name", "price", "description", "specifications", "image", "stock", "isFeatured", "created_at", "updated_at"])
    .where((st) => st.and([ st("product_id", "=", response[0].insertId)]))
    .execute();

    // await redisHelper.delRegex(`product.${productId}*`, { redisService });
    const data = result?.[0] || null;
    return data;
    };

/**
 * Function which is used to update a product item
 * @param {string} productId
 * @param {string} name
 * @param {string} description
 * @param {number} price
 * @param {string} specifications
 * @param {number} stock
 * @param {string} image
 * @param {string} isFeatured
 * @param {string[]} select
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const updateProduct = async (productId, { name, price, description, specifications , image, stock, isFeatured }, select, { mysqlService, redisService }) => {

    const updateObject = { updated_at: new Date() };
    if (name) updateObject.name = name;
    if (price) updateObject.price = price;
    if (description) updateObject.description = description;
    if (specifications) updateObject.specifications = specifications;
    if (image) updateObject.image = image;
    if (stock) updateObject.stock = stock;
    if (isFeatured) updateObject.isFeatured = isFeatured;


    const response = await mysqlService
        .updateTable("product")
        .where((st) => st.and([ st("product_id", "=", productId), st("is_deleted", "=", false) ]))
        .set(updateObject)
        .execute();


    const result = await mysqlService.selectFrom("product")
    .select(select || ["product_id","name", "price", "description", "specifications", "image", "stock", "isFeatured", "created_at", "updated_at"])
    .where((st) => st.and([ st("product_id", "=", productId)]))
    .execute();

    const data = result?.[0] || null;
    await redisHelper.delRegex(`product.${productId}*`, { redisService });
    return data;
    };

/**
 * Function which is used to delete a product item
 * @param { string } productId
 * @param {{mysqlService: any, redisService: any}} dependencies
 * @returns
 */

export const deleteProduct = async ( productId, { mysqlService, redisService }) => {
    const response = await mysqlService
        .updateTable("product")
        .where((st) => st.and([ st("product_id", "=", productId)]))
        .set({ is_deleted: true })
        .execute();
    
    
    await redisHelper.delRegex(`product.${productId}*`, { redisService });
    return response != null ? {'product_id':productId} : null;
    };