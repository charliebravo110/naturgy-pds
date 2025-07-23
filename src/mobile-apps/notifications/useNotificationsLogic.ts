import { useTranslation } from 'react-i18next'
import { MarkNotificationAsReadParams, MarkNotificationResponse, Notification } from './notifications.interface'
import { useHistory } from 'react-router'
import NotificationsService from './NotificationsService'

export default function useNotificationsLogic() {
  const { t } = useTranslation()
  const history = useHistory()
  const notificationsService = new NotificationsService()

  /**
   * This method returns the notifications filtered by searchValue
   * @param searchValue
   * @param notifications
   */
  const getFilteredNotifications = ({ searchValue, notifications }: {
    searchValue: string,
    notifications: Notification[]
  }): Notification[] => notifications.filter((notification: Notification) => notification.title.toLowerCase().includes(searchValue.toLowerCase()))

  /**
   * This method marks a notification as read
   * @param notification
   * @param userId
   * @param token
   */
  const markNotificationAsRead = async ({
                                          user_id,
                                          token,
                                          notification_id
                                        }: MarkNotificationAsReadParams): Promise<MarkNotificationResponse> => {
    return notificationsService.markNotificationAsRead({
      user_id,
      token,
      notification_id
    })
  }

  /**
   * This method redirects to the notification detail
   * @param notification
   */
  const goToNotificationDetail = ({ notification }: { notification: Notification }) => {
    history.push('/notifications/detail', { notification })
  }

  return { t, getFilteredNotifications, markNotificationAsRead, goToNotificationDetail }
}
