import BaseRestService from './BaseRestService'
import UserProfile from './interfaces/UserProfile'

class UserService extends BaseRestService {
  doUpdate(id: string, fields: UserProfile, token: string) {
    return super.put(`/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        documentNumber: fields.documentNumber.toUpperCase(),
        email: fields.email.toLowerCase(),
        phone: fields.phone,
        password: fields.password,
        gdprAccepted: fields.gdprAccepted
      }
    })
  }

  doUpdateAlertConf(dni: string, fields: UserProfile, token: string) {
  
    return super.put(`/users/${dni}/updateAlertConf`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        franjaInicio: fields.franjaInicio,
        franjaFin: fields.franjaFin,
        franjaInicioEspecial: fields.franjaInicioEspecial,
        franjaFinEspecial:fields.franjaFinEspecial,
        tipoCanal: fields.tipoCanal,
        destinatario: fields.destinatario,
      }
    })
  }


  doUpdatePassword(hash: string, email: string, newPassword: string) {
    return super.put(`/passwordreminder/${hash}`, {
      body: {
        hash,
        email,
        newPassword
      }
    })
  }

  getUserById(userId: string, token: string) {
    return super.get(`/users/${userId}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doDeleteUser(id: string, token: string) {
    return super.delete(`/users/${id}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  doDeleteUserOvde(id: string, token: string, deleteCommons: string) {
    return super.deleteWithBody(`/users/${id}`, {  
      headers: {
      'Authorization': `Bearer ${token}`
      },
      body: {
        'deleteCommons': deleteCommons
      }
    })
  }

}

export default UserService
