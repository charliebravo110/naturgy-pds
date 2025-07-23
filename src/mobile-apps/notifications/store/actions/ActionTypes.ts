import { Notification } from '../../notifications.interface'
export const SET_NOTIFICATIONS = '@@notifications/SET_NOTIFICATIONS'

interface SetNotifications {
  type: typeof SET_NOTIFICATIONS
  data: Notification[]
}

export type NotificationsActionTypes = SetNotifications
