import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import Switch from '../../../../common/components/switch/Switch'
import Checkbox from '../../../../common/components/checkbox/Checkbox'
import Dialog from '../../../../sign-up/components/dialog/Dialog'
import Input from '../../../../common/components/input/Input'

import ApplicantDataIcon from '../../../../assets/icons/datos_solicitante.svg'
import PayerDataIcon from '../../../../assets/icons/desplegable_datos_facturacion.svg'
import ContactDataIcon from '../../../../assets/icons/contacto.svg'
import CheckIcon from '../../../../assets/icons/Interfaz_22_check_tick_preguntas.svg'
import CheckIconGreen from '../../../../assets/icons/aviso_ok.svg'
import AddIcon from '../../../../assets/icons/mas.svg'
import ArchiveIcon from '../../../../assets/icons/flecha_down_blue.svg'
import DeleteIcon from '../../../../assets/icons/cerrar.svg'
import DownloadIcon from '../../../../assets/icons/icon_DescargarAutorizcion.svg'
import NewTabIcon from '../../../../assets/icons/icon_OpenTab.svg'
import { validateMail, validateIdentityCard } from '../../../../common/lib/ValidationLib'
import { formatDateZeus, formatDateAndHourString, formatDateAndHourZeus } from '../../../../common/lib/FormatLib'

import PersonData from './person-data/PersonData'
/*import SmallPersonData from './small-person-data/SmallPersonData'*/
import DigitalBill from './digital-bill/DigitalBill'
import BillDirection from './bill-direction/BillDirection'
import {
  setCustomerApplicant,
  setCustomerOwner,
  setCustomerPayer,
  setDeliveryAddress,
  setInvoiceAddress,
  setContactList,
  setConsentThirdAssignmentOwner,
  setConsentThirdAssignmentPayer,
  setBillingEmail
						   
} from '../../../store/actions/ProvisionsActions'

import { thunkCreateDocumentoCargaOffline, thunkGetDigitalBillingCompany, thunkGetDocumentosCargaOffline } from '../../../store/actions/ProvisionsThunkActions'

import useStyles from './ApplicantData.styles'
import { InputBase, Tooltip, useMediaQuery } from '@material-ui/core'
import { thunkCreateDocument } from '../../../../requests/store/actions/RequestsThunkActions'
import { resetNewRequestDataDocument, setNewRequestDataDocument } from '../../../../requests/store/actions/RequestsActions'
import Spinner from '../../../../common/components/spinner/Spinner'

