import State from './State'
import { ActionTypes, actionStrings } from './ActionTypes'

export function setShowBurguer(bool: State['showBurguer']): ActionTypes {
  return {
    type: actionStrings.SET_SHOW_BURGUER,
    data: bool,
  }
}

export function setShowBottomNav(bool: State['showBottomNav']): ActionTypes {
  return {
    type: actionStrings.SET_SHOW_BOTTOM_NAV,
    data: bool,
  }
}
