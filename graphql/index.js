import { GraphQLSchema, GraphQLObjectType } from "graphql";

import { userQuery, userMutation } from "./userSchemas";
import { vitalsQuery, vitalsMutation } from "./vitalsSchemas";
import { tipQuery, tipMutation } from "./tipSchemas";
import { alertQuery, alertMutation } from "./alertSchemas";
import { aiQuery } from "./aiSchemas";
import { checklistQuery, checklistMutation } from "./checklistSchemas";

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
