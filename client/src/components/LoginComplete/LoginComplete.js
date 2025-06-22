import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { actions as authActions } from '../../state/slices/auth-slice'

import { useNavigate } from 'react-router'

const LoginComplete = () => {
  const dispatchedToken = useRef(false)
  const { isAuthenticated, error } = useSelector(state => state.auth)

  const dispatch = useDispatch()
  const params = useParams()
  const  navigate = useNavigate()

  const { authorizationToken } = params

  useEffect(() => {
    if (dispatchedToken.current) return
    dispatch(authActions.getUser({ authorizationToken }))

    dispatchedToken.current = true
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (error) {
      navigate('/login')
    }
  }, [navigate, error])

  return(
    < ></>
  )
}

export default LoginComplete
