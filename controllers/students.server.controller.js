// Lab 2 Exercise 1
// Author:      Marcus Ngooi (301147411)
// Description: Controllers for student-related queries.

const mongoose = require("mongoose");
const Student = require("../models/student.server.model");

module.exports.list = async (req, res) => {
  const students = await Student.find({ userType: "Student" }).catch((err) => {
    console.log(err);
    res.status(500).json({ message: "List all students did not work!" });
  });

  res.status(200).json(students);
};

module.exports.show = async (req, res) => {
  res.status(200).json(req.student);
};

module.exports.listStudentsByCourse = async (req, res) => {
  const course = req.course;

  const courseStudents = await Student.find({
    userType: "Student",
    courses: { _id: course._id },
  }).catch((err) => {
    console.log(err);
    res.status(500).json({ message: "Find students by course did not work!" });
  });

  res.status(200).json(courseStudents);
};

module.exports.studentById = async (req, res, next, id) => {
  const student = await Student.findById(mongoose.Types.ObjectId(id)).catch(
    (err) => {
      console.log(err);
      return next(err);
    }
  );

  req.student = student;
  next();
};
