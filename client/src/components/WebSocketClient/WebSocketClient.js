import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions as filesActions } from '../../state/slices/files-slice'

let ws

const WebSocketClient = () => {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user) {
      if (!ws) {
        ws  = new WebSocket(`ws://localhost:8080?token=${user.token}`)
      }

      ws.onopen = () => {
        console.warn('Connected to server')
        ws.send(JSON.stringify({ type: 'AUTH', token: user.token }))
      }

      ws.onmessage = (message) => {
        processSocketMessage(message)
      }

      ws.onclose = () => {
        console.warn('Disconnected from server')
      }

      return () => {
        ws.close()
      }
    }
  }, [user])

  const processSocketMessage = (message) => {
    const type = message.data.toString()

    switch (type) {
      case 'PDF_PROCESSING_JOB_FINISHED':
       dispatch(filesActions.getPDFFiles())
      break
      case 'PDF_PROCESSING_JOB_FAILED':
       dispatch(filesActions.getPDFFiles())
      break
      default:
        console.log('Unknown message type:', type)
      break
    }
  }

  return(
    <></>
  )

}

export default WebSocketClient
