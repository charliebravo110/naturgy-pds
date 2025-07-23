import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications'
import { useEffect } from 'react'
import { useHistory } from 'react-router'
import { isAndroid, isIos, isWeb } from '../../common/detectPlatform'
import { ROUTES } from '../../../common/RouterConfig'
import { LocalNotificationSchema, LocalNotifications } from '@capacitor/local-notifications'
import { getNotificationPathRedirectTo } from '../../common/useCommonStuff'
import { GetNotificationParams, Notification } from '../../notifications/notifications.interface'
import { setNotifications } from '../../notifications/store/actions/NotificationsActions'
import NotificationsService from '../../notifications/NotificationsService'
import { useDispatch } from 'react-redux'
import useNotificationsLogic from '../../notifications/useNotificationsLogic'
//import jwt_decode from 'jwt-decode'

const notificationsService = new NotificationsService()

/** handles received push notifications, does nothing if platform is web */
export default function PushNotificationsListener() {
  const history = useHistory()
  const dispatch = useDispatch()
  const { markNotificationAsRead } = useNotificationsLogic()

  // useEffect(() => {
  //   if (isWeb()) return

  //   addListeners()
  // }, [])

  /**
   * Check if token is alive
   * @param token
   */
  // const checkAliveToken = (token: string) => {
  //   if (!token) return false
  //   const decoded: any = jwt_decode(token)
  //   const now = Date.now().valueOf() / 1000
  //   return decoded?.exp >= now
  // }

  // const updateNotifications = async ({notification, updateNotificationList, notificationParams}: {notification: PushNotificationSchema| LocalNotificationSchema, updateNotificationList: boolean, notificationParams: GetNotificationParams}) => {
  //   const { userId, lang, token } = notificationParams

  //   // If token is expired, do nothing
  //   if (!checkAliveToken(token)) return;

  //   // Schema is different for push notifications and local notifications
  //   const data = 'data' in notification ? notification.data : notification.extra.data;

  //   markNotificationAsRead({
  //     user_id: userId,
  //     notification_id: data.notification_id,
  //     token,
  //   }).then((response) => {
  //     console.debug(`Notification ${data.notification_id} updated successfully`)
  //   }).catch((error) => {
  //     console.error('Error updating notification as read:', error)
  //   })

  //   //  Update notifications when push notification opened from foreground.
  //   if (updateNotificationList) {
  //     await getNotifications({ userId, lang, token })
  //   }
  // }

  const getNotifications = async ({userId, lang, token}: {userId: string, lang: string, token: string}) => {
    notificationsService.getNotifications({ userId, lang, token }).then((response) => {
      const notifications = (response?.pushNotifications?.pushNotificationsItem as Notification[]) ?? []
      dispatch(setNotifications(notifications ?? []))
    }).catch((error) => {
      console.error('Error loading notifications:', error)
    })
  }

  const redirectIfRouteExists = ({redirectTo, extra}:{redirectTo: string, extra: any}) => {
    // Prepare the redirectTo url due to the wrong format received from the backend
    redirectTo = getNotificationPathRedirectTo({ redirectTo, search_value: extra.data.document })

    const routeExists = ROUTES.find((route) => redirectTo.includes(route.url))

    if (!routeExists) {
      console.debug('push notification received with data.redirect_to that does NOT exist in ROUTES: ', redirectTo)
      return
    }

    history.push(redirectTo)
  }


  // async function addListeners() {
  //   await PushNotifications.addListener('pushNotificationReceived', async (notification) => {
  //     // this occurs when the app is in foreground and the notification is received
  //     // ℹ️
  //     /* maybe redirect? No, here doing nothing on purpose, because we chose to show the notification even if the app is in foreground
  //      * (which is not the default behaviour, acheived via capacitor.config.ts ). And this way the user can tap the notification,
  //      * and when he does the event 'pushNotificationActionPerformed' will be fired, wich will handle the redirect there. */

  //     // The following workaround is needed until capacitor accepts the PRs to fix the issue explained in src/mobile-apps/_how-its-made/issueNotificationsAndroidForeground.md

  //     // only for android, a custom channel with importance 4 is needed to show the notification on top of the foreground app
  //     const myChannelId = 'myHighImportanceChannelId'
  //     if (isAndroid()) {
  //       const { channels } = await LocalNotifications.listChannels()
  //       const found = channels.find((channel) => channel.id === myChannelId)
  //       if (!found)
  //         await LocalNotifications.createChannel({ id: myChannelId, name: `${myChannelId}Name`, importance: 4 })
  //     }
  //     const oneNotification: LocalNotificationSchema = {
  //       title: notification.title,
  //       body: notification.body,
  //       id: Math.floor(Math.random() * (2147483647 - -2147483648 + 1)) + -2147483648, // random between -2147483648 and 2147483647
  //       schedule: { at: new Date(Date.now() + 1000) }, // 1 second from now
  //       extra: { data: notification.data }, // might contain redirect_to
  //       channelId: isAndroid() ? myChannelId : undefined,
  //     }
  //     await LocalNotifications.schedule({ notifications: [oneNotification] })

  //     const token = sessionStorage.getItem('token')
  //     if (checkAliveToken(token)){
  //       // Load again all notifications to update the list with the new notification
  //       await getNotifications({
  //         userId: notification.data.user_id,
  //         lang: sessionStorage.getItem('lang') || 'es',
  //         token,
  //       })
  //     }
  //   })

  //   await PushNotifications.addListener('pushNotificationActionPerformed', async ({ actionId, notification }) => {
  //     // this occurs when the user does some action on a notification

  //     // maybe redirect?
  //     const redirectTo = notification.data.redirect_to
  //     // ℹ️ data.redirect_to is optionally set in the backend when sending the notification. The name is arbitrary.
  //     if (actionId === 'tap') {
  //       const token = sessionStorage.getItem('token')

  //       await updateNotifications({
  //         notification,
  //         updateNotificationList: true,
  //         notificationParams: {
  //           userId: notification.data.user_id,
  //           lang: sessionStorage.getItem('lang') || 'es',
  //           token,
  //         },
  //       })

  //       if (redirectTo) redirectIfRouteExists({ redirectTo, extra: notification.data })
  //     }
  //   })

  //   await LocalNotifications.addListener('localNotificationActionPerformed', async ({ actionId, notification }) => {
  //     // maybe redirect?
  //     const redirectTo = notification.extra.data.redirect_to

  //     if (actionId === 'tap') {
  //       const token = sessionStorage.getItem('token')

  //       await updateNotifications({
  //         notification,
  //         updateNotificationList: true,
  //         notificationParams: {
  //           userId: notification.extra.data.user_id,
  //           lang: sessionStorage.getItem('lang') || 'es',
  //           token,
  //         },
  //       })

  //       if (redirectTo) redirectIfRouteExists({ redirectTo, extra: notification.extra })
  //     }
  //   })
  // }


  return null
}
