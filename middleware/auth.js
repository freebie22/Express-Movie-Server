require("dotenv").config();
const jwt = require("jsonwebtoken");
const HttpError = require("../errors/httpError");
const { users } = require("../db/index");

const authenticateJWT = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
      throw new HttpError("User is not authorized.", 401);
    }

    const { user_id, email } = jwt.verify(token, process.env.SECRET_KEY);

    const verifiedUser = await users.findOne({
      where: { $and: [{ user_id: user_id }, { email: email }] },
    });

    if (!verifiedUser) {
      throw new HttpError("User wasn't verified.", 403);
    }

    req.user = { user_id: user_id, email: email };

    next();
  } catch (err) {
    return next(err);
  }
};

module.exports = authenticateJWT;
