import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import SwipeableViews from 'react-swipeable-views'

import Grid from '@material-ui/core/Grid'
import Badge from '@material-ui/core/Badge'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import {
  StyledTabSelector,
  StyledTab
} from '../../../../../common/components/styled-tab-selector/StyledTabSelector'
import { StyledMobileTab } from '../../../../../common/components/styled-tab-selector/styled-tab-selector-mobile/StyledTabSelectorMobile'
import NoItemsAlert from '../../no-items-alert/NoItemsAlert'

import ManagedByMe from '../../../managed-by-me/components/managed-by-me/ManagedByMe'
import DelegatesInManagers from '../../../delegates-in-managers/components/delegates-in-managers/DelegatesInManagers'
import DelegatesInMe from '../../../delegates-in-me/components/delegates-in-me/DelegatesInMe'

import useStyles from './Box.styles'
import { removeEmails, sendGAEvent } from '../../../../../core/utils/gtm'

const Box =   (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.only('xs'))

  const supplies = useSelector((state: any) => state.supplies)
  const delegations = useSelector((state: any) => state.delegations)
  const [ContractsInfo, setContractsInfo] = useState([])
  const [ContractsSols, setContractsSols] = useState([])

  const {
    history,
    selectedTab,
    setSelectedTab,
    suppliesList,
    setSuppliesList,
    loadingSuppliesList,
    setIsLoading,
    loadingDelegationsList,
    setLoadingDelegationsList,
    setDelegationProfile,
    setDelegationProfileStatus,
    setRemoveDelegation,
    setBajaDelegation,
    contractsEnabled
  } = props

  let delegatesInMeList = delegations.delegatesInMeList

  // LCS: Carga de componente - Wave GdC
  useEffect(() => {
    sendGAEvent({
      event: 'component_loaded',
      info: {
        reactComponent: 'Box.tsx'
      },
      page_url: removeEmails(window.location.href),
      user_id: sessionStorage.getItem('id'),
    })
  },[])

  return (
    //BOTONES
    <Grid container className={classes.box}>
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
                    <StyledTab className={classes.tab} label={t('delegations.suppliesList.managedByMe')} />
                  :
                    <StyledMobileTab className={classes.tab} label={t('delegations.suppliesList.managedByMe')} />
                }

                {
                  delegations.delegationsInManagersList.length > 0 ?
                    !mobile ?
                      <StyledTab className={classes.tab} label={t('delegations.suppliesList.delegatesInManagers')} />
                    :
                      <StyledMobileTab className={classes.tab} label={t('delegations.suppliesList.delegatesInManagers')} />
                  :
                    []
                }

                {
                  (delegations.delegatesInMeList && delegatesInMeList.length > 0) ?
                    (
                      !mobile ?
                        <StyledTab
                          className={classes.tab}
                          label={
                            <Badge
                              classes={{ badge: classes.customBadge }}
                              className={classes.badge}
                              badgeContent={delegations.delegatesInMeListCount}
                            >
                              {t('delegations.suppliesList.delegatesInMe')}
                            </Badge>
                          }
                        />
                      :
                        <StyledMobileTab
                          className={classes.tab}
                          label={
                            (delegations.delegatesInMeList && delegatesInMeList.length > 0) ?
                              <Badge
                                classes={{ badge: classes.customBadge }}
                                className={classes.badge}
                                badgeContent={delegations.delegatesInMeListCount}
                              >
                                {t('delegations.suppliesList.delegatesInMe')}
                              </Badge>
                            :
                              t('delegations.suppliesList.delegatesInMe')
                          }
                        />
                    )
                  :
                    []
                }

                {/* {
                  !mobile ?
                    <StyledTab className={classes.tab} label={t('delegations.suppliesList.solicitudes')} />
                  :
                    <StyledMobileTab className={classes.tab} label={t('delegations.suppliesList.solicitudes')} />
                } */}
                
              </StyledTabSelector>
              
            </Grid>

            <SwipeableViews
              index={selectedTab}
              onChangeIndex={setSelectedTab}
              className={classes.views}
            >
              
              <ManagedByMe
              //CARGA LA INFO DE LA VISTA MANAGER
                history={history}
                selectedTab={selectedTab}
                suppliesList={suppliesList}
                setSuppliesList={setSuppliesList}
                loadingSuppliesList={loadingSuppliesList}
                setIsLoading={setIsLoading}
                loadingDelegationsList={loadingDelegationsList}
                setLoadingDelegationsList={setLoadingDelegationsList}
                contractsEnabled={contractsEnabled}
                setContractsInfo={setContractsInfo}
                setContractsSols={setContractsSols}

              />

              {
                delegations.delegationsInManagersList.length > 0  ?
                  <DelegatesInManagers
                  //CARGA LA INFO DE LA VISTA GESTOR
                    suppliesList={supplies.list}
                    selectedTab={selectedTab}
                    setDelegationProfile={setDelegationProfile}
                    setDelegationProfileStatus={setDelegationProfileStatus}
                    setRemoveDelegation={setRemoveDelegation}
                    contractsEnabled={contractsEnabled}
                    contractsInfo={ContractsInfo}
                    contractsSols={ContractsSols}
                  />
                :
                  []
              }

              {
                (delegations.delegatesInMeList && delegations.delegatesInMeList.length > 0)  ?
                  <DelegatesInMe
                    delegationsDelegatesInMeList={delegatesInMeList}
                    isTheOnlyTab={supplies.list.length === 0}
                    selectedTab={selectedTab}
                    history={props.history}
                    setIsLoading={setIsLoading}
                    setBajaDelegation={setBajaDelegation}
                    contractsEnabled={contractsEnabled}
                  />
                :
                  []
              } 
            </SwipeableViews>
          </>
        :
          <NoItemsAlert
            searchingItems={false}
            defaultMessage={t('delegations.managedByMe.defaultMessage')}
            searchMessage={t('delegations.managedByMe.searchMessage')}
            isErrorBol={true}
          />
      }
    </Grid>
  )
}

export default Box
