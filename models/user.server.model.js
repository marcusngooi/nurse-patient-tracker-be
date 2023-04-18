// Group Project
// Author(s):       Marcus Ngooi (301147411)
//                  Ikamjot Hundal (301134374)
// Description:     Nurse model.

const mongoose = require("mongoose");

const User = mongoose.Schema({
  userName: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  userType: {
    type: String,
    tim: true,
  },
  vitals: [
    {
      type: [String],
      ref: "vital",
      default: [],
    },
  ],
  checklist: [
    {
      type: [String],
      ref: "checklist",
      default: [],
    },
  ],
});

// // Configure the 'Student' to use getters and virtuals when transforming to JSON
// Student.set("toJSON", {
//   getters: true,
//   virtuals: true,
// });

module.exports = mongoose.model("User", User);
