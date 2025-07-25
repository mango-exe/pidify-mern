import authReducer from './slices/auth-slice'
import filesReducer from './slices/files-slice'
import contentEditorReducer from './slices/content-editor-slice'
import { configureStore } from  '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    auth: authReducer,
    file: filesReducer,
    contentEditor: contentEditorReducer
  }
})

export default store
