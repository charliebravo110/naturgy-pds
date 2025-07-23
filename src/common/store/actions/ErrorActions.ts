import {
  SHOW_ERROR,
  SET_MESSAGE,
  HIDE_ERROR
} from '../../interfaces/ErrorActionTypes'

export function showError(error: string, service?: string) {
  return {
    type: SHOW_ERROR,
    data: {
      error,
      service
    }
  }
}

export function setMessage(message: string) {
  return {
    type: SET_MESSAGE,
    data: message
  }
}

export function hideError() {
  return {
    type: HIDE_ERROR
  }
}
