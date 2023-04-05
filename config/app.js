// Lab 2 Exercise 1
// Author:      Marcus Ngooi (301147411)
// Description: Configure Express application.

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const session = require("express-session");
const cookieParser = require("cookie-parser");

// Database
const db = require("./db");
const mongoose = require("mongoose");

mongoose.connect(db.URI);
const mongoDB = mongoose.connection;
mongoDB.on("error", console.error.bind(console, "Connection Error:"));
mongoDB.once("open", () => {
  console.log("Connected to MongoDB...");
});

const indexRouter = require("../routes/index.server.routes");
const coursesRouter = require("../routes/courses.server.routes");
const studentsRouter = require("../routes/students.server.routes");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
    secret: db.sessionSecret,
  })
);

app.use("/api", indexRouter);
app.use("/api/students", studentsRouter);
app.use("/api/courses", coursesRouter);

module.exports = app;
