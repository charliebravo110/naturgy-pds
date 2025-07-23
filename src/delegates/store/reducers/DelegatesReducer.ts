import {
  SET_DELEGATES_LIST,
  RESET_DELEGATES_LIST,
  SET_DELEGATE,
  RESET_DELEGATE,
  SET_DELEGATE_NAME,
  SET_DELEGATE_MAIL,
  DelegatesActionTypes
} from '../../interfaces/ActionTypes'

const initialState: any = {
  delegatesList: '',
  currentDelegate: {
    roles: ''
  }
}

export function delegatesReducer(state = initialState, action: DelegatesActionTypes): any {
  switch (action.type) {
    case SET_DELEGATES_LIST:
      return {
        ...state,
        delegatesList: action.data
      }

    case RESET_DELEGATES_LIST:
    return {
      ...state,
      delegatesList: initialState.delegatesList
    }

    case SET_DELEGATE:
      return {
        ...state,
        currentDelegate: action.data
      }

    case RESET_DELEGATE:
      return {
        ...state,
        currentDelegate: initialState.currentDelegate
      }

    case SET_DELEGATE_NAME:
      return {
        ...state,
        currentDelegate: {
          ...state.currentDelegate,
          name: action.data
        }
      }

    case SET_DELEGATE_MAIL:
      return {
        ...state,
        currentDelegate: {
          ...state.currentDelegate,
          email: action.data
        }
      }
      
    default:
      return state
  }
}