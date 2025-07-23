import {
  SET_TOKEN,
  SET_PADLOCK,
  RESET_TOKEN,
  RESET_PADLOCK,
  SET_USER_PROFILE,
  RESET_USER_PROFILE,
  SET_USER_NAME,
  SET_USER_MAIL,
  SET_USER_PHONE,
  SET_USER_ROLE,
  SET_USER_GDPR_ACCEPTED,
  SET_USER_EXPIRES,
  SET_REFRESH_TOKEN,
  SET_USER_MFA,
  SET_USER_ENABLED_MFA,
  SET_USER_MFA_PHONE,
  SET_SESSION_TIME,
  SET_UPDATE_PASSWORD,
  SET_FRANJA_INICIO,
  SET_FRANJA_FIN,
  SET_FRANJA_INICIO_ESPECIAL,
  SET_FRANJA_FIN_ESPECIAL,
  SET_DESTINATARIO,
  SET_TIPO_CANAL,
  UserActionTypes
} from '../../interfaces/UserActionTypes'
import UserData from '../../../login/interfaces/UserData'

const initialState: UserData = {
  token: '',
  padlock: '',
  expires: '',
  refreshToken: '',
  sessionTime: '',
  lastPasswordChange: '',
  profile: {
    roles: ''
  }
}

export function userReducer(state = initialState, action: UserActionTypes): UserData {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        token: action.data
      }
    case SET_REFRESH_TOKEN:
      return {
        ...state,
        refreshToken: action.data
      }
    case SET_PADLOCK:
      return {
        ...state,
        padlock: action.data
      }

    case RESET_TOKEN:
      return initialState

    case RESET_PADLOCK:
      return initialState

    case SET_USER_PROFILE:
      return {
        ...state,
        profile: action.data
      }

    case RESET_USER_PROFILE:
      return {
        ...state,
        profile: initialState.profile
      }

    case SET_USER_NAME:
      return {
        ...state,
        profile: {
          ...state.profile,
          name: action.data
        }
      }

    case SET_USER_MAIL:
      return {
        ...state,
        profile: {
          ...state.profile,
          email: action.data
        }
      }

    case SET_USER_PHONE:
      return {
        ...state,
        profile: {
          ...state.profile,
          phone: action.data
        }
      }

    case SET_USER_ROLE:
      return {
        ...state,
        profile: {
          ...state.profile,
          roles: action.data
        }
      }

    case SET_USER_GDPR_ACCEPTED:
      return {
        ...state,
        profile: {
          ...state.profile,
          gdprAccepted: action.data
        }
      }
    case SET_USER_EXPIRES:
      return {
        ...state,
        expires: action.data
      }

    case SET_USER_MFA:
      return {
        ...state,
        profile: {
          ...state.profile,
          mfaChanel: action.data
        }
      }
    case SET_USER_ENABLED_MFA:
      return {
        ...state,
        profile: {
          ...state.profile,
          mfaEnabled: action.data
        }
      }
    case SET_USER_MFA_PHONE:
      return {
        ...state,
        profile: {
          ...state.profile,
          mfaPhone: action.data
        }
      }
    case SET_SESSION_TIME:
      return {
        ...state,
        sessionTime: action.data
      }
    case SET_UPDATE_PASSWORD:
      return {
        ...state,
        lastPasswordChange: action.data
      }

      case SET_FRANJA_INICIO:
        return {
          ...state,
          profile: {
            ...state.profile,
            franjaInicio: action.data
          }
        }
  
        case SET_FRANJA_FIN:
        return {
          ...state,
          profile: {
            ...state.profile,
            franjaFin: action.data
          }
        }
  
        case SET_FRANJA_INICIO_ESPECIAL:
        return {
          ...state,
          profile: {
            ...state.profile,
            franjaInicioEspecial: action.data
          }
        }
  
        case SET_FRANJA_FIN_ESPECIAL:
        return {
          ...state,
          profile: {
            ...state.profile,
            franjaFinEspecial: action.data
          }
        }
  
        case SET_TIPO_CANAL:
        return {
          ...state,
          profile: {
            ...state.profile,
            tipoCanal: action.data
          }
        }
  
        case SET_DESTINATARIO:
        return {
          ...state,
          profile: {
            ...state.profile,
            destinatario: action.data
          }
        }
  

    default:
      return state
  }
}
