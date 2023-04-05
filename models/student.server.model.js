// Lab 3 Exercise 1
// Author:      Marcus Ngooi (301147411)
// Description: Student model.

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const Student = mongoose.Schema({
  studentNumber: {
    type: String,
  },
  password: {
    type: String,
    // validate: [
    //   (password) => password && password.length > 6,
    //   "Password should be longer",
    // ],
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
    // match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  program: {
    type: String,
  },
  courses: [
    {
      type: [String],
      ref: "Course",
      default: [],
    },
  ],
});

// // Use a pre-save middleware to hash the password
// // before saving it into database
// Student.pre("save", (next) => {
//   //hash the password before saving it
//   this.password = bcrypt.hashSync(this.password, saltRounds);
//   next();
// });

// // Create an instance method for authenticating user
// Student.methods.authenticate = (password) => {
//   //compare the hashed password of the database
//   //with the hashed version of the password the user enters
//   return this.password === bcrypt.hashSync(password, saltRounds);
// };

// Configure the 'Student' to use getters and virtuals when transforming to JSON
Student.set("toJSON", {
  getters: true,
  virtuals: true,
});

module.exports = mongoose.model("Student", Student);
