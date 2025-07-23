import {
  SET_SUPPLIES_COUNT,
  SET_SUPPLIES,
  APPEND_SUPPLIES_LIST,
  RESET_SUPPLIES_LIST,
  SET_SUPPLY,
  RESET_SUPPLIES,
  SET_MANAGED_BY_ME_DELEGATIONS,
  RESET_MANAGED_BY_ME_DELEGATIONS,
  SET_CURRENT_SUPPLY_CONSUMPTIONS,
  SET_CURRENT_COMPARE_CONSUMPTIONS,
  SET_CURRENT_SUPPLY_BILLING_PERIODS,
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
  RESET_DELEGATIONS,
  SET_CURRENT_SUPPLY_PROGRAMMED_READS_COUNT,
  APPEND_CURRENT_SUPPLY_PROGRAMMED_READS,
  SET_CURRENT_SUPPLY_PROGRAMMED_READS,
  SET_CURRENT_SUPPLY_PROGRAMMED_READS_X_MESSAGE_ID,
  RESET_CURRENT_SUPPLY_PROGRAMMED_READS,
  SET_DELEGATES_IN_ME_LIST_COUNT,
  APPEND_DELEGATES_IN_ME_LIST,
  SuppliesActionTypes
} from '../../interfaces/SuppliesActionTypes'

export function setSuppliesCount(count: any): SuppliesActionTypes {
  return {
    type: SET_SUPPLIES_COUNT,
    data: count
  }
}

export function setSupplies(suppliesList: Array<any>): SuppliesActionTypes {
  return {
    type: SET_SUPPLIES,
    data: suppliesList
  }
}

export function appendSuppliesList(list: Array<any>): SuppliesActionTypes {
  return {
    type: APPEND_SUPPLIES_LIST,
    data: list
  }
}

export function resetSuppliesList(): SuppliesActionTypes {
  return {
    type: RESET_SUPPLIES_LIST
  }
}

export function setSupply(info: any, index: number): SuppliesActionTypes {
  return {
    type: SET_SUPPLY,
    data: {
      info,
      index
    }
  }
}

export function resetSupplies(): SuppliesActionTypes {
  return {
    type: RESET_SUPPLIES
  }
}

export function setManagedByMeDelegations(delegationsList: Array<any>): SuppliesActionTypes {
  return {
    type: SET_MANAGED_BY_ME_DELEGATIONS,
    data: delegationsList
  }
}

export function resetManagedByMeDelegations(): SuppliesActionTypes {
  return {
    type: RESET_MANAGED_BY_ME_DELEGATIONS
  }
}

export function setCurrentSupplyConsumptions(consumptions: any): SuppliesActionTypes {
  return {
    type: SET_CURRENT_SUPPLY_CONSUMPTIONS,
    data: consumptions
  }
}

export function setCurrentCompareConsumptions(consumptions: any): SuppliesActionTypes {
  return {
    type: SET_CURRENT_COMPARE_CONSUMPTIONS,
    data: consumptions
  }
}

export function setCurrentSupplyBillingPeriods(billingPeriods: Array<any>): SuppliesActionTypes {
  return {
    type: SET_CURRENT_SUPPLY_BILLING_PERIODS,
    data: billingPeriods
  }
}

export function setDelegationsInManagers(delegationsList: Array<any>): SuppliesActionTypes {
  return {
    type: SET_DELEGATIONS_IN_MANAGERS,
    data: delegationsList
  }
}

export function resetDelegationsInManagers(): SuppliesActionTypes {
  return {
    type: RESET_DELEGATIONS_IN_MANAGERS
  }
}

export function manageDelegationCheck(delegationId: string): SuppliesActionTypes {
  return {
    type: MANAGE_DELEGATION_CHECK,
    data: delegationId
  }
}

export function checkDelegationByDelegationType(delegationType: string): SuppliesActionTypes {
  return {
    type: CHECK_DELEGATION_BY_DELEGATE_TYPE,
    data: delegationType
  }
}

export function uncheckDelegationByDelegationType(delegationType: string): SuppliesActionTypes {
  return {
    type: UNCHECK_DELEGATION_BY_DELEGATE_TYPE,
    data: delegationType
  }
}

export function checkDelegationByCups(obj: any): SuppliesActionTypes {
  return {
    type: CHECK_DELEGATION_BY_CUPS,
    data: obj
  }
}

export function uncheckDelegationByCups(obj: any): SuppliesActionTypes {
  return {
    type: UNCHECK_DELEGATION_BY_CUPS,
    data: obj
  }
}

export function setCurrentDelegation(delegation: any): SuppliesActionTypes {
  return {
    type: SET_CURRENT_DELEGATION,
    data: delegation
  }
}

export function setCurrentDelegatesList(delegatesList: any): SuppliesActionTypes {
  return {
    type: SET_DELEGATES_LIST,
    data: delegatesList
  }
}

export function resetCurrentDelegatesList(): SuppliesActionTypes {
  return {
    type: RESET_DELEGATES_LIST
  }
}

export function setDelegationsToDelete(delegations: string[]): SuppliesActionTypes {
  return {
    type: SET_DELEGATIONS_TO_DELETE,
    data: delegations
  }
}

export function resetDelegationsToDelete(): SuppliesActionTypes {
  return {
    type: RESET_DELEGATIONS_TO_DELETE
  }
}

export function setDelegatesInMeDelegations(delegationsList: Array<any>): SuppliesActionTypes {
  return {
    type: SET_DELEGATES_IN_ME_DELEGATIONS,
    data: delegationsList
  }
}

export function setDelegateInMeDelegation(info: any, index: number): SuppliesActionTypes {
  return {
    type: SET_DELEGATE_IN_ME_DELEGATION,
    data: {
      info,
      index
    }
  }
}

export function resetDelegatesInMeDelegations(): SuppliesActionTypes {
  return {
    type: RESET_DELEGATES_IN_ME_DELEGATIONS
  }
}

export function resetDelegations(): SuppliesActionTypes {
  return {
    type: RESET_DELEGATIONS
  }
}

export function setCurrentSupplyProgrammedReadsCount(count: number): SuppliesActionTypes {
  return {
    type: SET_CURRENT_SUPPLY_PROGRAMMED_READS_COUNT,
    data: count
  }
}

export function appendCurrentSupplyProgrammedReads(items: any): SuppliesActionTypes {
  return {
    type: APPEND_CURRENT_SUPPLY_PROGRAMMED_READS,
    data: items
  }
}

export function setCurrentSupplyProgrammedReads(items: any): SuppliesActionTypes {
  return {
    type: SET_CURRENT_SUPPLY_PROGRAMMED_READS,
    data: items
  }
}

export function setCurrentSupplyProgrammedReadsXMessageId(xMessageId: string): SuppliesActionTypes {
  return {
    type: SET_CURRENT_SUPPLY_PROGRAMMED_READS_X_MESSAGE_ID,
    data: xMessageId
  }
}

export function resetCurrentSupplyProgrammedReads(): SuppliesActionTypes {
  return {
    type: RESET_CURRENT_SUPPLY_PROGRAMMED_READS
  }
}

export function setDelegatesInMeListCount(count: number): SuppliesActionTypes {
  return {
    type: SET_DELEGATES_IN_ME_LIST_COUNT,
    data: count
  }
}

export function appendDelegatesInMeList(items: any): SuppliesActionTypes {
  return {
    type: APPEND_DELEGATES_IN_ME_LIST,
    data: items
  }
}
