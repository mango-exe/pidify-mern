import { models } from '../models'
import moment from 'moment'
import { Request, Response, NextFunction } from 'express'
import { IResponse } from '../types/response/response'

const auth = async (req: Request, res: Response<IResponse>, next: NextFunction) => {
  try {
    const token = req.headers.authorization || req.headers.Authorization

    if (!token) {
      res.status(401).json({ message: 'Unauthorized',  data: null, timestamp: new Date() })
      return
    }

    const result = await models.User.aggregate([
      {
        $match: {
          token
        }
      },
      {
        $lookup: {
          from: 'permissions',
          localField: 'permissions',
          foreignField: '_id',
          as: 'permissions'
        }
      }
    ])
    const user = result.length > 0 ? result[0] : null

    if (!user) {
      res.status(401).json({ message: 'Unauthorized',  data: null, timestamp: new Date() })
      return
    }

    const now = moment()
    if (now.isAfter(moment(user.expiry))) {
      res.status(401).json({ message: 'Token expired',  data: null, timestamp: new Date() })
      return
    }
    res.locals = {}
    res.locals.user = user
    return  next()
  } catch(e) {
    next(e)
  }
}

export {
  auth
}
