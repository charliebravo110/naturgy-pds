import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Grid, DialogContent, ClickAwayListener } from '@material-ui/core'
import BackIcon from '@material-ui/icons/ChevronLeft'

import Spinner from '../../../../common/components/spinner/Spinner'
import Button from '../../../../common/components/button/Button'
import Input from '../../../../common/components/input/Input'
import Datepicker from '../../../../common/components/datepicker/Datepicker'
import { formatDate, gettHourFromDate } from '../../../../common/lib/FormatLib'
import Dialog from '../../../../common/components/dialog/Dialog'
import CloseIcon from '../../../../assets/icons/cerrar.svg'

import SupplyData from '../common/supply-data/SupplyData'
import DossierData from '../common/dossier-data/DossierData'
import Breadcrumbs from '../common/breadcrumbs/Breadcrumbs'
import AnonymousAlert from './anonymous-alert/AnonymousAlert'
import Comment from './comment/Comment'
import DocumentationList from './documentation-list/DocumentationList'
import AddressForm from './address-form/AddressForm'
import BtenForm from './bten-form/BtenForm'
import AttachedDocuments from './attached-documents/AttachedDocuments'
import ConfirmationDialog from './confirmation-dialog/ConfirmationDialog'

import { checkDocumentTypeInString, getCupsGenerationValue, getCupsConsumoValue} from '../../../../common/lib/ValidationLib'

import { thunkGetMasterData, thunkGetProvision } from '../../../../provisions/store/actions/ProvisionsThunkActions'
import { resetNewRequestDataDocument, setNewRequestData, setNewRequestSteps } from '../../../store/actions/RequestsActions'
import { thunkGetRequestsList, thunkCreateNewRequest } from '../../../store/actions/RequestsThunkActions'

import useStyles from './Form.styles'
import Item from './documentation-list/item/Item'
import ProximityForm from './proximity-form/ProximityForm'
import PrivateForm from './privateForm/PrivateForm'
import BigFileDialog from './big-file-dialog/BigFileDialog'
import { request } from 'http'
import Incident from './incident/Incident'
import { any } from 'prop-types'
import { sendGAEvent } from '../../../../core/utils/gtm'


