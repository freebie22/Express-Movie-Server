const { validationResult } = require("express-validator");
const { movies, sequelize } = require("../db/index");
const HttpError = require("../errors/httpError");
const errorHandler = require("../errors/errorHandler");

const createMovie = async (req, res, next) => {
  try {
    const { title, year, format, actors } = req.body;

    const movie = await movies.create({
      title,
      year,
      format,
      actors,
    });

    if (!movie) {
      throw new HttpError("An occured while adding new movie", 400);
    }

    res.status(201).json({ status: true, movie: movie });
  } catch (err) {
    return next(err);
  }
};

const updateMovie = async (req, res, next) => {
  try {
    const { title, year, format, actors } = req.body;
    const id = req.params.id;

    const updateBody = {
      ...(title && { title: title }),
      ...(year && { year: year }),
      ...(format && { format: format }),
      ...(actors && { actors: actors }),
    };

    const updatedMovieCount = await movies.update(updateBody, {
      where: { id: id },
    });

    if (updatedMovieCount === 0) {
      throw new HttpError("An occured while updating movie", 400);
    }

    res
      .status(200)
      .json({ status: true, message: "Movie has been successfully updated" });
  } catch (err) {
    return next(err);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const id = req.params.id;

    await movies.destroy({ where: { id: id } });

    res
      .status(200)
      .json({ status: true, message: "Movie has been deleted successfully" });
  } catch (err) {
    return next(err);
  }
};

const getMovieById = async (req, res, next) => {
  try {
    const movieList = await movies.findOne({
      where: { id: req.params.id },
    });

    if (Object.values(movieList)?.length === 0) {
      throw new HttpError("No movies were found by your request", 400);
    }

    return res.status(200).json({ status: true, data: movieList });
  } catch (err) {
    return next(err);
  }
};

const getFilteredMovies = async (req, res, next) => {
  try {
    const {
      actor,
      title,
      search,
      sort = "id",
      order = "ASC",
      limit = 20,
      offset = 0,
    } = req.query;

    const searchFilter = {
      ...(actor && { actors: sequelize.literal(`actors LIKE '%${actor}%'`) }),
      ...(title && { title: title }),
      ...(search && {
        $or: [
          { title: search },
          { actors: sequelize.literal(`actors LIKE '%${search}%'`) },
        ],
      }),
    };

    const filteredMovies = await movies.findAll({
      ...(searchFilter && { where: searchFilter }),
      order: [
        [
          sort === "title"
            ? sequelize.fn("lower", sequelize.col("title"))
            : sort,
          order,
        ],
      ],
      offset: offset,
      limit: limit,
    });

    if (Object.values(filteredMovies)?.length === 0) {
      throw new HttpError("No movies were found by your request", 400);
    }
    res.status(200).json({ status: true, data: filteredMovies });
  } catch (err) {
    return next(err);
  }
};

const importHandler = (file, next) => {
  try {
    const multerText = Buffer.from(file.buffer).toString("utf-8");

    const parsedText = multerText.split("\n\n");

    const parsedObjects = [];

    parsedText.forEach((chunk) => {
      parsedObjects.push(chunk.split("\n"));
    });

    const result = parsedObjects.map((entry) => {
      const obj = {};
      entry.forEach((line) => {
        const [key, value] = line.split(":").map((str) => str.trim());
        if (key === "Stars") {
          obj[key] = value.split(",").map((str) => str.trim());
        } else {
          obj[key] = value;
        }
      });

      return obj;
    });

    const finalArray = result.map((movieObj) => {
      return {
        title: movieObj["Title"],
        year: Number(movieObj["Release Year"]),
        format: movieObj["Format"],
        actors: movieObj["Stars"],
      };
    });

    return finalArray;
  } catch (err) {
    return next(new HttpError(err, 500));
  }
};

const importMovies = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(errorHandler(errors));
    }

    const file = req.file;

    if (!file) {
      throw new HttpError("An occured while reading file", 400);
    }

    const parsedMovies = importHandler(file, next);

    const result = await movies.bulkCreate(parsedMovies);

    if (!result) {
      throw new HttpError(
        "An error accured while creating imported movies",
        400
      );
    }

    res.status(200).json({ status: true });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieById,
  getFilteredMovies,
  importMovies,
};
