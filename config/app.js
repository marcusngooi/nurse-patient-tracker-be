import express, { json, urlencoded } from "express";

import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import { connect, connection } from "mongoose";

import { URI, sessionSecret } from "./db";

connect(URI);
const mongoDB = connection;
mongoDB.on("error", console.error.bind(console, "Connection Error:"));
mongoDB.once("open", () => {
  console.log("Connected to MongoDB...");
});

const app = express();

app.use(morgan("dev"));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(
  session({
    saveUninitialized: true,
    resave: true,
    secret: sessionSecret,
  })
);

export default app;
