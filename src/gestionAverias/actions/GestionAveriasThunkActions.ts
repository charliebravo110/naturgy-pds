import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from '../../common/store/reducers/MainReducer'

import GestionAveriasService from '../services/GestionAveriasService'

import RequestsService from '../../requests/RequestsService'
import AveriasUtils from '../utils/AveriasUtilsClass'

// LCS: Importa la función - Wave 2
import { hideCUPS, sendGAEvent } from '../../core/utils/gtm';


const gestionAveriasService = new GestionAveriasService()
const requestsService = new RequestsService()

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

export const thunkGetListSupplies = (nif: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || '';
    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const response = await gestionAveriasService.listSupplies(nif, token);

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

    callback && callback(response);
  } catch (e){
    console.error('Error al obtener lista de suministros: ', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'GestionAveriasThunkActions.ts - thunkGetListSupplies',
        apiUrl: 'get /supplypoints?filter=user_id::'+sessionStorage.getItem('id'),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}


export const thunkGetServiceRequest = (nif: string, cups: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || '';

    const filter = `documentNumber::${nif}|cups::${cups}|status::1`
    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const requestsResponse = await requestsService.getRequestsList(filter, token);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /serviceRequests?filter='+'user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups)+'|status::1',
        apiUrlShort: 'get /serviceRequests',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(requestsResponse);
  } catch (e){
    console.error('Error al obtener las SRs: ', e)

    const filter = `documentNumber::${nif}|cups::${cups}|status::1`
    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'GestionAveriasThunkActions.ts - thunkGetListSupplies',
        apiUrl: 'get /serviceRequests?filter='+'user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups)+'|status::1',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetSupplyCups = (nif: string, cups: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || '';
    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const response = await gestionAveriasService.getSupplyCups(nif, token, cups);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /supplypoints?filter=user_id::'+sessionStorage.getItem('id')+(cups ? '|cups::'+hideCUPS(cups) : ''),
        apiUrlShort: 'get /supplypoints',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response);
  } catch (e){
    console.error('Error al obtener el Punto de Suministro: ', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'GestionAveriasThunkActions.ts - thunkGetSupplyCups',
        apiUrl: 'get /supplypoints?filter=user_id::'+sessionStorage.getItem('id')+(cups ? '|cups::'+hideCUPS(cups) : ''),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetListZipCodes = (zipCode: string, municipalityCode: string, provinceCode: string, callback: any): ThunkAction<void, AppState, null, Action> => async () => {
  try {
    const token = sessionStorage.getItem('token') || '';

    var apiUrlTemporal = '';

    if (municipalityCode !== '' && provinceCode !== '') {
      apiUrlTemporal = 'get /callejero/v2/zipcodes?filter=provinceCode::'+provinceCode+'|municipalityCode::'+municipalityCode;
    } else if (zipCode !== '') {
      apiUrlTemporal = 'get /callejero/v2/zipcodes?filter=zipCode::'+zipCode;
    } else if (municipalityCode !== '') {
      apiUrlTemporal = 'get /callejero/v2/zipcodes?filter=municipalityCode::'+municipalityCode;
    } else if (provinceCode !== '') {
      apiUrlTemporal = 'get /callejero/v2/zipcodes?filter=provinceCode::'+provinceCode;
    }

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const response = await gestionAveriasService.listZipCodes(zipCode, municipalityCode, provinceCode, token);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: apiUrlTemporal,
        apiUrlShort: 'get /callejero/v2/zipcodes',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response);
  } catch (e){
    console.error('Error al obtener lista de códigos postales:', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'GestionAveriasThunkActions.ts - thunkGetListZipCodes',
        apiUrl: apiUrlTemporal,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetListStreets = (street: string, provinceCode: string, municipalityCode: string, typeStreet: string, geographicEntityName: string, singularEntityName: string, groupEntityName: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || '';

    var apiUrlTemporal='get /callejero/v2/streets?filter=nameStreet::'+street;

    if (provinceCode !== '') {
      apiUrlTemporal = apiUrlTemporal + '|provinceCode::'+provinceCode;
    }
    if (municipalityCode !== '') {
      apiUrlTemporal = apiUrlTemporal + '|municipalityCode::'+municipalityCode;
    }
    if (typeStreet !== '') {
      apiUrlTemporal = apiUrlTemporal + '|typeStreet::'+typeStreet;
    }
    if (geographicEntityName !== '') {
      apiUrlTemporal = apiUrlTemporal + '|geographicEntityName::'+geographicEntityName;
    }
    if (singularEntityName !== '') {
      apiUrlTemporal = apiUrlTemporal + '|singularEntityName::'+singularEntityName;
    }
    if (singularEntityName !== '') {
      apiUrlTemporal = apiUrlTemporal + '|groupEntityName::'+groupEntityName;
    }

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const response = await gestionAveriasService.listStreets(street, provinceCode, municipalityCode, typeStreet, geographicEntityName, singularEntityName, groupEntityName, token);
    
    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: apiUrlTemporal,
        apiUrlShort: 'get /callejero/v2/streets',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response);
  } catch (e){
    console.error('Error al obtener lista de calles:', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'GestionAveriasThunkActions.ts - thunkGetListStreets',
        apiUrl: apiUrlTemporal,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetListAddresses = (addId: string, addNumber: string, door: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || '';

    var apiUrlTemporal='';

    if (addNumber !== '') {
      apiUrlTemporal = 'get /callejero/v2/addresses?filter=addId::'+addId+'|addNumber::'+addNumber;
    } else if (door !== '') {
      apiUrlTemporal = 'get /callejero/v2/addresses?filter=addId::'+addId+'|door::'+door;
    } else {
      apiUrlTemporal = 'get /callejero/v2/addresses?filter=addId::'+addId;
    }

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const response = await gestionAveriasService.listAddresses(addId, addNumber, door, token);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: apiUrlTemporal,
        apiUrlShort: 'get /callejero/v2/addresses',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response);
  } catch (e){
    console.error('Error al obtener lista de direcciones:', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'GestionAveriasThunkActions.ts - thunkGetListAddresses',
        apiUrl: apiUrlTemporal,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });


    callback && callback()
  }
}

export const thunkGetListProvinces = (province: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || '';

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const response = await gestionAveriasService.listProvinces(province, token);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /callejero/v2/provinces?filter=provinceName::'+province,
        apiUrlShort: 'get /callejero/v2/provinces',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response);
  } catch (e){
    console.error('Error al obtener lista de provincias:', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'GestionAveriasThunkActions.ts - thunkGetListProvinces',
        apiUrl: 'get /callejero/v2/provinces?filter=provinceName::'+province,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetListMunicipalities = (municipalityName: string, municipalityCode: string, provinceCode: string, zipCode: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || '';

    var apiUrlTemporal = '';

    if (municipalityName !== '' && municipalityCode !== '') {
      apiUrlTemporal = 'get /callejero/v2/municipalities?filter=municipalityCode::'+municipalityCode+'|municipalityName::'+municipalityName;
    } else if (municipalityName !== '' && provinceCode != '') {
      apiUrlTemporal = 'get /callejero/v2/municipalities?filter=municipalityName::'+municipalityName+'|provinceCode::'+provinceCode;
    } else if (municipalityName !== '') {
      apiUrlTemporal = 'get /callejero/v2/municipalities?filter=municipalityName::'+municipalityName;
    } else if (provinceCode !== '') {
      apiUrlTemporal = 'get /callejero/v2/municipalities?filter=provinceCode::'+provinceCode;
    } else if (zipCode !== '') {
      apiUrlTemporal = 'get /callejero/v2/municipalities?filter=zipCode::'+zipCode;
    }

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const response = await gestionAveriasService.listMunicipalities(municipalityName, municipalityCode, provinceCode, zipCode, token);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: apiUrlTemporal,
        apiUrlShort: 'get /callejero/v2/municipalities',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response);
  } catch (e){
    console.error('Error al obtener lista de municipios:', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'GestionAveriasThunkActions.ts - thunkGetListMunicipalities',
        apiUrl: apiUrlTemporal,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });


    callback && callback()
  }
}

