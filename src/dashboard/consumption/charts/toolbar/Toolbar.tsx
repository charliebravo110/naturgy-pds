import React, { useState, useEffect } from 'react'

import Grid from '@material-ui/core/Grid'

import Views from '../views/Views'
import Filters from '../filters/Filters'

const Toolbar = (props: any) => {
  const {
    consumptionsFilters,
    setConsumptionsFilters,
    setIsExportTableDataDialog,
  } = props

  const [ auxStartDate, setAuxStartDate ] = useState(consumptionsFilters.startDate)
  const [ auxEndDate, setAuxEndDate ] = useState(consumptionsFilters.endDate)

  useEffect(() => {
    setAuxStartDate(consumptionsFilters.startDate)
    setAuxEndDate(consumptionsFilters.endDate)
  }, [ consumptionsFilters.startDate, consumptionsFilters.endDate ])

  return (
    <Grid container justifyContent='space-between' alignItems='flex-end'>
      <Views
        consumptionsFilters={consumptionsFilters}
        setConsumptionsFilters={setConsumptionsFilters}
        setAuxStartDate={setAuxStartDate}
        setAuxEndDate={setAuxEndDate}
      />
      <Filters
        consumptionsFilters={consumptionsFilters}
        setConsumptionsFilters={setConsumptionsFilters}
        setIsExportTableDataDialog={setIsExportTableDataDialog}
        auxStartDate={auxStartDate}
        setAuxStartDate={setAuxStartDate}
        auxEndDate={auxEndDate}
      />
    </Grid>
  )
}

export default Toolbar
