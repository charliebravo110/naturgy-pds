import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { AppState } from '../../../common/store/reducers/MainReducer'
import PreSignUPService from '../../PreSignUpService'

// LCS: Importa la función - Wave 1
import { sendGAEvent } from '../../../core/utils/gtm';

const preSignUpService = new PreSignUPService()

export const thunkPreSignUp = (data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
       
    const token = getState().admin.token

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    const asyncResp = await preSignUpService.doPreSignUp(data, token)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /preregistration/users',
        apiUrlShort: 'post /preregistration/users',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos  
      }
    });    

    callback && callback()

  } catch (e) {
    
    console.error('Error al realizar el pre-registro:', e)

    // LCS: Enviar evento de error a GA - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al realizar el preregistro'),
        error: e,
        reactComponent: 'PreSignUpThunkActions.ts - thunkPreSignUp',
        apiUrl: 'post /preregistration/users',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });    

    if ((e as any).result) {
      callback && callback((e as any).result.codResult)
    }

  }
}
