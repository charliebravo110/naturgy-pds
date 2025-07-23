import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  StyledTabSelector,
  StyledTab
} from '../../../common/components/styled-tab-selector/StyledTabSelector'

import ArrowRightIcon from '../../../assets/icons/flecha_derecha.svg'
import { hasNotUserPermissions } from '../../../common/lib/UserPermissionsLib'
import useStyles from './HeaderNavigation.styles'



const GlobalHeaderNavigation = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()

  let supplantedUser = sessionStorage.getItem('supplantedUser')
  let hasUserPermissions = !hasNotUserPermissions()

  const [tabValue, setTabValue] = useState(0)
  const userRoles = useSelector((state: any) => state.user.profile.roles)
  const adminToken = useSelector((state: any) => state.admin.token)
  const userToken = useSelector((state: any) => state.user.token)
  const { tabletRes, mobileRes, handleChangeMenuVisible } = props

  const { t } = useTranslation()

  

  return (
    <>
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
          <StyledTab
            className={(tabletRes || mobileRes) ? classes.tabMobile : classes.tab}
            label={t('Control Mensajeria')}
            component={Link}
            to={'/controlMensajeria'}
            onClick={handleChangeMenuVisible}
            icon={
              (tabletRes || mobileRes) &&
              <img src={ArrowRightIcon} alt='' />
            }
          />
        }

{
          <StyledTab
            className={(tabletRes || mobileRes) ? classes.tabMobile : classes.tab}
            label={t('Datos pasarela pago')}
            component={Link}
            to={'/controlPagos'}
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

export default withRouter(GlobalHeaderNavigation)
