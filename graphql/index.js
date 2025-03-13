import { GraphQLSchema, GraphQLObjectType } from "graphql";

import { userQuery, userMutation } from "./userSchemas.js";
import { vitalsQuery, vitalsMutation } from "./vitalsSchemas.js";
import { tipQuery, tipMutation } from "./tipSchemas.js";
import { alertQuery, alertMutation } from "./alertSchemas.js";
import { aiQuery } from "./aiSchemas.js";
import { checklistQuery, checklistMutation } from "./checklistSchemas.js";

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: () => {
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
  fields: () => {
    return {
      ...userMutation,
      ...vitalsMutation,
      ...tipMutation,
      ...alertMutation,
      ...checklistMutation,
    };
  },
});

export default new GraphQLSchema({ query: queryType, mutation: mutation });
