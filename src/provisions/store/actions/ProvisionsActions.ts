import {
  RESET_PROVISIONS,
  SET_PROVISIONS_COUNT,
  SET_PROVISIONS_LIST,
  APPEND_PROVISIONS_LIST,
  RESET_PROVISIONS_LIST,
  SET_CURRENT_PROVISION_ID,
  SET_CURRENT_PROVISION,
  SET_CURRENT_PROVISION_SCALE_IND,
  SET_CURRENT_PROVISION_PREPARED_TO_SEND,
  SET_MODIFICATION_CUPS,
  SET_SUPPLY_TYPES,
  SET_SELECTED_SUPPLY_TYPE,
  SET_DOSSIER_TYPE,
  SET_DOSSIER_SUBTYPE,
  SET_SUPPLY_SUBTYPES,
  SET_SELECTED_SUPPLY_SUBTYPE,
  SET_BUILDING_COORDINATES,
  SET_CADASTRE_DATA_COORDINATES,
  SET_CADASTRE_DATA_ZIPCODE,
  SET_CADASTRE_DATA_ITEM,
  RESET_CADASTRE_DATA,
  SET_TECH_DATA,
  SET_POWER_LIST,
  SET_VALORATION,
  SET_CUSTOMER_APPLICANT_DATA,
  SET_CUSTOMER_APPLICANT,
  SET_CUSTOMER_OWNER,
  SET_CUSTOMER_PAYER,
  SET_DELIVERY_ADDRESS,
  SET_INVOICE_ADDRESS,
  SET_ACCOUNTING_OFFICE,
  SET_TEAM_MANAGER_OFFICE,
  SET_TRAMITADORA_OFFICE,
  SET_CONTACT_LIST,
  SET_REQUEST_DATA,
  SET_NEW_GENERATION,
  SET_PROVISION_DATA,
  SET_CURRENT_PROVISION_NAME,
  SET_CURRENT_PROVISION_COMMUNICATION_LIST,
  SET_COMMUNICATION_DATA,
  SET_CURRENT_PROVISION_COMMUNICATION_LIST_BUDGET,
  SET_CONSENT_THIRD_ASSIGNMENT_OWNER,
  SET_CONSENT_THIRD_ASSIGNMENT_PAYER,
  SET_FINAL_PS,
  SET_CURRENT_PROVISION_HAS_CONTACT_ME_BUTTON,
  SET_BILLING_EMAIL,
  SET_ACEPTO_FACTURADIGITAL,
  SET_FETCH_FORM_SUCCESS,
  SET_FETCH_FORM_ERROR,
  SET_SAVE_FORM_SUCCESS,
  SET_SAVE_FORM_ERROR,
  ProvisionsActionTypes
} from '../../interfaces/ActionTypes'


export function setFetchFormSuccess(data: any): ProvisionsActionTypes {
  return {
    type: SET_FETCH_FORM_SUCCESS,
    data: data
  }
}

export function setFetchFormError(error: string): ProvisionsActionTypes {
  return {
    type: SET_FETCH_FORM_ERROR,
    error: error
  }
}

export function setSaveFormSuccess(data: any): ProvisionsActionTypes {
  return {
    type: SET_SAVE_FORM_SUCCESS,
    data: data
  }
}

export function setSaveFormError(error: string): ProvisionsActionTypes {
  return {
    type: SET_SAVE_FORM_ERROR,
    error: error
  }
}


export function resetProvisions(): ProvisionsActionTypes {
  return {
    type: RESET_PROVISIONS
  }
}

export function setProvisionsCount(count: any): ProvisionsActionTypes {
  return {
    type: SET_PROVISIONS_COUNT,
    data: count
  }
}

export function setProvisionsList(delegatesList: any): ProvisionsActionTypes {
  return {
    type: SET_PROVISIONS_LIST,
    data: delegatesList
  }
}

