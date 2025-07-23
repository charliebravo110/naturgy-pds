import { Grid } from '@material-ui/core'
import React, { Fragment, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Button from '../../../common/components/button/Button'
import Input from '../../../common/components/input/Input'
import { validateIdentityCard, validateMail, validateMobileNumber } from '../../../common/lib/ValidationLib'
import Checkbox from '../../../supplies/supplies-list/managed-by-me/components/checkbox/Checkbox'
import { setEmail, setPhone, setUser } from '../../store/actions/LoginActions'
import { thunkResetPassword } from '../../store/actions/LoginThunkActions'
import useStyles from './ResetPassword.styles'
import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg'


const ResetPassword = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const state = useSelector((state: any) => state)
  const user = useSelector((state: any) => state.login.user)
  const email = useSelector((state: any) => state.login.email)
  const phone = useSelector((state: any) => state.login.phone)

  const [isCheckboxSelectedEmail, setIsCheckboxSelectedEmail] = useState(true)
  const [isCheckboxSelectedPhone, setIsCheckboxSelectedPhone] = useState(false)
  const [checkEmail, setCheckEmail] = useState<boolean>(false)
  const [checkPhone, setCheckPhone] = useState<boolean>(false)
  const [sameEmailNumber,setSameEmailNumber] = useState('')

  const handleSubmitResetPasswordForm = () => {
    setSameEmailNumber('')
    dispatch(thunkResetPassword(setSameEmailNumber))
  }

  const handleUserInputChange = ({ target }) => {
    dispatch(setUser(target.value))
  }

  const handleEmailInputChange = ({ target }) => {
    dispatch(setEmail(target.value));
  }


  const handlePhoneInputChange = ({ target }) => {
    dispatch(setPhone(target.value))
  }
    
  useEffect(() => {
    handleValidate();
  }, [email,phone]);

  const handleValidate = () => {
    
    if (isCheckboxSelectedEmail) {
      setCheckEmail(validateMail(email))
    }
    if (isCheckboxSelectedPhone) {
      setCheckPhone(validateMobileNumber(phone))
    }
  }

  const handleChangeCheckbox = () => {
    dispatch(setEmail(''))
    dispatch(setPhone(''))
    setIsCheckboxSelectedEmail(!isCheckboxSelectedEmail)
    setIsCheckboxSelectedPhone(!isCheckboxSelectedPhone)
  }


  return (
    
    <Fragment>
      <div className={classes.title}>{t('login.resetPassword2.resetPassword')}</div>

      <div className={`${classes.text} ${classes.subtitle}`}>
        {t('login.resetPassword2.dataResetPassword')}
      </div>

      <Grid container className={classes.checkboxContainer1}>
        <Grid container className={classes.checkboxContainer}>
          <Grid item className={classes.checkboxBotom}>
            <Checkbox selected={isCheckboxSelectedEmail} handleClick={handleChangeCheckbox} />
          </Grid>
          <Grid item className={classes.checkboxItem}>
            <span>{t('pre-register.email')}</span>
          </Grid>
        </Grid>

        <Grid container className={classes.checkboxContainer}>
          <Grid item className={classes.checkboxBotom}>
            <Checkbox selected={isCheckboxSelectedPhone} handleClick={handleChangeCheckbox} />
          </Grid>

          <Grid item className={classes.checkboxItem}>
            <span>{t('pre-register.sms')}</span>
          </Grid>
        </Grid>
      </Grid>

      <Input
        label={t('login.resetPassword2.label')}
        showValidationIcon
        className={classes.textField}
        error={user !== '' && (!validateIdentityCard(user) && !(/^70\d{6}$/.test(user)))}
        onChange={handleUserInputChange}
        value={user}
      />

      {isCheckboxSelectedEmail &&
        <Input
          type='email'
          autoComplete='email'
          label={t('login.resetPassword2.labelEmail')}
          className={classes.textField}
          onChange={handleEmailInputChange}
          //onBlur={handleValidate}
          value={email}
          error={!checkEmail}
          showValidationIcon
        />
      }

      {isCheckboxSelectedPhone &&
        <Input
          type='phone'
          autoComplete='phone'
          label={t('login.resetPassword2.phone')}
          className={classes.textField}
          onChange={handlePhoneInputChange}
          //onBlur={handleValidate}
          value={phone}
          error={!checkPhone}
          showValidationIcon
        />
      }
        {
          //ERROR CONTRASEÑA 
          sameEmailNumber !='' &&
          <Grid container className={classes.errorAlertNew}>
          <Grid item md='auto' sm={12} xs={12}>
            <div className='icon'>
              <img src={AlertIcon} alt='' />
            </div>
          </Grid>
          <Grid item className='text' md='auto' sm={12} xs={12}> {sameEmailNumber=='2404'?t('login.resetPassword2.errorEmail'):t('login.resetPassword2.errorPhone')}</Grid>
        </Grid>
    
        }



      <div className={classes.text}>
        {`${t('login.resetPassword2.link.return1')} `}
        <Link to={`/login`} className={classes.toLoginLink}>
          {t('login.resetPassword2.link.return2')}
        </Link>
      </div>

      <Button
        className={classes.button}
        text={t('login.resetPassword2.button')}
        color={'primary'}
        size={'large'}
        variant={'contained'}
        onClick={handleSubmitResetPasswordForm}
        disabled={(isCheckboxSelectedEmail && !checkEmail) || (isCheckboxSelectedPhone && !checkPhone)}
      />


    
    </Fragment>
  )
}

export default ResetPassword