export const thunkGetListStreetType = (type: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || '';

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const response = await gestionAveriasService.listStreetType(type, token);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /callejero/v2/streettypes?filter=descStreetType::'+type,
        apiUrlShort: 'get /callejero/v2/streettypes',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response);
  } catch (e){
    console.error('Error al obtener lista de tipos de calles:', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'GestionAveriasThunkActions.ts - thunkGetListStreetType',
        apiUrl: 'get /callejero/v2/streettypes?filter=descStreetType::'+type,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetListCustomers = (docNumber: string, customerName: string, surname1: string, surname2: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || '';

    var apiUrlTemporal = '';

    if (docNumber !== '') {
      apiUrlTemporal = 'get /customers?filter=user_id::'+sessionStorage.getItem('id');
    } else if (customerName !== '' && surname1 !== '' && surname2 !== '') {
      apiUrlTemporal = 'get /customers?filter=customerName::'+customerName+'|surName1::'+surname1+'|surName2::'+surname2;
    } else if (customerName !== '' && surname1 !== '') {
      apiUrlTemporal = 'get /customers?filter=customerName::'+customerName+'|surName1::'+surname1;
    } else if (customerName !== '' && surname2 !== '') {
      apiUrlTemporal = 'get /customers?filter=customerName::'+customerName+'|surName1::'+surname2;
    } else if (customerName !== '') {
      apiUrlTemporal = 'get /customers?filter=customerName::'+customerName;
    } else if (surname1 !== '' && surname2 !== '') {
      apiUrlTemporal = 'get /customers?filter=surName1::'+surname1+'|surName2::'+surname2;
    } else if (surname1 !== '') {
      apiUrlTemporal = 'get /customers?filter=surName1::'+surname1;
    } else if (surname2 !== '') {
      apiUrlTemporal = 'get /customers?filter=surName1::'+surname2;
    }

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const response = await gestionAveriasService.listCustomers(docNumber, customerName, surname1, surname2, token);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: apiUrlTemporal,
        apiUrlShort: 'get /customers',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response);
  } catch (e){
    console.error('Error al obtener lista de incidencias:', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'GestionAveriasThunkActions.ts - thunkGetListCustomers',
        apiUrl: apiUrlTemporal,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback(e)
  }
}
//1008054 listWarnings
export const thunkGetListWarnings = (body: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {

    var flag = false

    const userToken = sessionStorage.getItem('token') || ''
    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const masterData = await gestionAveriasService.doGetMasterData('SISTEMA_AVERIAS', 'ES', 'AVERIAS_INTERFACES', userToken)

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

      delete body.cgv;
      console.log('body.cups',body.cups)
      if(body && body.cups==''){
        delete body.cups;
      }
      
      const fechaFin = body && body.endDate ? `${body.endDate?.substring(0, 10)}_${body.endDate.substring(11, 19)}` : '';
      const fechaInio = body && body.startDate ? `${body.startDate?.substring(0, 10)}_${body.startDate.substring(11, 19)}` : '';
      body.endDate = fechaFin;
      body.startDate = fechaInio;
  
    }

    flag = true

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime2 = performance.now();

    const response = await gestionAveriasService.listWarnings(body, userToken)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime2 = performance.now();
    const responseTime2 = endTime2 - startTime2;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'post /listwarnings',
        apiUrlShort: 'post /listwarnings',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

   if(masterData &&  masterData.items[0].value =='ADMS'){

      for(let i = 0; i < response.warning.length; i++) {

          if(!regex.test(response.warning[i].fecha)){
            const fecha = response && response.warning && response.warning[i]?.fecha ? `${response.warning[i]?.fecha.substring(6, 10)}-${response.warning[i].fecha.substring(3, 5)}-${response.warning[i].fecha.substring(0, 2)}_${response.warning[i].fecha.substring(11, 13)}:${response.warning[i].fecha.substring(14, 16)}:${response.warning[i].fecha.substring(17, 19)}` : '';
            response.warning[i].fecha = fecha;
          }
        }
    }

    callback && callback(response)
  } catch (e){
    console.error('Error al obtener lista de warnings:', e)

    if (flag == false) {
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
          error: e,
          reactComponent: 'GestionAveriasThunkActions.ts - thunkGetListWarnings',
          apiUrl: 'get /masterData?filter=master::'+'SISTEMA_AVERIAS'+'|language::'+'ES'+'AVERIAS_INTERFACES',
          apiUrlShort: 'get /masterData',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    } else {
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
          error: e,
          reactComponent: 'GestionAveriasThunkActions.ts - thunkGetListWarnings',
          apiUrl: 'post /listWarnings',
          apiUrlShort: 'post /listWarnings',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    }

    callback && callback(e)
  }
}

