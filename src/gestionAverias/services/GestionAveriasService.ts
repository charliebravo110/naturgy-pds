import { isConstructorDeclaration } from 'typescript'
import BaseRestService from '../../common/BaseRestService'
import { formatDateZeus } from '../../common/lib/FormatLib'

class GestionAveriasService extends BaseRestService {

  listSupplies(dni: string, token: string) {
    return super.get(`/supplypoints?filter=documentNumber::${dni}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  getSupplyCups(dni: string, token: string, cups: string) {
    return super.get(`/supplypoints?filter=documentNumber::${dni}${cups ? `|cups::${cups}` : ''}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  listZipCodes(zipCode: string, municipalityCode: string, provinceCode: string, token: string) {
    if (municipalityCode !== '' && provinceCode !== '') {
      return super.get(`/callejero/v2/zipcodes?filter=provinceCode::${provinceCode}|municipalityCode::${municipalityCode}`, {
        'Authorization': `Bearer ${token}`
      })
    } else if (zipCode !== '') {
      return super.get(`/callejero/v2/zipcodes?filter=zipCode::${zipCode}`, {
        'Authorization': `Bearer ${token}`
      })
    } else if (municipalityCode !== '') {
      return super.get(`/callejero/v2/zipcodes?filter=municipalityCode::${municipalityCode}`, {
        'Authorization': `Bearer ${token}`
      })
    } else if (provinceCode !== '') {
      return super.get(`/callejero/v2/zipcodes?filter=provinceCode::${provinceCode}`, {
        'Authorization': `Bearer ${token}`
      })
    }
  }

  listStreets(street: string, provinceCode: string, municipalityCode: string, typeStreet: string, geographicEntityName: string, singularEntityName: string, groupEntityName: string, token: string) {
    let minimum = (street && street.length > 0);
    let filter = `/callejero/v2/streets?filter=nameStreet::${street}`
    if (provinceCode !== '') {
      filter = filter + `|provinceCode::${provinceCode}`
      minimum = true;
    }
    if (municipalityCode !== '') {
      filter = filter + `|municipalityCode::${municipalityCode}`
    }
    if (typeStreet !== '') {
      filter = filter + `|typeStreet::${typeStreet}`
    }
    if (geographicEntityName !== '') {
      filter = filter + `|geographicEntityName::${geographicEntityName}`
      minimum = true;
    }
    if (singularEntityName !== '') {
      filter = filter + `|singularEntityName::${singularEntityName}`
    }
    if (singularEntityName !== '') {
      filter = filter + `|groupEntityName::${groupEntityName}`
    }
    if (minimum) {
      return super.get(filter, {
        'Authorization': `Bearer ${token}`
      })
    }
  }

  listProvinces(province: string, token: string) {
    return super.get(`/callejero/v2/provinces?filter=provinceName::${province}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  //Tenemos que diferenciar entre 3 busquedas para los municipios
  listMunicipalities(municipalityName: string, municipalityCode: string, provinceCode: string, zipCode: string, token: string) {
    if (municipalityName !== '' && municipalityCode !== '') {
      return super.get(`/callejero/v2/municipalities?filter=municipalityCode::${municipalityCode}|municipalityName::${municipalityName}`, {
        'Authorization': `Bearer ${token}`
      })
    } else if (municipalityName !== '' && provinceCode != '') {
      return super.get(`/callejero/v2/municipalities?filter=municipalityName::${municipalityName}|provinceCode::${provinceCode}`, {
        'Authorization': `Bearer ${token}`
      })
    } else if (municipalityName !== '') {
      return super.get(`/callejero/v2/municipalities?filter=municipalityName::${municipalityName}`, {
        'Authorization': `Bearer ${token}`
      })
    } else if (provinceCode !== '') {
      return super.get(`/callejero/v2/municipalities?filter=provinceCode::${provinceCode}`, {
        'Authorization': `Bearer ${token}`
      })
    } else if (zipCode !== '') {
      return super.get(`/callejero/v2/municipalities?filter=zipCode::${zipCode}`, {
        'Authorization': `Bearer ${token}`
      })
    }
  }

  listStreetType(type: string, token: string) {
    return super.get(`/callejero/v2/streettypes?filter=descStreetType::${type}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  listAddresses(addId: string, addNumber: string, door: string, token: string) {
    if (addNumber !== '') {
      return super.get(`/callejero/v2/addresses?filter=addId::${addId}|addNumber::${addNumber}`, {
        'Authorization': `Bearer ${token}`
      })
    } else if (door !== '') {
      return super.get(`/callejero/v2/addresses?filter=addId::${addId}|door::${door}`, {
        'Authorization': `Bearer ${token}`
      })
    } else {
      return super.get(`/callejero/v2/addresses?filter=addId::${addId}`, {
        'Authorization': `Bearer ${token}`
      })
    }
  }

  listCustomers(docNumber: string, customerName: string, surname1: string, surname2: string, token: string) {
    if (docNumber === undefined) {
      docNumber = '';
    }
    if (customerName === undefined) {
      customerName = '';
    }
    if (surname1 === undefined) {
      surname1 = '';
    }
    if (surname2 === undefined) {
      surname2 = '';
    }
    if (docNumber !== '') {
      return super.get(`/customers?filter=docNumber::${docNumber}`, {
        'Authorization': `Bearer ${token}`
      })
    } else if (customerName !== '' && surname1 !== '' && surname2 !== '') {
      return super.get(`/customers?filter=customerName::${customerName}|surName1::${surname1}|surName2::${surname2}`, {
        'Authorization': `Bearer ${token}`
      })
    } else if (customerName !== '' && surname1 !== '') {
      return super.get(`/customers?filter=customerName::${customerName}|surName1::${surname1}`, {
        'Authorization': `Bearer ${token}`
      })
    } else if (customerName !== '' && surname2 !== '') {
      return super.get(`/customers?filter=customerName::${customerName}|surName2::${surname2}`, {
        'Authorization': `Bearer ${token}`
      })
    } else if (customerName !== '') {
      return super.get(`/customers?filter=customerName::${customerName}`, {
        'Authorization': `Bearer ${token}`
      })
    } else if (surname1 !== '' && surname2 !== '') {
      return super.get(`/customers?filter=surName1::${surname1}|surName2::${surname2}`, {
        'Authorization': `Bearer ${token}`
      })
    } else if (surname1 !== '') {
      return super.get(`/customers?filter=surName1::${surname1}`, {
        'Authorization': `Bearer ${token}`
      })
    } else if (surname2 !== '') {
      return super.get(`/customers?filter=surName2::${surname2}`, {
        'Authorization': `Bearer ${token}`
      })
    }
  }

  listWarnings(data: any, token: string) {
    return super.post('/listwarnings', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        ...data
      }
    })
  }

  doGetListWarnings(warningCode: string, token: string) {
    return super.get(`/warnings?filter=codIncidence::${warningCode}`, {
      'Authorization': `Bearer ${token}`
    });
  }

  doGetEnergyCutOff(cups: string, token: string) {
    return super.get(`/energyCutOff?filter=cups::${cups}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doGetRearmarContador(docNumber: string, cups: string, measurementSystem: string, meterId: string, readingTypeIds: string, token: string) {
    return super.get(`/meterControl?filter=documentNumber::${docNumber}|cups::${cups}|measurementSystem::${measurementSystem}|meterId::${meterId}|readingTypeIds::${readingTypeIds}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doGetMeterReadings(docNumber: string, cups: string, measurementSystem: string, meterId: string, readingTypeIds: string, token: string) {
    return super.get(`/meterReadings?filter=documentNumber::${docNumber}|cups::${cups}|measurementSystem::${measurementSystem}|meterId::${meterId}|readingTypeIds::${readingTypeIds}|origin::I`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doGetMasterData(master: string, language: string, key: any, token: string) {
    return super.get(`/masterData?filter=master::${master}|language::${language}${key ? '|key::' + key : ''}`)
  }

  listGroupEntity(provinceCode: string, munici: string, token: string, colectiveEntity: string,) {
    const entityFilter = colectiveEntity.length ? '|entityName::' + colectiveEntity : ''
    return super.get(`/callejero/v2/collectiveEntity?filter=provinceCode::${provinceCode}|municipalityCode::${munici}${entityFilter}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  listIndividualEntity(provinceCode: string, townCode, token: string, singularEntity: string, groupEntityName: string) {
    console.log(singularEntity, groupEntityName)
    const singularFilter = singularEntity.length ? `|entityName::${singularEntity}` : ''
    const groupFilter = groupEntityName.length ? `|groupEntityName::${groupEntityName}` : ''
    return super.get(`/callejero/v2/singularEntity?filter=provinceCode::${provinceCode}|municipalityCode::${townCode}${singularFilter}${groupFilter}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  getStreetTypeByStreetNameAndZipcode(streetName: string, zipCode: string, token: string) {
    return super.get(`/callejero/v2/streets?filter=nameStreet::${streetName}|zipCode::${zipCode}`, {
      'Authorization': `Bearer ${token}`
    })
  }

}

export default GestionAveriasService
