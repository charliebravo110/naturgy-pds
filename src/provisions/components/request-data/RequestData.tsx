import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { DialogContent } from '@material-ui/core'

import ApplicantDataIcon from '../../../assets/icons/datos_solicitante.svg'

import Spinner from '../../../common/components/spinner/Spinner'
import Button from '../../../common/components/button/Button'
import Dialog from '../../../common/components/dialog/Dialog'
import DocumentIcon from '../../../assets/icons/mis_documentos.svg'
import CloseIcon from '../../../assets/icons/cerrar.svg'
import InfoIcon from '../../../assets/icons/info.svg'

import EditProvisionData from './technical-data/edit-provision/TechnicalData'
import NewProvisionData from './technical-data/new-provision/TechnicalData'
import EditInstallationsData from './technical-data/edit-installations/TechnicalData'
import NewGenerationData from './technical-data/new-generation/TechnicalData'

import ApplicantData from './applicant-data/ApplicantData'
import Confirmation from './confirmation/Confirmation'
import DocumentationNewGeneration from '../documentation/DocumentationNewGeneration'
import ReturnDialog from './dialogs/return-dialog/ReturnDialog'
import LoadingDialog from './dialogs/loading-dialog/LoadingDialog'
import InferiorPowerDialog from './dialogs/inferiorPower-dialog/InferiorPower'

import { checkUserType, checkDocumentType, validateObjectEmpty, validateMail } from '../../../common/lib/ValidationLib'
import { noAccents, fixIneCodeTownLength, formatDateZeus, formatWebStartDateNoSeconds } from '../../../common/lib/FormatLib'

import { setUserRole } from '../../../common/store/actions/UserActions'
import {
  setCustomerApplicant,
  setCustomerOwner,
  setCustomerPayer,
  setCurrentProvision,
  setCurrentProvisionPreparedToSend,
  setTechData,
  setProvisionsList
} from '../../store/actions/ProvisionsActions'
import { hideError } from '../../../common/store/actions/ErrorActions'
import {
  thunkGetPowerCalculation,
  thunkGetCustomer,
  thunkCreateCustomer,
  thunkCreateProvision,
  thunkListDossiers,
  thunkGetMasterData,
  thunkSaveDossierData,
  thunkUpdateDossier,
  thunkGetProvision
} from '../../store/actions/ProvisionsThunkActions'

import useStyles, {
  ExpansionPanel,
  ExpansionPanelSummary,
  StyledExpandMoreIcon,
  ExpansionPanelDetails
} from './RequestData.styles'
import ShowMessage from '../new-generation/steps/show-message/ShowMessage'
import Documentation from '../documentation/Documentation'
import { PartyModeSharp } from '@material-ui/icons'

// LCS: Importa la función - Wave 3
import { sendGAEvent, getTypologySelfConsumption, removeAccents, removeEmails } from '../../../core/utils/gtm'

