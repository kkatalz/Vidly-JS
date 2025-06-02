const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Joi = require("joi");

const movieSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  year: {
    type: Number,
    required: true,
  },
  director: String,
  imdb: Number,
});

const Movie = mongoose.model("Movie", movieSchema);

// Create movies

async function createCourse() {
  const movie = new Movie({
    name: "Pulp Fiction",
    year: 1994,
    director: "Quentin Tarantino",
    imdb: 8.9,
  });

  try {
    const result = await movie.save();
    console.log(result);
  } catch (ex) {
    for (field in ex.errrs) console.log(ex.errors[field].message);
  }
}

// createCourse();

// GET
router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");
  res.send([movies]);
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid movie ID.");

  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).send("No such movie found with given ID");
  res.send(movie);
});

// POST
router.post("/", async (req, res) => {
  let movie = new Movie(req.body);

  try {
    const result = await movie.save();
    res.send(result);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!movie)
      return res.status(404).send("The movie with the given ID was not found");

    res.send(movie);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found");

  res.send(movie);
});

/*
function validateMovie(movie) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    year: Joi.number().min(4).required(),
    director: Joi.string(),
    imdb: Joi.number(),
  });
  return schema.validate(movie);
}
*/

module.exports = router;
