import State from './State'

const SET_SHOW_BURGUER = '@@menuBottomNav/SET_SHOW_BURGUER'
interface setShowBurguerForCurrentUser {
  type: typeof SET_SHOW_BURGUER
  data: State['showBurguer']
}

const SET_SHOW_BOTTOM_NAV = '@@menuBottomNav/SET_SHOW_BOTTOM_NAV'
interface setShowBottomNavForCurrentUser {
  type: typeof SET_SHOW_BOTTOM_NAV
  data: State['showBottomNav']
}

export type ActionTypes = setShowBurguerForCurrentUser | setShowBottomNavForCurrentUser

// boilerplate, I know..., but this way only two variables need to be exported (and imported in Reducer.ts and Actions.ts)
export const actionStrings = {
  SET_SHOW_BURGUER: SET_SHOW_BURGUER as typeof SET_SHOW_BURGUER,
  SET_SHOW_BOTTOM_NAV: SET_SHOW_BOTTOM_NAV as typeof SET_SHOW_BOTTOM_NAV,
}
