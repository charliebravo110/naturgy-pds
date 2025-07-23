import { Grid } from '@material-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'
import useStyles from './FailureResultPage.styles'
import { ItemText } from '../supplyPointPanel/components/itemText'

interface AveriasInterface {
    consumo,
    direccion,
    titular,
    doc,
    provincia,
    ConsumIcon
}

const Averia = (props: AveriasInterface) => {
    const { t } = useTranslation();
    const styles = useStyles({});
    const consumo = props.consumo;
    const direccion = props.direccion;
    const titular = props.titular;
    const doc = props.doc;
    const provincia = props.provincia;
    const ConsumIcon = props.ConsumIcon

    return (
        <Grid container justifyContent='center' className={styles.bkg}>
            {consumo != '' &&
                // <Grid container alignItems='center' justifyContent='center'>
                //     <Grid item md={5} className={styles.descriptionLabel} style={{color: '#004571', fontWeight: 'bold'}}>
                //         <img src={ConsumIcon} alt='' className={styles.icon} />
                //         {t('averias.management.resultPage.consumption')}
                //     </Grid>
                //     <Grid item md={5} className={styles.inputValue}>
                //         {consumo}
                //     </Grid>
                // </Grid>
                <ItemText title={<><img src={ConsumIcon} alt='' className={styles.icon} />{t('averias.management.resultPage.consumption')}</>} text={consumo} className={`${styles.centeredItem} ${styles.imgQuote}`} />
            }
            {direccion != '' &&
                // <Grid container alignItems='center' justifyContent='center'>
                //     <Grid item md={5} className={styles.descriptionLabel} style={{color: '#004571', fontWeight: 'bold'}}>
                //         {t('averias.management.resultPage.adress')}
                //     </Grid>
                //     <Grid item md={5} className={styles.inputValue}>
                //         {direccion}
                //     </Grid>
                // </Grid>
                <ItemText title={t('averias.management.resultPage.adress')} text={direccion} className={styles.centeredItem} />
            }

            {titular != '' &&
                // <Grid container alignItems='center' justifyContent='center'>
                //     <Grid item md={5} className={styles.descriptionLabel} style={{color: '#004571', fontWeight: 'bold'}}>
                //         {t('averias.management.resultPage.owner')}
                //     </Grid>
                //     <Grid item md={5} className={styles.inputValue}>
                //         {titular}
                //     </Grid>
                // </Grid>
                <ItemText title={t('averias.management.resultPage.owner')} text={titular} className={styles.centeredItem} />
            }
            {doc != '' &&

                // <Grid container alignItems='center' justifyContent='center'>
                //     <Grid item md={5} className={styles.descriptionLabel} style={{color: '#004571', fontWeight: 'bold'}}>
                //         {t('averias.management.resultPage.document')}
                //     </Grid>
                //     <Grid item md={5} className={styles.inputValue}>
                //         {doc}
                //     </Grid>
                // </Grid>
                <ItemText title={t('averias.management.resultPage.document')} text={doc} className={styles.centeredItem} />
            }
            {/* {provincia != '' &&

                <Grid container alignItems='center' justifyContent='center'>
                    <Grid item md={5} className={styles.descriptionLabel} style={{color: 'blue', fontWeight: 'bold'}}>
                        {t('averias.management.resultPage.province')}
                    </Grid>
                    <Grid item md={5} className={styles.inputValue}>
                        {provincia}
                    </Grid>
                </Grid>
            } */}

        </Grid>
    )
}

export default Averia