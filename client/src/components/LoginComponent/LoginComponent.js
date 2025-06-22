import './LoginComponent.css'
import React, { useEffect } from 'react'
import { Button  } from 'primereact/button'
import { Card } from 'primereact/card'
import { SERVER } from '../../config'
import { useStore } from '../../state/store'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

const LoginComponent = () => {
  const { isAuthenticated } = useSelector(state => state.auth)

  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated])

  const handleGoogleLogin = () => {
    window.location.href = `${SERVER}/auth-api/oauth/google/login`
  }

  return (
    <div className='full-width-main-area login-container'>
      <Card title='Login'>
        <Button label='Login with Google' icon='pi pi-google' onClick={() => handleGoogleLogin()}/>
      </Card>
    </div>
  )
}

export default LoginComponent
