import './Navbar.css'
import React from 'react'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { actions as authActions } from '../../state/slices/auth-slice'

const Navbar = () => {
  const { user } = useSelector(state => state.auth)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(authActions.logout({ user }))
    navigate('/login')
  }

  return (
    <div className='navbar-area  navbar-container'>
      <span>Pidify</span>
      <div>
        {user && (
          <div className='logout-container'>
            <span>{user.email}</span>
            <i className='pi pi-sign-out' onClick={() => handleLogout()} />
          </div>
        )}
      </div>
    </div>
  )

}

export default Navbar
