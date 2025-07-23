import { Grid } from '@material-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'
import useStyles from './FailureResultPage.styles'
import { ItemText } from '../supplyPointPanel/components/itemText'

interface IncidenciaInterface {
    provincia,
    municipio,
    cotdigoPostalvincia,
    tipoVia,
    sreet,
    num
}

const Incidencia = (props : IncidenciaInterface) => {
    const { t } = useTranslation();
    const styles = useStyles({});
    const provincia = props.provincia
    const municipio = props.municipio
    const cotdigoPostalvincia = props.cotdigoPostalvincia;
    const tipoVia = props.tipoVia;
    const sreet = props.sreet;
    const num = props.num;

    
    return (
        <div className={styles.bkg}>
            <Grid container justifyContent='center'>
                {provincia != '' &&
                    // <Grid container alignItems='center' justifyContent='center'>
                    //     <Grid item md={5} className={styles.descriptionLabel}>
                    //         {t('averias.management.resultPage.province')}: 
                    //     </Grid>
                    //     <Grid item md={5} className={styles.inputValue}>
                    //         {provincia}
                    //     </Grid>
                    // </Grid>
                    <ItemText title={t('averias.management.resultPage.province')} text={provincia}  className={styles.centeredItem}/>    
                }
                {municipio != '' &&
                    // <Grid container alignItems='center' justifyContent='center'>
                    //     <Grid item md={5} className={styles.descriptionLabel}>
                    //         {t('averias.management.resultPage.town')}: 
                    //     </Grid>
                    //     <Grid item md={5} className={styles.inputValue}>
                    //         {municipio}
                    //     </Grid>
                    // </Grid>
                    <ItemText title={t('averias.management.resultPage.town')} text={municipio}  className={styles.centeredItem}/>    
                }
                {cotdigoPostalvincia != '' &&

                    // <Grid container alignItems='center' justifyContent='center'>
                    //     <Grid item md={5} className={styles.descriptionLabel}>
                    //         {t('averias.management.resultPage.zipCode')}: 
                    //     </Grid>
                    //     <Grid item md={5} className={styles.inputValue}>
                    //         {cotdigoPostalvincia}
                    //     </Grid>
                    // </Grid>
                    <ItemText title={t('averias.management.resultPage.zipCode')} text={cotdigoPostalvincia}  className={styles.centeredItem}/>    
                }
                {tipoVia != '' &&

                    // <Grid container alignItems='center' justifyContent='center'>
                    //     <Grid item md={5} className={styles.descriptionLabel}>
                    //         {t('averias.management.resultPage.streetName')}: 
                    //     </Grid>
                    //     <Grid item md={5} className={styles.inputValue}>
                    //         {tipoVia}
                    //     </Grid>
                    // </Grid>
                    <ItemText title={t('averias.management.resultPage.streetName')} text={tipoVia}  className={styles.centeredItem}/>    
                }
                {sreet != '' &&

                    // <Grid container alignItems='center' justifyContent='center'>
                    //     <Grid item md={5} className={styles.descriptionLabel} style={{color: '#004571', fontWeight: 'bold'}}>
                    //         {t('averias.management.resultPage.number')}: 
                    //     </Grid>
                    //     <Grid item md={5} className={styles.inputValue}>
                    //         {sreet}
                    //     </Grid>
                    // </Grid>
                    <ItemText title={t('averias.management.resultPage.number')} text={sreet}  className={styles.centeredItem}/>    
                }
                {num != '' &&

                    // <Grid container alignItems='center' justifyContent='center'>
                    //     <Grid item md={5} className={styles.descriptionLabel} style={{color: '#004571', fontWeight: 'bold'}}>
                    //         {t('averias.management.resultPage.number')}: 
                    //     </Grid>
                    //     <Grid item md={5} className={styles.inputValue}>
                    //         {num}
                    //     </Grid>
                    // </Grid>
                    <ItemText title={t('averias.management.resultPage.number')} text={num}  className={styles.centeredItem}/>    
                }

            </Grid>
        </div>
    )
}

export default Incidencia