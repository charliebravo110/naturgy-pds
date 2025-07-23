
export interface DialogRattingProps {
  isOpen?: boolean
  handleOk?: () => Promise<void>
  handleCancel?: () => Promise<void>
  title?: string
  description?: string
  okButtonText?: string
  cancelButtonText?: string
}
