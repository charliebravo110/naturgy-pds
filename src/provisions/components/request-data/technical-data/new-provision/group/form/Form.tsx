import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import Select from '../../../../../../../common/components/select/Select'
import Input from '../../../../../../../common/components/input/Input'
import Switch from '../../../../../../../common/components/switch/Switch'
import Switch2 from '../../../../../../../common/components/switch/Switch2'
import Checkbox from '../../../../../../../supplies/supplies-list/managed-by-me/components/checkbox/Checkbox'
import InfoIcon from '../../../../../../../assets/icons/info.svg'

import { validateCupsNumber, validateDossierCode } from '../../../../../../../common/lib/ValidationLib'

import useStyles from './Form.styles'
import DatepickerV3 from '../../../../../../../common/components/datepickerV3/DatepickerV3'
import { formatDateAndHourZeus, formatDateZeus } from '../../../../../../../common/lib/FormatLib'

const Form = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const [idDossierTensionType, setIdDossierTensionType] = useState()
  const [idDossierTensionSubtype, setIdDossierTensionSubtype] = useState()
  const [phase, setPhase] = useState()

  const [tempSelectedState, setTempSelectedState] = useState(0)

  const [structureSchemaSelectText, setStructureSchemaSelectText] = useState([] as any)
  const [datepickerDate1, setDatepickerDate1] = useState<Date>();
  const [datepickerDate2, setDatepickerDate2] = useState<Date>();
  const [cupsOrExp, setCupsOrExp] = useState<Boolean>(false)

  const [switchOn, setSwitchOn] = useState(false)

  const provisions = useSelector((state: any) => state.provisions)
  const dossierSubtype = useSelector((state: any) => state.provisions.dossierSubtype)
  const powerList = useSelector((state: any) => state.provisions.powerList)

  const [sendExtensionBudgetInd, setSendExtensionBudgetInd] = useState('')

  const {
    state,
    techData,
    setTechDataI,
    setPowerListI,
    techDataErrors,
    setTechDataErrors,
    voltageSupplySelect,
    voltageSelect,
    numberOfPhasesSelect,
    characters,
    setCharacters,
    isLoadingTensionSubtype,
    isLoadingPhase,
    structureSchemaSelect
  } = props

  const selectValue = (select: any, value: any) => {
    const keyValue = select.filter(item => item.substring(0, item.indexOf('|')) === value)

    return keyValue && keyValue[0] && keyValue[0].substring(keyValue[0].indexOf('|') + 1, keyValue[0].length)
  }

  useEffect(() => {
    if (state >= 1) {
      setIdDossierTensionType(selectValue(voltageSupplySelect, techData.idDossierTensionType))

      setIdDossierTensionSubtype(selectValue(voltageSelect, techData.idDossierTensionSubtype))

      setPhase(selectValue(numberOfPhasesSelect, techData.phase))

    }
    // eslint-disable-next-line
  }, [state, voltageSupplySelect, voltageSelect, numberOfPhasesSelect])

  const handleElectricVehicleChange = (e) => {
    if (e.target.checked) {
      setTechDataI({ ...techData, electricVehicleCharging: '0', SPL: '0' })

    } else {
      setTechDataI({ ...techData, electricVehicleCharging: '1' })
    }
  }



  const handleSPL = (e) => {
    if (e.target.checked) {
      setTechDataI({ ...techData, SPL: '0' })
    } else {
      setTechDataI({ ...techData, SPL: '1' })
    }
  }

  const handleDate1 = (e) => {
    const fullYear = formatDateAndHourZeus(e)
    setTechDataI({ ...techData, expected_date_connection: fullYear })
    setDatepickerDate1(e)
  }

  const handleDate2 = (e) => {
    const fullYear = formatDateAndHourZeus(e)
    setTechDataI({ ...techData, expected_date_desconnection: fullYear })
    setDatepickerDate2(e)
  }

  const handleFinalPs = (e) => {
    if (e.target.checked) {
      setTechDataI({ ...techData, finalPs: '0' })
    } else {
      setTechDataI({ ...techData, finalPs: '1' })
    }
  }

  const handleAssociatedSelfConsumption = (e) => {
    if (e.target.checked) {
      setTechDataI({ ...techData, associatedSelfConsumption: '0' })
    } else {
      setTechDataI({ ...techData, associatedSelfConsumption: '1' })
    }
  }

  const handleCupsOrExp = (e) => {
    setTechDataI({ ...techData, expediente: '', cups: '' })
    setTechDataErrors({
      ...techDataErrors,
        cups: {
        bool: false,
        msg: ''
      },
      expediente :{
        bool: false,
        msg: ''
      }
    })
    setCupsOrExp(!cupsOrExp)
  }

  const handleVoltageSupply = (e) => {
    setTechDataI({ ...techData, idDossierTensionType: e.target.value })
  }

  const handleVoltage = (e) => {
    setTechDataI({ ...techData, idDossierTensionSubtype: e.target.value })
  }

  const handleNumberOfPhases = (e) => {
    setTechDataI({ ...techData, phase: e.target.value })
  }

  const handleTotalBuildingArea = (e) => {
    if (!isNaN(e.target.value)) {
      let auxItem = powerList && powerList.length > 0 && powerList[0]

      auxItem = {
        ...auxItem,
        buildableArea: e.target.value.replace(',', '.')
      } as any

      setPowerListI([auxItem])

      setTechDataI({ ...techData, totalBuildingArea: e.target.value.replace(',', '.') })
    }
  }

  const handleCups = (e) => {
    if (e.target.value === '') {
      const aux = techData
      delete aux.cups
      setTechDataI(aux)
    } else {
      setTechDataI({ ...techData, cups: e.target.value, expediente: '' })
    }
  }

  const handleExpediente = (e) => {
    if (e.target.value === '') {
      const aux = techData
      delete aux.expediente
      setTechDataI(aux)
    } else {
      setTechDataI({ ...techData, expediente: e.target.value, cups: '' })
    }
  }

  const handleDescription = (e) => {
    setTechDataI({
      ...techData,
      description: e.target.value,
      observations: e.target.value
    })

    if (e.target.value === '') {
      const aux = techData

      delete aux.description
      delete aux.observations

      setTechDataI(aux)
    }

    setCharacters(300 - e.target.value.length)
  }

  const handleExistingAco = (e) => {
    if (e.target.checked) {
      setSwitchOn(false)
      setTechDataI({ ...techData, existingAco: '0' })
    } else {
      setSwitchOn(true)
      setTechDataI({ ...techData, existingAco: '1' })
    }
  }

  const handleNewSwitch = (e) => {
    if (e.target.checked) {
      setSwitchOn(true)

      const aux = techData

      delete aux.description
      delete aux.observations

      setTechDataI(aux)
    } else {
      setSwitchOn(false)

      setTechDataI({
        ...techData,
        description: 'CGP en centralización',
        observations: 'CGP en centralización'
      })
    }
  }

  const handleStringDate = (date: string) => {
    const finalDate = date.slice(6, 8) + '/' + date.slice(4, 6) + '/' + date.slice(0, 4)
    return finalDate

  }

  //validación de cups, si es correcto tambien quitar el error de validacion de expediente
  const checkCupsNumber = (e) => {
    if (e.target.value === '') {
      setTechDataErrors({ ...techDataErrors, cups: { bool: true, msg: t('provisions.newProvision.requestData.supplyType.form.errors.required') } })
    }
    else if (validateCupsNumber(e.target.value) || e.target.value === '') {
      setTechDataErrors({ ...techDataErrors, cups: { bool: false, msg: '' } })
      setTechDataErrors({ ...techDataErrors, expediente: { bool: false, msg: '' } })
    } else {
      setTechDataErrors({ ...techDataErrors, cups: { bool: true, msg: t('provisions.newProvision.requestData.supplyType.form.errors.invalidCups') } })
    }
  }

  //validación de expediente, si es correcto tambien quitar el error de validacion de cups
  const checkExpedienteNumber = (e) => {

    if (e.target.value === '') {
      setTechDataErrors({ ...techDataErrors, expediente: { bool: true, msg: t('provisions.newProvision.requestData.supplyType.form.errors.required') } })
    }
    if (validateDossierCode(e.target.value)) {
      setTechDataErrors({ ...techDataErrors, expediente: { bool: false, msg: '' } })
      setTechDataErrors({ ...techDataErrors, cups: { bool: false, msg: '' } })
    } else {
      //Continuar aqui
      setTechDataErrors({ ...techDataErrors, expediente: { bool: true, msg: t('provisions.newProvision.requestData.supplyType.form.errors.invalidExp') } })
    }
  }

  // Si los 2 campos de comentarios son diferentes, mostrar la concatenacion de abos
  // Si son iguales, mostrar unicamente uno de ellos
  const showComments = (description: any, observations: any) => {
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
        if (descript.toUpperCase() === observ.toUpperCase()) {
          comments = observ
        } else {
          if (observ.charAt(observ.length - 1) === '.') {
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

  useEffect(() => {
    let auxSchemaSelect = [];

    structureSchemaSelect.map((item, i) => {
      switch (item) {

        case 'SCHEMA1':
          auxSchemaSelect.push(t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.schemas.schema1'))
          break
        case 'SCHEMA2':
          auxSchemaSelect.push(t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.schemas.schema2'))
          break
        case 'SCHEMA3':
          auxSchemaSelect.push(t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.schemas.schema3'))
          break
        case 'SCHEMA4':
          auxSchemaSelect.push(t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.schemas.schema4'))
          break
      }

    })

    setStructureSchemaSelectText(auxSchemaSelect)

  }, [structureSchemaSelect])


  useEffect(() => {

    setTechDataI({ ...techData, structureSchema: tempSelectedState.toString() })

  }, [tempSelectedState])

  return (
    <>
      <Grid container direction='column' md={5}>
        <Grid container direction='column' className={classes.inputContainer}>
          <Grid item className={classes.label}>
            <Typography>
              {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.firstColumn.input1')}
            </Typography> 
          </Grid>

          <Grid item className={classes.input}>
            {state === 0 ?
              <Select
                fullWidth
                label={t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.selectLabel.voltageSupply')}
                value={techData.idDossierTensionType}
                values={voltageSupplySelect}
                onChange={handleVoltageSupply}
                codFiltering
                onBlur={(e) => setTechDataErrors({ ...techDataErrors, idDossierTensionType: { bool: e.target.value === '', msg: t('provisions.newProvision.requestData.supplyType.form.errors.required') } })}
                error={techDataErrors.idDossierTensionType.bool}
                helperText={techDataErrors.idDossierTensionType.bool && techDataErrors.idDossierTensionType.msg}
              />
              :
              <Typography className={classes.stateLabel}>{idDossierTensionType}</Typography>
            }
          </Grid>
        </Grid>

        {dossierSubtype == 'DOSSUB010' &&
          <Grid container direction='column' className={classes.inputContainer}>
            <Grid item className={classes.label}>
              <Typography>
                {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.secondColumn.input1')}
              </Typography>
            </Grid>

            <Grid item className={classes.input}>
              {state === 0 ?
                <Select
                  fullWidth
                  label={t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.selectLabel.numberOfPhases')}
                  value={techData.phase}
                  values={numberOfPhasesSelect}
                  onChange={handleNumberOfPhases}
                  codFiltering
                  onBlur={(e) => setTechDataErrors({ ...techDataErrors, phase: { bool: e.target.value === '', msg: t('provisions.newProvision.requestData.supplyType.form.errors.required') } })}
                  error={techDataErrors.phase.bool}
                  disabled={!techData.idDossierTensionType}
                  helperText={techDataErrors.phase.bool && techDataErrors.phase.msg}
                  isLoading={isLoadingPhase}
                />
                :
                <Typography className={classes.stateLabel}>{phase}</Typography>
              }
            </Grid>
          </Grid>
        }

        <Grid container direction='column' className={classes.inputContainer}>
          <Grid item className={classes.label}>
            <Typography>
              {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.firstColumn.input2')}
            </Typography>
          </Grid>

          <Grid item className={classes.input}>
            {state === 0 ?
              <Select
                fullWidth
                label={t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.selectLabel.voltage')}
                value={techData.idDossierTensionSubtype}
                values={voltageSelect}
                onChange={handleVoltage}
                codFiltering
                onBlur={(e) => setTechDataErrors({ ...techDataErrors, idDossierTensionSubtype: { bool: e.target.value === '', msg: t('provisions.newProvision.requestData.supplyType.form.errors.required') } })}
                error={techDataErrors.idDossierTensionSubtype.bool}
                disabled={!techData.phase}
                helperText={techDataErrors.idDossierTensionSubtype.bool && techDataErrors.idDossierTensionSubtype.msg}
                isLoading={isLoadingTensionSubtype}
              />
              :
              <Typography className={classes.stateLabel}>{idDossierTensionSubtype}</Typography>
            }
          </Grid>
        </Grid>

        {dossierSubtype !== 'DOSSUB029' && dossierSubtype !== 'DOSSUB030' && dossierSubtype !== 'DOSSUB009' && dossierSubtype !== 'DOSSUB012' && dossierSubtype !== 'DOSSUB013' && dossierSubtype !== 'DOSSUB014' && dossierSubtype !== 'DOSSUB010' &&
          <Grid container direction='column' className={classes.inputContainer}>
            <Grid item className={classes.label}>
              <Typography>{t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.secondColumn.input6')}</Typography>
            </Grid>

            <Grid item className={classes.selfConsumptionInput}>
              <Grid container md={12} direction='row' className={classes.marginLeft}>
                <Grid item md={5}>
                  <Switch
                    onChange={handleAssociatedSelfConsumption}
                    checked={techData.associatedSelfConsumption === '0'}
                    disabled={state !== 0}
                  />
                </Grid>
                {techData.associatedSelfConsumption !== '0' &&
                  <Grid item md={7} className={classes.selfConsumptionInfoContainer}>
                    <Grid container md={12}>
                      <Grid item md={2}>
                        <img src={InfoIcon} className={classes.infoIcon} alt='' />
                      </Grid>
                      <Grid item md={10}>
                        {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.secondColumn.input6Info')}
                      </Grid>
                    </Grid>
                  </Grid>
                }
              </Grid>
            </Grid>
          </Grid>
        }


      </Grid>

      <Grid container direction='column' md={5}>


        {dossierSubtype !== 'DOSSUB010' &&
          <Grid container direction='column' className={classes.inputContainer}>
            <Grid item className={classes.label}>
              <Typography>
                {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.secondColumn.input1')}
              </Typography>
            </Grid>

            <Grid item className={classes.input}>
              {state === 0 ?
                <Select
                  fullWidth
                  label={t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.selectLabel.numberOfPhases')}
                  value={techData.phase}
                  values={numberOfPhasesSelect}
                  onChange={handleNumberOfPhases}
                  codFiltering
                  onBlur={(e) => setTechDataErrors({ ...techDataErrors, phase: { bool: e.target.value === '', msg: t('provisions.newProvision.requestData.supplyType.form.errors.required') } })}
                  error={techDataErrors.phase.bool}
                  disabled={!techData.idDossierTensionType}
                  helperText={techDataErrors.phase.bool && techDataErrors.phase.msg}
                  isLoading={isLoadingPhase}
                />
                :
                <Typography className={classes.stateLabel}>{phase}</Typography>
              }
            </Grid>
          </Grid>
        }

        {dossierSubtype === 'DOSSUB010' &&
          <Grid container direction='column' className={classes.inputContainer}>
            <Grid item className={classes.label}>
              <Typography>
                {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.secondColumn.input4')}
              </Typography>
            </Grid>

            <Grid item className={classes.input}>
              {state === 0 ?
                <DatepickerV3
                  selectedDate={datepickerDate1}
                  handleChange={handleDate1}
                  size='m'
                  minDate={new Date()}
                  dateFormat={'dd/MM/yyyy'}
                />
                :
                <Typography className={classes.stateLabel}>{handleStringDate(techData.expected_date_connection)}</Typography>
              }
            </Grid>
          </Grid>
        }

        {dossierSubtype === 'DOSSUB010' &&

          <Grid container direction='column' className={classes.inputContainer}>
            <Grid item className={classes.label}>
              <Typography>
                {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.secondColumn.input5')}
              </Typography>
            </Grid>

            <Grid item className={classes.input}>
              {state === 0 ?
                <DatepickerV3
                  selectedDate={datepickerDate2}
                  handleChange={handleDate2}
                  size='m'
                  minDate={datepickerDate1}
                  dateFormat={'dd/MM/yyyy'}
                />
                :
                <Typography className={classes.stateLabel}>{handleStringDate(techData.expected_date_desconnection)}</Typography>
              }
            </Grid>
          </Grid>
        }
        {(dossierSubtype === 'DOSSUB011') &&
          <Grid container direction='column' className={classes.inputContainer}>
            <Grid item className={classes.label}>
              <Typography> {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.secondColumn.input7')}</Typography>
            </Grid>

            <Grid item className={classes.selfConsumptionInput}>
              <Grid container md={12} direction='row' className={classes.marginLeft}>
                <Grid item md={5}>
                  <Switch
                    onChange={handleFinalPs}
                    checked={techData.finalPs === '0'}
                    disabled={state !== 0}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

        }
        {(dossierSubtype === 'DOSSUB012' || dossierSubtype === 'DOSSUB013' || dossierSubtype === 'DOSSUB014') &&
          <Grid container direction='column' className={classes.inputContainer}>
            <Grid item className={classes.label}>
              <Typography>{t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.secondColumn.input6')}</Typography>
            </Grid>
            {state === 0 ?
              <Grid container>
                <Grid item className={classes.selfConsumptionInfoContainer}>
                  <Grid container md={12}>
                    <Grid item md={1}>
                      <img src={InfoIcon} className={classes.infoIcon} alt='' />
                    </Grid>
                    <Grid item md={10}>
                      {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.secondColumn.input7')}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item className={classes.selfConsumptionInfoContainer}>
                  <Grid container md={12}>
                    <Grid item md={12}>
                      <Switch2
                        onChange={handleCupsOrExp}
                        checked={cupsOrExp}
                        disabled={state !== 0}
                      />
                    </Grid>

                    {!cupsOrExp ?
                      <Grid item md={12} className={classes.input}>
                        <Input
                          fullWidth
                          value={techData.cups}
                          onChange={handleCups}
                          onBlur={checkCupsNumber}
                          error={techDataErrors.cups && techDataErrors.cups.bool}
                          helperText={techDataErrors.cups.bool && techDataErrors.cups.msg}
                          placeholder='ES0000000000000000AA'
                        />
                      </Grid>
                      :
                      <Grid item md={12} className={classes.input}>
                        <Input
                          fullWidth
                          value={techData.expediente}
                          onChange={handleExpediente}
                          onBlur={checkExpedienteNumber}
                          error={techDataErrors.expediente && techDataErrors.expediente.bool}
                          helperText={techDataErrors.expediente.bool && techDataErrors.expediente.msg}
                          placeholder='EXP000000000000'
                        />
                      </Grid>

                    }
                  </Grid>

                </Grid>
              </Grid>
              :
              (techData.expediente ?
                <Typography className={classes.stateLabel}>{techData.expediente}</Typography>
                :
                <Typography className={classes.stateLabel}>{techData.cups}</Typography>
              )
            }
          </Grid>
        }

        {(dossierSubtype === 'DOSSUB002' || dossierSubtype === 'DOSSUB003' || dossierSubtype === 'DOSSUB008') &&
          <Grid container direction='column' className={classes.inputContainer}>
            <Grid item className={classes.label}>
              <Typography>
                {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.secondColumn.input2')}
              </Typography>
            </Grid>

            <Grid item className={classes.input}>
              {state === 0 ?
                <Input
                  fullWidth
                  value={techData.totalBuildingArea}
                  onChange={handleTotalBuildingArea}
                  onBlur={(e) => setTechDataErrors({ ...techDataErrors, totalBuildingArea: { bool: e.target.value === '', msg: t('provisions.newProvision.requestData.supplyType.form.errors.required') } })}
                  error={techDataErrors.totalBuildingArea.bool}
                  helperText={techDataErrors.totalBuildingArea.bool && techDataErrors.totalBuildingArea.msg}
                />
                :
                <Typography className={classes.stateLabel}>{techData.totalBuildingArea}</Typography>
              }
            </Grid>
          </Grid>
        }

        {dossierSubtype === 'DOSSUB009' &&
          <Grid container direction='column' className={classes.inputContainer}>
            <Grid item className={classes.label}>
              <Typography>{t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.secondColumn.input6')}</Typography>
            </Grid>

            <Grid item className={classes.selfConsumptionInput}>
              <Grid container md={12} direction='row' className={classes.marginLeft}>
                <Grid item md={5}>
                  <Switch
                    onChange={handleAssociatedSelfConsumption}
                    checked={techData.associatedSelfConsumption === '0'}
                    disabled={state !== 0}
                  />
                </Grid>
                {techData.associatedSelfConsumption !== '0' &&
                  <Grid item md={7} className={classes.selfConsumptionInfoContainer}>
                    <Grid container md={12}>
                      <Grid item md={2}>
                        <img src={InfoIcon} className={classes.infoIcon} alt='' />
                      </Grid>
                      <Grid item md={10}>
                        {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.secondColumn.input6Info')}
                      </Grid>
                    </Grid>
                  </Grid>
                }
              </Grid>
            </Grid>
          </Grid>
        }
      </Grid >

      {dossierSubtype && dossierSubtype !== 'DOSSUB007' && dossierSubtype !== 'DOSSUB010' && dossierSubtype !== 'DOSSUB009' && dossierSubtype !== 'DOSSUB010' && dossierSubtype !== 'DOSSUB011' && dossierSubtype !== 'DOSSUB012' && dossierSubtype !== 'DOSSUB013' && dossierSubtype !== 'DOSSUB014' &&
        <Grid container md={12} className={classes.electricBox}>

          <Grid container direction='column' md={5} className={classes.inputContainer}>
            <Grid item className={classes.label}>
              <Typography>{t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.firstColumn.input5')}</Typography>
            </Grid>

            <Grid item className={classes.input}>
              <div className={classes.marginLeft}>
                <Switch
                  onChange={handleElectricVehicleChange}
                  checked={techData.electricVehicleCharging === '0'}
                  disabled={state !== 0 || dossierSubtype == 'DOSSUB029' || dossierSubtype == 'DOSSUB030'}
                />
              </div>
            </Grid>
          </Grid>

          <Grid container direction='column' md={2} />

          <Grid container direction='column' md={5} className={classes.inputContainer}>
            <Grid item className={classes.label}>
              <Typography>{t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.secondColumn.input5')}</Typography>
            </Grid>

            <Grid item className={classes.input}>
              <div className={classes.marginLeft}>
                <Switch
                  checked={techData.SPL === '0'}
                  onChange={handleSPL}
                  disabled={state !== 0 || techData.electricVehicleCharging === '0'}
                />
              </div>
            </Grid>
          </Grid>

          {(state === 0 && techData.electricVehicleCharging !== '0') &&
            <Grid container spacing={3}>
              <Grid item className={classes.label2}>
                <Typography>{t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.firstColumn.input6')}</Typography>
              </Grid>
              <Grid item>
                <div
                  className={`radioButton ${classes.radioButton} ${techData.structureSchema === '1' && 'active'}`}
                  onClick={() => {
                    if (tempSelectedState === 1) {
                      setTempSelectedState(0)
                    } else {
                      setTempSelectedState(1)
                    }
                  }}
                />
                <div className={classes.radioButtonText}>{structureSchemaSelectText[0]}</div>
              </Grid>
              <Grid item>
                <div
                  className={`radioButton ${classes.radioButton} ${techData.structureSchema === '2' && 'active'}`}
                  onClick={() => {
                    if (tempSelectedState === 2) {
                      setTempSelectedState(0)
                    } else {
                      setTempSelectedState(2)
                    }
                  }}
                />
                <div className={classes.radioButtonText}>{structureSchemaSelectText[1]}</div>
              </Grid>
              <Grid item>
                <div
                  className={`radioButton ${classes.radioButton} ${techData.structureSchema === '3' && 'active'}`}
                  onClick={() => {
                    if (tempSelectedState === 3) {
                      setTempSelectedState(0)
                    } else {
                      setTempSelectedState(3)
                    }
                  }}
                />
                <div className={classes.radioButtonText}>{structureSchemaSelectText[2]}</div>
              </Grid>
              <Grid item>
                <div
                  className={`radioButton ${classes.radioButton} ${techData.structureSchema === '4' && 'active'}`}
                  onClick={() => {
                    if (tempSelectedState === 4) {
                      setTempSelectedState(0)
                    } else {
                      setTempSelectedState(4)
                    }
                  }}
                />
                <div className={classes.radioButtonText}>{structureSchemaSelectText[3]}</div>
              </Grid>
            </Grid>
          }

          {(state !== 0 && techData.electricVehicleCharging !== '0') &&
            <Grid container spacing={3}>
              <Grid item className={classes.label2}>
                <Typography>{t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.firstColumn.input6')}</Typography>
              </Grid>
              <Grid item>
                <div
                  className={`radioButton ${classes.disabledRadioButton} ${techData.structureSchema === '1' && 'active'}`}
                />
                <div className={classes.radioButtonText}>{structureSchemaSelectText[0]}</div>
              </Grid>
              <Grid item>
                <div
                  className={`radioButton ${classes.disabledRadioButton} ${techData.structureSchema === '2' && 'active'}`}
                />
                <div className={classes.radioButtonText}>{structureSchemaSelectText[1]}</div>
              </Grid>
              <Grid item>
                <div
                  className={`radioButton ${classes.disabledRadioButton} ${techData.structureSchema === '3' && 'active'}`}
                />
                <div className={classes.radioButtonText}>{structureSchemaSelectText[2]}</div>
              </Grid>
              <Grid item>
                <div
                  className={`radioButton ${classes.disabledRadioButton} ${techData.structureSchema === '4' && 'active'}`}
                />
                <div className={classes.radioButtonText}>{structureSchemaSelectText[3]}</div>
              </Grid>
            </Grid>
          }

        </Grid>
      }

      <Grid className={classes.budgetExtensionContainer}>
        {state === 0 ?
          <Grid container className={classes.checkboxContainer2}>
            <Grid item className='checkbox'>
              <Checkbox
                selected={techData.sendExtensionBudgetInd === '1'}
                handleClick={() => {
                  setTechDataI({
                    ...techData,
                    sendExtensionBudgetInd: techData.sendExtensionBudgetInd === '0' ? '1' : '0'
                  })
                  setSendExtensionBudgetInd(techData.sendExtensionBudgetInd === '0' ? '1' : '0')
                }}
              />
            </Grid>
            <Grid item className='label'>
              <span
                onClick={() => {
                  setTechDataI({
                    ...techData,
                    sendExtensionBudgetInd: techData.sendExtensionBudgetInd === '0' ? '1' : '0'
                  })
                  setSendExtensionBudgetInd(techData.sendExtensionBudgetInd === '0' ? '1' : '0')
                }}
              >
                {t('provisions.newGeneration.requestData.technicalData.sendExtensionBudgetCheckbox')}
              </span>
            </Grid>
          </Grid>
          :
          <Grid container direction='column'>
            <Grid item>
              <Typography className={classes.label}>
                {t('provisions.newGeneration.requestData.technicalData.sendExtensionBudgetCheckbox')}
              </Typography>
            </Grid>

            <Grid item>
              <Typography className={classes.stateLabel}>{sendExtensionBudgetInd === '1' ? t('provisions.newGeneration.requestData.technicalData.yes') : sendExtensionBudgetInd === '0' ? t('provisions.newGeneration.requestData.technicalData.no') : (techData.sendExtensionBudgetInd === '0' ? t('provisions.newGeneration.requestData.technicalData.no') : t('provisions.newGeneration.requestData.technicalData.yes'))}</Typography>
            </Grid>
          </Grid>
        }
      </Grid>

      {
        /*dossierSubtype !== 'DOSSUB008' && dossierSubtype !== 'DOSSUB012' && dossierSubtype !== 'DOSSUB013' && dossierSubtype !== 'DOSSUB014' &&*/

        <Grid container className={classes.inputBlock}>
          <div className={classes.label}>
            {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.textArea.title')}
          </div>

          {state === 0 ?
            <>
              <Input
                fullWidth
                multiline
                rows='5'
                value={techData.description}
                onChange={handleDescription}
                className={classes.input}
                inputProps={{
                  maxlength: '300'
                }}
              />

              <Grid container justifyContent='flex-end'>
                <Grid item className={classes.characterCount}>
                  {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.textArea.characters.part1')}

                  {characters}

                  {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.textArea.characters.part2')}
                </Grid>
              </Grid>
            </>
            :
            <Typography className={classes.stateLabel}>
              {showComments(techData.description, techData.observations)}
            </Typography>
          }
        </Grid>
      }
    </>
  )
}

export default Form
