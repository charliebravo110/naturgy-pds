import State from './State'

const SET_DATA_INITIALIZED = '@@biometricAccess/SET_DATA_INITIALIZED'
interface setDataInitialized {
  type: typeof SET_DATA_INITIALIZED
  data: State['dataInitialized']
}

const SET_ENABLED = '@@biometricAccess/SET_ENABLED'
interface setEnabled {
  type: typeof SET_ENABLED
  data: State['enabled']
}

const SET_AVAILABLE = '@@biometricAccess/SET_AVAILABLE'
interface setAvailable {
  type: typeof SET_AVAILABLE
  data: State['available']
}

const SET_BIOMETRY_TYPE = '@@biometricAccess/SET_BIOMETRY_TYPE'
interface setBiometryType {
  type: typeof SET_BIOMETRY_TYPE
  data: State['biometryType']
}

const SET_TRY_AUTO_LOGIN = '@@biometricAccess/SET_TRY_AUTO_LOGIN'
interface setDontTryAutologin {
  type: typeof SET_TRY_AUTO_LOGIN
  data: State['tryAutologin']
}

const SET_ICON_TYPE = '@@biometricAccess/SET_ICON_TYPE'
interface setIconType {
  type: typeof SET_ICON_TYPE
  data: State['iconType']
}

export type ActionTypes =
  | setDataInitialized
  | setEnabled
  | setAvailable
  | setBiometryType
  | setDontTryAutologin
  | setIconType

// boilerplate, I know..., but this way only two variables need to be exported (and imported in Reducer.ts and Actions.ts)
export const actionStrings = {
  SET_DATA_INITIALIZED: SET_DATA_INITIALIZED as typeof SET_DATA_INITIALIZED,
  SET_ENABLED: SET_ENABLED as typeof SET_ENABLED,
  SET_AVAILABLE: SET_AVAILABLE as typeof SET_AVAILABLE,
  SET_BIOMETRY_TYPE: SET_BIOMETRY_TYPE as typeof SET_BIOMETRY_TYPE,
  SET_TRY_AUTO_LOGIN: SET_TRY_AUTO_LOGIN as typeof SET_TRY_AUTO_LOGIN,
  SET_ICON_TYPE: SET_ICON_TYPE as typeof SET_ICON_TYPE,
}
