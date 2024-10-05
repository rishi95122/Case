import mongoose from "mongoose"
const order = new mongoose.Schema({
  
      configurationId: {
        type: String,
        required: true,
      },
      configuration: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Image',
      
      },
      userId: {
        type: String,
        required: true,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      amount: {
        type: Number, 
        required: true,
      },
      isPaid: {
        type: Boolean,
        default: false,
      },
      status: {
        type: String, 
       
      },
      shippingAddressId: {
        type: String,
        required: false,
      },
      shippingAddress: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ShippingAddress',
        required: false,
      },
      billingAddressId: {
        type: String,
        required: false,
      },
      billingAddress: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'BillingAddress',
        required: false,
      },
   
    }, { timestamps: { createdAt: 'createdAt', updatedAt: 'updated' } }); 
    
    const orderSchema =mongoose.models?.Order || mongoose.model('Order', order);
    
 export default orderSchema