import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
} from "graphql";
import cookie from "cookie";
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
    resolve: (_, args) => {
      const alertInfo = Alert.findById(args.id).exec();
      if (!alertInfo) {
        throw new Error("Could not find alert with the given id.");
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

    resolve: async (_, args, context) => {
      const cookies=context.req.headers.cookie;
      if(!cookies){
        throw new Error("No cookies found in the request");
      }
      const parsedCookies = cookie.parse(cookies);
      const token = parsedCookies.token;
      if (!token) {
        throw new Error("There is no token");
      }
      const decodedToken = decode(token);
      const userId = decodedToken.id;
      let alert = await Alert.findOne({ message: args.message });
      if (!alert) {
        const alertModel = new Alert({ patient: userId, ...args });
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
