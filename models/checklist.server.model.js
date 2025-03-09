import { Schema, model } from "mongoose";

const Checklist = Schema({
  patientId: {
    type: String,
    ref: "Patient",
  },
  date: {
    type: Date,
  },
  fever: {
    type: Boolean,
  },
  cough: {
    type: Boolean,
  },
  fatigue: {
    type: Boolean,
  },
  breathing: {
    type: Boolean,
  },
  bodyAches: {
    type: Boolean,
  },
  headache: {
    type: Boolean,
  },
  smell: {
    type: Boolean,
  },
  sorethroat: {
    type: Boolean,
  },
  runnynose: {
    type: Boolean,
  },
  vomiting: {
    type: Boolean,
  },
  diarrhea: {
    type: Boolean,
  },
});

export default model("Checklist", Checklist);
