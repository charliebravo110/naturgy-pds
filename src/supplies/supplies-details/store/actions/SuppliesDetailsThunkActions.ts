import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { AppState } from '../../../../common/store/reducers/MainReducer'
import SuppliesService from '../../../SuppliesService'
import {
  setCurrentSupplyConsumptions,
  setCurrentCompareConsumptions,
  setCurrentSupplyBillingPeriods
} from '../../../store/actions/SuppliesActions'
import { completeDateWithSlash } from '../../../../common/lib/FormatLib'
import { setMessage, showError } from '../../../../common/store/actions/ErrorActions'
import { result } from 'lodash'
import AveriasUtils from '../../../../gestionAverias/utils/AveriasUtilsClass'

// LCS: Importa la función - Wave 2
import { hideCUPS, sendGAEvent } from '../../../../core/utils/gtm';

const suppliesService = new SuppliesService()

// Funcion para lanzar timeout de una petición dependiendo
// del tiempo que se le pasa por parametro
const timeoutPromise = (ms, promise) => {
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
}

const addCero = (str: number) => {
  if (str.toString().length === 1) {
    return '0' + str
  } else {
    return str
  }
}

const formatDate = (date: Date): string => {
  return (addCero(date.getDate()) + '/' + addCero((date.getMonth() + 1)) + '/' + date.getFullYear())
}

//Función para dividir un rango de fechas en periodos de 6 meses
const dateDivider = (startDate: string, endDate: string, period:number) => {
  const datesArray = [];
  let firstDate = new Date(completeDateWithSlash(startDate + '00:00:01'));
  let secondDate = new Date(completeDateWithSlash(startDate + '00:00:01'));

  if (startDate === endDate) {
    datesArray.push({
      startDate: formatDate(firstDate),
      endDate: formatDate(secondDate)
    })
  }

  while (firstDate < completeDateWithSlash(endDate + '00:00:01')) {
    // Calcula la fecha final para los proximos 6 meses
    let nextEndDate = new Date(firstDate);
    nextEndDate.setMonth(firstDate.getMonth() + 6, 0);
    //comprovamos que no nos pasamos
    if (nextEndDate > completeDateWithSlash(endDate + '00:00:01')) {
      nextEndDate = new Date(completeDateWithSlash(endDate + '00:00:01'));
    }

    datesArray.push({
      startDate: formatDate(firstDate),
      endDate: formatDate(nextEndDate)
    })
    firstDate = new Date(nextEndDate)
    firstDate.setDate(firstDate.getDate() + 1)
  }
  return datesArray
}

