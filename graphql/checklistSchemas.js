import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
} from "graphql";
import { decode } from "jsonwebtoken";

import Checklist, { findById } from "../models/checklist.server.model";
import { updateOne } from "../models/user.server.model";

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
      const checklistInfo = findById(params.id).exec();
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
      await updateOne(
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
