import asyncRedis from "async-redis";
const client = asyncRedis.createClient({
  host: process.env.REDIS_HOST, // The redis url to connect
});
export const BASE_KEY_PREFIX = "grocery.auth.";

/**
 * Redis service which is used to maintain the connection to the redis
 */
class RedisService {
  constructor(client) {
    this.client = client;
  }

  /**
   * function which is used to get data from redis
   * @param { String } key
   */
  get(key) {
    return client.get(BASE_KEY_PREFIX + key);
  }
  /**
   * function which is used to set value to redis
   * @param { String } key
   * @param { String } value
   * @param { number } ex
   */
  set(key, value, ex) {
    if (value !== undefined && value !== "null" && value !== null) {
      if (!ex) return client.set(BASE_KEY_PREFIX + key, value ? value.toString() : null);
      return client.set(BASE_KEY_PREFIX + key, value ? value.toString() : null, "EX", ex);
    }
    return;
  }

  /**
   * function which is used to del data from redis
   * @param { String } key
   */
  del(key) {
    return client.del(BASE_KEY_PREFIX + key);
  }

  /**
   * Function to scan all the keys on redis
   * @param { number } cursor
   * @param { string } matchPattern
   * @param { number? } count
   * @param { string? } type
   * @returns
   */
  scan(cursor, matchPattern, count, type) {
    const args = [cursor, "MATCH", matchPattern];
    if (count) args.push("COUNT", count);
    if (type) args.push("TYPE", type);
    return client.scan(args);
  }

  /**
   * Function which is used to delete multiple redis keys
   * @param { string[] } keys
   */
  delExactKeys(keys) {
    return client.del(keys);
  }
}

const redisService = new RedisService(client);

export default redisService;
