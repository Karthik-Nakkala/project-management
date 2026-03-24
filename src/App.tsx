import React from 'react'
import { Provider } from 'react-redux'
import { store } from './store/store'
import Test from './components/test'

const App = () => {
  return (
    <Provider store={store}>

      <div>
      <Test/>
      </div>

    </Provider>
    
  )
}

export default App
