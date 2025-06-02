const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const customerSchema = mongoose.Schema({
  isGold: Boolean,
  name: String,
  phone: String,
});

const Customer = mongoose.model("Customer", customerSchema);

// Create customer
async function createCustomer() {
  const customer = new Customer({
    isGold: false,
    name: "Customer 1",
    phone: "12345",
  });

  try {
    const result = await customer.save();
    console.log(result);
  } catch (ex) {
    for (field in ex.errors) console.log(ex.errors[field].message);
  }
}

createCustomer();

module.exports = router;
