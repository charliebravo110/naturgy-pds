import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { push } from 'connected-react-router'

import { AppState } from '../../../common/store/reducers/MainReducer'
import LoginService from '../../LoginService'
import { setToken, setUserProfile, setUserExpires, setRefreshToken, setSessionTime, setUpdatePassword } from '../../../common/store/actions/UserActions'
import { setAdminToken, setAdminProfile } from '../../../admin/store/actions/AdminActions'
import { isLoggingUserAnAdmin } from '../../../common/lib/UserPermissionsLib'
import { hideError } from '../../../common/store/actions/ErrorActions'
import { fixNifLength } from '../../../common/lib/FormatLib'
import { generateRandomString } from '../../../common/lib/FormatLib'
import { validateIdentityCard, validateUserCode } from '../../../common/lib/ValidationLib'
import AES from 'crypto-js/aes';
import { STORED_PASSWORD, STORED_USERNAME } from '../../../mobile-apps/common/configAndConstants'
import NotificationsService from '../../../mobile-apps/notifications/NotificationsService'
import { Notification, GetNotificationParams } from '../../../mobile-apps/notifications/notifications.interface'
import { setNotifications } from '../../../mobile-apps/notifications/store/actions/NotificationsActions'

// LCS: Importa la función - Wave 1
import { sendGAEvent } from '../../../core/utils/gtm';
import { thunkGetMasterData } from '../../../common/components/send-url/store/actions/SendUrlThunkActions'

const loginService = new LoginService()
const notificationsService = new NotificationsService()

export const thunkSendLogin = (setIsLoading: any, data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
    try {    
    let user = data ? data.user.toUpperCase() : getState().login.user.toUpperCase()
    let password = data ? data.password : getState().login.password
    let userId = ''

    //En caso de querer simular el login descomentamos
    /*const asyncResp =
    {
      result: {
        codResult: '0000',
        msgResult: 'Operación realizada correctamente.'
      },
      user: {
        documentNumber: '90053667',
        documentType: 'NIF',
        email: 'tmaseras@nttdata.com',
        enabled: 1,
        gdprAccepted: true,
        lastAccessDate: '24/02/2022 14:43:19',
        name: 'Tibor',
        phone: '666666666',
        status: '1',
        surName: 'Everis',
        userId: '107205'
      },
      realmUser: {
        realmUserId: '90053667',
        userId: '107205',
        oauthUserId: '537939',
        userProfiles: 'US_USER,US_CC'
      },
      accessToken: '946e323a-0271-475a-bc53-94b5d6bca55b',
      refreshToken: '9c390a5f-a9f9-4e9e-8e33-fda1388b318a',
      expiresInToken: 2701
    } as any*/

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    //Comentamos en caso de estar simulando el login
    const asyncResp = await loginService.doLogin({
      user: !validateUserCode(user) ? fixNifLength(user) : user,
      password,
      userId
    })

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /login',
        apiUrlShort: 'post /login',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    const isLoggedUserAnAdmin = isLoggingUserAnAdmin(asyncResp)

    if (asyncResp && asyncResp.user) {
      dispatch(hideError())

      sessionStorage.setItem('id', asyncResp.user.userId)
      sessionStorage.setItem('token', asyncResp.accessToken)
      if (asyncResp.realmUser && asyncResp.realmUser.userProfiles) {
        sessionStorage.setItem('userRoles', asyncResp.realmUser.userProfiles)
      }

      // sessionStorage.setItem('rand', generateRandomString(15))
      sessionStorage.setItem('gdprAccepted', asyncResp.user.gdprAccepted ? '1' : '0')

      const userWithRoles = {
        ...asyncResp.user,
        roles: asyncResp.realmUser.userProfiles
      }

      if (isLoggedUserAnAdmin) {
        dispatch(setAdminToken(asyncResp.accessToken))

        //Comentamos en caso de estar simulando el login
        dispatch(setAdminProfile(userWithRoles))
      } else {
        dispatch(setToken(asyncResp.accessToken))

        //Comentamos en caso de estar simulando el login
        dispatch(setUserProfile(userWithRoles))
      }
    }

    callback && callback()
  } catch (e) {
    console.error('Error al iniciar sesión:', e)
    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'LoginThunkActions.ts - thunkSendLogin',
        apiUrl: 'post /login',            
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : ''),
      }
    });

    if ((e as any).result) {
      callback && callback((e as any).result.codResult)
    }

    setIsLoading && setIsLoading(false)
  }
}

