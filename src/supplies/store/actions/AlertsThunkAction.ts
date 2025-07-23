import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { AppState } from '../../../common/store/reducers/MainReducer';
import SuppliesService from '../../SuppliesService';

// LCS: Importa la función - Wave 1
import { sendGAEvent } from '../../../core/utils/gtm';

const suppliesService = new SuppliesService();

export const thunkDeleteAlerts =
  (item: any, callback: any): ThunkAction<void, AppState, null, Action> =>
  async (dispatch, getState) => {
    try {
      const token = sessionStorage.getItem('token') || '';

      // LCS: Registrar el tiempo inicial
      const startTime = performance.now();

      const asyncResp = await suppliesService.doDeleteAlerts(item, token);

      // LCS: Registrar el tiempo final y calcular la duración
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      // LCS: Enviar eventoa GA para medir el tiempo
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'post /alerts/supplycutoff/delete',
          apiUrlShort: 'post /alerts/supplycutoff/delete',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });

      callback && callback(asyncResp);
    } catch (e){
      console.log('Error al borrar alerta:', e);

      // LCS: Enviar evento a GA para errores
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al borrar alerta'),
          error: e,
          reactComponent: 'AlertsThunkActions.ts - thunkDeleteAlerts',
          apiUrl: 'post /alerts/supplycutoff/delete',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    }
  };

export const thunkGetAlerts =
  (callback: any): ThunkAction<void, AppState, null, Action> =>
  async (dispatch, getState) => {
    try {
      const token = sessionStorage.getItem('token') || '';
      const docId = getState().user.profile.documentNumber || sessionStorage.getItem('userDocument');
      if(docId!=null){

        // LCS: Registrar el tiempo inicial - Wave 1
        const startTime = performance.now();

        const asyncResp = await suppliesService.doGetAlerts(docId, token);

        // LCS: Registrar el tiempo final y calcular la duración - Wave 1
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        // LCS: Enviar eventoa GA para medir el tiempo - Wave 1
        sendGAEvent({
          event: 'api_response_time',
          info: {
            apiUrl: 'get /alerts/alerts?filter=user_id::'+sessionStorage.getItem('id'),
            apiUrlShort: 'get /alerts',
            responseTime: responseTime, // Tiempo de respuesta en milisegundos
          }
        });

        console.log('asyncResp',asyncResp);
        
        if (asyncResp.hasDevices === '1') {
          console.log('HasDevice->',asyncResp.hasDevices);
          
          sessionStorage.setItem('HasDevice', 'true')
        } else {
          sessionStorage.setItem('HasDevice', 'false')
        }
        
        callback && callback(asyncResp);

      }
    
    } catch (e){
      console.log('Error al obtener la lista de alertas:', e);

      const docId = getState().user.profile.documentNumber || sessionStorage.getItem('userDocument');
  
      // LCS: Enviar evento a GA para errores - Wave 1
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la lista de alertas'),
          error: e,
          reactComponent: 'AlertsThunkActions.ts - thunkGetAlerts',
          apiUrl: 'get /alerts/alerts?filter=user_id::'+sessionStorage.getItem('id'),
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    }
  };

export const thunkCreateAlerts =
  (
    items: Array<any>,
    callback: any
  ): ThunkAction<void, AppState, null, Action> =>
  async (dispatch, getState) => {
    try {
      const token = sessionStorage.getItem('token') || '';
      const docId = getState().user.profile.documentNumber;

      // LCS: Registrar el tiempo inicial - Wave 2
      const startTime = performance.now();

      const asyncResp = await suppliesService.doCreateAlerts(
        items,
        token,
        docId
      );

      // LCS: Registrar el tiempo final y calcular la duración - Wave 2
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      // LCS: Enviar eventoa GA para medir el tiempo - Wave 2
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'post /alerts/'+docId,
          apiUrlShort: 'post /alerts/dni',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });

      callback && callback(asyncResp);
    } catch (e){
      console.log('Error al crear alerta:', e);

      const docId = getState().user.profile.documentNumber;

      // LCS: Enviar evento a GA para errores - Wave 2
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al crear alerta'),
          error: e,
          reactComponent: 'AlertsThunkActions.ts - thunkCreateAlerts',
          apiUrl: 'post /alerts/'+docId,
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    }
  };

export const thunkCreateOrUpdateAlert =
  (
    item: any,
    alertType: string,
    idEntidad: string,
    callback: any
  ): ThunkAction<void, AppState, null, Action> =>
  async (dispatch, getState) => {
    try {
      const token = sessionStorage.getItem('token') || '';
      const docId = getState().user.profile.documentNumber;

      // LCS: Registrar el tiempo inicial - Wave 2
      const startTime = performance.now();
      
      const asyncResp = await suppliesService.doCreateOrUpdateAlert(
        item,
        token,
        docId,
        alertType,
        idEntidad
      );

      // LCS: Registrar el tiempo final y calcular la duración - Wave 2
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      // LCS: Enviar eventoa GA para medir el tiempo - Wave 2
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'post /alerts/'+docId+'/'+alertType+'/'+idEntidad,
          apiUrlShort: 'post /alerts/dni/alertType/idEntidad',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });

      //console.log(asyncResp);
      callback && callback(asyncResp);
    } catch (e){
      console.log('Error al crear alerta:', e);
      const docId = getState().user.profile.documentNumber;

      // LCS: Enviar evento a GA para errores - Wave 2
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al crear alerta'),
          error: e,
          reactComponent: 'AlertsThunkActions.ts - thunkCreateOrUpdateAlert',
          apiUrl: 'post /alerts/'+docId+'/'+alertType+'/'+idEntidad,
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    }
  };

export const thunkCreateOrUpdateAlerts =
  (
    items: Array<any>,
    callback: any
  ): ThunkAction<void, AppState, null, Action> =>
  async (dispatch, getState) => {
    try {
      const token = sessionStorage.getItem('token') || '';
      const docId = getState().user.profile.documentNumber;

      // LCS: Registrar el tiempo inicial - Wave 2
      const startTime = performance.now();

      const asyncResp = await suppliesService.doCreateOrUpdateAlerts(
        items,
        token,
        docId
      );

      // LCS: Registrar el tiempo final y calcular la duración - Wave 2
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      // LCS: Enviar eventoa GA para medir el tiempo - Wave 2
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'post /alerts/'+docId,
          apiUrlShort: 'post /alerts/dni',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });

      //console.log(asyncResp);
      callback && callback(asyncResp);
    } catch (e){
      console.log('Error al crear alertas:', e);

      const docId = getState().user.profile.documentNumber;

      // LCS: Enviar evento a GA para errores - Wave 2
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al crear alertas'),
          error: e,
          reactComponent: 'AlertsThunkActions.ts - thunkCreateOrUpdateAlerts',
          apiUrl: 'post /alerts/'+docId,
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });

    }
  };