//1008054 getWarning 
export const thunkGetListWarnings2 = (warningCode: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || '';

    const response = await gestionAveriasService.doGetListWarnings(warningCode, token);
    
    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const masterData = await gestionAveriasService.doGetMasterData('SISTEMA_AVERIAS', 'ES', 'AVERIAS_INTERFACES', token)

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
    
    if(masterData && masterData.items && masterData.items.length > 0 &&  masterData.items[0].value =='ADMS' && !regex.test(response.warning.fecha)){
        const fecha = response && response.warning && response.warning.fecha ? `${response.warning.fecha.substring(6, 10)}-${response.warning.fecha.substring(3, 5)}-${response.warning.fecha.substring(0, 2)}_${response.warning.fecha.substring(11, 13)}:${response.warning.fecha.substring(14, 16)}:${response.warning.fecha.substring(17, 19)}` : '';
        response.warning.fecha = AveriasUtils.FormatDateAveriasPantalla(fecha);
        console.log('getWarning',fecha)    
    }
        callback && callback(response);

  } catch (e){
    console.error('Error al obtener lista de incidencias:', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'GestionAveriasThunkActions.ts - thunkGetListWarnings2',
        apiUrl: 'get /masterData?filter=master::'+'SISTEMA_AVERIAS'+'|language::'+'ES'+'AVERIAS_INTERFACES',
        apiUrlShort: 'get /masterData',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

//obtiene motivo corte del contador en SGC

export const thunkGetEnergyCutOff = (cups: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || '';

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();  

    const response = await gestionAveriasService.doGetEnergyCutOff(cups, token);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /energyCutOff?filter=cups::'+hideCUPS(cups),
        apiUrlShort: 'get /energyCutOff',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.error('Error al obtener lista de incidencias:', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'GestionAveriasThunkActions.ts - thunkGetEnergyCutOff',
        apiUrl: 'get /energyCutOff?filter=cups::'+hideCUPS(cups),
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

//rearma el contador

export const thunkGetRearmarContador = (docNumber: string, cups: string, measurementSystem: string, meterId: string, readingTypeIds: string, timeout: number, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();  

    const response = await gestionAveriasService.doGetRearmarContador(docNumber, cups, measurementSystem, meterId, readingTypeIds, token)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /meterControl?filter=user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups)+'|measurementSystem::'+measurementSystem+'|meterId::'+meterId+'|readingTypeIds::'+readingTypeIds,
        apiUrlShort: 'get /meterControl',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(response)
  } catch (e){
    console.log('Error al solicitar los datos de lectura del contador: ', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'GestionAveriasThunkActions.ts - thunkGetRearmarContador',
        apiUrl: 'get /meterControl?filter=user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups)+'|measurementSystem::'+measurementSystem+'|meterId::'+meterId+'|readingTypeIds::'+readingTypeIds,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback(e)
  }
}


//obtiene la lectura del contador

export const thunkGetMeterReadings = (docNumber: string, cups: string, measurementSystem: string, meterId: string, readingTypeIds: string, timeout: number, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const token = sessionStorage.getItem('token') || '';

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const response = await gestionAveriasService.doGetMeterReadings(docNumber, cups, measurementSystem, meterId, readingTypeIds, token);

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /meterReadings?filter=user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups)+'|measurementSystem::'+measurementSystem+'|meterId::'+meterId+'|readingTypeIds::'+readingTypeIds+'|origin::I',
        apiUrlShort: 'get /meterReadings',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });
    
    callback && callback(response)
  } catch (e){
    console.log('Error al solicitar los datos de lectura del contador: ', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'GestionAveriasThunkActions.ts - thunkGetMeterReadings',
        apiUrl: 'get /meterReadings?filter=user_id::'+sessionStorage.getItem('id')+'|cups::'+hideCUPS(cups)+'|measurementSystem::'+measurementSystem+'|meterId::'+meterId+'|readingTypeIds::'+readingTypeIds+'|origin::I',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback(e)
  }
}