export const thunkSendChangeLogin = (setIsLoading: any, data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    let user = data ? data.user.toUpperCase() : getState().login.user.toUpperCase()
    let password = data ? data.password : getState().login.password
    let userId = ''

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    //Comentamos en caso de estar simulando el login - Wave 1
    const asyncResp = await loginService.doLogin({
      user: !validateUserCode(user) ? fixNifLength(user) : user,
      password,
      userId
    })

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: LCS: Enviar evento a GA para medir el tiempo - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /login',
        apiUrlShort: 'post /login',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    const isLoggedUserAnAdmin = isLoggingUserAnAdmin(asyncResp)

    if (asyncResp && asyncResp.user) {
      dispatch(hideError())

      sessionStorage.setItem('id', asyncResp.user.userId)
      sessionStorage.setItem('token', asyncResp.accessToken)
      // sessionStorage.setItem('rand', generateRandomString(15))
      sessionStorage.setItem('gdprAccepted', asyncResp.user.gdprAccepted ? '1' : '0')


      if (isLoggedUserAnAdmin) {
        dispatch(setAdminToken(asyncResp.accessToken))

      } else {
        dispatch(setToken(asyncResp.accessToken))
      }
    }

    callback && callback()
  } catch (e){
    console.error('Error al iniciar sesión:', e)
    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'LoginThunkActions.ts - thunkSendChangeLogin',
        apiUrl: 'post /login',            
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : ''),
      }
    });

    if ((e as any).result) {
      callback && callback((e as any).result.codResult)
    }

    setIsLoading && setIsLoading(false)
  }
}

