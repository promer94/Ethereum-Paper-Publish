import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware'
import combinedReducers from './reducer/reducer'

const loggerMiddleware = createLogger()

export default function configureStore(preloadState) {
  return createStore(
    combinedReducers,
    preloadState,
    process.env.NODE_ENV === 'development'
      ? composeWithDevTools(applyMiddleware(thunk, promise(), loggerMiddleware))
      : applyMiddleware(thunk, promise())
  )
}
