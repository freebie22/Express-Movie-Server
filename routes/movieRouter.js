const express = require("express");
const multer = require("multer");
const authenticateJWT = require("../middleware/auth");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieById,
  getFilteredMovies,
  importMovies,
} = require("../controllers/movieController");

router.get("/:id", authenticateJWT, getMovieById);

router.get("/", authenticateJWT, getFilteredMovies);

router.post("/", authenticateJWT, createMovie);

router.patch("/:id", authenticateJWT, updateMovie);

router.delete("/:id", authenticateJWT, deleteMovie);

router.post(
  "/import",
  [authenticateJWT, upload.single("fileName")],
  importMovies
);

module.exports = router;