export const thunkSendFirstLogin = (setIsLoading: any, data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {

  try {
    let user = data ? data.user?.toUpperCase() : getState().login.user.toUpperCase()
    let password = data ? data.password : getState().login.password
    let userId = ''
    // Ensure rememberCheck is a boolean
    // const rememberCheckStatus: boolean = getState().login.rememberCheck ?? data?.rememberCheck ?? false


    /**
     * This method load the user notifications
     * @param user
     * @param lang
     * @param token
     */
    const loadNotifications = async ({ userId, lang, token }: GetNotificationParams) => {
      // LCS: Registrar el tiempo inicial - Wave 1
      const startTime = performance.now();
      await notificationsService.getNotifications({ userId, lang, token }).then((response) => {
        const notifications = (response?.pushNotifications?.pushNotificationsItem as Notification[]) ?? []
        dispatch(setNotifications(notifications ?? []))
        // LCS: Registrar el tiempo final y calcular la duración - Wave 1
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        // LCS: Enviar evento a GA para medir el tiempo - Wave 1
        sendGAEvent({
          event: 'api_response_time',
          info: {
            apiUrl: 'get /pushNotifications?filter=user_id::'+userId+'%7Cid::'+lang,
            apiUrlShort: 'get /pushNotifications',
            responseTime: responseTime, // Tiempo de respuesta en milisegundos
          }
        });
      }).catch((e) => {
        console.error('Error loading notifications:', e)
        // LCS: Enviar evento a GA para errores - Wave 1
        sendGAEvent({
          event: 'api_error',
          info: {
            error_message: (e as any).result ? (e as any).result.msgResult : 'Error al llamar al servicio',
            error: e,
            reactComponent: 'LoginThunkActions.ts - thunkSendFirstLogin - loadNotifications',
            apiUrl: 'get /pushNotifications?filter=user_id::'+userId+'%7Cid::'+lang,            
            codResult: (e as any).result ? (e as any).result.codResult : (e as any).status,
          }
        });
      })
    }

    // const asyncResp =
    // {
    //   result: {
    //     codResult: '0000',
    //     msgResult: 'Operación realizada correctamente.'
    //   },
    //   user: {
    //     documentNumber: '90053667',
    //     documentType: 'NIF',
    //     email: 'tmaseras@nttdata.com',
    //     enabled: 1,
    //     gdprAccepted: true,
    //     lastAccessDate: '24/02/2022 14:43:19',
    //     name: 'Tibor',
    //     phone: '666666666',
    //     status: '1',
    //     surName: 'Everis',
    //     userId: '107205'
    //   },
    //   realmUser: {
    //     realmUserId: '90053667',
    //     userId: '107205',
    //     oauthUserId: '537939',
    //     userProfiles: 'US_USER,US_CC'
    //   },
    //   accessToken: '946e323a-0271-475a-bc53-94b5d6bca55b',
    //   refreshToken: '9c390a5f-a9f9-4e9e-8e33-fda1388b318a',
    //   expiresInToken: 2701
    // } as any

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    const asyncResp = await loginService.doFirstLogin({
      user: !validateUserCode(user) ? fixNifLength(user) : user,
      password,
      userId
    });

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /login',
        apiUrlShort: 'post /login',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    sessionStorage.setItem('userDocument', user);
    sessionStorage.setItem('userDocumentLogin', user);


    if (asyncResp.result && ['0001'].includes(asyncResp.result.codResult)) {
      sessionStorage.setItem('mfa', '1');
      sessionStorage.setItem('0001', JSON.stringify(asyncResp));
      const isLoggedUserAnAdmin = isLoggingUserAnAdmin(asyncResp);
      sessionStorage.setItem('token', asyncResp.accessToken);
      sessionStorage.setItem('userRolesAux', asyncResp.realmUser.userProfiles);
      const userWithRoles = {
        ...asyncResp.user,
        roles: asyncResp.realmUser.userProfiles
      };
      if (isLoggedUserAnAdmin) {
        dispatch(setAdminToken(asyncResp.accessToken));
        dispatch(setAdminProfile(userWithRoles));
      } else {
        dispatch(setToken(asyncResp.accessToken));
        dispatch(setUserProfile(userWithRoles));
      }
    } else if (asyncResp.result && ['0000'].includes(asyncResp.result.codResult)) {
      const isLoggedUserAnAdmin = isLoggingUserAnAdmin(asyncResp);

      /*if (asyncResp.result.codResult === '0001') {
        sessionStorage.setItem('mfa', '1');
      }*/

      if (asyncResp && asyncResp.user) {
        dispatch(hideError());
        sessionStorage.setItem('id', asyncResp.user.userId);
        sessionStorage.setItem('token', asyncResp.accessToken);
        sessionStorage.setItem('sessionTime', asyncResp.sessionTime);
        sessionStorage.setItem('userRoles', asyncResp.realmUser.userProfiles);
        // sessionStorage.setItem('rand', generateRandomString(15));
        sessionStorage.setItem('refreshToken', asyncResp.refreshToken);
        sessionStorage.setItem('gdprAccepted', asyncResp.user.gdprAccepted ? '1' : '0');
        const userWithRoles = {
          ...asyncResp.user,
          roles: asyncResp.realmUser.userProfiles
        };

        await loadNotifications({
          userId: asyncResp.user.userId,
          lang: sessionStorage.getItem('lang') ?? 'es',
          token: asyncResp.accessToken,
        })

        dispatch(setUserExpires(asyncResp.expiresInToken));
        dispatch(setRefreshToken(asyncResp.refreshToken));
        dispatch(setSessionTime(asyncResp.sessionTime));

        if (asyncResp.lastPasswordChange) {
          dispatch(setUpdatePassword(asyncResp.lastPasswordChange));
        }

        if (isLoggedUserAnAdmin) {
          dispatch(setAdminToken(asyncResp.accessToken));
          dispatch(setAdminProfile(userWithRoles));
        } else {
          dispatch(setToken(asyncResp.accessToken));
          dispatch(setUserProfile(userWithRoles));
        }
      }
    } else if (asyncResp.result && ['2903'].includes(asyncResp.result.codResult)) {
      sessionStorage.setItem('0001', JSON.stringify(asyncResp));
    }
    callback && callback(asyncResp);
  } catch (e){
    console.error('Error al iniciar sesión:', e)
    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'LoginThunkActions.ts - thunkSendFirstLogin',
        apiUrl: 'post /login',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : ''),
      }
    });
    console.log('(e as any).result', (e as any).result)

    if ((e as any).result) {

      // Remove stored credentials in case login fails
      localStorage.removeItem(STORED_USERNAME)
      localStorage.removeItem(STORED_PASSWORD)

      callback && callback((e as any).result.codResult)
    }

    setIsLoading && setIsLoading(false)
  }
}

