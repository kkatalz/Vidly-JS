const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = mongoose.Schema({
  isGold: {
    type: Boolean,
    default: false,
  },
  name: { type: String, required: true },
  phone: { type: String, required: true },
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

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    phone: Joi.string()
      .pattern(/^[0-9]{10,20}$/)
      .required(),
  });
  return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
