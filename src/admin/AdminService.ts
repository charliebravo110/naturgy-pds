import BaseRestService from '../common/BaseRestService'

class AdminService extends BaseRestService {
  getSearchedUser(documentid: string, email: string, cups: string, sr: string, name: string, token: string) {

    if (documentid) {
      return super.get(`/users?limit=1&sort=userId&offset=0&filter=documentNumber::${documentid}`,
        {
          'Authorization': `Bearer ${token}`
        })
    }
    if (email) {
      return super.get(`/users?limit=1&sort=userId&offset=0&filter=email::${email}`,
        {
          'Authorization': `Bearer ${token}`
        })
    }
    if (cups) {
      return super.get(`/users?limit=1&sort=userId&offset=0&filter=cups::${cups}`,
        {
          'Authorization': `Bearer ${token}`
        })
    }
    if (name) {
      return super.get(`/users?limit=1&sort=userId&offset=0&filter=name::${name}`,
        {
          'Authorization': `Bearer ${token}`
        })
    }

  }

  getSearchedUserLimit25(documentid: string, email: string, cups: string, sr: string, name: string, token: string) {

    if (documentid) {
      return super.get(`/users?limit=25&sort=userId&offset=0&filter=documentNumber::${documentid}`,
        {
          'Authorization': `Bearer ${token}`
        })
    }
    if (email) {
      return super.get(`/users?limit=25&sort=userId&offset=0&filter=email::${email}`,
        {
          'Authorization': `Bearer ${token}`
        })
    }
    if (cups) {
      return super.get(`/users?limit=25&sort=userId&offset=0&filter=cups::${cups}`,
        {
          'Authorization': `Bearer ${token}`
        })
    }
    if (name) {
      return super.get(`/users?limit=25&sort=userId&offset=0&filter=name::${name}`,
        {
          'Authorization': `Bearer ${token}`
        })
    }

  }

  getSearchedUser2(documents: string[], token: string) {

    if (documents) {
      return super.get(`/users?sort=userId&offset=0&filter=documentNumber~~${documents}`,
        {
          'Authorization': `Bearer ${token}`
        })
    }

  }

  supplantUser(userId: string, token: string) {
    return super.post('/login', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        userId: userId
      }
    })
  }

  getNotRegisteredUser(documentid: string, name: string, token: string) {
    if (documentid) {
      return super.get(`/customers?filter=docNumber::${documentid}`,
        {
          'Authorization': `Bearer ${token}`
        })
    }
    if (name) {
      return super.get(`/customers?filter=name::${name}`,
        {
          'Authorization': `Bearer ${token}`
        })
    }

  }

  getCustomers(documentid:string, token:string) {
    return super.get(`/customers?filter=docNumber::${documentid}`,
      {
        'Authorization': `Bearer ${token}`
      })
  }

  getUserByParam(cups: string, sr: string, token: string) {
    if (cups) {
      return super.get(`/searchUserByParam?filter=cups::${cups}`,
        {
          'Authorization': `Bearer ${token}`
        })
    }
    if (sr) {
      return super.get(`/searchUserByParam?filter=sr::${sr}`,
        {
          'Authorization': `Bearer ${token}`
        })
    }

  }

}

export default AdminService