import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link, Redirect } from 'react-router-dom'
import SwipeableViews from 'react-swipeable-views'
import { useHistory } from 'react-router'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Grid from '@material-ui/core/Grid'
import Badge from '@material-ui/core/Badge'

import ButtonToTop from '../../../common/components/button-to-top/ButtonToTop'
import Spinner from '../../../common/components/spinner/Spinner'
import IconTextButton from '../../../common/components/icon-text-button/IconTextButton'
import { StyledTabSelector, StyledTab } from '../../../common/components/styled-tab-selector/StyledTabSelector'
import { StyledMobileTab } from '../../../common/components/styled-tab-selector/styled-tab-selector-mobile/StyledTabSelectorMobile'
import OngoingRequests from './ongoing-requests/OngoingRequests'
import ClosedRequests from './closed-requests/ClosedRequests'

import AddIcon from '../../../assets/icons/mas.svg'
import AddIconDisabled from '../../../assets/icons/masDisabled.svg'

import { adminCheck } from '../../../common/lib/ValidationLib'
import { hasNotUserPermissions } from '../../../common/lib/UserPermissionsLib'

import {
  setRequestsList,
  setRequestsListSupply,
  setRequestsListDossier,
  setNewRequestSteps,
  resetNewRequestSteps,
  resetNewRequestData
} from '../../store/actions/RequestsActions'
import { thunkGetRequestsList } from '../../store/actions/RequestsThunkActions'

import {
  resetUrlMessages,
  setUrlMessagesCategory,
  setUrlMessagesDetail
} from '../../../common/components/send-url/store/actions/UrlMessagesActions'

import useStyles from './RequestsList.styles'
import requestRoleFilter from '../request-filter/RequestFilter'
import { thunkGetMasterData } from '../../../provisions/store/actions/ProvisionsThunkActions'

// LCS: Importa la función - Wave 2
import { sendGAEvent, removeEmails } from '../../../core/utils/gtm'

