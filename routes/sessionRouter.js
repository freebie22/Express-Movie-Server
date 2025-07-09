const express = require("express");
const router = express.Router();

const { createSession } = require("../controllers/userController");

router.post("/", createSession);

module.exports = router;
