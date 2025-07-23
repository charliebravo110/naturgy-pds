import { store } from '../App'
import { fetch } from 'whatwg-fetch'

import { generateRandomString } from './lib/FormatLib'
import {
  hideError,
  showError,
  setMessage
} from './store/actions/ErrorActions'

import { setCurrentSupplyProgrammedReadsXMessageId } from '../supplies/store/actions/SuppliesActions'

import RequestParams from './interfaces/RequestParams'
import { isAndroid, isIos, isMobileApp } from '../mobile-apps/common/detectPlatform'
import { FEAT_FLAG_PLATFORM_DEPENDENT_HEADERS } from '../mobile-apps/common/configAndConstants'

//const BASE_URL = `https://apiufddes.intranet.gasnatural.com/ufd/v1.0`
const BASE_URL = process.env.REACT_APP_API_ENDPOINT
const COMMON_HEADERS = {
  'X-Appclientid': process.env['REACT_APP_H1'],
  'X-AppClient': FEAT_FLAG_PLATFORM_DEPENDENT_HEADERS
    ? isAndroid()
      ? 'ACUFDMA'
      : isIos()
      ? 'ACUFDMI'
      : 'ACUFDW'
    : 'ACUFDW',
  'X-Application': 'ACUFD',
  'X-Appversion': '1.0.0.0',
  'X-AppClientSecret': process.env['REACT_APP_H2'],
  'Content-Type': 'application/json',
  'Content-Encoding': 'gzip',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
}

class RestService {
  protected get(endpoint: string, headers = {}) {
    return this.doRequest(endpoint, { method: 'GET', headers })
  }

  protected post(endpoint: string, { headers = {}, body = {} }) {
    return this.doRequest(endpoint, { method: 'POST', headers, body: JSON.stringify(body) })
  }

  protected patch(endpoint: string, { headers = {}, body = {} }) {
    return this.doRequest(endpoint, { method: 'PATCH', headers, body: JSON.stringify(body) })
  }

  protected put(endpoint: string, { headers = {}, body = {} }) {
    return this.doRequest(endpoint, { method: 'PUT', headers, body: JSON.stringify(body) })
  }

  protected delete(endpoint: string, headers = {}) {
    return this.doRequest(endpoint, { method: 'DELETE', headers })
  }

  protected deleteWithBody(endpoint: string, { headers = {}, body = {} } ) {
    return this.doRequest(endpoint, { method: 'DELETE', headers, body: JSON.stringify(body) })
  }

  protected options(endpoint: string, headers = {}) {
    return this.doRequest(endpoint, { method: 'OPTIONS', headers })
  }

