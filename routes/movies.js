const express = require("express");
const router = express.Router();

const movies = [
  {
    id: 1,
    name: "Gladiator",
    year: 2000,
    director: "Ridley Scott",
    imdb: 8.5,
  },
  {
    id: 2,
    name: "Inception",
    year: 2010,
    director: "Christopher Nolan",
    imdb: 8.8,
  },
  {
    id: 3,
    name: "The Shawshank Redemption",
    year: 1994,
    director: "Frank Darabont",
    imdb: 9.3,
  },
  {
    id: 4,
    name: "The Godfather",
    year: 1972,
    director: "Francis Ford Coppola",
    imdb: 9.2,
  },
  {
    id: 5,
    name: "Pulp Fiction",
    year: 1994,
    director: "Quentin Tarantino",
    imdb: 8.9,
  },
];

// GET
router.get("/", (req, res) => {
  res.send([movies]);
});

router.get("/:id", (req, res) => {
  const movie = movies.find((m) => m.id === parseInt(req.params.id));

  if (!movie) return res.status(404).send("No such movie found with given ID");
  res.send(movie);
});

// POST
router.post("/", (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(result.error.details[0].message);

  const movie = {
    id: movies.length + 1,
    name: req.body.name,
    year: req.body.year,
    director: req.body.director,
    imdb: req.body.imdb,
  };

  movies.push(movie);
  res.send(movie);
});

// UPDATE
router.put("/:id", (req, res) => {
  const movie = movies.find((m) => m.id === parseInt(req.params.id));
  if (!movie)
    return res.status(404).send("The movie with the given ID was not found");

  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(result.error.details[0].message);

  movie.name = req.body.name;
  res.send(movie);
});

// DELETE
router.delete("/:id", (req, res) => {
  const movie = movies.find((m) => m.id === parseInt(req.params.id));
  if (!movie)
    return res.status(404).send("The movie with the given ID was not found");

  const index = movies.indexOf(movie);
  movies.splice(index, 1);

  res.send(movie);
});

function validateMovie(movie) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    year: Joi.number().min(4).required(),
    director: Joi.string(),
    imdb: Joi.number(),
  });
  return schema.validate(movie);
}

module.exports = router;
