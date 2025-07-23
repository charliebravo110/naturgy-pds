import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import { DialogContent, DialogContentText, DialogActions } from '@material-ui/core'

import CloseIcon from '../../../../assets/icons/cerrar.svg'
import OkIcon from '../../../../assets/icons/aviso_ok.svg'

import Dialog from '../../../../common/components/dialog/Dialog'
import Button from '../../../../common/components/button/Button'

import useStyles from './StormWarningSuccessDialog.styles'

const StormWarningSuccessDialog = (props: any) => {
  const classes = useStyles({})

  const { t } = useTranslation()

  const {
    showingDialog,
    handleReturn,
    stormWarningSrCode
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
              {t('supplies.suppliesDetails.components.stormWarningSuccessDialog.title')}
            </Grid>

            {
              (stormWarningSrCode && stormWarningSrCode !== '') &&
                <Grid item className={classes.srCode}>
                  {t('supplies.suppliesDetails.components.stormWarningSuccessDialog.srCode')} <strong>{stormWarningSrCode}</strong>
                </Grid>
            }
          </Grid>
        </DialogContentText>

        <DialogActions>
          <Grid container className={classes.button} alignItems='center' justifyContent='center'>
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

export default StormWarningSuccessDialog