const RequestData = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  let userRoles = sessionStorage.getItem('userRoles') || ''
  let userRolesArray = userRoles.split(',')

  const user = useSelector((state: any) => state.user.profile)
  //RGPD - ADN - 03/12/2024



  const customerApplicant = useSelector((state: any) => state.provisions.customerApplicant)
  const customerApplicantData = useSelector((state: any) => state.provisions.customerApplicantData)
  const customerOwner = useSelector((state: any) => state.provisions.customerOwner)
  const customerPayer = useSelector((state: any) => state.provisions.customerPayer)

  const preparedToSend = useSelector((state: any) => state.provisions.currentProvisionPreparedToSend)

  const [newOffset, setNewOffset] = useState(1)

  const {
    history,
    setRequestDataCompleted,
    state,
    setState,
    showDocOnCancelDossier,
    isPendingReview,
    isPendingSubsanation,
    blockerDocumentsList,
    isSecondSubsanation,
    autoconsumo,
    generaCogen,
    datosUser,
    indAceptoFacturaDigital,
    setIndAceptoFacturaDigital,
    billingEmail,
    setBillingEmail,
    isSelfConsumption,
    isOnDeck,
    fotovoltaicaSuperficie,
    typeAutoconsumo,
    typeConexion,
    CGPSelected,
    setIsLoadingGlobal
  } = props


  const [disabledButton, setDisabledButton] = useState(true)
  const [errorCheckTech, setErrorCheckTech] = useState(true)
  const [errorCheckApplicant, setErrorCheckApplicant] = useState(true)
  const [isEmptyTech, setIsEmptyTech] = useState(true)
  const [isEmptyApplicant, setIsEmptyApplicant] = useState(true)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [returnDialogOpen, setReturnDialogOpen] = useState(false)
  const [newCustomers, setNewCustomers] = useState([] as any)
  const [checkEmptyStore, setCheckEmptyStore] = useState(true)
  const [documentDossierStatus, setDocumentDossierStatus] = useState(false)
  const [currentStateProvisionId, setCurrentStateProvisionId] = useState('')
  const [notNecessary, setNotNecessary] = useState(false)
  const [isDigitalBillingCompany, setIsDigitalBillingCompany] = useState(true)
  const [declareDocumentValidOwner, setDeclareDocumentValidOwner] = useState(true)
  const [declareDocumentValidPayer, setDeclareDocumentValidPayer] = useState(true)
  const [ownerData, setOwnerData] = useState<any>({})
  const [payerData, setPayerData] = useState<any>({})
  const [documentUpdate, setDocumentUpdate] = useState<any>({})

  const [owner, setOwner] = useState(false)
  const [billDirection, setBillDirection] = useState(false)
  const [contact, setContact] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [dialogText, setDialogText] = useState('')

  const [billEmail, setBillEmail] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [loadingDialogOpen, setLoadingDialogOpen] = useState(false)

  const provisions = useSelector((state: any) => state.provisions)
  const modificationCups = useSelector((state: any) => state.provisions.modificationCups)
  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)
  const suppliesList = useSelector((state: any) => state.supplies.list)

  const [payer, setPayer] = useState(false)

  const [currentProvisionState, setCurrentProvisionState] = useState(currentProvision)

  const [customersCreated, setCustomersCreated] = useState(0)

  const [createDossierTimeout, setCreateDossierTimeout] = useState('' as any)

  const [inferiorPower, setInferiorPower] = useState(false)

  const [supply, setSupply] = useState([] as any)

  const handleCloseDialog = () => {
    setShowDialog(false)
  }
  const [messageTitle, setMessageTitle] = useState('');
  const [messageSubtitle, setMessageSubtitle] = useState('');
  const [showMessage, setShowMessage] = useState(false)

  /* Mensaje para pendiente revisión documentación y pendiente subsanación */
  useEffect(() => {

    if (isPendingReview) {
      setMessageTitle(t('provisions.newProvision.pendingReview.title'))
      setMessageSubtitle(t('provisions.newProvision.pendingReview.subtitle'))
      setShowMessage(true)
    } else if (isSecondSubsanation) {
      setMessageTitle(t('provisions.newProvision.pendingSecondSubsanation.title'))
      setMessageSubtitle(t('provisions.newProvision.pendingSecondSubsanation.subtitle'))
      setShowMessage(true)
    } else if (isPendingSubsanation) {
      setMessageTitle(t('provisions.newProvision.pendingSubsanation.title'))
      setMessageSubtitle(t('provisions.newProvision.pendingSubsanation.subtitle'))
      setShowMessage(true)
    }

  }, [isPendingReview, isPendingSubsanation, isSecondSubsanation])

  /* Carga de timeout desde masterData para la creacion de dossier */
  useEffect(() => {
    if (!createDossierTimeout) {
      dispatch(thunkGetMasterData('API_TIMEOUT', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), 'CREATE_DOSSIER', (response) => {
        let createDossierAux

        if (response && response.length > 0) {
          const createDossierTimeoutAux = response[0].value

          if (createDossierTimeoutAux) {
            createDossierAux = createDossierTimeoutAux
          } else {
            createDossierAux = process.env.REACT_APP_API_TIMEOUT_CREATE_DOSSIER
          }
        } else {
          createDossierAux = process.env.REACT_APP_API_TIMEOUT_CREATE_DOSSIER
        }

        setCreateDossierTimeout(parseInt(createDossierAux))
      }))
    }
    // eslint-disable-next-line
  }, [])

  const returnVoltageType = (type) => {
    if (type == 'Baja') {
      return 'VOLTYP0002'
    } else if (type == 'Alta') {
      return 'VOLTYP0001'
    }
    return ''
  }

  const returnPhaseType = (phase: string) => {
    const phaseLC = phase.toLowerCase();
    return phaseLC.includes('mono') ? 'FASE_MONOF' : phaseLC.includes('tri') ? 'FASE_TRIFA' : ''
  }

  const formatWithLeadingZeros = (num) => String(num).padStart(2, '0');
  const transformarFecha = (formatoOriginal: string): string => {
    if (!formatoOriginal) return;
    // Dividimos la fecha y la hora
    let [fecha, hora] = formatoOriginal.split(' '); // "10/12/2024" y "17:44"

    // Descomponemos la parte de la fecha en día, mes y año
    let [dia, mes, año] = fecha.split('/'); // ["10", "12", "2024"]
    
    // Descomponemos la hora en horas y minutos
    let [horas, minutos] = hora.split(':'); // ["17", "44"]

    // Construimos el formato deseado YYYYMMDDHHmm
    return `${año}${mes}${dia}${horas}${minutos}`;
  }

  useEffect(() => {

    if (suppliesList) {
      const supply = suppliesList.filter(item => item.cups === modificationCups.cups)
      setSupply(supply)
    }

  }, [modificationCups, suppliesList])

  const pad2 = (n) => {
    return n < 10 ? '0' + n : n
  }

  const getCurrentDate = () => {
    const date = new Date()
    return date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds())
  }
  
  const handleFinishButton = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    let auxTypology = getTypologySelfConsumption(provisions.dossierSubtype)
    let request_type = sessionStorage.getItem('request_type')
    let use_type = sessionStorage.getItem('use_type')
    let housing_type = sessionStorage.getItem('housing_type')
    if (request_type === 'quiero una nueva conexion a la red' && use_type && use_type.length > 0 && housing_type && housing_type.length > 0) {
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: 'datos de solicitante',
        click_text: 'aceptar',
        element_type: 'conversion de accion',
        page_url: removeEmails(window.location.href),
        request_type: sessionStorage.getItem('request_type'),
        request_step_name: 'datos de la solicitud',
        browsing_type: sessionStorage.getItem('browsing_type'),
        use_type: removeAccents(use_type),
        housing_type: removeAccents(housing_type)
      })
    } else if (request_type === 'quiero una nueva conexion a la red' && use_type && use_type.length > 0) {
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: 'datos de solicitante',
        click_text: 'aceptar',
        element_type: 'conversion de accion',
        page_url: removeEmails(window.location.href),
        request_type: sessionStorage.getItem('request_type'),
        request_step_name: 'datos de la solicitud',
        browsing_type: sessionStorage.getItem('browsing_type'),
        use_type: removeAccents(use_type),
        housing_type: 'no aplica'
      })
    } else if (request_type === 'ampliacion de potencia') {
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: 'datos de solicitante',
        click_text: 'aceptar',
        element_type: 'conversion de accion',
        page_url: removeEmails(window.location.href),
        request_type: request_type,
        request_step_name: 'datos de la solicitud',
        cups: modificationCups.cups ? modificationCups.cups : (sessionStorage.getItem('cups') ? sessionStorage.getItem('cups') : 'no aplica'),
        browsing_type: sessionStorage.getItem('browsing_type')
      })
    } else {
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: 'datos de solicitante',
        click_text: 'aceptar',
        element_type: 'conversion de accion',
        page_url: removeEmails(window.location.href),
        request_type: request_type,
        request_step_name: 'datos de la solicitud',
        cups: modificationCups.cups ? modificationCups.cups : (sessionStorage.getItem('cups') ? sessionStorage.getItem('cups') : 'no aplica'),
        request_subtype: auxTypology,
        browsing_type: sessionStorage.getItem('browsing_type')
      })
    }
    props.history.push('/provisions')
  }

  const handleCancelButton = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    let auxTypology = getTypologySelfConsumption(provisions.dossierSubtype)
    let request_type = sessionStorage.getItem('request_type')
    let use_type = sessionStorage.getItem('use_type')
    let housing_type = sessionStorage.getItem('housing_type')
    if (request_type === 'ampliacion de potencia' && state !== 1) {
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: 'datos tecnicos de instalacion',
        click_text: 'volver',
        element_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        request_type: 'ampliacion de potencia',
        request_step_name: 'datos de la solicitud',
        cups: modificationCups.cups ? modificationCups.cups : (sessionStorage.getItem('cups') ? sessionStorage.getItem('cups') : 'no aplica'),
        browsing_type: sessionStorage.getItem('browsing_type')
      })
    } else if (request_type === 'ampliacion de potencia' && state === 1) {
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: 'datos de solicitante',
        click_text: 'volver',
        element_type: 'conversion de accion',
        page_url: removeEmails(window.location.href),
        request_type: 'ampliacion de potencia',
        request_step_name: 'datos de la solicitud',
        cups: modificationCups.cups ? modificationCups.cups : (sessionStorage.getItem('cups') ? sessionStorage.getItem('cups') : 'no aplica'),
        browsing_type: sessionStorage.getItem('browsing_type')
      })
    } else if (request_type === 'quiero una nueva conexion a la red' && use_type && use_type.length > 0 && housing_type && housing_type.length > 0 && state == 0) {
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: 'datos tecnicos de instalacion',
        click_text: 'volver',
        element_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        request_type: sessionStorage.getItem('request_type'),
        request_step_name: 'datos de la solicitud',
        browsing_type: sessionStorage.getItem('browsing_type'),
        use_type: removeAccents(use_type),
        housing_type: removeAccents(housing_type)
      })
    } else if (request_type === 'quiero una nueva conexion a la red' && use_type && use_type.length > 0 && state == 0) {
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: 'datos tecnicos de instalacion',
        click_text: 'volver',
        element_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        request_type: sessionStorage.getItem('request_type'),
        request_step_name: 'datos de la solicitud',
        browsing_type: sessionStorage.getItem('browsing_type'),
        use_type: removeAccents(use_type),
        housing_type: 'no aplica'
      })
    } else if (request_type === 'quiero una nueva conexion a la red' && use_type && use_type.length > 0 && housing_type && housing_type.length > 0 && state === 1) {
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: 'datos de solicitante',
        click_text: 'volver',
        element_type: 'conversion de accion',
        page_url: removeEmails(window.location.href),
        request_type: sessionStorage.getItem('request_type'),
        request_step_name: 'datos de la solicitud',
        browsing_type: sessionStorage.getItem('browsing_type'),
        use_type: removeAccents(use_type),
        housing_type: removeAccents(housing_type)
      })
    } else if (request_type === 'quiero una nueva conexion a la red' && use_type && use_type.length > 0 && state === 1) {
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: 'datos de solicitante',
        click_text: 'volver',
        element_type: 'conversion de accion',
        page_url: removeEmails(window.location.href),
        request_type: sessionStorage.getItem('request_type'),
        request_step_name: 'datos de la solicitud',
        browsing_type: sessionStorage.getItem('browsing_type'),
        use_type: removeAccents(use_type),
        housing_type: 'no aplica'
      })
    } else if (state === 1 && modificationCups.cups) {
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: 'datos de solicitante',
        click_text: 'volver',
        element_type: 'conversion de accion',
        page_url: removeEmails(window.location.href),
        request_type: request_type,
        request_step_name: 'datos de la solicitud',
        cups: modificationCups.cups,
        //request_subtype: auxTypology,
        browsing_type: sessionStorage.getItem('browsing_type')
      })
    } else if (state === 1) {
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: 'datos de solicitante',
        click_text: 'volver',
        element_type: 'conversion de accion',
        page_url: removeEmails(window.location.href),
        request_type: request_type,
        request_step_name: 'datos de la solicitud',
        request_subtype: auxTypology,
        browsing_type: sessionStorage.getItem('browsing_type')
      })
    } else if (modificationCups.cups) {
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: 'datos tecnicos de instalacion',
        click_text: 'volver',
        element_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        request_type: request_type,
        request_step_name: 'datos de la solicitud',
        cups: modificationCups.cups,
        request_subtype: auxTypology,
        browsing_type: sessionStorage.getItem('browsing_type')
      })
    } else {
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: 'datos tecnicos de instalacion',
        click_text: 'volver',
        element_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        request_type: request_type,
        request_step_name: 'datos de la solicitud',
        browsing_type: sessionStorage.getItem('browsing_type'),
        request_subtype: auxTypology,
      })
    }
    setReturnDialogOpen(true)
  }

  const updateState = async () => {
    setIsLoading(true)

    if (state === 0) {
      // LCS: Enviar evento de GdC a GA - Wave 3
      let auxTypology = getTypologySelfConsumption(provisions.dossierSubtype)
      let request_type = sessionStorage.getItem('request_type')
      let use_type = sessionStorage.getItem('use_type')
      let housing_type = sessionStorage.getItem('housing_type')   
      if (request_type === 'ampliacion de potencia') {
        sendGAEvent({
          event: 'request_funnel',
          section_name: 'mi conexion a la red',
          title_screen: 'datos tecnicos de instalacion',
          click_text: 'aceptar',
          element_type: 'consulta de informacion',
          page_url: removeEmails(window.location.href),
          request_type: 'ampliacion de potencia',
          request_step_name: 'datos de la solicitud',
          cups: modificationCups.cups ? modificationCups.cups : (sessionStorage.getItem('cups') ? sessionStorage.getItem('cups') : 'no aplica'),
          browsing_type: sessionStorage.getItem('browsing_type')
        })
      } else if (request_type === 'quiero una nueva conexion a la red' && use_type && use_type.length > 0 && housing_type && housing_type.length > 0) {
        sendGAEvent({
          event: 'request_funnel',
          section_name: 'mi conexion a la red',
          title_screen: 'datos tecnicos de instalacion',
          click_text: 'aceptar',
          element_type: 'consulta de informacion',
          page_url: removeEmails(window.location.href),
          request_type: sessionStorage.getItem('request_type'),
          request_step_name: 'datos de la solicitud',
          browsing_type: sessionStorage.getItem('browsing_type'),
          use_type: removeAccents(use_type),
          housing_type: removeAccents(housing_type)
        })
      } else if (request_type === 'quiero una nueva conexion a la red' && use_type && use_type.length > 0) {
        sendGAEvent({
          event: 'request_funnel',
          section_name: 'mi conexion a la red',
          title_screen: 'datos tecnicos de instalacion',
          click_text: 'aceptar',
          element_type: 'consulta de informacion',
          page_url: removeEmails(window.location.href),
          request_type: sessionStorage.getItem('request_type'),
          request_step_name: 'datos de la solicitud',
          browsing_type: sessionStorage.getItem('browsing_type'),
          use_type: removeAccents(use_type),
          housing_type: 'no aplica'
        })
      } else if (modificationCups.cups) {
        sendGAEvent({
          event: 'request_funnel',
          section_name: 'mi conexion a la red',
          title_screen: 'datos tecnicos de instalacion',
          click_text: 'aceptar',
          element_type: 'consulta de informacion',
          page_url: removeEmails(window.location.href),
          request_type: request_type,
          request_step_name: 'datos de la solicitud',
          cups: modificationCups.cups,
          request_subtype: auxTypology,
          browsing_type: sessionStorage.getItem('browsing_type')
        })
      } else {
        sendGAEvent({
          event: 'request_funnel',
          section_name: 'mi conexion a la red',
          title_screen: 'datos tecnicos de instalacion',
          click_text: 'aceptar',
          element_type: 'consulta de informacion',
          page_url: removeEmails(window.location.href),
          request_type: request_type,
          request_step_name: 'datos de la solicitud',
          request_subtype: auxTypology,
          browsing_type: sessionStorage.getItem('browsing_type')
        })
      }
      dispatch(hideError())

      if (provisions.dossierType !== 'DOSTYP002' && provisions.dossierSubtype !== 'DOSSUB015' && provisions.dossierSubtype !== 'DOSSUB016' && provisions.dossierType !== 'DOSTYP003') {
        calculatePower()
        /*
        if (provisions.dossierSubtype === 'DOSSUB011') {
          if (provisions.powerList && provisions.powerList[0] && provisions.powerList[0].requestPower) {
            let requestPower = provisions.powerList[0].requestPower
            let finalPs = provisions.finalPs

            if (finalPs !== '') {
              let defaultDossierName = t('provisions.defaultName')

              dispatch(thunkListDossiers(
                defaultDossierName,
                1, // offset
                1, // limit
                finalPs, // búsqueda por dossierCod
                true, // proveniente de una búsqueda
                (response) => {
                  if (response && response.length > 0) {
                    calculatePower()
                  } else {
                    dispatch(setMessage(t('errors.workSupply.notFoundFinalPs')))

                    setIsLoading(false)
                  }
                }
              ))
            } else {
              if (Number(requestPower) > 35) {
                dispatch(setMessage(t('errors.workSupply.requiredFinalPs')))

                setIsLoading(false)
              } else {
                calculatePower()
              }
            }
          }
        } else {
          calculatePower()
        }
        */
      } else {
        if (provisions.dossierSubtype === 'DOSSUB015') {
          // Comprobar derechos de acceso recuperados de suppliesList con totalPower, si totalPower < derechos ...
          // if ((parseFloat(provisions.techData.totalPower) <= parseFloat(modificationCups.validExtentRights)) 
          //      || !(provisions.techData.idDossierTensionType == returnVoltageType(supply[0].voltage.split(' ')[0]))
          //      || (parseFloat(provisions.techData.totalPower) <= parseFloat(modificationCups.maxAvalaibleVoltage))
          //      || (provisions.techData.phase == returnPhaseType(supply[0].installationType))
          // ) {
          //   setInferiorPower(true)
          //   // setNotNecessary(true)
          //   // window.scrollTo({
          //   //   top: 0,
          //   //   left: 0,
          //   //   behavior: 'smooth'
          //   // })
          // } else {
          //   setState(1)
          // }
          if (
            !(provisions.techData.idDossierTensionType == returnVoltageType(supply[0].voltage.split(' ')[0]))
            || (parseFloat(provisions.techData.totalPower) > parseFloat(modificationCups.maxAvalaibleVoltage))
            || !(provisions.techData.phase == returnPhaseType(supply[0].installationType))
          ) {
            setState(1)
          } else {
            setInferiorPower(true)
          }
        } else {
          setState(1)
        }
        setIsLoading(false)
      }
    } else if (state === 1) {
      // LCS: Enviar evento de GdC a GA - Wave 3
      let auxTypology = getTypologySelfConsumption(provisions.dossierSubtype)
      let request_type = sessionStorage.getItem('request_type')
      let use_type = sessionStorage.getItem('use_type')
      let housing_type = sessionStorage.getItem('housing_type')
      if (request_type === 'quiero una nueva conexion a la red' && use_type && use_type.length > 0 && housing_type && housing_type.length > 0) {
        sendGAEvent({
          event: 'request_funnel',
          section_name: 'mi conexion a la red',
          title_screen: 'datos de solicitante',
          click_text: 'aceptar',
          element_type: 'conversion de accion',
          page_url: removeEmails(window.location.href),
          request_type: sessionStorage.getItem('request_type'),
          request_step_name: 'datos de la solicitud',
          browsing_type: sessionStorage.getItem('browsing_type'),
          use_type: removeAccents(use_type),
          housing_type: removeAccents(housing_type)
        })
      } else if (request_type === 'quiero una nueva conexion a la red' && use_type && use_type.length > 0) {
        sendGAEvent({
          event: 'request_funnel',
          section_name: 'mi conexion a la red',
          title_screen: 'datos de solicitante',
          click_text: 'aceptar',
          element_type: 'conversion de accion',
          page_url: removeEmails(window.location.href),
          request_type: sessionStorage.getItem('request_type'),
          request_step_name: 'datos de la solicitud',
          browsing_type: sessionStorage.getItem('browsing_type'),
          use_type: removeAccents(use_type),
          housing_type: 'no aplica'
        })
      } else if (modificationCups.cups) {
        sendGAEvent({
          event: 'request_funnel',
          section_name: 'mi conexion a la red',
          title_screen: 'datos de solicitante',
          click_text: 'aceptar',
          element_type: 'conversion de accion',
          page_url: removeEmails(window.location.href),
          request_type: request_type,
          request_step_name: 'datos de la solicitud',
          cups: modificationCups.cups,
          //request_subtype: auxTypology ? auxTypology : 'no aplica',
          browsing_type: sessionStorage.getItem('browsing_type')
        })
      } else {
        sendGAEvent({
          event: 'request_funnel',
          section_name: 'mi conexion a la red',
          title_screen: 'datos de solicitante',
          click_text: 'aceptar',
          element_type: 'conversion de accion',
          page_url: removeEmails(window.location.href),
          request_type: request_type,
          request_step_name: 'datos de la solicitud',
          request_subtype: auxTypology ? auxTypology : 'no aplica',
          browsing_type: sessionStorage.getItem('browsing_type')
        })
      }
      
      sessionStorage.removeItem('cups');

      const promises = [] as any
      const errors = [] as any

      // Si ya se crearon los customers necesarios se salta este paso
      if (customersCreated > 0) {
        setNewCustomers([])
      }

      if (newCustomers) {}
        for (const item of newCustomers) {
          let personData

          if (item === 'applicant' || item === 'applicant-notConsumer') {
            personData = customerApplicant
          } else if (item === 'owner') {
            personData = customerOwner
          } else if (item === 'payer') {
            personData = customerPayer
          }

          let indJuridico
          let docType
          let IP = user.userIP
          let acceptRightDate = transformarFecha(user.acceptRightDate)
          let indLegalAccept = '1'

          if (personData.docNumber) {
            indJuridico = checkUserType(personData.docNumber)
            docType = checkDocumentType(personData.docNumber)
          }

          personData = {
            ...personData,
            indJuridico,
            docType,
            IP,
            acceptRightDate,
            indLegalAccept
          }
          try {
            await new Promise<void>((resolve, reject) => {
              dispatch(thunkGetCustomer(personData.docNumber, (response1) => {
                if (response1) {
                  response1 = response1.customers && response1.customers.items && response1.customers.items.length > 0 && response1.customers.items[0]
  
                  const idRelationship1 = {
                    idRelationship: response1.idRelationship
                  }
  
                  if (response1.idRelationship) {
                    if (item === 'applicant') {
                      dispatch(setCustomerApplicant({ idRelationship: response1.idRelationship, docNumber: response1.docNumber }))
                    } else if (item === 'owner') {
                      dispatch(setCustomerOwner(idRelationship1))
                    } else if (item === 'payer') {
                      dispatch(setCustomerPayer(idRelationship1))
                    }
  
                    resolve()
                  } else {
                    dispatch(thunkCreateCustomer(personData, (response2) => {
                      if (response2 && response2.result && response2.result.codResult) {
                        if (response2.result.codResult.toString() === '0000') {
  
                          const idRelationship = {
                            idRelationship: response2.idRelationship
                          }
  
                          if (item === 'applicant') {
                            dispatch(setCustomerApplicant({ idRelationship: response2.idRelationship, docNumber: personData.docNumber }))
                          } else if (item === 'owner') {
                            dispatch(setCustomerOwner(idRelationship))
                          } else if (item === 'payer') {
                            dispatch(setCustomerPayer(idRelationship))
                          }
  
                          resolve()
                        } else {
                          reject()
                        }
                      } else {
                        reject()
                      }
                    }))
                  }
                } else {
                  reject()
                }
              }))
            })
          } catch {
            errors.push(item)
          }
        }

        if (errors.length === 0) {
          let nCustomersCreated = customersCreated + 1
          setCustomersCreated(nCustomersCreated)
        } else {
          console.log(errors)
        }
        setIsLoading(false)
    }
  }

  const calculatePower = () => {
    let powerListAux = [] as any

    if (provisions.powerList && provisions.powerList.length > 0) {
      provisions.powerList.map((item) => {
        let itemAux = {
          ...item,
          requestPower: item.requestPower && (+Number(item.requestPower).toFixed(2)).toString(),
          subtotalPower: item.requestPower && (+Number(item.requestPower).toFixed(2)).toString()
        }

        return powerListAux.push(itemAux)
      })
    }

    let ineCodeProvince = (provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.codProvinciaINE) ? provisions.cadastreData.item.domicilioTributario.codProvinciaINE : ''
    let ineCodeTown = (provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.codMunicipioINE) ? fixIneCodeTownLength(provisions.cadastreData.item.domicilioTributario.codMunicipioINE) : ''

    let data = {
      powerList: powerListAux,
      idDossierType: provisions.dossierType,
      idDossierSubtype: provisions.dossierSubtype,
      idTensionType: provisions.techData.idDossierTensionType,
      electricVehicleCharging: provisions.techData.electricVehicleCharging,
      indSPL: provisions.techData.SPL
    } as any

    if (ineCodeProvince !== '' && ineCodeTown !== '') {
      data = {
        ...data,
        ineProvinceTown: ineCodeProvince + '' + ineCodeTown
      }
    }

    if (provisions.dossierType === 'DOSTYP001' && provisions.dossierSubtype === 'DOSSUB015') {
      data = {
        ...data,
        indTimeDiscriminator: modificationCups.indTimeDiscriminator/*,
        proPaidPower: ''*/
      }
    }

    dispatch(thunkGetPowerCalculation(data, (response) => {
      if (response && response.result.codResult.toString() === '0000') {
        const powerCalculation = response.powerCalculation

        if (powerCalculation) {
          // guardar datos en techData
          dispatch(setTechData({
            ...provisions.techData,
            ...powerCalculation,
            totalBuildingArea: parseFloat(powerCalculation.totalBuildingArea) > 0 ? powerCalculation.totalBuildingArea : provisions.techData.totalBuildingArea
          }))
        }

        setState(1)
      }

      setIsLoading(false)
    }))
  }

  const [saveRequest, setSaveRequest] = useState<number>(0)
  const [showDocManagement, setShowDocManagement] = useState<number>(1)

  useEffect(() => {
    dispatch(thunkGetMasterData('DOSSIER_CONTROL', 'ES', 'SAVE_REQUEST', (response) => {
      if (response) {
        setSaveRequest(parseInt(response[0].value))
      }
    }))
    dispatch(thunkGetMasterData('DOSSIER_CONTROL', 'ES', 'SHOW_DOC', (response) => {
      if (response) {
        setShowDocManagement(parseInt(response[0].value))
      }
    }))
  }, [])

  const waitForBoolean = async(conditionFn: () => boolean) => {
    while(!conditionFn()) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  useEffect(() => {
    if (customersCreated > 0) {

      // Se elimina el docNumber si lo hay de payer
      let customerPayer = provisions.customerPayer
      if (customerPayer.docNumber) {
        delete customerPayer.docNumber
      }

      let telephoneNumber = ''

      if (customerApplicantData.telephone1 && customerApplicantData.telephone1 !== '') {
        telephoneNumber = customerApplicantData.telephone1
      } else if (customerApplicantData.telephone2 && customerApplicantData.telephone2 !== '') {
        telephoneNumber = customerApplicantData.telephone2
      } else {
        telephoneNumber = user.phone
      }

      let defaultContactList = [
        {
          name: customerApplicantData.customerName ? customerApplicantData.customerName : user.name,
          surname1: (customerApplicantData.surname1 && customerApplicantData.surname2) ? (customerApplicantData.surname1 + ' ' + customerApplicantData.surname2) : user.surName,
          valuePhone1: telephoneNumber,
          valueEmail: customerApplicantData.email ? customerApplicantData.email : user.email
        }
      ] as any

      // LLamada al servicio createDossier
      let data = {
        registerDate: getCurrentDate(),
        cadastralRef: provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.refCatastral && (provisions.cadastreData.item.refCatastral.posicion1A7 + '' + provisions.cadastreData.item.refCatastral.posicion8A14 + '' + provisions.cadastreData.item.refCatastral.posicion15A19 + '' + provisions.cadastreData.item.refCatastral.digitoControl1 + '' + provisions.cadastreData.item.refCatastral.digitoControl2),
        dossierStatusId: 'STATUS0001',
        dossierProvince: provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.nombreProvincia && noAccents(provisions.cadastreData.item.domicilioTributario.nombreProvincia),
        idDossierTypeId: provisions.dossierType,
        idDossierSubtype: provisions.dossierSubtype,
        //CUPS
        town: provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.nombreMunicipio && noAccents(provisions.cadastreData.item.domicilioTributario.nombreMunicipio),
        zipcode: provisions.cadastreData && provisions.cadastreData.zipcode,
        rusticLand: provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.tipo && provisions.cadastreData.item.tipo === 'RU' ? '1' : '0',
        streetType: provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.locBienUrbano && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.direccion && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.direccion.tipoVia,
        streetName: provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.locBienUrbano && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.direccion && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.direccion.nombreVia,
        //CATASTRO
        place: provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.nombreMunicipio && noAccents(provisions.cadastreData.item.domicilioTributario.nombreMunicipio),
        num: provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.locBienUrbano && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.direccion && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.direccion.numero1Policia,
        stair: provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.locBienUrbano && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.locInterna && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.locInterna.escalera,
        floor: provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.locBienUrbano && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.locInterna && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.locInterna.planta,
        door: provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.locBienUrbano && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.locInterna && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.locInterna.puerta,
        polygon: provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.locBienRustico && provisions.cadastreData.item.domicilioTributario.locBienRustico.locRustica && provisions.cadastreData.item.domicilioTributario.locBienRustico.locRustica.codPoligono,
        plot: provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.locBienRustico && provisions.cadastreData.item.domicilioTributario.locBienRustico.locRustica && provisions.cadastreData.item.domicilioTributario.locBienRustico.locRustica.codParcelaPoligono,
        techData: provisions.techData,
        cgpInd: '0',
        applicant: provisions.customerApplicant,
        owner: provisions.customerOwner,
        payer: customerPayer,
        deliveryAddress: provisions.deliveryAddress,
        indMail: '1',
        indAceptoFacturaDigital: indAceptoFacturaDigital ? indAceptoFacturaDigital : '0',
        billingEmail: (billingEmail && indAceptoFacturaDigital) ? billingEmail : '',
        selfConsumption: isSelfConsumption ? '1' : '0',
        //INI - MAA - 2023/02/01 - ppm 1008987 - envio del invoiceAddress depende de si se envia o no factura digital
        //invoiceAddress: (validateObjectEmpty(provisions.invoiceAddress)) ? provisions.deliveryAddress : provisions.invoiceAddress,
        //FIN - MAA - 2023/02/01 - ppm 1008987 - envio del invoiceAddress depende de si se envia o no factura digital
        contactList: (provisions.contactList && provisions.contactList[0] && validateObjectEmpty(provisions.contactList[0])) ? defaultContactList : provisions.contactList,
        dossierAction: '',
        revisionTypeMotive: '',
        action_comment: '',
        priorityDate: '',
        statusPrevProposal: '',
        isFehaciente: (datosUser && datosUser.isFehaciente) ? datosUser.isFehaciente : '0',
        indPostalInvoice: ((indAceptoFacturaDigital && indAceptoFacturaDigital === '1') || isDigitalBillingCompany) ? '0' : '1',
        installationOnDeck: (isOnDeck ? 1 : 0)
      } as any

      if (indAceptoFacturaDigital && indAceptoFacturaDigital === '0') {
        if (validateObjectEmpty(provisions.invoiceAddress)) {
          data = {
            ...data,
            invoiceAddress: provisions.deliveryAddress
          }
        }
        else {
          data = {
            ...data,
            invoiceAddress: provisions.invoiceAddress
          }
        }
      }

      if (data.techData) {
        data = {
          ...data,
          techData: {
            ...data.techData,
            installationOnDeck: (isOnDeck ? 1 : 0),
            surfaceType: (fotovoltaicaSuperficie === true ? 2 : fotovoltaicaSuperficie === false ? 1 : 0),
            CC: (typeConexion === 'ENLACE_CC' ? '1' : '0'),
            CDM: (typeConexion === 'ENLACE_CDM' ? '1' : '0'),
            CPM: (typeConexion === 'ENLACE_CPM' ? '1' : '0'),
            CGP: (typeConexion === 'ENLACE_CGP' ? '1' : '0'),
            CGPType: ((CGPSelected === '1' || CGPSelected === '2' || CGPSelected === '3') ? CGPSelected : '3'),
            selfConsumType: typeAutoconsumo,
            ubicationType: (CGPSelected === 'ChangePlace' ? '2' : CGPSelected === 'SamePlace' ? '1' : '0'),
          }
        }
      }

      if (data.techData && data.techData.cups && data.techData.cups !== '') {
        let cups = data.techData.cups ? data.techData.cups : ''

        if (cups && cups !== '') {
          if (cups.substring(cups.length - 2, cups.length) !== '1P') {
            cups = cups + '1P'
          }
        }

        data = {
          ...data,
          techData: {
            ...data.techData,
            cups
          }
        }
      }

      if (provisions.dossierSubtype === 'DOSSUB011' && provisions.finalPs !== '') {
        // suministros de obra
        data = {
          ...data,
          finalPs: provisions.finalPs
        }
      }

      data = {
        ...data,
        deliveryAddress: {
          ...data.deliveryAddress,
          email: (provisions.contactList && provisions.contactList[0] && provisions.contactList[0].valueEmail) ? provisions.contactList[0].valueEmail : ''
        }
      }

      if (provisions.dossierSubtype === 'DOSSUB015') {
        if (provisions && provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario) {
          data = {
            ...data,
            dossierProvince: provisions.cadastreData.item.domicilioTributario.nombreProvincia && noAccents(provisions.cadastreData.item.domicilioTributario.nombreProvincia),
            town: provisions.cadastreData.item.domicilioTributario.nombreMunicipio,
            zipcode: provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.codPostal,
            streetType: provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.direccion.tipoVia,
            streetName: provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.direccion.nombreVia,
            num: provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.direccion.numero1Policia,
            stair: provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.locInterna.escalera,
            floor: provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.locInterna.planta,
            door: provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.locInterna.puerta,
          }
        } else {
          data = {
            ...data,
            dossierProvince: modificationCups.province && noAccents(modificationCups.province),
            town: modificationCups.town,
            zipcode: modificationCups.zipCode,
            streetType: modificationCups.streetType,
            streetName: modificationCups.streetName,
            num: modificationCups.number,
            stair: modificationCups.stair,
            floor: modificationCups.floot,
            door: modificationCups.door
          }

        }

      }

      if (provisions.powerList && provisions.powerList.length > 0) {
        let powerListAux = [] as any

        provisions.powerList.map((item) => {
          let itemAux = {
            ...item,
            requestPower: item.requestPower && (+Number(item.requestPower).toFixed(2)).toString(),
            subtotalPower: item.subtotalPower && (+Number(item.subtotalPower).toFixed(2)).toString()
          }

          return powerListAux.push(itemAux)
        })

        data = {
          ...data,
          powerList: powerListAux
        }
      }

      if (owner || payer || contact) {
        data = {
          ...data,
          indLegalAccept: acceptPrivacy ? '1' : '0'
        }
      }

      if (provisions.cadastreData && provisions.cadastreData.x && provisions.cadastreData && provisions.cadastreData.y) {
        data = {
          ...data,
          coordX: provisions.cadastreData && provisions.cadastreData.x,
          coordY: provisions.cadastreData && provisions.cadastreData.y
        }
      }

      if (Object.keys(provisions.accountingOffice).length > 0) {
        data = {
          ...data,
          accountingOffice: provisions.accountingOffice
        }
      }

      if (Object.keys(provisions.teamManagerOffice).length > 0) {
        data = {
          ...data,
          teamManagerOffice: provisions.teamManagerOffice
        }
      }

      if (Object.keys(provisions.tramitadoraOffice).length > 0) {
        data = {
          ...data,
          tramitadoraOffice: provisions.tramitadoraOffice
        }
      }

      if (provisions.consentThirdAssignmentOwner === '1') {
        data = {
          ...data,
          consentThirdAssignmentOwner: '1'
        }
      }

      if (provisions.consentThirdAssignmentPayer === '1') {
        data = {
          ...data,
          consentThirdAssignmentPayer: '1'
        }
      }

      /* ADN - PPM 1007771 - Reingeniería*/
      data = {
        ...data,
        paymentOnline: {}
      }
      /* Campo payment online*/

      let idDossierAircondTypeAux = provisions.techData.idDossierAircondType
      let idDossierHeatingTypeAux = provisions.techData.idDossierHeatingType

      setLoadingDialogOpen(true)

      const defaultName = t('provisions.defaultName')

      dispatch(thunkCreateProvision(data, async (response) => {
        sessionStorage.removeItem('errorDossierDocumento')
        // TEMPORAL - Guardar datos de la llamada a ZEUS para crear expediente
        if (props.location.pathname === '/provisions/new-generation/steps' && saveRequest === 1) {
          let dossierData = {
            actionType: 'CREATE_DOSSIER',
            document: user.documentNumber,
            dossierCod: response && response.result.codResult && response.result.codResult === '0' ? response.dossier.dossierCod : '',
            information: JSON.stringify(data)
          }

          dispatch(thunkSaveDossierData(dossierData, (response2) => {

          }))
          
        }
        // TEMPORAL - FIN

        if (response && response.result.codResult && response.result.codResult === '0') {
          let currentProvision = response.dossier
          let documentList = []
          let documentListOwner = []
          let documentListPayer = []

          // Añade doucmento Autorización propietario si es necesario
          if (owner && ownerData && ownerData !== null && (window.location.href.includes('new-provision') || window.location.href.includes('edit-installations')  || window.location.href.includes('new-generation'))) {
            let ownerParts = ownerData.nombre.split('_')
            if (ownerParts.length > 3) {
              ownerParts[1] = '021564'
              ownerParts[2] = response.dossier.dossierCod
            }

            if (window.location.href.includes('new-generation')) {
              setOwnerData((prev) => {   
                const newOwnerData = {     
                  ...prev,
                  documentCode: response.dossier.documentList.nSentDocument.find(item => item.documentType === 'DOCTYP0208')?.documentCode,
                  metadatos: [       
                    { nombre: 'codigo_tipo', valor: 'DOCTYP0208' },
                    { nombre: 'cod_expediente', valor: response.dossier.dossierCod }
                  ],    
                  nombre: ownerParts.join('_') }
                  documentList.push(newOwnerData)
                  documentListOwner.push(newOwnerData)
              })
            } else {
              setOwnerData((prev) => {   
                const newOwnerData = {     
                  ...prev,
                  documentCode: response.dossier.documentList.nSentDocument.find(item => item.documentType === 'DOCTYP0343')?.documentCode,
                  metadatos: [       
                    { nombre: 'codigo_tipo', valor: 'DOCTYP0343' },
                    { nombre: 'cod_expediente', valor: response.dossier.dossierCod }
                  ],    
                  nombre: ownerParts.join('_') }
                  documentList.push(newOwnerData)
                  documentListOwner.push(newOwnerData)
              })
            }
          }
          
          // Añade doucmento Autorización pagador si es necesario
          if (payer && payerData && payerData !== null && (window.location.href.includes('new-provision') || window.location.href.includes('edit-installations') || window.location.href.includes('new-generation') || window.location.href.includes('edit-provision'))) {
            let payerParts = payerData.nombre.split('_')
            if (payerParts.length > 3) {
              payerParts[1] = '021564'
              payerParts[2] = response.dossier.dossierCod
            }

            setPayerData((prev) => {
              const newPayerData = {     
                ...prev,
                //documentCode: '', 
                metadatos: [       
                  { nombre: 'codigo_tipo', valor: 'DOCTYP0344' },
                  { nombre: 'cod_expediente', valor: response.dossier.dossierCod }
                ],
                nombre: payerParts.join('_') }
                documentList.push(newPayerData)
                documentListPayer.push(newPayerData)
            })
          }      
          let resultDocuments

          // Update dossier a ZEUS para actualizar documentos Autorización propetario y pagador
          if (payer && owner && (window.location.href.includes('new-provision') || window.location.href.includes('edit-installations') || window.location.href.includes('new-generation'))) {
            const newDocumentUpdate = {     
              ...documentUpdate,
              applicant: {
                docNumber: user.documentNumber,
              },
              documentList: {
                document: documentListOwner,
              },
              dossierCod: response.dossier.dossierCod, 
              email: user.email 
            }
            resultDocuments = await updateDossierDocuments(response.dossier.dossierCod, newDocumentUpdate)
            if (resultDocuments && resultDocuments.result && resultDocuments.result.codResult === '0000') {

              const newDocumentUpdate = {     
                ...documentUpdate,
                applicant: {
                  docNumber: user.documentNumber,
                },
                documentList: {
                  document: documentListPayer,
                },
                dossierCod: response.dossier.dossierCod, 
                email: user.email 
              }

              resultDocuments = await updateDossierDocuments(response.dossier.dossierCod, newDocumentUpdate)
              if (resultDocuments && resultDocuments.result && resultDocuments.result.codResult === '0000') {

                const newDossier = await getDocumentProvision(response.dossier.dossierCod)
                if (newDossier && newDossier.documentList) {
                  currentProvision = {
                    ...currentProvision,
                    documentList: newDossier.documentList
                  }
                }

              } else {
                sessionStorage.setItem('errorDossierDocumento', '1')
              }
            } else {
              sessionStorage.setItem('errorDossierDocumento', '1')
            }

          } else if ((payer && (window.location.href.includes('new-provision') || window.location.href.includes('edit-installations') || window.location.href.includes('edit-provision') || window.location.href.includes('new-generation'))) 
            || (owner && (window.location.href.includes('new-provision') || window.location.href.includes('edit-installations') || window.location.href.includes('new-generation')))
            || (owner && payer && window.location.href.includes('edit-provision'))) {

            const newDocumentUpdate = {     
              ...documentUpdate,
              applicant: {
                docNumber: user.documentNumber,
              },
              documentList: {
                document: documentList,
              },
              dossierCod: response.dossier.dossierCod, 
              email: user.email 
            }

            resultDocuments = await updateDossierDocuments(response.dossier.dossierCod, newDocumentUpdate)
            if (resultDocuments && resultDocuments.result && resultDocuments.result.codResult === '0000') {

              const newDossier = await getDocumentProvision(response.dossier.dossierCod)
              if (newDossier && newDossier.documentList) {
                currentProvision = {
                  ...currentProvision,
                  documentList: newDossier.documentList
                }
              }

            } else {
              sessionStorage.setItem('errorDossierDocumento', '1')
            }
          }

          if (!userRolesArray.includes('US_DOSSIER_CLIENT')) {
            sessionStorage.setItem('userRoles', sessionStorage.getItem('userRoles') + ',US_DOSSIER_CLIENT')

            dispatch(setUserRole(user.roles + ',US_DOSSIER_CLIENT'))
          }

          currentProvision = {
            ...currentProvision,
            idDossierTypeId: provisions.dossierType,
            name: defaultName,
            icon: '',
            techData: {
              ...currentProvision.techData,
              idDossierAircondType: currentProvision.techData.idDossierAircondType === '' ? idDossierAircondTypeAux : currentProvision.techData.idDossierAircondType,
              idDossierHeatingType: currentProvision.techData.idDossierHeatingType === '' ? idDossierHeatingTypeAux : currentProvision.techData.idDossierHeatingType
            }
          }

          dispatch(setCurrentProvision(currentProvision))
          // Se guarda en el estado el dossier activo
          setCurrentProvisionState(currentProvision)
          setCurrentStateProvisionId(currentProvision.dossierCod)

          dispatch(setCurrentProvisionPreparedToSend(true))

          // Se limpia la lista de provisiones
          dispatch(setProvisionsList([]))

          // Se carga la lista con la nueva provision
          dispatch(thunkListDossiers(
            defaultName,
            newOffset, // offset
            20, // limit
            null, // búsqueda por dossierCod,
            false, // proveniente de una busqueda
            (response) => {
              if (response.length !== 0) {
                setNewOffset(newOffset + 1)
              }
            }
          ))

          history.push('/provisions/detail')

          window.scrollTo({
            top: 0,
            left: 0
          })
        } else {
          setLoadingDialogOpen(false)
        }
      })) 
    }
    // eslint-disable-next-line
  }, [customersCreated])

  useEffect(() => {
    if (Object.entries(customerApplicant).length === 0 || Object.entries(customerOwner).length === 0 || Object.entries(customerPayer).length === 0) {
      setCheckEmptyStore(true)
    } else {
      setCheckEmptyStore(false)
    }
  }, [customerApplicant, customerOwner, customerPayer])

  useEffect(() => {
    if (state === 0) {
      if (!(errorCheckTech || isEmptyTech)) {
        //Miramos que la nueva potencia sea más grande que la ultima potencia pagada por promotor
        // if (parseFloat(provisions.techData.totalPower) < parseFloat(provisions.modificationCups.maxAvalaibleVoltage)) {
        //   setInferiorPower(true)
        //   setDisabledButton(false)
        // }
        // else setDisabledButton(false)
        setDisabledButton(false)
      }
      else setDisabledButton(true)
    } else if (state === 1) {
      setDisabledButton(
        errorCheckApplicant ||
        isEmptyApplicant ||
        (
          !acceptPrivacy &&
          (
            owner ||
            payer ||
            contact
          )
        ) ||
        checkEmptyStore ||
        (indAceptoFacturaDigital == '1' && (billingEmail == '' || billingEmail == undefined || !validateMail(billingEmail))) ||
        ((window.location.href.includes('new-provision') || window.location.href.includes('edit-installations')) && !declareDocumentValidOwner) 
        || ((window.location.href.includes('new-provision') || window.location.href.includes('edit-installations') || window.location.href.includes('edit-provision')) && !declareDocumentValidPayer)
      )
    } else if (state === 2) {
      setDisabledButton(true)
    }
  }, [owner, payer, contact, state, checkEmptyStore, errorCheckTech, isEmptyTech, errorCheckApplicant, isEmptyApplicant, acceptPrivacy, billingEmail, indAceptoFacturaDigital, declareDocumentValidOwner, declareDocumentValidPayer])

  /* --- Use effect para mover de estado de datos técnicos --- */
  useEffect(() => {
    if (state >= 3 && currentProvisionState && currentProvisionState.dossierStatusId && (!preparedToSend || (currentProvisionState.idDossierSubtype === 'DOSSUB015'))) {
      setDocumentDossierStatus(true)
    }
  }, [state, currentProvisionState, preparedToSend])

  useEffect(() => {
    if (currentProvision.applicant && currentProvision.invoiceAddress) {
      if (currentProvision.applicant.zipcode !== currentProvision.invoiceAddress.zipcode) {
        setBillDirection(true)
      }
    }

    if (currentProvision.contactList && currentProvision.contactList.length > 0) {
      if (currentProvision.contactList.length > 1 || currentProvision.applicant.customerName !== currentProvision.contactList[0].name || currentProvision.applicant.telephone1 !== currentProvision.contactList[0].valuePhone1) {
        setContact(true)
      }
    }
  }, [currentProvision])

  const updateDossierDocuments = (dossierCod: string, newDocumentUpdate: any): Promise<any> => {
    return new Promise((resolve) => {
      dispatch(thunkUpdateDossier(dossierCod, true, newDocumentUpdate, (response) => {
        resolve(response)
      }))
    })
  }

  const getDocumentProvision = (dossierCod: string): Promise<any> => {
    return new Promise((resolve) => {
      dispatch(thunkGetProvision(dossierCod, user.documentNumber, (response) => {
        resolve(response)
      }))
    })
  }

  return (
    <>
      <Dialog className={classes.dialog} open={showDialog} onClose={handleCloseDialog}>
        <DialogContent className={classes.dialogContainer}>
          <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleCloseDialog} />

          <Grid container className={classes.noItems}>
            <Grid item>
              <Grid container>
                <Grid item xs={12} sm={12} md={12} className={classes.alertBlock}>
                  <img src={InfoIcon} className={classes.alertIcon} alt='' />
                </Grid>
                <Grid container className={classes.text}>
                  {//ppm 1007821 - inicio}
                  }
                  {dialogText}
                  {/* {t('provisions.newProvision.requestData.supplyType.form.errors.powerError')} */}
                  {//ppm 1007821 - FIN}
                  }
                </Grid>
                <Grid container className={classes.text}>
                  {t('provisions.newProvision.requestData.supplyType.form.errors.powerError2')}
                </Grid>
                <Grid container className={classes.textBold}>
                  {t('provisions.newProvision.requestData.supplyType.form.errors.powerError3')}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Grid container className={classes.container}>
        <Grid item className={classes.maxWidthForBigScreens}>
          {
            isLoading &&
            <Spinner fixed={true} />
          }

          <ReturnDialog
            open={returnDialogOpen}
            closeFunction={() => setReturnDialogOpen(false)}
            setRequestDataCompleted={setRequestDataCompleted}
            currentPetition={props.location.pathname.split('/')[2]}
            setState={setState}
          />
          <LoadingDialog
            isLoading={loadingDialogOpen}
            timeout={createDossierTimeout}
            handleReturn={() => setLoadingDialogOpen(false)}

          />
          <InferiorPowerDialog
            inferiorPower={inferiorPower}
            handleReturn={() => setInferiorPower(false)}
            supply={supply}
          />

          {/* <TituloHabilitante location={1} /> */}

          <>
            {
              (preparedToSend && state !== 4 && state !== 5) &&
              <Confirmation dossierCod={currentStateProvisionId} setState={setState}/>
            }
            {
              (documentDossierStatus) &&
              <>
                {
                  (showMessage) &&
                  <ShowMessage
                    title={messageTitle}
                    subtitle={messageSubtitle}
                  />
                }
                {
                  (provisions.dossierType === 'DOSTYP002' && showDocManagement === 1) ?
                    <DocumentationNewGeneration
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                      state={state}
                      setState={setState}
                      showDocOnCancelDossier={showDocOnCancelDossier}
                      blockerDocumentsList={blockerDocumentsList}
                      indAceptoFacturaDigital={indAceptoFacturaDigital}
                      setIndAceptoFacturaDigital={setIndAceptoFacturaDigital}
                    />
                    :
                    (provisions.dossierType === 'DOSTYP002' && showDocManagement === 0) ?
                      <Grid item className={classes.fullWidth}>
                        <ExpansionPanel defaultExpanded>
                          <ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
                            <img className={classes.expansionPanelSummaryIcon} src={DocumentIcon} alt='' />
                            <Typography className={classes.expansionPanelSummaryText}>{t('provisions.documentation.panelTitle')}</Typography>
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails>
                            <Grid container justifyContent='center' alignItems='center' className={classes.disabledDocAdviseContainer}>
                              <Grid item md={11} sm={10} xs={12} className={classes.disabledDocAdviseTitle}>
                                {t('provisions.documentation.disabled')}
                              </Grid>
                            </Grid>
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                      </Grid>
                      :
                      <Documentation
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        state={state}
                        setState={setState}
                        blockerDocumentsList={blockerDocumentsList}
                        showDocOnCancelDossier={showDocOnCancelDossier}
                        setIsLoadingGlobal={setIsLoadingGlobal}
                      />

                }
              </>
            }
          </>

          {
            provisions.dossierType === 'DOSTYP001' && (
              provisions.dossierSubtype !== 'DOSSUB015' ?
                <NewProvisionData
                  provisions={provisions}
                  state={state}
                  setErrorCheck={setErrorCheckTech}
                  setIsEmpty={setIsEmptyTech}
                  setIsLoading={setIsLoading}
                  setShowDialog={setShowDialog}
                  setDialogText={setDialogText}
                />
                :
                <EditProvisionData
                  provisions={provisions}
                  state={state}
                  notNecessary={notNecessary}
                  setNotNecessary={setNotNecessary}
                  setErrorCheck={setErrorCheckTech}
                  setIsEmpty={setIsEmptyTech}
                  setIsLoading={setIsLoading}
                  setShowDialog={setShowDialog}
                  setDialogText={setDialogText}
                  inferiorPower={inferiorPower}
                  setInferiorPower={setInferiorPower}
                />
            )
          }

          {
            provisions.dossierType === 'DOSTYP002' &&
            <NewGenerationData
              provisions={provisions}
              state={state}
              notNecessary={notNecessary}
              setNotNecessary={setNotNecessary}
              setErrorCheck={setErrorCheckTech}
              setIsEmpty={setIsEmptyTech}
              setShowDialog={setShowDialog}
              setDialogText={setDialogText}
              autoconsumo={autoconsumo}
              generaCogen={generaCogen}
              isOnDeck={isOnDeck}
              fotovoltaicaSuperficie={fotovoltaicaSuperficie}
              typeAutoconsumo={typeAutoconsumo}
              typeConexion={typeConexion}
              CGPSelected={CGPSelected}
            />
          }

          {
            provisions.dossierType === 'DOSTYP003' &&
            <EditInstallationsData
              provisions={provisions}
              state={state}
              setErrorCheck={setErrorCheckTech}
              setIsEmpty={setIsEmptyTech}
              setIsLoading={setIsLoading}
            />
          }

          {
            state >= 1 &&
            <ExpansionPanel defaultExpanded={state < 2}>

              <ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
                <img className={classes.expansionPanelSummaryIcon} src={ApplicantDataIcon} alt='' />

                <Typography className={classes.expansionPanelSummaryText}>{t('provisions.newProvision.requestData.supplyType.dataType.applicantData')}</Typography>
              </ExpansionPanelSummary>

              <ExpansionPanelDetails>
                <ApplicantData
                  state={state}
                  newCustomers={newCustomers}
                  setNewCustomers={setNewCustomers}
                  setIsEmpty={setIsEmptyApplicant}
                  setErrorCheck={setErrorCheckApplicant}
                  acceptPrivacy={acceptPrivacy}
                  setAcceptPrivacy={setAcceptPrivacy}
                  isDigitalBillingCompany={isDigitalBillingCompany}
                  setIsDigitalBillingCompany={setIsDigitalBillingCompany}
                  owner={owner}
                  setOwner={setOwner}
                  payer={payer}
                  setPayer={setPayer}
                  billDirection={billDirection}
                  setBillDirection={setBillDirection}
                  contact={contact}
                  setContact={setContact}
                  datosUser={datosUser}
                  indAceptoFacturaDigital={indAceptoFacturaDigital}
                  setIndAceptoFacturaDigital={setIndAceptoFacturaDigital}
                  billEmail={billEmail}
                  setBillEmail={setBillEmail}
                  billingEmail={billingEmail}
                  setbillingEmail={setBillingEmail}
                  declareDocumentValidOwner={declareDocumentValidOwner}
                  setDeclareDocumentValidOwner={setDeclareDocumentValidOwner}
                  declareDocumentValidPayer={declareDocumentValidPayer}
                  setDeclareDocumentValidPayer={setDeclareDocumentValidPayer}
                  ownerData={ownerData}
                  setOwnerData={setOwnerData}
                  payerData={payerData}
                  setPayerData={setPayerData}
                />
              </ExpansionPanelDetails>

            </ExpansionPanel>
          }
          {
            state < 2 &&
            <Grid container justifyContent='center'>
              {
                !notNecessary &&
                <p className={classes.compulsoryMessage}>{t('provisions.newProvision.requestData.supplyType.form.compulsoryFields')}</p>
              }
              <Grid container direction='row' justifyContent='center' >
                <Button
                  className={`${classes.button} ${classes.cancelButton}`}
                  text={t('common.buttons.return')}
                  color='inherit'
                  size='large'
                  variant='outlined'
                  onClick={handleCancelButton}
                />
                {
                  notNecessary ?
                    <Button
                      className={classes.button}
                      text={t('common.buttons.finish')}
                      color='primary'
                      size='large'
                      variant='contained'
                      onClick={handleFinishButton}
                    />
                    :
                    <Button
                      className={classes.button}
                      text={t('common.buttons.accept')}
                      color='primary'
                      size='large'
                      variant='contained'
                      disabled={disabledButton}
                      onClick={updateState}
                    />
                }
              </Grid>
            </Grid>
          }
        </Grid>
      </Grid>
    </>
  )
}

export default withRouter(RequestData)