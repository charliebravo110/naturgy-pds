import BaseRestService from '../common/BaseRestService'

class EmailService extends BaseRestService {


  //1007875 - Proyecto Adaptación PDS RGPD
  sendEmail(data: any, id: string) {
    return super.post(`/v1.0/mails/${id}/send`, {
      body: {
        ...data
      }
    })
  }

}

export default EmailService
