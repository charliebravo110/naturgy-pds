import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Badge from '@material-ui/core/Badge'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import DownArrow from '../../../../assets/icons/flecha_down_blue.svg'

import Submenu from './submenu/Submenu'
import SubmenuMobile from './submenu-mobile/SubmenuMobile'
import {thunkGetMasterData, } from '../../store/actions/SuppliesDetailsThunkActions'

import {
  StyledTabSelector,
  StyledTab
} from '../../../../common/components/styled-tab-selector/StyledTabSelector'
import { StyledMobileTab } from '../../../../common/components/styled-tab-selector/styled-tab-selector-mobile/StyledTabSelectorMobile'

import useStyles from './Navigation.styles'
import SubmenuMobile2 from './submenu-mobile/SubmenuMobile2'

// LCS: Importar las funciones - Wave 3
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm'

const Navigation = (props: any) => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.only('xs'))
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const requests = useSelector((state: any) => state.requests)

  const ref = useRef(null)
  const menuTabRef = useRef(null)

  const { supplyData, tabValue, setTabValue, menuTabValue, setMenuTabValue, setQuerySelfConsumption, querySelfConsumption, ongoingContracts } = props

  const [meterEnabled, setMeterEnabled] = useState(false)
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const [submenuMobileOpen, setSubmenuMobileOpen] = useState(false)
  const [comunicateIncidenceFlagActive, secomunicateIncidenceFlagActive] = useState(true)
  const [contractsEnabled, setContractsEnabled] = useState(false)

  useEffect(() => {
    dispatch(thunkGetMasterData(
      'CONTRACT',
      'ES',
      'SCREENS_ACTIVE',
      (r) => {
        if (r[0].value === '1') {
          setContractsEnabled(true)
        } else if (r[0].value === '0') {
          setContractsEnabled(false)
        } else {
          setContractsEnabled(false)
        }
      }
    ))
  }, [])

  const handleClickOutside = (e: any) => {
    if (ref.current && !ref.current.contains(e.target) && !menuTabRef.current.contains(e.target)) {
      setSubmenuOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)

    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  })
  

  /* Comprobación de meter enable y flag comunicarIncidencia */
  useEffect(() => {

    dispatch(thunkGetMasterData(
      'COMMUNICATE_INCIDENCE_FLAG',
      'ES',
      '',
      (response) => {
        if (response && response.length > 0) {
          secomunicateIncidenceFlagActive(response[0].value === '1')
        }
      }
    ))


    if (supplyData.measurementSystem === 'O') {
      if (
        supplyData.measurementEquipments &&
        supplyData.measurementEquipments.meters[0] &&
        supplyData.measurementEquipments.meters[0].meter &&
        (typeof supplyData.measurementEquipments.meters[0].meter !== 'object' ||
          supplyData.measurementEquipments.meters[0].meter !== '')
      ) {
        setMeterEnabled(true)
      } else {
        setMeterEnabled(false)
      }
    } else {
      setMeterEnabled(true)
    }

    // eslint-disable-next-line

  }, [])

  useEffect(() => {
    if (mobile) {
      setSubmenuOpen(false)
    }
  }, [mobile])

 // LCS: Enviar evento de GdC a GA - Wave 3
  const sendGAEventDatosGenerales = ():void => {
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      subsection_name: 'datos del punto de suministro',
      click_text: 'datos generales',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
    })
  }

 // LCS: Enviar evento de GdC a GA - Wave 3
  const sendGAEventGestionar = ():void => {
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      subsection_name: 'datos del punto de suministro',
      click_text: 'gestionar mi suministro',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
    })
  }

  const sendGAEventPeticiones = ():void => {
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      subsection_name: 'datos del punto de suministro',
      click_text: 'peticiones',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
    })
  }

  const sendGAEventSolicitudesContratacion = ():void => {
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      subsection_name: 'datos del punto de suministro',
      click_text: 'solicitudes de contratacion',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
    })
  }

  return (
    <Grid
      container
      item
      md={12}
      className={supplyData.inService === 'NO' ? classes.containerNonPayment : classes.container}
      alignContent='flex-end'
      justifyContent={mobile ? 'flex-start' : 'center'}
    >
      <Grid item className={classes.navigation}>
        {!mobile && (
          <StyledTabSelector
            className={classes.tabs}
            value={menuTabValue}
            indicatorColor='primary'
            textColor='primary'
            centered
            orientation={'horizontal'}
          >
            <StyledTab
              className={classes.tab}
              onClick={() => {
                sendGAEventDatosGenerales()
                setTabValue(0)
                setMenuTabValue(0)
              }}
              label={t('supplies.suppliesDetails.components.navigation.generalData')}
            />

            {
              <Grid
                container
                className={`${classes.tab} ${classes.customTab}`}
                onClick={() => { sendGAEventGestionar(); setSubmenuOpen(!submenuOpen)}}
                ref={menuTabRef}
              >
                <Grid container justifyContent='space-around' item className={`${classes.submenuTab}`}>
                  <Grid item>
                    {t('supplies.suppliesDetails.components.navigation.manageMySupplie')}
                  </Grid>
                  <Grid
                    item
                    className={`${classes.menuArrow} ${submenuOpen && classes.menuArrowOpen}`}
                  >
                    <img src={DownArrow} alt='' />
                  </Grid>
                </Grid>
              </Grid>
            }

            <StyledTab
              className={classes.tab}
              onClick={() => {
                sendGAEventPeticiones()
                supplyData.isGenerator === '1' ? (supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' ) ? setTabValue(5) : setTabValue(4) : (supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' ) ? setTabValue(8) : setTabValue(7)
                setMenuTabValue(2)
              }}
              label={
                <Badge
                  classes={{ badge: classes.customBadge }}
                  className={
                    requests.supplyList.filter((item) => item.indRead === 0).length !== 0 ? (
                      classes.badge
                    ) : (
                      ''
                    )
                  }
                  badgeContent={requests.supplyList.filter((item) => item.indRead === 0).length}
                >
                  {t('supplies.suppliesDetails.components.navigation.requests')}
                </Badge>
              }
            />

            {
              (contractsEnabled) &&
              <StyledTab
                className={classes.tab}
                onClick={() => {
                sendGAEventSolicitudesContratacion()
                supplyData.isGenerator === '1' ? (supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau !='' ) ? setTabValue(6) : setTabValue(5) : (supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' ) ? setTabValue(9) : setTabValue(8)
                setMenuTabValue(3)

                
              }}
                label={
                  (ongoingContracts &&  ongoingContracts.length > 0) ?
                    <Badge
                      classes={{ badge: classes.customBadge }}
                      className={
                        ongoingContracts.length > 0 ? (
                          classes.badge
                        ) : (
                          ''
                        )
                      }
                      badgeContent={(ongoingContracts.length > 0) && ongoingContracts.length}
                    >
                      {t('supplies.suppliesDetails.components.navigation.manageMyContratationSolicitude')}
                    </Badge>
                  :
                  t('supplies.suppliesDetails.components.navigation.manageMyContratationSolicitude')
                }
              />
            }
          </StyledTabSelector>
        )}

        {mobile && (
          <Grid container className={classes.tabs}>
            <StyledMobileTab
              className={`${classes.mobileTab} ${tabValue === 0 && 'selectedOutter'}`}
              label={t('supplies.suppliesDetails.components.navigation.generalData')}
              onClick={() => {
                setTabValue(0)
                setMenuTabValue(0)
              }}
            />

            <Grid
              container
              onClick={() => setSubmenuMobileOpen(!submenuMobileOpen)}
              className={`${classes.mobileTab} ${classes.mobileSubmenuTabSelector} ${menuTabValue ===
                1 && 'selectedOutter'}`}
            >
              <Grid
                container
                item
                justifyContent='space-between'
                className={`${classes.submenuTabMobile}`}
              >
                <Grid item>
                  {t('supplies.suppliesDetails.components.navigation.manageMySupplie')}
                </Grid>
                <Grid
                  item
                  className={`${classes.menuArrowMobile} ${submenuMobileOpen &&
                    classes.menuArrowOpenMobile}`}
                >
                  <img src={DownArrow} alt='' />
                </Grid>
              </Grid>
            </Grid>

            {submenuMobileOpen && (
              <SubmenuMobile2
                supplyData={supplyData}
                meterEnabled={meterEnabled}
                tabValue={tabValue}
                setTabValue={setTabValue}
                setMenuTabValue={setMenuTabValue}
                setQuerySelfConsumption={setQuerySelfConsumption}
                querySelfConsumption={querySelfConsumption}
              />
            )}

            <StyledMobileTab
              className={`${classes.mobileTab} ${classes.mobileSubmenuTabSelector} ${menuTabValue ===
                1 && 'selectedOutter'}`}
              label={
                <Badge
                  classes={{ badge: classes.customBadge }}
                  className={
                    requests.supplyList.filter((item) => item.indRead === 0).length !== 0 ? (
                      classes.badge
                    ) : (
                      ''
                    )
                  }
                  badgeContent={requests.supplyList.filter((item) => item.indRead === 0).length}
                >
                  {t('supplies.suppliesDetails.components.navigation.requests')}
                </Badge>
              }
              onClick={() => {
                supplyData.isGenerator === '1' ? (supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' ) ? setTabValue(5) : setTabValue(4) : (supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' ) ? setTabValue(8) : setTabValue(7)
                setMenuTabValue(2)
              }}
            />
            {/* <Grid
              container
              onClick={() => {
                setTabValue(10)
                setMenuTabValue(10)
              }}
              className={`${classes.mobileTab} ${classes.mobileSubmenuTabSelector} ${menuTabValue ===
                1 && 'selectedOutter'}`}
            >
              <Grid
                container
                item
                justifyContent='space-between'
                className={`${classes.submenuTabMobile}`}
              >
                <Grid item>
                  {t('supplies.suppliesDetails.components.navigation.manageMyContratationSolicitude')}
                </Grid>
              </Grid>
            </Grid> */}

            {
              (contractsEnabled) && 

                <StyledMobileTab
                  className={`${classes.mobileTab} ${tabValue === 0 && 'selectedOutter'}`}
                  label={t('supplies.suppliesDetails.components.navigation.manageMyContratationSolicitude')}
                  onClick={() => {
                    supplyData.isGenerator === '1' ? (supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' ) ? setTabValue(6) : setTabValue(4) : (supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' ) ? setTabValue(9) : setTabValue(8)
                    setMenuTabValue(3)
                  }}
                />
            }
            
          </Grid>
        )}
      </Grid>

      {submenuOpen && (
        <Grid item className={classes.submenu} ref={ref}>
          <Submenu
            supplyData={supplyData}
            meterEnabled={meterEnabled}
            tabValue={tabValue}
            setTabValue={setTabValue}
            setMenuTabValue={setMenuTabValue}
            setQuerySelfConsumption={setQuerySelfConsumption}
            querySelfConsumption={querySelfConsumption}
            comunicateIncidenceFlagActive={comunicateIncidenceFlagActive}
          />
        </Grid>
      )}
    </Grid>
  )
}

export default Navigation



