import { BASE_KEY_PREFIX } from "../services/redis-service.js";
const MAX_COUNT = 10000;
/**
 * Function which is used to delete multiple redis keys with the given pattern
 * @param { string } pattern
 * @param {{redisService: any}} dependencies
 */
const delRegex = async (pattern, { redisService }) => {
  const redisData = await redisService.scan(0, BASE_KEY_PREFIX + pattern, MAX_COUNT);
  if (redisData && redisData.length >= 2) {
    const [count, redisKeys, ...other] = redisData;
    if (redisKeys && redisKeys.length > 0) await redisService.delExactKeys(redisKeys);
  }
};
const redisHelper = {
  delRegex,
};
export default redisHelper;