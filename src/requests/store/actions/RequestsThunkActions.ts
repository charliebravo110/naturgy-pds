import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { AppState } from '../../../common/store/reducers/MainReducer'
import RequestsService from '../../RequestsService'
import ProvisionsService from '../../../provisions/ProvisionsService'

// LCS: Importa la función - Wave 1
import { hideCUPS, modApiUrl, sendGAEvent } from '../../../core/utils/gtm';

const requestsService = new RequestsService()
const provisionsService = new ProvisionsService()

export const thunkGetRequestsList = (filter: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    const requestsResponse = await requestsService.getRequestsList(filter, token)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /serviceRequests?filter='+modApiUrl(filter),
        apiUrlShort: 'get /serviceRequests',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    let auxList = [] as any

    if (requestsResponse && requestsResponse.serviceRequests && requestsResponse.serviceRequests.items && requestsResponse.serviceRequests.items.length > 0) {
      const items = [] as any

      requestsResponse.serviceRequests.items.filter(item => item.status === 'EN CURSO' || item.status === 'CERRADA').map(item => {
        const date = item.createDate && item.createDate.split('/')
        const dateClose = item.closingDate && item.closingDate.split('/')

        // formateamos la fecha de mm/dd/yyyy a yyyymmddhhmmss
        const formattedDate = date && (date[2] + '' + date[1] + '' + date[0] + '000000')
        const formattedDateClose = dateClose && (dateClose[2] + '' + dateClose[1] + '' + dateClose[0] + '000000')

        const auxItem = {
          type: 'REQUEST',
          code: item.codSR,
          date: formattedDate || '00000000000000',
          dateClose: formattedDateClose || '00000000000000'
        }

        return items.push(auxItem)
      })

      try {

        // LCS: Registrar el tiempo inicial - Wave 2
        const startTime = performance.now();

        const notificationsResponse = await provisionsService.doGetCommunicationNotifications(items, token)

        // LCS: Registrar el tiempo final y calcular la duración - Wave 2
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        // LCS: Enviar evento a GA para errores - Wave 2
        sendGAEvent({
        event: 'api_response_time',
        info: {
            apiUrl: 'post /notifications',
            apiUrlShort: 'post /notifications',
            responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
        });

        if (notificationsResponse && notificationsResponse.notifications) {
          requestsResponse.serviceRequests && requestsResponse.serviceRequests.items && requestsResponse.serviceRequests.items.map(item => {
            const sendDate = item.createDate && item.createDate.split('/')
            const closeDate = item.closingDate && item.closingDate !== '' && item.closingDate.split('/')

            // formateamos la fecha de mm/dd/yyyy a yyyymmddhhmmss
            const formattedDate = sendDate && (sendDate[2] + '' + sendDate[1] + '' + sendDate[0] + '000000')

            let auxItem = {
              ...item,
              createDate: (sendDate[0] + '/' + sendDate[1] + '/' + sendDate[2]),
              closingDate: (closeDate && closeDate[0] + '/' + closeDate[1] + '/' + closeDate[2])
            }

            const notification = notificationsResponse.notifications.filter(i => i.date === formattedDate && i.code === item.codSR)[0]

            if (item.status !== 'EN CURSO' && item.status !== 'CERRADA') {
              auxItem = {
                ...auxItem,
                indRead: 1
              }
            } else {
              if (notification) {
                auxItem = {
                  ...auxItem,
                  indRead: notificationsResponse.notifications.filter(i => i.date === formattedDate && i.code === item.codSR)[0].indRead
                }
              } else {
                auxItem = {
                  ...auxItem,
                  indRead: 0
                }
              }
            }

            return auxList.push(auxItem)
          })
        }

        // ordenar auxList por fecha (más nueva a más antigua)
        auxList.sort(function (a, b) {
          let aa = a.createDate.split('/')
          aa = aa[2] + '-' + aa[1] + '-' + aa[0]

          let bb = b.createDate.split('/')
          bb = bb[2] + '-' + bb[1] + '-' + bb[0]

          return new Date(bb).getTime() - new Date(aa).getTime()
        })

        callback && callback(auxList)
      } catch (e){
        console.log('Error al obtener las notificaciones de las peticiones:', e)

        // LCS: Enviar evento a GA para errores - Wave 2
        sendGAEvent({
          event: 'api_error',
          info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener las notificaciones de la provisión'),
          error: e,
          reactComponent: 'RequestsThunkActions.ts - thunkGetRequestsList',
          apiUrl: 'post /notifications',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
          }
        });

        requestsResponse.serviceRequests.items.map(item => {
          const auxItem = {
            ...item,
            indRead: 0
          }

          return auxList.push(auxItem)
        })

        callback && callback(auxList)
      }
    } else {
      callback && callback()
    }
  } catch (e){
    console.error('Error al obtener la lista de peticiones de servicio:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la lista de peticiones de servicio'),
        error: e,
        reactComponent: 'RequestsThunkActions.ts - thunkGetRequestsList',
        apiUrl: 'get /serviceRequests?filter='+modApiUrl(filter),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetRequestsTyplogyList = (filter: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const requestsResponse = await requestsService.getRequestsTypologyList(filter, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para errores
    sendGAEvent({
    event: 'api_response_time',
    info: {
        apiUrl: 'get /serviceRequestsTypology?filter='+modApiUrl(filter),
        apiUrlShort: 'get /serviceRequestsTypology',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
    }
    });

    if (requestsResponse && requestsResponse.serviceRequests && requestsResponse.serviceRequests.items && requestsResponse.serviceRequests.items.length > 0) {
      callback && callback(requestsResponse.serviceRequests.items)
    } else {
      callback && callback()
    }
  } catch (e){
    console.error('Error al obtener la lista de peticiones de servicio por tipologia:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la lista de peticiones de servicio por tipologia'),
        error: e,
        reactComponent: 'RequestsThunkActions.ts - thunkGetRequestsTyplogyList',
        apiUrl: 'get /serviceRequestsTypology?filter='+modApiUrl(filter),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkUpdateRequest = (data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await requestsService.updateRequest(data, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para errores
    sendGAEvent({
    event: 'api_response_time',
    info: {
        apiUrl: 'put /serviceRequests',
        apiUrlShort: 'put /serviceRequests',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
    }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al updatear la petición de servicio:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al updatear la petición de servicio'),
        error: e,
        reactComponent: 'RequestsThunkActions.ts - thunkUpdateRequest',
        apiUrl: 'put /serviceRequests',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkCreateNewRequest = (data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const response = await requestsService.createNewRequest(data, token)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /serviceRequests',
        apiUrlShort: 'post /serviceRequests',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al crear la nueva petición de servicio:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al crear la nueva petición de servicio'),
        error: e,
        reactComponent: 'RequestsThunkActions.ts - thunkCreateNewRequest',
        apiUrl: 'post /serviceRequests',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback(e)
  }
}

export const thunkNoticeSgi = (data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || '';

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const response = await requestsService.noticeSgi(data, token);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /warnings/incidence',
        apiUrlShort: 'post /warnings/incidence',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al notificar a SGI:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al notificar a SGI'),
        error: e,
        reactComponent: 'RequestsThunkActions.ts - thunkNoticeSgi',
        apiUrl: 'post /warnings/incidence',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback(e)
  }
}

export const thunkCreateDocument = (data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await requestsService.createDocument(data, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /documentum',
        apiUrlShort: 'post /documentum',
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
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al crear el documento'),
        error: e,
        reactComponent: 'RequestsThunkActions.ts - thunkCreateDocument',
        apiUrl: 'post /documentum',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetDocument = (documentumId: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''
    const dni = getState().user.profile.documentNumber

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await requestsService.getDocument(documentumId, dni, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /documentum/'+documentumId+'?filter=user_id_consumidor::'+sessionStorage.getItem('id'),
        apiUrlShort: 'get /documentum/documentumId',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al obtener el documento:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener el documento'),
        error: e,
        reactComponent: 'RequestsThunkActions.ts - thunkGetDocument',
        apiUrl: 'get /documentum/'+documentumId+'?filter=user_id_consumidor::'+sessionStorage.getItem('id'),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetDocumentSr = (documentumId: string, srCode: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''
    const dni = getState().user.profile.documentNumber

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await requestsService.getDocumentSr(documentumId, dni, srCode, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /documentum/'+documentumId+'?filter=user_id_consumidor::'+sessionStorage.getItem('id')+'|cod_sr::'+srCode,
        apiUrlShort: 'get /documentum/documentumId',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al obtener el documento:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener el documento'),
        error: e,
        reactComponent: 'RequestsThunkActions.ts - thunkGetDocumentSr',
        apiUrl: 'get /documentum/'+documentumId+'?filter=user_id_consumidor::'+sessionStorage.getItem('id')+'|cod_sr::'+srCode,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

// TO-DO nueva interfaz para recuperar el listado de comentarios
//
// export const thunkGetCommentsSr = (srCode: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
//   try {
//     const token = sessionStorage.getItem('token') || ''
//
//     const response = await requestsService.getCommentsSr(srCode, token)
//
//     callback && callback(response)
//   } catch (e){
//     console.error('Error al obtener el comentarios:', e)
//
//     callback && callback()
//   }
// }

export const thunkGetDossiersList = (defaultName: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const dni = getState().user.profile.documentNumber
    const token = sessionStorage.getItem('token') || ''

    const dossiers = [] as any

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const response1 = await requestsService.getDossiersList(dni, token)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /dossiers?filter=user_id::'+sessionStorage.getItem('id'),
        apiUrlShort: 'get /dossiers',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    try {
      // LCS: Registrar el tiempo inicial - Wave 2
      const startTime = performance.now();
      const response2 = await requestsService.getDossiersData(dni, token)

      // LCS: Registrar el tiempo final y calcular la duración - Wave 2
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      // LCS: Enviar evento a GA para medir el tiempo - Wave 2
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'get /customData?filter=user_id::'+sessionStorage.getItem('id')+'|type::dossier',
          apiUrlShort: 'get /customData',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });

      if (response1 && response1.dossiers && response1.dossiers.items && response1.dossiers.items.length > 0) {
        response1 && response1.dossiers.items.map((item, key) => {
          const dossierCod = item.dossierCod

          const dossierData = (response2 && response2.customData && response2.customData.items) &&
            response2.customData.items.filter(data => (data.keyId.includes(dossierCod)))[0]

          item = {
            ...item,
            icon: dossierData ? dossierData.icon : '',
            name: dossierData ? dossierData.name : defaultName
          }

          return dossiers.push(item)
        })
      }

      callback && callback(dossiers)
    } catch (e){
      console.log('Error al obtener la lista de expedientes:', e)

      // LCS: Enviar evento a GA para errores - Wave 2
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la lista de expedientes'),
          error: e,
          reactComponent: 'RequestsThunkActions.ts - thunkGetDossiersList',
          apiUrl: 'get /customData?filter=user_id::'+sessionStorage.getItem('id')+'|type::dossier',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });

      if (response1 && response1.dossiers && response1.dossiers.items && response1.dossiers.items.length > 0) {
        response1 && response1.dossiers.items.map((item, key) => {
          item = {
            ...item,
            icon: '',
            name: defaultName
          }

          return dossiers.push(item)
        })
      }

      callback && callback(dossiers)
    }
  } catch (e){
    console.error('Error al obtener la lista de expedientes:', e)
    const docId = getState().user.profile.documentNumber

    const dni = getState().user.profile.documentNumber

    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la lista de expedientes'),
        error: e,
        reactComponent: 'RequestsThunkActions.ts - thunkGetDossiersList',
        apiUrl: 'get /dossiers?filter=user_id::'+sessionStorage.getItem('id'),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetSuppliesList = (defaultName: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const dni = getState().user.profile.documentNumber
    const token = sessionStorage.getItem('token') || ''

    const supplies = [] as any

   // LCS: Registrar el tiempo inicial - Wave 2
   const startTime = performance.now();

   const response1 = await requestsService.getSuppliesList(dni, token)

   // LCS: Registrar el tiempo final y calcular la duración - Wave 2
   const endTime = performance.now();
   const responseTime = endTime - startTime;
   // LCS: Enviar evento a GA para medir el tiempo - Wave 2
   sendGAEvent({
     event: 'api_response_time',
     info: {
       apiUrl: 'get /supplypoints?filter=user_id::'+sessionStorage.getItem('id'),
       apiUrlShort: 'get /supplypoints',
       responseTime: responseTime, // Tiempo de respuesta en milisegundos
     }
   });

    

    try {

      // LCS: Registrar el tiempo inicial - Wave 2
      const startTime = performance.now();

      const response2 = await requestsService.getSuppliesData(dni, token)

      // LCS: Registrar el tiempo final y calcular la duración - Wave 2
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      // LCS: Enviar evento a GA para medir el tiempo - Wave 2
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'get /customData?filter=user_id::'+sessionStorage.getItem('id')+'|type::supply',
          apiUrlShort: 'get /customData',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });

      if (response1 && response1.supplyPoints && response1.supplyPoints.length > 0) {
        response1 && response1.supplyPoints.map((item, key) => {
          const cups = item.cups

          const supplyData = (response2 && response2.customData && response2.customData.items) &&
            response2.customData.items.filter(data => (data.keyId.includes(cups)))[0]

          item = {
            ...item,
            icon: supplyData ? supplyData.icon : '',
            name: supplyData ? supplyData.name : defaultName
          }

          return supplies.push(item)
        })
      }

      if (response1 && response1.delegatePoints && response1.delegatePoints.length > 0) {
        const delegatePointsCUPS = response1.delegatePoints.map((item, key) => item.cups).toString()

        try{
          // LCS: Registrar el tiempo inicial - Wave 2
          const startTime = performance.now();

          const response3 = await requestsService.getCupsData(delegatePointsCUPS, token)

          // LCS: Registrar el tiempo final y calcular la duración - Wave 2
          const endTime = performance.now();
          const responseTime = endTime - startTime;
          // LCS: Enviar evento a GA para medir el tiempo - Wave 2
          sendGAEvent({
            event: 'api_response_time',
            info: {
              apiUrl: 'get /customData?filter=keyId~~'+hideCUPS(delegatePointsCUPS)+'|type::supply',
              apiUrlShort: 'get /customData',
              responseTime: responseTime, // Tiempo de respuesta en milisegundos
            }
          });

          response1 && response1.delegatePoints.map((item, key) => {
            const cups = item.cups

            const supplyData = (response3 && response3.supplyPoints && response3.supplyPoints.items) &&
              response3.customData.items.filter(data => (data.keyId.includes(cups)))[0]

            item = {
              ...item,
              icon: supplyData ? supplyData.icon : '',
              name: supplyData ? supplyData.name : defaultName
            }

            return supplies.push(item)
          })
        } catch (e){
          sendGAEvent({
            event: 'api_error',
            info: {
              error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
              error: e,
              reactComponent: 'RequestsThunkActions.ts - thunkGetDossiersList',
              apiUrl: 'get /customData?filter=keyId~~'+hideCUPS(delegatePointsCUPS)+'|type::supply',
              codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
            }
          });
        }
      }

      callback && callback(supplies)
    } catch (e){
      console.log('Error al obtener la lista de suministros:', e)

      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la lista de suministros'),
          error: e,
          reactComponent: 'RequestsThunkActions.ts - thunkGetSuppliesList',
          apiUrl: 'get /customData?filter=user_id::'+sessionStorage.getItem('id')+'|type::supply',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });

      if (response1 && response1.supplyPoints && response1.supplyPoints.length > 0) {
        response1 && response1.supplyPoints.map((item, key) => {
          item = {
            ...item,
            icon: '',
            name: defaultName
          }

          return supplies.push(item)
        })
      }

      if (response1 && response1.delegatePoints && response1.delegatePoints.length > 0) {
        response1 && response1.delegatePoints.map((item, key) => {
          item = {
            ...item,
            icon: '',
            name: defaultName
          }

          return supplies.push(item)
        })
      }

      callback && callback(supplies)
    }
  } catch (e){
    console.error('Error al obtener la lista de suministros:', e)

    const dni = getState().user.profile.documentNumber

    // LCS: Enviar evento a GA para errores - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la lista de suministros'),
        error: e,
        reactComponent: 'RequestsThunkActions.ts - thunkGetSuppliesList',
        apiUrl: 'get /supplypoints?filter=user_id::'+sessionStorage.getItem('id'),
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

    const response = await requestsService.doGetDocumentosCargaOffline(id, docNumber, cups, docType, date, docName, docSize, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
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
        reactComponent: 'RequestsThunkActions.ts - thunkGetDocumentosCargaOffline',
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

    const response = await requestsService.createDocumentoCargaOffline(data, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // Enviar evento a GA para medir el tiempo
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
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al crear el documento'),
        error: e,
        reactComponent: 'RequestsThunkActions.ts - thunkCreateDocumentosCargaOffline',
        apiUrl: 'post /documentsOffline',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetEventsSr = (documentNumber:string, codSr: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const eventsResponse = await requestsService.getServiceRequestEvents(documentNumber, codSr, token)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /serviceRequestsComments?filter=user_id::'+sessionStorage.getItem('id')+'|codSR::'+codSr,
        apiUrlShort: 'get /serviceRequestsComments',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });
    

    callback && callback(eventsResponse)

  } catch (e){
    console.error('Error al obtener el listado de eventos de la SR:', e)

    // LCS: Enviar evento a GA para errores - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'RequestsThunkActions.ts - thunkGetEventsSr',
        apiUrl: 'get /serviceRequestsComments?filter=user_id::'+sessionStorage.getItem('id')+'|codSR::'+codSr,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });
    

    callback && callback()
  }
}
