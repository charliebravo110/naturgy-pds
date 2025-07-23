import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { AppState } from '../../../common/store/reducers/MainReducer'
import ProvisionsService from '../../ProvisionsService'
import {
  setProvisionsCount,
  setProvisionsList,
  appendProvisionsList,
  setCurrentProvision,
  setFetchFormSuccess,
  setFetchFormError,
  setSaveFormSuccess,
  setSaveFormError
} from '../../store/actions/ProvisionsActions'
import CustomerFormData from '../../../sign-up/interfaces/CustomerFormData'
import EmailService from '../../EmailService'

// LCS: Importa la función - Wave 1
import { hideCUPS, sendGAEvent } from '../../../core/utils/gtm';

const provisionsService = new ProvisionsService()
const emailService = new EmailService()

export const thunkFetchFormData = (provisionId: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch) => {
  try {
    const token = sessionStorage.getItem('token') || '';

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.getTaisTr9(provisionId, token);

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /taisTr9/' + provisionId,
        apiUrlShort: 'get /taisTr9',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    dispatch(setFetchFormSuccess(response));
    callback && callback(response);
  } catch (e) {
    dispatch(setFetchFormError('Error al obtener los datos del formulario.'));

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener los datos del formulario'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkFetchFormData',
        apiUrl: 'get /taisTr9/' + provisionId,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });
  }
}

export const thunkSaveFormData = (formData: any): ThunkAction<void, AppState, null, Action> => async (dispatch) => {
  try {
    const token = sessionStorage.getItem('token') || '';

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    await provisionsService.createTaisTr9(formData, token);

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo - Wave GdC
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /taisTr9' + '?filter=expediente::' + (formData.expediente != '' ? formData.expediente : ''),
        apiUrlShort: 'post /taisTr9',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    dispatch(setSaveFormSuccess('Formulario guardado correctamente.'));
  } catch (e) {
    dispatch(setSaveFormError('Error al guardar los datos del formulario.'));

    // LCS: Enviar evento a GA para errores - Wave GdC
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al guardar los datos del formulario'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkSaveFormData',
        apiUrl: 'post /taisTr9' + '?filter=expediente::' + formData.expediente,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });
  }
};


export const thunkGetProvisionsList = (defaultName: string, setIsLoading: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const dni = getState().user.profile.documentNumber
    const token = sessionStorage.getItem('token') || ''

    const dossiersList = [] as any

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const asyncResp1 = await provisionsService.listProvisions(dni, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /dossiers?filter=user_id::'+sessionStorage.getItem('id')+'&sort=-REGISTER_DATE`',
        apiUrlShort: 'get /dossiers',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    /*
    let filteredDossiers: any

    // Filtrar dossiers más recientes desde el 1 de enero de 2017
    if (asyncResp1 && asyncResp1.dossiers.items && asyncResp1.dossiers.items.length > 0) {

      const filterDossier = (item: any) => {
        const year = item.registerDate && parseInt(item.registerDate.substring(0, 4))
        const month = item.registerDate && parseInt(item.registerDate.substring(4, 6))
        const day = item.registerDate && parseInt(item.registerDate.substring(6, 8))

        if (year && month && day) {
          const dossierDate = new Date(year, month - 1, day)

          // Fecha a comparar 1 de enero de 2017
          let dateToCompare = new Date(2017, 0, 1)

          if (dossierDate && dateToCompare && (dossierDate.getTime() >= dateToCompare.getTime())) {
            return true
          }
        }

        return false
      }

      filteredDossiers = asyncResp1.dossiers.items.filter(item => (filterDossier(item)))
    }
    */

    try {
      // LCS: Registrar el tiempo inicial - Wave 1
      const startTime = performance.now();

      const asyncResp2 = await provisionsService.getProvisionsData(dni, token)

      // LCS: Registrar el tiempo final y calcular la duración - Wave 1
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      // Enviar evento a GA para medir el tiempo
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'get /customData?filter=user_id::'+sessionStorage.getItem('id')+'|type::dossier',
          apiUrlShort: 'get /customData',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });

      if (asyncResp1 && asyncResp1.dossiers.items && asyncResp1.dossiers.items.length > 0) {
        asyncResp1.dossiers.items.map((item, key) => {
          const dossierCod = item.dossierCod

          const dossierData = (asyncResp2 && asyncResp2.customData && asyncResp2.customData.items) &&
            asyncResp2.customData.items.filter(data => (data.keyId.includes(dossierCod)))[0]

          item = {
            ...item,
            icon: dossierData ? dossierData.icon : '',
            name: dossierData ? dossierData.name : defaultName
          }

          return dossiersList.push(item)
        })

        dispatch(setProvisionsList(dossiersList))
      }

      setIsLoading && setIsLoading(false)

      callback && callback(dossiersList)
    } catch (e){
      console.log('Error al obtener la lista de provisiones:', e)

      // LCS: Enviar evento a GA para errores - Wave 1
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
          error: e,
          reactComponent: 'ProvisionsThunkActions.ts - thunkGetProvisionsList',
          apiUrl: 'get /dossiers?filter=user_id::'+sessionStorage.getItem('id')+'&sort=-REGISTER_DATE`',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });

      if (asyncResp1 && asyncResp1.dossiers.items && asyncResp1.dossiers.items.length > 0) {
        asyncResp1.dossiers.items.map((item, key) => {
          item = {
            ...item,
            icon: '',
            name: defaultName
          }

          return dossiersList.push(item)
        })

        dispatch(setProvisionsList(dossiersList))
      }

      setIsLoading && setIsLoading(false)

      callback && callback()
    }
  } catch (e){
    console.error('Error al obtener la lista de provisiones:', e)
    const dni = getState().user.profile.documentNumber

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la lista de provisiones'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkGetProvisionsList',
        apiUrl: 'get /customData?filter=user_id::'+sessionStorage.getItem('id')+'|type::dossier',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    setIsLoading && setIsLoading(false)

    callback && callback()
  }
}

