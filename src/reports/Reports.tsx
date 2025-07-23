import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import {
    StyledTabSelector,
    StyledTab
} from '../common/components/styled-tab-selector/StyledTabSelector';
import Grid from '@material-ui/core/Grid'
import useStyles from './Report.styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTranslation } from 'react-i18next'
import ArrowRightIcon from '../assets/icons/flecha_derecha.svg';
import ControlMensajeria from '../controlMensajeria/components/consultsAndReports/ConsultsAndReports';
import AuditManagement from '../auditManagement/components/AuditManagement';

const Reports = () => {
    const classes = useStyles({})
    const tabletRes = useMediaQuery('(max-width:768px)')
    const mobileRes = useMediaQuery('(max-width:576px)')
    const [tabValue, setTabValue] = useState(0);
    const { t } = useTranslation()

    return (
        <Grid container justifyContent='center' alignItems='center' className={classes.container}>
            <Grid item xs={11} sm={10} className={classes.maxWidthForBigScreens}>
                <Grid item className={classes.rightContainer} xs={10}>
                    <Grid item className={`${classes.navigationWrapper} rightContent`}>
                        <StyledTabSelector
                            className={`${classes.tabSelector} ${classes.tabs} navigation-tabs`}
                            value={tabValue}
                            onChange={(event, newValue) => setTabValue(newValue)}
                            indicatorColor='primary'
                            textColor='primary'
                            orientation={'horizontal'}
                            TabIndicatorProps={{}}
                        >
                            <StyledTab
                                className={(tabletRes || mobileRes) ? classes.tabMobile : classes.tab}
                                label={t('messageManagementNavigation.welcome')}
                                component={Link}
                                onClick={() => setTabValue(0)}
                            />
                            <StyledTab
                                className={(tabletRes || mobileRes) ? classes.tabMobile : classes.tab}
                                label={t('messageManagementNavigation.mfaControl')}
                                component={Link}
                                onClick={() => setTabValue(1)}
                            />

                        </StyledTabSelector>
                    </Grid>
                </Grid>
                <>
                    {
                        tabValue === 0 ?
                            <ControlMensajeria />
                            :
                            <AuditManagement />
                    }

                </>
            </Grid>
        </Grid>
    )
}

export default Reports;