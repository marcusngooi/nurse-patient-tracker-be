#!/usr/bin/env node

// Lab 3 Exercise 1
// Author:      Marcus Ngooi (301147411)
//              Ikamjot Hundal ()
// Description: Main file of the node.js application.

const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/index");
const cors = require("cors");

const app = require("./config/app");
const debug = require("debug")("group4comp308project:server");
const http = require("http");

const port = process.env.PORT || "4000";
app.set("port", port);

app.use(
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

const server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

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

// app.listen(port, () => {
//   console.log(
//     `Express GraphQL Server is running on http://localhost:${port}/graphql...`
//   );
// });
