const express = require("express");
const multer = require("multer");
const { body } = require("express-validator");
const authenticateJWT = require("../middleware/auth");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const isValid = file.mimetype === "text/plain";
    let error = isValid
      ? null
      : new HttpError("Only txt files are supported.", 415);
    cb(error, isValid);
  },
});

const {
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieById,
  getFilteredMovies,
  importMovies,
} = require("../controllers/movieController");
const HttpError = require("../errors/httpError");

router.get("/:id", authenticateJWT, getMovieById);

router.get("/", authenticateJWT, getFilteredMovies);

router.post(
  "/",
  [
    authenticateJWT,
    body("year")
      .isInt({ min: 1850, max: new Date().getFullYear() })
      .withMessage(
        `Release year of movie should be from 1850 to ${new Date().getFullYear()}`
      ),
    body("title").notEmpty("title").withMessage("Title cannot be empty"),
  ],
  createMovie
);

router.patch("/:id", authenticateJWT, updateMovie);

router.delete("/:id", authenticateJWT, deleteMovie);

router.post(
  "/import",
  [authenticateJWT, upload.single("fileName")],
  importMovies
);

module.exports = router;
