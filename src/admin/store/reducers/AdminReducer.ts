import {
  SET_SEARCHED_USER,
  SET_ADMIN_TOKEN,
  RESET_ADMIN_TOKEN,
  SET_ADMIN_PROFILE,
  RESET_ADMIN_PROFILE,
  AdminActionTypes
} from '../../interfaces/ActionsTypes'

const initialState: any = {
  searchedUser: {},
  token: '',
  profile: {
	roles: ''
  }
}

export function adminReducer(state = initialState, action: AdminActionTypes): any {
  switch (action.type) {
    case SET_SEARCHED_USER:
      return {
        ...state,
        searchedUser: action.data
      }

    case SET_ADMIN_TOKEN:
      return {
        ...state,
        token: action.data
      }

    case RESET_ADMIN_TOKEN:
      return initialState

    case SET_ADMIN_PROFILE:
      return {
        ...state,
        profile: action.data
      }

    case RESET_ADMIN_PROFILE:
      return {
        ...state,
        profile: initialState.profile
      }

    default:
      return state
  }
}
