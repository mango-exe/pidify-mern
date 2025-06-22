import { Server as HTTPServer, IncomingMessage } from 'http'
import { Server as HTTPSServer } from 'https'
import { WebSocketServer, WebSocket } from 'ws'
import { models } from '../models'
import { v4 as uuidv4 } from 'uuid'

class WSWrapper {
  private static instance: WSWrapper
  private wss!: WebSocketServer
  private clients: Map<string, WebSocket> = new Map()

  private constructor(server: HTTPServer | HTTPSServer) {
    if (WSWrapper.instance) {
      return WSWrapper.instance
    }

    this.wss = new WebSocketServer({ server })
    this.listen()
    WSWrapper.instance = this
  }

  public static init(server: HTTPServer | HTTPSServer): WSWrapper {
    if (!WSWrapper.instance) {
      WSWrapper.instance = new WSWrapper(server)
    }
    return WSWrapper.instance
  }

  public static getInstance(): WSWrapper {
    if (!WSWrapper.instance) {
      throw new Error('WebSocket server is not initialized')
    }
    return WSWrapper.instance
  }

  private listen() {
    this.wss.on('connection', async (ws: WebSocket, req: IncomingMessage) => {
      const params = new URLSearchParams(req.url?.split('?')[1])
      const token = params.get('token')

      if (!token) {
        ws.close(1008, 'Missing token')
        return
      }


      const user = await models.User.findOne({ token })
      if (!user) {
        ws.close(1008, 'Unauthorized')
        return
      }

      const socketId = uuidv4()
      user.socketId = socketId

      await user.save()

      this.clients.set(user.socketId, ws)

      console.warn(`New WebSocket connection for user ${user.email}`)

      ws.on('close', async () => {
        this.clients.delete(user.socketId)
        await models.User.findByIdAndUpdate(user._id, { socketId: null })
        console.warn(`WebSocket connection closed for user ${user.email}`)
      })
    })
  }

  public sendToClient(socketId: string, message: string): boolean {
    const ws = this.clients.get(socketId)
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message)
      return true
    }
    return false
  }

  public broadcast(message: string) {
    for (const ws of this.clients.values()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message)
      }
    }
  }

  public getClientCount(): number {
    return this.clients.size
  }
}

export { WSWrapper }
