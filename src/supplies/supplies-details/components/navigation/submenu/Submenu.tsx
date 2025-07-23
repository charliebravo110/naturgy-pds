import React from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import useStyles from './Submenu.styles'

import {
  setCurrentSupplyConsumptions,
  setCurrentCompareConsumptions
} from '../../../../store/actions/SuppliesActions'

// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../../../core/utils/gtm'

const Submenu = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { supplyData, meterEnabled, tabValue, setTabValue, setMenuTabValue, setQuerySelfConsumption, querySelfConsumption, comunicateIncidenceFlagActive } = props
    
  // LCS: Funciones para enviar evento de GdC a GA - Wave 3
  const sendGAEventConsumo = ():void => {
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      subsection_name:'datos del punto de suministro',
      click_text:'mi consumo',
      element_type:'consulta de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
    })
  }

  const sendGAEventPotenciaMax = ():void => {
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      subsection_name: 'datos del punto de suministro',
      click_text: 'potencia maxima demandada',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
    })
  }

  const sendGAEventCertificados = ():void => {
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      subsection_name: 'datos del punto de suministro',
      click_text: 'mis certificados',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
    })
  }

  const sendGAEventContador = ():void => {
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      subsection_name: 'datos del punto de suministro',
      click_text: 'mi contador',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
    })
  }

  const sendGAEventComunica = ():void => {
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      subsection_name: 'datos del punto de suministro',
      click_text: 'comunica tu incidencia',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
    })
  }

  const sendGAEventHistorico = ():void => {
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      subsection_name: 'datos del punto de suministro',
      click_text: 'historico de interrupciones',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
    })
  }

  return (
    <>
      {supplyData.isGenerator === '1' ?
        <Grid container>
          <Grid
            item
            onClick={() => {
              if (querySelfConsumption) {
                dispatch(setCurrentSupplyConsumptions([]))
                dispatch(setCurrentCompareConsumptions([]))
                setQuerySelfConsumption(false)
              }
              setTabValue(1)
              setMenuTabValue(1)
            }}
            className={`${classes.submenuInnerTab} ${tabValue === 1 && 'selected'}`}
          >
            {t('supplies.suppliesDetails.components.navigation.generation')}
          </Grid>

          <Grid
            item
            onClick={() => {
              sendGAEventConsumo()
              if (querySelfConsumption) {
                dispatch(setCurrentSupplyConsumptions([]))
                dispatch(setCurrentCompareConsumptions([]))
                setQuerySelfConsumption(false)
              }
              setTabValue(2)
              setMenuTabValue(1)
            }}
            className={`${classes.submenuInnerTab} ${tabValue === 2 && 'selected'}`}
          >
            {t('supplies.suppliesDetails.components.navigation.myConsumption')}
          </Grid>

          {
          (supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' ) ? 
          <>
              <Grid
                item
                onClick={() => {
                  if (!querySelfConsumption) {
                    dispatch(setCurrentSupplyConsumptions([]))
                    dispatch(setCurrentCompareConsumptions([]))
                    setQuerySelfConsumption(true)
                  }
                  setTabValue(3)
                  setMenuTabValue(1)
                }}
                className={`${classes.submenuInnerTab} ${tabValue === 3 && 'selected'}`}
              >
                {t('Autoconsumo')}
              </Grid>
              <Grid
                item
                onClick={() => {
                  sendGAEventPotenciaMax()
                  setTabValue(4)
                  setMenuTabValue(1)
                }}
                className={`${classes.submenuInnerTab} ${tabValue === 4 && 'selected'}`}
              >
              {t('supplies.suppliesDetails.components.navigation.maxPowerEstimated')}
              </Grid>

          </>
          :
          <Grid
              item
              onClick={() => {
                sendGAEventPotenciaMax()
                setTabValue(3)
                setMenuTabValue(1)
              }}
              className={`${classes.submenuInnerTab} ${tabValue === 3 && 'selected'}`}
          >
            {t('supplies.suppliesDetails.components.navigation.maxPowerEstimated')}
          </Grid>
                    
          }

         
        </Grid>

        :

        <Grid container>
          <Grid
            item
            onClick={() => {
              sendGAEventConsumo()
              if (querySelfConsumption) {
                dispatch(setCurrentSupplyConsumptions([]))
                dispatch(setCurrentCompareConsumptions([]))
                setQuerySelfConsumption(false)
              }
              setTabValue(1)
              setMenuTabValue(1)
            }}
            className={`${classes.submenuInnerTab} ${tabValue === 1 && 'selected'}`}
          >
            {t('supplies.suppliesDetails.components.navigation.myConsumption')}
          </Grid>

          {(supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' ) && (
            <Grid
              item
              onClick={() => {
                if (!querySelfConsumption) {
                  dispatch(setCurrentSupplyConsumptions([]))
                  dispatch(setCurrentCompareConsumptions([]))
                  setQuerySelfConsumption(true)
                }
                setTabValue(2)
                setMenuTabValue(1)
              }}
              className={`${classes.submenuInnerTab} ${tabValue === 2 && 'selected'}`}
            >
              {t('Autoconsumo')}
            </Grid>
          )}

          {(supplyData.tipoDeLectura) && (
            <Grid
              item
              onClick={() => {
                sendGAEventPotenciaMax()
                supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' ? setTabValue(3) : setTabValue(2)
                setMenuTabValue(1)
              }}
              className={`${classes.submenuInnerTab} ${supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' ? tabValue=== 3 && 'selected' : tabValue === 2 && 'selected'}`}
            >
              {t('supplies.suppliesDetails.components.navigation.maxPowerEstimated')}
            </Grid>
          )}

          {(supplyData.tipoDeLectura) && (
            <Grid
              item
              onClick={() => {
                sendGAEventCertificados()
                supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' ? setTabValue(4) : setTabValue(3)
                setMenuTabValue(1)
              }}
              className={`${classes.submenuInnerTab} ${supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' ? tabValue=== 4 && 'selected' : tabValue === 3 && 'selected'}`}
            >
              {t('supplies.suppliesDetails.components.navigation.certificates')}
            </Grid>
          )}

          {(supplyData.tipoDeLectura && supplyData.tipoDeLectura !== 'TELEOPERABLE') && (
            <Grid
              item
              onClick={() => {
                sendGAEventContador()
                meterEnabled && supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' ? setTabValue(5) : setTabValue(4)
                meterEnabled && setMenuTabValue(1)
              }}
              className={`${classes.submenuInnerTab} ${supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' ? tabValue=== 5 && 'selected' : tabValue === 4 && 'selected'}`}
            >
              {t('supplies.suppliesDetails.components.navigation.meter')}
            </Grid>
          )}
          {comunicateIncidenceFlagActive && 
            <Grid
              item
              onClick={() => {
                sendGAEventComunica()
                supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' ? setTabValue(6) : setTabValue(5)
                setMenuTabValue(1)
              }}
              className={`${classes.submenuInnerTab} ${meterEnabled && supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' ? tabValue=== 6 && 'selected' : tabValue === 5 && 'selected'}`}
            >
              {t('supplies.suppliesDetails.components.navigation.reportFault')}
            </Grid>
          }

          {!comunicateIncidenceFlagActive && <Grid
            item
            className={`${classes.submenuInnerTab} ${'disabled'}`}
          >
            {t('supplies.suppliesDetails.components.navigation.reportFault')}
          </Grid>}

          <Grid
            item
            onClick={() => {
              sendGAEventHistorico()
              supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' ? setTabValue(7) : setTabValue(6)
              setMenuTabValue(1)
            }}
            className={`${classes.submenuInnerTab} ${classes.submenuInnerTabLast} ${meterEnabled && supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' ? tabValue=== 7 && 'selected' : tabValue === 6 && 'selected'}`}
          >
            {t('supplies.suppliesDetails.components.navigation.incidentHistory')}
          </Grid>
        </Grid>
      }
    </>
  )
}

export default Submenu
