import React, { useEffect, useState } from 'react';

import { Grid } from '@material-ui/core';
import styleClasses from './Navbar.styles';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetMasterData } from '../../../gestionAverias/actions/GestionAveriasThunkActions';

interface Navbar {
  tabValue: number;
  setTabValue: Function;
}

const Navbar = (props: Navbar) => {

  const styles = styleClasses({});
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [alertsVisible, setAlertsVisible] = useState(false)

  const user = sessionStorage.getItem('userDocument')

  const userRoles = sessionStorage.getItem('userRoles') || ''
  const showMFAControlTab = userRoles.split(',').find(rol => rol === 'US_CC_WHITELIST')

  useEffect(() => {
    dispatch(thunkGetMasterData('EnabledUsersForAlerts', 'ES', 'ENABLED_USERS', (response) => {
      if (response && response.length > 0) {
        let users
        response.map(item => {
          users = item.value
        })
        console.log('Usuario -> ', user);
        let usersSplit = users.split(',')
        for (let i = 0; i < usersSplit.length; i++) {
          if (usersSplit[i] === user) {
            setAlertsVisible(true)
          }
        }
      }
    }))
  }, [])

  return (
    <Grid container direction='row' alignItems='center' justifyContent='center'>
      <span className={(props.tabValue === 0) ? styles.selectedTab : styles.tab} onClick={() => props.setTabValue(0)}>
        {t('consultasInformesNavBar.messageControl')}
      </span>

      <span className={(props.tabValue === 1) ? styles.selectedTab : styles.tab} onClick={() => props.setTabValue(1)}>
        {t('consultasInformesNavBar.paymentsControl')}
      </span>

      {alertsVisible &&
        <span className={(props.tabValue === 2) ? styles.selectedTab : styles.tab} onClick={() => props.setTabValue(2)}>
          {t('controlMensajeria.navigation.interruptionAlerts')}
        </span>
      }

      <span className={(props.tabValue === 3) ? styles.selectedTab : styles.tab} onClick={() => props.setTabValue(3)}>
        {t('consultasInformesNavBar.clientDigitizationControl')}
      </span>

      {
        showMFAControlTab && <span className={(props.tabValue === 4) ? styles.selectedTab : styles.tab} onClick={() => props.setTabValue(4)}>
          {t('messageManagementNavigation.mfaControl')}
        </span>
      }

    </Grid>
  );
}

export default Navbar;
