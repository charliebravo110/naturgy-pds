interface UserProfile {
  userId?: number
  documentNumber?: string
  documentType?: string
  email?: string
  name?: string
  surName?: string
  phone?: string,
  password?: string,
  roles?: string,
  enabled?: any,
  gdprAccepted?: any,
  franjaInicio?:any
  franjaFin?:any
  franjaInicioEspecial?:any
  franjaFinEspecial?:any
  tipoCanal?:any
  destinatario?:any
}

export default UserProfile
