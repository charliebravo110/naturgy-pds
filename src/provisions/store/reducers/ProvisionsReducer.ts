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
  SET_CUSTOMER_APPLICANT,
  SET_CUSTOMER_APPLICANT_DATA,
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

const initialState: any = {
  count: 0,
  provisionsList: [],
  currentProvisionId: '',
  currentProvision: {},
  currentProvisionScaleInd: '',
  currentProvisionPreparedToSend: false,
  currentProvisionHasContactMeButton: false,
  modificationCups: {},
  supplyTypes: [],
  selectedSupplyType: '',
  dossierType: '',
  dossierSubtype: '',
  supplySubtypes: [],
  selectedSupplySubtype: '',
  buildingCoordinates: {},
  cadastreData: {
    x: '',
    y: '',
    zipcode: '',
    item: {}
  },
  techData: {},
  powerList: [],
  valoration: {},
  customerApplicantData: {},
  customerApplicant: {},
  customerOwner: {},
  customerPayer: {},
  deliveryAddress: {},
  invoiceAddress: {},
  accountingOffice: {},
  teamManagerOffice: {},
  tramitadoraOffice: {},
  contactList: [],
  requestData: {},
  newGeneration: {
    typologies: [],
    connections: [],
    selectedConnection: '',
    customerWithCups: true,
    dossier: '',
    cups: ''
  },
  consentThirdAssignmentOwner: '0',
  consentThirdAssignmentPayer: '0',
  finalPs: '',
  fetchFormError: null,
  saveFormError: null,
  fetchFormSuccess: false,
  saveFormSuccess: false,
  saveDraftBtn: false,      
  errorSaveDraftBtn: false,
}

