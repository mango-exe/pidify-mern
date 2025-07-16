import express, { Application, Request, Response, NextFunction } from 'express'
import session from 'express-session'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import { connectToDB } from './lib/db-lib'
import * as routers from './routers/index'
import fileUpload from 'express-fileupload'

/*
  TODO:
    1. diff logic for file edits (including versioning and access to older versions)
    2. export for file
    3. generat thumbnails for pdf so that they appear in sidebar
    4. add page and remove page

   BUGS:
    1. fix logic for failed job
    2. websocket bug
    3. fix z-index for adding text
    4. add set behind or set in front for images
    5. fix scrollbar for files height
    6. fix image editing
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
