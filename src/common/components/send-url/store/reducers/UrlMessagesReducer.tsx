import {
  RESET_URL_MESSAGES,
  SET_URL_MESSAGES_CATEGORY,
  RESET_URL_MESSAGES_CATEGORY,
  SET_URL_MESSAGES_DETAIL,
  RESET_URL_MESSAGES_DETAIL,
  SET_URL_MESSAGES_CLIENT_DOSSIER_PANEL,
  RESET_URL_MESSAGES_CLIENT_DOSSIER_PANEL,
  SET_URL_MESSAGES_ADMIN_DOSSIER_PANEL,
  RESET_URL_MESSAGES_ADMIN_DOSSIER_PANEL,
  SET_URL_MESSAGES_SUPPLYDATA_SUPPLY,
  RESET_URL_MESSAGES_SUPPLYDATA_SUPPLY,
  SET_URL_MESSAGES_SUPPLYDATA_TAB_VALUE,
  RESET_URL_MESSAGES_SUPPLYDATA_TAB_VALUE,
  SET_URL_MESSAGES_SUPPLYDATA_MENU_TAB_VALUE,
  RESET_URL_MESSAGES_SUPPLYDATA_MENU_TAB_VALUE,
  SET_URL_MESSAGES_SUPPLYDATA_CONSUMPTION_TAB_VALUE,
  RESET_URL_MESSAGES_SUPPLYDATA_CONSUMPTION_TAB_VALUE,
  SET_URL_MESSAGES_SUPPLYDATA_GENERATION_TAB_VALUE,
  RESET_URL_MESSAGES_SUPPLYDATA_GENERATION_TAB_VALUE,
  SET_URL_MESSAGES_SUPPLYDATA_IS_SELF_CONSUMPTION,
  RESET_URL_MESSAGES_SUPPLYDATA_IS_SELF_CONSUMPTION,
  SET_URL_MESSAGES_SUPPLYDATA_IS_GENERATION,
  RESET_URL_MESSAGES_SUPPLYDATA_IS_GENERATION,
  SET_URL_MESSAGES_DOSSIERDATA_DOSSIER,
  RESET_URL_MESSAGES_DOSSIERDATA_DOSSIER,
  SET_URL_MESSAGES_DOSSIERDATA_PANEL,
  RESET_URL_MESSAGES_DOSSIERDATA_PANEL,
  SET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT,
  RESET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT,
  SET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL1,
  RESET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL1,
  SET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL2,
  RESET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL2,
  SET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL3,
  RESET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL3,
  SET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL4,
  RESET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL4,
  SET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL5,
  RESET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL5,
  SET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL6,
  RESET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL6,
  SET_URL_MESSAGES_REQUESTDATA_REQUEST,
  RESET_URL_MESSAGES_REQUESTDATA_REQUEST,
  SET_URL_MESSAGES_SUPPLYDATA,
  RESET_URL_MESSAGES_SUPPLYDATA,
  SET_URL_MESSAGES_DOSSIERDATA,
  RESET_URL_MESSAGES_DOSSIERDATA,
  SET_URL_MESSAGES_REQUESTDATA,
  RESET_URL_MESSAGES_REQUESTDATA,
  UrlMessagesActionTypes
} from '../../interfaces/ActionTypes'

const initialState: any = {
  category: '',
  detail: '',
  clientDossierPanel: '',
  adminDossierPanel: '',
  supplyData: {
    supply: '',
    tabValue: '',
    menuTabValue: '',
    consumptionTabValue: '',
    generationTabValue: '',
    isSelfConsumption: false,
    isGeneration: false,
  },
  dossierData: {
    dossier: '',
    panel: '',
    panelEnablement: {
      panel1: '',
      panel2: '',
      panel3: '',
      panel4: '',
      panel5: '',
      panel6: '',
    }
  },
  requestData: {
    request: ''
  }
}