export function appendProvisionsList(list: any): ProvisionsActionTypes {
  return {
    type: APPEND_PROVISIONS_LIST,
    data: list
  }
}

export function resetProvisionsList(): ProvisionsActionTypes {
  return {
    type: RESET_PROVISIONS_LIST
  }
}

export function setCurrentProvisionId(id: any): ProvisionsActionTypes {
  return {
    type: SET_CURRENT_PROVISION_ID,
    data: id
  }
}

export function setCurrentProvision(provision: any): ProvisionsActionTypes {
  return {
    type: SET_CURRENT_PROVISION,
    data: provision
  }
}

export function setCurrentProvisionScaleInd(scaleInd: any): ProvisionsActionTypes {
  return {
    type: SET_CURRENT_PROVISION_SCALE_IND,
    data: scaleInd
  }
}

export function setCurrentProvisionPreparedToSend(preparedToSend: any): ProvisionsActionTypes {
  return {
    type: SET_CURRENT_PROVISION_PREPARED_TO_SEND,
    data: preparedToSend
  }
}

export function setModificationCups(cups: any): ProvisionsActionTypes {
  return {
    type: SET_MODIFICATION_CUPS,
    data: cups
  }
}

export function setSupplyTypes(supplyTypes: any): ProvisionsActionTypes {
  return {
    type: SET_SUPPLY_TYPES,
    data: supplyTypes
  }
}

export function setSelectedSupplyType(supplyType: any): ProvisionsActionTypes {
  return {
    type: SET_SELECTED_SUPPLY_TYPE,
    data: supplyType
  }
}

export function setDossierType(dossierType: any): ProvisionsActionTypes {
  return {
    type: SET_DOSSIER_TYPE,
    data: dossierType
  }
}

export function setDossierSubtype(dossierSubtype: any): ProvisionsActionTypes {
  return {
    type: SET_DOSSIER_SUBTYPE,
    data: dossierSubtype
  }
}

export function setSupplySubtypes(supplySubtypes: any): ProvisionsActionTypes {
  return {
    type: SET_SUPPLY_SUBTYPES,
    data: supplySubtypes
  }
}

export function setSelectedSupplySubtype(supplySubtype: any): ProvisionsActionTypes {
  return {
    type: SET_SELECTED_SUPPLY_SUBTYPE,
    data: supplySubtype
  }
}

export function setBuildingCoordinates(coordinates: any): ProvisionsActionTypes {
  return {
    type: SET_BUILDING_COORDINATES,
    data: coordinates
  }
}

export function setCadastreDataCoordinates(coordinates: any): ProvisionsActionTypes {
  return {
    type: SET_CADASTRE_DATA_COORDINATES,
    data: coordinates
  }
}

export function setCadastreDataZipcode(zipcode: any): ProvisionsActionTypes {
  return {
    type: SET_CADASTRE_DATA_ZIPCODE,
    data: zipcode
  }
}

export function setCadastreDataItem(item: any): ProvisionsActionTypes {
  return {
    type: SET_CADASTRE_DATA_ITEM,
    data: item
  }
}

export function resetCadastreData(): ProvisionsActionTypes {
  return {
    type: RESET_CADASTRE_DATA
  }
}

export function setTechData(techData: any): ProvisionsActionTypes {
  return {
    type: SET_TECH_DATA,
    data: techData
  }
}

export function setPowerList(powerList: any): ProvisionsActionTypes {
  return {
    type: SET_POWER_LIST,
    data: powerList
  }
}

export function setValoration(valoration: any): ProvisionsActionTypes {
  return {
    type: SET_VALORATION,
    data: valoration
  }
}

export function setCustomerApplicantData(data: any): ProvisionsActionTypes {
  return {
    type: SET_CUSTOMER_APPLICANT_DATA,
    data: data
  }
}

export function setCustomerApplicant(customer: any): ProvisionsActionTypes {
  return {
    type: SET_CUSTOMER_APPLICANT,
    data: customer
  }
}

