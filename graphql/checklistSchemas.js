import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
} from "graphql";
import { decode } from "jsonwebtoken";

import Checklist from "../models/checklist.server.model.js";
import User from "../models/user.server.model.js";

const checklistType = new GraphQLObjectType({
  name: "checklist",
  fields: () => {
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
    resolve: (params) => {
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
        type: new GraphQLNonNull(GraphQLBoolean),
      },
      cough: {
        type: new GraphQLNonNull(GraphQLBoolean),
      },
      fatigue: {
        type: new GraphQLNonNull(GraphQLBoolean),
      },
      breathing: {
        type: new GraphQLNonNull(GraphQLBoolean),
      },
      bodyaches: {
        type: new GraphQLNonNull(GraphQLBoolean),
      },
      headache: {
        type: new GraphQLNonNull(GraphQLBoolean),
      },
      smell: {
        type: new GraphQLNonNull(GraphQLBoolean),
      },
      sorethroat: {
        type: new GraphQLNonNull(GraphQLBoolean),
      },
      runnynose: {
        type: new GraphQLNonNull(GraphQLBoolean),
      },
      vomiting: {
        type: new GraphQLNonNull(GraphQLBoolean),
      },
      diarrhea: {
        type: new GraphQLNonNull(GraphQLBoolean),
      },
    },

    resolve: async (params, context) => {
      const token = context.req.cookies.token;
      let userId;
      const decodedToken = decode(token);
      userId = decodedToken.id;

      const checklist = new Checklist({
        patientId: userId,
        date: Date(),
        ...params,
      });

      const savedChecklist = await checklist.save();
      await User.updateOne(
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

export const checklistQuery = queryType;
export const checklistMutation = Mutation;
