import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import queryString from 'query-string'

import Grid from '@material-ui/core/Grid'
import SwipeableViews from 'react-swipeable-views'
import Paper from '@material-ui/core/Paper'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg'
import ErrorIcon from '../../../assets/icons/Interfaz_24_cruz_cerrar_error_rojo.svg'
import OkIcon from '../../../assets/icons/aviso_ok.svg'
import Dialog from '../dialog/Dialog'
import Tick from '../../../assets/icons/Interfaz_22_check_tick_validar_completo.svg'
import { setSearchedUser } from '../../../admin/store/actions/AdminActions'
import LightTooltip from '../../../common/components/tooltip/light/LightTooltip'
import Input from '../../../common/components/input/Input'
import Recaptcha from '../../../common/components/recaptcha/Recaptcha'
import InputPassword from '../../../common/components/input-password/InputPassword'

import Button from '../../../common/components/button/Button'
import Checkbox from '../../../common/components/checkbox/Checkbox'
import { StyledTabSelector, StyledTab } from '../../../common/components/styled-tab-selector/StyledTabSelector'
import { thunkGetMasterData } from '../../../supplies/supplies-details/store/actions/SuppliesDetailsThunkActions'
import PasswordStrengthMeter from '../../../common/components/password-strength-meter/PasswordStrengthMeter'
import { thunkGetDossier } from '../../../provisions/store/actions/ProvisionsThunkActions'
import { thunkGetSearchedUser, thunkSearchUserByParam } from '../../../admin/store/actions/AdminThunkActions'


import SignUpFormData from '../../interfaces/SignUpFormData'
import CustomerFormData from '../../interfaces/CustomerFormData'
import {
  validateMail,
  validateMailParamTele,
  validateMobileNumber,
  validateMobileNumberDoc,
  validateIdentityCardAmpl,
  validateIdentityCardAmplNew,
  newValidatePasswordNumber,
  newValidatePassSpace,
  newValidatePasswordNumberCharacter,
  newValidatePasswordCapital,
  newValidatePasswordLower,
  newValidatePasswordLetter,
  newValidatePasswordCoincidence,
  newValidatePasswordConsecutive,
  validateJSON,
  validateTele,
  phoneEmpty,
  validateUserCodeSignUp
} from '../../../common/lib/ValidationLib'
import { fixNifLength } from '../../../common/lib/FormatLib'
import Spinner from '../../../common/components/spinner/Spinner'
import CryptoJS from 'crypto-js'

import { thunkSendRegisterForm, thunkcheckDocument, thunkcheckEmail } from '../../store/actions/SignUpThunkActions'
import { thunkSendFirstLogin } from '../../../login/store/actions/LoginThunkActions'
import useStyles from './SignUp.styles'
import { theme } from '../../../App.styles'
import DossierItem from './DossierItem'
import { checkDocumentType } from '../../../common/lib/ValidationLib'
import InputPasswordSignUp from '../../../common/components/input-password/InputPasswordSignUp'
import { IconButton, InputAdornment, useMediaQuery } from '@material-ui/core'
import { VisibilityOff } from '@material-ui/icons'

// LCS: Importa la función - Wave 3
import { sendGAEvent, getBrowsing_type, getGAClientId, removeEmails } from '../../../core/utils/gtm';

import { isMobileApp } from '../../../mobile-apps/common/detectPlatform'

