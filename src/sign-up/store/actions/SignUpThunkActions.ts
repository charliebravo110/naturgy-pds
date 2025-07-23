import { Action } from 'redux'
import { push } from 'connected-react-router'
import { ThunkAction } from 'redux-thunk'

import { hideError,setMessage, showError } from '../../../common/store/actions/ErrorActions';
import { AppState } from '../../../common/store/reducers/MainReducer'
import SignUpService from '../../SignUpService'
import SignUpFormData from '../../interfaces/SignUpFormData'

// LCS: Importa la función - Wave 1
import { sendGAEvent } from '../../../core/utils/gtm';

const signUpService = new SignUpService()
//REGISTRO
export const thunkSendRegisterForm = (signForm: SignUpFormData, setIsLoading: any, setErrorRegister: any): ThunkAction<void, AppState, null, Action> => async (dispatch) => {
  signForm.checkDocument=false;
  signForm.checkEmail=false;
  try {
    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    const resp = await signUpService.sendForm(signForm)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      apiUrl: 'post /registration/users/',
      apiUrlShort: 'post /registration/users',
      responseTime: responseTime, // Tiempo de respuesta en milisegundos
    });

    if(resp.hash){
      dispatch(hideError())

      // LCS: Enviar evento a GA para errores - Wave 1
      sendGAEvent({
        event: 'registered_user',
        action: 'Nuevo usuario registrado',
        reactComponent: 'SignUpThunkActions.ts - thunkSendRegisterForm',
      });
      
      dispatch(push({
        pathname: '/signup/success',
        state: {
          hash: resp.hash
        }
      }))
    }
  } catch (e) {
    console.log(e)
    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al registrarse'),
        error: e,
        reactComponent: 'SignUpThunkActions.ts - thunkSendRegisterForm',
        apiUrl: 'post /registration/users',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    setErrorRegister(true)
    setIsLoading(false)
    if((e as any).result && (e as any).result.codResult.toString() === '2003'){
      dispatch(hideError())
      
      dispatch(push('/signup/error'))
    }

    if ((e as any).result && (e as any).result.codResult.toString() === '2004') {
      dispatch(showError('createRegistrationUser.2004'))   
      dispatch(setMessage(''))  
    }

    if ((e as any).result && (e as any).result.codResult.toString() === '2005') {
      dispatch(showError('createRegistrationUser.2005b'))   
      dispatch(setMessage(''))  
    }
  }
}

export const thunkcheckDocument = (signForm: SignUpFormData, setExistDocument: any, setExistInLoginUser:any): ThunkAction<void, AppState, null, Action> => async (dispatch) => {
  try{
    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    await signUpService.sendFormVerification(signForm)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      apiUrl: 'post /registration/users/',
      apiUrlShort: 'post /registration/users',
      responseTime: responseTime, // Tiempo de respuesta en milisegundos
    });

    setExistDocument(false);
  }catch (e){
    console.log(e)
    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al comprobar el DNI'),
        error: e,
        reactComponent: 'SignUpThunkActions.ts - thunkcheckDocument',
        apiUrl: 'post /registration/users',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });
    if((e as any).result && (e as any).result.codResult === '2019'){
      setExistDocument(true);
    }
    else if((e as any).result && (e as any).result.codResult === '2023'){
      setExistInLoginUser(true);
    }
  }
}

export const thunkcheckDocumentLoginUSer = (signForm: SignUpFormData, setExistDocument: any): ThunkAction<void, AppState, null, Action> => async (dispatch) => {
  try{
    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    await signUpService.sendForm(signForm)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      apiUrl: 'post /registration/users/',
      apiUrlShort: 'post /registration/users',
      responseTime: responseTime, // Tiempo de respuesta en milisegundos
    });

    setExistDocument(false);
  }catch(e){
    console.log(e)
    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al comprobar el DNI'),
        error: e,
        reactComponent: 'SignUpThunkActions.ts - thunkcheckDocumentLoginUSer',
        apiUrl: 'post /registration/users',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    if((e as any).result.codResult === '2019'){
      setExistDocument(true);
    }
  }
}

export const thunkcheckEmail = (signForm: SignUpFormData, setExistEmail: any): ThunkAction<void, AppState, null, Action> => async (dispatch) => {
  try{
    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    await signUpService.sendFormVerification(signForm)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      apiUrl: 'post /registration/users/',
      apiUrlShort: 'post /registration/users',
      responseTime: responseTime, // Tiempo de respuesta en milisegundos
    });

    setExistEmail(false);

  }catch (e){
    console.log(e)
    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al comprobar el email'),
        error: e,
        reactComponent: 'SignUpThunkActions.ts - thunkcheckEmail',
        apiUrl: 'post /registration/users',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });

    if((e as any).result && (e as any).result.codResult === '2018'){ 
      setExistEmail(true);
    }
  } 
}

export const thunkResendMail = (id: string,callback: any,): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try {
    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();

    const response = await signUpService.resendEmail(id)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      apiUrl: 'get /registration/users/' + id,
      apiUrlShort: 'get /registration/users',
      responseTime: responseTime, // Tiempo de respuesta en milisegundos
    });
  
    callback && callback(response)
  } catch (e){
    const errorMessage = '1'
    console.error('Error reEnviar mail:', errorMessage);
    // Llamar al callback con el error (si corresponde)
    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al reenviar email'),
        error: e,
        reactComponent: 'SignUpThunkActions.ts - thunkResendMail',
        apiUrl: 'post /registration/users',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });
    callback && callback('1')
    console.error('Error reEnviar mail', e)
    throw e;
  }
}

export const thunkActivateUser = (hash: string, email: string, callback: any): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
  try{
    // LCS: Registrar el tiempo inicial - Wave 1
    const startTime = performance.now();
    await signUpService.activateUser(hash, email)

    // LCS: Registrar el tiempo final y calcular la duración - Wave 1
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_response_time',
      apiUrl: 'put /registration/users/' + hash,
      apiUrlShort: 'put /registration/users',
      responseTime: responseTime, // Tiempo de respuesta en milisegundos
    });

    callback && callback()
  } catch(e) {
    console.log(e)
    // LCS: Enviar evento a GA para errores - Wave 1
    sendGAEvent({
      event: 'api_error',
      info: {
        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al activar el usuario'),
        error: e,
        reactComponent: 'SignUpThunkActions.ts - thunkActivateUser',
        apiUrl: 'post /registration/users',
        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
      }
    });
    console.log('102 codResult en thunkAction->',(e as any).result.codResult)
    if((e as any).result.codResult === '2022'){
       throw e;
    }
    console.error('Activation register error: ', e)
  }
}

