import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import ConnectingDialog from './connecting-dialog/ConnectingDialog'
import ConnectErrorDialog from './connect-error-dialog/ConnectErrorDialog'
import ConnectSuccess from './connect-success/ConnectSuccess'
import ConnectSuccessIcp from './connect-success-icp/ConnectSuccessIcp'
import ActiveRearm from './active-rearm/ActiveRearm'
import Inactive from './inactive/Inactive'
import ReconnectingDialog from './reconnecting-dialog/ReconnectingDialog'

import { formatDate } from '../../lib/FormatLib'

import {
  setCurrentSupplyProgrammedReadsXMessageId,
  resetCurrentSupplyProgrammedReads
} from '../../../supplies/store/actions/SuppliesActions'
import {
  thunkGetMasterData,
  thunkGetMeterReadings,
  thunkCreateProgrammedReads
} from '../../../supplies/supplies-details/store/actions/SuppliesDetailsThunkActions'

import useStyles from './Meter.styles'

const Meter = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    supplyData,
    document,
    setMeterStatus,
    masterDataMaster
  } = props

  const correlationId = useSelector((state: any) => state.supplies.currentSupplyProgrammedReads.xMessageId)

  const [isConnecting, setIsConnecting] = useState(false)
  const [connectError, setConnectError] = useState(false)
  const [inactive, setInactive] = useState(false)
  const [activeRearm, setActiveRearm] = useState(false)
  const [isReconnecting, setIsReconnecting] = useState(false)
  const [connectSuccess, setConnectSuccess] = useState(false)
  const [connectSuccessIcp, setConnectSuccessIcp] = useState(false)

  const [rearmActive, setRearmActive] = useState(true)

  const [meterConsultTimeout, setMeterConsultTimeout] = useState<number>()
  const [meterRearmTimeout, setMeterRearmTimeout] = useState<number>()

  const [readingTypesIds, setReadingTypesIds] = useState('')
  const [resetCall, setResetCall] = useState(false)

  const [reading, setReading] = useState()
  const [readingError, setReadingError] = useState()
  
  const [estadoContador, setEstadoContador] = useState(0)

  /* Carga de timeouts desde masterData para meter y ICP */
  useEffect(() => {

    if (!meterConsultTimeout && !meterRearmTimeout) {
      
      dispatch(thunkGetMasterData('API_TIMEOUT', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), 'METER_', (response) => {
        
        let consultAux
        let rearmAux

        if (response && response.length > 0) {
          
          const meterConsultTimeoutAux = response.filter(item => item.key === 'METER_CONSULTAR')[0].value
          const meterRearmTimeoutAux = response.filter(item => item.key === 'METER_REARMAR')[0].value

          if (meterConsultTimeoutAux && meterRearmTimeoutAux) {
            consultAux = meterConsultTimeoutAux
            rearmAux = meterRearmTimeoutAux
          } else {
            consultAux = process.env.REACT_APP_API_TIMEOUT_METER_CONSULT
            rearmAux = process.env.REACT_APP_API_TIMEOUT_METER_REARM
          }

        } else {
          consultAux = process.env.REACT_APP_API_TIMEOUT_METER_CONSULT
          rearmAux = process.env.REACT_APP_API_TIMEOUT_METER_REARM
        }

        setMeterConsultTimeout(parseInt(consultAux))

        setMeterRearmTimeout(parseInt(rearmAux))

      }))
    }

    if (supplyData.measurementSystem === 'O' && !isConnecting && !isReconnecting && !connectError) {
      dispatch(handleClickConsult)
    }

    // eslint-disable-next-line
  }, [])

  const handleReturn = () => {
    setReadingTypesIds('')
    setIsConnecting(false)
    setConnectError(false)
    setInactive(false)
    setActiveRearm(false)
    setIsReconnecting(false)
    setConnectSuccess(false)
    setConnectSuccessIcp(false)
    dispatch(resetCurrentSupplyProgrammedReads())
    dispatch(handleClickConsult)
  }

  const sendProgrammedReads = (state: string, correlationId: string, response?: any, callback?: Function) => {
    const meterId = (
      supplyData &&
      supplyData.measurementEquipments &&
      supplyData.measurementEquipments.meters[0] &&
      supplyData.measurementEquipments.meters[0].meter
    ) ?
      supplyData.measurementEquipments.meters[0].meter
    :
      ''

    const currentDate = new Date()

    let hour = currentDate.getHours() as any

    if (hour < 10) {
      hour = '0' + hour
    }

    let minute = currentDate.getMinutes() as any

    if (minute < 10) {
      minute = '0' + minute
    }

    let body = {} as any

    let data = {
      meterId,
      programmedDate: formatDate(new Date()),
      hour: hour + ':' + minute,
      voltage: '0',
      power: '0',
      state,
      origin: 'I',
      cups: supplyData.cups
    }

    if (response) {
      body = response
    } else {
      body = data
    }

    dispatch(thunkCreateProgrammedReads(body, (response) => {
      callback && callback(response)
    }))
  }

  const handleClickConsult = () => {
    if (supplyData.measurementSystem === 'O') {
      setIsConnecting(true)

      const readingTypeKey = supplyData.installationType === 'Monofásica' ? 'FASE_MONOF' : 'FASE_TRIFA'

      sendProgrammedReads('PENDING', '', null, (response) => {
        if (response) {
          dispatch(thunkGetMasterData((masterDataMaster ? masterDataMaster : 'METER_READING_TYPE_ID'), (sessionStorage.getItem('lang') || 'ES').toUpperCase(), readingTypeKey, (response) => {
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
    }
  }

  useLayoutEffect(() => {
    if (readingTypesIds && readingTypesIds !== '') {
      if (supplyData.measurementEquipments && supplyData.measurementEquipments.meters[0] && supplyData.measurementEquipments.meters[0].meter) {
               
        dispatch(thunkGetMeterReadings(document, supplyData.cups.substring(0,20), supplyData.measurementSystem, supplyData.measurementEquipments.meters[0].meter, readingTypesIds, meterConsultTimeout, (response) => {
          if (isConnecting) {
              setIsConnecting(false)

              // estados del contador:
              //    currentContactorState === 0 = inactivo
              //    currentContactorState === 1 = activo
              //    currentContactorState === 2 = pendiente de rearme

              if (response && response.readings) {
                const currentContactorState = response.readings[0] && response.readings[0].readingsMeter && response.readings[0].readingsMeter.filter(item => supplyData.installationType === 'Monofásica' ? item.readingTypeId === '441' : item.readingTypeId === '537')[0].meterReadings[0].value
                setEstadoContador(currentContactorState)
                if (currentContactorState === '1') {
                  // LLamada a la actualizacion del OK de la consulta a programmedReads
                  sendProgrammedReads('OK', correlationId, response, (response2) => {})
                  setReading(response)
                  setConnectSuccess(true)
                } else if (currentContactorState === '2') {
                  sendProgrammedReads('KO', correlationId, response)
                  setActiveRearm(true)
                } else if (currentContactorState === '0') {
                  sendProgrammedReads('KO', correlationId, response)
                  setInactive(true)
                } else {
                  sendProgrammedReads('KO', correlationId, response)
                  setConnectError(true)
                }
                setMeterStatus(parseInt(currentContactorState))
              } else {
                sendProgrammedReads('KO', correlationId, response)
                setConnectError(true)
                setReadingError((response && response.resultMessages && response.resultMessages[0] && response.resultMessages[0].id) || (response && response.codResult))
              }

              // Reset de XMessageId
              dispatch(setCurrentSupplyProgrammedReadsXMessageId(''))
          }

        }))
      } else {
        setIsConnecting(false)

        setConnectError(true)
      }
    }
  // eslint-disable-next-line
  }, [ resetCall ])

  return (
    <>
      <Grid container className={classes.container} justifyContent='center'>
        <Grid container md={10} direction='column' justifyContent='center' className={classes.maxWidthForBigScreens}>

          {
            isConnecting &&
            <ConnectingDialog timeout={meterConsultTimeout} handleReturn={handleReturn} />
          }

          {
            isReconnecting &&
            <ReconnectingDialog timeout={meterRearmTimeout} handleReturn={handleReturn} />
          }

          {
            connectError && !isConnecting &&
            <ConnectErrorDialog readingError={readingError} handleReturn={handleReturn} />
          }

          {
            inactive ?
              <Inactive
                setActiveRearm={setActiveRearm}
                setInactive={setInactive}
                isConnecting={isConnecting}
                setIsConnecting={setIsConnecting}
                setConnectError={setConnectError}
                setConnectSuccessIcp={setConnectSuccessIcp}
                inService={supplyData.inService}
                setReading={setReading}
                setReadingError={setReadingError}
                meterConsultTimeout={meterConsultTimeout}
                supplyData={supplyData}
                readingTypesIds={readingTypesIds}
                setReadingTypesIds={setReadingTypesIds}
                resetCall={resetCall}
                setResetCall={setResetCall}
                sendProgrammedReads={sendProgrammedReads}
                correlationId={correlationId}
                masterDataMaster={masterDataMaster}
              />
              :
              activeRearm ?
                <ActiveRearm
                  setActiveRearm={setActiveRearm}
                  setInactive={setInactive}
                  isReconnecting={isReconnecting}
                  setIsReconnecting={setIsReconnecting}
                  setConnectError={setConnectError}
                  setConnectSuccessIcp={setConnectSuccessIcp}
                  inService={supplyData.inService}
                  setReading={setReading}
                  setReadingError={setReadingError}
                  meterRearmTimeout={meterRearmTimeout}
                  supplyData={supplyData}
                  readingTypesIds={readingTypesIds}
                  rearmActive={rearmActive}
                  document={document}
                />
                :
                connectSuccess ?
                  <ConnectSuccess
                    onePhase={supplyData.installationType === 'Monofásica'}
                    reading={reading}
                  />
                  :
                  connectSuccessIcp ?
                    <ConnectSuccessIcp
                      onePhase={supplyData.installationType === 'Monofásica'}
                      reading={reading}
                    />
                    :
                    <>
                      {supplyData.measurementSystem !== 'O' &&
                        <div className={classes.items}>
                          {t('El CUPS no es telegestionable')}
                        </div>
                      }
                    </>
          }
        </Grid>
      </Grid>
    </>
  )
}

export default Meter
