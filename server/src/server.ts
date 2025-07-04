import path from 'path'
import fs from 'fs'
import http from 'http'
import https from 'https'
import { initApp } from './app'
import { ProcessingQueue } from './lib/queue-lib'
import { buildDockerFile } from './lib/docker-lib'
import { WSWrapper } from './lib/ws-lib'
// import { preprocessHTMLFile } from './lib/html-lib'



const runServer = async () => {
  try {
    const app = await initApp()
    await buildDockerFile('service-pdf2htmlex', 'Dockerfile.pdf2htmlex')
    await buildDockerFile('service-image-extractor', 'Dockerfile.image-extractor')
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
// const filePath = path.join(process.cwd(), 'src', 'files', 'import', 'c0e82eb9-5741-412f-9b52-fe0f610d3b19', 'c0e82eb9-5741-412f-9b52-fe0f610d3b19.html')
// preprocessHTMLFile(filePath)