const Form = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const user = useSelector((state: any) => state.user)
  const requests = useSelector((state: any) => state.requests)
  const delegatesInMe = useSelector((state: any) => state.delegations.delegatesInMeList)

  const { cups, supplyData, setCreatingNewRequest, setCurrentStep, isLoading, setIsLoading, setCreatingNewRequestFromMeter, creatingNewRequestFromMeter, notificationListSelected, setNotificationListSelected } = props

  const [loading, setLoading] = useState(false)
  const [disablingButton, setDisablingButton] = useState(true)
  const [showingConfirmationDialog, setShowingConfirmationDialog] = useState(false)
  const [documentationList, setDocumentationList] = useState([] as any)

  const [date, setDate] = useState(formatDate(new Date()))
  const [hourFrom, setHourFrom] = useState()
  const [hourTo, setHourTo] = useState()
  const [phone, setPhone] = useState()
  const [comentariosDocumentos, setComentariosDocumentos] = useState([])
  const [provision, setProvision] = useState({} as any)
  const [cupsGeneration, setCupsGeneration] = useState({} as any)
  const [cupsConsumo, setcupsConsumo] = useState({} as any)



  //Periodos de energía
  const [periods, setPeriods] = useState({
    total: '',
    tip: '',
    shallow: '',
    valley: ''
  })

  let auxSrCodes = []
  const [srCodes, setSrCodes] = useState([])

  const [showingDialogAlert, setShowingDialogAlert] = useState(false)

  const [bigFilePopup, setBigFilePopup] = useState(false)
  const provisionsList = useSelector((state: any) => state.provisions.provisionsList)
  const [optionalDocument, setOptionalDocument] = useState({
    text: t('requests.newRequest.optionalDocumentation2'),
    suffix: '',
    comment: '',
    redInput: '',
    anexado: false
  })

  const handleChangeRed = () => {
    let auxList = [] as any

    documentationList.map(item => {
      let auxRed = 'true'
      if (item.anexado) {
        auxRed = 'false'
      }

      auxList.push({
        ...item,
        redInput: auxRed
      })
    })
    setDocumentationList(auxList)
  }

  const handleChangeActualRed = (incomingItem) => {
    let auxList = [] as any

    documentationList.map(item => {
      let auxRed = 'false'

      if (item === incomingItem) {
        auxList.push({
          ...item,
          anexado: true,
          redInput: auxRed
        })
      } else {
        auxList.push({ ...item })
      }
    })
    setDocumentationList(auxList)
  }

  const handleCloseDialogAlert = () => {
    setShowingDialogAlert(false)
    handleChangeRed()
  }


  const [addressData, setAddressData] = useState({
    state: '',
    town: '',
    cp: '',
    roadType: '',
    roadName: '',
    number: '',
    block: '',
    stair: '',
    floor: '',
    door: ''
  } as any)

  const [addressErrors, setAddressErrors] = useState({
    state: false,
    town: false,
    cp: false,
    roadType: false,
    roadName: false,
    number: false
  })

  const [btenData, setBtenData] = useState({
    // Datos del solicitante
    applicantNameAndSurname: user && user.profile && user.profile.name && user.profile.name !== '' && user.profile.surName && user.profile.surName !== '' ? `${user.profile.name} ${user.profile.surName}` : '',
    docNumber: user && user.profile && user.profile.documentNumber && user.profile.documentNumber !== '' ? user.profile.documentNumber : '',
    phone: '',
    mail: user && user.profile && user.profile.email && user.profile.email !== '' ? user.profile.email : '',
    identity: '',
    // Motivo de la solicitud
    requestReason: '',
    // Descripción de los trabajos que quiere realizar
    workDescription: '',
    // Alcance de los trabajos que nos solicita
    workScope: '',
    workScopeObservations: '',
    // Empresa que va a realizar los trabajos
    businessName: '',
    businessDocNum: '',
    businessElectricalWork: '',
    businessRegistryNum: '',
    businessContactPerson: '',
    businessContactPhoneNum: '',
    // Ubicación de las instalaciones
    cups: '',
    // Titular de las instalaciones
    ownerBusinessName: '',
    ownerDocNum: '',
    ownerCharge: '',
    ownerContactPerson: '',
    ownerContactPhoneNum: '',
    // Fechas y hora de la necesidad de la actuación
    startdDate: '',
    endDate: '',
    startTime: '',
    endTime: ''
  } as any)

  const [btenErrors, setBtenErrors] = useState({
    applicantNameAndSurname: false,
    docNumber: false,
    phone: false,
    mail: false,
    requestReason: false,
    workDescription: false,
    scopeSelector: false,
    workScope: false,
    businessName: false,
    businessDocNum: false,
    businessContactPerson: false,
    businessContactPhoneNum: false,
    cups: false,
    ownerBusinessName: false,
    ownerDocNum: false,
    ownerContactPerson: false,
    ownerContactPhoneNum: false,
    startTime: false,
    endTime: false,
  })

  const [pvtData, setPvtData] = useState({
    // Datos del solicitante
    applicantNameAndSurname: user && user.profile && user.profile.name && user.profile.name !== '' && user.profile.surName && user.profile.surName !== '' ? `${user.profile.name} ${user.profile.surName}` : '',
    docNumber: user && user.profile && user.profile.documentNumber && user.profile.documentNumber !== '' ? user.profile.documentNumber : '',
    phone: '',
    mail: user && user.profile && user.profile.email && user.profile.email !== '' ? user.profile.email : '',
    identity: '',
    // Motivo de la solicitud
    requestReason: '',
    // Descripción de los trabajos que quiere realizar
    workDescription: '',
    // Alcance de los trabajos que nos solicita
    workScope: '',
    workScopeObservations: '',
    // Empresa que va a realizar los trabajos
    businessName: '',
    businessDocNum: '',
    businessElectricalWork: '',
    businessRegistryNum: '',
    businessContactPerson: '',
    businessContactPhoneNum: '',
    // Ubicación de las instalaciones
    cups: '',
    // Titular de las instalaciones
    ownerBusinessName: '',
    ownerDocNum: '',
    ownerCharge: '',
    ownerContactPerson: '',
    ownerContactPhoneNum: '',
    // Fechas y hora de la necesidad de la actuación
    startdDate: '',
    endDate: '',
    startTime: '',
    endTime: ''
  } as any)

  const [pvtErrors, setPvtErrors] = useState({
    applicantNameAndSurname: false,
    docNumber: false,
    phone: false,
    mail: false,
    requestReason: false,
    workDescription: false,
    scopeSelector: false,
    workScope: false,
    businessName: false,
    businessDocNum: false,
    businessContactPerson: false,
    businessContactPhoneNum: false,
    cups: false,
    ownerBusinessName: false,
    ownerDocNum: false,
    ownerContactPerson: false,
    ownerContactPhoneNum: false,
    startTime: false,
    endTime: false,
  })

  const [isAddressForm, setIsAddressForm] = useState(false)

  const [proximityData, setProximityData] = useState({
    // Datos del solicitante
    applicantNameAndSurname: user && user.profile && user.profile.name && user.profile.name !== '' && user.profile.surName && user.profile.surName !== '' ? `${user.profile.name} ${user.profile.surName}` : '',
    docNumber: user && user.profile && user.profile.documentNumber && user.profile.documentNumber !== '' ? user.profile.documentNumber : '',
    phone: '',
    mail: user && user.profile && user.profile.email && user.profile.email !== '' ? user.profile.email : '',
    identity: '',
    // Motivo de la solicitud
    requestReason: '',
    // Descripción de los trabajos que quiere realizar
    workDescription: '',
    // Alcance de los trabajos que nos solicita
    workScope: '',
    workScopeObservations: '',
    // Empresa que va a realizar los trabajos
    businessName: '',
    businessDocNum: '',
    businessElectricalWork: '',
    businessRegistryNum: '',
    businessContactPerson: '',
    businessContactPhoneNum: '',
    // Ubicación de las instalaciones
    cups: '',
    // Titular de las instalaciones
    ownerBusinessName: '',
    ownerDocNum: '',
    ownerCharge: '',
    ownerContactPerson: '',
    ownerContactPhoneNum: '',
    // Fechas y hora de la necesidad de la actuación
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    // Dirección
    state: '',
    town: '',
    zipcode: '',
    streetType: '',
    streetName: '',
    number: '',
    // Dirección Mapa
    address: '',
    property: '',
    cadastralRef: '',
    zipcodeRustic: ''
  } as any)

  const [proximityErrors, setProximityErrors] = useState({
    applicantNameAndSurname: false,
    docNumber: false,
    phone: false,
    mail: false,
    requestReason: false,
    workDescription: false,
    scopeSelector: false,
    workScope: false,
    businessName: false,
    businessContactPerson: false,
    businessContactPhoneNum: false,
    businessDocNum: false,
    state: false,
    town: false,
    zipcode: false,
    streetType: false,
    streetName: false,
    number: false,
    cups: false,
    ownerBusinessName: false,
    ownerDocNum: false,
    ownerContactPerson: false,
    ownerContactPhoneNum: false,
    startTime: false,
    endTime: false,
    address: false,
    property: false,
    cadastralRef: false,
    zipcodeRustic: false
  })

  const handleCheckAddressFormAvailability = () => {
    let availability = false

    if (
      (
        requests.newRequestSteps.step1 === 'SUPPLY' &&
        requests.newRequestSteps.step3 === 'INCIDENCE'
      ) ||
      (
        requests.newRequestSteps.step1 === 'FRAUD' &&
        requests.newRequestSteps.step3 === 'PERSONAL-DATA'
      ) ||
      requests.newRequestSteps.step1 === 'INCIDENTS'
    ) {
      availability = true
    }

    return availability
  }

  const handleClickBack = () => {
    dispatch(resetNewRequestDataDocument([]))
    setNotificationListSelected([])

    if (requests.newRequestSteps.step1 === 'INCIDENTS' || requests.newRequestSteps.step1 === 'SELFCONSUMPTION') {
      setCurrentStep(1)
    } else if (requests.newRequestSteps.step1 === 'FRAUD') {
      setCurrentStep(3)
    } else if (requests.newRequestSteps.step1 === 'CUT') {
      setCurrentStep(3)
    } else if (requests.newRequestSteps.step3 === 'OTHERS') {
      setCurrentStep(3)
    } else if (requests.newRequestSteps.step3 === 'NOTIFICATIONS') {
      setCurrentStep(9)
    } else if (requests.newRequestSteps.step1 === 'WORKS') {
      setCurrentStep(6)
    } else if (requests.newRequestSteps.step1 === 'CONSULT') {
      setCurrentStep(7)
    } else if (requests.newRequestSteps.step3 === 'MODIFY') {
      setCurrentStep(3)
    } else if (requests.newRequestSteps.step3 === 'DOUBTS') {
      setCurrentStep(3)
    } else if (requests.newRequestSteps.step3 === 'REACTIVATE') {
      setCurrentStep(3)
    } else if (requests.newRequestSteps.step3 === 'READING') {
      setCurrentStep(3)
    } else if (requests.newRequestSteps.step3 === 'REPORT') {
      setCurrentStep(3)
    } else if (requests.newRequestSteps.step3 === 'ACCESS') {
      setCurrentStep(3)
    } else {
      if (requests.newRequestSteps.step4 === 'INSTANT-MEASUREMENT') {
        setCreatingNewRequestFromMeter(0)
      }
      setCurrentStep(4)
    }
  }

  const delay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleClickSendNotif = async () => {

    const delegatesInMeCups = delegatesInMe && delegatesInMe.filter(item => (item.cups === (supplyData && supplyData.cups ? supplyData.cups : cups)) && item.role === 'US_MANAGER')

    let filter = `documentNumber::${(delegatesInMeCups && delegatesInMeCups.length > 0) ? (delegatesInMeCups[0] && delegatesInMeCups[0].holderDocumentNumber) : user.profile.documentNumber}|status::2`
    // status 1 > no se realiza filtrado
    // status 2 > abiertas
    // status 3 > cerradas
    filter = filter + `|dossierNumber::${requests.newRequestSteps.step2}`

    const notifLength = notificationListSelected.length

    if (Array.isArray(notificationListSelected) && notifLength > 0) {
      if (notifLength === 1) {
        handleCreateRequestNotif(notificationListSelected[0], true)
      } else {
        handleCreateRequestNotif(notificationListSelected[0], false)
      }
      if (notificationListSelected[1] !== undefined) {
        if (notifLength === 2) {
          await delay(1000)
          handleCreateRequestNotif(notificationListSelected[1], true)
        } else {
          await delay(1000)
          handleCreateRequestNotif(notificationListSelected[1], false)
        }
      }
      if (notificationListSelected[2] !== undefined) {
        if (notifLength === 3) {
          await delay(2000)
          handleCreateRequestNotif(notificationListSelected[2], true)
        } else {
          await delay(2000)
          handleCreateRequestNotif(notificationListSelected[2], false)
        }
      }
      if (notificationListSelected[3] !== undefined) {
        await delay(3000)
        handleCreateRequestNotif(notificationListSelected[3], true)
      }
    }
  }

  const handleCreateRequestNotif = (element, lastElement) => {
    setLoading(true)
    setDisablingButton(true)

    let tipology = ''
    let subtipology = ''

    switch (element) {
      case 'NOTIFIOPER01': tipology = '1074A29'
        subtipology = '1074A2903'
        break
      case 'NOTIFIOPER02': tipology = '1074A29'
        subtipology = '1074A2902'
        break
      case 'NOTIFIOPER03': tipology = '1074A29'
        subtipology = '1074A2904'
        break
      case 'NOTIFIOPER04': tipology = '1074A29'
        subtipology = '1074A2901'
        break
    }
    requests.newRequestData.tipology = tipology
    requests.newRequestData.subtipology = subtipology

    let srData = requests.newRequestData

    if (requests.newRequestData.documents.length === 0) {
      srData = {
        ...srData,
        documents: [{
          url: '',
          idDocumentum: '',
          nombreArchivo: '',
          format: '',
          documentType: '',
          documentState: ''
        }]
      }
    }

    if (requests.newRequestSteps.step1 === 'DOSSIER') {
      srData = {
        ...srData,
        dossierNumber: requests.newRequestSteps.step2
      }
    }

    // Comprobar si la SR la crea un gestor
    const delegatesInMeCups = delegatesInMe && delegatesInMe.filter(item => (item.cups === (supplyData && supplyData.cups ? supplyData.cups : cups)) && item.role === 'US_MANAGER')

    if (delegatesInMeCups && delegatesInMeCups.length > 0) {
      const documentNumber = delegatesInMeCups[0] && delegatesInMeCups[0].holderDocumentNumber
      const documentType = checkDocumentTypeInString(documentNumber)

      srData = {
        ...srData,
        documentNumber,
        documentType,
        comment: `SR creada por el gestor: ${documentNumber};${srData.comment}`
      }
    }

    // crear SR    
    dispatch(thunkCreateNewRequest(srData, (response) => {
      if (response) {

        auxSrCodes = srCodes
        auxSrCodes.push(response.codigoSR)
        setSrCodes(auxSrCodes)

        dispatch(setNewRequestSteps({
          step6: srCodes
        }))

        if (lastElement) {
          setLoading(false)
          setCurrentStep(8)
        }

        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        })
      }
    }))
  }

  const handleClickSend = () => {
    if (disablingButton) {
      setShowingDialogAlert(true)
    } else {
      sendGAEventSendRequest();

      setIsLoading ? setIsLoading(true) : setLoading(true)

      const delegatesInMeCups = delegatesInMe && delegatesInMe.filter(item => (item.cups === (supplyData && supplyData.cups ? supplyData.cups : cups)) && item.role === 'US_MANAGER')

      let filter = `documentNumber::${(delegatesInMeCups && delegatesInMeCups.length > 0) ? (delegatesInMeCups[0] && delegatesInMeCups[0].holderDocumentNumber) : user.profile.documentNumber}|status::2`
      // status 1 > no se realiza filtrado
      // status 2 > abiertas
      // status 3 > cerradas

      if (requests.newRequestSteps.step1 === 'SUPPLY') {
        let cups = requests.newRequestSteps.step2

        if (cups.length === 20) {
          cups = cups + '1P'
        }

        filter = filter + `|cups::${cups}`
      } else if (requests.newRequestSteps.step1 === 'DOSSIER') (
        filter = filter + `|dossierNumber::${requests.newRequestSteps.step2}`
      )

      if (requests.newRequestSteps.step1 === 'CUT') {
        let cups = ''

        if (requests.newRequestSteps.step3 === 'BTEN') {
          cups = btenData.cups
        } else if (requests.newRequestSteps.step3 === 'PRIVATE') {
          cups = pvtData.cups
        } else if (requests.newRequestSteps.step3 === 'PROXIMITY') {
          cups = proximityData.cups
        }

        if (cups !== '') {
          filter = filter + `|cups::${cups}`
        }
      }

      // comprobar existencia de SRs iguales en curso
      dispatch(thunkGetRequestsList(filter, (response) => {
        if (
          response &&
          response.length > 0 &&
          response.filter(item => item.tipology === requests.newRequestData.tipology).length > 0 &&
          // Para las peticiones de corte por trabajos en proximidad no hacemos esta comprobación
          requests.newRequestData.subtipology !== '0872A0303'
        ) {
          setShowingConfirmationDialog(true)

          setIsLoading ? setIsLoading(false) : setLoading(false)
        } else {
          handleCreateRequest()
        }
      }))
    }
  }

  const handleCreateRequest = () => {
    let srData = requests.newRequestData
    let address
    // esta funcion crea un array con los comentarios de los documentos, de momento comentada
    //obtenerComentariosDocumentos()

    if (handleCheckAddressFormAvailability()) {
      // formar la dirección (si existe) como comentarios
      address = Object.values(addressData).filter(Boolean).join(' ')

      srData = {
        ...srData,
        comments: [{
          comment: {
            textComment: requests.newRequestData.comment + ';' + address
          },
          comentariosDocumentos
          // añadir array array comentarios como 312 mirar documentacion!!!!
        }]
      }
    }

    if (requests.newRequestSteps.step3 === 'READING') {
      srData = {
        ...srData,
        observations: 'Totalizador de energía 1.18.0= ' + periods.total + 'kWh; Periodo punta de energía 1.18.1= ' + periods.tip + 'kWh; Periodo llano de energía 1.18.2= ' + periods.shallow + 'kWh; Periodo valle de energía 1.18.2= ' + periods.valley + 'kWh; ' + requests.newRequestData.comment
      }
    }

    if (requests.newRequestSteps.step4 === 'INSTANT-MEASUREMENT') {
      // formar la fecha y franja horaria como comentario
      if (requests.newRequestSteps.step3 === 'ERRORLECTURA') {
        srData = {
          ...srData,
          cups: requests.newRequestSteps.step2,
          landline: phone,
          comment: requests.newRequestData.comment
        }
      }
      else {
        srData = {
          ...srData,
          cups: requests.newRequestSteps.step2,
          landline: phone,
          comment: requests.newRequestData.comment + ';' + date + ';' + gettHourFromDate(hourFrom) + ';' + gettHourFromDate(hourTo)
        }
      }
    }

    if (requests.newRequestSteps.step3 === 'BTEN') {
      // formar campos del formulario BtenForm como comentarios

      srData = {
        ...srData,
        cups: btenData.cups,
        comment:
          'Datos del solicitante :' +
          ' Nombre y Apellidos :' + btenData.applicantNameAndSurname + ';' +
          ' DNI :' + btenData.docNumber + ';' +
          ' Teléfono móvil :' + btenData.phone + ';' +
          ' E-mail :' + btenData.mail + ';' +
          ' Realiza la petición en calidad de: ' + btenData.identity + ';' +
          ' Motivo de la solicitud :' +
          ' Motivo: ' + btenData.requestReason + ';' +
          ' Descripción de los trabajos que quiere realizar :' +
          ' Descripción :' + btenData.workDescription + ';' +
          ' Alcance de los trabajos que nos solicita :' +
          ' Alcance: ' + btenData.workScope + ';' +
          ' Observaciones : ' + btenData.workScopeObservations + ';' +
          ' Empresa que va a realizar los trabajos :' +
          ' Razón social: ' + btenData.businessName + ';' +
          ' NIF/CIF: ' + btenData.businessDocNum + ';' +
          ' Trabajo eléctrico: ' + btenData.businessElectricalWork + ';' +
          ' Número de registro de la empresa autorizada: ' + btenData.businessRegistryNum + ';' +
          ' Jefe de trabajos: ' + btenData.businessContactPerson + ';' +
          ' Teléfono móvil : ' + btenData.businessContactPhoneNum + ';' +
          ' Ubicación de las instalaciones :' +
          ' CUPS: ' + btenData.cups + ';' +
          ' Titular de las instalaciones :' +
          ' Razón social: ' + btenData.ownerBusinessName + ';' +
          ' NIF/CIF: ' + btenData.ownerDocNum + ';' +
          ' Cargo: ' + btenData.ownerCharge + ';' +
          ' Nombre de la persona de contacto: ' + btenData.ownerContactPerson + ';' +
          ' Teléfono móvil de la persona de contacto: ' + btenData.ownerContactPhoneNum + ';' +
          ' Fecha de inicio: ' + btenData.startdDate + ';' +
          ' Fecha de fin: ' + btenData.endDate + ';' +
          ' Hora de inicio: ' + btenData.startTime + ';' +
          ' Hora de fin: ' + btenData.endTime
      }
    }

    if (requests.newRequestSteps.step3 === 'PRIVATE') {
      // formar campos del formulario PvtForm como comentarios

      srData = {
        ...srData,
        cups: pvtData.cups,
        comment:
          'Datos del solicitante :' +
          ' Nombre y Apellidos :' + pvtData.applicantNameAndSurname + ';' +
          ' DNI :' + pvtData.docNumber + ';' +
          ' Teléfono móvil :' + pvtData.phone + ';' +
          ' E-mail :' + pvtData.mail + ';' +
          ' Realiza la petición en calidad de: ' + pvtData.identity + ';' +
          ' Motivo de la solicitud :' +
          ' Motivo: ' + pvtData.requestReason + ';' +
          ' Descripción de los trabajos que quiere realizar :' +
          ' Descripción :' + pvtData.workDescription + ';' +
          ' Alcance de los trabajos que nos solicita :' +
          ' Alcance: ' + pvtData.workScope + ';' +
          ' Observaciones : ' + pvtData.workScopeObservations + ';' +
          ' Empresa que va a realizar los trabajos :' +
          ' Razón social: ' + pvtData.businessName + ';' +
          ' NIF/CIF: ' + pvtData.businessDocNum + ';' +
          ' Trabajo eléctrico: ' + pvtData.businessElectricalWork + ';' +
          ' Número de registro de la empresa autorizada: ' + pvtData.businessRegistryNum + ';' +
          ' Jefe de trabajos: ' + pvtData.businessContactPerson + ';' +
          ' Teléfono móvil : ' + pvtData.businessContactPhoneNum + ';' +
          ' Ubicación de las instalaciones :' +
          ' CUPS: ' + pvtData.cups + ';' +
          ' Titular de las instalaciones :' +
          ' Razón social: ' + pvtData.ownerBusinessName + ';' +
          ' NIF/CIF: ' + pvtData.ownerDocNum + ';' +
          ' Cargo: ' + pvtData.ownerCharge + ';' +
          ' Nombre de la persona de contacto: ' + pvtData.ownerContactPerson + ';' +
          ' Teléfono móvil de la persona de contacto: ' + pvtData.ownerContactPhoneNum + ';' +
          ' Fecha de inicio: ' + pvtData.startdDate + ';' +
          ' Fecha de fin: ' + pvtData.endDate + ';' +
          ' Hora de inicio: ' + pvtData.startTime + ';' +
          ' Hora de fin: ' + pvtData.endTime
      }
    }

    if (requests.newRequestSteps.step3 === 'PROXIMITY') {
      // formar campos del formulario ProximityForm como comentarios

      srData = {
        ...srData,
        comment:
          'Datos del solicitante :' +
          ' Nombre y Apellidos :' + proximityData.applicantNameAndSurname + ';' +
          ' DNI :' + proximityData.docNumber + ';' +
          ' Teléfono móvil :' + proximityData.phone + ';' +
          ' E-mail :' + proximityData.mail + ';' +
          ' Realiza la petición en calidad de: ' + proximityData.identity + ';' +
          ' Motivo de la solicitud :' +
          ' Motivo: ' + proximityData.requestReason + ';' +
          ' Descripción de los trabajos que quiere realizar :' +
          ' Descripción :' + proximityData.workDescription + ';' +
          ' Alcance de los trabajos que nos solicita :' +
          ' Alcance: ' + proximityData.workScope + ';' +
          ' Observaciones : ' + proximityData.workScopeObservations + ';' +
          ' Empresa que va a realizar los trabajos :' +
          ' Razón social: ' + proximityData.businessName + ';' +
          ' NIF/CIF: ' + proximityData.businessDocNum + ';' +
          ' Trabajo eléctrico: ' + proximityData.businessElectricalWork + ';' +
          ' Número de registro de la empresa autorizada: ' + proximityData.businessRegistryNum + ';' +
          ' Jefe de trabajos: ' + proximityData.businessContactPerson + ';' +
          ' Teléfono móvil : ' + proximityData.businessContactPhoneNum + ';' +
          ' Fecha de inicio: ' + proximityData.startdDate + ';' +
          ' Fecha de fin: ' + proximityData.endDate + ';' +
          ' Hora de inicio: ' + proximityData.startTime + ';' +
          ' Hora de fin: ' + proximityData.endTime + ';' +
          // Campos para cuando el usuario introduce la dirección manualmente (sin referencia catastral)
          ' Usuario introduce dirección manualmente :' +
          ' Provincia: ' + proximityData.state + ';' +
          ' Municipio: ' + proximityData.town + ';' +
          ' Código postal: ' + proximityData.zipcode + ';' +
          ' Tipo de vía: ' + proximityData.streetType + ';' +
          ' Nombre de la vía: ' + proximityData.streetName + ';' +
          ' Número: ' + proximityData.number + ';' +
          // Campos para cuando el usuario utiliza el mapa
          ' Usuario introduce dirección con el mapa :' +
          ' Dirección: ' + proximityData.address + ';' +
          ' Inmueble: ' + proximityData.property + ';' +
          ' Ref. catastral: ' + proximityData.cadastralRef + ';' +
          ' Codigo postal: ' + proximityData.zipcodeRustic
      }
    }

    if (requests.newRequestData.documents.length === 0) {
      srData = {
        ...srData,
        documents: [{
          url: '',
          idDocumentum: '',
          nombreArchivo: '',
          format: '',
          documentType: '',
          documentState: ''
        }]
      }
    }

    if (requests.newRequestSteps.step1 === 'SUPPLY') {
      let cups = requests.newRequestSteps.step2

      if (cups.length === 20) {
        cups = cups + '1P'
      }

      srData = {
        ...srData,
        cups
      }
    } else if (requests.newRequestSteps.step1 === 'DOSSIER') {
      srData = {
        ...srData,
        dossierNumber: requests.newRequestSteps.step2
      }
    }

    // Comprobar si la SR la crea un gestor
    const delegatesInMeCups = delegatesInMe && delegatesInMe.filter(item => (item.cups === (supplyData && supplyData.cups ? supplyData.cups : cups)) && item.role === 'US_MANAGER')

    if (delegatesInMeCups && delegatesInMeCups.length > 0) {
      const documentNumber = delegatesInMeCups[0] && delegatesInMeCups[0].holderDocumentNumber
      const documentType = checkDocumentTypeInString(documentNumber)

      srData = {
        ...srData,
        documentNumber,
        documentType,
        comment: `SR creada por el gestor: ${documentNumber};${srData.comment}`
      }
    }

    // crear SR
    dispatch(thunkCreateNewRequest(srData, (response) => {
      if (response) {
        dispatch(setNewRequestSteps({
          step6: response.codigoSR
        }))

        setCurrentStep(8)

        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        })
      }
      setIsLoading ? setIsLoading(false) : setLoading(false)
    }))

  }

  const checkMandatoryDocuments = () => {
    // funcion para comprovar que se han añadido todos los documentos olbigatorios
    for (let i in documentationList) {
      if (documentationList[i].anexado == false) return false
    }
    return true
  }

  const obtenerComentariosDocumentos = () => {
    //funcion para obtener en un array todos los comentarios de los documentos a subir
    let comentarios = [] as any
    // comentarios obligatorios
    for (let i in documentationList) {
      comentarios.push({
        documentComment: documentationList[i].comment
      })
    }
    // Si se ha adjuntado documento opcional
    if (optionalDocument.anexado) {
      comentarios.push({
        documentComment: optionalDocument.comment
      })
    }
    setComentariosDocumentos(comentarios)
  }
