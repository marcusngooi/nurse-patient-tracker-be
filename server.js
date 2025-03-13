#!/usr/bin/env node

import { createServer } from "http";
import { createHandler } from "graphql-http/lib/use/express";
import cors from "cors";
import debug from "debug";

import app from "./config/app.js";
import config from "./config/config.js";
import schema from "./graphql/index.js";

const serverDebug = debug("group4comp308project:server");
const port = process.env.PORT || "4000";

app.set("port", port);

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

app.use(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: global,
    context: (req, res) => ({
      req,
      res,
    }),
  })
);

const server = createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
server.timeout = 300000;

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

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
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  console.log(
    `Express GraphQL Server is running on ${config.nodeEnv} mode on port ${config.port}`
  );
  debug(
    `Express GraphQL Server is running on ${config.nodeEnv} mode on port ${config.port}`
  );
}
