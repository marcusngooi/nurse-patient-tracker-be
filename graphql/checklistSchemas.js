const GraphQLObjectType = require("graphql").GraphQLObjectType;
const GraphQLList = require("graphql").GraphQLList;
const GraphQLNonNull = require("graphql").GraphQLNonNull;
const GraphQLString = require("graphql").GraphQLString;
const GraphQLID = require("graphql").GraphQLID;
const GraphQLBoolean = require("graphql").GraphQLBoolean;
const mongoose = require("mongoose");

const Checklist = require("../models/checklist.server.model");
const Patient = require("../models/user.server.model");

const jwt = require("jsonwebtoken");

const checklistType = new GraphQLObjectType({
  name: "checklist",
  fields: function () {
    return {
      _id: {
        type: GraphQLID,
      },
      patientId: {
        type: GraphQLString,
      },
      fever: {
        type: GraphQLBoolean,
      },
      cough: {
        type: GraphQLBoolean,
      },
      fatigue: {
        type: GraphQLBoolean,
      },
      breathing: {
        type: GraphQLBoolean,
      },
      bodyaches: {
        type: GraphQLBoolean,
      },
      headache: {
        type: GraphQLBoolean,
      },
      smell: {
        type: GraphQLBoolean,
      },
      sorethroat: {
        type: GraphQLBoolean,
      },
      runnynose: {
        type: GraphQLBoolean,
      },
      vomiting: {
        type: GraphQLBoolean,
      },
      diarrhea: {
        type: GraphQLBoolean,
      },
    };
  },
});

const queryType = {
  checklist: {
    type: checklistType,
    args: {
      id: {
        name: "_id",
        type: GraphQLString,
      },
    },
    resolve: function (root, params) {
      const checklistInfo = Checklist.findById(params.id).exec();
      if (!checklistInfo) {
        throw new Error("Error");
      }
      return checklistInfo;
    },
  },
};

const Mutation = {
  checkSymptoms: {
    type: checklistType,
    args: {
      fever: {
        type: GraphQLNonNull(GraphQLBoolean),
      },
      cough: {
        type: GraphQLNonNull(GraphQLBoolean),
      },
      fatigue: {
        type: GraphQLNonNull(GraphQLBoolean),
      },
      breathing: {
        type: GraphQLNonNull(GraphQLBoolean),
      },
      bodyaches: {
        type: GraphQLNonNull(GraphQLBoolean),
      },
      headache: {
        type: GraphQLNonNull(GraphQLBoolean),
      },
      smell: {
        type: GraphQLNonNull(GraphQLBoolean),
      },
      sorethroat: {
        type: GraphQLNonNull(GraphQLBoolean),
      },
      runnynose: {
        type: GraphQLNonNull(GraphQLBoolean),
      },
      vomiting: {
        type: GraphQLNonNull(GraphQLBoolean),
      },
      diarrhea: {
        type: GraphQLNonNull(GraphQLBoolean),
      },
    },

    resolve: async (root, params, context) => {
      const token = context.req.cookies.token;
      let userId;
      const decodedToken = jwt.decode(token);
      userId = decodedToken.id;

      const checklist = new Checklist({
        patientId: userId,
        date: Date(),
        ...params,
      });

      const savedChecklist = await checklist.save();
      await Patient.updateOne(
        { _id: userId },
        {
          $push: {
            checklist: savedChecklist._id,
          },
        }
      );

      return savedChecklist;
    },
  },
};

module.exports = {
  checklistQuery: queryType,
  checklistMutation: Mutation,
};