//1016316
  const isGeneracion = (CurrentProvisionType, CurrentProvisionSubType) => {
    if (CurrentProvisionType === 'DOSTYP002' && CurrentProvisionSubType !== 'DOSSUB000'){
        console.log('1016316 - Es de generación')
        return true
      }else{
        return false;
      } 
    }
  //1016316
  useEffect(() => {
    console.log('requests', requests)
    let defaultName = t('provisions.defaultName')
    dispatch(thunkGetProvision(requests.newRequestSteps.step2, defaultName, (response) => {
        setProvision(response)
    
    }))
    //GENERACION
    getCupsGenerationValue().then(result => {
      console.log('cupsGeneration result ->',result)
      setCupsGeneration(result)
      console.log('cupsGeneration->',cupsGeneration)

    })
    //GLOBAL
    getCupsConsumoValue().then(result => {
      setcupsConsumo(result)})
    console.log('cupsConsumo->',cupsConsumo)
  },[])

  useEffect(() => {
  
    if (user.profile.documentNumber) {
      let tipology
      let subtipology
   

      if (requests.newRequestSteps.step1 === 'SUPPLY') {
        if (requests.newRequestSteps.step3 === 'CLAIM') {
          if (requests.newRequestSteps.step4 === 'APPLIANCE-DAMAGE') {
            tipology = '0865R01'
            subtipology = '0865R0100'
          } else if (requests.newRequestSteps.step4 === 'OTHER-ASSETS-DAMAGE' || requests.newRequestSteps.step4 === 'PERSONAL-DAMAGE' || requests.newRequestSteps.step4 === 'PERISHABLE-FOOD-DAMAGE') {
            tipology = '0865R03'
            subtipology = '0865R0300'
          } else if (requests.newRequestSteps.step4 === 'WOODLAND-LOGGING-DAMAGE') {
            tipology = '0865R05'
            subtipology = '0865R0500'
          } else if (requests.newRequestSteps.step4 === 'RECEIVED-COMPENSATION-DISAGREEMENTS') {
            tipology = '0865R00'
            subtipology = '0865R0000'
          } else if (requests.newRequestSteps.step4 === 'FREQUENT-POWER-OUTAGES') {
            tipology = '0872R01'
            subtipology = '0872R0100'
          }
        } else if (requests.newRequestSteps.step3 === 'READING') {
          tipology = '0868A00'
          subtipology = '10049'
        } else if (requests.newRequestSteps.step3 === 'REPORT') {
          tipology = '0870A06'
          subtipology = '10459'
        } else if (requests.newRequestSteps.step3 === 'ACCESS') {
          tipology = '0870A12'
          subtipology = ''
        } else if (requests.newRequestSteps.step3 === 'OTHERS') {
          tipology = '0870I01'
          subtipology = '0870I0101'
        } else if (requests.newRequestSteps.step4 === 'INSTANT-MEASUREMENT' && requests.newRequestSteps.step3 === 'ERRORLECTURA') {
          tipology = '0870A12'
          subtipology = ''

        } else if (requests.newRequestSteps.step4 === 'INSTANT-MEASUREMENT' && requests.newRequestSteps.step3 === 'LECTURA') {
          tipology = '0868I03'
          subtipology = ''
        }
      } else if (requests.newRequestSteps.step1 === 'DOSSIER') {

        if (requests.newRequestSteps.step3 === 'CLAIM') {
          if (requests.newRequestSteps.step4 === 'TECHNICAL-ECONOMIC-DEFINITION') {
            //1016316 Plazo incumplido de la definición
            //tipology = '1074R00'
            let defaultName = t('provisions.defaultName')              
              if(provision){
                console.log('1016316 provision->',provision)
                let type =  isGeneracion(provision.idDossierTypeId, provision.idDossierSubtype) 
                if(type==true){
                  subtipology = 'RECLAMACION' in cupsGeneration ? cupsGeneration.RECLAMACION : '';
                  tipology = subtipology.substr(0, 7);

                }else{
                  //console.log('1016316 -> 1074R0000')
                  subtipology = 'PLAZO_DEFINICION' in cupsConsumo ? cupsConsumo.PLAZO_DEFINICION : '';
                  tipology = subtipology.substr(0, 7);

                }
              }

          } else if (requests.newRequestSteps.step4 === 'JOB-EXECUTION') {
            //1016316 Plazo incumplido en la ejecución de los  trabajos
            //tipology = '1074R00'
            let defaultName = t('provisions.defaultName')
            if(provision){
              console.log('1016316 ->',provision)
              let type =  isGeneracion(provision.idDossierTypeId, provision.idDossierSubtype) 
              if(type==true){
                subtipology = 'RECLAMACION' in cupsGeneration ? cupsGeneration.RECLAMACION : '';
                tipology = subtipology.substr(0, 7);

              }else{
                subtipology = 'PLAZO_TRABAJO' in cupsConsumo ? cupsConsumo.PLAZO_TRABAJO : '';
                tipology = subtipology.substr(0, 7);

              }
            }

          } else if (requests.newRequestSteps.step4 === 'PAYMENT-RETURN') {
             //1016316 Devolución del cobro por cancelación  
             //tipology = '1074R00'
             let defaultName = t('provisions.defaultName')
             if(provision){
               console.log('1016316 ->',provision)
               let type =  isGeneracion(provision.idDossierTypeId, provision.idDossierSubtype) 
               if(type==true){
                 console.log('1016316 -> 1074A1501')
                 subtipology = 'DEVOLUCION' in cupsGeneration ? cupsGeneration.DEVOLUCION : '';
                 tipology = subtipology.substr(0, 7);
                }else{
                 subtipology = 'DEVOLUCION' in cupsConsumo ? cupsConsumo.DEVOLUCION : '';
                 tipology = subtipology.substr(0, 7);

               }
             }

    
          } else if (requests.newRequestSteps.step4 === 'OTHERS') {

            //1016316 Otros 
            //tipology = '1074R05'

            let defaultName = t('provisions.defaultName')
            if(provision){
              console.log('1016316 ->',provision)
              let type =  isGeneracion(provision.idDossierTypeId, provision.idDossierSubtype) 
              if(type==true){
                subtipology = 'OTROS' in cupsGeneration ? cupsGeneration.OTROS : '';
                tipology = subtipology.substr(0, 7);

              }else{
                subtipology = 'OTROS' in cupsConsumo ? cupsConsumo.OTROS : '';
                tipology = subtipology.substr(0, 7);

              }
            }
        
          }

          // Quiero modificar datos o corregir datos de mi solicitud de conexión 
        } else if (requests.newRequestSteps.step3 === 'MODIFY') {
          //tipology = '1074A04'
          let defaultName = t('provisions.defaultName')
          if(provision){
            let type =  isGeneracion(provision.idDossierTypeId, provision.idDossierSubtype) 
            if(type==true){
              subtipology = 'CANCELAR' in cupsGeneration ? cupsGeneration.CANCELAR : '';
              tipology = subtipology.substr(0, 7);

            }else{
              subtipology = 'MODIFICAR' in cupsConsumo ? cupsConsumo.MODIFICAR : '';
              tipology = subtipology.substr(0, 7);            }
          }

         

        } else if (requests.newRequestSteps.step3 === 'REACTIVATE') {

            //1016316 Quiero reactivar mi solicitud de conexión cancelada
            //tipology = '1074A01'

            let defaultName = t('provisions.defaultName')
            if(provision){
              let type =  isGeneracion(provision.idDossierTypeId, provision.idDossierSubtype) 
              if(type==true){
                subtipology = 'CANCELAR' in cupsGeneration ? cupsGeneration.CANCELAR : '';
                tipology = subtipology.substr(0, 7);

              }else{
                subtipology = 'CONEXION' in cupsConsumo ? cupsConsumo.CONEXION : '';
                tipology = subtipology.substr(0, 7);

              }
            }

          
        } else if (requests.newRequestSteps.step3 === 'DOUBTS') {
        //1016316 6 Tengo dudas sobre las comunicaciones recibidas
        //tipology = '1074A15'

        let defaultName = t('provisions.defaultName')
        if(provision){
          console.log('1016316 ->',provision)
          let type =  isGeneracion(provision.idDossierTypeId, provision.idDossierSubtype) 
          if(type==true){
            subtipology = 'INFORMACION' in cupsGeneration ? cupsGeneration.INFORMACION : '';
            tipology = subtipology.substr(0, 7);

          }else{
            subtipology = 'DUDAS' in cupsConsumo ? cupsConsumo.DUDAS : '';
            tipology = subtipology.substr(0, 7);

          }
        }

        } else if (requests.newRequestSteps.step3 === 'DOCUMENTATION') {
          if (requests.newRequestSteps.step4 === 'TECHNICAL-MEMORY' || requests.newRequestSteps.step4 === 'CGP-LOCATION-MAP') {
            tipology = '1074A18'
            subtipology = '1074A1801'
          } else if (requests.newRequestSteps.step4 === 'CGP-INSTALLATION') {
            tipology = '1074A05'
            subtipology = '1074A0500'
          }
        } else if (requests.newRequestSteps.step3 === 'OTHERS') {
          tipology = '1070I01'
          subtipology = '1070I0101'
        } else if (requests.newRequestSteps.step3 === 'NOTIFICATIONS') {
          tipology = ''
          subtipology = ''
        }
      } else if (requests.newRequestSteps.step1 === 'FRAUD') {
        if (requests.newRequestSteps.step3 === 'ANONYMOUS' || requests.newRequestSteps.step3 === 'PERSONAL-DATA') {
          tipology = '0801A01'
          subtipology = '0864A03'
        }
      } else if (requests.newRequestSteps.step1 === 'INCIDENTS') {
        tipology = '0867A01'
        subtipology = '0867A0100'
      } else if (requests.newRequestSteps.step1 === 'SELFCONSUMPTION') {
        tipology = '1074I04'
        subtipology = '1074I0401'
      } else if (requests.newRequestSteps.step1 === 'CUT') {
        if (requests.newRequestSteps.step3 === 'BTEN') {
          tipology = '0872A03'
          subtipology = '0872A0301'
        } else if (requests.newRequestSteps.step3 === 'PRIVATE') {
          tipology = '0872A03'
          subtipology = '0872A0302'
        } else if (requests.newRequestSteps.step3 === 'PROXIMITY') {
          tipology = '0872A03'
          subtipology = '0872A0303'
        }
      } else if (requests.newRequestSteps.step1 === 'CONSULT') {
        if (requests.newRequestSteps.step3 === 'INFO') {
          tipology = '0870I01'
          subtipology = '10466'
        } else if (requests.newRequestSteps.step3 === 'REPORT') {
          tipology = '0870A06'
          subtipology = '10459'
        }
      } else if (requests.newRequestSteps.step1 === 'WORKS') {
        if (requests.newRequestSteps.step3 === 'CUT') {
          tipology = ''
          subtipology = ''
        } else if (requests.newRequestSteps.step3 === 'UNMOUNT') {
          tipology = ''
          subtipology = ''
        }
      }

      let newRequestData = {
        channel: '',
        province: '',
        documentType: checkDocumentTypeInString(user.profile.documentNumber),
        documentNumber: user.profile.documentNumber,
        name: user.profile.name,
        surName1: user.profile.surName,
        email: user.profile.email,
        landline: user.profile.phone, // phone
        cellphone: user.profile.phone, // phonemob
        tipology,
        subtipology
      } as any

      if (requests.newRequestSteps.step1 === 'SUPPLY') {
        let cups = requests.newRequestSteps.step2

        if (cups.length === 20) {
          cups = cups + '1P'
        }

        newRequestData = {
          ...newRequestData,
          cups
        }
      } else if (requests.newRequestSteps.step1 === 'DOSSIER') {
        newRequestData = {
          ...newRequestData,
          dossierNumber: requests.newRequestSteps.step2
        }
      }

      dispatch(setNewRequestData(newRequestData))
    }
    // eslint-disable-next-line
  }, [user.profile.documentNumber, creatingNewRequestFromMeter, provision, cupsGeneration])

  useEffect(() => {
    if (requests.newRequestData.tipology !== '') {
      // obtener documentos de masterdata
      setIsLoading ? setIsLoading(true) : setLoading(true)

      let codeAux

      if (requests.newRequestSteps.step1 === 'SUPPLY' && requests.newRequestSteps.step3 === 'CLAIM') {
        if (requests.newRequestSteps.step4 === 'OTHER-ASSETS-DAMAGE') {
          codeAux = '_O'
        } else if (requests.newRequestSteps.step4 === 'PERSONAL-DAMAGE') {
          codeAux = '_P'
        } else if (requests.newRequestSteps.step4 === 'PERISHABLE-FOOD-DAMAGE') {
          codeAux = '_F'
        }
      }

      const docs = 'DOC_SR_' + requests.newRequestData.tipology + (codeAux ? codeAux : '')

      dispatch(thunkGetMasterData('SRS_DOCUMENTOS_ADJUNTOS', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), docs, (response) => {
        if (response) {
          let auxList = [] as any

          response.map(item => {
            let clave = item.key.split('_')
            let index = clave.length - 1
            let sufijo = '_' + clave[index]
            let txt = item.value /*+ ' *'*/

            return auxList.push({
              suffix: sufijo,
              text: txt,
              comment: '',
              redInput: '',
              anexado: false
            })
          })
          setDocumentationList(auxList)
        }
        setIsLoading ? setIsLoading(false) : setLoading(false)
      }))
    }
    // eslint-disable-next-line
  }, [requests.newRequestData.tipology])

  useEffect(() => {
    // esto habilita enviar una peticion
    setDisablingButton(
      (
        requests.newRequestData.comment === '' ||
        (
          handleCheckAddressFormAvailability() &&
          (
            addressData.state === '' ||
            addressData.town === '' ||
            addressData.cp === '' ||
            addressData.roadType === '' ||
            addressData.roadName === '' ||
            addressData.number === ''
          )
        ) ||
        (
          requests.newRequestSteps.step3 === 'READING' &&
          (
            periods.total === '' || periods.tip === '' || periods.shallow === '' || periods.valley === ''
          )
        )
      )
      //Descomentar si se quiere que haya documentos obligatorios en una petición, se tiene que descomentar documentationList al final dl useeffect
      /*||
      (
        !checkMandatoryDocuments()
      )*/
    )
    // eslint-disable-next-line

  }, [requests.newRequestData, addressData, phone, date, hourFrom, hourTo, periods/*documentationList*/])

  useEffect(() => {
    if (documentationList.length > 0) {
      let suffixList = documentationList[0].suffix
      setOptionalDocument({ ...optionalDocument, suffix: suffixList })
    }
  }, [documentationList])

  // Comprobamos que los campos obligatorios no estén vacíos
  // en la estructura del formulario BtenForm
  useEffect(() => {
    if (requests.newRequestSteps.step3 === 'BTEN') {
      setDisablingButton(
        (
          // Comprobamos que los campos obligatorios no estén vacíos
          btenData.applicantNameAndSurname === '' ||
          btenData.docNumber === '' ||
          btenData.phone === '' ||
          btenData.mail === '' ||
          btenData.identity === '' ||
          btenData.requestReason === '' ||
          btenData.workDescription === '' ||
          btenData.workScope === '' ||
          btenData.workScopeObservations === '' ||
          btenData.businessName === '' ||
          btenData.businessDocNum === '' ||
          btenData.businessElectricalWork === '' ||
          btenData.businessContactPerson === '' ||
          btenData.businessContactPhoneNum === '' ||
          btenData.cups === '' ||
          btenData.ownerBusinessName === '' ||
          btenData.ownerDocNum === '' ||
          btenData.ownerCharge === '' ||
          btenData.ownerContactPerson === '' ||
          btenData.ownerContactPhoneNum === '' ||
          btenData.startdDate === '' ||
          btenData.endDate === '' ||
          btenData.startTime === '' ||
          btenData.endTime === ''
        )
        ||
        (
          // Comprobamos que no haya inputs con errores
          btenErrors.applicantNameAndSurname ||
          btenErrors.docNumber ||
          btenErrors.phone ||
          btenErrors.mail ||
          btenErrors.requestReason ||
          btenErrors.workDescription ||
          btenErrors.scopeSelector ||
          btenErrors.workScope ||
          btenErrors.businessName ||
          btenErrors.businessDocNum ||
          btenErrors.businessContactPerson ||
          btenErrors.businessContactPhoneNum ||
          btenErrors.cups ||
          btenErrors.ownerBusinessName ||
          btenErrors.ownerDocNum ||
          btenErrors.ownerContactPerson ||
          btenErrors.ownerContactPhoneNum ||
          btenErrors.startTime ||
          btenErrors.endTime
        )
      )
    }
  }, [requests.newRequestData, btenData, btenErrors])

  // Comprobamos que los campos obligatorios no estén vacíos
  // en la estructura del formulario PrivateForm
  useEffect(() => {
    if (requests.newRequestSteps.step3 === 'PRIVATE') {
      setDisablingButton(
        (
          pvtData.applicantNameAndSurname === '' ||
          pvtData.docNumber === '' ||
          pvtData.phone === '' ||
          pvtData.mail === '' ||
          pvtData.identity === '' ||
          pvtData.requestReason === '' ||
          pvtData.workDescription === '' ||
          pvtData.workScope === '' ||
          pvtData.workScopeObservations === '' ||
          pvtData.businessName === '' ||
          pvtData.businessDocNum === '' ||
          pvtData.businessElectricalWork === '' ||
          pvtData.businessContactPerson === '' ||
          pvtData.businessContactPhoneNum === '' ||
          pvtData.cups === '' ||
          pvtData.ownerBusinessName === '' ||
          pvtData.ownerDocNum === '' ||
          pvtData.ownerCharge === '' ||
          pvtData.ownerContactPerson === '' ||
          pvtData.ownerContactPhoneNum === '' ||
          pvtData.startdDate === '' ||
          pvtData.endDate === '' ||
          pvtData.startTime === '' ||
          pvtData.endTime === ''
        )
        ||
        (
          // Comprobamos que no haya inputs con errores
          pvtErrors.applicantNameAndSurname ||
          pvtErrors.docNumber ||
          pvtErrors.phone ||
          pvtErrors.mail ||
          pvtErrors.requestReason ||
          pvtErrors.workDescription ||
          pvtErrors.scopeSelector ||
          pvtErrors.workScope ||
          pvtErrors.businessName ||
          pvtErrors.businessDocNum ||
          pvtErrors.businessContactPerson ||
          pvtErrors.businessContactPhoneNum ||
          pvtErrors.cups ||
          pvtErrors.ownerBusinessName ||
          pvtErrors.ownerDocNum ||
          pvtErrors.ownerContactPerson ||
          pvtErrors.ownerContactPhoneNum ||
          pvtErrors.startTime ||
          pvtErrors.endTime
        )
      )
    }
  }, [requests.newRequestData, pvtData, pvtErrors])

  // Comprobamos que los campos obligatorios no estén vacíos
  // en la estructura del formulario ProximityForm
  useEffect(() => {
    if (requests.newRequestSteps.step3 === 'PROXIMITY') {
      setDisablingButton(
        (
          proximityData.applicantNameAndSurname === '' ||
          proximityData.docNumber === '' ||
          proximityData.phone === '' ||
          proximityData.mail === '' ||
          proximityData.identity === '' ||
          proximityData.requestReason === '' ||
          proximityData.workDescription === '' ||
          proximityData.workScope === '' ||
          proximityData.workScopeObservations === '' ||
          proximityData.businessName === '' ||
          proximityData.businessDocNum === '' ||
          proximityData.businessContactPerson === '' ||
          proximityData.businessContactPhoneNum === '' ||
          proximityData.startdDate === '' ||
          proximityData.endDate === '' ||
          proximityData.startTime === '' ||
          proximityData.endTime === '' ||
          (isAddressForm && //Comprobación para cuando introduce la dirección (sin referencia catastral)
            (
              proximityData.state === '' ||
              proximityData.town === '' ||
              proximityData.zipcode === '' ||
              proximityData.streetType === '' ||
              proximityData.streetName === '' ||
              proximityData.number === ''
            )
          ) ||
          (!isAddressForm && //Comprobación para cuando se usa el mapa 
            (
              proximityData.address === '' ||
              proximityData.property === '' ||
              proximityData.cadastralRef === ''
            )
          )
        )
        ||
        (
          // Comprobamos que no haya inputs con errores
          proximityErrors.applicantNameAndSurname ||
          proximityErrors.docNumber ||
          proximityErrors.phone ||
          proximityErrors.mail ||
          proximityErrors.requestReason ||
          proximityErrors.workDescription ||
          proximityErrors.scopeSelector ||
          proximityErrors.workScope ||
          proximityErrors.businessName ||
          proximityErrors.businessDocNum ||
          proximityErrors.businessContactPerson ||
          proximityErrors.businessContactPhoneNum ||
          proximityErrors.startTime ||
          proximityErrors.endTime ||
          (isAddressForm && //Comprobación para cuando introduce la dirección (sin referencia catastral)
            (
              proximityErrors.state ||
              proximityErrors.town ||
              proximityErrors.zipcode ||
              proximityErrors.streetType ||
              proximityErrors.streetName ||
              proximityErrors.number
            )
          ) ||
          (!isAddressForm && //Comprobación para cuando se usa el mapa 
            (
              proximityErrors.address ||
              proximityErrors.property ||
              proximityErrors.cadastralRef
            )
          )
        )
      )
    }
  }, [requests.newRequestData, proximityData, proximityErrors])

  const sendGAEventSendRequest = ():void => {

    const steps = [requests.newRequestSteps.step1, requests.newRequestSteps.step2, requests.newRequestSteps.step3, requests.newRequestSteps.step4, requests.newRequestSteps.step5, requests.newRequestSteps.step6]
    var i
    for (i = 0; i < 6; i++) {
      if (steps[i] === '') {
        break;
      }
    }

    if (requests.newRequestSteps.step1 === 'SUPPLY') {
      var stepNameAux = 'quiero aportar la lectura de mi contador'
      if (requests.newRequestSteps.step1 === 'SUPPLY' && requests.newRequestSteps.step3 === 'CLAIM') {
        stepNameAux = 'quiero hacer una reclamación por un daño'
      }

      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mis peticiones',
        subsection_name: 'nueva peticion',
        click_text: 'enviar peticion',
        element_type: 'conversion de accion',
        page_url: window.location.href,
        request_type: 'mis suministros',
        request_step: i.toString(),
        request_step_name: 'comentarios',
        cups: requests.newRequestSupply.cups,
        reason_request: stepNameAux,
        browsing_type: sessionStorage.getItem('browsing_type'),
      });
    } else if (requests.newRequestSteps.step1 === 'DOSSIER') {

      const mappingMoreInfo = (type:any):any => {
        var clickTextAux

        switch (type) {
          case 'TECHNICAL-ECONOMIC-DEFINITION':
            clickTextAux = 'plazo incumplido de la definicion de la propuesta previa'
            break;
          case 'JOB-EXECUTION':
            clickTextAux = 'plazo incumplido en la ejecucion de los trabajos'
            break;
          case 'PAYMENT-RETURN':
            clickTextAux = 'devolucion del cobro por cancelacion de mi solicitud de conexion'
            break;
          case 'OTHERS':
            clickTextAux = 'otros'
            break;
          case 'TECHNICAL-MEMORY':
            clickTextAux = 'documentacion del proyecto o memoria tecnica'
            break;
          case 'CGP-LOCATION-MAP':
            clickTextAux = 'plano de ubicación del cgp/cpm'
            break;
          case 'CGP-INSTALLATION':
            clickTextAux = 'comunicar la instalación del cgp'
            break;
        }

        return clickTextAux
      }

      sendGAEvent ({
        event: 'request_funnel',
        section_name: 'mis peticiones',
        subsection_name: 'nueva peticion',
        click_text: 'enviar peticion',
        element_type: 'conversion de accion',
        page_url: window.location.href,
        request_type: 'mis solicitudes de conexion a la red',
        request_step: i.toString(),
        request_step_name: 'comentarios',
        request_number: requests.newRequestDossier.dossierCod,
        reason_request: 'quiero hacer una reclamacion',
        more_information: mappingMoreInfo(requests.newRequestSteps.step4),
        browsing_type: sessionStorage.getItem('browsing_type'),      
      })
    } else if (requests.newRequestSteps.step1 === 'FRAUD') {

      const mappingMoreInfo = (type:any):any => {
        var clickTextAux

        switch (type) {
          case 'INFO':
            clickTextAux = 'quiero hacer una consulta sobre el funcionamiento del area privada'
            break;
          case 'REPORT':
            clickTextAux = 'quiero reportar un error en el apartado mis conexiones a la red o mis peticiones'
            break;
        }
        return clickTextAux
      }
      console.log(requests.newRequestSteps.step3)
      console.log(mappingMoreInfo(requests.newRequestSteps.step3))

      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mis peticiones',
        subsection_name: 'nueva peticion',
        click_text: 'enviar peticion',
        element_type: 'conversion de accion',
        page_url: window.location.href,
        request_type: 'quiero hacer una consulta o reportar un error del area privada',
        more_information: mappingMoreInfo(requests.newRequestSteps.step3),
        request_step: '2',
        browsing_type: sessionStorage.getItem('browsing_type')
      })

    } else if (requests.newRequestSteps.step1 === 'SELFCONSUMPTION') {

      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mis peticiones',
        subsection_name: 'nueva peticion',
        click_text: 'enviar peticion',
        element_type: 'conversion de accion',
        page_url: window.location.href,
        request_type: 'quiero informacion general sobre autoconsumo',
        browsing_type: sessionStorage.getItem('browsing_type')
      })

    } else {

      const mappingMoreInfo = (type:any):any => {
        var clickTextAux

        switch (type) {
          case 'INFO':
            clickTextAux = 'quiero hacer una consulta sobre el funcionamiento del area privada'
            break;
          case 'REPORT':
            clickTextAux = 'quiero reportar un error en el apartado mis conexiones a la red o mis peticiones'
            break;
        }
        return clickTextAux
      }

      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mis peticiones',
        subsection_name: 'nueva peticion',
        click_text: 'enviar peticion',
        element_type: 'conversion de accion',
        page_url: window.location.href,
        request_type: 'quiero hacer una consulta o reportar un error del area privada',
        more_information: mappingMoreInfo(requests.newRequestSteps.step3),
        request_step: '2',
        browsing_type: sessionStorage.getItem('browsing_type')
      })
    }
  }

  const sendGAEventExitRequest = ():void => {

    const steps = [requests.newRequestSteps.step1, requests.newRequestSteps.step2, requests.newRequestSteps.step3, requests.newRequestSteps.step4, requests.newRequestSteps.step5, requests.newRequestSteps.step6]
    var i
    for (i = 0; i < 6; i++) {
      if (steps[i] === '') {
        break;
      }
    }
    // LCS: Enviar evento de GdC a GA - Wave 3
    if (requests.newRequestSteps.step1 === 'SUPPLY') {
      if (steps[2] === 'READING') {
        sendGAEvent({
          event: 'request_funnel',
          section_name: 'mis peticiones',
          subsection_name: 'nueva peticion',
          click_text: 'salir de la peticion',
          element_type: 'conversion de accion',
          page_url: window.location.href,
          request_type: 'mis suministros',
          request_step: '3',
          request_step_name: 'comentarios',
          cups: requests.newRequestSupply.cups,
          reason_request: 'quiero aportar la lectura de mi contador',
          browsing_type: sessionStorage.getItem('browsing_type'),
        })
      } else if (steps[2] === 'CLAIM') {
        const mappingReasonReq = (type:any):any => {
          var clickTextAux = ''
          switch (type) {
            case 'APPLIANCE-DAMAGE':
              clickTextAux = 'daños en electrodomesticos/receptores/mercancias'
              break;
            case 'OTHER-ASSETS-DAMAGE':
              clickTextAux = 'daños en otros bienes'
              break;
            case 'PERSONAL-DAMAGE':
              clickTextAux = 'daños personales'
              break;
            case 'WOODLAND-LOGGING-DAMAGE':
              clickTextAux = 'daños por tala de arbolado'
              break;
            case 'PERISHABLE-FOOD-DAMAGE':
              clickTextAux = 'daños en alimentos perecederos'
              break;
            case 'RECEIVED-COMPENSATION-DISAGREEMENTS':
              clickTextAux = 'desacuerdos con la indemnizacion recibida'
              break;
          }
          return clickTextAux
        }
        sendGAEvent({
          event: 'request_funnel',
          section_name: 'mis peticiones',
          subsection_name: 'nueva peticion',
          click_text: 'salir de la peticion',
          element_type: 'conversion de accion',
          page_url: window.location.href,
          request_type: 'mis suministros',
          request_step: '4',
          request_step_name: 'comentarios',
          cups: requests.newRequestSupply.cups,
          reason_request: 'quiero hacer una reclamacion por un daño',
          more_information: mappingReasonReq(requests.newRequestSteps.step4),
          browsing_type: sessionStorage.getItem('browsing_type'),
        })
      }
      
    } else if (requests.newRequestSteps.step1 === 'DOSSIER') {
      const mappingMoreInfo = (type:any):any => {
        var clickTextAux

        switch (type) {
          case 'TECHNICAL-ECONOMIC-DEFINITION':
            clickTextAux = 'plazo incumplido de la definicion de la propuesta previa'
            break;
          case 'JOB-EXECUTION':
            clickTextAux = 'plazo incumplido en la ejecucion de los trabajos'
            break;
          case 'PAYMENT-RETURN':
            clickTextAux = 'devolucion del cobro por cancelacion de mi solicitud de conexion'
            break;
          case 'OTHERS':
            clickTextAux = 'otros'
            break;
          case 'TECHNICAL-MEMORY':
            clickTextAux = 'documentacion del proyecto o memoria tecnica'
            break;
          case 'CGP-LOCATION-MAP':
            clickTextAux = 'plano de ubicación del cgp/cpm'
            break;
          case 'CGP-INSTALLATION':
            clickTextAux = 'comunicar la instalación del cgp'
            break;
        }

        return clickTextAux
      }

      sendGAEvent ({
        event: 'request_funnel',
        section_name: 'mis peticiones',
        subsection_name: 'nueva peticion',
        click_text: 'salir de la peticion',
        element_type: 'conversion de accion',
        page_url: window.location.href,
        request_type: 'mis solicitudes de conexion a la red',
        request_step: i.toString(),
        request_step_name: 'comentarios',
        request_number: requests.newRequestDossier.dossierCod,
        reason_request: 'quiero hacer una reclamacion',
        more_information: mappingMoreInfo(requests.newRequestSteps.step4),
        browsing_type: sessionStorage.getItem('browsing_type'),      
      })
    } else if (requests.newRequestSteps.step1 === 'FRAUD') {
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mis peticiones',
        subsection_name: 'nueva peticion',
        click_text: 'salir de la peticion',
        element_type: 'conversion de accion',
        page_url: window.location.href,
        request_type: 'quiero denunciar un fraude',
        more_information: requests.newRequestSteps.step3,
        request_step: '2',
        browsing_type: sessionStorage.getItem('browsing_type')
      })

    } else if (requests.newRequestSteps.step1 === 'SELFCONSUMPTION') {

      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mis peticiones',
        subsection_name: 'nueva peticion',
        click_text: 'salir de la peticion',
        element_type: 'conversion de accion',
        page_url: window.location.href,
        request_type: 'quiero informacion general sobre autoconsumo',
        browsing_type: sessionStorage.getItem('browsing_type')
      })

    } else {

      const mappingMoreInfo = (type:any):any => {
        var clickTextAux

        switch (type) {
          case 'INFO':
            clickTextAux = 'quiero hacer una consulta sobre el funcionamiento del area privada'
            break;
          case 'REPORT':
            clickTextAux = 'quiero reportar un error en el apartado mis conexiones a la red o mis peticiones'
            break;
        }
        return clickTextAux
      }

      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mis peticiones',
        subsection_name: 'nueva peticion',
        click_text: 'salir de la peticion',
        element_type: 'conversion de accion',
        page_url: window.location.href,
        request_type: 'quiero hacer una consulta o reportar un error del area privada',
        more_information: mappingMoreInfo(requests.newRequestSteps.step3),
        request_step: '2',
        browsing_type: sessionStorage.getItem('browsing_type')
      })
    }

    console.log(i)
  }

  return (
    <>
      <BigFileDialog
        popup={bigFilePopup}
        setPopup={setBigFilePopup}
      />
      <div className={`${classes.block} ${window.location.pathname === '/supplies/detail' && 'without-margin'} ${window.location.pathname === '/provisions/detail' && 'with-margin'}`}>
        {
          (loading || isLoading) &&
          <Spinner fixed />
        }

        <ConfirmationDialog visible={showingConfirmationDialog} setVisible={() => setShowingConfirmationDialog(false)} />

        <Dialog className={classes.dialog} open={showingDialogAlert} onClose={handleCloseDialogAlert}>
          <DialogContent className={classes.dialogContainer}>
            <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleCloseDialogAlert} />
            <Grid container className={classes.noItems}>
              {
                (requests.newRequestData.documents && requests.newRequestData.documents.length > 0) &&
                <AttachedDocuments />
              }
              <Grid container className={classes.text}>
                {t('requests.newRequest.popup.text01')}
              </Grid>
              <Grid container className={classes.text}>
                {t('requests.newRequest.popup.text02')}
              </Grid>
              <Grid container className={classes.text}>
                {t('requests.newRequest.popup.text03')}
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>

        <Grid container className={classes.container}>
          <Grid item md={10} sm={11} xs={11}>
            <div className={`${classes.goBackContainer} ${window.location.pathname === '/provisions/detail' && 'onDossier'} ${window.location.pathname === '/supplies/detail' && 'onSupply'}`}>
              <Grid container className={classes.goBack} onClick={handleClickBack}>
                <Grid item className={classes.goBackIcon}>
                  <BackIcon />
                </Grid>

                <Grid item>
                  {t('requests.newRequest.goBack')}
                </Grid>
              </Grid>
            </div>

            <div className={`${classes.title} ${window.location.pathname === '/provisions/detail' && 'without-margin'} ${window.location.pathname === '/supplies/detail' && 'onSupply'}`}>{t('requests.newRequest.form.title')}</div>

            {
              requests.newRequestSteps.step1 === 'SUPPLY' &&
              <SupplyData supplyData={supplyData} />
            }

            {
              requests.newRequestSteps.step1 === 'DOSSIER' &&
              <DossierData />
            }

            <Breadcrumbs currentStep={7} notificationListSelected={notificationListSelected} />

            {
              requests.newRequestSteps.step3 === 'ANONYMOUS' ?
                <AnonymousAlert />
                : 
                requests.newRequestSteps.step1 === 'INCIDENTS'  ?
                <Incident /> 
                :
                <>
                  <div className={classes.form}>

                    {
                      (requests.newRequestSteps.step4 === 'INSTANT-MEASUREMENT' && requests.newRequestSteps.step3 === 'LECTURA') &&
                      <>
                        <div className={classes.leyend}>{t('requests.newRequest.form.instantMeasurement.leyend')}</div>

                        <div className={classes.label}>{t('requests.newRequest.form.instantMeasurement.labels.phone')}</div>

                        <Input value={phone} onChange={({ target }) => { setPhone(target.value) }} />

                        <Grid container className={classes.timeContainer}>
                          <Grid item xs={4}>
                            <div className={classes.label}>{t('requests.newRequest.form.instantMeasurement.labels.date')}</div>
                            <Datepicker
                              date={date}
                              setDate={setDate}
                              minDate={new Date()}
                              maxDate={false}
                            />
                          </Grid>

                          <Grid className={classes.fieldTimeZone} item xs={3}>
                            <div className={classes.label}>{t('requests.newRequest.form.instantMeasurement.labels.timeZone')}</div>
                            <Datepicker
                              selected={hourFrom}
                              onChange={date => setHourFrom(date)}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={30}
                              timeCaption={t('requests.newRequest.form.instantMeasurement.labels.from')}
                              dateFormat='HH:mm'
                              isHour={true}
                            />
                          </Grid>

                          <Grid className={classes.fieldWithoutLabel} item xs={3}>
                            <Datepicker
                              selected={hourTo}
                              onChange={date => setHourTo(date)}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={30}
                              timeCaption={t('requests.newRequest.form.instantMeasurement.labels.to')}
                              dateFormat='HH:mm'
                              isHour={true}
                            />
                          </Grid>
                        </Grid>
                      </>
                    }

                    {requests.newRequestSteps.step3 === 'READING' &&
                      <Grid container direction='row' md={12} className={classes.readingsContainer}>
                        <Grid item direction='column' md={6}>
                          <Grid container className={classes.readingPeriod} md={12}>
                            <Grid container md={6} alignItems='center'>
                              <Grid item className={classes.readingLabel}>{t('requests.newRequest.form.readings.total')}</Grid>
                            </Grid>
                            <Grid container md={6} alignItems='center'>
                              <Grid item className={classes.readingLabel}>{t('requests.newRequest.form.readings.value0')}</Grid>
                              <Grid item className={classes.readingInput}><Input value={periods.total} size={4} onChange={({ target }) => { setPeriods({ ...periods, total: target.value }) }} /></Grid>
                              <Grid item className={classes.unitLabel}>{t('common.units.kWh')}</Grid>
                            </Grid>
                          </Grid>
                          <Grid container className={classes.readingPeriod} md={12}>
                            <Grid container md={6} alignItems='center'>
                              <Grid item className={classes.readingLabel}>{t('requests.newRequest.form.readings.tip')}</Grid>
                            </Grid>
                            <Grid container md={6} alignItems='center'>
                              <Grid item className={classes.readingLabel}>{t('requests.newRequest.form.readings.value1')}</Grid>
                              <Grid item className={classes.readingInput}><Input value={periods.tip} size={4} onChange={({ target }) => { setPeriods({ ...periods, tip: target.value }) }} /></Grid>
                              <Grid item className={classes.unitLabel}>{t('common.units.kWh')}</Grid>
                            </Grid>
                          </Grid>
                          <Grid container className={classes.readingPeriod} md={12}>
                            <Grid container md={6} alignItems='center'>
                              <Grid item className={classes.readingLabel}>{t('requests.newRequest.form.readings.shallow')}</Grid>
                            </Grid>
                            <Grid container md={6} alignItems='center'>
                              <Grid item className={classes.readingLabel}>{t('requests.newRequest.form.readings.value2')}</Grid>
                              <Grid item className={classes.readingInput}><Input value={periods.shallow} size={4} onChange={({ target }) => { setPeriods({ ...periods, shallow: target.value }) }} /></Grid>
                              <Grid item className={classes.unitLabel}>{t('common.units.kWh')}</Grid>
                            </Grid>
                          </Grid>
                          <Grid container className={classes.readingPeriod} md={12}>
                            <Grid container md={6} alignItems='center'>
                              <Grid item className={classes.readingLabel}>{t('requests.newRequest.form.readings.valley')}</Grid>
                            </Grid>
                            <Grid container md={6} alignItems='center'>
                              <Grid item className={classes.readingLabel}>{t('requests.newRequest.form.readings.value3')}</Grid>
                              <Grid item className={classes.readingInput}><Input value={periods.valley} size={4} onChange={({ target }) => { setPeriods({ ...periods, valley: target.value }) }} /></Grid>
                              <Grid item className={classes.unitLabel}>{t('common.units.kWh')}</Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item direction='column' md={5}>
                          <Grid>
                            <iframe
                              title='vimeo-player'
                              src='https://player.vimeo.com/video/605451331?h=3d5e25124b'
                              width='490'
                              height='210'
                              frameBorder='0'
                              allowFullScreen
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    }

                    {requests.newRequestSteps.step1 !== 'CUT' &&
                      <Comment />
                    }

                    {/*List con los documentos obligatorios*/}
                    {(documentationList && documentationList.length > 0) &&
                      <DocumentationList
                        items={documentationList}
                        handleChangeActualRed={handleChangeActualRed}
                        setLoading={setLoading}
                        setBigFilePopup={setBigFilePopup}
                      />
                    }

                    {/*(documentationList && documentationList.length < 1) &&*/
                      <div className={classes.description}>{t('requests.newRequest.form.documentAttachment.description')}</div>
                    }

                    {/*item que contiene el documento opcional*/}
                    <Grid container className={classes.items}>
                      <Grid item md={12} sm={12} xs={12}>
                        <Item item={optionalDocument} setBigFilePopup={setBigFilePopup} setLoading={setLoading} />
                      </Grid>
                    </Grid>

                    {
                      requests.newRequestSteps.step1 === 'CUT' ?
                        <>
                          {
                            requests.newRequestSteps.step3 === 'BTEN' ?
                              <BtenForm
                                btenData={btenData}
                                setBtenData={setBtenData}
                                btenErrors={btenErrors}
                                setBtenErrors={setBtenErrors}
                              />
                              :
                              requests.newRequestSteps.step3 === 'PRIVATE' ?
                                <PrivateForm
                                  pvtData={pvtData}
                                  setPvtData={setPvtData}
                                  pvtErrors={pvtErrors}
                                  setPvtErrors={setPvtErrors}
                                />
                                :
                                requests.newRequestSteps.step3 === 'PROXIMITY' &&
                                <ProximityForm
                                  proximityData={proximityData}
                                  setProximityData={setProximityData}
                                  proximityErrors={proximityErrors}
                                  setProximityErrors={setProximityErrors}
                                  setIsAddressForm={setIsAddressForm}
                                />
                          }
                        </>
                        :
                        <>
                          {/* {
                          (documentationList && documentationList.length > 0) &&
                          <DocumentationList items={documentationList} />
                        } */}

                          {
                            handleCheckAddressFormAvailability() &&
                            <AddressForm
                              addressData={addressData}
                              setAddressData={setAddressData}
                              addressErrors={addressErrors}
                              setAddressErrors={setAddressErrors}
                            />
                          }
                        </>
                    }

                    {/* {
                    //mostrar documentos cargados en la peticion
                    (requests.newRequestData.documents && requests.newRequestData.documents.length > 0) &&
                    <AttachedDocuments />
                  } */}

                    {/* boton que se tiene que quitar */}
                    {/* {
                    (requests.newRequestSteps.step4 !== 'INSTANT-MEASUREMENT') &&
                    <DocumentAttachment setLoading={setLoading} setIsLoading={setIsLoading} />
                  } */}

                    <div className={classes.help}>{t('requests.newRequest.form.documentAttachment.help')}</div>
                  </div>

                  {/* {campos marcados son obligatorios no borrar} */}
                  <div className={classes.requiredFields}>{t('requests.newRequest.form.requiredFields')}</div>

                  <Grid container className={classes.buttons} spacing={4}>
                    {/* // boton para enviar peticion */}
                    <Grid item md='auto' sm={12} xs={12}>
                      <Button
                        text={t('common.buttons.sendRequest')}
                        color='primary'
                        size='large'
                        variant='contained'
                        disabled={false}
                        onClick={() => {(requests.newRequestSteps.step3 === 'NOTIFICATIONS' ? handleClickSendNotif() : handleClickSend())}}
                      />
                    </Grid>
                    {/* eliminar peticion */}
                    <Grid item md='auto' sm={12} xs={12}>
                      <div className={classes.exit}>
                        {
                          (window.location.pathname === '/supplies/detail' || window.location.pathname === '/provisions/detail') ?
                            <span
                              onClick={() => {
                                console.log('requestCancel', requests)
                                sendGAEventExitRequest()
                                setCreatingNewRequest(false)
                                setCreatingNewRequestFromMeter(0)
                              }}
                            >
                              {t('requests.newRequest.exit')}
                            </span>
                            :
                            <Link onClick={() => {sendGAEventExitRequest()}} to='/requests'>{t('requests.newRequest.exit')}</Link>
                        }
                      </div>
                    </Grid>
                  </Grid>
                </>
            }
          </Grid>
        </Grid>
      </div>
    </>
  )
}

export default Form
