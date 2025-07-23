import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { push } from 'connected-react-router'

import { AppState } from '../reducers/MainReducer'
import UserService  from '../../UserService'
import { setToken, setUserProfile, setRefreshToken, setSessionTime } from './UserActions'
import { setAdminToken, setAdminProfile } from '../../../admin/store/actions/AdminActions'
import { thunkSupplantUser } from '../../../admin/store/actions/AdminThunkActions'
import { set } from 'date-fns/esm/fp'
import UserProfile from '../../interfaces/UserProfile'

// LCS: Importa la función - Wave 1
import { sendGAEvent } from '../../../core/utils/gtm';

const userService = new UserService()



export const thunkUpdateUserAlertConf = (fields:UserProfile, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const documentNumber = getState().user.profile.documentNumber
    const token = getState().user.token ? getState().user.token : getState().admin.token

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    const asyncResp = await userService.doUpdateAlertConf(documentNumber, fields, token)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      apiUrl: 'put /users/'+ sessionStorage.getItem('id') +'/updateAlertConf',
      apiUrlShort: 'put /users',
      responseTime: responseTime, // Tiempo de respuesta en milisegundos
    });

    callback && callback(asyncResp)
  } catch (e) {
    console.error("Error al actualizar la información del usuario - Alertas:", e);

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al actualizar la información del usuario - Alertas'),
        error: e,
        reactComponent: 'UserThunkActions.ts - thunkUpdateUserAlertConf',
        apiUrl: 'put /users/'+ sessionStorage.getItem('id') +'/updateAlertConf',
        apiUrlShort: 'put /users/dni/updateAlertConf',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });
  }
};


export const thunkUpdateUser = (
  setLoadingStatus: any,
  callback: any,
  pass: string
): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const id = getState().user.profile.userId;
    const documentNumber = getState().user.profile.documentNumber;
    const email = getState().user.profile.email;
    const phone = getState().user.profile.phone;
    const gdprAccepted = getState().user.profile.gdprAccepted;
    const token = getState().user.token ? getState().user.token : getState().admin.token;
    const password = pass ? pass : undefined;

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    await userService.doUpdate(
      id,
      { documentNumber, email, phone, password, gdprAccepted },
      token
    );

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      apiUrl: 'put /users/'+ id,
      apiUrlShort: 'put /users',
      responseTime: responseTime, // Tiempo de respuesta en milisegundos
    });

    setLoadingStatus && setLoadingStatus(false);
    callback && callback();
  } catch (e) {
    console.error("Error al actualizar la información del usuario:", e);
    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al actualizar la información del usuario'),
        error: e,
        reactComponent: 'UserThunkActions.ts - thunkUpdateUser',
        apiUrl: 'put /users/' + getState().user.profile.userId,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });
    setLoadingStatus && setLoadingStatus(false);
  }
};


export const thunkUpdateUserPassword = (
  setLoadingStatus: any,
  hash: string,
  email: string,
  password: string,
  callback: any
): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();
    await userService.doUpdatePassword(hash, email, password);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      apiUrl: 'put /passwordreminder/' + hash,
      apiUrlShort: 'put /passwordreminder',
      responseTime: responseTime, // Tiempo de respuesta en milisegundos
    });

    setLoadingStatus && setLoadingStatus();
    callback && callback();
  } catch (e) {
    console.error("Error al actualizar la contraseña del usuario:", e);
    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al actualizar la contraseña del usuario'),
        error: e,
        reactComponent: 'UserThunkActions.ts - thunkUpdateUserPassword',
        apiUrl: 'put /passwordreminder/' + hash,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });
    setLoadingStatus && setLoadingStatus();
  }
};


export const thunkDeleteUser = (
  id: string,
  token: string,
  setDeletingUser: any,
  callback: any
): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    await userService.doDeleteUser(id, token);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento de error a GA - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      apiUrl: 'delete /users/' + id,
      apiUrlShort: 'delete /users',
      responseTime: responseTime, // Tiempo de respuesta en milisegundos
    });

    setDeletingUser && setDeletingUser(false);

    callback && callback();
  } catch (e) {
    console.error("Error al borrar el usuario:", e);

    // LCS: Enviar evento de error a GA - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al borrar el usuario'),
        error: e,
        reactComponent: 'UserThunkActions.ts - thunkDeleteUser',
        apiUrl: 'delete /users/' + id,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    setDeletingUser && setDeletingUser(false);
  }
};


