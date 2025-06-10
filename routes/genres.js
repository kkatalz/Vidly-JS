const asyncMiddleware = require("../middleware/async");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const async = require("../middleware/async");
const { Genre, validate } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Joi = require("joi");

// GET

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    // throw new Error("Could not get the genres");
    const genres = await Genre.find().sort("name");
    res.send(genres);
  })
);

router.get(
  "/:id",
  validateObjectId,
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre)
      return res.status(404).send("No such genre found with given ID");
    res.send(genre);
  })
);

// POST
router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.message);

    const genre = new Genre(req.body);
    await genre.save();
    res.send(genre);
  })
);

// UPDATE
router.put(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!genre)
      return res.status(404).send("The genre with the given ID was not found");

    res.send(genre);
  })
);

// DELETE
router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found");

  res.send(genre);
});

module.exports = router;