export const thunkCodeLogin = (setIsLoading: any, data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const code = data.code;
    const state = data.state;

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    const asyncResp = await loginService.doCodeLogin({
      code,
      state
    })

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /login?code='+code+'&state='+state,
        apiUrlShort: 'get /login',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    const isLoggedUserAnAdmin = isLoggingUserAnAdmin(asyncResp)

    if (asyncResp && asyncResp.user) {
      dispatch(hideError())

      sessionStorage.setItem('id', asyncResp.user.userId)
      sessionStorage.setItem('token', asyncResp.accessToken)
      sessionStorage.setItem('sessionTime', asyncResp.sessionTime);
      sessionStorage.setItem('userRoles', asyncResp.realmUser.userProfiles)
      // sessionStorage.setItem('rand', generateRandomString(15))
      sessionStorage.setItem('gdprAccepted', asyncResp.user.gdprAccepted ? '1' : '0')
      sessionStorage.setItem('refreshToken', asyncResp.refreshToken)

      const userWithRoles = {
        ...asyncResp.user,
        roles: asyncResp.realmUser.userProfiles
      }

      dispatch(setUserExpires(asyncResp.expiresInToken));
      dispatch(setSessionTime(asyncResp.sessionTime));
      dispatch(setRefreshToken(asyncResp.refreshToken));

      if (isLoggedUserAnAdmin) {
        dispatch(setAdminToken(asyncResp.accessToken))
        dispatch(setAdminProfile(userWithRoles))
      } else {
        dispatch(setToken(asyncResp.accessToken))
        dispatch(setUserProfile(userWithRoles))
      }
    }

    callback && callback(asyncResp)
  } catch (e){
    console.error('Error al iniciar sesión:', e)
    const code = data.code;
    const state = data.state;
    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'LoginThunkActions.ts - thunkCodeLogin',
        apiUrl: 'get /login?code='+code+'&state='+state,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : ''),
      }
    });

    if ((e as any).result) {
      callback && callback((e as any).result.codResult)
    }

    setIsLoading && setIsLoading(false)
  }
}

export const thunkMfaLogin = (setIsLoading: any, data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {

    const mfa_code = data.code;
    const user = getState().login.user.toUpperCase()
    const password = getState().login.password

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    const asyncResp = await loginService.doMFALogin({
      user,
      password,
      mfa_code
    });

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /login',
        apiUrlShort: 'post /login',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    const isLoggedUserAnAdmin = isLoggingUserAnAdmin(asyncResp);

    if (asyncResp.result.codResult === '0001') {
      sessionStorage.setItem('mfa', '1');
    }

    if (asyncResp && asyncResp.user) {
      dispatch(hideError());
      sessionStorage.setItem('id', asyncResp.user.userId);
      sessionStorage.setItem('token', asyncResp.accessToken);
      sessionStorage.setItem('sessionTime', asyncResp.sessionTime);
      sessionStorage.setItem('userRoles', asyncResp.realmUser.userProfiles);
      // sessionStorage.setItem('rand', generateRandomString(15));
      sessionStorage.setItem('refreshToken', asyncResp.refreshToken);
      sessionStorage.setItem('gdprAccepted', asyncResp.user.gdprAccepted ? '1' : '0');
      const userWithRoles = {
        ...asyncResp.user,
        roles: asyncResp.realmUser.userProfiles
      };

      dispatch(setUserExpires(asyncResp.expiresInToken));
      dispatch(setRefreshToken(asyncResp.refreshToken));
      dispatch(setSessionTime(asyncResp.sessionTime));

      if (asyncResp.lastPasswordChange) {
        dispatch(setUpdatePassword(asyncResp.lastPasswordChange));
      }

      if (isLoggedUserAnAdmin) {
        dispatch(setAdminToken(asyncResp.accessToken));
        dispatch(setAdminProfile(userWithRoles));
      } else {
        dispatch(setToken(asyncResp.accessToken));
        dispatch(setUserProfile(userWithRoles));
      }
    }
    callback && callback(asyncResp);
  } catch (e){
    console.error('Error al iniciar sesión:', e)
    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'LoginThunkActions.ts - thunkMfaLogin',
        apiUrl: 'post /login',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : ''),
      }
    });
    if ((e as any).result) {
      callback && callback((e as any).result.codResult);
    }

    setIsLoading && setIsLoading(false);
  }
}

