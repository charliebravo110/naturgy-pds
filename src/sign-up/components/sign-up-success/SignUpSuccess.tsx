import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import Grid from '@material-ui/core/Grid'

import Button from '../../../common/components/button/Button'
import InfoIcon from '../../../assets/icons/ico_info.svg'

import { thunkResendMail } from '../../store/actions/SignUpThunkActions'

import useStyles from './SignUpSuccess.styles'
import PopupResend from '../../popup-error/PopupResend'
import PopupError from '../../popup-resend/PopupError'

// LCS: Importa la función - Wave 3
import { sendGAEvent, getBrowsing_type, getGAClientId, removeEmails } from '../../../core/utils/gtm';

const SignUpSuccess = (props: any) => {
  const [showDialogResend, setShowDialogResend] = useState(false)
  const [errorResend, setErrorResend] = useState(false);

  const classes = useStyles({})
  const dispath = useDispatch()
  const { t } = useTranslation()

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

  const handleButton = () => {
    props.history.push('/login')
  }

  useEffect(() => {

    console.log('MAA -> ', errorResend)

  }, [errorResend])

  const handleResendEmail = () => {
    if (props.location.state && props.location.state.hash) {
      dispath(thunkResendMail(props.location.state.hash, (response) => {
        if (response && response === '1') {
          setErrorResend(true)
        }
        else if (response && response.result.codResult === '0000') {
          setShowDialogResend(true)
        }
        else {
          setErrorResend(true)
        }
      }))
    }
    else {
      setErrorResend(true)
    }
  }

  return (

    <div className={classes.block}>
      <Grid
        container
        className={classes.container}
      >
        <Grid
          container
          item
          className={classes.box}
          xs={12}
          sm={8}
          lg={5}
        >
          <img className={classes.img} src={InfoIcon} alt='' />

          <Grid
            container
            justifyContent='center'
            alignItems='baseline'
            direction='row'
          >

            <Grid item className={classes.title}>{t('signUp.signUpSuccess.item6')}</Grid>
          </Grid>


          <Grid item className={classes.subtitle} xs={12}>{t('signUp.signUpSuccess.item2')}</Grid>
          <PopupResend showDialogResend={showDialogResend} setShowDialogResend={setShowDialogResend} />
          <PopupError errorResend={errorResend} setErrorResend={setErrorResend} />



          <Grid item className={classes.text} xs={12}>{t('signUp.signUpSuccess.item3.item1')}<span className={classes.link} onClick={handleResendEmail}>{t('signUp.signUpSuccess.item3.item2')}</span>{t('signUp.signUpSuccess.item3.item3')}</Grid>

          <Grid container justifyContent='center' />

          <Grid item className={classes.text} xs={12}><span className={classes.link} onClick={handleButton}>{t('signUp.signUpSuccess.item5')}</span></Grid>

        </Grid>
      </Grid>
    </div>

  )
}

export default SignUpSuccess
