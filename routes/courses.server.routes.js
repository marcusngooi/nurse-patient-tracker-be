// Lab 3 Exercise 1
// Author:      Marcus Ngooi (301147411)
// Description: Routes for course-related queries.

const express = require("express");
const router = express.Router();

const coursesController = require("../controllers/courses.server.controller");
const studentsController = require("../controllers/students.server.controller");
const indexController = require("../controllers/index.server.controller");

router.get("/list", indexController.requiresLogin, coursesController.list);

router.get(
  "/show/:courseId",
  indexController.requiresLogin,
  coursesController.show
);

router.get(
  "/list/:studentId",
  indexController.requiresLogin,
  coursesController.listCoursesByStudent
);

router.post("/add", indexController.requiresLogin, coursesController.add);

router.put(
  "/update/:courseId",
  indexController.requiresLogin,
  coursesController.update
);

router.delete(
  "/drop/:courseId",
  indexController.requiresLogin,
  coursesController.drop
);

router.param("courseId", coursesController.courseById);

router.param("studentId", studentsController.studentById);

module.exports = router;
