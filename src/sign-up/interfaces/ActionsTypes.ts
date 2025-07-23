export const SET_EMAIL = '@@login/SET_EMAIL'
export const RESET_LOGIN_STATE = '@@login/RESET_LOGIN_STATE'

interface SetEmail {
  type: typeof SET_EMAIL
  data: string
}

interface ResetLoginState {
  type: typeof RESET_LOGIN_STATE
}

export type SignUpActionTypes = ResetLoginState | SetEmail