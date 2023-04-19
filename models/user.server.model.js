// COMP308-402 Group Project-Group-4
// Authors:     Marcus Ngooi (301147411)
//              Ikamjot Hundal (301134374)
//              Ben Coombes (301136902)
//              Grant Macmillan (301129935)
//              Gabriel Dias Tinoco
//              Tatsiana Ptushko (301182173)
// Description:     User model.

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
