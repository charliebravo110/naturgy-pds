import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { setSearchedUser } from '../../admin/store/actions/AdminActions'
import { fixNifLength } from '../../common/lib/FormatLib'
import { showError } from '../../common/store/actions/ErrorActions'
import { AppState } from '../../common/store/reducers/MainReducer'
import { push } from 'connected-react-router'
import { isLoggingUserAnAdmin } from '../../common/lib/UserPermissionsLib'
import { setToken, setUserProfile } from '../../common/store/actions/UserActions'
import UsuariosService from '../services/UsuariosService'
import UsuariosThunkActions from '../services/UsuariosService'

// LCS: Importa la función - Wave 2
import { sendGAEvent } from '../../core/utils/gtm';

const usuariosService = new UsuariosThunkActions()

// Funcion para lanzar timeout de una petición dependiendo
// del tiempo que se le pasa por parametro
/*const timeoutPromise = (ms, promise) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('timeout'))
    }, ms)
    promise.then(
      (res) => {
        clearTimeout(timeoutId)
        resolve(res)
      },
      (err) => {
        clearTimeout(timeoutId)
        reject(err)
      }
    )
  })
}*/

const adminService = new UsuariosService()

export const thunkGetActiveUsersByEmail = (email: string, setIsLoading: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const adminToken = getState().admin.token
    const adminProfile = getState().admin.profile

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const asyncResp = await adminService.getSearchedUserByEmail(email, adminToken)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento de tiempo a GA - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /users?limit=1&sort=userId&offset=0&filter=email::',
        apiUrlShort: 'get /users',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    setIsLoading && setIsLoading(false)

    let user
    let showPopup

    if (asyncResp.users.items.length > 0) {

      console.log('Testing asyncResp: ', asyncResp)

      user = asyncResp.users

      if (adminProfile.userId === user.userId) {
        dispatch(showError('CC0'))
      }

      showPopup = false

    }

    dispatch(setSearchedUser(user))

    callback && callback(showPopup)

  } catch (e) {
    console.error('Error al buscar el usuario:', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al buscar el usuario'),
        error: e,
        reactComponent: 'UsuariosThunkActions.ts - thunkGetActiveUsersByEmail',
        apiUrl: 'get /users?limit=1&sort=userId&offset=0&filter=email::',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    setIsLoading && setIsLoading(false)
  }
}

