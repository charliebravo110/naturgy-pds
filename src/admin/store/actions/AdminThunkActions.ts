import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { push } from 'connected-react-router'

import { AppState } from '../../../common/store/reducers/MainReducer'
import AdminService from '../../AdminService'
import { setSearchedUser } from './AdminActions'
import { resetToken, resetUserProfile, setToken, setUserProfile } from '../../../common/store/actions/UserActions'
import { showError } from '../../../common/store/actions/ErrorActions'
import { isLoggingUserAnAdmin } from '../../../common/lib/UserPermissionsLib'
import { fixNifLength } from '../../../common/lib/FormatLib'
import { resetDelegations, resetSupplies } from '../../../supplies/store/actions/SuppliesActions'
import { resetProvisions } from '../../../provisions/store/actions/ProvisionsActions'
import { resetRequests } from '../../../requests/store/actions/RequestsActions'
import { resetUrlMessages } from '../../../common/components/send-url/store/actions/UrlMessagesActions'

// LCS: Importa la función
import { hideCUPS, sendGAEvent } from '../../../core/utils/gtm';

const adminService = new AdminService()

export const thunkGetSearchedUser = (documentid: string, email: string, cups: string, sr: string, name: string, setIsLoading: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const adminToken = getState().admin.token
    const adminProfile = getState().admin.profile
    const auxDocumentId = documentid ? fixNifLength(documentid.toUpperCase()) : null
    
    var flag = false

    var apiUrl = ''

    if (documentid) {
      apiUrl = 'get /users?limit=1&sort=userId&offset=0&filter=user_id::' + sessionStorage.getItem('id')
    }
    if (email) {
      apiUrl = 'get /users?limit=1&sort=userId&offset=0&filter=email::'
    }
    if (cups) {
      apiUrl = 'get /users?limit=1&sort=userId&offset=0&filter=cups::' + hideCUPS(cups)
    }
    if (name) {
      apiUrl = 'get /users?limit=1&sort=userId&offset=0&filter=name::' + name
    }

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const asyncResp = await adminService.getSearchedUser(auxDocumentId, email.toLowerCase(), cups, sr, name, adminToken)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: apiUrl,
        apiUrlShort: 'get /users',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });
    
    
    //setIsLoading && setIsLoading(false)

    let user
    let showPopup

    if (asyncResp.result && asyncResp.result.codResult === '0025') {
      setIsLoading && setIsLoading(false)
      callback && callback(asyncResp)
      return 
    }
    if (asyncResp.users.items.length > 0) {

      console.log('Testing asyncResp: ', asyncResp)

      user = asyncResp.users.items[0]

      if (adminProfile.userId === user.userId) {
        dispatch(showError('CC0'))
      }

      showPopup = false

    } else {

      if (email) {
        setIsLoading && setIsLoading(false)
        callback && callback(true)
      }

      flag = true
      var apiUrlTrue = ''

      if (documentid) {
        apiUrlTrue = '/customers?filter=user_id::'+sessionStorage.getItem('id')
      }
      if (name) {
        apiUrlTrue = '/customers?filter=name::'+name
      }

      const asyncResp2 = await adminService.getNotRegisteredUser(auxDocumentId, name, adminToken)

      let docType

      if (asyncResp2.customers.items[0].userType !== '0') {

        if (asyncResp2.customers.items[0].docType = '01') {
          docType = 'NIF'
        } else if (asyncResp2.customers.items[0].docType = '02') {
          docType = 'CIF'
        } else if (asyncResp2.customers.items[0].docType = '04') {
          docType = 'NIE'
        } else {
          docType = ''
        }

        let surname1 = ''
        let surname2 = ''

        if (asyncResp2.customers.items[0].surname1) {
          surname1 = asyncResp2.customers.items[0].surname1
        }

        if (asyncResp2.customers.items[0].surname2) {
          surname2 = asyncResp2.customers.items[0].surname2
        }

        user = {
          'userId': '0',
          'documentNumber': asyncResp2.customers.items[0].docNumber,
          'documentType': docType,
          'email': asyncResp2.customers.items[0].email ? asyncResp2.customers.items[0].email : '',
          'name': asyncResp2.customers.items[0].customerName,
          'surName': (surname1 + ' ' + surname2).trim(),
          'phone': asyncResp2.customers.items[0].telephone1,
          'enabled': 1
        }

        showPopup = false

      } else {
        user = []
        showPopup = true
      }

    }

    dispatch(setSearchedUser(user))

    setIsLoading && setIsLoading(false)
    callback && callback(showPopup)

  } catch (e) {
    console.error('Error al buscar el usuario:', e)

    if (flag == false) {
      // LCS: Enviar evento a GA - Wave 2
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
          error: e,
          reactComponent: 'AdminThunkActions.ts - thunkGetSearchedUser',
          apiUrl: apiUrl ,
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    } else {
      // LCS: Enviar evento a GA - Wave 2
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
          error: e,
          reactComponent: 'AdminThunkActions.ts - thunkGetSearchedUser',
          apiUrl: apiUrlTrue,
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    }

    setIsLoading && setIsLoading(false)
    callback && callback(e)
  }
}

