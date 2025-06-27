import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  workingElementId: null,
  actionType: null
}

const contentEditorSlice = createSlice({
  name: 'contentEditor',
  initialState,
  reducers: {
    setWorkingElement: (state, action) => {
      console.warn(action)
      state.workingElementId = action.payload.workingElementId
      state.actionType = action.payload.actionType
    },
    unsetWorkingElement: (state) => {
      state.workingElementId = null
      state.actionType = null
    }
  }
})

const { setWorkingElement, unsetWorkingElement } = contentEditorSlice.actions
export const actions = { setWorkingElement, unsetWorkingElement }
export default contentEditorSlice.reducer
