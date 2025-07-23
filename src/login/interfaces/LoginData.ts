export interface LoginData {
  user: string
  password?: string
  email?: string
  phone?: string
  userId?: string
  mfa_code?: string
  rememberCheck?: boolean
}

export default LoginData
