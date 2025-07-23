import { Grid } from '@material-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'
import useStyles from './FailureResultPage.styles'

interface DataInterface {
    type: string,
    alcance: string,
    motivo: string,
    aviso: string,
    typeList?: any[]
    alcanceList?: any[]
}

const Data = (prop: DataInterface) => {
    const { t } = useTranslation();
    const styles = useStyles({});

    return (
        <>
            <Grid container>
                <Grid item xs container className={styles.item}>
                    <h5 style={{color: '#004571', fontWeight: 'bold'}}>
                        {t('averias.management.resultPage.type_result')}: 
                    </h5>
                    <p>
                    {prop.type ? `${prop.type.includes('|') ? `${prop.type.split('|')[0]} - ${prop.type.split('|')[1]}` : prop.type}` : '--'}
                    </p>
                </Grid>
                <Grid item xs container className={`${styles.item} ${styles.item_2}`}>
                    <h5 style={{color: '#004571', fontWeight: 'bold'}}>
                        {t('averias.management.resultPage.alcance')}: 
                    </h5>
                    <p>
                    {prop.alcance ? `${prop.alcance.includes('|') ? `${prop.alcance.split('|')[0]} - ${prop.alcance.split('|')[1]}` : prop.alcance}` : '--'}
                    </p>
                </Grid>
                <Grid item xs container className={`${styles.item} ${styles.item_3}`}>
                    <h5 style={{color: '#004571', fontWeight: 'bold'}}>
                        {t('averias.management.resultPage.motivo')}: 
                    </h5>
                    <p>
                        {prop.motivo ? `${prop.motivo}` : '--'}
                    </p>
                </Grid>
            </Grid>
            <Grid item className={styles.separator} />
            <Grid container>
                <Grid item xs container className={styles.item}>
                    <h5 style={{color: '#004571', fontWeight: 'bold'}}>
                        {t('averias.management.resultPage.aviso')}{prop.aviso ? ':' : ''}
                    </h5>
                    <p style={{ whiteSpace: 'pre-line' }}>
                        {prop.aviso ? `${prop.aviso}` : ''}
                    </p>
                </Grid>

            </Grid>
        </>
    )
}

export default Data