import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import TechnicalDataIcon from '../../../../../assets/icons/datos_tecnicos.svg'

import Select from '../../../../../common/components/select/Select'
import Input from '../../../../../common/components/input/Input'
import InputNumeric from '../../../../../common/components/input-numeric/InputNumeric'
import Checkbox from '../../../../../supplies/supplies-list/managed-by-me/components/checkbox/Checkbox'

import NotNecessaryAdvise from './not-necessary-advise/NotNecessaryAdvise'

import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'

import { setTechData, setPowerList } from '../../../../store/actions/ProvisionsActions'
import { thunkGetMasterData } from '../../../../store/actions/ProvisionsThunkActions'
import { thunkListSupplies } from '../../../../../supplies/supplies-list/store/actions/SuppliesListThunkActions'

import useStyles, {
  ExpansionPanel,
  ExpansionPanelSummary,
  StyledExpandMoreIcon,
  ExpansionPanelDetails
} from './TechnicalData.styles'
import MosaicItem from '../new-provision/family/power-table/mosaic-item/MosaicItem'
import ListItem from '../new-provision/family/power-table/list-item/ListItem'
import PowerTable from './PowerTable/PowerTable'

const TechnicalData = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [sendExtensionBudgetInd, setSendExtensionBudgetInd] = useState('')
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down(1150))

  const {
    state,
    notNecessary,
    setErrorCheck,
    isEmpty,
    setIsEmpty,
    setIsLoading,
    setShowDialog
  } = props

  const user = useSelector((state: any) => state.user)
  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)
  const suppliesList = useSelector((state: any) => state.supplies.list)
  const modificationCups = useSelector((state: any) => state.provisions.modificationCups)
  const userToken = useSelector((state: any) => state.user.token)

  const [voltageSupplySelect, setVoltageSupplySelect] = useState([] as any)

  const [voltageSelect, setVoltageSelect] = useState([] as any)

  const [idDossierTensionType, setIdDossierTensionType] = useState('')
  const [idDossierTensionSubtype, setIdDossierTensionSubtype] = useState('')
  const [numberOfPhasesSelect, setNumberOfPhasesSelect] = useState([] as any)
  const [phase, setPhase] = useState('')
  const [characters, setCharacters] = useState(300)
  const [isLoadingTensionType, setIsLoadingTensionType] = useState(false)
  const [supply, setSupply] = useState([] as any)
  const [existingPower, setExistingPower] = useState('')

  /* Si hay una provision vigente se cargan los datos en los formularios */
  const getDefaultTechData = () => {
    let techDataDefault = {} as any
    if (currentProvision && currentProvision.techData) {
      techDataDefault = currentProvision.techData
      techDataDefault = {
        ...techDataDefault,
        sendExtensionBudgetInd: currentProvision.valoration.sendExtensionBudgetInd
      }
    } else {
      let cups = modificationCups.cups ? modificationCups.cups : ''

      if (cups && cups !== '') {
        if (cups.substring(cups.length - 2, cups.length) !== '1P') {
          cups = cups + '1P'
        }
      }

      techDataDefault = {
        idDossierTensionType: '',
        idDossierTensionSubtype: '',
        phase: '',
        totalPower: '0',
        cups,
        sendExtensionBudgetInd: '0',
      }
    }
    return techDataDefault
  }



  /* --- DATA --- */
  const [techData, setTechDataI] = useState(getDefaultTechData())

  const [powerList, setPowerListI] = useState([
    {
      numberOfSupplies: '1',
      requestPower: '',
      subtotalPower: ''
    }
  ])

  /* --- ERRORS --- */
  const [techDataErrors, setTechDataErrors] = useState({
    idDossierTensionType: { bool: false, msg: '' },
    idDossierTensionSubtype: { bool: false, msg: '' },
    phase: { bool: false, msg: '' },
    totalPower: { bool: false, msg: '' }
  } as any)

  const [powerListErrors, setPowerListErrors] = useState([
    {
      requestPower: { bool: false, msg: '' },
      subtotalPower: { bool: false, msg: '' }
    }
  ] as any)

  useEffect(() => {
    dispatch(setTechData(techData))

    dispatch(setPowerList(powerList))
  }, [dispatch, techData, powerList])

  // Cargar datos a suppliesList si no estan ya cargados para coger los datos del Cups asociado
  useEffect(() => {
    if (state > 2) {
      if (user.token !== '' && user.profile.documentNumber) {
        if (suppliesList.length === 0) {
          const supplyPointDefaultName = t('delegations.supplyPointDefaultName')

          setIsLoading(true)

          // llamada al servicio listSupplies
          dispatch(thunkListSupplies(
            supplyPointDefaultName,
            //1, // offset
            //1, // limit
            //techData.cups, // búsqueda por cups
            //false, // proveniente de cupsSearch para la busqueda
            //0, // offset [delegatePoints]
            //15, // limit [delegatePoints]
            false, // proveniente de cupsSearch para la busqueda [delegatePoints]
            true, // accion contra supplyPoints
            true, // accion contra delegatePoints
            (response) => {
              // callback
              if (response && response.supplypoints && response.supplypoints.length > 0) {
                const supplie = response.supplypoints.filter(item => item.cups === techData.cups)[0]

                setExistingPower(supplie && supplie.maxAuthorizedVoltage)
              }
            }))
        } else {
          const supplie = suppliesList.filter(item => item.cups === techData.cups)[0]

          setExistingPower(supplie && supplie.maxAuthorizedVoltage)
        }
      }
    }
    // eslint-disable-next-line
  }, [user, state])

  useEffect(() => {
    
    if (suppliesList) {
      const supply = suppliesList.filter(item => item.cups === modificationCups.cups)
      setSupply(supply)
    }
   
  }, [modificationCups,suppliesList])

  const getAndSetMasterData = (key: string, setSelect: any, keyToApplyRemoveItem?: string, removeItem?: number) => {
    setIsLoadingTensionType(true)

    dispatch(thunkGetMasterData('DossierDatosTecnicos', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), key, (response) => {
      if (response) {
        setSelect(response.map(item => item.value).filter((item, index) => {
          if (keyToApplyRemoveItem && key === keyToApplyRemoveItem) {
            return index !== removeItem
          }

          return true
        }))
      }

      setIsLoadingTensionType(false)
    }))
  }

  const selectValue = (select: any, value: any) => {
    const keyValue = select.filter(item => item.substring(0, item.indexOf('|')) === value)

    return keyValue && keyValue[0] && keyValue[0].substring(keyValue[0].indexOf('|') + 1, keyValue[0].length)
  }

  useEffect(() => {
    if (userToken) {
      getAndSetMasterData('DT_TENSION_SUM', setVoltageSupplySelect)
    }
    // eslint-disable-next-line
  }, [userToken])


  useEffect(() => {
    if (techData.idDossierTensionType) {
      const key = 'DT_FASES_' + techData.idDossierTensionType

      getAndSetMasterData(key, setNumberOfPhasesSelect)

      setTechDataI({ ...techData, phase: '' })
    }
    // eslint-disable-next-line
  }, [techData.idDossierTensionType])

  useEffect(() => {
    if (techData.phase && !currentProvision.techData) {
      const key = 'DT_TENSION_' + techData.idDossierTensionType + '_' + techData.phase

      getAndSetMasterData(key, setVoltageSelect, 'tension')

      setTechDataI({ ...techData, idDossierTensionSubtype: '' })
    }
    // eslint-disable-next-line
  }, [techData.phase])

  // Carga de los selects en modo readOnly
  useEffect(() => {
    if (currentProvision
      && state >= 2
      && voltageSupplySelect.length === 0
      && numberOfPhasesSelect.length === 0
      && voltageSelect.length === 0
      
    ) {
      setIsLoading(true)
      getAndSetMasterData('DT_TENSION_SUM', setVoltageSupplySelect)
      getAndSetMasterData('DT_TENSION_VOL', setVoltageSelect)
      getAndSetMasterData('DT_FASES', setNumberOfPhasesSelect)
      setIsLoading(false)
    }
    // eslint-disable-next-line
  }, [state, currentProvision, voltageSelect,voltageSupplySelect, numberOfPhasesSelect])

  useEffect(() => {
    if ((state >= 1 && state < 2) || notNecessary) {
      setIdDossierTensionType(selectValue(voltageSupplySelect, techData.idDossierTensionType))
      setPhase(selectValue(numberOfPhasesSelect, techData.phase))
    } else if (state > 2) {
      setIdDossierTensionType(selectValue(voltageSupplySelect, currentProvision.idTensionType))
      setPhase(selectValue(numberOfPhasesSelect, currentProvision.idDossierPhaseType))
    }
    // eslint-disable-next-line
  }, [state, notNecessary, voltageSupplySelect, numberOfPhasesSelect])

  // Si viene un solo item se setea como defecto en el nuevo select cargado
  useEffect(() => {
    if (!currentProvision.techData) {
      if (numberOfPhasesSelect.length === 1) {
        setTechDataI({ ...techData, phase: numberOfPhasesSelect[0].split('|')[0] })

        setTechDataErrors({ ...techDataErrors, phase: { bool: false, msg: '' } })
      } else {
        setTechDataI({ ...techData, phase: '' })
      }
    }
    // eslint-disable-next-line
  }, [numberOfPhasesSelect])

  const handleDescription = (e) => {
    setTechDataI({
      ...techData,
      description: e.target.value,
      observations: e.target.value
    })

    setCharacters(300 - e.target.value.length)

    if (e.target.value === '') {
      const aux = techData

      delete aux.description
      delete aux.observations

      setTechDataI(aux)
    }
  }

  useEffect(() => {
    // Comprobar si hay errores en el formulario
    if (Object.keys(techDataErrors).filter((key) => techDataErrors[key].bool).length > 0) {
      setErrorCheck(true)
    } else {
      setErrorCheck(false)
    }
    if (Object.keys(powerListErrors).filter((key) => powerListErrors[key].bool).length > 0) {
      setErrorCheck(true)
    } else {
      setErrorCheck(false)
    }
    // Comprobar si el formulario esta rellenado
    if (Object.keys(techData).filter((key) => techData[key] === '' || (key === 'totalPower' && techData[key] === '0')).length === 0) {
      setIsEmpty(false)
    }
    else {
      setIsEmpty(true)
    }

    // eslint-disable-next-line
  }, [techData, techDataErrors, powerListErrors])

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

  const checkPowerRequested = (e) => {
    let check
    let msg
    let validExt = currentProvision && currentProvision.powerList && currentProvision.powerList[0] && currentProvision.powerList[0].promPaidPower ? currentProvision.powerList[0].promPaidPower : modificationCups.validExtentRights

    if (e.target.value === '' || e.target.value === '0') {
      check = true
      msg = t('provisions.newProvision.requestData.supplyType.form.errors.requiredAndNotZero')
    } else if (validExt > 0 && techData.totalPower > (validExt * 10)) {
      check = false
      //setDialogText(t('provisions.newProvision.requestData.supplyType.form.errors.powerHigh2'))
      setShowDialog(true)
    } else if (techData.totalPower > (modificationCups.maxAuthorizedVoltage * 10)) {
      check = false
      //setDialogText(t('provisions.newProvision.requestData.supplyType.form.errors.powerHigh3'))
      setShowDialog(true)
    } else {
      check = false
    }

    setTechDataErrors({
      ...techDataErrors,
      totalPower: {
        bool: check,
        msg: msg
      }
    })
    setPowerListErrors(powerListErrors.map(item => {
      return {
        requestPower: { bool: check, msg: msg },
        subtotalPower: { bool: check, msg: msg }
      }
    }))
  }

  const handlePowerRequested = (e) => {
    let power = e.target.value.replace(',', '.')

    if (power.includes('.')) {
      const auxValue = power.split('.')
      if (auxValue[1].length > 3) {
        power = auxValue[0] + '.' + auxValue[1].substring(0, 3)

        let check = true
        let msg = t('provisions.newProvision.requestData.supplyType.form.errors.decimals')

        setTechDataErrors({
          ...techDataErrors,
          totalPower: {
            bool: check,
            msg: msg
          }
        })
      } else {
        let check = false
        let msg = ''

        setTechDataErrors({
          ...techDataErrors,
          totalPower: {
            bool: check,
            msg: msg
          }
        })
      }
    }

    if (!isNaN(power)) {
      setTechDataI({ ...techData, totalPower: power })
      setPowerListI(powerList.map(item => {
        return {
          ...item,
          requestPower: power,
          subtotalPower: power
        }
      }))
    }
  }

  return (
    <>
      {
        notNecessary &&
        <NotNecessaryAdvise />
      }

      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
          <img className={classes.expansionPanelSummaryIcon} src={TechnicalDataIcon} alt='' />

          <Typography className={classes.expansionPanelSummaryText}>{t('provisions.newProvision.requestData.supplyType.dataType.technicalInstallationData')}</Typography>
        </ExpansionPanelSummary>

        <ExpansionPanelSummary className='colored'>
          <Grid container direction='column' className={classes.summaryContainer}>
            <Grid container className={classes.marginBottomMobile}>
              <Grid item md={3} className={classes.textAlignRight}>
                <span>{t('provisions.newProvision.requestData.supplyType.modification.type')}</span>
              </Grid>

              <Grid item>
                <strong>{t('provisions.newProvision.requestData.supplyType.modification.types.powerChange')}</strong>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item md={3} className={classes.textAlignRight}>
                <span >{t('provisions.newProvision.requestData.supplyType.modification.address')}</span>
              </Grid>

              <Grid item>
                <strong className={classes.addressLabel}>
                  {
                    state <= 2 ?
                      modificationCups.address
                      :
                      currentProvision.streetType + ' ' + currentProvision.streetName + ' ' + currentProvision.num + ' ' + currentProvision.stair + ' ' + currentProvision.floor + ' ' + currentProvision.door + ' ' + currentProvision.addressDescription
                  }
                </strong>
              </Grid>
            </Grid>
          </Grid>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          <Grid container direction='column'>
            <Grid container spacing={2} direction='column'>
              <Grid item>
                <Typography className={classes.label}>
                  {t('provisions.newProvision.requestData.supplyType.modification.labels.cups')}
                </Typography>
              </Grid>

              <Grid item>
                <Typography className={classes.text}>
                  {state <= 2 ? modificationCups.cups : techData.cups}
                </Typography>
              </Grid>

              <Grid className={classes.separator} />
            </Grid>

            <Grid container spacing={2} direction='column'>
              <Grid item>
                <Typography className={classes.label}>
                  {t('provisions.newProvision.requestData.supplyType.modification.labels.actualData')}
                </Typography>
              </Grid>
              {
                state <= 2 &&
                <>
                  <Grid container spacing={2} direction='row' className={classes.topMarginContainer}>
                    <Grid item xs={5} sm={5} md={5}>
                      <Typography>
                        {t('provisions.newProvision.requestData.supplyType.modification.labels.validExtentRights')}
                      </Typography>
                    </Grid>
                    <Grid item xs={5} sm={5} md={5}>
                      <Typography>
                        {t('provisions.newProvision.requestData.supplyType.modification.labels.voltage')}
                      </Typography>
                    </Grid>

                    <Grid item xs={5} sm={5} md={5}>
                      <Typography className={classes.text}>
                        {currentProvision && currentProvision.powerList && currentProvision.powerList[0] && currentProvision.powerList[0].promPaidPower ? Number(currentProvision.powerList[0].promPaidPower).toFixed(2).replace('.', ',') : Number(modificationCups.validExtentRights).toFixed(2).replace('.', ',')}
                      </Typography>
                    </Grid>
                    <Grid item xs={5} sm={5} md={5} >
                      <Typography className={classes.text}>
                        {supply && supply[0] && supply[0].voltage}
                      </Typography>
                    </Grid>

                  </Grid>

                  <Grid container spacing={2} direction='row' className={classes.topMarginContainer}>
                    <Grid item xs={5} sm={5} md={5} >
                      <Typography>
                        {t('provisions.newProvision.requestData.supplyType.modification.labels.CIEApprovalDate')}
                      </Typography>
                    </Grid>

                    <Grid item xs={5} sm={5} md={5}  >
                      <Typography>
                        {t('provisions.newProvision.requestData.supplyType.modification.labels.instalationType')}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} direction='row' className={classes.topMarginContainerv2}>

                    <Grid item xs={5} sm={5} md={5}>
                      <Typography className={classes.text}>
                        {modificationCups.CIEApprovalDate}
                      </Typography>
                    </Grid>

                    <Grid item xs={5} sm={5} md={5}>
                      <Typography className={classes.text}>
                        {supply && supply[0] && supply[0].installationType}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12}>
                      <Typography>
                        {t('provisions.newProvision.requestData.supplyType.modification.labels.maxAuthorizedVoltage')}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12}>
                      <Typography className={classes.text}>
                        {currentProvision && currentProvision.powerList && currentProvision.powerList[0] && currentProvision.powerList[0].promPaidPower ? Number(currentProvision.powerList[0].promPaidPower).toFixed(2).replace('.', ',') : Number(modificationCups.maxAuthorizedVoltage).toFixed(2).replace('.', ',')}
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              }

              <Grid className={classes.separator} />
            </Grid>

            <Grid container spacing={2} direction='column' className={classes.inputContainer}>
              <Grid item>
                <Typography className={classes.label}>
                  {t('provisions.newProvision.requestData.supplyType.modification.labels.powerData')}
                </Typography>
              </Grid>


              <Grid container justifyContent='space-between'>
                <Grid item md={5} xs={12}>
                  <Grid container spacing={1} direction='column' className={classes.inputContainer}>
                    <Grid item>
                      <Typography>
                        {t('provisions.newProvision.requestData.supplyType.modification.labels.tensionSupplie')}
                      </Typography>
                    </Grid>
                    <Grid item className={classes.input}>
                      {
                        state === 0 && !notNecessary ?
                          <Select
                            fullWidth
                            codFiltering
                            values={voltageSupplySelect}
                            value={techData.idDossierTensionType}
                            label={t('provisions.newProvision.requestData.supplyType.modification.labels.selects.default')}
                            onChange={(e) => setTechDataI({ ...techData, idDossierTensionType: e.target.value })}
                            onBlur={(e) => setTechDataErrors({ ...techDataErrors, idDossierTensionType: { bool: e.target.value === '', msg: t('provisions.newProvision.requestData.supplyType.form.errors.required') } })}
                            helperText={techDataErrors.idDossierTensionType.bool && techDataErrors.idDossierTensionType.msg}
                            error={techDataErrors.idDossierTensionType.bool}
                          />
                          :
                          <Typography className={classes.text}>{idDossierTensionType}</Typography>
                      }
                    </Grid>
                  </Grid>
                </Grid>



                <Grid item md={5} xs={12}>
                  <Grid container spacing={1} direction='column' className={classes.inputContainer}>
                    <Grid item>
                      <Typography>
                        {t('provisions.newProvision.requestData.supplyType.modification.labels.phases')}
                      </Typography>
                    </Grid>

                    <Grid item className={classes.input}>
                      {
                        state === 0 && !notNecessary ?
                          <Select
                            fullWidth
                            codFiltering
                            values={numberOfPhasesSelect}
                            value={techData.phase}
                            label={t('provisions.newProvision.requestData.supplyType.modification.labels.selects.default')}
                            onChange={(e) => setTechDataI({ ...techData, phase: e.target.value })}
                            onBlur={(e) => setTechDataErrors({ ...techDataErrors, phase: { bool: e.target.value === '', msg: t('provisions.newProvision.requestData.supplyType.form.errors.required') } })}
                            helperText={techDataErrors.phase.bool && techDataErrors.phase.msg}
                            error={techDataErrors.phase.bool}
                            disabled={!techData.idDossierTensionType}
                            isLoading={isLoadingTensionType}
                          />
                          :
                          <Typography className={classes.text}>{phase}</Typography>
                      }
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={12} xs={12}>
                  <Grid item md={5} xs={12}>
                    <Grid container spacing={1} direction='column' className={classes.inputContainer}>
                      <Grid item>
                        <Typography>
                          {t('provisions.newProvision.requestData.supplyType.modification.labels.tension')}
                        </Typography>
                      </Grid>

                      <Grid item className={classes.input}>
                        {
                          state === 0 && !notNecessary ?
                            // MODIFICAR
                            <Select
                              fullWidth
                              codFiltering
                              values={voltageSelect}
                              value={techData.idDossierTensionSubtype}
                              label={t('provisions.newProvision.requestData.supplyType.modification.labels.selects.selectVoltage')}
                              onChange={(e) => setTechDataI({ ...techData, idDossierTensionSubtype: e.target.value })}
                              onBlur={(e) => setTechDataErrors({ ...techDataErrors, idDossierTensionSubtype: { bool: e.target.value === '', msg: t('provisions.newProvision.requestData.supplyType.form.errors.required') } })}
                              helperText={techDataErrors.idDossierTensionSubtype.bool && techDataErrors.phase.msg}
                              error={techDataErrors.idDossierTensionSubtype.bool}
                              disabled={!techData.idDossierTensionType}
                              isLoading={isLoadingTensionType}
                            />
                            :
                            <Typography className={classes.text}>{phase}</Typography>
                        }

                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                {/* <Grid item md={5} xs={12}>
                  <Grid container spacing={1} direction='column' className={classes.inputContainer}>
                    <Grid item>
                      <Typography>
                        {t('provisions.newProvision.requestData.supplyType.modification.labels.finca')}
                      </Typography>
                    </Grid>

                    {/* <Grid item className={classes.input}>
                      {
                        state === 0 && !notNecessary ?
                          // MODIFICAR-FALTA RESUPESTA
                          <Select
                            fullWidth
                            codFiltering
                            values={numberOfPhasesSelect}
                            value={techData.phase}
                            label={t('provisions.newProvision.requestData.supplyType.modification.labels.selects.default')}
                            onChange={(e) => setTechDataI({ ...techData, phase: e.target.value })}
                            onBlur={(e) => setTechDataErrors({ ...techDataErrors, phase: { bool: e.target.value === '', msg: t('provisions.newProvision.requestData.supplyType.form.errors.required') } })}
                            helperText={techDataErrors.phase.bool && techDataErrors.phase.msg}
                            error={techDataErrors.phase.bool}
                            disabled={!techData.idDossierTensionType}
                            isLoading={isLoadingTensionType}
                          />
                          :
                          <Typography className={classes.text}>{phase}</Typography>
                      }

                    </Grid> 
                  </Grid>
                </Grid> */}

                {
                  state === 0 ?
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
                    <Grid className={classes.budgetExtension}>
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
                    </Grid>
                }

              </Grid>
            </Grid>



            <Grid container className={classes.inputContainer}>
              <Grid container spacing={1} direction='column'>
                <Grid item>
                  <Typography>
                    {t('provisions.newProvision.requestData.supplyType.modification.labels.comment')}
                  </Typography>
                </Grid>

                <Grid item className={classes.input}>
                  {
                    state === 0 && !notNecessary ?
                      <>
                        <Input
                          fullWidth
                          multiline
                          rows='5'
                          value={techData.description}
                          onChange={handleDescription}
                          inputProps={{
                            maxlength: '300'
                          }}
                        />

                        <Grid container justifyContent='flex-end'>
                          <Grid item className={classes.characterCount}>
                            {t('provisions.newProvision.requestData.supplyType.modification.labels.characters.part1')}

                            <strong>{characters}</strong>

                            {t('provisions.newProvision.requestData.supplyType.modification.labels.characters.part2')}

                            <strong>
                              {t('provisions.newProvision.requestData.supplyType.modification.labels.characters.part3')}
                            </strong>
                          </Grid>
                        </Grid>
                      </>
                      :
                      <Typography className={classes.text}>
                        {showComments(techData.description, techData.observations)}
                      </Typography>
                  }
                </Grid>
              </Grid>
            </Grid>

            <Grid container>
              <div className={classes.tableTitle}>{t('provisions.newProvision.requestData.supplyType.modification.table.title')}</div>
              <PowerTable
                state={state}
                techData={techData}
                setTechDataI={setTechDataI}
                mobile={mobile}
                powerList={powerList}
                setPowerListI={setPowerListI}
                suppliesList={supply}
                notNecessary={notNecessary}
                checkPowerRequested={checkPowerRequested}
                techDataErrors={techDataErrors}
              />
            </Grid>

          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </>
  )
}

export default TechnicalData
