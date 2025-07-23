export interface MobileDeviceDetails {
  userId: string
  /** FCM token obtained from firebase */
  firebaseToken: string
  /** The UUID of the device as available to the app */
  deviceId: string
  platform: string
  osVersion: string
  isVirtual: boolean
  // eg from PDS via postman: {"userId":"40","firebaseToken":"A12f34D99","deviceId":"7437","platform":"Android","osVersion":"3.0.1","isVirtual":"true"}
}
