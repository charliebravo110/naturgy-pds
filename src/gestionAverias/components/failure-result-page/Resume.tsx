import { Grid } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useStyles from './FailureResultPage.styles'
import { useDispatch } from 'react-redux'
import { thunkGetMasterData } from '../../../supplies/supplies-details/store/actions/SuppliesDetailsThunkActions'

interface PeticionInterface {
    SR: string
    type: string
    type_: string
    status: string
    substatus: string
    code: string
    alcance: string,
    motivo: string,
    typeList?: any[]
    alcanceList?: any[]
    avisoAlCor: Function
}

const Resume = (prop: PeticionInterface) => {
    const dispatch = useDispatch()
    const { t } = useTranslation();
    const styles = useStyles({});
    const [type_aux, setTypeAux] = useState(prop.type_ ? prop.type_ : '--')
    console.log('Prop type: ', prop);
    useEffect(() => {
        dispatch(thunkGetMasterData('TYPOLOGY_DESCRIPTION', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), prop.SR, (response) => {
            if (response && response[0]) {
                setTypeAux(response[0].value ? response[0].value : prop.type_ ? prop.type_ : '--')
            }
        }))
    }, [prop.SR])

    return (
        <>
            {prop.avisoAlCor() ? (
                <>
                    <Grid container>
                        <Grid item xs container className={styles.item_resume}>
                            <p>
                                <span className={styles.h5}>
                                    {t('averias.management.resultPage.type_result')}{prop.type ? ': ' : ' '}
                                </span>
                                <span>
                                    {prop.type ? `${prop.type.includes('|') ? `${prop.type.split('|')[0]} - ${prop.type.split('|')[1]}` : prop.type}` : '--'}
                                </span>
                            </p>
                        </Grid>
                        <Grid item xs container className={`${styles.item_resume}`}>
                            <p>
                                <span className={styles.h5}>
                                    {t('averias.management.resultPage.alcance')}{prop.alcance ? ': ' : ' '}
                                </span>
                                <span>
                                    {prop.alcance ? `${prop.alcance.includes('|') ? `${prop.alcance.split('|')[0]} - ${prop.alcance.split('|')[1]}` : prop.alcance}` : '--'}
                                </span>
                            </p>
                        </Grid>
                        <Grid item xs container className={`${styles.item_resume}`}>
                            <p>
                                <span className={styles.h5}>
                                    {t('averias.management.resultPage.motivo')}{prop.motivo ? ': ' : ' '}
                                </span>
                                <span>
                                    {prop.motivo ? `${prop.motivo}` : '--'}
                                </span>
                            </p>
                        </Grid>
                    </Grid>
                    <Grid item className={styles.separator} />
                </>
            ) : (
                <></>
            )}
            <Grid container>
                <Grid item xs container className={styles.item_resume}>
                    <p>
                        <span className={styles.h5}>
                            {t('averias.management.resultPage.SR')}{prop.SR ? ': ' : ' '}
                        </span>
                        <span>
                            {prop.SR ? prop.SR : '--'}
                        </span>
                    </p>
                </Grid>
                <Grid item xs container className={styles.item_resume}>
                    <p style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', position: 'relative', ...(type_aux.length > 34 ? { top: '10px' } : {}) }}>
                        <span className={styles.h5}>
                            {t('averias.management.resultPage.type')}{type_aux ? ': ' : ' '}
                        </span>
                        <span>
                            {type_aux ? type_aux : '--'}
                        </span>
                    </p>
                </Grid>
                <Grid item xs container className={styles.item_resume}>
                    <p>
                        <span className={styles.h5}>
                            {t('averias.management.resultPage.Status')}{prop.status ? ': ' : ' '}
                        </span>
                        <span>
                            {prop.status ? prop.status : '--'}
                        </span>
                    </p>
                </Grid>
            </Grid>
            {prop.substatus && (
                <Grid container spacing={0} style={{ marginTop: '-16px' }}>
                    <Grid item xs container className={styles.item_resume} />
                    <Grid item xs container className={styles.item_resume}>
                        <p>
                            <span className={styles.h5}>
                                {t('averias.management.resultPage.substatus')}{prop.substatus ? ': ' : ' '}
                            </span>
                            <span>
                                {prop.substatus ? prop.substatus : '--'}
                            </span>
                        </p>
                    </Grid>
                    <Grid item xs container className={styles.item_resume} />
                </Grid>
            )}
            {prop.code && (
                <>
                    <Grid item className={styles.separator} />
                    <Grid container>
                        <Grid item xs container className={styles.item_resume}>
                            <h5>
                                {t('averias.management.resultPage.code')}{prop.code ? ': ' : ' '}
                            </h5>
                            <p>
                                {prop.code ? prop.code : '--'}
                            </p>
                        </Grid>
                    </Grid>
                </>
            )}
        </>
    )
}

export default Resume