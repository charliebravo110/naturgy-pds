import {
  SET_FAQS,
  FaqsActionTypes
} from '../../interfaces/ActionsTypes'

const initialState: any = {
  faqs: '',
}

export function faqsReducer(state = initialState, action: FaqsActionTypes): any {
  switch (action.type) {
    case SET_FAQS:
      return {
        ...state,
        faqs: action.data
      }

    default:
      return state
  }
}