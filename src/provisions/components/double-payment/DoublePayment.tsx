import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import sha1 from 'sha1'

import Grid from '@material-ui/core/Grid'

import Spinner from '../../../common/components/spinner/Spinner'
import Button from '../../../common/components/button/Button'
import OkIcon from '../../../assets/icons/aviso_ok.svg'
import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg';
import TabIcon from '../../../assets/icons/tab.svg';

import Card from './payment-card/Card'
import CreditForm from './payment-form/credit-form/Form'
import BankForm from './payment-form/bank-form/Form'
import PayedAdvise from './payed-advise/PayedAdvise'
import DocumentUploadFrame from '../documentation/document-upload-frame/DocumentUploadFrame'

import { adminCheck } from '../../../common/lib/ValidationLib'

import { showError } from '../../../common/store/actions/ErrorActions'
import { thunkCreateCardPayment, thunkGetMasterData, thunkUpdateDossier } from '../../store/actions/ProvisionsThunkActions'
import { generateRandomString } from '../../../common/lib/FormatLib'

import useStyles from './DoublePayment.styles'

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

  const { state, paymentDoneBudget, paymentQueryExecuting, milestoneList, indAceptoFacturaDigital, setIndAceptoFacturaDigital, baremos } = props

  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)
  const provisions = useSelector((state: any) => state.provisions)
  const user = useSelector((state: any) => state.user)

  const filteredSentDocumentList = currentProvision && currentProvision.documentList && currentProvision.documentList.sentDocument && currentProvision.documentList.sentDocument.filter((item) => item.documentType === 'DOCTYP0203' && item.comment === 'Justificante de la transferencia')
  const [sentDocument, setSentDocument] = useState(filteredSentDocumentList ? filteredSentDocumentList : [])

  let isCardSubmitted = false
  let isFirstStepCompleted = false

  const [completedPayment, setCompletedPayment] = useState(false)

  let isCardPaymentReady = false

  const [current, setCurrent] = useState(0)
  const [credit, setCredit] = useState<boolean>()
  const [bank, setBank] = useState<boolean>()
  const [uploaded, setUploaded] = useState<boolean>()
  const [isLoading, setIsLoading] = useState<boolean>()

  const [cardholderName, setCardholderName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvn, setCvn] = useState('')

  const [fullPayment, setFullPayment] = useState(false)
  const [fullPaymentButton, setFullPaymentButton] = useState(true)
  const [splitPayment, setSplitPayment] = useState(0)

  const [cardPaymentActive, setCardPaymentActive] = useState(false)
  const [transferPaymentActive, setTransferPaymentActive] = useState(false)

  const hitoStateCobrado = '4'
  const hitoStatePdteCobro = '2'
  const hitoStatePendiente = '1'
  const hitoStateFacturado = '5'
  const hitoStatePdteFactura = '3'

  // const statePpPaid10 ='PREPRCOD6'
  // const stateDossierValorated ='STATUS0014'

  // const hitoStateCobrado  ='MILSTAT004'
  // const hitoStatePdteCobro  ='MILSTAT002'
  // const hitoStatePendiente  ='MILSTAT001'
  // const hitoStateFacturado  ='MILSTAT005'
  // const hitoStatePdteFactura  ='MILSTAT003'

  const billemail = useSelector((state: any) => provisions.currentProvision.billingEmail)
  const [billingEmail, setBillingEmail] = useState(billemail)

  const pad2 = (n) => {
    return n < 10 ? '0' + n : n
  }

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


  let orderId1 = '';

  let date = new Date()
  let timestamp = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds())

  const documentType = 'DOCTYP0203'
  const [documentTypeName, setDocumentTypeName] = useState('')

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
  }, [sentDocument])

  useEffect(() => {
    if (current === 0) {
      setCredit(true)

      setBank(false)
    } else {
      setCredit(false)

      setBank(true)
    }
  }, [current])

  const handleCreditClick = () => {
    setCurrent(0)
  }

  const handleBankClick = () => {
    setCurrent(1)
  }

  const fullPaymentView = () => {
    setFullPayment(true);
  }

  const splitPaymentView = (index: number) => {
    setSplitPayment(index)
    setCurrent(1)
  }

  const submitToHpp = () => {
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


            if (baremos && baremos.isBaremoAnticip) {
              dispatch(thunkCreateCardPayment(body, (response) => {
                if (response) {
                  if (atob(data.RESULT) === '00') {

                    /* Pago realizado correctamente y guardado en la tabla, pero no en Zeus*/
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
                    /* Pago realizado correctamente y guardado en la tabla*/
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

  const showModalWithIframe = () => {
    if (isCardSubmitted) {
      isCardSubmitted = false

      document.getElementById('hiddeniFrame').removeEventListener('load', showModalWithIframe)

      document.getElementById('spinner').classList.add('hidden')

      document.getElementById('creditForm').style.display = 'none'
      document.getElementById('hiddeniFrameForm').style.display = 'block'
    }

    isCardSubmitted = true
    isFirstStepCompleted = true
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
    // eslint-disable-next-line
  }, [current, uploaded, completedPayment])

  function isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
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

                  {/* IMPORTE TOTAL - PAGO ÚNICO */}

                  <Grid item>
                    <label className={classes.paymentTitle}>{t('provisions.payment.doublePayment.totalImport')}</label>
                  </Grid>

                  <Grid item>
                    <Grid container direction='column'>
                      <Grid item>
                        <label className={classes.payment}>{currentProvision && currentProvision.valoration && currentProvision.valoration.valorationTotalAmount && currentProvision.valoration.valorationTotalAmount}{t('provisions.payment.budgetBadge2')}</label>
                      </Grid>

                      <Grid item>
                        <label className={classes.iva}>{t('provisions.payment.iva')}</label>
                      </Grid>
                    </Grid>
                  </Grid>

                  {
                    fullPaymentButton &&
                    <Grid container justifyContent='center'>
                      <Grid item>
                        <div onClick={() => fullPaymentView()} className={classes.button2}>{t('provisions.payment.buttons.singlePayment')}</div>
                      </Grid>
                    </Grid>
                  }

                  <div className={classes.separator} />

                  {/* Desplegable de pago íntegro */}

                  {
                    fullPayment &&
                    <>
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

                            <Card selected={bank} type={1} onClick={handleBankClick} />
                          </Grid>
                        </Grid>

                        <Grid item lg={7} md={12} sm={12} xs={12}>
                          <Grid container alignItems='center' justifyContent='center'>
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
                                    cardPaymentActive &&
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
                                              disabled={adminCheck()}
                                              onClick={submitToHpp}
                                            />
                                            <Grid item>
                                              <label style={{ fontWeight: 'bold' }}>
                                                {t('provisions.payment.privacyPolicy')}
                                                <a className={classes.link} target='_blank' href='https://www.ufd.es/informacion-sobre-cancelacion-de-expedientes/'>
                                                  {t('provisions.payment.here')}
                                                </a>
                                                <img src={TabIcon} alt='' className={classes.tabIcon} />
                                              </label>
                                            </Grid>
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
                                  : !transferPaymentActive || !cardPaymentActive ?
                                    <Grid
                                      container
                                      justifyContent='center'
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
                              />
                              :
                              <DocumentUploadFrame
                                documentType={documentType}
                                documentTypeName={documentTypeName}
                                comment={'Justificante de la transferencia'}
                                uploaded={uploaded}
                                setUploaded={setUploaded}
                                setSentDocument={setSentDocument}
                                showUploaded
                                billingEmail={billingEmail}
                                indAceptoFacturaDigital={indAceptoFacturaDigital}
                              />
                          }
                          {
                            !uploaded &&
                            <div className={classes.error}>{t('provisions.payment.noProof')}</div>
                          }
                        </Grid>
                      }

                      <Grid container alignItems='center' justifyContent='center' style={{ marginTop: '10px' }}>
                        <label className={classes.policy}>
                          {t('provisions.payment.privacyPolicy')}
                          <a className={classes.link} target='_blank' href='https://www.ufd.es/informacion-sobre-cancelacion-de-expedientes/'>
                            {t('provisions.payment.here')}
                          </a>
                          <img src={TabIcon} alt='' className={classes.tabIcon} />
                        </label>
                      </Grid>


                    </>
                  }

                  {/* Fin desplegable de pago íntegro */}

                  {
                    !fullPayment &&
                    <>

                      {/* PAGO/S FRACCIONADO/S */}

                      <Grid item>
                        <label className={classes.paymentSubtitle}>
                          {t('provisions.payment.doublePayment.secondaryOption')}
                        </label>
                      </Grid>

                      {
                        milestoneList.map((mileStone, index: number) => {

                          if ((mileStone.milestoneStatusId === hitoStateCobrado || mileStone.milestoneStatusId === hitoStateFacturado) && fullPaymentButton === true) {
                            setFullPaymentButton(false)
                          }

                          return (
                            <>
                              <Grid container direction='row' alignItems='center'>
                                <Grid item xs={12} sm={12} md={6} lg={4}>
                                  <label className={classes.splitPaymentTitle}>
                                    {index + 1 === 1 && t('provisions.payment.doublePayment.firstPayment')}
                                    {index + 1 === 2 && t('provisions.payment.doublePayment.secondPayment')}
                                    {index + 1 === 3 && t('provisions.payment.doublePayment.thirdPayment')}
                                    {index + 1 === 4 && t('provisions.payment.doublePayment.fourthPayment')}
                                    {index + 1 === 5 && t('provisions.payment.doublePayment.fifthPayment')}
                                    {index + 1 > 5 && t('provisions.payment.doublePayment.nextPayment')}
                                  </label>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={4}>
                                  {/* <label className={classes.splitPayment}>{currentProvision && currentProvision.valoration && currentProvision.valoration.valorationTotalAmount && currentProvision.valoration.valorationTotalAmount}{t('provisions.payment.budgetBadge2')}</label> */}
                                  <label className={classes.splitPayment}>{mileStone.amount}{t('provisions.payment.budgetBadge2')}</label>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={4}>
                                  {
                                    (mileStone.milestoneStatusId === hitoStatePdteCobro || mileStone.milestoneStatusId === hitoStatePdteFactura || mileStone.milestoneStatusId === hitoStatePendiente) &&
                                    <div onClick={() => splitPaymentView(index + 1)} className={classes.button2}>{t('provisions.payment.buttons.makePayment')}</div>
                                  }
                                  {
                                    (mileStone.milestoneStatusId === hitoStateCobrado || mileStone.milestoneStatusId === hitoStateFacturado) &&
                                    <Grid container direction='row' justifyContent='center' alignItems='center'>
                                      <Grid item className={classes.okIcon}>
                                        <img src={OkIcon} alt='' />
                                      </Grid>
                                      <Grid item>
                                        <label className={classes.splitPaymentTitle}>{t('provisions.payment.doublePayment.payed')}</label>
                                      </Grid>
                                    </Grid>
                                  }
                                </Grid>
                              </Grid>

                              {/* Desplegable para realizar pagos fraccionados */}

                              {
                                splitPayment === index + 1 &&
                                <>
                                  <Grid container direction='column'>
                                    <Grid item>
                                      <label className={classes.marginSplitPaymentTitle}>{t('provisions.payment.doublePayment.doWireTransfer')}</label>
                                    </Grid>
                                    <Grid item>
                                      <label className={classes.paymentSubtitle}>{t('provisions.payment.doublePayment.validatePaymentText')}</label>
                                    </Grid>
                                  </Grid>

                                  <Grid container direction='row'>
                                    <Grid item xs={12} sm={12} md={12} lg={5}>
                                      <Card selected={bank} type={1} />
                                    </Grid>
                                    <Grid container xs={12} sm={12} md={12} lg={7}>
                                      <Grid container alignItems='center' justifyContent='center'>
                                        <Grid container alignItems='center' justifyContent='center'>

                                          {
                                            current === 1 && transferPaymentActive ?
                                              <BankForm
                                                // amount={currentProvision && currentProvision.valoration && currentProvision.valoration.valorationTotalAmount && currentProvision.valoration.valorationTotalAmount}
                                                amount={mileStone && mileStone.amount && mileStone.amount}
                                                dossierCod={currentProvision && currentProvision.dossierCod && currentProvision.dossierCod}
                                              />
                                              : !transferPaymentActive ?
                                                <Grid
                                                  container
                                                  justifyContent='center'
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
                                    </Grid>
                                  </Grid>
                                  {
                                    transferPaymentActive &&
                                    <Grid container className={classes.uploader} alignItems='center' justifyContent='center' direction='column'>
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
                                          />
                                          :
                                          <DocumentUploadFrame
                                            documentType={documentType}
                                            documentTypeName={documentTypeName}
                                            comment={'Justificante de la transferencia'}
                                            uploaded={uploaded}
                                            setUploaded={setUploaded}
                                            setSentDocument={setSentDocument}
                                            showUploaded
                                            billingEmail={billingEmail}
                                            indAceptoFacturaDigital={indAceptoFacturaDigital}
                                          />
                                      }
                                      {
                                        !uploaded &&
                                        <div className={classes.error}>{t('provisions.payment.noProof')}</div>
                                      }
                                    </Grid>
                                  }

                                </>
                              }
                              {
                                index + 1 !== milestoneList.length &&
                                <div className={classes.separator} />
                              }
                            </>
                          )
                        })
                      }

                      {/* Fin desplegable para realizar el pagos fraccionados */}

                    </>
                  }

                </Grid>
              </Grid>
            }
          </Grid>
      }

    </>
  )
}

export default Budget
