import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import TextButton from '../../../../../../common/components/text-button/TextButton'
import useStyles from './ConnectError.styles'

import CloseIcon from '../../../../../../assets/icons/cerrar.svg'
import AlertIcon from '../../../../../../assets/icons/aviso_alerta_pop_up.svg'
import Button from '../../../../../../common/components/button/Button'

import { adminCheck } from '../../../../../../common/lib/ValidationLib'

const ConnectError = (props: any) => {

    const classes = useStyles({})
    const { t } = useTranslation()

    const {
        handleClickConsult,
        reading,
        handleEnviarPeticion,
        handleClickItem
    } = props

    const [executionDate, setExecutionDate] = useState<any>()

    useEffect(() => {
        if  (reading && reading.timestamp) {
            const timezone = new Date(reading.timestamp)
            const year = timezone.getFullYear()
            const monthN = timezone.getMonth()
            const day = ('0' + timezone.getDate()).slice(-2)
            const hours = ('0' + timezone.getHours()).slice(-2)
            const minutes = ('0' + timezone.getMinutes()).slice(-2)
            const time = hours + ':' + minutes + 'h'
            let monthI18N
            switch (monthN) {
                case 0:
                    monthI18N = 'january'
                    break
                case 1:
                    monthI18N = 'february'
                    break
                case 2:
                    monthI18N = 'march'
                    break
                case 3:
                    monthI18N = 'april'
                    break
                case 4:
                    monthI18N = 'may'
                    break
                case 5:
                    monthI18N = 'june'
                    break
                case 6:
                    monthI18N = 'july'
                    break
                case 7:
                    monthI18N = 'agost'
                    break
                case 8:
                    monthI18N = 'september'
                    break
                case 9:
                    monthI18N = 'october'
                    break
                case 10:
                    monthI18N = 'november'
                    break
                case 11:
                    monthI18N = 'december'
                    break
            }
            const month = t(`supplies.suppliesDetails.components.meter.connectSuccess.months.${monthI18N}`)
            const auxDate = day + ' ' + month + ' ' + year + ' / ' + time
            setExecutionDate(auxDate)
        }
        // eslint-disable-next-line
    }, [])

    return (
        <Grid container className={classes.container} justifyContent='center'>
            <Grid container justifyContent='flex-end'>
                <TextButton className={classes.closeButton} onClick={handleClickConsult}>
                    <img src={CloseIcon} alt='' />
                </TextButton>
            </Grid>
            <Grid container direction='column' spacing={4} justifyContent='center'>
                <Grid item>
                    <img className={classes.icon} src={AlertIcon} alt='' />
                </Grid>

                <Grid item className={classes.date}>
                    {executionDate}
                </Grid>

                <Grid item className={classes.title}>
                    {t('supplies.suppliesDetails.components.meter.connectError.first.title')}
                </Grid>
                <Grid item className={classes.description}>
                    {t('supplies.suppliesDetails.components.meter.connectError.first.description2')}
                </Grid>
                <Grid container spacing={10} justifyContent='center'>
                    <Grid item>
                        <Button
                            text={t('supplies.suppliesDetails.components.meter.buttons.retry')}
                            color={'primary'}
                            size={'large'}
                            variant={'contained'}
                            onClick={handleClickConsult}
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            text={t('supplies.suppliesDetails.components.meter.buttons.enviarPeticion')}
                            color={'primary'}
                            size={'large'}
                            variant={'contained'}
                            disabled={adminCheck()}
                            onClick={handleClickItem}
                        />
                    </Grid>

                </Grid>
            </Grid>
        </Grid>
    )

}

export default ConnectError