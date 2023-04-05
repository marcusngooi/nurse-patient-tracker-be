// Lab 2 Exercise 1
// Author:      Marcus Ngooi (301147411)
// Description: Controllers for course-related queries.

const mongoose = require("mongoose");
const Course = require("../models/course.server.model");
const Student = require("../models/student.server.model");

module.exports.list = async (req, res) => {
  const courses = await Course.find().catch((err) => {
    console.log(err);
    res.status(500).json({ message: "List all courses did not work!" });
  });

  res.status(200).json(courses);
};

module.exports.show = async (req, res) => {
  res.status(200).json(req.course);
};

module.exports.add = async (req, res) => {
  const course = Course();
  const course_id = mongoose.Types.ObjectId();
  course._id = course_id;
  course.courseCode = req.body.courseCode;
  course.courseName = req.body.courseName;
  course.section = req.body.section;
  course.semester = req.body.semester;

  const studentNumber = JSON.parse(
    Buffer.from(req.cookies.token.split(".")[1], "base64").toString()
  ).username;

  // The course collection should not have duplicates.
  const courseInsertionResult = await Course.collection
    .insertOne(course)
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Course insert did not work!" });
    });

  const student = await Student.findOne({
    studentNumber: studentNumber,
  });

  // Update the students list of courses.
  const studentUpdateResult = await Student.updateOne(
    {
      _id: student._id,
    },
    { courses: [...student.courses, course] }
  ).catch((err) => {
    console.log(err);
    res.status(500).json({ message: "Student update did not work!" });
  });

  res.status(200).json({ studentUpdateResult, courseInsertionResult, course });
};

module.exports.listCoursesByStudent = async (req, res) => {
  const student = req.student;

  const studentCourses = await Course.find({
    _id: [...student.courses],
  }).catch((err) => {
    console.log(err);
    res.status(500).json({ message: "Find courses did not work!" });
  });

  res.status(200).json(studentCourses);
};

module.exports.update = async (req, res) => {
  const course = req.course;
  course.courseCode = req.body.courseCode;
  course.courseName = req.body.courseName;
  course.section = req.body.section;
  course.semester = req.body.semester;

  const courseUpdateResult = await Course.updateOne(
    { _id: course._id },
    {
      courseCode: course.courseCode,
      courseName: course.courseName,
      section: course.section,
      semester: course.semester,
    }
  ).catch((err) => {
    console.log(err);
    res.json(500).json({ message: "Course update did not work!" });
  });

  res.status(200).json({ courseUpdateResult, course });
};

module.exports.drop = async (req, res) => {
  const course = req.course;
  const course_id = course._id;

  const courseDeletionResult = await Course.deleteOne({ _id: course_id }).catch(
    (err) => {
      console.log(err);
      res.status(500).json({ message: "Course deletion did not work!" });
    }
  );

  const studentNumber = JSON.parse(
    Buffer.from(req.cookies.token.split(".")[1], "base64").toString()
  ).username;

  const student = await Student.findOne({
    studentNumber: studentNumber,
  });

  const studentRemoveCourseResult = await Student.updateOne(
    { _id: student._id },
    { $pull: { courses: { course_id } } }
  ).catch((err) => {
    console.log(err);
    res.status(500).json({ message: "Student remove course did not work!" });
  });

  res.status(200).json({ courseDeletionResult, studentRemoveCourseResult });
};

module.exports.courseById = async (req, res, next, id) => {
  const course = await Course.findById(mongoose.Types.ObjectId(id)).catch(
    (err) => {
      console.log(err);
      return next(err);
    }
  );
  req.course = course;
  next();
};
