import State from './State'
import { ActionTypes, actionStrings } from './ActionTypes'

export function setDataInitialized(bool: State['dataInitialized']): ActionTypes {
  return {
    type: actionStrings.SET_DATA_INITIALIZED,
    data: bool,
  }
}

export function setEnabled(bool: State['enabled']): ActionTypes {
  return {
    type: actionStrings.SET_ENABLED,
    data: bool,
  }
}

export function setAvailable(bool: State['available']): ActionTypes {
  return {
    type: actionStrings.SET_AVAILABLE,
    data: bool,
  }
}

export function setBiometryType(biometryType: State['biometryType']): ActionTypes {
  return {
    type: actionStrings.SET_BIOMETRY_TYPE,
    data: biometryType,
  }
}

export function setTryAutologin(bool: State['tryAutologin']): ActionTypes {
  return {
    type: actionStrings.SET_TRY_AUTO_LOGIN,
    data: bool,
  }
}

export function setIconType(iconType: State['iconType']): ActionTypes {
  return {
    type: actionStrings.SET_ICON_TYPE,
    data: iconType,
  }
}
