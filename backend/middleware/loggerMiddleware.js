import morgan from "morgan";
import logger from "../config/logger.js";

// Morgan logs requests
const httpLogger = morgan("combined", {
  stream: {
    write: (message) => logger.info(message.trim())
  }
});

export default httpLogger;
