// Lab 3 Exercise 1
// Author:      Marcus Ngooi (301147411)
// Description: Course model.

const mongoose = require("mongoose");

const Course = mongoose.Schema({
  courseCode: {
    type: String,
    trim: true,
  },
  courseName: {
    type: String,
    trim: true,
  },
  section: {
    type: String,
  },
  semester: {
    type: String,
  },
  students: [
    {
      type: [String],
      ref: "Student",
      default: [],
    },
  ],
});
module.exports = mongoose.model("Course", Course);
