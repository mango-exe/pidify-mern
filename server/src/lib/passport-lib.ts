import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import dotenv from 'dotenv'
import { models } from '../models'

dotenv.config()

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: `${process.env.SERVER}/auth-api/oauth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
   if (!profile || !profile.name || !profile.emails) {
     throw new Error('Profile details missing')
   }

   const  [email] = profile.emails
   const fullName = `${profile.name?.familyName} ${profile.name?.givenName}`

    let user = await models.User.findOne({ email: email.value })

   if (!user) {
     user = new models.User()
     user.email = email.value
     user.fullName = fullName
     user.permissions = []
     user.token = ''
     user.authorizationToken = ''

     await user.save()
   }

   return done(null, user)
 }  catch (e) {
   return done(e, false)
 }
}))

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user as any)
})

export default passport
