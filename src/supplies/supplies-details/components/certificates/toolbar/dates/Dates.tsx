import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Datepicker from '../../../../../../common/components/datepicker/Datepicker'

import useStyles from './Dates.styles'

const Dates = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate
  } = props

  return (
    <Grid container className={classes.dates}>
      <Grid item className={classes.date} md='auto' sm={12} xs={12}>
        <div className={classes.label}>
          {t('supplies.suppliesDetails.components.certificates.toolbar.dates.start')}
        </div>

        <Datepicker date={startDate} setDate={setStartDate} maxDate={endDate} />
      </Grid>

      <Grid item className={classes.date} md='auto' sm={12} xs={12}>
        <div className={classes.label}>
          {t('supplies.suppliesDetails.components.certificates.toolbar.dates.end')}
        </div>

        <Datepicker date={endDate} setDate={setEndDate} minDate={startDate} />
      </Grid>
    </Grid>
  )
}

export default Dates
