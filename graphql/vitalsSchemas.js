// Lab 3 Exercise 1
// Author:      Marcus Ngooi (301147411)
//              Ikamjot Hundal (301134374)
// Description: GraphQL Vital Schema for vitals-related queries.

const GraphQLObjectType = require("graphql").GraphQLObjectType;
const GraphQLList = require("graphql").GraphQLList;
const GraphQLNonNull = require("graphql").GraphQLNonNull;
const GraphQLString = require("graphql").GraphQLString;
const GraphQLID = require("graphql").GraphQLID;
const mongoose = require("mongoose");
const GraphQLInt = require('graphql').GraphQLInt;
const GraphQLFloat = require('graphql').GraphQLFloat;
const GraphQLDate = require('graphql-date');

const Vital = require("../models/vital.server.model");
const Patient = require("../models/user.server.model");

const jwt = require("jsonwebtoken");
const JWT_SECRET = "***REMOVED***";

// Create a GraphQL Object Type for vitals model
const vitalsType = new GraphQLObjectType({
  name: "vitals",
  fields: function () {
    return {
      _id: {
        type: GraphQLID,
      },    
      patient: {
        type: GraphQLString,
        ref: "Patient",
      },
      date: {
        type: GraphQLDate,
      },
      weight: {
        type: GraphQLFloat,
      },
      bodyTemperature: {
        type: GraphQLFloat,
      },
      heartRate: {
        type: GraphQLInt,
      },
      bloodPressure: {
        type: GraphQLInt,
      },
      respiratoryRate: {
        type: GraphQLFloat,
      },
    };
  },
});

const queryType = {
  vitals: {
    type: GraphQLList(vitalsType),
    resolve: function () {
      const vitals = Vital.find().exec();
      if (!vitals) {
        throw new Error("Error");
      }
      return vitals;
    },
  },

  patientVitals: {
    type: GraphQLList(vitalsType),
    args: {
      id: {
        name: "id",
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (root, params) => {
      const patient = await Patient.findById(params.id);
      const patientVitalIds = patient.vitals;
      if (!patientVitalIds || patientVitalIds.length === 0) {
        throw new Error("Error finding patient vitals IDs!");
      }
      const patientVitals = await Vital.find({
        _id: { $in: patientVitalIds },
      });
      if (!patientVitals || patientVitals.length === 0) {
        throw new Error("Potential Error: patientVitals empty!");
      }
      console.log(patientVitals);
      return patientVitals;
    },
  },
  /*
  vital: {
    type: vitalsType,
    args: {
      id: {
        name: "_id",
        type: GraphQLString,
      },
    },
    resolve: function (root, params) {
      const vitalsInfo = Vital.findById(params.id).exec();
      if (!vitalsInfo) {
        throw new Error("Error");
      }
      return vitalsInfo;
    },
  },
  */
};

const Mutation = {
  addVital: {
    type: vitalsType,
    args: {
      
      patient: {
        type: String,
        ref: "Patient",
      },
      date: {
        type: new GraphQLNonNull(GraphQLDate),
      },
      weight: {
        type: new GraphQLNonNull(GraphQLFloat),
      },
      bodyTemperature: {
        type: new GraphQLNonNull(GraphQLFloat),
      },
      heartRate: {
        type: new GraphQLNonNull(GraphQLInt),
      },
      bloodPressure: {
        type: new GraphQLNonNull(GraphQLInt),
      },
      respiratoryRate: {
        type: new GraphQLNonNull(GraphQLFloat),
      },
    },
    resolve: async (root, params, context) => {
      let vitals = await Vital.findOne({ vitalsCode: params.vitalsCode });
      if (!vitals) {
        const vitalsModel = new Vital(params);
        vitals = await vitalsModel
          .save()
          .then((vitalsDoc) => vitalsDoc.toObject());
        if (!vitals) {
          throw new Error("Error saving the vitals!");
        }
      }
      const token = context.req.cookies.token;
      if (!token) {
        console.log("No token!");
      }
      const decodedToken = jwt.verify(token, JWT_SECRET);

      await Patient.updateOne(
        { _id: decodedToken.id },
        {
          $push: {
            vitalss: vitals._id,
          },
        }
      );

      return vitals;
    },
  },
  updateVital: {
    type: vitalsType,
    args: {
      id: {
        name: '_id',
        type: GraphQLString
      },
      date: {
        type: new GraphQLNonNull(GraphQLDate),
      },
      weight: {
        type: new GraphQLNonNull(GraphQLFloat),
      },
      bodyTemperature: {
        type: new GraphQLNonNull(GraphQLFloat),
      },
      heartRate: {
        type: new GraphQLNonNull(GraphQLInt),
      },
      bloodPressure: {
        type: new GraphQLNonNull(GraphQLInt),
      },
      respiratoryRate: {
        type: new GraphQLNonNull(GraphQLFloat),
      },
    },
    resolve(root, params) {
      return Vital.findByIdAndUpdate(
        params.id,
        {date: params.date,
          weight: params.weight,
          bodyTemperature: params.bodyTemperature,
          heartRate: params.heartRate,
          respiratoryRate: params.respiratoryRate,
        },
        function (err) {
          if (err) return next(err);
        }
      );
    },
  },
  dropVital: {
    type: vitalsType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve(root, params) {
      const vitals = Vital.findById(params.id);
      if (!vitals) {
        throw new Error("Error finding vitals for deletion!");
      }
      const droppedVital = Vital.findByIdAndRemove(params.id).exec();
      if (!droppedVital) {
        throw new Error("Error");
      }
      return droppedVital;
    },
  },
};

module.exports = {
  vitalsQuery: queryType,
  vitalsMutation: Mutation,
};
