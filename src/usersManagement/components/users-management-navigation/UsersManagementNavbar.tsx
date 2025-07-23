import React from 'react';

import { Grid } from '@material-ui/core';
import styleClasses from './UsersManagementNavbar.styles';
import { useTranslation } from 'react-i18next';

interface UsersManagementNavbar {
    tabValue: number;
    setTabValue: Function;
}

const UsersManagementNavbar = (props: UsersManagementNavbar) => {

    const styles = styleClasses({});
    const { t } = useTranslation();

    return (
        <Grid container direction='row' className={styles.column}>
            <span className={(props.tabValue === 1) ? styles.selectedTab : styles.tab} onClick={() => props.setTabValue(1)}>
                {t('gestionUsuarios.management.modeTab.deleteUser')}
            </span>

            <span className={(props.tabValue === 2) ? styles.selectedTab : styles.tab} onClick={() => props.setTabValue(2)}>
                {t('gestionUsuarios.management.modeTab.activeUsers')}
            </span>
        </Grid>
    );
}

export default UsersManagementNavbar;
