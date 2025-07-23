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

export function manageCheckDelegationsByDelegateType(delegations: any[], delegateType: string, checked: boolean): any[] {
  
  const checkedDelegations = delegations.map(delegation => {
    delegation[delegateType].forEach(delegate => {
        delegate.checked = checked
    })

    return delegation
  })

  return checkedDelegations
}

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