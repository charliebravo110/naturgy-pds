import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import SwipeableViews from 'react-swipeable-views'

import Grid from '@material-ui/core/Grid'
import Badge from '@material-ui/core/Badge'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { StyledTabSelector, StyledTab } from '../../../../../../common/components/styled-tab-selector/StyledTabSelector'
import { StyledMobileTab } from '../../../../../../common/components/styled-tab-selector/styled-tab-selector-mobile/StyledTabSelectorMobile'
import NoItemsAlert from '../../../../../supplies-list/components/no-items-alert/NoItemsAlert'
import DownloadsConsumption from '../../charts/downloads/DownloadsConsumption'
import useStyles from '../Consumption.styles'
import Charts from '../../charts/charts/Charts'

const BoxConsumption = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.only('xs'))

  const supplies = useSelector((state: any) => state.supplies)
  const delegations = useSelector((state: any) => state.delegations)

  const {
    toggle,
    isSelfConsumption,
    selectedTab,
    setSelectedTab,
    setConsumptionsFilters,
    currentCompareConsumptions,
    mode,
    setIsExportPeriodDataDialog,
    setIsExportAllDataDialog,
    setMode,
    setIsExportTableDataDialog,
    isLoading,
    querySelfConsumption,
    setIsLoading,
    currentSupplyConsumptions,
    adaptedDate,
    isAdapted,
    supplyData,
    energiaReactiva,
    consumptionsFilters,
    billingStartDate,
    billingEndDate,
    measurementSystem,
  } = props

  let delegatesInMeList = delegations.delegatesInMeList

  return (
    //BOTONES
    <Grid container className={classes.box2}>
      {
        (
          (supplies.list && supplies.list.length > 0) ||
          (delegations.delegationsInManagersList && delegations.delegationsInManagersList.length > 0) ||
          (delegations.delegatesInMeList && delegations.delegatesInMeList.length > 0)
        ) ?
          <>
            <Grid item className={classes.navigation}>
              <StyledTabSelector
                className={classes.tabs}
                value={selectedTab}
                onChange={(event, tab) => setSelectedTab(tab)}
                indicatorColor='primary'
                textColor='primary'
                centered
                orientation={mobile ? 'vertical' : 'horizontal'}
                TabIndicatorProps={mobile ? {
                  style: {
                    display: 'none'
                  }
                } : {}}
              >
                {
                  !mobile ?
                    <StyledTab className={classes.tab} label={t('delegations.suppliesList.graph')} />
                    :
                    <StyledMobileTab className={classes.tab} label={t('delegations.suppliesList.graph')} />
                }

                {
                  // descomentar, tampoco se muy bien porque estaba puesto en codigo
                  // delegations.delegationsInManagersList.length > 0 ?
                  !mobile ?
                    measurementSystem == 'O' ?
                      (isSelfConsumption ?
                        <StyledTab className={classes.tab} label={t('delegations.suppliesList.consumption3')} />
                        :
                        <StyledTab className={classes.tab} label={t('delegations.suppliesList.consumption4')} />
                      )
                      :
                      (isSelfConsumption ?
                        <StyledTab className={classes.tab} label={t('delegations.suppliesList.consumption3')} />
                        :
                        <StyledTab className={classes.tab} label={t('delegations.suppliesList.consumption1')} />
                      )
                    : (
                      measurementSystem == 'O' ?
                        (isSelfConsumption ?
                          <StyledMobileTab className={classes.tab} label={t('delegations.suppliesList.consumption3')} />
                          :
                          <StyledMobileTab className={classes.tab} label={t('delegations.suppliesList.consumption4')} />
                        )
                        :
                        (isSelfConsumption ?
                          <StyledMobileTab className={classes.tab} label={t('delegations.suppliesList.consumption3')} />
                          :
                          <StyledMobileTab className={classes.tab} label={t('delegations.suppliesList.consumption1')} />
                        )
                    )
                  // :
                  //   []
                }

              </StyledTabSelector>

            </Grid>

            <SwipeableViews
              index={selectedTab}
              onChangeIndex={setSelectedTab}
              className={classes.views}
            >
              {/* CARGAR GRAFICA */}
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
                isGenerationTab={false}
                energiaReactiva={energiaReactiva}
                isAdapted={isAdapted}
                adaptedDate={adaptedDate}
                querySelfConsumption={querySelfConsumption}
              />
              {/* DESCARGAS */}
              {
                // descomentar, tampoco se muy bien porque estaba puesto en codigo
                // delegations.delegationsInManagersList.length > 0  ?
                <DownloadsConsumption
                  toggle={toggle}
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
                // :
                //   []
              }
            </SwipeableViews>
          </>
          :
          <NoItemsAlert
            searchingItems={false}
            defaultMessage={t('delegations.managedByMe.defaultMessage')}
            searchMessage={t('delegations.managedByMe.searchMessage')}
          />
      }
    </Grid>
  )
}

export default BoxConsumption
