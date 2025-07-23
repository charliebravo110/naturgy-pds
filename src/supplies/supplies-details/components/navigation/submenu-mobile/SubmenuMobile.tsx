import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { StyledMobileTab } from '../../../../../common/components/styled-tab-selector/styled-tab-selector-mobile/StyledTabSelectorMobile'

import {
  setCurrentSupplyConsumptions,
  setCurrentCompareConsumptions
} from '../../../../store/actions/SuppliesActions'

import useStyles from './SubmenuMobile.styles'

const SubmenuMobile = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { supplyData, meterEnabled, tabValue, setTabValue, setMenuTabValue, setQuerySelfConsumption, querySelfConsumption } = props

  return (
    <div>
      {supplyData.isGenerator === '1' && (
        <StyledMobileTab
          className={`${classes.mobileTab} ${classes.mobileMenuTab} ${tabValue === 1 &&
            'selectedInner'}`}
          label={t('supplies.suppliesDetails.components.navigation.generation')}
          onClick={() => {
            if (querySelfConsumption) {
              dispatch(setCurrentSupplyConsumptions([]))
              dispatch(setCurrentCompareConsumptions([]))
              setQuerySelfConsumption(false)
            }
            setTabValue(1)
            setMenuTabValue(1)
          }}
        />
      )}

      <StyledMobileTab
        className={`${classes.mobileTab} ${classes.mobileMenuTab} ${tabValue === 2 && 'selectedInner'}`}
        label={t('supplies.suppliesDetails.components.navigation.myConsumption')}
        onClick={() => {
          if (querySelfConsumption) {
            dispatch(setCurrentSupplyConsumptions([]))
            dispatch(setCurrentCompareConsumptions([]))
            setQuerySelfConsumption(false)
          }
          setTabValue(2)
          setMenuTabValue(1)
        }}
      />

      {(supplyData.selfConsumption) && (
        <StyledMobileTab
          className={`${classes.mobileTab} ${classes.mobileMenuTab} ${tabValue === 3 && 'selectedInner'}`}
          label={t('Autoconsumo')}
          onClick={() => {
            if (!querySelfConsumption) {
              dispatch(setCurrentSupplyConsumptions([]))
              dispatch(setCurrentCompareConsumptions([]))
              setQuerySelfConsumption(true)
            }
            setTabValue(3)
            setMenuTabValue(1)
          }}
        />
      )}

      {(supplyData.tipoDeLectura) && (
        <StyledMobileTab
          className={`${classes.mobileTab} ${classes.mobileMenuTab} ${tabValue === 4 && 'selectedInner'}`}
          label={t('supplies.suppliesDetails.components.navigation.maxPowerEstimated')}
          onClick={() => {
            setTabValue(4)
            setMenuTabValue(1)
          }}
        />
      )}

      {(supplyData.tipoDeLectura) && (
        <StyledMobileTab
          className={`${classes.mobileTab} ${classes.mobileMenuTab} ${tabValue === 5 && 'selectedInner'}`}
          label={t('supplies.suppliesDetails.components.navigation.certificates')}
          onClick={() => {
            setTabValue(5)
            setMenuTabValue(1)
          }}
        />
      )}

      {(supplyData.isGenerator === '0' && supplyData.tipoDeLectura) && (
        <StyledMobileTab
          className={`${classes.mobileTab} ${classes.mobileMenuTab} ${!meterEnabled && 'disabled'} ${tabValue === 6 && 'selectedInner'}`}
          disabled={!meterEnabled}
          label={t('supplies.suppliesDetails.components.navigation.meter')}
          onClick={() => {
            meterEnabled && setTabValue(6)
            meterEnabled && setMenuTabValue(1)
          }}
        />
      )}
      
      {(supplyData.isGenerator === '0' && supplyData.tipoDeLectura) && (
        <StyledMobileTab
          className={`${classes.mobileTab} ${classes.mobileMenuTab} ${tabValue === 7 && 'selectedInner'}`}
          label={t('supplies.suppliesDetails.components.navigation.reportFault')}
          onClick={() => {
            setTabValue(7)
            setMenuTabValue(1)
          }}
        />
      )}

      {(supplyData.isGenerator === '0' && supplyData.tipoDeLectura) && (
        <StyledMobileTab
          className={`${classes.mobileTab} ${classes.mobileMenuTab} ${tabValue === 8 && 'selectedInner'}`}
          label={t('supplies.suppliesDetails.components.navigation.incidentHistory')}
          onClick={() => {
            setTabValue(8)
            setMenuTabValue(1)
          }}
        />
      )}
    </div>
  )
}

export default SubmenuMobile
