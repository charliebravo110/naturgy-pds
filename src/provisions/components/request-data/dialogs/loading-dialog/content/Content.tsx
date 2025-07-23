import React, { useState, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import TextButton from '../../../../../../common/components/text-button/TextButton'

import CreatingDossier from '../../../../../../assets/icons/loading_aviso_solicitud.gif'
import CloseIcon from '../../../../../../assets/icons/cerrar.svg'

import useStyles from './Content.styles'

const Content = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const { handleReturn, timeout } = props

  const [ timeText, setTimeText ] = useState('')

  useLayoutEffect(() => {
    if (timeout <= 60000) {
      const seconds = +timeout / 1000
      setTimeText(`${t('provisions.creatingProvision.description.first')} ${Math.floor(seconds)} ${t('provisions.creatingProvision.description.second.seconds')}`)
    } else {
      const minutes = +timeout / 60000
      const secondsRest = +((minutes % 1).toFixed(2)) * 60
      if (secondsRest > 0) {
        setTimeText(`${t('provisions.creatingProvision.description.first')} ${Math.floor(minutes)} ${t('provisions.creatingProvision.description.second.minutesAnd')} ${Math.floor(secondsRest)} ${t('provisions.creatingProvision.description.second.seconds')}`)
      } else {
        setTimeText(`${t('provisions.creatingProvision.description.first')} ${Math.floor(minutes)} ${t('provisions.creatingProvision.description.second.minutes')}`)
      }
    }
  // eslint-disable-next-line
  }, [ timeout ])

  return (
    <Grid container className={classes.container} justifyContent='center'>
      <Grid container justifyContent='flex-end'>
        <TextButton className={classes.closeButton} onClick={handleReturn}>
          <img src={CloseIcon} alt='' />
        </TextButton>
      </Grid>
      <Grid container direction='column' spacing={4} justifyContent='center' alignItems='center'>
        <Grid item>
          <img src={CreatingDossier} alt='' />
        </Grid>
        <Grid item className={classes.title}>
          {t('provisions.creatingProvision.title')}
        </Grid>
        <Grid item className={classes.description}>
          {timeText}
        </Grid>
      </Grid>
    </Grid>
  )

}

export default Content
