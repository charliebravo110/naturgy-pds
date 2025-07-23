import React, { Suspense, useEffect, useState } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createBrowserHistory } from 'history'
import { routerMiddleware, ConnectedRouter } from 'connected-react-router'
import { MuiThemeProvider } from '@material-ui/core/styles'
import TagManager from 'react-gtm-module'
import { Helmet } from 'react-helmet'

import './common/I18nConfig'
import rootReducer from './common/store/reducers/MainReducer'
import { OfflinePaymentProvider } from './context/OfflinePaymentContext'

import Header from './common/components/header/Header'
import Footer from './common/components/footer/Footer'
import Loading from './common/components/loading/Loading'

import { ROUTES } from './common/RouterConfig'
/*import { removeParamsFromUrls } from './common/lib/GAnalyticsLib'*/

import { theme } from './App.styles'

import './App.css'

import { isIos, isMobileApp } from './mobile-apps/common/detectPlatform'
import MenuBottomNav from './mobile-apps/menu-bottom-nav/MenuBottomNav'
import useSplashScreenInitializer from './mobile-apps/splash-and-icon/useSplashScreenInitializer'
import DeepLinksListener from './mobile-apps/deep-links/DeepLinksListener'
import PushNotificationsListener from './mobile-apps/push-notifications/push-received/PushNotificationsListener'
import VersionEnforcer from './mobile-apps/version-enforcer/VersionEnforcer'
import NoConnectionPage from './mobile-apps/no-connection/no-connection'
//import { Network } from '@capacitor/network';
import Ratting from './mobile-apps/ratting/Ratting'
import DownloadApp from './common/components/footer/DownloadApp'

// LCS: Importa la función - Wave 1
import { sendGAEvent } from './core/utils/gtm';

export const history = createBrowserHistory()

  /*
  const UA_GOOGLE_ANALYTICS = process.env.REACT_APP_UA_GOOGLE_ANALYTICS
  
  if (UA_GOOGLE_ANALYTICS) {
    // @NOTE Google Analytics, Track Page Views
    ReactGA.initialize(UA_GOOGLE_ANALYTICS)
    const routesUrls = ROUTES.map(item => item.url)
    const initialUrl = removeParamsFromUrls(window.location.pathname, routesUrls)
    if(initialUrl){
      ReactGA.pageview(initialUrl)
    }
    history.listen(location => {
      const url = removeParamsFromUrls(location.pathname, routesUrls)
      if(url){
        ReactGA.set({ page: url })
        ReactGA.pageview(url)
      }
    })
  }
  */
  
  // @NOTE: composeWithDevTools needed to support redux debug mode for this extension:
  // https://github.com/zalmoxisus/redux-devtools-extension
  // @NOTE: Redux store is created here with main reducer and redux-thunk middleware
export const store = createStore(rootReducer(history), composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk)))
declare global {
  interface Window { dataLayer: any; }
}
const tagManagerArgs = {
  gtmId: 'GTM-KSBG52C'
}
TagManager.initialize(tagManagerArgs)

function App() {

  useSplashScreenInitializer()

  useEffect(() => {
    try {
      history.listen((location) => {
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
          event: 'pageview'
        })
      })
    } catch (error) {
      // LCS: Enviar evento a GA - Wave 1
      sendGAEvent({
        event: 'react_error',
        info:{
          error_message: 'Fallo de carga de la aplicación',
          error: error,
          reactComponent: 'App.tsx - useEffect',
        }
      });
    }
    }, [history]
  )


  //Check network status. 
  // const [connection, setConnection] = useState(null);

  // const logCurrentNetworkStatus = async () => {
  //   const status = await Network.getStatus();
  //   setConnection(status.connected)
  // };

  // logCurrentNetworkStatus();

  // Network.addListener('networkStatusChange', status => {
  //   setConnection(status.connected)
  // });


  //nos guardamos el href inicial para saber por que url ha accedido usuario al portal
  sessionStorage.setItem('href', window.location.href)

  // Set date to show ratting dialog
  if (isMobileApp() && !localStorage.getItem('dateLastRattingDialogShown')) {
    localStorage.setItem('dateLastRattingDialogShown', new Date().toString())
  }

  //If no network, an information screen will be displayed --> Only in mobile devices.
  // if (!connection && isMobileApp()) {
  //   return (
  //     <Provider store={store}>
  //       <MuiThemeProvider theme={theme}>
  //         <Helmet
  //           htmlAttributes={{
  //             lang: sessionStorage.getItem('lang') || 'es',
  //             translate: 'no',
  //             class: 'notranslate'
  //           }}
  //         >
  //           <meta name='google' content='notranslate' />
  //         </Helmet>
  //         <div className={'app' + (isIos() ? ' is-ios' : '')}>
  //           <Suspense fallback={<Loading />}>
  //             <NoConnectionPage />
  //           </Suspense>

  //         </div>
  //       </MuiThemeProvider>
  //     </Provider>
  //   )
  // }
  const [hisotryListen, setHisotryListen] = useState(''); 
  useEffect(() => {
    history.listen((location) => {
      setHisotryListen(location.pathname)
    })
  }, [])

  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <Helmet
          htmlAttributes={{
            lang: sessionStorage.getItem('lang') || 'es',
            translate: 'no',
            class: 'notranslate'
          }}
        >
          <meta name='google' content='notranslate' />
        </Helmet>
        <div className={'app' + (isIos() ? ' is-ios' : '')}>
          <ConnectedRouter history={history}>
            <OfflinePaymentProvider>
              <DeepLinksListener />
              <VersionEnforcer />
              <Suspense fallback={<Loading />}>
                <PushNotificationsListener />
                <Header />
                <div className='app__container'>
                  <Switch>
                    <Route exact path='/' render={() => <Redirect to='/login' />} />

                    {
                      ROUTES.map((item, index) => {
                        if (item.params) {
                          const Component = item.component
                          return <Route exact key={index} path={item.url} render={(props: any) => <Component {...props} delegateType={item.params} />} />
                        }
                        return <Route exact key={index} path={item.url} component={item.component} />
                      })
                    }

                    <Route exact path='*' render={() => <Redirect to='/not-found' />} />
                  </Switch>
                </div>
                <DownloadApp hisotryListen={{hisotryListen}} />
                <Footer />
                <MenuBottomNav />
                <Ratting />
              </Suspense>
            </OfflinePaymentProvider>
          </ConnectedRouter>
        </div>
      </MuiThemeProvider>
    </Provider>
  )
}

export default App
