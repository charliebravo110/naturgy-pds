import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { StyledMobileTab } from '../../../../../common/components/styled-tab-selector/styled-tab-selector-mobile/StyledTabSelectorMobile'

import {
  setCurrentSupplyConsumptions,
  setCurrentCompareConsumptions
} from '../../../../store/actions/SuppliesActions'

import useStyles from './SubmenuMobile.styles'

const SubmenuMobile2 = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { supplyData, meterEnabled, tabValue, setTabValue, setMenuTabValue, setQuerySelfConsumption, querySelfConsumption } = props

  return (
    <>
      {
        supplyData.isGenerator === '1' ?
          <div>
            <StyledMobileTab
              className={`${classes.mobileTab} ${classes.mobileMenuTab} ${tabValue === 1 && 'selectedInner'}`}
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

            {(supplyData.isSelfConsumption) &&
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
            }

            <StyledMobileTab
              className={`${classes.mobileTab} ${classes.mobileMenuTab} ${tabValue === 4 && 'selectedInner'}`}
              label={t('supplies.suppliesDetails.components.navigation.maxPowerEstimated')}
              onClick={() => {
                supplyData.isSelfConsumption ? setTabValue(4) : setTabValue(3)
                setMenuTabValue(1)
              }}
            />

          </div>

          :

          <div>
            <StyledMobileTab
              className={`${classes.mobileTab} ${classes.mobileMenuTab} ${tabValue === 1 && 'selectedInner'}`}
              label={t('supplies.suppliesDetails.components.navigation.myConsumption')}
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

            {(supplyData.isSelfConsumption) && (
              <StyledMobileTab
                className={`${classes.mobileTab} ${classes.mobileMenuTab} ${tabValue === 2 && 'selectedInner'}`}
                label={t('Autoconsumo')}
                onClick={() => {
                  if (!querySelfConsumption) {
                    dispatch(setCurrentSupplyConsumptions([]))
                    dispatch(setCurrentCompareConsumptions([]))
                    setQuerySelfConsumption(true)
                  }
                  setTabValue(2)
                  setMenuTabValue(1)
                }}
              />
            )}

            {(supplyData.tipoDeLectura) && (
              <StyledMobileTab
                className={`${classes.mobileTab} ${classes.mobileMenuTab} ${supplyData.isSelfConsumption ? tabValue === 3 && 'selectedInner' : tabValue === 2 && 'selectedInner'}`}
                label={t('supplies.suppliesDetails.components.navigation.maxPowerEstimated')}
                onClick={() => {
                  supplyData.isSelfConsumption ? setTabValue(3) : setTabValue(2)
                  setMenuTabValue(1)
                }}
              />
            )}

            {(supplyData.tipoDeLectura) && (
              <StyledMobileTab
                className={`${classes.mobileTab} ${classes.mobileMenuTab} ${supplyData.isSelfConsumption ? tabValue === 4 && 'selectedInner' : tabValue === 3 && 'selectedInner'}`}
                label={t('supplies.suppliesDetails.components.navigation.certificates')}
                onClick={() => {
                  supplyData.isSelfConsumption ? setTabValue(4) : setTabValue(3)
                  setMenuTabValue(1)
                }}
              />
            )}

            {(supplyData.tipoDeLectura) && (
              <StyledMobileTab
                className={`${classes.mobileTab} ${classes.mobileMenuTab} ${supplyData.isSelfConsumption ? tabValue === 5 && 'selectedInner' : tabValue === 4 && 'selectedInner'}`}
                disabled={!meterEnabled}
                label={t('supplies.suppliesDetails.components.navigation.meter')}
                onClick={() => {
                  meterEnabled && supplyData.isSelfConsumption ? setTabValue(5) : setTabValue(4)
                  meterEnabled && setMenuTabValue(1)
                }}
              />
            )}

            {(supplyData.tipoDeLectura) && (
              <StyledMobileTab
                className={`${classes.mobileTab} ${classes.mobileMenuTab} ${supplyData.isSelfConsumption ? tabValue === 6 && 'selectedInner' : tabValue === 5 && 'selectedInner'}`}
                label={t('supplies.suppliesDetails.components.navigation.reportFault')}
                // onClick={() => {
                //   supplyData.isSelfConsumption ? setTabValue(6) : setTabValue(5)
                //   setMenuTabValue(1)
                // }}
              />
            )}

            {(supplyData.tipoDeLectura) && (
              <StyledMobileTab
                className={`${classes.mobileTab} ${classes.mobileMenuTab} ${supplyData.isSelfConsumption ? tabValue === 7 && 'selectedInner' : tabValue === 6 && 'selectedInner'}`}
                label={t('supplies.suppliesDetails.components.navigation.incidentHistory')}
                onClick={() => {
                  supplyData.isSelfConsumption ? setTabValue(7) : setTabValue(6)
                  setMenuTabValue(1)
                }}
              />
            )}
          </div>
      }
    </>
  )
}

export default SubmenuMobile2
