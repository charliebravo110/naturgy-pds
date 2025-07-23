import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom'

import Spinner from '../../../common/components/spinner/Spinner';
import Checkbox from '../../../common/components/checkbox/Checkbox';

import { thunkGetMfaForceData, thunkSetMfaForceData } from '../../actions/MfaAdminThunkActions';
import useStyles from './MfaAdmin.styles';

// LCS: Importa la función - Wave 2
import { removeEmails, sendGAEvent } from '../../../core/utils/gtm';

const MfaAdmin = (props: any) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { t } = useTranslation();
    const styles = useStyles({});
    const dispatch = useDispatch();

    const [internal, setInternal] = useState(false);
    const [external, setExternal] = useState(false);

    const userRoles = sessionStorage.getItem('userRoles') || ''
    const userRolesArray = userRoles.split(',')

    useEffect(() => {
        // LCS: Enviar evento de GdC a GA - Wave 3
        sendGAEvent({
            event: 'view',
            content_group: 'mfa',
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

        try {        
            setIsLoading(true);
            dispatch(thunkGetMfaForceData((response) => {
                if(response.force_mfa_internal){
                    setInternal(response.force_mfa_internal);
                }
                if(response.force_mfa_external){
                    setExternal(response.force_mfa_external);
                }
                setIsLoading(false);
            }))
        } catch (e) {
            // LCS: Enviar evento a GA - Wave 2
            sendGAEvent({
                event: 'react_error',
                info:{
                error_message: 'Fallo a la hora de cargar el componente Mfa',
                error: e,
                reactComponent: 'MfaAdmin.tsx - useEffect',
                }
            });
        }
    }, []);

    const handleClick = (check: string) => {
        setIsLoading(true);
        const data = {
            internal: check === 'internal' ? !internal : internal,
            external: check === 'external' ? !external : external
        }
        dispatch(thunkSetMfaForceData((response) => {
            if (check === 'internal') {
                setInternal(state => !state)
            } else {
                setExternal(state => !state)
            }        
            // LCS: Enviar evento a GA - Wave 2
            sendGAEvent({
                event: 'mandatory_mfa',
                info:{
                    value: check === 'internal' ? internal : external,
                    type: check === 'external' ? 'external' : 'internal',
                },
                user_type: sessionStorage.getItem('user_type'),
                user_id: sessionStorage.getItem('id'),
                //user_document: sessionStorage.getItem('userDocumentLogin')
            });
            setIsLoading(false);
        }, data));
    }

    if (!userRolesArray.includes('US_CC_MFA_ADMIN')) {
        if (userRolesArray.includes('US_SUPPLYPOINT_CLIENT') || userRolesArray.includes('US_MANAGER')) {
            return <Redirect to='/dashboard' />
        } else if (userRolesArray.includes('US_CONSULTANT')) {
            return <Redirect to='/supplies' />
        } else {
            return <Redirect to='/landing' />
        }
    }

    return (
        <>
            {
                isLoading &&
                <Spinner fixed={true} />
            }
            <Grid container justify='center' alignItems='center' className={styles.container}>
                <Grid item xs={12} sm={10} className={styles.maxWidthForBigScreens}>
                    <Grid item className={styles.headerTitle}>
                        {t('mfa.title')}
                    </Grid>
                    <Grid container className={styles.searchContainer}>
                        <Grid className={styles.mfaCheck}>
                            <Checkbox
                                style={{
                                    color: '#004571'
                                }}
                                checked={external}
                                onClick={(event) => handleClick('external')}
                            />
                            <Grid item className={styles.textBold}>
                                <p>{t('mfa.customers')}</p>
                            </Grid>
                        </Grid>
                        <Grid className={styles.mfaCheck}>
                            <Checkbox
                                style={{
                                    color: '#004571'
                                }}
                                checked={internal}
                                onClick={(event) => handleClick('internal')}
                            />
                            <Grid item className={styles.textBold}>
                                <p>{t('mfa.callCenter')}</p>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default MfaAdmin;