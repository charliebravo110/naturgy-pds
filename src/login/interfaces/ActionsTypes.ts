import LoginData from './LoginData'

export const LOGIN = '@@login/LOGIN'
export const SET_USER = '@@login/SET_USER'
export const SET_PASSWORD = '@@login/SET_PASSWORD'
export const SET_EMAIL = '@@login/SET_EMAIL'
export const SET_PHONE = '@@login/SET_PHONE'
export const RESET_LOGIN_STATE = '@@login/RESET_LOGIN_STATE'
export const SET_REMEMBER_CHECK = '@@login/SET_REMEMBER_CHECK'

interface Login {
  type: typeof LOGIN
  data: LoginData
}

interface SetUser {
  type: typeof SET_USER
  data: string
}

interface SetPassword {
  type: typeof SET_PASSWORD
  data: string
}

interface SetEmail {
  type: typeof SET_EMAIL
  data: string
}
interface SetPhone {
  type: typeof SET_PHONE
  data: string
}

interface ResetLoginState {
  type: typeof RESET_LOGIN_STATE
}

interface SetRememberCheck {
  type: typeof SET_REMEMBER_CHECK
  data: boolean
}

export type LoginActionTypes = Login | SetUser | SetPassword | ResetLoginState | SetEmail | SetPhone | SetRememberCheck
