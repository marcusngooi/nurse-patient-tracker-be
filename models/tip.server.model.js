// Group Project
// Author(s):       Marcus Ngooi (301147411)
//                  Ikamjot Hundal (301134374)
// Description:     Tip model.

const mongoose = require("mongoose");

const Tip = mongoose.Schema({
  message: {
    type: String,
    trim: true,
  },
});
module.exports = mongoose.model("Tip", Tip);
