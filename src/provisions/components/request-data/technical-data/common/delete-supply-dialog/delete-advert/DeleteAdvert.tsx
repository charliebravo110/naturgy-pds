import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import AlertIcon from '../../../../../../../assets/icons/aviso_alerta_pop_up.svg'
import Button from '../../../../../../../common/components/button/Button'

import useStyles from './DeleteAdvert.styles'

const DeleteAdvert = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    powerList,
    setPowerListI,
    powerListErrors,
    setPowerListErrors,
    supplyIndex,
    setPopup,
    setDialogState
  } = props

  const handleAccept = () => {
    setPowerListI(powerList.filter((item, i) => i !== supplyIndex))
    setPowerListErrors(powerListErrors.filter((item, i) => i !== supplyIndex))
    setPopup(false)
    setDialogState(1)
    setPopup(true)
  }

  const handleCancel = () => {
    setPopup(false)
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
              <img src={AlertIcon} alt='' />
            </Grid>
            <Grid item className={classes.title}>
              {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.deleteSupplyModal.deleteAdvert.title')}
            </Grid>
            <Grid item className={classes.text}>
              {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.deleteSupplyModal.deleteAdvert.text')}
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container justifyContent='center'>
            <Button
              className={classes.button}
              text={t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.deleteSupplyModal.buttons.cancel')}
              color='inherit'
              size='large'
              variant='outlined'
              onClick={handleCancel}
            />
            <Button
              className={classes.button}
              text={t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.deleteSupplyModal.buttons.accept')}
              color='primary'
              size='large'
              variant='contained'
              onClick={handleAccept}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default DeleteAdvert
