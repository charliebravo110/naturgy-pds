import React from 'react'
import { useTranslation } from 'react-i18next'

import { DialogContent } from '@material-ui/core'

import Dialog from '../../../../common/components/dialog/Dialog'
import Button from '../../../../common/components/button/Button'
import CloseIcon from '../../../../assets/icons/cerrar.svg'

import Banner from '../../../../assets/img/detalle_factura.png'

import useStyles from './Dialog.styles'

const Modal = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    showingDialog,
    closeDialog
  } = props

  const handleCloseDialog = () => {
    closeDialog(false)
  }

  return (
    <Dialog className={classes.dialog} open={showingDialog} onClose={handleCloseDialog} {...props}>
      <DialogContent className={classes.container}>
        <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleCloseDialog} />

        <div className={classes.title}>{t('supplies.suppliesVinculation.components.dialog.title')}</div>

        <div className={classes.description}>{t('supplies.suppliesVinculation.components.dialog.description')}</div>

        <img className={classes.banner} src={Banner} alt='' />

        <Button
          className={classes.button}
          text={t('common.buttons.close')}
          color='primary'
          size='large'
          variant='contained'
          onClick={handleCloseDialog}
        />
      </DialogContent>
    </Dialog>
  )
}

export default Modal
