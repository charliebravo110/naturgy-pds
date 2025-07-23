//CREAR INTERFAZ DE DELEGADO, Y SUPONGO QUE TAMBIEN DE LISTA DE DELEGADOS

export const SET_DELEGATES_LIST = '@@delegates/SET_DELEGATES_LIST'
export const RESET_DELEGATES_LIST = '@@delegates/RESET_DELEGATES_LIST'
export const SET_DELEGATE = '@@delegates/SET_DELEGATE'
export const RESET_DELEGATE = '@@delegates/RESET_DELEGATE'
export const SET_DELEGATE_NAME = '@@delegates/SET_DELEGATE_NAME'
export const SET_DELEGATE_MAIL = '@@delegates/SET_DELEGATE_MAIL'

interface SetDelegatesList {
  type: typeof SET_DELEGATES_LIST
  data: any
}

interface ResetDelegatesList {
  type: typeof RESET_DELEGATES_LIST
}

interface SetDelegate {
  type: typeof SET_DELEGATE
  data: any
}

interface ResetDelegate {
  type: typeof RESET_DELEGATE
}

interface SetDelegateName {
  type: typeof SET_DELEGATE_NAME
  data: string
}

interface SetDelegateMail {
  type: typeof SET_DELEGATE_MAIL
  data: string
}

export type DelegatesActionTypes = SetDelegatesList | ResetDelegatesList | SetDelegate | ResetDelegate | SetDelegateName | SetDelegateMail