export const RESET_PROVISIONS = '@@provisions/RESET_PROVISIONS'
export const SET_PROVISIONS_COUNT = '@@provisions/SET_PROVISIONS_COUNT'
export const SET_PROVISIONS_LIST = '@@provisions/SET_PROVISIONS_LIST'
export const APPEND_PROVISIONS_LIST = '@@provisions/APPEND_PROVISIONS_LIST'
export const RESET_PROVISIONS_LIST = '@@provisions/RESET_PROVISIONS_LIST'
export const SET_CURRENT_PROVISION_ID = '@@provision/SET_CURRENT_PROVISION_ID'
export const SET_CURRENT_PROVISION = '@@provision/SET_CURRENT_PROVISION'
export const SET_CURRENT_PROVISION_SCALE_IND = '@@provision/SET_CURRENT_PROVISION_SCALE_IND'
export const SET_CURRENT_PROVISION_PREPARED_TO_SEND = '@@provision/SET_CURRENT_PROVISION_PREPARED_TO_SEND'
export const SET_MODIFICATION_CUPS = '@@provision/SET_MODIFICATION_CUPS'
export const SET_SUPPLY_TYPES = '@@provisions/SET_SUPPLY_TYPES'
export const SET_SELECTED_SUPPLY_TYPE = '@@provisions/SET_SELECTED_SUPPLY_TYPE'
export const SET_DOSSIER_TYPE = '@@provisions/SET_DOSSIER_TYPE'
export const SET_DOSSIER_SUBTYPE = '@@provisions/SET_DOSSIER_SUBTYPE'
export const SET_SUPPLY_SUBTYPES = '@@provisions/SET_SUPPLY_SUBTYPES'
export const SET_SELECTED_SUPPLY_SUBTYPE = '@@provisions/SET_SELECTED_SUPPLY_SUBTYPE'
export const SET_BUILDING_COORDINATES = '@@provisions/SET_BUILDING_COORDINATES'
export const SET_CADASTRE_DATA_COORDINATES = '@@provisions/SET_CADASTRE_DATA_COORDINATES'
export const SET_CADASTRE_DATA_ZIPCODE = '@@provisions/SET_CADASTRE_DATA_ZIPCODE'
export const SET_CADASTRE_DATA_ITEM = '@@provisions/SET_CADASTRE_DATA_ITEM'
export const RESET_CADASTRE_DATA = '@@provisions/RESET_CADASTRE_DATA'
export const SET_TECH_DATA = '@@provisions/SET_TECH_DATA'
export const SET_POWER_LIST = '@@provisions/SET_POWER_LIST'
export const SET_VALORATION = '@@provisions/SET_VALORATION'
export const SET_CUSTOMER_APPLICANT_DATA = '@@provisions/SET_CUSTOMER_APPLICANT_DATA'
export const SET_CUSTOMER_APPLICANT = '@@provisions/SET_CUSTOMER_APPLICANT'
export const SET_CUSTOMER_OWNER = '@@provisions/SET_CUSTOMER_OWNER'
export const SET_CUSTOMER_PAYER = '@@provisions/SET_CUSTOMER_PAYER'
export const SET_DELIVERY_ADDRESS = '@@provisions/SET_DELIVERY_ADDRESS'
export const SET_INVOICE_ADDRESS = '@@provisions/SET_INVOICE_ADDRESS'
export const SET_ACCOUNTING_OFFICE = '@@provisions/SET_ACCOUNTING_OFFICE'
export const SET_TEAM_MANAGER_OFFICE = '@@provisions/SET_TEAM_MANAGER_OFFICE'
export const SET_TRAMITADORA_OFFICE = '@@provisions/SET_TRAMITADORA_OFFICE'
export const SET_CONTACT_LIST = '@@provisions/SET_CONTACT_LIST'
export const SET_REQUEST_DATA = '@@provisions/SET_REQUEST_DATA'
export const SET_NEW_GENERATION = '@@provisions/SET_NEW_GENERATION'
export const SET_PROVISION_DATA = '@@provisions/SET_PROVISION_DATA'
export const SET_CURRENT_PROVISION_NAME = '@@provisions/SET_CURRENT_PROVISION_NAME'
export const SET_CURRENT_PROVISION_COMMUNICATION_LIST = '@@provisions/SET_CURRENT_PROVISION_COMMUNICATION_LIST'
export const SET_COMMUNICATION_DATA = '@@provisions/SET_COMMUNICATION_DATA'
export const SET_CURRENT_PROVISION_COMMUNICATION_LIST_BUDGET = '@@provisions/SET_CURRENT_PROVISION_COMMUNICATION_LIST_BUDGET'
export const SET_CONSENT_THIRD_ASSIGNMENT_OWNER = '@@provisions/SET_CONSENT_THIRD_ASSIGNMENT_OWNER'
export const SET_CONSENT_THIRD_ASSIGNMENT_PAYER = '@@provisions/SET_CONSENT_THIRD_ASSIGNMENT_PAYER'
export const SET_FINAL_PS = '@@provisions/SET_FINAL_PS'
export const SET_CURRENT_PROVISION_HAS_CONTACT_ME_BUTTON = '@@provisions/SET_CURRENT_PROVISION_HAS_CONTACT_ME_BUTTON'
export const SET_BILLING_EMAIL = '@@provisions/SET_BILLING_EMAIL'
export const SET_ACEPTO_FACTURADIGITAL = '@@provisions/SET_ACEPTO_FACTURADIGITAL'
export const SET_FETCH_FORM_SUCCESS = '@@provisions/FETCH_FORM_SUCCESS';
export const SET_FETCH_FORM_ERROR = '@@provisions/FETCH_FORM_ERROR';
export const SET_SAVE_FORM_SUCCESS = '@@provisions/SAVE_FORM_SUCCESS';
export const SET_SAVE_FORM_ERROR = '@@provisions/SAVE_FORM_ERROR';

