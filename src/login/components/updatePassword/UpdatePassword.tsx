import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import useStyles from './UpdatePassword.styles';
import Button from '../../../common/components/button/Button';
import InfoIcon from '../../../assets/icons/ico_info.svg';
import OkIcon from '../../../assets/icons/ico_ok.svg';
import LightTooltip from '../../../common/components/tooltip/light/LightTooltip';
import InputPassword from '../../../common/components/input-password/InputPassword';
import Input from '../../../common/components/input/Input';
import PasswordStrengthMeter from '../../../common/components/password-strength-meter/PasswordStrengthMeter';
import Recaptcha from '../../../common/components/recaptcha/Recaptcha';
import Checkbox from '../../../common/components/checkbox/Checkbox';
import { thunkMigratePassword, thunkSendFirstLogin } from '../../store/actions/LoginThunkActions';
import { useDispatch, useSelector } from 'react-redux';
import { newValidatePassword700, newValidatePassword } from '../../../common/lib/ValidationLib';
import { setPassword } from '../../store/actions/LoginActions';
import { showError } from '../../../common/store/actions/ErrorActions';
import Dialog from '../../../sign-up/components/dialog/Dialog';

const UpdatePassword = (props: any) => {
  const {
    handleSend,
    data,
    setIsLoading,
    handleContinue,
    updateCode
  } = props;

  const classes = useStyles({});
  const [showForm, setShowForm] = useState(updateCode !== '2901');
  const [showModal, setShowModal] = useState(false);
  const [passwordValidity, changePasswordValidity] = useState(true);
  const [password, changePassword] = useState('');
  const [passwordConfirmation, changePasswordConfirmation] = useState('');
  const [passwordConfChecker, setPasswordConfChecker] = useState(true);
  const [captchaValue, changeCaptchaValue] = useState();
  const [gdprAccepted, changeGdprAccepted] = useState(false);
  const [code, setCode] = useState('');
  const [ showingDialog, setShowingDialog ] = useState(false)
  const [inputCode, setInputCode] = useState('');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.login.user);

  const handleOpenDialog = (e) => {
    e.preventDefault()
    setShowingDialog(true)
  }

  const handleUpdate = () => {
    setIsLoading(true);

    dispatch(thunkMigratePassword(setIsLoading, { code, password }, (response) => {
      if (response.result && response.result.codResult === '2910') {
        setShowForm(false);
        setShowModal(true);
        setIsLoading(false);
      } else if (response  && response === '4008') {
        dispatch(showError('4008'));
        setCode('');
        setInputCode('');
        setIsLoading(false);
      } else {
        dispatch(showError('24031'));
        dispatch(thunkSendFirstLogin(null, null, (response => {
          console.log('Código reenviado')
          setIsLoading(false);
          setCode('');
          setInputCode('');
          dispatch(showError('24031'));
        })))
      }
    }));
  }

  const partialEmail = (email = '') => {
    return email.replace(/(\w{1})[\w.-]+@([\w.]+\w)/, '$1***@$2');
  }

  const getAccessData = () => {
    return (
      <Grid container className={classes.registerContainer}>
        <Grid item xs={12} md={6} container className={classes.tooltipContainer} justifyContent='center' alignItems='center'>
          <Grid item xs={12} className={classes.infoContainer}>
            <InputPassword
              autocomplete='off'
              label={t('login.update.newPassword')}
              className={classes.textField}
              onChange={({ target }) => {
                // Check for uppercase letters
                const hasUppercase = /[A-Z]/.test(target.value);
                let isValid;
                if (hasUppercase) {
                  isValid = false;
                } else {
                  isValid = /^70\d{6}$/.test(user)
                    ? newValidatePassword700(target.value, '')
                    : newValidatePassword(target.value, '');
                }
                changePasswordValidity(isValid);
                changePassword(target.value);
                if (passwordConfirmation !== '') {
                  setPasswordConfChecker(target.value === passwordConfirmation);
                }
              }}
              inputProps={{
                autoComplete: 'new-password', form: {autoComplete: 'off'}
              }}
              value={password}
              error={!passwordValidity}
              helperText={
                !passwordValidity &&
                  (/^70\d{6}$/.test(user)
                    ? t('profile.profilePasswordChange.passwordRequiriments700')
                    : /[A-Z]/.test(password)
                      ? t('login.update.noUppercaseAllowed')
                      : t('profile.profilePasswordChange.passwordRequiriments'))
              }
            />
            <LightTooltip
              title={/^70\d{6}$/.test(user) ? t('profile.profilePasswordChange.title700') : t('profile.profilePasswordChange.title')}
              placement='right'
            >
              <img src={InfoIcon} alt='' />
            </LightTooltip>
          </Grid>

          <PasswordStrengthMeter password={password} className={classes.passwordStrengthMeter} />

          <Grid item xs={12} className={classes.infoContainer}>
            <InputPassword
              autocomplete='off'
              label={t('login.update.repeatPassword')}
              className={classes.textField}
              error={!passwordConfChecker}
              helperText={!passwordConfChecker ? t('profile.profilePasswordChange.differentPassword') : null}
              onChange={({ target }) => {
                setPasswordConfChecker(password === target.value)

                changePasswordConfirmation(target.value)
              }}
              onPaste={(e) => {
                e.preventDefault()

                return false
              }}
              value={passwordConfirmation}
            />
          </Grid>
          <Grid item xs={12} md={1} />          
        </Grid>


        <Grid item className={classes.rightContent} xs={12} md={6}>
          <Grid container>
            <Grid item xs={12} md={12}>
              <Grid container justifyContent='center'>
                <Grid item>
                  <Recaptcha onChangeCaptcha={changeCaptchaValue} />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={12} className={classes.privacyPolicy}>
              <Grid container justifyContent='center'>
                <Grid item>
                  <FormControlLabel
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
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  const handleChangeInput = (event: React.ChangeEvent<{ value: string; id: string; name: string }>) => {
    setCode(event.target.value);
    setInputCode(event.target.value);
  }

  const continueLogin = () => {
    dispatch(setPassword(''));
    handleContinue();
  }

  return (
    <Grid
      container
      justifyContent='center'
      alignItems='center'
      className={classes.updateContainer}
    >
      <Dialog
        showingDialog={showingDialog}
        closeDialog={() => setShowingDialog(false)}
      />
      {
        showForm ?
          <Grid container item xs={12} sm={8} className={classes.formContainer}>
            <Grid
              className={classes.header}
              container
              justifyContent='center'
              alignItems='baseline'
              direction='column'
            >
              <Grid item md={12} xs={12} className={classes.title}>
                <span>{t('login.update.updateTitle')}</span>
              </Grid>
              <Grid item xs={12} md={6} container justifyContent='center' alignItems='center'>
                <Input
                  autocomplete='off'
                  label={t('login.update.code')}
                  className={classes.textField}
                  onChange={handleChangeInput}
                  value={inputCode}
                  inputProps={{ minLength: 4, maxLength: 6, autoComplete:'new-password', form: {autoComplete: 'off'}, style: { textAlign: 'center', fontSize: 28, padding: '8px' } }}
                />
              </Grid>
              {getAccessData()}

              <Grid container md={8} xs={12} justifyContent='center' className={classes.buttons}>
                {updateCode === '2901' &&
                  <Button
                    className={classes.button}
                    text={t('common.buttons.return')}
                    color='inherit'
                    size='large'
                    variant='contained'
                    onClick={() => setShowForm(false)}
                  />}

                <Button
                  className={classes.button}
                  text={t('login.update.updateButton')}
                  color='primary'
                  size='large'
                  variant='contained'
                  disabled={!passwordValidity || !passwordConfChecker || !gdprAccepted || code === ''}
                  onClick={handleUpdate}
                />
              </Grid>
            </Grid>
          </Grid>
          :
          <Grid container item xs={12} sm={8} className={classes.container}>
            <Grid
              className={classes.header}
              container
              justifyContent='center'
              alignItems='baseline'
              direction='column'
            >
              <>
                <>
                  <Grid item>
                    <img src={showModal ? OkIcon : InfoIcon} alt='' className={classes.icon} />
                  </Grid>
                  <Grid item md={12} xs={12} className={classes.title}>
                    <span>{showModal ? t('login.update.updateOk') : t('login.update.updateTitle')}</span>
                  </Grid>
                </>
                {!showModal &&
                  <>
                    <Grid item md={12} xs={12} className={classes.send}>
                      <span>{t('login.update.text1')}</span>
                    </Grid>
                    <Grid item md={12} xs={12} className={classes.send}>
                      <span>{t('login.update.text2')}</span>
                    </Grid>
                    <Grid item md={12} xs={12} className={classes.send}>
                      <span>{t('login.update.text3', { email: partialEmail(data.email) })}</span>
                    </Grid>
                    <Grid item md={12} xs={12} className={classes.send}>
                      <span>{t('login.mfa.sendCode1')}</span>
                      <span className={classes.link} onClick={handleSend}>{t('login.mfa.sendCode2')}</span>
                    </Grid>
                  </>
                }
                <Grid container md={8} xs={12} justifyContent='center' className={classes.buttons}>
                  {showModal ?
                    <Button
                      className={classes.button}
                      text={t('common.buttons.continue')}
                      color='primary'
                      size='large'
                      variant='contained'
                      onClick={continueLogin}
                    />
                    :
                    <Button
                      className={classes.button}
                      text={t('login.update.updateButton')}
                      color='primary'
                      size='large'
                      variant='contained'
                      onClick={() => setShowForm(true)}
                    />
                  }
                </Grid>
              </>
            </Grid>
          </Grid>
      }
    </Grid>
  )
}

export default UpdatePassword;