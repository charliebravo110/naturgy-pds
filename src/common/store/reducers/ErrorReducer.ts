import {
  SHOW_ERROR,
  SET_MESSAGE,
  HIDE_ERROR,
  ErrorActionTypes
} from '../../interfaces/ErrorActionTypes'

const initialState = {
  code: '',
  message: '',
  service: ''
}

export function errorReducer(state = initialState, action: ErrorActionTypes): any {
  switch (action.type) {
    case SHOW_ERROR:
      return {
        ...state,
        code: action.data.error,
        service: action.data.service
      }

    case SET_MESSAGE:
      return {
        ...state,
        message: action.data
      }

    case HIDE_ERROR:
      return initialState

    default:
      return state
  }
}
