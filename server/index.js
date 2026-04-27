import app from "./app.js";
import { config } from "./config/config.js";

app.listen(config.server.port, () => {
  console.log(`Server listening on port ${config.server.port}`);
});
