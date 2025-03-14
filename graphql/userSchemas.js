import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
} from "graphql";
import JWT from "jsonwebtoken";
import * as bcrypt from "bcrypt";

import UserModel from "../models/user.server.model.js";

const JWT_SECRET = process.env.JWT_SECRET;
const jwtExpirySeconds = process.env.JWT_EXPIRY_SECONDS;

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
    resolve: async (context) => {
      const token = context.req.cookie.token;
      if (!token) {
        return false;
      }
      const decodedToken = JWT.decode(token);
      const userId = decodedToken.id;
      const user = await UserModel.findById(userId);
      return user.userType == "nurse";
    },
  },

  isSignedIn: {
    type: GraphQLBoolean,
    resolve: (context) => {
      const token = context.req.cookies.token;
      console.log(token);
      if (!token) {
        console.log("this");
        return false;
      }
      try {
        JWT.verify(token, JWT_SECRET);
      } catch (e) {
        if (e instanceof JsonWebTokenError) {
          return context.res.status(401).end();
        }
        return context.res.status(400).end();
      }
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
        type: new GraphQLList(GraphQLString),
      },
      checklists: {
        type: new GraphQLList(GraphQLString),
      },
    },
    resolve: async (params, context) => {
      const hashed = await bcrypt.hash(params.password, 10);

      const userModel = new UserModel({
        ...params,
        password: hashed,
      });

      const newUser = await userModel.save();
      if (!newUser) {
        throw new Error("Error");
      }

      const token = JWT.sign({ id: newUser._id }, JWT_SECRET);

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
    resolve: async (params, context) => {
      const user = await UserModel.findOne({
        userName: params.userName,
      });
      if (!user) {
        throw new Error("Error");
      }

      const valid = await bcrypt.compare(params.password, user.password);

      if (!valid) {
        throw new Error("Error signing in");
      }

      const token = JWT.sign({ id: user._id }, JWT_SECRET);

      await context.res.cookie("token", token, {
        maxAge: jwtExpirySeconds * 1000,
        httpOnly: true,
      });

      return user;
    },
  },
  signOut: {
    type: GraphQLBoolean,
    resolve: async (context) => {
      context.res.clearCookie("token");
      return true;
    },
  },
};

export const userQuery = queryType;
export const userMutation = Mutation;