const SignUp = (props: any) => {
  // pre-signup query string
  const { search } = props.location

  const [showPassword, setShowPassword] = useState(false)

  const tabletRes = useMediaQuery('(max-width:768px)')
  const mobileRes = useMediaQuery('(max-width:576px)')

  const [tabValue, changeTabValue] = useState(0)
  const [captchaValue, changeCaptchaValue] = useState()
  const [gdprAccepted, changeGdprAccepted] = useState(true)
  const [name, changeName] = useState('')
  const [surname, changeSurname] = useState('')
  const [documentNumber, changeDocumentNumber] = useState('')
  const [documentNumberValidity, changeDocumentNumberValidity] = useState(false)
  const [phone, changePhone] = useState('')
  const [phoneValidity, changePhoneValidity] = useState(false)
  const [passVacio, changePassVacio] = useState(true)
  const [errorRegister, setErrorRegister] = useState(false)


  const [email, changeEmail] = useState('')
  const [emailValidity, changeEmailValidity] = useState(false)
  const [emailTele, changeEmailTele] = useState(false)

  const [userIP, setUserIP] = useState('')


  const [emailConfirmation, changeEmailConfirmation] = useState('')
  const [password, changePassword] = useState('')
  const [passwordValidity, changePasswordValidity] = useState(false)
  const [passwordConfirmation, changePasswordConfirmation] = useState('')
  const [passwordConfChecker, setPasswordConfChecker] = useState(true)
  const [passwordResetChecker, setPasswordResetChecker] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [existDocument, setExistDocument] = useState(false)
  const [indDeleteRights, setIndDeleteRights] = useState('')

  const [existInLoginUser, setExistInLoginUser] = useState(false)
  const [existEmail, setExistEmail] = useState(false)
  const [passwordValidityNumber, changePasswordValidityNumber] = useState(true)
  const [passwordValidityNumberCharacter, changePasswordValidityNumberCharacter] = useState(true)
  const [passwordValidityCapital, changePasswordValidityCapital] = useState(true)
  const [passwordValiditySpace, changePasswordValiditySpace] = useState(true)
  const [passwordValidityLower, changePasswordValidityLower] = useState(true)
  const [passwordValidityLetter, changePasswordValidityLetter] = useState(true)
  const [passwordValidityCoincidence, changePasswordValidityCoincidence] = useState(true)
  const [passwordValidityConsecutive, changePasswordValidityConsecutive] = useState(true)

  // pre-signup default email
  const [defaultEmail, setDefaultEmail] = useState(null)

  const [showingDialog, setShowingDialog] = useState(false)



  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [defaultPass, setDefaultPass] = useState('Teleope01')

  //useState PARA VERIFICAR EXISTENCIA EN BD
  const searchedUser = useSelector((state: any) => state.admin.searchedUser)

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
    if (errorRegister) {
      props.history.push('/signup/register/error')
      // LCS: Enviar evento a GA - Wave 1
      sendGAEvent({
        event: 'react_error',
        info:{
          error_message: 'Fallo al registrarse',
          error: errorRegister,
          reactComponent: 'SignUp.tsx - useEffect',
        }
      }); 
    }

  }, [errorRegister])

  //1024384 Mejorar procesos area privada
  function validarTeleGestores(documento) {
    const regex = /^[97]0\d{6}$/;
    return regex.test(documento);
  }

  //1007875 - Proyecto Adaptación PDS RGPD
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        setUserIP(data.ip);
      })
  }, []);

  useEffect(() => {
    changeDocumentNumberValidity(!validateIdentityCardAmplNew(documentNumber, emailTele));

  }, [emailTele])



  const functcheckDocument = () => {

    let signForm: SignUpFormData = {
      username: !validateUserCodeSignUp(documentNumber) ? fixNifLength(documentNumber.toUpperCase()) : documentNumber,
      password: !validateUserCodeSignUp(documentNumber) ? password : defaultPass,
      documentNumber: !validateUserCodeSignUp(documentNumber) ? fixNifLength(documentNumber.toUpperCase()) : documentNumber,
      name,
      surname,
      phone,
      email: email.toLowerCase(),
      gdprAccepted: gdprAccepted,
      isDefaultEmailChanged: false,
      checkDocument: true,
      checkEmail: false,
      userIP: '',
      indDeleteRights: indDeleteRights,
      altaUsuario: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      acceptRightDate: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),

    }
    //1007875 - Proyecto Adaptación PDS RGPD
    dispatch(thunkcheckDocument(signForm, setExistDocument, setExistInLoginUser))
  }
  useEffect(() => {
    if (existInLoginUser) {
      // si existe enviamos IND_DELETE_RIGHTS a 1 (Put customer)
      setIndDeleteRights('1')
    } else {
      // Si no enviamos IND_DELETE_RIGHTS a 0 (Post customer)
      setIndDeleteRights('0')
    }
  }, [existInLoginUser])

  const functcheckEmail = () => {
    let signForm: SignUpFormData = {
      username: !validateUserCodeSignUp(documentNumber) ? fixNifLength(documentNumber.toUpperCase()) : documentNumber,
      password: !validateUserCodeSignUp(documentNumber) ? password : defaultPass,
      documentNumber: !validateUserCodeSignUp(documentNumber) ? fixNifLength(documentNumber.toUpperCase()) : documentNumber,
      name,
      surname,
      phone,
      email: email,
      gdprAccepted: gdprAccepted,
      isDefaultEmailChanged: false,
      checkDocument: false,
      checkEmail: true,
      userIP: '',
      indDeleteRights: indDeleteRights,
      altaUsuario: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      acceptRightDate: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    }
    dispatch(thunkcheckEmail(signForm, setExistEmail))
  }
  //1007875 - Proyecto Adaptación PDS RGPD

  const handleSignUpButton = () => {

    let signForm: SignUpFormData = {
      username: !validateUserCodeSignUp(documentNumber) ? fixNifLength(documentNumber.toUpperCase()) : documentNumber,
      password: !validateUserCodeSignUp(documentNumber) ? password : defaultPass,
      documentNumber: !validateUserCodeSignUp(documentNumber) ? fixNifLength(documentNumber.toUpperCase()) : documentNumber,
      name,
      surname,
      phone: phoneEmpty(phone),
      email: email.toLowerCase(),
      gdprAccepted: gdprAccepted,
      isDefaultEmailChanged: false,
      checkDocument: false,
      checkEmail: false,
      userIP: userIP,
      indDeleteRights: indDeleteRights,
      altaUsuario: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      acceptRightDate: (new Date().toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })).replaceAll(',', '')

    }

    if (defaultEmail !== null && email.toLowerCase() !== defaultEmail.toLowerCase()) {
      signForm = {
        ...signForm,
        isDefaultEmailChanged: true
      }
    }

    setIsLoading(true)

    dispatch(thunkSendRegisterForm(signForm, setIsLoading, setErrorRegister))
    //FIN 1007875 - Proyecto Adaptación PDS RGPD
  }

  const recoverDefaultPass = () => {
    dispatch(thunkGetMasterData('DEFAULT_PASS', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), 'DEFAULT_PASS', (response) => {
      if (response && response.length > 0) {
        setDefaultPass(response[0].value)
      }
    }))
  }


  const handleOpenDialog = (e) => {
    e.preventDefault()
    setShowingDialog(true)
  }

  const handleCloseDialog = () => {
    setShowingDialog(false)
  }

  const getMandatoryMessage = () => {
    return (
      <Grid item xs={12} container direction='row-reverse'>
        <span className={classes.mandatoryFields}>{t('signUp.requiredFields')}</span>
      </Grid>
    )
  }

  const getContactData = () => {
    return (

      <Grid container className={`${classes.registerContainer}`}>
        {getMandatoryMessage()}

        <Grid item xs={12} md={6} container justifyContent='center' alignItems='center'>
          <Input
            /* Nombre*/
            autoComplete='new-password'
            label={t('signUp.name')}
            className={classes.textField}
            showValidationIcon
            onChange={({ target }) => changeName(target.value)}
            value={name}
          />

          <Input
            /* Apellidos razon social*/
            autoComplete='new-password'
            label={t('signUp.surnames')}
            className={classes.textField}
            showValidationIcon
            onChange={({ target }) => changeSurname(target.value)}
            value={surname}
          />

          <Input
            /*Documento*/
            autoComplete='new-password'
            label={t('signUp.identificationDocument')}
            className={classes.textField}
            error={(documentNumber && (documentNumberValidity || existDocument)) || false}
            showValidationIcon
            onBlur={({ target }) => { functcheckDocument(); }}
            onChange={({ target }) => {
              const newDocumentNumber = target.value;
              const isValid = newDocumentNumber === '' || validateIdentityCardAmplNew(newDocumentNumber, emailTele);
              changeDocumentNumberValidity(!isValid);
              changeDocumentNumber(newDocumentNumber);
            }}
            value={documentNumber}
            helperText={(documentNumber && documentNumberValidity) ? (documentNumber.toLowerCase().startsWith('uf') ? t('signUp.UFD') : t('signUp.identificationDocumentNotValid')) : ''}
          />
          {
            existDocument &&
            <Grid container className={classes.errorAlertNew}>
              <Grid item md={true} sm={12} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                <div className='icon2'>
                  <img src={AlertIcon} alt='' />
                </div>
                <div className='text'>{t('signUp.documentExist')}</div>
              </Grid>
            </Grid>
          }
        </Grid>

        <Grid item xs={12} md={6} container justifyContent='center' alignItems='center'>
          <Input
            /* Telefono movil*/
            autoComplete='new-password'
            label={t('signUp.mobilePhone')}
            className={classes.textField}
            error={phoneValidity}
            showValidationIcon
            onChange={({ target }) => {
              changePhoneValidity(!validateMobileNumber(target.value))


              changePhone(target.value)
            }}

            value={phone}
            helperText={(phoneValidity) ? t('signUp.phoneValid') : ''}

          />

          <Input
            /* Correo electronico*/
            autoComplete='new-password'
            label={t('signUp.email')}
            maxLength='100'
            className={classes.textField}
            error={emailValidity || existEmail}
            showValidationIcon
            onChange={({ target }) => {
              changeEmail(target.value)
            }}
            onBlur={async ({ target }) => {
              changeEmailTele(await validateMailParamTele(target.value))

              changeEmailValidity(!validateMail(target.value))
              functcheckEmail()
            }}
            value={email}
            helperText={(emailValidity) ? t('signUp.emailNotValid') : ''}
          />
          {
            //VERIFICAMOS SI EXISTE EL EMAIL 
            existEmail &&
            <Grid container className={classes.errorAlertNew}>
              <Grid item md={true} sm={12} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                <div className='icon2'>
                  <img src={AlertIcon} alt='' />
                </div>
                <Grid item className='text' md='auto' sm={12} xs={12}>{t('signUp.emailExist')}</Grid>
              </Grid>
            </Grid>
          }


          <Input
            /* Repetir correo electronico*/
            autoComplete='new-password'
            label={t('signUp.repeatEmail')}
            className={classes.textField}
            error={emailConfirmation !== '' && email !== emailConfirmation}
            showValidationIcon
            onChange={({ target }) => changeEmailConfirmation(target.value)}
            onPaste={(e) => {
              e.preventDefault()

              return false
            }}
            value={emailConfirmation}
            helperText={(email.trim() !== emailConfirmation.trim()) ? t('signUp.differentEmails') : ''}
          />
        </Grid>
      </Grid>


    )
  }


  const getAccessData = () => {

    return (

      <Grid container className={`${classes.registerContainer} ${tabValue == 0 ? classes.displayNone : ''}`}>
        {getMandatoryMessage()}

        {
  <Grid item xs={6} md={6} container className={classes.tooltipContainer} justifyContent='center' alignItems='center'>
    <InputPasswordSignUp
      /* Constraseña */
      autoComplete='new-password'
      label={t('signUp.password')}
      className={classes.textField2}
      error={!passwordConfChecker || (!passVacio && !passwordValidity)}
      onChange={({ target }) => {
        changePassword(target.value);

      }}
      onBlur={({ target }) => {
        if(password!=''){
          changePassVacio(false);
        }else{
          changePassVacio(true);
        }
        
        // VALIDACIONES
        let vchangePasswordValidityCapital = newValidatePasswordCapital(target.value);
        let vchangePasswordValidityLower = newValidatePasswordLower(target.value);
        let vchangePasswordValidityNumber =newValidatePasswordNumber(target.value);
        let vchangePasswordValidityNumberCharacter=newValidatePasswordNumberCharacter(target.value);
        // let vchangePasswordValiditySpace=newValidatePassSpace(target.value);
        // let vchangePasswordValidityConsecutive=newValidatePasswordConsecutive(target.value);
        // let vchangePasswordValidityLetter=newValidatePasswordLetter(target.value);
        // let vchangePasswordValidityCoincidence=newValidatePasswordCoincidence(target.value, name, surname, documentNumber, phone, email);

        changePasswordValidityNumber(vchangePasswordValidityNumber)
        changePasswordValidityCapital(vchangePasswordValidityCapital)
        changePasswordValidityLower(vchangePasswordValidityLower)
        changePasswordValidityNumberCharacter(vchangePasswordValidityNumberCharacter)
        // changePasswordValiditySpace(vchangePasswordValiditySpace)
        // changePasswordValidityConsecutive(vchangePasswordValidityConsecutive)
        // changePasswordValidityLetter(vchangePasswordValidityLetter)
        // changePasswordValidityCoincidence(vchangePasswordValidityCoincidence)

        if (
          vchangePasswordValidityCapital &&
          vchangePasswordValidityLower &&
          vchangePasswordValidityNumber &&
          vchangePasswordValidityNumberCharacter 
          // vchangePasswordValiditySpace 
          // vchangePasswordValidityConsecutive &&
          // vchangePasswordValidityLetter &&
          // vchangePasswordValidityCoincidence
        ) {
          changePasswordValidity(true);
          setPasswordResetChecker(true);
        } else {
          changePasswordValidity(false);
          setPasswordResetChecker(false);
        }

        if (passwordConfirmation !== '') {
          setPasswordConfChecker(target.value === passwordConfirmation);
        } else {
          setPasswordConfChecker(true);
        }
      }}
      value={password}
      // error={!passwordValidity}
      // helperText={!passwordValidity ? t('profile.profilePasswordChange.passwordRequiriments') : ''}
    />
  </Grid>
}


        {
          <Grid item xs={6} md={6} container className={classes.tooltipContainer} justifyContent='center' alignItems='center'>

            <InputPasswordSignUp
              /* Constraseña*/
              autoComplete='off'
              label={t('signUp.repeatPassword')}
              className={classes.textField2}
              error={(passwordConfirmation.length > 0 && (!passwordResetChecker || !passwordConfChecker))}
              helperText={(passwordConfirmation.length > 0) && (!passwordConfChecker) ? t('profile.profilePasswordChange.differentPassword') : null}
              onChange={({ target }) => {
                if((target.value.length > 0 && !passwordValidity)) setPasswordResetChecker(false)
                  else if (passwordConfChecker) setPasswordResetChecker(true)
                if(target.value.length > 0) setPasswordConfChecker(password === target.value)
                  else setPasswordConfChecker(true)
                changePasswordConfirmation(target.value)
                //VALIDACION COINCIDENCIAS DATOS
                changePasswordValidityCoincidence(newValidatePasswordCoincidence(target.value, name, surname, documentNumber, phone, email))
              }}
              onPaste={(e) => {
                e.preventDefault()

                return false
              }}
              value={passwordConfirmation}
            />
          </Grid>

        }
        {!passVacio && !passwordValidity? (
          
          <Grid container md={12} sm={12} xs={12} className={classes.dossierDateAdviseBoxMargin}>
            <Grid item md={12} sm={12} xs={12}>
              <Grid container justifyContent='center' alignItems='center' className={classes.dossierDateAdviseContainer}>
                <Grid container md={11}>
                  <Grid container alignItems='center'>

                    <Grid item md={4} sm={2} xs={12} className={classes.dossierDateAdviseTitle}>
                      <div>{t('login.signUp.pass')}</div>

                    </Grid>

                    <Grid item md={8} sm={10} xs={12} className={classes.dossierDateAdviseBlue}>
                      <DossierItem empty={passVacio} condition={passwordValidityNumberCharacter} text={t('login.signUp.passcharacter')} />
                      <DossierItem empty={passVacio} condition={passwordValidityCapital} text={t('login.signUp.passCapital')} />
                      <DossierItem empty={passVacio} condition={passwordValidityLower} text={t('login.signUp.passLower')} />
                      <DossierItem empty={passVacio} condition={passwordValidityNumber} text={t('login.signUp.passNumber')} />
                      {/* <DossierItem empty={passVacio} condition={passwordValiditySpace} text={t('login.signUp.passSpace')} /> */}
                      {/* <DossierItem empty={passVacio} condition={passwordValidityConsecutive} text={t('login.signUp.passConsecutive')} /> */}
                      {/* <DossierItem empty={passVacio} condition={passwordValidityLetter} text={t('login.signUp.passLetter')} /> */}
                      {/* <DossierItem empty={passVacio} condition={passwordValidityCoincidence} text={t('login.signUp.passCoincidence')} /> */}
                    </Grid>
                  </Grid>

                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ):''

        }
        {
        <Grid container alignItems='center'>
         <Grid container md={12} sm={12} xs={12} className={classes.dossierDateAdviseBoxMargin}>
              <div className={classes.subtitle}><b>{t('login.DataProtection.title')}</b></div>
            </Grid>

            <Grid container md={12} sm={12} xs={12} className={classes.dossierDateAdviseBox}>
              <div className={classes.subtitle}>{t('login.DataProtection.text1')}</div>
            </Grid>


          </Grid>
        }

        {

          <Grid container alignItems='center'>
            <Grid item md={12} sm={12} xs={12} className={classes.dossierDateAdviseBox}>
              <div className={classes.subtitle}>
                {t('login.DataProtection.text2')}
                <a className={classes.privacyPolicyLink} href={`mailto:${t('login.DataProtection.link')}`}>
                  {t('login.DataProtection.link')}
                </a>
              </div>
            </Grid>
          </Grid>
        }

        <Grid container md={12} sm={12} xs={12} className={classes.dossierDateAdviseBox}>
          <div className={classes.subtitle}>
            {t('login.DataProtection.text3')}
            {(!isMobileApp()) ?
              <>
                <a className={classes.privacyPolicyLink} target='_blank' href={t('login.DataProtection.urlPC')}>
                  {t('login.DataProtection.text3link')}
                </a>
                {t('common.punctuation.dot')}
              </>
              :
              <>
                <a className={classes.privacyPolicyLink} target='_blank' href={t('login.DataProtection.urlMobile')}>
                  {t('login.DataProtection.text3link')}
                </a>
                {t('common.punctuation.dot')}
              </>
            }
          </div>
        </Grid>


        <Grid container xs={12} md={12} className={classes.tooltipContainer} justifyContent='center' alignItems='center' >
          <Grid item xs={12} md={6} justifyContent='center' alignItems='center'>
            <Grid container justifyContent='center'>
              <Recaptcha onChangeCaptcha={changeCaptchaValue} />
            </Grid>
          </Grid>


          <Grid item xs={12} md={6} justifyContent='center' alignItems='center' className={classes.marginTop20}>
            {/* <Grid container justifyContent='center'>
              <Grid item>
                <FormControlLabel
                //POLITICA DE PRIVACIDAD
                  control={
                    <Checkbox
                      checked={gdprAccepted}
                      onChange={(event) => changeGdprAccepted(event.target.checked)}
                      value='checkedB'
                      color='primary'
                    />
                  }
                  label={
                    <div className={classes.privacyPolicyLabel}>
                      {`${t('signUp.privacyPolicy1')} `}

                      <span className={classes.privacyPolicyLink} onClick={handleOpenDialog}>
                        {t('signUp.privacyPolicy2')}
                      </span>
                    </div>
                  }
                />
              </Grid>
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>

    )
  }

  const getAcceptButton = () => {
    if (tabValue === 1) {
      return (
        <Button
          className={classes.button}
          text={t('common.buttons.register')}
          color='primary'
          size='large'
          variant='contained'
          disabled={!isFirstTabValid() || !gdprAccepted || (!validateUserCodeSignUp(documentNumber) && (!passwordValidity || password === '' || passwordConfirmation === '' || password !== passwordConfirmation))}
          onClick={handleSignUpButton}
        />
      )
    }

    return (
      <Button
        className={classes.button}
        text={t('common.buttons.continue')}
        color='primary'
        size='large'
        variant='contained'
        disabled={!isFirstTabValid()}
        onClick={() => changeTabValue(tabValue + 1)}
      />
    )
  }

  const isFirstTabValid = () => {
    const telegestion = validateUserCodeSignUp(documentNumber);

    if (telegestion) {
      return surname !== '' &&
        validateIdentityCardAmpl(documentNumber) &&
        validateMail(email) &&
        email === emailConfirmation &&
        (
          /^[ABCDEFGHNPQS]/.test(documentNumber) ||
          name !== ''
        );
    } else {
      return surname !== '' &&
        validateIdentityCardAmpl(documentNumber) &&
        validateMail(email) &&
        email === emailConfirmation &&
        (
          /^[ABCDEFGHNPQS]/.test(documentNumber) ||
          name !== ''
        ) &&
        validateMobileNumber(phone);
    }
  };



  const handleBackButton = () => {
    if (tabValue === 0) {
      props.history.push('/')

      return false
    }

    changeTabValue(tabValue - 1)
  }

  return (
    <div className={classes.block}>
      <Dialog
        showingDialog={showingDialog}
        closeDialog={handleCloseDialog}
      />

      <Grid
        container
        justifyContent='center'
        alignItems='center'
        className={classes.container}
      >
        <Grid container item xs={12} sm={8} className={classes.register}>
          <Grid
            className={classes.header}
            container
            justifyContent='space-between'
            alignItems='baseline'
            direction='row'
          >
            {
              isLoading &&
              <Spinner fixed={true} />
            }
            <Grid item md={3} xs={12} />

            <Grid item md={4} xs={12} className={classes.title}>
              <span>{t('signUp.registration')}</span>
            </Grid>

            <Grid item md={5} xs={12} className={classes.privateAccess}>
              <Grid><span>{`${t('signUp.span')} `}<Link to='/'>{t('signUp.link')}</Link></span></Grid>
              <Grid className={classes.advise}><span>{`${t('signUp.advise')} `}<a href='https://www.ufd.es/contacto/'>{t('signUp.adviseLink')}</a></span></Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={0}>
              <StyledTabSelector
                value={tabValue}
                onChange={(event, newValue) => changeTabValue(newValue)}
                indicatorColor='primary'
                textColor='primary'
                centered
              >
                <StyledTab className={classes.tab} label={t('signUp.contactData')} />

                <StyledTab className={classes.tab} label={t('signUp.accessData')} />
              </StyledTabSelector>
            </Paper>

            <SwipeableViews index={tabValue}>
              {getContactData()}
              {getAccessData()}
            </SwipeableViews>
          </Grid>

          <Grid container justifyContent='center'>
            <Button
              className={classes.button}
              text={t('common.buttons.return')}
              color='inherit'
              size='large'
              variant='contained'
              onClick={handleBackButton}
            />

            {getAcceptButton()}
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default SignUp
