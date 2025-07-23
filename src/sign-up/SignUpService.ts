import BaseRestService from '../common/BaseRestService'
import SignUpFormData from './interfaces/SignUpFormData'

class SignUpService extends BaseRestService {
  sendForm(signForm: SignUpFormData) {
    return super.post('/registration/users', {
      body: signForm
    })
  }
  sendFormVerification(signForm: SignUpFormData) {
    return super.post('/registration/users', {
      body: signForm
    })
  }



  resendEmail(id: string) {
    return super.get(`/registration/users/${id}`)
  }


  activateUser(hash: string, email: string) {
    return super.put(`/registration/users/${hash}`, {
      body: {
        email,
        hash
      }
    })
  }
}

export default SignUpService