export function provisionsReducer(state = initialState, action: ProvisionsActionTypes): any {
  switch (action.type) {
    case RESET_PROVISIONS:
      return initialState

    case SET_PROVISIONS_COUNT:
      return {
        ...state,
        count: action.data
      }

    case SET_PROVISIONS_LIST:
      return {
        ...state,
        provisionsList: action.data
      }

    case APPEND_PROVISIONS_LIST:
      return {
        ...state,
        provisionsList: [
          ...state.provisionsList,
          ...action.data
        ]
      }

    case RESET_PROVISIONS_LIST:
      return {
        ...state,
        provisionsList: initialState.provisionsList
      }

    case SET_CURRENT_PROVISION_ID:
      return {
        ...state,
        currentProvisionId: action.data
      }

    case SET_CURRENT_PROVISION:
      return {
        ...state,
        currentProvision: action.data
      }

    case SET_CURRENT_PROVISION_SCALE_IND:
      return {
        ...state,
        currentProvisionScaleInd: action.data
      }

    case SET_CURRENT_PROVISION_PREPARED_TO_SEND:
      return {
        ...state,
        currentProvisionPreparedToSend: action.data
      }

    case SET_MODIFICATION_CUPS:
      return {
        ...state,
        modificationCups: action.data
      }

    case SET_SUPPLY_TYPES:
      return {
        ...state,
        supplyTypes: action.data
      }

    case SET_SELECTED_SUPPLY_TYPE:
      return {
        ...state,
        selectedSupplyType: action.data
      }

    case SET_DOSSIER_TYPE:
      return {
        ...state,
        dossierType: action.data
      }

    case SET_DOSSIER_SUBTYPE:
      return {
        ...state,
        dossierSubtype: action.data
      }

    case SET_SUPPLY_SUBTYPES:
      return {
        ...state,
        supplySubtypes: action.data
      }

    case SET_SELECTED_SUPPLY_SUBTYPE:
      return {
        ...state,
        selectedSupplySubtype: action.data
      }

    case SET_BUILDING_COORDINATES:
      return {
        ...state,
        buildingCoordinates: {
          x: action.data.x,
          y: action.data.y
        }
      }
    case SET_CADASTRE_DATA_COORDINATES:
      return {
        ...state,
        cadastreData: {
          ...state.cadastreData,
          x: action.data.x,
          y: action.data.y
        }
      }

    case SET_CADASTRE_DATA_ZIPCODE:
      return {
        ...state,
        cadastreData: {
          ...state.cadastreData,
          zipcode: action.data
        }
      }

    case SET_CADASTRE_DATA_ITEM:
      return {
        ...state,
        cadastreData: {
          ...state.cadastreData,
          item: action.data
        }
      }

    case RESET_CADASTRE_DATA:
      return {
        ...state,
        cadastreData: {
          x: '',
          y: '',
          zipcode: '',
          item: {}
        }
      }

    case SET_TECH_DATA:
      return {
        ...state,
        techData: action.data
      }

    case SET_POWER_LIST:
      return {
        ...state,
        powerList: action.data
      }

    case SET_VALORATION:
      return {
        ...state,
        valoration: action.data
      }

    case SET_CUSTOMER_APPLICANT_DATA:
      return {
        ...state,
        customerApplicantData: action.data
      }

    case SET_CUSTOMER_APPLICANT:
      return {
        ...state,
        customerApplicant: action.data
      }

    case SET_CUSTOMER_OWNER:
      return {
        ...state,
        customerOwner: action.data
      }

    case SET_CUSTOMER_PAYER:
      return {
        ...state,
        customerPayer: action.data
      }

    case SET_DELIVERY_ADDRESS:
      return {
        ...state,
        deliveryAddress: action.data
      }

    case SET_INVOICE_ADDRESS:
      return {
        ...state,
        invoiceAddress: action.data
      }

    case SET_BILLING_EMAIL:
      return {
        ...state,
        billingEmail: action.data
      }

    case SET_ACEPTO_FACTURADIGITAL:
      return {
        ...state,
        indAceptoFacturaDigital: action.data
      }

    case SET_ACCOUNTING_OFFICE:
      return {
        ...state,
        accountingOffice: action.data
      }

    case SET_TEAM_MANAGER_OFFICE:
      return {
        ...state,
        teamManagerOffice: action.data
      }

    case SET_TRAMITADORA_OFFICE:
      return {
        ...state,
        tramitadoraOffice: action.data
      }

    case SET_CONTACT_LIST:
      return {
        ...state,
        contactList: action.data
      }

    case SET_REQUEST_DATA:
      return {
        ...state,
        requestData: action.data
      }

    case SET_NEW_GENERATION:
      return {
        ...state,
        newGeneration: {
          ...state.newGeneration,
          ...action.data
        }
      }

    case SET_PROVISION_DATA:
      const index = action.data.index

      return {
        ...state,
        provisionsList: [
          ...state.provisionsList.slice(0, index), {
            ...state.provisionsList[index],
            ...action.data.info
          },
          ...state.provisionsList.slice(index + 1)
        ]
      }

    case SET_CURRENT_PROVISION_NAME:
      return {
        ...state,
        currentProvision: {
          ...state.currentProvision,
          name: action.data
        }
      }

    case SET_CURRENT_PROVISION_COMMUNICATION_LIST:
      return {
        ...state,
        currentProvision: {
          ...state.currentProvision,
          communicationList: action.data
        }
      }

    case SET_COMMUNICATION_DATA:
      const communicationIndex = action.data.index

      return {
        ...state,
        currentProvision: {
          ...state.currentProvision,
          communicationList: [
            ...state.currentProvision.communicationList.slice(0, communicationIndex), {
              ...state.currentProvision.communicationList[communicationIndex],
              ...action.data.info
            },
            ...state.currentProvision.communicationList.slice(communicationIndex + 1)
          ]
        }
      }

    case SET_CURRENT_PROVISION_COMMUNICATION_LIST_BUDGET:
      return {
        ...state,
        currentProvision: {
          ...state.currentProvision,
          communicationListBudget: action.data
        }
      }

    case SET_CONSENT_THIRD_ASSIGNMENT_OWNER:
      return {
        ...state,
        consentThirdAssignmentOwner: action.data
      }

    case SET_CONSENT_THIRD_ASSIGNMENT_PAYER:
      return {
        ...state,
        consentThirdAssignmentPayer: action.data
      }

    case SET_FINAL_PS:
      return {
        ...state,
        finalPs: action.data
      }

    case SET_CURRENT_PROVISION_HAS_CONTACT_ME_BUTTON:
      return {
        ...state,
        currentProvisionHasContactMeButton: action.data
      }

      case SET_FETCH_FORM_SUCCESS:
        return {
          ...state,
          fetchFormSuccess: true,
          fetchFormError: null,
        };
  
      case SET_FETCH_FORM_ERROR:
        return {
          ...state,
          fetchFormError: action.error,
          fetchFormSuccess: false,
        };
  
      case SET_SAVE_FORM_SUCCESS:
        return {
          ...state,
          saveFormSuccess: true,
          saveFormError: null,
          saveDraftBtn: true,     
          errorSaveDraftBtn: false,
        };
  
      case SET_SAVE_FORM_ERROR:
        return {
          ...state,
          saveFormError: action.error,
          saveFormSuccess: false,
          saveDraftBtn: false,     
          errorSaveDraftBtn: true,
        };

    default:
      return state
  }
}