export function setCustomerOwner(customer: any): ProvisionsActionTypes {
  return {
    type: SET_CUSTOMER_OWNER,
    data: customer
  }
}

export function setCustomerPayer(customer: any): ProvisionsActionTypes {
  return {
    type: SET_CUSTOMER_PAYER,
    data: customer
  }
}

export function setDeliveryAddress(deliveryAddress: any): ProvisionsActionTypes {
  return {
    type: SET_DELIVERY_ADDRESS,
    data: deliveryAddress
  }
}

export function setInvoiceAddress(invoiceAddress: any): ProvisionsActionTypes {
  return {
    type: SET_INVOICE_ADDRESS,
    data: invoiceAddress
  }
}

export function setBillingEmail(billingEmail: any): ProvisionsActionTypes {
  return {
    type: SET_BILLING_EMAIL,
    data: billingEmail
  }
}

export function setIdAceptoFacturaDigital(indAceptoFacturaDigital: any): ProvisionsActionTypes {
  return {
    type: SET_ACEPTO_FACTURADIGITAL,
    data: indAceptoFacturaDigital
  }
}

export function setAccountingOffice(accountingOffice: any): ProvisionsActionTypes {
  return {
    type: SET_ACCOUNTING_OFFICE,
    data: accountingOffice
  }
}

export function setTeamManagerOffice(teamManagerOffice: any): ProvisionsActionTypes {
  return {
    type: SET_TEAM_MANAGER_OFFICE,
    data: teamManagerOffice
  }
}

export function setTramitadoraOffice(tramitadoraOffice: any): ProvisionsActionTypes {
  return {
    type: SET_TRAMITADORA_OFFICE,
    data: tramitadoraOffice
  }
}

export function setContactList(contactList: any): ProvisionsActionTypes {
  return {
    type: SET_CONTACT_LIST,
    data: contactList
  }
}

export function setRequestData(requestData: any): ProvisionsActionTypes {
  return {
    type: SET_REQUEST_DATA,
    data: requestData
  }
}

export function setNewGeneration(newGeneration: any): ProvisionsActionTypes {
  return {
    type: SET_NEW_GENERATION,
    data: newGeneration
  }
}

export function setProvisionData(info: any, index: number): ProvisionsActionTypes {
  return {
    type: SET_PROVISION_DATA,
    data: {
      info,
      index
    }
  }
}

export function setCurrentProvisionName(name: string): ProvisionsActionTypes {
  return {
    type: SET_CURRENT_PROVISION_NAME,
    data: name
  }
}

export function setCurrentProvisionCommunicationList(data: any): ProvisionsActionTypes {
  return {
    type: SET_CURRENT_PROVISION_COMMUNICATION_LIST,
    data
  }
}

export function setCommunicationData(info: any, index: number): ProvisionsActionTypes {
  return {
    type: SET_COMMUNICATION_DATA,
    data: {
      info,
      index
    }
  }
}

export function setCurrentProvisionCommunicationListBudget(budget: number): ProvisionsActionTypes {
  return {
    type: SET_CURRENT_PROVISION_COMMUNICATION_LIST_BUDGET,
    data: budget
  }
}

export function setConsentThirdAssignmentOwner(data: any): ProvisionsActionTypes {
  return {
    type: SET_CONSENT_THIRD_ASSIGNMENT_OWNER,
    data
  }
}

export function setConsentThirdAssignmentPayer(data: any): ProvisionsActionTypes {
  return {
    type: SET_CONSENT_THIRD_ASSIGNMENT_PAYER,
    data
  }
}

export function setFinalPs(ps: string): ProvisionsActionTypes {
  return {
    type: SET_FINAL_PS,
    data: ps
  }
}

export function setCurrentProvisionHasContactMeButton(data: any): ProvisionsActionTypes {
  return {
    type: SET_CURRENT_PROVISION_HAS_CONTACT_ME_BUTTON,
    data
  }
}
