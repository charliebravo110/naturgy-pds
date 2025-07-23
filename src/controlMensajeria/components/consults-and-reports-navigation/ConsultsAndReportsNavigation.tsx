import React from 'react';

import { Grid } from '@material-ui/core';
import styleClasses from './ConsultsAndReportsNavigation.styles';
import { useTranslation } from 'react-i18next';

interface ConsultsAndReportsNavbar {
    tabValue: number;
    setTabValue: Function;
}

const ConsultsAndReportsNavbar = (props: ConsultsAndReportsNavbar) => {

    const styles = styleClasses({});
    const { t } = useTranslation();

    return (
        <Grid container direction='row'>

            <span className={(props.tabValue === 0) ? styles.selectedTab : styles.tab} onClick={() => props.setTabValue(0)}>
                {t('controlMensajeria.navigation.welcomeMessages')}
            </span>

            <span className={(props.tabValue === 1) ? styles.selectedTab : styles.tab} onClick={() => props.setTabValue(1)}>
                {t('controlMensajeria.navigation.interruptionAlerts')}
            </span>

        </Grid>
    );
}

export default ConsultsAndReportsNavbar;
