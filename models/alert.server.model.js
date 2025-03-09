import { Schema, model } from "mongoose";

const Alert = Schema({
  message: {
    type: String,
    trim: true,
  },
  patient: {
    type: String,
    ref: "Patient",
  },
});

export default model("Alert", Alert);
