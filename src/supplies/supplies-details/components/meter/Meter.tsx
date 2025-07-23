import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Item from './item/Item'

import PowerOutagesIcon from '../../../../assets/icons/peticiones_cortes_luz.svg'

import calendarIcon from '../../../../assets/icons/ico_calendario_plazos.svg'
import meterIcon from '../../../../assets/icons/contador_para_boton.svg'

import ConnectSuccessIcp from './connect-success-icp/ConnectSuccessIcp'
// import Summary from './summary/Summary'
import ActiveRearm from './active-rearm/ActiveRearm'
import Inactive from './messages/inactive/Inactive'
import ConnectingMessage from './messages/connectingMessage/ConnectingMesage'
import ProgrammedQueryDialog from './programmed-query-dialog/ProgrammedQueryDialog'
import ProgrammedReads from './programmed-reads/ProgrammedReads'
import Options from './options/Options'

import ExportTableDataDialog from './programmed-reads/downloads/dialogs/export-table-data/ExportTableDataDialog'
import ExportAllDataDialog from './programmed-reads/downloads/dialogs/export-all-data/ExportAllDataDialog'

import { formatDate } from '../../../../common/lib/FormatLib'
import { adminCheck } from '../../../../common/lib/ValidationLib'

import { setNewRequestSteps, resetNewRequestData } from '../../../../requests/store/actions/RequestsActions'
import {
  setCurrentSupplyProgrammedReadsXMessageId,
  setCurrentSupplyProgrammedReadsCount,
  appendCurrentSupplyProgrammedReads,
  setCurrentSupplyProgrammedReads
} from '../../../store/actions/SuppliesActions'
import {
  thunkGetMasterData,
  thunkGetMeterReadings,
  thunkCreateProgrammedReads,
  thunkListProgrammedReads,
  thunkCreateNewRequest
} from '../../store/actions/SuppliesDetailsThunkActions'

import useStyles from './Meter.styles'
import Button from '../../../../common/components/button/Button'
import ConnectError from './messages/connect-error/ConnectError'
import ConnectSuccess from './messages/connect-success/ConnectSuccess'
import { showError } from '../../../../common/store/actions/ErrorActions'

// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm'

