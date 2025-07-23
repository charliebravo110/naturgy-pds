import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Grid from '@material-ui/core/Grid'

import IconTextButton from '../../../../../../common/components/icon-text-button/IconTextButton'

import PowerTable from './power-table/PowerTable'
import Form from './form/Form'

import AddIcon from '../../../../../../assets/icons/plus_thicker.svg'

import { setTechData, setPowerList } from '../../../../../store/actions/ProvisionsActions'
import { thunkGetMasterData } from '../../../../../store/actions/ProvisionsThunkActions'

import useStyles from './Group.styles'

const Group = (props: any) => {
  const classes = useStyles({})
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down(1150))
  const dispatch = useDispatch()
  const { t } = useTranslation()


  const {
    state,
    setErrorCheck,
    setIsEmpty,
    oneSupplie,
    setIsLoading,
    setShowDialog,
    setDialogText
  } = props

  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)

  const userToken = useSelector((state: any) => state.user.token)
  const dossierSubtype = useSelector((state: any) => state.provisions.dossierSubtype)

  const [voltageSupplySelect, setVoltageSupplySelect] = useState([] as any)
  const [voltageSelect, setVoltageSelect] = useState([] as any)
  const [numberOfPhasesSelect, setNumberOfPhasesSelect] = useState([] as any)
  const [structureSchemaSelect, setStructureSchemaSelect] = useState([] as any)
  const [typesSelect, setTypesSelect] = useState([] as any)
  const [characters, setCharacters] = useState(300)
  const [totalPowerRequested, setTotalPowerRequested] = useState(0)
  const [isLoadingTensionSubtype, setIsLoadingTensionSubtype] = useState(false)
  const [isLoadingPhase, setIsLoadingPhase] = useState(false)
  const [electricVehicleCheck, setElectricVehicleCheck] = useState(true)
  const [fechasConexion, setFechasConexion] = useState(true)
  const [cupsOrExpediente, setCupsOrExpediente] = useState(true)

  const techDataDefault = () => {
    let techDataDefault = {} as any
    if (currentProvision && currentProvision.techData) {
      techDataDefault = currentProvision.techData
      techDataDefault = {
        ...techDataDefault,
        idDossierTensionType: currentProvision.idTensionType,
        idDossierTensionSubtype: currentProvision.techData.idDossierTensionSubtype,
        phase: currentProvision.idDossierPhaseType,
        sendExtensionBudgetInd: currentProvision.valoration.sendExtensionBudgetInd
      }
    } else if (dossierSubtype === 'DOSSUB008') {
      //con esquema SLP/VE
      techDataDefault = {
        SPL: '0',
        electricVehicleCharging: '0',
        structureSchema: '',
        idDossierTensionType: '',
        idDossierTensionSubtype: '',
        phase: '',
        totalBuildingArea: '',
        // existingAco: '0',
        timeDiscrimination: '0',
        sendExtensionBudgetInd: '0',
        associatedSelfConsumption:'0',
      }
    } else if (dossierSubtype === 'DOSSUB002' || dossierSubtype === 'DOSSUB003') {
      //con esquema SLP/VE
      techDataDefault = {
        SPL: '0',
        electricVehicleCharging: '0',
        structureSchema: '',
        idDossierTensionType: '',
        idDossierTensionSubtype: '',
        phase: '',
        totalBuildingArea: '',
        timeDiscrimination: '0',
        sendExtensionBudgetInd: '0',
        associatedSelfConsumption:'0',
      }
    }
    else if ((dossierSubtype === 'DOSSUB010')) {
      //sin esquema SLP/VE
      techDataDefault = {
        idDossierTensionType: '',
        idDossierTensionSubtype: '',
        phase: '',
        timeDiscrimination: '0',
        sendExtensionBudgetInd: '0',
        expected_date_connection: '',
        expected_date_desconnection: ''
      }
    }
    else if ((dossierSubtype === 'DOSSUB012' || dossierSubtype === 'DOSSUB013' || dossierSubtype === 'DOSSUB014')) {
      //sin esquema SLP/VE
      techDataDefault = {
        idDossierTensionType: '',
        idDossierTensionSubtype: '',
        phase: '',
        timeDiscrimination: '0',
        cups: '',
        expediente: ''
      }
    }
    else if ((dossierSubtype === 'DOSSUB011')) {
      //sin esquema SLP/VE
      techDataDefault = {
        idDossierTensionType: '',
        associatedSelfConsumption:'0',
        idDossierTensionSubtype: '',
        phase: '',
        timeDiscrimination: '0',
        cups: '',
        expediente: '',
        finalPs: '0',

      }
    }
    else if ((dossierSubtype === 'DOSSUB007')) {
      //sin esquema SLP/VE
      techDataDefault = {
        idDossierTensionType: '',
        associatedSelfConsumption:'0',
        idDossierTensionSubtype: '',
        phase: '',
        timeDiscrimination: '0',
      }
    }
    else if ((dossierSubtype === 'DOSSUB029' || dossierSubtype === 'DOSSUB030')) {
      //con esquema SLP/VE
      techDataDefault = {
        SPL: '0',
        electricVehicleCharging: '1',
        structureSchema: '',
        idDossierTensionType: '',
        idDossierTensionSubtype: '',
        phase: '',
        timeDiscrimination: '0',
        sendExtensionBudgetInd: '0',
      }
    }
    else if ((dossierSubtype === 'DOSSUB009' || dossierSubtype === 'DOSSUB005')) {
      //con esquema SLP/VE
      techDataDefault = {
        idDossierTensionType: '',
        idDossierTensionSubtype: '',
        phase: '',
        timeDiscrimination: '0',
        sendExtensionBudgetInd: '0',
        associatedSelfConsumption:'0',
      }
    }
    else {
      techDataDefault = {
        idDossierTensionType: '',
        idDossierTensionSubtype: '',
        phase: '',
        timeDiscrimination: '0',
        sendExtensionBudgetInd: '0',
      }
    }

    return techDataDefault
  }

  const techDataErrorsDefault = () => {
    let techDataErrors = {} as any

    if (dossierSubtype === 'DOSSUB008' || dossierSubtype === 'DOSSUB002' || dossierSubtype === 'DOSSUB003') {
      techDataErrors = {
        SPL: { bool: false, msg: '' },
        electricVehicleCharging: { bool: false, msg: '' },
        structureSchema: { bool: false, msg: '' },
        idDossierTensionType: { bool: false, msg: '' },
        idDossierTensionSubtype: { bool: false, msg: '' },
        phase: { bool: false, msg: '' },
        totalBuildingArea: { bool: false, msg: '' }
      } as any
    } else if ((dossierSubtype === 'DOSSUB012' || dossierSubtype === 'DOSSUB013' || dossierSubtype === 'DOSSUB014')) {
      techDataErrors = {
        idDossierTensionType: { bool: false, msg: '' },
        idDossierTensionSubtype: { bool: false, msg: '' },
        phase: { bool: false, msg: '' },
        cups: { bool: false, msg: '' },
        expediente: { bool: false, msg: '' }
      }
    }
    else if ((dossierSubtype === 'DOSSUB029' || dossierSubtype === 'DOSSUB030')) {
      techDataErrors = {
        SPL: { bool: false, msg: '' },
        electricVehicleCharging: { bool: false, msg: '' },
        structureSchema: { bool: false, msg: '' },
        idDossierTensionType: { bool: false, msg: '' },
        idDossierTensionSubtype: { bool: false, msg: '' },
        phase: { bool: false, msg: '' }
      }
    }
    else {
      techDataErrors = {
        idDossierTensionType: { bool: false, msg: '' },
        idDossierTensionSubtype: { bool: false, msg: '' },
        phase: { bool: false, msg: '' }
      } as any
    }
    return techDataErrors
  }

  const powerListDefault = () => {
    let powerListDefault = {} as any
    if (currentProvision && currentProvision.powerList) {
      powerListDefault = currentProvision.powerList
    } else if (dossierSubtype === 'DOSSUB002' || dossierSubtype === 'DOSSUB003') {
      powerListDefault = [{
        applicationType: 'UTITYP005',
        numberOfSupplies: dossierSubtype === 'DOSSUB002' ? '1' : '2',
        requestPower: '',
        subtotalPower: '0'
      }]
    } else if (dossierSubtype === 'DOSSUB007') {
      powerListDefault = [{
        numberOfSupplies: '1',
        requestPower: '',
        subtotalPower: '0'
      }]
    } else if ( dossierSubtype === 'DOSSUB029' || dossierSubtype === 'DOSSUB030') {
      powerListDefault = [{
        applicationType: 'UTITYP003',
        useType: 'UTISUB011',
        numberOfSupplies: '1',
        requestPower: '',
        subtotalPower: '0'
      }]
    } else if (dossierSubtype === 'DOSSUB008') {
      powerListDefault = [{
        applicationType: 'UTITYP004',
        numberOfSupplies: '1',
        requestPower: '',
        subtotalPower: '0'
      }]
    } else if (dossierSubtype === 'DOSSUB011') {
      powerListDefault = [{
        applicationType: 'UTITYP006',
        useType: 'UTISUB014',
        numberOfSupplies: '1',
        requestPower: '',
        subtotalPower: '0'
      }]
    } else if (dossierSubtype === 'DOSSUB012' || dossierSubtype === 'DOSSUB013' || dossierSubtype === 'DOSSUB014') {
      powerListDefault = [
        {
          applicationType: 'UTITYP006',
          useType: 'UTISUB016',
          numberOfSupplies: '1',
          requestPower: '',
          subtotalPower: '0'
        }
      ]
    } else if (dossierSubtype === 'DOSSUB009') {
      powerListDefault = [{
        numberOfSupplies: '1',
        buildableArea: '0',
        requestPower: '',
        subtotalPower: '0'
      }]
    } else {
      powerListDefault = [{
        applicationType: '',
        numberOfSupplies: '1',
        requestPower: '',
        subtotalPower: '0'
      }]
    }
    return powerListDefault
  }

  const powerListErrorsDefault = () => {
    let powerListErrors = {} as any
    if (dossierSubtype === 'DOSSUB009') {
      powerListErrors = [{
        numberOfSupplies: { bool: false, msg: '' },
        buildableArea: { bool: false, msg: '' },
        requestPower: { bool: false, msg: '' }
      }]
      //ppm 1007821 - inicio

    } else if (dossierSubtype === 'DOSSUB007' || dossierSubtype === 'DOSSUB029' || dossierSubtype === 'DOSSUB030') {
      //ppm 1007821 - fin
      powerListErrors = [{
        numberOfSupplies: { bool: false, msg: '' },
        requestPower: { bool: false, msg: '' }
      }]
    } else if (dossierSubtype === 'DOSSUB008') {
      powerListErrors = [{
        applicationType: { bool: false, msg: '' },
        numberOfSupplies: { bool: false, msg: '' },
        requestPower: { bool: false, msg: '' }
      }]
    } else if (dossierSubtype === 'DOSSUB012' || dossierSubtype === 'DOSSUB013' || dossierSubtype === 'DOSSUB014') {
      powerListErrors = [
        {
          applicationType: { bool: false, msg: '' },
          numberOfSupplies: { bool: false, msg: '' },
          requestPower: { bool: false, msg: '' }
        },
        {
          applicationType: { bool: false, msg: '' },
          numberOfSupplies: { bool: false, msg: '' },
          requestPower: { bool: false, msg: '' }
        }
      ]
    } else {
      powerListErrors = [{
        applicationType: { bool: false, msg: '' },
        numberOfSupplies: { bool: false, msg: '' },
        requestPower: { bool: false, msg: '' }
      }]
    }
    return powerListErrors
  }

  /* --- DATA --- */
  const [techData, setTechDataI] = useState(techDataDefault())
  const [powerList, setPowerListI] = useState(powerListDefault())

  /* --- ERRORS --- */
  const [techDataErrors, setTechDataErrors] = useState(techDataErrorsDefault())
  const [powerListErrors, setPowerListErrors] = useState(powerListErrorsDefault())

  // Se setea en el objeto techData el total de power (desde powerList)
  useEffect(() => {
    setTechDataI({
      ...techData,
      totalPower: totalPowerRequested.toString()
    })
    // eslint-disable-next-line
  }, [totalPowerRequested])

  // Determinamos el tipo de power mas su total segun el select y lo seteamos en techData
  useEffect(() => {
    let totalHousing = 0
    let totalGenServ = 0
    let totalGarage = 0
    let totalLocOffice = 0
    let totalIndustry = 0
    let totalOther = 0

    powerList.map((item, i) => {
      const value = +Number(parseFloat(item.subtotalPower)).toFixed(2)

      if (item.applicationType === 'UTITYP001') {
        totalHousing += value
      } else if (item.applicationType === 'UTITYP002') {
        totalGenServ += value
      } else if (item.applicationType === 'UTITYP003') {
        totalGarage += value
      } else if (item.applicationType === 'UTITYP004') {
        totalLocOffice += value
      } else if (item.applicationType === 'UTITYP005') {
        totalIndustry += value
      } else if (item.applicationType === 'UTITYP007') {
        totalOther += value
      }

      return null
    })

    setTechDataI({
      ...techData,
      housingTotPower: totalHousing.toString(),
      genServTotPower: totalGenServ.toString(),
      garageTotPower: totalGarage.toString(),
      locOffiTotPower: totalLocOffice.toString(),
      industryTotPower: totalIndustry.toString(),
      otherTotPower: totalOther.toString()
    })
    // eslint-disable-next-line
  }, [powerList])

  const getAndSetMasterData = (key: string, setSelect: any, type?: string, keyToApplyRemoveItem?: string, removeItem?: number) => {
    if (type === 'phase') {
      setIsLoadingPhase(true)
    } else if (type === 'tension') {
      setIsLoadingTensionSubtype(true)
    }

    dispatch(thunkGetMasterData('DossierDatosTecnicos', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), key, (response) => {
      if (response) {
        setSelect(response.map(item => item.value).filter((item, index) => {
          if (keyToApplyRemoveItem && key === keyToApplyRemoveItem) {
            return index !== removeItem
          }

          return true
        }))
      }

      if (type === 'phase') {
        setIsLoadingPhase(false)
      } else if (type === 'tension') {
        setIsLoadingTensionSubtype(false)
      }
    }))
  }

  const getAndSetMasterDataApplicationType = (setSelect: any) => {
    dispatch(
      thunkGetMasterData('APPLICATION_TYPE', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), 'UTITYP', (response) => {
        if (response) {
          setSelect(response.map(item => item.key + '|' + item.value))
        }
      })
    )
  }
  // Carga de los selects en modo readOnly
  useEffect(() => {
    if (currentProvision
      && state >= 2
      && voltageSupplySelect.length === 0
      && voltageSelect.length === 0
      && numberOfPhasesSelect.length === 0
      && typesSelect.length === 0
      && structureSchemaSelect.length === 0
    ) {
      setIsLoading(true)
      getAndSetMasterData('DT_TENSION_SUM', setVoltageSupplySelect)
      getAndSetMasterData('DT_TENSION_VOL', setVoltageSelect)
      getAndSetMasterData('DT_FASES', setNumberOfPhasesSelect)
      getAndSetMasterData('STRUCTURE_SCHEMA', setStructureSchemaSelect)
      getAndSetMasterDataApplicationType(setTypesSelect)
      setIsLoading(false)
    }
    // eslint-disable-next-line
  }, [state, currentProvision, voltageSupplySelect, voltageSelect, numberOfPhasesSelect, typesSelect, structureSchemaSelect])

  useEffect(() => {
    if (userToken && !currentProvision.techData) {
      getAndSetMasterData('DT_TENSION_SUM', setVoltageSupplySelect)
      getAndSetMasterData('STRUCTURE_SCHEMA', setStructureSchemaSelect)

      getAndSetMasterDataApplicationType(setTypesSelect)
    }
    // eslint-disable-next-line
  }, [userToken, currentProvision])

  useEffect(() => {
    if (techData.idDossierTensionType && !currentProvision.techData) {
      const key = 'DT_FASES_' + techData.idDossierTensionType

      getAndSetMasterData(key, setNumberOfPhasesSelect, 'phase')

      setTechDataI({ ...techData, phase: '' })
    }
    // eslint-disable-next-line
  }, [techData.idDossierTensionType, currentProvision])

  useEffect(() => {
    if (techData.phase && !currentProvision.techData) {
      const key = 'DT_TENSION_' + techData.idDossierTensionType + '_' + techData.phase

      getAndSetMasterData(key, setVoltageSelect, 'tension')

      setTechDataI({ ...techData, idDossierTensionSubtype: '' })
    }
    // eslint-disable-next-line
  }, [techData.phase, currentProvision])

  // Si viene un solo item se setea como defecto en el nuevo numberOfPhasesSelect cargado
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

  // Si viene un solo item se setea como defecto en el nuevo voltageSupplySelect cargado
  useEffect(() => {
    if (!currentProvision.techData) {
      if (voltageSupplySelect.length === 1) {
        setTechDataI({ ...techData, idDossierTensionType: voltageSupplySelect[0].split('|')[0] })
        setTechDataErrors({ ...techDataErrors, idDossierTensionType: { bool: false, msg: '' } })
      } else {
        setTechDataI({ ...techData, idDossierTensionType: '' })
      }
    }

    // eslint-disable-next-line
  }, [voltageSupplySelect])

  // Si viene un solo item se setea como defecto en el nuevo voltageSelect cargado
  useEffect(() => {
    if (!currentProvision.techData) {
      if (voltageSelect.length === 1) {
        setTechDataI({ ...techData, idDossierTensionSubtype: voltageSelect[0].split('|')[0] })
        setTechDataErrors({ ...techDataErrors, idDossierTensionSubtype: { bool: false, msg: '' } })
      } else {
        setTechDataI({ ...techData, idDossierTensionSubtype: '' })
      }
    }

    // eslint-disable-next-line
  }, [voltageSelect])

  // Comprobar si hay errores en el formulario
  useEffect(() => {
    if (
      Object.keys(techDataErrors).filter((key) => techDataErrors[key].bool).length > 0 ||
      powerListErrors.filter((item) => Object.keys(item).filter((key) => item[key].bool).length !== 0).length > 0
    ) {
      setErrorCheck(true)
    } else {
      setErrorCheck(false)
    }
    // eslint-disable-next-line
  }, [techDataErrors, powerListErrors])

  useEffect(() => {
    // comprobar si se ha rellenado cups o expediente para peticiones de socorro
    if (dossierSubtype === 'DOSSUB012' || dossierSubtype === 'DOSSUB013' || dossierSubtype === 'DOSSUB014') {

      if (techData.cups || techData.expediente) {
        setCupsOrExpediente(true)
      } else {
        setCupsOrExpediente(false)
      }
    }
  }, [techData.cups, techData.expediente])

  useEffect(() => {
    // comprobar si se ha rellenado las fechas para el tipo eventuales
    if (dossierSubtype === 'DOSSUB010') {
      if (techData.expected_date_connection && techData.expected_date_desconnection) {
        setFechasConexion(true)
      } else {
        setFechasConexion(false)
      }
    }
  }, [techData.expected_date_connection, techData.expected_date_desconnection])


  useEffect(() => {
    if (dossierSubtype !== 'DOSSUB002' &&
      dossierSubtype !== 'DOSSUB003' &&
      dossierSubtype !== 'DOSSUB004' &&
      dossierSubtype !== 'DOSSUB005' &&
      dossierSubtype !== 'DOSSUB006' &&
      dossierSubtype !== 'DOSSUB008' &&
      dossierSubtype !== 'DOSSUB029' &&
      dossierSubtype !== 'DOSSUB030' 
      ) {
      setElectricVehicleCheck(true)
    } else if (techData.electricVehicleCharging === '0') {
      setElectricVehicleCheck(true)
    } else if (techData.structureSchema) {
      setElectricVehicleCheck(true)
    } else {
      setElectricVehicleCheck(false)
    }
  }, [techData.electricVehicleCharging, techData.structureSchema])


  const checkTechData = () => {
    //comprovar que techData esta rellenado
    Object.keys(techData).forEach(key => {
      if (key !== 'cups' || 'expediente') {
        if (techData[key] === undefined)
          return false
      }
    })
    return true
  }
  // Comprobar si el formulario esta rellenado
  useEffect(() => {
    if (
      checkTechData() &&
      powerList.filter((item) => Object.keys(item).filter((key) => item[key] === '').length !== 0).length === 0 &&
      electricVehicleCheck && fechasConexion && cupsOrExpediente
    ) {
      setIsEmpty(false)
    } else {

      setIsEmpty(true)
    }
    // eslint-disable-next-line
  }, [techData, powerList, electricVehicleCheck, fechasConexion, cupsOrExpediente])

  useEffect(() => {
    dispatch(setTechData(techData))
  }, [dispatch, techData])

  useEffect(() => {
    dispatch(setPowerList(powerList))
  }, [dispatch, powerList])

  const handleAddSupplie = () => {
    setPowerListI([
      ...powerList,
      powerListDefault()
    ])
    setPowerListErrors([
      ...powerListErrors,
      powerListErrorsDefault()
    ])
  }

  return (
    <Grid container justifyContent='space-between'>
      <Form
        state={state}
        techData={techData}
        setTechDataI={setTechDataI}
        powerList={powerList}
        setPowerListI={setPowerListI}
        techDataErrors={techDataErrors}
        setTechDataErrors={setTechDataErrors}
        voltageSupplySelect={voltageSupplySelect}
        voltageSelect={voltageSelect}
        numberOfPhasesSelect={numberOfPhasesSelect}
        characters={characters}
        setCharacters={setCharacters}
        isLoadingTensionSubtype={isLoadingTensionSubtype}
        isLoadingPhase={isLoadingPhase}
        structureSchemaSelect={structureSchemaSelect}
      />

      <Grid container>
        <div className={`${classes.tableTitle} ${state === 1 ? classes.marginTop : ''}`}>{t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.table.title')}</div>

        <PowerTable
          state={state}
          mobile={mobile}
          oneSupplie={oneSupplie}
          techData={techData}
          typesSelect={typesSelect}
          powerList={powerList}
          setPowerListI={setPowerListI}
          powerListErrors={powerListErrors}
          setPowerListErrors={setPowerListErrors}
          totalPowerRequested={totalPowerRequested}
          setTotalPowerRequested={setTotalPowerRequested}
          setShowDialog={setShowDialog}
          setDialogText={setDialogText}
        />

        {
          (state === 0 && dossierSubtype === 'DOSSUB005') &&
          <Grid container className={classes.addSupplie}>
            <div onClick={handleAddSupplie}>
              <IconTextButton
                icon={<img src={AddIcon} alt='' />}
                text={t(
                  'provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.table.addSupplie'
                )}
              />
            </div>
          </Grid>
        }

        {/*
          mobile &&
            <Grid container>
              <div className={classes.totalMobileContainer}>
                <Grid container>
                  <Grid container className={classes.totalRow} justifyContent='space-between'>
                    <Grid item className={classes.totalTitle}>{t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.table.totals.title')}</Grid>
                    <Grid item />
                  </Grid>
                  <Grid container justifyContent='space-between'>
                    <Grid item className={classes.totalSubtitle}>{t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.table.totals.power')}</Grid>
                    <Grid item className={classes.totalVariables}>{totalPowerRequested}</Grid>
                  </Grid>
                </Grid>
              </div>
            </Grid>
        */}
      </Grid>
    </Grid>
  )
}

export default Group
