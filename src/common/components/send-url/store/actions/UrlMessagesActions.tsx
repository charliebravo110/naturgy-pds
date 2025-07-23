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

export function resetUrlMessages(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES
  }
}

export function setUrlMessagesCategory(category: string): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_CATEGORY,
    data: category
  }
}

export function resetUrlMessagesCategory(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_CATEGORY
  }
}

export function setUrlMessagesDetail(detail: string): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_DETAIL,
    data: detail
  }
}

export function resetUrlMessagesDetail(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_DETAIL
  }
}

export function setUrlMessagesClientDossierPanel(clientDossierPanel: string): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_CLIENT_DOSSIER_PANEL,
    data: clientDossierPanel
  }
}

export function resetUrlMessagesClientDossierPanel(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_CLIENT_DOSSIER_PANEL
  }
}

export function setUrlMessagesAdminDossierPanel(adminDossierPanel: string): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_ADMIN_DOSSIER_PANEL,
    data: adminDossierPanel
  }
}

export function resetUrlMessagesAdminDossierPanel(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_ADMIN_DOSSIER_PANEL
  }
}

export function setUrlMessagesSupplyDataSupply(supply: string): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_SUPPLYDATA_SUPPLY,
    data: supply
  }
}

export function resetUrlMessagesSupplyDataSupply(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_SUPPLYDATA_SUPPLY
  }
}

export function setUrlMessagesSupplyDataTabValue(tabValue: string): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_SUPPLYDATA_TAB_VALUE,
    data: tabValue
  }
}

export function resetUrlMessagesSupplyDataTabValue(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_SUPPLYDATA_TAB_VALUE
  }
}

export function setUrlMessagesSupplyDataMenuTabValue(menuTabValue: string): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_SUPPLYDATA_MENU_TAB_VALUE,
    data: menuTabValue
  }
}

export function resetUrlMessagesSupplyDataMenuTabValue(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_SUPPLYDATA_MENU_TAB_VALUE
  }
}

export function setUrlMessagesSupplyDataConsumptionTabValue(consumptionTabValue: string): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_SUPPLYDATA_CONSUMPTION_TAB_VALUE,
    data: consumptionTabValue
  }
}

export function resetUrlMessagesSupplyDataConsumptionTabValue(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_SUPPLYDATA_CONSUMPTION_TAB_VALUE
  }
}

export function setUrlMessagesSupplyDataGenerationTabValue(generationTabValue: string): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_SUPPLYDATA_GENERATION_TAB_VALUE,
    data: generationTabValue
  }
}

export function resetUrlMessagesSupplyDataGenerationTabValue(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_SUPPLYDATA_GENERATION_TAB_VALUE
  }
}

export function setUrlMessagesSupplyDataIsSelfConsumption(isSelfConsumption: boolean): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_SUPPLYDATA_IS_SELF_CONSUMPTION,
    data: isSelfConsumption
  }
}

export function resetUrlMessagesSupplyDataIsSelfConsumption(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_SUPPLYDATA_IS_SELF_CONSUMPTION
  }
}

export function setUrlMessagesSupplyDataIsGeneration(generationTabValue: boolean): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_SUPPLYDATA_IS_GENERATION,
    data: generationTabValue
  }
}

export function resetUrlMessagesSupplyDataIsGeneration(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_SUPPLYDATA_IS_GENERATION
  }
}

export function setUrlMessagesDossierDataDossier(dossier: string): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_DOSSIERDATA_DOSSIER,
    data: dossier
  }
}

export function resetUrlMessagesDossierDataDossier(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_DOSSIERDATA_DOSSIER
  }
}

export function setUrlMessagesDossierDataPanel(panel: string): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_DOSSIERDATA_PANEL,
    data: panel
  }
}

export function resetUrlMessagesDossierDataPanel(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_DOSSIERDATA_PANEL
  }
}

export function setUrlMessagesDossierDataPanelEnablement(panelEnablement: any): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT,
    data: panelEnablement
  }
}

export function resetUrlMessagesDossierDataPanelEnablement(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT
  }
}

export function setUrlMessagesDossierDataPanelEnablementPanel1(panel1: string): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL1,
    data: panel1
  }
}

export function resetUrlMessagesDossierDataPanelEnablementPanel1(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL1
  }
}

export function setUrlMessagesDossierDataPanelEnablementPanel2(panel2: string): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL2,
    data: panel2
  }
}

export function resetUrlMessagesDossierDataPanelEnablementPanel2(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL2
  }
}

export function setUrlMessagesDossierDataPanelEnablementPanel3(panel3: string): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL3,
    data: panel3
  }
}

export function resetUrlMessagesDossierDataPanelEnablementPanel3(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL3
  }
}

export function setUrlMessagesDossierDataPanelEnablementPanel4(panel4: string): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL4,
    data: panel4
  }
}

export function resetUrlMessagesDossierDataPanelEnablementPanel4(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL4
  }
}

export function setUrlMessagesDossierDataPanelEnablementPanel5(panel5: string): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL5,
    data: panel5
  }
}

export function resetUrlMessagesDossierDataPanelEnablementPanel5(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL5
  }
}

export function setUrlMessagesDossierDataPanelEnablementPanel6(panel6: string): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL6,
    data: panel6
  }
}

export function resetUrlMessagesDossierDataPanelEnablementPanel6(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_DOSSIERDATA_PANEL_ENABLEMENT_PANEL6
  }
}

export function setUrlMessagesRequestDataRequest(request: string): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_REQUESTDATA_REQUEST,
    data: request
  }
}

export function resetUrlMessagesRequestDataRequest(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_REQUESTDATA_REQUEST
  }
}

export function setUrlMessagesSupplyData(supplyData: any): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_SUPPLYDATA,
    data: supplyData
  }
}

export function resetUrlMessagesSupplyData(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_SUPPLYDATA
  }
}

export function setUrlMessagesDossierData(dossierData: any): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_DOSSIERDATA,
    data: dossierData
  }
}

export function resetUrlMessagesDossierData(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_DOSSIERDATA
  }
}

export function setUrlMessagesRequestData(requestData: any): UrlMessagesActionTypes {
  return {
    type: SET_URL_MESSAGES_REQUESTDATA,
    data: requestData
  }
}

export function resetUrlMessagesRequestData(): UrlMessagesActionTypes {
  return {
    type: RESET_URL_MESSAGES_REQUESTDATA
  }
}