export const thunkGetSupply = (
  defaultSupplyName: any,
  cups: any,
  callback: any
): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = getState().user.token
    const dni = getState().user.profile.documentNumber

    const suppliesList = [] as any

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const suppliesResponse = await suppliesService.listSupplies(
      dni,
      /*null,
      null,
      cups,
      null,
      null,*/
      '',
      token
    )

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

    if (suppliesResponse && suppliesResponse.supplyPoints) {
      try {
        // LCS: Registrar el tiempo inicial - Wave 2
        const startTime = performance.now();

        const suppliesDataResponse = await suppliesService.getSuppliesData(dni, token)

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

        // supplies
        if (suppliesResponse && suppliesResponse.supplyPoints && suppliesResponse.supplyPoints.items.length > 0) {
          suppliesResponse.supplyPoints.map(item => {
            const cups = item.cups

            const supplyData = (suppliesDataResponse && suppliesDataResponse.customData && suppliesDataResponse.customData.items) &&
              suppliesDataResponse.customData.items.filter(data => (data.keyId.includes(cups)))[0]

            item = {
              ...item,
              icon: supplyData ? supplyData.icon : '',
              name: supplyData ? supplyData.name : defaultSupplyName
            }

            return suppliesList.push(item)
          })
        }

        callback && callback(suppliesList)
      } catch (e){
        console.log('Error al obtener los datos del suministro:', e)

        // LCS: Enviar evento a GA para errores - Wave 2
        sendGAEvent({
          event: 'api_error',
          info: {
            error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
            error: e,
            reactComponent: 'SuppliesDetailsThunkActions.ts - thunkGetCurrentSupplyConsumptions',
            apiUrl: 'get /customData?filter=user_id::'+sessionStorage.getItem('id')+'|type::supply',
            codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
          }
        });

        if (suppliesResponse && suppliesResponse.supplyPoints && suppliesResponse.supplyPoints.items.length > 0) {
          suppliesResponse.supplyPoints.map(item => {
            item = {
              ...item,
              icon: '',
              name: defaultSupplyName
            }

            return suppliesList.push(item)
          })
        }

        callback && callback(suppliesList)
      }
    }

  } catch (e){
    console.log('Error al obtener el suministro:', e)
    const dni = getState().user.profile.documentNumber

    // LCS: Enviar evento de error a GA - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'SuppliesDetailsThunkActions.ts - thunkGetSupply',
        apiUrl: 'get /supplypoints?filter=user_id::'+sessionStorage.getItem('id'),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

/*function delay(timeInMillis: number): Promise<void> {
  return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
}*/

export const thunkGetCurrentSupplyConsumptions = (setStore: boolean, nif:string, cups: string, granularity: string, startDate: string, endDate: string, setIsLoading: any, isGenerator: string, supplantedUser: boolean, isDelegate: boolean, setExportingData: any, isSelfConsumption: string, measurementSystem: string, callback: any, count: number = 0, asyncResp = [], asyncRespList = [], avg = 0.0, counter = 0,): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  const dni = getState().user.profile.documentNumber || ''
  const token = sessionStorage.getItem('token') || ''
  let datesArray = []
  let dataArray = []
  let hasEnd = false;
  try {
    if (granularity === 'S') {
      granularity = 'D'
    }
    // En el fragmento comentado se realizan llamadas a consumptions en bucle para obtener todos los asyncResp y guardarlos en un array, 
    // se realizan las llamadas pero no se recogen y las siguientes del try catch no se realizan.

    datesArray = dateDivider(startDate, endDate, 6)

    if (datesArray.length == 1) {
      hasEnd = true
    }
    let error = false
    for (let i = count; i < datesArray.length; i++) {
      try {

        // LCS: Registrar el tiempo inicial - Wave 2
        const startTime = performance.now();

        const aux = await suppliesService.doGetCurrentSupplyConsumptions(nif, cups, granularity, datesArray[i].startDate, datesArray[i].endDate, isGenerator, isDelegate, isSelfConsumption, measurementSystem, token);

        // LCS: Registrar el tiempo final y calcular la duración - Wave 2
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        // LCS: Enviar evento a GA para medir el tiempo - Wave 2
        sendGAEvent({
          event: 'api_response_time',
          info: {
            apiUrl: 'get /consumptions?filter=user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups)+'|startDate::'+startDate+'|endDate::'+endDate+'|granularity::'+granularity+'|unit::K|generator::'+isGenerator+'|isDelegate::'+(isDelegate ? 'Y' : 'N')+'|isSelfConsumption::'+isSelfConsumption+'|measurementSystem::'+measurementSystem,
            apiUrlShort: 'get /consumptions',
            responseTime: responseTime, // Tiempo de respuesta en milisegundos
          }
        });

        delete aux.result

        //trato de datos autoconsumos ODI
        if (aux.selfConsumptions) {
          for (let j = 0; j < aux.selfConsumptions.items.length; j++) {
            dataArray.push(aux.selfConsumptions.items[j])
          }
        }
        //trato de datos consumos
        if (!aux.selfConsumptions && !aux.items[0].selfConsumptions) {
          for (let j = 0; j < aux.items[0].consumptions.items.length; j++) {
            if (isNaN(aux.items[0].consumptions.items[j].consumptionValue)) {
              avg += parseFloat(aux.items[0].consumptions.items[j].consumptionValue)
              counter++
            }
          }
        }
        // trato de datos autoconsumos Gmv10
        if (aux.items && aux.items[0].selfConsumptions) {
          for (let i = 0; i < aux.items.length; i++) {
            for (let j = 0; j < aux.items[i].selfConsumptions.items.length; j++) {
              dataArray.push(aux.items[i].selfConsumptions.items[j])
            }
          }
        }


        if (i === 0 || !asyncRespList[0]) {
          asyncRespList.push(aux)
        } else {
          if (aux.items && !aux.items[0].selfConsumptions) {
            for (let j = 0; j < aux.items.length; j++) {
              asyncRespList[0].items.push(aux.items[j])
            }
          } else if (aux.items[0].selfConsumptions) {
            for (let j = 0; j < aux.items.length; j++) {
              asyncRespList[0].items[0].selfConsumptions.items.push(aux.items[j].selfConsumptions.items)
            }
          } else if (aux.selfConsumptions) {
            for (let j = 0; j < aux.selfConsumptions.items.length; j++) {
              let exisits = false
              if (asyncRespList[0].selfConsumptions.items[asyncRespList[0].selfConsumptions.items.length - 1].date == aux.selfConsumptions.items[j].date) {
                asyncRespList[0].selfConsumptions.items[asyncRespList[0].selfConsumptions.items.length - 1] = aux.selfConsumptions.items[j]
              } else {
                asyncRespList[0].selfConsumptions.items.push(aux.selfConsumptions.items[j])
              }
            }
          }
        }
        count++
      } catch (e){
        console.log(e);
          if ((e as any).result && (e as any).result.codResult && (e as any).result.codResult == '1007') {
            if (!error) {
              error = true
              callback && callback('showModalError1007')
            }
            // LCS: Enviar evento a GA para errores - Wave 2
            sendGAEvent({
              event: 'application_error',
              info: {
                error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
                error: e,
                reactComponent: 'SuppliesDetailsThunkActions.ts - thunkGetCurrentSupplyConsumptions',
                apiUrl: 'get /consumptions?filter=user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups)+'|startDate::'+startDate+'|endDate::'+endDate+'|granularity::'+granularity+'|unit::K|generator::'+isGenerator+'|isDelegate::'+(isDelegate ? 'Y' : 'N')+'|isSelfConsumption::'+isSelfConsumption+'|measurementSystem::'+measurementSystem,
                codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
              }
            });
          } else if ((e as any).result && (e as any).result.codResult && (e as any).result.codResult == '1004') {
              dispatch(showError('autoconsumo.1004'))
              dispatch(setMessage(''))
              // LCS: Enviar evento a GA para errores - Wave 2
              sendGAEvent({
                event: 'application_error',
                info: {
                  error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
                  error: e,
                  reactComponent: 'SuppliesDetailsThunkActions.ts - thunkGetCurrentSupplyConsumptions',
                  apiUrl: 'get /consumptions?filter=user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups)+'|startDate::'+startDate+'|endDate::'+endDate+'|granularity::'+granularity+'|unit::K|generator::'+isGenerator+'|isDelegate::'+(isDelegate ? 'Y' : 'N')+'|isSelfConsumption::'+isSelfConsumption+'|measurementSystem::'+measurementSystem,
                  codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
                }
              });
          } else {
            // LCS: Enviar evento a GA para errores - Wave 2
            sendGAEvent({
              event: 'api_error',
              info: {
                error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
                error: e,
                reactComponent: 'SuppliesDetailsThunkActions.ts - thunkGetCurrentSupplyConsumptions',
                apiUrl: 'get /consumptions?filter=user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups)+'|startDate::'+startDate+'|endDate::'+endDate+'|granularity::'+granularity+'|unit::K|generator::'+isGenerator+'|isDelegate::'+(isDelegate ? 'Y' : 'N')+'|isSelfConsumption::'+isSelfConsumption+'|measurementSystem::'+measurementSystem,
                codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
              }
            });
          }
      }
    }


    if (asyncRespList && asyncRespList[0] && asyncRespList[0].SelfConsumptions && asyncRespList[0].SelfConsumption.items) {
      asyncRespList[0].selfConsumptions.items = dataArray
    }

    hasEnd = true;
  } catch (e){
    console.log(e);
    if ((e as any).result && (e as any).result.codResult) {
      if (hasEnd) {
        if ((e as any).result.codResult == '1007') {
          callback && callback('showModalError1007')
        } else if ((e as any).result.codResult == '1004') {
          dispatch(showError('autoconsumo.1004'))
          dispatch(setMessage(''))
        }
      } else {
        thunkGetCurrentSupplyConsumptions(setStore, nif, cups, granularity, startDate, endDate, setIsLoading, isGenerator, supplantedUser, isDelegate, setExportingData, isSelfConsumption, measurementSystem, callback, count++, asyncResp, asyncRespList, avg, counter)
      }
    }

  } finally {
    if (asyncRespList[0]) {
      if (asyncRespList[0].items) {
        asyncRespList[0].items[0].avgConsumption = avg / counter + ''
      }
      // solo aplica a gmv10
      if (measurementSystem === 'G' && asyncRespList[0].items[0].selfConsumptions) {
        asyncRespList[0].items[0].selfConsumptions.items = dataArray
      }

      if (granularity === 'S') {
        granularity = 'D'
      }



      asyncResp = asyncRespList;

      if (asyncResp?.[0]?.items?.length) {
        const totalConsumptionSum = asyncResp[0].items.reduce((sum: number, item: { totalConsumption: string }) => {
          const value = parseFloat(item?.totalConsumption?.replace(',', '.') || '0');
          return sum + (isNaN(value) ? 0 : value);
        }, 0);

        asyncResp[0].items[0].totalConsumption = totalConsumptionSum.toFixed(2).replace('.', ',');

        asyncResp[0].items.forEach((item, index) => {
          if (index !== 0) {
        asyncResp[0].items[0].periodEndDate = item.periodEndDate;
        if (item.consumptions?.items?.length) {
          asyncResp[0].items[0].consumptions.items.push(...item.consumptions.items);
        }
          }
        });
      }

      asyncResp.forEach((response) => {
        if (setStore) {
          if (isSelfConsumption === '1') {
        const selfConsumptions = measurementSystem === 'G'
          ? response.items?.[0]?.selfConsumptions?.items
          : response.selfConsumptions?.items;

        dispatch(setCurrentSupplyConsumptions(selfConsumptions || []));
          } else {
        const consumptions = response.items?.[0] || response.items;
        dispatch(setCurrentSupplyConsumptions(consumptions || []));
          }
        }
      });
    }

    setIsLoading && setIsLoading(false)

    setExportingData && setExportingData(false)

    console.log('ASYNCRESPONSE: ', asyncResp);
    for (let i = 0; i < asyncResp.length; i++) {
      if (isSelfConsumption && isSelfConsumption === '1') {
        if (asyncResp[i].items) {

          callback && callback(asyncResp[i].items[0].selfConsumptions.items ? asyncResp[i].items[0].selfConsumptions.items : [] as any)
        } else {
          callback && callback(asyncResp[i].selfConsumptions.items ? asyncResp[i].selfConsumptions.items : [] as any)
        }
      } else {
        callback && callback(asyncResp[i].items ? asyncResp[i].items : [] as any)
      }

    }
  }
}

