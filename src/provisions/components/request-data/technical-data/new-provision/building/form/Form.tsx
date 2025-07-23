import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import Select from '../../../../../../../common/components/select/Select'
import Switch from '../../../../../../../common/components/switch/Switch'
import Input from '../../../../../../../common/components/input/Input'
import Checkbox from '../../../../../../../supplies/supplies-list/managed-by-me/components/checkbox/Checkbox'
import InfoIcon from '../../../../../../../assets/icons/info.svg'

import useStyles from './Form.styles'
import { useSelector } from 'react-redux'
import { setSelectedSupplyType } from '../../../../../../store/actions/ProvisionsActions'

const Form = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const [idDossierTensionType, setIdDossierTensionType] = useState()
  const [idDossierTensionSubtype, setIdDossierTensionSubtype] = useState()
  const [phase, setPhase] = useState()
  const [idDossierAircondType, setIdDossierAircondType] = useState()
  const [idDossierHeatingType, setIdDossierHeatingType] = useState()

  const [tempSelectedState, setTempSelectedState] = useState(0)

  const [structureSchemaSelectText, setStructureSchemaSelectText] = useState([] as any)

  const dossierSubtype = useSelector((state: any) => state.provisions.dossierSubtype)
  const selectedSupplyType = useSelector((state: any) => state.provisions.selectedSupplyType)

  const [sendExtensionBudgetInd, setSendExtensionBudgetInd] = useState('')

  const {
    state,
    techData,
    setTechDataI,
    techDataErrors,
    setTechDataErrors,
    voltageSupplySelect,
    voltageSelect,
    airConditionerSelect,
    numberOfPhasesSelect,
    heatingSelect,
    isLoadingTensionSubtype,
    isLoadingPhase,
    characters,
    setCharacters,
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
      setIdDossierAircondType(selectValue(airConditionerSelect, techData.idDossierAircondType))
      setPhase(selectValue(numberOfPhasesSelect, techData.phase))
      setIdDossierHeatingType(selectValue(heatingSelect, techData.idDossierHeatingType))
    }
    // eslint-disable-next-line
  }, [state, voltageSupplySelect, voltageSelect, numberOfPhasesSelect, airConditionerSelect, heatingSelect])

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

  const handleAssociatedSelfConsumption = (e) => {
    if (e.target.checked) {
      setTechDataI({ ...techData, associatedSelfConsumption: '0' })
    } else {
      setTechDataI({ ...techData, associatedSelfConsumption: '1' })
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

  // Si los 2 campos de comentarios son diferentes, mostrar la concatenacion de abos
  // Si son iguales, mostrar unicamente uno de ellos
  const showComments = (description: any, observations: any) => {
    let comments = ''
    let observ = ''
    let descript = ''

    if (description !== undefined) {
      descript = description.toString().trim()
    }
    if (observations !== undefined) {
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

    setTechDataI({ ...techData, structureSchema: tempSelectedState.toString() })

  }, [tempSelectedState])


  return (
    <Grid container className={classes.formPadding}>
      <Grid container direction='column' md={5}>
        {dossierSubtype !== 'DOSSUB001' &&
          <Grid container direction='column' className={classes.inputContainer}>
            <Grid item className={classes.label}>
              <Typography>{t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.firstColumn.input1')}</Typography>
            </Grid>

            <Grid item className={classes.input}>
              {state === 0 ?
                <Select
                  fullWidth
                  label={t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.selectLabel.voltageSupply')}
                  value={techData.idDossierTensionType}
                  values={voltageSupplySelect}
                  codFiltering
                  onChange={(e) => setTechDataI({ ...techData, idDossierTensionType: e.target.value })}
                  onBlur={(e) => setTechDataErrors({ ...techDataErrors, idDossierTensionType: { bool: e.target.value === '', msg: t('provisions.newProvision.requestData.supplyType.form.errors.required') } })}
                  helperText={techDataErrors.idDossierTensionType.bool && techDataErrors.idDossierTensionType.msg}
                  error={techDataErrors.idDossierTensionType.bool}
                />
                :
                <Typography className={classes.stateLabel}>{idDossierTensionType}</Typography>
              }
            </Grid>
          </Grid>
        }

        {dossierSubtype !== 'DOSSUB001' &&
          <Grid container direction='column' className={classes.inputContainer}>
            <Grid item className={classes.label}>
              <Typography>{t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.firstColumn.input2')}</Typography>
            </Grid>

            <Grid item className={classes.input}>
              {state === 0 ?
                <Select
                  fullWidth
                  label={t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.selectLabel.voltage')}
                  codFiltering
                  value={techData.idDossierTensionSubtype}
                  values={voltageSelect}
                  onChange={(e) => setTechDataI({ ...techData, idDossierTensionSubtype: e.target.value })}
                  onBlur={(e) => setTechDataErrors({ ...techDataErrors, idDossierTensionSubtype: { bool: e.target.value === '', msg: t('provisions.newProvision.requestData.supplyType.form.errors.required') } })}
                  helperText={techDataErrors.idDossierTensionSubtype.bool && techDataErrors.idDossierTensionSubtype.msg}
                  error={techDataErrors.idDossierTensionSubtype.bool}
                  disabled={!techData.phase}
                  isLoading={isLoadingTensionSubtype}
                />
                :
                <Typography className={classes.stateLabel}>{idDossierTensionSubtype}</Typography>
              }
            </Grid>
          </Grid>
        }

        {dossierSubtype !== 'DOSSUB001' && !(dossierSubtype === 'DOSSUB006' && selectedSupplyType === 'UNR') &&
          <Grid container direction='column' className={classes.inputContainer}>
            <Grid item className={classes.label}>
              <Typography>{t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.firstColumn.input3')}</Typography>
            </Grid>

            <Grid item className={classes.input}>
              {state === 0 ?
                <Select
                  fullWidth
                  codFiltering
                  label={t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.selectLabel.default')}
                  value={techData.idDossierAircondType}
                  values={airConditionerSelect}
                  onChange={(e) => setTechDataI({ ...techData, idDossierAircondType: e.target.value })}
                />
                :
                <Typography className={classes.stateLabel}>{idDossierAircondType}</Typography>
              }
            </Grid>
          </Grid>
        }

        {dossierSubtype !== 'DOSSUB031' && dossierSubtype !== 'DOSSUB001' && dossierSubtype !== 'DOSSUB006' && dossierSubtype !== 'DOSSUB005' &&
          <Grid container direction='column' className={classes.inputContainer}>
            <Grid item className={classes.label}>
              <Typography>{t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.firstColumn.input4')}</Typography>
            </Grid>

            <Grid item className={classes.input}>
              {state === 0 ?
                <Select
                  fullWidth
                  label={t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.selectLabel.voltage')}
                  codFiltering
                  value={techData.idDossierTensionSubtype}
                  values={voltageSelect}
                  onChange={(e) => setTechDataI({ ...techData, idDossierTensionSubtype: e.target.value })}
                  onBlur={(e) => setTechDataErrors({ ...techDataErrors, idDossierTensionSubtype: { bool: e.target.value === '', msg: t('provisions.newProvision.requestData.supplyType.form.errors.required') } })}
                  helperText={techDataErrors.idDossierTensionSubtype.bool && techDataErrors.idDossierTensionSubtype.msg}
                  error={techDataErrors.idDossierTensionSubtype.bool}
                  disabled={!techData.phase}
                  isLoading={isLoadingTensionSubtype}
                />
                :
                <Typography className={classes.stateLabel}>Gas natural</Typography>
              }
            </Grid>
          </Grid>
        }

        {dossierSubtype !== 'DOSSUB031' && dossierSubtype !== 'DOSSUB001' && dossierSubtype !== 'DOSSUB006' && dossierSubtype !== 'DOSSUB005' &&
          <Grid container direction='column' className={classes.inputContainer}>
            <Grid item className={classes.label}>
              <Typography>{t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.firstColumn.input4')}</Typography>
            </Grid>

            <Grid item className={classes.input}>
              <div className={classes.marginLeft}>
                <Switch
                  onChange={handleElectricVehicleChange}
                  checked={techData.electricVehicleCharging === '0'}
                  disabled={state !== 0}
                />
              </div>
            </Grid>
          </Grid>
        }

        {dossierSubtype !== 'DOSSUB031' && dossierSubtype !== 'DOSSUB001' &&
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
      <Grid container direction='column' md={2} />
      <Grid container direction='column' md={5}>
        {dossierSubtype !== 'DOSSUB001' &&
          <Grid container direction='column' className={classes.inputContainer}>
            <Grid item className={classes.label}>
              <Typography>{t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.secondColumn.input1')}</Typography>
            </Grid>

            <Grid item className={classes.input}>
              {state === 0 ?
                <Select
                  fullWidth
                  label={t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.selectLabel.numberOfPhases')}
                  value={techData.phase}
                  values={numberOfPhasesSelect}
                  codFiltering
                  onChange={(e) => setTechDataI({ ...techData, phase: e.target.value })}
                  onBlur={(e) => setTechDataErrors({ ...techDataErrors, phase: { bool: e.target.value === '', msg: t('provisions.newProvision.requestData.supplyType.form.errors.required') } })}
                  error={techDataErrors.phase.bool}
                  helperText={techDataErrors.phase.bool && techDataErrors.phase.msg}
                  disabled={!techData.idDossierTensionType}
                  isLoading={isLoadingPhase}
                />
                :
                <Typography className={classes.stateLabel}>{phase}</Typography>
              }
            </Grid>
          </Grid>
        }

        {dossierSubtype !== 'DOSSUB001' && !(dossierSubtype === 'DOSSUB006' && selectedSupplyType === 'UNR') &&
          <Grid container direction='column' className={classes.inputContainer}>
            <Grid item className={classes.label}>
              <Typography>{t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.secondColumn.input2')}</Typography>
            </Grid>

            <Grid item className={classes.input}>
              {state === 0 ?
                <Select
                  fullWidth
                  codFiltering
                  label={t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.selectLabel.default')}
                  value={techData.idDossierHeatingType}
                  values={heatingSelect}
                  onChange={(e) => setTechDataI({ ...techData, idDossierHeatingType: e.target.value })}
                />
                :
                <Typography className={classes.stateLabel}>{idDossierHeatingType}</Typography>
              }
            </Grid>
          </Grid>
        }
        {dossierSubtype !== 'DOSSUB031' && dossierSubtype !== 'DOSSUB001' && dossierSubtype !== 'DOSSUB006' && dossierSubtype !== 'DOSSUB005' &&
          //ppm 1007821 - inicio arriba
          <Grid container direction='column' className={classes.inputContainer}>
            <Grid item className={classes.label}>
              <Typography>{t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.secondColumn.input4')}</Typography>
            </Grid>

            <Grid item className={classes.input}>
              <div className={classes.marginLeft}>
                <Switch
                  onChange={handleSPL}
                  checked={techData.SPL === '0'}
                  disabled={state !== 0 || techData.electricVehicleCharging === '0'}
                />
              </div>
            </Grid>
          </Grid>
        }
      </Grid>

      {dossierSubtype !== 'DOSSUB031' && dossierSubtype !== 'DOSSUB001' &&
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
                  disabled={state !== 0}
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

      <Grid container direction='column' className={classes.inputBlock}>
        <Grid item className={classes.label}>
          <Typography>
            {t('provisions.newProvision.requestData.supplyType.modification.labels.comment')}
          </Typography>
        </Grid>

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
          <Grid item direction='column' className={classes.stateLabel}>
            <Typography>
              {showComments(techData.description, techData.observations)}
            </Typography>
          </Grid>
        }
      </Grid>
    </Grid>
  )
}

export default Form
