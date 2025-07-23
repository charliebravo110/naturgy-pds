import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Grid from '@material-ui/core/Grid'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Typography from '@material-ui/core/Typography'

import RequestDataWelcome from './request-data/RequestData'

import RequestData from '../../request-data/RequestData'
import BudgetSolutionAccessNew from '../../budget/BudgetSolutionAccessNew'
import Payment from '../../payment/Payment'
import DoublePayment from '../../double-payment/DoublePayment'
import ProcessingInfo from '../../processing-info/ProcessingInfo'
import JobExecution from '../../job-execution/JobExecution'
import ApplicationClosure from '../../application-closure/ApplicationClosure'

import AlertIcon from '../../../../assets/icons/aviso_alerta_pop_up.svg'

import { setDossierType, setDossierSubtype } from '../../../store/actions/ProvisionsActions'
import { thunkExpedientForm, thunkGetMasterData, thunkUpdateDossier } from '../../../store/actions/ProvisionsThunkActions'
import { setCurrentProvision } from '../../../store/actions/ProvisionsActions'
import Spinner from '../../../../common/components/spinner/Spinner'
import { adminCheck } from '../../../../common/lib/ValidationLib'
import { setUrlMessagesDetail, setUrlMessagesDossierDataDossier, setUrlMessagesDossierDataPanel, setUrlMessagesDossierDataPanelEnablement  } from '../../../../common/components/send-url/store/actions/UrlMessagesActions'

import useStyles, {
  ExpansionPanel,
  ExpansionPanelSummary,
  StyledExpandMoreIcon,
  ExpansionPanelDetails
} from './Steps.styles'

// LCS: Importa la función - Wave 2
import { getExpStatus, sendGAEvent, removeEmails } from '../../../../core/utils/gtm'

