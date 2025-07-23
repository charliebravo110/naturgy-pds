import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import MeterConnectSuccess from '../../../../assets/icons/contador_activo.svg'

import useStyles from './ConnectSuccessIcp.styles'

const ConnectSuccessIcp = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    onePhase,
    reading
  } = props

  const [ executionDate, setExecutionDate ] = useState<string>()

  useEffect(() => {
    if (reading.timestamp) {
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

  return (
    <Grid container className={classes.container}>
      <Grid container justifyContent='center' direction='column'>
        <Grid item>
          <img className={classes.icon} src={MeterConnectSuccess} alt='' />
        </Grid>
        <Grid item className={classes.title}>
          {t('supplies.suppliesDetails.components.meter.connectSuccess.titleIcp')}
        </Grid>
      </Grid>
      <Grid container className={classes.divider} />
      <Grid container className={classes.date}>
        {executionDate}
      </Grid>
      {
        onePhase ?
          <Grid container justifyContent='center'>
            <Grid container md={6} justifyContent='space-between'>
              <Grid item className={classes.phaseBlock}>
                <div className={classes.phaseContainer}>
                  <div className={classes.onePowerTypeOne}>{t('supplies.suppliesDetails.components.meter.connectSuccess.kW')}</div>
                  <span className={classes.onePhasePowers}>
                    {
                      parseFloat(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '421')[0].meterReadings[0].value) 
                    }
                  </span>
                </div>
              </Grid>
              <Grid item className={classes.phaseBlock}>
                <div className={classes.phaseContainer}>
                  <div className={classes.onePowerTypeTwo}>{t('supplies.suppliesDetails.components.meter.connectSuccess.v')}</div>
                  <span className={classes.onePhasePowers}>
                    {
                      reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '411')[0].meterReadings[0].value
                    }
                  </span>
                </div>
              </Grid>
            </Grid>
          </Grid>
        :
          <Grid container className={classes.triphasicBox}>

            <Grid item className={classes.triphasicContainer}>
              <Grid container direction='column' spacing={2}>
                <Grid item className={classes.phaseLabel}>
                  {t('supplies.suppliesDetails.components.meter.connectSuccess.phases.phase1')}
                </Grid>
                <Grid item>
                  <div className={classes.phaseContainer}>
                    <div className={classes.triPowerTypeOne}>{t('supplies.suppliesDetails.components.meter.connectSuccess.kW')}</div>
                    <span className={classes.triPhasePowers}>
                      {
                        parseFloat(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '507')[0].meterReadings[0].value) 
                      }
                    </span>
                  </div>
                </Grid>
                <Grid item>
                  <div className={classes.phaseContainer}>
                    <div className={classes.triPowerTypeTwo}>{t('supplies.suppliesDetails.components.meter.connectSuccess.v')}</div>
                    <span className={classes.triPhasePowers}>
                      {
                        reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '505')[0].meterReadings[0].value
                      }
                    </span>
                  </div>
                </Grid>
              </Grid>
            </Grid>

            <Grid item className={classes.triphasicContainer}>
              <Grid container direction='column' spacing={2}>
                <Grid item className={classes.phaseLabel}>
                  {t('supplies.suppliesDetails.components.meter.connectSuccess.phases.phase2')}
                </Grid>
                <Grid item>
                  <div className={classes.phaseContainer}>
                    <div className={classes.triPowerTypeOne}>{t('supplies.suppliesDetails.components.meter.connectSuccess.kW')}</div>
                    <span className={classes.triPhasePowers}>
                      {
                        parseFloat(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '515')[0].meterReadings[0].value) 
                      }
                    </span>
                  </div>
                </Grid>
                <Grid item>
                  <div className={classes.phaseContainer}>
                    <div className={classes.triPowerTypeTwo}>{t('supplies.suppliesDetails.components.meter.connectSuccess.v')}</div>
                    <span className={classes.triPhasePowers}>
                      {
                        reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '513')[0].meterReadings[0].value
                      }
                    </span>
                  </div>
                </Grid>
              </Grid>
            </Grid>

            <Grid item className={classes.triphasicContainer}>
              <Grid container direction='column' spacing={2}>
                <Grid item className={classes.phaseLabel}>
                  {t('supplies.suppliesDetails.components.meter.connectSuccess.phases.phase3')}
                </Grid>
                <Grid item>
                  <div className={classes.phaseContainer}>
                    <div className={classes.triPowerTypeOne}>{t('supplies.suppliesDetails.components.meter.connectSuccess.kW')}</div>
                    <span className={classes.triPhasePowers}>
                      {
                        parseFloat(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '523')[0].meterReadings[0].value) 
                      }
                    </span>
                  </div>
                </Grid>
                <Grid item>
                  <div className={classes.phaseContainer}>
                    <div className={classes.triPowerTypeTwo}>{t('supplies.suppliesDetails.components.meter.connectSuccess.v')}</div>
                    <span className={classes.triPhasePowers}>
                      {
                        reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '521')[0].meterReadings[0].value
                      }
                    </span>
                  </div>
                </Grid>
              </Grid>
            </Grid>

          </Grid>
      }

    </Grid>
  )

}

export default ConnectSuccessIcp
