import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Badge from '@material-ui/core/Badge'
import {
  StyledTabSelector,
  StyledTab
} from '../../../common/components/styled-tab-selector/StyledTabSelector'

import ArrowRightIcon from '../../../assets/icons/flecha_derecha.svg'
import { hasNotUserPermissions } from '../../../common/lib/UserPermissionsLib'
import useStyles from './HeaderNavigation.styles'
import requestRoleFilter from '../../../requests/components/request-filter/RequestFilter'
import { thunkCancelSupplantUser } from '../../../admin/store/actions/AdminThunkActions'
import { Helmet } from 'react-helmet'

import {
  setCurrentSupplyConsumptions,
  setCurrentCompareConsumptions,
} from '../../../supplies/store/actions/SuppliesActions'
import { thunkGetMasterData } from '../../../provisions/store/actions/ProvisionsThunkActions'

const HeaderNavigation = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()

  let supplantedUser = sessionStorage.getItem('supplantedUser')
  let hasUserPermissions = !hasNotUserPermissions()

  const [tabValue, setTabValue] = useState <any>(0)
  const [cabeceraAverias, setCabeceraAverias] = useState(false)
  const userRoles = useSelector((state: any) => state.user.profile.roles)
  const userRolesArray = userRoles ? userRoles.split(',') : (sessionStorage.getItem('userRoles') || '').split(',')

  const adminToken = useSelector((state: any) => state.admin.token)
  const userToken = useSelector((state: any) => state.user.token)
  const requests = useSelector((state: any) => state.requests)
  const { tabletRes, mobileRes, handleChangeMenuVisible } = props

  const { t } = useTranslation()
  const supplies = useSelector((state: any) => state.supplies)

  const isWhite = userRolesArray.includes('US_CC_WHITELIST');

  const [filterList, setFilterList] = useState([])

  const [firstContrationEnabled, setFirstContrationEnabled] = useState(false)


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
  }, [])

  let suppliesRedirectTo
  let provisionsRedirectTo
  let dashboarddirectTo

  if (userRoles !== '') {
    let userRolesArray = userRoles.split(',')

    if (adminToken || userRolesArray.includes('US_MANAGER') || userRolesArray.includes('US_SUPPLYPOINT_CLIENT')) {
      dashboarddirectTo = '/dashboard'
    } else {
      dashboarddirectTo = '/dashboard'
    }

    if (adminToken || userRolesArray.includes('US_SUPPLYPOINT_CLIENT')) {
      suppliesRedirectTo = '/supplies'
    } else {
      suppliesRedirectTo = '/suppliesVinculation'
    }

    if (adminToken || userRolesArray.includes('US_DOSSIER_CLIENT')) {
      provisionsRedirectTo = '/provisions'
    } else {
      provisionsRedirectTo = '/provisionsVinculation'
    }
  } else {
    suppliesRedirectTo = '/login'
    provisionsRedirectTo = '/provisionsVinculation'
    dashboarddirectTo = '/dashboard'
  }

  useEffect(() => {
    if (cabeceraAverias && supplantedUser === '0') {
      dispatch(thunkCancelSupplantUser())
      supplantedUser = ''
    }

  }, [tabValue])

  useEffect(() => {
    dispatch(setCurrentSupplyConsumptions([]))
    dispatch(setCurrentCompareConsumptions([]))
    if (adminToken !== '' && ((userRoles === '' && !supplantedUser) || (props.location.pathname.includes('/gestionAverias')))) {
      if (props.location.pathname === '/admin') {
        setCabeceraAverias(false)
        setTabValue('admin')
      } else if (props.location.pathname.includes('/gestionAverias')) {
        setCabeceraAverias(true)
        setTabValue('gestionAverias')
      } else if (props.location.pathname === '/consultas-informes') {
        setCabeceraAverias(false)
        setTabValue('consultas-informes')
      } else if (props.location.pathname === '/gestionUsuariosCallCenter') {
        setCabeceraAverias(false)
        setTabValue('gestionUsuariosCallCenter')
      } else if (props.location.pathname === '/faqs') {
        setCabeceraAverias(false)
        setTabValue('faqs') // userRolesArray.includes('US_CC_WHITELIST')
      } else if (props.location.pathname === '/mfa-admin') {
        setCabeceraAverias(false)
        setTabValue('mfa-admin')
      }
    } else {
      setCabeceraAverias(false)
      if (supplies.list && supplies.list.length > 0 && supplies.list.length < 6) {
        if (props.location.pathname === '/dashboard') {
          setTabValue('dashboard')
        } else if (props.location.pathname.includes('/supplies')) {
          setTabValue('supplies')
        } else if (props.location.pathname.includes('/provisions')) {
          setTabValue('provisions')
        } else if (props.location.pathname.includes('/requests')) {
          setTabValue('requests')
        } else if (props.location.pathname === '/faqs') {
          setTabValue('faqs')
        } else if (props.location.pathname === '/mfa-admin') {
          setTabValue('mfa-admin')
        } else {
          setTabValue(6) // CASO NO REAL POR SUPLANTACIÓN
        }
      } else {
        if (props.location.pathname.includes('/supplies')) {
          setTabValue('supplies')
        } else if (props.location.pathname.includes('/provisions')) {
          setTabValue('provisions')
        } else if (props.location.pathname.includes('/requests')) {
          setTabValue('requests')
        } else if (props.location.pathname === '/faqs') {
          setTabValue('faqs')
        } else if (props.location.pathname === '/dashboard') {
          setTabValue('dashboard')
        } else if (props.location.pathname === '/mfa-admin') {
          setTabValue('mfa-admin')
        } else {
          setTabValue(0)
        }
      }
    }
  }, [props.location.pathname, suppliesRedirectTo, adminToken, userRoles, supplantedUser])

  return (
    <>
      <Helmet
        htmlAttributes={{
          lang: sessionStorage.getItem('lang') || 'es',
        }}
      />
      <StyledTabSelector
        className={`${classes.tabSelector} ${(tabletRes || mobileRes) ? classes.tabsMobile : classes.tabs} navigation-tabs`}
        value={tabValue}
        onChange={(event, newValue) => setTabValue(newValue)}
        indicatorColor='primary'
        textColor='primary'
        orientation={(tabletRes || mobileRes) ? 'vertical' : 'horizontal'}
        TabIndicatorProps={(tabletRes || mobileRes) ?
          {
            style: {
              left: 0,
              width: 5,
              borderRadius: 0
            }
          } : {}
        }
      >
        {
          (hasUserPermissions && userToken !== '') && (supplies.list && supplies.list.length > 0) && (supplies.list && supplies.list.length < 6) && !cabeceraAverias &&
          <StyledTab
            className={(tabletRes || mobileRes) ? classes.tabMobile : isWhite ? classes.tabMfa : classes.tab}
            label={t('header.headerNavigation.links.dashboard')}
            value={'dashboard'}
            component={Link}
            to={dashboarddirectTo}
            onClick={handleChangeMenuVisible}
            icon={
              (tabletRes || mobileRes) &&
              <img src={ArrowRightIcon} alt='' />
            }
          />
        }

        {
          (hasUserPermissions && userToken !== '') && !cabeceraAverias &&
          <StyledTab
            className={(tabletRes || mobileRes) ? classes.tabMobile : isWhite ? classes.tabMfa : classes.tab}
            label={t('header.headerNavigation.links.mySupplies')}
            value={'supplies'}
            component={Link}
            to={suppliesRedirectTo}
            onClick={handleChangeMenuVisible}
            icon={
              (tabletRes || mobileRes) &&
              <img src={ArrowRightIcon} alt='' />
            }
          />
        }

        {
          (hasUserPermissions && userToken !== '') && !cabeceraAverias &&
          <StyledTab
            className={(tabletRes || mobileRes) ? classes.tabMobile : isWhite ? classes.tabMfa : classes.tab}
            label={t('header.headerNavigation.links.serviceProvision')}
            value={'provisions'}
            component={Link}
            to={provisionsRedirectTo}
            onClick={handleChangeMenuVisible}
            icon={
              (tabletRes || mobileRes) &&
              <img src={ArrowRightIcon} alt='' />
            }
          />
        }

        {
          (adminToken !== '' && ((userRoles === '' && !supplantedUser) || cabeceraAverias)) &&
          <StyledTab
            className={(tabletRes || mobileRes) ? classes.tabMobile : isWhite ? classes.tabMfa : classes.tab}
            label={t('header.headerNavigation.links.searchUser')}
            value={'admin'}
            component={Link}
            to='/admin'
            onClick={handleChangeMenuVisible}
            icon={
              (tabletRes || mobileRes) &&
              <img src={ArrowRightIcon} alt='' />
            }
          />
        }

        {
          (adminToken !== '' && ((userRoles === '' && !supplantedUser) || cabeceraAverias)) &&

          <StyledTab
            className={(tabletRes || mobileRes) ? classes.tabMobile : isWhite ? classes.tabMfa : classes.tab}
            label={t('header.headerNavigation.links.failureManagement')}
            value={'gestionAverias'}
            component={Link}
            to='/gestionAverias'
            onClick={handleChangeMenuVisible}
            icon={
              (tabletRes || mobileRes) &&
              <img src={ArrowRightIcon} alt='' />
            }
          />
        }

        {
          (adminToken !== '' && ((userRoles === '' && !supplantedUser) || cabeceraAverias)) &&

          <StyledTab
            className={(tabletRes || mobileRes) ? classes.tabMobile : isWhite ? classes.tabMfa : classes.tab}
            label={t('header.headerNavigation.links.messageManagement')}
            value={'consultas-informes'}
            component={Link}
            to='/consultas-informes'
            onClick={handleChangeMenuVisible}
            icon={
              (tabletRes || mobileRes) &&
              <img src={ArrowRightIcon} alt='' />
            }
          />
        }

        {
          (adminToken !== '' && ((userRoles === '' && !supplantedUser) || cabeceraAverias)) &&

          <StyledTab
            className={(tabletRes || mobileRes) ? classes.tabMobile : isWhite ? classes.tabMfa : classes.tab}
            label={t('header.headerNavigation.links.usersManagement')}
            value={'gestionUsuarios'}
            component={Link}
            to='/gestionUsuarios'
            onClick={handleChangeMenuVisible}
            icon={
              (tabletRes || mobileRes) &&
              <img src={ArrowRightIcon} alt='' />
            }
          />
        }

        {
          (adminToken !== '' && ((userRoles === '' && !supplantedUser) || cabeceraAverias ) && userRolesArray.includes('US_CC_WHITELIST')) &&
          <StyledTab
            className={(tabletRes || mobileRes) ? classes.tabMobile : isWhite ? classes.tabMfa : classes.tab}
            label={t('header.headerNavigation.links.usersManagementCall')}
            component={Link}
            value={'gestionUsuariosCallCenter'}
            to='/gestionUsuariosCallCenter'
            onClick={handleChangeMenuVisible}
            icon={
              (tabletRes || mobileRes) &&
              <img src={ArrowRightIcon} alt='' />
            }
          />          
        }

        {
          (hasUserPermissions && userToken !== '') && !cabeceraAverias &&
          <StyledTab
            className={(tabletRes || mobileRes) ? classes.tabMobile : isWhite ? classes.tabMfa : classes.tab}
            label={
              <Badge
                classes={{ badge: classes.customBadge }}
                className={requests.list.filter(item => item.indRead === 0).length !== 0 ? classes.badge : ''}
                badgeContent={requestRoleFilter(requests.list.filter(item => item.indRead === 0), filterList).length}
              >
                {t('header.headerNavigation.links.requests')}
              </Badge>
            }
            component={Link}
            value={'requests'}
            to='/requests'
            onClick={handleChangeMenuVisible}
            icon={
              (tabletRes || mobileRes) &&
              <img src={ArrowRightIcon} alt='' />
            }
          />
        }

        {
          <StyledTab
            className={(tabletRes || mobileRes) ? classes.tabMobile : isWhite ? classes.tabMfa : classes.tab}
            label='Preguntas Frecuentes'
            component={Link}
            value={'faqs'}
            to='/faqs'
            onClick={handleChangeMenuVisible}
            icon={
              (tabletRes || mobileRes) &&
              <img src={ArrowRightIcon} alt='' />
            }
          />
        }

        {
          (userRolesArray.includes('US_CC_MFA_ADMIN') && !supplantedUser) &&
          <StyledTab
            className={(tabletRes || mobileRes) ? classes.tabMobile : isWhite ? classes.tabMfa : classes.tab}
            label={t('header.headerNavigation.links.mfa')}
            component={Link}
            value={'mfa-admin'}
            to='/mfa-admin'
            onClick={handleChangeMenuVisible}
            icon={
              (tabletRes || mobileRes) &&
              <img src={ArrowRightIcon} alt='' />
            }
          />
        }
      </StyledTabSelector>
    </>
  )
}

export default withRouter(HeaderNavigation)
