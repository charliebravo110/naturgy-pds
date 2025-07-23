import React from 'react'
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core'
import { DialogBiometryProps } from './interfaces'
import ico_biometry_fingerprint from '../../../assets/icons/ico_biometry_fingerprint.svg'
import ico_biometry_face from '../../../assets/icons/ico_biometry_face.svg'
import useStyles from './DialogBiometry.styles'

export default function DialogBiometry(props: DialogBiometryProps) {
  const { isOpen, handleOk, handleCancel, title, description, okButtonText, cancelButtonText, iconType } = props
  const classes = useStyles()
  return (
    <Dialog className={classes.dialog} open={isOpen}>
      <DialogContent>
        <h2>{title}</h2>
        <p>{description}</p>
        {iconType && (
          <img src={iconType === 'face' ? ico_biometry_face : ico_biometry_fingerprint} alt='biometry-type' />
        )}
        <DialogActions>
          {/* cancel button is optional */}
          {cancelButtonText && (
            <Button color='primary' onClick={handleCancel}>
              {cancelButtonText || 'Cancelar'}
            </Button>
          )}
          <Button color='primary' onClick={handleOk}>
            {okButtonText || 'Aceptar'}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