  protected doRequest(endpoint: string, requestParams: RequestParams) {
    // INICIO X-MESSAGEID >>>
    const USERID = sessionStorage.getItem('id') || '0'
    const RAND = sessionStorage.getItem('rand') || generateRandomString(15)
    sessionStorage.setItem('rand', RAND)
    let SEQUENTIAL = sessionStorage.getItem('sequential')

    if (SEQUENTIAL) {
      sessionStorage.setItem('sequential', (Number(SEQUENTIAL) + 1).toString())

      SEQUENTIAL = (Number(SEQUENTIAL) + 1).toString()
    } else {
      sessionStorage.setItem('sequential', '0')

      SEQUENTIAL = '0'
    }

    const xMessageId = USERID + '/' + RAND + '/' + SEQUENTIAL

    let xMessageIdRdx = store.getState().supplies.currentSupplyProgrammedReads.xMessageId
    let xMessageIdAux = ''

    if (endpoint === '/programmedReads' && (xMessageIdRdx === '' || typeof xMessageIdRdx == 'undefined')) {
      store.dispatch(setCurrentSupplyProgrammedReadsXMessageId(xMessageId))
    }

    if (endpoint.startsWith('/meterReadings')) {
      xMessageIdAux = xMessageIdRdx === '' ? xMessageId : xMessageIdRdx
    }

    // <<< FIN X-MESSAGEID

    const requestOptions = {
      ...requestParams,
      ...{
        headers: {
          ...COMMON_HEADERS,
          ...requestParams.headers,
          'X-MessageId': xMessageIdAux === '' ? xMessageId : xMessageIdAux
        }
      }
    }
    
    let requestURL = encodeURI(`${BASE_URL}${endpoint}`)
    if(requestURL !== '' && requestURL.includes('/customer')){
      requestURL = requestURL.replace('&', '%26');
    }

    store.dispatch(hideError())

    return fetch(requestURL, requestOptions).then(async(response) => {
      //const responseJson = await response.json()
      let responseJson = await response.json()
     
      const thisService = this.getService(endpoint, requestParams.method)
      
      // Capar los mensajes de error de meterControl
      if (thisService !== 'meterControl') {
        if (thisService === 'meterReadings' && responseJson.result && responseJson.result.codResult && responseJson.result.codResult.toString() !== '0000') {
          // Control de errores genericos de meterReadings
          if (responseJson.result.codResult.toString() === '-0001') {
            throw Object.assign(new Error(), { result: { codResult: 'XXX', msgResult: 'Lo sentimos, se ha producido un error al hacer la petición. Por favor, inténtalo de nuevo pasados unos minutos.' } })
          } else {
            throw Object.assign(new Error(), { ...responseJson })
          }
        }
        if (responseJson.result && responseJson.result.codResult && responseJson.result.codResult.toString() === '0025' && endpoint.includes('/users?limit')) {
          // limite datos 25
          return responseJson;
        }
        if (thisService === 'billingPeriods' && responseJson.result && responseJson.result.codResult && responseJson.result.codResult.toString() === '0000') {
          if (!responseJson.billingPeriods) {
            store.dispatch(showError(responseJson.result.codResult, thisService))
          }
        } else {
          if (responseJson.result && responseJson.result.codResult && responseJson.result.codResult.toString() === 'ERROR_GENERICO' && !endpoint.includes('/callejero/v2')) {
            // error en documentum
            //LCS añadimos al objeto el msgResult
            throw Object.assign(new Error(), {
              result: {
                codResult: 'AAA',
                msgResult: responseJson.result.msgResult ? responseJson.result.msgResult : 'Lo sentimos, se ha producido un error al hacer la petición. Por favor, inténtalo de nuevo pasados unos minutos.'
              }
            })
          }
          if (response.status && response.status.toString().charAt(0) !== '2' && response.status.toString().charAt(0) !== '4' && !endpoint.includes('/callejero/v2')) {
            //LCS añadimos al objeto el msgResult
            throw Object.assign(new Error(), {
              result: {
                codResult: 'XXX', msgResult: responseJson.result.msgResult ? responseJson.result.msgResult : 'Lo sentimos, se ha producido un error al hacer la petición. Por favor, inténtalo de nuevo pasados unos minutos.'
              }
            })
          } else if (response.status && response.status.toString().charAt(0) === '4') {            
            if(responseJson.result && responseJson.result.codResult === '4008') {
              //LCS añadimos al objeto el msgResult
              throw Object.assign(new Error(), {
                result: {
                  codResult: '4008', msgResult: responseJson.result.msgResult ? responseJson.result.msgResult : 'La contraseña proporcionada no cumple con la política de contraseñas'
                }
              })
            } else {
              //LCS añadimos al objeto el msgResult
              throw Object.assign(new Error(), {
                result: {
                  codResult: '9002', msgResult: responseJson.result.msgResult ? responseJson.result.msgResult : 'Lo sentimos, tu sesión ha expirado. Por favor, vuelve a iniciar sesión.'
                }
              })
            }            
          } else if ((responseJson.result && responseJson.result.codResult  && (!['0000', '0', '00', '2903', '2909', '0001', '2910', '2901', '3001'].includes(responseJson.result.codResult.toString()))) || (responseJson.codResult && (responseJson.codResult.toString() !== '0000' && responseJson.codResult.toString() !== '0'))) {
            throw responseJson
          }
        }
      }

      return responseJson
    }).catch(e => {
      const thisService = this.getService(endpoint, requestParams.method)

      // Capar los mensajes de error de meterControl
      if (thisService !== 'meterControl') {
        if (thisService === 'powerCalculation' && (e as any).result.msgResult) {
          store.dispatch(setMessage((e as any).result.msgResult.replace('Error funcional: ', '')))
        }

        //if (thisService === 'meterReadings' && (e as any).result.msgResult) {
          //store.dispatch(showError((e as any).result.codResult, thisService))
        //}
        if ((e as any).result && (e as any).result.codResult !== 'XXX' && ((endpoint === '/login' && (e as any).result.codResult !== '1001' && (e as any).result.codResult !== '2004' && !window.location.pathname.endsWith('/admin')) || endpoint !== '/login')) {
          if ((e as any).result.codResult === '9002') {
            sessionStorage.setItem('lastPath', JSON.stringify({path: window.location.pathname, date: new Date(), user: USERID}));
            store.dispatch(showError('9002'))
          } else if (['4008', '2404', '2405','2403'].includes((e as any).result.codResult)) {
            store.dispatch(showError((e as any).result.codResult))
          } else {
              if (thisService !== 'meterReadings'){
                store.dispatch(showError((e as any).result.codResult, thisService))
                store.dispatch(setMessage('supplies-TS01000004'))
              }            
          }
        }

        if(!endpoint.includes('/callejero/v2')){
          if ((e as any).result && (e as any).result.codResult === 'XXX') {
            store.dispatch(showError('XXX'))
          }
          if (!(e as any).result || ((e as any).result && (e as any).result.codResult === '1001' && endpoint === '/login' && window.location.pathname.endsWith('/admin'))) {
            store.dispatch(showError('AAA'))
          }
        }
        if ((e as any).result && (e as any).result.codResult === '1001' && endpoint === '/login') {
          if(sessionStorage.getItem('tempmfa') !== '1') {
            store.dispatch(showError('1001'))
          }
          sessionStorage.removeItem('tempmfa');
        }

        if ((e as any).result && (e as any).result.codResult === '2004' && endpoint === '/login') {
          store.dispatch(showError('2004'))
        }
        throw e
      }
    })
  }

