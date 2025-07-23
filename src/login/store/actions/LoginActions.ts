import {
  LOGIN,
  SET_USER,
  SET_PASSWORD,
  SET_EMAIL,
  SET_PHONE,
  RESET_LOGIN_STATE,
  LoginActionTypes,
  SET_REMEMBER_CHECK,
} from '../../interfaces/ActionsTypes'
import LoginData from '../../interfaces/LoginData'

export function login(credentials: LoginData): LoginActionTypes {
  return {
    type: LOGIN,
    data: credentials
  }
}

export function setUser(user: string): LoginActionTypes {
  return {
    type: SET_USER,
    data: user
  }
}

export function setPassword(password: string): LoginActionTypes {
  return {
    type: SET_PASSWORD,
    data: password
  }
}

export function setEmail(email: string): LoginActionTypes {
  return {
    type: SET_EMAIL,
    data: email
  }
}

export function setPhone(phone: string): LoginActionTypes {
  return {
    type: SET_PHONE,
    data: phone
  }
}

export function resetLoginState() :LoginActionTypes {
  return {
    type: RESET_LOGIN_STATE
  }
}

export function setRememberCheck(status: boolean): LoginActionTypes {
  return {
    type: SET_REMEMBER_CHECK,
    data: status
  }
}