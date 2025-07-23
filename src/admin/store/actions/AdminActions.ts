import {
  SET_SEARCHED_USER,
  SET_ADMIN_TOKEN,
  SET_ADMIN_PROFILE,
  RESET_ADMIN_PROFILE,
  RESET_ADMIN_TOKEN,
  AdminActionTypes
} from '../../interfaces/ActionsTypes'
import UserProfile from '../../../common/interfaces/UserProfile'

export function setSearchedUser(user: UserProfile): AdminActionTypes {
  return {
    type: SET_SEARCHED_USER,
    data: user
  }
}

export function setAdminToken(token: string): AdminActionTypes {
  return {
    type: SET_ADMIN_TOKEN,
    data: token
  }
}

export function resetAdminToken(): AdminActionTypes {
  return {
    type: RESET_ADMIN_TOKEN
  }
}

export function setAdminProfile(profile: Array<UserProfile>): AdminActionTypes {
  return {
    type: SET_ADMIN_PROFILE,
    data: profile
  }
}

export function resetAdminProfile(): AdminActionTypes {
  return {
    type: RESET_ADMIN_PROFILE
  }
}