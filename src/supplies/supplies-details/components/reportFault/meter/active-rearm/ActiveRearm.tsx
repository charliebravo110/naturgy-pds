import React from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import MeterConnectError from '../../../../../../assets/icons/contador_inactivo.svg'
import useStyles from './ActiveRearm.styles'

import { thunkGetMeterControl } from '../../../../store/actions/SuppliesDetailsThunkActions'
import Button from '../../../../../../common/components/button/Button'


const ActiveRearm = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    supplyData,
    readingTypesIds,
    document,
    setActiveRearm,
    setIsReconnecting,
    meterRearmTimeout
  } = props

  const handleClickReconnect = () => {
      if (supplyData.measurementEquipments && supplyData.measurementEquipments.meters[0] && supplyData.measurementEquipments.meters[0].meter) {
        dispatch(thunkGetMeterControl(document, supplyData.cups.substring(0,20), supplyData.measurementSystem, supplyData.measurementEquipments.meters[0].meter, readingTypesIds, meterRearmTimeout, (response) => {
        }))
      }
      setActiveRearm(false)
      setIsReconnecting(true)
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
        <Grid item className={classes.description}>
          {t('supplies.suppliesDetails.components.meter.activeRearm.description')}
        </Grid>
        <Grid container item justifyContent='center'>
          <Button
            text={t('supplies.suppliesDetails.components.meter.buttons.reconnect')}
            color={'primary'}
            size={'large'}
            variant={'contained'}
            onClick={handleClickReconnect}
          />
        </Grid>
      </Grid>
    </Grid>
  )

}

export default ActiveRearm
