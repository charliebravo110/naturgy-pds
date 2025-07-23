import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import TuluzIcon from '../../../assets/img/tuluz.png'

import useStyles from './TuluzAlert.styles'

const TuluzAlert = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  return (
    <Grid
      container
      justifyContent='center'
      alignItems='center'
    >
      <Grid container className={classes.container}>
        <Grid item className={classes.icon} md='auto' sm={12} xs={12}>
          <img src={TuluzIcon} alt='' />
        </Grid>

        <Grid container item xs={12} sm={12} md={10}>
          <Grid item className={classes.title}>{t('login.tuluz.notActive')}</Grid>

          <Grid item>{t('login.tuluz.management')}</Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default TuluzAlert
