import BaseRestService from '../common/BaseRestService'
import LoginData from './interfaces/LoginData'
import LoginCode from './interfaces/LoginCode'

class LoginService extends BaseRestService {
  doLogin(credentials: LoginData) {
    return super.post('/login', {
      body: {
        user: credentials.user,
        password: credentials.password
      }
    })
  }
  doPaymentBridgeLogin(user: string, password: string) {
    return super.post('/login', {
      body: {
        user: user,
        password: password
      }
    })
  }

  doVerifyLogin(credentials: LoginData, token: string) {
    return super.post('/login', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        user: credentials.user,
        password: credentials.password
      }
    })
  }

  doFirstLogin(credentials: LoginData) {
    return super.post('/login', {
      body: {
        user: credentials.user,
        password: credentials.password
      }
    })
  }

  doCodeLogin(credentials: LoginCode) {
    return super.get(`/login?code=${credentials.code}&state=${credentials.state}`)
  }

  doMFALogin(credentials: LoginData) {
    return super.post('/login', {
      body: {
        user: credentials.user,
        password: credentials.password,
        mfa_code: credentials.mfa_code
      }
    })
  }

  doMigrateLogin(credentials: LoginData) {
    return super.post('/login', {
      body: {
        user: credentials.user,
        newpassword: credentials.password,
        confirmation_code: credentials.mfa_code
      }
    })
  }

  resetPassword(formData: LoginData) {
    return super.post('/passwordreminder', {
      body: {
        user: formData.user,
        email: formData.email,
        phone: ''
      }
    })
  }
  resetPassword2(formData: LoginData) {
    return super.post('/passwordreminder', {
      body: {
        user: formData.user,
        email: formData.email,
        phone: formData.phone
      }
    })
  }
  updatePassword(email: string, newPassword: string, id: string) {
    return super.post(`/passwordreminder/${id}`, {
      body: {
        newPassword,
        email,
        hash: id
      }
    })
  }
  sendUser(user: string) {
    return super.post('/loginUser', {
      body: {
        user,
      }
    })
  }
  updatePhone(user: string, phone: string, token: string) {
    return super.put(`/users/${user}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        mfaPhone: phone,
        mfaChanel: 'sms'
      }
    })
  }
  updateMfaConfiguration(user: string, documentNumber:string, channel: string, phone: string, mfaEnabled: string, token: string) {
    return super.put(`/users/${user}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        ...(phone !== '' && { mfaPhone: phone }),
        mfaEnabled,
        mfaChanel: channel,
        documentNumber
      }
    })
  }

  doRefreshToken(token: string, refreshToken: string, user: string ) {
    return super.put(`/tokens`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        user: user,
        refresh_token: refreshToken,
      }
    })
  }
}
export default LoginService
