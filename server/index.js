import app from "./app.js";
import { config } from "./config/config.js";
import { connectRedis } from "./data/redis/redisClient.js";

connectRedis();

app.listen(config.server.port, () => {
  console.log(`Server listening on port ${config.server.port}`);
});
