import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { AppState } from '../../../common/store/reducers/MainReducer'
import SuppliesService  from '../../SuppliesService'

// LCS: Importa la función
import { sendGAEvent } from '../../../core/utils/gtm';

const suppliesService = new SuppliesService()

export const thunkGetDelegates = (filterId: string, status: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''
    const userId = sessionStorage.getItem('id') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const asyncResp = await suppliesService.doGetDelegates(filterId, userId, status, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /delegates?filter='+filterId+'::'+userId+'|status::'+status,
        apiUrlShort: 'get /delegates',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(asyncResp)
  } catch (e) {
    console.log('Error al obtener la lista de gestores y asesores:', e)

    const userId = sessionStorage.getItem('id') || ''

    // LCS: Enviar evento de error a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la lista de gestores y asesores'),
        error: e,
        reactComponent: 'SuppliesThunkActions.ts - thunkGetDelegates',
        apiUrl: 'get /delegates?filter='+filterId+'::'+userId+'|status::'+status,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });
  }
}

export const thunkCreateDelegations = (items: Array<any>, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const asyncResp = await suppliesService.doCreateDelegations(items, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /delegations',
        apiUrlShort: 'post /delegations',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(asyncResp)
  } catch (e) {
    console.log('Error al vincular los puntos de suministro:', e)

    // LCS: Enviar evento de error a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al vincular los puntos de suministro'),
        error: e,
        reactComponent: 'SuppliesThunkActions.ts - thunkCreateDelegations',
        apiUrl: 'post /delegations',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback((e as any).result)
  }
}

export const thunkGetContractsSupply = (docNumber:any,supply:any,callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const asyncResp = await suppliesService.doGetContractsSupply(docNumber,supply, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /contracts?filter=cdConsulta::01%7Cuser_id::'+sessionStorage.getItem('id')+'|cdaCups::'+supply,
        apiUrlShort: 'get /contracts',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(asyncResp)
  } catch (e) {
    console.log('Error al obtener las solicitudes de contrato:', e)

    // LCS: Enviar evento de error a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener las solicitudes de contrato'),
        error: e,
        reactComponent: 'SuppliesThunkActions.ts - thunkGetContractsSupply',
        apiUrl: 'get /contracts?filter=cdConsulta::01%7Cuser_id::'+sessionStorage.getItem('id')+'|cdaCups::'+supply,
         codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });
  }
}

export const thunkGetContractsCUPS = (docNumber:any,supply:any,callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''
    console.log(token);

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const asyncResp = await suppliesService.doGetContractsCUPS(docNumber, supply, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /contracts?filter=cdConsulta::03%7Cuser_id::'+sessionStorage.getItem('id')+'%7CcdaCups::'+supply,
        apiUrlShort: 'get /contracts',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    console.log(asyncResp);

    callback && callback(asyncResp)
  } catch (e) {
    console.log('Error al obtener las solicitudes de contrato:', e)
    console.log(e)

    // LCS: Enviar evento de error a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener las solicitudes de contrato'),
        error: e,
        reactComponent: 'SuppliesThunkActions.ts - thunkGetContractsCUPS',
        apiUrl: 'get /contracts?filter=cdConsulta::03%7Cuser_id::'+sessionStorage.getItem('id')+'%7CcdaCups::'+supply,
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback(e)
  }
}

export const thunkGetContractsUser = (docNumber:any,callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const asyncResp = await suppliesService.doGetContractsUser(docNumber,token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /contracts?filter=cdConsulta::02%7Cuser_id::'+sessionStorage.getItem('id')+'%7CcdaCups::',
        apiUrlShort: 'get /contracts',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(asyncResp)
  } catch (e) {
    console.log('Error al obtener las solicitudes de contrato:', e)

    // LCS: Enviar evento de error a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener las solicitudes de contrato'),
        error: e,
        reactComponent: 'SuppliesThunkActions.ts - thunkGetContractsUser',
        apiUrl: 'get /contracts?filter=cdConsulta::02%7Cuser_id::'+sessionStorage.getItem('id')+'%7CcdaCups::',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

  }
}

export const thunkGetContractsUserDelegates = (docNumber:any,callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const asyncResp = await suppliesService.doGetContractsUserDelegates(docNumber,token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /contracts?filter=cdConsulta::02%7Cuser_id::'+sessionStorage.getItem('id')+'%7CcdaCups::%7Cdelegados::1',
        apiUrlShort: 'get /contracts',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(asyncResp)
  } catch (e) {
    console.log('Error al obtener las solicitudes de contrato:', e)

    // LCS: Enviar evento de error a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener las solicitudes de contrato'),
        error: e,
        reactComponent: 'SuppliesThunkActions.ts - thunkGetContractsUserDelegates',
        apiUrl: 'get /contracts?filter=cdConsulta::02%7Cuser_id::'+sessionStorage.getItem('id')+'%7CcdaCups::%7Cdelegados::1',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

  }
}
