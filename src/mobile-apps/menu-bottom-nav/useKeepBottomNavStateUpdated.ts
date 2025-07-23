import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../common/store/reducers/MainReducer'
import { getPreferences, setPreferences } from '../common/capacitorPreferencesFunctionality'
import { isWeb } from '../common/detectPlatform'
import { useCommonStuff } from '../common/useCommonStuff'
import { setShowBottomNav, setShowBurguer } from './store/Actions'

/** Only for mobile-apps. Keeps store state updated regarding menu-bottom-nav (showBurguer & showBottomNav) */
export default function useKeepBottomNavStateUpdated() {
  const dispatch = useDispatch()
  const { someoneIsLoggedIn } = useCommonStuff()
  const { user } = useSelector((state: AppState) => state.login)
  const [lastUsernameLoggedIn, setLastUsernameLoggedIn] = useState<string | null>(null)

  // init lastUsernameLoggedIn
  useEffect(() => {
    if (isWeb()) return

    init()
    async function init() {
      setLastUsernameLoggedIn(await getPreferences('lastUsernameLoggedIn'))
    }
  }, [])

  // keep lastUsernameLoggedIn updated both in local state and in capacitor preferences (for persistence)
  useEffect(() => {
    if (isWeb()) return

    if (!!user) {
      setPreferences('lastUsernameLoggedIn', user)
      setLastUsernameLoggedIn(user)
    }
  }, [user])

  // main logic
  useEffect(() => {
    if (isWeb()) return

    switch (true) {
      case false === someoneIsLoggedIn:
        dispatch(setShowBurguer(true))
        dispatch(setShowBottomNav(false))
        break
      case someoneIsLoggedIn && !lastUsernameLoggedIn:
        // do nothing (lastUsernameLoggedIn is getting updated)
        break
      case someoneIsLoggedIn && !!lastUsernameLoggedIn && getUsernameType(lastUsernameLoggedIn) === 'domestic':
        dispatch(setShowBurguer(false))
        dispatch(setShowBottomNav(true))
        break
      case someoneIsLoggedIn && !!lastUsernameLoggedIn && getUsernameType(lastUsernameLoggedIn) !== 'domestic':
        dispatch(setShowBurguer(true))
        dispatch(setShowBottomNav(false))
        break
      default:
        console.debug('reached an unexpected case, search random29032554562')
        break
    }
  }, [someoneIsLoggedIn, lastUsernameLoggedIn])
}

/** helper inspired by src/common/lib/ValidationLib.ts --> validateUserCode */
export function getUsernameType(username: string): '9' | '00' | '44' | '70' | 'domestic' | 'UF' {
  if (/^9\d{7}$/.test(username)) return '9'
  if (/^00\d{6}$/.test(username)) return '00'
  if (/^44\d{6}$/.test(username)) return '44'
  if (/^UF\d{6}$/.test(username) || /^uf\d{6}$/.test(username)) return 'UF'
  if (/^70\d{6}$/.test(username)) return '70'
  return 'domestic'
}
