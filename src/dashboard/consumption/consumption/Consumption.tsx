import React from 'react'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'

import Charts from '../charts/charts/Charts'
import useStyles from './Consumption.styles'

const Consumption = (props: any) => {

  const {
    setIsLoading,
    consumptionsFilters,
    setIsExportTableDataDialog ,
    setConsumptionsFilters,
    isGeneration,
    isSelfConsumption
  } = props

  const classes = useStyles({})

  const currentSupplyConsumptions = useSelector((state: any) => state.supplies.currentSupplyConsumptions)
  
  return (
    <Grid container className={classes.container} justifyContent='center'>
      <Grid item md={10} className={classes.maxWidthForBigScreens} >
        <Charts
          setIsLoading={setIsLoading}
          setIsExportTableDataDialog={setIsExportTableDataDialog}
          currentSupplyConsumptions={currentSupplyConsumptions}
          consumptionsFilters={consumptionsFilters}
          setConsumptionsFilters={setConsumptionsFilters}
          isGeneration={isGeneration}
          isSelfConsumption={isSelfConsumption}
        />
      </Grid>
    </Grid>
  )
}

export default Consumption
