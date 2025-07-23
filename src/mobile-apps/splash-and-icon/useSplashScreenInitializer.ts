import { SplashScreen } from '@capacitor/splash-screen'
import { useEffect } from 'react'
import { isAndroid } from '../common/detectPlatform'

/** this deals with the splash screen for mobile apps */
export default function useSplashScreenInitializer() {
  useEffect(() => {
    // only if platform is Android (not needed for iOS)
    if (isAndroid()) customizeSplash()
  }, [])
}

async function customizeSplash() {
  await SplashScreen.hide()
  await SplashScreen.show({
    showDuration: 2500,
    autoHide: true,
  })
}
