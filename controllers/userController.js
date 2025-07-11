const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { users } = require("../db/index");
const HttpError = require("../errors/httpError");
const ErrorHandler = require("../errors/errorHandler");

const createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(ErrorHandler(errors));
    }

    const { email, name, password } = req.body;

    const encryptedPassword = await bcrypt.hash(password, 12);

    const User = await users.create({
      user_id: uuid(),
      email,
      name,
      password: encryptedPassword,
    });

    if (!User) {
      return next(
        new HttpError("An error occured while creating new user", 500)
      );
    }

    res
      .status(201)
      .json({ status: true, message: "User Was created succesfully" });
  } catch (error) {
    next(error);
  }
};

const createSession = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await users.findOne({ where: { email: email } });

    if (!user) {
      return next(
        new HttpError("No users were found by this email. Please, try again"),
        404
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return next(
        new HttpError("Password is not correct. Please, try again"),
        403
      );
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ status: true, token: token });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createUser, createSession };
