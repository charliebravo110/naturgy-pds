import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Grid from '@material-ui/core/Grid'

import Form from './form/Form'
import PowerTable from './power-table/PowerTable'

import { setTechData, setPowerList } from '../../../../../store/actions/ProvisionsActions'
import { thunkGetMasterData } from '../../../../../store/actions/ProvisionsThunkActions'

import useStyles from './Family.styles'

const SingleFamily = (props: any) => {
  const classes = useStyles({})
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down(1150))
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    state,
    setIsEmpty,
    setErrorCheck,
    oneSupplie,
    setIsLoading,
    setShowDialog,
    setDialogText
  } = props

  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)

  const provisions = useSelector((state: any) => state.provisions)
  const dossierSubtype = useSelector((state: any) => state.provisions.dossierSubtype)
  const userToken = useSelector((state: any) => state.user.token)
  const selectedSupplySubtype = useSelector((state: any) => state.provisions.selectedSupplySubtype)
  const cadastreData = useSelector((state: any) => state.provisions.cadastreData)

  const [voltageSupplySelect, setVoltageSupplySelect] = useState([] as any)
  const [voltageSelect, setVoltageSelect] = useState([] as any)
  const [numberOfPhasesSelect, setNumberOfPhasesSelect] = useState([] as any)
  const [airConditionerSelect, setAirConditionerSelect] = useState([] as any)
  const [heatingSelect, setHeatingSelect] = useState([] as any)
  const [typesSelect, setTypesSelect] = useState([] as any)
  const [totalBuildableArea, setTotalBuildableArea] = useState(0)
  const [totalPowerRequested, setTotalPowerRequested] = useState(0)
  const [isLoadingTensionSubtype, setIsLoadingTensionSubtype] = useState(false)
  const [isLoadingPhase, setIsLoadingPhase] = useState(false)
  const [characters, setCharacters] = useState(300)
  const [structureSchemaSelect, setStructureSchemaSelect] = useState([] as any)
  const [electricVehicleCheck, setElectricVehicleCheck] = useState(true)

  /* Si hay una provision vigente se cargan los datos en los formularios */
  const getDefaultTechData = () => {
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
    } else {
      techDataDefault = {
        idDossierTensionType: '',
        idDossierTensionSubtype: '',
        phase: '',
        totalBuildingArea: (cadastreData && cadastreData.item && cadastreData.item.datosEcononimos && cadastreData.item.datosEcononimos.superficie) ? cadastreData.item.datosEcononimos.superficie : '0',
        electricVehicleCharging: '0',
        SPL: '0',
        timeDiscrimination: '0',
        sendExtensionBudgetInd: '0',
        associatedSelfConsumption:'0',
      }
      if (provisions.selectedSupplySubtype === 'DOSSUB005') {
        techDataDefault = {
          ...techDataDefault,
          existingAco: '0'
        }
      }
    }
    return techDataDefault
  }

  const getDefaultPowerList = () => {
    let powerListDefault = [{}] as any
    if (currentProvision && currentProvision.powerList) {
      powerListDefault = currentProvision.powerList
    } else {
      if (provisions.selectedSupplySubtype === 'DOSSUB005') {
        powerListDefault = [{
          applicationType: '',
          buildableArea: '',
          numberOfSupplies: '1',
          requestPower: '',
          subtotalPower: '0'
        }]
      } else {
        powerListDefault = [{
          applicationType: 'UTITYP001',
          numberOfSupplies: '1',
          buildableArea: '',
          requestPower: '',
          subtotalPower: '0'
        }]
      }
    }
    return powerListDefault
  }

  /* --- DATA --- */
  const [techData, setTechDataI] = useState(getDefaultTechData())
  const [powerList, setPowerListI] = useState(getDefaultPowerList())

  /* --- ERRORS --- */
  const [techDataErrors, setTechDataErrors] = useState({
    idDossierTensionType: { bool: false, msg: '' },
    idDossierTensionSubtype: { bool: false, msg: '' },
    phase: { bool: false, msg: '' }
  })

  const [powerListErrors, setPowerListErrors] = useState([
    {
      applicationType: { bool: false, msg: '' },
      numberOfSupplies: { bool: false, msg: '' },
      buildableArea: { bool: false, msg: '' },
      requestPower: { bool: false, msg: '' }
    }
  ] as any)

  // Se setea en el objeto techData el total de power (desde powerList)
  useEffect(() => {
    setTechDataI({
      ...techData,
      totalPower: totalPowerRequested.toString()
    })
    // eslint-disable-next-line
  }, [totalPowerRequested])

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
    dispatch(thunkGetMasterData('APPLICATION_TYPE', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), 'UTITYP', (response) => {
      if (response) {
        setSelect(response.map(item => item.key + '|' + item.value))
      }
    }))
  }

  // Carga de los selects en modo readOnly
  useEffect(() => {
    if (currentProvision
      && state >= 2
      && voltageSupplySelect.length === 0
      && voltageSelect.length === 0
      && numberOfPhasesSelect.length === 0
      && airConditionerSelect.length === 0
      && heatingSelect.length === 0
      && typesSelect.length === 0
      && structureSchemaSelect.length === 0
    ) {
      setIsLoading(true)
      getAndSetMasterData('DT_TENSION_SUM', setVoltageSupplySelect)
      getAndSetMasterData('DT_TENSION_VOL', setVoltageSelect)
      getAndSetMasterData('DT_FASES', setNumberOfPhasesSelect)
      getAndSetMasterData('DT_TIPO_AC', setAirConditionerSelect)
      getAndSetMasterData('DT_TIPO_CAL', setHeatingSelect)
      getAndSetMasterData('STRUCTURE_SCHEMA', setStructureSchemaSelect)
      getAndSetMasterDataApplicationType(setTypesSelect)
      setIsLoading(false)
    }
    // eslint-disable-next-line
  }, [state, currentProvision, voltageSupplySelect, voltageSelect, numberOfPhasesSelect, airConditionerSelect, heatingSelect, typesSelect, structureSchemaSelect])

  useEffect(() => {
    if (userToken && !currentProvision.techData) {
      getAndSetMasterData('DT_TENSION_SUM', setVoltageSupplySelect)
      getAndSetMasterData('DT_TIPO_AC', setAirConditionerSelect)
      getAndSetMasterData('DT_TIPO_CAL', setHeatingSelect)
      getAndSetMasterData('STRUCTURE_SCHEMA', setStructureSchemaSelect)
      getAndSetMasterDataApplicationType(setTypesSelect)
    }
    // eslint-disable-next-line
  }, [userToken, currentProvision])

  // Comprobar si el subtipo es Vivienda Unifamiliar para eliminar Alta del select de tensiones
  useEffect(() => {
    if (dossierSubtype === 'DOSSUB004' && voltageSupplySelect.length > 1 && !currentProvision.techData) {
      setVoltageSupplySelect(voltageSupplySelect.filter(item => item.split('|')[0] === 'VOLTYP0002'))
    }
    // eslint-disable-next-line
  }, [voltageSupplySelect, currentProvision])

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
  useEffect(
    () => {
      if (
        Object.keys(techDataErrors).filter((key) => techDataErrors[key].bool).length > 0 ||
        powerListErrors.filter((item) => Object.keys(item).filter((key) => item[key].bool).length !== 0).length > 0
      ) {
        setErrorCheck(true)
      } else {
        setErrorCheck(false)
      }
    },
    [techDataErrors, powerListErrors, setErrorCheck]
  )

  useEffect(() => {
    if (dossierSubtype !== 'DOSSUB002' && 
    dossierSubtype !== 'DOSSUB003' && 
    dossierSubtype !== 'DOSSUB004' && 
    dossierSubtype !== 'DOSSUB005' && 
    dossierSubtype !== 'DOSSUB005' && 
    dossierSubtype !== 'DOSSUB007' && 
    dossierSubtype !== 'DOSSUB008') {
      setElectricVehicleCheck(true)
    } else if (techData.electricVehicleCharging === '0') {
      setElectricVehicleCheck(true)
    } else if (techData.structureSchema) {
      setElectricVehicleCheck(true)
    } else {
      setElectricVehicleCheck(false)
    }
  }, [techData.electricVehicleCharging, techData.structureSchema])

  // Comprobar si el formulario esta rellenado
  useEffect(() => {
    if (
      Object.keys(techData).filter((key) => key !== 'observations' && techData[key] === '').length === 0 &&
      powerList.filter((item) => Object.keys(item).filter((key) => item[key] === '').length !== 0).length === 0 &&
      electricVehicleCheck
    ) {
      setIsEmpty(false)
    } else {
      setIsEmpty(true)
    }
  }, [techData, powerList, setIsEmpty, electricVehicleCheck])

  useEffect(() => {
    dispatch(setTechData(techData))
  }, [dispatch, techData])

  useEffect(() => {
    dispatch(setPowerList(powerList))
  }, [dispatch, powerList])

  return (
    <Grid container justifyContent='space-between'>
      <Form
        state={state}
        mobile={mobile}
        techData={techData}
        setTechDataI={setTechDataI}
        techDataErrors={techDataErrors}
        setTechDataErrors={setTechDataErrors}
        powerList={powerList}
        setPowerListI={setPowerListI}
        powerListErrors={powerListErrors}
        setPowerListErrors={setPowerListErrors}
        voltageSupplySelect={voltageSupplySelect}
        voltageSelect={voltageSelect}
        airConditionerSelect={airConditionerSelect}
        numberOfPhasesSelect={numberOfPhasesSelect}
        heatingSelect={heatingSelect}
        isLoadingTensionSubtype={isLoadingTensionSubtype}
        isLoadingPhase={isLoadingPhase}
        characters={characters}
        setCharacters={setCharacters}
        structureSchemaSelect={structureSchemaSelect}
        //setElectricVehicleCheck = {setElectricVehicleCheck}
      />

      <Grid container>
        <div className={classes.tableTitle}>{t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.table.title')}</div>

        <PowerTable
          state={state}
          mobile={mobile}
          oneSupplie={oneSupplie}
          techData={techData}
          powerList={powerList}
          setPowerListI={setPowerListI}
          powerListErrors={powerListErrors}
          setPowerListErrors={setPowerListErrors}
          selectedSupplySubtype={selectedSupplySubtype}
          typesSelect={typesSelect}
          totalBuildableArea={totalBuildableArea}
          setTotalBuildableArea={setTotalBuildableArea}
          totalPowerRequested={totalPowerRequested}
          setTotalPowerRequested={setTotalPowerRequested}
          setShowDialog={setShowDialog}
          setDialogText={setDialogText}
        />
      </Grid>
    </Grid>
  )
}

export default SingleFamily
