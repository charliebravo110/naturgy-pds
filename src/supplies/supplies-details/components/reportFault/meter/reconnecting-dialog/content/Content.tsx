import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import TextButton from '../../../../../../../common/components/text-button/TextButton'
import Button from '../../../../../../../common/components/button/Button'

import CloseIcon from '../../../../../../../assets/icons/cerrar.svg'
import MeterReconnecting from '../../../../../../../assets/icons/loading_contador2.gif'

import useStyles from './Content.styles'


const Content = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const { handleReturn } = props

  // const [ timeText, setTimeText ] = useState('')

  // useLayoutEffect(() => {
  //   if (timeout <= 60000) {
  //     const seconds = +timeout / 1000
  //     setTimeText(`${t('supplies.suppliesDetails.components.meter.connecting.description.first')} ${Math.floor(seconds)} ${t('supplies.suppliesDetails.components.meter.connecting.description.second.seconds')}`)
  //   } else {
  //     const minutes = +timeout / 60000
  //     const secondsRest = +((minutes % 1).toFixed(3)) * 60
  //     if (secondsRest > 0) {
  //       setTimeText(`${t('supplies.suppliesDetails.components.meter.connecting.description.first')} ${Math.floor(minutes)} ${t('supplies.suppliesDetails.components.meter.connecting.description.second.minutesAnd')} ${Math.floor(secondsRest)} ${t('supplies.suppliesDetails.components.meter.connecting.description.second.seconds')}`)
  //     } else {
  //       setTimeText(`${t('supplies.suppliesDetails.components.meter.connecting.description.first')} ${Math.floor(minutes)} ${t('supplies.suppliesDetails.components.meter.connecting.description.second.minutes')}`)
  //     }
  //   }
  // // eslint-disable-next-line
  // }, [ timeout ])

  return (
    <Grid container className={classes.container} justifyContent='center'>
      <Grid container justifyContent='flex-end'>
        <TextButton className={classes.closeButton} onClick={handleReturn}>
          <img src={CloseIcon} alt='' />
        </TextButton>
      </Grid>
      <Grid container direction='column' spacing={5} justifyContent='center' alignItems='center'>
        <Grid item>
          <img src={MeterReconnecting} alt='' />
        </Grid>
        <Grid item className={classes.title}>
          {t('supplies.suppliesDetails.components.meter.reconnect.title')}
        </Grid>
        <Grid container spacing={1}>
          <Grid item className={classes.description}>
            {t('supplies.suppliesDetails.components.meter.reconnect.description-time')}
          </Grid>
          <Grid item className={classes.description}>
            {t('supplies.suppliesDetails.components.meter.reconnect.description-close')}
          </Grid>
        </Grid>
        <Grid item className={classes.description}>
          {t('supplies.suppliesDetails.components.meter.reconnect.description-call')}
        </Grid>
        <Grid container item justifyContent='center'>
          <Button
            text={t('supplies.suppliesDetails.components.meter.buttons.close')}
            color={'primary'}
            size={'large'}
            variant={'contained'}
            onClick={handleReturn}
          />
        </Grid>
      </Grid>
    </Grid>
  )

}

export default Content
