import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { push } from 'connected-react-router'

import { AppState } from '../../../common/store/reducers/MainReducer'
import DelegatesService from '../../DelegatesService'
import { setDelegatesList, setDelegate } from '../../store/actions/DelegatesActions'
import { hideError } from '../../../common/store/actions/ErrorActions'
import { fixNifLength } from '../../../common/lib/FormatLib'

// LCS: Import de la función
import { sendGAEvent } from '../../../core/utils/gtm'

const delegatesService = new DelegatesService()

export const thunkCreateDelegate = (data: any, role: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''
    const userId = sessionStorage.getItem('id') || ''

    const name = data.name
    const documentNumber = data.documentNumber

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    await delegatesService.createDelegate({
      userId,
      name,
      documentNumber: fixNifLength(documentNumber),
      role
    }, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /delegates',
        apiUrlShort: 'post /delegates',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(true)
  } catch (e) {
    console.error('Error al crear la delegación:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al crear la delegación'),
        error: e,
        reactComponent: 'DelegatesThunkActions.ts - thunkCreateDelegate',
        apiUrl: 'post /delegates',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkListDelegates = (role: string, setLoadingDelegatesList: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    

    const token = sessionStorage.getItem('token') || ''
    const supplantedUser = sessionStorage.getItem('supplantedUser') || ''
    const userId = supplantedUser ? supplantedUser : sessionStorage.getItem('id') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const asyncResp = await delegatesService.listDelegates(role, userId, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /delegates?filter=role::'+role+'|creatorUserId::'+userId+'|status::A',
        apiUrlShort: 'get /delegates',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    dispatch(setDelegatesList(asyncResp.delegates.items))

    setLoadingDelegatesList && setLoadingDelegatesList(false)

    callback && callback(asyncResp)
  } catch (e) {
    console.error('Error al listar los delegadores:', e)

    const supplantedUser = sessionStorage.getItem('supplantedUser') || ''
    const userId = supplantedUser ? supplantedUser : sessionStorage.getItem('id') || ''

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al listar los delegadores'),
        error: e,
        reactComponent: 'DelegatesThunkActions.ts - thunkListDelegates',
        apiUrl: 'get /delegates?filter=role::'+role+'|creatorUserId::'+userId+'|status::A',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    setLoadingDelegatesList && setLoadingDelegatesList(false)

    callback && callback()
  }
}


export const thunkListDelegatesByCreatorUserId = (creatorUserId: string ,callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const asyncResp = await delegatesService.listDelegatesByCreatorUserId(creatorUserId, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /delegates?filter=creatorUserId::'+creatorUserId+'|status::A',
        apiUrlShort: 'get /delegates',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(asyncResp)
  } catch (e) {
    console.error('Error al listar los delegadores:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al listar los delegadores'),
        error: e,
        reactComponent: 'DelegatesThunkActions.ts - thunkListDelegatesByCreatorUserId',
        apiUrl: 'get /delegates?filter=creatorUserId::'+creatorUserId+'|status::A',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkListDelegatesByDocId = (docId: string ,callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const asyncResp = await delegatesService.listDelegatesByDocId(docId, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /delegates?filter=user_id::'+sessionStorage.getItem('id')+'|status::A',
        apiUrlShort: 'get /delegates',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(asyncResp)
  } catch (e) {
    console.error('Error al listar los delegadores:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al listar los delegadores'),
        error: e,
        reactComponent: 'DelegatesThunkActions.ts - thunkListDelegatesByDocId',
        apiUrl: 'get /delegates?filter=creatorUserId::'+docId+'|status::A',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetDelegate = (delegateId: string): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const asyncResp = await delegatesService.getDelegate(delegateId, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /delegates/'+delegateId,
        apiUrlShort: 'get /delegates/delegateId',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    dispatch(setDelegate(asyncResp.delegate))

  } catch (e) {
    console.error('Error al obtener el delegador:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener el delegador'),
        error: e,
        reactComponent: 'DelegatesThunkActions.ts - thunkGetDelegate',
        apiUrl: 'get /delegates/'+delegateId,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

  }
}

export const thunkUpdateDelegate = (delegateId: string, setSucess: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    const data = getState().delegates.currentDelegate

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    await delegatesService.updateDelegate(data, delegateId, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'put /delegates/'+delegateId,
        apiUrlShort: 'put /delegates/delegateId',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    setSucess(true)

  } catch (e) {
    dispatch(hideError())

    setSucess(false)

    console.error('Error al actualizar el delegador:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al actualizar el delegador'),
        error: e,
        reactComponent: 'DelegatesThunkActions.ts - thunkUpdateDelegate',
        apiUrl: 'put /delegates/'+delegateId,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });
  }
}

export const thunkDeleteDelegatesList = (delegatesList: string[]): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    var iError

    for (let i = 0; i < delegatesList.length; i++) {
      iError = i
      // LCS: Registrar el tiempo inicial
      const startTime = performance.now();

      await delegatesService.deleteDelegate(delegatesList[i], userToken)

      // LCS: Registrar el tiempo final y calcular la duración
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      // Enviar evento a GA para medir el tiempo
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'delete /delegates/'+delegatesList[i],
          apiUrlShort: 'delete /delegates/delegateId',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });
    }
  } catch (e) {
    console.error('Error al borrar los delegadores:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al borrar los delegadores'),
        error: e,
        reactComponent: 'DelegatesThunkActions.ts - thunkDeleteDelegatesList',
        apiUrl: 'delete /delegates/'+delegatesList[iError],
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });
  }
}

export const thunkGetDelegations = (delegateId: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''
    const roles = sessionStorage.getItem('userRoles') || ''
    const dni =  getState().user.profile.documentNumber || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    let response = await delegatesService.doGetDelegations(delegateId, roles, dni, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /delegations?filter=delegateId::'+delegateId+'|status::C'+(roles.includes('US_MANAGER') ? '|user_id::' + sessionStorage.getItem('id') : ''),
        apiUrlShort: 'get /delegations',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e) {
    console.error('Error al obtener las delegaciones del delegador:', e)

    const roles = sessionStorage.getItem('userRoles') || ''
    const dni =  getState().user.profile.documentNumber || ''

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener las delegaciones del delegador'),
        error: e,
        reactComponent: 'DelegatesThunkActions.ts - thunkGetDelegations',
        apiUrl: 'get /delegations?filter=delegateId::'+delegateId+'|status::C'+(roles.includes('US_MANAGER') ? '|user_id::' + sessionStorage.getItem('id') : ''),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });
  }
}

export const thunkDeleteDelegate = (urlIfSuccessfull: string): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    const delegateId = getState().delegates.currentDelegate.delegateId

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    await delegatesService.deleteDelegate(delegateId, userToken)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'delete /delegates/'+delegateId,
        apiUrlShort: 'delete /delegates/delegateId',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    dispatch(push(urlIfSuccessfull))
  } catch (e) {
    console.error('Error al borrar el delegador:', e)

    const delegateId = getState().delegates.currentDelegate.delegateId

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al borrar el delegador'),
        error: e,
        reactComponent: 'DelegatesThunkActions.ts - thunkDeleteDelegate',
        apiUrl: 'delete /delegates/'+delegateId,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });
  }
}
