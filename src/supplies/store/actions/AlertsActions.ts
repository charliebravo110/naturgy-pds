import {
  RESET_ALERTS,
  SET_ALERTS,
  DELETE_ALERTS,
  SET_ALERT,
  AlertsActionTypes,
} from '../../interfaces/AlertsActionTypes';

export function setAlerts(list: Array<any>): AlertsActionTypes {
  return {
    type: SET_ALERTS,
    data: list,
  };
}

export function setAlert(alert: any): AlertsActionTypes {
  return {
    type: SET_ALERT,
    data: AnalyserNode,
  };
}

export function resetAlerts(): AlertsActionTypes {
  return {
    type: RESET_ALERTS,
  };
}

export function deleteAlerts(cups): AlertsActionTypes {
  return {
    type: DELETE_ALERTS,
    data: cups,
  };
}