export const thunkGetAllLoginUsers = (callback: any,): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || '';

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const response = await usuariosService.thunkGetAllLoginUsers(token);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    // LCS: Enviar evento de tiempo a GA - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /userRoles',
        apiUrlShort: 'get /userRoles',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos  
      }
    });

    callback && callback(response)

  } catch (e) {
    console.error('Error al obtener la información del usuario: ', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la información del usuario'),
        error: e,
        reactComponent: 'UsuariosThunkActions.ts - thunkGetAllLoginUsers',
        apiUrl: 'get /userRoles',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetLoginUsers = (docId: string, email: string, fechaAlta: Date, fechaLastLogin: Date, callback: any,): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || '';

    var apiUrl = ''

    // sin datos busqueda generica
    if (!docId && !email && !fechaAlta && !fechaLastLogin) {
      apiUrl = 'get /userRoles'
    }
    //tenemos NIF
    if (docId) {
      if (email) {
        //tenemos fecha de alta
        if (fechaAlta) {
          //tenemos todo
          if (fechaLastLogin) {
            apiUrl = 'get /userRoles?filter=user_id::'+sessionStorage.getItem('id')+'|email::'+'|registrationDate::'+fechaAlta+'|lastLoginDate::'+fechaLastLogin
          }
          //falta fecha de ultimo login
          else {
            apiUrl = 'get /userRoles?filter=user_id::'+sessionStorage.getItem('id')+'|email::'+'|registrationDate::'+fechaAlta
          }
        }
        //no tenemos fecha de alta
        else {
          if (fechaLastLogin) {
            apiUrl = 'get /userRoles?filter=user_id::'+sessionStorage.getItem('id')+'|email::'+'|lastLoginDate::'+fechaLastLogin
          }
          //falta fecha de ultimo login
          else {
            apiUrl = 'get /userRoles?filter=user_id::'+sessionStorage.getItem('id')+'|email::'
          }
        }
      }
      // no tenemos DNI
      else {
        if (fechaAlta) {
          //tenemos todo
          if (fechaLastLogin) {
            apiUrl = 'get /userRoles?filter=user_id::'+sessionStorage.getItem('id')+'|registrationDate::'+fechaAlta+'|lastLoginDate::'+fechaLastLogin
          }
          //falta fecha de ultimo login
          else {
            apiUrl = 'get /userRoles?filter=user_id::'+sessionStorage.getItem('id')+'|registrationDate::'+fechaAlta
          }
        }
        //no tenemos fecha de alta
        else {
          if (fechaLastLogin) {
            apiUrl = 'get /userRoles?filter=user_id::'+sessionStorage.getItem('id')+'|lastLoginDate::'+fechaLastLogin
          }
          //falta fecha de ultimo login
          else {
              apiUrl = 'get /userRoles?filter=user_id::'+sessionStorage.getItem('id')
          }
        }
      }
    }
    // no tenemos dni
    else {
      if (email) {
        //tenemos fecha de alta
        if (fechaAlta) {
          //tenemos todo
          if (fechaLastLogin) {
              apiUrl = 'get /userRoles?filter=email::'+'|registrationDate::'+fechaAlta+'|lastLoginDate::'+fechaLastLogin
          }
          //falta fecha de ultimo login
          else {
            apiUrl = 'get /userRoles?filter=email::'+'|registrationDate::'+fechaAlta
          }
        }
        //no tenemos fecha de alta
        else {
          if (fechaLastLogin) {
            apiUrl = 'get /userRoles?filter=email::'+'|lastLoginDate::'+fechaLastLogin
          }
          //falta fecha de ultimo login
          else {
            apiUrl = 'get /userRoles?filter=email::'
          }
        }
      }
      // no tenemos DNI
      else {
        if (fechaAlta) {
          //tenemos todo
          if (fechaLastLogin) {
            apiUrl = 'get /userRoles?filter=registrationDate::'+fechaAlta+'|lastLoginDate::'+fechaLastLogin
          }
          //falta fecha de ultimo login
          else {
            apiUrl = 'get /userRoles?filter=registrationDate::'+fechaAlta
          }
        }
        //no tenemos fecha de alta
        else {
          if (fechaLastLogin) {
            apiUrl = 'get /userRoles?filter=lastLoginDate::'+fechaLastLogin

          }
          //falta todo, busqueda generica
          else {
            apiUrl = 'get /userRoles'
          }
        }
      }
    }

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const response = await usuariosService.getSearchLoginUsers(docId, email, fechaAlta, fechaLastLogin, token);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento de tiempo a GA - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: apiUrl,
        apiUrlShort: 'get /userRoles',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos  
      }
    });

    callback && callback(response)

  } catch (e) {
    console.error('Error al obtener la información del usuario: ', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la información del usuario'),
        error: e,
        reactComponent: 'UsuariosThunkActions.ts - thunkGetLoginUsers',
        apiUrl: apiUrl,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback(e)
  }
}

