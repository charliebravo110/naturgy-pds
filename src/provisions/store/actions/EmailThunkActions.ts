import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { AppState } from '../../../common/store/reducers/MainReducer'
import EmailService from '../../ProvisionsService'

// LCS: Importa la función
import { sendGAEvent } from '../../../core/utils/gtm';

const emailService = new EmailService()

export const thunkSendEmail = (body: any, id: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await emailService.createProvision(body,id )

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /dossiers',
        apiUrlShort: 'post /dossiers',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e) {
    console.error('Error al enviar email:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al enviar email'),
        error: e,
        reactComponent: 'EmailThunkActions.ts - thunkSendEmail',
        apiUrl: 'post /dossiers',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}


