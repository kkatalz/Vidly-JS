const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// GET
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send([rentals]);
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid movie rental.");

  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res.status(404).send("No such rental found with given ID");
  res.send(rental);
});

// POST
router.post("/", async (req, res) => {
  const customer = await Customer.findById(req.body.customerId);
  if (!customer)
    return res.status(400).send("No such rental with given customer id");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("No such rental with given movie id");
  if (movie.numberInStock === 0)
    return res.status(400).send("Movie is out of stock");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      isGold: customer.isGold,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    await rental.save();

    await Movie.updateOne({ _id: movie._id }, { $inc: { numberInStock: -1 } });
    res.send(rental);
  } catch (ex) {
    res.status(500).send("Error saving rental: " + ex.message);
  }
});

module.exports = router;