const ApplicantData = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    state,
    setNewCustomers,
    setIsEmpty,
    setErrorCheck,
    acceptPrivacy,
    setAcceptPrivacy,
    isDigitalBillingCompany,
    setIsDigitalBillingCompany,
    owner,
    setOwner,
    payer,
    setPayer,
    billDirection,
    setBillDirection,
    datosUser,
    indAceptoFacturaDigital,
    setIndAceptoFacturaDigital,
    setBillEmail,
    billingEmail,
    setbillingEmail,
    history,
    declareDocumentValid,
    declareDocumentValidOwner,
    setDeclareDocumentValidOwner,
    declareDocumentValidPayer,
    setDeclareDocumentValidPayer,
    ownerData,
    setOwnerData,
    payerData,
    setPayerData
  } = props

  // const emptyPersonData = {
  //   customerName: '',
  //   surname1: '',
  //   telephone1: '',
  //   streetType: '',
  //   streetName: '',
  //   addNumber: '',
  //   town: '',
  //   docNumber: '',
  //   email1: '',
  //   zipcode: '',
  //   state: ''
  // } as any

  // const [personData, setPersonData] = useState(emptyPersonData)

  const [errors, setErrors] = useState({
    email1: false,
  })

  const user = useSelector((state: any) => state.user.profile)
  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)

  const customerApplicantData = useSelector((state: any) => state.provisions.customerApplicantData)
  const customerApplicant = useSelector((state: any) => state.provisions.customerApplicant)
  const customerPayer = useSelector((state: any) => state.provisions.customerPayer)
  const customerOwner = useSelector((state: any) => state.provisions.customerOwner)																															 
  const cadastreDataItem = useSelector((state: any) => state.provisions.cadastreData.item)

  const [applicantExists, setApplicantExists] = useState(true)
  const [ownerExists, setOwnerExists] = useState(true)
  const [payerExists, setPayerExists] = useState(true)
  const [documentOwner, setDocumentOwner] = useState('')
  const [documentPayer, setDocumentPayer] = useState('')

  const [isEmptyApplicant, setIsEmptyApplicant] = useState(true)
  const [isEmptyOwner, setIsEmptyOwner] = useState(true)
  const [isEmptyPayer, setIsEmptyPayer] = useState(true)
  const [isEmptyBillDirection, setIsEmptyBillDirection] = useState(true)
  const [isEmptyDigitalBill, setIsEmptyDigitalBill] = useState(true)
  const [isIdDocumentEmptyOwner, setIsIdDocumentEmptyOwner ] = useState(true)
  const [isIdDocumentEmptyPayer, setIsIdDocumentEmptyPayer ] = useState(true)
  /*const [ isEmptyContact, setIsEmptyContact ] = useState(true)*/

  const [errorsApplicant, setErrorsApplicant] = useState(true)
  const [errorsOwner, setErrorsOwner] = useState(true)
  const [mostrarOwner, setMostrarOwner] = useState(false)
  const [errorsPayer, setErrorsPayer] = useState(true)
  const [errorsBillDirection, setErrorsBillDirection] = useState(true)
  const [errorsDigitalBill, setErrorsDigitalBill] = useState(true)
  /*const [ errorsContact, setErrorsContact ] = useState(true)*/

  const [showingDialog, setShowingDialog] = useState(false)

  const [invalidEmail, setInvalidEmail] = useState(false)

  const [loadingConfirmation, setLoadingConfirmation] = useState(false)  
  const [isLoadingSearch, setIsLoadingSearch] = useState(false)

  const isConnectionRequestOwner = window.location.href.includes('new-provision') || window.location.href.includes('edit-installations') || window.location.href.includes('new-generation')
  const isConnectionRequestPayer = isConnectionRequestOwner || window.location.href.includes('edit-provision')

  useEffect(() => {
    setAcceptPrivacy(true)
  },[])

  useEffect(() => {
    if (owner && documentOwner === customerApplicant.docNumber) {
      setOwner(false)
      setDocumentOwner('')
    }
  }, [documentOwner, owner])

  useEffect(() => {
    if (payer && documentPayer === customerApplicant.docNumber) {
      setPayer(false)
      setDocumentPayer('')
    }
  }, [documentPayer, payer])

  // Comprobar si el DNI del pagador esta en la tabla digitalBillingCompany
  useEffect(() => {
    if (currentProvision.dossierCod || (payer && customerPayer.docNumber) || (!payer && customerApplicant.docNumber)) {
      let docNumber = payer ? customerPayer.docNumber : customerApplicant.docNumber

      if (currentProvision.dossierCod) {
        docNumber = currentProvision.applicant.docNumber
      }

      if ((currentProvision.dossierCod && typeof (docNumber) !== 'undefined' && validateIdentityCard(docNumber) && docNumber !== '') || (typeof (docNumber) !== 'undefined' && validateIdentityCard(docNumber) && docNumber !== '')) {
        dispatch(thunkGetDigitalBillingCompany(docNumber, (response) => {
          if (response) {
            setIsDigitalBillingCompany(response.isDigitalBillingCompany)
          }
        }))
      }
    }
    // eslint-disable-next-line
  }, [currentProvision, customerApplicant.docNumber, customerPayer.docNumber, payer])

  useEffect(() => {
    let customers = [] as any
    if (!applicantExists) {
      customers.push('applicant')
    }
    if (!ownerExists) {
      customers.push('owner')
    }
    if (!payerExists) {
      customers.push('payer')
    }
    setNewCustomers(customers)
    // eslint-disable-next-line
  }, [applicantExists, ownerExists, payerExists])

  // Comprobar si los formularios estan rellenados
  useEffect(() => {
    if (isEmptyApplicant || isEmptyOwner || isEmptyPayer || isEmptyBillDirection || isEmptyDigitalBill /*|| isEmptyContact*/) {
      setIsEmpty(true)
    } else {
      setIsEmpty(false)
    }
    // eslint-disable-next-line
  }, [isEmptyApplicant, isEmptyOwner, isEmptyPayer, isEmptyBillDirection, isEmptyDigitalBill/*, isEmptyContact*/])

  // Comprobar si hay errores en los formularios
  useEffect(() => {
    if (errorsApplicant || errorsOwner || errorsPayer || errorsBillDirection || errorsDigitalBill /*|| errorsContact*/) {
      setErrorCheck(true)
    } else {
      setErrorCheck(false)
    }
    // eslint-disable-next-line
  }, [errorsApplicant, errorsOwner, errorsPayer, errorsBillDirection, errorsDigitalBill/*, errorsContact*/])

  // Comprobar si hay formularios rellenados con los datos del applicant,
  // se eliminan los errores/emptys de dichos formularios
  useEffect(() => {
    if (!owner) {
      setIsEmptyOwner(false)
      setErrorsOwner(false)
      setOwnerExists(true)
      setDeclareDocumentValidOwner && setDeclareDocumentValidOwner(true)
    } else {
      setIsEmptyOwner(true)
      setErrorsOwner(true)
      setDeclareDocumentValidOwner && setDeclareDocumentValidOwner(false)
    }
  }, [owner])

  useEffect(() => {
    if (!payer) {
      setIsEmptyPayer(false)
      setErrorsPayer(false)
      setPayerExists(true)
      setDeclareDocumentValidPayer && setDeclareDocumentValidPayer(true)
    } else {
      setIsEmptyPayer(true)
      setErrorsPayer(true)
      setDeclareDocumentValidPayer && setDeclareDocumentValidPayer(false)
    }
  }, [payer])

  useEffect(() => {
    if (!billDirection) {
      setIsEmptyBillDirection(false)
      setErrorsBillDirection(false)
    } else {
      setIsEmptyBillDirection(true)
      setErrorsBillDirection(true)
    }
  }, [billDirection])

  /*useEffect(() => {
    if (!contact) {
      setIsEmptyContact(false)
      setErrorsContact(false)
    } else {
      setIsEmptyContact(true)
      setErrorsContact(true)
    }
  }, [ contact ])*/

  // Comprobacion facturacion digital
  useEffect(() => {
    if ((customerPayer.docNumber && customerPayer.docNumber.slice(0, 1) === 'P') ||
      (customerPayer.docNumber && customerPayer.docNumber.slice(0, 1) === 'Q') ||
      isDigitalBillingCompany) {
      setIsEmptyDigitalBill(true)
      setErrorsDigitalBill(true)
    } else {
      setIsEmptyDigitalBill(false)
      setErrorsDigitalBill(false)
    }
  }, [customerPayer, isDigitalBillingCompany])

  useEffect(() => {
    if (datosUser && datosUser.preType) {
      if (datosUser.isOwner) {
        setOwner(false)
      } else {
        setOwner(true)
      }
    }
    if (!indAceptoFacturaDigital) {
      if (state >=2) {
        setIndAceptoFacturaDigital('0')
      } else {
        setIndAceptoFacturaDigital('1')
      }
    }
  }, [])

  const handleSetOwner = (e) => {
    if (e.target.checked) {
        setOwner(true)
    } else {
      setOwner(false)
      setIsIdDocumentEmptyOwner(true)
    }
  }

  const handleSetOwner2 = () => {
    setMostrarOwner(!mostrarOwner)
  }

  const handleSetPayer = (e) => {
    if (e.target.checked) {
      setPayer(true)
      setbillingEmail('');
      setIsIdDocumentEmptyPayer(true)
    } else {
      setPayer(false) 
      //setbillingEmail('')
    }

    setIndAceptoFacturaDigital('1')
    setBillDirection(false)
    setBillEmail(false)
  }

  const handleSetDigitalBill = (e) => {
    if (e.target.checked) {
      setIndAceptoFacturaDigital('0')
      setbillingEmail('')
      dispatch(setBillingEmail(''))
    } else {
       
      setIndAceptoFacturaDigital('1')				   
      setBillDirection(false)
    
      
    }
  }

  const handleSetBillDirection = (e) => {
    if (e.target.checked) {
      setBillDirection(true)
    } else {
      setBillDirection(false)
    }
  }

  const handleOpenPolicyDialog = (e) => {
    e.preventDefault()

    setShowingDialog(true)
  }

  useEffect(() => {
    if (!owner) {
      dispatch(setConsentThirdAssignmentOwner('0'))

      dispatch(setCustomerOwner({ idRelationship: customerApplicant.idRelationship }))
    } else {
      dispatch(setConsentThirdAssignmentOwner('1'))
    }

    if (!payer) {
      dispatch(setConsentThirdAssignmentPayer('0'))

      dispatch(setCustomerPayer({ idRelationship: customerApplicant.idRelationship }))
    } else {
      dispatch(setConsentThirdAssignmentPayer('1'))
    }

    let deliveryAddressData = {
      state: (customerApplicantData && customerApplicantData.state) ? customerApplicantData.state : '',
      town: (customerApplicantData && customerApplicantData.town) ? customerApplicantData.town : '',
      streetType: (customerApplicantData && customerApplicantData.streetType) ? customerApplicantData.streetType : '',
      streetName: (customerApplicantData && customerApplicantData.streetName) ? customerApplicantData.streetName : '',
      addNumber: (customerApplicantData && customerApplicantData.addNumber) ? customerApplicantData.addNumber : '',
      stair: (customerApplicantData && customerApplicantData.stair) ? customerApplicantData.stair : '',
      floor: (customerApplicantData && customerApplicantData.floor) ? customerApplicantData.floor : '',
      door: (customerApplicantData && customerApplicantData.door) ? customerApplicantData.door : '',
      zipcode: (customerApplicantData && customerApplicantData.zipcode) ? customerApplicantData.zipcode : ''
    } as any

    if (customerApplicantData && customerApplicantData.telephone1) {
      deliveryAddressData = {
        ...deliveryAddressData,
        phone: customerApplicantData.telephone1
      }
    }

    if (customerApplicant && customerApplicant.stair) {
      deliveryAddressData = {
        ...deliveryAddressData,
        stair: customerApplicant.stair
      }
    }

    if (customerApplicant && customerApplicant.portal) {
      deliveryAddressData = {
        ...deliveryAddressData,
        portal: customerApplicant.portal
      }
    }

    if (customerApplicant && customerApplicant.floor) {
      deliveryAddressData = {
        ...deliveryAddressData,
        floor: customerApplicant.floor
      }
    }

    if (customerApplicant && customerApplicant.door) {
      deliveryAddressData = {
        ...deliveryAddressData,
        door: customerApplicant.door
      }
    }

    dispatch(setDeliveryAddress(deliveryAddressData))
    // eslint-disable-next-line
  }, [customerApplicant, owner, payer])

  useEffect(() => {
    let invoiceAddressData = {} as any

    if (billDirection) {
      invoiceAddressData = {
        state: '',
        town: '',
        streetType: '',
        streetName: '',
        addNumber: '',
        zipcode: ''
      }
    } else {
      invoiceAddressData = {
        state: (customerApplicantData && customerApplicantData.state) ? customerApplicantData.state : '',
        town: (customerApplicantData && customerApplicantData.town) ? customerApplicantData.town : '',
        streetType: (customerApplicantData && customerApplicantData.streetType) ? customerApplicantData.streetType : '',
        streetName: (customerApplicantData && customerApplicantData.streetName) ? customerApplicantData.streetName : '',
        addNumber: (customerApplicantData && customerApplicantData.addNumber) ? customerApplicantData.addNumber : '',
        stair: (customerApplicantData && customerApplicantData.stair) ? customerApplicantData.stair : '',
        floor: (customerApplicantData && customerApplicantData.floor) ? customerApplicantData.floor : '',
        door: (customerApplicantData && customerApplicantData.door) ? customerApplicantData.door : '',
        zipcode: (customerApplicantData && customerApplicantData.zipcode) ? customerApplicantData.zipcode : ''
      }

      if (customerApplicantData && customerApplicantData.telephone1) {
        invoiceAddressData = {
          ...invoiceAddressData,
          phone: customerApplicantData.telephone1
        }
      }

      if (customerApplicant && customerApplicant.stair) {
        invoiceAddressData = {
          ...invoiceAddressData,
          stair: customerApplicant.stair
        }
      }

      if (customerApplicant && customerApplicant.portal) {
        invoiceAddressData = {
          ...invoiceAddressData,
          portal: customerApplicant.portal
        }
      }

      if (customerApplicant && customerApplicant.floor) {
        invoiceAddressData = {
          ...invoiceAddressData,
          floor: customerApplicant.floor
        }
      }

      if (customerApplicant && customerApplicant.door) {
        invoiceAddressData = {
          ...invoiceAddressData,
          door: customerApplicant.door
        }
      }
    }

    dispatch(setInvoiceAddress(invoiceAddressData))
    // eslint-disable-next-line
  }, [customerApplicant, billDirection])

  useEffect(() => {
    const address = {
      streetName: cadastreDataItem.domicilioTributario && cadastreDataItem.domicilioTributario.locBienUrbano && cadastreDataItem.domicilioTributario.locBienUrbano.locUrbana && cadastreDataItem.domicilioTributario.locBienUrbano.locUrbana.direccion && cadastreDataItem.domicilioTributario.locBienUrbano.locUrbana.direccion.nombreVia,
      addNumber: cadastreDataItem.domicilioTributario && cadastreDataItem.domicilioTributario.locBienUrbano && cadastreDataItem.domicilioTributario.locBienUrbano.locUrbana && cadastreDataItem.domicilioTributario.locBienUrbano.locUrbana.direccion && cadastreDataItem.domicilioTributario.locBienUrbano.locUrbana.direccion.numero1Policia,
      zipcode: cadastreDataItem.domicilioTributario && cadastreDataItem.domicilioTributario.locBienUrbano && cadastreDataItem.domicilioTributario.locBienUrbano.locUrbana && cadastreDataItem.domicilioTributario.locBienUrbano.locUrbana.codPostal,
      state: cadastreDataItem.domicilioTributario && cadastreDataItem.domicilioTributario.nombreMunicipio,
      town: cadastreDataItem.domicilioTributario && cadastreDataItem.domicilioTributario.nombreMunicipio
    }

    dispatch(setContactList(
      /*contact ?
        [
          {
            name: '',
            surname1: '',
            valuePhone1: '',
            valueEmail: ''
          }
        ]
      :*/
      [
        {
          name: customerApplicantData.customerName ? customerApplicantData.customerName : user.name,
          surname1: (customerApplicantData.surname1 && customerApplicantData.surname2) ? (customerApplicantData.surname1 + ' ' + customerApplicantData.surname2) : user.surName,
          valuePhone1: customerApplicantData.telephone1 ? customerApplicantData.telephone1 : user.phone,
          valueEmail: customerApplicantData.email1 ? customerApplicantData.email1 : user.email,
          address: address.streetName + ' ' + address.addNumber + ' ' + address.zipcode + ' ' + address.state + ' ' + address.town
        }
      ]
    ))
    // eslint-disable-next-line
  }, [customerApplicant/*, contact*/])

  // const handleData = (e, field) => {
  //   const auxPersonData = personData

  //   const auxPersonData2 = {
  //     ...auxPersonData,
  //     [field]: e.target.value
  //   }

  //   setPersonData(auxPersonData2)
  // }

  const validateEmail = (e) => {
    if (validateMail(e.target.value)) {
      setInvalidEmail(false)

      setErrors({ ...errors, email1: false })
    } else {
      if (e.target.value !== '') {
        setInvalidEmail(true)
      } else {
        setInvalidEmail(false)
      }
      setErrors({ ...errors, email1: true })
    }
  }

  // const setErrorsAndUpdate = (data) => {
  //   setErrors(data)

  // }

  return (
    <Grid container justifyContent='space-between'>
      <Dialog
        showingDialog={showingDialog}
        closeDialog={() => setShowingDialog(false)}
      />

      <PersonData
        readOnly={state >= 2}
        applicantData
        userExists={applicantExists}
        setUserExists={setApplicantExists}
        updateStateFunction={setCustomerApplicant}
        setIsEmpty={setIsEmptyApplicant}
        setErrorCheck={setErrorsApplicant}
        datosUser={datosUser}
        setLoadingSearch={setIsLoadingSearch}
      />

      <Grid container alignItems='center' className={classes.subtitleBlock}>
        <Grid item xs={12} sm={10} md={10} lg='auto'>
          <div className={classes.subtitle4}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.newInfo')}</div>
        </Grid>
      </Grid>

      {!payer && (
        (
          (customerPayer.docNumber && customerPayer.docNumber.slice(0, 1) === 'P') ||
          (customerPayer.docNumber && customerPayer.docNumber.slice(0, 1) === 'Q') ||
          (currentProvision.payer && currentProvision.payer.docNumber && currentProvision.payer.docNumber.slice(0, 1) === 'P') ||
          (currentProvision.payer && currentProvision.payer.docNumber && currentProvision.payer.docNumber.slice(0, 1) === 'Q') ||
          isDigitalBillingCompany
        )
      ) &&
        <DigitalBill
          state={state}
          setIsEmpty={setIsEmptyDigitalBill}
          setErrorCheck={setErrorsDigitalBill}
        />
      }

      <Grid container justifyContent='space-between' alignItems='center'>
        <Grid item>
          <div className={classes.question}>
            {t('provisions.newProvision.requestData.supplyType.form.applicantData.applicantData.questions.owner')}
          </div>
          {mostrarOwner &&
            <div className={classes.question}>
              {t('PreType.prueba1')}
            </div>
          }
        </Grid>
        <Grid item>
          {datosUser && datosUser.preType ?
            <Switch
              disabled={true}
              checked={owner}
              onClick={handleSetOwner2}
            />
            :
            <Switch
              onChange={handleSetOwner}
              disabled={state >= 2}
              checked={(owner || (state >= 2 && currentProvision && (currentProvision.applicant && currentProvision.owner && currentProvision.applicant.idRelationship !== currentProvision.owner.idRelationship)))}
            />
          }
        </Grid>
      </Grid>

      {(owner || (state >= 2 && currentProvision && (currentProvision.applicant.idRelationship !== currentProvision.owner.idRelationship))) &&
        <>
          <Grid container alignItems='center' direction='row' className={classes.subtitleBlock}>
            <Grid item className={classes.subtitleIcon}>
              <img src={ApplicantDataIcon} alt='' />
            </Grid>
            <Grid item className={classes.subtitleGrid}>
              <div className={classes.subtitle}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.owner')}</div>
            </Grid>
          </Grid>
          <PersonData
            readOnly={state >= 2}
            userExists={ownerExists}
            setUserExists={setOwnerExists}
            updateStateFunction={setCustomerOwner}
            setIsEmpty={setIsEmptyOwner}
            setErrorCheck={setErrorsOwner}
            type={'owner'}
            setType={setOwner}
            person={owner}
            datosUser={datosUser}
            setLoadingConfirmation={setLoadingConfirmation}
            setDocumentValue={setDocumentOwner}
            setIsIdDocumentEmpty={setIsIdDocumentEmptyOwner}
            setLoadingSearch={setIsLoadingSearch}
          />
          {!loadingConfirmation && isConnectionRequestOwner && !isIdDocumentEmptyOwner && !(documentOwner === customerApplicant.docNumber) && 
            <ConnectionRequest 
              docType={'DOCTYP0343'}
              declareDocumentValid={declareDocumentValidOwner}
              setDeclareDocumentValid={setDeclareDocumentValidOwner}
              ownerData={ownerData}
              setOwnerData={setOwnerData}
              payerData={payerData}
              setPayerData={setPayerData}
              userExists={ownerExists}
            />
          }
        </>
      }

      <Grid container className={classes.separator} />

      <Grid container justifyContent='space-between' alignItems='center'>
        <Grid item>
          <div className={classes.question}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.applicantData.questions.payer')}</div>
        </Grid>
        <Grid item>
          <Switch onChange={handleSetPayer} disabled={state >= 2} checked={(payer || (state >= 2 && currentProvision && (currentProvision.applicant.idRelationship !== currentProvision.payer.idRelationship)))} />
        </Grid>
      </Grid>

      {(payer || (state >= 2 && currentProvision && (currentProvision.applicant.idRelationship !== currentProvision.payer.idRelationship))) &&
        <>
          <Grid container alignItems='center' direction='row' className={classes.subtitleBlock}>
            <Grid item className={classes.subtitleIcon}>
              <img src={PayerDataIcon} alt='' />
            </Grid>
            <Grid item className={classes.subtitleGrid}>
              <div className={classes.subtitle}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.payer')}</div>
            </Grid>
          </Grid>
          <PersonData
            readOnly={state >= 2}
            userExists={payerExists}
            setUserExists={setPayerExists}
            updateStateFunction={setCustomerPayer}
            setIsEmpty={setIsEmptyPayer}
            setErrorCheck={setErrorsPayer}
            type={'payer'}
            setType={setPayer}
            person={payer}
            datosUser={datosUser}
            setLoadingConfirmation={setLoadingConfirmation}
            setDocumentValue={setDocumentPayer}
            setIsIdDocumentEmpty={setIsIdDocumentEmptyPayer}
            setLoadingSearch={setIsLoadingSearch}
          />
          {!loadingConfirmation && isConnectionRequestPayer && !isIdDocumentEmptyPayer && !(documentPayer === customerApplicant.docNumber) &&
            <ConnectionRequest 
              docType={'DOCTYP0344'}
              declareDocumentValid={declareDocumentValidPayer}
              setDeclareDocumentValid={setDeclareDocumentValidPayer}
              ownerData={ownerData}
              setOwnerData={setOwnerData}
              payerData={payerData}
              setPayerData={setPayerData}
              userExists={payerExists}
            />
          }
        </>
      }

      {payer && (
        (
          (customerPayer.docNumber && customerPayer.docNumber.slice(0, 1) === 'P') ||
          (customerPayer.docNumber && customerPayer.docNumber.slice(0, 1) === 'Q') ||
          (currentProvision.payer && currentProvision.payer.docNumber && currentProvision.payer.docNumber.slice(0, 1) === 'P') ||
          (currentProvision.payer && currentProvision.payer.docNumber && currentProvision.payer.docNumber.slice(0, 1) === 'Q') ||
          isDigitalBillingCompany
        )
      ) &&
        <DigitalBill
          state={state}
          setIsEmpty={setIsEmptyDigitalBill}
          setErrorCheck={setErrorsDigitalBill}
        />
      }

      {indAceptoFacturaDigital === '' &&
        setIndAceptoFacturaDigital('0')
      }

      {/* {indAceptoFacturaDigital==='1' && !billingEmail &&
        setbillingEmail(customerApplicantData.email1 ? customerApplicantData.email1 : user.email)
      } */}

     
          <Grid container className={classes.separator} />
     {/* Eliminado condicional */}
          <Grid container justifyContent='space-between' alignItems='center'>
            <Grid item>
              <div className={classes.question}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.applicantData.questions.digitalBill')}</div>
            </Grid>
            <Grid item>
              <Switch onChange={handleSetDigitalBill} disabled={state >= 2} checked={indAceptoFacturaDigital === '1' ? false : true} />
            </Grid>
          </Grid>
        
      

      {(indAceptoFacturaDigital === '1' ) &&
        <>
          <Grid container alignItems='center' className={classes.subtitleBlock}>
            <Grid item xs={12} sm={10} md={10} lg='auto'>
            <div className={classes.subtitle}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.emailinfo1')}</div>
              <div className={classes.subtitle}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.emailinfo2')}</div>
              <div className={classes.subtitle2}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.email')}</div>
            </Grid>
          </Grid>
          <Grid container direction='column' item md={6} className={classes.inputContainer}>
            <Grid item className={classes.input}>
              <Input
                disabled={state >= 2}
                placeholder={''}
                fullWidth
                // value={state >= 2 ?  billingEmail : (billingEmail && billingEmail !== '') ? billingEmail : (customerApplicantData.email1 ? customerApplicantData.email1 : user.email)}

                value={state >= 2 ?  billingEmail : (billingEmail && billingEmail !== '') ? billingEmail : ''}
                onChange={(e) => setbillingEmail(e.target.value)}
                onBlur={validateEmail}
                error={errors.email1}
                helperText={errors.email1 &&
                  (invalidEmail ?
                    t('provisions.newProvision.requestData.supplyType.form.errors.invalidEmail')
                    :
                    t('provisions.newProvision.requestData.supplyType.form.errors.required'))}
              />
            </Grid>
          </Grid>
        </> 
      }


      { (indAceptoFacturaDigital !== '1' ) && 
        <>
          <Grid container className={classes.separator} />

          <Grid container justifyContent='space-between' alignItems='center'>
            <Grid item>
              <div className={classes.question}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.applicantData.questions.billDirection')}</div>
            </Grid>
            <Grid item>
              <Switch onChange={handleSetBillDirection} checked={billDirection} disabled={state >= 2} />
            </Grid>
          </Grid>
        </>
      }

      {(indAceptoFacturaDigital !== '1'  && billDirection) &&
        <>
          <Grid container alignItems='center' className={classes.subtitleBlock}>
            <Grid item sm={2} md={2} lg='auto' className={classes.subtitleIcon}>
              <img src={ContactDataIcon} alt='' />
            </Grid>
            <Grid item xs={12} sm={10} md={10} lg='auto'>
              <div className={classes.subtitle}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.bill')}</div>
            </Grid>
          </Grid>
          <BillDirection
            state={state}
            setIsEmpty={setIsEmptyBillDirection}
            setErrorCheck={setErrorsBillDirection}
          />
        </>
      }

    </Grid>
  )
}

