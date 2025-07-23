import { FaceOrFingerprint } from '../../nativeBiometricFunctionality'

export interface ButtonBiometryProps {
  handleButtonClick?: () => Promise<void>
  showBtn?: boolean
  disableBtn?: boolean
  iconType?: FaceOrFingerprint
}

export interface DialogBiometryProps {
  isOpen?: boolean
  handleOk?: () => Promise<void>
  handleCancel?: () => Promise<void>
  title?: string
  description?: string
  okButtonText?: string
  cancelButtonText?: string
  iconType?: FaceOrFingerprint
}
