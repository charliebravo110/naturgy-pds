import { Grid } from '@material-ui/core'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useStyles from './FailureResultPage.styles'
import { useLocation } from 'react-router'
import { ItemText } from '../supplyPointPanel/components/itemText'

const ContactData = (props) => {
    const { t } = useTranslation();
    const styles = useStyles({});

    const location = useLocation();
    const returnData:any= location.state;

    const contact = (returnData && returnData.contactPerson) ? `${returnData.contactPerson}` : '';
    const phone = (returnData && returnData.phone) ? `${returnData.phone}` : '';
    
    return (
        <>
            <Grid container justifyContent='center' className={styles.bkg}>
                <Grid container alignItems='center' justifyContent='center'>
                        <ItemText title={t('averias.management.resultPage.contact')} text={contact? contact : '--'} className={styles.centeredItem}/>
                </Grid>
                <Grid container alignItems='center' justifyContent='center'>                 
                        <ItemText title={t('averias.management.resultPage.phone')} text={phone? phone : '--'}  className={styles.centeredItem}/>                   
                </Grid>
        </Grid>
        </>
    )
}

export default ContactData