import { NotificationsActionTypes, SET_NOTIFICATIONS } from './ActionTypes';
import { Notification } from '../../notifications.interface'

export function setNotifications(list: Notification[]): NotificationsActionTypes {
  return {
    type: SET_NOTIFICATIONS,
    data: list
  }
}