export const thunkSendUser = (setIsLoading: any, user: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    let userId = ''

    //En caso de querer simular el login descomentamos
    /*const asyncResp =
    {
      result: {
        codResult: '0000',
        msgResult: 'Operación realizada correctamente.'
      },
      user: {
        documentNumber: '90053667',
        documentType: 'NIF',
        email: 'tmaseras@nttdata.com',
        enabled: 1,
        gdprAccepted: true,
        lastAccessDate: '24/02/2022 14:43:19',
        name: 'Tibor',
        phone: '666666666',
        status: '1',
        surName: 'Everis',
        userId: '107205'
      },
      realmUser: {
        realmUserId: '90053667',
        userId: '107205',
        oauthUserId: '537939',
        userProfiles: 'US_USER,US_CC'
      },
      accessToken: '946e323a-0271-475a-bc53-94b5d6bca55b',
      refreshToken: '9c390a5f-a9f9-4e9e-8e33-fda1388b318a',
      expiresInToken: 2701
    }*/

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    //Comentamos en caso de estar simulando el login - Wave 1
    const asyncResp = await loginService.sendUser(user);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /loginUser',
        apiUrlShort: 'post /loginUser',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    const isLoggedUserAnAdmin = isLoggingUserAnAdmin(asyncResp)

    if (asyncResp && asyncResp.user) {
      dispatch(hideError())

      sessionStorage.setItem('id', asyncResp.user.userId)
      sessionStorage.setItem('token', asyncResp.accessToken)
      sessionStorage.setItem('userRoles', asyncResp.realmUser.userProfiles)
      // sessionStorage.setItem('rand', generateRandomString(15))
      sessionStorage.setItem('gdprAccepted', asyncResp.user.gdprAccepted ? '1' : '0')

      const userWithRoles = {
        ...asyncResp.user,
        //TEMPORAL PRUEBA

        // franjaInicio:'08:00',
        // franjaFin:'18:00',
        // franjaInicioEspecial:'10:00',
        // franjaFinEspecial:'15:00',
         // tipoCanal:datosAlerta.user.tipoCanal,
         // destinatario:datosAlerta.user.destinatario,
        roles: asyncResp.realmUser.userProfiles
      }

      if (isLoggedUserAnAdmin) {
        dispatch(setAdminToken(asyncResp.accessToken))

        //Comentamos en caso de estar simulando el login
        dispatch(setAdminProfile(userWithRoles))
      } else {
        dispatch(setToken(asyncResp.accessToken))

        //Comentamos en caso de estar simulando el login
        dispatch(setUserProfile(userWithRoles))
      }
    }

    callback && callback()
  } catch (e){
    console.error('Error al iniciar sesión:', e)
    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'LoginThunkActions.ts - thunkSendUser',
        apiUrl: 'post /loginUser',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : ''),
      }
    });

    if ((e as any).result) {
      callback && callback((e as any).result.codResult)
    }

    setIsLoading && setIsLoading(false)
  }
}

