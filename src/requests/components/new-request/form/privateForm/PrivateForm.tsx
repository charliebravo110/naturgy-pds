import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'

import Input from '../../../../../common/components/input/Input'
import Select from '../../../../../common/components/select/Select'
import { noAccents } from '../../../../../common/lib/FormatLib'
import {
  validateMail,
  validateIdentityCard,
  validateMobileNumber,
}
  from '../../../../../common/lib/ValidationLib'

import useStyles from './PrivateForm.styles'
import ValidateCups from '../validatorCupsCs/ValidateCups'
import ValidateFechas from '../validateFechas/ValidateFechas'

const PrivateForm = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    pvtData,
    setPvtData,
    pvtErrors,
    setPvtErrors
  } = props

  const identityList: any = [
    t('requests.newRequest.form.privateForm.inputs.labels2.installer'),
    t('requests.newRequest.form.privateForm.inputs.labels2.company'),
    t('requests.newRequest.form.privateForm.inputs.labels2.owner'),
    t('requests.newRequest.form.privateForm.inputs.labels2.others')
  ]

  const motiveList: any = [
    t('requests.newRequest.form.privateForm.inputs.motive.electric'),
    t('requests.newRequest.form.privateForm.inputs.motive.test'),
    t('requests.newRequest.form.privateForm.inputs.motive.repair'),
    t('requests.newRequest.form.privateForm.inputs.motive.reform'),
    t('requests.newRequest.form.privateForm.inputs.motive.work')
  ]

  const scopeList: any = [
    t('requests.newRequest.form.privateForm.inputs.scope.cut'),
    t('requests.newRequest.form.privateForm.inputs.scope.discharge'),
    t('requests.newRequest.form.privateForm.inputs.scope.discharge2'),
    t('requests.newRequest.form.privateForm.inputs.scope.proximity'),
    t('requests.newRequest.form.privateForm.inputs.scope.placement'),
    t('requests.newRequest.form.privateForm.inputs.scope.others'),
  ]

  const electricalWorkValues = [
    t('requests.newRequest.form.privateForm.inputs.si'),
    t('requests.newRequest.form.privateForm.inputs.no'),
  ]

  const [identityOption, setIdentityOption] = useState('')
  const [selectMotive, setSelectMotive] = useState('')
  const [selectScope, setSelectScope] = useState('')

  const [optionOthers, setOptionOthers] = useState(false)
  const [scopeOthers, setScopeOthers] = useState(false)

  const handleUpdateErrors = (errors) => {
    setPvtErrors(errors)
  }

  const handleSelectIdentity = (option: any) => {
    setIdentityOption(option)
    setPvtData({ ...pvtData, identity: option })
  }

  const handleOther = (other, field) => {
    setPvtData({ ...pvtData, [field]: other })
  }

  const handleSelectMotive = (motive: any) => {
    setSelectMotive(motive)
    setPvtData({ ...pvtData, requestReason: motive })
  }

  const handleSelectScope = (scope: any) => {
    setSelectScope(scope)
    setPvtData({ ...pvtData, workScope: scope })
  }

  const handleSetData = (e, field) => {
    setPvtData({ ...pvtData, [field]: e.target.value })
  }

  const handleSetDataName = (name, field) => {
    setPvtData({ ...pvtData, [field]: name })
  }

  const validateEmail = (email) => {
    if (!validateMail(email) || (email === '')) {
      setPvtErrors({ ...pvtErrors, mail: true })
    } else {
      setPvtErrors({ ...pvtErrors, mail: false })
    }
  }

  const validateIdentity = (identity) => {
    if (identity !== '') {
      setPvtErrors({ ...pvtErrors, identity: false })
    } else {
      setPvtErrors({ ...pvtErrors, identity: true })
    }
  }

  const validateWorkScope = (workScope) => {
    if (workScope !== '') {
      setPvtErrors({ ...pvtErrors, workScope: false })
    } else {
      setPvtErrors({ ...pvtErrors, workScope: true })
    }
  }

  const validatePhone = (phone, field) => {
    if (validateMobileNumber(phone)) {
      setPvtErrors({ ...pvtErrors, [field]: false })
    } else {
        setPvtErrors({ ...pvtErrors, [field]: true })
    }
  }

  const handleValidateDni = (doc, field) => {
    if (validateIdentityCard(doc)) {
      setPvtErrors({ ...pvtErrors, [field]: false })
    } else {
      setPvtErrors({ ...pvtErrors, [field]: true })
    }
  }

  const handleValidateName = (name, field) => {
    if (name !== '') {
      setPvtErrors({ ...pvtErrors, [field]: false })
    } else {
      setPvtErrors({ ...pvtErrors, [field]: true })
    }
  }

  useEffect(() => {
    if (identityOption === t('requests.newRequest.form.privateForm.inputs.labels2.others')) {
      setOptionOthers(true)
    } else {
      setOptionOthers(false)
    }
  }, [identityOption])

  useEffect(() => {
    if (selectScope === t('requests.newRequest.form.privateForm.inputs.scope.others')) {
      setScopeOthers(true)
    } else {
      setScopeOthers(false)
    }
  }, [selectScope])

  return (
    <div className={classes.container}>
      {/* Datos del solicitante */}
      <div className={classes.description}>
        {t('requests.newRequest.form.privateForm.title1')}
      </div>

      <Grid container className={classes.inputs} spacing={3}>
        <Grid item md={6} sm={12} xs={12}>
          {/*
          *** Nombre y  Apellidos ***
          */}
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>
                {t('requests.newRequest.form.privateForm.inputs.labels.name')}
              </div>
            </Grid>

            <Input
              fullWidth
              value={pvtData.applicantNameAndSurname}
              onChange={(e) => handleSetDataName(noAccents(e.target.value.toUpperCase()), 'applicantNameAndSurname')}
              onBlur={(e) => handleValidateName(e.target.value, 'applicantNameAndSurname')}
              error={pvtErrors.applicantNameAndSurname}
              helperText={pvtErrors.applicantNameAndSurname &&
                t('requests.newRequest.form.privateForm.errors.name')}
            />
          </Grid>
        </Grid>

        {/*  
        *** DNI ***
        */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>
                {t('requests.newRequest.form.privateForm.inputs.labels.dni')}
              </div>
            </Grid>

            <Input
              fullWidth
              value={pvtData.docNumber}
              onChange={(e) => handleSetData(e, 'docNumber')}
              onBlur={(e) => handleValidateDni(e.target.value, 'docNumber')}
              error={pvtErrors.docNumber}
              helperText={pvtErrors.docNumber &&
                t('requests.newRequest.form.privateForm.errors.dni')}
            />
          </Grid>
        </Grid>

        {/*  
        *** Movil *** 
        */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>
                {t('requests.newRequest.form.privateForm.inputs.labels.movil')}
              </div>
            </Grid>

            <Input
              fullWidth
              value={pvtData.phone}
              onChange={(e) => handleSetData(e, 'phone')}
              onBlur={(e) => validatePhone(e.target.value, 'phone')}
              error={pvtErrors.phone}
              helperText={pvtErrors.phone &&
                t('requests.newRequest.form.privateForm.errors.phone')}
            />
          </Grid>
        </Grid>

        {/*  
        *** MAIL *** 
        */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>
                {t('requests.newRequest.form.privateForm.inputs.labels.email')}
              </div>
            </Grid>

            <Input
              fullWidth
              value={pvtData.mail}
              onChange={(e) => handleSetData(e, 'mail')}
              onBlur={(e) => validateEmail(e.target.value)}
              error={pvtErrors.mail}
              helperText={pvtErrors.mail &&
                t('requests.newRequest.form.privateForm.errors.mail')}
            />
          </Grid>
        </Grid>

        {/*  
        *** Realiza la petición en calidad de: *** 
        */}
        <Grid item md={6} sm={12} xs={12} className={classes.inputBlock}>
          <div className={classes.label}>
            {t('requests.newRequest.form.privateForm.title2')}
          </div>

          <Select
            fullWidth
            values={identityList}
            value={identityOption}
            onChange={(e) => handleSelectIdentity(e.target.value)}
          />
        </Grid>

        {optionOthers ?
          <Grid item md={6} sm={12} xs={12} className={classes.inputBlock}>
            <div className={classes.label}>
              {t('requests.newRequest.form.privateForm.inputs.labels2.others')}
            </div>

            <Input
              fullWidth
              onChange={(e) => handleOther(e.target.value, 'identity')}
              onBlur={(e) => validateIdentity(e.target.value)}
              error={pvtErrors.identity}
              helperText={pvtErrors.identity &&
                t('requests.newRequest.form.privateForm.errors.required')}
            />
          </Grid>
          :
          <Grid item md={6} sm={12} xs={12} />
        }

        {/*  
        *** Motivo de la solicitud *** 
        */}
        <div className={classes.description2}>
          {t('requests.newRequest.form.privateForm.title3')}
        </div>

        <Grid item md={12} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>
                {t('requests.newRequest.form.privateForm.inputs.labels.motive')}
              </div>
            </Grid>

            <Select
              fullWidth
              values={motiveList}
              value={selectMotive}
              onChange={(e) => handleSelectMotive(e.target.value)}
            />
          </Grid>
        </Grid>

        {/*  
        *** Descripción de los trabajos que quiere realizar *** 
        */}
        <div className={classes.description2}>
          {t('requests.newRequest.form.privateForm.title4')}
        </div>

        <Grid item md={12} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>
                {t('requests.newRequest.form.privateForm.inputs.labels.description')}
              </div>
            </Grid>

            <Input
              fullWidth
              multiline
              rows='4'
              value={pvtData.workDescription}
              onChange={(e) => handleSetData(e, 'workDescription')}
            />
          </Grid>
        </Grid>

        {/*  
        *** Alcance de los trabajos que nos solicita *** 
        */}
        <div className={classes.description2}>
          {t('requests.newRequest.form.privateForm.title5')}
        </div>

        <Grid item md={12} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>
                {t('requests.newRequest.form.privateForm.inputs.labels.scope')}
              </div>
            </Grid>

            <Select
              fullWidth
              values={scopeList}
              value={selectScope}
              onChange={(e) => handleSelectScope(e.target.value)}
            />
          </Grid>
        </Grid>

        {/*  
        *** OTROS -- Alcance de los trabajos *** 
        */}
        {scopeOthers ?
          <Grid item md={12} sm={12} xs={12} className={classes.inputBlock}>
            <div className={classes.label}>
              {t('requests.newRequest.form.privateForm.inputs.labels.otherRequired')}
            </div>

            <Input
              fullWidth
              onChange={(e) => handleOther(e.target.value, 'workScope')}
              onBlur={(e) => validateWorkScope(e.target.value)}
              error={pvtErrors.workScope}
              helperText={pvtErrors.workScope &&
                t('requests.newRequest.form.privateForm.errors.required')}
            />
          </Grid>
          :
          <Grid item md={12} sm={12} xs={12} />
        }

        {/* 
      *** Observaciones  ***
      */}
        <Grid item md={12} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>
                {t('requests.newRequest.form.privateForm.inputs.labels.observation')}
              </div>
            </Grid>

            <Input
              fullWidth
              multiline
              rows='4'
              value={pvtData && pvtData.workScopeObservations}
              onChange={(e) => handleSetData(e, 'workScopeObservations')}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Empresa que va a realizar los trabajos */}
      <div className={classes.description2}>
        {t('requests.newRequest.form.privateForm.title6')}
      </div>

      {/* Razón social */}
      <Grid container className={classes.inputs} spacing={3}>
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>
                {t('requests.newRequest.form.privateForm.inputs.labels3.company')}
              </div>
            </Grid>

            <Input
              fullWidth
              value={pvtData.businessName}
              onChange={(e) => handleSetDataName(noAccents(e.target.value.toUpperCase()), 'businessName')}
              onBlur={(e) => handleValidateName(e.target.value, 'businessName')}
              error={pvtErrors.businessName}
              helperText={pvtErrors.businessName &&
                t('requests.newRequest.form.privateForm.errors.required')}
            />
          </Grid>
        </Grid>

        {/* NIF/CIF */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>
                {t('requests.newRequest.form.privateForm.inputs.labels3.nif')}
              </div>
            </Grid>

            <Input
              fullWidth
              value={pvtData.businessDocNum}
              onChange={(e) => handleSetData(e, 'businessDocNum')}
              onBlur={(e) => handleValidateDni(e.target.value, 'businessDocNum')}
              error={pvtErrors.businessDocNum}
              helperText={pvtErrors.businessDocNum &&
                t('requests.newRequest.form.privateForm.errors.dni')}
            />
          </Grid>
        </Grid>

        {/* Trabajo eléctrico SI/NO */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>
                {t('requests.newRequest.form.privateForm.inputs.labels3.work')}
              </div>
            </Grid>

            <Select
              fullWidth
              label={''}
              value={pvtData.businessElectricalWork}
              values={electricalWorkValues}
              onChange={(e) => handleSetData(e, 'businessElectricalWork')}
            />
          </Grid>
        </Grid>

        {/*
        *** Número de registro de empresa autorizada ***
        *** esto en caso de que la opción anterior sea Sí ***
        */}
        {pvtData.businessElectricalWork === t('requests.newRequest.form.privateForm.inputs.si') ?
          <Grid item md={6} sm={12} xs={12}>
            <Grid container direction='column'>
              <Grid item>
                <div className={classes.label}>
                  {t('requests.newRequest.form.privateForm.inputs.labels3.registry')}
                </div>
              </Grid>

              <Input
                fullWidth
                value={pvtData.businessRegistryNum}
                onChange={(e) => handleSetData(e, 'businessRegistryNum')}
              />
            </Grid>
          </Grid>
          :
          <Grid item md={6} sm={12} xs={12} />
        }

        {/* 
        *** Jefe de trabajos / Persona de contacto ***
        */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>
                {t('requests.newRequest.form.privateForm.inputs.labels3.contactPerson')}
              </div>
            </Grid>

            <Input
              fullWidth
              value={pvtData.businessContactPerson}
              onChange={(e) => handleSetDataName(noAccents(e.target.value.toUpperCase()), 'businessContactPerson')}
              onBlur={(e) => handleValidateName(e.target.value, 'businessContactPerson')}
              error={pvtErrors.businessContactPerson}
              helperText={pvtErrors.businessContactPerson &&
                t('requests.newRequest.form.privateForm.errors.required')}
            />
          </Grid>
        </Grid>

        {/* Teléfono móvil */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>
                {t('requests.newRequest.form.privateForm.inputs.labels3.movil')}
              </div>
            </Grid>

            <Input
              fullWidth
              value={pvtData.businessContactPhoneNum}
              onChange={(e) => handleSetData(e, 'businessContactPhoneNum')}
              onBlur={(e) => validatePhone(e.target.value, 'businessContactPhoneNum')}
              error={pvtErrors.businessContactPhoneNum}
              helperText={pvtErrors.businessContactPhoneNum &&
                (pvtData.businessContactPhoneNum === '' ?
                  t('requests.newRequest.form.privateForm.errors.required')
                  :
                  t('requests.newRequest.form.privateForm.errors.phone'))
              }
            />
          </Grid>
        </Grid>
      </Grid>

      <ValidateCups
        pvtData={pvtData}
        setPvtData={setPvtData}
        pvtErrors={pvtErrors}
        handleUpdateErrors={handleUpdateErrors}
      />

      <ValidateFechas
        pvtData={pvtData}
        setPvtData={setPvtData}
        pvtErrors={pvtErrors}
        handleUpdateErrors={handleUpdateErrors}
      />

    </div>
  )
}

export default PrivateForm
