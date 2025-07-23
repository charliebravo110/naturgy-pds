export const SET_SUPPLIES_COUNT = '@@supplypoint/SET_SUPPLIES_COUNT'
export const SET_SUPPLIES = '@@supplypoint/SET_SUPPLIES'
export const APPEND_SUPPLIES_LIST = '@@supplypoint/APPEND_SUPPLIES_LIST'
export const RESET_SUPPLIES_LIST = '@@supplypoint/RESET_SUPPLIES_LIST'
export const SET_SUPPLY = '@@supplypoint/SET_SUPPLY'
export const RESET_SUPPLIES = '@@supplypoint/RESET_SUPPLIES'
export const SET_MANAGED_BY_ME_DELEGATIONS = '@@supplypoint/SET_MANAGED_BY_ME_DELEGATIONS'
export const RESET_MANAGED_BY_ME_DELEGATIONS = '@@supplypoint/RESET_MANAGED_BY_ME_DELEGATIONS'
export const SET_CURRENT_SUPPLY_CONSUMPTIONS = '@@supplypoint/SET_CURRENT_SUPPLY_CONSUMPTIONS'
export const SET_CURRENT_COMPARE_CONSUMPTIONS = '@@supplypoint/SET_CURRENT_COMPARE_CONSUMPTIONS'
export const SET_CURRENT_SUPPLY_BILLING_PERIODS = '@@supplypoint/SET_CURRENT_SUPPLY_BILLING_PERIODS'
export const SET_DELEGATIONS_IN_MANAGERS = '@@delegations/SET_DELEGATIONS_IN_MANAGERS'
export const RESET_DELEGATIONS_IN_MANAGERS = '@@delegations/RESET_DELEGATIONS_IN_MANAGERS'
export const MANAGE_DELEGATION_CHECK = '@@delegations/MANAGE_DELEGATION_CHECK'
export const CHECK_DELEGATION_BY_DELEGATE_TYPE = '@@delegations/CHECK_DELEGATION_BY_DELEGATE_TYPE'
export const UNCHECK_DELEGATION_BY_DELEGATE_TYPE = '@@delegations/UNCHECK_DELEGATION_BY_DELEGATE_TYPE'
export const CHECK_DELEGATION_BY_CUPS = '@@delegations/CHECK_DELEGATION_BY_CUPS'
export const UNCHECK_DELEGATION_BY_CUPS = '@@delegations/UNCHECK_DELEGATION_BY_CUPS'
export const SET_CURRENT_DELEGATION = '@@delegations/SET_CURRENT_DELEGATION'
export const SET_DELEGATES_LIST = '@@delegations/SET_DELEGATES_LIST'
export const RESET_DELEGATES_LIST = '@@delegations/RESET_DELEGATES_LIST'
export const SET_DELEGATIONS_TO_DELETE = '@@delegations/SET_DELEGATIONS_TO_DELETE'
export const RESET_DELEGATIONS_TO_DELETE = '@@delegations/RESET_DELEGATIONS_TO_DELETE'
export const SET_DELEGATES_IN_ME_DELEGATIONS = '@@supplypoint/SET_DELEGATES_IN_ME_DELEGATIONS'
export const SET_DELEGATE_IN_ME_DELEGATION = '@@supplypoint/SET_DELEGATE_IN_ME_DELEGATION'
export const RESET_DELEGATES_IN_ME_DELEGATIONS = '@@supplypoint/RESET_DELEGATES_IN_ME_DELEGATIONS'
export const RESET_DELEGATIONS = '@@delegations/RESET_DELEGATIONS'
export const SET_CURRENT_SUPPLY_PROGRAMMED_READS_COUNT = '@@delegations/SET_CURRENT_SUPPLY_PROGRAMMED_READS_COUNT'
export const APPEND_CURRENT_SUPPLY_PROGRAMMED_READS = '@@delegations/APPEND_CURRENT_SUPPLY_PROGRAMMED_READS'
export const SET_CURRENT_SUPPLY_PROGRAMMED_READS = '@@delegations/SET_CURRENT_SUPPLY_PROGRAMMED_READS'
export const SET_CURRENT_SUPPLY_PROGRAMMED_READS_X_MESSAGE_ID = '@@delegations/SET_CURRENT_SUPPLY_PROGRAMMED_READS_X_MESSAGE_ID'
export const RESET_CURRENT_SUPPLY_PROGRAMMED_READS = '@@delegations/RESET_CURRENT_SUPPLY_PROGRAMMED_READS'
export const SET_DELEGATES_IN_ME_LIST_COUNT = '@@delegations/SET_DELEGATES_IN_ME_LIST_COUNT'
export const APPEND_DELEGATES_IN_ME_LIST = '@@delegations/APPEND_DELEGATES_IN_ME_LIST'

interface SetSuppliesCount {
  type: typeof SET_SUPPLIES_COUNT
  data: any
}

interface SetSupplies {
  type: typeof SET_SUPPLIES
  data: Array<any>
}

interface AppendSuppliesList {
  type: typeof APPEND_SUPPLIES_LIST
  data: Array<any>
}

