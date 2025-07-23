import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { hasNotUserPermissions } from '../lib/UserPermissionsLib'

export const SecurityHOC = (WrappedComponent) => {
  return class extends Component {
    render() {
      let userRoles = sessionStorage.getItem('userRoles') || ''
      let gdprAccepted = sessionStorage.getItem('gdprAccepted') || ''

      let userRolesArray = userRoles.split(',')

      if (hasNotUserPermissions()) {
        const redirectTo = userRolesArray.includes('US_CC') ? '/admin' : '/login'

        return <Redirect to={redirectTo} />
      }

      if (window.location.pathname !== '/gdpr' && gdprAccepted === '0') {
        return <Redirect to='/gdpr' />
      }
      return <WrappedComponent {...this.props} />
    }
  }
}
