import pg from "pg";

import { config } from "../../config/config.js";

export const pool = new pg.Pool(config.postgres);
