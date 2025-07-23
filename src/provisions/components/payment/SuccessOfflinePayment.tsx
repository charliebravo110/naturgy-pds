import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import useMediaQuery from '@material-ui/core/useMediaQuery'

import Grid from '@material-ui/core/Grid'

import Spinner from '../../../common/components/spinner/Spinner'
import Button from '../../../common/components/button/Button'
import TabIcon from '../../../assets/icons/tab.svg';



import { showError } from '../../../common/store/actions/ErrorActions'
import { thunkBizumPaymentConfirmation, thunkUpdatePayment, } from '../../store/actions/ProvisionsThunkActions'

import useStyles, { ExpansionPanelDetails } from './OfflinePayment.styles'
import AllowPayment from './edit-manager/AllowPayment'
import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg';
import { theme } from '../../../App.styles'

const SuccessOfflinePayment = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

  let token = sessionStorage.getItem('token')

  const [popUp, setPopUp] = useState(false)

  const [userDNI, setUserDNI] = useState('')
  const [dossierCode, setDossierCode] = useState('')
  const [amount, setAmount] = useState('')

  const [firstStep, setFirstStep] = useState(false)

  const [timestampPayment, setTimestampPayment] = useState('')
  const successOrderId = props.match.params.successorderid  
  const [finalOrderId, setFinalOrderId] = useState('')
  const [finalState, setFinalState] = useState('')

  const patron = [1, 2, 0, 8, 8, 5, 7, 8, 1, 4, 7, 3, 1] 
  const alphabet = 'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890:'


  const [completedPayment, setCompletedPayment] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>()


  useEffect(() => {
    setIsLoading(true)
    setFirstStep(true)

    var decrypted = ''

    for (var i = 0; i < successOrderId.length; ++i) {
      var pointerIni = alphabet.indexOf(successOrderId[i])
      var pointerFi = pointerIni - patron[i % patron.length]

      if (pointerFi < 0) pointerFi = alphabet.length + pointerFi

      decrypted += alphabet[pointerFi]
    }

    const splitter = decrypted.split(':')
    const newAmount =  [splitter[0].slice(0, splitter[0].length-2), ',', splitter[0].slice(splitter[0].length-2)].join('')
    setAmount(newAmount)
    setUserDNI(splitter[1])
    setDossierCode(splitter[2])
    setFinalOrderId(splitter[3])
    setFinalState(splitter[4])

    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0')
    var mm = String(today.getMonth() + 1).padStart(2, '0')
    var yyyy = today.getFullYear()
    var hh = (today.getHours() < 10)? '0' + today.getHours() : '' + today.getHours()
    var mn = (today.getMinutes() < 10)? '0' + today.getMinutes() : '' + today.getMinutes()
    var ss = (today.getSeconds() < 10)? '0' + today.getSeconds() : '' + today.getSeconds()


    setTimestampPayment(dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + mn + ':' + ss)
  }, [successOrderId])

  useEffect(() => {
    if (successOrderId && successOrderId !== '' &&
        amount && amount !== '' &&
        dossierCode && dossierCode !== '' &&
        userDNI && userDNI !== '' &&
        finalOrderId && finalOrderId !== '' &&
        timestampPayment && timestampPayment !== '' &&
        finalState && finalState !== '') {
      if (finalState === 'O') {
        const body = {
          expediente: dossierCode,
          dni: userDNI,
          amount: amount.replace(',', ''),
          paymentOnline: {
            custNum: userDNI,
            prodId: dossierCode,
            result: '00',
            amount: amount.replace(',', ''),
            orderId: finalOrderId,
            pasRef: finalOrderId,
            timestampRespuesta: timestampPayment,// modficar para enviar en el formato correcto dd/mm/yyyy HH:mm:ss
            paymentMethod: 'BIZUM'
          }
        }
          dispatch(thunkUpdatePayment(body, (response) => {
            if (response && response.result && response.result.codResult === '0') {
              const body2 = {
                isDirect : '1',
                responseResult: '0',
                responseDescription: dossierCode,
                responseOrderId: finalOrderId
              }
              dispatch(thunkBizumPaymentConfirmation(body2, (response) => {
                if (response) {
                  setCompletedPayment(true)
                  setIsLoading(false)
                } 
              }))
            } else {
              const body2 = {
                isDirect : '1',
                responseResult: '1000',
                responseDescription: dossierCode,
                responseOrderId: finalOrderId
              }
              dispatch(thunkBizumPaymentConfirmation(body2, (response) => {
                if (response) {
                  setIsLoading(false)
                  dispatch(showError('3001', 'doCardPayment'))
                }
              }))
            }
        }))
      } else if (finalState === 'K') {
        const body2 = {
          isDirect : '1',
          responseResult: '1000',
          responseDescription: dossierCode,
          responseOrderId: finalOrderId
        }
        dispatch(thunkBizumPaymentConfirmation(body2, (response) => {
          if (response) {
            setIsLoading(false)
            showError('3001', 'doCardPayment')
          }
        }))
      }
    }  
  },[amount, dossierCode, userDNI, finalOrderId, timestampPayment, finalState])

  return (
    <>
      <AllowPayment popup={popUp} setPopup={setPopUp} />
      <Grid className={classes.paymentBackground}>
        {mobile ?

          firstStep && !completedPayment ?
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
                  { !isLoading &&
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
              <Grid item className={classes.maxWidthForBigScreensMobile}>                  
                <Grid item container direction='column' justifyContent='center' alignItems='center' className={classes.form2}>
                  <Grid container className={classes.containerMobile}>
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

                                <div className={classes.expansionPanelDetailsValue}>{}</div>
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

          firstStep && !completedPayment ?
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
                  { !isLoading &&
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

                                <div className={classes.expansionPanelDetailsValue}>{}</div>
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

                  {
                    !isLoading &&
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
                  }
                </Grid>
              </Grid>
            </Grid>
        }
      </Grid>
    </>
  )
}

export default SuccessOfflinePayment
