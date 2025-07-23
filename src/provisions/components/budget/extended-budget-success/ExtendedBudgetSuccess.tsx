import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import OkIcon from '../../../../assets/icons/aviso_ok.svg'

import useStyles from './ExtendedBudgetSuccess.styles'

const ExtendedBudgetSuccess = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  return (
    <Grid container justifyContent='center' alignItems='center' className={classes.container}>
      <Grid
        container
        direction='column'
        justifyContent='center'
        alignItems='center'
        md={6}
        sm={8}
        xs={9}
        spacing={1}
      >
        <Grid item>
          <img src={OkIcon} alt='' />
        </Grid>

        <Grid item className={classes.title}>
          {t('provisions.budget.extendedBudgetSuccess.title')}
        </Grid>

        <Grid item className={classes.subTitle}>
          {t('provisions.budget.extendedBudgetSuccess.subtitle')}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ExtendedBudgetSuccess
