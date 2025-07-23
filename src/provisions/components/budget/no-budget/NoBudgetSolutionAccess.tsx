import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import useStyles from './NoBudgetSolutionAccess.styles'

const NoBudgetSolutionAccess = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {commentInRevision} = props  

  return (
    <Grid item container md={12} direction='column' justifyContent='center' alignItems='center' className={classes.container}>
      <Grid item className={classes.title}>
        {commentInRevision.comment1 === '' ? t('provisions.budget.noBudgetSolutionAccess.title'): commentInRevision.comment1}
      </Grid>
      <Grid item className={classes.subtitle}>
        {commentInRevision.comment2 === '' ? t('provisions.budget.noBudgetSolutionAccess.subtitle'): commentInRevision.comment2}
      </Grid>
    </Grid>
  )
}

export default NoBudgetSolutionAccess