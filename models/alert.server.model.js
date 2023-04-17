// Group Project
// Author(s):       Marcus Ngooi (301147411)
//                  Ikamjot Hundal (301134374)
// Description:     Alert model.

const mongoose = require("mongoose");

const Alert = mongoose.Schema({
  message: {
    type: String,
    trim: true,
  },
  patient: {
    type: String,
    ref: "Patient"
  }
});
module.exports = mongoose.model("Alert", Alert);