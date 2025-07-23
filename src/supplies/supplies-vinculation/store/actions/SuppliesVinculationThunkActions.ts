import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { AppState } from '../../../../common/store/reducers/MainReducer'
import SuppliesService  from '../../../SuppliesService'

// LCS: Importa la función - Wave 2
import { sendGAEvent } from '../../../../core/utils/gtm';

const suppliesService = new SuppliesService()

export const thunkPutSupply = (dni: string, cups: string, dossierCod: string, setBindingSupply: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = getState().user.token

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    let response = await suppliesService.doPutSupply(dni, cups, dossierCod,token)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'put /users/'+sessionStorage.getItem('id')+'/binding',
        apiUrlShort: 'put /users/id/binding',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    setBindingSupply && setBindingSupply(false)

    callback && callback(response)
  } catch (e) {
    console.error('Error vinculando el punto de suministro/expediente: ', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error vinculando el punto de suministro/expediente'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkPutSupply',
        apiUrl: 'put /users/'+sessionStorage.getItem('id')+'/binding',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });    

    setBindingSupply && setBindingSupply(false)
  }
}
