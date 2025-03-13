import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
} from "graphql";
import { decode } from "jsonwebtoken";

import Alert from "../models/alert.server.model.js";

const alertType = new GraphQLObjectType({
  name: "alert",
  fields: () => {
    return {
      _id: {
        type: GraphQLID,
      },
      message: {
        type: GraphQLString,
      },
      patient: {
        type: GraphQLString,
      },
    };
  },
});

const queryType = {
  alert: {
    type: alertType,
    args: {
      id: {
        name: "_id",
        type: GraphQLString,
      },
    },
    resolve: (params) => {
      const alertInfo = Alert.findById(params.id).exec();
      if (!alertInfo) {
        throw new Error("Error");
      }
      return alertInfo;
    },
  },
};

const Mutation = {
  addAlert: {
    type: alertType,
    args: {
      message: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },

    resolve: async (params, context) => {
      const token = context.req.cookies.token;
      const decodedToken = decode(token);
      const userId = decodedToken.id;
      let alert = await Alert.findOne({ message: params.message });
      if (!alert) {
        const alertModel = new Alert({ patient: userId, ...params });
        alert = await alertModel.save().then((alertDoc) => alertDoc.toObject());
        if (!alert) {
          throw new Error("Error sending the alert to first responders");
        }
      }

      return alert;
    },
  },
};

export const alertQuery = queryType;
export const alertMutation = Mutation;