interface ResetSuppliesList {
  type: typeof RESET_SUPPLIES_LIST
}

interface SetSupply {
  type: typeof SET_SUPPLY
  data: any
}

interface ResetSupplies {
  type: typeof RESET_SUPPLIES
}

interface SetManagedByMeDelegations {
  type: typeof SET_MANAGED_BY_ME_DELEGATIONS
  data: Array<any>
}

interface ResetManagedByMeDelegations {
  type: typeof RESET_MANAGED_BY_ME_DELEGATIONS
}

interface SetCurrentSupplyConsumptions {
  type: typeof SET_CURRENT_SUPPLY_CONSUMPTIONS
  data: any
}

interface SetCurrentCompareConsumptions {
  type: typeof SET_CURRENT_COMPARE_CONSUMPTIONS
  data: any
}

interface SetCurrentSupplyBillingPeriods {
  type: typeof SET_CURRENT_SUPPLY_BILLING_PERIODS
  data: any
}

interface SetDelegationsInManagers {
  type: typeof SET_DELEGATIONS_IN_MANAGERS
  data: Array<any>
}

interface ResetDelegationsInManagers {
  type: typeof RESET_DELEGATIONS_IN_MANAGERS
}

interface ManageDelegationCheck {
  type: typeof MANAGE_DELEGATION_CHECK
  data: string
}

interface CheckDelegationByDelegationType {
  type: typeof CHECK_DELEGATION_BY_DELEGATE_TYPE
  data: string
}

interface UncheckDelegationByDelegationType {
  type: typeof UNCHECK_DELEGATION_BY_DELEGATE_TYPE
  data: string
}

interface CheckDelegationByCups {
  type: typeof CHECK_DELEGATION_BY_CUPS
  data: any
}

interface UncheckDelegationByCups {
  type: typeof UNCHECK_DELEGATION_BY_CUPS
  data: any
}

interface SetCurrentDelegation {
  type: typeof SET_CURRENT_DELEGATION
  data: any
}

interface SetDelegatesList {
  type: typeof SET_DELEGATES_LIST
  data: any
}

interface ResetDelegatesList {
  type: typeof RESET_DELEGATES_LIST
}

interface SetDelegationsToDelete {
  type: typeof SET_DELEGATIONS_TO_DELETE
  data: any
}

interface ResetDelegationsToDelete {
  type: typeof RESET_DELEGATIONS_TO_DELETE
}


interface SetDelegatesInMeDelegations {
  type: typeof SET_DELEGATES_IN_ME_DELEGATIONS
  data: Array<any>
}

interface SetDelegateInMeDelegation {
  type: typeof SET_DELEGATE_IN_ME_DELEGATION
  data: any
}

interface ResetDelegatesInMeDelegations {
  type: typeof RESET_DELEGATES_IN_ME_DELEGATIONS
}

interface ResetDelegations {
  type: typeof RESET_DELEGATIONS
}

interface SetCurrentSupplyProgrammedReadsCount {
  type: typeof SET_CURRENT_SUPPLY_PROGRAMMED_READS_COUNT
  data: any
}

interface AppendCurrentSupplyProgrammedReads {
  type: typeof APPEND_CURRENT_SUPPLY_PROGRAMMED_READS
  data: any
}

interface SetCurrentSupplyProgrammedReadsXMessageId {
  type: typeof SET_CURRENT_SUPPLY_PROGRAMMED_READS_X_MESSAGE_ID
  data: any
}

interface SetCurrentSupplyProgrammedReads {
  type: typeof SET_CURRENT_SUPPLY_PROGRAMMED_READS
  data: any
}

interface ResetCurrentSupplyProgrammedReads {
  type: typeof RESET_CURRENT_SUPPLY_PROGRAMMED_READS
}

interface SetDelegatesInMeListCount {
  type: typeof SET_DELEGATES_IN_ME_LIST_COUNT
  data: any
}

interface AppendDelegatesInMeList {
  type: typeof APPEND_DELEGATES_IN_ME_LIST
  data: any
}

export type SuppliesActionTypes = SetSuppliesCount | SetSupplies | AppendSuppliesList | ResetSuppliesList | SetSupply | ResetSupplies | SetManagedByMeDelegations | ResetManagedByMeDelegations | SetCurrentSupplyConsumptions | SetCurrentCompareConsumptions | SetCurrentSupplyBillingPeriods | SetDelegationsInManagers | ResetDelegationsInManagers | ManageDelegationCheck | CheckDelegationByDelegationType | UncheckDelegationByDelegationType | CheckDelegationByCups | UncheckDelegationByCups | SetCurrentDelegation | SetDelegatesList | ResetDelegatesList | SetDelegationsToDelete | ResetDelegationsToDelete | SetDelegatesInMeDelegations | SetDelegateInMeDelegation | ResetDelegatesInMeDelegations | ResetDelegations | SetCurrentSupplyProgrammedReadsCount | AppendCurrentSupplyProgrammedReads | SetCurrentSupplyProgrammedReads | SetCurrentSupplyProgrammedReadsXMessageId | ResetCurrentSupplyProgrammedReads | SetDelegatesInMeListCount | AppendDelegatesInMeList 
