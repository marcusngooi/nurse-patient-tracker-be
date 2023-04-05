// Lab 3 Exercise 1
// Author:      Marcus Ngooi (301147411)
// Description: Controller for general queries.

const Student = require("../models/student.server.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const jwtExpirySeconds = 600;
const jwtKey = db.secretKey;

module.exports.login = async (req, res, next) => {
  const username = req.body.auth.username;
  const password = req.body.auth.password;

  const student = await Student.findOne({ studentNumber: username }).catch(
    (err) => {
      console.log(err);
      return next(err);
    }
  );

  if (bcrypt.compareSync(password, student.password)) {
    const token = jwt.sign(
      {
        id: student._id,
        username: student.studentNumber,
      },
      jwtKey,
      {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
      }
    );
    res.cookie("token", token, {
      maxAge: jwtExpirySeconds * 1000,
      httpOnly: true,
    });
    res
      .status(200)
      .send({ screen: student.studentNumber, userType: student.userType });
    // req.student = student;
    // next();
  } else {
    res.json({
      status: "error",
      message: "Invalid username/password!",
      data: null,
    });
  }
};

module.exports.logout = async (req, res, next) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully!" });
};

module.exports.isLoggedIn = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.send({ screen: "auth" }).end();
  }
  let payload;
  try {
    payload = jwt.verify(token, jwtKey);
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).end();
    }
    return res.status(400).end();
  }

  res.status(200).send({ screen: payload.studentNumber });
};

module.exports.addStudent = async (req, res) => {
  let student = req.body;
  const studentHashedPassword = await bcrypt.hash(student.password, 10);
  student.password = studentHashedPassword;

  const addStudentResult = await Student.collection
    .insertOne(student)
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Add student did not work!" });
    });
  res.status(200).json(addStudentResult);
};

module.exports.requiresLogin = (req, res, next) => {
  // Obtain the session token from the requests cookies,
  // which come with every request
  const token = req.cookies.token;
  // if the cookie is not set, return an unauthorized error
  if (!token) {
    return res.send({ screen: "auth" }).end();
  }
  var payload;
  try {
    // Parse the JWT string and store the result in `payload`.
    // Note that we are passing the key in this method as well. This method will throw an error
    // if the token is invalid (if it has expired according to the expiry time we set on sign in),
    // or if the signature does not match
    payload = jwt.verify(token, jwtKey);
    req.id = payload.id;
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      return res.status(401).end();
    }
    // otherwise, return a bad request error
    return res.status(400).end();
  }
  // user is authenticated
  //call next function in line
  next();
};
