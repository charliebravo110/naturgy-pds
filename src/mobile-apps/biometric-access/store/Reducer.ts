import State from './State'
import { ActionTypes, actionStrings } from './ActionTypes'

const initialState: State = {
  dataInitialized: false,
  enabled: null,
  available: null,
  biometryType: null,
  tryAutologin: false,
  iconType: null,
}

export function Reducer(state = initialState, action: ActionTypes): State {
  switch (action.type) {
    case actionStrings.SET_DATA_INITIALIZED:
      return { ...state, dataInitialized: action.data }

    case actionStrings.SET_ENABLED:
      return { ...state, enabled: action.data }

    case actionStrings.SET_AVAILABLE:
      return { ...state, available: action.data }

    case actionStrings.SET_BIOMETRY_TYPE:
      return { ...state, biometryType: action.data }

    case actionStrings.SET_TRY_AUTO_LOGIN:
      return { ...state, tryAutologin: action.data }

    case actionStrings.SET_ICON_TYPE:
      return { ...state, iconType: action.data }

    default:
      return state
  }
}
