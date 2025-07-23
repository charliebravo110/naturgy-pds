// facade for capacitor native biometric plugin

import { NativeBiometric, BiometricOptions } from 'capacitor-native-biometric'
import { BiometryType } from 'capacitor-native-biometric' // import the type to be used here in this file
export { BiometryType } from 'capacitor-native-biometric' // re-export the type to be used from the rest of the code

const BIOMETRICS_SERVER_ID = 'u7i8eV5R4eL8bF2rkN61Qwefr34asd' //just a random key id to store the credentials safely in the device
export const BIOMETRIC_ACCESS_ENABLED_KEY = 'biometric-access-enabled'

export type FaceOrFingerprint = 'face' | 'fingerprint' | null

/** returns true if biometry is both supported and setted up in the device */
export async function biometryIsAvailable(): Promise<boolean> {
  try {
    const { isAvailable } = await NativeBiometric.isAvailable()
    return isAvailable
  } catch (e) {
    return false
  }
}

/** uses the native OS dialog to confirm the user identity (with faceid, fingerprint...)  */
export async function performBioCheck(localizedOptions?: BiometricOptions) {
  if (!(await biometryIsAvailable())) return false

  const defaultOptions: BiometricOptions = {
    reason: 'Para iniciar sesión con mayor rapidez y seguridad',
    title: 'Verificación de identidad',
    subtitle: 'Coloca tu dedo en el lector de huella para acceder',
    // description: 'Maybe a description too?', // not needed
    negativeButtonText: 'Cancelar',
    useFallback: false,
    maxAttempts: 3,
  }
  const options = localizedOptions ? { ...defaultOptions, ...localizedOptions } : defaultOptions

  const verified = await NativeBiometric.verifyIdentity(options)
    .then(() => true)
    .catch(() => false)

  return verified
}

/** returns the stored credentials if any, null otherwise */
export async function getStoredCreds(): Promise<{ username: string; password: string } | null> {
  try {
    const creds = await NativeBiometric.getCredentials({ server: BIOMETRICS_SERVER_ID })
    if (!creds) return null

    return creds
  } catch (e) {
    return null
  }
}

/** stores the credentials safely in the device (in Keychain (iOS) or encypts them using Keystore (Android) */
export async function storeCredsInDevice(username: string, password: string) {
  try {
    await removeStoredCreds()
    await NativeBiometric.setCredentials({ username, password, server: BIOMETRICS_SERVER_ID })
    return true
  } catch (e) {
    return false
  }
}

/** removes the stored credentials from the device */
export async function removeStoredCreds(): Promise<boolean> {
  try {
    await NativeBiometric.deleteCredentials({ server: BIOMETRICS_SERVER_ID })
    return true
  } catch (e) {
    return false
  }
}

/** returns the biometry type (enum) */
export async function getBiometryType() {
  return (await NativeBiometric.isAvailable()).biometryType
}

/** gets icon type */
export async function getIconType(): Promise<FaceOrFingerprint> {
  const availableResult = await NativeBiometric.isAvailable()

  if (!availableResult.isAvailable) return null

  //  return 'face' if biometry type is faceId or face authentication or iris authentication, otherwise return 'fingerprint'
  return [BiometryType.FACE_ID, BiometryType.FACE_AUTHENTICATION, BiometryType.IRIS_AUTHENTICATION].includes(
    availableResult.biometryType
  )
    ? 'face'
    : 'fingerprint'
}