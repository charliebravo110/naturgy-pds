import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import TopLegend from '../legend/TopLegend'
import useStyles from './Downloads.styles'
import ToolbarConsumption from '../toolbar/ToolbarConsumption'
import ActionsConsumption from '../actions/ActionsConsumption'
import Spinner from '../../../../../../common/components/spinner/Spinner'


const DownloadsConsumption = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const mobileRes = useMediaQuery('(max-width:576px)')
  //const [autoConsumption, setAutoConsumption] = useState<boolean>(true)
  const [isLoadingSpinner, setIsLoadingSpinner] = useState<boolean>(false);


  const {
    toggle,
    setIsLoading,
    supplyData,
    currentSupplyConsumptions,
    setIsExportTableDataDialog,
    setIsExportPeriodDataDialog,
    setIsExportAllDataDialog,
    consumptionsFilters,
    setConsumptionsFilters,
    mode,
    setMode,
    isGeneration,
    isGenerationTab,
    energiaReactiva,
    isAdapted,
    adaptedDate,
    querySelfConsumption,
    billingStartDate,
    billingEndDate
  } = props

  const [downLoadFilters, setDownLoadFilters] = useState({
    //difernetes tipos de descargas:
    //entre dos fechas: "periodo"
    // meses: "meses" (solo gmv10)
    //periodo de facturación: "facturacion" (solo ODI)
    // últimos 24 meses: "24meses"
    tipo: 'periodo',
    // granuralidad:
    // horaria 'H'
    // 1/2 horaria 'Q'
    granularity:'H',
    startDate: '',
    endDate: '',
    //O -> ODI
    //G -> Gmv10
    measurementSystem:supplyData.measurementSystem
  })
  const tipoUsuario = supplyData.rate.toString().includes('2.') ? 'simple' : 'complejo'

  return (
    <>
      <Grid container className={classes.container} item md={12}>
      <ToolbarConsumption
        setIsLoading={setIsLoading}
        downLoadFilters={downLoadFilters}
        setDownLoadFilters={setDownLoadFilters}
        supplyData={supplyData}
        mode={mode}
        setMode={setMode}
        consumptionsFilters={consumptionsFilters}
        setConsumptionsFilters={setConsumptionsFilters}
        setIsExportTableDataDialog={setIsExportTableDataDialog}
        setIsExportPeriodDataDialog={setIsExportPeriodDataDialog}
        setIsExportAllDataDialog={setIsExportAllDataDialog}
        isGeneration={isGeneration}
        isGenerationTab={isGenerationTab}
        currentSupplyConsumptions={currentSupplyConsumptions}
        selfConsumption={querySelfConsumption}
      />

      <ActionsConsumption
        toggle={toggle}
        setIsLoading={setIsLoading}
        downLoadFilters={downLoadFilters}
        setDownLoadFilters={setDownLoadFilters}
        supplyData={supplyData}
        mode={mode}
        setMode={setMode}
        consumptionsFilters={consumptionsFilters}
        setConsumptionsFilters={setConsumptionsFilters}
        setIsExportTableDataDialog={setIsExportTableDataDialog}
        setIsExportPeriodDataDialog={setIsExportPeriodDataDialog}
        setIsExportAllDataDialog={setIsExportAllDataDialog}
        isGeneration={isGeneration}
        isGenerationTab={isGenerationTab}
        currentSupplyConsumptions={currentSupplyConsumptions}
        autoConsumption={querySelfConsumption}
        billingStartDate={billingStartDate}
        billingEndDate={billingEndDate}
      />

       {
        ((currentSupplyConsumptions[0] && currentSupplyConsumptions[0].consumptions && consumptionsFilters.compare === 'C') || (currentSupplyConsumptions && currentSupplyConsumptions.consumptions && consumptionsFilters.compare === 'C')) &&
        <TopLegend
          supplyData={supplyData}
          currentSupplyConsumptions={currentSupplyConsumptions}
          isGeneration={isGeneration}
          isGenerationTab={isGenerationTab}
          consumptionsFilters={consumptionsFilters}
          energiaReactiva={energiaReactiva}
          isAdapted={isAdapted}
          adaptedDate={adaptedDate}
          tipoUsuario={tipoUsuario}
        />
      }

    </Grid>
       </>
    //Toolbar de consumos

  )
}

export default DownloadsConsumption