export const verifyLogin = (setIsLoading: any, data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    let user = data.user
    let password = data.password
    let userId = ''
    const userToken = getState().user.token;

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    const asyncResp = await loginService.doVerifyLogin({
      user: !validateUserCode(user) ? fixNifLength(user) : user,
      password,
      userId
    }, userToken);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /login',
        apiUrlShort: 'post /login',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback()
  } catch (e) {
    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'LoginThunkActions.ts - verifyLogin',
        apiUrl: 'post /login',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : ''),
      }
    });

    console.error('Error al validar contraseña:', e)
    if ((e as any).result) {
      callback && callback((e as any).result.codResult)
    }

    setIsLoading && setIsLoading(false)
  }
}

export const thunkResetPassword = (setSameEmailNumber: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  const user = getState().login.user.toUpperCase()
  const email = getState().login.email.toLowerCase()
  const phone = getState().login.phone

  console.log('E999513 thunkResestPassword')
  console.log('E999513 user: ', user)
  console.log('E999513 email: ', email)
  console.log('E999513 phone: ', phone)

  if (phone === '') {
    try {

      let validUser = user;
      if(validateIdentityCard(user)) {
        validUser = fixNifLength(user)
      }

      // LCS: Registrar el tiempo inicial - Wave 1
      const startTime = performance.now();

      await loginService.resetPassword({
        user: validUser,
        email
      })

      // LCS: Registrar el tiempo final y calcular la duración - Wave 1
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      // LCS: Enviar evento a GA para medir el tiempo - Wave 1
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'post /passwordreminder',
          apiUrlShort: 'post /passwordreminder',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });

      dispatch(push('/reset-message'))
    } catch (e) {
      if((e as any).result.codResult == '2404'){
        setSameEmailNumber('2404');
        // LCS: Enviar evento a GA para errores - Wave 1
        sendGAEvent({
          event: 'application_error',
          info: {
            error_message: 'Este correo electrónico no se corresponde con el del usuario que tenemos registrado con este NIF',
            error: e,
            reactComponent: 'LoginThunkActions.ts - thunkResetPassword',
            codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : ''),
            apiUrl: 'post /passwordreminder',
          }
        });
      }else{
        console.error('Error reseting the password: ', e)
        // LCS: Enviar evento a GA para errores - Wave 1
        sendGAEvent({
          event: 'api_error',
          info: {
            error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
            error: e,
            reactComponent: 'LoginThunkActions.ts - thunkResetPassword',
            apiUrl: 'post /passwordreminder',
            codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : ''),
          }
        });
      }
  
    }
  } else {
    try {
      let validUser = user;
      if(validateIdentityCard(user)) {
        validUser = fixNifLength(user)
      }

      // LCS: Registrar el tiempo inicial - Wave 1
      const startTime = performance.now();
      
      await loginService.resetPassword2({
        user: validUser,
        email: 'test@test.com',
        phone
      })

      // LCS: Registrar el tiempo final y calcular la duración - Wave 1
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      // LCS: Enviar evento a GA para medir el tiempo - Wave 1
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'post /passwordreminder',
          apiUrlShort: 'post /passwordreminder',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });

      dispatch(push('/reset-message2'))
    } catch (e){
      if((e as any).result.codResult == '2403'){
        setSameEmailNumber('2403');
        // LCS: Enviar evento a GA para errores - Wave 1
        sendGAEvent({
          event: 'application_error',
          info: {
            error_message: 'Este correo electrónico no se corresponde con el del usuario que tenemos registrado con este NIF',
            error: e,
            reactComponent: 'LoginThunkActions.ts - thunkResetPassword2',
            apiUrl: 'post /passwordreminder',
            codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : ''),
          }
        });
      }else{
      console.error('Error reseting the password 2: ', e)
      console.error('Error reseting the password: ', e)
      // LCS: Enviar evento a GA para errores - Wave 1
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
          error: e,
          reactComponent: 'LoginThunkActions.ts - thunkResetPassword2',
          apiUrl: 'post /passwordreminder',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : ''),
        }
      });
    }
    }
  }
}

