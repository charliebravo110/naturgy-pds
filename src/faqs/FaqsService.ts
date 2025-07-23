import BaseRestService from '../common/BaseRestService'

class FaqsService extends BaseRestService {
  getFaqs(currentLanguage) {
    return super.get(`/faqs/${currentLanguage}`)
  }
}

export default FaqsService