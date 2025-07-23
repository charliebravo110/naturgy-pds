import UserProfile from '../../common/interfaces/UserProfile'

export const SET_SEARCHED_USER = '@@admin/SET_SEARCHED_USER'
export const SET_ADMIN_TOKEN = '@@admin/SET_ADMIN_TOKEN'
export const RESET_ADMIN_TOKEN = '@@admin/RESET_ADMIN_TOKEN'
export const SET_ADMIN_PROFILE = '@@admin/SET_ADMIN_PROFILE'
export const RESET_ADMIN_PROFILE = '@@admin/RESET_ADMIN_PROFILE'

interface SetSearchedUser {
  type: typeof SET_SEARCHED_USER
  data: UserProfile
}

interface SetAdminToken {
  type: typeof SET_ADMIN_TOKEN
  data: string
}

interface ResetAdminToken {
  type: typeof RESET_ADMIN_TOKEN
}

interface SetAdminProfile {
  type: typeof SET_ADMIN_PROFILE
  data: Array<UserProfile>
}

interface ResetAdminProfile {
  type: typeof RESET_ADMIN_PROFILE
}

export type AdminActionTypes = SetSearchedUser | SetAdminToken | ResetAdminToken | SetAdminProfile | ResetAdminProfile
