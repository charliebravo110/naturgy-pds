export interface SignUpFormData {
  username: string
  password: string
  documentNumber: string
  name: string
  surname: string
  phone: string
  email: string
  gdprAccepted: boolean,
  isDefaultEmailChanged: boolean,
  checkEmail: boolean,
  checkDocument: boolean,
  userIP: string,
  indDeleteRights: string,
  altaUsuario: string,
  acceptRightDate: string

}

export default SignUpFormData
