import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
} from "graphql";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../models/user.server.model.js";

const userType = new GraphQLObjectType({
  name: "user",
  fields: () => {
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
      firstName: {
        type: GraphQLString,
      },
      lastName: {
        type: GraphQLString,
      },
      userType: {
        type: GraphQLString,
      },
      vitals: {
        type: new GraphQLList(GraphQLString),
      },
      checklists: {
        type: new GraphQLList(GraphQLString),
      },
    };
  },
});

const queryType = {
  users: {
    type: new GraphQLList(userType),
    resolve: () => {
      const users = UserModel.find().exec();
      if (!users) {
        throw new Error("Error");
      }
      return users;
    },
  },

  user: {
    type: userType,
    args: {
      id: {
        name: "_id",
        type: GraphQLString,
      },
    },
    resolve: (params) => {
      const userInfo = UserModel.findById(params.id).exec();
      if (!userInfo) {
        throw new Error("Error");
      }
      return userInfo;
    },
  },

  patients: {
    type: new GraphQLList(userType),
    resolve: () => {
      const patients = UserModel.find({ userType: "patient" }).exec();
      if (![patients]) {
        throw new Error("Error");
      }
      return patients;
    },
  },

  isNurse: {
    type: GraphQLBoolean,
    resolve: async (_, __, context) => {
      const token = context.req.cookie.token;
      if (!token) {
        console.log("User is not a nurse.");
        return false;
      }
      try {
        const decodedToken = JWT.decode(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;
        const user = await UserModel.findById(userId);
        return user.userType === "nurse";
      } catch (err) {
        console.error("Error verifying token or fetching user:", e);
        return false;
      }
    },
  },

  isSignedIn: {
    type: GraphQLBoolean,
    resolve: (_, __, context) => {
      const token = context.req.cookies.token;
      console.log(token);
      if (!token) {
        return false;
      }
      try {
        JWT.verify(token, process.env.JWT_SECRET);
        return true;
      } catch (err) {
        console.error("Token verification failed:", e);
        return false;
      }
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
        type: new GraphQLList(GraphQLString),
      },
      checklists: {
        type: new GraphQLList(GraphQLString),
      },
    },
    resolve: async (_, args, context) => {
      const salt = await bcrypt.genSalt(10);
      if (!args.password) {
        throw new Error("Missing required user password.");
      }
      const hashed = await bcrypt.hash(args.password, salt);
      if (!hashed) {
        throw new Error("Failed to hash password.");
      }
      const userModel = new UserModel({
        ...args,
        password: hashed,
      });
      const newUser = await userModel.save();
      if (!newUser) {
        throw new Error("Failed to save new user.");
      }
      const token = JWT.sign({ id: newUser._id }, process.env.JWT_SECRET);
      context.setCookie("token", token, {
        maxAge: process.env.JWT_EXPIRY_SECONDS * 1000,
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
    resolve: async (_, args, context) => {
      const user = await UserModel.findOne({
        userName: args.userName,
      });
      if (!user) {
        throw new Error("The user you entered does not exist.");
      }

      const valid = await bcrypt.compare(args.password, user.password);

      if (!valid) {
        throw new Error("The password you entered is incorrect.");
      }

      const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET);

      context.setCookie("token", token, {
        maxAge: process.env.JWT_EXPIRY_SECONDS * 1000,
      });

      return user;
    },
  },
  signOut: {
    type: GraphQLBoolean,
    resolve: async (_, __, context) => {
      context.setCookie("token", "", { maxAge: 0 });
      return true;
    },
  },
};

export const userQuery = queryType;
export const userMutation = Mutation;
