import './App.css'
import { Routes, Route } from 'react-router'
import LoginComponent from './components/LoginComponent'
import LoginComplete from './components/LoginComplete/LoginComplete'
import Home from './components/Home'
import Navbar from './components/Navbar/Navbar'
import AppFooter from './components/AppFooter/AppFooter'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import WebSocketClient from './components/WebSocketClient'
import ContentEditor from './components/ContentEditor'
import PPTUpload from './components/PPTUpload/PPTUpload'

function App() {
  return (
    <div className='app-container'>
      <WebSocketClient />
      <Navbar />
      <Routes>
        <Route path='/login' element={<LoginComponent />} />
        <Route path='/complete-login/:authorizationToken' element={<LoginComplete />} />
        <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>}>
          {/* Default route renders PPTUpload */}
          <Route index element={<PPTUpload />} />
          {/* /content/:fileAlias renders ContentEditor */}
          <Route path='content/:alias' element={<ContentEditor />} />
        </Route>
      </Routes>
      <AppFooter />
    </div>
  )
}

export default App