const Steps = (props: any) => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))
  const dispatch = useDispatch()
  const[sentToAtom, setSentToAtom] = useState(false)

  const { preparedToSend, viewsTabValue } = props

  function getSteps() {
    if (propPrev) {
      return [
        t('provisions.newProvision.keepInMind.steps.requestData'),
        t('provisions.newProvision.keepInMind.steps.connectionSolution'),
        t('provisions.newProvision.keepInMind.steps.payment'),
        t('provisions.newProvision.keepInMind.steps.processing'),
        t('provisions.newProvision.keepInMind.steps.requestExecution'),
        t('provisions.newProvision.keepInMind.steps.requestClose')
        //'Datos de la Solicitud', 'Propuesta previa', 'Pago', 'Ejecución de la Solicitud', 'Cierre de la Solicitud'
      ]
    } else {
      return [
        t('provisions.newProvision.keepInMind.steps.requestData'),
        t('provisions.newProvision.keepInMind.steps.budget'),
        t('provisions.newProvision.keepInMind.steps.payment'),
        t('provisions.newProvision.keepInMind.steps.processing'),
        t('provisions.newProvision.keepInMind.steps.requestExecution'),
        t('provisions.newProvision.keepInMind.steps.requestClose')
        //'Datos de la Solicitud', 'Presupuesto', 'Pago', 'Ejecución de la Solicitud', 'Cierre de la Solicitud'
      ]
    }
  }

  // NUEVOS ESTADOS DE UN EXPEDIENTE: PDTE REVISION Y PDTE SUBSANACION
  const statusPendingSubsan = 'STATUS0101'
  const statusPendingReview = 'STATUS0100'

  const statusInadmitido = 'STATUS0102'

  const statePpPdteDefinition = 'PREPRCOD1'
  const statePpInRevision = 'PREPRCOD3'
  const statePpPdteAceptation = 'PREPRCOD2'

  const statePpPdteAceptationAfterReview = 'PREPRCOD4'
  const statePpAcepted = 'PREPRCOD5'
  const statePpPaid10 = 'PREPRCOD6'
  const statePpFirmadaCobrada = 'PREPRCOD7'

  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)
  const procedures = useSelector((state: any) => state.provisions.currentProvision.procedures)
  const dossierType = useSelector((state: any) => state.provisions.dossierType)
  const activitiesList = useSelector((state: any) => state.provisions.currentProvision.activitiesList)
  const user = useSelector((state: any) => state.user.profile)

  const dossierSubtype = useSelector((state: any) => state.provisions.dossierSubtype)
  const provisions = useSelector((state: any) => state.provisions)
  const statusPrevProposal = useSelector((state: any) => state.provisions.currentProvision.statusPrevProposal)

  const clientDossierPanel = useSelector((state: any) => state.urlMessages.clientDossierPanel)

  const [autoconsumo] = useState(dossierSubtype === 'DOSSUB000')
  const [generaCogen, setGeneraCogen] = useState(false)

  const classes = useStyles({})
  const { t } = useTranslation()

  const [ state, setState ] = useState(0)
  const [ activeStep, setActiveStep ] = useState(0)
  const [ requestDataCompleted, setRequestDataCompleted ] = useState(false)
  const [ acceptedBudget, setAcceptedBudget ] = useState(false)
  const [ paymentDoneBudget, setPaymentDoneBudget ] = useState(false)
  const [paymentQueryExecuting, setPaymentQueryExecuting] = useState(false)

  const [indAceptoFacturaDigital, setIndAceptoFacturaDigital] = useState(provisions.currentProvision.indAceptoFacturaDigital)
  const billemail = useSelector((state: any) => provisions.currentProvision.billingEmail)
  const [billingEmail, setBillingEmail] = useState(billemail)

  const [ thereArePendingDocuments, setThereArePendingDocuments ] = useState(false)
  const [ firstLoad, setFirstLoad ] = useState(true)

  const [ showDocOnCancelDossier, setShowDocOnCancelDossier ] = useState(false)
  const [ isNewGeneration ] = useState(true)
  const [ isPendingReview, setIsPendingReview ] = useState(false)
  const [ isPendingSubsanation, setIsPendingSubsanation ] = useState(false)
  const [ isSecondSubsanation, setIsSecondSubsanation ] = useState(false)
  const [ blockerDocumentsList, setBlockerDocumentsList ] = useState([] as any)
  const [ blockedByDocument, setBlockedByDocument ] = useState([] as any);
  const [ clickOnFinishInstall, setClickOnFinishInstall ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)
  const [ showErrorDialog, setShowErrorDialog ] = useState(false);
  const [ propPrev, setPropPrev ] = useState(true);
  const [ baremos, setBaremos ] = useState({ isBaremo: false, isBaremoAnticip: false , isRetranqueo: false })
  const [ actualProcedure, setActualProcedure ] = useState<any>({})
  const [ formalities, setFormalities ] = useState([])
  const [ pendingProcedures, setPendingProcedures ] = useState(false)
  
  const steps = getSteps()

  const [filteredMilestoneList, setFilteredMilestoneList] = useState([] as any)

  const milestoneList = useSelector((state: any) => state.provisions.currentProvision.milestoneList)

  const hitoTypeCobroIni = '4'
  const hitoTypeOtro = '6'

  useEffect(() => {

    if (milestoneList !== undefined && milestoneList.length > 0) {
      milestoneList.sort(function (a, b) {
        return a.agreeMilestonePayNum - b.agreeMilestonePayNum
      })
      filterMilestones(milestoneList)
    }

  }, [currentProvision])

  useEffect (() => {
    // LCS: Enviar evento de GdC a GA - Wave 2
    sendGAEvent({
      event: 'view',
      content_group: 'nueva conexion a la red',
      page_url: removeEmails(window.location.href),
      user_id: sessionStorage.getItem('id'),
      previous_path: removeEmails(sessionStorage.getItem("previousPage")),
      user_type: sessionStorage.getItem('user_type'),
      browsing_type: sessionStorage.getItem('browsing_type'),
      element_type: 'medicion de pagina',
      ga_client_id: sessionStorage.getItem('ga_client_id'),
      cups: 'no aplica',
      supply_type: 'no aplica'
    });
    sessionStorage.setItem("previousPage", window.location.href);
  },[])

  // //  MILTYPE004      Cobro inicial
  // //  MILTYPE005      Fecha
  // //  MILTYPE006      Otro

  // //  MILSTAT099      Ficticio
  // //  MILSTAT001      Pendiente  -> Cobro Inicial, Otros
  // //  MILSTAT002      Pendiente de cobro -> Cobro Inicial
  // //  MILSTAT003      Pendiente de factura -> Otros
  // //  MILSTAT004      Cobrado -> Cobro Inicial
  // //  MILSTAT005      Facturado -> Otros

  const filterMilestones = (mList) => {
    const filteredMilestoneList = mList.filter((milestone) => {
      if (milestone.milestoneTypeId === hitoTypeCobroIni || milestone.milestoneTypeId === hitoTypeOtro) {
        return milestone
      }
    })

    setFilteredMilestoneList(filteredMilestoneList)
  }

  // Funcion para diferenciar, dentro del estado 'Ejecución', el pseudoestado 'Tramitación' o 'Ejecución'
  const isProcessingOrExecution = () => {
    if (actualProcedure && actualProcedure.expedienteEstado && formalities.length > 0) {
      if (((actualProcedure.expedienteEstado === 'PLANIFICADO') || (actualProcedure.expedienteEstado === 'EN CURSO' && !actualProcedure.fObraEjecutableReal)) && formalities && formalities.length > 0) {
        setState(7) //Panel tramitación
      }
      else {
        setState(8) //Panel ejecucion
      }
    } else {
      setState(8) //Panel ejecucion
    }
    //setState(7) // para realizar pruebas como si estuviera en estado planificado
  }

 //Cargar los documentos bloqueantes para expedientes en estado "Cobrado"
  useEffect(() => {
    if ((Object.entries(currentProvision).length !== 0) && (currentProvision.documentList != null) &&
      (Object.entries(currentProvision.documentList).length !== 0)) {
      dispatch(thunkGetMasterData('DOC_BLOQUEANTE_EN_EJECUCION', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), null, (response) => {
        if (response) {
          let auxResponse = [] as any

          response.map((item, index) => {
            return auxResponse.push(item)
          })
          setBlockerDocumentsList(auxResponse)
        }
      }))
    }
    let isBaremo = false
    //Comprobar si es un expediente con Baremo y de Consumo
    if ((provisions && provisions.currentProvisionScaleInd != null) &&
      (currentProvision.idDossierTypeId != null)) {
      if ((provisions.currentProvisionScaleInd === '1') &&
        (currentProvision.idDossierTypeId === 'DOSTYP001')) {
        isBaremo = true
      }
    }
    let isBaremoAnticip = false
    let isRetranqueo = false

    if (currentProvision) {
      if (currentProvision.idDossierTypeId != null) {
        isRetranqueo = currentProvision.idDossierTypeId === 'DOSTYP003'
      }
      if (currentProvision.communicationList &&
        currentProvision.communicationList.length > 0) {

        let comTypBaremoAnt = 'COMTYP292'

        currentProvision.communicationList.map((item, index) => {

          if (item.communicationStatusCod && item.idCommunicationType) {
            const idCommunicationType = (item.idCommunicationType === comTypBaremoAnt)

            let idCommunicationTypeCods = [comTypBaremoAnt]

            if (idCommunicationType && idCommunicationTypeCods.includes(item.idCommunicationType)) {
              isBaremoAnticip = true
            }
          }

        })
      }
    }
    setBaremos({
      isBaremo: isBaremo,
      isBaremoAnticip: isBaremoAnticip,
      isRetranqueo: isRetranqueo
    })

    if (isBaremo || isBaremoAnticip || isRetranqueo) {
      setPropPrev(false)
    }
    // eslint-disable-next-line  
  }, [currentProvision])

  //Obtener  fecha de prelacion y primera o segunda subsanacion
  useEffect(() => {
    if (activitiesList && activitiesList.length !== 0) {

      let secondSubsan = false
      let date = ''
      let foundStatusAbierto = false
      let foundStatusPdteSubsan = (activitiesList[activitiesList.length - 1].dossierStatusId === statusPendingSubsan)


      for (let i = (activitiesList.length - 1); i > -1; i--) {
        if (foundStatusAbierto) {
          if (date === '') {
            if (activitiesList[i].dossierStatusId === 'STATUS0003') {
              date = activitiesList[i].activityDate
            }
          }

        } else {
          if (activitiesList[i].dossierStatusId === 'STATUS0010') {
            foundStatusAbierto = true
          }
        }

        if (foundStatusPdteSubsan) {
          if (i > 0 && !secondSubsan) {
            if ((activitiesList[i].dossierStatusId !== statusPendingSubsan) &&
              (activitiesList[i - 1].dossierStatusId === statusPendingSubsan)) {
              secondSubsan = true
              setIsSecondSubsanation(secondSubsan)
            }
          }
        }
      }
    }
    // eslint-disable-next-line
  }, [activitiesList])

  // Si no hay una provision vigente ni un tipo de dossier se redirige
  useEffect(() => {
    (Object.entries(currentProvision).length === 0 && dossierType === '') && props.history.push('/provisions')
    // eslint-disable-next-line
  }, [currentProvision])

  // Se asignan el tipo y subtipo de dossier si hay uno vigente
  useEffect(() => {
    if (Object.entries(currentProvision).length !== 0) {
      dispatch(setDossierType(currentProvision.idDossierTypeId))

      dispatch(setDossierSubtype(currentProvision.idDossierSubtype))
    }
    // eslint-disable-next-line
  }, [currentProvision])

  // Se cambia el current step a base del state
  useEffect(() => {
    if (state <= 3) {
      setActiveStep(0)
    } else if (state === 4 || state === 5) {
      setActiveStep(1)
    } else if (state === 6) {
      setActiveStep(2)
    } else if (state === 7) {
      setActiveStep(3)
    } else if (state === 8) {
      setActiveStep(4)
    } else if (state === 9) {
      setActiveStep(5)
    }
  }, [state])

  // Comprobar si ya hay un dossier en activo
  useEffect(() => {
    if (Object.entries(currentProvision).length !== 0 && currentProvision.dossierStatusId !== 'STATUS0001') {
      setState(2)

      setRequestDataCompleted(true)

      setThereArePendingDocuments(currentProvision.documentList && currentProvision.documentList.nSentDocument && currentProvision.documentList.nSentDocument.length > 0)

      switch (currentProvision.dossierStatusId) {
        //Exp Pdte Revision
        case statusPendingReview:
          setIsPendingReview(true)
          break
        //Exp Pdte Subsanación
        case statusPendingSubsan:
          setIsPendingSubsanation(true)
          break
        //Exp Denegado, Cancelado, Inadmitido, Fuera de plazo, Cerrado o Anulado
        case 'STATUS0094':  //Denegado
        case 'STATUS0098':  //Cancelado
        case statusInadmitido:  //Inadmitido
        case 'STATUS0096':  //Fuera de plazo
        case 'STATUS0099':  //Cerrado
        case 'STATUS0004':  //Anulado
          setShowDocOnCancelDossier(true)
          break
      }

      if (props.location.pathname === '/provisions/detail' && currentProvision.dossierStatusId === 'STATUS0003') {
        setState(3)
      } else if (currentProvision.dossierStatusId === statusPendingReview
        || currentProvision.dossierStatusId === statusPendingSubsan
        || currentProvision.dossierStatusId === 'STATUS0094'
        || currentProvision.dossierStatusId === 'STATUS0098'
        || currentProvision.dossierStatusId === statusInadmitido) {
        setState(3)
      } else if (currentProvision.dossierStatusId === 'STATUS0010' || currentProvision.dossierStatusId === 'STATUS0012') {
        // setState(4)
        //switch (currentProvision.statusPrevProposal)  {
        switch (statusPrevProposal) {

          case statePpPdteDefinition:
            setState(5) //Panel Prop previa/Presupuesto - Mensaje NobudgetSolution
            break
          case statePpInRevision:
            setState(5) //Panel Prop previa/Presupuesto
            break
          case statePpFirmadaCobrada:
            isProcessingOrExecution() //Panel tramitación/ejecucion
            // setState(8) //Panel ejecucion
            break
          case statePpAcepted:  //revisar
            setState(5) //Panel Prop previa/Presupuesto
            break
          default:
            setState(4)
            break
        }
      } else if (currentProvision.dossierStatusId === 'STATUS0014' && !acceptedBudget) {
        //switch (currentProvision.statusPrevProposal)  {
        switch (statusPrevProposal) {
          case statePpPdteDefinition:
            setState(5) //Panel Prop previa/Presupuesto
            break
          case statePpInRevision:
          case statePpPdteAceptationAfterReview:
          case statePpPdteAceptation:
            setState(5) //Panel Prop previa/Presupuesto
            break
          case statePpFirmadaCobrada:
            isProcessingOrExecution() //Panel tramitación/ejecucion
            // setState(8) //Panel Ejecucion
            break
          case statePpPaid10:
            setState(6) //Panel pago
            break
          default:
            setState(5)
            break
        }
      } else if (currentProvision.dossierStatusId === 'STATUS0014' && acceptedBudget) {
        switch (statusPrevProposal) {
          case statePpPdteDefinition:
            setState(5) //Panel Prop previa/Presupuesto
            break
          case statePpInRevision:
          case statePpPdteAceptationAfterReview:
          case statePpPdteAceptation:
            setState(5) //Panel Prop previa/Presupuesto
            break
          case statePpFirmadaCobrada:
            isProcessingOrExecution() //Panel tramitación/ejecucion
            // setState(8) //Panel Ejecucion
            break
          case statePpAcepted:
            setState(6) //Panel pago
            break
          case statePpPaid10:
            setState(6) //Panel pago
            break
          default:
            setState(6)
            break
        }
      } else if (currentProvision.dossierStatusId === 'STATUS0040' || currentProvision.dossierStatusId === 'STATUS0072' || currentProvision.dossierStatusId === 'STATUS0078') {
        isProcessingOrExecution() //Panel tramitación/ejecucion
        // setState(8)
      } else if (currentProvision.dossierStatusId === 'STATUS0099') {
        setState(9)
      }
      // FSP- CAMBIO PARA QUE PUEDAN VERSE EN PORTAL EXPED CREADOS DESDE ZEUS EN ESTADO=ALTA   
    } else if (currentProvision.dossierStatusId === 'STATUS0001' && currentProvision
      && currentProvision.dossierCod && currentProvision.dossierCod !== '') {
      setState(3)
    }

  // eslint-disable-next-line

  }, [ currentProvision, acceptedBudget, actualProcedure, formalities ])

  const [expandedPanel, setExpandedPanel] = useState('')

  const handleChangeExpandedPanel = (panel: any) => (event, newExpandedPanel) => {
    setExpandedPanel(newExpandedPanel ? panel : '')
    sendGAEventExpansion(panel)
  }

  useEffect(() => {
    let panel

    if (thereArePendingDocuments && state === 8 && blockedByDocument.length < 1) {
      panel = 'panel5'
      
    } else if (firstLoad && (state <= 3)) {
      panel = 'panel1'
    } else if (thereArePendingDocuments) {
      setFirstLoad(false)

      //Aunque haya documentos pendientes, se depligue el panel de Presupuesto/Pago para expedientes en estado Valorado
      switch (state) {
        case 4:
          if (currentProvision.dossierStatusId) {
            if (statusPrevProposal === statePpPdteDefinition || statusPrevProposal === statePpInRevision ||
              statusPrevProposal === statePpAcepted) {
              panel = 'panel2'
            }
          }
          break
        case 5:
          panel = 'panel2'
          break
        case 6:
          panel = 'panel3'
          break
        case 7:
          panel = 'panel4'
          break
        default: 
          panel = 'panel1'
      }
    } else if (state === 4 || state === 5) {
      panel = 'panel2'
    } else if (state === 6) {
      panel = 'panel3'
    } else if (state === 7) {
      panel = 'panel4'
    } else if (state === 8) {
      panel = 'panel5'
    } else if (state === 9) {
      panel = 'panel6'
    } else {
      panel = ''
    }

    // PPM 1007560 si el cliente accede mediante url de correo/sms se expande el panel indicado en la url de dicho correo/sms
    setExpandedPanel((clientDossierPanel && clientDossierPanel !== '') ? clientDossierPanel : panel)

    // eslint-disable-next-line
  }, [state, blockerDocumentsList])

  const checkBlockStep4 = () => {
    let arrayBlockedDocs = [];
    if (currentProvision.dossierStatusId === 'STATUS0040' || currentProvision.dossierStatusId === 'STATUS0072' || currentProvision.dossierStatusId === 'STATUS0078') {
      blockerDocumentsList.forEach(blockedDoc => {
        if (undefined !== currentProvision.documentList.nSentDocument) {
          currentProvision.documentList.nSentDocument.forEach(doc => {
            if (blockedDoc.key === doc.documentType && doc.statusId === 'DOCSTA0005') {
              if (arrayBlockedDocs.length === 0) {
                arrayBlockedDocs.push(blockedDoc.value);
              } else {
                arrayBlockedDocs.push(', ' + blockedDoc.value);
              }
            }
          });
        }
      });
    }
    setBlockedByDocument(arrayBlockedDocs);
  }

  useEffect(() => {
    checkBlockStep4();
  }, [blockerDocumentsList])

  //Actualizar expediente se se ha pulsado boton "Comunica instalacion"
  const handleFinishedInstallation = () => {
    setIsLoading(true)
    setClickOnFinishInstall(true)

    const data = {
      dossierCod: currentProvision.dossierCod,
      applicant: {
        docNumber: user.documentNumber
      },
      cgpInd: '1'
    }

    dispatch(thunkUpdateDossier(currentProvision.dossierCod, false, data, (response) => {
      if (response && response.result && (response.result.codResult === '0' || response.result.codResult === '0000')) {
        let provision = currentProvision

        if (response.dossier && response.dossier.dossierCod) {
          provision = {
            ...provision,
            ...response.dossier,
            dossierStatusId: response.dossier.dossierStatusId,
            valoration: provision.valoration,
            techData: provision.techData
          }

          dispatch(setCurrentProvision(provision))
        }
      } else {
        setShowErrorDialog(true);
      }
      setIsLoading(false)
    }))
  }

  const handleSendSelfJobsEndDate = (date, errorDirection) => {
    setIsLoading(true);
    setClickOnFinishInstall(true);

    const totalSupplies = currentProvision.powerList.reduce(
      (sum, item) => sum + (parseInt(item.numberOfSupplies, 10 )|| 0),
      0
    );

    const splittedDate = date.split('/');
    //const selfJobsEndDate = splittedDate[2] + splittedDate[1] + splittedDate[0] + '000000';

    const [datePart, timePart] = date.split(' ');
    const [day, month, year] = datePart.split('/');
    const timeFormatted = timePart.replace(/:/g, '');
    const selfJobsEndDate = `${year}${month}${day}${timeFormatted}`;

    const dossierData = {
      dossierCod: currentProvision.dossierCod,
      applicant: {
        docNumber: user.documentNumber
      },
      fechaFinTrabajosPropios: selfJobsEndDate,
      tr9AdminResult: errorDirection ? '4' : totalSupplies === 1 ? '1' : '3'
    }

    dispatch(thunkUpdateDossier(currentProvision.dossierCod, false, dossierData, (response) => {
      if (response && response.result && (response.result.codResult === '0' || response.result.codResult === '0000')) {
        let provision = currentProvision;

        if (response.dossier && response.dossier.dossierCod) {
          provision = {
            ...provision,
            ...response.dossier,
            dossierStatusId: response.dossier.dossierStatusId,
            valoration: provision.valoration,
            techData: provision.techData
          }

          dispatch(setCurrentProvision(provision));
        }
      } else {
        setShowErrorDialog(true);
      }
      setIsLoading(false);
    }));
  }

  const handleSendExp = async (openingDate, endDate, attempts, userDoc, expedientType, busZeusAttempts, tr9callOK, errorDirection ) => {
    const [datePart, timePart] = endDate.split(' ');
    const [day, month, year] = datePart.split('/');
    const timeFormatted = timePart.replace(/:/g, '');

    const selfJobsEndDate = `${year}${month}${day}${timeFormatted}`;

    const totalSupplies = currentProvision.powerList.reduce(
      (sum, item) => sum + (parseInt(item.numberOfSupplies, 10 )|| 0),
      0
    );

    let continueCall = false
    
    for (let i = 1; i <= attempts + 1; i++) {
      const sentData = {
        expedientId: currentProvision.dossierCod,
        attempts: i,
        openingDate: openingDate,
        installationEndDate: selfJobsEndDate,
        activationUSer: errorDirection ? '4' : totalSupplies === 1 ? '1' : '3',
        busZeusAttempts: busZeusAttempts,
        sentToAtom: tr9callOK,
        expedientType: expedientType
      }

      await dispatch(thunkExpedientForm(sentData, (response) => { continueCall = true }))
    }

    return continueCall
}

  // En caso de que el servicio listProcedures retorne más de un registro para un mismo id de expediente, 
  // deberemos obtener el primero de ellos que será el más reciente, dado que por defecto el servicio los ordena por fecha de creación descendiente (procedures[0])
  useEffect(() => {
    if (procedures && procedures.length > 0) {
      const auxProcedure = procedures[0]
      setActualProcedure(auxProcedure)
    }
  }, [ procedures ])

  // Filtramos el listado de trámites recibido de Lizentia para deshacernos de los que tengan los siguientes estados
  useEffect(() => {
    if (actualProcedure && actualProcedure.tramites && actualProcedure.tramites.length > 0) {
      const filteredFormalities = actualProcedure.tramites.filter((tramite, i) => {
        if (tramite.tramiteEstado === 'FINALIZADO' ||
            tramite.tramiteEstado === 'EN CURSO' ||
            tramite.tramiteEstado === 'VALIDADO' ||
            tramite.tramiteEstado === 'PLANIFICADO') {
              return tramite
        }
      })
      if (filteredFormalities.length > 0) {
        setFormalities(filteredFormalities)
      }
    }    
  }, [ actualProcedure ])

  useEffect(() => {
    if (actualProcedure && actualProcedure.expedienteEstado === 'EN EJECUCIÓN' && formalities && formalities.length > 0) {

      let pendingProceduresCounter = 0

      formalities.map((formality) => {
        if (formality.tramiteFase === 'Tramite Obra' && (formality.tramiteEstado === 'EN CURSO' || formality.tramiteEstado === 'VALIDADO' || formality.tramiteEstado === 'PLANIFICADO')) {
          pendingProceduresCounter += 1
        }
      })

      if (pendingProceduresCounter > 0) {
        setPendingProcedures(true)
      } else {
        setPendingProcedures(false)
      }
    }
  }, [actualProcedure, formalities])

  useEffect(() => {
    if (currentProvision && currentProvision.dossierCod && adminCheck() && viewsTabValue === 0){
      dispatch(setUrlMessagesDossierDataDossier(currentProvision.dossierCod))
    }
  }, [currentProvision, viewsTabValue])

  useEffect(() => {
    if (expandedPanel !== '' && adminCheck() && viewsTabValue === 0) {
      dispatch(setUrlMessagesDossierDataPanel(expandedPanel))
      // panel1 > Datos de la solicitud
      if (expandedPanel === 'panel1') {
        dispatch(setUrlMessagesDetail('PROVISIONS_PANEL_1'))
      }
      // panel2 > Presupuesto
      else if (expandedPanel === 'panel2') {
        dispatch(setUrlMessagesDetail('PROVISIONS_PANEL_2'))
      }
      // panel3 > Pago
      else if (expandedPanel === 'panel3') {
        dispatch(setUrlMessagesDetail('PROVISIONS_PANEL_3'))
      }
      // panel4 > Tramitación
      else if (expandedPanel === 'panel4') {
        dispatch(setUrlMessagesDetail('PROVISIONS_PANEL_4'))
      }
      // panel5 > Ejecución de la solicitud	
      else if (expandedPanel === 'panel5') {
        dispatch(setUrlMessagesDetail('PROVISIONS_PANEL_5'))
      }
      // panel6 > Cierre
      else if (expandedPanel === 'panel6') {
        dispatch(setUrlMessagesDetail('PROVISIONS_PANEL_6'))
      }
    }
  }, [expandedPanel, viewsTabValue])

  // PPM 1007560 marcamos los 6 paneles comos activos o no activos en REDUX para que los usuarios admin que
  // suplantanten puedan seleccionar únicamente los paneles que estén activos, en el desplegable del popup de urlMessages
  useEffect(() => {
    if (adminCheck() && viewsTabValue === 0) {
      const panelEnablement = {        
        // PANEL 1: Siempre activo
        panel1: '1',
        // PANEL 2: state === 4 || state === 5 ? 'active' : state > 5 ? 'done' : 'disabled'
        panel2: state >= 4 ? '1' : '',
        // PANEL 3: state === 6 ? 'active' : state > 6 ? 'done' : 'disabled'
        panel3: state >= 6 ? '1' : '',
        // PANEL 4: state === 7 ? 'active' : state > 7 && formalities.length > 0 ? 'done' : 'disabled'
        panel4: (state === 7 || (state > 7 && formalities.length > 0)) ? '1' : '',
        // PANEL 5: state === 8 ? 'active' : state >= 7 ? 'done': 'disabled'
        panel5: state >= 7 ? '1': '',
        // PANEL 6: state === 9 ? 'active' : state > 9 ? 'done': 'disabled'
        panel6: state >= 9 ? '1' : '',
      }
      dispatch(setUrlMessagesDossierDataPanelEnablement(panelEnablement))
    }
  }, [state, viewsTabValue, formalities])

  const sendGAEventExpansion = (panel:any):void => {

    var clickTextAux = ''

    switch (panel) {
      case 'panel1':
        clickTextAux = 'datos de la solicitud';
        break;
      case 'panel2':
        clickTextAux = 'propuesta previa';
        break;
      case 'panel3':
        clickTextAux = 'pago';
        break;
      case 'panel4':
        clickTextAux = 'tramitacion';
        break;
      case 'panel5':
        clickTextAux = 'ejecucion de la solicitud';
        break;
      case 'panel6':
        clickTextAux = 'cierre de la solicitud';
        break;
    }

    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      subsection_name: 'detalle de solicitud',
      title_screen: 'finalizada la tramitacion de inicio de obra',
      click_text: clickTextAux,
      element_type: 'consulta de informacion',
      page_url:window.location.href,
      request_number:currentProvision.dossierCod,
      request_status:getExpStatus(currentProvision.dossierStatusId),
      type_budget:'no aplica', //FALTA POR TERMINAR
      tab_name:'mi conexion a la red',
      request_type:'quiero una nueva conexion a la red',
      request_step_name:'tramitacion',
      payment_type:'no aplica', //FALTA POR TERMINAR
      browsing_type: sessionStorage.getItem('browsing_type')
    })
    
  }

  return (
    <>
      <div className={classes.block}>
        <Grid item md={12}>
          {isLoading &&
            <Spinner />
          }
        </Grid>
        <Grid container className={classes.container}>
          <Grid item xs={11} md={10} className={classes.maxWidthForBigScreens}>

            <Grid justifyContent='center'>
              <div className={classes.root}>
                <Stepper alternativeLabel activeStep={activeStep}>
                  {steps.map((label, index) => (
                    <Step key={index}>
                      <StepLabel>{!mobile && label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </div>
            </Grid>
            <Grid container justifyContent='center'>
              <Grid item md={11} sm={11} xs={12} justifyContent='center'>
                {
                  // FSP- CAMBIO PARA QUE PUEDAN VERSE EN PORTAL EXPED CREADOS DESDE ZEUS EN ESTADO=ALTA
                  (requestDataCompleted || (currentProvision.dossierCod !== '' && currentProvision.dossierStatusId === 'STATUS0001')) ?
                    <>
                      <ExpansionPanel expanded={expandedPanel === 'panel1'} onChange={handleChangeExpandedPanel('panel1')}>
                        <ExpansionPanelSummary
                          className={state <= 3 ? 'active' : 'done'}
                          expandIcon={<StyledExpandMoreIcon className={state <= 3 ? 'active' : 'done'} />}
                        >
                          <Grid container alignItems='center' spacing={2}>
                            <Grid item xs={2} md='auto'>
                              <div className={`${classes.expansionPanelSummaryIndex} ${state <= 3 ? classes.indexActive : ''}`}>1</div>
                            </Grid>

                            <Grid item xs={10} md={11}>
                              <Typography className={`${classes.expansionPanelSummaryText} ${classes.textActive}`}>{t('provisions.newProvision.keepInMind.steps.requestData')}</Typography>
                            </Grid>
                          </Grid>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                          <RequestData
                            setRequestDataCompleted={setRequestDataCompleted}
                            state={state}
                            setState={setState}
                            preparedToSendAux={preparedToSend}
                            showDocOnCancelDossier={showDocOnCancelDossier}
                            isNewGeneration={isNewGeneration}
                            isPendingReview={isPendingReview}
                            isPendingSubsanation={isPendingSubsanation}
                            blockerDocumentsList={blockerDocumentsList}
                            isSecondSubsanation={isSecondSubsanation}
                            autoconsumo={autoconsumo}
                            generaCogen={generaCogen}
                            indAceptoFacturaDigital={indAceptoFacturaDigital}
                            setIndAceptoFacturaDigital={setIndAceptoFacturaDigital}
                            billingEmail={billingEmail}
                            setBillingEmail={setBillingEmail}
                            setIsLoadingGlobal={setIsLoading}

                          />
                        </ExpansionPanelDetails>
                      </ExpansionPanel>

                      <ExpansionPanel expanded={expandedPanel === 'panel2'} disabled={state < 4} onChange={handleChangeExpandedPanel('panel2')}>
                        <ExpansionPanelSummary
                          className={state === 4 || state === 5 ? 'active' : state > 5 ? 'done' : 'disabled'}
                          expandIcon={<StyledExpandMoreIcon className={state >= 4 || state >= 5 ? 'active' : 'disabled'} />}
                        >
                          <Grid container alignItems='center' spacing={2}>
                            <Grid item xs={2} md='auto'>
                              <div className={`${classes.expansionPanelSummaryIndex} ${state <= 5 ? classes.indexActive : ''}`}>2</div>
                            </Grid>

                            <Grid item xs={10} md={11}>
                              {propPrev ?
                                <Typography className={`${classes.expansionPanelSummaryText} ${state >= 4 ? classes.textActive : ''}`}>{t('provisions.newProvision.keepInMind.steps.connectionSolution')}</Typography>
                                :
                                <Typography className={`${classes.expansionPanelSummaryText} ${state >= 4 ? classes.textActive : ''}`}>{t('provisions.newProvision.keepInMind.steps.budget')}</Typography>
                              }
                            </Grid>
                          </Grid>
                        </ExpansionPanelSummary>

                        <ExpansionPanelDetails>
                          {
                            state >= 4 &&
                            <BudgetSolutionAccessNew
                              state={state}
                              setState={setState}
                              setAcceptedBudget={setAcceptedBudget}
                              setPaymentDoneBudget={setPaymentDoneBudget}
                              setPaymentQueryExecuting={setPaymentQueryExecuting}
                              propPrev={propPrev}
                              setPropPrev={setPropPrev}
                              baremos={baremos}
                              statusPrevProposal={statusPrevProposal}
                            />
                          }
                        </ExpansionPanelDetails>
                      </ExpansionPanel>

                      <ExpansionPanel expanded={expandedPanel === 'panel3'} disabled={state < 6} onChange={handleChangeExpandedPanel('panel3')}>
                        <ExpansionPanelSummary
                          className={state === 6 ? 'active' : state > 6 ? 'done' : 'disabled'}
                          expandIcon={<StyledExpandMoreIcon className={state >= 6 ? 'active' : 'disabled'} />}
                        >
                          <Grid container alignItems='center' spacing={2}>
                            <Grid item xs={2} md='auto'>
                              <div className={`${classes.expansionPanelSummaryIndex} ${state <= 6 ? classes.indexActive : ''}`}>3</div>
                            </Grid>

                            <Grid item xs={10} md={11}>
                              <Typography className={`${classes.expansionPanelSummaryText} ${state >= 6 ? classes.textActive : ''}`}>{t('provisions.newProvision.keepInMind.steps.payment')}</Typography>
                            </Grid>
                          </Grid>
                        </ExpansionPanelSummary>

                        <ExpansionPanelDetails>
                          {
                            filteredMilestoneList && filteredMilestoneList.length <= 1 ?
                              state >= 6 &&
                              <Payment
                                state={state}
                                setState={setState}
                                paymentDoneBudget={paymentDoneBudget}
                                paymentQueryExecuting={paymentQueryExecuting}
                                indAceptoFacturaDigital={indAceptoFacturaDigital}
                                setIndAceptoFacturaDigital={setIndAceptoFacturaDigital}
                                baremos={baremos}
                              />
                              :
                              state >= 6 &&
                              <DoublePayment
                                state={state}
                                setState={setState}
                                paymentDoneBudget={paymentDoneBudget}
                                paymentQueryExecuting={paymentQueryExecuting}
                                milestoneList={filteredMilestoneList}
                                indAceptoFacturaDigital={indAceptoFacturaDigital}
                                setIndAceptoFacturaDigital={setIndAceptoFacturaDigital}
                                baremos={baremos}
                              />
                          }
                        </ExpansionPanelDetails>
                      </ExpansionPanel>

                      <ExpansionPanel expanded={expandedPanel === 'panel4'} disabled={state < 7 || formalities.length === 0} onChange={handleChangeExpandedPanel('panel4')}>
                        <ExpansionPanelSummary
                          className={state === 7 ? 'active' : state > 7 && formalities.length > 0 ? 'done' : 'disabled'}
                          expandIcon={<StyledExpandMoreIcon className={state >= 7 && formalities.length > 0 ? 'active' : 'disabled'} />}
                        >
                          <Grid container alignItems='center' spacing={2}>
                            <Grid item xs={2} md='auto'>
                              <div className={`${classes.expansionPanelSummaryIndex} ${state <= 7 ? classes.indexActive : ''}`}>4</div>
                            </Grid>

                            <Grid xs={10} md='auto'>
                              <Typography className={`${classes.expansionPanelSummaryText} ${state >= 7 && formalities.length > 0? classes.textActive : ''}`}>{t('provisions.newProvision.keepInMind.steps.processing')}</Typography>
                            </Grid>

                            {pendingProcedures &&
                              <Grid container xs={12} md='auto' className={classes.actionBox}>
                                <Grid item>
                                  <img className={classes.alertIcon} src={AlertIcon} alt='' />
                                </Grid>

                                <Grid item className={classes.alertLabel}>{t('provisions.processingInfo.pendingProcedures')}</Grid>
                              </Grid>
                            }
                          </Grid>
                        </ExpansionPanelSummary>

                        <ExpansionPanelDetails>
                          {
                            state >= 7 &&
                              <ProcessingInfo 
                                currentProvision={currentProvision} 
                                actualProcedure={actualProcedure}
                                formalities={formalities}
                                state={state}
                              />
                          }
                        </ExpansionPanelDetails>
                      </ExpansionPanel>

                      <ExpansionPanel expanded={expandedPanel === 'panel5'} disabled={state < 7} onChange={handleChangeExpandedPanel('panel5')}>
                        <ExpansionPanelSummary
                          className={state === 8 ? 'active' : state >= 7 ? 'done': 'disabled'}
                          expandIcon={<StyledExpandMoreIcon className={state >= 7 ? 'active' : 'disabled'} />}
                        >
                          <Grid container alignItems='center' spacing={2}>
                            <Grid item xs={2} md='auto'>
                              <div className={`${classes.expansionPanelSummaryIndex} ${state <= 7 ? classes.indexActive : ''}`}>5</div>
                            </Grid>

                            <Grid item xs={10} md={11}>
                              <Typography className={`${classes.expansionPanelSummaryText} ${state >= 7 ? classes.textActive : ''}`}>{t('provisions.newProvision.keepInMind.steps.requestExecution')}</Typography>
                            </Grid>
                          </Grid>
                        </ExpansionPanelSummary>

                        <ExpansionPanelDetails>
                          {
                            state >= 7 &&
                              <JobExecution 
                                isBlockedByDocument={blockedByDocument}
                                setExpandedPanel={setExpandedPanel}
                                handleFinishedInstallation={handleFinishedInstallation}
                                handleSendSelfJobsEndDate={handleSendSelfJobsEndDate}
                                handleSendExp={handleSendExp}
                                showErrorDialog={showErrorDialog}
                                setShowErrorDialog={setShowErrorDialog}
                                propPrev={propPrev}
                              />
                          }
                        </ExpansionPanelDetails>
                      </ExpansionPanel>

                      <ExpansionPanel expanded={expandedPanel === 'panel6'} disabled={state < 9} onChange={handleChangeExpandedPanel('panel6')}>
                        <ExpansionPanelSummary
                          className={state === 9 ? 'active' : state > 9 ? 'done': 'disabled'}
                          expandIcon={<StyledExpandMoreIcon className={state >= 9 ? 'active' : 'disabled'} />}
                        >
                          <Grid container alignItems='center' spacing={2}>
                            <Grid item xs={2} md='auto'>
                              <div className={`${classes.expansionPanelSummaryIndex} ${state <= 9 ? classes.indexActive : ''}`}>6</div>
                            </Grid>

                            <Grid item xs={10} md={11}>
                              <Typography className={`${classes.expansionPanelSummaryText} ${state >= 9 ? classes.textActive : ''}`}>{t('provisions.newProvision.keepInMind.steps.requestClose')}</Typography>

                            </Grid>
                          </Grid>
                        </ExpansionPanelSummary>

                        <ExpansionPanelDetails>
                          {
                            state >= 9 &&
                              <ApplicationClosure />
                          }
                        </ExpansionPanelDetails>
                      </ExpansionPanel>
                    </>
                    :
                    <RequestDataWelcome
                      history={props.history}
                      setRequestDataCompleted={setRequestDataCompleted}
                      setState={setState}
                      autoconsumo={autoconsumo}
                      generaCogen={generaCogen}
                      setGeneraCogen={setGeneraCogen}
                    />
                }
              </Grid>
            </Grid>

          </Grid>
        </Grid>
      </div>
    </>
  )
}

export default withRouter(Steps)
