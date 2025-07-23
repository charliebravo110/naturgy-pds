import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import TextButton from '../../../text-button/TextButton'
import Button from '../../../button/Button'

import CloseIcon from '../../../../../assets/icons/cerrar.svg'
import AlertIcon from '../../../../../assets/icons/aviso_alerta_pop_up.svg'

import useStyles from './Content.styles'

const Content = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const { handleReturn, readingError } = props

  const getErrorMessage = () => {
    const firstMessage =
      (
        <>
          <Grid item className={classes.title}>
            {t('supplies.suppliesDetails.components.meter.connectError.first.title')}
          </Grid>
          <Grid item className={classes.description}>
            {t('supplies.suppliesDetails.components.meter.connectError.first.description')}
          </Grid>
        </>
      )
    
    const secondMessage =
      (
        <>
          <Grid item className={classes.title}>
            {t('supplies.suppliesDetails.components.meter.connectError.second.title')}
          </Grid>
          <Grid item className={classes.description}>
            {t('supplies.suppliesDetails.components.meter.connectError.second.description')}
          </Grid>
        </>
      )
    
    let returnMessage: any

    if (readingError) {
      if (readingError === 'MSAPI.T1') {
        returnMessage = firstMessage
      } else {
        returnMessage = secondMessage
      }
    } else {
      returnMessage = firstMessage
    }

    return returnMessage
  }

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
        {getErrorMessage()}
        <Grid container item justifyContent='center'>
          <Button
            text={t('Reintentar')}
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
