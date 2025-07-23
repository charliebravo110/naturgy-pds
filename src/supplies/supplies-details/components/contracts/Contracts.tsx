import { Badge, Grid, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import React, { useEffect, useState } from 'react'

import useStyles from './Contracts.styles'
import { StyledTab, StyledTabSelector } from '../../../../common/components/styled-tab-selector/StyledTabSelector'
import { StyledMobileTab } from '../../../../common/components/styled-tab-selector/styled-tab-selector-mobile/StyledTabSelectorMobile'
import SwipeableViews from 'react-swipeable-views'
import OngoingContracts from './OngoingContracts/OngoingContracts'
import { useDispatch, useSelector } from 'react-redux'
import { thunkGetContractsSupply } from '../../../store/actions/SuppliesThunkActions'
import ClosedContracts from './ClosedContracts/ClosedContracts'
import { useTranslation } from 'react-i18next'
import Spinner from '../../../../common/components/spinner/Spinner'
import LoadingAnimation from '../../../../assets/img/spinner.gif'

export const Contracts = (props: any) => {

  const {
    supplyData,
    isLoading,
    setIsLoading,
    contracts,
    ongoingContracts,
    closedContracts,
    contractsError,
    setContractsError,
    loadedContracts
  } = props

  const classes = useStyles({})
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.only('xs'))
  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.user)
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState(0)
  const [changedTab, setChangedTab] = useState(0)
  const [openModal, setOpenModal] = useState(false)
  const [isSubLoading, setIsSubLoading] = useState(true)

  const togle = () => {
    setOpenModal(!openModal)
  }

  useEffect(() => {
    setIsSubLoading(!loadedContracts && !contractsError)
  }, [loadedContracts, contractsError])

  return (
    <>
      <Grid container xs={12} justifyContent='center'>
        <Grid item xs={12}>
          <Typography variant='h6' className={classes.title}>
            {t('supplies.suppliesDetails.components.contracts.title')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.text}>
            {t('supplies.suppliesDetails.components.contracts.subtitle')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={10}>
          <Grid container item className={classes.box}>
            <div className={classes.navigation}>
              <StyledTabSelector
                className={classes.tabs}
                value={selectedTab}
                onChange={(event, tab) => { setSelectedTab(tab); setChangedTab(prevTab => prevTab + 1); }}
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
                    <StyledTab
                      className={classes.tab}
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
                            {t('supplies.suppliesDetails.components.contracts.selector.current')}
                          </Badge>
                        :
                        t('supplies.suppliesDetails.components.contracts.selector.current')
                      }
                    />
                    :
                    <StyledMobileTab
                      className={classes.tab}
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
                            {t('supplies.suppliesDetails.components.contracts.selector.current')}
                          </Badge>
                        :
                        t('supplies.suppliesDetails.components.contracts.selector.current')
                      }
                    />
                }
                {
                  !mobile ?
                    <StyledTab
                      className={classes.tab}
                      label={
                        t('supplies.suppliesDetails.components.contracts.selector.ended')
                      }
                    />
                    :
                    <StyledMobileTab
                      className={classes.tab}
                      label={
                        t('supplies.suppliesDetails.components.contracts.selector.ended')
                      }
                    />
                }
              </StyledTabSelector>
            </div>
            <Grid item xs={12}>
              <SwipeableViews
                index={selectedTab}
                className={classes.views}
                onChangeIndex={setSelectedTab}
              >
                <OngoingContracts
                  supplyData={supplyData}
                  contracts={contracts}
                  ongoingContracts={ongoingContracts}
                  changedTab={changedTab}
                  contractsError={contractsError}
                  setContractsError={setContractsError}
                  isSubLoading={isSubLoading}
                />
                <ClosedContracts
                  supplyData={supplyData}
                  contracts={contracts}
                  closedContracts={closedContracts}
                  changedTab={changedTab}
                  contractsError={contractsError}
                  setContractsError={setContractsError}
                  isSubLoading={isSubLoading}
                />
              </SwipeableViews>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
