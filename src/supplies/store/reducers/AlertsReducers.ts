import {
  RESET_ALERTS,
  SET_ALERTS,
  DELETE_ALERTS,
  SET_ALERT,
  AlertsActionTypes,
} from '../../interfaces/AlertsActionTypes';

import IAlerts from '../../interfaces/Alerts';

const initialState: IAlerts = {
  list: [
  
  ],
};

export function alertsReducer(
  state = initialState,
  action: AlertsActionTypes
): IAlerts {
  switch (action.type) {
    case SET_ALERTS:
      let array = [...state.list];
      action.data.forEach((element1) => {
        const index = array.findIndex(
          (element2) => element2.idEntidad === element1.idEntidad
        );

        if (index === -1) {
          array.push(element1);
        }
      });

      return {
        ...state,
        list: [...array],
      };
    case SET_ALERT:
      return {
        ...state,
        list: [...state.list, ...action.data],
      };
    case RESET_ALERTS:
      return {
        ...state,
        list: state.list,
      };
    case DELETE_ALERTS:
      return {
        ...state,
        list: state.list.filter((item) => item.idEntidad !== action.data),
      };
    default:
      return state;
  }
}
