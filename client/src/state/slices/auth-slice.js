import { createSlice } from '@reduxjs/toolkit'
import { getUser, logout } from '../actions/user-actions'

const initialState = {
  user: null,
  isAuthenticated: false,
  error: null,
  fetching: false,
  fetched: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getUser.pending, (state) => {
      state.fetching = true
    })
    builder.addCase(logout.pending, (state) => {
      state.fetching = true
    })
    builder.addCase(getUser.fulfilled, (state, action) => {
      console.warn(action.payload)
      state.user = action.payload.data
      state.isAuthenticated = true
      state.fetched = true
      state.fetching = false
    })
    builder.addCase(logout.fulfilled, () => initialState)
    builder.addCase(getUser.rejected, (state, action) => {
      state.isAuthenticated = false
      state.fetched = true
      state.fetching = false
      state.error = action.payload.message
    })
    builder.addCase(logout.rejected, (state, action) => {
      Object.assign(state, initialState, { error: action.payload.message })
    })
  }
})

export const actions = { getUser, logout }
export default userSlice.reducer
