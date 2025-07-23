import BaseRestService from '../../common/BaseRestService'

/** all backend endpoints usages by mobile apps extend this class */
export default class MobileAppsService extends BaseRestService {
  protected token: string
  protected userId: string

  constructor() {
    super()
    this.token = sessionStorage.getItem('token') || ''
    this.userId = sessionStorage.getItem('id') || ''
  }
}
