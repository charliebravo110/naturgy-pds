import React, { useEffect, useState } from 'react'
import { Action } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { formatDate, formatUSADateString } from '../../../common/lib/FormatLib'
import Grid from '@material-ui/core/Grid'
import Calendar from './calendar/Calendar'
import DateIcon from '../../../assets/icons/ico_calendario_plazos.svg'
import DocumentIcon from '../../../assets/icons/ico_documento.svg'
import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg';
import okIcon from '../../../assets/icons/ico_ok.svg';
import koIcon from '../../../assets/icons/Interfaz_24_cruz_cerrar_error_rojo.svg';





import Dialog from '../../../common/components/dialog/Dialog';
import Button from '../../../common/components/button/Button';

import Datepicker from '../../../common/components/datepicker/Datepicker';
import { DialogContent, Paper, Typography } from '@material-ui/core';

import CloseIcon from '../../../assets/icons/cerrar.svg';
import ClaimIcon from '../../../assets/icons/peticiones_reclamaciones.svg';
import { Link } from 'react-router-dom'
import TextButton from '../../../common/components/text-button/TextButton'
import useStyles, { StyledTableCell } from './JobExecution.styles'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import ArchiveIcon from '../../../assets/icons/plano_documento_adjunto.svg'
import XLSX from 'xlsx'
import { setNewRequestSteps, setNewRequestDossier } from '../../../requests/store/actions/RequestsActions'
import { thunkGetHippo, thunkGetMasterData } from '../../store/actions/ProvisionsThunkActions'
import { isMobileApp } from '../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../mobile-apps/local-downloads/createFileAndOpenIt'
import Spinner from '../../../common/components/spinner/Spinner'
import Forms from './tr9Data/Forms'

// LCS: Importa la función - Wave 3
import { getExpStatus, removeAccents, sendGAEvent, removeEmails } from '../../../core/utils/gtm';

