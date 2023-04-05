#!/usr/bin/env node

// Lab 3 Exercise 1
// Author:      Marcus Ngooi (301147411)
//              Ikamjot Hundal ()
// Description: Main file of the node.js application.

const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/index");
const cors = require("cors");

const app = require("./config/app");

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

app.listen(port, () => {
  console.log(
    `Express GraphQL Server is running on http://localhost:${port}/graphql...`
  );
});

