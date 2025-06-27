import express, { Response, Request, NextFunction } from 'express'
import mongoose from 'mongoose'
import passport from '../lib/passport-lib'
import { randomBase64 } from '../lib/crypto-lib'
import { Profile } from 'passport-google-oauth20'
import { IResponse } from '../types/response/response'
import { User } from '../models/user'
import { models } from '../models'
import { generateAccessToken } from '../lib/crypto-lib'
import { auth } from '../middleware/auth-middleware'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()


router.use(passport.initialize())
router.use(passport.session())

router.get('/oauth/google/login', passport.authenticate('google', { scope: ['profile', 'email']}) )


router.get('/oauth/google/callback', (req: Request, res: Response<IResponse>, next: NextFunction) => {
  passport.authenticate("google", (err: Error | null, userDetails: typeof User | false, info: any) => {
  if (err) {
    return res.status(500).json({ data: null, message: 'Server Error', timestamp: new Date() })
  }

  if (userDetails && typeof userDetails !== 'boolean') {
    const validUserDetails = userDetails as typeof User & { _id: mongoose.Types.ObjectId }
    req.logIn(validUserDetails, async (err: Error | null) => {
      if (err) {
        return res.status(500).json({ data: null, message: 'Server Error', timestamp: new Date() })
      }

      const authorizationToken = uuidv4()
      const user = await models.User.findOne({ _id: validUserDetails._id  })
      if (user) {
        user.authorizationToken = authorizationToken

        await user.save()
      } else {
        return res.status(404).json({ data: null, message: 'User not found', timestamp: new Date() })
      }

      res.redirect(`${process.env.OAUTH_FRONTEND_REDIRECT_URL}/#/complete-login/${authorizationToken}`)
    })
  } else {
    res.redirect('/login')
  }

  })(req, res, next)
})

router.get('/access-token/:authorizationToken', async (req: Request, res: Response<IResponse>, next: NextFunction) => {
  const  { authorizationToken } = req.params
  const user = await models.User.findOne({ authorizationToken })

  if (!user) {
    res.status(404).json({ data: null, message: 'Not found', timestamp: new Date() })
    return
  }
  const accessToken =  generateAccessToken()

  user.token = accessToken.token
  user.expiry = accessToken.timestamp
  user.authorizationToken = ''

  await user.save()

  res.status(200).json({ data: user , message: 'OK', timestamp: new Date() })
})

router.put('/logout', auth, async (req: Request, res: Response<IResponse>, next: NextFunction) => {
  const user = await models.User.findOne({ _id: req.body._id })

  if (!user) {
    res.status(404).json({ data: null, message: 'Not found', timestamp: new Date() })
    return
  }

  user.token = ''
  user.expiry = new Date()

  await user.save()

  res.status(200).json({ data: null, message: 'OK', timestamp: new Date() })
})

export default router
