// import 'fast-text-encoding/text'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import 'unorm'
import 'whatwg-fetch'
import React from 'react'
import ReactDOM from 'react-dom'

import * as serviceWorker from './serviceWorker'
import './index.css'
import App from './App'

// @NOTE: needed for React 16 to work on old browsers (< IE11), comment these lines if compatibility on those browsers is not necessary
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'core-js/es/map'
import 'raf/polyfill'

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
