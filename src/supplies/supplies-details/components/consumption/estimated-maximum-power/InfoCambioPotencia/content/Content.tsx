import React from 'react'
import { useTranslation } from 'react-i18next'

import { DialogActions } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Button from '../../../../../../../common/components/button/Button'
import TextButton from '../../../../../../../common/components/text-button/TextButton'
import CloseIcon from '../../../../../../../assets/icons/cerrar.svg'

import useStyles from './Content.styles'

const Content = (props: any) => {

    const { t } = useTranslation()
    const classes = useStyles({})

    const { closeFunction
    } = props

    return (
        <>
            <Grid container justifyContent='flex-end'>
                <TextButton className={classes.closeButton} onClick={closeFunction}>
                    <img src={CloseIcon} alt='' />
                </TextButton>
            </Grid>
            <Grid item className={classes.title}>
                {t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.title11')}
            </Grid>
            <Grid container direction='row'>
                <Grid item xs={12} sm={6} alignItems='flex-start'>
                    <p className={classes.infoTextOrange}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.subtitle1col1')}
                    </p>
                    <p className={classes.infoText}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.par1col1lin1')}
                    </p>
                    <p className={classes.infoTextOrange}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.subtitle2col1')}
                    </p>
                    <p className={classes.infoText}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.par2col1lin1')}
                    </p>
                    <p className={classes.infoTextB}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.par2col1lin7n')}
                    </p>
                    <p className={classes.infoTextB}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.par2col1lin9n')}
                    </p>
                    <p className={classes.infoTextT}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.par2col1lin10')}
                    </p>
                    <p className={classes.infoTextB}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.par2col1lin11n')}
                    </p>
                    <p className={classes.infoTextT}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.par2col1lin12')}
                    </p>
                </Grid>

                <Grid item xs={12} sm={6} alignItems='flex-end'>
                    <p className={classes.infoTextOrange}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.subtitle1col2')}
                    </p>
                    <p className={classes.infoText}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.par1col2lin1')}
                    </p>
                    <p className={classes.infoTextB}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.par1col2lin3n')}
                    </p>
                    <p className={classes.infoTextT}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.par1col2lin4')}
                    </p>
                    <p className={classes.infoTextT}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.par1col2lin5')}
                    </p>
                    <p className={classes.infoTextT}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.par1col2lin6')}
                    </p>
                    <p className={classes.infoTextT}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.par1col2lin7')}
                    </p>
                    <p className={classes.infoText}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.par1col2lin8')}
                    </p>
                    <p className={classes.infoText}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.par1col2lin12p1')}
                        <b>{t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.par1col2lin12p2n')}</b>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.par1col2lin12p3')}
                    </p>
                    <p className={classes.infoTextOrange}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.subtitle2col2')}
                    </p>
                    <p className={classes.infoText}>
                        <b>{t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.par2col2lin3n')}</b>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.popupPowerChange.par2col2lin4')}
                    </p>
                </Grid>
            </Grid>

            <DialogActions>
                <Grid container direction='row' justifyContent='center' className={classes.buttons}>
                    <Button
                        className={classes.button}
                        text={t('Cerrar')}
                        color='primary'
                        font-weight='bold'
                        size='large'
                        variant='contained'
                        onClick={closeFunction}
                    />
                </Grid>
            </DialogActions>
        </>
    )
}

export default Content