export const RESET_REQUESTS = '@@requests/RESET_REQUESTS'
export const SET_REQUESTS_LIST = '@@requests/SET_REQUESTS_LIST'
export const RESET_REQUESTS_LIST = '@@requests/RESET_REQUESTS_LIST'
export const SET_REQUESTS_LIST_SUPPLY = '@@requests/SET_REQUESTS_LIST_SUPPLY'
export const SET_REQUESTS_LIST_DOSSIER = '@@requests/SET_REQUESTS_LIST_DOSSIER'
export const SET_NEW_REQUEST_STEPS = '@@requests/SET_NEW_REQUEST_STEPS'
export const RESET_NEW_REQUEST_STEPS = '@@requests/RESET_NEW_REQUEST_STEPS'
export const SET_NEW_REQUEST_DATA = '@@requests/SET_NEW_REQUEST_DATA'
export const SET_NEW_REQUEST_DATA_DOCUMENT = '@@requests/SET_NEW_REQUEST_DATA_DOCUMENT'
export const RESET_NEW_REQUEST_DATA_DOCUMENT = '@@requests/RESET_NEW_REQUEST_DATA_DOCUMENT'
export const RESET_NEW_REQUEST_DATA = '@@requests/RESET_NEW_REQUEST_DATA'
export const SET_NEW_REQUEST_SUPPLY = '@@requests/SET_NEW_REQUEST_SUPPLY'
export const RESET_NEW_REQUEST_SUPPLY = '@@requests/RESET_NEW_REQUEST_SUPPLY'
export const SET_NEW_REQUEST_DOSSIER = '@@requests/SET_NEW_REQUEST_DOSSIER'
export const RESET_NEW_REQUEST_DOSSIER = '@@requests/RESET_NEW_REQUEST_DOSSIER'
export const SET_REQUESTS_LIST_DATA = '@@requests/SET_REQUESTS_LIST_DATA'
export const SET_REQUESTS_SUPPLY_LIST_DATA = '@@requests/SET_REQUESTS_SUPPLY_LIST_DATA'
export const SET_REQUESTS_DOSSIER_LIST_DATA = '@@requests/SET_REQUESTS_DOSSIER_LIST_DATA'

interface ResetRequests {
  type: typeof RESET_REQUESTS
}

interface SetRequestsList {
  type: typeof SET_REQUESTS_LIST
  data: any
}

interface ResetRequestsList {
  type: typeof RESET_REQUESTS_LIST
}

interface SetRequestsListSupply {
  type: typeof SET_REQUESTS_LIST_SUPPLY
  data: any
}

interface SetRequestsListDossier {
  type: typeof SET_REQUESTS_LIST_DOSSIER
  data: any
}

interface SetNewRequestSteps {
  type: typeof SET_NEW_REQUEST_STEPS
  data: any
}

interface ResetNewRequestSteps {
  type: typeof RESET_NEW_REQUEST_STEPS
}

interface SetNewRequestData {
  type: typeof SET_NEW_REQUEST_DATA
  data: any
}

interface SetNewRequestDataDocument {
  type: typeof SET_NEW_REQUEST_DATA_DOCUMENT
  data: any
}

interface ResetNewRequestDataDocument {
  type: typeof RESET_NEW_REQUEST_DATA_DOCUMENT
  data: any
}

interface ResetNewRequestData {
  type: typeof RESET_NEW_REQUEST_DATA
}

interface SetNewRequestSupply {
  type: typeof SET_NEW_REQUEST_SUPPLY
  data: any
}

interface ResetNewRequestSupply {
  type: typeof RESET_NEW_REQUEST_SUPPLY
}

interface SetNewRequestDossier {
  type: typeof SET_NEW_REQUEST_DOSSIER
  data: any
}

interface ResetNewRequestDossier {
  type: typeof RESET_NEW_REQUEST_DOSSIER
}

interface SetRequestsListData {
  type: typeof SET_REQUESTS_LIST_DATA
  data: any
}

interface SetRequestsSupplyListData {
  type: typeof SET_REQUESTS_SUPPLY_LIST_DATA
  data: any
}

interface SetRequestsDossierListData {
  type: typeof SET_REQUESTS_DOSSIER_LIST_DATA
  data: any
}

export type RequestsActionTypes = ResetRequests |
  SetRequestsList |
  ResetRequestsList |
  SetRequestsListSupply |
  SetRequestsListDossier |
  SetNewRequestSteps |
  ResetNewRequestSteps |
  SetNewRequestData |
  SetNewRequestDataDocument |
  ResetNewRequestDataDocument |
  ResetNewRequestData |
  SetNewRequestSupply |
  ResetNewRequestSupply |
  SetNewRequestDossier |
  ResetNewRequestDossier |
  SetRequestsListData |
  SetRequestsSupplyListData |
  SetRequestsDossierListData
