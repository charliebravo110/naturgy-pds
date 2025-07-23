import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

import ZeusWebData from '../../interfaces/ZeusWebData'
import { AppState } from '../../store/reducers/MainReducer'
import ProvisionsService from '../../../provisions/ProvisionsService'
import { checkDocumentType } from '../../lib/ValidationLib'
import { formatWebStartDate } from '../../lib/FormatLib'

// LCS: Importa la función - Wave 1
import { sendGAEvent } from '../../../core/utils/gtm';

const provisionsService = new ProvisionsService()

export const thunkZeusSincro = (webData: ZeusWebData, docNumber: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  
  try {
    const userToken = sessionStorage.getItem('token') || ''
    const documentNumber = (docNumber && docNumber !== null && docNumber !== '') ? docNumber : getState().user.profile.documentNumber
    const customerName = getState().user.profile.name
    const surName = getState().user.profile.surName
    const phone = getState().user.profile.phone
    const email = getState().user.profile.email
    const webClientId = getState().user.profile.userId
    const webStartDate = formatWebStartDate(getState().user.profile.webStartDate)
    const lastAccessDate = (getState().user.profile.lastAccessDate ? true : false)
    let arrayUser = surName.split(' ');
    let customer = {} as any

    // LCS: Registrar el tiempo inicial para obtener el cliente - Wave 1
    const getCustomerStartTime = performance.now();
    // Get customer from ZEUS.
    const customerResponse = await provisionsService.getCustomer(documentNumber, userToken)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const getCustomerEndTime = performance.now();
    const getCustomerResponseTime = getCustomerEndTime - getCustomerStartTime;

    // LCS: Enviar evento a GA para el tiempo de respuesta de getCustomer - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      info: {
        apiUrl: 'get /customers?filter=user_id::'+sessionStorage.getItem('id'),
        apiUrlShort: 'get /customers',
        responseTime: getCustomerResponseTime, // Tiempo de respuesta en milisegundos
      }
    });

    if (customerResponse.customers && customerResponse.customers.items && customerResponse.customers.items.length > 0) {
      customer = customerResponse.customers.items[0]
      if (customer.idRelationship && !lastAccessDate) {
        let data = {
          idRelationship: customer.idRelationship,
          docNumber: documentNumber,
          docType: checkDocumentType(documentNumber),
          customerName: customer.customerName || '',
          surname1: arrayUser[0] || '',
          surname2: arrayUser[1] || '',
          birthday: customer.birthday || '',
          state: customer.state || '',
          town: customer.town || '',
          zipcode: customer.zipcode || '',
          streetType: customer.streetType || '',
          streetName: customer.streetName || '',
          addNumber: customer.addNumber || '',
          telephone1: customer.telephone1 || '',
          telephone2: customer.telephone2 || '',
          email: customer.email || '',
          indLegalAccept: webData.indLegalAccept,
          webPhone: webData.webPhone,
          webEmail: webData.webEmail,
          webStartDate: webStartDate,
          webEndDate: webData.webEndDate,
          webClientId: webData.webClientId
        } as any

        // LCS: Registrar el tiempo inicial para actualizar el cliente - Wave 1
        const updateCustomerStartTime = performance.now();

        // Update customer in ZEUS.
        const updateResponse = await provisionsService.createCustomer(data, userToken)

        // LCS: Registrar el tiempo final y calcular la duración - Wave 1
        const updateCustomerEndTime = performance.now();
        const updateCustomerResponseTime = updateCustomerEndTime - updateCustomerStartTime;

        // LCS: Enviar evento a GA para el tiempo de respuesta de createCustomer - Wave 1
          sendGAEvent({
          event: 'api_response_time',
          info: {
            apiUrl: 'post /customers',
            apiUrlShort: 'post /customers',
            responseTime: updateCustomerResponseTime,
          }
        });
      } else if (customer.userType === '0') {
        let data = {
          idRelationship: customer.idRelationship,
          docNumber: documentNumber,
          docType: checkDocumentType(documentNumber),
          customerName: customerName || '',
          surname1: arrayUser ? arrayUser[0] : '',
          surname2: arrayUser ? arrayUser[1] : '',
          birthday: customer.birthday || '',
          state: customer.state || '',
          town: customer.town || '',
          zipcode: customer.zipcode || '',
          streetType: customer.streetType || '',
          streetName: customer.streetName || '',
          addNumber: customer.addNumber || '',
          telephone1: phone || '',
          telephone2: customer.telephone2 || '',
          email: email || '',
          indLegalAccept: webData.indLegalAccept,
          webPhone: phone,
          webEmail: email,
          webStartDate: webStartDate,
          webEndDate: webData.webEndDate,
          webClientId: webClientId
        } as any

        // LCS: Registrar el tiempo inicial para actualizar el cliente - Wave 1
        const updateCustomerStartTime = performance.now();

        // Update customer in ZEUS.
        const updateResponse = await provisionsService.createCustomer(data, userToken)

        // LCS: Registrar el tiempo final y calcular la duración - Wave 1
        const updateCustomerEndTime = performance.now();
        const updateCustomerResponseTime = updateCustomerEndTime - updateCustomerStartTime;

        // LCS: Enviar evento a GA para el tiempo de respuesta de createCustomer - Wave 1
        sendGAEvent({
          event: 'api_response_time',
          info: {
            apiUrl: 'post /customers',
            apiUrlShort: 'post /customers',
            responseTime: updateCustomerResponseTime,
          }
        });
      }
    }

    callback && callback()

  } catch (e){
    console.error('Error al sincronizar los datos del usuario con ZEUS:', e)
    // LCS: Enviar evento a GA - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al sincronizar los datos del usuario con ZEUS'),
        error: e,
        apiUrl: 'post /customers',
        reactComponent: 'ZeusSincroThunkActions.ts - thunkZeusSincro',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });
    callback && callback()
  }

}