import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import Input from '../../../../../common/components/input/Input'

import { validateMail, validateMobileNumber } from '../../../../../common/lib/ValidationLib'

import useStyles from './SmallPersonData.styles'

const SmallPersonData = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { setIsEmpty, setErrorCheck, readOnly, updateStateFunction } = props

  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)

  const [ personData, setPersonData ] = useState({
    name: '',
    surname1: '',
    valuePhone1: '',
    valueEmail: ''
  } as any)

  const [ errors, setErrors ] = useState({
    name: false,
    surname1: false,
    valuePhone1: false,
    valueEmail: false
  } as any)

  const [ invalidPhone, setInvalidPhone ] = useState(false)
  const [ invalidEmail, setInvalidEmail ] = useState(false)

  const setErrorsAndUpdate = (data) => {
    setErrors(data)

    dispatch(updateStateFunction({
      ...personData
    }))
  }

  useEffect(() => {
    dispatch(updateStateFunction({
      ...personData
    }))
  // eslint-disable-next-line
  }, [ personData ])

  // Si hay una provision vigente se cargan los datos en el formulario
  useEffect(() => {
    if (currentProvision && currentProvision.dossierCod) {
      setPersonData(currentProvision.contactList[0])
    }
  // eslint-disable-next-line
  }, [ currentProvision ])

  // Comprobar si el formulario tiene errores
  useEffect(() => {
    Object.keys(errors).filter((key) => errors[key]).length > 0 ?
      setErrorCheck(true)
    :
      setErrorCheck(false)
  // eslint-disable-next-line
  }, [ errors ])

  // Comprobar si el formulario esta vacio
  useEffect(() => {
    Object.keys(personData).filter((key) => personData[key] === '').length > 0 ?
      setIsEmpty(true)
    :
      setIsEmpty(false)
  // eslint-disable-next-line
  }, [ personData ])

  const handleName = (e) => {
    setPersonData({
      ...personData,
      name: e.target.value
    })
  }

  const handleSurname = (e) => {
    setPersonData({
      ...personData,
      surname1: e.target.value
    })
  }

  const handleTelephone = (e) => {
    setPersonData({
      ...personData,
      valuePhone1: e.target.value
    })
  }

  const handleEmail = (e) => {
    setPersonData({
      ...personData,
      valueEmail: e.target.value
    })
  }

  const validatePhone = (e) => {
    if (validateMobileNumber(e.target.value)) {
      setInvalidPhone(false)

      setErrorsAndUpdate({
        ...errors,
        valuePhone1: false
      })
    } else {
      if (e.target.value !== '') {
        setInvalidPhone(true)
      } else {
        setInvalidPhone(false)
      }

      setErrorsAndUpdate({
        ...errors,
        valuePhone1: true
      })
    }
  }

  const validateEmail = (e) => {
    if (validateMail(e.target.value)) {
      setInvalidEmail(false)

      setErrorsAndUpdate({
        ...errors,
        valueEmail: false
      })
    } else {
      if (e.target.value !== '') {
        setInvalidEmail(true)
      } else {
        setInvalidEmail(false)
      }

      setErrorsAndUpdate({
        ...errors,
        valueEmail: true
      })
    }
  }

  return (
    <Grid container justifyContent='space-between' spacing={3}>
      <Grid container item direction='column' xs={12} sm={6} className={classes.inputContainer}>
        <Grid item className={classes.label}>
          <Typography>
            {t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.name')}
          </Typography>
        </Grid>

        <Grid item className={classes.input}>
          {
            readOnly ?
              <Typography className={classes.stateLabel}>{personData.name}</Typography>
            :
              <Input
                fullWidth
                value={personData.name}
                onChange={handleName}
                onBlur={(e) => {
                  e.target.value === '' ?
                    setErrorsAndUpdate({
                      ...errors,
                      name: true
                    })
                  :
                    setErrorsAndUpdate({
                      ...errors,
                      name: false
                    })
                }}
                error={errors.name}
                helperText={errors.name && t('provisions.newProvision.requestData.supplyType.form.errors.required')}
              />
          }
        </Grid>
      </Grid>

      <Grid container item direction='column' xs={12} sm={6} className={classes.inputContainer}>
        <Grid item className={classes.label}>
          <Typography>
            {t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.surnames2')}
          </Typography>
        </Grid>

        <Grid item className={classes.input}>
          {
            readOnly ?
              <Typography className={classes.stateLabel}>{personData.surname1}</Typography>
            :
              <Input
                fullWidth
                value={personData.surname1}
                onChange={handleSurname}
                onBlur={(e) => {
                  e.target.value === '' ?
                    setErrorsAndUpdate({
                      ...errors,
                      surname1: true
                    })
                  :
                    setErrorsAndUpdate({
                      ...errors,
                      surname1: false
                    })
                }}
                error={errors.surname1}
                helperText={errors.surname1 && t('provisions.newProvision.requestData.supplyType.form.errors.required')}
              />
          }
        </Grid>
      </Grid>

      <Grid container item direction='column' xs={12} sm={6} className={classes.inputContainer}>
        <Grid item className={classes.label}>
          <Typography>
            {t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.phone')}
          </Typography>
        </Grid>

        <Grid item className={classes.input}>
          {
            readOnly ?
              <Typography className={classes.stateLabel}>{personData.valuePhone1}</Typography>
            :
              <Input
                fullWidth
                value={personData.valuePhone1}
                onChange={handleTelephone}
                onBlur={validatePhone}
                error={errors.valuePhone1}
                helperText={
                  errors.valuePhone1 && (
                    invalidPhone ?
                      t('provisions.newProvision.requestData.supplyType.form.errors.invalidPhone')
                    :
                      t('provisions.newProvision.requestData.supplyType.form.errors.required')
                  )
                }
              />
          }
        </Grid>
      </Grid>

      <Grid container item direction='column' xs={12} sm={6} className={classes.inputContainer}>
        <Grid item className={classes.label}>
          <Typography>
            {t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.email')}
          </Typography>
        </Grid>

        <Grid item className={classes.input}>
          {
            readOnly ?
              <Typography className={classes.stateLabel}>{personData.valueEmail}</Typography>
            :
              <Input
                fullWidth
                value={personData.valueEmail}
                onChange={handleEmail}
                onBlur={validateEmail}
                error={errors.valueEmail}
                helperText={errors.valueEmail &&
                  (invalidEmail ?
                    t('provisions.newProvision.requestData.supplyType.form.errors.invalidEmail')
                  :
                    t('provisions.newProvision.requestData.supplyType.form.errors.required'))}
              />
          }
        </Grid>
      </Grid>
    </Grid>
  )
}

export default SmallPersonData
