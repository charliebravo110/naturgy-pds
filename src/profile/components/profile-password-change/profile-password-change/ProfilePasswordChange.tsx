import React, { useEffect, useState, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import Spinner from '../../../../common/components/spinner/Spinner'
import ButtonToTop from '../../../../common/components/button-to-top/ButtonToTop'
import ChangePasswordIcon from '../../../../assets/icons/cambiar_contrasenia.svg'
import InputPassword from '../../../../common/components/input-password/InputPassword'
import Button from '../../../../common/components/button/Button'
import LightTooltip from '../../../../common/components/tooltip/light/LightTooltip'
import InfoIcon from '../../../../assets/icons/info.svg'

import CloseIcon from '../../../../assets/icons/cerrar_blanco.svg'

import {
  validateIdentityCardAmpl,
  newValidatePassword,
  newValidatePasswordCapital,
  newValidatePasswordLower,
  newValidatePasswordNumber,
  newValidatePasswordNumberCharacter
} from '../../../../common/lib/ValidationLib'

import { setUser as setStoreUser, setPassword as setStorePassword } from '../../../../login/store/actions/LoginActions'

import { thunkUpdateUser, thunkUpdateUserPassword } from '../../../../common/store/actions/UserThunkActions'
import { thunkSendLogin, verifyLogin, thunkSendChangeLogin } from '../../../../login/store/actions/LoginThunkActions'

import useStyles from './ProfilePasswordChange.styles'
import DossierItem from '../../../../sign-up/components/sign-up/DossierItem'

// LCS: Importa la función - Wave 1
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm';

const ProfilePasswordChange = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const userToken = useSelector((state: any) => state.user.token)
  const userDocumentNumber = useSelector((state: any) => state.user.profile.documentNumber)
  const { t } = useTranslation()

  const urlHash = props.match.params.hash
  const urlEmail = props.match.params.email

  const [passwordConf, setPasswordConf] = useState('')
  const [inputChange, setInputChange] = useState(false)
  const [passwordChecker, setPasswordChecker] = useState(true)
  const [passwordConfChecker, setPasswordConfChecker] = useState(true)
  const [passwordResetChecker, setPasswordResetChecker] = useState(true)
  const [buttonDisable, setButtonDisable] = useState(false)
  const [passVacio, changePassVacio] = useState(true)
  const [passwordValidityNumber, changePasswordValidityNumber] = useState(true)
  const [passwordValidityNumberCharacter, changePasswordValidityNumberCharacter] = useState(true)
  const [passwordValidityCapital, changePasswordValidityCapital] = useState(true)
  const [passwordValidityLower, changePasswordValidityLower] = useState(true)
  const [passwordValidity, changePasswordValidity] = useState(false)
  const [password, changePassword] = useState('')

  const [changingPassword, setChangingPassword] = useState(false)
  const [allowChangingPassword, setAllowChangingPassword] = useState(true)

  const user = useSelector((state: any) => state.user.profile.documentNumber)
  const [oldPassword, setOldPassword] = useState('')
  const [showingErrorAlert, setShowingErrorAlert] = useState(false)

  const handleChangeInputConf = (e) => {
    setPasswordConfChecker(e.target.value === password)
    setPasswordConf(e.target.value)
  }

  const handleCancel = () => {
    props.history.push('/profile')
  }

  const handleAccept = () => {
    setChangingPassword(true)
    try {
      if (userToken === '') {
        dispatch(thunkUpdateUserPassword(setChangingPassword, urlHash, urlEmail, password, () => {
          props.history.push('/profile/changePassword/success')
        }))
      } else {
        dispatch(thunkUpdateUser(setChangingPassword, () => {
          setStoreUser(userDocumentNumber)
          /*setStorePassword(password)

          const data = {
            user: userDocumentNumber,
            password
          }
          dispatch(thunkSendChangeLogin(null, data, (response) => {
            props.history.push('/profile/changePassword/success')
          }))*/

          props.history.push('/profile/changePassword/success')
        }, password))
      }
    } catch (e){
      // LCS: Enviar evento a GA - Wave 1
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : 'Fallo al actualizar la contraseña',
          error: e,
          reactComponent: 'ProfilePasswordChange.tsx - handleAccept',
          codResult: (e as any).result ? (e as any).result.codResult : (e as any).status
        }
      });
    }
  }

  const handleSubmitLoginForm = () => {
    setShowingErrorAlert(false)

    if (!validateIdentityCardAmpl(user)) {
      // LCS: Enviar evento a GA
      sendGAEvent({
        event: 'react_error',
        info:{
          error_message: 'Número de documento inválido',
          error: 'Número de documento inválido',
          reactComponent: 'ProfilePasswordChange.tsx - handleSubmitLoginForm',
        }
      });
      return false
    }

    const data = {
      user: user,
      password: oldPassword
    }

    try {
      dispatch(verifyLogin(false, data, (response) => {
        if (response === '1001') {
          setShowingErrorAlert(true)
        }

        if (!response) {
          // ok

          setAllowChangingPassword(true)

        }
      }))
    } catch (e){
      // LCS: Enviar evento a GA - Wave 1
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : 'Error desconocido al verificar el inicio de sesión',
          error: e,
          reactComponent: 'ProfilePasswordChange.tsx - handleSubmitLoginForm',
          codResult: (e as any).result ? (e as any).result.codResult : (e as any).status
        }
      });
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmitLoginForm()
    }
  }

  const handlePasswordInputChange = ({ target }) => {
    setOldPassword(target.value)
  }

  useEffect(
    () => {
      if (inputChange) {
        if (newValidatePassword(password, user)) {
          setPasswordChecker(true)

          // if (inputConfBlur) {
          setPasswordConfChecker(true)

          if (password === passwordConf) {

            setPasswordChecker(true)

            setPasswordConfChecker(true)

            setButtonDisable(true)
          } else {
            if((passwordConf.length > 0 )) setPasswordConfChecker(false)
            else setPasswordConfChecker(true)

            setButtonDisable(false)
          }
          // }
        } else {
          setPasswordChecker(false)

          setButtonDisable(false)
        }
      }
    },
    [password, passwordConf, inputChange]
  )

  useEffect( () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'view',
      content_group: 'cambiar contraseña',
      page_url: removeEmails(window.location.href),
      user_id: sessionStorage.getItem('id'),
      previous_path: removeEmails(sessionStorage.getItem("previousPage")),
      user_type: sessionStorage.getItem('user_type'),
      browsing_type: sessionStorage.getItem('browsing_type'),
      element_type: 'medicion de pagina',
      ga_client_id: sessionStorage.getItem('ga_client_id'),
      cups: 'no aplica',
      supply_type: 'no aplica'
    });
    sessionStorage.setItem("previousPage", window.location.href);
  }, [])

  if (userToken === '' && (!urlHash || !urlEmail)) {
    return <Redirect to='/profile' />
  }

  const getInputsContainer = () => {
    return (
      <Grid
        container
        spacing={3}
        direction='row'
        justifyContent='space-between'
        className={classes.inputs}
      >
        {
          changingPassword &&
          <Spinner fixed={true} />
        }
        <Grid container xs={12} sm={12} md={12}  justifyContent='space-between'>
          <Grid item xs={12} sm={5} md={5}>
            <Grid container direction='column'>
              <Grid container direction='row'>
                <Typography className={classes.label}>{t('profile.profilePasswordChange.password')}</Typography>
              </Grid>

              <Grid className={classes.inputContainer}>

                <InputPassword
                  /* Constraseña */
                  fullWidth
                  className={classes.textField}
                  error={!passwordConfChecker || (!passVacio && !passwordValidity)}
                  onChange={({ target }) => {
                    changePassword(target.value);
                    if (!inputChange) {
                      setInputChange(true)
                    }
                    changePassword(target.value)
                  }

                  }

                  onBlur={({ target }) => {
                    try{
                      if (password != '') {
                        changePassVacio(false);
                      } else {
                        changePassVacio(true);
                      }

                      // VALIDACIONES
                      let vchangePasswordValidityCapital = newValidatePasswordCapital(target.value);
                      let vchangePasswordValidityLower = newValidatePasswordLower(target.value);
                      let vchangePasswordValidityNumber = newValidatePasswordNumber(target.value);
                      let vchangePasswordValidityNumberCharacter = newValidatePasswordNumberCharacter(target.value);


                      changePasswordValidityNumber(vchangePasswordValidityNumber)
                      changePasswordValidityCapital(vchangePasswordValidityCapital)
                      changePasswordValidityLower(vchangePasswordValidityLower)
                      changePasswordValidityNumberCharacter(vchangePasswordValidityNumberCharacter)


                      if (
                        vchangePasswordValidityCapital &&
                        vchangePasswordValidityLower &&
                        vchangePasswordValidityNumber &&
                        vchangePasswordValidityNumberCharacter
                      ) {
                        changePasswordValidity(true);
                        setPasswordResetChecker(true);
                      } else {
                        changePasswordValidity(false);
                        setPasswordResetChecker(false);
                      }

                      if(passwordConf !== ''){
                        setPasswordConfChecker(target.value === passwordConf)
                      }else {
                        setPasswordConfChecker(true);
                      }
                    } catch (error){
                      // LCS: Enviar evento a GA
                      sendGAEvent({
                        event: 'react_error',
                        info:{
                          error_message: 'Error desconocido en la validación de la contraseña',
                          error: error,
                          reactComponent: 'ProfilePasswordChange.tsx - onBlur',
                        }
                      });
                    }
                  }}
                  value={password}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={5} md={5}>
            <Grid container direction='column' className={classes.strengthAdapter}>
              <Typography className={classes.label}>{t('profile.profilePasswordChange.confirmPassword')}</Typography>

              <Grid className={classes.inputContainer}>
                <InputPassword
                  fullWidth
                  className={classes.textField}
                  onChange={handleChangeInputConf}
                  error={(passwordConf.length > 0 && (!passwordResetChecker || !passwordConfChecker))}
                  onPaste={(e) => {
                    e.preventDefault()

                    return false
                  }}
                  helperText={(passwordConf.length > 0) && (!passwordConfChecker) ? t('profile.profilePasswordChange.differentPassword') : null}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {!passVacio && !passwordValidity ? (

          <Grid container md={12} sm={12} xs={10} className={classes.dossierDateAdviseBox}>
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

                    </Grid>
                  </Grid>

                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : ''

        }
      </Grid>
    )
  }

  const getButtonsContainer = () => {
    return (
      <Grid
        container
        direction='column'
        justifyContent='center'
        alignItems='center'
        spacing={2}
        className={classes.buttons}
      >
        <Grid item className={classes.required}>
          {t('profile.profilePasswordChange.requiredFields')}
        </Grid>

        <Grid item>
          <Grid container direction='row' justifyContent='center'>
            <Button
              className={classes.button}
              text={t('common.buttons.cancel')}
              color='inherit'
              size='large'
              variant='contained'
              onClick={handleCancel}
            />

            <Button
              className={classes.button}
              text={t('common.buttons.accept')}
              color='primary'
              size='large'
              variant='contained'
              onClick={handleAccept}
              disabled={!buttonDisable}
            />
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <Fragment>
      <ButtonToTop />

      <Grid container justifyContent='center' alignItems='center' className={`${classes.container} ${userToken !== '' && 'logged'}`}>
        <Grid item xs={12} sm={12} md={12}>
          <div className={classes.headerTitle}>{t('profile.profilePasswordChange.myProfile')}</div>
        </Grid>

        <Grid container direction='row' item xs={11} sm={11} md={10} className={classes.profileBlock}>
          <Grid container item xs={12} sm={12} md={2} className={classes.profileBlockLeft} />

          <Grid
            container
            item
            xs={12}
            sm={12}
            md={10}
            justifyContent='space-between'
            className={classes.profileBlockRight}
          >
            <Grid container direction='row'>
              <Grid item xs={1} sm={1} md={1} className={classes.avatarContainer}>
                <img src={ChangePasswordIcon} className={classes.avatar} alt='' />
              </Grid>

              <Grid
                container
                direction='column'
                item
                xs={6}
                sm={7}
                md={11}
                spacing={2}
                className={classes.titleContainer}
              >
                <Grid item className={classes.title}>
                  {t('profile.profilePasswordChange.changePassword')}
                </Grid>

                <Grid item className={classes.subTitle}>
                  {allowChangingPassword ?
                    t('profile.profilePasswordChange.newPassword')
                    :
                    t('profile.profilePasswordChange.oldPassword')
                  }
                </Grid>
              </Grid>
            </Grid>

            {allowChangingPassword ?
              <>
                <Grid container direction='column' className={classes.data}>
                  {getInputsContainer()}
                </Grid>

                {getButtonsContainer()}
              </>
              :
              <Grid container>
                <Grid container justifyContent='center' className={classes.oldPasswordInputCont}>
                  <Grid item xs={12} sm={6} md={6}>
                    <Grid container direction='column' className={classes.strengthAdapter}>
                      <Typography className={classes.label}>{t('profile.profilePasswordChange.password')}</Typography>

                      <Grid className={classes.inputContainer}>
                        <InputPassword
                          name='password'
                          className={classes.textField}
                          onChange={handlePasswordInputChange}
                          onKeyPress={handleKeyPress}
                          value={oldPassword}
                          InputLabelProps={{
                            shrink: oldPassword
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                {
                  showingErrorAlert &&
                  <Grid container justifyContent='center' className={classes.errorAlert}>
                    <Grid item md='auto' sm={12} xs={12}>
                      <div className='icon'>
                        <img src={CloseIcon} alt='' />
                      </div>
                    </Grid>

                    <Grid item className='text' md='auto' sm={12} xs={12}>{t('profile.profilePasswordChange.passwordError')}</Grid>
                  </Grid>
                }

                <Grid container direction='row' justifyContent='center'>
                  <Button
                    className={classes.button}
                    text={t('common.buttons.cancel')}
                    color='inherit'
                    size='large'
                    variant='contained'
                    onClick={handleCancel}
                  />

                  <Button
                    className={classes.button}
                    name='submit'
                    text={t('common.buttons.continue')}
                    color={'primary'}
                    size={'large'}
                    variant={'contained'}
                    onClick={handleSubmitLoginForm}
                  />
                </Grid>
              </Grid>
            }
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default ProfilePasswordChange