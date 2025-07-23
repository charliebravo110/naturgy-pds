import BaseRestService from '../common/BaseRestService'

class PreSignUpService extends BaseRestService {

  doPreSignUp(body: any, token: string) {
    return super.post('/preregistration/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body
    })
  }

}

export default PreSignUpService
