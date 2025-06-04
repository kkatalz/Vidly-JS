const auth = require("../middleware/auth");
const { Genre, validate } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Joi = require("joi");

// GET
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send([genres]);
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid genre ID.");

  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send("No such genre found with given ID");
  res.send(genre);
});

// POST
router.post("/", auth, async (req, res) => {
  const genre = new Genre(req.body);

  try {
    await genre.save();
    res.send(genre);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!genre)
      return res.status(404).send("The genre with the given ID was not found");

    res.send(genre);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found");

  res.send(genre);
});

module.exports = router;
