// COMP308-402 Group Project-Group-4
// Authors:     Marcus Ngooi (301147411)
//              Ikamjot Hundal (301134374)
//              Ben Coombes (301136902)
//              Grant Macmillan (301129935)
//              Gabriel Dias Tinoco
//              Tatsiana Ptushko (301182173)

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

module.exports = app;
