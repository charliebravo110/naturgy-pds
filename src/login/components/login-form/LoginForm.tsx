import React, { useState, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import queryString from 'query-string'

import Grid from '@material-ui/core/Grid'
import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg'
import Input from '../../../common/components/input/Input'
import InputPassword from '../../../common/components/input-password/InputPassword'
import Button from '../../../common/components/button/Button'
import CloseIcon from '../../../assets/icons/cerrar_blanco.svg'

import { validateIdentityCard, validateIdentityCardAmpl, validateUserCode } from '../../../common/lib/ValidationLib'

import { setUser, setPassword, resetLoginState, setRememberCheck } from '../../store/actions/LoginActions'
import { setCurrentProvisionHasContactMeButton } from '../../../provisions/store/actions/ProvisionsActions'
import { thunkSendFirstLogin } from '../../store/actions/LoginThunkActions'
import { thunkGetProvision } from '../../../provisions/store/actions/ProvisionsThunkActions'

import useStyles from './LoginForm.styles'
import { thunkZeusSincro } from '../../../common/components/zeus-sincro/ZeusSincroThunkActions'
import ZeusWebData from '../../../common/interfaces/ZeusWebData'
import useBiometricLogin from '../../../mobile-apps/biometric-access/login-with-biometry/useBiometricLogin'
import { AppState } from '../../../common/store/reducers/MainReducer'
import Checkbox from '../../../common/components/checkbox/Checkbox'
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import { STORED_PASSWORD, STORED_USERNAME } from '../../../mobile-apps/common/configAndConstants'
import { isMobileApp } from '../../../mobile-apps/common/detectPlatform'
import { thunkChangeOpenUrl } from '../../../common/components/send-url/store/actions/SendUrlThunkActions'
import { thunkResendMail } from '../../../sign-up/store/actions/SignUpThunkActions'
import Dialog from '../../../common/components/dialog/Dialog'
import { DialogContent } from '@material-ui/core'

const LoginForm = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const user = useSelector((state: any) => state.login.user)
  const password = useSelector((state: any) => state.login.password)

  const { search, setIsLoading, history, match, handleDownloadDocument, handleFirstLogin } = props

  const [showingErrorAlertDocument, setShowingErrorAlertDocument] = useState(false)
  const [showingErrorAlertPass, setShowingErrorAlertPass] = useState(false)
  const [showingErrorLock, setShowingErrorLock] = useState(false)
  const [showingErrorAlert, setShowingErrorAlert] = useState(false)
  const [showingErrorNotActivate, setShowingErrorNotActivate] = useState(false)
  const [showingUserBlocked, setShowingUserBlocked] = useState(false)



  const [autofilled, setAutofilled] = useState(false)
  const [userShrink, setUserShrink] = useState(false)
  const [passShrink, setPassShrink] = useState(false)
  const [nextStep, setNextStep] = useState(false);

  const { ButtonBiometry, buttonProps, DialogBiometry, dialogProps, aBiometricsDialogIsShown } =
    useBiometricLogin(handleSubmitLoginForm)


  const [checkboxValue, setCheckboxValue] = useState(false)

  // Enabled: Biometric access is active in app preferences
  // Available: Biometric access is active in device
  const { enabled, available } = useSelector(
    (state: AppState) => state.biometricAccess
  )
  const isMobile = isMobileApp()
  /**
   * Effect to manage checkbox remember password
   */


  async function handleSubmitLoginForm() {
    setShowingErrorAlert(false)
    setShowingErrorAlertDocument(false)
    setShowingErrorAlertPass(false)
    setShowingErrorNotActivate(false)
    //BLOQUEO FASE 2
    setShowingUserBlocked(false)

    if (!validateIdentityCardAmpl(user)) {
      return false
    }

    if (await aBiometricsDialogIsShown()) return

    setIsLoading(true)

    //Ver lo que devulve el login_user

    dispatch(thunkSendFirstLogin(setIsLoading, null, (response) => {
      
      if (response === '1001') {
        localStorage.removeItem(STORED_USERNAME)
        localStorage.removeItem(STORED_PASSWORD)
        setShowingErrorAlert(true)
        setIsLoading(false)
        setShowingErrorLock(false)
        
        //ERROR PASS
      } else if(response === '2017'){
        localStorage.removeItem(STORED_USERNAME)
        localStorage.removeItem(STORED_PASSWORD)
        setShowingErrorAlertPass(true)
        setShowingErrorLock(false)
        setIsLoading(false)
      //ERROR BLOQUEO TEMPORAL
      } else if(response === '2024'){
        localStorage.removeItem(STORED_USERNAME)
        localStorage.removeItem(STORED_PASSWORD)
        setShowingErrorLock(true)
        setShowingErrorAlertPass(false)
        setIsLoading(false)
        //USUARIO NO REGISTADO
      
        } else if(response === '2015' || response === '2013'  || response === '2014'||  response === '2020'){
        localStorage.removeItem(STORED_USERNAME)
        localStorage.removeItem(STORED_PASSWORD)
        setShowingErrorAlertDocument(true)
        setShowingErrorLock(false)
        setIsLoading(false)
        //USUARION NO ACTIVO
      } else if(response === '2016'){
        localStorage.removeItem(STORED_USERNAME)
        localStorage.removeItem(STORED_PASSWORD)
        setShowingErrorNotActivate(true)
        setShowingErrorLock(false)
        setIsLoading(false)
         //USUARION BLOQUEADO FASE 2
      } else if(response === '2021'){
        localStorage.removeItem(STORED_USERNAME)
        localStorage.removeItem(STORED_PASSWORD)
        setShowingUserBlocked(true)
        setShowingErrorLock(false)
        setIsLoading(false)
      
      } else if (response.result && response.result.codResult === '3001') {
        window.open(response.location, '_self');
      } else if (response.result && ['2903', '2909', '0001', '2901'].includes(response.result.codResult)) {
        handleFirstLogin(response);
      } else if (response.result && ['0000'].includes(response.result.codResult)) {

      sessionStorage.setItem('userDocument', user)    


        let indLegalAccept = '1'

        let webData = {
          indLegalAccept: indLegalAccept
        } as ZeusWebData

        dispatch(thunkZeusSincro(webData, user, null))
        dispatch(resetLoginState())

        const href = sessionStorage.getItem('href')
        const href3000 = (sessionStorage.href.split(':3000'))
        const hrefcom = (sessionStorage.href.split('.com'))
        const hrefes = (sessionStorage.href.split('.es'))
        let hrefGo

        if (href3000[1]) {
          hrefGo = (sessionStorage.href.split(':3000'))
        }
        if (hrefcom[1]) {
          hrefGo = (sessionStorage.href.split('.com'))
        }
        if (hrefes[1]) {
          hrefGo = (sessionStorage.href.split('.es'))
        }

        sessionStorage.removeItem('href')

        //si logeamos y user es igual al guardado proviniente de la url (descargar factura)
        if (user === sessionStorage.getItem('nif_factura')) {
          handleDownloadDocument(sessionStorage.getItem('factura'))
        }

        const queryStringValues = queryString.parse(search) as any
        if (queryStringValues.urlId) {
          dispatch(thunkChangeOpenUrl(queryStringValues.urlId,(response) => {
            if (response) {

            }
          }))
        }

        // esto trata si llegamos desde un url que no sea directamente el login
        if (href && hrefGo[1] !== '/login') {
          history.push(hrefGo[1])
        }
        else {
          const queryStringValues = queryString.parse(search) as any

          if (!queryStringValues.redirectTo) {
            history.push('/login')
          } else {
            if (queryStringValues.dossier) {

              // redirect to dossier details

              let defaultName = t('provisions.defaultName')

              dispatch(thunkGetProvision(queryStringValues.dossier, defaultName, (response) => {
                if (response) {
                  dispatch(setCurrentProvisionHasContactMeButton(true))

                  history.push('/provisions/detail')
                } else {
                  history.push('/provisions')
                }
              }))
            } else {
              history.push(queryStringValues.redirectTo)
            }
          }
        }
      }
    }));
  }

  const handleNextLoginForm = () => {
    if (validateUserCode(user) && !/^70\d{6}$/.test(user.toUpperCase())) {
      setIsLoading(true);
      handleSubmitLoginForm();
    } else {
      setNextStep(true);
    }
  }




  useEffect(() => {

    if (user) {
      setUserShrink(true);
    } else {
      setUserShrink(false);
    }

    if (password) {
      setPassShrink(true);
    } else {
      setPassShrink(false);
    }
  }, [user, password])


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmitLoginForm()
    }
  }

  const handleUserInputChange = ({ target }) => {
    dispatch(setUser(target.value))

    if (target.value === '' || (!validateIdentityCard(target.value) && !validateUserCode(target.value))) {
      setNextStep(false);

    } else if (target.value !== user) {
      dispatch(setPassword(''));
  }
  
  }

  const handlePasswordInputChange = ({ target }) => {
    dispatch(setPassword(target.value))
  }

  const handleAutoFill = (e) => {
    setAutofilled(e.animationName.split('-')[2] === 'onAutoFillStart')
  }

  const handleResendEmail = () => {
    dispatch(thunkResendMail(props.location.state.hash, (response) => {}))
  //     if (response && response) {
  //       if (response.result.codResult === '0000') {setShowDialogResend(true)}
  //         else {setErrorResend(true)}
  //     }
  //     else{
  //       setErrorResend(true)
  //     }
  // })) 
  }

  //  const handleCheckboxChange = (event: boolean): ThunkAction<void, AppState, null, Action> => (dispatch, getState) => {
  async function handleCheckboxChange(event: boolean){
    // Update checkbox state
    setCheckboxValue(event)

    // Update redux state
    dispatch(setRememberCheck(event))
  }
  const handleCloseDialog = () => {
    setShowingErrorLock(false)
  }

  return (
    <>
      <Dialog className={classes.dialog} open={showingErrorLock} onClose={handleCloseDialog}>
        <DialogContent className={classes.dialogContainer}>
          <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleCloseDialog} />
 
          <Grid container className={classes.noItems}>
            <Grid item>
              <img src={CloseIcon} alt='' />
 
              <Grid container>
                <Grid container className='row title'>{t('login.timeUnblock')}</Grid>
 
                <Grid container className='buttons'>
                  <Button
                    text={t('login.timeUnblockClose')}
                    color='primary'
                    size='large'
                    variant='contained'
                    onClick={handleCloseDialog}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <div className={classes.title}>{t('login.title')}</div>
      <form name='login_form'>
        <Input
          label={t('login.username')}
          name='username'
          showValidationIcon
          error={user !== '' && (!validateIdentityCard(user) && !validateUserCode(user))}
          className={classes.textField}
          onChange={handleUserInputChange}
          onKeyPress={handleKeyPress}
          value={user}
          onAnimationStart={handleAutoFill}
          InputLabelProps={{
            shrink: autofilled || userShrink
          }}
        />

        {nextStep &&
          <InputPassword
            label={t('login.password')}
            name='password'
            className={classes.textField}
            onChange={handlePasswordInputChange}
            onKeyPress={handleKeyPress}
            value={password}
            InputLabelProps={{
              shrink: autofilled || passShrink
            }}
          />
        }

        {
          (nextStep && isMobile) &&
            <div className={classes.rememberUser}>
              <Checkbox
                checked={checkboxValue}
                onChange={(e) => handleCheckboxChange(e.target.checked)}
              />
              <label>{t('mobile-apps.rememberUser.title')}</label>
            </div>
        }

        {
          showingErrorAlert &&
          <Grid container className={classes.errorAlert}>
            <Grid item md='auto' sm={12} xs={12}>
              <div className='icon'>
                <img src={CloseIcon} alt='' />
              </div>
            </Grid>

            <Grid item className='text' md='auto' sm={12} xs={12}>{t('errors.login.1001')}</Grid>
          </Grid>
        }
        {
          //ERROR CONTRASEÑA 
          showingErrorAlertPass &&
          <Grid container className={classes.errorAlertNew}>
          <Grid item md='auto' sm={12} xs={12}>
            <div className='icon'>
              <img src={AlertIcon} alt='' />
            </div>
          </Grid>

          <Grid item className='text' md='auto' sm={12} xs={12}>{t('errors.login.alertDocumentNotValid')}</Grid>
        </Grid>
    
        }
        {
          //USUARIO BLOQUEADO TEMPORALMENTE 
          //showingErrorLock &&
          //<Grid container className={classes.errorAlertNew}>
          //<Grid item md='auto' sm={12} xs={12}>
          //  <div className='icon'>
          //    <img src={AlertIcon} alt='' />
          //  </div>
          //</Grid>

          //<Grid item className='text' md='auto' sm={12} xs={12}>{t('Usuario bloqueado temporalmente')}</Grid>
          //</Grid>
    
        }
        {

          //USUARIO NO REGISTRADO
            showingErrorAlertDocument &&
            <Grid container className={classes.errorAlertNew}>
            <Grid item md='auto' sm={12} xs={12}>
              <div className='icon'>
                <img src={AlertIcon} alt='' />
              </div>
            </Grid>
  
            <Grid item className='text' md='auto' sm={12} xs={12}>{t('errors.login.alertNotExist')}</Grid>
          </Grid>
   
        }
      
        {
       
    //USUARIO NO ACTIVADO
          showingErrorNotActivate &&
            <Grid container className={classes.errorAlertNewRed}>
              <Grid item md='auto' sm={12} xs={12}>
                <div className='icon'>
                  <img src={AlertIcon} alt='' />
                </div>
              </Grid>
              <Grid item className='text' md='auto' sm={12} xs={12}>
                {t('errors.login.alertNotActivate')} 
                <span className={classes.linkRed} onClick={handleResendEmail}>
                    {t('errors.login.alertNotActivate2')}
                </span>
                {t('errors.login.alertNotActivate3')} 
                <br/>
                <div style={{ marginTop: '5px' }}/>
                <span>
                    {t('errors.login.alertNotActivate4')}
                </span>
                <a className={classes.linkRed} href='https://www.ufd.es/formulario-de-contacto/'>
                    {t('errors.login.alertNotActivate5')}
                </a>
                {t('errors.login.alertNotActivate6')} 
              </Grid>

            </Grid>

    }

