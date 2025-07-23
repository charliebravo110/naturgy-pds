import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link, Redirect } from 'react-router-dom'
import SwipeableViews from 'react-swipeable-views'

import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Badge from '@material-ui/core/Badge'

import AddIcon from '../../../assets/icons/mas.svg'
import BillIcon from '../../../assets/icons/ico_facturas.svg'

import { adminCheck } from '../../../common/lib/ValidationLib'
import { SecurityHOC } from '../../../common/HOC/SecurityHOC'

import {
  resetUrlMessages,
  setUrlMessagesCategory,
  setUrlMessagesDetail
} from '../../../common/components/send-url/store/actions/UrlMessagesActions'

import ButtonToTop from '../../../common/components/button-to-top/ButtonToTop'
import Spinner from '../../../common/components/spinner/Spinner'
import IconTextButton from '../../../common/components/icon-text-button/IconTextButton'
import { thunkListDossiers, thunkGetProvision, thunkGetMasterData } from '../../store/actions/ProvisionsThunkActions'
import {
  setCurrentProvisionPreparedToSend,
  setCurrentProvisionHasContactMeButton
} from '../../store/actions/ProvisionsActions'
import { StyledTabSelector, StyledTab } from '../../../common/components/styled-tab-selector/StyledTabSelector'
import { StyledMobileTab } from '../../../common/components/styled-tab-selector/styled-tab-selector-mobile/StyledTabSelectorMobile'
import OngoingProvisions from './ongoing-provisions/OngoingProvisions'
import ClosedProvisions from './closed-provisions/ClosedProvisions'
import useStyles from './ProvisionsList.styles'
import FirstContration from './first-contration/FirstContration'

// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../core/utils/gtm'