export const thunkGetSearchedUserLimit25 = (documentid: string, email: string, cups: string, sr: string, name: string, setIsLoading: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const adminToken = getState().admin.token
    const adminProfile = getState().admin.profile
    const auxDocumentId = documentid ? fixNifLength(documentid.toUpperCase()) : null

    var apiUrl = ''

    if (documentid) {
        apiUrl = 'get /users?limit=25&sort=userId&offset=0&filter=user_id::'+ sessionStorage.getItem('id')
    }
    if (email) {
      apiUrl = 'get /users?limit=25&sort=userId&offset=0&filter=email::'
    }
    if (cups) {
      apiUrl = 'get /users?limit=25&sort=userId&offset=0&filter=cups::'+ hideCUPS(cups)
    }
    if (name) {
      apiUrl = 'get /users?limit=25&sort=userId&offset=0&filter=name::'+ name
    }
    
    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const asyncResp = await adminService.getSearchedUserLimit25(auxDocumentId, email.toLowerCase(), cups, sr, name, adminToken)
    
    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: apiUrl,
        apiUrlShort: 'get /users',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });
    
    //setIsLoading && setIsLoading(false)

    let user
    let showPopup

    if (asyncResp.result && asyncResp.result.codResult === '0025') {
      setIsLoading && setIsLoading(false)
      callback && callback(asyncResp)
      return 
    }
    if (asyncResp.users.items.length > 0) {

      console.log('Testing asyncResp: ', asyncResp)

      user = asyncResp.users.items[0]

      if (adminProfile.userId === user.userId) {
        dispatch(showError('CC0'))
      }

      showPopup = false

    } else {

      if (email) {
        setIsLoading && setIsLoading(false)
        callback && callback(true)
      }
      try {
        // LCS: Registrar el tiempo inicial
        const startTime = performance.now();

        const asyncResp2 = await adminService.getNotRegisteredUser(auxDocumentId, name, adminToken)

        // LCS: Registrar el tiempo final y calcular la duración
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        // LCS: Enviar evento a GA para medir el tiempo
        sendGAEvent({
          event: 'api_response_time',
          info: {
            apiUrl: 'get /customers?filter=user_id:' + sessionStorage.getItem('id'),
            apiUrlShort: 'get /customers',
            responseTime: responseTime, // Tiempo de respuesta en milisegundos
          }
        });

        let docType

        if (asyncResp2.customers.items[0].userType !== '0') {

          if (asyncResp2.customers.items[0].docType = '01') {
            docType = 'NIF'
          } else if (asyncResp2.customers.items[0].docType = '02') {
            docType = 'CIF'
          } else if (asyncResp2.customers.items[0].docType = '04') {
            docType = 'NIE'
          } else {
            docType = ''
          }

          let surname1 = ''
          let surname2 = ''

          if (asyncResp2.customers.items[0].surname1) {
            surname1 = asyncResp2.customers.items[0].surname1
          }

          if (asyncResp2.customers.items[0].surname2) {
            surname2 = asyncResp2.customers.items[0].surname2
          }

          user = {
            'userId': '0',
            'documentNumber': asyncResp2.customers.items[0].docNumber,
            'documentType': docType,
            'email': asyncResp2.customers.items[0].email ? asyncResp2.customers.items[0].email : '',
            'name': asyncResp2.customers.items[0].customerName,
            'surName': (surname1 + ' ' + surname2).trim(),
            'phone': asyncResp2.customers.items[0].telephone1,
            'enabled': 1
          }

          showPopup = false

        } else {
          user = []
          showPopup = true
        }    
      } catch (e) {

        // LCS: Enviar evento a GA
        sendGAEvent({
          event: 'api_error',
          info: {
            error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
            error: e,
            reactComponent: 'AdminThunkActions.ts - thunkGetSearchedUserLimit25',
            apiUrl: 'get /customers',
            codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
          }
        });
      }
    }

    dispatch(setSearchedUser(user))

    setIsLoading && setIsLoading(false)
    callback && callback(showPopup)

  } catch (e) {
    console.error('Error al buscar el usuario:', e)

    // LCS: Enviar evento a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'AdminThunkActions.ts - thunkGetSearchedUserLimit25',
        apiUrl: apiUrl,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    setIsLoading && setIsLoading(false)
    callback && callback(e)
  }
}

