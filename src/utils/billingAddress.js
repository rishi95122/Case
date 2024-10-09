import mongoose from "mongoose";
const { Schema } = mongoose;

const billingAddressSchema = new Schema({
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
      type: Schema.Types.ObjectId, 
      ref: 'Order',
    }],
  });
  
  const BillingAddress = mongoose.model('BillingAddress', billingAddressSchema);
  
  module.exports = BillingAddress;
  