interface SetFetchProvisions {
  type: typeof SET_FETCH_FORM_SUCCESS
  data: any;
}

interface SetSaveProvisions {
  type: typeof SET_SAVE_FORM_SUCCESS
  data: any;
}

interface SetErrorSaveProvisions {
  type: typeof SET_SAVE_FORM_ERROR
  error: string;
}

interface SetErrorFetchProvisions {
  type: typeof SET_FETCH_FORM_ERROR
  error: string;
}

interface ResetProvisions {
  type: typeof RESET_PROVISIONS
}

interface SetProvisionsCount {
  type: typeof SET_PROVISIONS_COUNT
  data: any
}

interface SetProvisionsList {
  type: typeof SET_PROVISIONS_LIST
  data: any
}

interface AppendProvisionsList {
  type: typeof APPEND_PROVISIONS_LIST
  data: any
}

interface ResetProvisionsList {
  type: typeof RESET_PROVISIONS_LIST
}

interface SetCurrentProvisionId {
  type: typeof SET_CURRENT_PROVISION_ID
  data: any
}

interface SetCurrentProvision {
  type: typeof SET_CURRENT_PROVISION
  data: any
}

interface SetCurrentProvisionScaleInd {
  type: typeof SET_CURRENT_PROVISION_SCALE_IND
  data: any
}

interface SetCurrentProvisionPreparedToSend {
  type: typeof SET_CURRENT_PROVISION_PREPARED_TO_SEND
  data: any
}

interface SetModificationCups {
  type: typeof SET_MODIFICATION_CUPS
  data: any
}

interface SetSupplyTypes {
  type: typeof SET_SUPPLY_TYPES
  data: any
}

interface SetSelectedSupplyType {
  type: typeof SET_SELECTED_SUPPLY_TYPE
  data: any
}

interface SetDossierType {
  type: typeof SET_DOSSIER_TYPE
  data: any
}

interface SetDossierSubtype {
  type: typeof SET_DOSSIER_SUBTYPE
  data: any
}

interface SetSupplySubtypes {
  type: typeof SET_SUPPLY_SUBTYPES
  data: any
}

interface SetSelectedSupplySubtype {
  type: typeof SET_SELECTED_SUPPLY_SUBTYPE
  data: any
}

interface SetBuildingCoordinates {
  type: typeof SET_BUILDING_COORDINATES
  data: any
}

interface SetCadastreDataCoordinates {
  type: typeof SET_CADASTRE_DATA_COORDINATES
  data: any
}

interface SetCadastreDataZipcode {
  type: typeof SET_CADASTRE_DATA_ZIPCODE
  data: any
}

interface SetCadastreDataItem {
  type: typeof SET_CADASTRE_DATA_ITEM
  data: any
}

interface ResetCadastreData {
  type: typeof RESET_CADASTRE_DATA
}

interface SetTechData {
  type: typeof SET_TECH_DATA
  data: any
}

