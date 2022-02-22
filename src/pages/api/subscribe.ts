import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { fauna } from '../../services/fauna'
import { query as q } from 'faunadb'
import { stripe } from '../../services/stripe'

type userInDBProps = {
  data: {
    customerId: string
  },
  ref: {
    id: string
  }
}


export default async(req: NextApiRequest, res: NextApiResponse) => {

  if (req.method === 'POST') {

    const session = await getSession({ req })

    const userInDB = await fauna.query<userInDBProps>(
      q.Get(
        q.Match(
          q.Index('user_by_userEmail'),
          q.Casefold(session.user.email)
        )
      )
    ) 

    let stripeCustomerId = userInDB.data.customerId

  
    if(!stripeCustomerId) {

      const stripeCustomer = await stripe.customers.create({
        email: session.user.email
      })

      stripeCustomerId = stripeCustomer.id

      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), userInDB.ref.id),
          { data: { customerId: stripeCustomerId}}
        )
      )

    }
      
      

  

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        { price: 'price_1KTvkBDmC9ndlLrzcufnHVKS', quantity: 1 }
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    })

    res.status(200).send({ sessionId: stripeCheckoutSession.id})

  } else {
    res.setHeader('Allow', 'Post')
    res.status(405).end('Method not allow')
  }
  
}