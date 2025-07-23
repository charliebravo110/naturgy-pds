import MobileAppsService from '../../common/MobileAppsService'
import { MobileDeviceDetails } from './interfaces'

export default class MobileDeviceDetailsService extends MobileAppsService {
  /** the call itself, not callable, used by updateUserNotificationsPreferencesAndReplyBoolean */
  private updateMobileDeviceDetails(mobileDeviceDetails: MobileDeviceDetails) {
    return super.post(`/device`, {
      headers: { Authorization: `Bearer ${this.token}` },
      body: mobileDeviceDetails,
    })
  }
  /** uses updateUserNotificationsPreferences */
  async updateMobileDeviceDetailsAndReplyBoolean(mobileDeviceDetails: MobileDeviceDetails) {
    const msgError = 'Error al guardar los detalles del dispositivo móvil:'
    try {
      const response = await this.updateMobileDeviceDetails(mobileDeviceDetails)
      if (response.result.codResult !== '0000') {
        console.error(msgError, response)
        return false
      }
      return true // normal flow
    } catch (e) {
      console.error(msgError, e)
      return false
    }
  }
}
