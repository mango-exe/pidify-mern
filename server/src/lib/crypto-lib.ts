import moment from 'moment'
import crypto from 'crypto'
import { AccessToken } from '../types/crypto/accesstoken'

const  randomBase64 = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('base64')
}

const generateAccessToken = (size: number = 64, duration: number = 10080): AccessToken  => {
  let token
  const timestamp = moment().add(duration || (process.env.TOKEN_LIFETIME), 'minutes').toDate()
  if (!size) {
    token = crypto.randomBytes(size).toString('hex')
  } else {
    token = crypto.randomBytes(size).toString('hex')
  }
  return { token, timestamp }
}


export {
  randomBase64,
  generateAccessToken
}