export const thunkUpdatePassword = (email: string, newPassword: string, id: string): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
    
  try {

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    await loginService.updatePassword(email, newPassword, id)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /passwordreminder/'+id,
        apiUrlShort: 'post /passwordreminder',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

  } catch (e) {
    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'LoginThunkActions.ts - thunkUpdatePassword',
        apiUrl: 'post /passwordreminder/'+id,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : ''),
      }
    });
  }

  // dispatch(setToken(asyncResp.accessToken))
}

export const thunkMigratePassword = (setIsLoading: any, data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {

    const mfa_code = data.code;
    const user = getState().login.user.toUpperCase()
    const password = data.password

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    const asyncResp = await loginService.doMigrateLogin({
      user,
      password,
      mfa_code
    });

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /login',
        apiUrlShort: 'post /login',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });
    callback && callback(asyncResp);
  } catch (e){
    console.error('Error al iniciar sesión:', e)
    if ((e as any).result) {
      callback && callback((e as any).result.codResult);
      // LCS: Enviar evento a GA para errores - Wave 1
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
          error: e,
          reactComponent: 'LoginThunkActions.ts - thunkMigratePassword',
          apiUrl: 'post /login',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : ''),
        }
      });
    }
  }
}

export const thunkSaveMfaPreferences = (setIsLoading: any, data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const user = getState().login.user.toUpperCase();
    const adminToken = getState().user.token;

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();
    const asyncResp = await loginService.updatePhone(
      user,
      data.phone,
      adminToken
    );
    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'put /users/'+user,
        apiUrlShort: 'put /users',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });
    callback && callback(asyncResp);
  } catch (e) {
    const user = getState().login.user.toUpperCase();
    console.error('Error al iniciar sesión:', e)
    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'LoginThunkActions.ts - thunkSaveMfaPreferences',
        apiUrl: 'put /users/'+user,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : ''),
      }
    });
    if ((e as any).result) {
      callback && callback((e as any).result.codResult);
    }

    setIsLoading && setIsLoading(false);
  }
}

export const thunksaveMfaConfiguration = (setIsLoading: any, data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    let user;
    let documentNumber;
    const userS = JSON.parse(sessionStorage.getItem('0001'));
    if(userS) {
      user = userS.user.userId.toUpperCase();
      documentNumber = userS.user.documentNumber;
    } else {
      user = getState().user.profile.userId.toUpperCase();
      documentNumber = getState().user.profile.documentNumber;
    }
    const adminToken = userS?.accessToken || getState().user?.token;
    const mfaEnabled = !data.mfaEnabled ? 'N' : 'S';

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();
    const asyncResp = await loginService.updateMfaConfiguration(
      user,
      documentNumber,
      data.channel,
      data.phone || '',
      mfaEnabled,
      adminToken
    );
    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'put /users/'+user,
        apiUrlShort: 'put /users',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });
    callback && callback(asyncResp);
  } catch (e){
    console.error('Error al iniciar sesión:', e)
    let user;
    let documentNumber;
    const userS = JSON.parse(sessionStorage.getItem('0001'));
    if(userS) {
      user = userS.user.userId.toUpperCase();
      documentNumber = userS.user.documentNumber;
    } else {
      user = getState().user.profile.userId.toUpperCase();
      documentNumber = getState().user.profile.documentNumber;
    }

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'LoginThunkActions.ts - thunkSaveMfaConfiguration',
        apiUrl: 'put /users/'+user,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : ''),
      }
    });

    if ((e as any).result) {
      callback && callback((e as any).result.codResult);
    }

    setIsLoading && setIsLoading(false);
  }
}

