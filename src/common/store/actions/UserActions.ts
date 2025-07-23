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
  SET_FRANJA_INICIO,
  SET_FRANJA_FIN,
  SET_FRANJA_INICIO_ESPECIAL,
  SET_FRANJA_FIN_ESPECIAL,
  SET_DESTINATARIO,
  SET_TIPO_CANAL,
  SET_USER_EXPIRES,
  SET_REFRESH_TOKEN,
  SET_USER_MFA,
  SET_USER_MFA_PHONE,
  SET_USER_ENABLED_MFA,
  SET_SESSION_TIME,
  SET_UPDATE_PASSWORD,
  UserActionTypes
} from '../../interfaces/UserActionTypes'
import UserProfile from '../../interfaces/UserProfile'

export function setFranjaHorarioInicio(franja:string): UserActionTypes {
  return {
    type: SET_FRANJA_INICIO,
    data:franja
  }
}

export function setFranjaHorarioFin(franja:string): UserActionTypes {
  return {
    type: SET_FRANJA_FIN,
    data:franja
  }
}

export function setFranjaHorarioInicioEspecial(franja:string): UserActionTypes {
  return {
    type: SET_FRANJA_INICIO_ESPECIAL,
    data:franja
  }
}

export function setFranjaHorarioFinEspecial(franja:string): UserActionTypes {
  return {
    type: SET_FRANJA_FIN_ESPECIAL,
    data:franja
  }
}


export function setTipoCanal(canal:string): UserActionTypes {
  return {
    type: SET_TIPO_CANAL,
    data:canal
  }
}

export function setDestinatario(destinatario:string): UserActionTypes {
  return {
    type: SET_DESTINATARIO,
    data:destinatario
  }
}
 
export function setToken(token: string): UserActionTypes {
  return {
    type: SET_TOKEN,
    data: token
  }
}

export function setPadlock(padlock: string): UserActionTypes {
  return {
    type: SET_PADLOCK,
    data: padlock
  }
}

export function resetToken(): UserActionTypes {
  return {
    type: RESET_TOKEN
  }
}

export function resetPadlock(): UserActionTypes {
  return {
    type: RESET_PADLOCK
  }
}

export function setUserProfile(profile: Array<UserProfile>): UserActionTypes {
  return {
    type: SET_USER_PROFILE,
    data: profile
  }
}

export function resetUserProfile(): UserActionTypes {
  return {
    type: RESET_USER_PROFILE
  }
}

export function setUserName(name: string): UserActionTypes {
  return {
    type: SET_USER_NAME,
    data: name
  }
}

export function setUserMail(mail: string): UserActionTypes {
  return {
    type: SET_USER_MAIL,
    data: mail
  }
}

export function setUserPhone(phone: string): UserActionTypes {
  return {
    type: SET_USER_PHONE,
    data: phone
  }
}

export function setUserRole(role: string): UserActionTypes {
  return {
    type: SET_USER_ROLE,
    data: role
  }
}

export function setUserGdprAccepted(gdprAccepted: any): UserActionTypes {
  return {
    type: SET_USER_GDPR_ACCEPTED,
    data: gdprAccepted
  }
}

export function setUserExpires(time: string): UserActionTypes {
  return {
    type: SET_USER_EXPIRES,
    data: time
  }
}

export function setSessionTime(time: string): UserActionTypes {
  return {
    type: SET_SESSION_TIME,
    data: time
  }
}

export function setUpdatePassword(days: string): UserActionTypes {
  return {
    type: SET_UPDATE_PASSWORD,
    data: days
  }
}

export function setRefreshToken(token: string): UserActionTypes {
  return {
    type: SET_REFRESH_TOKEN,
    data: token
  }
}

export function setUserMfa(channel: string): UserActionTypes {
  return {
    type: SET_USER_MFA,
    data: channel
  }
}

export function setUserMfaPhone(phone: string): UserActionTypes {
  return {
    type: SET_USER_MFA_PHONE,
    data: phone
  }
}

export function setUserEnabledMfa(enabled: string): UserActionTypes {
  return {
    type: SET_USER_ENABLED_MFA,
    data: enabled
  }
}
