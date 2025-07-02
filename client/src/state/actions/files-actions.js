import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { SERVER } from '../../config'

export const getPDFFiles = createAsyncThunk(
  'pdf/getPDFFiles',
  async (_, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState()
      const response = await axios.get(`${SERVER}/file-api/file-metas`, {
        headers: { Authorization: `${auth.user.token}` }
      })
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const getPDFFileById = createAsyncThunk(
  'pdf/getPDFFileById',
  async (alias, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState()
      const response = await axios.get(`${SERVER}/file-api/file-metas/${alias}`, {
        headers: { Authorization: `${auth.user.token}` }
      })
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const getPDFFileContent = createAsyncThunk(
  'pdf/getPDFFileContent',
  async (alias, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState()
      const response = await axios.get(`${SERVER}/file-api/file-metas/${alias}/content`, {
        headers: { Authorization: `${auth.user.token}` }
      })
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const uploadPDFFile = createAsyncThunk(
  'pdf/uploadPDFFile',
  async (fileFormData, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState()
      await axios.post(`${SERVER}/file-api/upload`, fileFormData, {
        headers: {
          Authorization: `${auth.user.token}`,
          'Content-Type': 'multipart/form-data'
        },
      })
      // Fetch updated list
      const response = await axios.get(`${SERVER}/file-api/file-metas`, {
        headers: { Authorization: `${auth.user.token}` },
      })
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message)
    }
  }
)
