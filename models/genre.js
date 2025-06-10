const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = mongoose.Schema({
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

const Genre = mongoose.model("Genre", genreSchema);

// Create genres
async function createGenre() {
  const genre = new Genre({
    name: "Pulp Fiction",
    year: 1994,
    director: "Quentin Tarantino",
    imdb: 8.9,
  });

  try {
    const result = await genre.save();
    console.log(result);
  } catch (ex) {
    for (field in ex.errors) console.log(ex.errors[field].message);
  }
}

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    year: Joi.number().min(4).required(),
    director: Joi.string(),
    imdb: Joi.number(),
  });
  return schema.validate(genre);
}

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = validateGenre;
