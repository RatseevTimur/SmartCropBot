import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './state'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
})