export const thunkGetCurrentCompareConsumptions = (setStore: boolean, cups: string, granularity: string, startDate: string, endDate: string, setIsLoading: any, isGenerator: string, supplantedUser: boolean, isDelegate: boolean, setExportingData: any, isSelfConsumption: string, measurementSystem: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''
    const dni = getState().user.profile.documentNumber || ''

    if (granularity === 'S') {
      granularity = 'D'
    }

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const asyncResp = await suppliesService.doGetCurrentSupplyConsumptions(dni, cups, granularity, startDate, endDate, isGenerator, isDelegate, isSelfConsumption, measurementSystem, token)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /consumptions?filter=user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups)+'|startDate::'+startDate+'|endDate::'+endDate+'|granularity::'+granularity+'|unit::K|generator::'+isGenerator+'|isDelegate::'+(isDelegate ? 'Y' : 'N')+'|isSelfConsumption::'+isSelfConsumption+'|measurementSystem::'+measurementSystem,
        apiUrlShort: 'get /consumptions',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    delete asyncResp.result

    if (setStore) {
      if (isSelfConsumption && isSelfConsumption === '1') {
        dispatch(setCurrentCompareConsumptions(asyncResp.selfConsumptions.items ? asyncResp.selfConsumptions.items : [] as any))
      } else {
        dispatch(setCurrentCompareConsumptions(asyncResp.items[0] ? asyncResp.items[0] : [] as any))
      }
    }

    setIsLoading && setIsLoading(false)

    setExportingData && setExportingData(false)

    callback && callback(asyncResp.items ? asyncResp.items : [] as any)
  } catch (e){
    console.log('Error al obtener la lista de consumos:', e)
    const dni = getState().user.profile.documentNumber || ''

    // LCS: Enviar evento de error a GA - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'SuppliesDetailsThunkActions.ts - thunkGetCurrentCompareConsumptions',
        apiUrl: 'get /consumptions?filter=user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups)+'|startDate::'+startDate+'|endDate::'+endDate+'|granularity::'+granularity+'|unit::K|generator::'+isGenerator+'|isDelegate::'+(isDelegate ? 'Y' : 'N')+'|isSelfConsumption::'+isSelfConsumption+'|measurementSystem::'+measurementSystem,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    setIsLoading && setIsLoading(false)

    setExportingData && setExportingData(false)
  }
}

