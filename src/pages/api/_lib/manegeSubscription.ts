import { fauna } from "../../../services/fauna";
import { query as q } from "faunadb";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  isCreate = false
) {
  //Buscar o ref do usuário do BD por meio do indice user_by_stripe_customer_id usando o customerId
  //Salvar os dados da subscription da collection Subscriptions_valid junto com a ref do usuário, p/ poder relacionar a subscription com seu devido usuário.

  const userRef = await fauna.query(
    q.Select(
      'ref',
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  )

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  const subscriptionData = {
    idInStripe: subscription.id,
    userId: userRef,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id 

  }

  if(isCreate) {
    await fauna.query(
      q.Create(
        q.Collection('Subscriptions_valid'),
        { data: subscriptionData}
      )
    )
  } else {
    await fauna.query(
      q.Replace(
        q.Select(
          'ref',
          q.Get(
            q.Match(
              q.Index('subscription_by_id'),
              subscriptionId
            )
          )
        ),
        { data: subscriptionData}
      )
    )
  }
}