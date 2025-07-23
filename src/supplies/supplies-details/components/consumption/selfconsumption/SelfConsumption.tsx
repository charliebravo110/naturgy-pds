import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import ExportTableDataDialog from '../export-dialogs/export-table-data-dialog/ExportTableDataDialog'
import ExportPeriodDataDialog from '../export-dialogs/export-period-data-dialog/ExportPeriodDataDialog'
import ExportAllDataDialog from '../export-dialogs/export-all-data-dialog/ExportAllDataDialog'
import NoConsumptionIcon from '../../../../../assets/icons/aviso_alerta_pop_up.svg'
import Navigation from '../Navigation'
import BoxConsumption from '../consumption/box/BoxConsumption'


import useStyles from './SelfConsumption.styles'

const SelfConsumption = (props: any) => {
  const [selectedTab, setSelectedTab] = useState(0)
  const classes = useStyles({})
  const currentSupplyConsumptions = useSelector((state: any) => state.supplies.currentSupplyConsumptions)
  const currentCompareConsumptions = useSelector((state: any) => state.supplies.currentCompareConsumptions)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const {
    isSelfConsumption,
    isLoading,
    setIsLoading,
    supplyData,
    consumptionsFilters,
    setConsumptionsFilters,
    supplantedUser,
    querySelfConsumption,
    billingStartDate,
    setBilingStartDate,
    billingEndDate,
    setBilingEndDate
  } = props

  const [isExportTableDataDialogOpen, setIsExportTableDataDialog] = useState(false)
  const [isExportPeriodDataDialogOpen, setIsExportPeriodDataDialog] = useState(false)
  const [isExportAllDataDialogOpen, setIsExportAllDataDialog] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [menuTabValue, setMenuTabValue] = useState(0)

  const [mode, setMode] = useState('graph')

  const handleCloseExportTableDataDialog = () => {
    setIsExportTableDataDialog(false)
  }

  const handleCloseExportPeriodDataDialog = () => {
    setIsExportPeriodDataDialog(false)
  }

  const handleCloseExportAllDataDialog = () => {
    setIsExportAllDataDialog(false)
  }

  const [energiaReactiva, setEnergiaReactiva] = useState(false)

  //const isAdapted = supplyData.measurementEquipments.meters.item.isAdapted
  const adaptedDate = supplyData.measurementEquipments.meters[0].adaptedDate
  const isAdapted = 'NO'
  //const adaptedDate = '1/06/2021'

  return (
    <Grid container className={classes.container} justifyContent='center'>
      <Grid item md={10} className={classes.maxWidthForBigScreens} >
        <ExportTableDataDialog
          supplyData={supplyData}
          currentSupplyConsumptions={currentSupplyConsumptions}
          currentCompareConsumptions={currentCompareConsumptions}
          isExportTableDataDialogOpen={isExportTableDataDialogOpen}
          closeDialog={handleCloseExportTableDataDialog}
          mode={mode}
          isGeneration={supplyData.isGenerator === '1'}
          isGenerationTab={false}
          consumptionsFilters={consumptionsFilters}
          isSelfConsumption={querySelfConsumption}
        />

        <ExportPeriodDataDialog
          supplyData={supplyData}
          supplantedUser={supplantedUser}
          isExportPeriodDataDialogOpen={isExportPeriodDataDialogOpen}
          closeDialog={handleCloseExportPeriodDataDialog}
          isGeneration={supplyData.isGenerator === '1'}
          isGenerationTab={false}
          isSelfConsumption={querySelfConsumption}
        />

        <ExportAllDataDialog
          supplyData={supplyData}
          supplantedUser={supplantedUser}
          isExportAllDataDialogOpen={isExportAllDataDialogOpen}
          closeDialog={handleCloseExportAllDataDialog}
          isGeneration={supplyData.isGenerator === '1'}
          isGenerationTab={false}
          isSelfConsumption={querySelfConsumption}
        />

        <Grid item md={12} className={classes.title}>{t('supplies.suppliesDetails.components.navigation.selfConsumption')}</Grid>
        {/* {
          supplyData.tipoDeLectura &&
          // <Navigation
          //   supplyData={supplyData}
          //   tabValue={tabValue}
          //   setTabValue={setTabValue}
          //   menuTabValue={menuTabValue}
          //   setMenuTabValue={setMenuTabValue}
          //   consumptionsFilters={consumptionsFilters}
          //   setConsumptionsFilters={setConsumptionsFilters}
          //   setEnergiaReactiva={setEnergiaReactiva}
          //   isGeneration={supplyData.isGenerator === '1'}
          //   isGenerationTab={false}
          // />
        } */}
        {
          (supplyData.measurementSystem) ?
            <>
              <Grid item md={12} className={classes.description}>
                {t('supplies.suppliesDetails.components.consumption.consumption.displaySelfConsumption2')}
              </Grid>
              <BoxConsumption
                isSelfConsumption={isSelfConsumption}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                supplyData={supplyData}
                currentSupplyConsumptions={currentSupplyConsumptions}
                currentCompareConsumptions={currentCompareConsumptions}
                setIsExportTableDataDialog={setIsExportTableDataDialog}
                setIsExportPeriodDataDialog={setIsExportPeriodDataDialog}
                setIsExportAllDataDialog={setIsExportAllDataDialog}
                consumptionsFilters={consumptionsFilters}
                setConsumptionsFilters={setConsumptionsFilters}
                mode={mode}
                setMode={setMode}
                isGeneration={supplyData.isGenerator === '1'}
                isGenerationTab={false}
                energiaReactiva={energiaReactiva}
                isAdapted={isAdapted}
                adaptedDate={adaptedDate}
                querySelfConsumption={querySelfConsumption}
                billingStartDate={billingStartDate}
                billingEndDate={billingEndDate}
              />
            </>
            :
            <div className={classes.noResults}>
              <img src={NoConsumptionIcon} className={classes.noConsumptionIcon} alt='' />
              <div className={classes.teleoperableAdviseTitle}>{t('supplies.suppliesDetails.components.consumption.charts.charts.teleoperable1')}</div>
              <div className={classes.text}>{t('supplies.suppliesDetails.components.consumption.charts.charts.teleoperable2')}</div>
            </div>
        }
      </Grid>
    </Grid>
  )
}

export default SelfConsumption
