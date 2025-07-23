import {
  SET_MANAGED_BY_ME_DELEGATIONS,
  RESET_MANAGED_BY_ME_DELEGATIONS,
  SET_DELEGATIONS_IN_MANAGERS,
  RESET_DELEGATIONS_IN_MANAGERS,
  MANAGE_DELEGATION_CHECK,
  CHECK_DELEGATION_BY_DELEGATE_TYPE,
  UNCHECK_DELEGATION_BY_DELEGATE_TYPE,
  CHECK_DELEGATION_BY_CUPS,
  UNCHECK_DELEGATION_BY_CUPS,
  SET_CURRENT_DELEGATION,
  SET_DELEGATES_LIST,
  RESET_DELEGATES_LIST,
  SET_DELEGATIONS_TO_DELETE,
  RESET_DELEGATIONS_TO_DELETE,
  SET_DELEGATES_IN_ME_DELEGATIONS,
  SET_DELEGATE_IN_ME_DELEGATION,
  RESET_DELEGATES_IN_ME_DELEGATIONS,
  SET_DELEGATES_IN_ME_LIST_COUNT,
  APPEND_DELEGATES_IN_ME_LIST,
  RESET_DELEGATIONS,
  SuppliesActionTypes
} from '../../interfaces/SuppliesActionTypes'
import Delegations from '../../interfaces/Delegations'

import { manageCheckDelegationById, manageCheckDelegationsByDelegateType, manageCheckDelegationsByCups } from '../../../common/lib/DelegationsLib'

const initialState: Delegations = {
  managedByMeList: [],
  delegationsInManagersList: [],
  currentDelegation: [],
  currentDelegatesList: [],
  delegationsToDelete: [],
  delegatesInMeList: [],
  delegatesInMeListCount: 0
}

export function delegationsReducer(state = initialState, action: SuppliesActionTypes): Delegations {
  switch (action.type) {
    case SET_MANAGED_BY_ME_DELEGATIONS:
      return {
        ...state,
        managedByMeList: action.data
      }

    case RESET_MANAGED_BY_ME_DELEGATIONS:
      return initialState

    case SET_DELEGATIONS_IN_MANAGERS:
      return {
        ...state,
        delegationsInManagersList: action.data
      }

    case RESET_DELEGATIONS_IN_MANAGERS:
      return {
        ...state,
        delegationsInManagersList: []
      }

    case MANAGE_DELEGATION_CHECK:
      return {
        ...state,
        delegationsInManagersList: manageCheckDelegationById(state.delegationsInManagersList, action.data)
      }

    case CHECK_DELEGATION_BY_DELEGATE_TYPE:
      return {
        ...state,
        delegationsInManagersList: manageCheckDelegationsByDelegateType(state.delegationsInManagersList, action.data, true)
      }

    case UNCHECK_DELEGATION_BY_DELEGATE_TYPE:
        return {
          ...state,
          delegationsInManagersList: manageCheckDelegationsByDelegateType(state.delegationsInManagersList, action.data, false)
        }

    case CHECK_DELEGATION_BY_CUPS:
        return {
          ...state,
          delegationsInManagersList: manageCheckDelegationsByCups(state.delegationsInManagersList, action.data, true)
        }

    case UNCHECK_DELEGATION_BY_CUPS:
      return {
        ...state,
        delegationsInManagersList: manageCheckDelegationsByCups(state.delegationsInManagersList, action.data, false)
      }

    case SET_CURRENT_DELEGATION:
      return {
        ...state,
        currentDelegation: action.data
      }

    case SET_DELEGATES_LIST:
      return {
        ...state,
        currentDelegatesList: action.data
      }

    case RESET_DELEGATES_LIST:
      return {
        ...state,
        currentDelegatesList: initialState.currentDelegatesList
      }

    case SET_DELEGATIONS_TO_DELETE:
      return {
        ...state,
        delegationsToDelete: action.data
      }

    case RESET_DELEGATIONS_TO_DELETE:
      return {
        ...state,
        delegationsToDelete: []
      }

    case SET_DELEGATES_IN_ME_DELEGATIONS:
      return {
        ...state,
        delegatesInMeList: action.data
      }

    case SET_DELEGATE_IN_ME_DELEGATION:
      const index = action.data.index

      return {
        ...state,
        delegatesInMeList: [
          ...state.delegatesInMeList.slice(0, index), {
            ...state.delegatesInMeList[index],
            ...action.data.info
          },
          ...state.delegatesInMeList.slice(index + 1)
        ]
      }

    case RESET_DELEGATES_IN_ME_DELEGATIONS:
      return {
        ...state,
        delegatesInMeList: [],
        delegatesInMeListCount: 0
      }

    case SET_DELEGATES_IN_ME_LIST_COUNT:
      return {
        ...state,
        delegatesInMeListCount: action.data
      }

    case APPEND_DELEGATES_IN_ME_LIST:
      return {
        ...state,
        delegatesInMeList: [
          ...state.delegatesInMeList,
          ...action.data
        ]
      }

    case RESET_DELEGATIONS:
      return initialState

    default:
      return state
  }
}
