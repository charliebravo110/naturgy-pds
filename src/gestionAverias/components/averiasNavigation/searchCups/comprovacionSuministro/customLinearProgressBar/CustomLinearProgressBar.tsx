import React, { ChangeEvent, useState } from 'react'
import { Grid, LinearProgress } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { useInterval } from 'usehooks-ts'
import conectadoConContador from '../../../../../../assets/icons/conectando_con_contador.svg'

import useStyles from './CustomLinearProgressBar.styles'

export default function CustomLinearProgressBar(props: any) {
    // The counter
    const [count, setCount] = useState<number>(0)
    const [minutes, setMinutes] = useState<number>(0)
    // Dynamic delay
    const [delay, setDelay] = useState<number>(1000)
    // ON/OFF
    const [isPlaying, setPlaying] = useState<boolean>(true)

    const {setConnectingTimout, setComprovandoContador} = props

    const styles = useStyles({})
    const { t } = useTranslation()

    useInterval(
        () => {
            // Your custom logic here
            setCount(count + 1)
            if (count === 30) {
                setCount(0)
                setPlaying(false)
                setConnectingTimout(true)
                setComprovandoContador(false)
            }
        },
        // Delay in milliseconds or null to stop it
        isPlaying ? delay : null,
    )

    return (
        <>
            <Grid item md={12} sm={12} xs={12} className={styles.suministroConTelegestion}>
                {t('averias.management.searchCups.comprovacionesSuministro.contadorEstadoInicial')}
                <img src={conectadoConContador} className={styles.iconContador} alt='' />
            </Grid>
            <Grid item md={6} sm={6} xs={6} className={styles.numberContador}>
                {minutes + ':'}
                {count < 10 ? ('0' + count) : (count)}
            </Grid>
            <Grid item md={6} sm={6} xs={6} className={styles.numberContador}>
                {t('averias.management.searchCups.comprovacionesSuministro.tiempoEsperaMaximo')}
            </Grid>
            <Grid item md={7} sm={7} xs={7} className={styles.LinearPorgressBar}>
                <LinearProgress
                    color={'primary'}
                />
            </Grid>
        </>
    )
}