import { Capacitor } from '@capacitor/core'

// Functions to detect the platform, useful for conditional code. Platform can be web, iOS or Android

/** Platform can be web, iOS or Android */
export function isWeb() {
  return Capacitor.getPlatform() === 'web'
}

/** Platform can be web, iOS or Android */
export function isIos() {
  return Capacitor.getPlatform() === 'ios'
}

/** Platform can be web, iOS or Android */
export function isAndroid() {
  return Capacitor.getPlatform() === 'android'
}

/** Platform can be web, iOS or Android */
export function isMobileApp() {
  return Capacitor.isNativePlatform()
  // same as: return isIos() || isAndroid()
  // same as: return !isWeb()
}
