// Group Project
// Author:      Marcus Ngooi (301147411)
// Description: Connect all schemas.
const GraphQLSchema = require("graphql").GraphQLSchema;
const GraphQLObjectType = require("graphql").GraphQLObjectType;

const { userQuery, userMutation } = require("./userSchemas");
const { vitalsQuery, vitalsMutation } = require("./vitalsSchemas");
const { tipQuery, tipMutation } = require("./tipSchemas");
const { alertQuery, alertMutation } = require("./alertSchemas");
const { aiQuery } = require("./aiSchemas");
const { checklistQuery, checklistMutation } = require("./checklistSchemas");

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: function () {
    return {
      ...userQuery,
      ...vitalsQuery,
      ...tipQuery,
      ...alertQuery,
      ...aiQuery,
      ...checklistQuery,
    };
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: function () {
    return {
      ...userMutation,
      ...vitalsMutation,
      ...tipMutation,
      ...alertMutation,
      ...checklistMutation,
    };
  },
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });
