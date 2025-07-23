import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { AppState } from '../../../common/store/reducers/MainReducer'
import FaqsService from '../../FaqsService'
import { setFaqs } from './FaqsActions'


const faqsService = new FaqsService()

export const thunkGetFaqs = (currentLanguage: string): ThunkAction<void, AppState, null, Action> => async (dispatch) => {

  try{
    const asyncResp = await faqsService.getFaqs(currentLanguage)

    const faqs = asyncResp.faqs ? asyncResp.faqs.items : []

    dispatch(setFaqs(faqs))
  }catch(e){
    console.error('Error geting Faqs: ', e)
  }
}