import React from 'react';

import { Grid, useMediaQuery } from '@material-ui/core';
import styleClasses from './PasarelaNavbar.styles';
import { useTranslation } from 'react-i18next';

interface Navbar {
    tabValue: number;
    setTabValue: Function;
}

const PasarelaNavbar = (props: Navbar) => {

    const styles = styleClasses({});
    const { t } = useTranslation();
    const mobileRes = useMediaQuery('(max-width:576px)')


    return (
        <Grid container direction='row' justifyContent={(mobileRes) ? 'center' : 'flex-start'}>
            <span className={(props.tabValue === 0) ? styles.selectedTab : styles.tab} onClick={() => props.setTabValue(0)}>
                {t('controlMensajeria.payData.PagoExpedientes')}
            </span>

            <span className={(props.tabValue === 1) ? styles.selectedTab : styles.tab} onClick={() => props.setTabValue(1)}>
                {t('controlMensajeria.payData.PeticionesPasarela')} 
            </span>

            <span className={(props.tabValue === 2) ? styles.selectedTab : styles.tab} onClick={() => props.setTabValue(2)}>
               {t('controlMensajeria.payData.DesgloseKO')}  
            </span>

            <span className={(props.tabValue === 3) ? styles.selectedTab : styles.tab} onClick={() => props.setTabValue(3)}>
                {t('controlMensajeria.payData.Search')}
            </span>
        </Grid>
    );
}

export default PasarelaNavbar;