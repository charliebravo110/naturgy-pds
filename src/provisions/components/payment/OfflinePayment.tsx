import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import useMediaQuery from '@material-ui/core/useMediaQuery'

import sha1 from 'sha1'

import Grid from '@material-ui/core/Grid'

import Spinner from '../../../common/components/spinner/Spinner'
import Button from '../../../common/components/button/Button'
import Switch from '../../../common/components/switch/Switch'
import OkIcon from '../../../assets/icons/aviso_ok.svg'
import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg';
import TabIcon from '../../../assets/icons/tab.svg';
import InputAdornment from '@material-ui/core/InputAdornment'

import Card from './payment-card/Card'
import CreditForm from './payment-form/credit-form/Form2'
import BankForm from './payment-form/bank-form/Form2'
import BizumForm from './payment-form/Bizum-form/Form2'
import PayedAdvise from './payed-advise/PayedAdvise'
//import DocumentUploadFrame from '../documentation/document-upload-frSame/DocumentUploadFrame'

import { adminCheck, validateDossierCode, validateIdentityCard, validateMail } from '../../../common/lib/ValidationLib'

import { showError } from '../../../common/store/actions/ErrorActions'
import { thunkCreateCardPaymentOffline, thunkCreateCardPayment, thunkGetDossierOffline, thunkGetMasterDataOffline, thunkUpdateDossierOffline, thunkUpdatePayment, thunkBizumPayment, thunkBizumPaymentOffline } from '../../store/actions/ProvisionsThunkActions'
import { generateRandomNumberString, generateRandomString } from '../../../common/lib/FormatLib'

import useStyles, { ExpansionPanelDetails } from './OfflinePayment.styles'
import Input from '../../../common/components/input/Input'
import DocumentUploadFrame from '../documentation/document-upload-frame/DocumentUploadFrame'
import AllowPayment from './edit-manager/AllowPayment'
import { theme } from '../../../App.styles'
import { Link } from 'react-router-dom'
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript'

// LCS: Importa la función - Wave 1
import { sendGAEvent,getBrowsing_type, getGAClientId, removeEmails } from '../../../core/utils/gtm';

const PAYMENT_GATEWAY_URL = process.env.REACT_APP_PAYMENT_GATEWAY_URL
const BIZUM_PAYMENT_GATEWAY_URL = process.env.REACT_APP_BIZUM_PAYMENT_GATEWAY_URL
const PAYMENT_GATEWAY_URL_PAY = process.env.REACT_APP_PAYMENT_GATEWAY_URL_PAY
const PAYMENT_GATEWAY_MERCHANT_ID = process.env.REACT_APP_PAYMENT_GATEWAY_MERCHANT_ID
const PAYMENT_GATEWAY_ACCOUNT = process.env.REACT_APP_PAYMENT_GATEWAY_ACCOUNT
const PAYMENT_GATEWAY_CURRENCY = process.env.REACT_APP_PAYMENT_GATEWAY_CURRENCY
const PAYMENT_GATEWAY_SECRET = process.env.REACT_APP_GATEWAY

