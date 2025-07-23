import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import ExportTableDataDialog from '../export-dialogs/export-table-data-dialog/ExportTableDataDialog'
import ExportPeriodDataDialog from '../export-dialogs/export-period-data-dialog/ExportPeriodDataDialog'
import ExportAllDataDialog from '../export-dialogs/export-all-data-dialog/ExportAllDataDialog'
import NoConsumptionIcon from '../../../../../assets/icons/aviso_alerta_pop_up.svg'
import Navigation from '../Navigation'

import { setUrlMessagesDetail, setUrlMessagesSupplyDataConsumptionTabValue } from '../../../../../common/components/send-url/store/actions/UrlMessagesActions'
import { adminCheck } from '../../../../../common/lib/ValidationLib'

import useStyles from './Consumption.styles'
import BoxConsumption from './box/BoxConsumption'
import InfoIcon from '../../../../../assets/icons/ico_info.svg'
import Modales from '../charts/filters/error-message/Modales'
import useModal from '../charts/filters/error-message/UseModal'



const Consumption = (props: any) => {
  const [selectedTab, setSelectedTab] = useState(0)
  const classes = useStyles({})
  const currentSupplyConsumptions = useSelector((state: any) => state.supplies.currentSupplyConsumptions)
  const currentCompareConsumptions = useSelector((state: any) => state.supplies.currentCompareConsumptions)
  const {isOpen} = useModal()

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const {
    toggle,
    isSelfConsumption,
    isLoading,
    setIsLoading,
    supplyData,
    consumptionsFilters,
    setConsumptionsFilters,
    supplantedUser,
    querySelfConsumption,
    navBarTabValue,
    tabValueFromURL,
    billingStartDate,
    setBilingStartDate,
    billingEndDate,
    setBilingEndDate,
  } = props

  const [isExportTableDataDialogOpen, setIsExportTableDataDialog] = useState(false)
  const [isExportPeriodDataDialogOpen, setIsExportPeriodDataDialog] = useState(false)
  const [isExportAllDataDialogOpen, setIsExportAllDataDialog] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [menuTabValue, setMenuTabValue] = useState(0)
  const [periodosFacturación,setPeriodosFacturación] = useState(null)

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

  const isAdapted = supplyData.measurementEquipments.meters[0].isAdapted
  const adaptedDate = supplyData.measurementEquipments.meters[0].adaptedDate
  //const isAdapted = 'NO'
  //const adaptedDate = '1/06/2021'

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
      dispatch(setUrlMessagesSupplyDataConsumptionTabValue(tabValue.toString()))
      // tabValue = 0 - Energía consumida
      if (tabValue === 0) {
        dispatch(setUrlMessagesDetail('SUPPLIES_CONSUMPTION_EC'))
      }
      // tabValue = 1 - Energía Reactiva Generada
      else if (tabValue === 1) {
        dispatch(setUrlMessagesDetail('SUPPLIES_CONSUMPTION_ERG'))
      }
      // tabValue = 2 - Energía Reactiva Consumida
      else if (tabValue === 2) {
        dispatch(setUrlMessagesDetail('SUPPLIES_CONSUMPTION_ERC'))
      }   
    }
  }, [tabValue, navBarTabValue])

  return (
    <>
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
          energiaReactiva={energiaReactiva}
        />

        <ExportPeriodDataDialog
          supplyData={supplyData}
          supplantedUser={supplantedUser}
          isExportPeriodDataDialogOpen={isExportPeriodDataDialogOpen}
          closeDialog={handleCloseExportPeriodDataDialog}
          isGeneration={supplyData.isGenerator === '1'}
          isGenerationTab={false}
          isSelfConsumption={querySelfConsumption}
          billingStartDate={billingStartDate}
          billingEndDate={billingEndDate}
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
    

        <Grid item md={12} className={classes.titleSinBorderBottom}>
          {t('supplies.suppliesDetails.components.navigation.myConsumption')}
          
        </Grid>
        {(supplyData.tipoDeLectura !== 'TELEGESTIONADO') &&
          <Grid container className={classes.containerteleoperable}>
            <Grid item className={classes.text}>
              <img className={classes.icon} src={InfoIcon} alt='' />
              <span className={classes.message}>{t('supplies.suppliesDetails.components.consumption.consumption.displayConsumptionteleoperableCorto')}</span>
            </Grid>
          </Grid>
        }
        <Grid item md={12} className={classes.BorderBottom}/>

        {
          supplyData.tipoDeLectura &&
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
              isGenerationTab={false}
              tabValueFromURL={tabValueFromURL}
            />
        }
        {
        (supplyData.tipoDeLectura) ?
          <>  
            <Grid item md={12} className={classes.description}>
              <span>
              {t('supplies.suppliesDetails.components.consumption.consumption.displayConsumption')}
              {t('(')}
              </span>
               <a  href='https://comparador.cnmc.gob.es/facturaluz/inicio/'>facturaluz.cnmc.es</a>
              <span>{t(')')}</span> 

            </Grid>

            <BoxConsumption
                    toggle={toggle}
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
                    measurementSystem={supplyData.measurementSystem}
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
    </>
  )
}

export default Consumption