{
        //USUARIO BLOQUEADO FASE 2
      showingUserBlocked &&
      <Grid container className={classes.errorAlertNew}>
      <Grid item md='auto' sm={12} xs={12}>
        <div className='icon'>
          <img src={AlertIcon} alt='' />
        </div>
      </Grid>

      <Grid item className='text' md='auto' sm={12} xs={12}>
        {t('errors.login.UserBlocked')}
          <div style={{ marginBottom: '1em' }}/>
        {t('errors.login.UserBlocked2')}
          <a onClick={handleResendEmail}>{t('errors.login.UserBlocked3')}</a>
          {t('errors.login.UserBlocked4')}


      </Grid>
      
    </Grid>

    }

    
        {(!validateUserCode(user) ||  /^70\d{6}$/.test(user)) &&

          <div className={classes.recoverPassword}>
            {`${t('login.resetPassword.string1')} `}

            <Link
              to={`${match.url}/reset`}
              className={classes.recoverPasswordLink}
            >
              {t('login.resetPassword.string2')}
            </Link>
          </div>
        }
        {nextStep ?
        <>
          <Button
            className={classes.button}
            name='submit'
            text={t('common.buttons.enter')}
            color={'primary'}
            size={'large'}
            variant={'contained'}
            onClick={handleSubmitLoginForm}
          />
        </>
          :
          <Button
            className={classes.button}
            name='submit'
            text={t('common.buttons.next')}
            color={'primary'}
            size={'large'}
            variant={'contained'}
            onClick={handleNextLoginForm}
            disabled={user === '' || (!validateIdentityCard(user) && !validateUserCode(user))}
          />
        }
        <ButtonBiometry {...buttonProps} />
        <DialogBiometry {...dialogProps} />
      </form>
    </>
  )
}

export default withRouter(LoginForm)
