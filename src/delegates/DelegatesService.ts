import BaseRestService from '../common/BaseRestService'

class DelegatesService extends BaseRestService {
  createDelegate(data: any, token: string) {

    return super.post('/delegates',{
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        creatorUserId: data.userId,
        name: data.name,
        documentNumber: data.documentNumber,
        role: data.role,
        status: 'A'
      }
    })
  }

  listDelegates(role: string, userId: string, token: string) {

    return super.get(`/delegates?filter=role::${role}|creatorUserId::${userId}|status::A`,{
        'Authorization': `Bearer ${token}`
    })
  }

  listDelegatesByCreatorUserId(creatorUserId: string, token: string) {

    return super.get(`/delegates?filter=creatorUserId::${creatorUserId}|status::A`,{
        'Authorization': `Bearer ${token}`
    })
  }

  listDelegatesByDocId(docId: string, token: string) {

    return super.get(`/delegates?filter=documentNumber::${docId}|status::A`,{
        'Authorization': `Bearer ${token}`
    })
  }

  getDelegate(delegateId: string, token: string) {

    return super.get(`/delegates/${delegateId}`,{
        'Authorization': `Bearer ${token}`
    })
  }

  updateDelegate(data: any, delegateId: string, token: string) {

    return super.put(`/delegates/${delegateId}`,{
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        name: data.name,
        surName: data.surName,
        email: data.email,
        documentNumber: data.documentNumber
      }
    })
  }

  doGetDelegations(delegateId: string, roles: string, dni: string, token: string) {
    return super.get(`/delegations?filter=delegateId::${delegateId}|status::C${roles.includes('US_MANAGER') ? '|userDocumentNumber::' + dni : ''}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  deleteDelegate(delegateId: string, token: string) {

    return super.delete(`/delegates/${delegateId}`,{
        'Authorization': `Bearer ${token}`
    })
  }

}

export default DelegatesService
