import BaseRestService from '../../BaseRestService'

class SendUrlService extends BaseRestService {

  sendMessage(data: any, token: string) {
    return super.post('/urlMessages', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        ...data
      }
    })
  }

  changeOpenUrl(id:string, token: string) {
    return super.put(`/urlMessages?filter=id::${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }

  getUrlMessagesData(category: string, detail: string, dateFrom: string, dateTo: string, token: string) {
    return super.get(`/urlMessages?filter=startDate::${dateFrom}|endDate::${dateTo}${(category && category !== '') ? `|category::${category}` : ''}${(detail && detail !== '') ? `|detail::${detail}` : ''}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doGetMasterData(master: string, language: string, key: any, token: string) {
    return super.get(`/masterData?filter=master::${master}|language::${language}${key ? '|key::' + key : ''}`)
  }

}

export default SendUrlService