const OfflinePayment = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

  let token = sessionStorage.getItem('token')

  const { state, paymentDoneBudget, paymentQueryExecuting } = props

  const [popUp, setPopUp] = useState(false)

  const [userDNI, setUserDNI] = useState('')
  const [dossierCode, setDossierCode] = useState('')
  const [amount, setAmount] = useState('')

  const [userEmail, setUserEmail] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [userName, setUserName] = useState('')

  const [firstStep, setFirstStep] = useState(false)
  const [firstError, setFirstError] = useState(false)
  const [secondError, setSecondError] = useState(false)
  const [connectionError, setConnectionError] = useState(false)
  const [toExit, setToExit] = useState(false)

  const [timestampPayment, setTimestampPayment] = useState('')

  const [autofilled, setAutofilled] = useState(false)
  const [userShrink, setUserShrink] = useState(false)
  const [dossierCodeShrink, setDossierCodeShrink] = useState(false)
  const [amountShrink, setAmountShrink] = useState(true)

  const [indAceptoFacturaDigital, setIndAceptoFacturaDigital] = useState('0')
  const [billEmail, setBillEmail] = useState(indAceptoFacturaDigital === '1' ? false : true)
  const [billingEmail, setBillingEmail] = useState('')

  const [invalidEmail, setInvalidEmail] = useState(false)
  //const [invalidNameAndSurname, setInvalidNameAndSurname] = useState(false)
  const [invalidAddress, setInvalidAddress] = useState(false)
  const [invalidZipcode, setInvalidZipcode] = useState(false)
  const [invalidStateProv, setInvalidStateProv] = useState(false)
  const [invalidTown, setInvalidTown] = useState(false)

  const [cardPaymentActive, setCardPaymentActive] = useState(false)
  const [transferPaymentActive, setTransferPaymentActive] = useState(false)
  const [bizumPaymentActive, setBizumPaymentActive] = useState(false)

  const [bizumProces, setBizumProces] = useState(false)

  const [errors, setErrors] = useState({
    email1: false,
    nameAndSurname: false,
    address: false,
    zipcode: false,
    stateProv: false,
    town: false
  })

  const [billingAddress, setBillingAddress] = useState({
    fullAddress: '',
    streetAddress: '',
    num: '',
    door: '',
    zipCode: '',
    city: ''
  })

  let isCardSubmitted = false
  let isFirstStepCompleted = false

  const [completedPayment, setCompletedPayment] = useState(false)

  let isCardPaymentReady = false

  const [current, setCurrent] = useState(0)
  const [credit, setCredit] = useState<boolean>()
  const [bizum, setBizum] = useState<boolean>()
  const [bank, setBank] = useState<boolean>()
  const [uploaded, setUploaded] = useState<boolean>()
  const [isLoading, setIsLoading] = useState<boolean>()

  const [cardholderName, setCardholderName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvn, setCvn] = useState('')

  const [nifError, setNifError] = useState<boolean>(false)
  const [dossierError, setDossierError] = useState<boolean>(false)
  const [amountError, setAmountError] = useState<boolean>(false)

  const [errorText, setErrorText] = useState<String>('')
  const [signatureVersion, setSignatureVersion] = useState('')
  const [merchantParameters, setMerchantParameters] = useState('')
  const [signature, setSignature] = useState('')

  const pad2 = (n) => {
    return n < 10 ? '0' + n : n
  }
  
  useEffect(() => {    
    // LCS: Enviar evento de GdC a GA - Wave 3
    getBrowsing_type()
    getGAClientId()
    sendGAEvent({
      event: 'view',
      content_group: 'registro',
      page_url: removeEmails(window.location.href),
      user_id: 'no aplica',
      previous_path: document.referrer ? document.referrer : removeEmails(sessionStorage.getItem("previousPage")),
      user_type: 'no aplica',
      browsing_type: sessionStorage.getItem('browsing_type'),
      element_type: 'medicion de pagina',
      ga_client_id: sessionStorage.getItem('ga_client_id'),
      cups: 'no aplica',
      supply_type: 'no aplica'
    });
    sessionStorage.setItem("previousPage", window.location.href);
  },[])
  
  useEffect(() => {
    try{
      if (userDNI) {
        setUserShrink(true);
      } else {
        setUserShrink(false);
      }

      if (dossierCode) {
        setDossierCodeShrink(true);
      } else {
        setDossierCodeShrink(false);
      }

      if (amount) {
        setAmountShrink(true);
      } else {
        setAmountShrink(false);
      }
    } catch(e){      
      // LCS: Enviar evento a GA para medir el tiempo - Wave 1
      sendGAEvent({
        event: 'react_error',
        info:{
          error_message: 'Fallo en la pasarela de pago',
          error: e,
          reactComponent: 'OfflinePayment.tsx - useEffect',
        }
      }); 
    }
  }, [userDNI, dossierCode, amount])

  const handleUserInputChange = ({ target }) => {
    setUserDNI(target.value)
    sessionStorage.setItem('userDocument', target.value);
  }

  const handleDossierInputChange = ({ target }) => {
    setDossierCode(target.value)
    sessionStorage.setItem('provision', target.value);
  }

  const handleAmountInputChange = ({ target }) => {
    if (!isNaN(target.value.replace(',', '.'))) {
      setAmount(target.value.replace('.', ','))
    } else {
      setAmount(amount)
    }
  }

  const handleAutoFill = (e) => {
    setAutofilled(e.animationName.split('-')[2] === 'onAutoFillStart')
  }

  const setUserAddress = (direccion) => {
    billingAddress.fullAddress = direccion

    const splitted = direccion.split(', ')
    if (splitted.length > 3) {
      //street address is set
      const streetAddress = splitted[0].split(' ')
      billingAddress.streetAddress = streetAddress[0]

      for (var i = 1; i < streetAddress.length - 1; ++i) {
        billingAddress.streetAddress += ' ' + streetAddress[i]
      }

      //check if contains number and set to num
      if (streetAddress.length > 1) {
        const num = streetAddress[streetAddress.length - 1]
        if (/^\d+$/.test(num)) {
          billingAddress.num = num
        } else {
          billingAddress.streetAddress += ' ' + num
        }
      }

      if (splitted.length > 4) billingAddress.door = splitted[1]
      for (var i = 2; i < splitted.length - 3; ++i)
        billingAddress.door += ' ' + splitted[i]

      //zipCode and city are set
      billingAddress.zipCode = splitted[splitted.length - 3]
      billingAddress.city = splitted[splitted.length - 2]
    } else {
      //entire address is set to streetAddress
      billingAddress.streetAddress = direccion.replace(',', '')
    }
  }

  const handleFirsStepPayment = () => {
    try{
    //Se rectifica los decimales del valor amount
    let newAmount = amount
    if (!amount.includes(',')) {
      newAmount = amount + ',00'
    } else {
      let splitted = amount.split(',', 2)
      if (splitted[1].length == 0) {
        newAmount = amount + '00'
      } else if (splitted[1].length == 1) {
        newAmount = amount + '0'
      } else if (splitted[1].length > 2) {
        newAmount = splitted[0] + ',' + splitted[1].slice(0, 2)
      }
    }
    setAmount(newAmount)

    const body = {
      expediente: dossierCode,
      dni: userDNI,
      amount: newAmount.replace(',', ''),
      paymentOnline: null
    } as any
    dispatch(thunkUpdatePayment(body, (response) => {
      if (response && response.result && response.result.codResult && response.result.codResult === '0') {
        if (response.nombre) setUserName(response.nombre)
        if (response.email) setUserEmail(response.email)
        if (response.telefono) setUserPhone(response.telefono)
        if (response.direccion) setUserAddress(response.direccion)
        setFirstStep(true)
        setFirstError(false)
        setSecondError(false)

        //Seteamos los errores a false
        setNifError(false)
        setDossierError(false)
        setAmountError(false)
        setConnectionError(false)
      } else if (response && response.result && response.result.codResult && response.result.codResult === '9') {
        //Error en el importe (No coincide)
        setNifError(false)
        setDossierError(false)
        setAmountError(true)
        setErrorText(t('provisions.offlinePayment.errors.valorationAmount'))
        setConnectionError(false)
        // LCS: Enviar evento a GA para medir el tiempo - Wave 1
        sendGAEvent({
          event: 'application_error',
          info: {
            error_message: 'El importe a pagar no coincide con la valoración del expediente.',
            error: response,
            reactComponent: 'OfflinePayment.ts - handleFirsStepPayment',
            codResult: response.result ? response.result.codResult : '',
            apiUrl: 'post /updatePayment',
          }
        });        
      } else if (response && response.result && response.result.codResult && response.result.codResult === '10') {
        //Error en el dni (No coincide con el nif del pagador)
        setNifError(false)
        setDossierError(false)
        setAmountError(false)
        setErrorText(response.result.msgResult)
        setPopUp(true)
        setConnectionError(false)
        // LCS: Enviar evento a GA para medir el tiempo - Wave 1
        sendGAEvent({
          event: 'application_error',
          info: {
            error_message: 'No coincide con el nif del pagador.',
            error: response,
            reactComponent: 'OfflinePayment.ts - handleFirsStepPayment',
            codResult: response.result ? response.result.codResult : '',
            apiUrl: 'post /updatePayment',
          }
        });
      } else if (response && response.result && response.result.codResult && response.result.codResult === '11') {
        //Error en el expediente (Exepdiente en estado no Valorado)
        setNifError(false)
        setDossierError(false)
        setAmountError(false)
        setErrorText(response.result.msgResult)
        setPopUp(true)
        setConnectionError(false)
        // LCS: Enviar evento a GA para medir el tiempo - Wave 1
        sendGAEvent({
          event: 'application_error',
          info: {
            error_message: 'Expediente en estado no Valorado.',
            error: response,
            reactComponent: 'OfflinePayment.ts - handleFirsStepPayment',
            codResult: response.result ? response.result.codResult : '',
            apiUrl: 'post /updatePayment',
          }
        });
      } else if (response && response.result && response.result.codResult && response.result.codResult === '12') {
        //Error en el expediente (Exepdiente sin hito de cobro inicial pendiente)
        setNifError(false)
        setDossierError(false)
        setAmountError(false)
        setErrorText(response.result.msgResult)
        setPopUp(true)
        setConnectionError(false)
        // LCS: Enviar evento a GA para medir el tiempo - Wave 1
        sendGAEvent({
          event: 'application_error',
          info: {
            error_message: 'Expediente sin hito de cobro inicial pendiente.',
            error: response,
            reactComponent: 'OfflinePayment.ts - handleFirsStepPayment',
            codResult: response.result ? response.result.codResult : '',
            apiUrl: 'post /updatePayment',
          }
        });
      } else if (response && response.result && response.result.codResult && response.result.codResult === '13') {
        //Error en el expediente (Acuerdo del expediente con más de un hito)
        setNifError(false)
        setDossierError(false)
        setAmountError(false)
        setErrorText(response.result.msgResult)
        setPopUp(true)
        setConnectionError(false)
        // LCS: Enviar evento a GA para medir el tiempo - Wave 1
        sendGAEvent({
          event: 'application_error',
          info: {
            error_message: 'Acuerdo del expediente con más de un hito.',
            error: response,
            reactComponent: 'OfflinePayment.ts - handleFirsStepPayment',
            codResult: response.result ? response.result.codResult : '',
            apiUrl: 'post /updatePayment',
          }
        });
      } else {
        setConnectionError(true)
      }
    })
    )}catch(e){
      // LCS: Enviar evento a GA para medir el tiempo - Wave 1
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : 'Fallo al procesar el primer paso del pago',
          error: e,
          reactComponent: 'OfflinePayment.tsx - handleFirsStepPayment',
          codResult: (e as any).result ? (e as any).result.codResult : (e as any).status
        }
      });
    }
  }

  let date = new Date()
  let timestamp = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds())
  const documentType = 'DOCTYP0203'
  const [documentTypeName, setDocumentTypeName] = useState('')

  let orderId1 = '';

  if (indAceptoFacturaDigital === '') {
    setIndAceptoFacturaDigital('0')
    setBillingEmail('')
  }

  /* Comprobación de flags métodos de pago */
  useEffect(() => {
    dispatch(thunkGetMasterDataOffline(
      'TRANSFER_PAYMENT_FLAG',
      'ES',
      '',
      (response) => {
        if (response && response.length > 0) {
          setTransferPaymentActive(response[0].value === '1')
        }
      }
    ))

    dispatch(thunkGetMasterDataOffline(
      'CARD_PAYMENT_FLAG',
      'ES',
      '',
      (response) => {
        if (response && response.length > 0) {
          setCardPaymentActive(response[0].value === '1')

        }
      }
    ))

    dispatch(thunkGetMasterDataOffline(
      'BIZUM',
      'ES',
      'TRANSFER_PAYMENT_FLAG',
      (response) => {
        if (response && response.length > 0) {
          setBizumPaymentActive(response[0].value === '1')

        }
      }
    ))

  }, [])

  /* Comprobación de pago realizado */
  useEffect(() => {
    setIsLoading(true)
    if (paymentDoneBudget && state === 6) {
      setCompletedPayment(true)
    }
    setIsLoading(false)
  }, [paymentDoneBudget, state])

  useEffect(() => {
    if (current === 0) {
      setCredit(true)
      setBizum(false)
      setBank(false)
    } else if (current === 1) {
      setCredit(false)
      setBizum(false)
      setBank(true)
    } else {
      setCredit(false)
      setBizum(true)
      setBank(false)
    }
  }, [current])

  const handleCreditClick = () => {
    setCurrent(0)
  }

  const handleBizumClick = () => {
    setCurrent(2)
  }

  const handleBankClick = () => {
    setCurrent(1)
  }


  const submitToHpp = () => {
    try{
      //document.getElementById('spinner').classList.remove('hidden')
      let hiddenForm = document.getElementById('hiddenForm') as any

      isCardPaymentReady = false

      orderId1 = generateRandomString(15);
      let campoOrderId = document.getElementById('order') as any;
      campoOrderId.value = orderId1;
      sessionStorage.setItem('orderId', orderId1);

      date = new Date()
      timestamp = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds())
      let campoTimestamp = document.getElementById('timestamp') as any;
      campoTimestamp.value = timestamp;

      const string = timestamp + '.' + PAYMENT_GATEWAY_MERCHANT_ID + '.' + orderId1 + '.' + amount.replace(',', '') + '.' + PAYMENT_GATEWAY_CURRENCY

      const encryptedString1 = sha1(string)

      const encryptedString2 = sha1(encryptedString1 + PAYMENT_GATEWAY_SECRET)

      let hashInput = document.getElementById('hash') as any
      hashInput.value = encryptedString2

      hiddenForm.submit()

      const body = {
        dossierNumber: dossierCode,
        orderId: orderId1,
        status: t('provisions.payment.pending'),
        requestTimestamp: timestamp,
        responseTimestamp: '',
        merchantId: PAYMENT_GATEWAY_MERCHANT_ID,
        amount: amount.replace(',', ''),
        sha1hash: encryptedString2,
        hppCustomerEmail: userEmail,
        hppBillingStreet1: billingAddress.streetAddress,
        hppBillingStreet2: billingAddress.num,
        hppBillingStreet3: billingAddress.door,
        hppBillingCity: billingAddress.city,
        hppBillingPostalcode: billingAddress.zipCode,
        hppBillingCountry: '724',
        account: PAYMENT_GATEWAY_ACCOUNT,
        comment1: t('provisions.payment.comment1') + ' ' + dossierCode,
        custNum: userDNI,
        varRef: dossierCode.replace('EXP', ''),
        prodId: dossierCode,
        result: '',
        message: '',
        authcode: '',
        pasref: '',
        cvnresult: '',
        batchid: '',
        eci: '',
        cavv: '',
        xid: ''
      } as any

      document.getElementById('pay-button').setAttribute('disabled', 'disabled')
      document.getElementById('pay-button').classList.add('Mui-disabled')

      dispatch(thunkCreateCardPayment(body, (response) => {
        if (response) {
          document.getElementById('hiddeniFrameForm').style.display = 'block'
          document.getElementById('hiddeniFrame').style.height = '700px'
          // LCS: Enviar evento a GA para medir el tiempo - Wave 1
          sendGAEvent({
            event: 'registered_user',
            action: 'Nuevo usuario registrado',
            reactComponent: 'OfflinePayment.tsx - handleFirsStepPayment',
          });
        } else {
          //document.getElementById('spinner').classList.add('hidden')
        }
      }))
    }catch(e){
      // LCS: Enviar evento a GA para medir el tiempo - Wave 1
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : 'Fallo al enviar los datos al gateway de pago',
          error: e,
          reactComponent: 'OfflinePayment.tsx - submitToHpp',
          apiUrl: 'put /cardPayment',
          codResult: (e as any).result ? (e as any).result.codResult : (e as any).status
        }
      })
    }
  }

  const submitBizum = () => {
    try{
      setBizumProces(true)

      let hiddenFormBizum = document.getElementById('hiddenFormBizum') as any

      orderId1 = generateRandomNumberString(4) + generateRandomString(8)
      sessionStorage.setItem('orderId', orderId1)

      const bizumPayment = {
        orderId: orderId1,
        expediente: dossierCode,
        productDesCription: dossierCode,
        custId: userDNI,
        custEmail: userEmail,
        custName: userName,
        custPhone: '',//userPhone,
        custBillingStreet1: billingAddress.streetAddress,
        custBillingStreet2: billingAddress.num,
        custBillingStreet3: billingAddress.door,
        custBillingCity: billingAddress.city,
        custBillingPostalcode: billingAddress.zipCode,
        terminal: '01',
        transactionType: '0',
        amount: amount.replace(',', ''),
        sumTotal: amount.replace(',', ''),
        currency: '978',
        consumerLanguage: '001'
      } as any

      const body = {
        isBizum: '1',
        bizumPayment: bizumPayment
      }

      dispatch(thunkCreateCardPayment(body, async (response) => {
        if (response && response.result.codResult == '0000') {
          setSignatureVersion(response.SIGNATURE_VERSION)
          setMerchantParameters(response.MERCHANT_PARAMETERS)
          setSignature(response.SIGNATURE)

          await hiddenFormBizum.submit()
          //document.getElementById('hiddeniFrameFormBizum').style.display = 'block'
          //document.getElementById('hiddeniFrameBizum').style.height = '700px'
        } else {
        }
      }))

      while (signatureVersion !== '' || merchantParameters !== '' || signature !== '') {
      }
    }catch(e){
      // LCS: Enviar evento a GA para medir el tiempo - Wave 1
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : 'Fallo al hacer el pago por Bizum',
          error: e,
          reactComponent: 'OfflinePayment.tsx - submitBizum',
          codResult: (e as any).result ? (e as any).result.codResult : (e as any).status
        }
      })
    }
  }

  const trimDate = (date: String) => {
    //20231201113427
    let dateArray = date.split('')
    let trimmedDate = dateArray[6] + dateArray[7] + '/' + dateArray[4] + dateArray[5] + '/' + dateArray[0] + dateArray[1] + dateArray[2] + dateArray[3] + ' ' + dateArray[8] + dateArray[9] + ':' + dateArray[10] + dateArray[11] + ':' + dateArray[12] + dateArray[13]
    return trimmedDate
  }

  const handleMessage = (event) => {
    try{
      if (event.origin === PAYMENT_GATEWAY_URL) {

        const esJSON = isJson(event.data);

        const data = esJSON ? JSON.parse(event.data) : event.data;

        if (esJSON) {
          if (data.action && data.action === 'hpp-listener-loaded') {

            if (!isCardSubmitted || !isFirstStepCompleted) {
              isFirstStepCompleted = true
            }
          } else if ((data.CAVV) || (data.RESULT)) {
            let hash = document.getElementById('hash') as any
            let order = document.getElementById('order') as any

            //document.getElementById('spinner').classList.remove('hidden')

            let message = ''
            let status = ''

            const result = atob(data.RESULT)
            const orderIdResponse = atob(data.ORDER_ID)

            if (atob(data.RESULT) === '00') {
              message = t('provisions.payment.operationAuthorized')
              status = 'OK'

              isCardPaymentReady = true
            } else {
              message = t('provisions.payment.operationError')
              status = 'KO'
              isCardPaymentReady = false

            }
            isFirstStepCompleted = false

            if (isCardPaymentReady) {
              const body = {
                expediente: sessionStorage.getItem('provision'),
                dni: sessionStorage.getItem('userDocument'),
                amount: atob(data.AMOUNT),
                paymentOnline: {
                  custNum: sessionStorage.getItem('userDocument'),
                  prodId: sessionStorage.getItem('provision'),
                  result: result,
                  amount: atob(data.AMOUNT),
                  orderId: orderIdResponse,
                  pasRef: data && atob(data.pas_uuid),
                  timestampRespuesta: data && trimDate(atob(data.TIMESTAMP)),// modficar para enviar en el formato correcto dd/mm/yyyy HH:mm:ss
                  paymentMethod: 'CARD'
                }
                // Fake Body
                // const body = {
                //   expediente: 'EXP918423090097',
                //   dni: '50309712H',
                //   amount: '121',
                //   paymentOnline: {
                //     custNum: '50309712H',
                //     prodId: 'EXP918423090097',
                //     result: result,
                //     amount: '121',
                //     orderId: orderIdResponse,
                //     pasRef: data && atob(data.pas_uuid),
                //     timestampRespuesta: '01/12/2023 11:45:00',
                //     paymentMethod: 'CARD'
                //   }
              }
              setTimestampPayment(trimDate(atob(data.TIMESTAMP)) + ' h')

              dispatch(thunkUpdatePayment(body, (response) => {
                if (response) {
                  document.getElementById('pay-button').removeAttribute('disabled')
                  document.getElementById('pay-button').classList.remove('Mui-disabled')
                  document.getElementById('hiddeniFrame').style.height = '54px'
                }
                if (response && response.result && response.result.codResult === '0') {
                  setCompletedPayment(true)
                } else {
                  dispatch(showError('3002', 'doCardPayment'))
                }
              }))
            }

            //document.getElementById('spinner').classList.add('hidden')
            // document.getElementById('pay-button').removeAttribute('disabled')
            // document.getElementById('pay-button').classList.remove('Mui-disabled')
            // document.getElementById('hiddeniFrame').style.height = '54px'

          }
        }
      } else if (event.origin === BIZUM_PAYMENT_GATEWAY_URL) {
        //READ JSON FROM BIZUM CALL

        //CALL encriptionMessage
        //parametros:
        // encription = '1'
        // DS_SIGNATUREVERSION = DS_SIGNATUREVERSION
        // DS_MERCHANTPARAMETERS = DS_MERCHANTPARAMETERS
        // DS_SIGNATURE = DS_SIGNATURE

        //CHECK IF ITS PAYMENTS IS SUCCESSFUL

        //CALL updatePayment

        //setCompletedPayment(true)
      }
    } catch (e){
      // LCS: Enviar evento a GA para medir el tiempo - Wave 1
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : 'Fallo al manejar el mensaje del gateway de pago',
          error: e,
          reactComponent: 'OfflinePayment.tsx - handleMessage',
          codResult: (e as any).result ? (e as any).result.codResult : (e as any).status
        }
      })
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage, true)

    return () => {
      document.removeEventListener('message', handleMessage, true)
    }
    // eslint-disable-next-line
  }, [])

  function isJson(str) {
    try {
      JSON.parse(str);
    } catch (e){
      return false;
    }
    return true;
  }

  return (
    <>
      <AllowPayment popup={popUp} setPopup={setPopUp} />
      <Grid className={classes.paymentBackground}>
        {mobile ?

          !firstStep && !completedPayment ?
            <Grid
              container
              justifyContent='center'
              alignItems='center'
              direction='column'
            >
              <Grid className={classes.maxWidthForBigScreensMobile}>
                <Grid container direction='column' alignItems='center' className={classes.formMobile}>
                  <Grid item className={classes.title}>{t('provisions.offlinePayment.paymentTitle')}</Grid>
                  <Grid item className={classes.greySubtitle}>{t('provisions.offlinePayment.completeFields')}</Grid>

                  <Grid item container className={classes.inputFieldsMobile} justifyContent='center' alignItems='center'>
                    <Input
                      label={t('provisions.offlinePayment.codExp')}
                      name='dossierCode'
                      showValidationIcon
                      error={dossierCode !== '' && !validateDossierCode(dossierCode)}
                      className={classes.textField}
                      onChange={handleDossierInputChange}
                      value={dossierCode}
                      onAnimationStart={handleAutoFill}
                      InputLabelProps={{
                        shrink: autofilled || dossierCodeShrink
                      }}
                      disabled={firstStep}
                    />
                  </Grid>
                  <Grid item container className={classes.inputFieldsMobile} justifyContent='center' alignItems='center'>
                    <Input
                      label={t('provisions.offlinePayment.docNumber')}
                      name='userDNI'
                      showValidationIcon
                      error={userDNI !== '' && !validateIdentityCard(userDNI)}
                      className={classes.textField}
                      onChange={handleUserInputChange}
                      value={userDNI}
                      onAnimationStart={handleAutoFill}
                      InputLabelProps={{
                        shrink: autofilled || userShrink
                      }}
                      disabled={firstStep}
                      helperText={
                        firstError && 'firstError'
                      }
                    />
                  </Grid>
                  <Grid item container className={classes.inputFieldsMobile} justifyContent='center' alignItems='center'>
                    <Input
                      label={t('provisions.offlinePayment.amount')}
                      name='amount'
                      showValidationIcon
                      error={amountError}
                      className={classes.textField}
                      onChange={handleAmountInputChange}
                      value={amount}
                      onAnimationStart={handleAutoFill}
                      InputLabelProps={{
                        shrink: autofilled || amountShrink
                      }}
                      disabled={firstStep}
                      InputProps={{
                        endAdornment: <InputAdornment position='end'>€</InputAdornment>
                      }}
                      helperText={amountError &&
                        errorText}
                    />
                  </Grid>
                  {connectionError &&
                    <Grid
                      container
                      direction='row'
                      md={12}
                      spacing={2}
                      className={classes.functionDisabled2Mobile}
                    >
                      <Grid item>
                        <img src={AlertIcon} className={classes.alertImg} />
                      </Grid>
                      <Grid>
                        <Grid item className={classes.functionDisabledTitle}>
                          {t('provisions.offlinePayment.connectionError')}
                        </Grid>
                        <Grid item className={classes.paymentTextV2}>
                          {t('provisions.offlinePayment.tryAgain')}
                        </Grid>
                      </Grid>
                    </Grid>
                  }
                  <Grid item className={classes.paymentText}>{t('provisions.offlinePayment.allFieldsRequired')}</Grid>

                  <Grid container justifyContent='center' className={classes.buttonsMobile}>
                    <Button
                      text={t('common.buttons.accept')}
                      color='primary'
                      size='large'
                      variant='contained'
                      onClick={handleFirsStepPayment}
                      disabled={firstStep || userDNI === '' || dossierCode === '' || amount === '' || !validateIdentityCard(userDNI) || !validateDossierCode(dossierCode)}
                    />

                    <Button
                      text={t('common.buttons.cancel')}
                      color='inherit'
                      size='large'
                      variant='contained'
                      onClick={() => {
                        props.history.push('/login')
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            : firstStep && !completedPayment ?
              <Grid
                container
                justifyContent='center'
                alignItems='center'
                direction='column'
              >
                <Grid item className={classes.maxWidthForBigScreensMobile}>
                  <Grid item container direction='column' justifyContent='center' alignItems='center' className={classes.form2}>
                    {
                      isLoading &&
                      <Spinner fixed />
                    }

                    {
                      !isLoading &&
                      <Grid item className={classes.centredMobile}>
                        <Grid item className={classes.title}>{t('provisions.offlinePayment.paymentTitle')}</Grid>

                        <Grid container direction='column' className={classes.blockMobile}>
                          <Grid item className={classes.paymentSubtitle}>
                            {t('provisions.offlinePayment.completePayment.dossierData')}
                          </Grid>

                          <ExpansionPanelDetails>
                            <Grid container direction='row'>
                              <Grid
                                container
                                spacing={4}
                                item
                                md={12}
                                sm={12}
                                xs={12}
                              >
                                <Grid
                                  item
                                  md={6}
                                  sm={12}
                                  xs={12}
                                >
                                  <div className={classes.expansionPanelDetailsTitle}>{t('provisions.offlinePayment.completePayment.codExp')}</div>

                                  <div className={classes.expansionPanelDetailsValue}>{dossierCode}</div>
                                </Grid>

                                <Grid
                                  item
                                  md={6}
                                  sm={12}
                                  xs={12}
                                >
                                  <div className={classes.expansionPanelDetailsTitle}>{t('provisions.offlinePayment.completePayment.supplyAddress')}</div>

                                  <div className={classes.expansionPanelDetailsValue}>{billingAddress.fullAddress}</div>
                                </Grid>
                                <Grid
                                  item
                                  md={6}
                                  sm={12}
                                  xs={12}
                                >
                                  <div className={classes.expansionPanelDetailsTitle}>{t('provisions.offlinePayment.completePayment.amountToPay')}</div>

                                  <div className={classes.expansionPanelDetailsValue}>{amount + '€'}</div>
                                </Grid>

                                <Grid
                                  item
                                  md={6}
                                  sm={12}
                                  xs={12}
                                >
                                  <div className={classes.expansionPanelDetailsTitle}>{t('provisions.offlinePayment.completePayment.payerDocNumber')}</div>

                                  <div className={classes.expansionPanelDetailsValue}>{userDNI}</div>
                                </Grid>
                              </Grid>
                              <Grid container justifyContent='center' className={classes.greySubtitleV2Mobile}>
                                <span>{`${t('provisions.offlinePayment.popup.subtitle')} `}<Link to='/'>{t('provisions.offlinePayment.popup.link')}</Link>{t('common.punctuation.dot')}</span>
                              </Grid>
                            </Grid>
                          </ExpansionPanelDetails>
                        </Grid>

                        <Grid container direction='column' className={classes.blockMobile}>

                          <Grid item lg={4} md={12} sm={12} xs={12} />
                          <Grid container direction='column'>
                            <Grid item className={classes.paymentSubtitle}>
                              {t('provisions.offlinePayment.completePayment.paymentMethod')}
                            </Grid>

                            <Grid item className={classes.paymentText}>
                              {t('provisions.offlinePayment.completePayment.selectPayment')}
                            </Grid>
                          </Grid>

                          <Grid container className={classes.forms}>
                            <Grid item lg={5} md={12} sm={12} xs={12}>
                              <Grid container alignItems='center' direction='column'>
                                <Card selected={credit} type={0} onClick={handleCreditClick} />
                                <Card selected={bizum} type={2} onClick={handleBizumClick} />
                                <Card selected={bank} type={1} onClick={handleBankClick} />
                              </Grid>
                            </Grid>

                            <Grid item lg={7} md={12} sm={12} xs={12}>
                              <Grid container alignItems='center' justify='center'>
                                {
                                  current === 0 && cardPaymentActive ?
                                    <>
                                      <CreditForm
                                        merchantId={PAYMENT_GATEWAY_MERCHANT_ID}
                                        account={PAYMENT_GATEWAY_ACCOUNT}
                                        currency={PAYMENT_GATEWAY_CURRENCY}
                                        timestamp={timestamp}
                                        orderId={orderId1}
                                        cardholderName={cardholderName}
                                        setCardholderName={setCardholderName}
                                        cardNumber={cardNumber}
                                        setCardNumber={setCardNumber}
                                        expiryDate={expiryDate}
                                        setExpiryDate={setExpiryDate}
                                        cvn={cvn}
                                        setCvn={setCvn}
                                      /*userDNI={userDNI}
                                      userPhone={userPhone}
                                      userEmail={userEmail}
                                      amount={amount.replace(',', '')}
                                      dossierCode={dossierCode}*/
                                      />

                                      {
                                        (current === 0 && cardPaymentActive) &&
                                        <Grid item className={classes.buttons}>
                                          <Grid container justify='center'>
                                            {
                                              current === 0 &&
                                              <>
                                                <Button
                                                  id='pay-button'
                                                  className={classes.button}
                                                  text={t('provisions.payment.buttons.pay')}
                                                  color='primary'
                                                  size='large'
                                                  variant='contained'
                                                  disabled={adminCheck() || !firstStep || bizumProces}
                                                  onClick={submitToHpp}
                                                />
                                              </>
                                            }
                                          </Grid>
                                        </Grid>
                                      }

                                    </>
                                    : current === 1 && transferPaymentActive ?
                                      <BankForm
                                        amount={amount.replace(',', '')}
                                        dossierCod={dossierCode}
                                      />
                                      : current === 2 && transferPaymentActive &&
                                      <>
                                        <BizumForm
                                          DS_SIGNATUREVERSION={signatureVersion}
                                          DS_MERCHANTPARAMETERS={merchantParameters}
                                          DS_SIGNATURE={signature}
                                        />
                                        {(current === 2 && bizumPaymentActive) &&
                                          <Grid item className={classes.buttons}>
                                            <Grid container justify='center'>
                                              {current === 2 &&
                                                <>
                                                  <Button
                                                    id='pay-button'
                                                    className={classes.button}
                                                    text={t('provisions.payment.buttons.pay')}
                                                    color='primary'
                                                    size='large'
                                                    variant='contained'
                                                    disabled={adminCheck() || !firstStep}
                                                    onClick={submitBizum}
                                                  />
                                                </>
                                              }
                                            </Grid>
                                          </Grid>
                                        }
                                      </>
                                }
                              </Grid>
                            </Grid>
                            
                            <Grid container alignItems='center' justifyContent='center' style={{marginTop:'20px'}}>
                              <label>
                                {t('provisions.payment.privacyPolicy')}
                                  <a className={classes.link} target='_blank' href='https://www.ufd.es/informacion-sobre-cancelacion-de-expedientes/'>                          
                                    {t('provisions.payment.here')}
                                  </a>
                                  <img src={TabIcon} alt=''  className={classes.tabIcon}/>
                              </label>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>     
                    }
                    <Button
                      text={t('provisions.offlinePayment.completePayment.exitPayment.outButton')}
                      className={classes.button}
                      color='primary'
                      size='large'
                      variant='contained'
                      disabled={toExit}
                      onClick={() => {
                        setToExit(true)
                      }}
                    />
                    {toExit &&
                      <Grid
                        container
                        justify='center'
                        alignItems='center'
                        direction='column'
                        className={classes.functionDisabled3}
                      >
                        <Grid item>
                          <img src={AlertIcon} />
                        </Grid>
                        <Grid item className={classes.functionDisabledTitle}>
                          {t('provisions.offlinePayment.completePayment.exitPayment.question')}
                        </Grid>
                        <Grid item className={classes.bluePaymentText}>
                          {t('provisions.offlinePayment.completePayment.exitPayment.lostData')}
                        </Grid>
                        <Grid container justifyContent='center' className={classes.buttons}>
                          <Button
                            text={t('common.buttons.cancel')}
                            color='inherit'
                            size='large'
                            variant='contained'
                            onClick={() => {
                              setToExit(false)
                            }}
                          />

                          <Button
                            text={t('common.buttons.accept')}
                            color='primary'
                            size='large'
                            variant='contained'
                            onClick={() => {
                              props.history.push('/login')
                            }}
                          />
                        </Grid>
                      </Grid>
                    }
                  </Grid>
                </Grid>
              </Grid>
              : firstStep && completedPayment &&
              <Grid
                container
                justifyContent='center'
                alignItems='center'
                direction='column'
              >
                <Grid item className={classes.maxWidthForBigScreens}>
                  <Grid item container direction='column' justifyContent='center' alignItems='center' className={classes.form2}>
                    <Grid container className={classes.container}>
                      {
                        isLoading &&
                        <Spinner fixed />
                      }

                      {
                        !isLoading &&
                        <Grid item className={classes.centredMobile}>
                          <Grid item className={classes.title}>{t('provisions.offlinePayment.paymentTitle')}</Grid>

                          <Grid container direction='column' className={classes.blockMobile}>

                            <label className={classes.bluePaymentText}>
                              {timestampPayment}
                            </label>

                            <Grid item className={classes.paymentTitle}>{t('provisions.offlinePayment.completePayment.budgetPayed')}</Grid>

                            <Grid item>
                              <label className={classes.payment}>{amount}{t('provisions.payment.budgetBadge')}</label>
                            </Grid>
                            <label className={classes.bluePaymentText}>
                              {t('provisions.offlinePayment.completePayment.ivaIncluded')}
                            </label>

                            <ExpansionPanelDetails>
                              <Grid
                                container
                                spacing={4}
                                item
                                md={12}
                                sm={12}
                                xs={12}
                              >
                                <Grid
                                  item
                                  md={4}
                                  sm={12}
                                  xs={12}
                                >
                                  <div className={classes.expansionPanelDetailsTitle}>{t('provisions.offlinePayment.codExp')}</div>

                                  <div className={classes.expansionPanelDetailsValue}>{dossierCode}</div>
                                </Grid>

                                <Grid
                                  item
                                  md={4}
                                  sm={12}
                                  xs={12}
                                >
                                  <div className={classes.expansionPanelDetailsTitle}>{t('provisions.offlinePayment.completePayment.supplyAddress')}</div>

                                  <div className={classes.expansionPanelDetailsValue}>{billingAddress.fullAddress}</div>
                                </Grid>

                                <Grid
                                  item
                                  md={4}
                                  sm={12}
                                  xs={12}
                                >
                                  <div className={classes.expansionPanelDetailsTitle}>{t('provisions.offlinePayment.completePayment.payerDocNumber')}</div>

                                  <div className={classes.expansionPanelDetailsValue}>{userDNI}</div>
                                </Grid>
                              </Grid>
                            </ExpansionPanelDetails>
                          </Grid>

                          <Grid container direction='column' className={classes.blockMobile}>

                            <Grid item lg={4} md={12} sm={12} xs={12} />
                            <Grid container direction='column'>

                              <Grid item>
                                <Grid className={classes.paymentText}>
                                  {t('provisions.offlinePayment.completePayment.sendBill')}
                                </Grid>

                                <Grid className={classes.paymentText}>
                                  {t('provisions.offlinePayment.completePayment.consult')}
                                </Grid>

                                <Grid container alignItems='center' justifyContent='center' style={{marginTop:'30px'}}>
                                <label className={classes.policy}>
                                  {t('provisions.payment.privacyPolicy')}
                                    <a className={classes.link} target='_blank' href='https://www.ufd.es/informacion-sobre-cancelacion-de-expedientes/'>                          
                                      {t('provisions.payment.here')}
                                    </a>
                                    <img src={TabIcon} alt=''  className={classes.tabIcon}/>
                                </label>
                               </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      }
                    </Grid>
                    <Button
                      text={t('provisions.offlinePayment.completePayment.exitPayment.outButton')}
                      className={classes.button}
                      color='primary'
                      size='large'
                      variant='contained'
                      onClick={() => {
                        props.history.push('/login')
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

          :
          //Vista pc

          !firstStep && !completedPayment ?
            <Grid
              container
              justifyContent='center'
              alignItems='center'
              direction='column'
            >
              <Grid item className={classes.maxWidthForBigScreens}>
                <Grid item container direction='column' justifyContent='center' alignItems='center' className={classes.form}>
                  <Grid item className={classes.title}>{t('provisions.offlinePayment.paymentTitle')}</Grid>
                  <Grid item className={classes.greySubtitle}>{t('provisions.offlinePayment.completeFields')}</Grid>

                  <Grid item container className={classes.inputFields} justifyContent='center' alignItems='center'>
                    <Input
                      label={t('provisions.offlinePayment.codExp')}
                      name='dossierCode'
                      showValidationIcon
                      error={dossierCode !== '' && !validateDossierCode(dossierCode)}
                      className={classes.textField}
                      onChange={handleDossierInputChange}
                      value={dossierCode}
                      onAnimationStart={handleAutoFill}
                      InputLabelProps={{
                        shrink: autofilled || dossierCodeShrink
                      }}
                      disabled={firstStep}
                    />
                  </Grid>
                  <Grid item container className={classes.inputFields} justifyContent='center' alignItems='center'>
                    <Input
                      label={t('provisions.offlinePayment.docNumber')}
                      name='userDNI'
                      showValidationIcon
                      error={userDNI !== '' && !validateIdentityCard(userDNI)}
                      className={classes.textField}
                      onChange={handleUserInputChange}
                      value={userDNI}
                      onAnimationStart={handleAutoFill}
                      InputLabelProps={{
                        shrink: autofilled || userShrink
                      }}
                      disabled={firstStep}
                      helperText={
                        firstError && 'firstError'
                      }
                    />
                  </Grid>
                  <Grid item container className={classes.inputFields} justifyContent='center' alignItems='center'>
                    <Input
                      label={t('provisions.offlinePayment.amount')}
                      name='amount'
                      showValidationIcon
                      error={amountError}
                      className={classes.textField}
                      onChange={handleAmountInputChange}
                      value={amount}
                      onAnimationStart={handleAutoFill}
                      InputLabelProps={{
                        shrink: autofilled || amountShrink
                      }}
                      disabled={firstStep}
                      InputProps={{
                        endAdornment: <InputAdornment position='end'>€</InputAdornment>
                      }}
                      helperText={amountError &&
                        errorText}
                    />
                  </Grid>
                  {connectionError &&
                    <Grid
                      container
                      direction='row'
                      md={12}
                      spacing={2}
                      className={classes.functionDisabled2}
                    >
                      <Grid item>
                        <img src={AlertIcon} className={classes.alertImg} />
                      </Grid>
                      <Grid>
                        <Grid item className={classes.functionDisabledTitle}>
                          {t('provisions.offlinePayment.connectionError')}
                        </Grid>
                        <Grid item className={classes.paymentTextV2}>
                          {t('provisions.offlinePayment.tryAgain')}
                        </Grid>
                      </Grid>
                    </Grid>
                  }
                  <Grid item className={classes.paymentText}>{t('provisions.offlinePayment.allFieldsRequired')}</Grid>

                  <Grid container justifyContent='center' className={classes.buttons}>
                    <Button
                      text={t('common.buttons.cancel')}
                      color='inherit'
                      size='large'
                      variant='contained'
                      onClick={() => {
                        props.history.push('/login')
                      }}
                    />

                    <Button
                      text={t('common.buttons.accept')}
                      color='primary'
                      size='large'
                      variant='contained'
                      onClick={handleFirsStepPayment}
                      disabled={firstStep || userDNI === '' || dossierCode === '' || amount === '' || !validateIdentityCard(userDNI) || !validateDossierCode(dossierCode)}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            : firstStep && !completedPayment ?
              <Grid
                container
                justifyContent='center'
                alignItems='center'
                direction='column'
              >
                <Grid item className={classes.maxWidthForBigScreens}>
                  <Grid item container direction='column' justifyContent='center' alignItems='center' className={classes.form2}>
                    {
                      isLoading &&
                      <Spinner fixed />
                    }

                    {
                      !isLoading &&
                      <Grid item className={classes.centred}>
                        <Grid item className={classes.title}>{t('provisions.offlinePayment.paymentTitle')}</Grid>

                        <Grid container direction='column' className={classes.block}>
                          <Grid item className={classes.paymentSubtitle}>
                            {t('provisions.offlinePayment.completePayment.dossierData')}
                          </Grid>

                          <ExpansionPanelDetails>
                            <Grid container direction='row'>
                              <Grid
                                container
                                spacing={4}
                                item
                                md={12}
                                sm={12}
                                xs={12}
                              >
                                <Grid
                                  item
                                  md={6}
                                  sm={12}
                                  xs={12}
                                >
                                  <div className={classes.expansionPanelDetailsTitle}>{t('provisions.offlinePayment.completePayment.codExp')}</div>

                                  <div className={classes.expansionPanelDetailsValue}>{dossierCode}</div>
                                </Grid>

                                <Grid
                                  item
                                  md={6}
                                  sm={12}
                                  xs={12}
                                >
                                  <div className={classes.expansionPanelDetailsTitle}>{t('provisions.offlinePayment.completePayment.supplyAddress')}</div>

                                  <div className={classes.expansionPanelDetailsValue}>{billingAddress.fullAddress}</div>
                                </Grid>
                                <Grid
                                  item
                                  md={6}
                                  sm={12}
                                  xs={12}
                                >
                                  <div className={classes.expansionPanelDetailsTitle}>{t('provisions.offlinePayment.completePayment.amountToPay')}</div>

                                  <div className={classes.expansionPanelDetailsValue}>{amount + '€'}</div>
                                </Grid>

                                <Grid
                                  item
                                  md={6}
                                  sm={12}
                                  xs={12}
                                >
                                  <div className={classes.expansionPanelDetailsTitle}>{t('provisions.offlinePayment.completePayment.payerDocNumber')}</div>

                                  <div className={classes.expansionPanelDetailsValue}>{userDNI}</div>
                                </Grid>
                              </Grid>
                              <Grid container justifyContent='center' className={classes.greySubtitleV2}>
                                <span>{`${t('provisions.offlinePayment.popup.subtitle')} `}<Link to='/'>{t('provisions.offlinePayment.popup.link')}</Link>{t('common.punctuation.dot')}</span>
                              </Grid>
                            </Grid>
                          </ExpansionPanelDetails>
                        </Grid>

                        <Grid container direction='column' className={classes.block}>

                          <Grid item lg={4} md={12} sm={12} xs={12} />
                          <Grid container direction='column'>
                            <Grid item className={classes.paymentSubtitle}>
                              {t('provisions.offlinePayment.completePayment.paymentMethod')}
                            </Grid>

                            <Grid item className={classes.paymentText}>
                              {t('provisions.offlinePayment.completePayment.selectPayment')}
                            </Grid>
                          </Grid>

                          <Grid container className={classes.forms}>
                            <Grid item lg={5} md={12} sm={12} xs={12}>
                              <Grid container alignItems='center' direction='column'>
                                <Card selected={credit} type={0} onClick={handleCreditClick} />
                                <Card selected={bizum} type={2} onClick={handleBizumClick} />
                                <Card selected={bank} type={1} onClick={handleBankClick} />
                              </Grid>
                            </Grid>

                            <Grid item lg={7} md={12} sm={12} xs={12}>
                              <Grid container alignItems='center' justify='center'>
                                {
                                  current === 0 && cardPaymentActive ?
                                    <>
                                      <CreditForm
                                        merchantId={PAYMENT_GATEWAY_MERCHANT_ID}
                                        account={PAYMENT_GATEWAY_ACCOUNT}
                                        currency={PAYMENT_GATEWAY_CURRENCY}
                                        timestamp={timestamp}
                                        orderId={orderId1}
                                        cardholderName={cardholderName}
                                        setCardholderName={setCardholderName}
                                        cardNumber={cardNumber}
                                        setCardNumber={setCardNumber}
                                        expiryDate={expiryDate}
                                        setExpiryDate={setExpiryDate}
                                        cvn={cvn}
                                        setCvn={setCvn}
                                        userDNI={userDNI}
                                        userPhone={userPhone}
                                        userEmail={userEmail}
                                        amount={amount.replace(',', '')}
                                        dossierCode={dossierCode}
                                      />

                                      {
                                        (current === 0 && cardPaymentActive) &&
                                        <Grid item className={classes.buttons}>
                                          <Grid container justify='center'>
                                            {
                                              current === 0 &&
                                              <>
                                                <Button
                                                  id='pay-button'
                                                  className={classes.button}
                                                  text={t('provisions.payment.buttons.pay')}
                                                  color='primary'
                                                  size='large'
                                                  variant='contained'
                                                  disabled={adminCheck() || !firstStep || bizumProces}
                                                  onClick={submitToHpp}
                                                />
                                              </>
                                            }
                                          </Grid>
                                        </Grid>
                                      }

                                    </>
                                    : current === 1 && transferPaymentActive ?
                                      <BankForm
                                        amount={amount.replace(',', '.')}
                                        dossierCod={dossierCode}
                                      />
                                      : current === 2 && bizumPaymentActive ?
                                        <>
                                          <BizumForm
                                            DS_SIGNATUREVERSION={signatureVersion}
                                            DS_MERCHANTPARAMETERS={merchantParameters}
                                            DS_SIGNATURE={signature}
                                          />
                                          {
                                            (current === 2 && bizumPaymentActive) &&
                                            <Grid item className={classes.buttons}>
                                              <Grid container justify='center'>
                                                {
                                                  current === 2 &&
                                                  <>
                                                    <Button
                                                      id='pay-button'
                                                      className={classes.button}
                                                      text={t('provisions.payment.buttons.pay')}
                                                      color='primary'
                                                      size='large'
                                                      variant='contained'
                                                      disabled={adminCheck() || !firstStep || bizumProces}
                                                      onClick={submitBizum}
                                                    />
                                                  </>
                                                }
                                              </Grid>
                                            </Grid>
                                          }
                                        </>
                                        : !transferPaymentActive || !cardPaymentActive || !bizumPaymentActive?
                                          <Grid
                                            container
                                            justify='center'
                                            alignItems='center'
                                            className={classes.functionDisabled}
                                          >
                                            <img src={AlertIcon} />
                                            <Grid container lg={9} md={10} sm={11}>
                                              <Grid container alignItems='center'>
                                                <Grid item md={11} sm={10} xs={12} className={classes.functionDisabledTitle}>
                                                  {t('courtesy.functionDisabled')}
                                                </Grid>
                                              </Grid>
                                            </Grid>
                                          </Grid>
                                          :
                                          <p />
                                }
                              </Grid>
                            </Grid>

                            <Grid container alignItems='center' justifyContent='center' style={{marginTop:'10px'}}>
                              <label className={classes.policy}>
                                {t('provisions.payment.privacyPolicy')}
                                  <a className={classes.link} target='_blank' href='https://www.ufd.es/informacion-sobre-cancelacion-de-expedientes/'>                          
                                    {t('provisions.payment.here')}
                                  </a>
                                  <img src={TabIcon} alt=''  className={classes.tabIcon}/>
                              </label>
                          </Grid>

                          </Grid>
                        </Grid>
                      </Grid>
                    }
                    <Button
                      text={t('provisions.offlinePayment.completePayment.exitPayment.outButton')}
                      className={classes.button}
                      color='primary'
                      size='large'
                      variant='contained'
                      disabled={toExit}
                      onClick={() => {
                        setToExit(true)
                      }}
                    />
                    {toExit &&
                      <Grid item className={classes.centred}>
                        <Grid container direction='column' className={classes.block}>
                          <Grid
                            container
                            justify='center'
                            alignItems='center'
                            direction='column'
                            className={classes.functionDisabled3}
                          >
                            <Grid item>
                              <img src={AlertIcon} />
                            </Grid>
                            <Grid item className={classes.functionDisabledTitle}>
                              {t('provisions.offlinePayment.completePayment.exitPayment.question')}
                            </Grid>
                            <Grid item className={classes.bluePaymentText}>
                              {t('provisions.offlinePayment.completePayment.exitPayment.lostData')}
                            </Grid>
                            <Grid container justifyContent='center' className={classes.buttons}>
                              <Button
                                text={t('common.buttons.cancel')}
                                color='inherit'
                                size='large'
                                variant='contained'
                                onClick={() => {
                                  setToExit(false)
                                }}
                              />

                              <Button
                                text={t('common.buttons.accept')}
                                color='primary'
                                size='large'
                                variant='contained'
                                onClick={() => {
                                  props.history.push('/login')
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    }
                  </Grid>
                </Grid>
              </Grid>
              : firstStep && completedPayment &&
              <Grid
                container
                justifyContent='center'
                alignItems='center'
                direction='column'
              >
                <Grid item className={classes.maxWidthForBigScreens}>
                  <Grid item container direction='column' justifyContent='center' alignItems='center' className={classes.form2}>
                    <Grid container className={classes.container}>
                      {
                        isLoading &&
                        <Spinner fixed />
                      }

                      {
                        !isLoading &&
                        <Grid item className={classes.centred}>
                          <Grid item className={classes.title}>{t('provisions.offlinePayment.paymentTitle')}</Grid>

                          <Grid container direction='column' className={classes.block}>

                            <label className={classes.bluePaymentText}>
                              {timestampPayment}
                            </label>

                            <Grid item className={classes.paymentTitle}>{t('provisions.offlinePayment.completePayment.budgetPayed')}</Grid>

                            <Grid item>
                              <label className={classes.payment}>{amount}{t('provisions.payment.budgetBadge')}</label>
                            </Grid>
                            <label className={classes.bluePaymentText}>
                              {t('provisions.offlinePayment.completePayment.ivaIncluded')}
                            </label>

                            <ExpansionPanelDetails>
                              <Grid
                                container
                                spacing={4}
                                item
                                md={12}
                                sm={12}
                                xs={12}
                              >
                                <Grid
                                  item
                                  md={4}
                                  sm={12}
                                  xs={12}
                                >
                                  <div className={classes.expansionPanelDetailsTitle}>{t('provisions.offlinePayment.codExp')}</div>

                                  <div className={classes.expansionPanelDetailsValue}>{dossierCode}</div>
                                </Grid>

                                <Grid
                                  item
                                  md={4}
                                  sm={12}
                                  xs={12}
                                >
                                  <div className={classes.expansionPanelDetailsTitle}>{t('provisions.offlinePayment.completePayment.supplyAddress')}</div>

                                  <div className={classes.expansionPanelDetailsValue}>{billingAddress.fullAddress}</div>
                                </Grid>

                                <Grid
                                  item
                                  md={4}
                                  sm={12}
                                  xs={12}
                                >
                                  <div className={classes.expansionPanelDetailsTitle}>{t('provisions.offlinePayment.completePayment.payerDocNumber')}</div>

                                  <div className={classes.expansionPanelDetailsValue}>{userDNI}</div>
                                </Grid>
                              </Grid>
                            </ExpansionPanelDetails>
                          </Grid>

                          <Grid container direction='column' className={classes.block}>

                            <Grid item lg={4} md={12} sm={12} xs={12} />
                            <Grid container direction='column'>

                              <Grid item>
                                <Grid className={classes.paymentText}>
                                  {t('provisions.offlinePayment.completePayment.sendBill')}
                                </Grid>

                                <Grid className={classes.paymentText}>
                                  {t('provisions.offlinePayment.completePayment.consult')}
                                </Grid>

                                <Grid container alignItems='center' justifyContent='center' style={{marginTop:'30px'}}>
                                  <label className={classes.policy}>
                                    {t('provisions.payment.privacyPolicy')}
                                      <a className={classes.link} target='_blank' href='https://www.ufd.es/informacion-sobre-cancelacion-de-expedientes/'>                          
                                        {t('provisions.payment.here')}
                                      </a>
                                      <img src={TabIcon} alt=''  className={classes.tabIcon}/>
                                  </label>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      }
                    </Grid>
                    <Button
                      text={t('provisions.offlinePayment.completePayment.exitPayment.outButton')}
                      className={classes.button}
                      color='primary'
                      size='large'
                      variant='contained'
                      onClick={() => {
                        props.history.push('/login')
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
        }
      </Grid>
    </>
  )
}

export default OfflinePayment
