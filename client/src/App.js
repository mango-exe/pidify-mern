import './App.css'
import { Routes, Route } from 'react-router'
import LoginComponent from './components/LoginComponent'
import LoginComplete from './components/LoginComplete/LoginComplete'
import Home from './components/Home'
import Navbar from './components/Navbar/Navbar'
import AppFooter from './components/AppFooter/AppFooter'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import WebSocketClient from './components/WebSocketClient'

function App() {

  return (
    <div className='app-container'>
      <WebSocketClient />
      <Navbar />
      <Routes>
        <Route path='/login' element={<LoginComponent />} />
        <Route path='/complete-login/:authorizationToken' element={<LoginComplete />} />
        <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
      </Routes>
      <AppFooter />
    </div>
  )
}

export default App
