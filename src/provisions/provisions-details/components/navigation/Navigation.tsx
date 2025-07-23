import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Badge from '@material-ui/core/Badge'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import {
  StyledTabSelector,
  StyledTab
} from '../../../../common/components/styled-tab-selector/StyledTabSelector'
import { StyledMobileTab } from '../../../../common/components/styled-tab-selector/styled-tab-selector-mobile/StyledTabSelectorMobile'

import useStyles from './Navigation.styles'
// LCS: Importa la función - Wave 3
import { removeAccents, sendGAEvent, removeEmails } from '../../../../core/utils/gtm'

const Navigation = (props: any) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const mobile = useMediaQuery(theme.breakpoints.only('xs'))
  const classes = useStyles({})

  const provisions = useSelector((state: any) => state.provisions)
  const requests = useSelector((state: any) => state.requests)
  // LCS: Enviar evento de GdC a GA - Wave 3
  const currentProvisionSubtype = useSelector((state: any) => state.provisions.supplySubtypes)

  const {
    tabValue,
    setTabValue,
    propPrev,
    currentProvision
  } = props

  // LCS: Enviar evento de GdC a GA - Wave 3
  const getTypologyValue = () => {
    const item = provisions.newGeneration.typologies.find(item => item.split('|')[0] === provisions.dossierSubtype)

    return item && item.split('|')[1] &&  item.split('|')[1].toLowerCase()
  }

  // LCS: Enviar evento de GdC a GA - Wave 3
  const getDossierSubtype = () => {
    const dossierSubtype = currentProvisionSubtype.length > 0 && currentProvisionSubtype.filter(item => item.split('|')[0] === provisions.dossierSubtype)[0]

    return dossierSubtype && dossierSubtype.split('|')[1]
  }


  const handleClickTab = (click_text) => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    let dossierType
    if (provisions.dossierType === 'DOSTYP002'){
      dossierType = getTypologyValue()
    } else {
      dossierType = getDossierSubtype()
    }
    sendGAEvent({
      event: 'browsing',
      section_name: 'mi conexion a la red',
      subsection_name: 'detalle de solicitud',
      click_text: removeAccents(click_text.toLowerCase()),
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_number: currentProvision.dossierCod,
      request_status: sessionStorage.getItem('provisionDossierStatus'),
      request_type: dossierType.toLowerCase(),
      browsing_type: sessionStorage.getItem('browsing_type')
    });
  }

  return (
    <Grid
      container
      item
      md={12}
      className={classes.container}
      alignContent='flex-end'
      justifyContent={mobile ? 'flex-start' : 'center'}
    >
      <Grid item className={classes.navigation}>
        <StyledTabSelector
          className={classes.tabs}
          value={tabValue}
          onChange={(event, newValue) => setTabValue(newValue)}
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
            mobile ?
              <StyledMobileTab className={classes.tab} label={t('provisions.provisionsDetails.navigation.myNetworkConnection')}
                onClick={() => handleClickTab(t('provisions.provisionsDetails.navigation.myNetworkConnection'))}
              />
              :
              <StyledTab className={classes.tab} label={t('provisions.provisionsDetails.navigation.myNetworkConnection')}
                onClick={() => handleClickTab(t('provisions.provisionsDetails.navigation.myNetworkConnection'))}
              />
          }

          {
            (
              mobile ?
                <StyledMobileTab className={classes.tab} label={t('provisions.provisionsDetails.navigation.activitiesList')}
                  onClick={() => handleClickTab(t('provisions.provisionsDetails.navigation.activitiesList'))}
                />
                :
                <StyledTab className={classes.tab} label={t('provisions.provisionsDetails.navigation.activitiesList')}
                  onClick={() => handleClickTab(t('provisions.provisionsDetails.navigation.activitiesList'))}
                />
            )
          }

          {
            mobile ?
              <StyledMobileTab
                className={classes.tab}
                label={
                  <Badge
                    classes={{ badge: classes.customBadge }}
                    className={provisions.currentProvision.communicationListBudget && provisions.currentProvision.communicationListBudget !== 0 ? classes.badge : ''}
                    badgeContent={provisions.currentProvision.communicationListBudget}
                  >
                    {t('provisions.provisionsDetails.navigation.messages')}
                  </Badge>
                  
                }
                onClick={() => handleClickTab(t('provisions.provisionsDetails.navigation.messages'))}
              />
              :
              <StyledTab
                className={classes.tab}
                label={
                  <Badge
                    classes={{ badge: classes.customBadge }}
                    className={provisions.currentProvision.communicationListBudget && provisions.currentProvision.communicationListBudget !== 0 ? classes.badge : ''}
                    badgeContent={provisions.currentProvision.communicationListBudget}
                  >
                    {t('provisions.provisionsDetails.navigation.messages')}
                  </Badge>
                }
                onClick={() => handleClickTab(t('provisions.provisionsDetails.navigation.messages'))}
              />
          }

          {
            (
              mobile ?
                <StyledMobileTab className={classes.tab} label={t('provisions.provisionsDetails.navigation.bills')}
                  onClick={() => handleClickTab(t('provisions.provisionsDetails.navigation.bills'))}
                />
                :
                <StyledTab className={classes.tab} label={t('provisions.provisionsDetails.navigation.bills')}
                  onClick={() => handleClickTab(t('provisions.provisionsDetails.navigation.bills'))}
                />
            )
          }

          {
            mobile ?
              <StyledMobileTab
                className={classes.lastTab}
                label={
                  <Badge
                    classes={{ badge: classes.customBadge }}
                    className={requests.dossierList.filter(item => item.indRead === 0).length !== 0 ? classes.badge : ''}
                    badgeContent={requests.dossierList.filter(item => item.indRead === 0).length}
                  >
                    {t('provisions.provisionsDetails.navigation.requests')}
                  </Badge>
                }
                onClick={() => handleClickTab(t('provisions.provisionsDetails.navigation.requests'))}
              />
              :
              <StyledTab
                className={classes.lastTab}
                label={
                  <Badge
                    classes={{ badge: classes.customBadge }}
                    className={requests.dossierList.filter(item => item.indRead === 0).length !== 0 ? classes.badge : ''}
                    badgeContent={requests.dossierList.filter(item => item.indRead === 0).length}
                  >
                    {t('provisions.provisionsDetails.navigation.requests')}
                  </Badge>
                }
                onClick={() => handleClickTab(t('provisions.provisionsDetails.navigation.requests'))}
              />
          }
        </StyledTabSelector>
      </Grid>
    </Grid>
  )
}

export default Navigation
