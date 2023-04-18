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
                type: GraphQLString
            },
            patient: {
                type: GraphQLString
            }
        };

    },
});

const queryType = {
    tip: {
        type: tipType,
        args: {
            id: {
                name: "_id",
                type: GraphQLString
            },
        },
        resolve: function (root, params) {
            const tipInfo = Tip.findById(params.id).exec();
            if (!tipInfo) {
                throw new Error("Error");
            }
            return tipInfo;
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
            patient: {
                type: new GraphQLNonNull(GraphQLString)
            },
        },

        resolve: async (root, params, context) => {
            let tip = await Tip.findOne({message: params.message });
            if (!tip) {
                const tipModel = new Tip(params);
                tip = await tipModel
                    .save()
                    .then((tipDoc) => tipDoc.toObject());
                if (!tip) {
                    throw new Error("Error saving the Tip!")
                }
            };

            return tip;
        },
    },
};

module.exports = {
    tipQuery: queryType,
    tipMutation: Mutation,
};