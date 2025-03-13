import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
} from "graphql";
import GraphQLDate from "graphql-date";
import JWT from "jsonwebtoken";

import Vital from "../models/vital.server.model.js";
import User from "../models/user.server.model.js";

const vitalsType = new GraphQLObjectType({
  name: "vitals",
  fields: () => {
    return {
      _id: {
        type: GraphQLID,
      },
      patient: {
        type: GraphQLString,
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
    type: new GraphQLList(vitalsType),
    resolve: () => {
      const vitals = Vital.find().exec();
      if (!vitals) {
        throw new Error("Error");
      }
      return vitals;
    },
  },

  patientVitalsAsNurse: {
    type: new GraphQLList(vitalsType),
    args: {
      id: {
        name: "id",
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (params) => {
      const patient = await User.findById(params.id);
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
    resolve: async (params, context) => {
      const token = context.req.cookies.token;
      let userId;
      if (token) {
        const decodedToken = JWT.decode(token);
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

      await User.updateOne(
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
    resolve: async (params) => {
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

      await User.updateOne(
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
    resolve(params) {
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
        (err) => {
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
    resolve(params) {
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

export const vitalsQuery = queryType;
export const vitalsMutation = Mutation;
