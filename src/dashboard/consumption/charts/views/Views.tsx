import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import { formatDate } from '../../../../common/lib/FormatLib'
import useStyles from './Views.styles'

import {
  setCurrentSupplyConsumptions
} from '../../../../supplies/store/actions/SuppliesActions'

const Views = (props: any) => {
  const dispatch = useDispatch()
  const classes = useStyles({})
  const { t } = useTranslation()
  const {
    consumptionsFilters,
    setConsumptionsFilters,
    setAuxStartDate,
    setAuxEndDate
  } = props

  const handleChangeGranularity = (granularity: string) => {

    let auxStartDate
    let auxEndDate = new Date()
    auxEndDate.setDate(auxEndDate.getDate())
    dispatch(setCurrentSupplyConsumptions([]))

    if (granularity === 'M') {
      auxStartDate = new Date(auxEndDate.getFullYear(), auxEndDate.getMonth() - 6, 1)
    } else if (granularity === 'D') {
      let today = new Date().getDate()
      if (today === 1) {
        auxStartDate = new Date(auxEndDate.getFullYear(), auxEndDate.getMonth() - 1, 1)
        auxEndDate = new Date(auxEndDate.getFullYear(), auxEndDate.getMonth(), 0)
      } else {
        auxStartDate = new Date(auxEndDate.getFullYear(), auxEndDate.getMonth(), 1)
      }
    } else if (granularity === 'H') {
      auxStartDate = auxEndDate
    }

    setAuxStartDate(formatDate(auxStartDate))
    setAuxEndDate(formatDate(auxEndDate))

    setConsumptionsFilters({
      ...consumptionsFilters,
      granularity,
      startDate: formatDate(auxStartDate),
      endDate: formatDate(auxEndDate)
    })
  }

  return (
    <Grid container className={classes.container}>
      <Grid
        item
        className={`${classes.menuItem} ${consumptionsFilters.granularity === 'M' && 'active'}`}
        onClick={() => handleChangeGranularity('M')}
      >
        {t('supplies.suppliesDetails.components.consumption.charts.views.months')}
      </Grid>
      <Grid
        item
        className={`${classes.menuItem} ${consumptionsFilters.granularity === 'D' && 'active'}`}
        onClick={() => handleChangeGranularity('D')}
      >
        {t('supplies.suppliesDetails.components.consumption.charts.views.days')}
      </Grid>
      <Grid
        item
        className={`${classes.menuItem} ${consumptionsFilters.granularity === 'H' ? 'active' : ''}`}
        onClick={() => handleChangeGranularity('H')}
      >
        {t('supplies.suppliesDetails.components.consumption.charts.views.hours')}
      </Grid>
    </Grid>
  )
}

export default Views
