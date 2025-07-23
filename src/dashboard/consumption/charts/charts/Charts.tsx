import React from 'react'

import Grid from '@material-ui/core/Grid'

import Toolbar from '../toolbar/Toolbar'
import Graph from '../graph/Graph'
import LineGraph from '../graph/LineGraph'

import useStyles from './Charts.styles'

const Charts = (props: any) => {
  const classes = useStyles({})
  const {
    setIsLoading,
    setIsExportTableDataDialog,
    currentSupplyConsumptions,
    consumptionsFilters,
    setConsumptionsFilters,
    isGeneration,
    isSelfConsumption
  } = props

  function removeDuplicates(items) {
    const seen = new Set();
    const uniqueItems = [];
  
    items.forEach((item) => {
      const key = `${item.consumptionDate}_${item.hour}_${item.consumptionValue}`;
      if (!seen.has(key)) {
        uniqueItems.push(item);
        seen.add(key);
      }
    });
  
    return uniqueItems;
  }
  
  if (currentSupplyConsumptions.consumptions) {
    if (currentSupplyConsumptions.consumptions.items) {
      currentSupplyConsumptions.consumptions.items = removeDuplicates(currentSupplyConsumptions.consumptions.items);
    }
  }

  return (
    <Grid container className={classes.container}>
      <Toolbar
        consumptionsFilters={consumptionsFilters}
        setIsExportTableDataDialog={setIsExportTableDataDialog}
        setConsumptionsFilters={setConsumptionsFilters}
      />
      {
        (currentSupplyConsumptions || currentSupplyConsumptions[0] || currentSupplyConsumptions[0].consumptions) &&
          isSelfConsumption ?
          <LineGraph
            setIsLoading={setIsLoading}
            currentSupplyConsumptions={currentSupplyConsumptions}
            consumptionsFilters={consumptionsFilters}
            setConsumptionsFilters={setConsumptionsFilters}
            isGeneration={isGeneration}
          />
          :
          <Graph
            setIsLoading={setIsLoading}
            currentSupplyConsumptions={currentSupplyConsumptions}
            consumptionsFilters={consumptionsFilters}
            setConsumptionsFilters={setConsumptionsFilters}
            isGeneration={isGeneration}
          />
      }
    </Grid>
  )
}

export default Charts
