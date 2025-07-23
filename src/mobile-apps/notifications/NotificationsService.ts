import BaseRestService from '../../common/BaseRestService'
import {
  Notification,
  GetNotificationParams,
  MarkNotificationAsReadParams,
  NotificationResponse, MarkNotificationResponse,
} from './notifications.interface'

const useMock = false

const SERVICE_URL = '/pushNotifications'

const mockNotifications: NotificationResponse = {
  'result': { 'codResult': '0000', 'msgResult': 'Operación realizada correctamente.' },
  'pushNotifications': {
    'pushNotificationsItem': [
      {
        'id': '53',
        'timestamp': '17/10/2023 15:08:14',
        'user_id': '148573',
        'document': '19191919Y',
        'title': 'Fin instalaciones particulares',
        'body': 'Solicitud EXP218420010150. Indícanos fecha fin de tus instalaciones particulares.',
        'ind_read': '0',
        'process': 'Hippo',
        'token': 'eQq07Fi7QqG6vFACZ_9DJX:APA91bF0F6YWJU5SiYo4fD_ojartRXnmR0mByicbSVUuAB5RuTPpXp3yajuijw8dtmD8f3PZyP9rsfu5045uX6URbufwhY_4eJg0W4dpHiPRl0-QRBXFBhuQ56tGPBNGTTkWX-Bs1jFW',
        'redirect_to': 'https://areaprivada.ufd.es/requests',
        'search_value': 'EXP218420010150',
        'lang': 'es',
      }, {
        'id': '52',
        'timestamp': '17/10/2023 15:08:13',
        'user_id': '148573',
        'document': '19191919Y',
        'title': 'Fin instalaciones particulares',
        'body': 'Solicitud EXP218419120022. Indícanos fecha fin de tus instalaciones particulares.',
        'ind_read': '0',
        'process': 'Hippo',
        'token': 'eQq07Fi7QqG6vFACZ_9DJX:APA91bF0F6YWJU5SiYo4fD_ojartRXnmR0mByicbSVUuAB5RuTPpXp3yajuijw8dtmD8f3PZyP9rsfu5045uX6URbufwhY_4eJg0W4dpHiPRl0-QRBXFBhuQ56tGPBNGTTkWX-Bs1jFW',
        'redirect_to': '/faqs',
        'search_value': 'EXP218419120022',
        'lang': 'es',
      }, {
        'id': '50',
        'timestamp': '17/10/2023 14:09:28',
        'user_id': '148573',
        'document': '19191919Y',
        'title': 'Fin instalaciones particulares',
        'body': 'Solicitud EXP218419120022. Indícanos fecha fin de tus instalaciones particulares.',
        'ind_read': '0',
        'process': 'Hippo',
        'token': 'eQq07Fi7QqG6vFACZ_9DJX:APA91bF0F6YWJU5SiYo4fD_ojartRXnmR0mByicbSVUuAB5RuTPpXp3yajuijw8dtmD8f3PZyP9rsfu5045uX6URbufwhY_4eJg0W4dpHiPRl0-QRBXFBhuQ56tGPBNGTTkWX-Bs1jFW',
        'redirect_to': 'https://areaprivada.ufd.es/provisions',
        'search_value': 'EXP218419120022',
        'lang': 'es',
      }, {
        'id': '51',
        'timestamp': '17/10/2023 14:09:28',
        'user_id': '148573',
        'document': '19191919Y',
        'title': 'Fin instalaciones particulares',
        'body': 'Solicitud EXP218420010150. Indícanos fecha fin de tus instalaciones particulares.',
        'ind_read': '0',
        'process': 'Hippo',
        'token': 'eQq07Fi7QqG6vFACZ_9DJX:APA91bF0F6YWJU5SiYo4fD_ojartRXnmR0mByicbSVUuAB5RuTPpXp3yajuijw8dtmD8f3PZyP9rsfu5045uX6URbufwhY_4eJg0W4dpHiPRl0-QRBXFBhuQ56tGPBNGTTkWX-Bs1jFW',
        'redirect_to': 'https://areaprivada.ufd.es/provisions',
        'search_value': 'EXP218420010150',
        'lang': 'es',
      }, {
        'id': '55',
        'timestamp': '03/10/2023 17:56:00',
        'user_id': '148573',
        'document': 'EXP928223020202',
        'title': 'CUPS disponible',
        'body': 'Solicitud EXP928223020202. Tienes ya disponibles los CUPS.',
        'ind_read': '0',
        'process': 'Hippo',
        'token': 'cPxbkYNEVkiKgx5U3Z_MjU:APA91bFww6TjvAZL9taM_J6Dw2xZF2vUWPMdjDWuPPQGVddLrQDX8pDjCJdzOa6B5mYW4LNuIhTxBT2-jW9Cl87BSJk_jItqjV6ediHUw4gvdfOyC7-K6MYfgvqAsgOlx_qroX88TnwG',
        'redirect_to': 'https://areaprivada.ufd.es/provisions',
        'search_value': 'EXP928223020202',
        'lang': 'es',
      }, {
        'id': '54',
        'timestamp': '03/10/2023 17:56:00',
        'user_id': '148573',
        'document': 'EXP928223020202',
        'title': 'CUPS disponible',
        'body': 'Solicitud EXP928223020202. Tienes ya disponibles los CUPS.',
        'ind_read': '0',
        'process': 'Hippo',
        'token': 'cPxbkYNEVkiKgx5U3Z_MjU:APA91bFww6TjvAZL9taM_J6Dw2xZF2vUWPMdjDWuPPQGVddLrQDX8pDjCJdzOa6B5mYW4LNuIhTxBT2-jW9Cl87BSJk_jItqjV6ediHUw4gvdfOyC7-K6MYfgvqAsgOlx_qroX88TnwG',
        'redirect_to': 'https://areaprivada.ufd.es/provisions',
        'search_value': 'EXP928223020202',
        'lang': 'es',
      }, {
        'id': '56',
        'timestamp': '03/10/2023 17:56:00',
        'user_id': '148573',
        'document': 'EXP928223020202',
        'title': 'CUPS disponible',
        'body': 'Solicitud EXP928223020202. Tienes ya disponibles los CUPS.',
        'ind_read': '0',
        'process': 'Hippo',
        'token': 'cPxbkYNEVkiKgx5U3Z_MjU:APA91bFww6TjvAZL9taM_J6Dw2xZF2vUWPMdjDWuPPQGVddLrQDX8pDjCJdzOa6B5mYW4LNuIhTxBT2-jW9Cl87BSJk_jItqjV6ediHUw4gvdfOyC7-K6MYfgvqAsgOlx_qroX88TnwG',
        'redirect_to': 'https://areaprivada.ufd.es/provisions',
        'search_value': 'EXP928223020202',
        'lang': 'es',
      }, {
        'id': '57',
        'timestamp': '12/07/2023 00:00:00',
        'user_id': '148573',
        'document': 'EXP918123070007',
        'title': 'Nuevo CUPS disponible',
        'body': 'Solicitud EXP918123070007. Tienes ya disponibles los CUPS.',
        'ind_read': '1',
        'process': 'NewCups',
        'token': 'dEPlZzbpSKGVwCv-eazdZV:APA91bFxJxQ5pXHUVl1qzdfcEDZwVb6BX6Ts-SUpiaPnRr2GRDpXkdxTlqDtm790eDy3OBJrcE_-LNkZKfKDMht8dKzrep',
        'redirect_to': 'https://areaprivada.ufd.es/provisions',
        'search_value': 'EXP918123070007',
        'lang': 'es',
      }, {
        'id': '58',
        'timestamp': '12/07/2023 00:00:00',
        'user_id': '148573',
        'document': 'EXP918123070007',
        'title': 'Pendiente resolución anomalías',
        'body': 'Solicitud EXP918123070007. Indícanos fecha resolución de anomalías detectadas.',
        'ind_read': '0',
        'process': 'Hippo',
        'token': 'dEPlZzbpSKGVwCv-eazdZV:APA91bFxJxQ5pXHUVl1qzdfcEDZwVb6BX6Ts-SUpiaPnRr2GRDpXkdxTlqDtm790eDy3OBJrcE_-LNkZKfKDMht8dKzrep',
        'redirect_to': 'https://areaprivada.ufd.es/provisions',
        'search_value': 'EXP918123070007',
        'lang': 'es',
      }],
  },
}

const setNotificationAsRead = ({ notification }: { notification: Notification }): Notification => ({
  ...notification,
  ind_read: '1',
})

class NotificationsService extends BaseRestService {
  getNotifications({ userId, lang, token }: GetNotificationParams): Promise<NotificationResponse> {
    if (!userId || !lang || !token) return Promise.reject('Invalid parameters')

    if (useMock) {
      return new Promise((resolve) => {
          setTimeout(() => {
            resolve(mockNotifications)
          }, 1000)
        },
      )
    }

    return super.get(`${SERVICE_URL}?filter=userId::${userId}%7Clang::${lang}`,
      {
        'Authorization': `Bearer ${token}`,
      })
  }

  markNotificationAsRead({
                           user_id,
                           notification_id,
                           token,
                         }: MarkNotificationAsReadParams): Promise<MarkNotificationResponse> {
    if (!notification_id || !user_id || !token) return Promise.reject('Invalid parameters')


    return super.post(`${SERVICE_URL}?filter=user_id::${user_id}%7Cid::${notification_id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
  }
}

export default NotificationsService
