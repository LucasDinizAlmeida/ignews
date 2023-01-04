import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream'
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manegeSubscription";

async function buffer(readable: Readable) {
  const chunks = []

  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === 'string' ? Buffer.from(chunk) : chunk
    )
  }

  return Buffer.concat(chunks)
}

export const config = {
  api: {
    bodyParser: false
  }
}

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.update',
  'customer.subscription.deleted'
])


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const secret = req.headers['stripe-signature']
    const buf = await buffer(req)

    let event: Stripe.Event

    try {

      event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET)

    } catch (error) {
      res.status(400).send(`WebHooks error: ${error.messange}`)
    }

    const type = event.type

    if (relevantEvents.has(type)) {
      console.log(type)
      try {
        switch (type) {
          case 'customer.subscription.update':
          case 'customer.subscription.deleted':

            const subscriptionEvent = event.data.object as Stripe.Subscription

            await saveSubscription(
              subscriptionEvent.id.toString(),
              subscriptionEvent.customer.toString(),
              false
            )

            break;

          case 'checkout.session.completed':

            const checkoutSession = event.data.object as Stripe.Checkout.Session

            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true
            )
            break;

          default:
            throw new Error('Unhandled event.')
        }
      } catch (error) {
        return res.json({ err: error.messange })
      }

    }

    res.json({ ok: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).send('Method not Allow')
  }


}