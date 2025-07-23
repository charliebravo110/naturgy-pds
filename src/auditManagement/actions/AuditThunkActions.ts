import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux'
import AuditService from '../services/AuditService';
import { AppState } from '../../common/store/reducers/MainReducer';

const auditService = new AuditService();

export const thunkGetAuditList = (callback: any, data, type ): ThunkAction<void, AppState, null, Action> => async (dispatch, getState) => {
    try {
      const userToken = sessionStorage.getItem('token') || '';
      const queryString = Object.keys(data).map(key => {

        if(key === 'lastEvaluatedKey') {
          const queryStringLast = Object.keys(data[key]).map(keyL => `${key}.${keyL}` + '=' + data[key][keyL]).join('&')
          return queryStringLast;
        }
        else {
          return key + '=' + data[key]
        }      
      }).join('&')

      const response = await auditService.getAuditData(userToken, queryString, type); 
      callback && callback(response);
    } catch (e) {
      console.error('Error al obtener lista de auditoria:', e)
  
      callback && callback(e)
    }
  }