// COMP308-402 Group Project-Group-4
// Authors:     Marcus Ngooi (301147411)
//              Ikamjot Hundal (301134374)
//              Ben Coombes (301136902)
//              Grant Macmillan (301129935)
//              Gabriel Dias Tinoco
//              Tatsiana Ptushko (301182173)
// Description: index Schema.
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
