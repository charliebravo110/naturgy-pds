import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setDataInitialized, setEnabled, setTryAutologin, setAvailable, setBiometryType, setIconType } from './Actions'
import { getPreferences, removePreferences, setPreferences } from '../../common/capacitorPreferencesFunctionality'

import {
  BIOMETRIC_ACCESS_ENABLED_KEY,
  biometryIsAvailable,
  getBiometryType,
  getIconType,
  storeCredsInDevice,
} from '../nativeBiometricFunctionality'
import { AppState } from '../../../common/store/reducers/MainReducer'
import { isWeb } from '../../common/detectPlatform'

/** inits store values regarding Biometric Access */
export default function useBiometryInitializer() {
  const dispatch = useDispatch()
  const { dataInitialized } = useSelector((state: AppState) => state.biometricAccess)

  useEffect(() => {
    // if already initialized or platform is web, do nothing
    if (dataInitialized || isWeb()) return

    init()
    async function init() {
      // extra check, once per app installation: wipe possible garbage left from possible previous installations
      if ((await getPreferences('flagBiometryExtraCleanupDone')) !== 'true') {
        await removePreferences(BIOMETRIC_ACCESS_ENABLED_KEY)
        await storeCredsInDevice('', '')
        await setPreferences('flagBiometryExtraCleanupDone', 'true')
      }

      // biometric access supported and setted up in the device?
      dispatch(setAvailable(await biometryIsAvailable()))

      // login with biometric data enabled?
      dispatch(setEnabled((await getPreferences(BIOMETRIC_ACCESS_ENABLED_KEY)) === 'yes'))

      // biometric access supported type
      dispatch(setBiometryType(await getBiometryType()))

      // try Autologin with biometrics? yes, the app just started
      dispatch(setTryAutologin(true))

      // icon type
      dispatch(setIconType(await getIconType()))

      // ✅ finished initializing data
      dispatch(setDataInitialized(true))
    }
  }, [])
}
