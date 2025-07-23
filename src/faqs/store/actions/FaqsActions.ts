import {
  SET_FAQS,
  FaqsActionTypes
} from '../../interfaces/ActionsTypes'

export function setFaqs(faqs): FaqsActionTypes {
  return {
    type: SET_FAQS,
    data: faqs
  }
}