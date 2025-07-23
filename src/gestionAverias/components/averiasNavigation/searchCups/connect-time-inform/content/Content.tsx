import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import TextButton from '../../../../../../common/components/text-button/TextButton'
import Button from '../../../../../../common/components/button/Button'

import CloseIcon from '../../../../../../assets/icons/cerrar.svg'
import AlertIcon from '../../../../../../assets/icons/aviso_alerta_pop_up.svg'

import useStyles from './Content.styles'

const Content = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    handleReturn,
    readingError,
    setIsLoadingMeterReadings,
    setQuestionPendingValue,
    messageToShow,
    subMessageToShow
  } = props

  setIsLoadingMeterReadings(false)
  setQuestionPendingValue(1)
  return (
    <Grid container className={classes.container} justifyContent='center'>
      <Grid container justifyContent='flex-end'>
        <TextButton className={classes.closeButton} onClick={handleReturn}>
          <img src={CloseIcon} alt='' />
        </TextButton>
      </Grid>
      <Grid container direction='column' spacing={4} justifyContent='center'>
        <Grid item>
          <img className={classes.icon} src={AlertIcon} alt='' />
        </Grid>
        <Grid item  className={(messageToShow && messageToShow !== '') ? classes.mainDescription : classes.description}>
        {(messageToShow && messageToShow !== '') ? messageToShow : t('averias.management.searchCups.comprovacionesSuministro.timeOutMessage')} 
        </Grid> 
        {(subMessageToShow && subMessageToShow !== '') && 
          <Grid item className={classes.subDescription}>
            {subMessageToShow} 
          </Grid>
        }
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