export const ConnectionRequest = (props: any) => {  
  const classes = useStyles({})  
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const {
    docType,
    declareDocumentValid,
    setDeclareDocumentValid,
    ownerData,
    setOwnerData,
    payerData,
    setPayerData,
    userExists
  } = props
  
  let auxAttachedDocument: any
  const [uploadDocuments, setUploadDocuments] = useState([] as any)
  const [maxUploadFileSize, setMaxUploadFileSize] = useState<number>(2000000)
  const [loading, setLoading] = useState(false)
  const [nombreFichero, setNombreFichero] = useState('')
  const cups = useSelector((state: any) => state.requests.newRequestData.cups)
  const dossierNumber = useSelector((state: any) => state.requests.newRequestData.dossierNumber)
  const cupsOrDossier = cups ? cups : dossierNumber ? dossierNumber : '0' 
  const requests = useSelector((state: any) => state.requests)
  const user = useSelector((state: any) => state.user)
  const BASE_URL = process.env.REACT_APP_API_ENDPOINT
  const [fileSelected, setFileSelected] = useState()
  const [bigFilePopup, setBigFilePopup] = useState(false)
  const documentNumber = useSelector((state: any) => state.requests.newRequestData.documentNumber)
  const mobileRes = useMediaQuery('(max-width:576px)')

  const handleDeclareDocumenValid = (e) => {
    if (e.target.checked) {
      setDeclareDocumentValid && setDeclareDocumentValid(true)
    } else {
      setDeclareDocumentValid && setDeclareDocumentValid(false)
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/Autorizacion de representacion.pdf';
    link.download = 'Autorizacion de representacion.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  const handleClickExamineDocument = () => {
    auxAttachedDocument.firstChild.click()
  }
  
  const handleuploadDocumentsList = (doc) => {
    setUploadDocuments([...uploadDocuments, doc])
  }

  const getFileBase64 = (file, callback) => {
    let reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = () => {
      callback(reader.result)
    }

    reader.onerror = (error) => {
      console.error('Error: ', error)
    }
  }

   const handleUploadDocument = (e) => {
      // if (fileSelected) {
      //   // hay un documento ya subido se elimina el documento
      //   dispatch(resetNewRequestDataDocument(requests.newRequestData.documents.filter(item => item !== fileSelected)))
      //   item.anexado = false
      // }
  
      const actualDateString = formatDateAndHourString(new Date())
      const actualDate = new Date()
      const fileSize = (e.target.files[0].size).toString()
      const isBigFile = e.target.files[0].size > maxUploadFileSize ? true : false
  
      setLoading(true)
  
      const file = e.target.files[0]
      e.target.value = ''
  
      if (file) {
        setNombreFichero(file.name)
        let suffix = ''
        // if (item.suffix === '') {
        //   suffix = handleSuffix()
        // } else {
        //   suffix = item.suffix
        // }
  
        let fileName = file.name.split('.')[0] + suffix + '.' + file.name.split('.')[1]
        let fileNameWithoutExtension = file.name.split('.')[0]
  
        let doctype = '545'  //OTRO
        if (docType && docType !== undefined) {
          doctype = docType
        }
        let processBatchID = ''
  
        let docCargaOfflineData = {
          id: '',
          expediente: dossierNumber ? dossierNumber : '',
          cups: cups ? cups : '',
          doctype: doctype,
          fechaRealSubida: actualDateString,
          docName: fileName,
          docSize: fileSize
        }
  
        // Creamos un nuevo registro en nuestra base de datos UFD_DOCUMENTOS_CARGA_OFFLINE
        dispatch(thunkCreateDocumentoCargaOffline(docCargaOfflineData, (response) => {
          if (response) {
            // Recuperamos el ID que ha generado el registro que acabamos de crear
            dispatch(thunkGetDocumentosCargaOffline('', dossierNumber ? dossierNumber : '', cups ? cups : '', '', actualDateString, '', '', (response) => {
              if (response && response.length > 0) {
                processBatchID = (response[0].id).toString()
  
                let documentumData = {
                  nombre: '2_' + ('02' + processBatchID) + '_' + cupsOrDossier + '_' + doctype + '_' + documentNumber + '_' + fileNameWithoutExtension + '_' + formatDateZeus(actualDate),
                  extension: file.name && ('.' + file.name.split('.').pop()),
                  tipoMime: file.type,
                  carpeta: '/Documentos/ZEUDATCWBS01',
                  tipo: 'ZEUDATCPRO01',
                  isBigFile: isBigFile ? '1' : '0',
                  metadatos: [
                    {
                      nombre: 'tipo_sr',
                      valor: requests.newRequestData.tipology
                    },
                    {
                      nombre: 'sector',
                      valor: 'ELECTRICIDAD'
                    },
                    {
                      nombre: 'nif_consumidor',
                      valor: user.profile.documentNumber
                    }
                  ]
                } as any

                getFileBase64(file, (response) => {
                  const base64 = response.substring(response.indexOf('base64,') + 7, response.length)
          
                  documentumData = {
                    ...documentumData,
                    contenido: base64
                  }
          
                  let documentData = {
                    nombreArchivo: '2_' + ('02' + processBatchID) + '_' + cupsOrDossier + '_' + doctype + '_' + documentNumber + '_' + fileNameWithoutExtension + '_' + formatDateZeus(actualDate),
                    processBatchID: isBigFile ? ('02' + processBatchID) : '',
                    isBigFile: isBigFile ? '1' : '0',
                    uploadDate: formatDateAndHourZeus(actualDate),
                    format: file.name && (file.name.split('.').pop()),
          
                    documentType: file.type,
                    documentState: 'DOCSTA0002',
                  } as any

                  if (doctype === 'DOCTYP0343') {
                    setOwnerData((prev) => ({
                      ...prev,
                      carpeta: '/Documentos/ZEUDOCUWBS02',
                      comment: '',
                      contenido: documentumData.contenido,
                      documentDesc: 'Autorización del propietario firmada',
                      extension: documentumData.extension,
                      isBigFile: documentumData.isBigFile,
                      nombre: documentumData.nombre,
                      observations: '',
                      processBatchID: '021564',
                      tipo: 'ZEUDOCUWBS02',
                      tipoMime: file.type,
                      uploadDate: formatDateAndHourZeus(actualDate)
                    }))
                  } else if (doctype === 'DOCTYP0344') {
                    setPayerData((prev) => ({
                      ...prev,
                      carpeta: '/Documentos/ZEUDOCUWBS02',
                      comment: '',
                      contenido: documentumData.contenido,
                      documentDesc: 'Autorización del pagador firmada',
                      extension: documentumData.extension,
                      isBigFile: documentumData.isBigFile,
                      nombre: documentumData.nombre,
                      observations: '',
                      processBatchID: '021564',
                      tipo: 'ZEUDOCUWBS02',
                      tipoMime: file.type,
                      uploadDate: formatDateAndHourZeus(actualDate)
                    }))
                  }

                  // subir el fichero a Documentum
                  /*dispatch(thunkCreateDocument(documentumData, (response) => {
                    if (response) {
                      if (response.idDocumento && response.idDocumento !== '') {*/
                        documentData = {
                          ...documentData,
                          url: BASE_URL + '/documentum/' + response.idDocumento,
                          //idDocumentum: response.idDocumento,
                        }
                      //}
                      setFileSelected(documentData)
                      dispatch(setNewRequestDataDocument(documentData))
                      handleuploadDocumentsList(documentData)
          
                      if (isBigFile) {
                        setBigFilePopup(true)
                      }
                    //}
                    setLoading(false)
                  //}))
                })
              }
              else {
                setLoading(false)
              }
            }))
          }
          else {
            setLoading(false)
          }
        }))      
      }
    }

    const getFileName = (fullName) => {
      const arrayName = fullName.split('_')
      return arrayName[5] ? arrayName[5] : ''
    }
    
  const handleDeleteDocument = (file) => {
    setNombreFichero('')
    dispatch(resetNewRequestDataDocument(requests.newRequestData.documents.filter(doc => doc !== fileSelected)))
    let auxFilter = uploadDocuments.filter(document => document !== file)
    setUploadDocuments(auxFilter)
    setDeclareDocumentValid && setDeclareDocumentValid(false)
    if (docType === 'DOCTYP0343') {
      setOwnerData({})
    } else if (docType === 'DOCTYP0344') {
      setPayerData({})
    } 
  }

  return (
    <>
    {loading && <Spinner fixed />}
    
      <Grid container xs={12} sm={12} md={12} style={{marginTop: !userExists ? 20 : 0}}>
        <Grid item>
          <div className={classes.question}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.requestDoc')}</div>
          <div className={classes.formatText}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.formats')}</div>
        </Grid>

        <Grid item>
          <a className={classes.downloadBox} target='_blank' href='https://www.ufd.es/autorizacion-de-representacion/'>
            <div className={classes.downloadText}>
              <span>
                {t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.downloadPart1')}
                <span className={classes.downloadLinkText}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.authorization')}</span>
                {t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.downloadPart2')}
              </span>
              <img className={classes.newTabIcon} src={NewTabIcon} alt=''/>
            </div>
          </a>
        </Grid>
                
        <Grid container justifyContent='space-between' alignItems='center' style={{display: 'flex'}}>
          <Grid item className={classes.signedAuthorizationGrid}>
            <div className={classes.signedAuthorization}>
              <img className={`${classes.checkIcon} ${uploadDocuments.length <= 0 && 'desactive'}`} src={uploadDocuments.length > 0 ? CheckIconGreen : CheckIcon} alt='' />
              {t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.signedAuthorization')}
            </div>           
          </Grid>

          <Grid item className={classes.signedAuthorizationGrid}>
            <Grid item>
              <InputBase
                type='file'
                ref={ref => auxAttachedDocument = ref}
                onChange={handleUploadDocument}
                disabled={uploadDocuments.length > 0 ? true : false}
                style={{ display: 'none' }}
              />
            </Grid>

            <Grid item container className={classes.newRequest} onClick={handleClickExamineDocument}>
              <img
                src={AddIcon}
                className={`${classes.newRequestIcon} ${uploadDocuments.length > 0 && 'disabled'}`}
                alt=''
              />
              <span style={mobileRes ? { width: '100px'} : {}} className={`${classes.newRequestIconText} ${uploadDocuments.length > 0 && 'disabled'}`}>
                {t('common.buttons.addDocument')}
              </span>
            </Grid>
          </Grid>
        </Grid>  
        {(uploadDocuments.length > 0) &&
              <Grid container>
                {uploadDocuments.map((doc, index) => {
                  return (
                    <Grid item key={index} className={classes.docContainer} spacing={2}>
                      <Grid container className={classes.uploadedFile} spacing={2}>
                        <Grid item className={classes.newRequestRound}>
                          <span className={classes.text}>
                            {getFileName(doc.nombreArchivo)}
                          </span>
                          <img
                            src={DeleteIcon}
                            onClick={() => { handleDeleteDocument(doc) }}
                            className={classes.deleteIcon}
                          />
                        </Grid>                     
                      </Grid>
                    </Grid>
                  )
                })}
              </Grid>
            }

        <Grid item className={classes.privacity}>
          <FormControlLabel
            control={
              <Checkbox
                checked={declareDocumentValid}
                onChange={handleDeclareDocumenValid}
                disabled={uploadDocuments.length > 0 ? false : true}
              />
            }
            className={classes.checkbox}
            label={
              <span className={classes.declaProp}>
                {t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.declaProp')+'*'}
              </span>
            }
          />
        </Grid>
        { docType === 'DOCTYP0343' &&
          <Grid className={classes.dataRelating}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.dataRelating')}</Grid>
        }
        { docType === 'DOCTYP0344' &&
          <Grid className={classes.dataRelating}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.dataRelatingPayer')}</Grid>
        }
      </Grid>
    </>
  )
}

export default ApplicantData