export const thunkDeleteUserOvde = (
  id: string,
  token: string,
  deleteCommons: string,
  setDeletingUser: any,
  callback: any
): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    await userService.doDeleteUserOvde(id, token, deleteCommons);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento de error a GA - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      apiUrl: 'deleteWithBody /users/' + id,
      apiUrlShort: 'deleteWithBody /users',
      responseTime: responseTime, // Tiempo de respuesta en milisegundos
    });

    setDeletingUser && setDeletingUser(false);

    callback && callback();
  } catch (e) {
    console.error("Error al borrar el usuario:", e);

    // LCS: Enviar evento de error a GA - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al borrar el usuario'),
        error: e,
        reactComponent: 'UserThunkActions.ts - thunkDeleteUserOvde',
        apiUrl: 'deleteWithBody /users/' + id,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    // Cambiar el estado de "deletingUser"
    setDeletingUser && setDeletingUser(false);
  }
};


export const ThunkGetUserData = (
  callback: any
): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const id = getState().user.profile.userId;
    const token = sessionStorage.getItem("token") || "";

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    const asyncResp = await userService.getUserById(id, token);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      apiUrl: 'get /users/' + id,
      apiUrlShort: 'get /users',
      responseTime: responseTime, // Tiempo de respuesta en milisegundos
    });

    callback && callback(asyncResp);
  } catch (e) {
    console.error("Error al obtener los datos del usuario:", e);

    // LCS: Enviar evento de error a GA - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener los datos del usuario'),
        error: e,
        reactComponent: 'UserThunkActions.ts - ThunkGetUserData',
        apiUrl: 'get /users/' + getState().user.profile.userId,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });
  }
};


export const getUserSession = ():ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const id = sessionStorage.getItem("id") || "";
    const token = sessionStorage.getItem("token") || "";
    const refreshToken = sessionStorage.getItem("refreshToken") || "";
    const realmUser = sessionStorage.getItem("userRoles") || "";
    const supplantedUser = sessionStorage.getItem("supplantedUser") || "";
    const sessionTime = sessionStorage.getItem("sessionTime") || "";

    const user = getState().user.profile;
    const admin = getState().admin.profile;

    dispatch(setSessionTime(sessionTime));

    if (id && token) {
      // LCS: Registrar el tiempo inicial - Wave 1
      const startTime = performance.now();

      const asyncResp = await userService.getUserById(id, token);

      // LCS: Registrar el tiempo final y calcular la duración - Wave 1
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      // LCS: Enviar evento de error a GA - Wave 1
      sendGAEvent({
        event: 'api_response_time',
        apiUrl: 'get /users/' + id,
        apiUrlShort: 'get /users',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      });

      const userProfile = asyncResp.user;
      sessionStorage.setItem("gdprAccepted", userProfile.gdprAccepted ? "1" : "0");

      if (!userProfile.gdprAccepted) {
        dispatch(push("/gdpr"));
      }

      const realmUserArray = realmUser.split(",");
      if (realmUserArray.includes("US_CC")) {
        if (!admin.name) {
          dispatch(setAdminToken(token));
          dispatch(setAdminProfile(userProfile));

          if (supplantedUser && !user.name) {
            dispatch(thunkSupplantUser(supplantedUser, token, false, null, null));
          }
        }
      } else {
        if (!user.name) {
          const newUserProfile = {
            ...userProfile,
            roles: realmUser,
          };

          dispatch(setToken(token));
          dispatch(setRefreshToken(refreshToken));
          dispatch(setUserProfile(newUserProfile));
        }
      }
    }
  } catch (e) {
    console.error("Error al obtener la sesión del usuario:", e);

    // LCS: Enviar evento de error a GA - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la sesión del usuario'),
        error: e,
        reactComponent: 'UserThunkActions.ts - getUserSession',
        apiUrl: 'get /users/' + (sessionStorage.getItem("id")? sessionStorage.getItem("id") : ""),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    sessionStorage.clear();
    dispatch(push("/login"));
  }
};
