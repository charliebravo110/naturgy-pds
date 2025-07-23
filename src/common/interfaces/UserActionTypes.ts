import UserProfile from './UserProfile'

export const SET_TOKEN = '@@user/SET_TOKEN'
export const SET_PADLOCK = '@@user/SET_PADLOCK'
export const RESET_TOKEN = '@@user/RESET_TOKEN'
export const RESET_PADLOCK = '@@user/RESET_PADLOCK'
export const SET_USER_PROFILE = '@@user/SET_USER_PROFILE'
export const RESET_USER_PROFILE = '@@user/RESET_USER_PROFILE'
export const SET_USER_NAME = '@@user/SET_USER_NAME'
export const SET_USER_MAIL = '@@user/SET_USER_MAIL'
export const SET_USER_PHONE = '@@user/SET_USER_PHONE'
export const SET_USER_ROLE = '@@user/SET_USER_ROLE'
export const SET_USER_GDPR_ACCEPTED = '@@user/SET_USER_GDPR_ACCEPTED'
export const SET_FRANJA_INICIO = '@@user/SET_FRANJA_HORARIO_INICIO'
export const SET_FRANJA_FIN = '@@user/SET_FRANJA_HORARIO_FIN'
export const SET_FRANJA_INICIO_ESPECIAL = '@@user/SET_FRANJA_HORARIO_INICIO_ESPECIAL'
export const SET_FRANJA_FIN_ESPECIAL = '@@user/SET_FRANJA_HORARIO_FIN_ESPECIAL'
export const SET_TIPO_CANAL = '@@user/SET_TIPO_CANAL'
export const SET_DESTINATARIO = '@@user/SET_DESTINATARIO'
export const SET_USER_EXPIRES = '@@user/SET_USER_EXPIRES'
export const SET_REFRESH_TOKEN = '@@user/SET_REFRESH_TOKEN'
export const SET_USER_MFA = '@@user/SET_USER_MFA'
export const SET_USER_ENABLED_MFA = '@@user/SET_USER_ENABLED_MFA'
export const SET_USER_MFA_PHONE = '@@USER/SET_USER_MFA_PHONE'
export const SET_SESSION_TIME = '@@USER/SET_SESSION_TIME'
export const SET_UPDATE_PASSWORD = '@@USER/SET_UPDATE_PASSWORD'


interface SetTipoCanal {
  type: typeof SET_TIPO_CANAL
  data: string
}
interface SetFranjaInicio {
  type: typeof SET_FRANJA_INICIO
  data: string
}
interface SetFranjaFin {
  type: typeof SET_FRANJA_FIN
  data: string
}
interface SetFranjaInicioEspecial {
  type: typeof SET_FRANJA_INICIO_ESPECIAL
  data: string
}
interface SetFranjaFinEspecial {
  type: typeof SET_FRANJA_FIN_ESPECIAL
  data: string
}
interface SetDestinatario {
  type: typeof SET_DESTINATARIO
  data: string
}
interface SetToken {
  type: typeof SET_TOKEN
  data: string
}

interface SetPadlock {
  type: typeof SET_PADLOCK
  data: string
}

interface ResetToken {
  type: typeof RESET_TOKEN
}

interface ResetPadlock {
  type: typeof RESET_PADLOCK
}
interface SetUserProfile {
  type: typeof SET_USER_PROFILE
  data: Array<UserProfile>
}

interface ResetUserProfile {
  type: typeof RESET_USER_PROFILE
}

interface SetUserName {
  type: typeof SET_USER_NAME
  data: string
}

interface SetUserMail {
  type: typeof SET_USER_MAIL
  data: string
}

interface SetUserPhone {
  type: typeof SET_USER_PHONE
  data: string
}

interface SetUserRole {
  type: typeof SET_USER_ROLE
  data: string
}

interface SetUserGdprAccepted {
  type: typeof SET_USER_GDPR_ACCEPTED
  data: any
}

export type UserActionTypes = SetToken | SetPadlock | ResetToken | ResetPadlock | SetUserProfile | ResetUserProfile | SetUserName | SetUserMail | SetUserPhone | SetUserRole | SetUserGdprAccepted | SetUserExpires | SetRefreshToken | SetUserMfa | SetUserMfaPhone | SetSessionTime | SetUpdatePassword | SetUserEnabledMfa  | SetFranjaInicio | SetFranjaFin | SetFranjaInicioEspecial | SetFranjaFinEspecial | SetTipoCanal | SetDestinatario
interface SetUserExpires {
  type: typeof SET_USER_EXPIRES
  data: string
}

interface SetRefreshToken {
  type: typeof SET_REFRESH_TOKEN
  data: string
}

interface SetUserMfa {
  type: typeof SET_USER_MFA
  data: string
}

interface SetUserEnabledMfa {
  type: typeof SET_USER_ENABLED_MFA
  data: string
}

interface SetUserMfaPhone {
  type: typeof SET_USER_MFA_PHONE
  data: string
}

interface SetSessionTime {
  type: typeof SET_SESSION_TIME
  data: string
}

interface SetUpdatePassword {
  type: typeof SET_UPDATE_PASSWORD
  data: string
}
