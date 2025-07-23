import { Grid } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useStyles from './FailureResultPage.styles'
import { useDispatch } from 'react-redux'
import { thunkGetMasterData } from '../../../supplies/supplies-details/store/actions/SuppliesDetailsThunkActions'

interface PeticionInterface {
    SR: string
    type: string
    status: string
    substatus: string
    code: string
}

const Peticion = (props: PeticionInterface) => {
    const dispatch = useDispatch()
    const { t } = useTranslation();
    const styles = useStyles({});
    const [type_aux, setTypeAux] = useState(props.type ? props.type : '--')
    useEffect(() => {
        dispatch(thunkGetMasterData('TYPOLOGY_DESCRIPTION', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), props.SR, (response) => {
            if (response && response) {
                setTypeAux(response[0].value ? response[0].value : props.type ? props.type : '--')
            }
        }))
    }, [props.SR])

    return (
        <>
            <Grid container className={styles.flex}>
                <Grid item xs container className={styles.flex} alignItems='center'>
                    <Grid item>
                        <h5 style={{color: '#004571', fontWeight: 'bold',marginRight:'5px'}}>
                            {t('averias.management.resultPage.SR')}: 
                        </h5>
                    </Grid>
                    <Grid item>
                        <p>
                            {props.SR ? props.SR : '--'}
                        </p>
                    </Grid>
                </Grid>
                <Grid item xs container className={styles.flex} alignItems='center'>
                    <Grid item>
                        <h5 style={{color: '#004571', fontWeight: 'bold',marginRight:'5px'}}>
                            {t('averias.management.resultPage.type')}:
                        </h5>
                    </Grid>
                    <Grid item>
                        <p>
                            {type_aux}
                        </p>
                    </Grid>
                </Grid>
                <Grid item xs container className={styles.flex} alignItems='center'>
                    <Grid item>
                        <h5 style={{color: '#004571', fontWeight: 'bold',marginRight:'5px'}}>
                            {t('averias.management.resultPage.Status')}: 
                        </h5>
                    </Grid>
                    <Grid item>
                        <p>
                            {props.status ? props.status : '--'}
                        </p>
                    </Grid>
                </Grid>
            </Grid>
            {props.substatus && (
                <Grid container style={{marginTop:'-16px'}} className={styles.flex}>
                    {/* <Grid item xs container className={styles.flex} alignItems='center' /> */}
                    <Grid item xs container className={styles.flex} alignItems='center'>
                        
                        <h5 style={{color: '#004571', fontWeight: 'bold',marginRight:'5px'}}>
                            {t('averias.management.resultPage.substatus')}{props.substatus ? ': ' : ' '}
                        </h5>
                        
                       
                         <p style={{maxWidth:'300px',overflow:'hidden',textOverflow:'ellipsis',position:'relative', ...(props.substatus.length > 34 ? { top: '10px' } : {})}}>
                            {props.substatus ? props.substatus : '--'}
                        </p>
                       
                       
                    </Grid>
                    {/* <Grid item xs container className={styles.flex} alignItems='center' /> */}
                </Grid>
            )}
            {props.code && (
                <>
                    <Grid item className={styles.separator} />
                    <Grid container className={styles.flex}>
                        <Grid item xs container className={styles.flex} alignItems='center'>
                            <Grid item>
                                <h5 style={{color: '#004571', fontWeight: 'bold',marginRight:'5px'}}>
                                    {t('averias.management.resultPage.code')}: 
                                </h5>
                            </Grid>
                            <Grid item xs>
                                <p>
                                    {props.code ? props.code : '--'}
                                </p>
                            </Grid>
                        </Grid>
                    </Grid>
                </>
            )}
        </>
    )
}

export default Peticion