export const thunkListDossiers = (
  defaultDossierName: any,
  offset: any, // primer elemento que se listará
  limit: any, // total de elementos a partir del offset
  dossierCod: any, // búsqueda por dossierCod
  fromSearch: boolean, // proveniente de una busqueda
  callback: any
): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = getState().user.token
    const dni = getState().user.profile.documentNumber

    const dossiersList = [] as any

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const dossiersResponse = await provisionsService.listDossiers(dni, offset, limit, dossierCod, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /dossiers?filter=user_id::'+sessionStorage.getItem('id')+(dossierCod ? ('|dossierCod::'+dossierCod) : '')+'&sort=-REGISTER_DATE'+(offset ? '&offset='+offset : '')+(limit ? '&limit='+limit : ''),
        apiUrlShort: 'get /dossiers',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    try {

      // LCS: Registrar el tiempo inicial - Wave 1
      const startTime = performance.now();

      const dossiersDataResponse = await provisionsService.getProvisionsData(dni, token)

      // LCS: Registrar el tiempo final y calcular la duración - Wave 1
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      // Enviar evento a GA para medir el tiempo
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'get /customData?filter=user_id::'+sessionStorage.getItem('id')+'|type::dossier',
          apiUrlShort: 'get /customData',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });

      if (dossiersResponse && dossiersResponse.dossiers.items && dossiersResponse.dossiers.items.length > 0) {
        dossiersResponse.dossiers.items.map(item => {
          const dossierCod = item.dossierCod

          const dossierData = (dossiersDataResponse && dossiersDataResponse.customData && dossiersDataResponse.customData.items) &&
                              dossiersDataResponse.customData.items.filter(data => (data.keyId.includes(dossierCod)))[0]

          item = {
            ...item,
            icon: dossierData ? dossierData.icon : '',
            name: dossierData ? dossierData.name : defaultDossierName
          }

          return dossiersList.push(item)
        })

        !fromSearch && dispatch(setProvisionsCount(dossiersResponse.dossiers.count ? dossiersResponse.dossiers.count : 0))

        !fromSearch && dispatch(appendProvisionsList(dossiersList))
      }

      callback && callback(dossiersList)
    } catch (e){
      console.log('Error al obtener la lista de datos de los expedientes:', e)

      // LCS: Enviar evento a GA para errores - Wave 1
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
          error: e,
          reactComponent: 'ProvisionsThunkActions.ts - thunkListDossiers',
          apiUrl: 'get /customData?filter=user_id::'+sessionStorage.getItem('id')+'|type::dossier',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });

      if (dossiersResponse && dossiersResponse.dossiers.items && dossiersResponse.dossiers.items.length > 0) {
        dossiersResponse.dossiers.items.map(item => {
          item = {
            ...item,
            icon: '',
            name: defaultDossierName
          }

          return dossiersList.push(item)
        })

        !fromSearch && dispatch(setProvisionsCount(dossiersResponse.dossiers.count ? dossiersResponse.dossiers.count : 0))

        !fromSearch && dispatch(appendProvisionsList(dossiersList))
      }

      callback && callback(dossiersList)
    }
  } catch (e){
    console.error('Error al obtener la lista de expedientes:', e)

    const dni = getState().user.profile.documentNumber

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la lista de expedientes'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkListDossiers',
        apiUrl: 'get /dossiers?filter=user_id::'+sessionStorage.getItem('id')+(dossierCod ? ('|dossierCod::'+dossierCod) : '')+'&sort=-REGISTER_DATE'+(offset ? '&offset='+offset : '')+(limit ? '&limit='+limit : ''),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetProvision = (id: string, defaultName: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const dni = getState().user.profile.documentNumber
    const token = sessionStorage.getItem('token') || ''

    let provision = {} as any

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const asyncResp1 = await provisionsService.getProvision(id, dni, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /dossiers/'+id+'?filter=user_id::'+sessionStorage.getItem('id'),
        apiUrlShort: 'get /dossiers/dni',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    try {

      // LCS: Registrar el tiempo inicial - Wave 1
      const startTime = performance.now();

      const asyncResp2 = await provisionsService.getProvisionsData(dni, token)

      // LCS: Registrar el tiempo final y calcular la duración - Wave 1
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      // Enviar evento a GA para medir el tiempo
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'get /customData?filter=user_id::'+sessionStorage.getItem('id')+'|type::dossier',
          apiUrlShort: 'get /customData',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });

      if (asyncResp1 && asyncResp1.dossier && asyncResp1.dossier.dossierCod !== '') {
        const code = asyncResp1.dossier.dossierCod

        const dossierData = (asyncResp2 && asyncResp2.customData && asyncResp2.customData.items) &&
          asyncResp2.customData.items.filter(data => (data.keyId.includes(code)))[0]

        provision = {
          ...asyncResp1.dossier,
          icon: dossierData ? dossierData.icon : '',
          name: dossierData ? dossierData.name : defaultName
        }

        const items = [] as any

        provision.communicationList.map(item => {
          const auxItem = {
            type: 'DOSSIER',
            code: provision.dossierCod,
            date: item.sendDate
          }

          return items.push(auxItem)
        })

        try {

          // LCS: Registrar el tiempo inicial - Wave 1
          const startTime = performance.now();

          const notificationsResponse = await provisionsService.doGetCommunicationNotifications(items, token)

          // LCS: Registrar el tiempo final y calcular la duración - Wave 1
          const endTime = performance.now();
          const responseTime = endTime - startTime;
          // LCS: Enviar evento a GA para errores - Wave 1
          sendGAEvent({
            event: 'api_response_time',
            info: {
              apiUrl: 'post /notifications',
              apiUrlShort: 'post /notifications',
              responseTime: responseTime, // Tiempo de respuesta en milisegundos
            }
          });

          if (notificationsResponse && notificationsResponse.notifications) {
            let auxList = [] as any

            provision.communicationList && provision.communicationList.map(item => {
              const sendDate = item.sendDate

              let auxItem = item

              const notification = notificationsResponse.notifications.filter(i => i.date === sendDate)[0]

              if (notification) {
                auxItem = {
                  ...auxItem,
                  indRead: notificationsResponse.notifications.filter(i => i.date === sendDate)[0].indRead
                }
              } else {
                auxItem = {
                  ...auxItem,
                  indRead: 0
                }
              }

              return auxList.push(auxItem)
            })

            provision = {
              ...provision,
              communicationList: auxList,
              communicationListBudget: notificationsResponse.badgeToRead
            }
          }

          dispatch(setCurrentProvision(provision))
        } catch (e){
          console.log('Error al obtener las notificaciones de la provisión:', e)

          // LCS: Enviar evento a GA para errores - Wave 1
          sendGAEvent({
            event: 'api_error',
            info: {
              error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener las notificaciones de la provisión'),
              error: e,
              reactComponent: 'ProvisionsThunkActions.ts - thunkGetProvision',
              apiUrl: 'post /notifications',
              codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
            }
          });

          dispatch(setCurrentProvision(provision))

          callback && callback()
        }
      }

      callback && callback(provision)
    } catch (e){
      console.log('Error al obtener los datos de la provisión:', e)

      // LCS: Enviar evento a GA para errores - Wave 1
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener los datos de la provisión'),
          error: e,
          reactComponent: 'ProvisionsThunkActions.ts - thunkGetProvision',
          apiUrl: 'get /customData?filter=user_id::'+sessionStorage.getItem('id')+'|type::dossier',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });

      if (asyncResp1 && asyncResp1.dossier && asyncResp1.dossier.dossierCod && asyncResp1.dossier.dossierCod !== '') {
        provision = {
          ...asyncResp1.dossier,
          icon: '',
          name: defaultName
        }

        const items = [] as any

        provision.communicationList.map(item => {
          const auxItem = {
            type: 'DOSSIER',
            code: provision.dossierCod,
            date: item.sendDate
          }

          return items.push(auxItem)
        })

        try {

          // LCS: Registrar el tiempo inicial - Wave 1
          const startTime = performance.now();

          const notificationsResponse = await provisionsService.doGetCommunicationNotifications(items, token)

          // LCS: Registrar el tiempo final y calcular la duración - Wave 1
          const endTime = performance.now();
          const responseTime = endTime - startTime;
          // LCS: Enviar evento a GA para errores - Wave 1
          sendGAEvent({
            event: 'api_response_time',
            info: {
              apiUrl: 'post /notifications',
              apiUrlShort: 'post /notifications',
              responseTime: responseTime, // Tiempo de respuesta en milisegundos
            }
          });

          if (notificationsResponse && notificationsResponse.notifications) {
            let auxList = [] as any

            provision.communicationList && provision.communicationList.map(item => {
              const sendDate = item.sendDate

              let auxItem = item

              const notification = notificationsResponse.notifications.filter(i => i.date === sendDate)[0]

              if (notification) {
                auxItem = {
                  ...auxItem,
                  indRead: notificationsResponse.notifications.filter(i => i.date === sendDate)[0].indRead
                }
              } else {
                auxItem = {
                  ...auxItem,
                  indRead: 0
                }
              }

              return auxList.push(auxItem)
            })

            provision = {
              ...provision,
              communicationList: auxList,
              communicationListBudget: notificationsResponse.badgeToRead
            }
          }

          dispatch(setCurrentProvision(provision))
        } catch (e){
          console.log('Error al obtener las notificaciones de la provisión:', e)

          // LCS: Enviar evento a GA para errores - Wave 1
          sendGAEvent({
            event: 'api_error',
            info: {
              error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener las notificaciones de la provisión'),
              error: e,
              reactComponent: 'ProvisionsThunkActions.ts - thunkGetProvision',
              apiUrl: 'post /notifications',
              codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
            }
          });

          dispatch(setCurrentProvision(provision))

          callback && callback()
        }
      }

      callback && callback(provision)
    }
  } catch (e){
    console.error('Error al obtener la provisión:', e)

    const dni = getState().user.profile.documentNumber

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la provisión'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkGetProvision',
        apiUrl: 'get /dossiers/'+id+'?filter=user_id::'+sessionStorage.getItem('id'),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkCreateProvision = (body: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.createProvision(body, userToken)

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
  } catch (e){
    console.error('Error al crear la provision:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al crear la provisión'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkCreateProvision',
        apiUrl: 'post /dossiers',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkCreateMoratorium = (body: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    const response = await provisionsService.createMoratorium(body, userToken)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'put /customData/moratorium',
        apiUrlShort: 'put /customData/moratorium',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al crear la moratoria:', e)

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener los datos maestros'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkCreateMoratorium',
        apiUrl: 'put /customData/moratorium',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkSaveDossierData = (body: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    const response = await provisionsService.saveDossierData(body, userToken)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'put /customData/dossierData',
        apiUrlShort: 'put /customData/dossierData',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al guardar los datos del dossier:', e)

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkSaveDossierdata',
        apiUrl: 'put /customData/dossierData',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetMasterData = (master: string, language: string, key: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    const masterDataList = await provisionsService.doGetMasterData(master, language, key, userToken)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /masterData?filter=master::'+master+'|::language'+language+'|key::'+ key,
        apiUrlShort: 'get /masterData',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(masterDataList.items)
  } catch (e){
    console.error('Error al obtener los datos maestros:', e)

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener los datos maestros'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkGetMasterData',
        apiUrl: 'get /masterData?filter=master::'+master+'|::language'+language+(key ? '|key::' + key : ''),
        apiUrlShort: 'get /masterData',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetMasterDataOffline = (master: string, language: string, key: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const masterDataList = await provisionsService.doGetMasterDataOffline(master, language, key)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /masterData?filter=master::'+master+'|::language'+language+(key ? '|key::' + key : ''),
        apiUrlShort: 'get /masterData',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(masterDataList.items)
  } catch (e){
    console.error('Error al obtener los datos maestros:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener los datos maestros'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkGetMasterDataOffline',
        apiUrl: 'get /masterData?filter=master::'+master+'|::language'+language+(key ? '|key::' + key : ''),
        apiUrlShort: 'get /masterData',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetCustomer = (documentNumber: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const customer = documentNumber && await provisionsService.getCustomer(documentNumber, userToken)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /customers?filter=user_id::'+sessionStorage.getItem('id'),
        apiUrlShort: 'get /customers',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(customer)
  } catch (e){
    console.error('Error al obtener los datos del usuario:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener los datos del usuario'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkGetCustomer',
        apiUrl: 'get /customers?filter=user_id::'+sessionStorage.getItem('id'),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback(e)
  }
}

export const thunkGetPowerCalculation = (data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const powerCalculation = await provisionsService.getPowerCalculation(data, userToken)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /powerCalculation',
        apiUrlShort: 'post /powerCalculation',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(powerCalculation)
  } catch (e){
    console.error('Error al obtener el cálculo de potencia:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener el cálculo de potencia'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkGetPowerCalculation',
        apiUrl: 'post /powerCalculation',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}
//1007875 - Proyecto Adaptación PDS RGPD
export const thunkSendMail = (data: any, id: string): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  console.log('thunkSendMail entra')
  try { 
    await emailService.sendEmail(data,id) 
  } catch (e){
    console.error('No se ha podido enviar el mail:', e)
   }
}

export const thunkGetCoverage = (zipCode: any, ineCode: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.getCoverage(zipCode, ineCode, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /coverage?filter='+(zipCode ? ('zipCode::' + zipCode) : ('ineCode::' + ineCode)),
        apiUrlShort: 'get /coverage',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al obtener la cobertura:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la cobertura'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkGetCoverage',
        apiUrl: 'get /coverage?filter='+(zipCode ? ('zipCode::' + zipCode) : ('ineCode::' + ineCode)),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkCreateCustomer = (data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.createCustomer(data, userToken)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /customers',
        apiUrlShort: 'post /customers',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al dar de alta el cliente:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al dar de alta el cliente:'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkCreateCustomer',
        apiUrl: 'post /customers',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkUpdateCustomer = (id: any, data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.putCustomer(id, data, userToken)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /customers',
        apiUrlShort: 'post /customers',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e) {
    console.error('Error al dar de alta el cliente:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al dar de alta el cliente:'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkUpdateCustomer',
        apiUrl: 'post /customers',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkCreateUserBinding = (id: string, cups: string, dossierCod: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    const response = await provisionsService.createUserBinding(id, userToken, cups, dossierCod)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'put /users/'+id+'/binding',
        apiUrlShort: 'put /users/id/binding',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });    

    const userBinding = response || {}

    callback && callback(userBinding)
  } catch (e){
    console.error('Error al obtener vincular el usuario:', e)

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener vincular el usuario'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkCreateUserBinding',
        apiUrl: 'put /users/'+id+'/binding',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });
    
  }
}

export const thunkGetDigitalBillingCompany = (docNumber: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.getDigitalBillingCompany(docNumber)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /digitalBillingCompany/'+sessionStorage.getItem('id'),
        apiUrlShort: 'get /digitalBillingCompany',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al obtener la facturación digital del usuario:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la facturación digital del usuario'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkGetDigitalBillingCompany',
        apiUrl: 'get /digitalBillingCompany/'+sessionStorage.getItem('id'),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });
  }
}

export const thunkUpdateDossier = (id: string, doc: boolean, data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.updateDossier(id, doc, data, userToken)

    var apiUrl = (doc ? `/dossiers/${id}?doc=1` : `/dossiers/${id}`)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: apiUrl,
        apiUrlShort: 'put /dossiers/id',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error hacer el update del dossier:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error hacer el update del dossier'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkUpdateDossier',
        apiUrl: apiUrl,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkUpdateDossierViaSahrepoint = (id: string, doc: boolean, data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.updateDossierSharepoint(id, doc, data, userToken)

    var apiUrl = doc ? `/dossiers/${id}?doc=1?repositorio=S` : `/dossiers/${id}?repositorio=S`

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: apiUrl,
        apiUrlShort: 'put /dossiers/id',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e) {
    console.error('Error hacer el update del dossier:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error hacer el update del dossier'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkUpdateDossierViaSharepoint',
        apiUrl: apiUrl,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkUpdateDossierOffline = (id: string, doc: boolean, data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.updateDossierOffline(id, doc, data)

    var apiUrl = (doc ? `/dossiers/${id}?doc=1` : `/dossiers/${id}`)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: apiUrl,
        apiUrlShort: 'put /dossiers/id',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error hacer el update del dossier:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error hacer el update del dossier'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkUpdateDossierOffline',
        apiUrl: apiUrl,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkUpdatePayment = (data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    const response = await provisionsService.updatePayment(data, sessionStorage.getItem('token'))

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'put /updatePayment',
        apiUrlShort: 'put /updatePayment',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error hacer el update del pago del dossier:', e)

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error hacer el update del pago del dossier'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkUpdatePayment',
        apiUrl: 'put /updatePayment',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback(e)
  }
}

export const thunkBizumPayment = (data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    //const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.bizumPayment(data)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /bizumPayment',
        apiUrlShort: 'post /bizumPayment',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error hacer el update del pago del dossier:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error hacer el update del pago del dossier'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkBizumPayment',
        apiUrl: 'post /bizumPayment',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkBizumPaymentConfirmation = (data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    //const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.bizumPaymentConfirmation(data)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /bizumPaymentConfirmation',
        apiUrlShort: 'post /bizumPaymentConfirmation',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error hacer el update del pago del dossier:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error hacer el update del pago del dossier'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkBizumPaymentConfirmation',
        apiUrl: 'post /bizumPaymentConfirmation',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkBizumPaymentOffline = (data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.bizumPaymentOffline(data)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /bizumPayment',
        apiUrlShort: 'post /bizumPayment',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error hacer el update del pago del dossier:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error hacer el update del pago del dossier'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkBizumPaymentOffline',
        apiUrl: 'post /bizumPayment',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkCheckUserBizum = (data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.checkUserBizum(data, userToken)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'put /checkRtpUsuario',
        apiUrlShort: 'put /checkRtpUsuario',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error hacer el update del pago del dossier:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error hacer el update del pago del dossier'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkCheckUserBizum',
        apiUrl: 'put /checkRtpUsuario',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkCheckUserBizumOffline = (data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.checkUserBizumOffline(data)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'put /checkRtpUsuario',
        apiUrlShort: 'put /checkRtpUsuario',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error hacer el update del pago del dossier:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error hacer el update del pago del dossier'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkCheckUserBizumOffline',
        apiUrl: 'put /checkRtpUsuario',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetHippo = (activity: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.getHippo(activity, userToken)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /hippo/'+activity,
        apiUrlShort: 'get /hippo',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al obtener la provision:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la provisión'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkGetHippo',
        apiUrl: 'get /hippo/'+activity,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkCreateCardPayment = (body: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    const userToken = sessionStorage.getItem('token') || ''

    const response = await provisionsService.createCardPayment(body, userToken)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /cardPayment',
        apiUrlShort: 'post /cardPayment',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });
    callback && callback(response)
  } catch (e){
    console.error('Error al crear el pago por tarjeta:', e)

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al crear el pago por tarjeta'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkCreateCardPayment',
        apiUrl: 'post /cardPayment',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });
    callback && callback()
  }
}

export const thunkCreateCardPaymentOffline = (body: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.createCardPaymentOffline(body)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /cardPayment',
        apiUrlShort: 'post /cardPayment',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al crear el pago por tarjeta:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al crear el pago por tarjeta'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkCreateCardPaymentOffline',
        apiUrl: 'post /cardPayment',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}


export const thunkGetCardPayment = (dossierId: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.getCardPayment(dossierId, userToken)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /cardPayment?filter=dossierNumber::'+dossierId+'|status::OK',
        apiUrlShort: 'get /cardPayment',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al recuperar el pago por tarjeta:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al recuperar el pago por tarjeta'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkGetCardPayment',
        apiUrl: 'get /cardPayment?filter=dossierNumber::'+dossierId+'|status::OK',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetCardPaymentWithDate = (callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''
    let date = new Date();
    let dateString = date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
});

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.getCardPaymentWithDate(userToken,dateString)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /cardPayment?limit=9999&filter=requestTimestamp~~'+dateString+','+dateString,
        apiUrlShort: 'get /cardPayment',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al recuperar el pago por tarjeta:', e)

    let date = new Date();
    let dateString = date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
});

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al recuperar el pago por tarjeta'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkGetCardPaymentWithDate',
        apiUrl: 'get /cardPayment?limit=9999&filter=requestTimestamp~~'+dateString+','+dateString,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetCardPaymentWithRangeDate = (rangeDate:string,callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();
    
    const response = await provisionsService.getCardPaymentWithRangeDate(userToken,rangeDate)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /cardPayment?limit=9999&filter=requestTimestamp~~'+rangeDate,
        apiUrlShort: 'get /cardPayment',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al recuperar el pago por tarjeta:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al recuperar el pago por tarjeta'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkGetCardPaymentWithRangeDate',
        apiUrl: 'get /cardPayment?limit=9999&filter=requestTimestamp~~'+rangeDate,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetPaydata = (expediente:string, nif: string, fechaAlta: Date, fechaLast:Date,cod:string, callback: any,): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || '';

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.getSearchPayData(expediente,nif,fechaAlta,fechaLast,cod,token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    var altaDate, lastDate
    if (fechaAlta) {
      var auxMonth = (fechaAlta.getMonth() + 1)
      var auxDay = fechaAlta.getDate()
      var month = String(auxMonth)
      var day = String(auxDay)
      if (auxDay < 10) {
        day = '0' + String(auxDay)
      }
      if (auxMonth < 10) {
        month = '0' + String(auxMonth)
      }
      altaDate = day + '/' + month + '/' + fechaAlta.getFullYear()
    }
    if (fechaLast) {
      var auxMonth = (fechaLast.getMonth() + 1)
      var auxDay = fechaLast.getDate()
      var month = String(auxMonth)
      var day = String(auxDay)
      if (auxDay < 10) {
        day = '0' + String(auxDay)
      }
      if (auxMonth < 10) {
        month = '0' + String(auxMonth)
      }
      lastDate = day + '/' + month + '/' + fechaLast.getFullYear()
    }

    let date = new Date();
    let todayString = date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    })

    var apiUrl = ''

    if (expediente || nif || altaDate || lastDate || cod) {
      apiUrl = 'get /cardPayment?limit=9999&filter='+((expediente !== '') ? ('dossierNumber::'+expediente) : '')+((nif !== '') ? ('|user_id::'+sessionStorage.getItem('id')) : '')+(altaDate && altaDate !== '' && lastDate && lastDate !== '') ? `|requestTimestamp~~${altaDate},${lastDate}` : (altaDate && altaDate !== '' && (!lastDate || lastDate === '')) ? '|requestTimestamp~~'+altaDate+','+todayString : ((!altaDate || altaDate === '') && lastDate && lastDate !== '') ? '|requestTimestamp~~'+lastDate+','+lastDate : ''+((cod !== '') ? ('|result::'+cod) : '');
    } else {
      apiUrl = 'get /cardPayment';
    }

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: apiUrl,
        apiUrlShort: 'get /cardPayment',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)

  } catch (e){
    console.error('Error al obtener la información del usuario: ', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la información del usuario'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkGetPaydata',
        apiUrl: apiUrl,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}


export const thunkGetSupplypoints = (callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''
    const dni =  getState().user.profile.documentNumber || ''

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    const response = await provisionsService.getSupplypoints(dni, token)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /supplypoints?filter=user_id::'+sessionStorage.getItem('id'),
        apiUrlShort: 'get /supplypoints',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al obtener la lista de suministros:', e)

    const dni =  getState().user.profile.documentNumber || ''

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkGetSupplypoints',
        apiUrl: 'get /supplypoints?filter=user_id::'+sessionStorage.getItem('id'),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetDossier = (number: string, callback: any, ): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''
    const dni =  getState().user.profile.documentNumber || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.getDossier(number, dni, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /dossiers/'+number+'?filter=user_id::'+sessionStorage.getItem('id'),
        apiUrlShort: 'get /dossiers/number',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al obtener la provisión:', e)

    const dni =  getState().user.profile.documentNumber || ''
    
    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la provisión'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkGetDossier',
        apiUrl: 'get /dossiers/'+number+'?filter=user_id::'+sessionStorage.getItem('id'),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback(e)
  }
}

export const thunkGetDossierAdm = (number: string, setExistDocument:any, callback: any, ): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''
    const dni =  getState().user.profile.documentNumber || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.getDossier(number, dni, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /dossiers/'+number+'?filter=user_id::'+sessionStorage.getItem('id'),
        apiUrlShort: 'get /dossiers/number',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    //falta definir por ZEUS
    if((e as any).result.codResult == 'XXX'){
      setExistDocument(true);
    }
    
    console.error('Error al obtener la provisión:', e)

    const dni =  getState().user.profile.documentNumber || ''

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la provisión'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkGetDossierAdm',
        apiUrl: 'get /dossiers/'+number+'?filter=user_id::'+sessionStorage.getItem('id'),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetDossierOffline = (number: string, dni: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.getDossier(number, dni, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /dossiers/'+number+'?filter=user_id::'+sessionStorage.getItem('id'),
        apiUrlShort: 'get /dossiers/number',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });
    //const response = await provisionsService.getDossierOffline(number, dni)

    callback && callback(response)
  } catch (e){
    console.error('Error al obtener la provisión:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la provisión'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkGetDossierOffline',
        apiUrl: 'get /dossiers/'+number+'?filter=user_id::'+sessionStorage.getItem('id'),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetDocument = (documentumId: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''
    const dossierCod =  getState().provisions.currentProvision.dossierCod || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.getDocument(documentumId, dossierCod, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /documentum/'+documentumId+'?filter=cod_expediente::'+dossierCod,
        apiUrlShort: 'get /documentum/docId',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al obtener el documento:', e)

    const dossierCod =  getState().provisions.currentProvision.dossierCod || ''

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener el documento'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkGetDocument',
        apiUrl: 'get /documentum/'+documentumId+'?filter=cod_expediente::'+dossierCod,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetDocumentBil = (documentumId: string, dossierCod: string, selloDigital: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''
    const dni =  getState().user.profile.documentNumber || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.getDocumentDNI(documentumId, dni, selloDigital, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /documentum/'+documentumId+'?filter=user_id_cliente::'+sessionStorage.getItem('id')+'|selloDigital::'+selloDigital,
        apiUrlShort: 'get /documentum/docId',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al obtener el documento de la factura:', e)

    const dni =  getState().user.profile.documentNumber || ''

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener el documento de la factura'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkGetDocumentBil',
        apiUrl: 'get /documentum/'+documentumId+'?filter=user_id_cliente::'+sessionStorage.getItem('id')+'|selloDigital::'+selloDigital,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetDocumentBilwRepository = (documentumId: string, dossierCod: string, selloDigital: string, callback: any,repositorio:string): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''
    const dni =  getState().user.profile.documentNumber || ''
    let response;

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    if (repositorio === 'D') {
      response = await provisionsService.getDocumentDNI(documentumId, dni, selloDigital, token)
    } else if (repositorio === 'S') {
      response = await provisionsService.getDocumentDNIwRepository(documentumId, dni, selloDigital, token,repositorio)
    }

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // Enviar evento a GA para medir el tiempo
    if (repositorio === 'D') {
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'get /documentum/'+documentumId+'?filter=user_id_cliente::'+sessionStorage.getItem('id')+'|selloDigital::'+selloDigital,
          apiUrlShort: 'get /documentum/docId',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });
    } else if (repositorio === 'S') {
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'get /documentum/'+documentumId+'?filter=user_id_cliente::'+sessionStorage.getItem('id')+'|selloDigital::'+selloDigital+'|repositorio::'+repositorio,
          apiUrlShort: 'get /documentum/docId',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });
    }
    callback && callback(response)
  } catch (e){
    console.error('Error al obtener el documento de la factura:', e)

    const dni =  getState().user.profile.documentNumber || ''

    if (repositorio === 'D') {
      // LCS: Enviar evento a GA para errores
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener el documento de la factura'),
          error: e,
          reactComponent: 'ProvisionsThunkActions.ts - thunkGetDocumentBilwRepository',
          apiUrl: 'get /documentum/'+documentumId+'?filter=user_id_cliente::'+sessionStorage.getItem('id')+'|selloDigital::'+selloDigital,
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    } else if (repositorio === 'S') {
      // LCS: Enviar evento a GA para errores
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener el documento de la factura'),
          error: e,
          reactComponent: 'ProvisionsThunkActions.ts - thunkGetDocumentBil',
          apiUrl: 'get /documentum/'+documentumId+'?filter=user_id_cliente::'+sessionStorage.getItem('id')+'|selloDigital::'+selloDigital+'|repositorio::'+repositorio,
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    }
    callback && callback()
  }
}


export const thunkGetDocumentBill = (numfactura: string, tipoDocumental: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''
    const dni =  getState().user.profile.documentNumber || ''
    console.log('testing dni: ', dni)

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.getDocumentBill(dni, numfactura, tipoDocumental, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /documentum/documentos?numfactura='+numfactura+'&user_id_cliente='+sessionStorage.getItem('id')+'&tipoDocumental='+tipoDocumental,
        apiUrlShort: 'get /documentum/documentos',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    console.log('testing response: ', response)
    callback && callback(response)
  } catch (e){
    console.error('Error al obtener el id de documentum:', e)
    const dni =  getState().user.profile.documentNumber || ''

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener el id de documentum'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkGetDocumentBil',
        apiUrl: 'get /documentum/documentos?numfactura='+numfactura+'&user_id_cliente='+sessionStorage.getItem('id')+'&tipoDocumental='+tipoDocumental,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetDocumentBillwRepository = (numfactura: string, tipoDocumental: string, callback: any, repository: string = 'D'): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''
    const dni =  getState().user.profile.documentNumber || ''
    console.log('testing dni: ', dni)
    let response;

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    if (repository === 'D') {
      response = await provisionsService.getDocumentBill(dni, numfactura, tipoDocumental, token)
    } else if (repository === 'S') {
      response = await provisionsService.getDocumentBillwRepository(dni, numfactura, tipoDocumental, token, repository)
    }

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // Enviar evento a GA para medir el tiempo
    if (repository === 'D') {
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'get /documentum/documentos?numfactura='+numfactura+'&user_id_cliente='+sessionStorage.getItem('id')+'&tipoDocumental='+tipoDocumental,
          apiUrlShort: 'get /documentum/documentos',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });
    } else if (repository === 'S') {
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'get /documentum/documentos?repositorio='+repository+'&numfactura='+numfactura+'&user_id_cliente='+sessionStorage.getItem('id')+'&tipoDocumental='+'factura_solicitudes_de_conexion',
          apiUrlShort: 'get /documentum/docId',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });
    }
    console.log('testing response: ', response)
    callback && callback(response)
  } catch (e){
    console.error('Error al obtener el id de documentum:', e)

    const dni =  getState().user.profile.documentNumber || ''

    if (repository === 'D') {
      // LCS: Enviar evento a GA para errores
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener el id de documentum'),
          error: e,
          reactComponent: 'ProvisionsThunkActions.ts - thunkGetDocumentBilwRepository',
          apiUrl: 'get /documentum/documentos?numfactura='+numfactura+'&user_id_cliente='+sessionStorage.getItem('id')+'&tipoDocumental='+tipoDocumental,
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    } else if (repository === 'S') {
      // LCS: Enviar evento a GA para errores
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener el id de documentum'),
          error: e,
          reactComponent: 'ProvisionsThunkActions.ts - thunkGetDocumentBilwRepository',
          apiUrl: 'get /documentum/documentos?repositorio='+repository+'&numfactura='+numfactura+'&user_id_cliente='+sessionStorage.getItem('id')+'&tipoDocumental='+'factura_solicitudes_de_conexion',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    }

    callback && callback()
  }
}

export const thunkUpdateDossierData = (dossierCod: string, dni: string, name: string, icon: string, token: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try{

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    await provisionsService.doUpdateDossier(dossierCod, dni, name, icon, token)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'put /customData/'+dossierCod,
        apiUrlShort: 'put /customData',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback()
  } catch (e){
    console.log('Error al actualizar los datos de la provisión:', e)

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkUpdateDossierData',
        apiUrl: 'put /customData/'+dossierCod,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetCommunicationNotifications = (data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    const response = await provisionsService.doGetCommunicationNotifications(data, token)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /notifications',
        apiUrlShort: 'post /notifications',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.log('Error al obtener la lista de notificaciones:', e)

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la lista de notificaciones'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkGetCommunicationNotifications',
        apiUrl: 'post /notifications',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkListDossierBills = (dossierCod: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''
    const dni =  getState().user.profile.documentNumber || ''
    if (dni !==''){

      // LCS: Registrar el tiempo inicial
      const startTime = performance.now();

      const response = await provisionsService.listDossierBills(dni, dossierCod, token)

      // LCS: Registrar el tiempo final y calcular la duración
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      // LCS: Enviar evento a GA para errores
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'get /listDossierBills?filter=user_id::'+sessionStorage.getItem('id')+'|dossierCod::'+dossierCod,
          apiUrlShort: 'get /listDossierBills',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });

      callback && callback(response)
    }
  } catch (e){
    console.log('Error al obtener la lista de facturas:', e)

    const dni =  getState().user.profile.documentNumber || ''

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la lista de facturas'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkListDossierBills',
        apiUrl: 'get /listDossierBills?filter=user_id::'+sessionStorage.getItem('id')+'|dossierCod::'+dossierCod,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkListAllDossierBills = (callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''
    const dni =  getState().user.profile.documentNumber || ''
    if (dni !==''){

      // LCS: Registrar el tiempo inicial
      const startTime = performance.now();

      const response = await provisionsService.listAllDossierBills(dni, token)

      // LCS: Registrar el tiempo final y calcular la duración
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      // LCS: Enviar evento a GA para errores
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'get /listDossierBills?filter=user_id::'+sessionStorage.getItem('id'),
          apiUrlShort: 'get /listDossierBills',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });

      callback && callback(response)
    }
  } catch (e){
    console.log('Error al obtener la lista de facturas:', e)

    const dni =  getState().user.profile.documentNumber || ''

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la lista de facturas'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkListAllDossierBills',
        apiUrl: 'get /listDossierBills?filter=user_id::'+sessionStorage.getItem('id'),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetDocumentosCargaOffline = (id: string, docNumber: string, cups: string, docType: string, date: string, docName: string, docSize: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.doGetDocumentosCargaOffline(id, docNumber, cups, docType, date, docName, docSize, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /documentsOffline?filter='+(sessionStorage.getItem('id') !== '' ? 'user_id::'+sessionStorage.getItem('id') : '')+(cups !== '' ? '|cups::'+hideCUPS(cups) : '')+(docType !== '' ? '|doctype::'+docType : '')+(date !== '' ? '|fechaRealSubida::'+date : '')+(docName !== '' ? '|docName::'+docName : '')+(docSize !== '' ? '|docSize::'+docSize : ''),
        apiUrlShort: 'get /documentsOffline',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response.items || [] as any)
  } catch (e){
    console.error('Error al obtener el/los documento/s:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener el/los documento/s'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkGetDocumentosCargaOffline',
        apiUrl: 'get /documentsOffline?filter='+(sessionStorage.getItem('id') !== '' ? 'user_id::'+sessionStorage.getItem('id') : '')+(cups !== '' ? '|cups::'+hideCUPS(cups) : '')+(docType !== '' ? '|doctype::'+docType : '')+(date !== '' ? '|fechaRealSubida::'+date : '')+(docName !== '' ? '|docName::'+docName : '')+(docSize !== '' ? '|docSize::'+docSize : ''),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkCreateDocumentoCargaOffline = (data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.createDocumentoCargaOffline(data, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /documentsOffline',
        apiUrlShort: 'post /documentsOffline',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al crear el documento:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener el/los documento/s'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkCreateDocumentoCargaOffline',
        apiUrl: 'post /documentsOffline',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkStartTask = (fileId: string, destination: string, data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.startTask(fileId, destination, data, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para errores - Wave GdC
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'put /iniciarTarea/'+fileId+'001'+(destination !== '' ? '?destino='+destination : ''),
        apiUrlShort: 'put /iniciarTarea',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  }catch (e) {
    console.error('Error al iniciar tarea: ', e)

    // LCS: Enviar evento a GA para errores - Wave GdC
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al iniciar tarea'),
        error: e,
        reactComponent: 'ProvisionsThunkActions.ts - thunkStartTask',
        apiUrl: 'put /iniciarTarea/'+fileId+'001'+(destination !== '' ? '?destino='+destination : ''),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}  

export const thunkExpedientForm = (data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await provisionsService.expedientForm(data, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para medir el tiempo - Wave GdC
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /expedientForm' + '?filter=expediente::' + (data.expedientId != '' ? data.expedientId : ''),
        apiUrlShort: 'post /expedientForm',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  }catch (error){
    console.error('Error al enviar la expediente: ', error)

    // LCS: Enviar evento a GA - Wave Gdc
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (error as any).result ? (error as any).result.msgResult : ((error as any).msgResult ? (error as any).msgResult : 'Error al enviar la expediente'),
        error: error,
        reactComponent: 'ProvisionsThunkActions.ts - thunkExpedientForm',
        apiUrl: 'post /expedientForm' + '?filter=expediente::' + (data.expedientId != '' ? data.expedientId : ''),
        codResult: (error as any).result ? (error as any).result.codResult : ((error as any).codResult ? (error as any).codResult : '')
      }
    });

    callback && callback()
  }
}