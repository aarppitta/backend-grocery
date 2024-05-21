import { accessTokenManager, base64 } from "@secure-access-control/server";
import redisService from "./redis-service.js";
import NumberHelper from "../helpers/number-helper.js";

const EXPIRY_FOR_INACTIVE_REFRESH_TOKEN = 5 * 24 * 60 * 60;
const REFRESH_TOKEN_STRING_LENGTH = 126;

/**
 * Function which is used to generate a random string with minimum of limit length
 * @param { number } limit
 * @returns
 */
const randomString = (limit) => {
  const loop = Array(Math.ceil(limit / 5)).fill(0);
  return loop.reduce((previous) => previous + (Math.random() + 1).toString(36).substring(7));
};

/**
 * Refresh token service which is used to generate and verify refresh token
 */
const RefreshTokenService = class {
  /**
   * Function which is used generate a unique refresh token for a user based on the device he is login in
   * @param { string } userId
   * @param { string } userAgent
   * @returns
   */
  generateRefreshToken = async (userType, userId, userAgent) => {
    userAgent = accessTokenManager.hash(userAgent);

    let redisKey = userType + "." + userId + ".refresh_token";
    let redisTokenInfo = await redisService.get(redisKey);

    if (redisTokenInfo) {
      /**
       * If the refresh token exits and its from the same device, update the refresh token expiry
       * Otherwise clear the refresh token and generate a new one
       */
      const tokenInfo = JSON.parse(base64.decode(redisTokenInfo), "{}");
      if (tokenInfo.userAgent && tokenInfo.userAgent === userAgent) {
        await redisService.set(redisKey, base64.encode(JSON.stringify(tokenInfo)), EXPIRY_FOR_INACTIVE_REFRESH_TOKEN);
        let refreshTokenRedisKey = userType + ".refresh_token." + tokenInfo.refreshToken;
        await redisService.set(refreshTokenRedisKey, userId, EXPIRY_FOR_INACTIVE_REFRESH_TOKEN);
        return tokenInfo.refreshToken;
      }
    }

    let refreshToken = new Date().getTime() + "_" + randomString(REFRESH_TOKEN_STRING_LENGTH) + "_" + NumberHelper.randomNumber(99999);
    const tokenInfo = { refreshToken: refreshToken, userAgent: userAgent };
    await redisService.set(redisKey, base64.encode(JSON.stringify(tokenInfo)), EXPIRY_FOR_INACTIVE_REFRESH_TOKEN);

    let refreshTokenRedisKey = userType + ".refresh_token." + tokenInfo.refreshToken;
    await redisService.set(refreshTokenRedisKey, userId, EXPIRY_FOR_INACTIVE_REFRESH_TOKEN);

    return refreshToken;
  };

  /**
   * Function which is used to clear the refresh token for the user
   * @param { string } userType
   * @param { string } userId
   * @param { string } userAgent
   * @returns
   */
  clearRefreshToken = async (userType, userId, userAgent) => {
    let redisKey = userType + "." + userId + ".refresh_token";
    let redisTokenInfo = await redisService.get(redisKey);

    if (redisTokenInfo) {
      const tokenInfo = JSON.parse(base64.decode(redisTokenInfo), "{}");
      let refreshTokenRedisKey = userType + ".refresh_token." + tokenInfo.refreshToken;
      await redisService.del(refreshTokenRedisKey);
    }

    await redisService.del(redisKey);
    return;
  };

  /**
   * Function which is used to get the userId which a refresh token is issued to
   * @param { string } refreshToken
   * @param { string } userAgent
   * @returns
   */
  verifyRefreshToken = async (userType, refreshToken, userAgent) => {
    userAgent = accessTokenManager.hash(userAgent);
    let refreshTokenRedisKey = userType + ".refresh_token." + refreshToken;

    let userId = await redisService.get(refreshTokenRedisKey);
    if (!userId) throw { status: 498, statusCode: 498, message: "Bad credentials" };

    let redisKey = userType + "." + userId + ".refresh_token";
    let redisTokenInfo = await redisService.get(redisKey);

    if (!redisTokenInfo) throw { status: 498, statusCode: 498, message: "Bad credentials" };

    const tokenInfo = JSON.parse(base64.decode(redisTokenInfo), "{}");
    if (!tokenInfo.userAgent || tokenInfo.userAgent !== userAgent) {
      this.clearRefreshToken(userType, userId);
      throw { status: 498, statusCode: 498, message: "Bad credentials" };
    }
    return userId;
  };
};

const refreshTokenService = new RefreshTokenService();

export default refreshTokenService;
