const express = require("express");
const moment = require("moment");
const Joi = require("joi");

const router = express.Router();
const asyncMiddleware = require("../middleware/async");
const validate = require("../middleware/validate");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");

router.post(
  "/",
  [auth, validate(validateReturn)],
  asyncMiddleware(async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if (!rental)
      return res.status(404).send("no rental found for the movie/customer");

    if (rental.dateReturned)
      return res.status(400).send("rental is already proccessed");

    rental.dateReturned = new Date();

    const rentalDays = Math.max(1, moment().diff(rental.dateOut, "days"));
    rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
    await rental.save();

    await Movie.findByIdAndUpdate(rental.movie._id, {
      $inc: { numberInStock: 1 },
    });

    return res.status(200).send(rental);
  })
);

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId(),
    movieId: Joi.objectId(),
  });
  return schema.validate(req);
}

module.exports = router;
