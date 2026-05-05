import { config } from "../config/config.js";

export function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const response = {
    message: statusCode === 500 ? "Something went wrong" : error.message,
  };

  if (config.server.nodeEnv === "development") {
    response.details = error.message;
  }

  res.status(statusCode).json(response);
}
