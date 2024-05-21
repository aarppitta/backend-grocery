// Default redis cache timeout in seconds
export const REDIS_DEFAULT_EXPIRY = 60 * 60;

/**
 * Function which is used to convert Object to Array ENUM
 * @param { object } object
 */
const mapToEnum = (object, returnValue) => {
  if (returnValue) return Object.keys(object).map((key) => object[key]);
  return Object.keys(object);
};

/**
 * History Duration supported by the system
 */
export const DURATION = {
  _DAY: "1d",
  _WEEK: "7d",
  _2_WEEK: "14d",
  _MONTH: "30d",
  _2_MONTH: "60d",
  _3_MONTH: "90d",
  _6_MONTH: "180d",
  _YEAR: "360d",
  _2_YEAR: "720d",
  _5_YEAR: "1800d",
};

// Duration and Group By Mapping
export const DURATION_INTERVAL_MAP = {
  _WEEK: {
    DURATION: DURATION._WEEK,
    INTERVAL: [DURATION._DAY, DURATION._WEEK],
  },
  _2_WEEK: {
    DURATION: DURATION._2_WEEK,
    INTERVAL: [DURATION._DAY, DURATION._WEEK, DURATION._2_WEEK],
  },
  _MONTH: {
    DURATION: DURATION._MONTH,
    INTERVAL: [DURATION._WEEK, DURATION._2_WEEK, DURATION._MONTH],
  },
  _3_MONTH: {
    DURATION: DURATION._3_MONTH,
    INTERVAL: [DURATION._WEEK, DURATION._2_WEEK, DURATION._MONTH, DURATION._3_MONTH],
  },
  _6_MONTH: {
    DURATION: DURATION._6_MONTH,
    INTERVAL: [DURATION._2_WEEK, DURATION._MONTH, DURATION._2_MONTH, DURATION._3_MONTH, DURATION._6_MONTH],
  },
  _YEAR: {
    DURATION: DURATION._YEAR,
    INTERVAL: [DURATION._MONTH, DURATION._2_MONTH, DURATION._3_MONTH, DURATION._6_MONTH, DURATION._YEAR],
  },
  _2_YEAR: {
    DURATION: DURATION._2_YEAR,
    INTERVAL: [DURATION._MONTH, DURATION._2_MONTH, DURATION._3_MONTH, DURATION._6_MONTH, DURATION._YEAR, DURATION._2_YEAR],
  },
  _5_YEAR: {
    DURATION: DURATION._5_YEAR,
    INTERVAL: [DURATION._2_MONTH, DURATION._3_MONTH, DURATION._6_MONTH, DURATION._YEAR, DURATION._5_YEAR],
  },
};

export const DURATION_ENUM = Object.keys(DURATION_INTERVAL_MAP).map((key) => DURATION[key]);

export const DURATION_INTERVAL_MAP_ENUM = mapToEnum(DURATION_INTERVAL_MAP);

export const USER_TYPES = {
  USER: "user",
};

export const AUTH_TOKEN_STRATEGY = {
  PASSWORD: "password",
  REFRESH_TOKEN: "refresh_token",
};

export const AUTH_TOKEN_STRATEGY_ENUM = [AUTH_TOKEN_STRATEGY.PASSWORD, AUTH_TOKEN_STRATEGY.REFRESH_TOKEN];

export const OTP_STRATEGY = {
  LOGIN: "login",
  PASSWORD_RESET: "reset",
};

export const OTP_STRATEGY_ENUM = [OTP_STRATEGY.LOGIN, OTP_STRATEGY.PASSWORD_RESET];