import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import infoIcon from '../../../../../../assets/icons/info.svg'

import useStyles from './NotNecessaryAdvise.styles'

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
        <img src={infoIcon} className={classes.icon} alt='' />
      </Grid>
      <Grid item className={classes.title}>
        {t('provisions.newProvision.requestData.supplyType.modification.notNecessaryAdvise.title')}
      </Grid>
      <Grid item className={classes.subtitle}>
        {t('provisions.newProvision.requestData.supplyType.modification.notNecessaryAdvise.subtitle')}
      </Grid>
    </Grid>
  )
}

export default NotNecessaryAdvise
