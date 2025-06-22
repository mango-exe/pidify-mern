import path from 'path'
import fs from 'fs'
import http from 'http'
import https from 'https'
import { initApp } from './app'
import { ProcessingQueue } from './lib/queue-lib'
import { buildDockerFile } from './lib/docker-lib'
import { WSWrapper } from './lib/ws-lib'



/*
  TODO:
  - models
  - routes, routers, controllers - scaffhold
  - passport intergration
  - auth middleware
*/


/*
  TODO:
    -- pdf upload
    -- pdf extract
      -- add the PDF fileMeta (PROCESSING STATE) to queue
      -- a worker will run sepparately and process each task
      -- the worker will extract the html and save it to the file directory
      -- the worker will change the state of the fileMeta to (PROCESSED)
      -- the worker will notify the user
    -- pdf extracting is done using queue
    -- notifications using websockets when PDF is extracting
*/

const runServer = async () => {
  try {
    const app = await initApp()
    await buildDockerFile()
    ProcessingQueue.init()
    const credentials  = {
      key:  fs.readFileSync(path.join(__dirname, './certs/local.key')),
      cert: fs.readFileSync(path.join(__dirname, './certs/local.crt'))
    }

    const httpServer = http.createServer(app)
    const httpsServer = https.createServer(credentials, app)
    WSWrapper.init(httpServer)

    httpServer.listen(8080, () => console.warn('HTTP server listening on port 8080'))
    httpsServer.listen(8443, () => console.warn('HTTP server listening on port 8443'))
  } catch(e) {
    console.warn(e)
  }
}

runServer()
