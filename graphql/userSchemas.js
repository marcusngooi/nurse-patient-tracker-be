// Group Project
// Author:      Marcus Ngooi (301147411)
//              Ikamjot Hundal (301134374)
// Description: GraphQL user Schema for user-related queries.
const GraphQLObjectType = require("graphql").GraphQLObjectType;
const GraphQLList = require("graphql").GraphQLList;
const GraphQLNonNull = require("graphql").GraphQLNonNull;
const GraphQLString = require("graphql").GraphQLString;
const GraphQLID = require("graphql").GraphQLID;
const GraphQLInt = require("graphql").GraphQLInt;
const GraphQLBoolean = require("graphql").GraphQLBoolean;
const UserModel = require("../models/user.server.model");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_SECRET = "***REMOVED***";
const jwtExpirySeconds = 3000;

// Create a GraphQL Object Type for User model
const userType = new GraphQLObjectType({
  name: "user",
  fields: function () {
    return {
      _id: {
        type: GraphQLID,
      },
      userName: {
        type: GraphQLString,
      },
      password: {
        type: GraphQLString,
      },
      userType: {
        type: GraphQLString,
      },
    };
  },
});

const queryType = {
  // students: {
  //   type: GraphQLList(studentType),
  //   resolve: function () {
  //     const students = StudentModel.find().exec();
  //     if (!students) {
  //       throw new Error("Error");
  //     }
  //     return students;
  //   },
  // },
  // courseStudents: {
  //   type: GraphQLList(studentType),
  //   args: {
  //     id: {
  //       name: "id",
  //       type: GraphQLString,
  //     },
  //   },
  //   resolve: function (root, params) {
  //     const courseStudents = CourseModel.findById(params.id).students.exec();
  //     if (!courseStudents) {
  //       throw new Error("Error finding course students!");
  //     }
  //     return courseStudents;
  //   },
  // },

  isNurse: {
    type: GraphQLBoolean,
    resolve: async (root, params, context) => {
      const token = context.req.cookie.token;
      if (!token) {
        return false;
      }
      const decodedToken = jwt.decode(token);
      const userId = decodedToken.id;
      const user = await UserModel.findById(userId);
      return user.userType == "Nurse";
    },
  },

  isSignedIn: {
    type: GraphQLBoolean,
    resolve: function (root, params, context) {
      // Obtain the session token from the requests cookies,
      // which come with every request
      const token = context.req.cookies.token;
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
    type: userType,
    args: {
      userName: {
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
      userType: {
        type: new GraphQLNonNull(GraphQLString),
      },
      vitals: {
        type: GraphQLList(GraphQLString),
      },
    },
    resolve: async (root, params, context) => {
      const hashed = await bcrypt.hash(params.password, 10);

      const userModel = new UserModel({
        ...params,
        password: hashed,
      });

      const newUser = await userModel.save();
      if (!newUser) {
        throw new Error("Error");
      }

      const token = jwt.sign({ id: newUser._id }, JWT_SECRET);

      context.res.cookie("token", token, {
        maxAge: jwtExpirySeconds * 1000,
        httpOnly: true,
      });

      return newUser;
    },
  },

  signIn: {
    type: userType,
    args: {
      userName: {
        type: new GraphQLNonNull(GraphQLString),
      },
      password: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (root, params, context) => {
      const user = await UserModel.findOne({
        userName: params.userName,
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

  // updateUserCourse: {
  //   type: studentType,
  //   args: {
  //     email: {
  //       type: new GraphQLNonNull(GraphQLString),
  //     },
  //     course: {
  //       type: new GraphQLNonNull(GraphQLString),
  //     },
  //   },
  //   resolve: async (root, params) => {
  //     const user = await StudentModel.findOneAndUpdate(
  //       {
  //         email: params.email,
  //       },
  //       {
  //         $addToSet: { courses: params.course },
  //       }
  //     ).exec();

  //     if (!user) {
  //       throw new Error("Error");
  //     }

  //     return user;
  //   },
  // },

  // deleteUserCourse: {
  //   type: studentType,
  //   args: {
  //     email: {
  //       type: new GraphQLNonNull(GraphQLString),
  //     },
  //     course: {
  //       type: new GraphQLNonNull(GraphQLString),
  //     },
  //   },
  //   resolve: async (root, params) => {
  //     const user = await StudentModel.findOneAndUpdate(
  //       {
  //         email: params.email,
  //       },
  //       {
  //         $pull: { courses: params.course },
  //       }
  //     ).exec();

  //     if (!user) {
  //       throw new Error("Error");
  //     }

  //     return user;
  //   },
  // },
};

module.exports = {
  userQuery: queryType,
  userMutation: Mutation,
};
