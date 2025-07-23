import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { AppState } from '../../../../common/store/reducers/MainReducer'
import SuppliesService from '../../../SuppliesService'
import {
  setSuppliesCount,
  appendSuppliesList,
  setCurrentDelegation,
  setDelegationsInManagers,
  setDelegatesInMeListCount,
  appendDelegatesInMeList
} from '../../../store/actions/SuppliesActions'

import { delegationsToSupplyDelegations } from '../../../../common/lib/DelegationsLib'

// LCS: Importa la función - Wave 1
import { hideCUPS, sendGAEvent } from '../../../../core/utils/gtm';

const suppliesService = new SuppliesService()

export const thunkListSupplies = (
  defaultSupplyName: any,
  //offset: any, // primer elemento que se listará
  //limit: any, // total de elementos a partir del offset
  //cups: any, // búsqueda por cups
  //fromSearch: boolean, // es procedente de search
  //delegatePointsOffset: any,
  //delegatePointsLimit: any,
  delegatePointsFromSearch: boolean,
  isSupplyPointAction: boolean,
  isDelegatePointAction: boolean,
  callback: any
): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = getState().user.token
    const dni = getState().user.profile.documentNumber

    const suppliesList = [] as any
    const delegatesList = [] as any

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    const suppliesResponse = await suppliesService.listSupplies(
      dni,
      /*offset,
      limit,
      cups,
      delegatePointsOffset,
      delegatePointsLimit,*/
      '',
      token
    )

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /supplypoints?filter=user_id::'+sessionStorage.getItem('id'),
        apiUrlShort: 'get /supplypoints',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    try {

      // LCS: Registrar el tiempo inicial - Wave 1
      const startTime = performance.now();
      
      const suppliesDataResponse = await suppliesService.getSuppliesData(dni, token)

      // LCS: Registrar el tiempo final y calcular la duración - Wave 1
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      // LCS: Enviar evento a GA para medir el tiempo - Wave 1
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'get /customData?filter=user_id::'+sessionStorage.getItem('id')+'|type::supply',
          apiUrlShort: 'get /customData',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });

      // supplies
      if (isSupplyPointAction) {
        if (suppliesResponse && suppliesResponse.supplyPoints && suppliesResponse.supplyPoints.items && suppliesResponse.supplyPoints.items.length > 0) {
          suppliesResponse.supplyPoints.items.map(item => {
            const cups = item.cups

            const supplyData = (suppliesDataResponse && suppliesDataResponse.customData && suppliesDataResponse.customData.items) &&
              suppliesDataResponse.customData.items.filter(data => (data.keyId.includes(cups)))[0]

            item = {
              ...item,
              icon: supplyData ? supplyData.icon : '',
              name: supplyData ? supplyData.name : defaultSupplyName
            }
            return suppliesList.push(item)
            // if (item.inService.toUpperCase() !== 'NO') {
            // }

          })
          dispatch(setSuppliesCount(suppliesResponse && suppliesResponse.supplyPoints.items.length ? suppliesResponse.supplyPoints.items.length : 0))
          dispatch(appendSuppliesList(suppliesList))
        }
      }

      // delegates
      if (isDelegatePointAction) {
          if (suppliesResponse && suppliesResponse.delegatePoints && suppliesResponse.delegatePoints.items && suppliesResponse.delegatePoints.items.length > 0) {
            const cups = suppliesResponse.delegatePoints.items.map(item => item.cups).toString()
  
              try {
                // LCS: Registrar el tiempo inicial - Wave 1
                const startTime = performance.now();
      
                const delegatesDataResponse = await suppliesService.getSuppliesDataByCupsList(cups, token)
      
                // LCS: Registrar el tiempo final y calcular la duración - Wave 1
                const endTime = performance.now();
                const responseTime = endTime - startTime;
                // LCS: Enviar evento a GA para medir el tiempo - Wave 1
                sendGAEvent({
                  event: 'api_response_time',
                  info: {
                    apiUrl: 'get /customData?filter=keyId~~'+hideCUPS(cups)+'|type::supply',
                    apiUrlShort: 'get /customData',
                    responseTime: responseTime, // Tiempo de respuesta en milisegundos
                  }
                });
  
                suppliesResponse.delegatePoints.items.map(item => {
                  const cups = item.cups
      
                  const delegateData = (delegatesDataResponse && delegatesDataResponse.supplyPoints && delegatesDataResponse.supplyPoints.items) &&
                    delegatesDataResponse.customData.items.filter(data => (data.keyId.includes(cups)))[0]
      
                  item = {
                    ...item,
                    icon: delegateData ? delegateData.icon : '',
                    name: delegateData ? delegateData.name : defaultSupplyName
                  }
      
                  // if (item.inService.toUpperCase() !== 'NO') {
                    return delegatesList.push(item)
                  // }
      
                })
      
                if (delegatePointsFromSearch) {
                  const searchedDelegateCups = suppliesResponse.delegatePoints.items.find(item => item.cups === cups)
      
                  dispatch(setDelegatesInMeListCount(searchedDelegateCups ? 1 : 0))
                } else {
                  dispatch(setDelegatesInMeListCount(suppliesResponse && suppliesResponse.delegatePoints.items.length ? parseInt(suppliesResponse.delegatePoints.items.length) : 0))
                }
      
                !delegatePointsFromSearch && dispatch(appendDelegatesInMeList(delegatesList))
            } catch (e){
              // LCS: Enviar evento de error a GA - Wave 1
              sendGAEvent({
                event: 'api_error',
                info: {
                  error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
                  error: e,
                  reactComponent: 'SuppliesListThunkActions.ts - thunkListSupplies',
                  apiUrl: 'get /customData?filter=keyId~~'+hideCUPS(cups)+'|type::supply',
                  codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
                }
              });
            }
          }
        }

      const mix = {
        supplypoints: suppliesList,
        delegatepoints: delegatesList
      } as any

      callback && callback(mix)
    } catch (e){
      console.log('Error al obtener la lista de datos de los suministros:', e)

      // LCS: Enviar evento de error a GA - Wave 1
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
          error: e,
          reactComponent: 'SuppliesListThunkActions.ts - thunkListSupplies',
          apiUrl: 'get /customData?filter=user_id::'+sessionStorage.getItem('id')+'|type::supply',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });

      // supplies
      if (isSupplyPointAction) {
        if (suppliesResponse && suppliesResponse.supplyPoints && suppliesResponse.supplyPoints.items && suppliesResponse.supplyPoints.items.length > 0) {
          suppliesResponse.supplyPoints.items.map(item => {
            item = {
              ...item,
              icon: '',
              name: defaultSupplyName
            }

            // if (item.inService.toUpperCase() !== 'NO') {
              return suppliesList.push(item)
            // }

          })

          dispatch(setSuppliesCount(suppliesResponse && suppliesResponse.supplyPoints.items.length ? suppliesResponse.supplyPoints.items.length : 0))

          dispatch(appendSuppliesList(suppliesList))
        }
      }

      // delegates
      if (isDelegatePointAction) {
        if (suppliesResponse && suppliesResponse.delegatePoints && suppliesResponse.delegatePoints.items && suppliesResponse.delegatePoints.items.length > 0) {
          suppliesResponse.delegatePoints.items.map(item => {
            item = {
              ...item,
              icon: '',
              name: defaultSupplyName
            }

            // if (item.inService.toUpperCase() !== 'NO') {
              return delegatesList.push(item)
            // }

          })

          if (delegatePointsFromSearch) {
            const cups = suppliesResponse.delegatePoints.items.map(item => item.cups).toString()
            const searchedDelegateCups = suppliesResponse.delegatePoints.items.find(item => item.cups === cups)

            dispatch(setDelegatesInMeListCount(searchedDelegateCups ? 1 : 0))
          } else {
            dispatch(setDelegatesInMeListCount(suppliesResponse && suppliesResponse.delegatePoints.count ? parseInt(suppliesResponse.delegatePoints.count) : 0))
          }

          !delegatePointsFromSearch && dispatch(appendDelegatesInMeList(delegatesList))
        }
      }

      const mix = {
        supplypoints: suppliesList,
        delegatePoints: delegatesList
      } as any

      callback && callback(mix)
    }
  } catch (e){
    console.log('Error al obtener la lista de suministros:', e)
    const dni = getState().user.profile.documentNumber

    // LCS: Enviar evento de error a GA  - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'SuppliesListThunkActions.ts - thunkGetCurrentCompareConsumptions',
        apiUrl: 'get /customData?filter=user_id::'+sessionStorage.getItem('id')+'|type::supply',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}
