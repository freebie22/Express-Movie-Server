const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const HttpError = require("../errors/httpError");
const { createUser } = require("../controllers/userController");

router.post(
  "/",
  [
    body("email")
      .notEmpty()
      .withMessage("Email field cannot be empty.")

      .isEmail()
      .withMessage("Your email is not in correct format"),
    body("name").notEmpty().withMessage("Name field seems to be empty."),
    body("password").notEmpty().withMessage("Password field cannot be empty."),
    body("confirmPassword")
      .notEmpty()
      .withMessage("Please, confirm your password")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new HttpError("Passwords don't match", 400);
        }

        return true;
      }),
  ],
  createUser
);

module.exports = router;
