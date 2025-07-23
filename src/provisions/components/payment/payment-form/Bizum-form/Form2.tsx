import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import MaskedInput from 'react-text-mask'

import Grid from '@material-ui/core/Grid'

import sha1 from 'sha1'

import Input from '../../../../../common/components/input/Input'
// import AlertIcon from '../../../../../assets/icons/aviso_alerta_pop_up.svg'

import useStyles from './Form2.styles'
import { thunkGetMasterData } from '../../../../store/actions/ProvisionsThunkActions'

const PAYMENT_CALLBACK = process.env.REACT_APP_PAYMENT_CALLBACK_URL
const PAYMENT_GATEWAY_URL = process.env.REACT_APP_PAYMENT_GATEWAY_URL
const BIZUM_PAYMENT_GATEWAY_URL = process.env.REACT_APP_BIZUM_PAYMENT_GATEWAY_URL
const PAYMENT_GATEWAY_URL_PAY = process.env.REACT_APP_PAYMENT_GATEWAY_URL_PAY
const PAYMENT_GATEWAY_MERCHANT_ID = process.env.REACT_APP_PAYMENT_GATEWAY_MERCHANT_ID
const PAYMENT_GATEWAY_ACCOUNT = process.env.REACT_APP_PAYMENT_GATEWAY_ACCOUNT
const PAYMENT_GATEWAY_CURRENCY = process.env.REACT_APP_PAYMENT_GATEWAY_CURRENCY
const PAYMENT_GATEWAY_SECRET = process.env.REACT_APP_GATEWAY
const BIZUM_PAYMENT_URL = process.env.REACT_APP_BIZUM_PAYMENT_URL

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

  const {
    DS_SIGNATUREVERSION,
    DS_MERCHANTPARAMETERS,
    DS_SIGNATURE
  } = props

  useEffect(() => {
    setPayTarget(PAYMENT_GATEWAY_URL_PAY)
  }, [payTarget])

return (
  <>
    <form
      id='hiddenFormBizum'
      action={BIZUM_PAYMENT_URL}
      method='POST'
      target='hiddeniFrameBizum'
    >
      <input type='hidden' name='Ds_SignatureVersion' value={DS_SIGNATUREVERSION}/>
      <input type='hidden' name='Ds_MerchantParameters' value={DS_MERCHANTPARAMETERS}/>
      <input type='hidden' name='Ds_Signature' value={DS_SIGNATURE}/>
      
    </form>
     
  </>
)}

export default Form