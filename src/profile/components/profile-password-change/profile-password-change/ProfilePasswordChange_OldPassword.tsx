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
import { thunkSendLogin } from '../../../../login/store/actions/LoginThunkActions'

import useStyles from './ProfilePasswordChange.styles'
import DossierItem from '../../../../sign-up/components/sign-up/DossierItem'


const ProfilePasswordChange_OldPassword = (props: any) => {
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

  const [changingPassword, setChangingPassword] = useState(false)
  const user = useSelector((state: any) => state.user.profile.documentNumber)
  const [password, setPassword] = useState('')
  const [passwordValidityNumber, setPasswordValidityNumber] = useState(true)
  const [passwordValidityNumberCharacter, setPasswordValidityNumberCharacter] = useState(true)
  const [passwordValidityCapital, setPasswordValidityCapital] = useState(true)
  const [passwordValidityLower, setPasswordValidityLower] = useState(true)
  const [passwordValidity, setPasswordValidity] = useState(false)
  const [passVacio, setPassVacio] = useState(true)




  const handleChangeInputConf = (e) => {
    setPasswordConfChecker(e.target.value === password)
    setPasswordConf(e.target.value)
  }

  const handleCancel = () => {
    props.history.push('/profile')
  }

  const handleAccept = () => {
    setChangingPassword(true)

    if (userToken === '') {
      dispatch(thunkUpdateUserPassword(setChangingPassword, urlHash, urlEmail, password, () => {
        props.history.push('/profile/changePassword/success')
      }))
    } else {
      dispatch(thunkUpdateUser(setChangingPassword, () => {
        setStoreUser(userDocumentNumber)
        setStorePassword(password)

        const data = {
          user: userDocumentNumber,
          password
        }

        dispatch(thunkSendLogin(null, data, (response) => {
          props.history.push('/profile/changePassword/success')
        }))
      }, password))
    }
  }

  

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

        <Grid item xs={12} sm={6} md={6}>
          <Grid container direction='column'>
            <Grid container direction='row'>
              <Typography className={classes.label}>{t('profile.profilePasswordChange.password')}</Typography>

              <LightTooltip
                title={t('profile.profilePasswordChange.title')}
                placement='right'
              >
                <img src={InfoIcon} className={`${classes.label} ${classes.tooltipImage}`} alt='' />
              </LightTooltip>
            </Grid>

            <Grid className={classes.inputContainer}>
              <InputPassword
                  /* Constraseña */
                fullWidth
                className={classes.textField}
                error={!passwordConfChecker || (!passVacio && !passwordValidity)}
                onChange={({ target }) => {
                  setInputChange(true);
                  setPassword(target.value)
                }}

                onBlur={({ target }) => {
                  if (password != '') {
                    setPassVacio(false);
                  } else {
                    setPassVacio(true);
                  }

                  // VALIDACIONES
                  let vchangePasswordValidityCapital = newValidatePasswordCapital(target.value);
                  let vchangePasswordValidityLower = newValidatePasswordLower(target.value);
                  let vchangePasswordValidityNumber = newValidatePasswordNumber(target.value);
                  let vchangePasswordValidityNumberCharacter = newValidatePasswordNumberCharacter(target.value);


                  setPasswordValidityNumber(vchangePasswordValidityNumber)
                  setPasswordValidityCapital(vchangePasswordValidityCapital)
                  setPasswordValidityLower(vchangePasswordValidityLower)
                  setPasswordValidityNumberCharacter(vchangePasswordValidityNumberCharacter)


                  if (
                    vchangePasswordValidityCapital &&
                    vchangePasswordValidityLower &&
                    vchangePasswordValidityNumber &&
                    vchangePasswordValidityNumberCharacter

                  ) {
                    setPasswordValidity(true);
                     setPasswordResetChecker(true);
                  } else {

                    setPasswordValidity(false);
                      setPasswordResetChecker(false);
                  }

                  if(passwordConf !== ''){                      
                    setPasswordConfChecker(target.value === passwordConf)
                  }else {
                      setPasswordConfChecker(true);
                    }

                }}
                value={password}
              />
            </Grid>

          </Grid>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
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
                value={passwordConf}
             />
            </Grid>
          </Grid>
        </Grid>
        {!passVacio && !passwordValidity ? (

          <Grid container md={12} sm={10} xs={11} className={classes.dossierDateAdviseBox}>
            <Grid item md={12} sm={12} xs={12}>
              <Grid container justifyContent='center' alignItems='center' className={classes.dossierDateAdviseContainer}>
                <Grid container md={11}>
                  <Grid container alignItems='center'>

                    <Grid item md={4} sm={3} xs={12} className={classes.dossierDateAdviseTitle}>
                      <div>{t('login.signUp.pass')}</div>

                    </Grid>

                    <Grid item md={8} sm={9} xs={12} className={classes.dossierDateAdviseBlue}>
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

  const isAcceptEnabled = 
   !passVacio &&
    passwordValidity &&
    passwordConf.length > 0 &&
    password === passwordConf

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
              disabled={!isAcceptEnabled}
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
                  {t('profile.profilePasswordChange.newPassword')}
                </Grid>
              </Grid>
            </Grid>

            <Grid container direction='column' className={classes.data}>
              {getInputsContainer()}
            </Grid>

            {getButtonsContainer()}
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default ProfilePasswordChange_OldPassword