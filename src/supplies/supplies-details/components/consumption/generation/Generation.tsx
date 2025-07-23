import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import ExportTableDataDialog from '../export-dialogs/export-table-data-dialog/ExportTableDataDialog'
import ExportPeriodDataDialog from '../export-dialogs/export-period-data-dialog/ExportPeriodDataDialog'
import ExportAllDataDialog from '../export-dialogs/export-all-data-dialog/ExportAllDataDialog'
import Charts from '../charts/charts/Charts'

import { setUrlMessagesDetail, setUrlMessagesSupplyDataGenerationTabValue } from '../../../../../common/components/send-url/store/actions/UrlMessagesActions'
import { adminCheck } from '../../../../../common/lib/ValidationLib'

import Navigation from '../Navigation'

import useStyles from './Generation.styles'

const Generation = (props: any) => {
  const classes = useStyles({})
  const currentSupplyConsumptions = useSelector((state: any) => state.supplies.currentSupplyConsumptions)
  const currentCompareConsumptions = useSelector((state: any) => state.supplies.currentCompareConsumptions)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const {
    isLoading,
    setIsLoading,
    supplyData,
    consumptionsFilters,
    setConsumptionsFilters,
    supplantedUser,
    querySelfConsumption,
    navBarTabValue,
    tabValueFromURL
  } = props

  const [ isExportTableDataDialogOpen, setIsExportTableDataDialog ] = useState(false)
  const [ isExportPeriodDataDialogOpen, setIsExportPeriodDataDialog ] = useState(false)
  const [ isExportAllDataDialogOpen, setIsExportAllDataDialog ] = useState(false)
  const [ tabValue, setTabValue ] = useState(0)
  const [ menuTabValue, setMenuTabValue ] = useState(0)
  // const generationTabValue = useSelector((state: any) => state.urlMessages.supplyData.generationTabValue)

  const [ mode, setMode ] = useState('graph')

  const handleCloseExportTableDataDialog = () => {
    setIsExportTableDataDialog(false)
  }

  const handleCloseExportPeriodDataDialog = () => {
    setIsExportPeriodDataDialog(false)
  }

  const handleCloseExportAllDataDialog = () => {
    setIsExportAllDataDialog(false)
  }

  const [ energiaReactiva, setEnergiaReactiva]  = useState(false)

  // PPM 1007560 Si el cliente accede mediante la url recibida por email/sms, seteamos estos valores para navegar a la pantalla correcta
  useEffect(() => {
    if (!adminCheck() && (tabValueFromURL || tabValueFromURL === '0') && tabValueFromURL !== '') {
      setTabValue(parseInt(tabValueFromURL))
      setMenuTabValue(parseInt(tabValueFromURL))
    }
  }, [tabValueFromURL])

  // PPM 1007560 Suplantando como admin, se setean los valores de la pantalla en redux para poder generar la URL que mandaremos al cliente para que acceda a la pantalla
  useEffect(() => {
    if (adminCheck() && navBarTabValue === 1) {
      dispatch(setUrlMessagesSupplyDataGenerationTabValue(tabValue.toString()))
      // tabValue = 0 - Energía generada
      if (tabValue === 0) {
        dispatch(setUrlMessagesDetail('SUPPLIES_GENERATION_EG'))
      }
      // tabValue = 1 - Energía Reactiva Generada
      else if (tabValue === 1) {
        dispatch(setUrlMessagesDetail('SUPPLIES_GENERATION_ERG'))
      }
      // tabValue = 2 - Energía Reactiva Consumida
      else if (tabValue === 2) {
        dispatch(setUrlMessagesDetail('SUPPLIES_GENERATION_ERC'))
      }           
    }
  }, [tabValue, navBarTabValue])

  return (
    <Grid container className={classes.container} justifyContent='center'>
      <Grid item md={10} className={classes.maxWidthForBigScreens}>
        <ExportTableDataDialog
          supplyData={supplyData}
          currentSupplyConsumptions={currentSupplyConsumptions}
          currentCompareConsumptions={currentCompareConsumptions}
          isExportTableDataDialogOpen={isExportTableDataDialogOpen}
          closeDialog={handleCloseExportTableDataDialog}
          mode={mode}
          isGeneration={supplyData.isGenerator === '1'}
          isGenerationTab={true}
          consumptionsFilters={consumptionsFilters}
        />

        <ExportPeriodDataDialog
          supplyData={supplyData}
          supplantedUser={supplantedUser}
          isExportPeriodDataDialogOpen={isExportPeriodDataDialogOpen}
          closeDialog={handleCloseExportPeriodDataDialog}
          consumptionsFilters={consumptionsFilters}
          isGeneration={supplyData.isGenerator === '1'}
          isGenerationTab={true}
        />

        <ExportAllDataDialog
          supplyData={supplyData}
          supplantedUser={supplantedUser}
          isExportAllDataDialogOpen={isExportAllDataDialogOpen}
          closeDialog={handleCloseExportAllDataDialog}
          isGeneration={supplyData.isGenerator === '1'}
          isGenerationTab={true}
        />

        <Grid item md={12} className={classes.title}>{t('supplies.suppliesDetails.components.consumption.consumption.generation')}</Grid>

        <Navigation
          supplyData={supplyData}
          tabValue={tabValue}
          setTabValue={setTabValue}
          menuTabValue={menuTabValue}
          setMenuTabValue={setMenuTabValue}
          consumptionsFilters={consumptionsFilters}
          setConsumptionsFilters={setConsumptionsFilters}
          setEnergiaReactiva={setEnergiaReactiva}
          isGeneration={supplyData.isGenerator === '1'}
          isGenerationTab={true}
          tabValueFromURL={tabValueFromURL}
        />
          <>
            <Grid item md={12} className={classes.description}>{t('supplies.suppliesDetails.components.consumption.consumption.displayGeneration')}</Grid>

            <Charts
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
              isGenerationTab={true}
              energiaReactiva={energiaReactiva}
              querySelfConsumption={querySelfConsumption}
            />
          </>
          
            {/*<>
              <GenerationGMv10
                setIsLoading={setIsLoading}
                supplyData={supplyData}
                supplantedUser={supplantedUser}
                isGeneration={supplyData.isGenerator === '1'}
                isGenerationTab={true}
                titulo={titulo}
                setTitulo={setTitulo}
                consumptionsFilters={consumptionsFilters}
                setConsumptionsFilters={setConsumptionsFilters}
              />
            </>*/}
        
      </Grid>
    </Grid>
  )
}

export default Generation