export const thunkGetMaxPotencyDemanded = (cups: string, startDate: string, endDate: string, setIsLoading: any, isGenerator: string, supplantedUser: boolean, isDelegate: boolean, measurementSystem: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''
    const dni = getState().user.profile.documentNumber || ''

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const asyncResp = await suppliesService.doGetMaxPotencyDemanded(dni, cups, startDate, endDate, isGenerator, isDelegate, measurementSystem, token)
    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para errores - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /maxPotencyDemanded?filter=user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups)+'|startDate::'+startDate+'|endDate::'+endDate+'|generator::'+isGenerator+'|isDelegate::'+(isDelegate ? 'Y' : 'N')+'|measurementSystem::'+measurementSystem,
        apiUrlShort: 'get /maxPotencyDemanded',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });
    
    setIsLoading && setIsLoading(false)

    callback && callback(asyncResp)
  } catch (e){
    console.log('Error al obtener la potencia máxima demandada:', e)
     const dni = getState().user.profile.documentNumber || ''
    if((e as any).result && (e as any).result.codResult !== '1008'){
      // LCS: Enviar evento a GA para errores - Wave 2
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la potencia máxima demandada'),
          error: e,
          reactComponent: 'SuppliesDetailsThunkActions.ts - thunkGetMaxPotencyDemanded',
          apiUrl: 'get /maxPotencyDemanded?filter=user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups)+'|startDate::'+startDate+'|endDate::'+endDate+'|generator::'+isGenerator+'|isDelegate::'+(isDelegate ? 'Y' : 'N')+'|measurementSystem::'+measurementSystem,
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    } else {
      // LCS: Enviar evento a GA para errores - Wave 2
      sendGAEvent({
        event: 'application_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la potencia máxima demandada'),
          error: e,
          reactComponent: 'SuppliesDetailsThunkActions.ts - thunkGetMaxPotencyDemanded',
          apiUrl: 'get /maxPotencyDemanded?filter=user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups)+'|startDate::'+startDate+'|endDate::'+endDate+'|generator::'+isGenerator+'|isDelegate::'+(isDelegate ? 'Y' : 'N')+'|measurementSystem::'+measurementSystem,
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    }

    callback && callback()

    setIsLoading && setIsLoading(false)
  }
}