const RequestsList = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.only('xs'))

  const user = useSelector((state: any) => state.user)
  const requests = useSelector((state: any) => state.requests)
  const provisions = useSelector((state: any) => state.provisions)
  const actualState = useSelector((state: any) => state)

  const [isNotAplicant, setIsNotAplicant] = useState(true as boolean)

  const { setIsLoading, supplyData, setCreatingNewRequest, setShowingRequestDetail, setRequestData } = props

  const history = useHistory()

  const clientDossierPanel = useSelector((state: any) => state.urlMessages.clientDossierPanel)

  const [dossierStatusId, setDossierStatusId] = useState([] as any)

  const [loadingRequestsList, setLoadingRequestsList] = useState(
    (
      window.location.pathname === '/requests' &&
      requests.list.length === 0
    ) ||
    (
      window.location.pathname === '/supplies/detail' &&
      supplyData.measurementSystem === 'O' &&
      requests.supplyList.length === 0
    ) ||
    (
      window.location.pathname === '/provisions/detail' &&
      requests.dossierList.length === 0
    )
  )

  const [loadingRequestDetail, setLoadingRequestDetail] = useState(false)

  const [filterList, setFilterList] = useState([])

  useEffect(() => {
    // LCS: Enviar evento de GdC a GA - Wave 2
    if(window.location.pathname == '/requests'){
      sendGAEvent({
        event: 'view',
        content_group: 'mis peticiones',
        page_url: removeEmails(window.location.href),
        user_id: sessionStorage.getItem('id'),
        previous_path: removeEmails(sessionStorage.getItem("previousPage")),
        user_type: sessionStorage.getItem('user_type'),
        browsing_type: sessionStorage.getItem('browsing_type'),
        element_type: 'medicion de pagina',
        ga_client_id: sessionStorage.getItem('ga_client_id'),
        cups: 'no aplica',
        supply_type: 'no aplica'
      });
      sessionStorage.setItem("previousPage", window.location.href);
    }
  }, [])

  useEffect(() => {
    dispatch(thunkGetMasterData(
      'SERVICE_REQUEST_FILTERS',
      'ES',
      'FILTERS',
      (response) => {
        if (response && response.length > 0) {
          setFilterList(response[0].value.split(';'))
        }
      }
    ))
    if (provisions?.currentProvision?.applicant?.docNumber !== user?.profile?.documentNumber) {
      setIsNotAplicant(true)
    } else {
      setIsNotAplicant(false)
    }
    
    sessionStorage.setItem('tab_selected', 'peticiones en curso');
  }, [])

  const [selectedTab, setSelectedTab] = useState(0)
  // 0 => Peticiones en curso
  // 1 => Peticiones cerradas

  // Posibles estados de las SR
  //   1 => No se realiza filtrado (devuelve tanto abiertas como cerradas)
  //   2 => Sólo abiertas
  //   3 => Sólo cerradas

  const handleGetTypologyByCode = (code) => {
    let typology = ''

    if (
      code === '0865R01' ||
      code === '0865R03' ||
      code === '0865R05' ||
      code === '0865R00' ||
      code === '0872R01' ||
      code === '0870I01'
    ) {
      typology = t('requests.requestsList.list.tipologies.supplies')
    }

    if (
      code === '1074R00' ||
      code === '1074A18' ||
      code === '1074A05' ||
      code === '1070I01'
    ) {
      typology = t('requests.requestsList.list.tipologies.dossiers')
    }

    if (code === '0801A01') {
      typology = t('requests.requestsList.list.tipologies.fraud')
    }

    if (code === '0867A01') {
      typology = t('requests.requestsList.list.tipologies.incidents')
    }

    if (code === '1074I04') {
      typology = t('requests.requestsList.list.tipologies.selfConsumption')
    }

    /*if (code === '0872A03') {
      typology = t('requests.requestsList.list.tipologies.cut')
    }*/

    return typology
  }

  const handleClickNewRequestButton = () => {
    if (window.location.pathname === '/supplies/detail') {
      dispatch(setNewRequestSteps({
        step1: 'SUPPLY',
        step2: supplyData.cups
      }))
    } else if (window.location.pathname === '/provisions/detail') {
      dispatch(setNewRequestSteps({
        step1: 'DOSSIER',
        step2: provisions.currentProvision.dossierCod
      }))
    }

    setCreatingNewRequest(true)
  }

  const handleClickNewRequestAddButton = () => {
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis peticiones',
      click_text: 'nueva peticion',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      click_url: window.location.origin + '/requests/add',
      browsing_type: sessionStorage.getItem('browsing_type')
    });
  }

  useEffect(() => {
    if (user.profile.documentNumber) {
      if (
        (
          window.location.pathname === '/requests' &&
          requests.list.length === 0
        ) ||
        (
          window.location.pathname === '/supplies/detail' &&
          supplyData.measurementSystem === 'O' &&
          requests.supplyList.length === 0
        ) ||
        (
          window.location.pathname === '/provisions/detail' &&
          requests.dossierList.length === 0
        )
      ) {
        // cargar lista de peticiones
        setLoadingRequestsList(true)

        let filter = `documentNumber::${user.profile.documentNumber}|status::1`

        // comprobar si estamos a nivel de cups/expediente
        if (window.location.pathname === '/supplies/detail') {
          let applicantNif: string = ''

          if (supplyData.holderDocumentNumber && supplyData.holderDocumentNumber !== '') {
            applicantNif = `|applicantNif::${supplyData.holderDocumentNumber}`
          }

          filter = filter + `|cups::${supplyData && supplyData.cups}${applicantNif}`
        } else if (window.location.pathname === '/provisions/detail' && provisions.currentProvision.dossierCod && provisions.currentProvision.applicant) {
          filter = filter + `|dossierNumber::${provisions.currentProvision.dossierCod}|applicantNif::${provisions.currentProvision.applicant.docNumber}`
        }

        dispatch(thunkGetRequestsList(filter, (response) => {
          if (response && response.length > 0) {
            // ok
            if (window.location.pathname === '/supplies/detail') {
              dispatch(setRequestsListSupply(response))
            } else if (window.location.pathname === '/provisions/detail') {
              dispatch(setRequestsListDossier(response))
            } else {
              dispatch(setRequestsList(response))
            }
          }

          setLoadingRequestsList(false)
        }))
      }

      dispatch(thunkGetMasterData('TYPOLOGY_DESCRIPTION', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), '', (response) => {
        if (response) {
          setDossierStatusId(response)
        }
      }))
    }
    // eslint-disable-next-line
  }, [user.profile.documentNumber])

  useEffect(() => {
    dispatch(resetNewRequestSteps())

    dispatch(resetNewRequestData())
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (requests && requests.list && requests.list.length > 0 && props.location && props.location.state && props.location.state.request && props.location.state.request !== '') {
      // redirect to requests details

      const searchedRequest = props.location.state.request

      requests.list.map((request) => {
        if (request.codSR === searchedRequest) {
          history.push({
            pathname: '/requests/detail',
            state: {
              request: request
            }
          })
        }
      })
    }
  }, [requests])

  useEffect(() => {
    // PPM 1007560 - Reseteamos la información de urlMessages (redux) si no hemos accedido mediante URL de email/SMS (clientDossierPanel informado en redux)
    if (!adminCheck() && !clientDossierPanel) {
      dispatch(resetUrlMessages())
    }
    // PPM 1007560 - Seteamos la categoría y el detalle de la pantalla actual para que el usuario Admin pueda mandarle el enlace al cliente vía correo/sms
    else if (adminCheck() && window.location.pathname.includes('/requests')) {
      dispatch(resetUrlMessages())
      dispatch(setUrlMessagesCategory('REQUESTS'))
      dispatch(setUrlMessagesDetail('REQUESTS_LIST'))
    }
  }, [])

  let userRoles = sessionStorage.getItem('userRoles') || ''
  let gdprAccepted = sessionStorage.getItem('gdprAccepted') || ''

  let userRolesArray = userRoles.split(',')

  if (hasNotUserPermissions()) {
    const redirectTo = userRolesArray.includes('US_CC') ? '/admin' : '/login'

    return <Redirect to={redirectTo} />
  }

  if (window.location.pathname !== '/gdpr' && gdprAccepted === '0') {
    return <Redirect to='/gdpr' />
  }

  return (
    <div className={`${classes.block} ${window.location.pathname === '/supplies/detail' && 'without-margin'} ${window.location.pathname === '/provisions/detail' && 'with-margin'}`}>
      {
        (loadingRequestsList || loadingRequestDetail) &&
        <Spinner fixed />
      }

      {
        window.location.pathname === '/requests' &&
        <ButtonToTop />
      }

      <Grid container className={classes.container}>
        <Grid item xs={11} md={10} className={classes.maxWidthForBigScreens}>
          <div className={`${(user && user.profile && user.profile.userId && user.profile.userId > 0) ? classes.title : classes.notRegisteredTitle} ${window.location.pathname === '/provisions/detail' && 'without-margin'}`}>{t('requests.requestsList.title')}</div>

          {
            !adminCheck() && user && user.profile && user.profile.documentNumber &&
            <Grid item md='auto' sm='auto' xs={12}>
              <Grid container>
                {
                  (window.location.pathname === '/supplies/detail' || window.location.pathname === '/provisions/detail') ?
                    (window.location.pathname === '/provisions/detail' && isNotAplicant) ?
                      <>
                        <div>
                          <img src={AddIconDisabled} className={classes.iconDisabled} alt='' />
                        </div>

                        <div className={classes.newRequestDisabled}>
                          {t('requests.requestsList.newRequest')}
                        </div>

                        <div className={classes.newRequestDisabledInfo}>
                          {t('requests.requestsList.newRequestDisabled')}
                        </div>
                      </>
                      :
                      <div className={classes.newRequest} onClick={handleClickNewRequestButton}>
                        <IconTextButton icon={<img src={AddIcon} className={classes.icon} alt='' />} text={t('requests.requestsList.newRequest')} />
                      </div>
                    :
                    <div>
                      <Link to='/requests/add' className={classes.newRequest} onClick={handleClickNewRequestAddButton}>
                        <IconTextButton icon={<img src={AddIcon} className={classes.icon} alt='' />} text={t('requests.requestsList.newRequest')} />
                      </Link>
                    </div>
                }
              </Grid>
            </Grid>
          }

          <Grid container className={classes.box}>
            <div className={classes.navigation}>
              <StyledTabSelector
                className={classes.tabs}
                value={selectedTab}
                onChange={(event, tab) => {
                  setSelectedTab(tab);
                  let tab_name = ''
                  switch (tab){
                    case 0:
                       tab_name = 'peticiones en curso'
                       break;
                    case 1:
                      tab_name = 'peticiones cerradas'
                      break;
                    default:
                      tab_name = ''
                      break;
                  }
                  sessionStorage.setItem('tab_selected', tab_name);
                }}
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
                        <Badge
                          classes={{ badge: classes.customBadge }}
                          className={requests.list.filter(item => item.status === 'EN CURSO' && item.indRead === 0).length !== 0 ? classes.badge : ''}
                          badgeContent={
                            window.location.pathname === '/requests' ?
                              requestRoleFilter(requests.list.filter(item => item.status === 'EN CURSO' && item.indRead === 0), filterList).length
                              : (
                                window.location.pathname === '/supplies/detail' ?
                                  requestRoleFilter(requests.supplyList.filter(item => item.status === 'EN CURSO' && item.indRead === 0), filterList).length
                                  :
                                  requestRoleFilter(requests.dossierList.filter(item => item.status === 'EN CURSO' && item.indRead === 0), filterList).length
                              )
                          }
                        >
                          {t('requests.requestsList.tabs.ongoingRequests')}
                        </Badge>
                      }
                    />
                    :
                    <StyledMobileTab
                      className={classes.tab}
                      label={
                        <Badge
                          classes={{ badge: classes.customBadge }}
                          className={requests.list.filter(item => item.status === 'EN CURSO' && item.indRead === 0).length !== 0 ? classes.badge : ''}
                          badgeContent={
                            window.location.pathname === '/requests' ?
                              requestRoleFilter(requests.list.filter(item => item.status === 'EN CURSO' && item.indRead === 0), filterList).length
                              : (
                                window.location.pathname === '/supplies/detail' ?
                                  requestRoleFilter(requests.supplyList.filter(item => item.status === 'EN CURSO' && item.indRead === 0), filterList).length
                                  :
                                  requestRoleFilter(requests.dossierList.filter(item => item.status === 'EN CURSO' && item.indRead === 0), filterList).length
                              )
                          }
                        >
                          {t('requests.requestsList.tabs.ongoingRequests')}
                        </Badge>
                      }
                    />
                }

                {
                  !mobile ?
                    <StyledTab
                      className={classes.tab}
                      label={
                        <Badge
                          classes={{ badge: classes.customBadge }}
                          className={requests.list.filter(item => item.status === 'CERRADA' && item.indRead === 0).length !== 0 ? classes.badge : ''}
                          badgeContent={
                            window.location.pathname === '/requests' ?
                              requestRoleFilter(requests.list.filter(item => item.status === 'CERRADA' && item.indRead === 0), filterList).length
                              : (
                                window.location.pathname === '/supplies/detail' ?
                                  requestRoleFilter(requests.supplyList.filter(item => item.status === 'CERRADA' && item.indRead === 0), filterList).length
                                  :
                                  requestRoleFilter(requests.dossierList.filter(item => item.status === 'CERRADA' && item.indRead === 0), filterList).length
                              )
                          }
                        >
                          {t('requests.requestsList.tabs.closedRequests')}
                        </Badge>
                      }
                    />
                    :
                    <StyledMobileTab
                      className={classes.tab}
                      label={
                        <Badge
                          classes={{ badge: classes.customBadge }}
                          className={requests.list.filter(item => item.status === 'CERRADA' && item.indRead === 0).length !== 0 ? classes.badge : ''}
                          badgeContent={
                            window.location.pathname === '/requests' ?
                              requestRoleFilter(requests.list.filter(item => item.status === 'CERRADA' && item.indRead === 0), filterList).length
                              : (
                                window.location.pathname === '/supplies/detail' ?
                                  requestRoleFilter(requests.supplyList.filter(item => item.status === 'CERRADA' && item.indRead === 0), filterList).length
                                  :
                                  requestRoleFilter(requests.dossierList.filter(item => item.status === 'CERRADA' && item.indRead === 0), filterList).length
                              )
                          }
                        >
                          {t('requests.requestsList.tabs.closedRequests')}
                        </Badge>
                      }
                    />
                }
              </StyledTabSelector>
            </div>

            {
              !loadingRequestsList &&
              <SwipeableViews
                index={selectedTab}
                className={classes.views}
                onChangeIndex={setSelectedTab}
              >
                <OngoingRequests setIsLoading={setIsLoading} loadingRequestsList={loadingRequestsList} requests={requests} setLoadingRequestDetail={setLoadingRequestDetail} handleGetTypologyByCode={handleGetTypologyByCode} setShowingRequestDetail={setShowingRequestDetail} setRequestData={setRequestData} dossierStatusId={dossierStatusId} />

                <ClosedRequests setIsLoading={setIsLoading} loadingRequestsList={loadingRequestsList} requests={requests} setLoadingRequestDetail={setLoadingRequestDetail} handleGetTypologyByCode={handleGetTypologyByCode} setShowingRequestDetail={setShowingRequestDetail} setRequestData={setRequestData} dossierStatusId={dossierStatusId} />
              </SwipeableViews>
            }
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default RequestsList