// E999513 --> Nueva llamada para recuperar lista de cups pero por un DNI indicado

export const thunkListSuppliesAdmin = (
  defaultSupplyName: any,
  tokenAdmin: any,
  dniAdmin: any,
  idAddress: any,
  callback: any
): ThunkAction<void, AppState, null, Action> => async (dispatch) => {
  try {

    const token = tokenAdmin
    const dni = dniAdmin
    const idAdd = idAddress
    const suppliesList = [] as any

    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    const suppliesResponse = await suppliesService. listSupplies(
      dni,
      idAdd,
      token
    )

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    if (dni !== '') {
      // LCS: Enviar evento a GA para medir el tiempo - Wave 1
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'get /supplypoints?filter=user_id::'+sessionStorage.getItem('id'),
          apiUrlShort: 'get /supplypoints',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });
    } else if (idAddress !== '') {
      // LCS: Enviar evento a GA para medir el tiempo - Wave 1
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'get /supplypoints?filter=idAddress::'+idAddress,
          apiUrlShort: 'get /supplypoints',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });
    }

    // const suppliesDataResponse = dni !== '' ? await suppliesService.getSuppliesData(dni, token) : ''
    const suppliesDataResponse = null;

    // supplies
    if (suppliesResponse && suppliesResponse.supplyPoints && suppliesResponse.supplyPoints.items && suppliesResponse.supplyPoints.items.length > 0) {
      suppliesResponse.supplyPoints.items.map(item => {
        const cups = item.cups

        const supplyData = (suppliesDataResponse && suppliesDataResponse.customData && suppliesDataResponse.customData.items) &&
          suppliesDataResponse.customData.items.filter(data => (data.keyId.includes(cups)))[0]

        item = {
          ...item,
          name: supplyData ? supplyData.name : defaultSupplyName
        }

        return suppliesList.push(item)
      })
    }

    const mix = {
      supplypoints: suppliesList
    } as any

    callback && callback(mix)

  } catch (e){
    callback && callback(e)
    const dni = dniAdmin
    const idAdd = idAddress

    if (dni !== '') {
      // LCS: Enviar evento a GA para medir el tiempo - Wave 1
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
          error: e,
          reactComponent: 'SuppliesListThunkActions.ts - thunkListSuppliesAdmin',
          apiUrl: 'get /supplypoints?filter=user_id::'+sessionStorage.getItem('id'),
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    } else if (idAddress !== '') {
      // LCS: Enviar evento a GA para medir el tiempo - Wave 1
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
          error: e,
          reactComponent: 'SuppliesListThunkActions.ts - thunkListSuppliesAdmin',
          apiUrl: 'get /supplypoints?filter=idAddress::'+idAddress,
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    }
  }
}

