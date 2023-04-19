// COMP308-402 Group Project-Group-4
// Authors:     Marcus Ngooi (301147411)
//              Ikamjot Hundal (301134374)
//              Ben Coombes (301136902)
//              Grant Macmillan (301129935)
//              Gabriel Dias Tinoco
//              Tatsiana Ptushko (301182173)
// Description: Tip Schema.
const GraphQLObjectType = require("graphql").GraphQLObjectType;
const GraphQLList = require("graphql").GraphQLList;
const GraphQLNonNull = require("graphql").GraphQLNonNull;
const GraphQLString = require("graphql").GraphQLString;
const GraphQLID = require("graphql").GraphQLID;
const mongoose = require("mongoose");

const Tip = require("../models/tip.server.model");

const tipType = new GraphQLObjectType({
  name: "tip",
  fields: function () {
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
    resolve: async (root, params) => {
      const tips = await Tip.find();
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

    resolve: async (root, params, context) => {
      let tip = await Tip.findOne({ message: params.message });
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

module.exports = {
  tipQuery: queryType,
  tipMutation: Mutation,
};
