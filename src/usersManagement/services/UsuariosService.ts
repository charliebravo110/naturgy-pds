import BaseRestService from '../../common/BaseRestService'

class UsuariosService extends BaseRestService {

  getAssignRole(user: string, token: string) {
    return super.get(`/userRoles/${user}`, {
      'Authorization': `Bearer ${token}`
    })
  }

  putAssignRole(user: string, roles: any, token: string) {
    return super.put(`/userRoles/${user}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        roles
      }
    })
  }

  activateUser(hash: string, email: string) {
    return super.put(`/registration/users/${hash}`, {
      body: {
        email,
        hash
      }
    })
  }

  getSearchedUserByDoc(documentid: string, token: string) {
    if (documentid) {
      return super.get(`/users?limit=1&sort=userId&offset=0&filter=documentNumber::${documentid}`,
        {
          'Authorization': `Bearer ${token}`
        })
    }
  }
  getSearchedUserByEmail(email: string, token: string) {
    if (email) {
      return super.get(`/users?limit=1&sort=userId&offset=0&filter=email::${email}`,
        {
          'Authorization': `Bearer ${token}`
        })
    }
  }

  getUsers(token: string) {
    return super.get('/callcenter/users',
      {
        'Authorization': `Bearer ${token}`
      });
  }

  getRoles(token: string) {
    return super.get('/callcenter/roles',
      {
        'Authorization': `Bearer ${token}`
      });
  }

  thunkGetAllLoginUsers(token: string) {
    return super.get(`/userRoles`,
      {
        'Authorization': `Bearer ${token}`
      })
  }

  getSearchLoginUsersLimit(docId: string, email: string, fechaAlta: Date, fechaLastLogin: Date, limit: any, token: string) {
    var altaDate, lastLoginDate
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
    if (fechaLastLogin) {
      var auxMonth = (fechaLastLogin.getMonth() + 1)
      var auxDay = fechaLastLogin.getDate()
      var month = String(auxMonth)
      var day = String(auxDay)
      if (auxDay < 10) {
        day = '0' + String(auxDay)
      }
      if (auxMonth < 10) {
        month = '0' + String(auxMonth)
      }
      lastLoginDate = day + '/' + month + '/' + fechaLastLogin.getFullYear()
    }
    // sin datos busqueda generica
    /*if (!docId && !email && !fechaAlta && !fechaLastLogin) {
      return super.get(`/userRoles?limit=${limit}`,
        {
          'Authorization': `Bearer ${token}`
        })
    }*/
    //tenemos NIF
    if (docId) {
      if (email) {
        //tenemos fecha de alta
        if (fechaAlta) {
          //tenemos todo
          if (fechaLastLogin) {
            return super.get(`/userRoles?limit=${limit}&filter=document::${docId}|email::${email}|registrationDate::${altaDate}|lastLoginDate::${lastLoginDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
          //falta fecha de ultimo login
          else {
            return super.get(`/userRoles?limit=${limit}&filter=document::${docId}|email::${email}|registrationDate::${altaDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
        }
        //no tenemos fecha de alta
        else {
          if (fechaLastLogin) {
            return super.get(`/userRoles?limit=${limit}&filter=document::${docId}|email::${email}||lastLoginDate::${lastLoginDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
          //falta fecha de ultimo login
          else {
            return super.get(`/userRoles?limit=${limit}&filter=document::${docId}|email::${email}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
        }
      }
      // no tenemos DNI
      else {
        if (fechaAlta) {
          //tenemos todo
          if (fechaLastLogin) {
            return super.get(`/userRoles?limit=${limit}&filter=document::${docId}|registrationDate::${altaDate}|lastLoginDate::${lastLoginDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
          //falta fecha de ultimo login
          else {
            return super.get(`/userRoles?limit=${limit}&filter=document::${docId}|registrationDate::${altaDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
        }
        //no tenemos fecha de alta
        else {
          if (fechaLastLogin) {
            return super.get(`/userRoles?limit=${limit}&filter=document::${docId}||lastLoginDate::${lastLoginDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
          //falta fecha de ultimo login
          else {
            return super.get(`/userRoles?limit=${limit}&filter=document::${docId}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
        }
      }
    }
    // no tenemos dni
    else {
      if (email) {
        //tenemos fecha de alta
        if (fechaAlta) {
          //tenemos todo
          if (fechaLastLogin) {
            return super.get(`/userRoles?limit=${limit}&filter=email::${email}|registrationDate::${altaDate}|lastLoginDate::${lastLoginDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
          //falta fecha de ultimo login
          else {
            return super.get(`/userRoles?limit=${limit}&filter=email::${email}|registrationDate::${altaDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
        }
        //no tenemos fecha de alta
        else {
          if (fechaLastLogin) {
            return super.get(`/userRoles?limit=${limit}&filter=email::${email}||lastLoginDate::${lastLoginDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
          //falta fecha de ultimo login
          else {
            return super.get(`/userRoles?limit=${limit}&filter=email::${email}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
        }
      }
      // no tenemos DNI
      else {
        if (fechaAlta) {
          //tenemos todo
          if (fechaLastLogin) {
            return super.get(`/userRoles?limit=${limit}&filter=registrationDate::${altaDate}|lastLoginDate::${lastLoginDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
          //falta fecha de ultimo login
          else {
            return super.get(`/userRoles?limit=${limit}&filter=registrationDate::${altaDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
        }
        //no tenemos fecha de alta
        else {
          if (fechaLastLogin) {
            return super.get(`/userRoles?limit=${limit}&filter=lastLoginDate::${lastLoginDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
          //falta todo, busqueda generica
          /*else {
            return super.get(`/userRoles?limit=${limit}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }*/
        }
      }
    }
  }

  getSearchLoginUsers(docId: string, email: string, fechaAlta: Date, fechaLastLogin: Date, token: string) {
    var altaDate, lastLoginDate
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
    if (fechaLastLogin) {
      var auxMonth = (fechaLastLogin.getMonth() + 1)
      var auxDay = fechaLastLogin.getDate()
      var month = String(auxMonth)
      var day = String(auxDay)
      if (auxDay < 10) {
        day = '0' + String(auxDay)
      }
      if (auxMonth < 10) {
        month = '0' + String(auxMonth)
      }
      lastLoginDate = day + '/' + month + '/' + fechaLastLogin.getFullYear()
    }
    // sin datos busqueda generica
    if (!docId && !email && !fechaAlta && !fechaLastLogin) {
      return super.get(`/userRoles`,
        {
          'Authorization': `Bearer ${token}`
        })
    }
    //tenemos NIF
    if (docId) {
      if (email) {
        //tenemos fecha de alta
        if (fechaAlta) {
          //tenemos todo
          if (fechaLastLogin) {
            return super.get(`/userRoles?filter=document::${docId}|email::${email}|registrationDate::${altaDate}|lastLoginDate::${lastLoginDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
          //falta fecha de ultimo login
          else {
            return super.get(`/userRoles?filter=document::${docId}|email::${email}|registrationDate::${altaDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
        }
        //no tenemos fecha de alta
        else {
          if (fechaLastLogin) {
            return super.get(`/userRoles?filter=document::${docId}|email::${email}||lastLoginDate::${lastLoginDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
          //falta fecha de ultimo login
          else {
            return super.get(`/userRoles?filter=document::${docId}|email::${email}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
        }
      }
      // no tenemos DNI
      else {
        if (fechaAlta) {
          //tenemos todo
          if (fechaLastLogin) {
            return super.get(`/userRoles?filter=document::${docId}|registrationDate::${altaDate}|lastLoginDate::${lastLoginDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
          //falta fecha de ultimo login
          else {
            return super.get(`/userRoles?filter=document::${docId}|registrationDate::${altaDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
        }
        //no tenemos fecha de alta
        else {
          if (fechaLastLogin) {
            return super.get(`/userRoles?filter=document::${docId}||lastLoginDate::${lastLoginDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
          //falta fecha de ultimo login
          else {
            return super.get(`/userRoles?filter=document::${docId}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
        }
      }
    }
    // no tenemos dni
    else {
      if (email) {
        //tenemos fecha de alta
        if (fechaAlta) {
          //tenemos todo
          if (fechaLastLogin) {
            return super.get(`/userRoles?filter=email::${email}|registrationDate::${altaDate}|lastLoginDate::${lastLoginDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
          //falta fecha de ultimo login
          else {
            return super.get(`/userRoles?filter=email::${email}|registrationDate::${altaDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
        }
        //no tenemos fecha de alta
        else {
          if (fechaLastLogin) {
            return super.get(`/userRoles?filter=email::${email}||lastLoginDate::${lastLoginDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
          //falta fecha de ultimo login
          else {
            return super.get(`/userRoles?filter=email::${email}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
        }
      }
      // no tenemos DNI
      else {
        if (fechaAlta) {
          //tenemos todo
          if (fechaLastLogin) {
            return super.get(`/userRoles?filter=registrationDate::${altaDate}|lastLoginDate::${lastLoginDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
          //falta fecha de ultimo login
          else {
            return super.get(`/userRoles?filter=registrationDate::${altaDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
        }
        //no tenemos fecha de alta
        else {
          if (fechaLastLogin) {
            return super.get(`/userRoles?filter=lastLoginDate::${lastLoginDate}`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
          //falta todo, busqueda generica
          else {
            return super.get(`/userRoles`,
              {
                'Authorization': `Bearer ${token}`
              })
          }
        }
      }
    }
  }

  deleteUsers(token: string, user: string) {
    return super.post(`/callcenter/user/${user}/status`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        'enabled': false
      }
    })
  }

  updateUserRoles(token: string, user: string, roles: string[]) {
    return super.post(`/callcenter/user/${user}/roles`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        'roles': roles
      }
    })
  }
}

export default UsuariosService