//FSP-INI
export const thunkGetDelegationsInMe = (
  cups: string,
  startDate: string,
  endDate: string,
  dni: string,
  setLoadingDelegationsList: any,
  callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
    try {
      const token = sessionStorage.getItem('token') || ''
      const roles = sessionStorage.getItem('userRoles') || ''
      const asyncResp = await suppliesService.doGetDelegationsInMe(
        token, 'cups', cups, 'startDate', startDate, 'endDate', endDate, roles, dni)

      // Lista de delegaciones en gestor asesor   
      const supplyDelegations = delegationsToSupplyDelegations(asyncResp.delegations.items)
      dispatch(setDelegationsInManagers(supplyDelegations))
      callback && callback(asyncResp)
    } catch (e){
      console.log('Error al obtener la lista de delegacionesInMe: ', e)

    }
  }
//FSP-FIN

export const thunkGetDelegations = (setLoadingDelegationsList: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userId = getState().user.profile.userId || ''
    const token = sessionStorage.getItem('token') || ''
    const roles = sessionStorage.getItem('userRoles') || ''
    const dni = getState().user.profile.documentNumber || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const asyncResp = await suppliesService.doGetDelegations(token, 'userId', userId, roles, dni)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /delegations?filter='+'user_id'+'::'+userId+'|status::C|user_id::'+sessionStorage.getItem('id'),
        apiUrlShort: 'get /delegations',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });


    // Lista de delegaciones en gestor asesor
    const supplyDelegations = delegationsToSupplyDelegations(asyncResp.delegations.items)
    dispatch(setDelegationsInManagers(supplyDelegations))

    setLoadingDelegationsList && setLoadingDelegationsList(false)

    callback && callback(asyncResp)
  } catch (e){
    console.log('Error al obtener la lista de delegaciones:', e)

    const userId = getState().user.profile.userId || ''
    const dni = getState().user.profile.documentNumber || ''

    // LCS: Enviar evento de error a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la lista de delegaciones'),
        error: e,
        reactComponent: 'SuppliesListThunkActions.ts - thunkGetDelegations',
        apiUrl: 'get /delegations?filter='+'user_id'+'::'+userId+'|status::C|user_id::'+sessionStorage.getItem('id'),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    setLoadingDelegationsList && setLoadingDelegationsList(false)
  }
}

