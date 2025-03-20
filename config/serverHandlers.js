import debug from "debug";
import config from "./config.js";

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  let bind = typeof process.env.PORT === "string" ? "Pipe " + process.env.PORT : "Port " + process.env.PORT;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
  console.log(
    `Express GraphQL Server is running on ${config.nodeEnv} mode on port ${config.port}`
  );
  debug(
    `Express GraphQL Server is running on ${config.nodeEnv} mode on port ${config.port}`
  );
};

export { onError, onListening };
