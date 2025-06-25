import { createSlice } from '@reduxjs/toolkit'
import { uploadPDFFile, getPDFFiles, getPDFFileById, getPDFFileContent } from '../actions/files-actions'

const initialState = {
  files: [],
  file: null,
  fileContent: null,
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
    builder.addCase(getPDFFileById.pending, (state) => {
      state.fetching = true
    })
    builder.addCase(getPDFFileContent.pending, (state) => {
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
    builder.addCase(getPDFFileById.fulfilled, (state, action) => {
      state.file = action.payload.data
      state.fetching = false
      state.fetched = true
    })
    builder.addCase(getPDFFileContent.fulfilled, (state, action) => {
      state.fileContent = action.payload
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
    builder.addCase(getPDFFileById.rejected, (state, action) => {
      state.error = action.payload.message
      state.fetching = false
    })
    builder.addCase(getPDFFileContent.rejected, (state, action) => {
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
  getPDFFiles,
  getPDFFileById,
  getPDFFileContent
}

export { actions }
export default filesSlice.reducer
