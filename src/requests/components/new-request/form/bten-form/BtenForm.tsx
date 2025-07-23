import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Input from '../../../../../common/components/input/Input'
import Select from '../../../../../common/components/select/Select'
import DatepickerV2 from '../../../../../common/components/datepickerV2/DatepickerV2'

import { thunkListSupplies } from '../../../../../supplies/supplies-list/store/actions/SuppliesListThunkActions'

import { validateNIF, validateCIF, validateMail, validateMobileNumber} from '../../../../../common/lib/ValidationLib'
import { noAccents, formatDate } from '../../../../../common/lib/FormatLib'

import useStyles from './BtenForm.styles'

const BtenForm = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const user = useSelector((state: any) => state.user)

  const {
    btenData,
    setBtenData,
    btenErrors,
    setBtenErrors
  } = props

  const [ identitySelector, setIdentitySelector] = useState('')
  const [ scopeSelector, setScopeSelector] = useState('')
  const [ auxStartDate, setAuxStartDate ] = useState()
  const [ auxEndDate, setAuxEndDate ] = useState()
  const [ startTime, setStartTime ] = useState('')
  const [ endTime, setEndTime ] = useState('')
  const [ loadingCupsList, setLoadingCupsList ] = useState(false)
  const [ cupsList, setCupsList ] = useState([] as any)

  const today = new Date()
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15)

  const identityValues = [
    t('requests.newRequest.form.btenForm.inputs.select1.option1'),
    t('requests.newRequest.form.btenForm.inputs.select1.option2'),
    t('requests.newRequest.form.btenForm.inputs.select1.option3'),
    t('requests.newRequest.form.btenForm.inputs.select1.option4')
  ]

  const requestReasonValues = [
    t('requests.newRequest.form.btenForm.inputs.select2.option1'),
    t('requests.newRequest.form.btenForm.inputs.select2.option2'),
    t('requests.newRequest.form.btenForm.inputs.select2.option3'),
    t('requests.newRequest.form.btenForm.inputs.select2.option4')
  ]

  const scopeValues = [
    t('requests.newRequest.form.btenForm.inputs.select3.option1'),
    t('requests.newRequest.form.btenForm.inputs.select3.option2'),
    t('requests.newRequest.form.btenForm.inputs.select3.option3')
  ]

  const electricalWorkValues = [
    t('requests.newRequest.form.btenForm.inputs.select4.option1'),
    t('requests.newRequest.form.btenForm.inputs.select4.option2')
  ]  

  const handleUpdateErrors = (errors) => {
    setBtenErrors(errors)
  }

  const getFifteenDaysFromDate = (beginDate) => {
    const fifteenDaysFromDate = new Date(beginDate)
    fifteenDaysFromDate.setDate(fifteenDaysFromDate.getDate() + 15)
    return fifteenDaysFromDate
  }

  const validateTime = (time) => {
    let isValid = false
    
    if (time !== '') {
      const timeArray = time.split('')

      if (timeArray[2] === ':') {
        const hours = time.split(':')[0]
        const minutes = time.split(':')[1]

        const hoursIsNum =  /^\d+$/.test(hours) // Devuelve true si 'hours' sólo contiene números
        const minutesIsNum = /^\d+$/.test(minutes)  // Devuelve true si 'minutes' sólo contiene números

        if (hours !== '' && hoursIsNum && minutes !== '' && minutesIsNum) {

          if (parseInt(hours) >= 0 && parseInt(hours) <= 23 && parseInt(minutes) >= 0 && parseInt(minutes) < 60) {

            if (hours.length === 2 && minutes.length === 2 && time.length === 5) {
              isValid = true
            }
          }
        }
      }
    }

    return isValid    
  }

  const onlyHasLetters = (text) => {
    const letters = /^[A-Za-z][A-Za-z\s]*$/
    return text.match(letters) ? true : false
  }

  useEffect(() => {
    if (auxStartDate) {
      btenData.startdDate = formatDate(auxStartDate)

      setAuxEndDate(null)
    }
  }, [auxStartDate])

  useEffect(() => {
    if (auxEndDate) {
      btenData.endDate = formatDate(auxEndDate)
    } else {
      btenData.endDate = ''
    }
  }, [auxEndDate])

  useEffect(() => {
    if (user.token !== '' && user.profile.documentNumber) {
      if (cupsList.length === 0) {
        let auxCupsList = []
        const supplyPointDefaultName = t('delegations.supplyPointDefaultName')
        // setIsLoading ? setIsLoading(true) : setLoading(true)
        setLoadingCupsList(true)
        dispatch(thunkListSupplies(
          supplyPointDefaultName,
          //1,
          //15,
          //null,
          //false,
          //0, // offset [delegatePoints]
          //15, // limit [delegatePoints]
          false, // proveniente de cupsSearch para la busqueda [delegatePoints]
          true, // accion contra supplyPoints
          true, // accion contra delegatePoints
          (response) => {
            if (response && response.supplypoints && response.supplypoints.length > 0) {              
              response.supplypoints.map((supplypoint, i) => {
                auxCupsList.push(supplypoint.cups)
              })
            }
            if (response && response.delegatepoints && response.delegatepoints.length > 0) {
              response.delegatepoints.map((delegatepoint, i) => {
                if (delegatepoint.role === 'US_MANAGER') {
                  auxCupsList.push(delegatepoint.cups)
                }
              })
            }
            setCupsList(auxCupsList)
            // setIsLoading ? setIsLoading(false) : setLoading(false)
            setLoadingCupsList(false)
          }
        ))
      }
    }
  }, [ user ])

  return (
    <div className={classes.container}>

      {/* Datos del solicitante */}
      <div className={classes.description}>
        {t('requests.newRequest.form.btenForm.titles.title1')}
      </div>

      <Grid container className={classes.inputs} spacing={3}>

        {/* Nombre y Apellidos */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field1')}</div>
            </Grid>

            <Input
              fullWidth
              value={btenData.applicantNameAndSurname}
              onChange={(e) => {
                const value = noAccents(e.target.value.toUpperCase())

                setBtenData({
                  ...btenData,
                  applicantNameAndSurname: value // Convertimos el nombre a mayúsculas y sin acentos
                })

                if (value === '' || !onlyHasLetters(value)) {
                  handleUpdateErrors({
                    ...btenErrors,
                    applicantNameAndSurname: true
                  })
                } else {
                  handleUpdateErrors({
                    ...btenErrors,
                    applicantNameAndSurname: false
                  })
                }
              }}
              onBlur={(e) => {
                (e.target.value === '' || !onlyHasLetters(e.target.value)) ?
                  handleUpdateErrors({
                    ...btenErrors,
                    applicantNameAndSurname: true
                  })
                :
                  handleUpdateErrors({
                    ...btenErrors,
                    applicantNameAndSurname: false
                  })
              }}
              error={btenErrors.applicantNameAndSurname}
              helperText={btenErrors.applicantNameAndSurname && 
                (btenData.applicantNameAndSurname === '' ?
                  t('requests.newRequest.form.btenForm.inputs.errors.required')
                :
                  t('requests.newRequest.form.btenForm.inputs.errors.nameAndSurname'))
              }
            />
          </Grid>
        </Grid>

        {/* DNI */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field2')}</div>
            </Grid>

            <Input
              fullWidth
              value={btenData.docNumber}
              onChange={(e) => {
                const value = (e.target.value).toUpperCase()

                setBtenData({
                  ...btenData,
                  docNumber: value
                })

                if (value === '' || !validateNIF(value)) {
                  handleUpdateErrors({
                    ...btenErrors,
                    docNumber: true
                  })
                } else {
                  handleUpdateErrors({
                    ...btenErrors,
                    docNumber: false
                  })
                }
              }}
              onBlur={(e) => {
                (e.target.value === '' || !validateNIF(e.target.value)) ?
                  handleUpdateErrors({
                    ...btenErrors,
                    docNumber: true
                  })
                :
                  handleUpdateErrors({
                    ...btenErrors,
                    docNumber: false
                  })
              }}
              error={btenErrors.docNumber}
              helperText={btenErrors.docNumber && 
                (btenData.docNumber === '' ?
                  t('requests.newRequest.form.btenForm.inputs.errors.required')
                :
                  t('requests.newRequest.form.btenForm.inputs.errors.docNumber'))
              }
            />
          </Grid>
        </Grid>

        {/* Teléfono móvil */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field3')}</div>
            </Grid>

            <Input
              fullWidth
              onChange={(e) => {
                const value = e.target.value

                setBtenData({
                  ...btenData,
                  phone: value
                })

                if (value === '' || !validateMobileNumber(value)) {
                  handleUpdateErrors({
                    ...btenErrors,
                    phone: true
                  })
                } else {
                  handleUpdateErrors({
                    ...btenErrors,
                    phone: false
                  })
                }
              }}
              onBlur={(e) => {
                (e.target.value === '' || !validateMobileNumber(e.target.value)) ?
                  handleUpdateErrors({
                    ...btenErrors,
                    phone: true
                  })
                :
                  handleUpdateErrors({
                    ...btenErrors,
                    phone: false
                  })
              }}
              error={btenErrors.phone}
              helperText={btenErrors.phone && 
                (btenData.phone === '' ?
                  t('requests.newRequest.form.btenForm.inputs.errors.required')
                :
                  t('requests.newRequest.form.btenForm.inputs.errors.mobile'))
              }
            />
          </Grid>
        </Grid>

        {/* E-mail */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field4')}</div>
            </Grid>

            <Input
              fullWidth
              value={btenData.mail}
              onChange={(e) => {
                const value = e.target.value

                setBtenData({
                  ...btenData,
                  mail: value
                })

                if (value === '' || !validateMail(value)) {
                  handleUpdateErrors({
                    ...btenErrors,
                    mail: true
                  })
                } else {
                  handleUpdateErrors({
                    ...btenErrors,
                    mail: false
                  })
                }
              }}
              onBlur={(e) => {
                (e.target.value === '' || !validateMail(e.target.value)) ?
                  handleUpdateErrors({
                    ...btenErrors,
                    mail: true
                  })
                :
                  handleUpdateErrors({
                    ...btenErrors,
                    mail: false
                  })
              }}
              error={btenErrors.mail}
              helperText={btenErrors.mail && 
                (btenData.mail === '' ?
                  t('requests.newRequest.form.btenForm.inputs.errors.required')
                :
                  t('requests.newRequest.form.btenForm.inputs.errors.mail'))
              }
            />
          </Grid>
        </Grid>

        {/* Realiza la petición en calidad de */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field5')}</div>
            </Grid>

            <Select
              fullWidth
              label={''}
              value={identitySelector}
              values={identityValues}
              onChange={(e) => {
                const value = e.target.value

                if (value === t('requests.newRequest.form.btenForm.inputs.select1.option4')) {
                  setBtenData({
                    ...btenData,
                    identity: ''
                  })                  
                } else {
                  setBtenData({
                    ...btenData,
                    identity: value
                  })
                }

                setIdentitySelector(value)
              }}
            />
          </Grid>
        </Grid>

        {/* Indicar otro */}
        {
        (identitySelector === t('requests.newRequest.form.btenForm.inputs.select1.option4')) &&
          <Grid item md={6} sm={12} xs={12}>
            <Grid container direction='column'>
              <Grid item>
                <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field26')}</div>
              </Grid>

              <Input
                fullWidth
                value={btenData && btenData.identity}
                onChange={(e) => {  
                  setBtenData({
                    ...btenData,
                    identity: e.target.value
                  })
                }}
              />
            </Grid>
          </Grid>
        }
      </Grid>

      {/* Motivo de la solicitud */}
      <div className={classes.descriptionMargin}>
        {t('requests.newRequest.form.btenForm.titles.title2')}
      </div>

      <Grid container className={classes.inputs} spacing={3}>

        {/* Motivo */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field6')}</div>
            </Grid>

            <Select
              fullWidth
              label={''}
              value={btenData && btenData.requestReason}
              values={requestReasonValues}
              onChange={(e) => {
                setBtenData({
                  ...btenData,
                  requestReason: e.target.value
                })
              }}
              onBlur={(e) => {
                e.target.value === '' ?
                  handleUpdateErrors({
                    ...btenErrors,
                    requestReason: true
                  })
                :
                  handleUpdateErrors({
                    ...btenErrors,
                    requestReason: false
                  })
              }}
              error={btenErrors.requestReason}
              helperText={btenErrors.requestReason && t('requests.newRequest.form.btenForm.inputs.errors.required')}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Descripción de los trabajos que quiere realizar */}
      <div className={classes.descriptionMargin}>
        {t('requests.newRequest.form.btenForm.titles.title3')}
      </div>

      <Grid container className={classes.inputs} spacing={3}>

        {/* Descripción */}
        <Grid item md={12} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field7')}</div>
            </Grid>

            <Input
              fullWidth
              multiline
              rows='4'
              value={btenData.workDescription}
              onChange={(e) => {
                const value = e.target.value

                setBtenData({
                  ...btenData,
                  workDescription: value
                })

                if (value === '') {
                  handleUpdateErrors({
                    ...btenErrors,
                    workDescription: true
                  })
                } else {
                  handleUpdateErrors({
                    ...btenErrors,
                    workDescription: false
                  })
                }
              }}
              onBlur={(e) => {
                e.target.value === '' ?
                  handleUpdateErrors({
                    ...btenErrors,
                    workDescription: true
                  })
                :
                  handleUpdateErrors({
                    ...btenErrors,
                    workDescription: false
                  })
              }}
              error={btenErrors.workDescription}
              helperText={btenErrors.workDescription && t('requests.newRequest.form.btenForm.inputs.errors.required')}
              inputProps={{
                maxlength: '200'
              }}
            />

            {/* <Grid container justifyContent='flex-end'>
              <Grid item className={classes.characterCount}>
                {t('requests.newRequest.form.btenForm.inputs.comment.characterCount.part1')}

                <b>{(200 - btenData.workDescription.length)}</b>

                {t('requests.newRequest.form.btenForm.inputs.comment.characterCount.part2')}

                <b>200</b>
              </Grid>
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>

      {/* Alcance de los trabajos que nos solicita */}
      <div className={classes.descriptionMargin}>
        {t('requests.newRequest.form.btenForm.titles.title4')}
      </div>

      <Grid container className={classes.inputs} spacing={3}>

        {/* Alcance */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field8')}</div>
            </Grid>

            <Select
              fullWidth
              label={''}
              value={scopeSelector}
              values={scopeValues}
              onChange={(e) => {
                const value = e.target.value

                if (value === t('requests.newRequest.form.btenForm.inputs.select3.option3')) {
                  setBtenData({
                    ...btenData,
                    workScope: ''
                  })                  
                } else {
                  setBtenData({
                    ...btenData,
                    workScope: value
                  })
                }

                setScopeSelector(value)
              }}
              onBlur={(e) => {
                scopeSelector === '' ?
                  handleUpdateErrors({
                    ...btenErrors,
                    scopeSelector: true
                  })
                :
                  handleUpdateErrors({
                    ...btenErrors,
                    scopeSelector: false
                  })
              }}
              error={btenErrors.scopeSelector}
              helperText={btenErrors.scopeSelector && t('requests.newRequest.form.btenForm.inputs.errors.required')}
            />
          </Grid>
        </Grid>

        {/* Indicar otro */}
        {
        (scopeSelector === t('requests.newRequest.form.btenForm.inputs.select3.option3')) ?
          <Grid item md={6} sm={12} xs={12}>
            <Grid container direction='column'>
              <Grid item>
                <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field27')}</div>
              </Grid>

              <Input
                fullWidth
                value={btenData && btenData.workScope}
                onChange={(e) => {  
                  setBtenData({
                    ...btenData,
                    workScope: e.target.value
                  })
                }}
                onBlur={(e) => {
                  e.target.value === '' ?
                    handleUpdateErrors({
                      ...btenErrors,
                      workScope: true
                    })
                  :
                    handleUpdateErrors({
                      ...btenErrors,
                      workScope: false
                    })
                }}
                error={btenErrors.workScope}
                helperText={btenErrors.workScope && t('requests.newRequest.form.btenForm.inputs.errors.required')}
              />
            </Grid>
          </Grid>
        :
          <Grid item md={6} sm={12} xs={12} />
        }

        {/* Observaciones */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field9')}</div>
            </Grid>

            <Input
              fullWidth
              value={btenData && btenData.workScopeObservations}
              onChange={(e) => {  
                setBtenData({
                  ...btenData,
                  workScopeObservations: e.target.value
                })
              }}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Empresa que va a realizar los trabajos */}
      <div className={classes.descriptionMargin}>
        {t('requests.newRequest.form.btenForm.titles.title5')}
      </div>

      <Grid container className={classes.inputs} spacing={3}>

        {/* Razón social */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field10')}</div>
            </Grid>

            <Input
              fullWidth
              value={btenData.businessName}
              onChange={(e) => {
                const value = e.target.value

                setBtenData({
                  ...btenData,
                  businessName: value
                })

                if (value === '') {
                  handleUpdateErrors({
                    ...btenErrors,
                    businessName: true
                  })
                } else {
                  handleUpdateErrors({
                    ...btenErrors,
                    businessName: false
                  })
                }
              }}
              onBlur={(e) => {
                e.target.value === '' ?
                  handleUpdateErrors({
                    ...btenErrors,
                    businessName: true
                  })
                :
                  handleUpdateErrors({
                    ...btenErrors,
                    businessName: false
                  })
              }}
              error={btenErrors.businessName}
              helperText={btenErrors.businessName && t('requests.newRequest.form.btenForm.inputs.errors.required')}
            />
          </Grid>
        </Grid>

        {/* NIF/CIF */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field11')}</div>
            </Grid>

            <Input
              fullWidth
              value={btenData.businessDocNum}
              onChange={(e) => {
                const value = e.target.value

                setBtenData({
                  ...btenData,
                  businessDocNum: value
                })                
              }}
              onBlur={(e) => {
                if (e.target.value !== '' && !validateCIF(e.target.value) && !validateNIF(e.target.value)) {
                  handleUpdateErrors({
                    ...btenErrors,
                    businessDocNum: true
                  })
                } else {
                  handleUpdateErrors({
                    ...btenErrors,
                    businessDocNum: false
                  })
                }
              }}
              error={btenErrors.businessDocNum}
              helperText={btenErrors.businessDocNum && t('requests.newRequest.form.btenForm.inputs.errors.docNumber2')}
            />
          </Grid>
        </Grid>

        {/* Trabajo eléctrico SI/NO */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field12')}</div>
            </Grid>

            <Select
              fullWidth
              label={''}
              value={btenData.businessElectricalWork}
              values={electricalWorkValues}
              onChange={(e) => {
                const value = e.target.value

                setBtenData({
                  ...btenData,
                  businessElectricalWork: value
                })
              }}
            />
          </Grid>
        </Grid>       

        {/* Número de registro de empresa autorizada */}
        {btenData.businessElectricalWork === t('requests.newRequest.form.btenForm.inputs.select4.option1') ?         
          <Grid item md={6} sm={12} xs={12}>
            <Grid container direction='column'>
              <Grid item>
                <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field13')}</div>
              </Grid>

              <Input
                fullWidth
                value={btenData.businessRegistryNum}
                onChange={(e) => {
                  setBtenData({
                    ...btenData,
                    businessRegistryNum: e.target.value
                  })
                }}
              />
            </Grid>
          </Grid>
        :
          <Grid item md={6} sm={12} xs={12} />
        }
        
        {/* Jefe de trabajos / Persona de contacto */}      
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field14')}</div>
            </Grid>

            <Input
              fullWidth
              value={btenData.businessContactPerson}
              onChange={(e) => {
                const value = noAccents(e.target.value.toUpperCase())

                setBtenData({
                  ...btenData,
                  businessContactPerson: value // Convertimos el nombre a mayúsculas y sin acentos
                })

                if (value === '' || !onlyHasLetters(value)) {
                  handleUpdateErrors({
                    ...btenErrors,
                    businessContactPerson: true
                  })
                } else {
                  handleUpdateErrors({
                    ...btenErrors,
                    businessContactPerson: false
                  })
                }
              }}
              onBlur={(e) => {
                (e.target.value === '' || !onlyHasLetters(e.target.value)) ?
                  handleUpdateErrors({
                    ...btenErrors,
                    businessContactPerson: true
                  })
                :
                  handleUpdateErrors({
                    ...btenErrors,
                    businessContactPerson: false
                  })
              }}
              error={btenErrors.businessContactPerson}
              helperText={btenErrors.businessContactPerson && 
                (btenData.businessContactPerson === '' ?
                  t('requests.newRequest.form.btenForm.inputs.errors.required')
                :
                  t('requests.newRequest.form.btenForm.inputs.errors.contactPerson'))
              }
            />
          </Grid>
        </Grid>

        {/* Teléfono móvil */}      
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field15')}</div>
            </Grid>

            <Input
              fullWidth
              value={btenData.businessContactPhoneNum}
              onChange={(e) => {
                const value = e.target.value

                setBtenData({
                  ...btenData,
                  businessContactPhoneNum: value
                })

                if (value === '' || !validateMobileNumber(value)) {
                  handleUpdateErrors({
                    ...btenErrors,
                    businessContactPhoneNum: true
                  })
                } else {
                  handleUpdateErrors({
                    ...btenErrors,
                    businessContactPhoneNum: false
                  })
                }
              }}
              onBlur={(e) => {
                (e.target.value === '' || !validateMobileNumber(e.target.value)) ?
                  handleUpdateErrors({
                    ...btenErrors,
                    businessContactPhoneNum: true
                  })
                :
                  handleUpdateErrors({
                    ...btenErrors,
                    businessContactPhoneNum: false
                  })
              }}
              error={btenErrors.businessContactPhoneNum}
              helperText={btenErrors.businessContactPhoneNum && 
                (btenData.businessContactPhoneNum === '' ?
                  t('requests.newRequest.form.btenForm.inputs.errors.required')
                :
                  t('requests.newRequest.form.btenForm.inputs.errors.mobile'))
              }
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Ubicación de las instalaciones */}
      <div className={classes.descriptionMargin}>
        {t('requests.newRequest.form.btenForm.titles.title6')}
      </div>

      <Grid container className={classes.inputs} spacing={3}>

        {/* CUPS */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field16')}</div>
            </Grid>

            <Select
              fullWidth
              label={ 
                loadingCupsList ?
                  ''
                :
                  cupsList.length === 0 ? 
                    t('requests.newRequest.form.btenForm.inputs.errors.noCups') 
                      : 
                    ''
              }
              value={btenData.cups}
              values={cupsList}
              onChange={(e) => {                
                setBtenData({
                  ...btenData,
                  cups: e.target.value
                })
              }}
              onBlur={(e) => {
                btenData.cups === '' ?
                  handleUpdateErrors({
                    ...btenErrors,
                    cups: true
                  })
                :
                  handleUpdateErrors({
                    ...btenErrors,
                    cups: false
                  })
              }}
              error={btenErrors.cups}
              helperText={btenErrors.cups && t('requests.newRequest.form.btenForm.inputs.errors.required')}
              disabled={cupsList.length === 0}
              isLoading={loadingCupsList}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Titular de las instalaciones */}
      <div className={classes.descriptionMargin}>
        {t('requests.newRequest.form.btenForm.titles.title7')}
      </div>

      <Grid container className={classes.inputs} spacing={3}>

        {/* Razón social */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field17')}</div>
            </Grid>

            <Input
              fullWidth
              value={btenData.ownerBusinessName}
              onChange={(e) => {
                const value = e.target.value

                setBtenData({
                  ...btenData,
                  ownerBusinessName: value
                })

                if (value === '') {
                  handleUpdateErrors({
                    ...btenErrors,
                    ownerBusinessName: true
                  })
                } else {
                  handleUpdateErrors({
                    ...btenErrors,
                    ownerBusinessName: false
                  })
                }
              }}
              onBlur={(e) => {
                e.target.value === '' ?
                  handleUpdateErrors({
                    ...btenErrors,
                    ownerBusinessName: true
                  })
                :
                  handleUpdateErrors({
                    ...btenErrors,
                    ownerBusinessName: false
                  })
              }}
              error={btenErrors.ownerBusinessName}
              helperText={btenErrors.ownerBusinessName && t('requests.newRequest.form.btenForm.inputs.errors.required')}
            />
          </Grid>
        </Grid>

        {/* NIF/CIF */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field18')}</div>
            </Grid>

            <Input
              fullWidth
              value={btenData.ownerDocNum}
              onChange={(e) => {
                setBtenData({
                  ...btenData,
                  ownerDocNum: e.target.value
                })
              }}
              onBlur={(e) => {
                if (e.target.value !== '' && !validateCIF(e.target.value) && !validateNIF(e.target.value)) {
                  handleUpdateErrors({
                    ...btenErrors,
                    ownerDocNum: true
                  })
                } else {
                  handleUpdateErrors({
                    ...btenErrors,
                    ownerDocNum: false
                  })
                }
              }}
              error={btenErrors.ownerDocNum}
              helperText={btenErrors.ownerDocNum && t('requests.newRequest.form.btenForm.inputs.errors.docNumber2')}
            />
          </Grid>
        </Grid>

        {/* Cargo */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field19')}</div>
            </Grid>

            <Input
              fullWidth
              value={btenData.ownerCharge}
              onChange={(e) => {
                setBtenData({
                  ...btenData,
                  ownerCharge: e.target.value
                })
              }}
            />
          </Grid>
        </Grid>

        {/* Nombre Persona de contacto */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field20')}</div>
            </Grid>

            <Input
              fullWidth
              value={btenData.ownerContactPerson}
              onChange={(e) => {
                const value = noAccents(e.target.value.toUpperCase())

                setBtenData({
                  ...btenData,
                  ownerContactPerson: value
                })

                if (value === '' || !onlyHasLetters(value)) {
                  handleUpdateErrors({
                    ...btenErrors,
                    ownerContactPerson: true
                  })
                } else {
                  handleUpdateErrors({
                    ...btenErrors,
                    ownerContactPerson: false
                  })
                }
              }}
              onBlur={(e) => {
                (e.target.value === '' || !onlyHasLetters(e.target.value)) ?
                  handleUpdateErrors({
                    ...btenErrors,
                    ownerContactPerson: true
                  })
                :
                  handleUpdateErrors({
                    ...btenErrors,
                    ownerContactPerson: false
                  })
              }}
              error={btenErrors.ownerContactPerson}
              helperText={btenErrors.ownerContactPerson && 
                (btenData.ownerContactPerson === '' ?
                  t('requests.newRequest.form.btenForm.inputs.errors.required')
                :
                  t('requests.newRequest.form.btenForm.inputs.errors.contactPerson'))
              }
            />
          </Grid>
        </Grid>

        {/* Teléfono móvil de la persona de contacto */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field21')}</div>
            </Grid>

            <Input
              fullWidth
              value={btenData.ownerContactPhoneNum}
              onChange={(e) => {
                const value = e.target.value

                setBtenData({
                  ...btenData,
                  ownerContactPhoneNum: value
                })

                if (value === '' || !validateMobileNumber(value)) {
                  handleUpdateErrors({
                    ...btenErrors,
                    ownerContactPhoneNum: true
                  })
                } else {
                  handleUpdateErrors({
                    ...btenErrors,
                    ownerContactPhoneNum: false
                  })
                }
              }}
              onBlur={(e) => {
                (e.target.value === '' || !validateMobileNumber(e.target.value)) ?
                  handleUpdateErrors({
                    ...btenErrors,
                    ownerContactPhoneNum: true
                  })
                :
                  handleUpdateErrors({
                    ...btenErrors,
                    ownerContactPhoneNum: false
                  })
              }}
              error={btenErrors.ownerContactPhoneNum}
              helperText={btenErrors.ownerContactPhoneNum && 
                (btenData.ownerContactPhoneNum === '' ?
                  t('requests.newRequest.form.btenForm.inputs.errors.required')
                :
                  t('requests.newRequest.form.btenForm.inputs.errors.mobile'))
              }
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Fechas y hora de necesidad de la actuación */}
      <div className={classes.descriptionMargin}>
        {t('requests.newRequest.form.btenForm.titles.title8')}
      </div>

      <Grid container className={classes.inputs} spacing={3}>

        {/* Fecha inicio */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field22')}</div>
            </Grid>

            <DatepickerV2 
              selectedDate={auxStartDate} 
              handleChange={setAuxStartDate} 
              size='s' 
              minDate={minDate}
            />
          </Grid>
        </Grid>          

        {/* Fecha fin */}
        {auxStartDate ?
          <Grid item md={6} sm={12} xs={12}>
            <Grid container direction='column'>
              <Grid item>
                <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field23')}</div>
              </Grid>

              <DatepickerV2 
                selectedDate={auxEndDate} 
                handleChange={setAuxEndDate} 
                size='s' 
                minDate={auxStartDate && new Date(auxStartDate)}
                maxDate={auxStartDate && getFifteenDaysFromDate(auxStartDate)}
              />
            </Grid>
          </Grid>
        :
          <Grid item md={6} sm={12} xs={12} />
        }

        {/* Hora inicio */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field24')}</div>
            </Grid>

            <Input
              fullWidth
              label={'00:00 (hh:mm)'}
              value={startTime}
              onChange={(e) => {
                const value = e.target.value

                setStartTime(value)

                if (validateTime(value)) {
                  setBtenData({
                    ...btenData,
                    startTime: value + ':00'  // Añadimos los segundos
                  })

                  handleUpdateErrors({
                    ...btenErrors,
                    startTime: false
                  })
                } else {
                  setBtenData({
                    ...btenData,
                    startTime: ''
                  })

                  handleUpdateErrors({
                    ...btenErrors,
                    startTime: true
                  })
                }
              }}
              onBlur={(e) => {
                (e.target.value === '' || !validateTime(e.target.value)) ?
                  handleUpdateErrors({
                    ...btenErrors,
                    startTime: true
                  })
                :
                  handleUpdateErrors({
                    ...btenErrors,
                    startTime: false
                  })
              }}
              error={btenErrors.startTime}
              helperText={btenErrors.startTime && 
                (startTime === '' ?
                  t('requests.newRequest.form.btenForm.inputs.errors.required')
                :
                  t('requests.newRequest.form.btenForm.inputs.errors.time'))
              }
            />
          </Grid>
        </Grid>

        {/* Hora fin */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field25')}</div>
            </Grid>

            <Input
              fullWidth
              label={'00:00 (hh:mm)'}
              value={endTime}
              onChange={(e) => {
                const value = e.target.value

                setEndTime(value)

                if (validateTime(value)) {
                  setBtenData({
                    ...btenData,
                    endTime: value + ':00'  // Añadimos los segundos
                  })

                  handleUpdateErrors({
                    ...btenErrors,
                    endTime: false
                  })
                } else {
                  setBtenData({
                    ...btenData,
                    endTime: ''
                  })

                  handleUpdateErrors({
                    ...btenErrors,
                    endTime: true
                  })
                }
              }}
              onBlur={(e) => {
                (e.target.value === '' || !validateTime(e.target.value)) ?
                  handleUpdateErrors({
                    ...btenErrors,
                    endTime: true
                  })
                :
                  handleUpdateErrors({
                    ...btenErrors,
                    endTime: false
                  })
              }}
              error={btenErrors.endTime}
              helperText={btenErrors.endTime && 
                (endTime === '' ?
                  t('requests.newRequest.form.btenForm.inputs.errors.required')
                :
                  t('requests.newRequest.form.btenForm.inputs.errors.time'))
              }
            />
          </Grid>
        </Grid>
      </Grid>
      
    </div>
  )
}

export default BtenForm
