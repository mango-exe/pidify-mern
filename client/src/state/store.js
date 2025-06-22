import authReducer from './slices/auth-slice'
import filesReducer from './slices/files-slice'
import { configureStore } from  '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    auth: authReducer,
    file: filesReducer
  }
})

export default store
