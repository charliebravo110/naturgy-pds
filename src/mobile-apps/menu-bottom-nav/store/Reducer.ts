import State from './State'
import { ActionTypes, actionStrings } from './ActionTypes'

const initialState: State = {
  showBurguer: true,
  showBottomNav: false,
}

export function Reducer(state = initialState, action: ActionTypes): State {
  switch (action.type) {
    case actionStrings.SET_SHOW_BURGUER:
      return { ...state, showBurguer: action.data }

    case actionStrings.SET_SHOW_BOTTOM_NAV:
      return { ...state, showBottomNav: action.data }

    default:
      return state
  }
}
