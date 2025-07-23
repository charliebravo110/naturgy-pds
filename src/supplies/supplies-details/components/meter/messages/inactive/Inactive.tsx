import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Button from '../../../../../../common/components/button/Button'

import MeterConnectError from '../../../../../../assets/icons/contador_inactivo.svg'

import { thunkGetMasterData } from '../../../../store/actions/SuppliesDetailsThunkActions'
import { adminCheck } from '../../../../../../common/lib/ValidationLib'

import useStyles from './Inactive.styles'

const Inactive = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    setInactive,
    setIsConnecting,
    setConnectError,
    inService,
    supplyData,
    reading,
    readingTypesIds,
    setReadingTypesIds,
    resetCall,
    handleClickConsult,
    setResetCall,
    sendProgrammedReads,
    correlationId,
    handleEnviarPeticion,
    handleClickItem
  } = props

  const [executionDate, setExecutionDate] = useState<any>()

  useEffect(() => {
    if (reading && reading.timestamp) {
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

  const handleClickRetry = () => {
    if (readingTypesIds && readingTypesIds !== '' && inService === 'SI') {
      setInactive(false)
      setIsConnecting(true)
      if (supplyData.measurementEquipments && supplyData.measurementEquipments.meters[0] && supplyData.measurementEquipments.meters[0].meter) {
        sendProgrammedReads('PENDING', '', null, (response) => {
          if (response) {
            const readingTypeKey = supplyData.installationType === 'Monofásica' ? 'FASE_MONOF' : 'FASE_TRIFA'

            dispatch(thunkGetMasterData('METER_READING_TYPE_ID', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), readingTypeKey, (response) => {
              let readingTypeIdsAux = ''

              if (response && response.length > 0) {
                response.map(item => {
                  return readingTypeIdsAux = readingTypeIdsAux === '' ? item.value : readingTypeIdsAux + ',' + item.value
                })

                setReadingTypesIds(readingTypeIdsAux)
                setResetCall(!resetCall)
              } else {
                sendProgrammedReads('KO', correlationId, response)
                setIsConnecting(false)
                setConnectError(true)
                return
              }
            }))
          }
        })
      } else {
        sendProgrammedReads('KO', correlationId)
        setIsConnecting(false)
        setConnectError(true)
      }
    }
  }

  return (
    <Grid container className={classes.container} justifyContent='center'>
      <Grid container direction='column' spacing={4} justifyContent='center'>
        <Grid item >
          <img className={classes.icon} src={MeterConnectError} alt='' />
        </Grid>
        <Grid item className={classes.date}>
          {executionDate}
        </Grid>
        <Grid item className={classes.title}>
          {t('supplies.suppliesDetails.components.meter.inactive.title')}
        </Grid>
        <Grid item className={classes.description}>
          {t('supplies.suppliesDetails.components.meter.inactive.description')}
        </Grid>
        <Grid container spacing={10} justifyContent='center'>
          <Grid item>
            <Button
              text={t('supplies.suppliesDetails.components.meter.buttons.retry')}
              color={'primary'}
              size={'large'}
              variant={'contained'}
              disabled={inService === 'NO'}
              onClick={handleClickConsult}
            />
          </Grid>
          <Grid item>
            <Button
              text={t('supplies.suppliesDetails.components.meter.buttons.enviarPeticion')}
              color={'primary'}
              size={'large'}
              variant={'contained'}
              disabled={inService === 'NO' || adminCheck()}
              onClick={handleClickItem}
            />
          </Grid>
        </Grid>

      </Grid>
    </Grid>
  )

}

export default Inactive
