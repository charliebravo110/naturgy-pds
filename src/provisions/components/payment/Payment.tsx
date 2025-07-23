import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import sha1 from 'sha1'

import Grid from '@material-ui/core/Grid'

import Spinner from '../../../common/components/spinner/Spinner'
import Button from '../../../common/components/button/Button'
import Switch from '../../../common/components/switch/Switch'
import OkIcon from '../../../assets/icons/aviso_ok.svg'
import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg';
import TabIcon from '../../../assets/icons/tab.svg';

import Card from './payment-card/Card'
import CreditForm from './payment-form/credit-form/Form'
import BankForm from './payment-form/bank-form/Form'
import BizumForm from './payment-form/Bizum-form/Form2'
import PayedAdvise from './payed-advise/PayedAdvise'
import DocumentUploadFrame from '../documentation/document-upload-frame/DocumentUploadFrame'

import { adminCheck, validateMail } from '../../../common/lib/ValidationLib'

import { showError } from '../../../common/store/actions/ErrorActions'
import { thunkCreateCardPayment, thunkGetMasterData, thunkUpdateDossier, thunkBizumPayment } from '../../store/actions/ProvisionsThunkActions'
import { generateRandomNumberString, generateRandomString } from '../../../common/lib/FormatLib'

import useStyles from './Payment.styles'
import Input from '../../../common/components/input/Input'
import { getExpStatus, sendGAEvent } from '../../../core/utils/gtm'

const PAYMENT_GATEWAY_URL = process.env.REACT_APP_PAYMENT_GATEWAY_URL
const PAYMENT_GATEWAY_URL_PAY = process.env.REACT_APP_PAYMENT_GATEWAY_URL_PAY
const PAYMENT_GATEWAY_MERCHANT_ID = process.env.REACT_APP_PAYMENT_GATEWAY_MERCHANT_ID
const PAYMENT_GATEWAY_ACCOUNT = process.env.REACT_APP_PAYMENT_GATEWAY_ACCOUNT
const PAYMENT_GATEWAY_CURRENCY = process.env.REACT_APP_PAYMENT_GATEWAY_CURRENCY
const PAYMENT_GATEWAY_SECRET = process.env.REACT_APP_GATEWAY

