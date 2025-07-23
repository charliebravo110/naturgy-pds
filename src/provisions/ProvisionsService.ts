import BaseRestService from '../common/BaseRestService'

class ProvisionsService extends BaseRestService {
  listProvisions(documentNumber: string, token: string) {
    return super.get(`/dossiers?filter=docNumber::${documentNumber}&sort=-REGISTER_DATE`, {
      'Authorization': `Bearer ${token}`
    })
  }

  listDossiers(dni: string, offset: any, limit: any, dossierCod: any, token: string) {
    return super.get(`/dossiers?filter=docNumber::${dni}${dossierCod ? `|dossierCod::${dossierCod}` : ''}&sort=-REGISTER_DATE${offset ? `&offset=${offset}` : ''}${limit ? `&limit=${limit}` : ''}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  listDossierBills(dni: string, dossierCod: any, token: string) {
    return super.get(`/listDossierBills?filter=documentNumber::${dni}|dossierCod::${dossierCod}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  listAllDossierBills(dni: string, token: string) {
    return super.get(`/listDossierBills?filter=documentNumber::${dni}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  getProvision(id: string, documentNumber: string, token: string) {
    return super.get(`/dossiers/${id}?filter=docNumber::${documentNumber}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  getTaisTr9(id: string, token: string) {
    return super.get(`/taisTr9/${id}`, {
      'Authorization': `Bearer ${token}`
    });
  }

  createTaisTr9(data: any, token: string) {
    return super.post('/taisTr9', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        ...data
      }
    });
  }
  

  createProvision(data: any, token: string) {
    return super.post('/dossiers', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        ...data
      }
    })
  }

  doGetMasterData(master: string, language: string, key: any, token: string) {
    return super.get(`/masterData?filter=master::${master}|language::${language}${key ? '|key::' + key : ''}`)
  }

  doGetMasterDataOffline(master: string, language: string, key: any) {
    return super.get(`/masterData?filter=master::${master}|language::${language}${key ? '|key::' + key : ''}`)
  }

  getCustomer(documentNumber: string, token: string) {
    return super.get(`/customers?filter=docNumber::${documentNumber}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  getCustomerOffline(documentNumber: string) {
    return super.get(`/customers?filter=docNumber::${documentNumber}`, {
    })
  }

  getDigitalBillingCompany(documentNumber: string) {
    return super.get(`/digitalBillingCompany/${documentNumber}`)
  }

  getPowerCalculation(data: any, token: string) {
    return super.post('/powerCalculation', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        ...data
      }
    })
  }

  getCoverage(zipCode: string, ineCode: string, token: string) {
    return super.get(`/coverage?filter=${zipCode ? ('zipCode::' + zipCode) : ('ineCode::' + ineCode)}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  createCustomer(data: any, token: string) {
    return super.post('/customers', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        ...data
      }
    })
  }

