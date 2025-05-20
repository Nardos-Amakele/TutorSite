const jwt = require("jsonwebtoken");
const { client } = require("./redisClient");
require("dotenv").config();

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: "24h" }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: "4d" }
  );

  return { accessToken, refreshToken };
};

const blacklistTokens = async (accessToken, refreshToken) => {
  await client.setex(accessToken, 60 * 60 * 24, "blacklisted");
  await client.setex(refreshToken, 60 * 60 * 24 * 4, "blacklisted");
};

const verifyRefreshToken = async (refreshToken) => {
  const isBlacklisted = await client.get(refreshToken);
  if (isBlacklisted) return null;

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY
    );
    const newAccessToken = jwt.sign(
      { userId: payload.userId },
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "24h" }
    );
    return newAccessToken;
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateTokens,
  blacklistTokens,
  verifyRefreshToken
};
