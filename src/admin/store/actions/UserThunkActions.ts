import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { AppState } from '../../../common/store/reducers/MainReducer'
import UserService from '../../UserService'
import { setSearchedUser } from './AdminActions'
import { fixNifLength } from '../../../common/lib/FormatLib'

// LCS: Importa la función - Wave 1
import { sendGAEvent } from '../../../core/utils/gtm';

const userService = new UserService()

export const thunkGetSearchedUser = (documentid: string, email: string, setIsLoading: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = getState().user.token

    const auxDocumentId = documentid ? fixNifLength(documentid.toUpperCase()) : null
    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    const asyncResp = await userService.getSearchedUser(auxDocumentId, email.toLowerCase(), userToken)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /users?limit=1&sort=userId&offset=0&filter=user_id::'+sessionStorage.getItem('id'),
        apiUrlShort: 'get /users',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    setIsLoading && setIsLoading(false)

    let user
    let showPopup

    if (asyncResp.users.count > 0) {

      user = asyncResp.users.items[0]

      //if (userProfile.userId === user.userId) {
      //  dispatch(showError('CC0'))
      //}

      showPopup = true

    } else {
      console.error('Error al buscar el usuario:', auxDocumentId)
    }

    dispatch(setSearchedUser(user))

    callback && callback(showPopup)

  } catch (e){
    console.error('Error al buscar el usuario:', e)

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'UserThunkActions.ts - thunkGetSearchedUser',
        apiUrl: 'get /users?limit=1&sort=userId&offset=0&filter=user_id::'+sessionStorage.getItem('id'),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });


    setIsLoading && setIsLoading(false)
  }
}