//obtiene la info del master data

export const thunkGetMasterData = (master: string, language: string, key: any, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''
    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const masterDataList = await gestionAveriasService.doGetMasterData(master, language, key, userToken)

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

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'GestionAveriasThunkActions.ts - thunkGetMasterData',
        apiUrl: 'get /masterData?filter=master::'+master+'|language::'+language+key,
        apiUrlShort: 'get /masterData',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkListGroupEntity = (provinceCode: string, municipalityCode: string, colectiveEntity: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const groupEntityList = await gestionAveriasService.listGroupEntity(provinceCode, municipalityCode, userToken, colectiveEntity)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /callejero/v2/collectiveEntity?filter=provinceCode::'+provinceCode+'|municipalityCode::'+municipalityCode+colectiveEntity,
        apiUrlShort: 'get /callejero/v2/collectiveEntity',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(groupEntityList)
  } catch (e){
    console.error('Error al obtener los datos maestros:', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'GestionAveriasThunkActions.ts - thunkListGroupEntity',
        apiUrl: 'get /callejero/v2/collectiveEntity?filter=provinceCode::'+provinceCode+'|municipalityCode::'+municipalityCode+colectiveEntity,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkListIndividualEntity = (provinceCode: string, townCode, singularEntity: string, groupEntity: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const individualEntityList = await gestionAveriasService.listIndividualEntity(provinceCode, townCode, userToken, singularEntity, groupEntity)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /callejero/v2/singularEntity?filter=provinceCode::'+provinceCode+'|municipalityCode::'+townCode+singularEntity+groupEntity,
        apiUrlShort: 'get /callejero/v2/singularEntity',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(individualEntityList)
  } catch (e){
    console.error('Error al obtener los datos maestros:', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'GestionAveriasThunkActions.ts - thunkListIndividualEntity',
        apiUrl: 'get /callejero/v2/singularEntity?filter=provinceCode::'+provinceCode+'|municipalityCode::'+townCode+singularEntity+groupEntity,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

export const thunkGetStreetTypeByStreetNameAndZipcode = (streetName: string, zipCode: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    const userToken = sessionStorage.getItem('token') || ''

    // LCS: Registrar el tiempo inicial - Wave 2
    const startTime = performance.now();

    const streetType = await gestionAveriasService.getStreetTypeByStreetNameAndZipcode(streetName, zipCode, userToken)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para medir el tiempo - Wave 2
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /callejero/v2/streets?filter=nameStreet::'+streetName+'|zipCode::'+zipCode,
        apiUrlShort: 'get /callejero/v2/singularEntity',
        responseTime: responseTime, // Tiempo de respuesta en milisegundos
      }
    });

    callback && callback(streetType)
  } catch (e){
    console.error('Error al obtener los datos maestros:', e)

    // LCS: Enviar evento de error a GA  - Wave 2
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
        error: e,
        reactComponent: 'GestionAveriasThunkActions.ts - thunkGetStreetTypeByStreetNameAndZipcode',
        apiUrl: 'get /callejero/v2/streets?filter=nameStreet::'+streetName+'|zipCode::'+zipCode,
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    callback && callback()
  }
}

