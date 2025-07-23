import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import Checkbox from '../../../../../common/components/checkbox/Checkbox'
import Button from '../../../../../common/components/button/Button'
import Input from '../../../../../common/components/input/Input'
import TextButton from '../../../../../common/components/text-button/TextButton'
import Spinner from '../../../../../common/components/spinner/Spinner'

import CloseIcon from '../../../../../assets/icons/cerrar.svg'

import {
  validateIdentityCard,
  validateMail,
  validateCupsNumber,
  checkDocumentTypeInString
} from '../../../../../common/lib/ValidationLib'
import { thunkCreateWarning } from '../../../store/actions/SuppliesDetailsThunkActions'

import useStyles from './Content.styles'

const Content = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    handleReturn,
    supplyData,
    user,
    setShowingStormWarningSuccessDialog,
    setStormWarningSrCode
  } = props

  const getDefaultStormWarningData = (): any => {
    return {
      documentType: user.documentType,
      document: user.documentNumber,
      name: user.name || '',
      surname: user.surName || '',
      cups: supplyData.cups || '',
      // postalCode: (supplyData.address && supplyData.address.zipCode) ? supplyData.address.zipCode : '',
      email: user.email,
      phone: user.phone
    }
  }

  const getDefaultStormWarningErrors = (): any => {
    return {
      document: { bool: false, msg: '' },
      name: { bool: false, msg: '' },
      surname: { bool: false, msg: '' },
      email: { bool: false, msg: '' },
      phone: { bool: false, msg: '' }
    }
  }

  // questions
  const [ stairHaveLight, setStairHaveLight ] = useState(false)
  const [ elevatorHaveLight, setElevatorHaveLight ] = useState(false)
  const [ streetHaveLight, setStreetHaveLight ] = useState(false)

  const [ stormWarningData, setStormWarningData ] = useState(getDefaultStormWarningData())
  const [ stormWarningErrors, setStormWarningErrors ] = useState(getDefaultStormWarningErrors())
  const [ isEmpty, setIsEmpty ] = useState(false)
  const [ errorCheck, setErrorCheck ] = useState(false)
  const [ enableButton, setEnableButton ] = useState(!isEmpty && !errorCheck)
  const [ isLoading, setIsLoading ] = useState(false)

  // Comprobar si el formulario tiene errores
  useEffect(
    () => {
      Object.keys(stormWarningErrors).filter((key) => stormWarningErrors[key].bool).length > 0
        ? setErrorCheck(true)
        : setErrorCheck(false)
      // eslint-disable-next-line
    },
    [ stormWarningErrors ]
  )

  // Comprobar si el formulario esta vacio
  useEffect(
    () => {
      Object.keys(stormWarningData).filter((key) => stormWarningData[key] === '').length > 0
        ? setIsEmpty(true)
        : setIsEmpty(false)
      // eslint-disable-next-line
    },
    [ stormWarningData ]
  )

  // Habilitar o deshabilitar el boton de envío al realizar cambios en el formulario
  useEffect(() => {
    setEnableButton(!isEmpty && !errorCheck)

    // eslint-disable-next-line
  }, [ isEmpty, errorCheck ])

  const handleDocumentNumber = (document) => {
    checkDocumentNumber(document)

    setStormWarningData({ ...stormWarningData, document, documentType: checkDocumentTypeInString(document) })
  }

  const handleName = (name) => {
    checkName(name)

    setStormWarningData({ ...stormWarningData, name })
  }

  const handleSurname = (surname) => {
    checkSurname(surname)

    setStormWarningData({ ...stormWarningData, surname })
  }

  const handlePostalCode = (postalCode) => {
    let aux = stormWarningData as any

    if (postalCode !== '') {
      delete aux.cups
    }

    setStormWarningErrors({ ...stormWarningErrors, cups: { bool: false, msg: '' } })

    checkPostalCode(postalCode)

    setStormWarningData({ ...aux, postalCode })
  }

  const handleCups = (cups) => {
    let aux = stormWarningData as any

    if (cups !== '') {
      delete aux.postalCode
    }

    setStormWarningErrors({ ...stormWarningErrors, postalCode: { bool: false, msg: '' } })

    checkCups(cups)

    setStormWarningData({ ...aux, cups })
  }

  const handleEmail = (email) => {
    checkEmail(email)

    setStormWarningData({ ...stormWarningData, email })
  }

  const handlePhone = (phone) => {
    checkPhone(phone)

    setStormWarningData({ ...stormWarningData, phone })
  }

  const checkDocumentNumber = (document) => {
    if (document === '' || !document) {
      setStormWarningErrors({ ...stormWarningErrors, document: { bool: true, msg: t('supplies.suppliesDetails.components.stormWarningDialog.errors.required') } })
    } else if (!validateIdentityCard(document)) {
      setStormWarningErrors({ ...stormWarningErrors, document: { bool: true, msg: t('supplies.suppliesDetails.components.stormWarningDialog.errors.invalid') } })
    } else {
      setStormWarningErrors({ ...stormWarningErrors, document: { bool: false, msg: '' } })
    }
  }

  const checkName = (name) => {
    if (name === '' || !name) {
      setStormWarningErrors({ ...stormWarningErrors, name: { bool: true, msg: t('supplies.suppliesDetails.components.stormWarningDialog.errors.required') } })
    } else {
      setStormWarningErrors({ ...stormWarningErrors, name: { bool: false, msg: '' } })
    }
  }

  const checkSurname = (surname) => {
    if (surname === '' || !surname) {
      setStormWarningErrors({ ...stormWarningErrors, surname: { bool: true, msg: t('supplies.suppliesDetails.components.stormWarningDialog.errors.required') } })
    } else {
      setStormWarningErrors({ ...stormWarningErrors, surname: { bool: false, msg: '' } })
    }
  }

  const checkPostalCode = (postalCode) => {
    if (postalCode === '' || !postalCode) {
      setStormWarningErrors({ ...stormWarningErrors, postalCode: { bool: false, msg: '' } })
    } else if (isNaN(postalCode) || postalCode.length !== 5) {
      setStormWarningErrors({ ...stormWarningErrors, postalCode: { bool: true, msg: t('supplies.suppliesDetails.components.stormWarningDialog.errors.invalid') } })
    } else {
      setStormWarningErrors({ ...stormWarningErrors, postalCode: { bool: false, msg: '' } })
    }
  }

  const checkCups = (cups) => {
    if (cups === '' || !cups) {
      setStormWarningErrors({ ...stormWarningErrors, cups: { bool: false, msg: '' } })
    } else if (!validateCupsNumber(cups)) {
      setStormWarningErrors({ ...stormWarningErrors, cups: { bool: true, msg: t('supplies.suppliesDetails.components.stormWarningDialog.errors.invalid') } })
    } else {
      setStormWarningErrors({ ...stormWarningErrors, cups: { bool: false, msg: '' } })
    }
  }

  const checkEmail = (email) => {
    if (email === '' || !email) {
      setStormWarningErrors({ ...stormWarningErrors, email: { bool: true, msg: t('supplies.suppliesDetails.components.stormWarningDialog.errors.required') } })
    } else if (!validateMail(email)) {
      setStormWarningErrors({ ...stormWarningErrors, email: { bool: true, msg: t('supplies.suppliesDetails.components.stormWarningDialog.errors.invalid') } })
    } else {
      setStormWarningErrors({ ...stormWarningErrors, email: { bool: false, msg: '' } })
    }
  }

  const checkPhone = (phone) => {
    if (phone === '' || !phone) {
      setStormWarningErrors({ ...stormWarningErrors, phone: { bool: true, msg: t('supplies.suppliesDetails.components.stormWarningDialog.errors.required') } })
    } else if (isNaN(phone) || phone.length !== 9) {
      setStormWarningErrors({ ...stormWarningErrors, phone: { bool: true, msg: t('supplies.suppliesDetails.components.stormWarningDialog.errors.invalid') } })
    } else {
      setStormWarningErrors({ ...stormWarningErrors, phone: { bool: false, msg: '' } })
    }
  }

  const handleSend = () => {
    setIsLoading(true)

    let scope:number = 0

    if (stairHaveLight) {
      scope = 1
    } else {
      if (elevatorHaveLight) {
        scope = 2
      } else {
        if (streetHaveLight) {
          scope = 3
        } else {
          scope = 4
        }
      }
    }

    let data = {
      ...stormWarningData,
      alcance: scope,
      province: (supplyData.address && supplyData.address.province) ? supplyData.address.province : '',
      language: (sessionStorage.getItem('lang') || 'ES').toUpperCase()
    }

    if (data.cups && data.cups.length === 20) {
      data = {
        ...data,
        cups: data.cups + '1P'
      }
    }

    dispatch(thunkCreateWarning(data, (response) => {
      if (response && response.result && response.result.codResult === '0000') {
        setStormWarningSrCode(response.codigoSR)

        setShowingStormWarningSuccessDialog(true)
      }

      setIsLoading(false)

      handleReturn()
    }))
  }

  return (
    <Grid container className={classes.container} justifyContent='center'>
      {
        isLoading &&
          <Spinner fixed />
      }

      <Grid container justifyContent='flex-end'>
        <TextButton className={classes.closeButton} onClick={handleReturn}>
          <img src={CloseIcon} alt='' />
        </TextButton>
      </Grid>

      <Grid container spacing={2}>
        <Grid container item direction='column' md={12} className={classes.inputContainer}>
          <Grid item className={classes.label}>{t('supplies.suppliesDetails.components.stormWarningDialog.checks.label')}</Grid>

          <Grid item className={classes.input}>
            <div className={classes.checks}>
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={stairHaveLight}
                      onChange={() => setStairHaveLight(!stairHaveLight)}
                      value='1'
                      color='primary'
                    />
                  }
                  label={
                    <div className={classes.questionText}>
                      {t('supplies.suppliesDetails.components.stormWarningDialog.checks.questions.one')}
                    </div>
                  }
                />
              </div>

              <div className={classes.marginedCheck}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={elevatorHaveLight}
                      onChange={() => setElevatorHaveLight(!elevatorHaveLight)}
                      value='1'
                      color='primary'
                    />
                  }
                  label={
                    <div className={classes.questionText}>
                      {t('supplies.suppliesDetails.components.stormWarningDialog.checks.questions.two')}
                    </div>
                  }
                />
              </div>

              <div className={classes.marginedCheck}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={streetHaveLight}
                      onChange={() => setStreetHaveLight(!streetHaveLight)}
                      value='1'
                      color='primary'
                    />
                  }
                  label={
                    <div className={classes.questionText}>
                      {t('supplies.suppliesDetails.components.stormWarningDialog.checks.questions.three')}
                    </div>
                  }
                />
              </div>
            </div>
          </Grid>
        </Grid>

        <Grid container item direction='column' md={12} className={classes.inputContainer}>
          <Grid item className={classes.label}>{t('supplies.suppliesDetails.components.stormWarningDialog.document')}</Grid>

          <Grid item className={classes.input}>
            <Input
              fullWidth
              onChange={(e) => handleDocumentNumber(e.target.value)}
              onBlur={(e) => checkDocumentNumber(e.target.value)}
              value={stormWarningData.document}
              error={stormWarningErrors.document && stormWarningErrors.document.bool}
              helperText={stormWarningErrors.document && stormWarningErrors.document.msg}
              inputProps={{
                readOnly: true,
                maxLength: 10
              }}
            />
          </Grid>
        </Grid>

        <Grid container item direction='column' md={12} className={classes.inputContainer}>
          <Grid item className={classes.label}>{t('supplies.suppliesDetails.components.stormWarningDialog.name')}</Grid>

          <Grid item className={classes.input}>
            <Input
              fullWidth
              onChange={(e) => handleName(e.target.value)}
              onBlur={(e) => checkName(e.target.value)}
              value={stormWarningData.name}
              error={stormWarningErrors.name && stormWarningErrors.name.bool}
              helperText={stormWarningErrors.name && stormWarningErrors.name.msg}
            />
          </Grid>
        </Grid>

        <Grid container item direction='column' md={12} className={classes.inputContainer}>
          <Grid item className={classes.label}>{t('supplies.suppliesDetails.components.stormWarningDialog.surname')}</Grid>

          <Grid item className={classes.input}>
            <Input
              fullWidth
              onChange={(e) => handleSurname(e.target.value)}
              onBlur={(e) => checkSurname(e.target.value)}
              value={stormWarningData.surname}
              error={stormWarningErrors.surname && stormWarningErrors.surname.bool}
              helperText={stormWarningErrors.surname && stormWarningErrors.surname.msg}
            />
          </Grid>
        </Grid>

        <Grid container item direction='column' spacing={2} md={12} className={classes.inputContainerBordered}>
          <Grid container item direction='column' md={12} className={classes.inputContainer}>
            <Grid item className={classes.label}>{t('supplies.suppliesDetails.components.stormWarningDialog.postalCode')}</Grid>

            <Grid item className={classes.input}>
              <Input
                fullWidth
                onChange={(e) => handlePostalCode(e.target.value)}
                onBlur={(e) => checkPostalCode(e.target.value)}
                value={stormWarningData.postalCode || ''}
                error={stormWarningErrors.postalCode && stormWarningErrors.postalCode.bool}
                helperText={stormWarningErrors.postalCode && stormWarningErrors.postalCode.msg}
                inputProps={{
                  maxLength: 5
                }}
                disabled={(stormWarningData.cups && stormWarningData.cups !== '') || false}
              />
            </Grid>
          </Grid>

          <Grid container item direction='column' md={12} className={classes.inputContainer}>
            <Grid item className={classes.label}>{t('supplies.suppliesDetails.components.stormWarningDialog.cups')}</Grid>

            <Grid item className={classes.input}>
              <Input
                fullWidth
                onChange={(e) => handleCups(e.target.value)}
                onBlur={(e) => checkCups(e.target.value)}
                value={stormWarningData.cups || ''}
                error={stormWarningErrors.cups && stormWarningErrors.cups.bool}
                helperText={stormWarningErrors.cups && stormWarningErrors.cups.msg}
                inputProps={{
                  maxLength: 22
                }}
                disabled={(stormWarningData.postalCode && stormWarningData.postalCode !== '') || false}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid container item direction='column' md={12} className={classes.inputContainer}>
          <Grid item className={classes.label}>{t('supplies.suppliesDetails.components.stormWarningDialog.email')}</Grid>

          <Grid item className={classes.input}>
            <Input
              fullWidth
              onChange={(e) => handleEmail(e.target.value)}
              onBlur={(e) => checkEmail(e.target.value)}
              value={stormWarningData.email}
              error={stormWarningErrors.email && stormWarningErrors.email.bool}
              helperText={stormWarningErrors.email && stormWarningErrors.email.msg}
            />
          </Grid>
        </Grid>

        <Grid container item direction='column' md={12} className={classes.inputContainer}>
          <Grid item className={classes.label}>{t('supplies.suppliesDetails.components.stormWarningDialog.phone')}</Grid>

          <Grid item className={classes.input}>
            <Input
              fullWidth
              onChange={(e) => handlePhone(e.target.value)}
              onBlur={(e) => checkPhone(e.target.value)}
              value={stormWarningData.phone}
              error={stormWarningErrors.phone && stormWarningErrors.phone.bool}
              helperText={stormWarningErrors.phone && stormWarningErrors.phone.msg}
              inputProps={{
                maxLength: 9
              }}
            />
          </Grid>
        </Grid>

        <Grid container className={classes.buttonContainer}>
          <Grid item>
            <Button
              text={t('common.buttons.communicate')}
              color='primary'
              size='large'
              variant='contained'
              disabled={!enableButton}
              onClick={handleSend}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Content
