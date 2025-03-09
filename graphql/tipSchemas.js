import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
} from "graphql";

import Tip, { find, findOne } from "../models/tip.server.model";

const tipType = new GraphQLObjectType({
  name: "tip",
  fields: () => {
    return {
      _id: {
        type: GraphQLID,
      },
      message: {
        type: GraphQLString,
      },
    };
  },
});

const queryType = {
  tip: {
    type: tipType,
    resolve: async () => {
      const tips = await find();
      console.log(tips);
      if (!tips) {
        throw new Error("Error");
      }
      const n = tips.length;
      const randomNum = Math.floor(Math.random() * n);

      return tips[randomNum];
    },
  },
};

const Mutation = {
  addTip: {
    type: tipType,
    args: {
      message: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },

    resolve: async (params) => {
      let tip = await findOne({ message: params.message });
      if (!tip) {
        const tipModel = new Tip(params);
        tip = await tipModel.save().then((tipDoc) => tipDoc.toObject());
        if (!tip) {
          throw new Error("Error saving the Tip!");
        }
      }

      return tip;
    },
  },
};

export const tipQuery = queryType;
export const tipMutation = Mutation;
