import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Button from '../../../../../common/components/button/Button'

import MeterConnectError from '../../../../../assets/icons/contador_inactivo.svg'
import DocumentIcon from '../../../../../assets/icons/ico_documento.svg'

import { thunkGetMeterControl } from '../../../store/actions/SuppliesDetailsThunkActions'

import useStyles from './ActiveRearm.styles'
import { pdf } from '@react-pdf/renderer'
import InstantReadPDF from '../../certificates/instant-read-pdf/InstantReadPDF'
import { isMobileApp, isWeb } from '../../../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../../../mobile-apps/local-downloads/createFileAndOpenIt'

const Inactive = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    onePhase,
    setActiveRearm,
    setIsReconnecting,
    setConnectError,
    inService,
    meterRearmTimeout,
    supplyData,
    readingTypesIds,
    rearmActive,
    reading
  } = props

  const user = useSelector((state: any) => state.user.profile)

  const [executionDate, setExecutionDate] = useState<any>()

  const handleClickReconnect = () => {
    if (readingTypesIds && readingTypesIds !== '' && inService === 'SI' && rearmActive) {
      setActiveRearm(false)
      setIsReconnecting(true)
      if (supplyData.measurementEquipments && supplyData.measurementEquipments.meters[0] && supplyData.measurementEquipments.meters[0].meter) {
        dispatch(thunkGetMeterControl(user.documentNumber, supplyData.cups, supplyData.measurementSystem, supplyData.measurementEquipments.meters[0].meter, readingTypesIds, meterRearmTimeout, (response) => {
          // setIsReconnecting(false)
          // if (response && response.readings) {
          //   const currentContactorState = response.readings[0].readingsMeter.filter(item => supplyData.installationType === 'Monofásica' ? item.readingTypeId === '441' : item.readingTypeId === '537')[0].meterReadings[0].value

          //   if (currentContactorState === '1') {
          //     setReading(response)
          //     setConnectSuccessIcp(true)
          //   } else if (currentContactorState === '2') {
          //     setActiveRearm(true)
          //   } else if (currentContactorState === '0') {
          //     setInactive(true)
          //   } else {
          //     setConnectError(true)
          //   }
          // } else {
          //   setConnectError(true)
          //   setReadingError((response && response.resultMessages && response.resultMessages[0] && response.resultMessages[0].id) || (response && response.codResult))
          // }
        }))
      } else {
        setIsReconnecting(false)
        setConnectError(true)
      }
    }
  }

  const handleReading = (value) => {
    if (value.includes('.')){
      return value.replace('.',',')
    }
    else return value
  }
  
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

  const downloadDocument = async () => {
    let blob
    let docName = 'certificado_lectura_instantanea.pdf'

    blob = await pdf(
      <InstantReadPDF
        user={user}
        supplyData={supplyData}
        reading={reading}
        onePhase={onePhase}
      />
    ).toBlob()

    if (isWeb()) {
      const pdfUrl = window.URL.createObjectURL(blob)
      const tempLink = document.createElement('a')

      tempLink.href = pdfUrl
      tempLink.setAttribute('download', docName)
      tempLink.click()
    } else {
      // downloadLink.click() will attempt to force a client-side download, works for web,
      // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
      createFileAndOpenIt({ fileName: docName, contentAsBlob: blob })
    }
  }

  return (
    <>
      <Grid container className={classes.container} justifyContent='center'>
        <Grid container direction='column' spacing={4} justifyContent='center'>
          <Grid item>
            <img className={classes.icon} src={MeterConnectError} alt='' />
          </Grid>
          <Grid item className={classes.title}>
            {t('supplies.suppliesDetails.components.meter.activeRearm.title2')}
          </Grid>
          <Grid item className={classes.title}>
            {t('supplies.suppliesDetails.components.meter.activeRearm.title3')}
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
        <Grid container className={classes.divider} />
        <Grid container className={classes.date}>
          {executionDate}
          <img className={classes.documentIcon} src={DocumentIcon} alt='' />
          <div onClick={downloadDocument} className={classes.certificate}>
            {t('supplies.suppliesDetails.components.meter.connectSuccess.certificatedowload')}
          </div>
        </Grid>
        {/* <Grid item className={classes.title}>{executionDate}</Grid> */}
        {/* <Grid item className={classes.title}>tiempo</Grid> */}

        {onePhase ?
          // {false ?
          <>
            <Grid container className={classes.triphasicBox}>
              <Grid item className={classes.triphasicContainer}>
                <Grid container direction='column' spacing={2}>
                  <Grid item className={classes.phaseLabel}>
                    {t('supplies.suppliesDetails.components.meter.connectSuccess.labels.meterVoltage')}
                  </Grid>
                  <Grid item>
                    <div className={classes.phaseContainer}>
                      <div className={classes.triPowerTypeOne}>{t('supplies.suppliesDetails.components.meter.connectSuccess.v')}</div>
                      <span className={classes.triPhasePowers}>
                        {
                          handleReading(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '411')[0].meterReadings[0].value)
                        }
                      </span>
                    </div>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item className={classes.triphasicContainer}>
                <Grid container direction='column' spacing={2}>
                  <Grid item className={classes.phaseLabel}>
                    {t('supplies.suppliesDetails.components.meter.connectSuccess.labels.potencia')}
                  </Grid>
                  <Grid item>
                    <div className={classes.phaseContainer}>
                      {/* <div className={classes.triPowerTypeOne}>{t('supplies.suppliesDetails.components.meter.connectSuccess.kW')}</div> */}
                      <span className={classes.shutDownICP}>
                        {t('supplies.suppliesDetails.components.meter.activeRearm.shutDownIcp')}
                      </span>
                    </div>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item className={classes.triphasicContainer}>
                <Grid container direction='column' spacing={2}>
                  <Grid item className={classes.phaseLabel}>
                    {t('supplies.suppliesDetails.components.meter.connectSuccess.labels.lectura')}
                  </Grid>
                  <Grid item>
                    <div className={classes.phaseContainer}>
                      <div className={classes.triPowerTypeTree}>{t('supplies.suppliesDetails.components.meter.connectSuccess.KWh')}</div>
                      <span className={classes.triPhasePowers}>
                        {
                          handleReading(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '10301')[0].meterReadings[0].value) 
                        }
                      </span>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={9} sm={10} md={12} className={classes.phaseLabel3}>
              {t('supplies.suppliesDetails.components.meter.connectSuccess.subTitle')}
            </Grid>
            {/* PERIDOS */}
            <Grid container className={classes.triphasicBox}>
              <Grid item className={classes.triphasicContainer}>
                <Grid container direction='column' spacing={2}>
                  <Grid item className={classes.triPhasePeriodTitle}>
                    {t('supplies.suppliesDetails.components.meter.connectSuccess.period.period1')}
                  </Grid>
                  <Grid item className={classes.phaseBlock}>
                    <div className={classes.phaseContainer}>
                      <div className={classes.onePowerTypeFive}>{t('supplies.suppliesDetails.components.meter.connectSuccess.KWh')}</div>
                      <span className={classes.triPhasePeriodPowers}>
                        {
                          handleReading(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '11301')[0].meterReadings[0].value)
                        }
                      </span>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item className={classes.triphasicContainer}>
                <Grid container direction='column' spacing={2}>
                  <Grid item className={classes.triPhasePeriodTitle}>
                    {t('supplies.suppliesDetails.components.meter.connectSuccess.period.period2')}
                  </Grid>
                  <Grid item className={classes.phaseBlock}>
                    <div className={classes.phaseContainer}>
                      <div className={classes.onePowerTypeFive}>{t('supplies.suppliesDetails.components.meter.connectSuccess.KWh')}</div>
                      <span className={classes.triPhasePeriodPowers}>
                        {
                          handleReading(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '12301')[0].meterReadings[0].value)
                        }
                      </span>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item className={classes.triphasicContainer}>
                <Grid container direction='column' spacing={2}>
                  <Grid item className={classes.triPhasePeriodTitle}>
                    {t('supplies.suppliesDetails.components.meter.connectSuccess.period.period3')}
                  </Grid>
                  <Grid item className={classes.phaseBlock}>
                    <div className={classes.phaseContainer}>
                      <div className={classes.onePowerTypeFive}>{t('supplies.suppliesDetails.components.meter.connectSuccess.KWh')}</div>
                      <span className={classes.triPhasePeriodPowers}>
                        {
                          handleReading(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '13301')[0].meterReadings[0].value)
                        }
                      </span>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
          :
          <>
            <Grid container className={classes.triphasicBox}>
              <Grid item className={classes.triphasicContainer}>
                <Grid container direction='column' spacing={2}>
                  <Grid item className={classes.phaseLabel2}>
                    {t('supplies.suppliesDetails.components.meter.connectSuccess.phases.phase1')}
                  </Grid>
                  <Grid item className={classes.phaseLabel}>
                    {t('supplies.suppliesDetails.components.meter.connectSuccess.labels.meterVoltage')}
                  </Grid>
                  <Grid item>
                    <div className={classes.phaseContainer}>
                      <div className={classes.onePowerTypeOne}>{t('supplies.suppliesDetails.components.meter.connectSuccess.v')}</div>
                      <span className={classes.triPhasePowers}>
                        {
                          handleReading(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '505')[0].meterReadings[0].value)
                        }
                      </span>
                    </div>
                  </Grid>

                  <Grid item className={classes.phaseLabel}>
                    {t('supplies.suppliesDetails.components.meter.connectSuccess.labels.potencia')}
                  </Grid>
                  <Grid item>
                    <div className={classes.phaseContainer}>
                      {/* <div className={classes.onePowerTypeTwo}>{t('supplies.suppliesDetails.components.meter.connectSuccess.kW')}</div> */}
                      <span className={classes.shutDownICP}>
                        {t('supplies.suppliesDetails.components.meter.activeRearm.shutDownIcp')}
                      </span>
                    </div>
                  </Grid>

                </Grid>
              </Grid>

              <Grid item className={classes.triphasicContainer}>
                <Grid container direction='column' spacing={2}>
                  <Grid item className={classes.phaseLabel2}>
                    {t('supplies.suppliesDetails.components.meter.connectSuccess.phases.phase2')}
                  </Grid>
                  <Grid item className={classes.phaseLabel}>
                    {t('supplies.suppliesDetails.components.meter.connectSuccess.labels.meterVoltage')}
                  </Grid>
                  <Grid item>
                    <div className={classes.phaseContainer}>
                      <div className={classes.onePowerTypeOne}>{t('supplies.suppliesDetails.components.meter.connectSuccess.v')}</div>
                      <span className={classes.triPhasePowers}>
                        {
                          handleReading(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '513')[0].meterReadings[0].value)
                        }
                      </span>
                    </div>
                  </Grid>
                  <Grid item className={classes.phaseLabel}>
                    {t('supplies.suppliesDetails.components.meter.connectSuccess.labels.potencia')}
                  </Grid>
                  <Grid item>
                    <div className={classes.phaseContainer}>
                      {/* <div className={classes.onePowerTypeTwo}>{t('supplies.suppliesDetails.components.meter.connectSuccess.kW')}</div> */}
                      <span className={classes.shutDownICP}>
                        {t('supplies.suppliesDetails.components.meter.activeRearm.shutDownIcp')}
                      </span>
                    </div>
                  </Grid>
                </Grid>
                <Grid item className={classes.phaseLabelTotalizador}>
                  {t('supplies.suppliesDetails.components.meter.connectSuccess.labels.lectura')}
                </Grid>
                <Grid item>
                  <div className={classes.phaseContainer}>
                    <div className={classes.onePowerTypeThree}>{t('supplies.suppliesDetails.components.meter.connectSuccess.KWh')}</div>
                    <span className={classes.triPhasePowers}>
                      {
                        handleReading(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '10301')[0].meterReadings[0].value) 
                      }
                    </span>
                  </div>
                </Grid>
              </Grid>

              <Grid item className={classes.triphasicContainer}>
                <Grid container direction='column' spacing={2}>
                  <Grid item className={classes.phaseLabel2}>
                    {t('supplies.suppliesDetails.components.meter.connectSuccess.phases.phase3')}
                  </Grid>
                  <Grid item className={classes.phaseLabel}>
                    {t('supplies.suppliesDetails.components.meter.connectSuccess.labels.meterVoltage')}
                  </Grid>
                  <Grid item>
                    <div className={classes.phaseContainer}>
                      <div className={classes.onePowerTypeOne}>{t('supplies.suppliesDetails.components.meter.connectSuccess.v')}</div>
                      <span className={classes.triPhasePowers}>
                        {
                          handleReading(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '521')[0].meterReadings[0].value)
                        }
                      </span>
                    </div>
                  </Grid>

                  <Grid item className={classes.phaseLabel}>
                    {t('supplies.suppliesDetails.components.meter.connectSuccess.labels.potencia')}
                  </Grid>
                  <Grid item>
                    <div className={classes.phaseContainer}>
                      {/* <div className={classes.onePowerTypeTwo}>{t('supplies.suppliesDetails.components.meter.connectSuccess.kW')}</div> */}
                      <span className={classes.shutDownICP}>
                        {t('supplies.suppliesDetails.components.meter.activeRearm.shutDownIcp')}
                      </span>
                    </div>
                  </Grid>

                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={9} sm={10} md={12} className={classes.phaseLabel3}>
              {t('supplies.suppliesDetails.components.meter.connectSuccess.subTitle')}
            </Grid>
            {/* PERIDOS */}
            <Grid container className={classes.triphasicBox}>
              <Grid item className={classes.triphasicContainer}>
                <Grid container direction='column' spacing={2}>

                  <Grid item className={classes.triPhasePeriodTitle}>
                    {t('supplies.suppliesDetails.components.meter.connectSuccess.period.period1')}
                  </Grid>
                  <Grid item className={classes.phaseBlock}>
                    <div className={classes.phaseContainer}>
                      <div className={classes.onePowerTypeFour}>{t('supplies.suppliesDetails.components.meter.connectSuccess.KWh')}</div>
                      <span className={classes.triPhasePeriodPowers}>
                        {
                          handleReading(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '11301')[0].meterReadings[0].value)
                        }
                      </span>
                    </div>
                  </Grid>

                  <Grid item className={classes.triPhasePeriodTitle}>
                    {t('supplies.suppliesDetails.components.meter.connectSuccess.period.period4')}
                  </Grid>
                  <Grid item className={classes.phaseBlock}>
                    <div className={classes.phaseContainer}>
                      <div className={classes.onePowerTypeFour}>{t('supplies.suppliesDetails.components.meter.connectSuccess.KWh')}</div>
                      <span className={classes.triPhasePeriodPowers}>
                        {
                          handleReading(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '13301')[0].meterReadings[0].value)
                        }
                      </span>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item className={classes.triphasicContainer2}>
                <Grid container direction='column' spacing={2}>
                  <Grid item className={classes.triPhasePeriodTitle}>
                    {t('supplies.suppliesDetails.components.meter.connectSuccess.period.period2')}
                  </Grid>
                  <Grid item className={classes.phaseBlock}>
                    <div className={classes.phaseContainer}>
                      <div className={classes.onePowerTypeFour}>{t('supplies.suppliesDetails.components.meter.connectSuccess.KWh')}</div>
                      <span className={classes.triPhasePeriodPowers}>
                        {
                          handleReading(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '12301')[0].meterReadings[0].value)
                        }
                      </span>
                    </div>
                  </Grid>
                  <Grid item className={classes.triPhasePeriodTitle}>
                    {t('supplies.suppliesDetails.components.meter.connectSuccess.period.period5')}
                  </Grid>
                  <Grid item className={classes.phaseBlock}>
                    <div className={classes.phaseContainer}>
                      <div className={classes.onePowerTypeFour}>{t('supplies.suppliesDetails.components.meter.connectSuccess.KWh')}</div>
                      <span className={classes.triPhasePeriodPowers}>
                        {
                          handleReading(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '13301')[0].meterReadings[0].value)
                        }
                      </span>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item className={classes.triphasicContainer3}>
                <Grid container direction='column' spacing={2}>
                  <Grid item className={classes.triPhasePeriodTitle}>
                    {t('supplies.suppliesDetails.components.meter.connectSuccess.period.period3')}
                  </Grid>
                  <Grid item className={classes.phaseBlock}>
                    <div className={classes.phaseContainer}>
                      <div className={classes.onePowerTypeFour}>{t('supplies.suppliesDetails.components.meter.connectSuccess.KWh')}</div>
                      <span className={classes.triPhasePeriodPowers}>
                        {
                          handleReading(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '13301')[0].meterReadings[0].value)
                        }
                      </span>
                    </div>
                  </Grid>
                  <Grid item className={classes.triPhasePeriodTitle}>
                    {t('supplies.suppliesDetails.components.meter.connectSuccess.period.period6')}
                  </Grid>
                  <Grid item className={classes.phaseBlock}>
                    <div className={classes.phaseContainer}>
                      <div className={classes.onePowerTypeFour}>{t('supplies.suppliesDetails.components.meter.connectSuccess.KWh')}</div>
                      <span className={classes.triPhasePeriodPowers}>
                        {
                          handleReading(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '13301')[0].meterReadings[0].value)
                        }
                      </span>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        }
      </Grid>
    </>
  )

}

export default Inactive
