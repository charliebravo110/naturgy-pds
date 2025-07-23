import React, { useEffect } from 'react'
import { App, URLOpenListenerEvent } from '@capacitor/app'
import { useHistory } from 'react-router'
import { isWeb } from '../common/detectPlatform'

/** handles mobile apps deep links navigation, does nothing if platform is web */
export default function DeepLinksListener() {
  const history = useHistory()

  useEffect(() => {
    if (isWeb()) return

    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      const url = new URL(event.url)
      // if it's a deep link, navigate there
      if (url.pathname) history.push(url.pathname + url.search) // added url.search to include query params
      // It's NOT a deep link, do nothing - let regular routing logic take over
    })
  }, [])

  return null
}
