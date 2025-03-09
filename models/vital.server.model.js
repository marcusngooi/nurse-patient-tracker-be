import { Schema, model } from "mongoose";

const Vital = Schema({
  patient: {
    type: String,
    ref: "Patient",
  },
  date: {
    type: Date,
  },
  weight: {
    type: Number,
  },
  bodyTemperature: {
    type: Number,
  },
  heartRate: {
    type: Number,
  },
  bloodPressure: {
    type: Number,
  },
  respiratoryRate: {
    type: Number,
  },
});

export default model("Vital", Vital);
