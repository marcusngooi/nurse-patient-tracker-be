import express, { json, urlencoded } from "express";
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { createHandler } from "graphql-http/lib/use/express";

import config from "./config.js";
import schema from "../graphql/index.js";

const app = express();

mongoose.connect(process.env.DB_URI);
const mongoDB = mongoose.connection;
mongoDB.on("error", console.error.bind(console, "Connection Error:"));
mongoDB.once("open", () => {
  console.log("Connected to MongoDB...");
});

app.use(morgan("dev"));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);
app.use(
  session({
    saveUninitialized: true,
    resave: false,
    secret: process.env.DB_SESSION_SECRET,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

app.use(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: global,
    context: (req, res) => {
      // Create cookie handler
      const setCookie = (res, name, value, options = {}) => {
        const defaultOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
          sameSite: "strict",
          path: "/",
        };
        const cookieOptions = { ...defaultOptions, ...options };
        let cookieString = `${name}=${value}`;
        if (cookieOptions.httpOnly) cookieString += "; HttpOnly";
        if (cookieOptions.secure) cookieString += "; Secure";
        if (cookieOptions.maxAge)
          cookieString += `; Max-Age=${cookieOptions.maxAge / 1000}`;
        if (cookieOptions.sameSite)
          cookieString += `; SameSite=${cookieOptions.sameSite}`;
        if (cookieOptions.path) cookieString += `; Path=${cookieOptions.path}`;

        // Ensure the headers property exists
        if (!res.headers) {
          res.headers = {};
        }

        // Add the Set-Cookie header
        if (!res.headers["Set-Cookie"]) {
          res.headers["Set-Cookie"] = [];
        }
        res.headers["Set-Cookie"].push(cookieString);
      };
      return {
        req,
        res,
        setCookie: (name, value, options) =>
          setCookie(res, name, value, options),
      };
    },
  })
);

export default app;
