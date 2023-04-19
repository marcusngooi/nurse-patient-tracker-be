// COMP308-402 Group Project-Group-4
// Authors:     Marcus Ngooi (301147411)
//              Ikamjot Hundal (301134374)
//              Ben Coombes (301136902)
//              Grant Macmillan (301129935)
//              Gabriel Dias Tinoco
//              Tatsiana Ptushko (301182173)
// Description: GraphQL Vital Schema for vitals-related queries.

const GraphQLObjectType = require("graphql").GraphQLObjectType;
const GraphQLList = require("graphql").GraphQLList;
const GraphQLNonNull = require("graphql").GraphQLNonNull;
const GraphQLString = require("graphql").GraphQLString;
const GraphQLID = require("graphql").GraphQLID;
const mongoose = require("mongoose");
const GraphQLInt = require("graphql").GraphQLInt;
const GraphQLFloat = require("graphql").GraphQLFloat;
const GraphQLDate = require("graphql-date");

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
        // ref: "Patient",
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

  patientVitalsAsNurse: {
    type: GraphQLList(vitalsType),
    args: {
      id: {
        name: "id",
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (root, params) => {
      console.log(1);
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
};

const Mutation = {
  addVitalAsPatient: {
    type: vitalsType,
    args: {
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
      const token = context.req.cookies.token;
      let userId;
      if (token) {
        const decodedToken = jwt.decode(token);
        userId = decodedToken.id;
      } else {
        userId = params._id;
      }

      const vitals = new Vital({
        patient: userId,
        date: new Date(),
        ...params,
      });

      const savedVitals = await vitals.save();

      console.log(savedVitals);

      const user = await Patient.findById(userId);

      console.log(user);

      await Patient.updateOne(
        { _id: userId },
        {
          $push: {
            vitals: savedVitals._id,
          },
        }
      );

      return savedVitals;
    },
  },
  addVitalAsNurse: {
    type: vitalsType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
        name: "id",
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
      const patientId = params.id;
      const vitals = new Vital({
        patient: patientId,
        date: new Date(),
        weight: params.weight,
        bodyTemperature: params.bodyTemperature,
        heartRate: params.heartRate,
        bloodPressure: params.bloodPressure,
        respiratoryRate: params.respiratoryRate,
      });

      const savedVitals = await vitals.save();

      console.log(savedVitals);

      const user = await Patient.findById(patientId);

      console.log(user);

      await Patient.updateOne(
        { _id: patientId },
        {
          $push: {
            vitals: savedVitals._id,
          },
        }
      );

      return savedVitals;
    },
  },
  updateVital: {
    type: vitalsType,
    args: {
      id: {
        name: "_id",
        type: GraphQLString,
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
        {
          date: params.date,
          weight: params.weight,
          bodyTemperature: params.bodyTemperature,
          heartRate: params.heartRate,
          bloodPressure: params.bloodPressure,
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
