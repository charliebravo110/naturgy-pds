import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

import MeterConnecting from '../../../../../../assets/icons/loading_contador.gif'

import Grid from '@material-ui/core/Grid'
import useStyles from './ConnectingMessage.styles'

const ConnectingMesage = (props: any) => {

    const classes = useStyles({})
    const { t } = useTranslation()

    const { timeout, maxTime, meterTimeout } = props

    const [timeText, setTimeText] = useState('')

    useLayoutEffect(() => {
        if (timeout <= 60000) {
            const seconds = +timeout / 1000
            setTimeText(`${t('supplies.suppliesDetails.components.meter.connecting.description.first')} ${Math.floor(seconds)} ${t('supplies.suppliesDetails.components.meter.connecting.description.second.seconds')}`)
        } else {
            const minutes = +timeout / 60000
            const secondsRest = +((minutes % 1).toFixed(2)) * 60
            if (secondsRest > 0) {
                setTimeText(`${t('supplies.suppliesDetails.components.meter.connecting.description.first')} ${Math.floor(minutes)} ${t('supplies.suppliesDetails.components.meter.connecting.description.second.minutesAnd')} ${Math.floor(secondsRest)} ${t('supplies.suppliesDetails.components.meter.connecting.description.second.seconds')}`)
                } else {
                setTimeText(`${t('supplies.suppliesDetails.components.meter.connecting.description.first')} ${Math.floor(minutes)} ${t('supplies.suppliesDetails.components.meter.connecting.description.second.minutes')}`)
            }
        }
        // eslint-disable-next-line
    }, [timeout])

    return (
        <Grid container className={classes.container} justifyContent='center'>
            <Grid container direction='column' spacing={4} justifyContent='center'>
                <Grid item >
                    <img src={MeterConnecting} alt='' />
                </Grid>
                <Grid item className={classes.title}>
                    {t('supplies.suppliesDetails.components.meter.connecting.title')}
                </Grid>
                {meterTimeout ?
                    <>
                        <Grid item className={classes.description}>
                            {t('supplies.suppliesDetails.components.meter.connecting.description.first2')}
                        </Grid>
                        <Grid item className={classes.description}>
                            {t('supplies.suppliesDetails.components.meter.connecting.description.first3')}
                        </Grid>
                    </>
                    :
                    <Grid item className={classes.description}>
                        {timeText}
                    </Grid>

                }


            </Grid>
        </Grid>
    )
}

export default ConnectingMesage