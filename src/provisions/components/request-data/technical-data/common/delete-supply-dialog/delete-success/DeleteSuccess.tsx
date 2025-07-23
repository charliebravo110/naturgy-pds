import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import OkIcon from '../../../../../../../assets/icons/aviso_ok.svg'
import Button from '../../../../../../../common/components/button/Button'

import useStyles from './DeleteSuccess.styles'

const DeleteSuccess = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    setPopup,
    setDialogState
  } = props

  const handleClose = () => {
    setPopup(false)
    setDialogState(0)
  }

  return (
    <Grid container justifyContent='center' alignItems='center' className={classes.container}>
      <Grid
        container
        direction='column'
        justifyContent='space-between'
        alignItems='center'
        spacing={6}
      >
        <Grid item>
          <Grid container direction='column' justifyContent='center' alignItems='center' spacing={2}>
            <Grid item>
              <img src={OkIcon} alt='' />
            </Grid>
            <Grid item className={classes.title}>
              {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.deleteSupplyModal.deleteSuccess.title')}
            </Grid>
            <Grid item className={classes.text}>
              {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.deleteSupplyModal.deleteSuccess.text')}
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container justifyContent='center'>
            <Button
              className={classes.button}
              text={t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.deleteSupplyModal.buttons.close')}
              color='primary'
              size='large'
              variant='contained'
              onClick={handleClose}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default DeleteSuccess
