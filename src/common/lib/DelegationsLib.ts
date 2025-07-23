//ESP: Transforma un array de delegaciones en un array de delegaciones agrupadas por CUPS y tipo de delegado.
//ENG: Transforms an array of delegations into an array grouped by CUPS and delegate type.
export function delegationsToSupplyDelegations(delegations: any[]): any[] {

  let supplyDelegations: any = []

  delegations.forEach(delegation => {
    let delegate = delegation.delegate
    const delegateType = delegation.delegate.role === 'US_MANAGER' ? 'managers' : 'consultants'

    if(!supplyDelegations[delegation.cups]){
      supplyDelegations[delegation.cups] = {
        cups: delegation.cups,
        address: delegation.address,
        managers: [],
        consultants: []
      }
    }
      delegate.delegationId = delegation.delegationId
      delegate.checked = false
      delegate.startDate = delegation.startDate
      delegate.endDate = delegation.endDate
      supplyDelegations[delegation.cups][delegateType].push(delegate)
  })

  const suppliesKeys = Object.keys(supplyDelegations)
  return suppliesKeys.map((key) => supplyDelegations[key])
}

//ESP: Alterna el estado de selección de una delegación por su ID en todas las listas de managers y consultants.
//ENG: Toggles the checked state of a delegation by its ID in all managers and consultants lists.
export function manageCheckDelegationById(delegations: any[], delegateId: string): any[] {
  
  const checkedDelegations = delegations.map(delegation => {
    delegation.managers.forEach(manager => {
      if(manager.delegationId === delegateId){
        manager.checked = !manager.checked
      }
    })

    delegation.consultants.forEach(consultant => {
      if(consultant.delegationId === delegateId){
        consultant.checked = !consultant.checked
      }
    })

    return delegation
  })

  return checkedDelegations
}

//ESP: Marca o desmarca todas las delegaciones de un tipo específico (manager o consultant).
//ENG: Checks or unchecks all delegations of a specific type (manager or consultant).
export function manageCheckDelegationsByDelegateType(delegations: any[], delegateType: string, checked: boolean): any[] {
  
  const checkedDelegations = delegations.map(delegation => {
    delegation[delegateType].forEach(delegate => {
        delegate.checked = checked
    })

    return delegation
  })

  return checkedDelegations
}

//ESP: Marca o desmarca todas las delegaciones de un tipo y CUPS específicos.
//ENG: Checks or unchecks all delegations of a specific type and CUPS.
export function manageCheckDelegationsByCups(delegations: any[], { cups, delegateType }, checked: boolean): any[] {
  
  const checkedDelegations = delegations.map(delegation => {
    if(delegation.cups === cups)
    delegation[delegateType].forEach(delegate => {
        delegate.checked = checked
    })

    return delegation
  })

  return checkedDelegations
}