interface SetPowerList {
  type: typeof SET_POWER_LIST
  data: any
}

interface SetValoration {
  type: typeof SET_VALORATION
  data: any
}

interface SetCustomerApplicant {
  type: typeof SET_CUSTOMER_APPLICANT,
  data: any
}

interface SetCustomerApplicantData {
  type: typeof SET_CUSTOMER_APPLICANT_DATA,
  data: any
}

interface SetCustomerOwner {
  type: typeof SET_CUSTOMER_OWNER,
  data: any
}

interface SetCustomerPayer {
  type: typeof SET_CUSTOMER_PAYER,
  data: any
}

interface SetDeliveryAddress {
  type: typeof SET_DELIVERY_ADDRESS,
  data: any
}

interface SetInvoiceAddress {
  type: typeof SET_INVOICE_ADDRESS,
  data: any
}

interface SetBillingEmail {
  type: typeof SET_BILLING_EMAIL,
  data: any
}

interface  SetIdAceptoFacturaDigital {
  type: typeof SET_ACEPTO_FACTURADIGITAL,
  data: any
}

interface SetAccountingOffice {
  type: typeof SET_ACCOUNTING_OFFICE,
  data: any
}

interface SetTeamManagerOffice {
  type: typeof SET_TEAM_MANAGER_OFFICE,
  data: any
}

interface SetTramitadoraOffice {
  type: typeof SET_TRAMITADORA_OFFICE,
  data: any
}

interface SetContactList {
  type: typeof SET_CONTACT_LIST,
  data: any
}

interface SetProvisionRequestData {
  type: typeof SET_REQUEST_DATA,
  data: any
}

interface SetNewGeneration {
  type: typeof SET_NEW_GENERATION,
  data: any
}

interface SetProvisionData {
  type: typeof SET_PROVISION_DATA
  data: any
}

interface SetCurrentProvisionName {
  type: typeof SET_CURRENT_PROVISION_NAME
  data: any
}

interface SetCurrentProvisionCommunicationList {
  type: typeof SET_CURRENT_PROVISION_COMMUNICATION_LIST
  data: any
}

interface SetCommunicationData {
  type: typeof SET_COMMUNICATION_DATA
  data: any
}

interface SetCurrentProvisionCommunicationListBudget {
  type: typeof SET_CURRENT_PROVISION_COMMUNICATION_LIST_BUDGET
  data: any
}

interface SetConsentThirdAssignmentOwner {
  type: typeof SET_CONSENT_THIRD_ASSIGNMENT_OWNER
  data: any
}

interface SetConsentThirdAssignmentPayer {
  type: typeof SET_CONSENT_THIRD_ASSIGNMENT_PAYER
  data: any
}

interface SetFinalPs {
  type: typeof SET_FINAL_PS
  data: any
}

interface SetCurrentProvisionHasContactMeButton {
  type: typeof SET_CURRENT_PROVISION_HAS_CONTACT_ME_BUTTON
  data: any
}

export type ProvisionsActionTypes = ResetProvisions | SetProvisionsCount | SetProvisionsList | AppendProvisionsList | ResetProvisionsList | SetCurrentProvisionId | SetCurrentProvision | SetCurrentProvisionScaleInd | SetCurrentProvisionPreparedToSend | SetModificationCups | SetSupplyTypes | SetSelectedSupplyType | SetDossierType | SetDossierSubtype | SetSupplySubtypes | SetSelectedSupplySubtype | SetBuildingCoordinates | SetCadastreDataCoordinates | SetCadastreDataZipcode | SetCadastreDataItem | ResetCadastreData | SetTechData | SetPowerList | SetValoration | SetCustomerApplicantData | SetCustomerApplicant | SetCustomerOwner | SetCustomerPayer | SetDeliveryAddress | SetInvoiceAddress | SetAccountingOffice | SetTeamManagerOffice | SetTramitadoraOffice | SetContactList | SetProvisionRequestData | SetNewGeneration | SetProvisionData | SetCurrentProvisionName | SetCurrentProvisionCommunicationList | SetCommunicationData | SetCurrentProvisionCommunicationListBudget |
SetConsentThirdAssignmentOwner | SetConsentThirdAssignmentPayer | SetFinalPs | SetCurrentProvisionHasContactMeButton | SetBillingEmail | SetIdAceptoFacturaDigital | SetFetchProvisions | SetSaveProvisions | SetErrorSaveProvisions | SetErrorFetchProvisions