// Lab 3 Exercise 1
// Author:      Marcus Ngooi (301147411)
// Description: Connect both Student and Course Schemas. 
var GraphQLSchema = require("graphql").GraphQLSchema;
var GraphQLObjectType = require("graphql").GraphQLObjectType;

var { studentQuery, studentMutation } = require("./studentSchemas");

var { courseQuery, courseMutation } = require("./courseSchemas");

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: function () {
    return {
      ...studentQuery,
      ...courseQuery,
    };
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: function () {
    return {
      ...studentMutation,
      ...courseMutation,
    };
  },
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });
