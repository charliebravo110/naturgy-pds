import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { AppState } from '../../../../../common/store/reducers/MainReducer'
import SendUrlService from '../../SendUrlService'

// LCS: Importa la función - Wave 2
import { sendGAEvent } from '../../../../../core/utils/gtm';

const sendUrlService = new SendUrlService()

export const thunkSendUrlMessage = (data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    const response = await sendUrlService.sendMessage(data, token)

    callback && callback(response)
  } catch (e){
    console.error('Error al enviar la URL:', e)

    callback && callback()
  }
}

export const thunkChangeOpenUrl = (id: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    const response = await sendUrlService.changeOpenUrl(id,token)

    callback && callback(response)
  } catch (e){
    console.error('Error al enviar la URL:', e)

    callback && callback()
  }
}

export const thunkGetUrlMessagesData = (category: string, detail: string, dateFrom: string, dateTo: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    const response = await sendUrlService.getUrlMessagesData(category, detail, dateFrom, dateTo, token)

    callback && callback(response.urlMessagesList || [] as any)
  } catch (e){
    console.error('Error al recuperar los envíos de mails/SMS de URLs:', e)

    callback && callback()
  }
}

//obtiene la info del master data

export const thunkGetMasterData = (master: string, language: string, key: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''
    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const masterDataList = await sendUrlService.doGetMasterData(master, language, key, userToken)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /masterData?filter=master::'+master+'|language::'+language+(key ? '|key::'+key : ''),
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
        apiUrlShort: 'get /masterData',
      }
    });

    callback && callback(masterDataList.items)
  } catch (e){
    console.error('Error al obtener los datos maestros:', e)

    // LCS: Enviar evento a GA para errores - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'SendUrlThunkActions.ts - thunkGetMasterData',
        apiUrl: 'get /masterData?filter=master::'+master+'|language::'+language+(key ? '|key::'+key : ''),
        apiUrlShort: 'get /masterData',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}