const Budget = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { state, paymentDoneBudget, paymentQueryExecuting, indAceptoFacturaDigital, setIndAceptoFacturaDigital, baremos } = props

  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)
  const provisions = useSelector((state: any) => state.provisions)
  const user = useSelector((state: any) => state.user)
  const billemail = useSelector((state: any) => provisions.currentProvision.billingEmail)
  const [billEmail, setBillEmail] = useState(indAceptoFacturaDigital === '1' ? false : true)
  const [billingEmail, setBillingEmail] = useState(billemail)
  //const [nameAndSurname, setNameAndSurname] = useState('')
  const [address, setAddress] = useState(provisions.currentProvision.invoiceAddress.streetName)
  const [zipcode, setZipcode] = useState(provisions.currentProvision.invoiceAddress.zipcode)
  const [stateProv, setStateProv] = useState(provisions.currentProvision.invoiceAddress.state)
  const [town, setTown] = useState(provisions.currentProvision.invoiceAddress.town)

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

  const payer = (user && user.profile && user.profile.documentNumber && currentProvision && currentProvision.payer && currentProvision.payer.docNumber === user.profile.documentNumber) ? true : false

  const [errors, setErrors] = useState({
    email1: false,
    nameAndSurname: false,
    address: false,
    zipcode: false,
    stateProv: false,
    town: false,
  })

  const filteredSentDocumentList = currentProvision && currentProvision.documentList && currentProvision.documentList.sentDocument && currentProvision.documentList.sentDocument.filter((item) => item.documentType === 'DOCTYP0203' && (item.comment === 'Justificante de pago' || item.observations === 'Justificante de pago'))
  const [sentDocument, setSentDocument] = useState(filteredSentDocumentList ? filteredSentDocumentList : [])

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

  const [signatureVersion, setSignatureVersion] = useState('')
  const [merchantParameters, setMerchantParameters] = useState('')
  const [signature, setSignature] = useState('')

  const pad2 = (n) => {
    return n < 10 ? '0' + n : n
  }

  const paymentFrame = true;

  useEffect(() => {
    if (currentProvision && currentProvision.documentList && currentProvision.documentList.nSentDocument) {
      currentProvision.documentList.nSentDocument.forEach(item => {
        if (item.documentType === 'DOCTYP0203') setUploaded(true)
      })
    }
  }, [currentProvision])

  const selectPaymentErrorCode = (result: string) => {

    const primerDigito = Array.from(result)[0];

    if (primerDigito === '1') {
      return result
    } else if (primerDigito === '2') {
      return '200';
    } else if (primerDigito === '3') {
      return '300';
    } else if (primerDigito === '9') {
      return '999';
    } else {
      return '3001'
    }

  }

  let date = new Date()
  let timestamp = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds())
  const documentType = 'DOCTYP0334'
  const [documentTypeName, setDocumentTypeName] = useState('')

  let orderId1 = '';

  if (indAceptoFacturaDigital === '') {
    setIndAceptoFacturaDigital(0)
    setBillingEmail('')
  }

  /* Comprobación de flags métodos de pago */
  useEffect(() => {
    dispatch(thunkGetMasterData(
      'TRANSFER_PAYMENT_FLAG',
      'ES',
      '',
      (response) => {
        if (response && response.length > 0) {
          setTransferPaymentActive(response[0].value === '1')
        }
      }
    ))

    dispatch(thunkGetMasterData(
      'CARD_PAYMENT_FLAG',
      'ES',
      '',
      (response) => {
        if (response && response.length > 0) {
          setCardPaymentActive(response[0].value === '1')

        }
      }
    ))

    dispatch(thunkGetMasterData(
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


  /* Cargar nombre del documento */
  useEffect(() => {
    dispatch(thunkGetMasterData('DOCUMENT_TYPE_ID', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), documentType, (response) => {
      if (response && response.length > 0) {
        setDocumentTypeName(response[0].value)
      }
    }))
    // eslint-disable-next-line
  }, [user])

  /* Comprobacion justificante subido */
  useEffect(() => {
    if (sentDocument && sentDocument.documentCode) {
      setUploaded(true)
    }
    else if (sentDocument.length > 1) {
      sentDocument.map((item, i) => {
        if (item.documentCode) {
          setUploaded(true)
        }
      })
    }
  }, [sentDocument])

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
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      subsection_name: 'detalle de solicitud',
      title_screen: 'importe a pagar',
      click_text: 'pagar',
      element_type:'consulta de informacion',
      page_url:window.location.href,
      request_number:currentProvision.dossierCod,
      request_status:getExpStatus(currentProvision.dossierStatusId),
      payment_type:'tarjeta de credito',
      budget_value: (provisions.currentProvision.valoration.valorationTotalAmount * 100).toFixed(0).toString,//provisions.currentProvision && provisions.currentProvision.valoration && provisions.currentProvision.valoration.valorationTotalAmount && (provisions.currentProvision.valoration.valorationTotalAmount * 100).toFixed(0).toString
      type_budget: 'no aplica', //FALTA POR TERMINAR
      tab_name: 'mi conexion a la red',
      request_type: 'quiero una nueva conexion a la red',
      request_step_name: 'pago',
      browsing_type: sessionStorage.getItem('browsing_type'),
    })

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

    const string = timestamp + '.' + PAYMENT_GATEWAY_MERCHANT_ID + '.' + orderId1 + '.' + (provisions.currentProvision && provisions.currentProvision.valoration && provisions.currentProvision.valoration.valorationTotalAmount && (provisions.currentProvision.valoration.valorationTotalAmount * 100).toFixed(0)) + '.' + PAYMENT_GATEWAY_CURRENCY

    const encryptedString1 = sha1(string)

    const encryptedString2 = sha1(encryptedString1 + PAYMENT_GATEWAY_SECRET)

    let hashInput = document.getElementById('hash') as any
    hashInput.value = encryptedString2

    hiddenForm.submit()
    const body = {
      dossierNumber: provisions.currentProvision && provisions.currentProvision.dossierCod,
      orderId: orderId1,
      status: t('provisions.payment.pending'),
      requestTimestamp: timestamp,
      responseTimestamp: '',
      merchantId: PAYMENT_GATEWAY_MERCHANT_ID,
      amount: provisions.currentProvision && provisions.currentProvision.valoration && provisions.currentProvision.valoration.valorationTotalAmount && (provisions.currentProvision.valoration.valorationTotalAmount * 100).toFixed(0),
      sha1hash: encryptedString2,
      hppCustomerEmail: (user && user.profile) && user.profile.email,
      hppBillingStreet1: provisions.currentProvision && (provisions.currentProvision.streetType + ' ' + provisions.currentProvision.streetName),
      hppBillingStreet2: provisions.currentProvision && provisions.currentProvision.num,
      hppBillingStreet3: provisions.currentProvision && (provisions.currentProvision.floor + ' ' + provisions.currentProvision.door),
      hppBillingCity: provisions.currentProvision && provisions.currentProvision.place,
      hppBillingPostalcode: provisions.currentProvision && provisions.currentProvision.zipcode,
      hppBillingCountry: '724',
      account: PAYMENT_GATEWAY_ACCOUNT,
      comment1: t('provisions.payment.comment1') + ' ' + (provisions.currentProvision && provisions.currentProvision.dossierCod),
      custNum: (user && user.profile) && user.profile.documentNumber,
      varRef: provisions.currentProvision && provisions.currentProvision.dossierCod.replace('EXP', ''),
      prodId: provisions.currentProvision && provisions.currentProvision.dossierCod,
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

      } else {
        document.getElementById('spinner').classList.add('hidden')
      }
    }))
  }

  const submitBizum = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event:'request_funnel',
      section_name:'mi conexion a la red',
      subsection_name:'detalle de solicitud',
      title_screen:'importe a pagar',
      click_text:'pagar',
      element_type:'consulta de informacion',
      page_url:window.location.href,
      request_number:currentProvision.dossierCod,
      request_status:getExpStatus(currentProvision.dossierStatusId),
      payment_type:'bizum',
      budget_value: (provisions.currentProvision.valoration.valorationTotalAmount * 100).toFixed(0).toString,//provisions.currentProvision && provisions.currentProvision.valoration && provisions.currentProvision.valoration.valorationTotalAmount && (provisions.currentProvision.valoration.valorationTotalAmount * 100).toFixed(0).toString
      type_budget: 'no aplica', //FALTA POR TERMINAR
      tab_name: 'mi conexion a la red',
      request_type: 'quiero una nueva conexion a la red',
      request_step_name: 'pago',
      browsing_type: sessionStorage.getItem('browsing_type'),
    })

    setBizumProces(true)

    let hiddenFormBizum = document.getElementById('hiddenFormBizum') as any

    orderId1 = generateRandomNumberString(4) + generateRandomString(8)
    sessionStorage.setItem('orderId', orderId1)

    const bizumPayment = {
      orderId: orderId1,
      expediente: provisions.currentProvision && provisions.currentProvision.dossierCod,
      productDesCription: provisions.currentProvision && provisions.currentProvision.dossierCod,
      custId: (user && user.profile) && user.profile.documentNumber,
      custEmail: provisions.currentProvision.billingEmail,
      custName: '',
      custPhone: '',
      custBillingStreet1: provisions.currentProvision && (provisions.currentProvision.streetType + ' ' + provisions.currentProvision.streetName),
      custBillingStreet2: provisions.currentProvision && provisions.currentProvision.num,
      custBillingStreet3: provisions.currentProvision && (provisions.currentProvision.floor + ' ' + provisions.currentProvision.door),
      custBillingCity: provisions.currentProvision && provisions.currentProvision.place,
      custBillingPostalcode: provisions.currentProvision && provisions.currentProvision.zipcode,
      terminal: '871',
      transactionType: '0',
      amount: provisions.currentProvision && provisions.currentProvision.valoration && provisions.currentProvision.valoration.valorationTotalAmount && (provisions.currentProvision.valoration.valorationTotalAmount * 100).toFixed(0),
      sumTotal: provisions.currentProvision && provisions.currentProvision.valoration && provisions.currentProvision.valoration.valorationTotalAmount && (provisions.currentProvision.valoration.valorationTotalAmount * 100).toFixed(0),
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
  }

  const trimDate = (date: String) => {
    //20231201113427
    let dateArray = date.split('')
    let trimmedDate = dateArray[6] + dateArray[7] + '/' + dateArray[4] + dateArray[5] + '/' + dateArray[0] + dateArray[1] + dateArray[2] + dateArray[3] + ' ' + dateArray[8] + dateArray[9] + ':' + dateArray[10] + dateArray[11] + ':' + dateArray[12] + dateArray[13]
    return trimmedDate
  }

  const handleMessage = (event) => {
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

          document.getElementById('spinner').classList.remove('hidden')

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

          const body = {
            dossierNumber: provisions.currentProvision && provisions.currentProvision.dossierCod,
            orderId: orderIdResponse,
            status,
            requestTimestamp: '',
            responseTimestamp: data && atob(data.TIMESTAMP),
            merchantId: PAYMENT_GATEWAY_MERCHANT_ID,
            amount: provisions.currentProvision && provisions.currentProvision.valoration && provisions.currentProvision.valoration.valorationTotalAmount && (provisions.currentProvision.valoration.valorationTotalAmount * 100).toFixed(0),
            sha1hash: hash && hash.value,
            hppCustomerEmail: (user && user.profile) && user.profile.email,
            hppBillingStreet1: provisions.currentProvision && (provisions.currentProvision.streetType + ' ' + provisions.currentProvision.streetName),
            hppBillingStreet2: provisions.currentProvision && provisions.currentProvision.num,
            hppBillingStreet3: provisions.currentProvision && (provisions.currentProvision.floor + ' ' + provisions.currentProvision.door),
            hppBillingCity: provisions.currentProvision && provisions.currentProvision.place,
            hppBillingPostalcode: provisions.currentProvision && provisions.currentProvision.zipcode,
            hppBillingCountry: '724',
            account: PAYMENT_GATEWAY_ACCOUNT,
            comment1: t('provisions.payment.comment1') + ' ' + (provisions.currentProvision && provisions.currentProvision.dossierCod),
            custNum: (user && user.profile) && user.profile.documentNumber,
            varRef: provisions.currentProvision && provisions.currentProvision.dossierCod.replace('EXP', ''),
            prodId: provisions.currentProvision && provisions.currentProvision.dossierCod,
            result: data && atob(data.RESULT),
            message,
            authcode: data && atob(data.AUTHCODE),
            pasref: data && atob(data.pas_uuid),
            cvnresult: data && atob(data.CVNRESULT),
            batchid: data && atob(data.BATCHID),
            eci: data.ECI && atob(data.ECI),
            cavv: data.CAVV && atob(data.CAVV),
            xid: data.XID && atob(data.XID)
          } as any

          isFirstStepCompleted = false

          if (isCardPaymentReady) {

            /* INICIO - ADN - 07/06/2023 */
            const dataDossier = {
              dossierCod: provisions.currentProvision && provisions.currentProvision.dossierCod,
              applicant: {
                docNumber: (user && user.profile) && user.profile.documentNumber
              },
              paymentOnline: {
                custNum: (user && user.profile) && user.profile.documentNumber,
                prodId: provisions.currentProvision && provisions.currentProvision.dossierCod,
                result: atob(data.RESULT),
                amount: provisions.currentProvision && provisions.currentProvision.valoration && provisions.currentProvision.valoration.valorationTotalAmount && (provisions.currentProvision.valoration.valorationTotalAmount * 100).toFixed(0),
                orderId: orderIdResponse,
                pasRef: data && atob(data.pas_uuid),
                timestampRespuesta: data && trimDate(atob(data.TIMESTAMP)),
                paymentMethod: 'CARD'
              }
            }

            //Comprobación baremo anticipado
            if (baremos && baremos.isBaremoAnticip) {
              dispatch(thunkCreateCardPayment(body, (response) => {
                if (response) {
                  if (atob(data.RESULT) === '00') {

                    //pago realizado correctamente y guardado en la tabla, pero no en Zeus
                    setCompletedPayment(true)

                  } else {
                    document.getElementById('spinner').classList.add('hidden')
                    document.getElementById('pay-button').removeAttribute('disabled')
                    document.getElementById('pay-button').classList.remove('Mui-disabled')
                    document.getElementById('hiddeniFrame').style.height = '54px'
                    dispatch(showError(selectPaymentErrorCode(atob(data.RESULT)), 'doCardPayment'))
                  }
                }

                document.getElementById('spinner').classList.add('hidden')
              }))
            } else {
              dispatch(thunkCreateCardPayment(body, (response) => {
                if (response) {
                  if (atob(data.RESULT) === '00') {
                    //pago realizado correctamente y guardado en la tabla
                    dispatch(thunkUpdateDossier(provisions.currentProvision.dossierCod, false, dataDossier, (response) => {
                    }))
                    setCompletedPayment(true)
                  } else {
                    document.getElementById('spinner').classList.add('hidden')
                    document.getElementById('pay-button').removeAttribute('disabled')
                    document.getElementById('pay-button').classList.remove('Mui-disabled')
                    document.getElementById('hiddeniFrame').style.height = '54px'
                    dispatch(showError(selectPaymentErrorCode(atob(data.RESULT)), 'doCardPayment'))
                  }
                }

                document.getElementById('spinner').classList.add('hidden')
              }))
            }
            /* FIN - ADN - 07/06/2023 */
          } else {
            document.getElementById('spinner').classList.add('hidden')
          }
        } else {
          document.getElementById('spinner').classList.add('hidden')
          document.getElementById('pay-button').removeAttribute('disabled')
          document.getElementById('pay-button').classList.remove('Mui-disabled')
        }
      } else {
        // error no controlado sin formato JSON
        let hash = document.getElementById('hash') as any
        let order = sessionStorage.getItem('orderId');
        let message = data.substring(0, 40);
        let comentario = data.substring(40, 230);
        let status = 'KO';

        document.getElementById('spinner').classList.add('hidden')
        document.getElementById('pay-button').removeAttribute('disabled')
        document.getElementById('pay-button').classList.remove('Mui-disabled')

        const body2 = {
          dossierNumber: provisions.currentProvision && provisions.currentProvision.dossierCod,
          orderId: order,
          status,
          requestTimestamp: '',
          responseTimestamp: timestamp,
          merchantId: PAYMENT_GATEWAY_MERCHANT_ID,
          amount: provisions.currentProvision && provisions.currentProvision.valoration && provisions.currentProvision.valoration.valorationTotalAmount && (provisions.currentProvision.valoration.valorationTotalAmount * 100).toFixed(0),
          sha1hash: hash && hash.value,
          hppCustomerEmail: (user && user.profile) && user.profile.email,
          hppBillingStreet1: provisions.currentProvision && (provisions.currentProvision.streetType + ' ' + provisions.currentProvision.streetName),
          hppBillingStreet2: provisions.currentProvision && provisions.currentProvision.num,
          hppBillingStreet3: provisions.currentProvision && (provisions.currentProvision.floor + ' ' + provisions.currentProvision.door),
          hppBillingCity: provisions.currentProvision && provisions.currentProvision.place,
          hppBillingPostalcode: provisions.currentProvision && provisions.currentProvision.zipcode,
          hppBillingCountry: '724',
          account: PAYMENT_GATEWAY_ACCOUNT,
          comment1: comentario,
          custNum: (user && user.profile) && user.profile.documentNumber,
          varRef: provisions.currentProvision && provisions.currentProvision.dossierCod.replace('EXP', ''),
          prodId: provisions.currentProvision && provisions.currentProvision.dossierCod,
          result: '999',
          message,
          authcode: '',
          pasref: '',
          cvnresult: '',
          batchid: '',
          eci: '',
          cavv: '',
          xid: ''
        } as any

        dispatch(thunkCreateCardPayment(body2, (response) => {
          if (response) {

          } else {
            dispatch(showError('3001', 'doCardPayment'))
          }

        }))
        dispatch(showError('999', 'doCardPayment'))

        document.getElementById('spinner').classList.add('hidden')
        document.getElementById('pay-button').removeAttribute('disabled')
        document.getElementById('pay-button').classList.remove('Mui-disabled')
        document.getElementById('hiddeniFrame').style.height = '54px'

      }
    }
  }


  useEffect(() => {
    window.addEventListener('message', handleMessage, true)

    return () => {
      document.removeEventListener('message', handleMessage, true)
    }
    // eslint-disable-next-line
  }, [])

  // Control del pago por transferencia
  useEffect(() => {
    if (current === 1 && uploaded && !completedPayment) {
      const body = {
        dossierNumber: provisions.currentProvision && provisions.currentProvision.dossierCod,
        orderId: 'T'
      }

      dispatch(thunkCreateCardPayment(body, (response) => {
        if (response && response.result && response.result.codResult && response.result.codResult === '0000') {
          setCompletedPayment(true)
        } else {
          dispatch(showError('3001', 'doCardPayment'))
        }
      }))
    }
    else if (current === 0 && uploaded && !completedPayment) {
      setCompletedPayment(true)
    }
    // eslint-disable-next-line
  }, [current, uploaded, completedPayment])

  const handleSetBillEmail = (e) => {
    if (e.target.checked) {
      setBillEmail(true)
      setIndAceptoFacturaDigital(0)
      setBillingEmail('')
    } else {
      setBillEmail(false)
      setIndAceptoFacturaDigital(1)
    }
  }

  function isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

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

  const validateEmpty = (e, index) => {
    if (e.target.value !== '') {
      //setInvalidNameAndSurname(false)
      setErrors({ ...errors, nameAndSurname: false })
    } else {
      switch (index) {
        //case 'nameAndSurname':
        //setInvalidNameAndSurname(true)
        //  setErrors({ ...errors, nameAndSurname: true })
        //  break
        case 'address':
          setInvalidAddress(true)
          setErrors({ ...errors, address: true })
          break
        case 'zipcode':
          setInvalidZipcode(true)
          setErrors({ ...errors, zipcode: true })
          break
        case 'stateProv':
          setInvalidStateProv(true)
          setErrors({ ...errors, stateProv: true })
          break
        case 'town':
          setInvalidTown(true)
          setErrors({ ...errors, town: true })
          break
      }

    }

  }

  return (
    <>
      {/* <TituloHabilitante location={3} /> */}

      {
        state >= 7 ?
          <PayedAdvise amount={currentProvision && currentProvision.valoration && currentProvision.valoration.valorationTotalAmount && currentProvision.valoration.valorationTotalAmount} />
          :
          <Grid container className={classes.container}>
            {
              isLoading &&
              <Spinner fixed />
            }



            {
              !paymentQueryExecuting && completedPayment &&
              <Grid container>
                <Grid container direction='column' justifyContent='center' alignItems='center'>
                  <Grid item>
                    <img src={OkIcon} alt='' />
                  </Grid>

                  <Grid item className={classes.completedTitle}>
                    {t('provisions.payment.completed.title')}
                  </Grid>

                  <Grid item className={classes.completedDescription}>
                    {t('provisions.payment.completed.description')}
                  </Grid>
                </Grid>
              </Grid>
            }

            {
              !paymentQueryExecuting && !completedPayment &&
              <Grid item xs={11} sm={11} md={11}>
                <div className={classes.title}>{t('provisions.payment.title')}</div>

                <Grid container direction='column' className={classes.block}>
                  <Grid item>
                    <label className={classes.paymentTitle}>{t('provisions.payment.budget')}</label>
                  </Grid>

                  <Grid item>
                    <Grid container direction='column'>
                      <Grid item>
                        <label className={classes.payment}>{currentProvision && currentProvision.valoration && currentProvision.valoration.valorationTotalAmount && currentProvision.valoration.valorationTotalAmount}{t('provisions.payment.budgetBadge')}</label>
                      </Grid>

                      <Grid item>
                        <label className={classes.iva}>{t('provisions.payment.iva')}</label>
                      </Grid>
                    </Grid>
                  </Grid>

                  <div className={classes.separator} />

                  <Grid item lg={4} md={12} sm={12} xs={12} />
                  {
                    ((current === 1 && transferPaymentActive) || (current === 0 && cardPaymentActive)) &&
                    <Grid item lg={8} md={12} sm={12} xs={12} className={classes.questions}>
                      {payer === true && currentProvision.isApplyModifyEmailBilling !== '1' ?
                        <>
                          <Grid container justifyContent='space-between' alignItems='center'>
                            <Grid item>
                              <div className={classes.question}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.applicantData.questions.billMail')}</div>
                            </Grid>
                            <Grid item>
                              <Switch onChange={handleSetBillEmail} checked={billEmail} disabled />
                            </Grid>
                          </Grid>
                          {(billEmail === false) &&
                            <Grid container justifyContent='space-between' direction='column' className={classes.questionForm}>

                              <Grid item xs={12} sm={10} md={10} lg='auto' className={classes.subtitle}>
                                {t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.payerSubtitle')}
                              </Grid>

                              <Grid item className={classes.label}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.emailText')}</Grid>
                              <Grid item className={classes.input}>
                                <Input
                                  fullWidth
                                  value={billingEmail !== '' ? billingEmail : (billingEmail && billingEmail !== '') && billingEmail}
                                  disabled
                                />
                              </Grid>


                            </Grid>
                          }
                          {(billEmail === true) &&
                            <>
                              <Grid container justifyContent='space-between' direction='column' className={classes.questionForm}>

                                <Grid item xs={12} sm={10} md={10} lg='auto' className={classes.subtitle}>
                                  {t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.nameAndAddressSubtitle')}
                                </Grid>

                                <Grid item className={classes.label}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.addressText')}</Grid>
                                <Grid item className={classes.input}>
                                  <Input
                                    fullWidth
                                    value={address !== '' ? address : ''}
                                    disabled
                                  />
                                </Grid>

                                <Grid item className={classes.label}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.zipcodeText')}</Grid>
                                <Grid item className={classes.input}>
                                  <Input
                                    fullWidth
                                    value={zipcode !== '' ? zipcode : ''}
                                    disabled
                                  />
                                </Grid>

                                <Grid item className={classes.label}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.stateText')}</Grid>
                                <Grid item className={classes.input}>
                                  <Input
                                    fullWidth
                                    value={stateProv !== '' ? stateProv : ''}
                                    disabled
                                  />
                                </Grid>

                                <Grid item className={classes.label}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.townText')}</Grid>
                                <Grid item className={classes.input}>
                                  <Input
                                    fullWidth
                                    value={town !== '' ? town : ''}
                                    disabled
                                  />
                                </Grid>
                              </Grid>
                            </>
                          }
                        </>
                        :
                        <>
                          <Grid container justifyContent='space-between' alignItems='center'>
                            <Grid item>
                              <div className={classes.question}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.applicantData.questions.billMail')}</div>
                            </Grid>
                            <Grid item>
                              <Switch onChange={handleSetBillEmail} checked={billEmail} />
                            </Grid>
                          </Grid>
                          {(billEmail === false) &&
                            <Grid container justifyContent='space-between' direction='column' className={classes.questionForm}>

                              <Grid item xs={12} sm={10} md={10} lg='auto' className={classes.subtitle}>
                                {t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.payerSubtitle')}
                              </Grid>

                              <Grid item className={classes.label}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.emailText')}</Grid>
                              <Grid item className={classes.input}>
                                <Input
                                  fullWidth
                                  value={billingEmail !== '' ? billingEmail : (billingEmail && billingEmail !== '') && billingEmail}
                                  onChange={(e) => setBillingEmail(e.target.value)}
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
                          }
                          {(billEmail === true) &&
                            <>
                              <Grid container justifyContent='space-between' direction='column' className={classes.questionForm}>

                                <Grid item xs={12} sm={10} md={10} lg='auto' className={classes.subtitle}>
                                  {t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.nameAndAddressSubtitle')}
                                </Grid>

                                <Grid item className={classes.label}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.addressText')}</Grid>
                                <Grid item className={classes.input}>
                                  <Input
                                    fullWidth
                                    value={address !== '' ? address : ''}
                                    onChange={(e) => setAddress(e.target.value)}
                                    onBlur={(e) => validateEmpty(e, 'address')}
                                    error={errors.address}
                                    helperText={errors.address &&
                                      (invalidAddress &&
                                        t('provisions.newProvision.requestData.supplyType.form.errors.required'))}
                                  />
                                </Grid>

                                <Grid item className={classes.label}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.zipcodeText')}</Grid>
                                <Grid item className={classes.input}>
                                  <Input
                                    fullWidth
                                    value={zipcode !== '' ? zipcode : ''}
                                    onChange={(e) => setZipcode(e.target.value)}
                                    onBlur={(e) => validateEmpty(e, 'zipcode')}
                                    error={errors.zipcode}
                                    helperText={errors.zipcode &&
                                      (invalidZipcode &&
                                        t('provisions.newProvision.requestData.supplyType.form.errors.required'))}
                                  />
                                </Grid>

                                <Grid item className={classes.label}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.stateText')}</Grid>
                                <Grid item className={classes.input}>
                                  <Input
                                    fullWidth
                                    value={stateProv !== '' ? stateProv : ''}
                                    onChange={(e) => setStateProv(e.target.value)}
                                    onBlur={(e) => validateEmpty(e, 'stateProv')}
                                    error={errors.stateProv}
                                    helperText={errors.stateProv &&
                                      (invalidStateProv &&
                                        t('provisions.newProvision.requestData.supplyType.form.errors.required'))}
                                  />
                                </Grid>

                                <Grid item className={classes.label}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.subtitle.townText')}</Grid>
                                <Grid item className={classes.input}>
                                  <Input
                                    fullWidth
                                    value={town !== '' ? town : ''}
                                    onChange={(e) => setTown(e.target.value)}
                                    onBlur={(e) => validateEmpty(e, 'town')}
                                    error={errors.town}
                                    helperText={errors.town &&
                                      (invalidTown &&
                                        t('provisions.newProvision.requestData.supplyType.form.errors.required'))}
                                  />
                                </Grid>
                              </Grid>
                            </>
                          }
                        </>
                      }
                    </Grid>
                  }

                  <Grid container direction='column'>
                    <Grid item>
                      <label className={classes.paymentTitle}>{t('provisions.payment.payMethod.title')}</label>
                    </Grid>

                    <Grid item>
                      <label className={classes.paymentSubtitle}>
                        {t('provisions.payment.payMethod.text')}
                      </label>
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
                              />

                              {
                                (current === 0 && cardPaymentActive) &&
                                <Grid item className={classes.buttons}>
                                  <Grid container justify='center'>
                                    {
                                      current === 0 &&
                                      <>
                                        {
                                          /*
                                          <Button
                                            className={classes.button}
                                            text={t('common.buttons.cancel')}
                                            color='inherit'
                                            size='large'
                                            variant='contained'
                                          />
                                          */
                                        }

                                        <Button
                                          id='pay-button'
                                          className={classes.button}
                                          text={t('provisions.payment.buttons.pay')}
                                          color='primary'
                                          size='large'
                                          variant='contained'
                                          disabled={adminCheck() || bizumProces}
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
                                amount={currentProvision && currentProvision.valoration && currentProvision.valoration.valorationTotalAmount && currentProvision.valoration.valorationTotalAmount}
                                dossierCod={currentProvision && currentProvision.dossierCod}
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
                                                disabled={adminCheck() || bizumProces}
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

                    {
                      (current === 1 && transferPaymentActive) &&
                      <Grid container alignItems='center' justifyContent='center' direction='column'>
                        {
                          uploaded ?
                            sentDocument && sentDocument.length > 0 && sentDocument[0].documentCode &&
                            <DocumentUploadFrame
                              key={0}
                              documentumId={sentDocument[0].documentumId}
                              documentType={sentDocument[0].documentType}
                              documentStatus={sentDocument[0].statusId}
                              registerDate={sentDocument[0].registerDate}
                              comment={sentDocument[0].comment}
                              billingEmail={billingEmail}
                              indAceptoFacturaDigital={indAceptoFacturaDigital}
                              address={address}
                              zipcode={zipcode}
                              stateProv={stateProv}
                              town={town}
                              paymentFrame={paymentFrame}
                              budgetValue={(provisions.currentProvision.valoration.valorationTotalAmount * 100).toFixed(0).toString}
                            />
                            :
                            <DocumentUploadFrame
                              documentType={documentType}
                              documentTypeName={documentTypeName}
                              documentStatus={'DOCSTA0005'}
                              uploadState={''}
                              comment={'Justificante de la transferencia'}
                              uploaded={uploaded}
                              setUploaded={setUploaded}
                              setSentDocument={setSentDocument}
                              billingEmail={billingEmail}
                              indAceptoFacturaDigital={indAceptoFacturaDigital}
                              address={address}
                              zipcode={zipcode}
                              stateProv={stateProv}
                              town={town}
                              showUploaded={true}
                              paymentFrame={paymentFrame}
                              budgetValue={(provisions.currentProvision.valoration.valorationTotalAmount * 100).toFixed(0).toString}
                            />
                        }
                        {
                          !uploaded &&
                          <div className={classes.error}>{t('provisions.payment.noProof')}</div>
                        }
                      </Grid>
                    }

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
          </Grid>
      }

    </>
  )
}

export default Budget
