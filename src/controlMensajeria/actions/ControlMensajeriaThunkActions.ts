// Redux and thunk types for defining async actions and state
import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from '../../common/store/reducers/MainReducer'

// Service responsible for API calls related to messaging control
import ControlMensajeriaService from '../service/ControlMensajeriaService'

// Instance of the messaging control service
const controlMensajeriaService = new ControlMensajeriaService()

/**
 * Async thunk to get the list of provinces.
 * @param province - Province name or code to filter the list.
 * @param callback - Function to call with the response or on error.
 */
export const thunkGetListProvinces = (province: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
    try {
      // Retrieve auth token from session storage
      const token = sessionStorage.getItem('token') || '';
  
      // Call the service to get the province list
      const response = await controlMensajeriaService.listProvinces(province, token);
  
      // Pass the result to the callback
      callback && callback(response);
    } catch (e) {
      // Log error and trigger callback with no arguments
      console.error('Error al obtener lista de provincias:', e)
  
      callback && callback()
    }
  }

/**
 * Async thunk to get the list of municipalities.
 * @param municipalityName - Name of the municipality to search for.
 * @param municipalityCode - Code of the municipality.
 * @param provinceCode - Code of the province.
 * @param zipCode - Zip code filter.
 * @param callback - Function to call with the response or on error.
 */
export const thunkGetListMunicipalities = (municipalityName: string, municipalityCode: string, provinceCode: string, zipCode: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
    try {
      // Retrieve auth token from session storage
      const token = sessionStorage.getItem('token') || '';
  
      // Call the service to get the municipality list
      const response = await controlMensajeriaService.listMunicipalities(municipalityName, municipalityCode, provinceCode, zipCode, token);
  
      // Pass the result to the callback
      callback && callback(response);
    } catch (e) {
      // Log error and trigger callback with no arguments
      console.error('Error al obtener lista de municipios:', e)
  
      callback && callback()
    }
  }

/**
 * Async thunk to get the list of zip codes.
 * @param zipCode - Zip code to search for.
 * @param municipalityCode - Municipality code filter.
 * @param provinceCode - Province code filter.
 * @param callback - Function to call with the response or on error.
 */
export const thunkGetListZipCodes = (zipCode: string, municipalityCode: string, provinceCode: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
    try {
      // Retrieve auth token from session storage
      const token = sessionStorage.getItem('token') || '';
  
      // Call the service to get the zip code list
      const response = await controlMensajeriaService.listZipCodes(zipCode, municipalityCode, provinceCode, token);
  
      // Pass the result to the callback
      callback && callback(response);
    } catch (e) {
      console.error('Error al obtener lista de códigos postales:', e)
  
      callback && callback()
    }
  }

  export const thunkGetListStreets = (street: string, provinceCode: string, municipalityCode: string, typeStreet: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
    try {
      const token = sessionStorage.getItem('token') || '';
  
      const response = await controlMensajeriaService.listStreets(street, provinceCode, municipalityCode, typeStreet, token);
  
      callback && callback(response);
    } catch (e) {
      console.error('Error al obtener lista de calles:', e)
  
      callback && callback()
    }
  }

  export const thunkGetMessages = (docNumber: string, phone: string, email: string, cups: string, customerName: string, surname1: string, adress: string, municipality: string, province: string, proces: string, processDateAndHour: string, emailResult: string, tipoEnvio: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
    try {
      const token = sessionStorage.getItem('token') || '';
  
      const response = await controlMensajeriaService.doGetMessages(docNumber, phone, email, cups, customerName, surname1, adress, municipality, province, proces, processDateAndHour, emailResult, tipoEnvio, token);
  
      callback && callback(response);
    } catch (e) {
      console.error('Error al obtener los mensajes', e)
  
      callback && callback()
    }
  }

  export const thunkGetMessagesFromDate = (processDateAndHour: string[], callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
    try {
      const token = sessionStorage.getItem('token') || '';
  
      const response = await controlMensajeriaService.doGetMessagesFromDate(processDateAndHour, token);
  
      callback && callback(response);
    } catch (e) {
      console.error('Error al obtener los mensajes', e)
  
      callback && callback()
    }
  }

  export const thunkGetConfiguredAlerts = (dates: string[], callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
    try {
      const token = sessionStorage.getItem('token') || ''
  
      const response = await controlMensajeriaService.doGetConfiguredAlerts(dates, token)      
  
      callback && callback(response)
    } catch (e) {
      console.log('Error al obtener la lista de alertas:', e)
  
      callback && callback()
    }
  }

  export const thunkGetAlertsSent = (dates: string[], callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
    try {
      const token = sessionStorage.getItem('token') || ''
  
      const response = await controlMensajeriaService.doGetAlertsSent(dates, token)
  
      callback && callback(response)
    } catch (e) {
      console.log('Error al obtener la lista de mensajes:', e)
  
      callback && callback()
    }
  }

  export const thunkGetUserDevice = (callback: any) => async (dispatch, getState) => {
    try {
      // const token = sessionStorage.getItem('token') || ''
      // const dni = sessionStorage.getItem('userDocument') || ''

      // let response = await controlMensajeriaService.doGetUserDeviceController(token, dni)
      // response = response?.userItems?.length()

      // console.log('RESPONSE', response);
      

      // callback && callback(response)
      callback && callback(sessionStorage.getItem('HasDevice') || '0')
    } catch (e) {
      console.log('Error en la peticion para obtener la lista de alertas:', e)
      
      // Cambiar a 0 cuando funcione correctamente el backend para que quede bloqueado si hay algun fallo
      callback && callback(1)
    }
  }