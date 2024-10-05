import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "../../../lib/stripe";
import ShippingAddress from "../../../utils/shippingAddress";
import BillingAddress from "../../../utils/billingAddress";
import orderSchema from "../../../utils/billingAddress";

const updateOrderWithAddresses = async (
  orderId,
  session,
  shippingAddress,
  billingAddress
) => {
  try {
    const newShippingAddress = new ShippingAddress({
      name: session.customer_details.name,
      city: shippingAddress.city,
      country: shippingAddress.country,
      postalCode: shippingAddress.postal_code,
      street: shippingAddress.line1,
      state: shippingAddress.state,
    });

    const newBillingAddress = new BillingAddress({
      name: session.customer_details.name,
      city: billingAddress.city,
      country: billingAddress.country,
      postalCode: billingAddress.postal_code,
      street: billingAddress.line1,
      state: billingAddress.state,
    });

    const updatedOrder = await orderSchema.updateOne(
      { _id: orderId },
      {
        $set: {
          isPaid: true,
          shippingAddress: newShippingAddress._id,
          billingAddress: newBillingAddress._id,
        },
      }
    );
    await newShippingAddress.save();
    await newBillingAddress.save();
    return updatedOrder;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

export async function POST(req) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      return new Response("Invalid signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("events", event.type, event);
    if (event.type === "checkout.session.completed") {
      if (!event.data.object.customer_details?.email) {
        throw new Error("Missing user email");
      }

      const session = event.data.object;

      const { userId, orderId } = session.metadata || {
        userId: null,
        orderId: null,
      };

      if (!userId || !orderId) {
        throw new Error("Invalid request metadata");
      }

      const billingAddress = session.customer_details.address;
      const shippingAddress = session.shipping_details.address;
      const updatedorder = updateOrderWithAddresses(
        orderId,
        session,
        shippingAddress,
        billingAddress
      );

      console.log("updatedOrder", updatedorder);

      //   await resend.emails.send({
      //     from: 'CaseCobra <hello@joshtriedcoding.com>',
      //     to: [event.data.object.customer_details.email],
      //     subject: 'Thanks for your order!',
      //     react: OrderReceivedEmail({
      //       orderId,
      //       orderDate: updatedOrder.createdAt.toLocaleDateString(),
      //       // @ts-ignore
      //       shippingAddress: {
      //         name: session.customer_details!.name!,
      //         city: shippingAddress!.city!,
      //         country: shippingAddress!.country!,
      //         postalCode: shippingAddress!.postal_code!,
      //         street: shippingAddress!.line1!,
      //         state: shippingAddress!.state,
      //       },
      //     }),
      //   })
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Something went wrong", ok: false },
      { status: 500 }
    );
  }
}