export function urlMessagesReducer(state = initialState, action: UrlMessagesActionTypes): any {
  switch (action.type) {
    case RESET_URL_MESSAGES:
      return initialState

    case SET_URL_MESSAGES_CATEGORY:
      return {
        ...state,
        category: action.data
      }

    case RESET_URL_MESSAGES_CATEGORY:
      return {
        ...state,
        category: initialState.category
      }

    case SET_URL_MESSAGES_DETAIL:
      return {
        ...state,
        detail: action.data
      }

    case RESET_URL_MESSAGES_DETAIL:
      return {
        ...state,
        detail: initialState.detail
      }

    case SET_URL_MESSAGES_CLIENT_DOSSIER_PANEL:
      return {
        ...state,
        clientDossierPanel: action.data
      }

    case RESET_URL_MESSAGES_CLIENT_DOSSIER_PANEL:
      return {
        ...state,
        clientDossierPanel: initialState.clientDossierPanel
      }

    case SET_URL_MESSAGES_ADMIN_DOSSIER_PANEL:
      return {
        ...state,
        adminDossierPanel: action.data
      }

    case RESET_URL_MESSAGES_ADMIN_DOSSIER_PANEL:
      return {
        ...state,
        adminDossierPanel: initialState.adminDossierPanel
      }

    case SET_URL_MESSAGES_SUPPLYDATA_SUPPLY:
      return {
        ...state,
        supplyData: {
          ...state.supplyData,
          supply: action.data
        }
      }

    case RESET_URL_MESSAGES_SUPPLYDATA_SUPPLY:
      return {
        ...state,
        supplyData: {
          ...state.supplyData,
          supply: initialState.supplyData.supply
        }
      }

    case SET_URL_MESSAGES_SUPPLYDATA_TAB_VALUE:
      return {
        ...state,
        supplyData: {
          ...state.supplyData,
          tabValue: action.data
        }
      }

    case RESET_URL_MESSAGES_SUPPLYDATA_TAB_VALUE:
      return {
        ...state,
        supplyData: {
          ...state.supplyData,
          tabValue: initialState.supplyData.tabValue
        }
      }

    case SET_URL_MESSAGES_SUPPLYDATA_MENU_TAB_VALUE:
      return {
        ...state,
        supplyData: {
          ...state.supplyData,
          menuTabValue: action.data
        }
      }

    case RESET_URL_MESSAGES_SUPPLYDATA_MENU_TAB_VALUE:
      return {
        ...state,
        supplyData: {
          ...state.supplyData,
          menuTabValue: initialState.supplyData.menuTabValue
        }
      }

    case SET_URL_MESSAGES_SUPPLYDATA_CONSUMPTION_TAB_VALUE:
      return {
        ...state,
        supplyData: {
          ...state.supplyData,
          consumptionTabValue: action.data
        }
      }

    case RESET_URL_MESSAGES_SUPPLYDATA_CONSUMPTION_TAB_VALUE:
      return {
        ...state,
        supplyData: {
          ...state.supplyData,
          consumptionTabValue: initialState.supplyData.consumptionTabValue
        }
      }

    case SET_URL_MESSAGES_SUPPLYDATA_GENERATION_TAB_VALUE:
      return {
        ...state,
        supplyData: {
          ...state.supplyData,
          generationTabValue: action.data
        }
      }

    case RESET_URL_MESSAGES_SUPPLYDATA_GENERATION_TAB_VALUE:
      return {
        ...state,
        supplyData: {
          ...state.supplyData,
          generationTabValue: initialState.supplyData.generationTabValue
        }
      }

    case SET_URL_MESSAGES_SUPPLYDATA_IS_SELF_CONSUMPTION:
      return {
        ...state,
        supplyData: {
          ...state.supplyData,
          isSelfConsumption: action.data
        }
      }
  
    case RESET_URL_MESSAGES_SUPPLYDATA_IS_SELF_CONSUMPTION:
      return {
        ...state,
        supplyData: {
          ...state.supplyData,
          isSelfConsumption: initialState.supplyData.isSelfConsumption
        }
      }

    case SET_URL_MESSAGES_SUPPLYDATA_IS_GENERATION:
      return {
        ...state,
        supplyData: {
          ...state.supplyData,
          isGeneration: action.data
        }
      }
    
    case RESET_URL_MESSAGES_SUPPLYDATA_IS_GENERATION:
      return {
        ...state,
        supplyData: {
          ...state.supplyData,
          isGeneration: initialState.supplyData.isGeneration
        }
      }

    case SET_URL_MESSAGES_DOSSIERDATA_DOSSIER:
      return {
        ...state,
        dossierData: {
          ...state.dossierData,
          dossier: action.data
        }
      }

    case RESET_URL_MESSAGES_DOSSIERDATA_DOSSIER:
      return {
        ...state,
        dossierData: {
          ...state.dossierData,
          dossier: initialState.dossierData.dossier
        }
      }

    case SET_URL_MESSAGES_DOSSIERDATA_PANEL:
      return {
        ...state,
        dossierData: {
          ...state.dossierData,
          panel: action.data
        }
      }

    case RESET_URL_MESSAGES_DOSSIERDATA_PANEL:
      return {
        ...state,
        dossierData: {
          ...state.dossierData,
          panel: initialState.dossierData.panel
        }
      }

    case SET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT:
      return {
        ...state,
        dossierData: {
          ...state.dossierData,
          panelEnablement: action.data
        }
      }

    case RESET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT:
      return {
        ...state,
        dossierData: {
          ...state.dossierData,
          panelEnablement: initialState.dossierData.panelEnablement
        }
      }

    case SET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL1:
      return {
        ...state,
        dossierData: {
          ...state.dossierData,
          panelEnablement: {
            ...state.dossierData.panelEnablement,
            panel1: action.data
          }
        }
      }

    case RESET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL1:
      return {
        ...state,
        dossierData: {
          ...state.dossierData,
          panelEnablement: {
            ...state.dossierData.panelEnablement,
            panel1: initialState.dossierData.panelEnablement.panel1
          }
        }
      }

    case SET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL2:
      return {
        ...state,
        dossierData: {
          ...state.dossierData,
          panelEnablement: {
            ...state.dossierData.panelEnablement,
            panel2: action.data
          }
        }
      }

    case RESET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL2:
      return {
        ...state,
        dossierData: {
          ...state.dossierData,
          panelEnablement: {
            ...state.dossierData.panelEnablement,
            panel2: initialState.dossierData.panelEnablement.panel2
          }
        }
      }

    case SET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL3:
      return {
        ...state,
        dossierData: {
          ...state.dossierData,
          panelEnablement: {
            ...state.dossierData.panelEnablement,
            panel3: action.data
          }
        }
      }

    case RESET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL3:
      return {
        ...state,
        dossierData: {
          ...state.dossierData,
          panelEnablement: {
            ...state.dossierData.panelEnablement,
            panel3: initialState.dossierData.panelEnablement.panel3
          }
        }
      }

    case SET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL4:
      return {
        ...state,
        dossierData: {
          ...state.dossierData,
          panelEnablement: {
            ...state.dossierData.panelEnablement,
            panel4: action.data
          }
        }
      }

    case RESET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL4:
      return {
        ...state,
        dossierData: {
          ...state.dossierData,
          panelEnablement: {
            ...state.dossierData.panelEnablement,
            panel4: initialState.dossierData.panelEnablement.panel4
          }
        }
      }

    case SET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL5:
      return {
        ...state,
        dossierData: {
          ...state.dossierData,
          panelEnablement: {
            ...state.dossierData.panelEnablement,
            panel5: action.data
          }
        }
      }

    case RESET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL5:
      return {
        ...state,
        dossierData: {
          ...state.dossierData,
          panelEnablement: {
            ...state.dossierData.panelEnablement,
            panel5: initialState.dossierData.panelEnablement.panel5
          }
        }
      }

    case SET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL6:
      return {
        ...state,
        dossierData: {
          ...state.dossierData,
          panelEnablement: {
            ...state.dossierData.panelEnablement,
            panel6: action.data
          }
        }
      }

    case RESET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL6:
      return {
        ...state,
        dossierData: {
          ...state.dossierData,
          panelEnablement: {
            ...state.dossierData.panelEnablement,
            panel6: initialState.dossierData.panelEnablement.panel6
          }
        }
      }

    case SET_URL_MESSAGES_REQUESTDATA_REQUEST:
      return {
        ...state,
        requestData: {
          ...state.requestData,
          request: action.data
        }
      }

    case RESET_URL_MESSAGES_REQUESTDATA_REQUEST:
      return {
        ...state,
        requestData: {
          ...state.requestData,
          request: initialState.requestData.request
        }
      }

    case SET_URL_MESSAGES_SUPPLYDATA:
      return {
        ...state,
        supplyData: action.data
      }

    case RESET_URL_MESSAGES_SUPPLYDATA:
      return {
        ...state,
        supplyData: initialState.supplyData
      }

    case SET_URL_MESSAGES_DOSSIERDATA:
      return {
        ...state,
        dossierData: action.data
      }

    case RESET_URL_MESSAGES_DOSSIERDATA:
      return {
        ...state,
        dossierData: initialState.dossierData
      }

    case SET_URL_MESSAGES_REQUESTDATA:
      return {
        ...state,
        requestData: action.data
      }

    case RESET_URL_MESSAGES_REQUESTDATA:
      return {
        ...state,
        requestData: initialState.requestData
      }

    default:
      return state
  }
}
