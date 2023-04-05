// Lab 3 Exercise 1
// Author:      Marcus Ngooi (301147411)
//              Ikamjot Hundal (301134374)
// Description: GraphQL Course Schema for course-related queries.

const GraphQLObjectType = require("graphql").GraphQLObjectType;
const GraphQLList = require("graphql").GraphQLList;
const GraphQLNonNull = require("graphql").GraphQLNonNull;
const GraphQLString = require("graphql").GraphQLString;
const GraphQLID = require("graphql").GraphQLID;
const mongoose = require("mongoose");

const Course = require("../models/course.server.model");
const Student = require("../models/student.server.model");

const jwt = require("jsonwebtoken");
const JWT_SECRET = "***REMOVED***";

// Create a GraphQL Object Type for course model
const courseType = new GraphQLObjectType({
  name: "course",
  fields: function () {
    return {
      _id: {
        type: GraphQLID,
      },
      courseCode: {
        type: GraphQLString,
      },
      courseName: {
        type: GraphQLString,
      },
      section: {
        type: GraphQLString,
      },
      semester: {
        type: GraphQLString,
      },
      students: {
        type: GraphQLList(GraphQLString),
      },
    };
  },
});

const queryType = {
  courses: {
    type: GraphQLList(courseType),
    resolve: function () {
      const courses = Course.find().exec();
      if (!courses) {
        throw new Error("Error");
      }
      return courses;
    },
  },
  studentCourses: {
    type: GraphQLList(courseType),
    args: {
      id: {
        name: "id",
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (root, params) => {
      const student = await Student.findById(params.id);
      const studentCourseIds = student.courses;
      if (!studentCourseIds || studentCourseIds.length === 0) {
        throw new Error("Error finding student course IDs!");
      }
      const studentCourses = await Course.find({
        _id: { $in: studentCourseIds },
      });
      if (!studentCourses || studentCourses.length === 0) {
        throw new Error("Potential Error: studentCourses empty!");
      }
      console.log(studentCourses);
      return studentCourses;
    },
  },
  course: {
    type: courseType,
    args: {
      id: {
        name: "_id",
        type: GraphQLString,
      },
    },
    resolve: function (root, params) {
      const courseInfo = Course.findById(params.id).exec();
      if (!courseInfo) {
        throw new Error("Error");
      }
      return courseInfo;
    },
  },
};

const Mutation = {
  addCourse: {
    type: courseType,
    args: {
      courseCode: {
        type: new GraphQLNonNull(GraphQLString),
      },
      courseName: {
        type: new GraphQLNonNull(GraphQLString),
      },
      section: {
        type: new GraphQLNonNull(GraphQLString),
      },
      semester: {
        type: new GraphQLNonNull(GraphQLString),
      },
      students: {
        type: GraphQLList(GraphQLString),
      },
    },
    resolve: async (root, params, context) => {
      let course = await Course.findOne({ courseCode: params.courseCode });
      if (!course) {
        const courseModel = new Course(params);
        course = await courseModel
          .save()
          .then((courseDoc) => courseDoc.toObject());
        if (!course) {
          throw new Error("Error saving the course!");
        }
      }
      const token = context.req.cookies.token;
      if (!token) {
        console.log("No token!");
      }
      const decodedToken = jwt.verify(token, JWT_SECRET);

      await Student.updateOne(
        { _id: decodedToken.id },
        {
          $push: {
            courses: course._id,
          },
        }
      );

      return course;
    },
  },
  updateCourse: {
    type: courseType,
    args: {
      id: {
        name: "id",
        type: new GraphQLNonNull(GraphQLString),
      },
      courseCode: {
        type: new GraphQLNonNull(GraphQLString),
      },
      courseName: {
        type: new GraphQLNonNull(GraphQLString),
      },
      section: {
        type: new GraphQLNonNull(GraphQLString),
      },
      semester: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve(root, params) {
      return Course.findByIdAndUpdate(
        params.id,
        {
          courseCode: params.courseCode,
          courseName: params.courseName,
          section: params.section,
          semester: params.semester,
        },
        function (err) {
          if (err) return next(err);
        }
      );
    },
  },
  dropCourse: {
    type: courseType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve(root, params) {
      const course = Course.findById(params.id);
      if (!course) {
        throw new Error("Error finding course for deletion!");
      }
      const droppedCourse = Course.findByIdAndRemove(params.id).exec();
      if (!droppedCourse) {
        throw new Error("Error");
      }
      return droppedCourse;
    },
  },
};

module.exports = {
  courseQuery: queryType,
  courseMutation: Mutation,
};
