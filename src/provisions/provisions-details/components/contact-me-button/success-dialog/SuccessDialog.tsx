import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import { DialogContent, DialogContentText, DialogActions } from '@material-ui/core'

import CloseIcon from '../../../../../assets/icons/cerrar.svg'
import OkIcon from '../../../../../assets/icons/aviso_ok.svg'

import Dialog from '../../../../../common/components/dialog/Dialog'
import Button from '../../../../../common/components/button/Button'

import useStyles from './SuccessDialog.styles'

const SuccessDialog = (props: any) => {
  const classes = useStyles({})

  const { t } = useTranslation()

  const {
    showingDialog,
    handleReturn,
    srCode
  } = props

  return (
    <Dialog
      open={showingDialog}
      onClose={handleReturn}
      className={classes.dialog}
    >
      <DialogContent className={classes.container}>
        <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleReturn} />

        <DialogContentText>
          <Grid container className={classes.content} direction='column' spacing={3} alignItems='center' justifyContent='center'>
            <Grid item>
              <img src={OkIcon} alt='' />
            </Grid>

            <Grid item className={classes.title}>
              {t('provisions.provisionsDetails.contactMe.successDialog.title')}
            </Grid>

            <Grid item className={classes.srCode}>
              {t('provisions.provisionsDetails.contactMe.successDialog.srCode')} <strong>{srCode}</strong>
            </Grid>
          </Grid>
        </DialogContentText>

        <DialogActions>
          <Grid container alignItems='center' justifyContent='center'>
            <Button
              text='Aceptar'
              color='primary'
              size='large'
              variant='contained'
              onClick={handleReturn}
            />
          </Grid>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export default SuccessDialog
