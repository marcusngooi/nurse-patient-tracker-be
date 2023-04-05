// Lab 3 Exercise 1
// Author:      Marcus Ngooi (301147411)
//              Ikamjot Hundal (301134374)
// Description: GraphQL Course Schema for student-related queries.
const GraphQLObjectType = require("graphql").GraphQLObjectType;
const GraphQLList = require("graphql").GraphQLList;
const GraphQLNonNull = require("graphql").GraphQLNonNull;
const GraphQLString = require("graphql").GraphQLString;
const GraphQLID = require("graphql").GraphQLID;
const GraphQLInt = require("graphql").GraphQLInt;
const GraphQLBoolean = require("graphql").GraphQLBoolean;
const StudentModel = require("../models/student.server.model");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_SECRET = "***REMOVED***";
const jwtExpirySeconds = 3000;

// Create a GraphQL Object Type for Student model
const studentType = new GraphQLObjectType({
  name: "student",
  fields: function () {
    return {
      _id: {
        type: GraphQLID,
      },
      studentNumber: {
        type: GraphQLString,
      },
      password: {
        type: GraphQLString,
      },
      firstName: {
        type: GraphQLString,
      },
      lastName: {
        type: GraphQLString,
      },
      address: {
        type: GraphQLString,
      },
      city: {
        type: GraphQLString,
      },
      phoneNumber: {
        type: GraphQLString,
      },
      email: {
        type: GraphQLString,
      },
      program: {
        type: GraphQLString,
      },
      courses: {
        type: GraphQLList(GraphQLString),
      },
      token: {
        type: GraphQLString,
      },
    };
  },
});

const queryType = {
  students: {
    type: GraphQLList(studentType),
    resolve: function () {
      const students = StudentModel.find().exec();
      if (!students) {
        throw new Error("Error");
      }
      return students;
    },
  },
  courseStudents: {
    type: GraphQLList(studentType),
    args: {
      id: {
        name: "id",
        type: GraphQLString,
      },
    },
    resolve: function (root, params) {
      const courseStudents = CourseModel.findById(params.id).students.exec();
      if (!courseStudents) {
        throw new Error("Error finding course students!");
      }
      return courseStudents;
    },
  },

  isSignedIn: {
    type: GraphQLBoolean,
    resolve: function (root, params, context) {
      // Obtain the session token from the requests cookies,
      // which come with every request
      const token = context.req.cookies.token;
      // if the cookie is not set, return 'auth'
      if (!token) {
        return false;
      }
      try {
        // Parse the JWT string and store the result in `payload`.
        // Note that we are passing the key in this method as well. This method will throw an error
        // if the token is invalid (if it has expired according to the expiry time we set on sign in),
        // or if the signature does not match
        jwt.verify(token, JWT_SECRET);
      } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
          // the JWT is unauthorized, return a 401 error
          return context.res.status(401).end();
        }
        // otherwise, return a bad request error
        return context.res.status(400).end();
      }
      // Finally, token is ok, return the username given in the token
      return true;
    },
  },
};

const Mutation = {
  signUp: {
    type: studentType,
    args: {
      studentNumber: {
        type: new GraphQLNonNull(GraphQLString),
      },
      email: {
        type: new GraphQLNonNull(GraphQLString),
      },
      password: {
        type: new GraphQLNonNull(GraphQLString),
      },
      firstName: {
        type: new GraphQLNonNull(GraphQLString),
      },
      lastName: {
        type: new GraphQLNonNull(GraphQLString),
      },
      address: {
        type: new GraphQLNonNull(GraphQLString),
      },
      city: {
        type: new GraphQLNonNull(GraphQLString),
      },
      phoneNumber: {
        type: new GraphQLNonNull(GraphQLString),
      },
      program: {
        type: new GraphQLNonNull(GraphQLString),
      },
      courses: {
        type: GraphQLList(GraphQLString),
      },
    },
    resolve: async (root, params, context) => {
      const hashed = await bcrypt.hash(params.password, 10);

      const studentModel = new StudentModel({
        ...params,
        password: hashed,
      });

      const newStudent = await studentModel.save();
      if (!newStudent) {
        throw new Error("Error");
      }

      const token = jwt.sign({ id: newStudent._id }, JWT_SECRET);

      context.res.cookie("token", token, {
        maxAge: jwtExpirySeconds * 1000,
        httpOnly: true,
      });

      return newStudent;
    },
  },

  signIn: {
    type: studentType,
    args: {
      email: {
        type: new GraphQLNonNull(GraphQLString),
      },
      password: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (root, params, context) => {
      const user = await StudentModel.findOne({
        email: params.email,
      }).exec();
      if (!user) {
        throw new Error("Error");
      }

      const valid = await bcrypt.compare(params.password, user.password);

      if (!valid) {
        throw new Error("Error signing in");
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET);

      console.log(token);

      context.res.cookie("token", token, {
        maxAge: jwtExpirySeconds * 1000,
        httpOnly: true,
      });

      // return user.email;
      return user; // use when testing in GraphiQL
    },
  },

  updateUserCourse: {
    type: studentType,
    args: {
      email: {
        type: new GraphQLNonNull(GraphQLString),
      },
      course: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (root, params) => {
      const user = await StudentModel.findOneAndUpdate(
        {
          email: params.email,
        },
        {
          $addToSet: { courses: params.course },
        }
      ).exec();

      if (!user) {
        throw new Error("Error");
      }

      return user;
    },
  },

  deleteUserCourse: {
    type: studentType,
    args: {
      email: {
        type: new GraphQLNonNull(GraphQLString),
      },
      course: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (root, params) => {
      const user = await StudentModel.findOneAndUpdate(
        {
          email: params.email,
        },
        {
          $pull: { courses: params.course },
        }
      ).exec();

      if (!user) {
        throw new Error("Error");
      }

      return user;
    },
  },
};

module.exports = {
  studentQuery: queryType,
  studentMutation: Mutation,
};