export const thunkGetCustomers = (documentid: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const adminToken = getState().admin.token
    const asyncResp = await adminService.getCustomers(documentid, adminToken)

    callback && callback(asyncResp)

  } catch(e) {

    callback && callback(e)
  }
}

export const thunkGetSearchedUser2 = (documents: string[], setIsLoading: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const adminToken = getState().admin.token
    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const asyncResp = await adminService.getSearchedUser2(documents, adminToken)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /users?sort=userId&offset=0&filter=user_id~~'+sessionStorage.getItem('id'),
        apiUrlShort: 'get /users',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    let users = []

    if (asyncResp.users.items.length > 0) {

      asyncResp.users.items.map((item, index) => {
        users.push(item)
      })

    }

    callback && callback(users)

  } catch (e) {
    console.error('Error al buscar el usuario:', e)

    // LCS: Enviar evento a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'AdminThunkActions.ts - thunkGetSearchedUser2',
        apiUrl: 'get users?sort=userId&offset=0&filter=user_id~~'+ sessionStorage.getItem('id'),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

  }
}

export const thunkSupplantUser = (userId: string, adminToken: string, redirect: boolean, setIsLoading: any, supplies: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const asyncResp = await adminService.supplantUser(userId, adminToken)

    let userRoles
    let userData

    if (userId = '0') {
      userRoles = 'US_USER'
      userData = getState().admin.searchedUser
    } else {
      userRoles = asyncResp.realmUser.userProfiles
      userData = asyncResp.user
    }

    const isLoggedUserAnAdmin = isLoggingUserAnAdmin(asyncResp)

    let user = {
      ...userData,
      roles: userRoles
    }

    if (!isLoggedUserAnAdmin) {

      sessionStorage.setItem('supplantedUser', userId)
      sessionStorage.setItem('userDocument', userData.documentNumber)

      dispatch(setToken(adminToken))
      dispatch(setUserProfile(user))

      if ((redirect) && (supplies.list.length !== '0' || supplies.list.length < 6 || supplies.list.length !== null)) {
        dispatch(push('/dashboard'))
      } else if (redirect && !(supplies.list.length !== null || supplies.list.length !== 0 || supplies.list.length < 6)) {
        dispatch(push('/supplies'))
      }

    } else {
      dispatch(showError('CC2'))
    }

    setIsLoading && setIsLoading()
  } catch (e) {
    console.error('Error al suplantar el usuario:', e)

    // LCS: Enviar evento a GA - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al suplantar el usuario'),
        error: e,
        reactComponent: 'AdminThunkActions.ts - thunkSupplantUser',
        apiUrl: 'post /login',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    setIsLoading && setIsLoading()
  }
}

export const thunkSearchUserByParam = (cups: string, sr: string, setIsLoading: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {

  try {
    const adminToken = getState().admin.token

    var apiUrl = ''

    if (cups) {
      apiUrl = 'get /searchUserByParam?filter=cups::' + hideCUPS(cups)
    }
    if (sr) {
      apiUrl = 'get /searchUserByParam?filter=sr::' + sr
    }

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();
    
    const asyncResp = await adminService.getUserByParam(cups, sr, adminToken)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: apiUrl,
        apiUrlShort: 'get /searchUserByParam',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    let docNumber = ''
    console.log('asyncResp: ', asyncResp)

    if (asyncResp.customers.items[0].docNumber !== '') {
      docNumber = asyncResp.customers.items[0].docNumber
    }

    callback && callback(docNumber)

    //setIsLoading && setIsLoading()
  } catch (e){
    console.error('No se encontraron usuarios:', e)

    // LCS: Enviar evento a GA - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'No se encontraron usuarios'),
        error: e,
        reactComponent: 'AdminThunkActions.ts - thunkSearchUserByParams',
        apiUrl: apiUrl,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    //setIsLoading && setIsLoading()
    callback && callback(e)
  }

}


export const thunkCancelSupplantUser = (): ThunkAction<void, AppState, null, Action> => async (dispatch) => {
  try{
    sessionStorage.setItem('supplantedUser', '');

    dispatch(setSearchedUser({}));
    dispatch(resetToken());
    dispatch(resetUserProfile());
    dispatch(resetSupplies());
    dispatch(resetDelegations());
    dispatch(resetProvisions());
    dispatch(resetRequests());
    dispatch(resetUrlMessages());
  }catch(e){
    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'react_error',
      info:{
        error_message: 'Error al suplantar usuario los datos maestros',
        error: e,
        reactComponent: 'AdminThunkActions.ts - thunkCancelSupplantUser',
      }
    });    
  }
}

