const mongoose = require("mongoose");
const Joi = require("joi");
const moment = require("moment");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: { type: String, required: true, minlength: 5, maxlength: 50 },
      isGold: {
        type: Boolean,
        default: false,
      },
      phone: { type: String, required: true },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 255,
      },
      dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: { type: Number, min: 0.1 },
});

rentalSchema.statics.lookup = function (customerId, movieId) {
  return this.findOne({
    "customer._id": customerId,
    "movie._id": movieId,
  });
};

rentalSchema.methods.return = function () {
  this.dateReturned = new Date();

  const rentalDays = Math.max(1, moment().diff(this.dateOut, "days"));
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
};

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(rental);
}

const Rental = mongoose.model("Rental", rentalSchema);

exports.Rental = Rental;
exports.validate = validateRental;
