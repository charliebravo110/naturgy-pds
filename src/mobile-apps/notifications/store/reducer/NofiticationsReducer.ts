import { SET_NOTIFICATIONS, NotificationsActionTypes } from '../actions/ActionTypes'

const initialState: any = {
  list: [],
}

export function notificationsReducer(state = initialState, action: NotificationsActionTypes): any {
  switch (action.type) {
    case SET_NOTIFICATIONS:
      return {
        ...state,
        list: action.data
      }

    default:
      return state
  }
}
