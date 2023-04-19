// COMP308-402 Group Project-Group-4
// Authors:     Marcus Ngooi (301147411)
//              Ikamjot Hundal (301134374)
//              Ben Coombes (301136902)
//              Grant Macmillan (301129935)
//              Gabriel Dias Tinoco
//              Tatsiana Ptushko (301182173)
// Description: AI Schema.

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