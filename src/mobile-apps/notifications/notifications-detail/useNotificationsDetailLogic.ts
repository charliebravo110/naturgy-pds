import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { Notification } from '../notifications.interface'

export default function useNotificationsDetailLogic() {
  const { t } = useTranslation()
  const location = useLocation()

  const { notification } = location.state as { notification: Notification } ?? {}

  /**
   * This method returns the notification from the route state
   */
  const getNotification = (): Notification => notification

  return { t, getNotification }
}
