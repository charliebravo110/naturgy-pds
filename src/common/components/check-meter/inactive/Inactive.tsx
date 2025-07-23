import React from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Button from '../../button/Button'

import MeterConnectError from '../../../../assets/icons/contador_inactivo.svg'

import { thunkGetMasterData } from '../../../../supplies/supplies-details/store/actions/SuppliesDetailsThunkActions'

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
    readingTypesIds,
    setReadingTypesIds,
    resetCall,
    setResetCall,
    sendProgrammedReads,
    correlationId,
    masterDataMaster
  } = props

  const handleClickRetry = () => {
    if (readingTypesIds && readingTypesIds !== '' && inService === 'SI') {
      setInactive(false)
      setIsConnecting(true)
      if (supplyData.measurementEquipments && supplyData.measurementEquipments.meters[0] && supplyData.measurementEquipments.meters[0].meter) {
        sendProgrammedReads('PENDING', '', null, (response) => {
          if (response) {
            const readingTypeKey = supplyData.installationType === 'Monofásica' ? 'FASE_MONOF' : 'FASE_TRIFA'

            dispatch(thunkGetMasterData(masterDataMaster, (sessionStorage.getItem('lang') || 'ES').toUpperCase(), readingTypeKey, (response) => {
              let readingTypeIdsAux = ''

              if (response && response.length > 0) {
                response.map(item => {
                  return readingTypeIdsAux = readingTypeIdsAux === '' ? item.value : readingTypeIdsAux+','+item.value
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
        <Grid item xs={12}>
          <img className={classes.icon} src={MeterConnectError} alt='' />
        </Grid>
        <Grid item xs={12} className={classes.title}>
          {t('supplies.suppliesDetails.components.meter.inactive.title')}
        </Grid>
        <Grid item xs={12} className={classes.description}>
          {t('supplies.suppliesDetails.components.meter.inactive.description')}
        </Grid>
        <Grid container xs={12} item justifyContent='center'>
          <Button
            text={t('supplies.suppliesDetails.components.meter.buttons.retry')}
            color={'primary'}
            size={'large'}
            variant={'contained'}
            disabled={inService === 'NO'}
            onClick={handleClickRetry}
          />
        </Grid>
      </Grid>
    </Grid>
  )

}

export default Inactive
