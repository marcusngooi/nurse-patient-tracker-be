// Lab 3 Exercise 1
// Author:      Marcus Ngooi (301147411)
// Description: Routes for student-related queries.

const studentsController = require("../controllers/students.server.controller.js");
const coursesController = require("../controllers/courses.server.controller.js");
const indexController = require("../controllers/index.server.controller");

const express = require("express");
const router = express.Router();

router.get("/list", indexController.requiresLogin, studentsController.list);

router.get(
  "/show/:studentId",
  indexController.requiresLogin,
  studentsController.show
);

router.get(
  "/list/:courseId",
  indexController.requiresLogin,
  studentsController.listStudentsByCourse
);

router.param("courseId", coursesController.courseById);
router.param("studentId", studentsController.studentById);

module.exports = router;