export const thunkGetCurrentSupplyBillingPeriods = (cups: string, dateFrom: string, dateTo: string, setIsLoading: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const asyncResp = await suppliesService.doGetCurrentSupplyBillingPeriods(cups, dateFrom, dateTo, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /billingPeriods?filter=cups::'+hideCUPS(cups)+'|startDate::'+dateFrom+'|endDate::'+dateTo,
        apiUrlShort: 'get /billingPeriods',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    dispatch(setCurrentSupplyBillingPeriods(asyncResp.billingPeriods && asyncResp.billingPeriods.items))

    setIsLoading && setIsLoading(false)

    callback && callback(asyncResp)
  } catch (e){
    console.log('Error al obtener la lista de períodos de facturación:', e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'application_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la lista de períodos de facturación'),
        error: e,
        reactComponent: 'SuppliesDetailsThunkActions.ts - thunkGetCurrentSupplyBillingPeriods',
        apiUrl: 'get /billingPeriods?filter=cups::'+hideCUPS(cups)+'|startDate::'+dateFrom+'|endDate::'+dateTo,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    setIsLoading && setIsLoading(false)
  }
}

export const thunkUpdateSupply = (cups: string, dni: string, name: string, icon: string, token: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    await suppliesService.doUpdateSupply(cups, dni, name, icon, token)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'put /customData/'+hideCUPS(cups),
        apiUrlShort: 'put /customData',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback()
  } catch (e){
    console.log('Error al actualizar los datos del punto de suministro: ', e)
    // LCS: Enviar evento a GA para errores - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'SuppliesDetailsThunkActions.ts - thunkUpdateSupply',
        apiUrl: 'put /customData/'+hideCUPS(cups),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });
  }
}

export const thunkGetMeterReadings = (docNumber: string, cups: string, measurementSystem: string, meterId: string, readingTypeIds: string, timeout: number, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const asyncResp = await timeoutPromise(timeout, suppliesService.doGetMeterReadings(docNumber, cups, measurementSystem, meterId, readingTypeIds, token))

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /meterReadings?filter=user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups)+'|measurementSystem::'+measurementSystem+'|meterId::'+meterId+'|readingTypeIds::'+readingTypeIds+'|origin::I',
        apiUrlShort: 'get /meterReadings',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(asyncResp && asyncResp)
  } catch (e){
    callback && callback(e)

    // LCS: Enviar evento a GA para errores
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al solicitar los datos de lectura del contador'),
        error: e,
        reactComponent: 'SuppliesDetailsThunkActions.ts - thunkGetMeterReadings',
        apiUrl: 'get /meterReadings?filter=user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups)+'|measurementSystem::'+measurementSystem+'|meterId::'+meterId+'|readingTypeIds::'+readingTypeIds+'|origin::I',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    console.log('Error al solicitar los datos de lectura del contador: ', e)
  }
}

export const thunkGetMeterControl = (docNumber: string, cups: string, measurementSystem: string, meterId: string, readingTypeIds: string, timeout: number, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // const asyncResp = await timeoutPromise(timeout, suppliesService.doGetMeterControl(docNumber, cups, measurementSystem, meterId, readingTypeIds, token))

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    await suppliesService.doGetMeterControl(docNumber, cups, measurementSystem, meterId, readingTypeIds, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /meterControl?filter=user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups)+'|measurementSystem::'+measurementSystem+'|meterId::'+meterId+'|readingTypeIds::'+readingTypeIds,
        apiUrlShort: 'get /meterControl',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    //callback && callback(asyncResp && asyncResp)
  } catch (e){
    //callback && callback((e as any).result)

    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al reconectar el contador'),
        error: e,
        reactComponent: 'SuppliesDetailsThunkActions.ts - thunkGetMeterControl',
        apiUrl: 'get /meterControl?filter=user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups)+'|measurementSystem::'+measurementSystem+'|meterId::'+meterId+'|readingTypeIds::'+readingTypeIds,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    console.log('Error al reconectar el contador: ', e)
  }
}

