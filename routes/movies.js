const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

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
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("No such genre with given id");

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
      year: genre.year,
      director: genre.director,
      imdb: genre.imdb,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  try {
    const result = await movie.save();
    res.send(result);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("No such genre with given id");

  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name,
          year: genre.year,
          director: genre.director,
          imdb: genre.imdb,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
      },
      {
        new: true,
      }
    );

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

module.exports = router;
