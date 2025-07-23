import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import useStyles from './NoBudget.styles'

const NoBudget = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  return (
    <Grid item container md={12} direction='column' justifyContent='center' alignItems='center' className={classes.container}>
      <Grid item className={classes.title}>
        {t('provisions.budget.noBudget.title')}
      </Grid>
      <Grid item className={classes.subtitle}>
        {t('provisions.budget.noBudget.subtitle')}
      </Grid>
    </Grid>
  )
}

export default NoBudget
