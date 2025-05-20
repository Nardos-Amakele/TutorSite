const Redis = require("ioredis");

const client = new Redis({
  port: 6379,
  host: "127.0.0.1"
  // password: "your-redis-password" // if needed
});

client.on("connect", () => {
  console.log("✅ Connected to Redis");
});

client.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

module.exports = { client };
