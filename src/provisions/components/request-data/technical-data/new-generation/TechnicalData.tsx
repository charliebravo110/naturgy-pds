import React, { useState, useEffect } from 'react'
import { pdf } from '@react-pdf/renderer'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import TechnicalDataIcon from '../../../../../assets/icons/datos_tecnicos.svg'

import Select from '../../../../../common/components/select/Select'
import Input from '../../../../../common/components/input/Input'
import LightTooltip from '../../../../../common/components/tooltip/light/LightTooltip'
import Checkbox from '../../../../../supplies/supplies-list/managed-by-me/components/checkbox/Checkbox'
import Switch from '../../../../../common/components/switch/Switch'
import InfoIcon from '../../../../../assets/icons/info.svg'

import HoldersAgreementPDF from '../../../new-generation/steps/request-data/holders-agreement-pdf/HoldersAgreementPDF'

import { setTechData, setPowerList } from '../../../../store/actions/ProvisionsActions'
import { thunkGetMasterData } from '../../../../store/actions/ProvisionsThunkActions'

import useStyles, {
  ExpansionPanel,
  ExpansionPanelSummary,
  StyledExpandMoreIcon,
  ExpansionPanelDetails
} from './TechnicalData.styles'
import { repeat } from 'lodash'
import { isMobileApp, isWeb } from '../../../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../../../mobile-apps/local-downloads/createFileAndOpenIt'

