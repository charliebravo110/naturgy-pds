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

const initialState: any = {
  list: [],
  supplyList: [],
  dossierList: [],
  newRequestSteps: {
    step1: '',
    step2: '',
    step3: '',
    step4: '',
    step5: '',
    step6: ''
  },
  newRequestData: {
    documentType: '',
    documentNumber: '',
    name: '',
    surName1: '',
    email: '',
    landline: '', // phone
    cellphone: '', // phonemob
    tipology: '',
    subtipology: '',
    cups: '',
    dossierNumber: '',
    comment: '',
    documents: []
  },
  newRequestSupply: {},
  newRequestDossier: {}
}

export function requestsReducer(state = initialState, action: RequestsActionTypes): any {
  switch (action.type) {
    case RESET_REQUESTS:
      return initialState

    case SET_REQUESTS_LIST:
      return {
        ...state,
        list: action.data
      }

    case RESET_REQUESTS_LIST:
      return {
        ...state,
        list: initialState.list
      }

    case SET_REQUESTS_LIST_SUPPLY:
      return {
        ...state,
        supplyList: action.data
      }

    case SET_REQUESTS_LIST_DOSSIER:
      return {
        ...state,
        dossierList: action.data
      }

    case SET_NEW_REQUEST_STEPS:
      return {
        ...state,
        newRequestSteps: {
          ...state.newRequestSteps,
          ...action.data
        }
      }

    case RESET_NEW_REQUEST_STEPS:
      return {
        ...state,
        newRequestSteps: initialState.newRequestSteps
      }

    case SET_NEW_REQUEST_DATA:
      return {
        ...state,
        newRequestData: {
          ...state.newRequestData,
          ...action.data
        }
      }

    case SET_NEW_REQUEST_DATA_DOCUMENT:
      return {
        ...state,
        newRequestData: {
          ...state.newRequestData,
          documents: [ ...state.newRequestData.documents, action.data ]
        }
      }

    case RESET_NEW_REQUEST_DATA_DOCUMENT:
      return {
        ...state,
        newRequestData: {
          ...state.newRequestData,
          documents: action.data
        }
      }

    case RESET_NEW_REQUEST_DATA:
      return {
        ...state,
        newRequestData: initialState.newRequestData
      }

    case SET_NEW_REQUEST_SUPPLY:
      return {
        ...state,
        newRequestSupply: action.data
      }

    case RESET_NEW_REQUEST_SUPPLY:
      return {
        ...state,
        newRequestSupply: initialState.newRequestSupply
      }

    case SET_NEW_REQUEST_DOSSIER:
      return {
        ...state,
        newRequestDossier: action.data
      }

    case RESET_NEW_REQUEST_DOSSIER:
      return {
        ...state,
        newRequestDossier: initialState.newRequestDossier
      }

    case SET_REQUESTS_LIST_DATA:
      const requestIndex = action.data.index

      return {
        ...state,
        list: [
          ...state.list.slice(0, requestIndex), {
            ...state.list[requestIndex],
            ...action.data.info
          },
          ...state.list.slice(requestIndex + 1)
        ]
      }

    case SET_REQUESTS_SUPPLY_LIST_DATA:
      const supplyRequestIndex = action.data.index

      return {
        ...state,
        supplyList: [
          ...state.supplyList.slice(0, supplyRequestIndex), {
            ...state.supplyList[supplyRequestIndex],
            ...action.data.info
          },
          ...state.supplyList.slice(supplyRequestIndex + 1)
        ]
      }

    case SET_REQUESTS_DOSSIER_LIST_DATA:
      const dossierRequestIndex = action.data.index

      return {
        ...state,
        dossierList: [
          ...state.dossierList.slice(0, dossierRequestIndex), {
            ...state.dossierList[dossierRequestIndex],
            ...action.data.info
          },
          ...state.dossierList.slice(dossierRequestIndex + 1)
        ]
      }

    default:
      return state
  }
}