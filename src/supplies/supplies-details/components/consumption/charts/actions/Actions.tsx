import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Mode from '../mode/Mode'
import useStyles from './Actions.styles'
import Filters from '../filters/Filters'
import InfoIcon from '../../../../../../assets/icons/ico_info.svg'

const Actions = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()
  const {
    mode,
    setMode,
    setIsExportTableDataDialog,
    consumptionsFilters,
    setConsumptionsFilters,
    isGeneration,
    isGenerationTab,
    currentSupplyConsumptions,
    autoConsumption,
    supplyData,
    showingDialog,
    setShowingDialog
  } = props

  const [ auxStartDate, setAuxStartDate ] = useState(consumptionsFilters.startDate)
  const [ auxEndDate, setAuxEndDate ] = useState(consumptionsFilters.endDate)

  useEffect(() => {
    setAuxStartDate(consumptionsFilters.startDate)

    setAuxEndDate(consumptionsFilters.endDate)
  }, [ consumptionsFilters.startDate, consumptionsFilters.endDate ])

  return (
    <>
      <Grid container spacing={2} className={classes.container}>
        <Filters
          consumptionsFilters={consumptionsFilters}
          setIsExportTableDataDialog={setIsExportTableDataDialog}
          setConsumptionsFilters={setConsumptionsFilters}
          auxStartDate={auxStartDate}
          setAuxStartDate={setAuxStartDate}
          auxEndDate={auxEndDate}
          setAuxEndDate={setAuxEndDate}
          isGeneration={isGeneration}
          isGenerationTab={isGenerationTab}
          currentSupplyConsumptions={currentSupplyConsumptions}
          autoConsumption={autoConsumption}
          supplyData={supplyData}
          mode={mode}
          showingDialog={showingDialog}
          setShowingDialog={setShowingDialog}
        />
       
       {/* <Grid item style={{marginLeft: 'auto', marginTop: 'auto'}}>
          <Mode mode={mode} setMode={setMode} />
        </Grid> */}
      </Grid>
      { (supplyData.tipoDeLectura === 'TELEOPERABLE') &&
        <Grid container className={classes.containerteleoperable}>
          <Grid item className={classes.text}>
            <img className={classes.icon} src={InfoIcon} alt='' />
            <span className={classes.message}><b>{t('supplies.suppliesDetails.components.consumption.consumption.displayConsumptionteleoperable')}</b></span>
          </Grid>
        </Grid>
      }
    
    </>
  )
}

export default Actions
