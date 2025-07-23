import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { Divider, FormControlLabel, Grid, RadioGroup } from '@material-ui/core'
import Input from '../../../common/components/input/Input'
import Button from '../../../common/components/button/Button'
import Spinner from '../../../common/components/spinner/Spinner'
import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg'
import OkIcon from '../../../assets/icons/aviso_ok.svg'



import useStyles from './PreSignUpForm.styles'

import { validateMailParam,  validateMobileNumber } from '../../../common/lib/ValidationLib'

import { thunkPreSignUp } from '../../store/actions/PreSignUpThunkActions'
import { thunkCreateNewRequest } from '../../../requests/store/actions/RequestsThunkActions'
import Radio from '@material-ui/core/Radio';
import Checkbox from '../../../supplies/supplies-list/managed-by-me/components/checkbox/Checkbox'

const PreSignUpForm = (props: any) => {

  // Callback para cerrar el popup.
  const {
    handleClose,
    searchedUsersLogin,
     user
  } = props

  // Constante para usar los estilos.
  const classes = useStyles({})

  // Función para las traducciones.
  const { t } = useTranslation()

  // Constante para usar el dispatch.
  const dispatch = useDispatch()

 
  const [isCheckboxSelectedEmail, setIsCheckboxSelectedEmail] = useState(false)
  const [isCheckboxSelectedSms, setIsCheckboxSelectedSms] = useState(false)

  // Constante con los datos del usuario, se utiliza el estado.
  const [userData, setUserData] = useState({
    docNumber: searchedUsersLogin === undefined ? user.documentNumber : searchedUsersLogin.document,
    docType: user.documentType,
    name: searchedUsersLogin === undefined ? (user.name ? user.name : '.') : (searchedUsersLogin.name ? searchedUsersLogin.name : '.'),
    surname: searchedUsersLogin === undefined ? (user.surName ? user.surName : '.') : (searchedUsersLogin.surname ? searchedUsersLogin.surname : '.'),
    phone: searchedUsersLogin === undefined ? (user.phone && validateMobileNumber(user.phone) ? user.phone : '') : (searchedUsersLogin.phone && validateMobileNumber(searchedUsersLogin.phone) ? searchedUsersLogin.phone : ''),
    email:  searchedUsersLogin === undefined ? (user.email ? validateMailParam(user.email) ? user.email : '' : ''):(searchedUsersLogin.email ? validateMailParam(searchedUsersLogin.email) ? searchedUsersLogin.email : '' : ''),
    userType: '',
    sendMail: false,
    sendSms: false,
    srCode:'',
    zeusError:''
  })

  // Constante para guardar los errores del formulario, se utiliza el estado.
  const [errors, setErrors] = useState({
    email: false,
    phone: false,
    userType: false
  })

  const [invalidEmail, setInvalidEmail] = useState(false)
  const [invalidPhone, setInvalidPhone] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)
  const [errorCheck, setErrorCheck] = useState(false)
  const [enableButton, setEnableButton] = useState(!isEmpty && !errorCheck)
  const [showForm, setShowForm] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [preRegistroOk, setPreRegistroOk] = useState(false)


  // Comprobar si el formulario esta vacio.
  useEffect(() => {
    Object.keys(userData).filter((key) => userData[key] === '' && (key !== 'srCode' && key !== 'zeusError' ) ).length > 0
      ? setIsEmpty(true)
      : setIsEmpty(false)
    // eslint-disable-next-line
  }, [userData])
  

  // Comprobar si el formulario tiene errores.
  useEffect(() => {
    Object.keys(errors).filter((key) => errors[key]).length > 0
      ? setErrorCheck(true)
      : setErrorCheck(false)
    // eslint-disable-next-line
  }, [errors])

  // Habilitar o deshabilitar el boton de envío al realizar cambios en el formulario.
  useEffect(() => {
    setEnableButton(!isEmpty && !errorCheck)
    // eslint-disable-next-line
  }, [isEmpty, errorCheck])

  // Función para validar el campo e-mail del formulario.
  const validateEmail = async (email) => {
    if (await validateMailParam(email)) {
  
      setInvalidEmail(false)
      setErrors({ ...errors, email: false })
    } else {
      if (email !== '') {
        setInvalidEmail(true)
        setErrors({ ...errors, email: true })
      } else {
        setInvalidEmail(false)
        setErrors({ ...errors, email: true })
      }
    }
  }
  

  // Función para validar el campo teléfono del formulario.
  const validatePhone  = async (phone) => {
    if (await validateMobileNumber(phone)) {
      setInvalidPhone(false)
      setErrors({ ...errors, phone: false })
    } else {
      if (phone !== '') {
        setInvalidPhone(true)
        setErrors({ ...errors, phone: true })
      } else {
        setInvalidPhone(false)
        setErrors({ ...errors, phone: true })
      }
    }
  }

  // Función para actualizar los datos del usuario en el estado con los del formulario.
  const handleData = (e, field) => {
    setUserData({ ...userData, [field]: e.target.value })
  }

  // Controlar texto sms / email / ambos

  const getErrorPreRegister = useCallback(()=>{
    if(userData.sendMail && userData.sendSms) {
      return 'pre-registerBoth.errorPreRegister'
    }
    if(userData.sendMail && !userData.sendSms) {
      return 'pre-register.errorPreRegister'
    }
    return 'preInviteSms.errorPreRegister'
  }, [userData.sendMail, userData.sendSms])

  const getSuccessPreRegister = useCallback(()=>{
    if(userData.sendMail && userData.sendSms) {
      setPreRegistroOk(true)
      return 'pre-registerBoth.successPreRegister'
    }
    if(userData.sendMail && !userData.sendSms) {
      setPreRegistroOk(true)
      return 'pre-register.successPreRegister'
    }
    return 'preInviteSms.successPreRegister'
  }, [userData.sendMail, userData.sendSms])
  

  // Función para controlar el submit del formulario.
  const handleSubmit = () => {

    setIsLoading(true)
    
    dispatch(thunkPreSignUp(userData, (response) => {

      if (!response) {
        let tipology = ''

        if (userData.userType === 'solicitant') {
          tipology = '1070A03'
        } else {
          tipology = '0870A09'
        }

        let data = {
          documentType: userData.docType,
          documentNumber: userData.docNumber,
          name: userData.name,
          surName1: userData.surname,
          email: userData.email,
          landline: userData.phone,
          cellphone: '',
          tipology: tipology,
          subtipology: '',
          cups: '',
          dossierNumber: '',
          comment: '',
          documents: [{
            url: '',
            idDocumentum: '',
            nombreArchivo: '',
            format: '',
            documentType: '',
            documentState: ''
          }]
        } as any

        dispatch(thunkCreateNewRequest(data, (response2) => {
          if(response2.codigoSR!=='' || response2.result.codResult !== '0000'){

            let auxData = {
              docNumber: userData.docNumber,
              docType: userData.docType,
              name: userData.name ? user.name : '.',
              surname: userData.surname ? userData.surname : '.',
              phone: userData.phone ? userData.phone : '' ,
              email: userData.email ? userData.email : '' ,
              userType: userData.userType ? userData.userType :'',
              sendMail: userData.sendMail ? userData.sendMail :'',
              sendSms: userData.sendSms ? userData.sendSms :'',
              srCode: response2.codigoSR ? response2.codigoSR:'',
              zeusError:response2.result.codResult ?response2.result.codResult:''
     
            }as any

            dispatch(thunkPreSignUp(auxData, (response3) => {
              
                           
            }))
            
          }

          if (!response2) {
            // Error crear SR.
            setErrorMessage('Pre-registro realizado pero error al crear SR')
            setIsLoading(false)
          } else {
            setErrorMessage('Pre-registro realizado correctamente')
            setPreRegistroOk(true)
            setIsLoading(false)
          }

        }))
        // Pre-registro ok.
        setErrorMessage(t(getSuccessPreRegister()))
        setIsLoading(false)

      } else {
        // Error pre-registro.
        setErrorMessage(t(getErrorPreRegister()))
        setIsLoading(false)
      }
    }))
    setShowForm(false)
  }

  const closeDialog = () => {
    handleClose()
  }

  const handleClickCheckboxEmail = () => {
    setUserData({
      ...userData,
      sendMail: (!userData.sendMail)
    })
    setIsCheckboxSelectedEmail(!isCheckboxSelectedEmail)
  }

  const handleClickCheckboxSms = () => {
    setUserData({
      ...userData,
      sendSms: (!userData.sendSms)
    })
    setIsCheckboxSelectedSms(!isCheckboxSelectedSms)
  }


  return (
    <>
      <Grid container>

      <Grid container className={classes.preRegister}>
      <Grid item>
      {!preRegistroOk ? (<img src={AlertIcon} alt='Alert Icon' />) : (<img src={OkIcon} alt='Ok Icon' />)}

      
      </Grid>
      </Grid>


    
        {showForm ?
          <>
            <Grid container className='row title'>{t('pre-register.popupTitle')}</Grid>
            <Grid container className='row description'>{t('pre-register.popupDescription')}</Grid>

            <Grid container className={classes.checkboxContainer1}>
              <Grid container className='row description'>{t('pre-register.sendDescription')}</Grid>
              <Grid container className={classes.checkboxContainer}>
                <Grid item className={classes.checkboxBotom}>
                  <Checkbox selected={isCheckboxSelectedEmail} handleClick={handleClickCheckboxEmail}/>
                </Grid>
                <Grid item className={classes.checkboxItem}>
                  <span>{t('pre-register.email')}</span>
                </Grid>
              </Grid>

              <Grid container className={classes.checkboxContainer}>
                <Grid item className={classes.checkboxBotom}>
                  <Checkbox selected={isCheckboxSelectedSms} handleClick={handleClickCheckboxSms}/>
                </Grid>

                <Grid item className={classes.checkboxItem}>
                  <span>{t('pre-register.sms')}</span>
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={5} className={classes.usertype}>
              <Grid item className={classes.infousertype}>
                {t('pre-register.userType')}
              </Grid>
              <RadioGroup onChange={(e) => handleData(e, 'userType')}>
                <Grid item>
                  <FormControlLabel value='solicitant' control={<Radio color='primary' />} label={t('pre-register.solicitant')} />
                  <FormControlLabel value='consumer' control={<Radio color='primary' />} label={t('pre-register.consumer')} />
                </Grid>
              </RadioGroup>
            </Grid>

            <Divider className={classes.divider} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={7}>
                <div className={classes.blue}>{t('pre-register.userName')}</div>
                <div className={classes.value}>{userData.name}</div>
              </Grid>
              <Grid item xs={12} sm={5}>
                <div className={classes.blue}>{t('pre-register.userSurname')}</div>
                <div className={classes.value}>{userData.surname}</div>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={7}>
                <div className={classes.blue}>{t('pre-register.userEmail')}</div>
                <Input
                  fullWidth
                  value={userData.email}
                  onChange={(e) => handleData(e, 'email')}
                  onBlur={(e) => validateEmail(e.target.value)}
                  error={errors.email}
                  helperText={
                    errors.email &&

                    (invalidEmail ?
                      t('pre-register.errorEmail1')
                      :
                      t('pre-register.errorEmail2')
                    )
                  }
                />
              </Grid>

              <Grid item xs={12} sm={5}>
                <div className={classes.blue}>{t('pre-register.userPhone')}</div>
                <Input
                  fullWidth
                  value={userData.phone}
                  onChange={(e) => handleData(e, 'phone')}
                  onBlur={(e) => validatePhone(e.target.value)}
                  error={errors.phone}
                  helperText={
                    errors.phone &&

                    (invalidPhone ?
                      t('pre-register.errorPhone1')
                      :
                      t('pre-register.errorPhone2')
                    )
                  }
                />
              </Grid>
            </Grid>

            <Grid container className='buttons'>
              <Grid item className={classes.button}>
                <Button
                  text={t('pre-register.buttonNo')}
                  color='primary'
                  size='large'
                  variant='outlined'
                  onClick={handleClose}
                />
              </Grid>

              <Grid item className={classes.button}>
                <Button
                  text={t('pre-register.buttonYes')}
                  color='primary'
                  size='large'
                  variant='contained'
                  onClick={handleSubmit}
                  disabled={!enableButton}
                />
              </Grid>
            </Grid>
          </>
          :
          <>
            {
              isLoading &&
              <Spinner fixed={true} />
            }

            <Grid container className='row title'>{errorMessage}</Grid>

            <Grid container className='buttons'>
              <Grid item className={classes.button}>
                <Button
                  text={t('common.buttons.accept')}
                  color='primary'
                  size='large'
                  variant='contained'
                  onClick={closeDialog}
                />
              </Grid>
            </Grid>
          </>
        }
      </Grid>
    </>
  )
}

export default PreSignUpForm
