import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { query as q } from "faunadb"
import { fauna } from "../../../services/fauna"

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    
    async session({ session, user, token }) {
      
      try {
        
        const userActiveSubscription = await fauna.query(
              q.Get(
                q.Intersection([
                  q.Match(
                    q.Index('subscription_by_user_ref'),
                    q.Select(
                      "ref",
                      q.Get(
                        q.Match(
                          q.Index('user_by_userEmail'),
                          q.Casefold(session.user.email)
                        )
                      )
                    )
                  ),
                  q.Match(
                    q.Index('subscription_by_status'),
                    "active"
                  )
                ])
                
              )
            )
        
  
        return {
          ...session,
          activeSubscription: userActiveSubscription
          
          
        }

      } catch {
        
        return {
          ...session,
          activeSubscription: null
        }
      }
      
    },
    
    
    async signIn({ user, account, profile, email, credentials }) {

      const { email: userEmail } = user

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_userEmail'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { userEmail }}
            ),
            q.Get(
              q.Match(
                q.Index('user_by_userEmail'),
                q.Casefold(user.email)
              )
            )
          )
        )


        return true
      } catch  {
        return false
      }
    }
  }
})