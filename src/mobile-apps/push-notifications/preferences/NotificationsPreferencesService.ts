import { NOTIFICATION_NAME_LIST } from '../../common/configAndConstants'
import MobileAppsService from '../../common/MobileAppsService'
import { UserNotificationPreferences } from './interfaces'

// LCS: Importa la función - Wave 1
import { sendGAEvent } from '../../../core/utils/gtm';

export default class NotificationsPreferencesService extends MobileAppsService {
  /** the call itself, not callable, used by readAndAdaptUserNotificationsPreferences */
  private readUserNotificationsPreferences() {
    return super.get(`/userNotifications?filter=userId::${this.userId}`, {
      Authorization: `Bearer ${this.token}`,
    })
  }
  /** uses readUserNotificationsPreferences */
  async readAndAdaptUserNotificationsPreferences(): Promise<UserNotificationPreferences> {
    const msgError = 'Error al obtener las preferencias de notificaciones del usuario:'
    const initialData: UserNotificationPreferences = {
      items: NOTIFICATION_NAME_LIST.map((name) => ({
        userId: this.userId,
        notification: name,
        value: 'NO',
      })),
    } as UserNotificationPreferences
    try {

      // LCS: Registrar el tiempo inicial - Wave 1
      const startTime = performance.now();

      const response = await this.readUserNotificationsPreferences()

      // Registrar el tiempo final y calcular la duración - Wave 1
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      // LCS: Enviar evento a GA para medir el tiempo - Wave 1
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'get /userNotifications?filter=userId::'+this.userId,
          apiUrlShort: 'get /userNotifications',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });

      let data: UserNotificationPreferences | null
      // fill data
      switch (true) {
        case response.result.codResult !== '0000':
          data = initialData
          console.error(msgError, response)
          break

        case '{}' === JSON.stringify(response.userNotifications):
          // backend replies with an empty object when the user has no preferences set yet,
          // we agreed to convert it to the interface with all the preferences set to 'NO'
          data = initialData
          break

        default:
          // normal flow
          data = { items: response.userNotifications.items }
          break
      }
      return data
    } catch (e){
      console.error(msgError, e)
      // LCS: Enviar evento de error a GA - Wave 1
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
          error: e,
          reactComponent: 'NotificationsPreferencesService.ts - readAndAdaptUserNotificationsPreferences',
          apiUrl: 'get /userNotifications?filter=userId::'+this.userId,
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
      return initialData
    }
  }

  /** the call itself, not callable, used by updateUserNotificationsPreferencesAndReplyBoolean */
  private updateUserNotificationsPreferences(userNotificationPreferences: UserNotificationPreferences) {
    return super.put(`/userNotifications`, {
      headers: { Authorization: `Bearer ${this.token}` },
      body: userNotificationPreferences,
    })
  }
  /** uses updateUserNotificationsPreferences */
  async updateUserNotificationsPreferencesAndReplyBoolean(userNotificationPreferences: UserNotificationPreferences) {
    const msgError = 'Error al guardar las preferencias de notificaciones del usuario:'
    try {
      // LCS: Registrar el tiempo inicial - Wave 1
      const startTime = performance.now();
      const response = await this.updateUserNotificationsPreferences(userNotificationPreferences)
      // Registrar el tiempo final y calcular la duración - Wave 1
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      // LCS: Enviar evento a GA para medir el tiempo - Wave 1
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'put /userNotifications',
          apiUrlShort: 'put /userNotifications',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });
      if (response.result.codResult !== '0000') {
        console.error(msgError, response)
        return false
      }
      return true // normal flow
    } catch (e){
      console.error(msgError, e)
      // LCS: Enviar evento de error a GA - Wave 1
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
          error: e,
          reactComponent: 'NotificationsPreferencesService.ts - updateUserNotificationsPreferencesAndReplyBoolean',
          apiUrl: 'put /userNotifications',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
      return false
    }
  }
}
