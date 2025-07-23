import BaseRestService from '../common/BaseRestService'

class UserService extends BaseRestService {
  getSearchedUser(documentid: string, email: string, token: string) {

    if (documentid) {
      const superGet = super.get(`/users?limit=1&sort=userId&offset=0&filter=documentNumber::${documentid}`,
      {
        'Authorization': `Bearer ${token}`
      })
      return superGet
    }
  }

}

export default UserService