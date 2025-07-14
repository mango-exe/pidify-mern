import './index.css'
import React from 'react'
import 'primereact/resources/themes/lara-light-purple/theme.css'
import 'primeicons/primeicons.css'
import ReactDOM from 'react-dom/client'
import App from './App'
import { HashRouter } from 'react-router'

import store from './state/store'
import { Provider } from 'react-redux'


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <HashRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </HashRouter>
  </React.StrictMode>
)
