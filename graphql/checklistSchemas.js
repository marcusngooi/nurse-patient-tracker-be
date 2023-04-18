const GraphQLObjectType = require("graphql").GraphQLObjectType;
const GraphQLList = require("graphql").GraphQLList;
const GraphQLNonNull = require("graphql").GraphQLNonNull;
const GraphQLString = require("graphql").GraphQLString;
const GraphQLID = require("graphql").GraphQLID;
const mongoose = require("mongoose");


const Checklist = require('../models/checklist.server.model');

const checklistType = new GraphQLObjectType({
    name: "checklist",
    fields: function () {
        return {
            _id: {
                type: GraphQLID,
            },
            fever: {
                type: GraphQLBoolean,
            },
            cough: {
                type: GraphQLBoolean,
            },
            fatigue: {
                type: GraphQLBoolean
            },
            bodyAches: {
                type: GraphQLBoolean
            },
            headache: {
                type: GraphQLBoolean
            },
            losstTastesSmell: {
                type: GraphQLBoolean
            },
            soreThroat: {
                type: GraphQLBoolean
            },
            runnyNose: {
                type: GraphQLBoolean
            },
            vomiting: {
                type: GraphQLBoolean
            },
            diarrhea: {
                type: GraphQLBoolean
            }
        };
    },
});