export const thunkGetMasterData = (master: string, language: string, key: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const masterDataList = await suppliesService.doGetMasterData(master, language, key, userToken)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /masterData?filter=master::'+master+'|language::'+language+key,
        apiUrlShort: 'get /masterData',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(masterDataList.items)
  } catch (e){
    console.error('Error al obtener los datos maestros:', e)

    // LCS: Enviar evento de error a GA - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'SuppliesDetailsThunkActions.ts - thunkGetMasterData',
        apiUrl: 'get /masterData?filter=master::'+master+'|language::'+language+key,
        apiUrlShort: 'get /masterData',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetMasterDataOnlyMaster = (master: string, language: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const masterDataList = await suppliesService.doGetMasterDataOnlyMaster(master, language, userToken)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /masterData?filter=master::'+master+'|language::'+language,
        apiUrlShort: 'get /masterData',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(masterDataList.items)
  } catch (e){
    console.error('Error al obtener los datos maestros:', e)

    // LCS: Enviar evento de error a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener los datos maestros'),
        error: e,
        reactComponent: 'SuppliesDetailsThunkActions.ts - thunkGetMasterDataOnlyMaster',
        apiUrl: 'get /masterData?filter=master::'+master+'|language::'+language,
        apiUrlShort: 'get /masterData',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetWhitelistAccess = (type: string, value: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const whitelistAccess = await suppliesService.doGetWhitelistAccess(type, value, userToken)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /whitelistAccess/'+type+'/'+value,
        apiUrlShort: 'get /whitelistAccess/type/value',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(whitelistAccess)
  } catch (e){
    console.error('Error al obtener los datos maestros:', e)

    // LCS: Enviar evento de error a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'SuppliesDetailsThunkActions.ts - thunkGetWhitelistAccess',
        apiUrl: 'get /whitelistAccess/'+type+'/'+value,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetProgrammedQuery = (meterId: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await suppliesService.doGetProgrammedQuery(meterId, userToken)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /programmedQuery/'+meterId,
        apiUrlShort: 'get /programmedQuery/meterId',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al obtener la consulta programada:', e)

    // LCS: Enviar evento de error a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la consulta programada'),
        error: e,
        reactComponent: 'SuppliesDetailsThunkActions.ts - thunkGetProgrammedQuery',
        apiUrl: 'get /programmedQuery/'+meterId,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkDeleteProgrammedQuery = (meterId: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await suppliesService.doDeleteProgrammedQuery(meterId, userToken)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'delete /programmedQuery/'+meterId,
        apiUrlShort: 'delete /programmedQuery/meterId',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al eliminar la consulta programada:', e)

    // LCS: Enviar evento de error a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al eliminar la consulta programada'),
        error: e,
        reactComponent: 'SuppliesDetailsThunkActions.ts - thunkDeleteProgrammedQuery',
        apiUrl: 'delete /programmedQuery/'+meterId,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkCreateOrUpdateProgrammedQuery = (body: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await suppliesService.doCreateOrUpdateProgrammedQuery(body, userToken)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /programmedQuery',
        apiUrlShort: 'post /programmedQuery',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al crear/actualizar la consulta programada:', e)

    // LCS: Enviar evento de error a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al crear/actualizar la consulta programada'),
        error: e,
        reactComponent: 'SuppliesDetailsThunkActions.ts - thunkCreateOrUpdateProgrammedQuery',
        apiUrl: 'post /programmedQuery',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkListProgrammedReads = (
  meterId: string,
  offset: any, // primer elemento que se listará
  limit: any, // total de elementos a partir del offset
  callback: any
): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = getState().user.token

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await suppliesService.listProgrammedReads(meterId, offset, limit, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /programmedReads?filter=meterId::'+meterId+((offset || offset === 0) ? '|origin~~I,S&offset='+offset : '')+((limit) ? '&limit='+limit : '')+'&sort=-id',
        apiUrlShort: 'get /programmedReads',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response.reads)
  } catch (e){
    console.log('Error al obtener la lista de lecturas programadas:', e)

    // LCS: Enviar evento de error a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la lista de lecturas programadas'),
        error: e,
        reactComponent: 'SuppliesDetailsThunkActions.ts - thunkListProgrammedReads',
        apiUrl: 'get /programmedReads?filter=meterId::'+meterId+((offset || offset === 0) ? '|origin~~I,S&offset='+offset : '')+((limit) ? '&limit='+limit : '')+'&sort=-id',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkCreateProgrammedReads = (body: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = getState().user.token

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await suppliesService.createProgrammedReads(body, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /programmedReads',
        apiUrlShort: 'post /programmedReads',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al crear/actualizar la lectura programada:', e)

    // LCS: Enviar evento de error a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al crear/actualizar la lectura programada'),
        error: e,
        reactComponent: 'SuppliesDetailsThunkActions.ts - thunkCreateProgrammedReads',
        apiUrl: 'post /programmedReads',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetBillingPeriods = (cups: string, startDate: string, endDate: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await suppliesService.doGetCurrentSupplyBillingPeriods(cups, startDate, endDate, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /billingPeriods?filter=cups::'+hideCUPS(cups)+'|startDate::'+startDate+'|endDate::'+endDate,
        apiUrlShort: 'get /billingPeriods',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response.billingPeriods || { count: 0, items: [] } as any)
  } catch (e){
    console.log('Error al obtener la lista de períodos de facturación:', e)

    // LCS: Enviar evento de error a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener la lista de períodos de facturación'),
        error: e,
        reactComponent: 'SuppliesDetailsThunkActions.ts - thunkGetBillingPeriods',
        apiUrl: 'get /billingPeriods?filter=cups::'+hideCUPS(cups)+'|startDate::'+startDate+'|endDate::'+endDate,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetConsumptions = (cups: string, granularity: string, startDate: string, endDate: string, isGenerator: string, supplantedUser: boolean, isDelegate: boolean, isSelfConsumption: string, measurementSystem: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''
    let dni = getState().user.profile.documentNumber

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const response = await suppliesService.doGetCurrentSupplyConsumptions(dni, cups, granularity, startDate, endDate, isGenerator, isDelegate, isSelfConsumption, measurementSystem, token)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /consumptions?filter=user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups)+'|startDate::'+startDate+'|endDate::'+endDate+'|granularity::'+granularity+'|unit::K|generator::'+isGenerator+'|isDelegate::'+(isDelegate ? 'Y' : 'N')+'|isSelfConsumption::'+isSelfConsumption+'|measurementSystem::'+measurementSystem,
        apiUrlShort: 'get /consumptions',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response.items || (response.selfConsumptions && [response]) || [])
  } catch (e){
    console.log('Error al obtener la lista de consumos:', e)
    let dni = getState().user.profile.documentNumber

    // LCS: Enviar evento de error a GA - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: 'Error al llamar al servicio',
        error: e,
        reactComponent: 'SuppliesDetailsThunkActions.ts - thunkGetConsumptions',
        apiUrl: 'get /consumptions?filter=user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups)+'|startDate::'+startDate+'|endDate::'+endDate+'|granularity::'+granularity+'|unit::K|generator::'+isGenerator+'|isDelegate::'+(isDelegate ? 'Y' : 'N')+'|isSelfConsumption::'+isSelfConsumption+'|measurementSystem::'+measurementSystem,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetBillsList = (cups: string, startDate: string, endDate: string, isMigrated: boolean, isDelegate: boolean, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''
    let dni = getState().user.profile.documentNumber

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await suppliesService.doGetCurrentBillsList(dni, cups, startDate, endDate, isMigrated, isDelegate, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /listBills?filter=user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups)+'|startDate::'+startDate+'|endDate::'+endDate+'|isMigrated::'+(isMigrated ? '1' : '0')+'|isDelegate::'+(isDelegate ? 'Y' : 'N'),
        apiUrlShort: 'get /listBills',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response || [])

  } catch (e){
    console.log('Error al obtener el listado de facturas:', e)

    let dni = getState().user.profile.documentNumber

    // LCS: Enviar evento de error a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: 'Error al obtener el listado de facturas',
        error: e,
        reactComponent: 'SuppliesDetailsThunkActions.ts - thunkGetBillsList',
        apiUrl: 'get /listBills?filter=user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups)+'|startDate::'+startDate+'|endDate::'+endDate+'|isMigrated::'+(isMigrated ? '1' : '0')+'|isDelegate::'+(isDelegate ? 'Y' : 'N'),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkCreateWarning = (body: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = getState().user.token

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await suppliesService.doCreateWarning(body, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /warnings',
        apiUrlShort: 'post /warnings',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al crear el aviso de tormenta:', e)

    // LCS: Enviar evento de error a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: 'Error al crear el aviso de tormenta',
        error: e,
        reactComponent: 'SuppliesDetailsThunkActions.ts - thunkCreateWarning',
        apiUrl: 'post /warnings',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}
//1008054 listInterruptionsPerSupplies 


export const thunkGetListIncidence = (cups: string, dateFrom: Date, dateTo: Date, callback: any): ThunkAction<void, AppState, null, Action> => async () => {
  try {
    const token = sessionStorage.getItem('token') || '';

    var flag = false;

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime1 = performance.now();

    const response = await suppliesService.doGetListIncidence(cups, dateFrom, dateTo, token);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime1 = performance.now();
    const responseTime1 = endTime1 - startTime1;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /listPowerSupplyFacilities?filter=cups::'+hideCUPS(cups)+'|fromDate::'+dateFrom+'|toDate::'+dateTo,
        apiUrlShort: 'get /listPowerSupplyFacilities',
        responseTime: responseTime1, // Tiempo de respuesta en milisegundos
      }
    });

    flag = true;

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime2 = performance.now();

    const masterData = await suppliesService.doGetMasterData('SISTEMA_AVERIAS', 'ES', 'AVERIAS_INTERFACES', token)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime2 = performance.now();
    const responseTime2 = endTime2 - startTime2;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /masterData?filter=master::'+'SISTEMA_AVERIAS'+'|language::'+'ES'+'AVERIAS_INTERFACES',
        apiUrlShort: 'get /masterData',
        responseTime: responseTime2, // Tiempo de respuesta en milisegundos
      }
    });

    const regex = /^(\d{4})-(\d{2})-(\d{2})_(\d{2}):(\d{2}):(\d{2})$/;
    if(masterData && masterData.items && masterData.items.length > 0 && masterData.items[0].value =='ADMS'){
        for(let i = 0; i < response.incidenceList.length; i++) {
          response.incidenceList[i].fechaInicio = AveriasUtils.FormatDateAveriasIncidenceList(response.incidenceList[i].fechaInicio);
          response.incidenceList[i].fechaFin = AveriasUtils.FormatDateAveriasIncidenceList(response.incidenceList[i].fechaFin);
        }
      }
      callback && callback(response);
   
  } catch (e){
    console.error('Error al obtener lista de incidencias:', e)

    // LCS: Gestión de eventos - Wave 2
    if (flag == false) {
      // LCS: Enviar evento de error a GA - Wave 2
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: 'Error al llamar al servicio',
          error: e,
          reactComponent: 'SuppliesDetailsThunkActions.ts - thunkGetListIncidence',
          apiUrl: 'get /listPowerSupplyFacilities?filter=cups::'+hideCUPS(cups)+'|fromDate::'+dateFrom+'|toDate::'+dateTo,
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    } else {
      // LCS: Enviar evento de error a GA - Wave 2
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: 'Error al llamar al servicio',
          error: e,
          reactComponent: 'SuppliesDetailsThunkActions.ts - thunkGetListIncidence',
          apiUrl: 'get /masterData?filter=master::'+'SISTEMA_AVERIAS'+'|language::'+'ES'+'AVERIAS_INTERFACES',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    }

    callback && callback()
  }
} 

export const thunkGetListInterruptions = (body: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || '';

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const response = await suppliesService.doGetListInterruptions(body, token);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /listInterruptionsPerSupplies',
        apiUrlShort: 'post /listInterruptionsPerSupplies',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response);
  } catch (e){
    console.error('Error al obtener lista de interrupciones:', e)

    // LCS: Enviar evento de error a GA - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: 'Error al llamar al servicio',
        error: e,
        reactComponent: 'SuppliesDetailsThunkActions.ts - thunkGetListInterruptions',
        apiUrl: 'post /listInterruptionsPerSupplies',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}
