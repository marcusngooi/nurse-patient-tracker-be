// Lab 3 Exercise 1
// Author:      Marcus Ngooi (301147411)
// Description: General routes (e.g., login, logout).

const express = require("express");
const router = express.Router();

const indexController = require("../controllers/index.server.controller");

router.post("/login", indexController.login);

router.post("/logout", indexController.logout);

router.get("/read/cookie", indexController.isLoggedIn);

router.post("/add/student", indexController.addStudent);

module.exports = router;
