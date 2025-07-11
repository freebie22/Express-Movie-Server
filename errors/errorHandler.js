const HttpError = require("./httpError");

module.exports = (errors) => {
  const { msg } = errors.array()[0];
  const err = new HttpError(msg, 400);
  return err;
};
