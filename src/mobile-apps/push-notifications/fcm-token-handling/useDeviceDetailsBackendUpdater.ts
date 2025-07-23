import React, { useEffect, useState } from 'react'
import { Device } from '@capacitor/device'
import { PushNotifications } from '@capacitor/push-notifications'
import { getPreferences, setPreferences } from '../../common/capacitorPreferencesFunctionality'
import { isWeb } from '../../common/detectPlatform'
import { MobileDeviceDetails } from './interfaces'
import { useCommonStuff } from '../../common/useCommonStuff'
import MobileDeviceDetailsService from './MobileDeviceDetailsService'

/**
 * This custom hook is used to keep the backend updated with the mobile device details.
 * If platform is web, it does nothing.
 * When someone logs in it first registers the device with Firebase Cloud Messaging and obtains the FCM token.
 * Then the token is sent to the backend along with more data (only if anything is different from the previous time)
 * This is consumed from Login.tsx
 */
export default function useDeviceDetailsBackendUpdater() {
  const { someoneIsLoggedIn } = useCommonStuff()
  const [done, setDone] = useState(false)
  const LAST_MOBILE_DEVICE_DETAILS_KEY = 'lastMobileDeviceDetails'

  // when is mobile app and someone logs in, only once: initialize, collect data and send to backend
  useEffect(() => {
    if (isWeb() || !someoneIsLoggedIn || done) return

    // someone just logged in
    initPushNotifications().then(() => setDone(true))
  }, [someoneIsLoggedIn, done])

  async function initPushNotifications() {
    // first add listeners
    await PushNotifications.addListener('registration', async (token) => {
      // this device has been registered successfully on firebase, this is the token
      await collectDataAndMaybeSendToBackend(token.value)
      // .then(() => PushNotifications.removeAllListeners())
      // 👆 dont remove listeners, because it would remove the listeners for push notification received as well
    })
    await PushNotifications.addListener('registrationError', (err) => {
      console.error('FCM registration error: ', err.error)
    })

    // second register notifications
    let permStatus = await PushNotifications.checkPermissions()
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions()
    }
    if (permStatus.receive !== 'granted') {
      console.debug('User denied PushNotifications permissions')
    }
    await PushNotifications.register()
  }

  async function collectDataAndMaybeSendToBackend(token: string) {
    const { operatingSystem, osVersion, isVirtual } = await Device.getInfo()
    const mobileDeviceDetails: MobileDeviceDetails = {
      userId: sessionStorage.getItem('id') || '',
      firebaseToken: token || '',
      deviceId: (await Device.getId()).uuid || '',
      platform: operatingSystem,
      osVersion,
      isVirtual,
    }

    if (
      mobileDeviceDetails.userId === '' ||
      mobileDeviceDetails.firebaseToken === '' ||
      mobileDeviceDetails.deviceId === ''
    ) {
      console.debug('Unexpected empty data in mobileDeviceDetails:', mobileDeviceDetails)
      return
    }

    const dataIsTheSame = JSON.stringify(mobileDeviceDetails) === (await getPreferences(LAST_MOBILE_DEVICE_DETAILS_KEY))
    if (dataIsTheSame) return

    // something changed from the last time, so we send the data to the backend
    const service = new MobileDeviceDetailsService()
    const success = await service.updateMobileDeviceDetailsAndReplyBoolean(mobileDeviceDetails)
    if (!success) {
      console.debug('Failed to update mobile device details in backend (offline device? backend error? ...)')
      return
    }

    setPreferences(LAST_MOBILE_DEVICE_DETAILS_KEY, JSON.stringify(mobileDeviceDetails))
  }
}