export const thunkRefreshToken = (data: any, docNumber: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = data.token;
    const refreshToken = getState().user.refreshToken || sessionStorage.getItem('refreshToken');
    const user = getState().user.profile.documentNumber;
    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    if(token && refreshToken && (user || docNumber)){
      const asyncResp = await loginService.doRefreshToken(token, refreshToken, user || docNumber);

      // LCS: Registrar el tiempo final y calcular la duración - Wave 1
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      // LCS: Enviar evento a GA para medir el tiempo - Wave 1
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'put /tokens',
          apiUrlShort: 'put /tokens',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });
      
      const userRoles = sessionStorage.getItem('userRoles') || '';
      
      if(asyncResp.expiresInToken && asyncResp.refreshToken & asyncResp.accessToken){
        dispatch(setUserExpires(asyncResp.expiresInToken));
        dispatch(setRefreshToken(asyncResp.refreshToken));
        if (userRoles.includes('US_CC')) {
          dispatch(setAdminToken(asyncResp.accessToken));
        } else {
          dispatch(setToken(asyncResp.accessToken));
        }
      }
    }
  } catch (e){
    console.error('Error al refrescar token:', e)
    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'LoginThunkActions.ts - thunkRefreshToken',
        apiUrl: 'put /tokens',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : ''),
      }
    });
  }
}

export const thunkGetConfiguredLogin = (setIsLoading: any, data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  const asyncResp = JSON.parse(sessionStorage.getItem('0001'));
  const isLoggedUserAnAdmin = isLoggingUserAnAdmin(asyncResp);

  if (asyncResp && asyncResp.user) {
    dispatch(hideError());
    sessionStorage.setItem('id', asyncResp.user.userId);
    sessionStorage.setItem('token', asyncResp.accessToken);
    sessionStorage.setItem('sessionTime', asyncResp.sessionTime);
    sessionStorage.setItem('userRoles', asyncResp.realmUser.userProfiles);
    // sessionStorage.setItem('rand', generateRandomString(15));
    sessionStorage.setItem('refreshToken', asyncResp.refreshToken);
    sessionStorage.setItem('gdprAccepted', asyncResp.user.gdprAccepted ? '1' : '0');
    const userWithRoles = {
      ...asyncResp.user,
      roles: asyncResp.realmUser.userProfiles
    };

    dispatch(setUserExpires(asyncResp.expiresInToken));
    dispatch(setRefreshToken(asyncResp.refreshToken));
    dispatch(setSessionTime(asyncResp.sessionTime));

    if (asyncResp.lastPasswordChange) {
      dispatch(setUpdatePassword(asyncResp.lastPasswordChange));
    }

    if (isLoggedUserAnAdmin) {
      dispatch(setAdminToken(asyncResp.accessToken));
      dispatch(setAdminProfile(userWithRoles));
    } else {
      dispatch(setToken(asyncResp.accessToken));
      dispatch(setUserProfile(userWithRoles));
    }
  }

  sessionStorage.removeItem('mfa');

  callback && callback(asyncResp);
}

const getUserAndPassword = (dispatch: any): Promise <{ user: string, password: string}> => {
  return new Promise((resolve, reject) => {
    dispatch(thunkGetMasterData(
      'CARD_PAYMENT',
      'ES',
      'OFFLINE',
      (response) => {
        if (response && response.length > 0) {
          const parts = response[0].value?.split('-')
          const user = parts[0]
          const password = parts[1]

          resolve({user, password})
        } else {
          reject()
        }
      }
    ))
  }) 
}


export const thunkGetLoginToken = (setIsLoading: any, data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    // let user = data ? data.user.toUpperCase() : ''
    // let password = data ? data.password : ''
    // let userId = ''

    const {user, password} = await getUserAndPassword(dispatch)

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();
    //Comentamos en caso de estar simulando el login - Wave 1
    const asyncResp = await loginService.doPaymentBridgeLogin(user, password)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /login',
        apiUrlShort: 'post /login',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });
    if (asyncResp && asyncResp.user) {
      dispatch(hideError())

      sessionStorage.setItem('token', asyncResp.accessToken)
      sessionStorage.setItem('refreshToken', asyncResp.refreshToken)
      sessionStorage.setItem('OfflinePaymentFlag', '1')

    }

    callback && callback(asyncResp)
  } catch (e){
    console.error('Error al iniciar sesión:', e)
    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'LoginThunkActions.ts - thunkGetLoginToken',
        apiUrl: 'post /login',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : ''),
      }
    });

    if ((e as any).result) {
      callback && callback((e as any).result.codResult)
    }

    setIsLoading && setIsLoading(false)
  }
}
