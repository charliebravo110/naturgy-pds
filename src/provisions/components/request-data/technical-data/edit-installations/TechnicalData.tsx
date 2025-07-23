import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import TechnicalDataIcon from '../../../../../assets/icons/datos_tecnicos.svg'

import Select from '../../../../../common/components/select/Select'
import Input from '../../../../../common/components/input/Input'

import { setTechData, setPowerList } from '../../../../store/actions/ProvisionsActions'
import { thunkGetMasterData } from '../../../../store/actions/ProvisionsThunkActions'

import useStyles, {
  ExpansionPanel,
  ExpansionPanelSummary,
  StyledExpandMoreIcon,
  ExpansionPanelDetails
} from './TechnicalData.styles'

const TechnicalData = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    state,
    setErrorCheck,
    setIsEmpty,
    setIsLoading
  } = props

  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)
  const dossierSubtype = useSelector((state: any) => state.provisions.dossierSubtype)
  const address = useSelector((state: any) => state.provisions.cadastreData.item.domiTributNoEstructurado)
  const userToken = useSelector((state: any) => state.user.token)

  const [ voltageSupplySelect, setVoltageSupplySelect ] = useState([] as any)
  const [ idDossierTensionType, setIdDossierTensionType ] = useState('')

  const typologies = [
    {
      key: 'DOSSUB025',
      value: t('provisions.editInstallations.type.typologies.setback')
    },
    {
      key: 'DOSSUB026',
      value: t('provisions.editInstallations.type.typologies.detour')
    },
    {
      key: 'DOSSUB027',
      value: t('provisions.editInstallations.type.typologies.telecomunication')
    }
  ]

  /* Si hay una provision vigente se cargan los datos en los formularios */
  const getDefaultTechData = () => {
    let techDataDefault = {} as any
    if (currentProvision && currentProvision.techData) {
      techDataDefault = {
        idDossierTensionType: currentProvision.idTensionType,
        description: currentProvision.description,
        observations: currentProvision.description
      }
    } else {
      techDataDefault = {
        idDossierTensionType: '',
        totalPower: '0',
        timeDiscrimination: '0',
        description: '',
        observations: ''
      }
    }
    return techDataDefault
  }

  /* --- DATA --- */
  const [ techData, setTechDataI ] = useState(getDefaultTechData())

  /* --- ERRORS --- */
  const [ techDataErrors, setTechDataErrors ] = useState({
    idDossierTensionType: false,
    description: false
  } as any)

  useEffect(() => {
    dispatch(setTechData(techData))
  }, [ dispatch, techData ])

  const getAndSetMasterData = (key: string, setSelect: any, keyToApplyRemoveItem?: string, removeItem?: number) => {
    dispatch(thunkGetMasterData('DossierDatosTecnicos', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), key, (response) => {
      if (response) {
        setSelect(response.map(item => item.value).filter((item, index) => {
          if(keyToApplyRemoveItem && key === keyToApplyRemoveItem){
            return index !== removeItem
          }

          return true
        }))
      }
    }))
  }

  const selectValue = (select: any, value: any) => {
    const keyValue = select.filter(item => item.substring(0, item.indexOf('|')) === value)

    return keyValue && keyValue[0] && keyValue[0].substring(keyValue[0].indexOf('|') + 1, keyValue[0].length)
  }

  useEffect(() => {
    if (userToken){
      getAndSetMasterData('DT_TENSION_SUM', setVoltageSupplySelect)
    }
  // eslint-disable-next-line
  }, [userToken])

  // Carga de los selects en modo readOnly
  useEffect(() => {
    if (currentProvision
      && state >= 2
      && voltageSupplySelect.length === 0
    ) {
      setIsLoading(true)
      getAndSetMasterData('DT_TENSION_SUM', setVoltageSupplySelect)
      setIsLoading(false)
    }
  // eslint-disable-next-line
  }, [state, currentProvision, voltageSupplySelect])

  useEffect(() => {
    if (state >= 1) {
      setIdDossierTensionType(selectValue(voltageSupplySelect, techData.idDossierTensionType))
    }
  // eslint-disable-next-line
  }, [ state, voltageSupplySelect ])

  useEffect(() => {
    // Comprobar si hay errores en el formulario
    if (Object.keys(techDataErrors).filter((key) => techDataErrors[key].bool).length > 0) {
      setErrorCheck(true)
    } else {
      setErrorCheck(false)
    }
  // eslint-disable-next-line
  }, [ techDataErrors ])

  useEffect(() => {
    // Comprobar si el formulario esta rellenado
    if (Object.keys(techData).filter((key) => techData[key] === '').length === 0) {
      setIsEmpty(false)
    } else {
      setIsEmpty(true)
    }
  // eslint-disable-next-line
  }, [ techData ])

  useEffect(() => {
    // formateo de powerList
    dispatch(setPowerList([]))

  // eslint-disable-next-line
  }, [])

  // Si los 2 campos de comentarios son diferentes, mostrar la concatenacion de abos
  // Si son iguales, mostrar unicamente uno de ellos
  const showComments = (description : any, observations : any) => {
    let comments = ''
    let observ = ''
    let descript = ''

    if (description != undefined) {
      descript = description.toString().trim()
    }
    if (observations != undefined) {
      observ = observations.toString().trim()
    }

    if (observ.length > 0) {
      if (descript.length > 0) {
        if (descript.toUpperCase() === observ.toUpperCase()){
          comments = observ 
        } else {
          if (observ.charAt(observ.length -1) === '.') {
            comments = observ + ' ' + descript 
          } else {
            comments = observ + '. ' + descript 
          }
        }
      } else {
        comments = observ
      }
    } else if (descript.length > 0) {
      comments = descript 
    }
    return comments
  }

  const validateNumberImput = (e) => {
    const value = e.target.value;

    if (value !== '' && isNaN(value)) {
      e.target.value = value.slice(0, -1);
    } else {
      if (value.includes('.')) {
        const auxValue = value.split('.');
        if (auxValue[1].length > 1) {
          e.target.value = auxValue[0] + '.' + auxValue[1].substring(0, 1);
        }
      }
    }
  }

  useEffect(() => {
    console.log('E999513 edit-installations')
  }, [])

  return (
    <>
      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
          <img className={classes.expansionPanelSummaryIcon} src={TechnicalDataIcon} alt='' />

          <Typography className={classes.expansionPanelSummaryText}>{t('provisions.editInstallations.requestData.technicalData.technicalData')}</Typography>
        </ExpansionPanelSummary>

        <ExpansionPanelSummary className='colored'>
          <Grid container direction='column' className={classes.summaryContainer}>
            <Grid container>
              <Grid item md={3} className={classes.textAlignRight}>
                <span >{t('provisions.editInstallations.requestData.technicalData.type')}</span>
              </Grid>

              <Grid item>
                <strong>{typologies.filter(item => item.key === dossierSubtype)[0].value}</strong>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item md={3} className={classes.textAlignRight}>
                <span >{t('provisions.editInstallations.requestData.technicalData.address')}</span>
              </Grid>

              <Grid item>
                <strong>
                {state <= 2 ?
                  address
                :
                  currentProvision.streetType+' '+currentProvision.streetName+' '+currentProvision.num+' '+currentProvision.stair+' '+currentProvision.floor+' '+currentProvision.door+' '+currentProvision.addressDescription}
                </strong>
              </Grid>
            </Grid>
          </Grid>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          <Grid container direction='column' spacing={2}>
            {
              /*
              <Grid container spacing={2}>
                <Grid item md={9} sm={9} xs={12}>
                  <Typography className={classes.label}>{t('provisions.editInstallations.requestData.technicalData.labels.property')}</Typography>
                </Grid>

                <Grid item md={3} sm={3} xs={12} justifyContent='space-between'>
                  <Grid container>
                    <Grid container spacing={1} md={6} sm={6} xs={6} alignItems='center'>
                      <Grid item>
                        <Checkbox
                          selected={typeof(notUfd) !== 'undefined' && notUfd}
                          handleClick={() => setNotUfd(true)}
                        />
                      </Grid>

                      <Grid item>
                        <Typography>{t('provisions.editInstallations.requestData.technicalData.checkBox.yes')}</Typography>
                      </Grid>
                    </Grid>

                    <Grid container spacing={1} md={6} sm={6} xs={6} alignItems='center'>
                      <Grid item>
                        <Checkbox
                          selected={typeof(notUfd) !== 'undefined' && !notUfd}
                          handleClick={() => setNotUfd(false)}
                        />
                      </Grid>

                      <Grid item>
                        <Typography>{t('provisions.editInstallations.requestData.technicalData.checkBox.no')}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              */
            }

            {
              /*
              typeof(notUfd) !== 'undefined' && (
                notUfd ?
                  <NotUfdAdvise />
                :
              */
            }
                  <Grid container direction='column' spacing={2} className={classes.inputs}>
                    <Grid container md={5} direction='column' className={classes.inputContainer}>
                      <Grid item>
                        <Typography>
                          {t('provisions.editInstallations.requestData.technicalData.labels.tension.label')}
                        </Typography>
                      </Grid>

                      <Grid item className={classes.input}>
                        {
                          state === 0 ?
                            <Select
                              fullWidth
                              codFiltering
                              values={voltageSupplySelect}
                              value={techData.idDossierTensionType}
                              label={t('provisions.editInstallations.requestData.technicalData.labels.tension.placeholder')}
                              onChange={(e) => setTechDataI({ ...techData, idDossierTensionType: e.target.value })}
                              onBlur={(e) => setTechDataErrors({ ...techDataErrors, idDossierTensionType: { bool: e.target.value === '', msg: t('provisions.newProvision.requestData.supplyType.form.errors.required') }})}
                              helperText={techDataErrors.idDossierTensionType.bool && techDataErrors.idDossierTensionType.msg}
                              error={techDataErrors.idDossierTensionType.bool}
                            />
                          :
                            <Typography className={classes.text}>{idDossierTensionType}</Typography>
                        }
                      </Grid>
                    </Grid>

                    <Grid container md={12} direction='column' className={classes.inputContainer}>
                      <Grid item>
                        <Typography>
                          {t('provisions.editInstallations.requestData.technicalData.labels.description.label')}
                        </Typography>
                      </Grid>

                      <Grid item className={classes.input}>
                        {
                          state === 0 ?
                            <>
                              <Input
                                fullWidth
                                multiline
                                rows='5'
                                className={classes.description}
                                value={techData.description}
                                inputProps={{
                                  maxlength: '300'
                                }}
                                onChange={(e) => setTechDataI({ ...techData, description: e.target.value, observations: e.target.value })}
                                onBlur={(e) => setTechDataErrors({ ...techDataErrors, description: { bool: e.target.value === '', msg: t('provisions.newProvision.requestData.supplyType.form.errors.required') }})}
                                helperText={techDataErrors.description.bool && techDataErrors.description.msg}
                                error={techDataErrors.description.bool}
                              />

                              <Grid container justifyContent='flex-end'>
                                <Grid item className={classes.characterCount}>
                                  {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.textArea.characters.part1')}

                                  {300 - (techData.description ? techData.description.length : 0)}

                                  {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.textArea.characters.part2')}
                                </Grid>
                              </Grid>
                            </>
                          :
                            <Typography>
                              {showComments(techData.description, techData.observations)}
                            </Typography>
                        }
                      </Grid>
                    </Grid>

                    {
                      /*
                      <Grid container direction='column' className={classes.inputContainer}>
                        <Grid item>
                          <Typography>
                            {t('provisions.editInstallations.requestData.technicalData.labels.cause.label')}
                          </Typography>
                        </Grid>

                        <Grid item className={classes.input}>
                          {
                            state === 0 ?
                              <Select
                                fullWidth
                                values={causesSelect}
                                value={techData.cause}
                                label={t('provisions.editInstallations.requestData.technicalData.labels.cause.placeholder')}
                                onChange={(e) => setTechDataI({ ...techData, cause: e.target.value })}
                              />
                            :
                              <Typography className={classes.text}>{cause}</Typography>
                          }
                        </Grid>
                      </Grid>

                      <Grid container className={classes.inputContainer}>
                        <Typography className={classes.label}>{t('provisions.editInstallations.requestData.technicalData.labels.divert.label')}</Typography>
                      </Grid>

                      <Grid container spacing={1} alignItems='center'>
                        <Grid item>
                          <Checkbox
                            selected={cable}
                            handleClick={() => setCable(!cable)}
                          />
                        </Grid>

                        <Grid item>
                          <Typography>{t('provisions.editInstallations.requestData.technicalData.labels.divert.elements.cable.title')}</Typography>
                        </Grid>
                      </Grid>

                      {
                        cable &&
                          <CableForm
                            state={state}
                            techData={techData}
                            setTechDataI={setTechDataI}
                            techDataErrors={techDataErrors}
                            setTechDataErrors={setTechDataErrors}
                          />
                      }

                      <Grid className={classes.separator} />

                      <Grid container spacing={1} alignItems='center'>
                        <Grid item>
                          <Checkbox
                            selected={support}
                            handleClick={() => setSupport(!support)}
                          />
                        </Grid>

                        <Grid item>
                          <Typography>{t('provisions.editInstallations.requestData.technicalData.labels.divert.elements.support.title')}</Typography>
                        </Grid>
                      </Grid>

                      {
                        support &&
                          <SupportForm
                            state={state}
                            techData={techData}
                            setTechDataI={setTechDataI}
                            techDataErrors={techDataErrors}
                            setTechDataErrors={setTechDataErrors}
                          />
                      }

                      <Grid className={classes.separator} />

                      <Grid container spacing={1} alignItems='center'>
                        <Grid item>
                          <Checkbox
                            selected={center}
                            handleClick={() => setCenter(!center)}
                          />
                        </Grid>

                        <Grid item>
                          <Typography>{t('provisions.editInstallations.requestData.technicalData.labels.divert.elements.center.title')}</Typography>
                        </Grid>
                      </Grid>

                      {
                        center &&
                          <CenterForm
                            state={state}
                            techData={techData}
                            setTechDataI={setTechDataI}
                            techDataErrors={techDataErrors}
                            setTechDataErrors={setTechDataErrors}
                          />
                      }
                      */
                    }
                  </Grid>
          {
            /*
              )
            }
            */
          }
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </>
  )
}

export default TechnicalData
