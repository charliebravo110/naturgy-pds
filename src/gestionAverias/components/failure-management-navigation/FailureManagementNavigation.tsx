import React from 'react';

import { Grid } from '@material-ui/core';
import styleClasses from './FailureManagementNavigation.styles';
import { useTranslation } from 'react-i18next';

interface FailureManagementNavbar {
    tabValue: number;
    setTabValue: Function;
    tabletRes: boolean;
    mobileRes: boolean;
}

const FailureManagementNavbar = (props: FailureManagementNavbar) => {

    const styles = styleClasses({});
    const { t } = useTranslation();

    return (
        <Grid container direction='row' className={(props.tabletRes) ? styles.mobilePadding : ''}>
            <span className={(props.tabValue === 0) ? styles.selectedTab : styles.tab} onClick={() => props.setTabValue(0)}>
                {t('averias.management.modeTab.cups')}
                <br />
                {t('averias.management.modeTab.cups_sub')}
            </span>

            <span className={(props.tabValue === 1) ? styles.selectedTab : styles.tab} onClick={() => props.setTabValue(1)}>
                {t('averias.management.modeTab.create')}
                <br />
                {t('averias.management.modeTab.create_sub')}
            </span>

            <span className={(props.tabValue === 2) ? styles.selectedTab : styles.tab} onClick={() => props.setTabValue(2)}>
                {t('averias.management.modeTab.consult')}
            </span>
        </Grid>
    );
}

export default FailureManagementNavbar;