const Meter = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    supplyData,
    setCreatingNewRequestFromMeter,
    setTabValue,
    isLoading,
    setIsLoading,
    setMenuTabValue,
    preToolbar,
    navToMeter,
    setNavToMeter
  } = props

  const user = useSelector((state: any) => state.user.profile)
  const delegatesInMeList = useSelector((state: any) => state.delegations.delegatesInMeList)
  const correlationId = useSelector((state: any) => state.supplies.currentSupplyProgrammedReads.xMessageId)

  const [isConnecting, setIsConnecting] = useState(false)
  const [connectError, setConnectError] = useState(false)
  const [inactive, setInactive] = useState(false)
  const [activeRearm, setActiveRearm] = useState(false)
  const [isReconnecting, setIsReconnecting] = useState(false)
  const [connectSuccess, setConnectSuccess] = useState(false)
  const [connectSuccessIcp, setConnectSuccessIcp] = useState(false)
  const [isShowingProgrammedReadsList, setIsShowingProgrammedReadsList] = useState(false)
  const [isDisabledClickConsult, SetIsDisabledClickConsult] = useState(false)

  const [showInstantLecture, setShowInstantLecture] = useState(false)
  const [maxTime, setMaxTime] = useState(false)
  const [showProgramingRead, setShowProgramingRead] = useState(false)

  const [isExportTableDataDialogOpen, setIsExportTableDataDialogOpen] = useState(false)
  const [isExportAllDataDialogOpen, setIsExportAllDataDialogOpen] = useState(false)

  const [rearmActive, setRearmActive] = useState(false)

  const [meterConsultTimeout, setMeterConsultTimeout] = useState<number>()
  const [meterRearmTimeout, setMeterRearmTimeout] = useState<number>()
  const [meterTimeout, setMeterTimeout] = useState(false)

  const [readingTypesIds, setReadingTypesIds] = useState('')
  const [resetCall, setResetCall] = useState(false)

  const [reading, setReading] = useState()
  const [readingError, setReadingError] = useState()

  const [aux, setAux] = useState(false)
  const[auxStep3,setAuxStep3] = useState('')

  const [modifyProgrammedQuery, setModifyProgrammedQuery] = useState(false)


  const roles = sessionStorage.getItem('userRoles') || ''
  const rolesArray = roles.split(',')

  // Comprobar si es asesor de este punto de suministro
  const delegatedCups = delegatesInMeList && delegatesInMeList.find(item => item.cups === supplyData.cups)
  const isAdviser = delegatedCups && delegatedCups.role === 'US_CONSULTANT'

  const handleClickItemErrorLectura = () => {
    //hacer una peticion de error de lectura
    setCreatingNewRequestFromMeter(1)
    setAuxStep3('ERRORLECTURA')
    setAux(true)
  }

  const handleClickItemMesuraInstantanea = () => {
    //hacer una peticion de lectura instantanea para telemedidos
    setCreatingNewRequestFromMeter(1)
    setAuxStep3('LECTURA')
    setAux(true)
  }

  useEffect(() => {

    if (aux) {
      dispatch(resetNewRequestData())

      dispatch(setNewRequestSteps({
        step1: 'SUPPLY',
        step2: supplyData.cups,
        step3: auxStep3,
        step4: 'INSTANT-MEASUREMENT'
      }))

      setCreatingNewRequestFromMeter(2)

      if (supplyData.isGenerator === '1') {
        setTabValue(8)
      } else {
        if (!supplyData.isSelfConsumption) {
          setTabValue(7)
        } else {
          setTabValue(8)
        }
      }

      setMenuTabValue(2)

      setAux(false)
    }
  }, [aux])

  /* Comprobacion para realizar el rearme */
  useEffect(() => {
    dispatch(thunkGetMasterData('CONFIGURATION', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), 'visibility.rearme', (response) => {
      let comp = rearmActive

      if (rolesArray.includes('US_CC')) {
        comp = true
      } else if (response && response.length > 0) {
        if (response[0] && response[0].value === 'true') {
          comp = true
        } else {
          comp = false
        }
      }

      setRearmActive(comp)
    }))
    // carrega el llistat de programedReads
    handleListProgrammedReads(true, true)
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (preToolbar) {
      handleClickConsult()
    }
  }, [])

  useEffect(() => {
    if (navToMeter) {
      handleClickConsult()
      setNavToMeter(false)
    }
  }, [navToMeter])

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
        setMeterConsultTimeout(consultAux)
        setMeterRearmTimeout(rearmAux)
      }))
    }
    // eslint-disable-next-line
  }, [])

  const handleReturn = () => {
    setReadingTypesIds('')
    setIsConnecting(false)
    setConnectError(false)
    setMeterTimeout(false)
    setInactive(false)
    setActiveRearm(false)
    setIsReconnecting(false)
    setConnectSuccess(false)
    setConnectSuccessIcp(false)
    setModifyProgrammedQuery(false)
    setIsShowingProgrammedReadsList(false)
    // dispatch(resetCurrentSupplyProgrammedReads())
  }

  //Funciona para pillar el listado de lecturas programadas
  const handleListProgrammedReads = (loader: boolean, append: boolean) => {
    setIsLoading(loader)

    setIsShowingProgrammedReadsList(false)

    const meterId = (
      supplyData &&
      supplyData.measurementEquipments &&
      supplyData.measurementEquipments.meters[0] &&
      supplyData.measurementEquipments.meters[0].meter
    ) ?
      supplyData.measurementEquipments.meters[0].meter
      :
      ''

    dispatch(thunkListProgrammedReads(meterId, 0, 15, (reads) => {

      if (reads) {
        if (reads.count && reads.count > 0) {
          dispatch(setCurrentSupplyProgrammedReadsCount(reads.count))
          
        }

        if (reads.items && reads.items.length > 0) {
          if (append) {
            dispatch(appendCurrentSupplyProgrammedReads(reads.items))
            
          } else {
            dispatch(setCurrentSupplyProgrammedReads(reads.items))
           
          }

        }

        setIsShowingProgrammedReadsList(true)
      }

      setIsLoading(false)
    }))
  }

  const handleProgramarConsulta = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      subsection_name: 'mi contador',
      click_text: 'programar',
      elemet_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      module_name: 'programar consultas al contador'
    });
    setShowProgramingRead(true)

  }

  const handleEnviarPeticion = () => {

    const data = {
      documentType: '',
      documentNumber: user.documentNumber,
      name: user.name,
      surName1: user.surName,
      email: user.email,
      landline: user.phone,
      cellphone: '',
      tipology: '0870A12',
      subtipology: '', //falta codi subtipologia
      cups: supplyData.cups,
      dossierNumber: '',
      channel: '10010',
      createdByCode: '',
      createdBy: '',
      savedByCode: '',
      savedBy: '',
      comment: '',
      documents: [{
        url: '',
        idDocumentum: '',
        nombreArchivo: '',
        format: '',
        documentType: '',
        documentState: ''
      }]
    } as any;

    dispatch(thunkCreateNewRequest(data, (response) => {
      if (!response) {
        dispatch(showError('2001', 'createServiceRequest'))
        // setIsIncidenceCreating(false)
      }
    }));
  }

  const handleProgrammedQueryDialog = () => {
    setModifyProgrammedQuery(!modifyProgrammedQuery)
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
      cups: supplyData.cups,
      meter_status: correlationId,
      totalizador: '0',
      periodo1: '0',
      periodo2: '0',
      periodo3: '0',
      periodo4: '0',
      periodo5: '0',
      periodo6: '0',
    }

    if (response) {
      if (response.correlationId) {
        body = response
      } else {
        let data1 = {
          meterId,
          programmedDate: formatDate(new Date()),
          hour: hour + ':' + minute,
          voltage: '0',
          power: '0',
          state,
          origin: 'I',
          cups: supplyData.cups,
          meter_status: correlationId,
          correlationId: correlationId,
          totalizador: '0',
          periodo1: '0',
          periodo2: '0',
          periodo3: '0',
          periodo4: '0',
          periodo5: '0',
          periodo6: '0',
        }
        body = data1;
      }
    } else {
      body = data
    }
    dispatch(thunkCreateProgrammedReads(body, (response) => {
      callback && callback(response)
    }))
  }

  const handleClickConsult = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      subsection_name: 'mi contador',
      click_text: 'consultar',
      elemet_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      module_name: 'consulta estado del contador'
    });
    SetIsDisabledClickConsult(true)
    handleReturn()
    if (supplyData.measurementSystem === 'O' && ((supplyData.remoteManagementDate) || (supplyData.role && supplyData.role === 'US_MANAGER'))) {
      setIsConnecting(true)
      // si es monofasico redingType == FASE_MONOF sino FASE_TRIFA
      const readingTypeKey = supplyData.installationType === 'Monofásica' ? 'FASE_MONOF' : 'FASE_TRIFA'

      sendProgrammedReads('PENDING', '', null, (response) => {
        if (response) {
          //TODO MAA descomentar para volver a cargar datos historico lecturas
          //dispatch(resetCurrentSupplyProgrammedReads())
          handleListProgrammedReads(false, false)
          dispatch(thunkGetMasterData('METER_READING_TYPE_ID', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), readingTypeKey, (response) => {
            let readingTypeIdsAux = ''
            if (response && response.length > 0) {
              response.map(item => {
                return readingTypeIdsAux = readingTypeIdsAux === '' ? item.value : readingTypeIdsAux + ',' + item.value
              })

              setReadingTypesIds(readingTypeIdsAux)

              setResetCall(!resetCall)
            } else {
              //no se recive respuesta por parte de master data, mostramos error y enviamos error al historico
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

  const supplies = useSelector((state: any) => state.supplies.list)
  const suppliesDel = useSelector((state: any) => state.delegations.delegatesInMeList)

  useLayoutEffect(() => {

    if (readingTypesIds && readingTypesIds !== '') {
      if (supplyData.measurementEquipments && supplyData.measurementEquipments.meters[0] && supplyData.measurementEquipments.meters[0].meter) {

        // Obtener el docNumber del propietario del CUPS
        let docNumber = ''

        supplies.map((item) => {
          if (item.cups === supplyData.cups) {
            docNumber = user.documentNumber
          }
        })

        if (docNumber === '') {
          suppliesDel.map((item) => {
            if (item.cups === supplyData.cups) {
              docNumber = item.holderDocumentNumber
            }
          })
        }
        //Habilitar el senProgrammedReads para enviar a nuestra BD los datos de la lectura(ahora lo hace el bus)
        dispatch(thunkGetMeterReadings(docNumber, supplyData.cups.substring(0, 20), supplyData.measurementSystem, supplyData.measurementEquipments.meters[0].meter, readingTypesIds, meterConsultTimeout, (response) => {
          // estados del contador:
          //    currentContactorState === 0 = inactivo
          //    currentContactorState === 1 = activo
          //    currentContactorState === 2 = pendiente de rearme
          if (response && response.readings) {
            const currentContactorState = response.readings[0] && response.readings[0].readingsMeter && response.readings[0].readingsMeter.filter(item => supplyData.installationType === 'Monofásica' ? item.readingTypeId === '441' : item.readingTypeId === '537')[0].meterReadings[0].value

            if (currentContactorState === '1') {
              //lectura correcta, mostrar ventana lectura contador
              sendProgrammedReads('OK', correlationId, response, (response) => {
                if (response) {
                  handleListProgrammedReads(false, false)
                }
              })
              setReading(response)
              setConnectSuccess(true)

            } else if (currentContactorState === '2') {
              //contador pendiente de rearme, mostrar ventana rearmar contador
              sendProgrammedReads('OK', correlationId, response, (response) => {
                if (response) {
                  handleListProgrammedReads(false, false)
                }
              })
              setReading(response)
              setActiveRearm(true)

            } else if (currentContactorState === '0') {
              //contador inactivo, mostrar ventana contador inactivo
              sendProgrammedReads('KO', correlationId, response, (response) => {
                if (response) {
                  handleListProgrammedReads(false, false)
                }
              })
              setReading(response)
              setInactive(true)

            } else {
              // La lectura no contiene periodos, mostramos error
              sendProgrammedReads('KO', correlationId, response, (response) => {
                if (response) {
                  handleListProgrammedReads(false, false)
                }
              })
              setReading(response)
              setConnectError(true)

            }
            SetIsDisabledClickConsult(false)
          } else {
            if (response.message === 'timeout') {
              //salta el timeout, procedemos a mostrar ventana de revisar historico
              // el programmed reads se actualiza desde el bus
              setMeterTimeout(true)
            }
            else {
              //Hay error de lectura, procedemos a mostrar ventana de error
              // sendProgrammedReads('KO', correlationId, response)
              setReading(response)
              setConnectError(true)
              sendProgrammedReads('KO', correlationId, response, (response) => {
                if (response) {
                  handleListProgrammedReads(false, false)
                }
              })
              setReadingError((response && response.resultMessages && response.resultMessages[0] && response.resultMessages[0].id) || (response && response.codResult))

            }
            SetIsDisabledClickConsult(false)
          }

          // Reset de XMessageId
          dispatch(setCurrentSupplyProgrammedReadsXMessageId(''))

        }))
      } else {
        setIsConnecting(false)
        setConnectError(true)

      }
    }
  }, [resetCall])

  //Borrar no es fa servir

  const getMeterConnector = () => {
    const connection = (
      <>

        {
          // Aqui carrega les opcions 
          !isShowingProgrammedReadsList &&
          <Options
            supplyData={supplyData}
            handleClickConsult={handleClickConsult}
            isAccessible={true}
            setIsShowingProgrammedReadsList={setIsShowingProgrammedReadsList}
            setIsLoading={setIsLoading}
          />
        }

        {
          /*
          <Summary
            supplyData={supplyData}
            handleClickConsult={handleClickConsult}
            isAccessible={isAccessible}
            setIsShowingProgrammedReadsList={setIsShowingProgrammedReadsList}
            handleProgrammedQueryDialog={handleProgrammedQueryDialog}
            setIsLoading={setIsLoading}
          />
          */
        }

        {
          isShowingProgrammedReadsList &&
          // LLista de lectures programades
          <ProgrammedReads
            supplyData={supplyData}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setIsExportTableDataDialogOpen={setIsExportTableDataDialogOpen}
            setIsExportAllDataDialogOpen={setIsExportAllDataDialogOpen}
          />
        }
      </>
    )
    // No hi ha connecció
    const noConnectionAdvise = (
      <>
        <div className={classes.items}>
          <Item
            type='instant-measurement'
            icon={PowerOutagesIcon}
            title={t('requests.newRequest.relationship.items.supply.claim.instantMeasurement.title')}
            description={t('requests.newRequest.relationship.items.supply.claim.instantMeasurement.description')}
            disabled={adminCheck() || isAdviser}
            handleClick={(!adminCheck() && !isAdviser) && handleClickItemMesuraInstantanea}
          />
        </div>
      </>
    )
    let returnAction: any

    if (supplyData.measurementSystem === 'O') {
      if (supplyData.remoteManagementDate) {
        returnAction = connection
      } else {
        returnAction = noConnectionAdvise
      }
    } else {
      returnAction = noConnectionAdvise
    }
    return returnAction
  }

  return (
    (supplyData.measurementSystem === 'O' && supplyData.remoteManagementDate) ?
      <>
        <ProgrammedQueryDialog modifyProgrammedQuery={modifyProgrammedQuery} supplyData={supplyData} handleReturn={handleReturn} /> 

        <ExportTableDataDialog
          supplyData={supplyData}
          isExportTableDataDialogOpen={isExportTableDataDialogOpen}
          setIsExportTableDataDialogOpen={setIsExportTableDataDialogOpen}
        />
        <ExportAllDataDialog
          supplyData={supplyData}
          isExportAllDataDialogOpen={isExportAllDataDialogOpen}
          setIsExportAllDataDialogOpen={setIsExportAllDataDialogOpen}
        />

        <Grid item className={classes.title} md={12} sm={12} xs={12}>{t('supplies.suppliesDetails.components.meter.title')}</Grid>
        <Grid container className={classes.container} justifyContent='center'>
          {/* container esquerra */}
          <Grid container className={classes.topContainer} md={8} sm={12} xs={12}>
            <Grid container className={classes.consultContainer} md={5} sm={12} xs={12} >
              <Grid item>
                <img src={meterIcon} className={classes.icon} alt='' />
              </Grid>
              <Grid item md={12} sm={12} xs={12} className={classes.descriptionText}>{t('supplies.suppliesDetails.components.meter.summary.consult.label')}</Grid>
              <Grid item md={8} sm={8} xs={8} className={classes.description}>{t('supplies.suppliesDetails.components.meter.summary.consult.label2')}</Grid>
              <Grid item md={12} sm={12} xs={12} className={classes.buttonPadding}>
                <Button
                  text={t('supplies.suppliesDetails.components.meter.summary.consult.button')}
                  color={'primary'}
                  size={'large'}
                  variant={'contained'}
                  onClick={handleClickConsult}
                  disabled={isDisabledClickConsult}
                />
              </Grid>
            </Grid>
            {/* container dret */}
            <Grid container className={classes.consultContainer} md={5} sm={12} xs={12} >
              <Grid item>
                <img src={calendarIcon} className={classes.icon} alt='' />
              </Grid>
              <Grid item md={12} sm={12} xs={12} className={classes.descriptionText} >{t('supplies.suppliesDetails.components.meter.programarConsultas')}</Grid>
              <Grid item md={8} sm={8} xs={8} className={classes.description}>{t('supplies.suppliesDetails.components.meter.summary.program.label2')}</Grid>
              <Grid item md={12} sm={12} xs={12} className={classes.buttonPadding}>
                <Button
                  text={t('supplies.suppliesDetails.components.meter.summary.program.button')}
                  color={'primary'}
                  size={'large'}
                  variant={'contained'}
                  onClick={handleProgramarConsulta}
                />
              </Grid>
            </Grid>
          </Grid>
          {/* container mensajes */}
          <Grid container className={classes.mainContainer} md={8} sm={12} xs={12}>
            <Grid container md={12} sm={12} xs={12} >
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
                    reading={reading}
                    handleClickConsult={handleClickConsult}
                    readingTypesIds={readingTypesIds}
                    setReadingTypesIds={setReadingTypesIds}
                    resetCall={resetCall}
                    setResetCall={setResetCall}
                    sendProgrammedReads={sendProgrammedReads}
                    correlationId={correlationId}
                    handleEnviarPeticion={handleEnviarPeticion}
                    handleClickItem={handleClickItemErrorLectura}
                  />
                  :
                  activeRearm ?
                    <ActiveRearm
                      onePhase={supplyData.installationType === 'Monofásica'}
                      setActiveRearm={setActiveRearm}
                      setInactive={setInactive}
                      isReconnecting={isReconnecting}
                      setIsReconnecting={setIsReconnecting}
                      setConnectError={setConnectError}
                      setConnectSuccessIcp={setConnectSuccessIcp}
                      inService={supplyData.inService}
                      setReading={setReading}
                      reading={reading}
                      setReadingError={setReadingError}
                      meterRearmTimeout={meterRearmTimeout}
                      supplyData={supplyData}
                      readingTypesIds={readingTypesIds}
                      rearmActive={rearmActive}
                    />
                    :
                    connectSuccess ?
                      <ConnectSuccess
                        onePhase={supplyData.installationType === 'Monofásica'}
                        reading={reading}
                        supplyData={supplyData}
                      />
                      :
                      connectSuccessIcp ?
                        <ConnectSuccessIcp
                          onePhase={supplyData.installationType === 'Monofásica'}
                          reading={reading}
                          supplyData={supplyData}
                        />
                        :
                        connectError ?
                          <ConnectError
                            reading={reading}
                            handleClickConsult={handleClickConsult}
                            handleEnviarPeticion={handleEnviarPeticion}
                            handleClickItem={handleClickItemErrorLectura}
                          />
                          :
                          isConnecting ?
                            <ConnectingMessage
                              timeout={meterConsultTimeout}
                              maxTime={maxTime}
                              meterTimeout={meterTimeout}

                            />
                            :
                            <>
                            </>
              }
            </Grid>
          </Grid>
          <Grid container className={classes.mainContainer} md={8} sm={12} xs={12}>
            {/* // LLista de lectures programades */}
            <ProgrammedReads
              supplyData={supplyData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setIsExportTableDataDialogOpen={setIsExportTableDataDialogOpen}
              setIsExportAllDataDialogOpen={setIsExportAllDataDialogOpen}
              showProgramingRead={showProgramingRead}
            />
          </Grid>
        </Grid>
      </>
      :
      <>
        <div className={classes.items}>
          <Item
            type='instant-measurement'
            icon={PowerOutagesIcon}
            title={t('requests.newRequest.relationship.items.supply.claim.instantMeasurement.title')}
            description={t('requests.newRequest.relationship.items.supply.claim.instantMeasurement.description')}
            disabled={adminCheck() || isAdviser}
            handleClick={(!adminCheck() && !isAdviser) && handleClickItemMesuraInstantanea}
          />
        </div>
      </>

    // 
  )
}

export default Meter
