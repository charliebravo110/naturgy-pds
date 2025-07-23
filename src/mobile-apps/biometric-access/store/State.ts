import { BiometryType, FaceOrFingerprint } from '../nativeBiometricFunctionality'

export default interface State {
  /** state already initialized? */
  dataInitialized: boolean
  /** login with biometry is enabled? */
  enabled: boolean | null
  /** biometry is both supported and setted up in the device? */
  available: boolean | null
  /** what kind of biometry type is supported? (enum) */
  biometryType: BiometryType
  /** next time, try auto login with biometrics? (Reminder: is tried only the first time after the app launches) */
  tryAutologin: boolean
  /** biometry type as a string (for the icon) */
  iconType?: FaceOrFingerprint
}
