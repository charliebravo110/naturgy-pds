import BaseRestService from '../../common/BaseRestService';
class ControlMensajeriaService extends BaseRestService {

  listProvinces(province: string, token: string) {
    return super.get(`/callejero/v2/provinces?filter=provinceName::${province}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  listMunicipalities(municipalityName: string, municipalityCode: string, provinceCode: string, zipCode: string, token: string) {
    if (municipalityName !== '' && municipalityCode !== '') {
      return super.get(`/callejero/v2/municipalities?filter=municipalityCode::${municipalityCode}&municipalityName::${municipalityName}`, {
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

  listStreets(street: string, provinceCode: string, municipalityCode: string, typeStreet: string, token: string) {
    if (provinceCode !== '' && municipalityCode !== '' && typeStreet !== '') {
      return super.get(`/callejero/v2/streets?filter=nameStreet::${street}|provinceCode::${provinceCode}|municipalityCode::${municipalityCode}|typeStreet::${typeStreet}`, {
        'Authorization': `Bearer ${token}`
      })
    } else if (provinceCode !== '' && typeStreet !== '') {
      return super.get(`/callejero/v2/streets?filter=nameStreet::${street}|provinceCode::${provinceCode}|typeStreet::${typeStreet}`, {
        'Authorization': `Bearer ${token}`
      })
    } else if (provinceCode !== '' && municipalityCode !== '') {
      return super.get(`/callejero/v2/streets?filter=nameStreet::${street}|provinceCode::${provinceCode}|municipalityCode::${municipalityCode}`, {
        'Authorization': `Bearer ${token}`
      })
    } else if (provinceCode !== '') {
      return super.get(`/callejero/v2/streets?filter=nameStreet::${street}|provinceCode::${provinceCode}`, {
        'Authorization': `Bearer ${token}`
      })
    } else {
      return super.get(`/callejero/v2/streets?filter=nameStreet::${street}`, {
        'Authorization': `Bearer ${token}`
      })
    }
  }

  doGetMessages(docNumber: string, phone: string, email: string, cups: string, customerName: string, surname1: string, adress: string, municipality: string, province: string, proces: string, processDateAndHour: string, emailResult: string, tipoEnvio: string, token: string) {
    return super.get(`/getMessages?filter=${docNumber !== '' ? `docIdentificativo::${docNumber}` : ''}${phone !== '' ? `|telefono::${phone}` : ''}${email !== '' ? `|email::${email}` : ''}${cups !== '' ? `|cups::${cups}` : ''}${customerName !== '' ? `|nombre::${customerName}` : ''}${(surname1 !== '' && surname1 !== ' ') ? `|apellidos::${surname1}` : ''}${adress !== '' ? `|direccion::${adress}` : ''}${municipality !== '' ? `|municipio::${municipality}` : ''}${province !== '' ? `|provincia::${province}` : ''}${proces !== '' ? `|proceso::${proces}` : ''}${processDateAndHour !== '' ? `|fecha::${processDateAndHour}` : ''}${emailResult !== '' ? `|resultadoEnvio::${emailResult}` : ''}${tipoEnvio !== '' ? `|tipoEnvio::${tipoEnvio}` : ''}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doGetMessagesFromDate(processDateAndHour: string[], token: string) {
    return super.get(`/getMessages?filter=fechaMsm~~${processDateAndHour}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doGetConfiguredAlerts(dates: string[], token: string) {
    return super.get(`/configuredAlerts?filter=fechaAlta~~${dates}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doGetAlertsSent(dates: string[], token: string) {
    return super.get(`/alertsSent?filter=fechaProceso~~${dates}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doGetUserDeviceController(token: string, dni:string) {
    console.log(`/device/${dni}`);
    
    return super.get(`/device/${dni}`, {
      'Authorization': `Bearer ${token}`
    })
  }
}

export default ControlMensajeriaService