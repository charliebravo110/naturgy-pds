import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Logo from '../../../assets/img/logo.png'
import CloseIcon from '../../../assets/icons/cerrar.svg'

import useStyles from './MobileAlert.styles'

const MobileAlert = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    handleCloseMobileAlert,
    handleOpenBrowserDialog
  } = props

  return (
    <Grid container className={classes.alert}>
      <img
        className={classes.closeIcon}
        src={CloseIcon}
        alt=''
        onClick={handleCloseMobileAlert}
      />

      <Grid container className={classes.container} alignItems='center'>
        <Grid item xs={1} className={classes.logo}>
          <img src={Logo} alt='Logo' />
        </Grid>

        <Grid item xs={9} className={classes.label} onClick={handleOpenBrowserDialog}>
          {t('login.mobileAlert.label')}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default MobileAlert
