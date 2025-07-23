import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux'
import MfaAdminService from '../services/MfaAdminService';
import { AppState } from '../../common/store/reducers/MainReducer';

// LCS: Importa la función - Wave 2
import { sendGAEvent } from '../../core/utils/gtm';

const mfaAdminService = new MfaAdminService();

export const thunkGetMfaForceData = (callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
    try {
        const userToken = sessionStorage.getItem('token') || '';

        // LCS: Registrar el tiempo inicial - Wave 2
        const startTime = performance.now();

        const response = await mfaAdminService.getData(userToken);

        // LCS: Registrar el tiempo final y calcular la duración - Wave 2
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        // LCS: Enviar evento a GA para medir el tiempo - Wave 2
        sendGAEvent({
          event: 'api_response_time',
          info: {
            apiUrl: 'get /mfa/config/force',
            responseTime: responseTime, // Tiempo de respuesta en milisegundos
          }
        });

        callback && callback(response);
    } catch (e) {
        console.error('Error al obtener estado mfa:', e)

        // LCS: Enviar evento a GA - Wave 2
        sendGAEvent({
            event: 'api_error',
            info: {
            error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener estado mfa'),
            error: e,
            reactComponent: 'MfaAdminThunkActions.ts - thunkGetMfaForceData',
            apiUrl: 'get /mfa/config/force',
            codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
            }
        });
  
        callback && callback(e)
    }
}

export const thunkSetMfaForceData = (callback: any, data): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
    try {
        const userToken = sessionStorage.getItem('token') || '';
        // LCS: Registrar el tiempo inicial - Wave 2
        const startTime = performance.now();

        const response = await mfaAdminService.postData(userToken, data.external, data.internal);

        // LCS: Registrar el tiempo final y calcular la duración - Wave 2
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        // LCS: Enviar evento a GA para medir el tiempo - Wave 2
        sendGAEvent({
          event: 'api_response_time',
          info: {
            apiUrl: 'post /mfa/config/force',
            responseTime: responseTime, // Tiempo de respuesta en milisegundos
          }
        });

        callback && callback(response);
    } catch (e) {
        console.error('Error al setear estado mfa:', e)

        // LCS: Enviar evento a GA - Wave 2
        sendGAEvent({
            event: 'api_error',
            info: {
            error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al setear estado mfa'),
            error: e,
            reactComponent: 'MfaAdminThunkActions.ts - thunkSetMfaForceData',
            apiUrl: 'post /mfa/config/force',
            codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
            }
        });
  
        callback && callback(e)
    }
}