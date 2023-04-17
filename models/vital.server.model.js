// Group Project
// Author(s):        Marcus Ngooi (301147411)
//                   Ikamjot Hundal (301134374)
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
