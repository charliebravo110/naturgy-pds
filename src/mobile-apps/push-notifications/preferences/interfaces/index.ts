/** defined by backend */
export interface UserNotificationPreferences {
  items: {
    userId: string
    notification: 'NewCups' | 'Hippo' | 'Hippo2'
    value: 'SI' | 'NO'
  }[]
  // eg from PDS via postman: {"items":[{"userId":"40","notification":"Hippo","value":"NO"},{"userId":"40","notification":"Warnings","value":"SI"},{"userId":"40","notification":"NewCups","value":"SI"}]}
}

/** defined to work easier with UserNotificationPreferences */
export interface ItemUI {
  name: string
  title: string
  description: string
  checked: boolean
  disabled: boolean
}
