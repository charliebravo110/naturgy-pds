import {
  SET_USER,
  SET_PASSWORD,
  SET_EMAIL,
  SET_PHONE,
  RESET_LOGIN_STATE,
  LoginActionTypes,
  SET_REMEMBER_CHECK
} from '../../interfaces/ActionsTypes'
import LoginData from '../../interfaces/LoginData'

const initialState: LoginData = {
  user: '',
  password: '',
  email: '',
  phone: '',
  rememberCheck: false
}

export function loginReducer(state = initialState, action: LoginActionTypes): LoginData {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.data
      }

    case SET_PASSWORD:
      return {
        ...state,
        password: action.data
      }

    case SET_EMAIL:
      return {
        ...state,
        email: action.data
      }

    case SET_PHONE:
      return {
        ...state,
        phone: action.data
      }

    case RESET_LOGIN_STATE:
      return initialState

    case SET_REMEMBER_CHECK:
      const value =  {
        ...state,
        rememberCheck: action.data
      }
      return value
    default:
      return state
  }
}