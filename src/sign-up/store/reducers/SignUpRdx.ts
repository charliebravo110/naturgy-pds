import { SIGN_UP_CHANGE_TAB_VALUE } from '../actions/SignUpActions'

const initialState = {
  tabValue: 0
}

const SignUpRdx = (state = initialState, action) => {
  // @FIX borrar reducer SIGN_UP_CHANGE_TAB_VALUE que ya no es necesario
  switch (action.type) {
    case SIGN_UP_CHANGE_TAB_VALUE:
      return {
        ...state,
        tabValue: action.tab
      }

    default:
      return state
  }
}

export default SignUpRdx
