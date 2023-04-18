const GraphQLObjectType = require("graphql").GraphQLObjectType;
const GraphQLList = require("graphql").GraphQLList;
const GraphQLNonNull = require("graphql").GraphQLNonNull;
const GraphQLString = require("graphql").GraphQLString;
const GraphQLID = require("graphql").GraphQLID;
const mongoose = require("mongoose");

const Alert = require("../models/alert.server.model");

const jwt = require("jsonwebtoken");

const alertType = new GraphQLObjectType({
  name: "alert",
  fields: function () {
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
    resolve: function (root, params) {
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

    resolve: async (root, params, context) => {
      const token = context.req.cookies.token;
      const decodedToken = jwt.decode(token);
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

module.exports = {
  alertQuery: queryType,
  alertMutation: Mutation,
};
