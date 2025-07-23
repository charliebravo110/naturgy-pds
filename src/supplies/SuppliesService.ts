import BaseRestService from '../common/BaseRestService'
import { formatDateZeus } from '../common/lib/FormatLib'

class SuppliesService extends BaseRestService {
  doGetSupplies(dni: string, token: string) {
    return super.get(`/supplypoints?filter=documentNumber::${dni}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doGetSuppliesDNICUPS(dni: string, cups: string) {
    return super.get(`/supplypoints?filter=documentNumber::${dni}|cups::${cups}`, {
    })
  }

  doGetAlerts(dni:string, token:string) {
    return super.get(`/alerts/alerts?filter=docId::${dni}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doCreateAlerts(items: Array<any>, token: string,dni:string) {
    return super.post(`/alerts/${dni}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        items
      }
    })
  }

  doDeleteAlerts(items:Array<any>,token:string) {
    return super.post(`/alerts/supplycutoff/delete`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        items
      }
    })
  }

  doCreateOrUpdateAlert(item:any, token: string,dni:string,alertType:string,idEntity:string) {
    return super.post(`/alerts/${dni}/${alertType}/${idEntity}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: item
    })
  }

  doCreateOrUpdateAlerts(items:Array<any>, token: string,dni:string) {
    console.log(items);
    return super.post(`/alerts/${dni}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body:{
        items
      }
    })
  }
  /*listSupplies(
    dni: string,
    offset: any,
    limit: any,
    cups: any,
    delegatePointsOffset: any,
    delegatePointsLimit: any,
    token: string
  ) {
    return super.get(`/supplypoints?filter=documentNumber::${dni}${cups ? `|cups::${cups}` : ''}${offset ? `&offset=${offset}` : ''}${limit ? `&limit=${limit}` : ''}${delegatePointsOffset === false ? '' : `&offsetDel=${delegatePointsOffset}`}${delegatePointsLimit ? `&limitDel=${delegatePointsLimit}` : ''}`, {
      'Authorization': `Bearer ${token}`
    })
  }*/

  listSupplies(dni: string, idAddress: string, token: string) {
    if (dni !== '') {
      return super.get(`/supplypoints?filter=documentNumber::${dni}`, {
        'Authorization': `Bearer ${token}`
      })
    } else if (idAddress !== '') {
      return super.get(`/supplypoints?filter=idAddress::${idAddress}`, {
        'Authorization': `Bearer ${token}`
      })
    }

  }

  getSuppliesData(nif: string, token: string) {
    return super.get(`/customData?filter=nif::${nif}|type::supply`, {
      'Authorization': `Bearer ${token}`
    })
  }

  getSuppliesDataByCupsList(cups: string, token: string) {
    return super.get(`/customData?filter=keyId~~${cups}|type::supply`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doGetCurrentSupplyConsumptions(dni: string, cups: string, granularity: string, startDate: string, endDate: string, isGenerator: string, isDelegate: boolean, isSelfConsumption: string, measurementSystem: string, token: string) {
    return super.get(`/consumptions?filter=nif::${dni}|cups::${cups}|startDate::${startDate}|endDate::${endDate}|granularity::${granularity}|unit::K|generator::${isGenerator}|isDelegate::${isDelegate ? 'Y' : 'N'}|isSelfConsumption::${isSelfConsumption}|measurementSystem::${measurementSystem}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doGetCurrentBillsList(dni: string, cups: string, startDate: string, endDate: string, isMigrated: boolean, isDelegate: boolean, token: string) {
    return super.get(`/listBills?filter=documentNumber::${dni}|cups::${cups}|startDate::${startDate}|endDate::${endDate}|isMigrated::${isMigrated ? '1' : '0'}|isDelegate::${isDelegate ? 'Y' : 'N'}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doGetMaxPotencyDemanded(dni: string, cups: string, startDate: string, endDate: string, isGenerator: string, isDelegate: boolean, measurementSystem: string, token: string) {
    return super.get(`/maxPotencyDemanded?filter=nif::${dni}|cups::${cups}|startDate::${startDate}|endDate::${endDate}|generator::${isGenerator}|isDelegate::${isDelegate ? 'Y' : 'N'}|measurementSystem::${measurementSystem}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doGetCurrentSupplyBillingPeriods(cups: string, dateFrom: string, dateTo: string, token: string) {
    return super.get(`/billingPeriods?filter=cups::${cups}|startDate::${dateFrom}|endDate::${dateTo}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doPutSupply(dni: string, cups: string, dossierCod: string, token: string) {
    console.log('entra doPutSupply')
    return super.put(`/users/${dni}/binding`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        cups,
        dossierCod
      }
    })
  }

  doUpdateSupply(cups: string, dni: string, name: string, icon: string, token: string) {
    return super.put(`/customData/${cups}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        type: 'supply',
        documentNumber: dni,
        name,
        icon
      }
    })
  }

  doGetDelegates(filterId: string, userId: string, status: string, token: string) {
    return super.get(`/delegates?filter=${filterId}::${userId}|status::${status}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doGetDelegations(token: string, filterId: string, userId: string, roles: string, dni: string) {
    return super.get(`/delegations?filter=${filterId}::${userId}|status::C|userDocumentNumber::${dni}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doGetDelegationsInMe(token: string, filterCups: string, cups: string,
    filterStartDate: string, startDate: string, filterEndDate: string, endDate: string,
    roles: string, dni: string) {
    return super.get(`/delegations?filter=${filterCups}::${cups}|${filterStartDate}::${startDate}|${filterEndDate}::${endDate}|status::C`, {
      'Authorization': `Bearer ${token}`
    })
  }

  getDelegation(delegationId: string, token: string) {
    return super.get(`/delegations/${delegationId}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  updateDelegationsPeriods(items: Array<any>, token: string) {
    return super.put(`/delegations`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        items
      }
    })
  }

  deleteDelegation(delegationId: string, token: string) {
    return super.delete(`/delegations/${delegationId}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doCreateDelegations(items: Array<any>, token: string) {
    return super.post(`/delegations`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        items
      }
    })
  }

  doUpdateDelegationStatus(items: Array<any>, token: string) {
    return super.put(`/delegations`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        items
      }
    })
  }

  doGetMeterReadings(docNumber: string, cups: string, measurementSystem: string, meterId: string, readingTypeIds: string, token: string) {
    return super.get(`/meterReadings?filter=documentNumber::${docNumber}|cups::${cups}|measurementSystem::${measurementSystem}|meterId::${meterId}|readingTypeIds::${readingTypeIds}|origin::I`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doGetMeterControl(docNumber: string, cups: string, measurementSystem: string, meterId: string, readingTypeIds: string, token: string) {
    return super.get(`/meterControl?filter=documentNumber::${docNumber}|cups::${cups}|measurementSystem::${measurementSystem}|meterId::${meterId}|readingTypeIds::${readingTypeIds}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doGetMasterData(master: string, language: string, key: any, token: string) {
    return super.get(`/masterData?filter=master::${master}|language::${language}${key ? '|key::' + key : ''}`)
  }

  doGetMasterDataOnlyMaster(master: string, language: string,token: string) {
    return super.get(`/masterData?filter=master::${master}|language::${language}`)
  }

  doGetWhitelistAccess(type: string, value: string, token: string) {
    return super.get(`/whitelistAccess/${type}/${value}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doGetProgrammedQuery(meterId: string, token: string) {
    return super.get(`/programmedQuery/${meterId}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doDeleteProgrammedQuery(meterId: string, token: string) {
    return super.delete(`/programmedQuery/${meterId}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doCreateOrUpdateProgrammedQuery(body: any, token: string) {
    return super.post(`/programmedQuery`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body
    })
  }

  listProgrammedReads(meterId: string, offset: any, limit: any, token: string) {
    return super.get(`/programmedReads?filter=meterId::${meterId}${(offset || offset === 0) ? `|origin~~I,S&offset=${offset}` : ''}${limit ? `&limit=${limit}` : ''}&sort=-id`, {
      'Authorization': `Bearer ${token}`
    })
  }

  createProgrammedReads(body: any, token: string) {
    return super.post(`/programmedReads`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body
    })
  }

  doCreateWarning(body: any, token: string) {
    return super.post(`/warnings`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body
    })
  }

  doGetListIncidence(cups: string, dateFrom: Date, dateTo: Date, token: string) {
    const from = formatDateZeus(dateFrom) + '000000';
    const to = formatDateZeus(dateTo) + '000000';

    return super.get(`/listPowerSupplyFacilities?filter=cups::${cups}|fromDate::${from}|toDate::${to}`, {
      'Authorization': `Bearer ${token}`
    });
  }

  doGetListWarnings(warningCode: string, token: string) {
    return super.get(`/warnings?filter=codIncidence::${warningCode}`, {
      'Authorization': `Bearer ${token}`
    });
  }

  
  doGetWarningsIncidence(code: string, type: string, token: string) {
    if (type === 'warning') {
      return super.get(`/incidences?filter=warningCode::${code}`, {
        'Authorization': `Bearer ${token}`
      });
    } else if (type === 'incidence') {
      return super.get(`/incidences?filter=incidenceCode::${code}`, {
        'Authorization': `Bearer ${token}`
      });
    }
  }

  doGetListInterruptions(body: any, token: string) {
    return super.post(`/listInterruptionsPerSupplies`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body
    });
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

  doGetContractsSupply(docNumber:string,supply:any, token:string) {
    return super.get(`/contracts?filter=cdConsulta::01%7CcdaDocumento::${docNumber}|cdaCups::${supply}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doGetContractsUser(docNumber:string,token:string) {
    return super.get(`/contracts?filter=cdConsulta::02%7CcdaDocumento::${docNumber}%7CcdaCups::`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doGetContractsUserDelegates(docNumber:string,token:string) {
    return super.get(`/contracts?filter=cdConsulta::02%7CcdaDocumento::${docNumber}%7CcdaCups::%7Cdelegados::1`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doGetContractsCUPS(doc:string, supply:string,token:string) {
    return super.get(`/contracts?filter=cdConsulta::03%7CcdaDocumento::${doc}%7CcdaCups::${supply}`, {
      'Authorization': `Bearer ${token}`
    })
  }

}

export default SuppliesService
