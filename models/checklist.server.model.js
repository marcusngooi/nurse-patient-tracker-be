// COMP308-402 Group Project-Group-4
// Authors:     Marcus Ngooi (301147411)
//              Ikamjot Hundal (301134374)
//              Ben Coombes (301136902)
//              Grant Macmillan (301129935)
//              Gabriel Dias Tinoco
//              Tatsiana Ptushko (301182173)
// Description: Checklist Model

const mongoose = require("mongoose");

const Checklist = mongoose.Schema({
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
module.exports = mongoose.model("Checklist", Checklist);
