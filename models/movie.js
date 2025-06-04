const mongoose = require("mongoose");
const { genreSchema } = require("./genre");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const movieSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 255,
  },
  genre: { type: genreSchema, required: true },
  numberInStock: { type: Number, required: true, min: 0, max: 255 },
  dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
});

const Movie = mongoose.model("Movies", movieSchema);

function validateMovie(genre) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(5).max(255).required(),
    dailyRentalRate: Joi.number().min(5).max(255).required(),
  });
  return schema.validate(genre);
}

exports.Movie = Movie;
exports.validate = validateMovie;
