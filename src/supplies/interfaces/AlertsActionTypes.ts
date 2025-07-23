export const SET_ALERTS = '@@alerts/SET_ALERTS';
export const SET_ALERT = '@@alerts/SET_ALERT';

export const RESET_ALERTS = '@@alerts/RESET_ALERTS';
export const DELETE_ALERTS = '@@alerts/DELETE_ALERTS';

interface SetAlerts {
  type: typeof SET_ALERTS;
  data: any;
}

interface ResetAlerts {
  type: typeof RESET_ALERTS;
}

interface DeleteAlerts {
  type: typeof DELETE_ALERTS;
  data: any;
}

interface setAlert {
  type: typeof SET_ALERT;
  data: any;
}

export type AlertsActionTypes =
  | SetAlerts
  | ResetAlerts
  | DeleteAlerts
  | setAlert;