export const thunkGetDelegatedInMe = (loading: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = getState().user.token
    const dni = getState().user.profile.documentNumber

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const asyncResp = await suppliesService.doGetSupplies(dni, token)

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

    loading && loading(false)

    callback && callback(asyncResp.delegatePoints && asyncResp.delegatePoints.items)
  } catch (e){
    console.log('Error al obtener la lista de suministros delegados en mí:', e)
    const dni = getState().user.profile.documentNumber

    // LCS: Enviar evento de error a GA - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la lista de suministros delegados en mí'),
        error: e,
        reactComponent: 'SuppliesListThunkActions.ts - thunkGetDelegatedInMe',
        apiUrl: 'get /supplypoints?filter=user_id::'+sessionStorage.getItem('id'),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    loading && loading(false)

    callback && callback()
  }
}

export const thunkGetIfMyCups = (cups: string, loading: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = getState().user.token
    const dni = getState().user.profile.documentNumber

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const asyncResp = await suppliesService.doGetSuppliesDNICUPS(dni, cups)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /supplypoints?filter=user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups),
        apiUrlShort: 'get /supplypoints',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    loading && loading(false)

    callback && callback(asyncResp.supplyPoints && asyncResp.supplyPoints.items)
  } catch (e){
    console.log('Error al obtener la lista de suministros con mi dni y el cups:', e)

    const dni = getState().user.profile.documentNumber

    // LCS: Enviar evento de error a GA - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'SuppliesListThunkActions.ts - thunkGetIfMyCups',
        apiUrl: 'get /supplypoints?filter=user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    loading && loading(false)

    callback && callback()
  }
}

export const thunkGetDelegation = (delegateId: string): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const asyncResp = await suppliesService.getDelegation(delegateId, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /delegations/'+delegateId,
        apiUrlShort: 'get /delegations/delegateId',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    dispatch(setCurrentDelegation(asyncResp.delegation))
  } catch (e){
    console.error(e)

    // LCS: Enviar evento de error a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'SuppliesListThunkActions.ts - thunkGetDelegation',
        apiUrl: 'get /delegations/'+delegateId,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

  }
}

export const thunkUpdateDelegationsPeriods = (items: Array<any>): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    await suppliesService.updateDelegationsPeriods(items, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'put /delegations',
        apiUrlShort: 'put /delegations',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    dispatch(thunkGetDelegations(null, null))
  } catch (e){
    console.error(e)

    // LCS: Enviar evento de error a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'SuppliesListThunkActions.ts - thunkUpdateDelegationsPeriods',
        apiUrl: 'put /delegations',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });
  }
}

export const thunkDeleteDelegations = (delegations: string[], callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    var iError
    for (let i = 0; i < delegations.length; i++) {
      iError = i
      // LCS: Registrar el tiempo inicial
      const startTime = performance.now();

      await suppliesService.deleteDelegation(delegations[i], token)

      // LCS: Registrar el tiempo final y calcular la duración
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      // LCS: Enviar evento a GA para medir el tiempo
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'delete /delegations/'+delegations[i],
          apiUrlShort: 'delete /delegations/'+delegations[i],
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });
    }

    dispatch(thunkGetDelegations(null, null))

    callback && callback()
  } catch (e){
    console.log('Error al borrar la delegación del punto de suministro:', e)

    // LCS: Enviar evento de error a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al borrar la delegación del punto de suministro'),
        error: e,
        reactComponent: 'SuppliesListThunkActions.ts - thunkDeleteDelegations',
        apiUrl: 'delete /delegations/'+delegations[iError],
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkUpdateDelegationStatus = (items: Array<any>, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    await suppliesService.doUpdateDelegationStatus(items, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'put /delegations',
        apiUrlShort: 'put /delegations',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback('OK')
  } catch (e){
    console.log('Error al actualizar la delegación del punto de suministro:', e)

    // LCS: Enviar evento de error a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al actualizar la delegación del punto de suministro'),
        error: e,
        reactComponent: 'SuppliesListThunkActions.ts - thunkUpdateDelegationStatus',
        apiUrl: 'put /delegations',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback('KO')
  }
}
