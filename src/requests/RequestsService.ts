import BaseRestService from '../common/BaseRestService'

class RequestsService extends BaseRestService {
  getRequestsList(filter: string, token: string) {
    return super.get(`/serviceRequests?filter=${filter}`,{
        'Authorization': `Bearer ${token}`
    })
  }

  getRequestsTypologyList(filter: string, token: string) {
    return super.get(`/serviceRequestsTypology?filter=${filter}`,{
        'Authorization': `Bearer ${token}`
    })
  }

  createNewRequest(data: any, token: string) {
    return super.post('/serviceRequests',{
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        ...data
      }
    })
  }

  updateRequest(data: any, token: string) {
    return super.put('/serviceRequests',{
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        ...data
      }
    })
  }

  noticeSgi(data: any, token: string) {
    return super.post('/warnings/incidence',{
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        ...data
      }
    })
  }

  createDocument(data: any, token: string) {
    return super.post('/documentum', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        ...data
      }
    })
  }

  getDocument(documentumId: string, nif: string, token: string) {
    return super.get(`/documentum/${documentumId}?filter=nif_consumidor::${nif}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  getDocumentSr(documentumId: string, nif: string, srCode: string, token: string) {
    return super.get(`/documentum/${documentumId}?filter=nif_consumidor::${nif}|cod_sr::${srCode}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  getDossiersList(dni: string, token: string) {
    return super.get(`/dossiers?filter=docNumber::${dni}`,{
      'Authorization': `Bearer ${token}`
    })
  }

  getDossiersData(dni: string, token: string) {
    return super.get(`/customData?filter=nif::${dni}|type::dossier`, {
      'Authorization': `Bearer ${token}`
    })
  }

  getSuppliesList(dni: string, token: string) {
    return super.get(`/supplypoints?filter=documentNumber::${dni}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  getSuppliesData(dni: string, token: string) {
    return super.get(`/customData?filter=nif::${dni}|type::supply`, {
      'Authorization': `Bearer ${token}`
    })
  }

  getCupsData(cups: string, token: string) {
    return super.get(`/customData?filter=keyId~~${cups}|type::supply`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doGetDocumentosCargaOffline(id: string, docNumber: string, cups: string, docType: string, date: string, docName: string, docSize: string, token: string) {
    return super.get(`/documentsOffline?filter=${id !== '' ? `id::${id}` : ''}${docNumber !== '' ? `|expediente::${docNumber}` : ''}${cups !== '' ? `|cups::${cups}` : ''}${docType !== '' ? `|doctype::${docType}` : ''}${date !== '' ? `|fechaRealSubida::${date}` : ''}${docName !== '' ? `|docName::${docName}` : ''}${docSize !== '' ? `|docSize::${docSize}` : ''}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  createDocumentoCargaOffline(data: any, token: string) {
    return super.post('/documentsOffline', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        ...data
      }
    })
  }

  // Servicio para recuperar todos los eventos de una SR (no sólo los comentarios)
  getServiceRequestEvents(documentNumber: string, codSr: string, token: string) {
    return super.get(`/serviceRequestsComments?filter=documentNumber::${documentNumber}|codSR::${codSr}`,{
      'Authorization': `Bearer ${token}`
    })
  }
}

export default RequestsService
