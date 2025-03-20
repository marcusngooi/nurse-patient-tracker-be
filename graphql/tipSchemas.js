import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
} from "graphql";

import Tip from "../models/tip.server.model.js";

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
      const tips = await Tip.find();
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

    resolve: async (_, args) => {
      let tip = await Tip.findOne({ message: args.message });
      if (!tip) {
        const tipModel = new Tip(args);
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
