import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import MaskedInput from 'react-text-mask'

import Grid from '@material-ui/core/Grid'

import sha1 from 'sha1'

import Input from '../../../../../common/components/input/Input'
// import AlertIcon from '../../../../../assets/icons/aviso_alerta_pop_up.svg'

import useStyles from './Form.styles'
import { thunkGetMasterData } from '../../../../store/actions/ProvisionsThunkActions'

const PAYMENT_CALLBACK = process.env.REACT_APP_PAYMENT_CALLBACK_URL
const PAYMENT_GATEWAY_URL = process.env.REACT_APP_PAYMENT_GATEWAY_URL
const PAYMENT_GATEWAY_URL_PAY = process.env.REACT_APP_PAYMENT_GATEWAY_URL_PAY
const PAYMENT_GATEWAY_MERCHANT_ID = process.env.REACT_APP_PAYMENT_GATEWAY_MERCHANT_ID
const PAYMENT_GATEWAY_ACCOUNT = process.env.REACT_APP_PAYMENT_GATEWAY_ACCOUNT
const PAYMENT_GATEWAY_CURRENCY = process.env.REACT_APP_PAYMENT_GATEWAY_CURRENCY
const PAYMENT_GATEWAY_SECRET = process.env.REACT_APP_GATEWAY

/*
const isEdge = window.navigator.userAgent.indexOf('Edge') !== -1
const isIE = window.navigator.userAgent.indexOf('Trident') !== -1 && !isEdge
*/

const Form = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const origin = window && window.location && window.location.origin
  const [payTarget, setPayTarget] = useState('')
  const provisions = useSelector((state: any) => state.provisions)
  const user = useSelector((state: any) => state.user)

  const {
    merchantId,
    account,
    currency,
    timestamp,
    orderId,
    cardholderName,
    setCardholderName,
    cardNumber,
    setCardNumber,
    expiryDate,
    setExpiryDate,
    cvn,
    setCvn
  } = props

  useEffect(() => {
    // cargar lista de tipos de vía
    dispatch(thunkGetMasterData('payTarget', 'ES', 'payTarget', (response) => {
      if (response[0].value !== '1') {
        setPayTarget(PAYMENT_GATEWAY_URL_PAY)
      } else {
        setPayTarget(PAYMENT_CALLBACK)
      }
    }))
  }, [payTarget])

  


  const string = timestamp + '.' + PAYMENT_GATEWAY_MERCHANT_ID + '.' + orderId + '.' + (provisions.currentProvision && provisions.currentProvision.valoration && provisions.currentProvision.valoration.valorationTotalAmount && (provisions.currentProvision.valoration.valorationTotalAmount * 100).toFixed(0)) + '.' + PAYMENT_GATEWAY_CURRENCY

  const encryptedString1 = sha1(string)

  const encryptedString2 = sha1(encryptedString1 + PAYMENT_GATEWAY_SECRET)


return (
  <>
     
     
      <Grid
          container
          id='hiddeniFrameForm'
          direction='column'
          spacing={5}
      >
        <Grid item>
                <iframe id='hiddeniFrame' className={classes.iframe} name='hiddeniFrame' title='hiddeniFrame' />
        </Grid>
      </Grid>
       
    
   

    <form
      id='hiddenForm'
      action={PAYMENT_GATEWAY_URL_PAY}
      method='POST'
      target='hiddeniFrame'
    >
      <input id='timestamp' type='hidden' name='TIMESTAMP' value={timestamp} />
      <input type='hidden' name='MERCHANT_ID' value={merchantId} />
      <input id='order' type='hidden' name='ORDER_ID' value={orderId} />
      <input type='hidden' name='AMOUNT' value={provisions.currentProvision && provisions.currentProvision.valoration && provisions.currentProvision.valoration.valorationTotalAmount && (provisions.currentProvision.valoration.valorationTotalAmount * 100).toFixed(0)} />
      <input type='hidden' name='CURRENCY' value={currency} />
      <input id='hash' type='hidden' name='SHA1HASH' value={encryptedString2} />
      <input type='hidden' name='AUTO_SETTLE_FLAG' value='1' />
      <input type='hidden' name='HPP_CHANNEL' value='ECOM'/>
      <input type='hidden' name='HPP_VERSION' value='2' />
      <input type='hidden' name='HPP_3DS2_BILLING_DETAILS_REQUIRED' value='false'/>
      <input type='hidden' name='HPP_CUSTOMER_EMAIL' value={(user && user.profile) && user.profile.email} />
      <input type='hidden' name='HPP_CUSTOMER_PHONENUMBER_MOBILE' value={(user && user.profile) && '34|' + user.profile.phone}/>
      <input type='hidden' name='ACCOUNT' value={account} />
      <input type='hidden' name='COMMENT1' value={t('provisions.payment.comment1') + ' ' + (provisions.currentProvision && provisions.currentProvision.dossierCod)} />
      <input type='hidden' name='CUST_NUM' value={(user && user.profile) && user.profile.documentNumber} />
      <input type='hidden' name='VAR_REF' value={provisions.currentProvision && provisions.currentProvision.dossierCod.replace('EXP', '')} />
      <input type='hidden' name='PROD_ID' value={provisions.currentProvision && provisions.currentProvision.dossierCod} />
      <input type='hidden' name='MERCHANT_RESPONSE_URL' value={payTarget}/>
      <input type='hidden' name='HPP_LISTENER_URL' value={origin} />
      <input type='hidden' name='HPP_POST_RESPONSE' value={origin} />
      
    </form>
     
  </>
)
}

export default Form