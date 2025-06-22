import express, { Application, Request, Response, NextFunction } from 'express'
import session from 'express-session'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import { connectToDB } from './lib/db-lib'
import * as routers from './routers/index'
import fileUpload from 'express-fileupload'

/*
  -- TODO:
    1. fix logic for failed jobs
    2. client component for navigating to file contet
    3. client logic for editing file
    4. diff logic for file edits (including versioning and access to older versions)
    5. export for file
*/


dotenv.config()

const initApp = async (): Promise<Application> => {
  await connectToDB()
  const app  = express()

  app.use(bodyParser.json())
  app.use(cors())
  app.use(fileUpload())

  app.use(
    session({
      secret: process.env.EXPRESS_SESSION_SECRET as string,
      resave: false,
      saveUninitialized: true
    })
  )

  app.use('/auth-api', routers.authRouter)
  app.use('/file-api', routers.fileRouter)

  return app
}


export {
  initApp
}