const TechnicalData = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    state,
    setErrorCheck,
    setIsEmpty,
    setShowDialog,
    autoconsumo,
    generaCogen,
    setDialogText
  } = props

  


  const provisions = useSelector((state: any) => state.provisions)
  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)
  const userToken = useSelector((state: any) => state.user.token)

  const [voltageSupplySelect, setVoltageSupplySelect] = useState([] as any)
  const [idDossierTensionType, setIdDossierTensionType] = useState('')
  const [generatorTypesSelect, setGeneratorTypesSelect] = useState([] as any)
  const [idDossierGeneratorType, setIdDossierGeneratorType] = useState('')
  const [centralName, setCentralName] = useState('')
  const [totalPower, setTotalPower] = useState('')
  const [idDossierTensionSubtype, setIdDossierTensionSubtype] = useState()
  const [voltageSelect, setVoltageSelect] = useState([] as any)
  const [isLoadingTensionSubtype, setIsLoadingTensionSubtype] = useState(false)
  const [signedDocApplicantOwner, setSignedDocApplicantOwner] = useState('')

  const [onDeck, setOnDeck] = useState('')

  const [totalPowerInstall, setTotalPowerInstall] = useState('')
  const [distributorPowerGranted, setDistributorPowerGranted] = useState('')
  const [accumulation, setAccumulation] = useState('')
  const [genModCatalog, setGenModCatalog] = useState('')
  const [significanceIt, setSignificanceIt] = useState('')
  const [phase, setPhase] = useState('')
  const [catalogGenerationModSelect, setCatalogGenerationModSelect] = useState([] as any)
  const [sendExtensionBudgetInd, setSendExtensionBudgetInd] = useState('')
  const [description, setDescription] = useState('')
  const [capacidadAcceso, setCapacidadAcceso] = useState('')

  const [checkedSwitch, setCheckedSwitch] = useState(true)

  const [documentIsReady, setDocumentIsReady] = useState(false)

  const repeatedDescription = t('provisions.newGeneration.requestData.technicalData.repeatedDescription') + '.'

  /* --- DATA --- */
  const [techData, setTechDataI] = useState({
    idDossierTensionType: '',
    idDossierGeneratorType: '',
    centralName: '',
    totalPower: '',
    summaryProcedure: '0',
    timeDiscrimination: '0',
    description: '',
    sendExtensionBudgetInd: '0',
    idDossierTensionSubtype: '',
    signedDocApplicantOwner: '0',
    totalPowerInstall: '',
    genModCatalog: '',
    accumulation: '0',
    phase: ''
  } as any)

  /* --- ERRORS --- */
  const [techDataErrors, setTechDataErrors] = useState({
    idDossierTensionType: false,
    idDossierGeneratorType: false,
    centralName: false,
    totalPower: false,
    summaryProcedure: false,
    description: false,
    sendExtensionBudgetInd: false,
    idDossierTensionSubtype: false,
    signedDocApplicantOwner: false,
    totalPowerInstall: false,
    genModCatalog: false,
    accumulation: false,
    phase: false
  } as any)

  useEffect(() => {
    if (provisions && provisions.newGeneration) {
      if (provisions.newGeneration.repeatedCup) {
        setDescription(repeatedDescription)
      }
      if (provisions.newGeneration.repeatedCadastre) {
        setDescription(repeatedDescription)
      }
    }
  }, [provisions.newGeneration])
  // cargamos el campo Capacidad de acceso para Consumo (kW) para acumulación
  useEffect(() => {
    if (provisions.dossierSubtype === 'DOSSUB028') {
      setTechDataI({
        ...techData,
        capacidadAcceso: ''
      })
      setTechDataErrors({
        ...techDataErrors,
        capacidadAcceso: false
      })
    }
  }, [])

  const getTypologyValue = () => {
    const item = provisions.newGeneration.typologies.find(item => item.split('|')[0] === provisions.dossierSubtype)

    return item && item.split('|')[1] && item.split('|')[1].toLowerCase()
  }

  const getConnectionValue = () => {
    let selectedValue = 'UFD_NETWORK'

    if (currentProvision.internalNetwork === 'INTNET001' || provisions.newGeneration.selectedConnection === 'INTERNAL_CUSTOMER_NETWORK') {
      // red interna
      selectedValue = 'INTERNAL_CUSTOMER_NETWORK'
    }

    const item = provisions.newGeneration.connections.find(item => item.key === selectedValue)

    return item && item.value
  }

  /* Si hay una provision vigente se cargan los datos en los formularios */
  useEffect(() => {
    if (currentProvision && currentProvision.techData) {
      setTechDataI(currentProvision.techData)
    }
  }, [currentProvision])

  useEffect(() => {
    let rdCod

    if (techData.totalPower && techData.totalPower !== '' && !isNaN(techData.totalPower)) {
      if (provisions.dossierSubtype === 'DOSSUB020' || provisions.dossierSubtype === 'DOSSUB021' || provisions.dossierSubtype === 'DOSSUB022') {
        // congeneracion, biomasa o biogas

        if (techData.totalPower <= 1000) {
          rdCod = '1699/2011'
        } else {
          rdCod = '413/2014'
        }
      } else {
        if (techData.totalPower <= 100) {
          rdCod = '1699/2011'
        } else {
          rdCod = '413/2014'
        }
      }
    }

    let cups = provisions.newGeneration && provisions.newGeneration.cups ? provisions.newGeneration.cups : ''

    if (cups && cups !== '') {
      if (cups.substring(cups.length - 2, cups.length) !== '1P') {
        cups = cups + '1P'
      }
    }

    dispatch(setTechData({
      ...techData,
      observations: ((provisions.newGeneration && provisions.newGeneration.customerWithCups) ? '' : t('provisions.newGeneration.requestData.technicalData.customerWithoutCups') + (techData.description === '' ? '' : (';' + techData.description))),
      internalNetwork: (provisions.newGeneration && provisions.newGeneration.selectedConnection === 'INTERNAL_CUSTOMER_NETWORK') ? 'INTNET001' : (provisions.newGeneration && provisions.newGeneration.selectedConnection === 'UFD_NETWORK') ? 'INTNET002' : 'INTNET003',
      cups,
      rdCod
    }))
    // eslint-disable-next-line
  }, [techData])

  const getAndSetMasterData = (master: string, key: string, setSelect: any) => {
    setIsLoadingTensionSubtype(true)
    dispatch(thunkGetMasterData(master, (sessionStorage.getItem('lang') || 'ES').toUpperCase(), key, (response) => {
      if (response) {
        setSelect(response.map(item => item.value))
      }
      setIsLoadingTensionSubtype(false)
    })
    )
  }

  const selectValue = (select: any, value: any) => {
    const keyValue = select.filter(item => item.substring(0, item.indexOf('|')) === value)[0]

    return keyValue && keyValue.substring(keyValue.indexOf('|') + 1, keyValue.length)
  }

  useEffect(() => {

    if (state === 0 && techData.idDossierTensionType !== '') {
      const key = 'DT_TENSION_' + techData.idDossierTensionType

      getAndSetMasterData('DossierDatosTecnicos', key, setVoltageSelect)

      setTechDataErrors({
        ...techDataErrors,
        idDossierTensionSubtype: {
          bool: true,
          msg: t('provisions.newGeneration.requestData.technicalData.errors.required')
        }
      })
    }
    // eslint-disable-next-line
  }, [techData.idDossierTensionType])

  useEffect(() => {
    //Si ya hay descripción, añadimos al final el valor
    if (techData.description) {
      const consumptionCapacity = t('provisions.newGeneration.requestData.technicalData.consumptionCapacity')
      setTechDataI({
        ...techData,
        description: description + ' ' + consumptionCapacity + ' ' + capacidadAcceso
      })
    }
  }, [capacidadAcceso])

  useEffect(() => {
    if (capacidadAcceso) {
      const consumptionCapacity = t('provisions.newGeneration.requestData.technicalData.consumptionCapacity')
      setTechDataI({
        ...techData,
        description: description + ' ' + consumptionCapacity + ' ' + capacidadAcceso
      })
    }
    else {
      setTechDataI({
        ...techData,
        description: description
      })
    }
  }, [description])

  useEffect(() => {
    if (userToken) {
      getAndSetMasterData('DossierDatosTecnicos', 'DT_TENSION_SUM', setVoltageSupplySelect)

      getAndSetMasterData('GENERATOR_TYPE_ID', 'GENTYP', setGeneratorTypesSelect)

      getAndSetMasterData('GEN_MOD_CATALOG', 'CATMODGEN', setCatalogGenerationModSelect) //FSP

      getAndSetMasterData('DossierDatosTecnicos', 'DT_TENSION_VOL', setVoltageSelect)
    }
    // eslint-disable-next-line
  }, [userToken])

  // useEffect(() => {
  //   if (props?.location) {
  //     console.log('Test_props: ', props);
  //     console.log(props?.location);
  //   }
  // }, [props])

  useEffect(() => {
    if (state >= 1 && voltageSupplySelect && voltageSupplySelect.length > 0 &&
      voltageSelect && voltageSelect.length > 0 &&
      catalogGenerationModSelect && catalogGenerationModSelect.length > 0 &&
      generatorTypesSelect && generatorTypesSelect.length > 0) {

      // let separator = ' '
      let separator = t('provisions.newGeneration.requestData.technicalData.consumptionCapacity')
      let lastSeparatorIndex

      let tension
      let generatorType
      let name
      let power
      let voltage
      let checkSignedDoc
      let auxDescription
      let capacidadAcceso

      let totalPowerInstall
      let distributorPowerGranted
      let accumulation
      let genModCatalog
      let significanceIt
      let phase
      let sendExtensionBudgetInd


      if (!provisions.currentProvision.dossierCod || provisions.currentProvision.dossierCod === '') {
        tension = provisions.techData.idDossierTensionType
        generatorType = provisions.techData.idDossierGeneratorType
        name = provisions.techData.centralName
        power = provisions.techData.totalPower
        voltage = provisions.techData.idDossierTensionSubtype
        checkSignedDoc = provisions.techData.signedDocApplicantOwner
        totalPowerInstall = provisions.techData.totalPowerInstall
        distributorPowerGranted = provisions.techData.distributorPowerGranted
        accumulation = provisions.techData.accumulation
        genModCatalog = provisions.techData.genModCatalog
        significanceIt = provisions.techData.significanceIt
        phase = provisions.techData.phase
        sendExtensionBudgetInd = provisions.valoration.sendExtensionBudgetInd

        lastSeparatorIndex = provisions.techData.description.lastIndexOf(separator);
        auxDescription = provisions.techData.description.slice(0, lastSeparatorIndex);
        capacidadAcceso = provisions.techData.description.slice(lastSeparatorIndex + separator.length);

      } else {
        generatorType = currentProvision.techData.idDossierGeneratorType
        name = currentProvision.centralName
        power = currentProvision.techData.totalPower
        voltage = currentProvision.techData.idDossierTensionSubtype
        checkSignedDoc = currentProvision.techData.signedDocApplicantOwner
        totalPowerInstall = currentProvision.techData.totalPowerInstall
        distributorPowerGranted = currentProvision.techData.distributorPowerGranted
        accumulation = currentProvision.techData.accumulation
        genModCatalog = currentProvision.techData.genModCatalog
        significanceIt = currentProvision.techData.significanceIt
        phase = currentProvision.techData.phase
        sendExtensionBudgetInd = currentProvision.valoration.sendExtensionBudgetInd

        lastSeparatorIndex = currentProvision.techData.description.lastIndexOf(separator);
        auxDescription = currentProvision.techData.description.slice(0, lastSeparatorIndex);
        capacidadAcceso = currentProvision.techData.description.slice(lastSeparatorIndex + separator.length);
      }
      setIdDossierTensionType(selectValue(voltageSupplySelect, tension))

      setIdDossierGeneratorType(selectValue(generatorTypesSelect, generatorType))

      setCentralName(name)

      setIdDossierTensionSubtype(selectValue(voltageSelect, voltage))
      setTotalPower(power)
      setSignedDocApplicantOwner(checkSignedDoc)
      setTotalPowerInstall(totalPowerInstall)
      setDistributorPowerGranted(distributorPowerGranted)
      setAccumulation(accumulation)
      setCheckedSwitch(accumulation === '0')
      setGenModCatalog(selectValue(catalogGenerationModSelect, genModCatalog))
      setSignificanceIt(significanceIt)
      setSendExtensionBudgetInd(sendExtensionBudgetInd)
      setPhase(phase)

      setDescription(auxDescription)
      setCapacidadAcceso(capacidadAcceso)
    }
    // eslint-disable-next-line
  }, [state, voltageSupplySelect, generatorTypesSelect, voltageSelect, catalogGenerationModSelect])

  const handleVoltage = (e) => {
    setTechDataI({
      ...techData,
      idDossierTensionSubtype: e.target.value,
      phase: e.target.value === 'TENSUB007' ? 'FASE_MONOF' : 'FASE_TRIFA'
    })
  }

  const handleAccumulation = (e) => {
    if (e.target.checked) {
      setTechDataI({ ...techData, accumulation: '0' })
      setAccumulation('0')
      setCheckedSwitch(true)
    } else {
      setTechDataI({ ...techData, accumulation: '1' })
      setAccumulation('1')
      setCheckedSwitch(false)
    }
  }

  useEffect(() => {
    // Comprobar si hay errores en el formulario
    if (Object.keys(techDataErrors).filter((key) => techDataErrors[key].bool).length > 0) {
      setErrorCheck(true)
    } else {
      setErrorCheck(false)
    }

    // Comprobar si el formulario esta rellenado con los campos obligatorios
    const fieldsEmptyOK = ['totalPowerInstall', 'genModCatalog']

    if ((Object.keys(techData)
      .filter(key => techData[key] === ''))
      .filter(item => !fieldsEmptyOK.includes(item)).length === 0) {
      setIsEmpty(false)
    } else {
      setIsEmpty(true)
    }
    // eslint-disable-next-line
  }, [techData, techDataErrors,])

  useEffect(() => {
    dispatch(setPowerList([{
      numberOfSupplies: '1',
      requestPower: techData.totalPower,
      subtotalPower: techData.totalPower
    }]))
    // eslint-disable-next-line
  }, [techData.totalPower])

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

    if (e.target.value === '' || isNaN(e.target.value) || (Number(e.target.value) > 15 && techData.summaryProcedure === '1')) {
      check = true
      //msg = e.target.value === '' ? t('provisions.newGeneration.requestData.technicalData.errors.required') : (isNaN(e.target.value) ? t('provisions.newGeneration.requestData.technicalData.errors.selectedPowerFormat') : t('provisions.newGeneration.requestData.technicalData.errors.selectedPowerShort'))
      msg = e.target.value === '' ? t('provisions.newGeneration.requestData.technicalData.errors.required') : (isNaN(e.target.value) ? t('provisions.newGeneration.requestData.technicalData.errors.selectedPowerFormat') : '')
    } else if ((provisions.dossierSubtype === 'DOSSUB017' || provisions.dossierSubtype === 'DOSSUB028' || provisions.dossierSubtype === 'DOSSUB018' || provisions.dossierSubtype === 'DOSSUB024') && techData.totalPower > 200000) {
      check = false
      setDialogText(t('provisions.newProvision.requestData.supplyType.form.errors.powerError'))
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
  }

  const downloadDocument = async () => {
    const blob = await pdf(
      <HoldersAgreementPDF
      // user={user}
      // actualDate={actualDate}
      // data={filteredActivitiesList}
      // currentProvision={currentProvision}
      // rowsPerPage={6}
      />
    ).toBlob()

    const pdfUrl = window.URL.createObjectURL(blob)
    const fileName = 'Acuerdo entre titulares.pdf'

    if (isWeb()) {
      const tempLink = document.createElement('a')
      tempLink.href = pdfUrl
      tempLink.setAttribute('download', fileName)
      tempLink.click()
    } else {
      // downloadLink.click() will attempt to force a client-side download, works for web,
      // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
      createFileAndOpenIt({ fileName, contentAsBlob: blob })
    }

    setDocumentIsReady(false)
  }

  useEffect(() => {
    if (documentIsReady) {
      downloadDocument()
    }
  }, [documentIsReady])

  const changeTechDataErrors = (power) => {
    if (!isNaN(power)) {
      setTechDataErrors({
        ...techDataErrors,
        totalPowerInstall: {
          bool: (power !== '' && (isNaN(power))),
          msg: ((power !== '' && isNaN(power)) ?
            t('provisions.newGeneration.requestData.technicalData.errors.selectedPowerFormat')
            :
            t('provisions.newGeneration.requestData.technicalData.errors.powerNoZero'))
        }
      })
    }
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
          totalPowerInstall: {
            bool: check,
            msg: msg
          }
        })
      } else {
        let check = false
        let msg = ''

        setTechDataErrors({
          ...techDataErrors,
          totalPowerInstall: {
            bool: check,
            msg: msg
          }
        })
      }
    }

    if (!isNaN(power)) {
      setTechDataI({
        ...techData,
        totalPowerInstall: power
      })
    }
  }

  // useEffect(() => {
  //   console.log('E999513 new-generation')
  //   console.log();
  //   console.log('props?.typeAutoconsumo !== null', (props?.typeAutoconsumo !== null && props?.typeAutoconsumo?.trim() !== ''));
  // }, [])

  const onDeckValue = (id) => {
    if (id) {
      return 'audit.S'
    } else {
      return 'audit.N'
    }
  }

  const onDeckValue2 = (id) => {
    if (id === '1') {
      return 'audit.S'
    } else if (id === '0') {
      return 'audit.N'
    }
  }

  const ubicationType = (id) => {
    switch (id) {
      case '0':
        return 'No hay valor'
        break;

      case '1':
        return 'provisions.newGeneration.type.autoconsuption_type.individual'
        break;

      case '2':
        return 'provisions.newGeneration.type.autoconsuption_type.colective'
        break;
    }
  }

  const fotovoltaicaSuperficieValue = (id) => {
    switch (id) {
      case null:
        return 'No hay valor'
        break;

      case true:
        return 'provisions.newGeneration.type.fotovoltaica.moreThan'
        break;

      case false:
        return 'provisions.newGeneration.type.fotovoltaica.lessThan'
        break;

      case '1':
        return 'provisions.newGeneration.type.fotovoltaica.lessThan'
        break;

      case '2':
        return 'provisions.newGeneration.type.fotovoltaica.moreThan'
        break;
    }
  }

  const typeConexionData = (id) => {
    switch (id) {
      case 'INTERNAL_CUSTOMER_NETWORK':
        return 'provisions.newGeneration.type.connections.internalCustomerNetworkDescription.main'
        break

      case 'UFD_NETWORK':
        return 'provisions.newGeneration.type.connections.ufdNetworkDescription.main'
        break

      case 'ENLACE_CGP':
        return 'provisions.newGeneration.type.connections.enlace.1'
        break

      case 'ENLACE_CPM':
        return 'provisions.newGeneration.type.connections.enlace.1'
        break

      case 'ENLACE_CDM':
        return 'provisions.newGeneration.type.connections.enlace.1'
        break

      case 'ENLACE_CC':
        return 'provisions.newGeneration.type.connections.enlace.1'
        break
    }
  }

  const typeConexionData2 = (id) => {
    switch (id) {
      case 'INTERNAL_CUSTOMER_NETWORK':
        return 'provisions.newGeneration.type.connections.internalCustomerNetworkDescription.explicacion'
        break

      case 'UFD_NETWORK':
        return 'provisions.newGeneration.type.connections.ufdNetworkDescription.explicacion'
        break
    }
  }

  const typeConexionData3 = (id) => {
    switch (id) {
      case 'INTNET001':
        return 'provisions.newGeneration.type.connections.internalCustomerNetworkDescription.main'
        break

      case 'INTNET002':
        return 'provisions.newGeneration.type.connections.ufdNetworkDescription.main'
        break
    }
  }

  const typeConexionData4 = (id) => {
    switch (id) {
      case 'INTNET001':
        return 'provisions.newGeneration.type.connections.internalCustomerNetworkDescription.explicacion'
        break

      case 'INTNET002':
        return 'provisions.newGeneration.type.connections.ufdNetworkDescription.explicacion'
        break
    }
  }

  const CGPSelectedData = (id) => {
    switch (id) {
      case '1':
        return 'provisions.newGeneration.type.question.1'
        break

      case '2':
        return 'provisions.newGeneration.type.question.2'
        break

      case '3':
        return 'provisions.newGeneration.type.question.3'
        break

      case 'ChangePlace':
        return 'provisions.newGeneration.type.question.4'
        break

      case 'SamePlace':
        return 'provisions.newGeneration.type.question.5'
        break
    }
  }

  const checkFotovoltaica = (dossierSubtype) => {
    if (dossierSubtype === 'DOSSUB017') {
      return true
    } else {
      return false
    }
  }

  const checkAutoconsumo = (selfConsumptionType) => {
    if (selfConsumptionType === '1' || selfConsumptionType === '2') {
      return true
    } else {
      return false
    }
  }

  return (
    <>
      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
          <img className={classes.expansionPanelSummaryIcon} src={TechnicalDataIcon} alt='' />

          <Typography className={classes.expansionPanelSummaryText}>{t('provisions.newGeneration.requestData.technicalData.title')}</Typography>
        </ExpansionPanelSummary>

        <ExpansionPanelSummary className={classes.blueBox}>
          <Grid container className={classes.fullSize}>
            <span className={classes.expansionPanelSummaryText2}>{t('provisions.newGeneration.requestData.technicalData.typeAndSubtype')}&nbsp;<strong>{t('provisions.newGeneration.requestData.technicalData.generation')} {getTypologyValue()} / {getConnectionValue()}</strong></span>
            {(autoconsumo || provisions.dossierSubtype === 'DOSSUB017') &&
              <Grid container className={classes.separator} direction='column' />
            }
          </Grid>
        </ExpansionPanelSummary>
        {/* DOSSUB017 - Fotovoltaica */}
        {((checkAutoconsumo(props?.provisions?.currentProvision?.techData?.selfConsumType) || checkAutoconsumo(props?.typeAutoconsumo)) || checkFotovoltaica(provisions.dossierSubtype)) &&
          <ExpansionPanelSummary className={classes.blueBox}>
            <Grid container justifyContent='space-between' spacing={3} className={classes.inputContainer}>

              {checkFotovoltaica(provisions.dossierSubtype) && props?.isOnDeck !== null && (
                <Grid item md={5} xs={12}>
                  <Grid container direction='column'>
                    <Grid item>
                      <Typography className={`${classes.label} ${classes.expansionPanelSummaryText}`}>
                        {t('provisions.newGeneration.requestData.technicalData.onDeck')}
                      </Typography>
                    </Grid>
                    <Grid item className={classes.input}>
                      {props?.isOnDeck !== undefined ? (
                        <Typography className={classes.stateLabel_}>{t(onDeckValue(props?.isOnDeck))}</Typography>
                      ) : (
                        <Typography className={classes.stateLabel_}>{t(onDeckValue(props?.provisions.installationOnDeck))}</Typography>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {checkFotovoltaica(provisions.dossierSubtype) && props?.provisions?.currentProvision?.installationOnDeck && props?.provisions?.currentProvision?.installationOnDeck !== null && (
                <Grid item md={5} xs={12}>
                  <Grid container direction='column'>
                    <Grid item>
                      <Typography className={`${classes.label} ${classes.expansionPanelSummaryText}`}>
                        {t('provisions.newGeneration.requestData.technicalData.onDeck')}
                      </Typography>
                    </Grid>
                    <Grid item className={classes.input}>
                      <Typography className={classes.stateLabel_}>{t(onDeckValue2(props?.provisions?.currentProvision?.installationOnDeck))}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              )}
              {checkFotovoltaica(provisions.dossierSubtype) && props?.fotovoltaicaSuperficie !== null && (
                <Grid item md={5} xs={12}>
                  <Grid container direction='column'>
                    <Grid item>
                      <Typography className={`${classes.label} ${classes.expansionPanelSummaryText}`}>
                        {t('provisions.newGeneration.requestData.technicalData.fotovoltaicaSuperficie')}
                      </Typography>
                    </Grid>
                    <Grid item className={classes.input}>
                      <Typography className={classes.stateLabel_}>{t(fotovoltaicaSuperficieValue(props?.fotovoltaicaSuperficie))}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              )}
              {checkFotovoltaica(provisions.dossierSubtype) && props?.provisions?.currentProvision?.techData?.surfaceType !== undefined && (
                <Grid item md={5} xs={12}>
                  <Grid container direction='column'>
                    <Grid item>
                      <Typography className={`${classes.label} ${classes.expansionPanelSummaryText}`}>
                        {t('provisions.newGeneration.requestData.technicalData.fotovoltaicaSuperficie')}
                      </Typography>
                    </Grid>
                    <Grid item className={classes.input}>
                      <Typography className={classes.stateLabel_}>{t(fotovoltaicaSuperficieValue(props?.provisions?.currentProvision?.techData?.surfaceType ? props?.provisions?.currentProvision?.techData?.surfaceType : '0'))}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              )}
              
              {((checkAutoconsumo(props?.provisions?.currentProvision?.techData?.selfConsumType) || checkAutoconsumo(props?.typeAutoconsumo)) && props?.typeAutoconsumo !== null && props?.typeAutoconsumo?.trim() !== '') && (
                <Grid item md={5} xs={12}>
                  <Grid container direction='column'>
                    <Grid item>
                      <Typography className={`${classes.label} ${classes.expansionPanelSummaryText}`}>
                        {t('provisions.newGeneration.requestData.technicalData.typeAutoconsumo')}
                      </Typography>
                    </Grid>
                    <Grid item className={classes.input}>
                      <Typography className={classes.stateLabel_}>{t(ubicationType(props?.typeAutoconsumo))}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              )}
              {(checkAutoconsumo(props?.provisions?.currentProvision?.techData?.selfConsumType) || checkAutoconsumo(props?.typeAutoconsumo)) && props?.provisions?.currentProvision?.techData?.selfConsumType !== undefined && (
                <Grid item md={5} xs={12}>
                  <Grid container direction='column'>
                    <Grid item>
                      <Typography className={`${classes.label} ${classes.expansionPanelSummaryText}`}>
                        {t('provisions.newGeneration.requestData.technicalData.typeAutoconsumo')}
                      </Typography>
                    </Grid>
                    <Grid item className={classes.input}>
                      <Typography className={classes.stateLabel_}>{t(ubicationType(props?.provisions?.currentProvision?.techData?.selfConsumType))}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              )}
              {(checkAutoconsumo(props?.provisions?.currentProvision?.techData?.selfConsumType) || checkAutoconsumo(props?.typeAutoconsumo)) && (props?.typeConexion !== null && props?.typeConexion.trim() !== '') && (
                <Grid item md={5} xs={12}>
                  <Grid container direction='column'>
                    <Grid item>
                      <Typography className={`${classes.label} ${classes.expansionPanelSummaryText}`}>
                        {t('provisions.newGeneration.requestData.technicalData.typeConexion')}
                      </Typography>
                    </Grid>
                    <Grid item className={classes.input}>
                      <Typography className={classes.stateLabel_}>{t(typeConexionData(props?.typeConexion))}</Typography>
                      <Typography className={classes.stateLabel_}>{t(typeConexionData2(props?.typeConexion))}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              )}
              {((checkAutoconsumo(props?.provisions?.currentProvision?.techData?.selfConsumType) || checkAutoconsumo(props?.typeAutoconsumo)) && props?.provisions?.currentProvision?.techData?.CC !== '0' && props?.provisions?.currentProvision?.techData?.CC !== undefined) ? (
                <Grid item md={5} xs={12}>
                  <Grid container direction='column'>
                    <Grid item>
                      <Typography className={`${classes.label} ${classes.expansionPanelSummaryText}`}>
                        {t('provisions.newGeneration.requestData.technicalData.typeConexion')}
                      </Typography>
                    </Grid>
                    <Grid item className={classes.input}>
                      <Typography className={classes.stateLabel_}>CC</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ) : ((checkAutoconsumo(props?.provisions?.currentProvision?.techData?.selfConsumType) || checkAutoconsumo(props?.typeAutoconsumo)) && props?.provisions?.currentProvision?.techData?.CDM !== '0' && props?.provisions?.currentProvision?.techData?.CDM !== undefined) ? (
                <Grid item md={5} xs={12}>
                  <Grid container direction='column'>
                    <Grid item>
                      <Typography className={`${classes.label} ${classes.expansionPanelSummaryText}`}>
                        {t('provisions.newGeneration.requestData.technicalData.typeConexion')}
                      </Typography>
                    </Grid>
                    <Grid item className={classes.input}>
                      <Typography className={classes.stateLabel_}>CDM</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ) : ((checkAutoconsumo(props?.provisions?.currentProvision?.techData?.selfConsumType) || checkAutoconsumo(props?.typeAutoconsumo)) && props?.provisions?.currentProvision?.techData?.CPM !== '0' && props?.provisions?.currentProvision?.techData?.CPM !== undefined) ? (
                <Grid item md={5} xs={12}>
                  <Grid container direction='column'>
                    <Grid item>
                      <Typography className={`${classes.label} ${classes.expansionPanelSummaryText}`}>
                        {t('provisions.newGeneration.requestData.technicalData.typeConexion')}
                      </Typography>
                    </Grid>
                    <Grid item className={classes.input}>
                      <Typography className={classes.stateLabel_}>CPM</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (checkAutoconsumo(props?.provisions?.currentProvision?.techData?.selfConsumType) || checkAutoconsumo(props?.typeAutoconsumo)) && (currentProvision.internalNetwork === 'INTNET001' || currentProvision.internalNetwork === 'INTNET002') && (
                <Grid item md={5} xs={12}>
                  <Grid container direction='column'>
                    <Grid item>
                      <Typography className={`${classes.label} ${classes.expansionPanelSummaryText}`}>
                        {t('provisions.newGeneration.requestData.technicalData.typeConexion')}
                      </Typography>
                    </Grid>
                    <Grid item className={classes.input}>
                    <Typography className={classes.stateLabel_}>{t(typeConexionData3(currentProvision.internalNetwork))}</Typography>
                    <Typography className={classes.stateLabel_}>{t(typeConexionData4(currentProvision.internalNetwork))}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              )}
              {((checkAutoconsumo(props?.provisions?.currentProvision?.techData?.selfConsumType) || checkAutoconsumo(props?.typeAutoconsumo)) && props?.CGPSelected !== null && props?.CGPSelected.trim() !== '') && (
                <Grid item md={11} xs={12}>
                  <Grid container direction='column'>
                    <Grid item>
                      <Typography className={`${classes.label} ${classes.expansionPanelSummaryText}`}>
                        {t('provisions.newGeneration.requestData.technicalData.CGPSelected')}
                      </Typography>
                    </Grid>
                    <Grid item className={classes.input}>
                      <Typography className={classes.stateLabel_}>
                        {t(CGPSelectedData(props?.CGPSelected))}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              )}
              {(checkAutoconsumo(props?.provisions?.currentProvision?.techData?.selfConsumType) || checkAutoconsumo(props?.typeAutoconsumo)) && props?.provisions?.currentProvision?.techData?.CGPType !== undefined && (
                <Grid item md={11} xs={12}>
                  <Grid container direction='column'>
                    <Grid item>
                      <Typography className={`${classes.label} ${classes.expansionPanelSummaryText}`}>
                        {t('provisions.newGeneration.requestData.technicalData.CGPSelected')}
                      </Typography>
                    </Grid>
                    <Grid item className={classes.input}>
                      <Typography className={classes.stateLabel_}>
                        {t(CGPSelectedData(props?.provisions?.currentProvision?.techData?.CGPType))}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </ExpansionPanelSummary>
        }
        <ExpansionPanelDetails>
          <Grid container direction='column'>
            <Grid container justifyContent='space-between' spacing={3} className={classes.inputContainer}>
              <Grid item md={5} xs={12}>
                <Grid container direction='column'>
                  <Grid item>
                    <Typography className={classes.label}>
                      {t('provisions.newGeneration.requestData.technicalData.tension')}
                    </Typography>
                  </Grid>

                  <Grid item className={classes.input}>
                    {state === 0 ?
                      <Select
                        fullWidth
                        codFiltering
                        values={voltageSupplySelect}
                        value={techData.idDossierTensionType}
                        label={t('provisions.newGeneration.requestData.technicalData.selectPlaceholder')}
                        onChange={(e) => {
                          const value = e.target.value

                          setTechDataI({
                            ...techData,
                            idDossierTensionType: value
                          })
                        }}
                        onBlur={(e) => setTechDataErrors({
                          ...techDataErrors,
                          idDossierTensionType: {
                            bool: e.target.value === '',
                            msg: t('provisions.newGeneration.requestData.technicalData.errors.required')
                          }
                        })}
                        helperText={techDataErrors.idDossierTensionType && techDataErrors.idDossierTensionType.bool && techDataErrors.idDossierTensionType.msg}
                        error={techDataErrors.idDossierTensionType && techDataErrors.idDossierTensionType.bool}
                      />
                      :
                      <Typography className={classes.stateLabel}>{idDossierTensionType}</Typography>
                    }
                  </Grid>
                </Grid>
              </Grid>

              <Grid item md={5} xs={12}>
                <Grid container direction='column'>
                  <Grid item>
                    <Typography className={classes.label}>
                      {t('provisions.newGeneration.requestData.technicalData.centralName')}
                    </Typography>
                  </Grid>

                  <Grid item className={classes.input}>
                    {state === 0 ?
                      <Input
                        fullWidth
                        value={techData.centralName}
                        onChange={(e) => setTechDataI({
                          ...techData,
                          centralName: e.target.value
                        })}
                        onBlur={(e) => setTechDataErrors({
                          ...techDataErrors,
                          centralName: {
                            bool: e.target.value === '',
                            msg: t('provisions.newGeneration.requestData.technicalData.errors.required')
                          }
                        })}
                        helperText={techDataErrors.centralName && techDataErrors.centralName.bool && techDataErrors.centralName.msg}
                        error={techDataErrors.centralName && techDataErrors.centralName.bool}
                      />
                      :
                      <Typography className={classes.stateLabel}>{centralName}</Typography>
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container justifyContent='space-between' spacing={3} className={classes.inputContainer}>
              <Grid item md={5} xs={12}>
                <Grid container direction='column'>
                  <Grid item>
                    <Typography className={classes.label}>

                      {provisions.dossierSubtype !== 'DOSSUB028' ?
                        (<Grid item>
                          {t('provisions.newGeneration.requestData.technicalData.requestPower')}
                          {(autoconsumo || generaCogen) ?
                            <LightTooltip
                              title={t('provisions.newGeneration.requestData.technicalData.requestPowerTooltipaut')}
                              placement='right'
                            >
                              <img src={InfoIcon} alt='' />
                            </LightTooltip>
                            :
                            <LightTooltip
                              title={t('provisions.newGeneration.requestData.technicalData.requestPowerTooltipgen')}
                              placement='right'
                            >
                              <img src={InfoIcon} alt='' />
                            </LightTooltip>
                          }
                        </Grid>
                        ) : (
                          t('provisions.newGeneration.requestData.technicalData.requestPowerGeneration'))
                      }
                    </Typography>
                  </Grid>

                  <Grid item className={classes.input}>
                    {state === 0 ?
                      <Input
                        fullWidth
                        value={techData.totalPower}
                        onChange={(e) => {
                          !isNaN(e.target.value) &&
                            setTechDataI({
                              ...techData,
                              totalPower: e.target.value,
                              summaryProcedure: Number(e.target.value) <= 15 ? '1' : '0'
                            })

                          !isNaN(e.target.value) &&
                            setTechDataErrors({
                              ...techDataErrors,
                              totalPower: {
                                bool: (e.target.value === '' || isNaN(e.target.value) || (Number(e.target.value) > 15 && techData.summaryProcedure === '1')),
                                msg: e.target.value === '' ? t('provisions.newGeneration.requestData.technicalData.errors.required') : (isNaN(e.target.value) ? t('provisions.newGeneration.requestData.technicalData.errors.selectedPowerFormat') : '')
                                //msg: e.target.value === '' ? t('provisions.newGeneration.requestData.technicalData.errors.required') : (isNaN(e.target.value) ? t('provisions.newGeneration.requestData.technicalData.errors.selectedPowerFormat') : t('provisions.newGeneration.requestData.technicalData.errors.selectedPowerShort'))
                              }
                            })
                        }}
                        onBlur={(e) => checkPowerRequested(e)}
                        helperText={techDataErrors.totalPower && techDataErrors.totalPower.bool && techDataErrors.totalPower.msg}
                        error={(techDataErrors.totalPower && techDataErrors.totalPower.bool) || isNaN(techData.totalPower) || (Number(techData.totalPower) > 15 && techData.summaryProcedure === '1')}
                      />
                      :
                      <Typography className={classes.stateLabel}>{totalPower}</Typography>
                    }
                  </Grid>
                </Grid>
              </Grid>

              <Grid item md={5} xs={12}>
                <Grid container direction='column'>
                  <Grid item>
                    <Typography className={classes.label}>
                      {t('provisions.newGeneration.requestData.technicalData.generatorType')}
                    </Typography>
                  </Grid>

                  <Grid item className={classes.input}>
                    {state === 0 ?
                      <Select
                        fullWidth
                        codFiltering
                        values={generatorTypesSelect}
                        value={techData.idDossierGeneratorType}
                        label={t('provisions.newGeneration.requestData.technicalData.selectPlaceholder')}
                        onChange={(e) => {
                          const value = e.target.value

                          setTechDataI({
                            ...techData,
                            idDossierGeneratorType: value
                          })
                        }}
                        onBlur={(e) => setTechDataErrors({
                          ...techDataErrors,
                          idDossierGeneratorType: {
                            bool: e.target.value === '',
                            msg: t('provisions.newGeneration.requestData.technicalData.errors.required')
                          }
                        })}
                        helperText={techDataErrors.idDossierGeneratorType && techDataErrors.idDossierGeneratorType.bool && techDataErrors.idDossierGeneratorType.msg}
                        error={techDataErrors.idDossierGeneratorType && techDataErrors.idDossierGeneratorType.bool}
                      />
                      :
                      <Typography className={classes.stateLabel}>{idDossierGeneratorType}</Typography>
                    }
                  </Grid>
                </Grid>
              </Grid>

              {provisions.dossierSubtype === 'DOSSUB028' &&
                <Grid item md={5} xs={12}>
                  <Grid container direction='column'>
                    <Grid item>
                      <Typography className={classes.label}>
                        {t('provisions.newGeneration.requestData.technicalData.requestPowerConsumption')}
                      </Typography>
                    </Grid>

                    <Grid item className={classes.input}>
                      {state === 0 ?
                        <Input
                          fullWidth
                          //value={techData.totalPowerInstall}
                          value={capacidadAcceso && capacidadAcceso.replace('.', ',')}
                          //onInput={(e) => handlePowerRequested(e)}
                          inputProps={{
                            maxlength: '10'
                          }}
                          onChange={(e) => {
                            const capAcceso = e.target.value
                            !isNaN(capAcceso) && setCapacidadAcceso(capAcceso)

                            // setCapacidadAcceso(e.target.value)

                            // !isNaN(e.target.value) &&

                            //   setTechDataI({
                            //     ...techData,
                            //     capacidadAcceso: e.target.value
                            //   })

                            // !isNaN(e.target.value) &&
                            //   setTechDataErrors({
                            //     ...techDataErrors,
                            //     capacidadAcceso: {
                            //       bool: (e.target.value === '' || isNaN(e.target.value)),
                            //       msg: e.target.value === '' ? t('provisions.newGeneration.requestData.technicalData.errors.required') : ''
                            //       //msg: e.target.value === '' ? t('provisions.newGeneration.requestData.technicalData.errors.required') : (isNaN(e.target.value) ? t('provisions.newGeneration.requestData.technicalData.errors.selectedPowerFormat') : t('provisions.newGeneration.requestData.technicalData.errors.selectedPowerShort'))
                            //     }
                            //   })
                          }}

                          onBlur={(e) => changeTechDataErrors(e.target.value)}
                          helperText={techDataErrors.capacidadAcceso && techDataErrors.capacidadAcceso.bool && techDataErrors.capacidadAcceso.msg}
                          error={(techDataErrors.capacidadAcceso && techDataErrors.capacidadAcceso.bool)}
                        />
                        :
                        <Typography className={classes.stateLabel}>
                          {capacidadAcceso}
                        </Typography>
                      }
                    </Grid>
                  </Grid>
                </Grid>
              }

              <Grid item md={5} xs={12}>
                <Grid container direction='column'>
                  <Grid item>
                    <Typography className={classes.label}>
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
                        onBlur={(e) => setTechDataErrors({
                          ...techDataErrors,
                          idDossierTensionSubtype: {
                            bool: e.target.value === '',
                            msg: t('provisions.newGeneration.requestData.technicalData.errors.required')
                          }
                        })}
                        error={techDataErrors.idDossierTensionSubtype && techDataErrors.idDossierTensionSubtype.bool}
                        disabled={!techData.idDossierTensionType}
                        helperText={techDataErrors.idDossierTensionSubtype && techDataErrors.idDossierTensionSubtype.bool && techDataErrors.idDossierTensionSubtype.msg}
                        isLoading={isLoadingTensionSubtype}
                      />
                      :
                      <Typography className={classes.stateLabel}>{idDossierTensionSubtype}</Typography>
                    }
                  </Grid>
                </Grid>
              </Grid>

              <Grid item md={5} xs={12}>
                <Grid container direction='column'>
                  <Grid item>
                    <Typography className={classes.label}>
                      {provisions.dossierSubtype !== 'DOSSUB028' ?
                        t('provisions.newGeneration.requestData.technicalData.totalPowerInstall')
                        :
                        (<Grid item>
                          {t('provisions.newGeneration.requestData.technicalData.totalPowerInstallGeneration')}
                          <LightTooltip
                            title={t('provisions.newGeneration.requestData.technicalData.requestPowerTooltipaut')}
                            placement='right'
                          >
                            <img src={InfoIcon} alt='' />
                          </LightTooltip>
                        </Grid>
                        )}
                    </Typography>
                  </Grid>

                  <Grid item className={classes.input}>
                    {state === 0 ?
                      <Input
                        fullWidth
                        //value={techData.totalPowerInstall}
                        value={techData.totalPowerInstall && techData.totalPowerInstall.replace('.', ',')}
                        //onInput={(e) => handlePowerRequested(e)}
                        onChange={(e) => handlePowerRequested(e)}
                        onBlur={(e) => changeTechDataErrors(e.target.value)}
                        helperText={techDataErrors.totalPowerInstall && techDataErrors.totalPowerInstall.bool && techDataErrors.totalPowerInstall.msg}
                        error={(techDataErrors.totalPowerInstall && techDataErrors.totalPowerInstall.bool)}
                      />
                      :
                      <Typography className={classes.stateLabel}>{totalPowerInstall}</Typography>
                    }
                  </Grid>
                </Grid>
              </Grid>

              <Grid item md={5} xs={12}>
                <Grid container direction='column'>
                  <Grid item>
                    <Typography className={classes.label}>
                      {t('provisions.newGeneration.requestData.technicalData.genModCatalog')}

                      <LightTooltip
                        title={t('provisions.newGeneration.requestData.technicalData.genModCatalogTooltip')}
                        placement='right'
                      >
                        <img src={InfoIcon} alt='' />
                      </LightTooltip>
                    </Typography>
                  </Grid>

                  <Grid item className={classes.input}>
                    {state === 0 ?
                      <Select
                        fullWidth
                        codFiltering
                        values={catalogGenerationModSelect}
                        value={techData.genModCatalog}
                        label={t('provisions.newGeneration.requestData.technicalData.selectPlaceholder')}
                        onChange={(e) => {
                          const value = e.target.value
                          setTechDataI({
                            ...techData,
                            genModCatalog: value
                          })
                        }}
                        helperText={techDataErrors.genModCatalog && techDataErrors.genModCatalog.bool && techDataErrors.genModCatalog.msg}
                        error={techDataErrors.genModCatalog && techDataErrors.genModCatalog.bool}

                      />
                      :
                      <Typography className={classes.stateLabel}>{genModCatalog}</Typography>
                    }
                  </Grid>
                </Grid>
              </Grid>

              <Grid item md={5} xs={12}>
                <Grid item className={classes.label}>
                  <Typography>
                    {t('provisions.newGeneration.requestData.technicalData.accumulation')}
                  </Typography>
                </Grid>
                <Grid item className={classes.input}>
                  <div className={classes.marginLeft}>
                    <Switch
                      onChange={handleAccumulation}
                      checked={checkedSwitch}
                      disabled={state !== 0}
                    />
                  </div>
                </Grid>
              </Grid>

              {/*{(distributorPowerGranted != null && distributorPowerGranted !== '' && distributorPowerGranted !== '0') &&
                <Grid item md={5} xs={12}>
                  <Grid container direction='column'>
                    <Grid item>
                      <Typography className={classes.label}>
                        {t('provisions.newGeneration.requestData.technicalData.distributorPowerGranted')}
                      </Typography>
                    </Grid>
                    <Grid item className={classes.input}>
                      <Typography className={classes.stateLabel}>{distributorPowerGranted}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              }*/}
              {(significanceIt != null && significanceIt !== '') &&
                <Grid item md={5} xs={12}>
                  <Grid container direction='column'>
                    <Grid item>
                      <Typography className={classes.label}>
                        {t('provisions.newGeneration.requestData.technicalData.significanceIt')}
                      </Typography>
                    </Grid>

                    <Grid item className={classes.input}>
                      <Typography className={classes.stateLabel}>{significanceIt}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              }

              <Grid item md={12} xs={12}>
                {state === 0 ?
                  <div className={classes.procedure}>
                    <Grid container className={classes.checkboxContainer}>
                      <Grid style={{ display: 'flex', width: '100%', marginTop: '5px' }}>
                        <Grid item className='checkbox' style={{ margin: 'auto 0' }}>
                          <Checkbox
                            disabled={true}
                            selected={techData.summaryProcedure === '1'}
                            style={{ margin: 'auto 0' }}
                          />
                        </Grid>

                        <Grid item className='label'>
                          <span
                            onClick={() => {
                              setTechDataErrors({
                                ...techDataErrors,
                                totalPower: {
                                  bool: (techData.totalPower === '' || isNaN(techData.totalPower) || (Number(techData.totalPower) > 15 && techData.summaryProcedure === '0')),
                                  msg: techData.totalPower === '' ? t('provisions.newGeneration.requestData.technicalData.errors.required') : (isNaN(techData.totalPower) ? t('provisions.newGeneration.requestData.technicalData.errors.selectedPowerFormat') : t('provisions.newGeneration.requestData.technicalData.errors.selectedPowerShort'))
                                }
                              })
                            }}
                          >
                            {t('provisions.newGeneration.requestData.technicalData.abreviatedProcedureCheckbox')}
                          </span>
                        </Grid>
                      </Grid>

                      <Grid style={{ display: 'flex', width: '100%', marginTop: '5px' }}>
                        <Grid item className='checkbox' style={{ margin: 'auto 0' }}>
                          <Checkbox
                            selected={techData.sendExtensionBudgetInd === '1'}
                            handleClick={() => {
                              setTechDataI({
                                ...techData,
                                sendExtensionBudgetInd: techData.sendExtensionBudgetInd === '0' ? '1' : '0'
                              })
                              setSendExtensionBudgetInd(techData.sendExtensionBudgetInd === '0' ? '1' : '0')
                            }}
                            style={{ margin: 'auto 0' }}
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

                      {(autoconsumo || generaCogen) &&
                        <Grid style={{ display: 'flex', width: '100%', marginTop: '5px' }}>
                          <Grid item className='checkbox' style={{ margin: 'auto 0' }}>
                            <Checkbox
                              selected={techData.signedDocApplicantOwner === '1'}
                              handleClick={() => {
                                setTechDataI({
                                  ...techData,
                                  signedDocApplicantOwner: techData.signedDocApplicantOwner === '0' ? '1' : '0'
                                })
                              }}
                            />
                          </Grid>
                          <Grid item className='label'>
                            <span
                              onClick={() => {
                                setTechDataI({
                                  ...techData,
                                  signedDocApplicantOwner: techData.signedDocApplicantOwner === '0' ? '1' : '0'
                                })
                              }}
                            >
                              {t('provisions.newGeneration.requestData.technicalData.signedDocApplicantOwnerTooltip')}
                            </span>
                          </Grid>
                          {/* <Grid item className='link'>
                            <span onClick={handleDownloadHoldersAgreement}>
                              {t('provisions.newGeneration.requestData.technicalData.downloadPDF')}
                            </span>
                          </Grid> */}
                        </Grid>
                      }
                    </Grid>
                  </div>
                  :
                  <Grid container direction='column'>
                    <Grid item>
                      <Typography className={classes.label}>
                        {t('provisions.newGeneration.requestData.technicalData.abreviatedProcedureCheckbox')}
                      </Typography>
                    </Grid>

                    <Grid item>
                      <Typography className={classes.stateLabel}>{currentProvision?.techData?.summaryProcedure === '1' ? t('provisions.newGeneration.requestData.technicalData.yes') : t('provisions.newGeneration.requestData.technicalData.no') }</Typography>
                    </Grid>

                    <Grid item>
                      <Typography className={classes.label}>
                        {t('provisions.newGeneration.requestData.technicalData.sendExtensionBudgetCheckbox')}
                      </Typography>
                    </Grid>

                    <Grid item>
                      <Typography className={classes.stateLabel}>{sendExtensionBudgetInd === '1' ? t('provisions.newGeneration.requestData.technicalData.yes') : sendExtensionBudgetInd === '0' ? t('provisions.newGeneration.requestData.technicalData.no') : (techData.sendExtensionBudgetInd === '0' ? t('provisions.newGeneration.requestData.technicalData.no') : t('provisions.newGeneration.requestData.technicalData.yes'))}</Typography>
                    </Grid>

                    {(autoconsumo || generaCogen || signedDocApplicantOwner === '1'
                      || provisions.dossierSubtype === 'DOSSUB020') &&
                      <>
                        <Grid item>
                          <Typography className={classes.label}>
                            {t('provisions.newGeneration.requestData.technicalData.signedDocApplicantOwnerTooltip')}
                          </Typography>
                        </Grid>

                        <Grid item>
                          <Typography className={classes.stateLabel}>{signedDocApplicantOwner === '1' ? t('provisions.newGeneration.requestData.technicalData.yes') : signedDocApplicantOwner === '0' ? t('provisions.newGeneration.requestData.technicalData.no') : <br />}</Typography>
                        </Grid>
                      </>
                    }
                  </Grid>
                }
              </Grid>
            </Grid>

            <Grid container justifyContent='space-between' className={classes.inputContainer}>
              <Grid item md={12} xs={12}>
                <Grid container direction='column'>
                  <Grid item>
                    <Typography className={classes.label}>{t('provisions.newGeneration.requestData.technicalData.description')}</Typography>
                  </Grid>

                  <Grid item className={classes.input}>
                    {state === 0 ?
                      <>
                        <Input
                          fullWidth
                          multiline
                          rows='5'
                          className={classes.description}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          inputProps={{
                            maxlength: '290'
                          }}
                          onBlur={(e) => setTechDataErrors({ ...techDataErrors, description: { bool: e.target.value === '', msg: t('provisions.newProvision.requestData.supplyType.form.errors.required') } })}
                          helperText={techDataErrors.description && techDataErrors.description.bool && techDataErrors.description.msg}
                          error={techDataErrors.description && techDataErrors.description.bool}
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
                      <Typography className={classes.stateLabel}>
                        {showComments(description, techData.observations)}
                      </Typography>
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container justifyContent='space-between'>
              <Grid item md={5} xs={12}>
                <Grid container direction='column'>
                  <Grid item>
                    <Typography className={classes.label}>
                      {t('provisions.newGeneration.requestData.technicalData.royalDecree')}
                    </Typography>
                  </Grid>

                  <Grid item className={classes.royalDecreeContainer}>
                    <div>
                      <a href='https://www.boe.es/buscar/act.php?id=BOE-A-2000-24019' target='_blank' rel='noopener noreferrer'>RD 1955/2000</a>
                    </div>

                    <div className='separated'>
                      <a href='https://www.boe.es/buscar/doc.php?id=BOE-A-2011-19242' target='_blank' rel='noopener noreferrer'>RD 1699/2011</a>
                    </div>

                    <div className='separated'>
                      <a href='https://www.boe.es/diario_boe/txt.php?id=BOE-A-2014-6123' target='_blank' rel='noopener noreferrer'>RD 413/2014</a>
                    </div>

                    <div className='separated'>
                      <a href='https://www.boe.es/buscar/act.php?id=BOE-A-2020-17278' target='_blank' rel='noopener noreferrer'>RD 1183/2020</a>
                    </div>

                    <div className='separated'>
                      <a href='https://www.boe.es/buscar/act.php?id=BOE-A-2019-5089' target='_blank' rel='noopener noreferrer'>RD 244/2019</a>
                    </div>

                    <div className='separated'>
                      <a href='https://www.boe.es/buscar/act.php?id=BOE-A-2021-904' target='_blank' rel='noopener noreferrer'>Circular 1/2021</a>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </>
  )
}

export default TechnicalData