const ProvisionsList = (props: any) => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

  const { history } = props

  let documentNumber = useSelector((state: any) => state.user.profile.documentNumber)
  const provisions = useSelector((state: any) => state.provisions)
  const state = useSelector((state: any) => state)
  let provisionsList = useSelector((state: any) => state.provisions.provisionsList)

  const [searchedProvisions] = useState('')
  const [view, setView] = useState(0)
  const [isLoading, setIsLoading] = useState(provisions.count === 0)
  const [isLoadingDossier, setIsLoadingDossier] = useState(false)
  const [isSubLoading, setIsSubLoading] = useState(false)
  const [isLoadingCont, setIsLoadingCont] = useState(false)

  const [dossierStatus, setDossierStatus] = useState([] as any)
  const [certificateON, setCertificateON] = useState('')
  const [firstContrationEnabled, setFirstContrationEnabled] = useState(false)

  
  useEffect(() => {
    // LCS: Enviar evento de GdC a GA - Wave 2
    sendGAEvent({
      event: 'view',
      content_group: 'mi conexion a la red',
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
  }, [])

  useEffect(() => {    
    dispatch(thunkGetMasterData(
      'CONTRACT',
      'ES',
      'SCREENS_ACTIVE',
      (r) => {
        if (r[0].value === '1') {
          setFirstContrationEnabled(true)
        } else if (r[0].value === '0') {
          setFirstContrationEnabled(false)
        } else {
          setFirstContrationEnabled(false)
        }
      }
    ))

    console.log('props: ', state)
  }, [])

  let userRoles = sessionStorage.getItem('userRoles') || ''
  let userRolesArray = userRoles.split(',')

  const clientDossierPanel = useSelector((state: any) => state.urlMessages.clientDossierPanel)

  const user = useSelector((state: any) => state.user.profile)

  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  let defaultDossierName = t('provisions.defaultName')

  // paginación
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  const [searchValue] = useState('')

  const [newOffset, setNewOffset] = useState(1)

  const [selectedTab, setSelectedTab] = useState(0)
  // 0 => Peticiones en curso
  // 1 => Peticiones cerradas
  // 2 => Consulta CUPS de primera contratación

  const handleChangeView = (newView) => {
    setView(newView)

    setCurrentPage(0)
  }

  useEffect(() => {
    if (dossierStatus.length === 0) {
      dispatch(thunkGetMasterData('DOSSIER_STATUS_ID', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), '', (response) => {
        if (response) {
          setDossierStatus(response)
        }
      }))
      dispatch(thunkGetMasterData('CERTIFICATE', 'ES', 'ACTIVE', (response) => {
        if (response[0].value !== '1') {
          setCertificateON('0')
        } else {
          setCertificateON('1')
        }
      }))

    }
    // eslint-disable-next-line
    
    sessionStorage.setItem('tab_selected', 'solicitudes en curso');
  }, [])

  useEffect(() => {
    if (props.location && props.location.state && props.location.state.redirectTo && props.location.state.redirectTo !== '') {
      // redirect to dossier details

      let defaultName = t('provisions.defaultName')

      dispatch(thunkGetProvision(props.location.state.redirectTo, defaultName, (response) => {
        if (response) {
          dispatch(setCurrentProvisionHasContactMeButton(true))

          history.push('/provisions/detail')
        } else {
          history.push('/provisions')
        }
      }))
    } else {
      dispatch(setCurrentProvisionHasContactMeButton(false))

      dispatch(setCurrentProvisionPreparedToSend(false))

      if (documentNumber && provisions.count === 0) {
        if (userRolesArray.includes('US_CC') || userRolesArray.includes('US_DOSSIER_CLIENT')) {
          setIsLoading(true)
          // carga inicial de expedientes
          dispatch(thunkListDossiers(
            defaultDossierName,
            newOffset, // offset
            20, // limit
            null, // búsqueda por dossierCod,
            false, // proveniente de una busqueda
            (response) => {
              if (response && response.length !== 0) {
                setNewOffset(newOffset + 1)
              } else {
                setIsLoading(false)
              }
            }
          ))
        }
      } else if (documentNumber && provisions.count !== 0 && newOffset !== 1) {
        setIsLoading(false)
        setIsSubLoading(true)
        dispatch(thunkListDossiers(
          defaultDossierName,
          newOffset, // offset
          20, // limit
          null, // búsqueda por dossierCod,
          false, // proveniente de una busqueda
          (response) => {
            if (response && response.length !== 0) {
              setNewOffset(newOffset + 1)
            }
            setIsSubLoading(false)
          }
        ))
        //setIsLoading(false)
      }
    }
    // eslint-disable-next-line
  }, [documentNumber, newOffset])

  // PPM 1007560 - Seteamos la categoría y el detalle de la pantalla actual para que el usuario Admin pueda mandarle el enlace al cliente vía correo/sms
  useEffect(() => {
    if (adminCheck()) {
      dispatch(resetUrlMessages())
      dispatch(setUrlMessagesCategory('PROVISIONS'))
      dispatch(setUrlMessagesDetail('PROVISIONS_LIST'))
    }
    else if (!clientDossierPanel) {
      dispatch(resetUrlMessages())
    }
  }, [])

  if (!userRolesArray.includes('US_CC') && !userRolesArray.includes('US_DOSSIER_CLIENT')) {
    return <Redirect to='/landing' />
  }
  
  const handleClickBills = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'browsing',
      section_name: 'mi conexion a la red',
      click_text: 'mis facturas',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.origin + '/provisions'),
      click_url: window.location.href,
      browsing_type: sessionStorage.getItem('browsing_type')
    });
  }

  const handleClickRequestNewService = () => {   
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'browsing',
      section_name: 'mi conexion a la red',
      click_text: 'solicitar una conexion a la red',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.origin + '/provisions'),
      click_url: window.location.href,
      browsing_type: sessionStorage.getItem('browsing_type')
    });
  }

  return (
    <div className={classes.block}>
      <ButtonToTop />

      {
        isLoadingDossier &&
        <Spinner fixed />
      }

      {
        isLoadingCont &&
        <Spinner fixed />
      }



      <Grid container className={classes.container}>
        <Grid item xs={11} md={10} className={classes.maxWidthForBigScreens}>
          <div className={(user && user.userId && user.userId == 0) ? classes.notRegisteredTitle : classes.title}>{t('provisions.title')}</div>

          {
            !adminCheck() ?
              <Grid container className={classes.navContainer}>
                <Grid item onClick={() => { handleClickRequestNewService()}}>
                  <Link to='/provisions/what-to-do' className={classes.newServiceLink}>
                    <IconTextButton icon={<img src={AddIcon} className={classes.iconTextButton} alt='' />} text={t('delegations.requestNewService')} />
                  </Link>
                </Grid>
                <Grid className={classes.billsLink} onClick={() => { handleClickBills()}}>
                  <Link to='/provisions/bills-list' className={classes.newServiceLink}>
                    <IconTextButton icon={<img src={BillIcon} className={classes.iconBillsButton} alt='' />} text={t('delegations.bills')} />
                  </Link>
                </Grid>
              </Grid>
              :
              <Grid container className={classes.secondNavContainer} onClick={() => { handleClickBills()}}>
                <Grid item className={classes.billsLink}>
                  <Link to='/provisions/bills-list' className={classes.newServiceLink}>
                    <IconTextButton icon={<img src={BillIcon} className={classes.iconBillsButton} alt='' />} text={t('delegations.bills')} />
                  </Link>
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
                       tab_name = 'solicitudes en curso'
                       break;
                    case 1:
                      tab_name = 'solicitudes cerradas'
                      break;
                    case 2:
                        tab_name = 'consulta de CUPS de primera contratacion'
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
                          className={classes.badge}
                        >
                          {t('requests.requestsList.tabs.ongoingSol')}
                        </Badge>
                      }
                    />
                    :
                    <StyledMobileTab
                      className={classes.tab}
                      label={
                        <Badge
                          classes={{ badge: classes.customBadge }}
                          className={classes.badge}
                        >
                          {t('requests.requestsList.tabs.ongoingSol')}
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
                          className={classes.badge}
                        >
                          {t('requests.requestsList.tabs.closedSol')}
                        </Badge>
                      }
                    />
                    :
                    <StyledMobileTab
                      className={classes.tab}
                      label={
                        <Badge
                          classes={{ badge: classes.customBadge }}
                          className={classes.badge}
                        >
                          {t('requests.requestsList.tabs.closedSol')}
                        </Badge>
                      }
                    />
                }

                {firstContrationEnabled && (
                  !mobile ?
                    <StyledTab
                      className={classes.tab}
                      style={{marginLeft:'-17px',maxWidth:'initial'}}
                      label={
                        <Badge
                          classes={{ badge: classes.customBadge }}
                          className={classes.badge}
                        >
                          <span style={{ whiteSpace:'nowrap',overflow: 'hidden',textOverflow:'ellipsis', position:'relative',left:'7px'}}>
                            {t('requests.requestsList.tabs.contratation')}
                          </span>
                        </Badge>
                      }
                    />
                    :
                    <StyledMobileTab
                      className={classes.tab}
                      style={{maxWidth:'initial'}}
                      label={
                        <Badge
                          classes={{ badge: classes.customBadge }}
                          className={classes.badge}
                        >
                         <span style={{ whiteSpace:'nowrap',overflow: 'hidden',textOverflow:'ellipsis'}}>
                            {t('requests.requestsList.tabs.contratation')}
                          </span>
                        </Badge>
                      }
                    />
                )}
              </StyledTabSelector>
            </div>

            {
              !isLoadingDossier &&
              <SwipeableViews
                index={selectedTab}
                className={classes.views}
                onChangeIndex={setSelectedTab}
              >
                <OngoingProvisions
                  handleChangeView={handleChangeView}
                  view={view}
                  provisionsList={provisionsList}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  searchValue={searchValue}
                  setIsLoadingDossier={setIsLoadingDossier}
                  isLoading={isLoading}
                  provisions={provisions}
                  searchedProvisions={searchedProvisions}
                  isSubLoading={isSubLoading}
                  setIsSubLoading={setIsSubLoading}
                  dossierStatus={dossierStatus}
                  setDossierStatus={setDossierStatus}
                  certificateON={certificateON}
                  setCertificateON={setCertificateON}
                />

                <ClosedProvisions
                  handleChangeView={handleChangeView}
                  view={view}
                  provisionsList={provisionsList}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  searchValue={searchValue}
                  setIsLoadingDossier={setIsLoadingDossier}
                  isLoading={isLoading}
                  provisions={provisions}
                  searchedProvisions={searchedProvisions}
                  isSubLoading={isSubLoading}
                  setIsSubLoading={setIsSubLoading}
                  dossierStatus={dossierStatus}
                  setDossierStatus={setDossierStatus}
                  certificateON={certificateON}
                  setCertificateON={setCertificateON}
                />
                {firstContrationEnabled && 
                ( 
                  <FirstContration 
                   setIsLoadingCont={setIsLoadingCont}
                  /> 
                )}
                {/* <UpdateCie
                  setIsLoadingCont={setIsLoadingCont}
                /> */}
              </SwipeableViews>
            }
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default SecurityHOC(ProvisionsList)