export const thunkGetLoginUsersLimit = (docId: string, email: string, fechaAlta: Date, fechaLastLogin: Date, limit: any, callback: any,): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || '';

    var apiUrl = ''

    // sin datos busqueda generica
    if (!docId && !email && !fechaAlta && !fechaLastLogin) {
      apiUrl = 'get /userRoles'
    }
    //tenemos NIF
    if (docId) {
      if (email) {
        //tenemos fecha de alta
        if (fechaAlta) {
          //tenemos todo
          if (fechaLastLogin) {
            apiUrl = 'get /userRoles?limit='+limit+'?filter=user_id::'+sessionStorage.getItem('id')+'|email::'+'|registrationDate::'+fechaAlta+'|lastLoginDate::'+fechaLastLogin
          }
          //falta fecha de ultimo login
          else {
            apiUrl = 'get /userRoles?limit='+limit+'?filter=user_id::'+sessionStorage.getItem('id')+'|email::'+'|registrationDate::'+fechaAlta
          }
        }
        //no tenemos fecha de alta
        else {
          if (fechaLastLogin) {
            apiUrl = 'get /userRoles?limit='+limit+'?filter=user_id::'+sessionStorage.getItem('id')+'|email::'+'|lastLoginDate::'+fechaLastLogin
          }
          //falta fecha de ultimo login
          else {
            apiUrl = 'get /userRoles?limit='+limit+'?filter=user_id::'+sessionStorage.getItem('id')+'|email::'
          }
        }
      }
      // no tenemos DNI
      else {
        if (fechaAlta) {
          //tenemos todo
          if (fechaLastLogin) {
            apiUrl = 'get /userRoles?limit='+limit+'?filter=user_id::'+sessionStorage.getItem('id')+'|registrationDate::'+fechaAlta+'|lastLoginDate::'+fechaLastLogin
          }
          //falta fecha de ultimo login
          else {
            apiUrl = 'get /userRoles?limit='+limit+'?filter=user_id::'+sessionStorage.getItem('id')+'|registrationDate::'+fechaAlta
          }
        }
        //no tenemos fecha de alta
        else {
          if (fechaLastLogin) {
            apiUrl = 'get /userRoles?limit='+limit+'?filter=user_id::'+sessionStorage.getItem('id')+'|lastLoginDate::'+fechaLastLogin
          }
          //falta fecha de ultimo login
          else {
              apiUrl = 'get /userRoles?limit='+limit+'?filter=user_id::'+sessionStorage.getItem('id')
          }
        }
      }
    }
    // no tenemos dni
    else {
      if (email) {
        //tenemos fecha de alta
        if (fechaAlta) {
          //tenemos todo
          if (fechaLastLogin) {
              apiUrl = 'get /userRoles?limit='+limit+'?filter=email::'+'|registrationDate::'+fechaAlta+'|lastLoginDate::'+fechaLastLogin
          }
          //falta fecha de ultimo login
          else {
            apiUrl = 'get /userRoles?limit='+limit+'?filter=email::'+'|registrationDate::'+fechaAlta
          }
        }
        //no tenemos fecha de alta
        else {
          if (fechaLastLogin) {
            apiUrl = 'get /userRoles?limit='+limit+'?filter=email::'+'|lastLoginDate::'+fechaLastLogin
          }
          //falta fecha de ultimo login
          else {
            apiUrl = 'get /userRoles?limit='+limit+'?filter=email::'
          }
        }
      }
      // no tenemos DNI
      else {
        if (fechaAlta) {
          //tenemos todo
          if (fechaLastLogin) {
            apiUrl = 'get /userRoles?limit='+limit+'?filter=registrationDate::'+fechaAlta+'|lastLoginDate::'+fechaLastLogin
          }
          //falta fecha de ultimo login
          else {
            apiUrl = 'get /userRoles?limit='+limit+'?filter=registrationDate::'+fechaAlta
          }
        }
        //no tenemos fecha de alta
        else {
          if (fechaLastLogin) {
            apiUrl = 'get /userRoles?limit='+limit+'?filter=lastLoginDate::'+fechaLastLogin

          }
        }
      }
    }

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const response = await usuariosService.getSearchLoginUsersLimit(docId, email, fechaAlta, fechaLastLogin, limit, token);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento de tiempo a GA - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: apiUrl,
        apiUrlShort: 'get /userRoles',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos  
      }
    });

    callback && callback(response)

  } catch (e) {
    console.error('Error al obtener la información del usuario: ', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la información del usuario'),
        error: e,
        reactComponent: 'UsuariosThunkActions.ts - thunkGetLoginUsersLimit',
        apiUrl: apiUrl,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback(e)
  }
}

export const thunkGetActiveUsersByDocumentId = (documentid: string, setIsLoading: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const adminToken = getState().admin.token
    const adminProfile = getState().admin.profile
    const auxDocumentId = documentid ? fixNifLength(documentid.toUpperCase()) : null

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const asyncResp = await adminService.getSearchedUserByDoc(auxDocumentId, adminToken)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento de tiempo a GA - Wave 2
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

    if (asyncResp.users.items.length > 0) {

      user = asyncResp.users.items[0]

      if (adminProfile.userId === user.userId) {
        dispatch(showError('CC0'))
      }

      showPopup = false

    }

    dispatch(setSearchedUser(user))

    callback && callback(showPopup)

  } catch (e) {
    console.error('Error al buscar el usuario:', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al buscar el usuario'),
        error: e,
        reactComponent: 'UsuariosThunkActions.ts - thunkActiveUsersByDocumentId',
        apiUrl: 'get /users?limit=1&sort=userId&offset=0&filter=user_id::'+sessionStorage.getItem('id'),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    setIsLoading && setIsLoading(false)
  }
}

