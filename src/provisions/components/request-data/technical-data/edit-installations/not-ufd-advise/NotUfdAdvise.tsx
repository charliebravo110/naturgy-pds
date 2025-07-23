import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import alertIcon from '../../../../../../assets/icons/aviso_alerta_pop_up.svg'

import useStyles from './NotUfdAdvise.styles'

const NotNecessaryAdvise = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  return (
    <Grid 
      container
      alignItems='center'
      justifyContent='center'
      direction='column'
      spacing={2}
      className={classes.container}
    >
      <Grid item>
        <img src={alertIcon} className={classes.icon} alt='' />
      </Grid>
      <Grid item className={classes.title} md={10}>
        {t('provisions.editInstallations.requestData.notUfdAdvise.title')}
      </Grid>
    </Grid>
  )
}

export default NotNecessaryAdvise
