import { createSlice } from '@reduxjs/toolkit'
import { uploadPDFFile, getPDFFiles } from '../actions/files-actions'

const initialState = {
  files: [],
  count: 0,
  error: null,
  fetching: false,
  fetched: false,
}

const filesSlice = createSlice({
  name: 'files',
  initialState,
  extraReducers: (builder) => {
    // pending
    builder.addCase(getPDFFiles.pending, (state) => {
      state.fetching = true
    })
    builder.addCase(uploadPDFFile.pending, (state) => {
      state.fetching = true
    })

    // fulfilled
    builder.addCase(getPDFFiles.fulfilled, (state, action) => {
      state.files = action.payload.data.files
      state.count = action.payload.data.count
      state.fetching = false
      state.fetched = true
    })
    builder.addCase(uploadPDFFile.fulfilled, (state, action) => {
      state.files = action.payload.data.files
      state.count = action.payload.data.count
      state.fetching = false
      state.fetched = true
    })

    // rejected
    builder.addCase(getPDFFiles.rejected, (state, action) => {
      state.error = action.payload.message
      state.fetching = false
    })
    builder.addCase(uploadPDFFile.rejected, (state, action) => {
      state.error = action.payload.message
      state.fetching = false
    })
  }
})

const actions = {
  uploadPDFFile,
  getPDFFiles
}

export { actions }
export default filesSlice.reducer
