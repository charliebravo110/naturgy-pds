export const SHOW_ERROR = '@@error/SHOW_ERROR'
export const SET_MESSAGE = '@@error/SET_MESSAGE'
export const HIDE_ERROR = '@@error/HIDE_ERROR'

interface ShowError {
  type: typeof SHOW_ERROR
  data: any
}

interface SetMessage {
  type: typeof SET_MESSAGE
  data: string
}

interface HideError {
  type: typeof HIDE_ERROR
}

export type ErrorActionTypes = ShowError | SetMessage | HideError
