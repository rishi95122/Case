import mongoose  from "mongoose";
const { Schema } = mongoose;

const shippingAddressSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  orders: [{
    type: Schema.Types.ObjectId, // Reference to the Order model
    ref: 'Order',
  }],
});

const ShippingAddress = mongoose.model('ShippingAddress', shippingAddressSchema);

module.exports = ShippingAddress;