//1008054 getIncidence  
export const thunkGetWarningsIncidence = (code: any, type: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || '';

    const response = await suppliesService.doGetWarningsIncidence(code, type, token);

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const masterData = await suppliesService.doGetMasterData('SISTEMA_AVERIAS', 'ES', 'AVERIAS_INTERFACES', token)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /masterData?filter=master::'+'SISTEMA_AVERIAS'+'|language::'+'ES'+'AVERIAS_INTERFACES',
        apiUrlShort: 'get /masterData',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    const regex = /^(\d{4})-(\d{2})-(\d{2})_(\d{2}):(\d{2}):(\d{2})$/;

    if(masterData && masterData.items && masterData.items.length > 0 && masterData.items[0].value =='ADMS'){
      if(!regex.test(response.incidence.incidenceStartDate)){
        response.incidence.incidenceStartDate = AveriasUtils.FormatDateAveriasPantalla(response.incidence.incidenceStartDate); 
      }
    }
        callback && callback(response);


  } catch (e){
    console.error('Error al obtener lista de incidencias:', e)

    // LCS: Enviar evento de error a GA - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: 'Error al llamar al servicio',
        error: e,
        reactComponent: 'SuppliesDetailsThunkActions.ts - thunkGetWarningsIncidence',
        apiUrl: 'get /masterData?filter=master::'+'SISTEMA_AVERIAS'+'|language::'+'ES'+'AVERIAS_INTERFACES',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetListWarnings = (warningCode: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || '';

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await suppliesService.doGetListWarnings(warningCode, token);

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /warnings?filter=codIncidence::'+warningCode,
        apiUrlShort: 'get /warnings',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    console.log('response 2',response)

    callback && callback(response);
  } catch (e){
    console.error('Error al obtener lista de incidencias:', e)

    // LCS: Enviar evento de error a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: 'Error al obtener lista de incidencias',
        error: e,
        reactComponent: 'SuppliesDetailsThunkActions.ts - thunkGetListWarnings',
        apiUrl: 'get /warnings?filter=codIncidence::'+warningCode,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}
export const thunkCreateNewRequest = (data: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial
    const startTime = performance.now();

    const response = await suppliesService.createNewRequest(data, token)

    // LCS: Registrar el tiempo final y calcular la duración
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo
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

    // LCS: Enviar evento de error a GA
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: 'Error al crear la nueva petición de servicio',
        error: e,
        reactComponent: 'SuppliesDetailsThunkActions.ts - thunkCreateNewRequest',
        apiUrl: 'post /serviceRequests',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}