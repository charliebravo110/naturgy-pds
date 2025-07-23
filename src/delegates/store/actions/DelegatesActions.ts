import {
  SET_DELEGATES_LIST,
  RESET_DELEGATES_LIST,
  SET_DELEGATE,
  RESET_DELEGATE,
  SET_DELEGATE_NAME,
  SET_DELEGATE_MAIL,
  DelegatesActionTypes
} from '../../interfaces/ActionTypes'


export function setDelegatesList(delegatesList: any): DelegatesActionTypes {
  return {
    type: SET_DELEGATES_LIST,
    data: delegatesList
  }
}

export function resetDelegatesList(): DelegatesActionTypes {
  return {
    type: RESET_DELEGATES_LIST
  }
}

export function setDelegate(delegate: any): DelegatesActionTypes {
  return {
    type: SET_DELEGATE,
    data: delegate
  }
}

export function resetDelegate(): DelegatesActionTypes {
  return {
    type: RESET_DELEGATE
  }
}

export function setDelegateName(name: string): DelegatesActionTypes {
  return {
    type: SET_DELEGATE_NAME,
    data: name
  }
}

export function setDelegateMail(email: string): DelegatesActionTypes {
  return {
    type: SET_DELEGATE_MAIL,
    data: email
  }
}