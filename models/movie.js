const mongoose = require("mongoose");

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
async function createMovie() {
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

function validateMovie(movie) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    year: Joi.number().min(4).required(),
    director: Joi.string(),
    imdb: Joi.number(),
  });
  return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;
