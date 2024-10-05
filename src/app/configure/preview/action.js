"use server"
import imageSchema from '../../../utils/schema'
import orderSchema from '../../../utils/orderSchema'
import {stripe} from '../../../lib/stripe'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
export const createCheckoutSession = async ({
    configId,
    total
  }
   ) => {
    const configuration = await imageSchema.findById(configId)
  
    if (!configuration) {
      throw new Error('No such configuration found')
    }
  
    const { getUser } = getKindeServerSession()
    const user = await getUser()
  
    if (!user) {
      throw new Error('You need to be logged in')
    }
  
    const { finish, material } = configuration
 

    const existingOrder = await orderSchema.findOne({
      userId: user.id,
      configurationId: configuration.id
    });
    let order;
    if (existingOrder) {
      order = existingOrder;
    } 
    else {
      order = await orderSchema.create({
        amount: total,
        userId: user.id,
        configurationId: configuration.id,
      });
    }
    const product = await stripe.products.create({
      name: 'Custom iPhone Case',
      images: [configuration.imageUrl],
      default_price_data: {
        currency: 'USD',
        unit_amount: total *100,
      },
    })
    console.log(total)
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
      payment_method_types: ['card', 'paypal'],
      mode: 'payment',
      shipping_address_collection: { allowed_countries: ['DE', 'US'] },
      metadata: {
        userId: user.id,
        orderId: order.id,
      },
      line_items: [{ price: product.default_price, quantity: 1 }],
    })
    console.log(stripeSession)
    return { url: stripeSession.url }
  }
  