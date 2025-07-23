import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Toolbar from '../toolbar/Toolbar'
import Actions from '../actions/Actions'
import Graph from '../graph/Graph'
import LineGraph from '../lineGraph/LineGraph'
import Table from '../table/Table'
import EnergyTable from '../energyTable/EnergyTable'
import TopLegend from '../legend/TopLegend'
import Downloads from '../downloads/Downloads'
import NoConsumptionIcon from '../../../../../../assets/icons/aviso_alerta_pop_up.svg'

import useStyles from './Charts.styles'

const Charts = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const mobileRes = useMediaQuery('(max-width:576px)')
  //const [autoConsumption, setAutoConsumption] = useState<boolean>(true)

  const {
    setIsLoading,
    supplyData,
    currentSupplyConsumptions,
    currentCompareConsumptions,
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
    querySelfConsumption
  } = props

  const tipoUsuario = supplyData.rate.toString().includes('2.') ? 'simple' : 'complejo'
  const [showingDialog, setShowingDialog] = useState(false)

  return (
    <Grid container className={classes.container} item md={12}>
      <Toolbar
        setIsLoading={setIsLoading}
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
        showingDialog={showingDialog}
        setShowingDialog={setShowingDialog}
      />

      <Actions
        setIsLoading={setIsLoading}
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
        showingDialog={showingDialog}
        setShowingDialog={setShowingDialog}
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
      {
        ((querySelfConsumption === false) && ((!currentSupplyConsumptions || !currentSupplyConsumptions[0] || !currentSupplyConsumptions[0].consumptions) && (!currentSupplyConsumptions || !currentSupplyConsumptions.consumptions))) ?
          <div className={classes.noResults}>
            <img src={NoConsumptionIcon} className={classes.icon} alt='' />

            <div className={classes.text}>{t('supplies.suppliesDetails.components.consumption.charts.charts.text')}</div>
          </div>
          :
          ((querySelfConsumption === true) && (currentSupplyConsumptions.length === 0)) ?
            <div className={classes.noResults}>
              <img src={NoConsumptionIcon} className={classes.icon} alt='' />

              <div className={classes.text}>{t('supplies.suppliesDetails.components.consumption.charts.charts.text')}</div>
            </div>
            :
            mode === 'graph' || mode === undefined ?
              querySelfConsumption && supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' ?
                <LineGraph
                  setIsLoading={setIsLoading}
                  currentSupplyConsumptions={currentSupplyConsumptions}
                  currentCompareConsumptions={currentCompareConsumptions}
                  consumptionsFilters={consumptionsFilters}
                  autoConsumption={querySelfConsumption}
                  supplyData={supplyData}
                />
                :
                <Graph
                  setIsLoading={setIsLoading}
                  currentSupplyConsumptions={currentSupplyConsumptions}
                  currentCompareConsumptions={currentCompareConsumptions}
                  consumptionsFilters={consumptionsFilters}
                  setConsumptionsFilters={setConsumptionsFilters}
                  isGeneration={isGeneration}
                  isGenerationTab={isGenerationTab}
                  energiaReactiva={energiaReactiva}
                  isAdapted={isAdapted}
                  adaptedDate={adaptedDate}
                  tipoUsuario={tipoUsuario}
                  supplyData={supplyData}
                />
              :
              querySelfConsumption && supplyData.isSelfConsumption ?
                <EnergyTable
                  currentSupplyConsumptions={currentSupplyConsumptions}
                  currentCompareConsumptions={currentCompareConsumptions}
                  consumptionsFilters={consumptionsFilters}
                  isGeneration={isGeneration}
                  isGenerationTab={isGenerationTab}
                  energiaReactiva={energiaReactiva}
                  autoConsumption={querySelfConsumption}
                  mode={'table'}
                />
                :
                <Table
                  currentSupplyConsumptions={currentSupplyConsumptions}
                  currentCompareConsumptions={currentCompareConsumptions}
                  consumptionsFilters={consumptionsFilters}
                  isGeneration={isGeneration}
                  isGenerationTab={isGenerationTab}
                  isAdapted={isAdapted}
                  adaptedDate={adaptedDate}
                  energiaReactiva={energiaReactiva}
                  tipoUsuario={tipoUsuario}
                  supplyData={supplyData}
                />
      }

      {
        mobileRes &&
        <Downloads
          supplyData={supplyData}
          mode={mode}
          setIsExportTableDataDialog={setIsExportTableDataDialog}
          setIsExportPeriodDataDialog={setIsExportPeriodDataDialog}
          setIsExportAllDataDialog={setIsExportAllDataDialog}
          isGeneration={isGeneration}
          isGenerationTab={isGenerationTab}
          autoConsumption={querySelfConsumption}
        />
      }

      <Grid container className={classes.paragraphs}>
        {supplyData.remoteManagementDate && supplyData.measurementSystem === 'O' && <p>{t('supplies.suppliesDetails.components.consumption.charts.legend.incorporationDate')} {supplyData.remoteManagementDate}</p>}

        {supplyData.tipoDeLectura !== 'TELEOPERABLE' && <p>{t('supplies.suppliesDetails.components.consumption.charts.legend.provisionalMeasures')}</p>}
      </Grid>

    </Grid>
  )
}

export default Charts
