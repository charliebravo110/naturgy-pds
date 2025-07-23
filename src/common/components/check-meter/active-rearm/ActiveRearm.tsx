import React from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Button from '../../button/Button'

import MeterConnectError from '../../../../assets/icons/contador_inactivo.svg'

import { thunkGetMeterControl } from '../../../../supplies/supplies-details/store/actions/SuppliesDetailsThunkActions'

import useStyles from './ActiveRearm.styles'

const Inactive = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    setActiveRearm,
    setIsReconnecting,
    setConnectError,
    inService,
    meterRearmTimeout,
    supplyData,
    readingTypesIds,
    rearmActive,
    document
  } = props

  const handleClickReconnect = () => {
    if (readingTypesIds && readingTypesIds !== '' && inService === 'SI' && rearmActive) {
      setActiveRearm(false)
      setIsReconnecting(true)
      if (supplyData.measurementEquipments && supplyData.measurementEquipments.meters[0] && supplyData.measurementEquipments.meters[0].meter) {
        dispatch(thunkGetMeterControl(document, supplyData.cups.substring(0,20), supplyData.measurementSystem, supplyData.measurementEquipments.meters[0].meter, readingTypesIds, meterRearmTimeout, (response) => {
          //setIsReconnecting(false)
          //if (response && response.readings) {
          //  const currentContactorState = response.readings[0].readingsMeter.filter(item => supplyData.installationType === 'Monofásica' ? item.readingTypeId === '441' : item.readingTypeId === '537')[0].meterReadings[0].value
          //
          //  if (currentContactorState === '1') {
          //    setReading(response)
          //    setConnectSuccessIcp(true)
          //  } else if (currentContactorState === '2') {
          //    setActiveRearm(true)
          //  } else if (currentContactorState === '0') {
          //    setInactive(true)
          //  } else {
          //    setConnectError(true)
          //  }
          //} else {
          //  setConnectError(true)
          //  setReadingError((response && response.resultMessages && response.resultMessages[0] && response.resultMessages[0].id) || (response && response.codResult))
          //}
        }))
      } else {
        setIsReconnecting(false)
        setConnectError(true)
      }
    }
  }

  return (
    <Grid container className={classes.container} justifyContent='center'>
      <Grid container direction='column' spacing={4} justifyContent='center'>
        <Grid item>
          <img className={classes.icon} src={MeterConnectError} alt='' />
        </Grid>
        <Grid item className={classes.title}>
          {t('supplies.suppliesDetails.components.meter.activeRearm.title')}
        </Grid>
        {
          rearmActive &&
            <>
              <Grid item className={classes.description}>
                {t('supplies.suppliesDetails.components.meter.activeRearm.description')}
              </Grid>
              <Grid container item justifyContent='center'>
                <Button
                  text={t('supplies.suppliesDetails.components.meter.buttons.reconnect')}
                  color={'primary'}
                  size={'large'}
                  variant={'contained'}
                  disabled={inService !== 'SI'}
                  onClick={handleClickReconnect}
                />
              </Grid>
            </>
        }

      </Grid>
    </Grid>
  )

}

export default Inactive
