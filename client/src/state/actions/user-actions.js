// authThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { SERVER } from '../../config'
import { useStore } from '../store'

export const getUser = createAsyncThunk(
  'auth/getUser',
  async ({ authorizationToken }, thunkAPI) => {
    try {
      const response = await axios.get(`${SERVER}/auth-api/access-token/${authorizationToken}`)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async ({ user }, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState()
      const response = await axios.put(`${SERVER}/auth-api/logout`, user, {
        headers: {
          Authorization: auth.user.token,
        },
      })
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message)
    }
  }
)
