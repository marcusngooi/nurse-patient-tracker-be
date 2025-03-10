#!/usr/bin/env node

import { graphqlHTTP } from "express-graphql";
import schema from "./graphql/index";

import app, { set, use } from "./config/app";
const debug = require("debug")("group4comp308project:server");
import { createServer } from "http";

const port = process.env.PORT || "4000";
set("port", port);

use(
  "/graphql",
  graphqlHTTP((request, response) => {
    return {
      schema: schema,
      rootValue: global,
      graphiql: true,
      context: {
        req: request,
        res: response,
      },
    };
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
  let addr = server.address();
  let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log(
    `Express GraphQL Server is running on http://localhost:${port}/graphql...`
  );
  debug(
    `Express GraphQL Server is running on http://localhost:${port}/graphql...`
  );
}