  private getService(endpoint: string, method: any) {
    let service = ''
    if(endpoint === '/login') {
      service = 'login'
    } else if(endpoint.startsWith('/users')) {
      if(method === 'GET') {
        if(endpoint.startsWith('/users/')) {
          service = 'getUser'
        }
        else {
          service = 'listUsers'
        }
      } else if(method === 'PUT') {
        if (endpoint.endsWith('/binding')) {
          service = 'bindingCups'
        } else {
          service = 'updateUser'
        }
      } else if(method === 'DELETE') {
        service = 'deleteUser'
      }
    } else if(endpoint === '/registration/users') {
      service = 'createRegistrationUser'
    } else if(endpoint === '/preregistration/users') {
      service = 'createPreRegistration'
    } else if(endpoint.startsWith('/registration/users/')) {
      if(method === 'GET') {
        service = 'resendRegistration'
      } else if(method === 'PUT') {
        service = 'activateRegistrationUser'
      }
    } else if(endpoint === '/passwordreminder') {
      service = 'createPasswordReminder'
    } else if(endpoint === '/cardPayment') {
      service = 'doCardPayment'
    } else if(endpoint.startsWith('/passwordreminder/')) {
      service = 'updatePasswordViaEmail'
    } else if(endpoint.startsWith('/customData')) {
      if(method === 'GET') {
        service = 'listCustomData'
      }
      else {
        service = 'updateSupplypointCustomData'
      }
    } else if(endpoint.startsWith('/delegations')) {
      if(method === 'GET') {
        if(endpoint.startsWith('/delegations/')) {
          service = 'getDelegation'
        }
        else {
          service = 'listDelegations'
        }
      } else if(method === 'POST') {
        service = 'createDelegations'
      } else if(method === 'PUT') {
        service = 'updateDelegation'
      } else if(method === 'DELETE') {
        service = 'deleteDelegation'
      }
    } else if(endpoint.startsWith('/delegates')) {
      if(method === 'GET') {
        if(endpoint.startsWith('/delegates/')) {
          service = 'getDelegate'
        }
        else {
          service = 'listDelegates'
        }
      } else if(method === 'POST') {
        service = 'createDelegate'
      } else if(method === 'PUT') {
        service = 'updateDelegate'
      } else if(method === 'DELETE') {
        service = 'deleteDelegate'
      }
    } else if (endpoint.startsWith('/dossiers/')) {
      if (method === 'PUT') {
        service = 'updateDossier'
      }
    } else if (endpoint.startsWith('/meterReadings')) {
      service = 'meterReadings'
    } else if (endpoint.startsWith('/meterControl')) {
      service = 'meterControl'
    } else if (endpoint.startsWith('/serviceRequests')) {
      if (method === 'GET') {
        service = 'listServiceRequests'
      } else if (method === 'POST') {
        service = 'createServiceRequest'
      }
    } else if (endpoint === '/powerCalculation') {
      service = 'powerCalculation'
    } else if(endpoint === '/warnings') {
      if (method === 'POST') {
        service = 'createWarnings'
      }
    } else if (endpoint.startsWith('/billingPeriods')) {
      service = 'billingPeriods'
    } else if (endpoint.startsWith('/listwarnings')) {
      service = 'listwarnings'
    }

    return service
  }
}

export default RestService