export const thunkGetAssignRole = (user: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || '';

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const response = await usuariosService.getAssignRole(user, token);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento de tiempo a GA - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /userRoles/' + user,
        apiUrlShort: 'get /userRoles',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos  
      }
    });

    callback && callback(response.items || []);
  } catch (e) {
    console.error('Error al obtener la información del usuario: ', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la información del usuario'),
        error: e,
        reactComponent: 'UsuariosThunkActions.ts - thunkGetAssignRole',
        apiUrl: 'get /userRoles/' + user,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkPutAssignRole = (user: string, roles: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || '';

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const response = await usuariosService.putAssignRole(user, roles, token);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento de tiempo a GA - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'put /userRoles/' + user,
        apiUrlShort: 'put /userRoles',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos  
      }
    });

    callback && callback(response);
  } catch (e) {
    console.error('Error al intentar asignar el rol al usuario: ', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al intentar asignar el rol al usuario'),
        error: e,
        reactComponent: 'UsuariosThunkActions.ts - thunkPutAssignRole',
        apiUrl: 'put /userRoles/' + user,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkActivateUser = (hash: string, email: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const response = await usuariosService.activateUser(hash, email)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento de tiempo a GA - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'put /registration/users/' + hash,
        apiUrlShort: 'put /registration/users/',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e) {
    console.error('Activation register error: ', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Activation register error'),
        error: e,
        reactComponent: 'UsuariosThunkActions.ts - thunkActivateUser',
        apiUrl: 'put /registration/users/' + hash,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkDeleteUsers = (users: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || '';
    
    // LCS: Registrar el tiempo inicial - Wave 3
    const startTime = performance.now();

    const response = await usuariosService.deleteUsers(userToken, users.username);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 3
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento de tiempo a GA - Wave 3
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /callcenter/user/' + users.username + '/status',
        apiUrlShort: 'post /callcenter/user//status',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e) {
    console.error('Delete user error: ', e)

    /*
    // LCS: Enviar evento de error a GA - Wave 3
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Delete user error'),
        error: e,
        reactComponent: 'UsuariosThunkActions.ts - thunkDeleteUser',
        apiUrl: 'post /callcenter/user/' + users.username + '/status',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });*/

    callback && callback()
  }
}

export const thunkGetListUsers = (callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || '';

    // LCS: Registrar el tiempo inicial - Wave 3
    const startTime = performance.now();

    const response = await usuariosService.getUsers(userToken);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 3
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento de tiempo a GA - Wave 3
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /callcenter/users',
        apiUrlShort: 'get /callcenter/users',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e) {
    console.error('Error al obtener lista de usuarios:', e)

    // LCS: Enviar evento de error a GA - Wave 3
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener lista de usuarios'),
        error: e,
        reactComponent: 'UsuariosThunkActions.ts - thunkGetListUsers',
        apiUrl: 'get /callcenter/users',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback(e)
  }
}

export const thunkGetListRoles = (callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || '';
    
    // LCS: Registrar el tiempo inicial - Wave 3
    const startTime = performance.now();

    const response = await usuariosService.getRoles(userToken);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 3
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento de tiempo a GA - Wave 3
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /callcenter/roles',
        apiUrlShort: 'get /callcenter/roles',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos  
      }
    });

    callback && callback(response)
  } catch (e) {
    console.error('Error al obtener lista de usuarios:', e)

    
    // LCS: Enviar evento de error a GA - Wave 3
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener lista de usuarios'),
        error: e,
        reactComponent: 'UsuariosThunkActions.ts - thunkGetListRoles',
        apiUrl: 'get /callcenter/roles',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback(e)
  }
}

export const thunkAssignRole = (user: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || '';
    const roles = [...user.roles, 'US_CC']

    // LCS: Registrar el tiempo inicial - Wave 3
    const startTime = performance.now();

    const response = await usuariosService.updateUserRoles(userToken, user.username, roles);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 3
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento de tiempo a GA - Wave 3
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /callcenter/user/'+user+'/roles',
        apiUrlShort: 'post /callcenter/user//roles',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos  
      }
    });

    callback && callback(response)
  } catch (e) {
    console.error('Assign role error: ', e)

    
    // LCS: Enviar evento de error a GA - Wave 3
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Assign role error'),
        error: e,
        reactComponent: 'UsuariosThunkActions.ts - thunkAssignRole',
        apiUrl: 'post /callcenter/user/'+user+'/roles',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkRevokeRole = (user: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || '';
    const roles = user.roles.filter(rl => rl !== 'US_CC');

    // LCS: Registrar el tiempo inicial - Wave 3
    const startTime = performance.now();

    const response = await usuariosService.updateUserRoles(userToken, user.username, roles);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 3
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento de tiempo a GA - Wave 3
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /callcenter/user/'+user+'/roles',
        apiUrlShort: 'post /callcenter/user//roles',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos  
      }
    });

    callback && callback(response)
  } catch (e) {
    console.error('Revoke role error: ', e)

    
    // LCS: Enviar evento de error a GA - Wave 3
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Revoke role error'),
        error: e,
        reactComponent: 'UsuariosThunkActions.ts - thunkRevokeRole',
        apiUrl: 'post /callcenter/user/'+user+'/roles',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}