const JobExecution = (props: any) => {
  const {
    isBlockedByDocument,
    setExpandedPanel,
    handleFinishedInstallation,
    handleSendSelfJobsEndDate,
    handleSendExp,
    showErrorDialog,
    showError,
    setShowErrorDialog
  } = props;

  const classes = useStyles({})
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const addDaysToDate = (date) => {
    const USAFormatDate = formatUSADateString(date)
    const auxDate = new Date(USAFormatDate)
    auxDate.setDate(auxDate.getDate() + daysToSumFFTramitesAPM)
    return formatDate(auxDate)
  }

  const provisions = useSelector((state: any) => state.provisions)
  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)
  const userToken = useSelector((state: any) => state.user.token)

  const [startdaycal, setStartdaycal] = useState(new Date())
  const [startdaylit, setStartdaylit] = useState('')
  const [enddaycal, setEnddaycal] = useState(new Date())
  const [enddaylit, setEnddaylit] = useState('')
  const [sgtFechaReplan, setSgtFechaReplan] = useState(new Date())

  const [workingOnEstimation, setWorkingOnEstimation] = useState(false)
  const [daysToSubtract, setDaysToSubtract] = useState(0)
  const [daysToSumFFTramitesAPM, setDaysToSumFFTramitesAPM] = useState(0)

  const today = new Date();

  const [showSelfJobsDialog, setShowSelfJobsDialog] = useState(false);
  const [showComunicateInstallationDialog, setShowComunicateInstallationDialog] = useState(false);

  const [comunicateInstallationDate, setComunicateInstallationDate] = useState('');


  const [enableSpinner, setEnableSpinner] = useState(false)

  const [datepickerDate, setDatepickerDate] = useState('');
  const [selfJobsEndDate, setSelfJobsEndDate] = useState('');


  const [tr9callOK, setTr9callOK] = useState(false)
  const [tr9callKO, setTr9callKO] = useState(false)
  const [isTr9Confirm, setIsTr9Confirm] = useState(false)
  const [showTr9form, setShowTr9form] = useState(false)
  const [form1Ok, setForm1Ok] = useState(false)
  const [expandSubPanels, setexpandSubPanels] = useState('panel1')
  const [inPersonVisit, setInPersonVisit] = useState(false)  
  const [isValidPersonVisit, setIsValidPersonVisit] = useState<boolean>(false)
  const [errorForm, setErrorForm] = useState(false)

  const [minDate, setMinDate] = useState(new Date());
  const [disableInstalationButton, setDisableInstalationButton] = useState(false);
  const [showingDialogAlert, setShowingDialogAlert] = useState(false)

  const [numberOfPhasesSelect, setNumberOfPhasesSelect] = useState([] as any)
  const [voltageSupplySelect, setVoltageSupplySelect] = useState([] as any)

  const [instalationType, setInstalationType] = useState('');
  const [tensionSubtension, setTensionSubtension] = useState('');
  const [provisionType, setProvisionType] = useState('');
  const [maxPowerCIE, setMaxPowerCIE] = useState('');

  const movgnfUrl = 'https://ws.movgnf.com/gnf.svc/setExtProvisionServicioCambioEstadoProvisional'

  const selectValue = (select: any, value: any) => {
    const keyValue = select.filter(item => item.substring(0, item.indexOf('|')) === value)

    return keyValue && keyValue[0] && keyValue[0].substring(keyValue[0].indexOf('|') + 1, keyValue[0].length)
  }

  const getAndSetMasterData = (key: string, setSelect: any, keyToApplyRemoveItem?: string, removeItem?: number) => {
    dispatch(thunkGetMasterData('DossierDatosTecnicos', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), key, (response) => {
      if (response) {
        setSelect(response.map(item => item.value).filter((item, index) => {
          if (keyToApplyRemoveItem && key === keyToApplyRemoveItem) {
            return index !== removeItem
          }

          return true
        }))
      }
    }))
  }

  const translateSelectedSupplyType = (value) => {
    if (value === 'DOSSUB004' || value === 'DOSSUB006' || value === 'DOSSUB005' || value === 'DOSSUB008' ||
      value === 'DOSSUB002' || value === 'DOSSUB003' || value === 'DOSSUB009' || value === 'DOSSUB012' ||
      value === 'DOSSUB013' || value === 'DOSSUB014' || value === 'DOSSUB007') {
      return 'Definitivo'
    } else if (value === 'DOSSUB011') {
      return 'Obra'
    } else if (value === 'DOSSUB010') {
      return 'Eventual'
    } else {
      return ''
    }
  }

  // Uso Residencial      --> DOSSUB004, DOSSUB006, DOSSUB005
  // Uso No Residencial   --> DOSSUB006, DOSSUB008, DOSSUB002, DOSSUB003, DOSSUB009
  // Socorro              --> DOSSUB012, DOSSUB013, DOSSUB014
  // Suministro de Obra   --> DOSSUB011
  // Eventuales           --> DOSSUB010
  // Uso Público          --> DOSSUB007

  const handleDownloadCups = () => {
    if (cups.length > 0) {
      const auxCups = [] as any

      let ws

      let fileName

      if (cups.length > 1) {
        cups && cups.map(
          (item) => {
            if (item.cups) {
              auxCups.push({
                cups: item.cups,
                potenciaContratada: item.potenciaContratada,
                direccion: item.dirección
              })
            }

            return null
          }
        )

        ws = XLSX.utils.json_to_sheet(auxCups, {
          header: [
            'cups',
            'potenciaContratada',
            'direccion'
          ]
        })

        ws['A1'].v = t('provisions.applicationClosure.downloadCupsExcel.cups')
        ws['B1'].v = t('provisions.applicationClosure.downloadCupsExcel.power')
        ws['C1'].v = t('provisions.applicationClosure.downloadCupsExcel.address')

      } else {

        cups && cups.map(
          (item) => {
            if (item.cups) {
              auxCups.push({
                cups: item.cups,
                direccion: item.dirección,
                tipoInstalacion: instalationType,
                tensionSubtension: tensionSubtension,
                tipoSuministro: provisionType,
                potenciaMaxima: maxPowerCIE,
                potenciaDE: item.potenciaContratada,
              })
            }

            return null
          }
        )

        ws = XLSX.utils.json_to_sheet(auxCups, {
          header: [
            'cups',
            'direccion',
            'tipoInstalacion',
            'tensionSubtension',
            'tipoSuministro',
            'potenciaMaxima',
            'potenciaDE'
          ]
        })

        ws['A1'].v = t('provisions.applicationClosure.downloadCupsExcel.cups')
        ws['B1'].v = t('provisions.applicationClosure.downloadCupsExcel.address')
        ws['C1'].v = t('provisions.applicationClosure.downloadCupsExcel.instalationType')
        ws['D1'].v = t('provisions.applicationClosure.downloadCupsExcel.tensionSubtension')
        ws['E1'].v = t('provisions.applicationClosure.downloadCupsExcel.supplyType')
        ws['F1'].v = t('provisions.applicationClosure.downloadCupsExcel.maxPowerCIE')
        ws['G1'].v = t('provisions.applicationClosure.downloadCupsExcel.extensionRights')
      }

      fileName = 'cups.xlsx'

      const wb = XLSX.utils.book_new()

      XLSX.utils.book_append_sheet(wb, ws, 'cups')

      XLSX.writeFile(wb, fileName)

      // XLSX.writeFile will attempt to force a client-side download, works for web,
      // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
      if (isMobileApp()) createFileAndOpenIt({ fileName, contentAsBase64: XLSX.write(wb, { type: 'base64' }) })

    }
  }

  const handleToPannel1 = () => {
    setExpandedPanel('panel1')
  }

  const object = {
    dossierCod: currentProvision.dossierCod,
    name: currentProvision.name,
    address: currentProvision.addressDescription,
    idDossierType: currentProvision.idDossierType
  }

  const handleOpenDialogAlert = () => {
    setShowingDialogAlert(true)

    dispatch(setNewRequestSteps({
      step1: 'DOSSIER',
      step2: object.dossierCod,
      step3: 'NOTIFICATIONS'
    }))
  }

  const handleCloseDialogAlert = () => {
    setShowingDialogAlert(false)
    dispatch(setNewRequestDossier(object))
  }

  {/*const comunicateInstallation = () => {
    setShowComunicateInstallationDialog(true);
    let date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().substr(0, 5);
    setComunicateInstallationDate(date);
  }*/}

  const comunicateEndDate = (click_text) => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      subsection_name: 'detalle de solicitud',
      title_screen: 'plazos estimmador de ejecucion',
      click_text: removeAccents(click_text),
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_number: currentProvision.dossierCod,
      request_status: getExpStatus(currentProvision.dossierStatusId),
      type_budget: 'no aplica',//FALTA POR TERMINAR
      tab_name: 'mi conexion a la red',
      request_type: 'quiero una nueva conexion a la red',
      request_step_name: 'ejecucion de la solicitud',
      payment_type: 'no aplica',//FALTA POR TERMINAR
      browsing_type: sessionStorage.getItem('browsing_type')
    })
    setShowSelfJobsDialog(true);
  }

  const confirmComunicateInstallation = () => {
    setShowComunicateInstallationDialog(false);
    handleFinishedInstallation();
  }

  const confirmEndDate = () => {
    setShowSelfJobsDialog(false);
    handleSendSelfJobsEndDate(datepickerDate, false);
  }

  const handleCloseSelfJobsDialog = () => {
    setShowSelfJobsDialog(false);
  }

  const handleCloseConfirmInstallationDialog = () => {
    setShowComunicateInstallationDialog(false);
  }

  const handleCloseErrorDialog = () => {
    setShowErrorDialog(false);
  }



  const handleChangeSubpanel = (panel) => (event, isExpanded) => {
    setexpandSubPanels(isExpanded ? panel : false)
  }

  const cups = (currentProvision.dossierCups && currentProvision.dossierCups.length > 0) ? currentProvision.dossierCups : [] as any
  const cupsTechData = (currentProvision.techData && currentProvision.techData.cups) ? currentProvision.techData.cups : '' as any

  useEffect(() => {
    dispatch(thunkGetMasterData('DAYS_TO_SUBTRACT_EXECUTION_DATE', 'ES', 'DAYSTOSUBTRACTEXECUTIONDATE', (response) => {
      if (response && response[0].value != '') {
        setDaysToSubtract(parseInt(response[0].value))
      }
    }))

    dispatch(thunkGetMasterData('DAYS_TO_SUM_F_F_TRAMITES_APM', 'ES', 'DAYSTOSUMFFTRAMITESAPM', (response) => {
      if (response && response[0].value != '') {
        setDaysToSumFFTramitesAPM(parseInt(response[0].value))
      }
    }))
  }, [])

  // Si la fecha prevista de fin de ejecución está en el pasado por más de un mes (30 días, parámetro configurable), en lugar del calendario se mostrará un mensaje
  useEffect(() => {
    if (startdaylit !== '' && daysToSubtract > 0) {
      const fPrevistaFinEjecucion = new Date(formatUSADateString(startdaylit))
      fPrevistaFinEjecucion.setHours(0, 0, 0, 0)
      const todayMinousXDays = new Date()
      todayMinousXDays.setDate(todayMinousXDays.getDate() - daysToSubtract)
      todayMinousXDays.setHours(0, 0, 0, 0)

      if (fPrevistaFinEjecucion.getTime() >= todayMinousXDays.getTime()) {
        setWorkingOnEstimation(true)
      }
      else {
        setWorkingOnEstimation(false)
      }
    }
  }, [startdaylit, daysToSubtract])

  useEffect(() => {
    if (currentProvision.cgpInd !== '' && currentProvision.cgpInd !== '0') {
      // Uncomment This to disable whem cgpInd true 
      // setDisableInstalationButton(true);
    }

    // dispatch(thunkGetHippo(currentProvision.dossierCod, (response) => {
    if (currentProvision && currentProvision.hippo && currentProvision.hippo.fechaFinInstalaciones && currentProvision.hippo.fechaFinInstalaciones !== '') {

      const date = currentProvision.hippo.fechaFinInstalaciones.slice(0, 10);

      setDatepickerDate(date);
      setSelfJobsEndDate(date);

    } else {
      if (currentProvision.fechaFinTrabajosPropios !== '') {
        const dateDay = currentProvision.fechaFinTrabajosPropios.slice(6, 8);
        const dateYear = currentProvision.fechaFinTrabajosPropios.slice(0, 4);
        const dateMonth = currentProvision.fechaFinTrabajosPropios.slice(4, 6);

        const selfJobsEndDate = dateDay + '/' + dateMonth + '/' + dateYear;

        setDatepickerDate(selfJobsEndDate);
        setSelfJobsEndDate(selfJobsEndDate);
      }
    }
  }, [currentProvision]);

  useEffect(() => {
    setInstalationType(selectValue(numberOfPhasesSelect, currentProvision.idDossierPhaseType))
    setTensionSubtension(selectValue(voltageSupplySelect, currentProvision.idTensionType))
    setProvisionType(translateSelectedSupplyType(currentProvision.idDossierSubtype))
    setMaxPowerCIE(currentProvision.powerCie)
  }, [numberOfPhasesSelect, voltageSupplySelect, currentProvision]);

  useEffect(() => {
    if (cups.length <= 1) {
      getAndSetMasterData('DT_FASES', setNumberOfPhasesSelect)
      getAndSetMasterData('DT_TENSION_SUM', setVoltageSupplySelect)
    }
  }, [cups]);

  const fechapruebas: any = '28/06/2022 11:00:00'

  useEffect(() => {
    if (daysToSumFFTramitesAPM && daysToSumFFTramitesAPM != 0) {
      // El dayHippo comentado es para probar cuando no hay fecha en fFTramitesAPM
      // y así porder ver el calendario 
      //
      //const dayhippo = fechapruebas.substring(0, 10)
      //
      const dayhippo = (currentProvision.hippo.fFTramitesAPM ? addDaysToDate(currentProvision.hippo.fFTramitesAPM.substring(0, 10)) : currentProvision.hippo.fFEjecucion.substring(0, 10))
      const fecha = dayhippo.split('/')
      const startday = new Date(fecha[2], fecha[1], fecha[0])
      const startdaycal = new Date(fecha[2], fecha[1] - 1, fecha[0])
      setStartdaycal(startdaycal)
      const startdaylit = formatDate(startdaycal)
      setStartdaylit(startdaylit)
      const endday = new Date(startday.getFullYear(), startday.getMonth(), startday.getDate() + 6)
      const enddaycal = new Date(endday.getFullYear(), endday.getMonth() - 1, endday.getDate())
      setEnddaycal(enddaycal)
      const enddaylit = formatDate(enddaycal)
      setEnddaylit(enddaylit)
      const hippoSgtFechaReplan = (currentProvision.hippo.sgtFechaReplan.substring(0, 10))
      const sgtFechaReplanSplit = hippoSgtFechaReplan.split('/')
      const sgtFechaReplan = new Date(sgtFechaReplanSplit[2], sgtFechaReplanSplit[1], sgtFechaReplanSplit[0])


      if (sgtFechaReplanSplit == '') {

        setSgtFechaReplan(undefined)

      } else {
        setSgtFechaReplan(sgtFechaReplan)
      }

    }
  }, [daysToSumFFTramitesAPM])

  const getLastIncidenceDate = () => {
    let lastDate = 0
    currentProvision.anomalyList && currentProvision.anomalyList.map(
      (item) => {
        if (item.petitionDate > lastDate) {
          lastDate = item.petitionDate
        }
      }
    )
    return lastDate
  }

  useEffect(() => {
    //validamos si el expediente es apto para aceptar tr9
    //dos casos, no tiene fecha fin de resolucion, tiene más de 1 incidencia
    if (currentProvision && currentProvision.hippo && currentProvision.hippo.isTr9 && (currentProvision.hippo.isTr9 === 1 || currentProvision.hippo.isTr9 === 2)) {
      //caso sin incidencia resuelta
      if (currentProvision.fechaFinTrabajosPropios === '') {
        //comprobamos si hay cups, si lo hay NO mostramos formulario
        if(cupsTechData != '' && !(provisions.dossierSubtype.includes('002') || provisions.dossierSubtype.includes('015'))) {
          setIsTr9Confirm(false)
          setTr9callOK(true)
          setTr9callKO(false)
        } else {
          if(inPersonVisit){
            setIsTr9Confirm(false)
            isValidPersonVisit ? setTr9callOK(true) : setTr9callOK(false)
          }else if(errorForm){
            setIsTr9Confirm(false)
            setTr9callOK(false)
          }else{
            setIsTr9Confirm(true)
          }
        }
      }
      // comprobamos que no tenga fecha fin de instalaciones, si tiene validamos que sea posterior a la fecha de la ultima anomalia     
      else if (currentProvision.fechaFinTrabajosPropios < getLastIncidenceDate()) {
        setIsTr9Confirm(true)
      }
      else {
        //caso sin incidencia resuelta
        //llamda hecha ya resuelta con OK
        setIsTr9Confirm(false)
        setTr9callOK(true)
        setTr9callKO(false)
      }
    }
    else {
      setIsTr9Confirm(false)
    }

  }, [currentProvision, inPersonVisit, isValidPersonVisit, errorForm])

  return (
    <Grid container className={classes.container}>
      {//Nuevo dialog Tr9
      }
      {enableSpinner && <Spinner />}

      <Forms
        setShowTr9form={setShowTr9form}
        handleSendSelfJobsEndDate={handleSendSelfJobsEndDate}
        handleSendExp={handleSendExp}
      />


      {isBlockedByDocument.length > 0 ?
        <Grid container justifyContent='center' alignItems='center' className={classes.noJobExecutionContainer}>
          <Grid item className={classes.noJobExecutionTitle2}>
            <img className={classes.documentIcon} src={DocumentIcon} alt='' />
            <br />
            <b>
              {t('provisions.jobExecution.blockedByDocument.string1')}
              {isBlockedByDocument.length === 1 ?
                <span>{t('provisions.jobExecution.blockedByDocument.oneDoc')} {isBlockedByDocument}</span>
                :
                <span>{t('provisions.jobExecution.blockedByDocument.manyDocs')} {isBlockedByDocument}</span>
              }
            </b>
            <br />
            <br />
            <span className={classes.noJobExecutionTitle3}>
              {t('provisions.jobExecution.blockedByDocument.string21')}
              <u className={classes.icon} onClick={() => handleToPannel1()}>{t('provisions.jobExecution.blockedByDocument.myDocs')}</u>
              {t('provisions.jobExecution.blockedByDocument.string22')}
              <b>{t('provisions.jobExecution.blockedByDocument.string23')}</b>
              {t('provisions.jobExecution.blockedByDocument.string24')}
            </span>
          </Grid>
        </Grid>
        :
        <Grid container justifyContent='center' alignItems='center' className={classes.noJobExecutionContainer}>
          {currentProvision.hippo && currentProvision.hippo.activity === '' ?
            <Grid container justifyContent='center' alignItems='center' className={classes.noJobExecutionContainer}>
              <Grid item className={classes.noJobExecutionTitle}>
                {t('provisions.jobExecution.noJobExecution.title')}
              </Grid>
            </Grid>
            :
            // tratamiento de expedientes Tr9, quitar false y descomentar en cuando se suba Tr9
            (currentProvision.hippo && currentProvision.hippo.isTr9 && (currentProvision.hippo.isTr9 === 1 || currentProvision.hippo.isTr9 === 2) ?

              // llamada TR9 OK, mostramos el OK de confirmación
              <>

                <Forms
                  setShowTr9form={setShowTr9form}
                  handleSendSelfJobsEndDate={handleSendSelfJobsEndDate}
                  handleSendExp={handleSendExp}
                  isTr9Confirm={isTr9Confirm}
                  tr9callOK={tr9callOK}
                  setTr9callOK={setTr9callOK}
                  tr9callKO={tr9callKO}
                  setTr9callKO={setTr9callKO}
                  selfJobsEndDate={selfJobsEndDate}
                  showError={showError}
                  setInPersonVisit={setInPersonVisit}
                  setIsValidPersonVisit={setIsValidPersonVisit}
                  errorForm={errorForm}
                  setErrorForm={setErrorForm}
                />

                {/* {tr9callOK &&
                  <>
                    <Grid container xs={11} sm={11} md={11} justifyContent='center' className={classes.anomaliesContainer}>
                      <img src={okIcon} className={classes.iconBig} />
                      <Grid item className={classes.messageBoldTr9}>{t('provisions.jobExecution.isTr9.OkResponse')}</Grid>
                      <Grid item className={classes.messageTr9}>{t('provisions.jobExecution.isTr9.OkResponseDate')}{' '}{currentProvision.fechaFinTrabajosPropios ? currentProvision.fechaFinTrabajosPropios.slice(6, 8) + '/' + currentProvision.fechaFinTrabajosPropios.slice(4, 6) + '/' + currentProvision.fechaFinTrabajosPropios.slice(0, 4) : ''}</Grid>
                    </Grid>
                    <Grid container xs={11} sm={11} md={11} justifyContent='center' alignItems='center' className={classes.whiteContainerTr9}>
                      <Grid item className={classes.messageTr9NoBottomMargin}>
                        {t('provisions.jobExecution.noJobExecution.title')}
                      </Grid>
                    </Grid>
                  </>
                } */}

                {
                  //llamada Tr9 KO, mostramos el KO
                  tr9callKO &&
                  <Grid container xs={11} sm={11} md={11} justifyContent='center' className={classes.anomaliesContainer}>
                    <img src={koIcon} className={classes.iconBig} />
                    <Grid item className={classes.messageBoldTr9}>{t('provisions.jobExecution.isTr9.KOResponse')}</Grid>
                    <Grid item className={classes.messageTr9NoBottomMargin}>{t('provisions.jobExecution.isTr9.KOResponse2')}</Grid>
                    <Grid item className={classes.messageTr9}>{t('provisions.jobExecution.isTr9.KOResponse3')}</Grid>
                  </Grid>
                }
                {
                  //Primera confirmación o posteiores
                }
              </>
              :
              <Grid item xs={11} sm={11} md={11}>
                <div className={classes.title}>{t('provisions.jobExecution.title')}</div>
                {(sgtFechaReplan === null || sgtFechaReplan === undefined) &&
                  (!selfJobsEndDate || selfJobsEndDate === undefined || selfJobsEndDate === '') ?
                  <div className={classes.adviseAnomaly}>
                    <div>{t('provisions.jobExecution.advise.string4')}</div>
                  </div>
                  :
                  workingOnEstimation && sgtFechaReplan != undefined ?
                    <Grid>
                      {/* { (

                            (sgtFechaReplan !== null || sgtFechaReplan !== undefined) &&
                            (selfJobsEndDate!== '')
                          
                        ) &&
                        
                        <div className={classes.adviseAnomaly}>
                          <div>{t('provisions.jobExecution.advise.string5')}</div>
                        </div>
                      } */}

                      <Grid container justifyContent='center' className={classes.block}>

                        <Grid container alignItems='center' justifyContent='center'>
                          <Grid item xs={12} sm={6} md={6}>
                            <Grid container justifyContent='center' alignItems='center' className={classes.dateBlock}>
                              <Grid container xs={12} sm={11} md={11} lg={10} className={classes.date}>
                                <Grid item md={1} sm={12} xs={12}><img src={DateIcon} className={classes.dateIcon} alt='' /></Grid>
                                <Grid item className={classes.dateText} md={8} sm={12} xs={12}><label>{t('provisions.jobExecution.beginDate.connection')}</label></Grid>
                              </Grid>
                            </Grid>

                            <Grid container justifyContent='center' alignItems='center' className={classes.datePrevision}>
                              <label>{t('provisions.jobExecution.week.string1')}
                                {startdaylit}
                                {t('provisions.jobExecution.week.string2')}
                                {enddaylit}
                                {t('provisions.jobExecution.week.string3')}</label>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Calendar
                          start={startdaycal}
                          end={enddaycal}
                        />
                        <div className={classes.advise}>
                          <div>{t('provisions.jobExecution.advise.string3')}</div>

                          <div>{t('provisions.jobExecution.advise.string1')}</div>

                          <div>{t('provisions.jobExecution.advise.string2')}</div>
                        </div>
                      </Grid>
                    </Grid>
                    :
                    <Grid>
                      {/* {
                          (
                              selfJobsEndDate || selfJobsEndDate !== undefined && 
                              !sgtFechaReplan || sgtFechaReplan === null || sgtFechaReplan === undefined
                            )
                            
                          &&
                          <div className={classes.adviseAnomaly}>
                            <div>{t('provisions.jobExecution.advise.string5')}</div>
                          </div>
                        } */}
                      <Grid container justifyContent='center' className={classes.block}>
                        <div className={classes.title}>{t('provisions.jobExecution.executionEstimate')}</div>
                      </Grid>
                    </Grid>
                }

                <Grid container direction='column' className={classes.comunicationsUFD}>
                  <Grid container direction='row' justifyContent='space-between'>
                    <Grid container direction='row' md={6}>
                      <Grid item>
                        <img src={ClaimIcon} alt='' />
                      </Grid>
                      <Grid item>
                        <h3>
                          {t('provisions.jobExecution.communicationsToUFD')}
                        </h3>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item className={classes.separator} />

                  <Grid container direction='column' className={classes.buttonContainer}>
                    <Grid container spacing={2} direction='row' justifyContent='space-between'>
                      <Grid item md={8} alignItems='flex-start' alignContent='flex-start'>
                        <span className={classes.comunicationText}>
                          {
                            selfJobsEndDate !== '' ?
                              t('provisions.jobExecution.advise.string5')
                              :
                              t('provisions.jobExecution.wantComunicateEndDate')
                          }
                        </span>
                      </Grid>
                      {selfJobsEndDate === '' ?
                        <Grid item md={3}>
                          <Button text={t('provisions.jobExecution.comunicateEndDate')} color='primary' size='large' variant='contained' className={classes.button}
                            onClick={() => comunicateEndDate('comunicar fecha fin instalacion particular')} disabled={disableInstalationButton} />
                        </Grid>
                        :
                        <Grid container direction='column' md={3}>
                          <Grid item className={classes.selfJobsDateContainer}>
                            <img src={DateIcon} className={classes.selfJobsCalendarIcon} alt='' />
                            <b className={classes.comunicationDate}>
                              {selfJobsEndDate}
                            </b>
                          </Grid>
                          {!disableInstalationButton &&
                            <Grid item className={classes.changeSelfJobsDate}>
                              <u onClick={() =>comunicateEndDate('modificar fecha prevista')}>
                                {t('provisions.jobExecution.modifyPreviewDate')}
                              </u>
                            </Grid>
                          }
                        </Grid>
                      }
                    </Grid>

                    {/*

                  <Grid item className={classes.separator} />

                  <Grid container direction='row' justifyContent='space-between'>
                    <Grid container direction='column' alignItems='flex-start' md={8}>
                      <Grid container  alignItems='flex-start' alignContent='flex-start'>
                        <span className={classes.comunicationText}>
                          {t('provisions.jobExecution.wantComunicateSelfJob')}
                        </span>
                      </Grid>
                      <Grid item>
                        <br/>
                        <span className={classes.cantUpdateDate}>
                          {t('provisions.jobExecution.cantUpdateDate')}
                        </span>
                        {' '}
                        <Link to='/requests/add' >
                          <u className={classes.cantUpdateDate}>
                            {t('provisions.jobExecution.openSR')}
                          </u>
                        </Link>
                      </Grid>
                    </Grid>
                    {!disableInstalationButton ?
                    <Grid item >
                      <Button text={t('provisions.jobExecution.comunicateInstallation')} color='primary' size='large' variant='contained' className={classes.button} onClick={comunicateInstallation} />
                    </Grid>
                    :
                    <Grid container direction='column' md={3}>
                      <Grid item className={classes.selfJobsDateContainer}>
                        <img src={OkIcon} className={classes.selfJobsCalendarIcon} alt='' />
                        <b className={classes.confirmedText}>
                          {t('provisions.jobExecution.confirmed')}
                        </b>
                      </Grid>
                    </Grid>
                    }
                  </Grid>

                  */}

                  </Grid>
                </Grid>

                <Dialog className={classes.dialogSelfJobs} open={showSelfJobsDialog} onClose={handleCloseSelfJobsDialog}>
                  <img src={CloseIcon} className={classes.closeButton} alt='close' onClick={handleCloseSelfJobsDialog} />
                  <DialogContent>
                    <Grid container direction='column' justifyContent='space-between' className={classes.dialogSelfJobsContainer} >
                      <Grid item>
                        <div className={classes.dialogTitle}>
                          {t('provisions.jobExecution.selfJobsPreviewDate')}
                        </div>
                        <span className={classes.previewDateText}>
                          {t('provisions.jobExecution.previewDate')}
                        </span>
                        <Grid container direction='row' justifyContent='space-evenly' alignContent='center' className={classes.datepickerInput}>
                          <Grid item md={5}>
                            <Datepicker date={datepickerDate} setDate={setDatepickerDate} minDate={minDate} maxDate={'25/03/2021'} />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid container direction='row' justifyContent='space-evenly'>
                        <Button text={t('common.buttons.close')} color='primary' size='large' variant='outlined' onClick={handleCloseSelfJobsDialog} disabled={datepickerDate !== ''} />
                        <Button text={t('common.buttons.send')} color='primary' size='large' variant='contained' onClick={confirmEndDate} disabled={datepickerDate === ''} />
                      </Grid>
                    </Grid>
                  </DialogContent>
                </Dialog>

                <Dialog className={classes.dialogComunicateInstalation} open={showComunicateInstallationDialog} onClose={handleCloseConfirmInstallationDialog}>
                  <DialogContent>
                    <img src={CloseIcon} className={classes.closeButton} alt='close' onClick={handleCloseConfirmInstallationDialog} />
                    <Grid container direction='column' justifyContent='space-between' className={classes.dialogContainer}>
                      <Grid item>
                        <img src={ClaimIcon} className={classes.dialogIcon} />
                        <div className={classes.dialogTitle}>
                          {t('provisions.jobExecution.comunicateToUFD')}
                        </div>
                        <p>
                          {t('provisions.jobExecution.sendNotificationDate')}{' '}{comunicateInstallationDate}{' '}{t('provisions.jobExecution.sendNotificationDate2')}
                        </p>
                      </Grid>
                      <Grid container direction='row' justifyContent='space-evenly'>
                        <Button text={t('common.buttons.cancel')} color='primary' size='large' variant='outlined' onClick={handleCloseConfirmInstallationDialog} />
                        <Button text={t('common.buttons.accept')} color='primary' size='large' variant='contained' onClick={confirmComunicateInstallation} />
                      </Grid>
                    </Grid>
                  </DialogContent>
                </Dialog>

                <Dialog className={classes.dialogError} open={showErrorDialog} onClose={handleCloseErrorDialog}>
                  <DialogContent>
                    <img src={CloseIcon} className={classes.closeButton} alt='close' onClick={handleCloseErrorDialog} />
                    <Grid container direction='column' justifyContent='space-between' className={classes.dialogContainer}>
                      <Grid item>
                        <img src={AlertIcon} className={classes.dialogErrorIcon} />
                        <h1 className={classes.dialogTitle}>
                          {t('provisions.jobExecution.sendError')}
                        </h1>
                        <p>
                          {t('provisions.jobExecution.cantSend')}
                          <br />
                          {t('provisions.jobExecution.tryLater')}
                        </p>
                      </Grid>
                      <Grid container direction='row' justifyContent='center'>
                        <Button text={t('common.buttons.accept')} color='primary' size='large' variant='contained' onClick={handleCloseErrorDialog} />
                      </Grid>
                    </Grid>
                  </DialogContent>
                </Dialog>
              </Grid>)
          }
          {(currentProvision.idDossierTypeId === 'DOSTYP002') &&
            <>
              <Grid item className={classes.separator} />

              <Grid container direction='column' className={classes.buttonContainer}>
                <Grid container direction='column' justifyContent='center'>
                  <Grid item >
                    <Button
                      text={t('provisions.jobExecution.buttonNotifOperRequest')}
                      color='primary'
                      size='large'
                      variant='contained'
                      className={classes.button}
                      onClick={handleOpenDialogAlert}
                    />
                    <Dialog className={classes.dialogNotif} open={showingDialogAlert} onClose={handleCloseDialogAlert}>
                      <DialogContent className={classes.dialogContainerNotif}>
                        <Grid container justifyContent='flex-end'>
                          {/* <Link style={{textDecoration: 'none'}} to='/requests/add'> */}
                          <TextButton className={classes.closeButton} onClick={handleCloseDialogAlert}>
                            <img src={CloseIcon} alt='' />
                          </TextButton>
                          {/* </Link> */}
                        </Grid>
                        <Grid container className={classes.noItems}>
                          <Grid item>
                            <Grid container>
                              <Grid container className={classes.text}>
                                {t('provisions.jobExecution.warningTitle')}
                              </Grid>
                              <Grid container className={classes.text2}>
                                {t('provisions.jobExecution.warning1')}
                              </Grid>

                              <p className={classes.text2Negrita}>
                                {t('provisions.jobExecution.warningOptionATitle')} <span className={classes.text2}>{t('provisions.jobExecution.warningOptionA')}</span>
                              </p>
                              <p className={classes.text2Negrita}>
                                {t('provisions.jobExecution.warningOptionBTitle')} <span className={classes.text2}>{t('provisions.jobExecution.warningOptionB')}</span>
                              </p>
                              <p className={classes.text2Negrita}>
                                {t('provisions.jobExecution.warningOptionCTitle')} <span className={classes.text2}>{t('provisions.jobExecution.warningOptionC')}</span>
                              </p>
                              <p className={classes.text2Negrita}>
                                {t('provisions.jobExecution.warningOptionDTitle')} <span className={classes.text2}>{t('provisions.jobExecution.warningOptionD')}</span>
                                <span className={classes.text2Negrita}>{t('provisions.jobExecution.warningOptionDFinal')}</span>
                              </p>
                              <Grid container className={classes.text2Nota}>
                                {t('provisions.jobExecution.warningNota')}
                              </Grid>
                              <Link style={{ textDecoration: 'none' }} to='/requests/add'>
                                <div className={classes.button2} onClick={handleCloseDialogAlert}>{t('common.buttons.close')}</div>
                              </Link>
                            </Grid>
                          </Grid>
                        </Grid>
                      </DialogContent>
                    </Dialog>
                  </Grid>
                  {/* 
                <Grid item className={classes.dateBlock2}>  
                  <a href='https://www.ufd.es/nueva-conexion-de-generacion/' target='_blank' rel='noopener noreferrer'>{t('provisions.jobExecution.downloadPDFGuide')}</a>
                </Grid>                                  
                */}
                </Grid>
              </Grid>
            </>
          }

          {/* <Grid item className={classes.separator} /> */}

          {(currentProvision.idDossierTypeId === 'DOSTYP002' || currentProvision.idDossierTypeId === 'DOSTYP003') ?
            <Grid />
            :
            <>
              {!isTr9Confirm &&
                <Grid item className={classes.message} md={10}>
                  {t('provisions.jobExecution.messageinfo')}
                </Grid>
              }

              {(cups.length > 0 && cups[0] && cups[0].cups !== '') ?
                <>
                  <Grid item className={classes.separator} />
                  <Grid container className={classes.container}>
                    <Grid container justifyContent='center' alignItems='center' className={classes.noJobExecutionContainer}>
                      <Grid container className={classes.inner} justifyContent='center' alignItems='center' xs={12} sm={9} md={8} spacing={4}>
                        <Grid item className={classes.noJobExecutionTitle}>
                          {t('provisions.applicationClosure.titlecups')}
                        </Grid>

                        <Grid container>
                          <ul>
                            <li className={classes.marginBottomLi}>
                              <span className={classes.maxPowerTitle}>
                                {t('provisions.applicationClosure.maxPower')}
                              </span>
                              {' '}
                              <span className={classes.maxPowerDescription}>
                                {t('provisions.applicationClosure.maxPowerDescription')}
                              </span>
                            </li>
                            <li className={classes.marginBottomLi}>
                              <span className={classes.maxPowerTitle}>
                                {t('provisions.applicationClosure.AcometidaMaxPower')}
                              </span>
                              {' '}
                              <span className={classes.maxPowerDescription}>
                                {t('provisions.applicationClosure.AcometidaMaxPowerDescription')}
                              </span>
                            </li>
                            <li>
                              <span className={classes.maxPowerTitle}>
                                {t('provisions.applicationClosure.extensionRights')}
                              </span>
                              {' '}
                              <span className={classes.extensionRightsDescription}>
                                {t('provisions.applicationClosure.extensionRightsDescription')}
                              </span>
                            </li>
                          </ul>
                        </Grid>
                      </Grid>

                      {cups.length > 1 ?
                        <Grid item xs={12} sm={12} md={12}>
                          <Table className={classes.suppliesTable}>
                            <TableHead>
                              <TableRow className={classes.tableRow}>
                                <StyledTableCell>
                                  {t('provisions.applicationClosure.tableHead')}
                                </StyledTableCell>
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              {
                                cups.map((item, index) => (
                                  <TableRow key={index} className={classes.tableBodyRow}>
                                    <StyledTableCell>
                                      {item.cups}
                                    </StyledTableCell>
                                  </TableRow>
                                ))
                              }
                            </TableBody>
                          </Table>
                        </Grid>
                        :
                        <Grid item xs={12} sm={12} md={12}>
                          <Table className={classes.suppliesTable}>
                            <TableHead>
                              <TableRow className={classes.tableRow}>
                                <StyledTableCell>
                                  {t('provisions.applicationClosure.tableHead')}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {t('provisions.applicationClosure.tableAddress')}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {t('provisions.applicationClosure.tableInstalation')}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {t('provisions.applicationClosure.tableTension')}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {t('provisions.applicationClosure.tableSupply')}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {t('provisions.applicationClosure.tableMaxPower')}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {t('provisions.applicationClosure.tableExtensionRights')}
                                </StyledTableCell>
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              {
                                cups.map((item, index) => (
                                  <TableRow key={index} className={classes.tableBodyRow}>
                                    <StyledTableCell>
                                      {item.cups}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      {item.dirección}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      {instalationType}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      {tensionSubtension}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      {provisionType}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      {maxPowerCIE}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      {item.potenciaContratada}
                                    </StyledTableCell>
                                  </TableRow>
                                ))
                              }
                            </TableBody>
                          </Table>
                        </Grid>
                      }

                      <Grid container className={classes.innerMargin} justifyContent='center' alignItems='center' xs={12} sm={9} md={8} spacing={4}>
                        <Grid item>
                          <Grid container justifyContent='center' alignItems='center' className={`${classes.download} ${cups.length === 0 && 'disabled'}`} onClick={handleDownloadCups}>
                            <Grid item md={1} sm={1} xs={1}>
                              <img src={ArchiveIcon} className={classes.downloadIcon} alt='' />
                            </Grid>

                            <Grid item className={classes.downloadText} md={9} sm={9} xs={9}>
                              {t('provisions.applicationClosure.download')}
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item className={classes.advise}>
                          {`${t('provisions.applicationClosure.advise.string1')} `}
                          <a href='https://facturaluz.cnmc.es/' target='_blank' rel='noopener noreferrer'>CNMC</a>
                          {t('provisions.applicationClosure.advise.string2')}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
                :
                <Grid />
              }

            </>
          }



        </Grid>
      }
    </Grid>
  )
}

export default JobExecution