  //1007875 - Proyecto Adaptación PDS RGPD
  customerRegister(data: any,token:string) {
  //Si no enviamos IND_DELETE_RIGHTS a 0 (Post customer)

    return super.post('/customers', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        ...data
      }
    })
  }

    //1007875 - Proyecto Adaptación PDS RGPD
    putCustomer(id: string, data: any, token:string) {

    //si existe enviamos IND_DELETE_RIGHTS a 1 (Put customer, no existe en BUS)
      return super.post('/customers', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: {
          ...data
        }
      })
    }

  
  createUserBinding(id: string, token: string, cups: string, dossierCod: string) {
    return super.put(`/users/${id}/binding`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        cups,
        dossierCod
      }
    })
  }

  updateDossier(id: string, doc: boolean, data: any, token: string) {
    const url = doc ? `/dossiers/${id}?doc=1` : `/dossiers/${id}`
    return super.put(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        ...data
      }
    })
  }

  updateDossierSharepoint(id: string, doc: boolean, data: any, token: string) {
    const url = doc ? `/dossiers/${id}?doc=1&repositorio=S` : `/dossiers/${id}?repositorio=S`
    return super.put(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        ...data
      }
    })
  }

  updateDossierOffline(id: string, doc: boolean, data: any) {
    const url = doc ? `/dossiers/${id}?doc=1` : `/dossiers/${id}`
    return super.put(url, {
      body: {
        ...data
      }
    })
  }

  updatePayment(data: any, token: string) {
    const url = `/updatePayment`
    return super.put(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        ...data
      }
    })
  }

  bizumPayment(data: any/*, token: string*/) {
    const url = `/bizumPayment`
    return super.post(url, {
      /*headers: {
        'Authorization': `Bearer ${token}`
      },*/
      body: {
        ...data
      }
    })
  }

  bizumPaymentConfirmation(data: any/*, token: string*/) {
    const url = `/bizumPaymentConfirmation`
    return super.post(url, {
      /*headers: {
        'Authorization': `Bearer ${token}`
      },*/
      body: {
        ...data
      }
    })
  }

  bizumPaymentOffline(data: any) {
    const url = `/bizumPaymentOffline`
    return super.put(url, {
      body: {
        ...data
      }
    })
  }

  checkUserBizum(data: any, token: string) {
    const url = `/checkRtpUsuario`
    return super.put(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        ...data
      }
    })
  }

  checkUserBizumOffline(data: any) {
    const url = `/checkRtpUsuario`
    return super.put(url, {
      body: {
        ...data
      }
    })
  }

  getHippo(activity: string, token: string) {
    return super.get(`/hippo/${activity}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  createCardPayment(data: any, token: string) {
    return super.post('/cardPayment', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        ...data
      }
    })
  }

  createCardPaymentOffline(data: any) {
    return super.post('/cardPaymentOffline', {
      body: {
        ...data
      }
    })
  }

  getCardPayment(dossierId: any, token: string) {
    return super.get(`/cardPayment?filter=dossierNumber::${dossierId}|status::OK`, {
      'Authorization': `Bearer ${token}`
    })
  }

  getCardPaymentWithDate(token: string,date:string) {
    return super.get(`/cardPayment?limit=9999&filter=requestTimestamp~~${date},${date}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  getCardPaymentWithRangeDate(token: string, RangeDate:string) {
    return super.get(`/cardPayment?limit=9999&filter=requestTimestamp~~${RangeDate}`, {
      'Authorization': `Bearer ${token}`
    })
  }


  getSearchPayData(expediente: string, nif: string, fechaAlta: Date, fechaLast: Date,codOk:string, token: string) {
    var altaDate, lastDate
    if (fechaAlta) {
      var auxMonth = (fechaAlta.getMonth() + 1)
      var auxDay = fechaAlta.getDate()
      var month = String(auxMonth)
      var day = String(auxDay)
      if (auxDay < 10) {
        day = '0' + String(auxDay)
      }
      if (auxMonth < 10) {
        month = '0' + String(auxMonth)
      }
      altaDate = day + '/' + month + '/' + fechaAlta.getFullYear()
    }
    if (fechaLast) {
      var auxMonth = (fechaLast.getMonth() + 1)
      var auxDay = fechaLast.getDate()
      var month = String(auxMonth)
      var day = String(auxDay)
      if (auxDay < 10) {
        day = '0' + String(auxDay)
      }
      if (auxMonth < 10) {
        month = '0' + String(auxMonth)
      }
      lastDate = day + '/' + month + '/' + fechaLast.getFullYear()
    }

    let date = new Date();
    let todayString = date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    })


    if (expediente || nif || altaDate || lastDate || codOk) {
      return super.get(`/cardPayment?limit=9999&filter=${expediente !== '' ? `dossierNumber::${expediente}` : ''}${nif !== '' ? `|custNum::${nif}` : ''}${(altaDate && altaDate !== '' && lastDate && lastDate !== '') ? `|requestTimestamp~~${altaDate},${lastDate}` : (altaDate && altaDate !== '' && (!lastDate || lastDate === '')) ? `|requestTimestamp~~${altaDate},${todayString}` : ((!altaDate || altaDate === '') && lastDate && lastDate !== '') ? `|requestTimestamp~~${lastDate},${lastDate}` : ''}${codOk !== '' ? `|result::${codOk}` : ''}`, {
        'Authorization': `Bearer ${token}`
      })
    }
    else {
      return super.get(`/cardPayment`, {
        'Authorization': `Bearer ${token}`
      })
    }
  }

  getProvisionsData(nif: string, token: string) {
    return super.get(`/customData?filter=nif::${nif}|type::dossier`, {
      'Authorization': `Bearer ${token}`
    })
  }

  getSupplypoints(dni: string, token: string) {
    return super.get(`/supplypoints?filter=documentNumber::${dni}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  getDossier(number: string, dni: string, token: string) {
    return super.get(`/dossiers/${number}?filter=docNumber::${dni}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  getDossierOffline(number: string, dni: string) {
    return super.get(`/dossiers/${number}?filter=docNumber::${dni}`)
  }

  getDocument(documentumId: string, codExpediente: string, token: string) {
    return super.get(`/documentum/${documentumId}?filter=cod_expediente::${codExpediente}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  getDocumentDNI(documentumId: string, nif: string, selloDigital: string, token: string) {
      return super.get(`/documentum/${documentumId}?filter=nifcliente::${nif}|selloDigital::${selloDigital}`, {
        'Authorization': `Bearer ${token}`
      })
  }

  getDocumentDNIwRepository(documentumId: string, nif: string, selloDigital: string, token: string, repositorio: string) {
    return super.get(`/documentum/${documentumId}?filter=nifcliente::${nif}|selloDigital::${selloDigital}|repositorio::${repositorio}`, {
      'Authorization': `Bearer ${token}`
    })
}

  getDocumentBill(nifcliente: string, numfactura: string, tipoDocumental: string, token: string) {
    return super.get(`/documentum/documentos?numfactura=${numfactura}&nifcliente=${nifcliente}&tipoDocumental=${tipoDocumental}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  getDocumentBillwRepository(nifcliente: string, numfactura: string, tipoDocumental: string, token: string, repository: string = 'D') {
    return super.get(`/documentum/documentos?repositorio=${repository}&numfactura=${numfactura}&nifcliente=${nifcliente}&tipoDocumental=${'factura_solicitudes_de_conexion'}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doUpdateDossier(dossierCod: string, dni: string, name: string, icon: string, token: string) {
    return super.put(`/customData/${dossierCod}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        type: 'dossier',
        documentNumber: dni,
        name,
        icon
      }
    })
  }

  doGetCommunicationNotifications(data: any, token: string) {
    return super.post(`/notifications`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        notifications: data
      }
    })
  }

  createMoratorium(data: any, token: string) {
    return super.put('/customData/moratorium', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        ...data
      }
    })
  }

  saveDossierData(data: any, token: string) {
    return super.put('/customData/dossierData', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        ...data
      }
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

  startTask(fileId: string, destination: string, data: any, token: string) {
    return super.put(`/iniciarTarea/${fileId}001${destination !== '' ? `?destino=${destination}` : ''}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        ...data
      }
    })
  } 

  expedientForm(data: any, token: string) {
    return super.post(`/expedientForm`, {
      headers:{ 
        'Authorization': `Bearer ${token}`
      },
      body: data
    });
  }
  
}

export default ProvisionsService
