export interface Notification {
  id: string;
  timestamp: string;
  user_id: string;
  document: string;
  title: string;
  body: string;
  ind_read: '0' | '1';
  process: string;
  token: string;
  redirect_to: string;
  search_value: string;
  lang: 'es' | 'en';
}
export interface NotificationResponse {
  result:{
    codResult: string;
    msgResult: string;
  },
  pushNotifications?: {
    pushNotificationsItem: Notification[]
  }
}
export interface MarkNotificationResponse extends Notification{
  result:{
    codResult: string;
    msgResult: string;
  },
}

export interface GetNotificationParams {
  userId: string,
  lang: string,
  token: string
}

export interface MarkNotificationAsReadParams {
  token: string
  user_id: string,
  notification_id: string
}
