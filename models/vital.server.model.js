// COMP308-402 Group Project-Group-4
// Authors:     Marcus Ngooi (301147411)
//              Ikamjot Hundal (301134374)
//              Ben Coombes (301136902)
//              Grant Macmillan (301129935)
//              Gabriel Dias Tinoco
//              Tatsiana Ptushko (301182173)
// Description:     Vitals model.

const mongoose = require("mongoose");

const Vital = mongoose.Schema({
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
module.exports = mongoose.model("Vital", Vital);
