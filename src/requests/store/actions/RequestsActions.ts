import {
  RESET_REQUESTS,
  SET_REQUESTS_LIST,
  RESET_REQUESTS_LIST,
  SET_REQUESTS_LIST_SUPPLY,
  SET_REQUESTS_LIST_DOSSIER,
  SET_NEW_REQUEST_STEPS,
  RESET_NEW_REQUEST_STEPS,
  SET_NEW_REQUEST_DATA,
  SET_NEW_REQUEST_DATA_DOCUMENT,
  RESET_NEW_REQUEST_DATA_DOCUMENT,
  RESET_NEW_REQUEST_DATA,
  SET_NEW_REQUEST_SUPPLY,
  RESET_NEW_REQUEST_SUPPLY,
  SET_NEW_REQUEST_DOSSIER,
  RESET_NEW_REQUEST_DOSSIER,
  SET_REQUESTS_LIST_DATA,
  SET_REQUESTS_SUPPLY_LIST_DATA,
  SET_REQUESTS_DOSSIER_LIST_DATA,
  RequestsActionTypes
} from '../../interfaces/ActionTypes'

export function resetRequests(): RequestsActionTypes {
  return {
    type: RESET_REQUESTS
  }
}

export function setRequestsList(list: any): RequestsActionTypes {
  return {
    type: SET_REQUESTS_LIST,
    data: list
  }
}

export function resetRequestsList(): RequestsActionTypes {
  return {
    type: RESET_REQUESTS_LIST
  }
}

export function setRequestsListSupply(list: any): RequestsActionTypes {
  return {
    type: SET_REQUESTS_LIST_SUPPLY,
    data: list
  }
}

export function setRequestsListDossier(list: any): RequestsActionTypes {
  return {
    type: SET_REQUESTS_LIST_DOSSIER,
    data: list
  }
}

export function setNewRequestSteps(steps: any): RequestsActionTypes {
  return {
    type: SET_NEW_REQUEST_STEPS,
    data: steps
  }
}

export function resetNewRequestSteps(): RequestsActionTypes {
  return {
    type: RESET_NEW_REQUEST_STEPS
  }
}

export function setNewRequestData(data: any): RequestsActionTypes {
  return {
    type: SET_NEW_REQUEST_DATA,
    data
  }
}

export function setNewRequestDataDocument(document: any): RequestsActionTypes {
  return {
    type: SET_NEW_REQUEST_DATA_DOCUMENT,
    data: document
  }
}

export function resetNewRequestDataDocument(data: any): RequestsActionTypes {
  return {
    type: RESET_NEW_REQUEST_DATA_DOCUMENT,
    data
  }
}

export function resetNewRequestData(): RequestsActionTypes {
  return {
    type: RESET_NEW_REQUEST_DATA
  }
}

export function setNewRequestSupply(supply: any): RequestsActionTypes {
  return {
    type: SET_NEW_REQUEST_SUPPLY,
    data: supply
  }
}

export function resetNewRequestSupply(): RequestsActionTypes {
  return {
    type: RESET_NEW_REQUEST_SUPPLY
  }
}

export function setNewRequestDossier(dossier: any): RequestsActionTypes {
  return {
    type: SET_NEW_REQUEST_DOSSIER,
    data: dossier
  }
}

export function resetNewRequestDossier(): RequestsActionTypes {
  return {
    type: RESET_NEW_REQUEST_DOSSIER
  }
}

export function setRequestsListData(info: any, index: number): RequestsActionTypes {
  return {
    type: SET_REQUESTS_LIST_DATA,
    data: {
      info,
      index
    }
  }
}

export function setRequestsSupplyListData(info: any, index: number): RequestsActionTypes {
  return {
    type: SET_REQUESTS_SUPPLY_LIST_DATA,
    data: {
      info,
      index
    }
  }
}

export function setRequestsDossierListData(info: any, index: number): RequestsActionTypes {
  return {
    type: SET_REQUESTS_DOSSIER_LIST_DATA,
    data: {
      info,
      index
    }
  }
}
