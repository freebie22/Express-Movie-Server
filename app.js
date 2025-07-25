require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const sessionRouter = require("./routes/sessionRouter");
const moviesRouter = require("./routes/movieRouter");
const HttpError = require("./errors/httpError");

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use("/api/v1/users", userRouter);

app.use("/api/v1/sessions", sessionRouter);

app.use("/api/v1/movies", moviesRouter);

app.use(() => {
  throw new HttpError("Any endpoints were found by your request");
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error?.errorCode || 500).json({
    status: false,
    errorMessage: error.message || "An unknown error accured",
  });
});

app.listen(process.env.APP_PORT || 8050, () => {
  console.log(`App is listening on port ${process.env.APP_PORT}`);
});
