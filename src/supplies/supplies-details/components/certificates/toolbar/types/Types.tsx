import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import useStyles from './Types.styles'

const Types = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const { type, setType } = props

  return (
    <Grid container className={classes.types}>
      <div className={classes.label}>
        {t('supplies.suppliesDetails.components.certificates.toolbar.types.label')}
      </div>

      <Grid container className={classes.items}>
        <Grid
          item
          className={`${classes.item} ${type === 'consumptions' && 'active'}`}
          onClick={() => setType('consumptions')}
        >
          {t('supplies.suppliesDetails.components.certificates.toolbar.types.items.consumptions')}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Types
