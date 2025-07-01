import { createSlice } from '@reduxjs/toolkit'

export const contentEditorActionTypes = {
  ADD_IMAGE_ELEMENT: 'ADD_IMAGE_ELEMENT',
  ADD_TEXT_ELEMENT: 'ADD_TEXT_ELEMENT',
  EDIT_TEXT_ELEMENT: 'EDIT_TEXT_ELEMENT',
  UNSET_ELEMENT: 'UNSET_ELEMENT',
  CANCEL_EDITING: 'CANCEL_EDITING'
}

const initialState = {
  workingElementId: null,
  actionType: null
}

const processAddImageElement = (_, state) => {
  // if (state.actionType === contentEditorActionTypes.EDIT_TEXT_ELEMENT) {
  //   const editingElement = document.getElementById(state.workingElementId)
  //   editingElement.contentEditable = false
  //   editingElement.classList.remove('editing')
  //   editingElement.classList.add('text-container')
  // }
}

const processAddTextElement = (_, state) => {
  if (state.actionType === contentEditorActionTypes.EDIT_TEXT_ELEMENT) {
    const editingElement = document.getElementById(state.workingElementId)
    editingElement.contentEditable = false
    editingElement.classList.remove('editing')
    editingElement.classList.add('text-container')
  }
}

const processEditTextElement = (workingElementId, state) => {
  const editingElement = document.getElementById(workingElementId)
  if (editingElement) {
    if (!editingElement.hasAttribute('element-supports')) return
    if (editingElement.getAttribute('element-supports') !== 'editing') return

    if (editingElement.textContent) {

      const lastEditingElement = document.getElementById(state.workingElementId)

      if (lastEditingElement && lastEditingElement.id !== editingElement.id) {
        lastEditingElement.contentEditable = false
        lastEditingElement.classList.remove('editing')
        lastEditingElement.classList.add('text-container')
      }

      editingElement.contentEditable = true
      editingElement.focus()
      editingElement.classList.add('editing')
      editingElement.classList.remove('text-container')
    }
  }
}

const processCancelEditingElement = (state) => {
  const editingElement = document.getElementById(state.workingElementId)
  if (editingElement && state.actionType === contentEditorActionTypes.EDIT_TEXT_ELEMENT) {
    if (!editingElement.textContent.trim()) {
      editingElement.remove()
    } else {
      editingElement.contentEditable = false
      editingElement.blur()
      editingElement.classList.remove('editing')
      editingElement.classList.add('text-container')
    }
  }
}

const processWorkingElement = (workingElementId, actionType, state) => {
  switch (actionType) {
    case contentEditorActionTypes.ADD_IMAGE_ELEMENT:
      processAddImageElement(workingElementId, state)
      break
    case contentEditorActionTypes.ADD_TEXT_ELEMENT:
      processAddTextElement(null, state)
      break
    case contentEditorActionTypes.EDIT_TEXT_ELEMENT:
      processEditTextElement(workingElementId, state)
      break
    case contentEditorActionTypes.CANCEL_EDITING:
      processCancelEditingElement(state)
      break
    default:
      throw new Error(`Unknown action type: ${actionType}`)
  }
}

const contentEditorSlice = createSlice({
  name: 'contentEditor',
  initialState,
  reducers: {
    setWorkingElement: (state, action) => {
      const { workingElementId, actionType  } = action.payload
      processWorkingElement(workingElementId, actionType, state)
      state.workingElementId = action.payload.workingElementId
      state.actionType = action.payload.actionType
    },
    unsetWorkingElement: (state, action) => {
      state.workingElementId = null
      state.actionType = null
    },
    cancelEditingElement: (state, action) => {
      const { actionType  } = action.payload
      processWorkingElement(null, actionType, state)
      state.workingElementId = null
      state.actionType = null
    },
  }
})

const { setWorkingElement, unsetWorkingElement, cancelEditingElement } = contentEditorSlice.actions
export const actions = { setWorkingElement, unsetWorkingElement, cancelEditingElement }
export default contentEditorSlice.reducer
