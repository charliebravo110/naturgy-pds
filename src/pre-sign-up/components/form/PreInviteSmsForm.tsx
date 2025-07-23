import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { Divider, FormControlLabel, Grid, RadioGroup } from '@material-ui/core'
import Input from '../../../common/components/input/Input'
import Button from '../../../common/components/button/Button'
import Spinner from '../../../common/components/spinner/Spinner'

import useStyles from './PreSignUpForm.styles'

import { validateMail, validateMobileNumber } from '../../../common/lib/ValidationLib'

import { thunkPreSignUp } from '../../store/actions/PreSignUpThunkActions'
import { thunkCreateNewRequest } from '../../../requests/store/actions/RequestsThunkActions'
import Radio from '@material-ui/core/Radio';
import Checkbox from '../../../supplies/supplies-list/managed-by-me/components/checkbox/Checkbox'

const PreInviteSmsForm = (props: any) => {

  // Callback para cerrar el popup.
  const {
    handleClose,
    user, 
    searchedUsersLogin
  } = props

  // Constante para usar los estilos.
  const classes = useStyles({})

  // Función para las traducciones.
  const { t } = useTranslation()

  // Constante para usar el dispatch.
  const dispatch = useDispatch()

  const [isCheckboxSelectedSms, setIsCheckboxSelectedSms] = useState(true)

  // Constante con los datos del usuario, se utiliza el estado.
  const [userData, setUserData] = useState({
    docNumber: searchedUsersLogin === undefined ? user.documentNumber : searchedUsersLogin.documentNumber,
    docType: searchedUsersLogin === undefined ? user.documentType : searchedUsersLogin.documentType,
    name: searchedUsersLogin === undefined ? (user.name ? user.name : '.') : (searchedUsersLogin.name ? searchedUsersLogin.name : '.'),
    surname: searchedUsersLogin === undefined ? (user.surName ? user.surName : '.') : (searchedUsersLogin.surname ? searchedUsersLogin.surname : '.'),
    phone: searchedUsersLogin === undefined ? (user.phone && validateMobileNumber(user.phone) ? user.phone : '') : (searchedUsersLogin.phone && validateMobileNumber(searchedUsersLogin.phone) ? searchedUsersLogin.phone : ''),
    userType: '',
    sendMail: false,
    sendSms: true
  });

  // Constante para guardar los errores del formulario, se utiliza el estado.
  const [errors, setErrors] = useState({
    phone: false,
    userType: false
  })

  const [invalidPhone, setInvalidPhone] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)
  const [errorCheck, setErrorCheck] = useState(false)
  const [enableButton, setEnableButton] = useState(!isEmpty && !errorCheck)
  const [showForm, setShowForm] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Comprobar si el formulario esta vacio.
  useEffect(() => {
    Object.keys(userData).filter((key) => userData[key] === '').length > 0
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

  // Función para validar el campo teléfono del formulario.
  const validatePhone = (phone) => {
    if (validateMobileNumber(phone)) {
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
          //email: userData.email,
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

          if (!response2) {
            // Error crear SR.
            setErrorMessage(t('preInviteSms.errorPreInviteSms'))
            setIsLoading(false)
          } else {
            setErrorMessage(t('preInviteSms.successPreInviteSms'))
            setIsLoading(false)
          }

        }))
        // Pre-registro ok.
        setErrorMessage(t('pre-register.successPreRegister'))
        setIsLoading(false)

      } else {
        // Error pre-registro.
        setErrorMessage(t('pre-register.errorPreRegister'))
        setIsLoading(false)
      }
    }))
    setShowForm(false)
  }

  const closeDialog = () => {
    handleClose()
  }

  return (
    <>
      <Grid container>
        {showForm ?
          <>
            <Grid container className='row title'>{t('preInviteSms.popupTitle')}</Grid>
            <Grid container className='row description'>{t('preInviteSms.popupDescription')}</Grid>

            <Grid container className={classes.checkboxContainer1}>
              <Grid container className='row description'>{t('preInviteSms.sendDescription')}</Grid>

              <Grid container className={classes.checkboxContainer}>
                <Grid item className={classes.checkboxBotom}>
                  <Checkbox
                    selected={isCheckboxSelectedSms}
                    disabled={true}
                  />
                </Grid>

                <Grid item className={classes.checkboxItem}>
                  <span>{t('preInviteSms.sms')}</span>
                </Grid>
              </Grid>

            </Grid>

            <Grid container spacing={5} className={classes.usertype}>
              <Grid item className={classes.infousertype}>
                {t('preInviteSms.userType')}
              </Grid>
              <RadioGroup onChange={(e) => handleData(e, 'userType')}>
                <Grid item>
                  <FormControlLabel value='solicitant' control={<Radio color='primary' />} label={t('preInviteSms.solicitant')} />
                  <FormControlLabel value='consumer' control={<Radio color='primary' />} label={t('preInviteSms.consumer')} />
                </Grid>
              </RadioGroup>
            </Grid>

            <Divider className={classes.divider} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <div className={classes.blue}>{t('preInviteSms.userName')}</div>
                <div className={classes.value}>{userData.name}</div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className={classes.blue}>{t('preInviteSms.userSurname')}</div>
                <div className={classes.value}>{userData.surname}</div>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} />

              <Grid item xs={12} sm={5}>
                <div className={classes.blue}>{t('preInviteSms.userPhone')}</div>
                <Input
                  fullWidth
                  value={userData.phone}
                  onChange={(e) => handleData(e, 'phone')}
                  onBlur={(e) => validatePhone(e.target.value)}
                  error={errors.phone}
                  helperText={
                    errors.phone &&

                    (invalidPhone ?
                      t('preInviteSms.errorPhone1')
                      :
                      t('preInviteSms.errorPhone2')
                    )
                  }
                />
              </Grid>
            </Grid>

            <Grid container className='buttons'>
              <Grid item className={classes.button}>
                <Button
                  text={t('preInviteSms.buttonNo')}
                  color='primary'
                  size='large'
                  variant='outlined'
                  onClick={handleClose}
                />
              </Grid>

              <Grid item className={classes.button}>
                <Button
                  text={t('preInviteSms.buttonYes')}
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

export default PreInviteSmsForm
