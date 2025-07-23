import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import {
  StyledTabSelector,
  StyledTab
} from '../../../../common/components/styled-tab-selector/StyledTabSelector'
import { StyledMobileTab } from '../../../../common/components/styled-tab-selector/styled-tab-selector-mobile/StyledTabSelectorMobile'

import useStyles from './Navigation.styles'
import { removeAccents } from '../../../../core/utils/gtm'

const Navigation = (props: any) => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.only('xs'))
  const classes = useStyles({})
  const { t } = useTranslation()


  const ref = useRef(null)
  const menuTabRef = useRef(null)

  const { supplyData, tabValue, setTabValue, menuTabValue, setMenuTabValue, consumptionsFilters, setConsumptionsFilters, setEnergiaReactiva, isGenerationTab, tabValueFromURL } = props

  const [ meterEnabled, setMeterEnabled ] = useState(false)
  const [ submenuOpen, setSubmenuOpen ] = useState(false)

  const handleClickOutside = (e: any) => {
    if (ref.current && !ref.current.contains(e.target) && !menuTabRef.current.contains(e.target)) {
      setSubmenuOpen(false)
    }
  }

  const handleReactiva = (reactiva: string) => {
    if (!isGenerationTab) {
      if (reactiva === '3') {
        setConsumptionsFilters({
          ...consumptionsFilters,
          showR1: 'S',
          showR2: 'N',
          showR3: 'N',
          showR4: 'N'
        })
        setEnergiaReactiva(true)
      } else if (reactiva === '2') {
        setConsumptionsFilters({
          ...consumptionsFilters,
          showR1: 'N',
          showR2: 'N',
          showR3: 'N',
          showR4: 'S'
        })
        setEnergiaReactiva(true)
      } else if (reactiva === '1') {
        setConsumptionsFilters({
          ...consumptionsFilters,
          showR1: 'N',
          showR2: 'N',
          showR3: 'N',
          showR4: 'N'
        })
        setEnergiaReactiva(false)
      }
    } else {
      if (reactiva === '3') {
        setConsumptionsFilters({
          ...consumptionsFilters,
          showR1: 'N',
          showR2: 'S',
          showR3: 'N',
          showR4: 'N'
        })
        setEnergiaReactiva(true)
      } else if (reactiva === '2') {
        setConsumptionsFilters({
          ...consumptionsFilters,
          showR1: 'N',
          showR2: 'N',
          showR3: 'S',
          showR4: 'N'
        })
        setEnergiaReactiva(true)
      } else if (reactiva === '1') {
        setConsumptionsFilters({
          ...consumptionsFilters,
          showR1: 'N',
          showR2: 'N',
          showR3: 'N',
          showR4: 'N'
        })
        setEnergiaReactiva(false)
      }
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)

    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  })

  /* Comprobación de meter enable */
  useEffect(() => {
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
  }, [ mobile ])

  useEffect(() => {
    if (tabValueFromURL || tabValueFromURL === '0') {
      let auxReactiva = ''
      if (tabValueFromURL === '0') {
        auxReactiva = '1'
      }
      else if (tabValueFromURL === '1') {
        auxReactiva = '2'
      }
      else if (tabValueFromURL === '2') {
        auxReactiva = '3'
      }

      if (auxReactiva && auxReactiva !== '') {
        handleReactiva(auxReactiva)
      }      
    }    
  }, [tabValueFromURL])

  return (
    <Grid
      container
      className={supplyData.inService === 'NO' ? classes.containerNonPayment : classes.container}
      alignContent='flex-end'
      justifyContent={mobile ? 'flex-start' : 'center'}
    >
      <Grid item className={classes.navigation}>
        {!mobile && (
          <StyledTabSelector
            className={classes.tabs}
            value={menuTabValue}
            centered
            indicatorColor='primary'
            textColor='primary'
            orientation={'horizontal'}
            TabIndicatorProps={mobile ? {
              style: {
                display: 'none'
              }
            } : {
              style: {
                top: 0
              }
            }}
          >
            <StyledTab
              className={classes.tab}
              onClick={() => {
                setTabValue(0)
                setMenuTabValue(0)
                handleReactiva('1')
                let tabText
                isGenerationTab ?
                  tabText = t('supplies.suppliesDetails.components.reactiva.energiaGenerada')
                :
                  tabText = t('supplies.suppliesDetails.components.reactiva.energiaConsumida')
                tabText = removeAccents(tabText).toLowerCase()
                sessionStorage.setItem('tab1_MiConsumo', tabText)
              }}
              label={
                isGenerationTab ?
                  t('supplies.suppliesDetails.components.reactiva.energiaGenerada')
                :
                  t('supplies.suppliesDetails.components.reactiva.energiaConsumida')
              }
            />

            <StyledTab
              className={classes.tab}
              onClick={() => {
                setTabValue(1)
                setMenuTabValue(1)
                handleReactiva('2')
                let tabText
                isGenerationTab ?
                  tabText = t('supplies.suppliesDetails.components.reactiva.energiaRCr3')
                :
                  tabText = t('supplies.suppliesDetails.components.reactiva.energiaRCr4')
                tabText = removeAccents(tabText).toLowerCase()
                sessionStorage.setItem('tab1_MiConsumo', tabText)
              }}
              label={
                isGenerationTab ?
                  t('supplies.suppliesDetails.components.reactiva.energiaRCr3')
                :
                  t('supplies.suppliesDetails.components.reactiva.energiaRCr4')
              }
            />

            <StyledTab
              className={classes.tab}
              onClick={() => {
                setTabValue(2)
                setMenuTabValue(2)
                handleReactiva('3')
                let tabText
                isGenerationTab ?
                  tabText = t('supplies.suppliesDetails.components.reactiva.energiaRCr2')
                :
                  tabText = t('supplies.suppliesDetails.components.reactiva.energiaRCr1')
                tabText = removeAccents(tabText).toLowerCase()
                sessionStorage.setItem('tab1_MiConsumo', tabText)
              }}
              label={
                isGenerationTab ?
                  t('supplies.suppliesDetails.components.reactiva.energiaRCr2')
                :
                  t('supplies.suppliesDetails.components.reactiva.energiaRCr1')
              }
            />
          </StyledTabSelector>
        )}
        {mobile && (
          <Grid container className={classes.tabs}>
            <StyledMobileTab
              className={`${classes.mobileTab} ${tabValue === 0 && 'selectedOutter'}`}
              label={
                isGenerationTab ?
                  t('supplies.suppliesDetails.components.reactiva.energiaGenerada')
                :
                  t('supplies.suppliesDetails.components.reactiva.energiaConsumida')
              }
              onClick={() => {
                setTabValue(0)
                setMenuTabValue(0)
                handleReactiva('1')
                let tabText
                isGenerationTab ?
                  tabText = t('supplies.suppliesDetails.components.reactiva.energiaGenerada')
                :
                  tabText = t('supplies.suppliesDetails.components.reactiva.energiaConsumida')
                tabText = removeAccents(tabText).toLowerCase()
                sessionStorage.setItem('tab1_MiConsumo', tabText)
              }}
            />

            <StyledMobileTab
              className={`${classes.mobileTab} ${tabValue === 1 && 'selectedOutter'}`}
              label={
                isGenerationTab ?
                  t('supplies.suppliesDetails.components.reactiva.energiaRCr3')
                :
                  t('supplies.suppliesDetails.components.reactiva.energiaRCr4')
              }
              onClick={() => {
                setTabValue(1)
                setMenuTabValue(1)
                handleReactiva('2')
                let tabText
                isGenerationTab ?
                  tabText = t('supplies.suppliesDetails.components.reactiva.energiaRCr3')
                :
                  tabText = t('supplies.suppliesDetails.components.reactiva.energiaRCr4')
                tabText = removeAccents(tabText).toLowerCase()
                sessionStorage.setItem('tab1_MiConsumo', tabText)
              }}
            />

            <StyledMobileTab
              className={`${classes.mobileTab} ${tabValue === 2 && 'selectedOutter'}`}
              label={
                isGenerationTab ?
                  t('supplies.suppliesDetails.components.reactiva.energiaRCr2')
                :
                  t('supplies.suppliesDetails.components.reactiva.energiaRCr1')
              }
              onClick={() => {
                setTabValue(2)
                setMenuTabValue(2)
                handleReactiva('3')
                let tabText
                isGenerationTab ?
                  tabText = t('supplies.suppliesDetails.components.reactiva.energiaRCr2')
                :
                  tabText = t('supplies.suppliesDetails.components.reactiva.energiaRCr1')
                tabText = removeAccents(tabText).toLowerCase()
                sessionStorage.setItem('tab1_MiConsumo', tabText)
              }}
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

export default Navigation
