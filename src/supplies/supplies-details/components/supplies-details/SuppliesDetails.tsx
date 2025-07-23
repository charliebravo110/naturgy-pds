import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import { formatDate, formatIsoDate } from '../../../../common/lib/FormatLib'
import Dialog from '../../../components/dialog/Dialog'
import Alert from '../../../../common/components/alert/Alert'
import NoSupplyDialog from '../no-supplydata-dialog/NoSupplyDataDialog'
import StormWarningDialog from '../storm-warning-dialog/StormWarningDialog'
import StormWarningSuccessDialog from '../storm-warning-success-dialog/StormWarningSuccessDialog'
import ButtonToTop from '../../../../common/components/button-to-top/ButtonToTop'
import Spinner from '../../../../common/components/spinner/Spinner'
import Summary from '../summary/Summary'
import Navigation from '../navigation/Navigation'

// LCS: Importa la función - Wave 2
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm'

import {
  thunkListDelegates
} from '../../../../delegates/store/actions/DelegatesThunkActions'

import { thunkGetSupply } from '../../store/actions/SuppliesDetailsThunkActions'

import {
  setRequestsListSupply
} from '../../../../requests/store/actions/RequestsActions'

import {
  thunkGetCurrentSupplyConsumptions,
  thunkGetCurrentCompareConsumptions,
  thunkGetMasterData,
  thunkGetMasterDataOnlyMaster
} from '../../store/actions/SuppliesDetailsThunkActions'

import {
  setCurrentSupplyConsumptions,
  setCurrentCompareConsumptions,
  resetCurrentSupplyProgrammedReads
} from '../../../store/actions/SuppliesActions'

import { SecurityHOC } from '../../../../common/HOC/SecurityHOC'

import {
  setUrlMessagesDetail,
  setUrlMessagesSupplyDataConsumptionTabValue,
  setUrlMessagesSupplyDataGenerationTabValue,
  setUrlMessagesSupplyDataSupply,
  setUrlMessagesSupplyDataTabValue,
  setUrlMessagesSupplyDataMenuTabValue,
  setUrlMessagesSupplyDataIsSelfConsumption,
  setUrlMessagesSupplyDataIsGeneration,
  resetUrlMessagesSupplyData
} from '../../../../common/components/send-url/store/actions/UrlMessagesActions'
import { adminCheck } from '../../../../common/lib/ValidationLib'

import useStyles from './SuppliesDetails.styles'
import Dropdown1 from './dropdown/Dropdown1'
import Dropdown2 from './dropdown/Dropdown2'
import { thunkGetSupplyCups } from '../../../../gestionAverias/actions/GestionAveriasThunkActions'
import Modales from '../consumption/charts/filters/error-message/Modales'
import useModal from '../consumption/charts/filters/error-message/UseModal'
import CloseIcon from '../../../../assets/icons/cerrar.svg'
import AlertIcon from '../../../../assets/icons/aviso_alerta_pop_up.svg'
import useStyles_ from '../../../../supplies/supplies-details/components/consumption/charts/filters/error-message/SessionTimeout.styles'
import { thunkGetContractsSupply } from '../../../store/actions/SuppliesThunkActions'

const SuppliesDetails = (props: any) => {
  const classes_ = useStyles_({})
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {isOpen, toggle} = useModal()

  const roles = sessionStorage.getItem('userRoles') || ''

  const suppliesListStore = useSelector((state: any) => state.supplies.list)
  const delegations = useSelector((state: any) => state.delegations)
  const delegatesInMe = useSelector((state: any) => state.delegations.delegatesInMeList)
  const adminToken = useSelector((state: any) => state.admin.token)
  const userToken = useSelector((state: any) => state.user.token)
  const user = useSelector((state: any) => state.user.profile)

  const [tabValue, setTabValue] = useState(0)
  const [menuTabValue, setMenuTabValue] = useState(0)

  const [consumptionTabValueFromURL, setConsumptionTabValueFromURL] = useState('')
  const [generationTabValueFromURL, setGenerationTabValueFromURL] = useState('')
  const [contractsError, setContractsError] = useState(false)
  const [contractsEnabled, setContractsEnabled] = useState(false)
  const [OngoingorderedData, setOngoingOrderedData] = useState(false)
  const [ClosedorderedData, setClosedOrderedData] = useState(false)


  
  let estados_recibida = ['21']
  let estados_en_curso = ['22','25','27','40','44','46']
  let estados_incidencia = ['28']
  let estados_finalizada = ['30','32']
  let estados_rechazada = ['23','24','26','29','45']
  let estados_anulada = ['26']

  // const [contractsEnabled, setContractsEnabled] = useState(false) 

  useEffect(() => {
    dispatch(thunkGetMasterDataOnlyMaster('CONTRACT', 'ES', (r) => {
      for (let index = 0; index < r.length; index++) {
        const element = r[index];
        if(element.key === 'SCREENS_ACTIVE'){
          console.log('r: ', r[index].value);
          
          if (element.value === '1') {
            setContractsEnabled(true)
          } else if (element.value === '0') {
            setContractsEnabled(false)
          } else {
            setContractsEnabled(false)
          }
        }
        else if(element.key.includes('STATUS_')){
          let estados_separados = element.value.split(',')
          switch (element.key) {
            case 'STATUS_RECIBIDA':
              estados_recibida = estados_separados
              break;
            case 'STATUS_EN_CURSO':
              estados_en_curso = estados_separados
              break;

            case 'STATUS_INCIDENCIA':
              estados_incidencia = estados_separados
              break;

            case 'STATUS_FINALIZADA':
              estados_finalizada = estados_separados
              break;

            case 'STATUS_RECHAZADA':
              estados_rechazada = estados_separados
              break;

            case 'STATUS_ANULADA':
              estados_anulada = estados_separados
              break;
          
            default:
              break;
          }
        }
      }
    }))
  }, [])

  const [navToMeter, setNavToMeter] = useState(false)

  let dateTo = new Date()
  dateTo.setDate(dateTo.getDate())

  let dateFrom = new Date(dateTo.getFullYear(), dateTo.getMonth() - 6, 1)

  const [consumptionsFilters, setConsumptionsFilters] = useState({
    granularity: 'M',
    startDate: formatDate(dateFrom),
    endDate: formatDate(dateTo),
    compare: 'N',
    startDateCompare: formatDate(dateFrom),
    endDateCompare: formatDate(dateTo),
    showR1: 'N',
    showR2: 'N',
    showR3: 'N',
    showR4: 'N'
  })

  const [selfConsumptionsFilters, setSelfConsumptionsFilters] = useState({
    granularity: 'M',
    startDate: formatDate(dateFrom),
    endDate: formatDate(dateTo),
    compare: 'N',
    startDateCompare: formatDate(dateFrom),
    endDateCompare: formatDate(dateTo)
  })

  const [powersFilters, setPowersFilters] = useState({
    granularity: 'M',
    startDate: formatDate(dateFrom),
    endDate: formatDate(dateTo),
    compare: 'N'
  })

  const [supplyData, setSupplyData] = useState(suppliesListStore.filter(supply => supply.cups === (props.location.state && props.location.state.cups))[0] || delegatesInMe.filter(supply => supply.cups === (props.location.state && props.location.state.cups))[0])
  const isDelegate = (roles.includes('US_MANAGER') || roles.includes('US_CONSULTANT')) && suppliesListStore.filter(supply => supply.cups === (props.location.state && props.location.state.cups))[0] ? false : delegatesInMe.filter(supply => supply.cups === (props.location.state && props.location.state.cups))[0] ? true : false

  const [indexSupplyData] = useState(suppliesListStore.indexOf(supplyData))

  const [isLoadingSuppliesList, setLoadingSuppliesList] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const [showingDialog, setShowingDialog] = useState(false)
  const [showingNoSupplyDataDialog, setShowingNoSupplyDataDialog] = useState(false)
  const [showingStormWarningDialog, setShowingStormWarningDialog] = useState(false)
  const [showingStormWarningSuccessDialog, setShowingStormWarningSuccessDialog] = useState(false)

  const [delegatesList, setDelegatesList] = useState([] as any)
  const [loadingDelegatesList, setLoadingDelegatesList] = useState(true)
  const [delegateRole, setDelegateRole] = useState('')
  const currentItemCups = [props.location.state && props.location.state.cups] as any
  const [supplantedUser, setSupplantedUser] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [creatingNewRequestFromMeter, setCreatingNewRequestFromMeter] = useState(0)
  const [stormWarningSrCode, setStormWarningSrCode] = useState('')
  const [mdmout, setMdmout] = useState<string>('false')
  const [strnout, setStrnout] = useState<string>('false')
  const [querySelfConsumption, setQuerySelfConsumption] = useState<boolean>(props.location.state && props.location.state.dashboard === 'linkSelfConsumptions' ? true : false)

  const [scheme, setScheme] = useState(supplyData && supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau !== '' && supplyData.isSelfConsumption.scheme ? supplyData.isSelfConsumption.scheme : '')
  const [selfConsumptionType, setSelfConsumptionType] = useState(supplyData && supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau !== '' && supplyData.isSelfConsumption.selfConsumptionType ? supplyData.isSelfConsumption.selfConsumptionType : '')
  const [subSection, setSubSection] = useState(supplyData && supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau !== '' && supplyData.isSelfConsumption.subSection ? supplyData.isSelfConsumption.subSection : '')
  const [section, setSection] = useState(supplyData && supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau !== '' && supplyData.isSelfConsumption.section ? supplyData.isSelfConsumption.section : '')
  const [installationType, setInstallationType] = useState(supplyData && supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau !== '' && supplyData.isSelfConsumption.installationType ? supplyData.isSelfConsumption.installationType : '')

  const [supplyActualizado, setSupplyActualizado] =useState(supplyData);

  //listado de periodos de facturación de un CUPS
  const [billingStartDate, setBilingStartDate] = useState(null)
  const [billingEndDate, setBilingEndDate] = useState(null)
 
  useEffect(() => {
    if (supplyData?.isSelfConsumption?.scheme) {
      dispatch(thunkGetMasterData('DATOS_AUTOCONSUMOS', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), scheme, (response) => {
        if (response) {
          setScheme(response[0].value)
        }
      }))
    }
    if (supplyData?.isSelfConsumption?.selfConsumptionType) {
      dispatch(thunkGetMasterData('DATOS_AUTOCONSUMOS', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), selfConsumptionType, (response) => {
        if (response) {
          setSelfConsumptionType(response[0].value)
        }
      }))
    }
    if (supplyData?.isSelfConsumption?.subSection) {
      dispatch(thunkGetMasterData('DATOS_AUTOCONSUMOS_SUBSECCION', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), subSection, (response) => {
        if (response) {
          setSubSection(response[0].value)
        }
      }))
    }
    if (supplyData?.isSelfConsumption?.section) {
      dispatch(thunkGetMasterData('DATOS_AUTOCONSUMOS_SECCION', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), section, (response) => {
        if (response) {
          setSection(response[0].value)
        }
      }))
    }
    if (supplyData?.isSelfConsumption?.installationType) {
      dispatch(thunkGetMasterData('DATOS_AUTOCONSUMOS_TYPE', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), installationType, (response) => {
        if (response) {
          setInstallationType(response[0].value)
        }
      }))
    }

    // eslint-disable-next-line
  }, [])


  useEffect(() => {
    if (supplyData?.holderDocumentNumber && supplyData?.cups) {
      dispatch(thunkGetSupplyCups(supplyData.holderDocumentNumber, supplyData.cups, (response) => {
        if (response) {
          if (response.supplyPoints) {
            setSupplyActualizado(response.supplyPoints.items[0])
          }
        }
      }))
    }
  }, [supplyData])

  useEffect(() => {

    const cups = props.location.state && props.location.state.cups

    if (userToken !== '' && !showingNoSupplyDataDialog) {
      dispatch(setCurrentSupplyConsumptions([]))
      dispatch(setCurrentCompareConsumptions([]))
      const cups = props.location.state && props.location.state.cups
      const dashboard = props.location.state && props.location.state.dashboard

      if (dashboard === 'linkEnergiaGenerada') {
        setTabValue(1)
        setMenuTabValue(1)
      } else if (dashboard === 'linkConsumptions') {
        // supplyData.isSelfConsumption
        supplyData.isGenerator === '1' ? setTabValue(2) : setTabValue(1)
        setMenuTabValue(1)
      } else if (dashboard === 'linkSelfConsumptions') {
        supplyData.isGenerator === '1' ? setTabValue(3) : setTabValue(2)
        setMenuTabValue(1)
      } else if (dashboard === 'linkpotencia') {
        //supplyData.isSelfConsumption
        supplyData.isGenerator === '1' ? supplyData.isSelfConsumption ? setTabValue(4) : setTabValue(3) : supplyData.isSelfConsumption ? setTabValue(3) : setTabValue(2)
        setMenuTabValue(1)
      } else if (dashboard === 'linkContador') {
        //supplyData.isSelfConsumption
        supplyData.isSelfConsumption ? setTabValue(5) : setTabValue(4)
        setMenuTabValue(1)
      } else if (dashboard === 'contracts') {
        if (supplyData && supplyData.isGenerator) {
          supplyData.isGenerator === '1' ? (supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau !== '' ) ? setTabValue(6) : setTabValue(4) : (supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau !== '' ) ? setTabValue(9) : setTabValue(8)
          setMenuTabValue(3)
        }
      }
      props.location.state.dashboard = ''

      if (!cups || (cups && suppliesListStore.filter(supply => supply.cups === cups).length === 0 && delegatesInMe.filter(supply => supply.cups === cups).length === 0)) {
        // redirigir a la lista
        props.history.push('/supplies')
      } else {
        setIsLoading(true)

        if ((suppliesListStore.filter(supply => supply.cups === cups).length === 0 && delegations.delegationsInManagersList.filter(supply => supply.cups === cups).length > 0) && isLoadingSuppliesList) {
          let supplyPointDefaultName = t('delegations.supplyPointDefaultName')

          dispatch(thunkGetSupply(supplyPointDefaultName, cups, (response) => {
            // callback!
            if (response && response.length > 0) {
              setSupplyData(response[0])
            }
            setLoadingSuppliesList(false)
          }))
        }

        if (supplyData) {
          let currentSupply = suppliesListStore.find(supply => supply.cups === cups)

          if (!currentSupply) {
            currentSupply = delegations.delegatesInMeList.find(item => item.cups === cups)

            if (currentSupply) {
              setSupplantedUser(true)
            }
          }

          if (!querySelfConsumption) {
            if (currentSupply) {
              dispatch(thunkGetCurrentSupplyConsumptions(true, supplyData.holderDocumentNumber, cups, consumptionsFilters.granularity, consumptionsFilters.startDate, consumptionsFilters.endDate, setIsLoading, supplyData.isGenerator, supplantedUser, isDelegate, null, '0', supplyData.measurementSystem, () => {
                // callback!
              }))
              if (consumptionsFilters.compare === 'C') {
                dispatch(thunkGetCurrentCompareConsumptions(true, cups, consumptionsFilters.granularity, consumptionsFilters.startDateCompare, consumptionsFilters.endDateCompare, setIsLoading, supplyData.isGenerator, supplantedUser, isDelegate, null, '0', supplyData.measurementSystem, () => {
                  // callback!
                }))
              }
            } else {
              setIsLoading(false)
            }
          } else {
            if (currentSupply) {
              dispatch(thunkGetCurrentSupplyConsumptions(true, supplyData.holderDocumentNumber, cups, selfConsumptionsFilters.granularity, selfConsumptionsFilters.startDate, selfConsumptionsFilters.endDate, setIsLoading, supplyData.isGenerator, supplantedUser, isDelegate, null, '1', supplyData.measurementSystem, () => {
                // callback!
              }))
              if (selfConsumptionsFilters.compare === 'C') {
                dispatch(thunkGetCurrentCompareConsumptions(true, cups, selfConsumptionsFilters.granularity, selfConsumptionsFilters.startDateCompare, selfConsumptionsFilters.endDateCompare, setIsLoading, supplyData.isGenerator, supplantedUser, isDelegate, null, '1', supplyData.measurementSystem, () => {
                  // callback!
                }))
              }
            } else {
              setIsLoading(false)
            }
          }
          // LCS: Enviar evento de GdC a GA - Wave 2
          sendGAEvent({
            event: 'view',
            content_group: 'datos del punto de suministro',
            page_url: removeEmails(window.location.href),
            user_id: sessionStorage.getItem('id'),
            previous_path: sessionStorage.getItem('previous_path') ? removeEmails(sessionStorage.getItem('previous_path')) : 'no aplica',
            user_type: sessionStorage.getItem('user_type'),
            browsing_type: sessionStorage.getItem('browsing_type'),
            element_type: 'medicion de pagina',
            cups: cups,
            supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
            ga_client_id: sessionStorage.getItem('ga_client_id')
          });
        }
      }
    }
    // eslint-disable-next-line
  }, [userToken, suppliesListStore.length, delegatesInMe.length, supplyData, consumptionsFilters, selfConsumptionsFilters, querySelfConsumption, props.location.state])

  useEffect(() => {
    //Aqui validamos si el servicio MDM o SATURNE estan activos
    getServiceStatus()

    dispatch(setCurrentSupplyConsumptions([]))
    dispatch(setCurrentCompareConsumptions([]))
    dispatch(setRequestsListSupply([]))
    dispatch(resetCurrentSupplyProgrammedReads())

    //Aqui validamos si el servicio MDM o SATURNE estan activos
    getServiceStatus()
  }, [])

  const handleDelegateOrAuthorize = (role: string) => {
    if (!adminToken) {
      setShowingDialog(true)

      setDelegateRole(role)

      dispatch(thunkListDelegates(role, setLoadingDelegatesList, (response) => {
        if (response && response.result.codResult === '0000') {
          if (response.delegates.items.length === 0) {
            setDelegatesList([])
          } else {
            setDelegatesList(response.delegates.items)
          }
        }
      }))
    }
  }

  const openNoSupplyDataDialog = () => {
    setShowingNoSupplyDataDialog(true)
  }

  const handleOpenAlert = () => {
    setOpenAlert(true)
  }

  //llamamos esta funcion para recuperar el estado de mdm y saturne
  const getServiceStatus = async () => {
    await dispatch(thunkGetMasterData('MDM_OUT', 'ES', 'MDMOUT', (response) => {
      if (response !== undefined && response.length > 0) {
        setMdmout(response[0].value)
      }
    }));

    await dispatch(thunkGetMasterData('SATURNE_OUT', 'ES', 'STRNOUT', (response) => {
      if (response !== undefined && response.length > 0) {
        setStrnout(response[0].value)
      }
    }));
  }

  const setUrlMessagesData = (supplyData, tabValue, menuTabValue) => {
    dispatch(resetUrlMessagesSupplyData())
    dispatch(setUrlMessagesSupplyDataSupply(supplyData.cups))
    dispatch(setUrlMessagesSupplyDataTabValue(tabValue.toString()))
    dispatch(setUrlMessagesSupplyDataMenuTabValue(menuTabValue.toString()))
    dispatch(setUrlMessagesSupplyDataIsSelfConsumption(supplyData.isSelfConsumption ? true : false))
    dispatch(setUrlMessagesSupplyDataIsGeneration(supplyData.isGenerator === '1' ? true : false))

    // Si el CUPS es de generación
    if (supplyData.isGenerator === '1') {
      // tabValue = 0 - Datos Generales
      if (tabValue === 0) {
        dispatch(setUrlMessagesDetail('SUPPLIES_GENERAL_DATA'))
      }
      // tabValue = 1 - Genereación
      else if (tabValue === 1) {
        dispatch(setUrlMessagesDetail('SUPPLIES_GENERATION_EG'))
        dispatch(setUrlMessagesSupplyDataGenerationTabValue('0'))
      }
      // tabValue = 2 - Mi Consumo
      else if (tabValue === 2) {
        dispatch(setUrlMessagesDetail('SUPPLIES_CONSUMPTION_EC'))
        dispatch(setUrlMessagesSupplyDataConsumptionTabValue('0'))
      }
      // tabValue = 3 - CUPS Autoconsumo > Autoconsumo | CUPS NO Autoconsumo > Potencia Máxima Demandada
      else if (tabValue === 3) {
        dispatch(setUrlMessagesDetail(supplyData.isSelfConsumption ? 'SUPPLIES_SELF_CONSUMPTION' : 'SUPPLIES_MAX_POTENCY'))
      }
      // tabValue = 4 - CUPS Autoconsumo > Potencia Máxima Demandada | CUPS NO Autoconsumo > Requests
      else if (tabValue === 4) {
        dispatch(setUrlMessagesDetail(supplyData.isSelfConsumption ? 'SUPPLIES_MAX_POTENCY' : 'SUPPLIES_SR'))
      }
      // tabValue = 5 - CUPS Autoconsumo > Requests
      else if (tabValue === 5 && supplyData.isSelfConsumption) {
        dispatch(setUrlMessagesDetail(supplyData.isSelfConsumption ? 'SUPPLIES_SR' : 'CONTRACTS'))
      }
      // tabValue = 6 - CUPS Autoconsumo > Contracts
      else if (tabValue === 6 && supplyData.isSelfConsumption) {
        dispatch(setUrlMessagesDetail('CONTRACTS'))
      }
    }
    // Si el CUPS NO es de generación
    else {
      // tabValue = 0 - Datos Generales
      if (tabValue === 0) {
        dispatch(setUrlMessagesDetail('SUPPLIES_GENERAL_DATA'))
      }
      // tabValue = 1 - Mi Consumo
      else if (tabValue === 1) {
        dispatch(setUrlMessagesDetail('SUPPLIES_CONSUMPTION_EC'))
        dispatch(setUrlMessagesSupplyDataConsumptionTabValue('0'))
      }
      // tabValue = 2 - CUPS Autoconsumo > Autoconsumo | CUPS NO Autoconsumo > Potencia Máxima Demandada
      else if (tabValue === 2) {
        dispatch(setUrlMessagesDetail(supplyData.isSelfConsumption ? 'SUPPLIES_SELF_CONSUMPTION' : 'SUPPLIES_MAX_POTENCY'))
      }
      // tabValue = 3 - CUPS Autoconsumo > Potencia Máxima Demandada | CUPS NO Autoconsumo > Certificados
      else if (tabValue === 3) {
        dispatch(setUrlMessagesDetail(supplyData.isSelfConsumption ? 'SUPPLIES_MAX_POTENCY' : 'SUPPLIES_CERTIFICATES'))
      }
      // tabValue = 4 - CUPS Autoconsumo > Certificados | CUPS NO Autoconsumo > Mi Contador
      else if (tabValue === 4) {
        dispatch(setUrlMessagesDetail(supplyData.isSelfConsumption ? 'SUPPLIES_CERTIFICATES' : 'SUPPLIES_COUNTER'))
      }
      // tabValue = 5 - CUPS Autoconsumo > Mi Contador | CUPS NO Autoconsumo > Comunica tu incidencia
      else if (tabValue === 5) {
        dispatch(setUrlMessagesDetail(supplyData.isSelfConsumption ? 'SUPPLIES_COUNTER' : 'SUPPLIES_INCIDENCE'))
      }
      // tabValue = 6 - CUPS Autoconsumo > Comunica tu incidencia | CUPS NO Autoconsumo > Histórico de incidencias
      else if (tabValue === 6) {
        dispatch(setUrlMessagesDetail(supplyData.isSelfConsumption ? 'SUPPLIES_INCIDENCE' : 'SUPPLIES_INCIDENCE_HISTORICAL'))
      }
      // tabValue = 7 - CUPS Autoconsumo > Histórico de incidencias | CUPS NO Autoconsumo > Peticiones
      else if (tabValue === 7) {
        dispatch(setUrlMessagesDetail(supplyData.isSelfConsumption ? 'SUPPLIES_INCIDENCE_HISTORICAL' : 'SUPPLIES_SR'))
      }
      // tabValue = 8 - CUPS Autoconsumo > Peticiones
      else if (tabValue === 8 && supplyData.isSelfConsumption) {
        dispatch(setUrlMessagesDetail(supplyData.isSelfConsumption ? 'SUPPLIES_SR' : 'CONTRACTS'))
      }
      else if (tabValue === 8 && !supplyData.isSelfConsumption) {
        dispatch(setUrlMessagesDetail(!supplyData.isSelfConsumption ? 'CONTRACTS' : 'SUPPLIES_SR'))
      }
      // tabValue = 9 - CUPS Autoconsumo > Contracts
      else if (tabValue === 9 && supplyData.isSelfConsumption) {
        dispatch(setUrlMessagesDetail('CONTRACTS'))
      }
    } 
  }

  // PPM 1007560 Si el cliente accede mediante la url recibida por email/sms, seteamos estos valores para navegar a la pantalla correcta
  useEffect(() => {
    if (!adminCheck() && props.location.state.tabValue && props.location.state.menuTabValue) {
      setTabValue(props.location.state.tabValue)
      setMenuTabValue(props.location.state.menuTabValue)
      if (props.location.state.consumptionTabValue || props.location.state.consumptionTabValue === '0') {
        setConsumptionTabValueFromURL(props.location.state.consumptionTabValue)
      }
      else if (props.location.state.generationTabValue || props.location.state.generationTabValue === '0') {
        setGenerationTabValueFromURL(props.location.state.generationTabValue)
      }
    }
  }, [props])

  // PPM 1007560 Suplantando como admin, se setean los valores de la pantalla en redux para poder generar la URL que mandaremos al cliente para que acceda a la pantalla
  useEffect(() => {
    if (adminCheck() && supplyData && (tabValue || tabValue === 0) && (menuTabValue || menuTabValue === 0)) {
      setUrlMessagesData(supplyData, tabValue, menuTabValue)
    }
  }, [supplyData, tabValue, menuTabValue])

  
  const statusclasification = (status: string) => {
    let estado = ''
    if(estados_anulada.includes(status)){
      estado = 'Anulada'
    }
    else if(estados_finalizada.includes(status)){
      estado = 'Finalizada'
    }
    else if(estados_rechazada.includes(status)){
      estado = 'Rechazada'
    }
    else if(estados_recibida.includes(status)){
      estado = 'Recibida'
    }
    else if(estados_en_curso.includes(status)){
      estado = 'En curso'
    }
    else if(estados_incidencia.includes(status)){
      estado = 'Incidencia'
    }
    return estado
  }

  const isStatusFinished = (status: string) => {
    return estados_anulada.includes(status) || estados_finalizada.includes(status) || estados_rechazada.includes(status)
  }

  const [contracts, setContracts] = useState()
  const [ongoingContracts, setOngoingContracts] = useState([]);
  const [closedContracts, setClosedContracts] = useState([]);
  const [loadedContracts, setLoadedContracts] = useState(false)
  //const ongoingStates = ['Recibida', 'En curso', 'Incidencia'];
  //const closedStates = ['Finalizada', 'Rechazada', 'Anulada'];

  useEffect(() => {
    if (contractsEnabled) {
      if (user && user.documentNumber && supplyData && !loadedContracts) {
        dispatch(thunkGetContractsSupply(supplyData.holderDocumentNumber, supplyData.cups, (response) => {
          if (response && response.resp.respCupsDocs && response.resp.respCupsDocs.respCupsDoc && response.resp.respCupsDocs.respCupsDoc.length > 0) {
            let contracts = response.resp.respCupsDocs.respCupsDoc
            setContracts(contracts)
            contracts.forEach((doc) => {
              if (doc.procesos && doc.procesos.proceso) {
                doc.procesos.proceso.forEach((proceso) => {
                  if (proceso.fecSolicitud) {
                    proceso.fecSolicitudFormated = formatIsoDate(proceso.fecSolicitud);
                  }
                  if (proceso.estado) {
                    proceso.estado = statusclasification(proceso.cdaResultado)
                  }
                  const { estado } = proceso;
                  if (isStatusFinished(proceso.cdaResultado)) {
                    setClosedContracts((prev) => [...prev, proceso]);
                  } else {
                    setOngoingContracts((prev) => [...prev, proceso]);
                  }
                });
              }
            });
            setLoadedContracts(true)
          } else {
            setLoadedContracts(true)
            setContractsError(true)
          }
        }));
      }

    }
  }, [supplyData,user,loadedContracts, contractsEnabled])

  const reverseAndMapContracts = contracts =>
    [...contracts].reverse().map(item => ({
      ...item,
      pasos: {
        ...item.pasos,
        paso: [...item.pasos.paso].slice().reverse()
      }
    }));
  
  useEffect(() => {
    if (loadedContracts && !contractsError) {
      if (!OngoingorderedData && ongoingContracts.length > 0) {
        setOngoingContracts(reverseAndMapContracts(ongoingContracts));
        setOngoingOrderedData(true);
      }
  
      if (!ClosedorderedData && closedContracts.length > 0) {
        setClosedContracts(reverseAndMapContracts(closedContracts));
        setClosedOrderedData(true);
      }
    }
  }, [loadedContracts, ongoingContracts, closedContracts, ClosedorderedData, OngoingorderedData]);
  

  return (
    <div className={classes.block}>
      <Modales isOpne={isOpen} toggle={toggle}>
        <img src={CloseIcon} className={classes_.closeButton} alt='close' onClick={toggle} />
        <img src={AlertIcon}/>
        <div className={classes_.title}>
          {t('errors.date.title')}
        </div>
        <div className={classes_.body}>
          {t('errors.date.text')}
        </div>
      </Modales>
      <Alert
        openAlert={openAlert}
        setOpenAlert={setOpenAlert}
        message={t('delegations.managedByMe.alertMessage')}
      />

      <Dialog
        history={props.history}
        showingDialog={showingDialog}
        setShowingDialog={setShowingDialog}
        selectedItemsList={currentItemCups}
        delegatesList={delegatesList}
        loadingDelegatesList={loadingDelegatesList}
        setLoadingDelegatesList={setLoadingDelegatesList}
        delegateRole={delegateRole}
        handleOpenAlert={handleOpenAlert}
      />

      <NoSupplyDialog
        showingDialog={showingNoSupplyDataDialog}
        setShowingDialog={setShowingNoSupplyDataDialog}
        history={props.history}
      />

      <StormWarningDialog
        showingDialog={showingStormWarningDialog}
        handleReturn={() => setShowingStormWarningDialog(false)}
        supplyData={supplyData}
        user={user}
        setShowingStormWarningSuccessDialog={setShowingStormWarningSuccessDialog}
        setStormWarningSrCode={setStormWarningSrCode}
      />

      <StormWarningSuccessDialog
        showingDialog={showingStormWarningSuccessDialog}
        handleReturn={() => setShowingStormWarningSuccessDialog(false)}
        stormWarningSrCode={stormWarningSrCode}
      />

      <ButtonToTop />

      {
        (!supplyData && isLoading) ?
          <Spinner fixed={true} />
          :
          <>
            {
              isLoading &&
              <Spinner fixed={true} />
            }

            {
              supplyData ?
                <Grid
                  container
                  justifyContent='center'
                  className={classes.container}
                >
                  <Grid container justifyContent='center'>
                    <Summary
                      supplyData={supplyData}
                      indexSupplyData={indexSupplyData}
                      handleDelegateOrAuthorize={(e) => handleDelegateOrAuthorize(e)}
                      selectedTab={props.location.state ? props.location.state.selectedTab : 0}
                      delegateRole={delegateRole}
                      setTabValue={setTabValue}
                      setMenuTabValue={setMenuTabValue}
                      setShowingStormWarningDialog={setShowingStormWarningDialog}
                    />

                    <Navigation
                      supplyData={supplyData}
                      tabValue={tabValue}
                      setTabValue={setTabValue}
                      menuTabValue={menuTabValue}
                      setMenuTabValue={setMenuTabValue}
                      setQuerySelfConsumption={setQuerySelfConsumption}
                      querySelfConsumption={querySelfConsumption}
                      ongoingContracts={ongoingContracts}
                      contractsEnabled={contractsEnabled}
                    />

                    <Grid container item xs={11} md={12} className={(user && user.userId && user.userId > 0) ? classes.viewsContainer : classes.notRegisteredViewsContainer}>
                      {/* Submenú. El orden de las clases es el orden en que aparece
                          en el desplegable. Importante mantenerlo */}

                      {/* <SwipeableViews
                        index={tabValue}
                        className={classes.views}
                        onChangeIndex={setTabValue}
                      > */}

                      {supplyData.isGenerator === '1' ?
                        <Dropdown1
                          toggle={toggle}
                          isLoading={isLoading}
                          setIsLoading={setIsLoading}
                          supplyData={supplyActualizado}
                          consumptionsFilters={consumptionsFilters}
                          setConsumptionsFilters={setConsumptionsFilters}
                          selfConsumptionsFilters={selfConsumptionsFilters}
                          setSelfConsumptionsFilters={setSelfConsumptionsFilters}
                          supplantedUser={supplantedUser}
                          mdmout={mdmout}
                          powersFilters={powersFilters}
                          setPowersFilters={setPowersFilters}
                          querySelfConsumption={querySelfConsumption}
                          index={tabValue}
                          onChangeIndex={setTabValue}
                          scheme={scheme}
                          section={section}
                          subSection={subSection}
                          installationType={installationType}
                          selfConsumptionType={selfConsumptionType}
                          setCreatingNewRequestFromMeter={setCreatingNewRequestFromMeter}
                          creatingNewRequestFromMeter={creatingNewRequestFromMeter}
                          navBarTabValue={menuTabValue}
                          consumptionTabValueFromURL={consumptionTabValueFromURL}
                          generationTabValueFromURL={generationTabValueFromURL}
                          contracts={contracts}
                          ongoingContracts={ongoingContracts}
                          closedContracts={closedContracts}
                          loadedContracts={loadedContracts}
                          contractsError={contractsError}
                          setContractsError={setContractsError}
                        />

                      :

                        <Dropdown2
                          isLoading={isLoading}
                          setIsLoading={setIsLoading}
                          supplyData={supplyActualizado}
                          consumptionsFilters={consumptionsFilters}
                          setConsumptionsFilters={setConsumptionsFilters}
                          selfConsumptionsFilters={selfConsumptionsFilters}
                          setSelfConsumptionsFilters={setSelfConsumptionsFilters}
                          supplantedUser={supplantedUser}
                          mdmout={mdmout}
                          strnout={strnout}
                          powersFilters={powersFilters}
                          setPowersFilters={setPowersFilters}
                          querySelfConsumption={querySelfConsumption}
                          tabValue={tabValue}
                          setTabValue={setTabValue}
                          userData={user}
                          setMenuTabValue={setMenuTabValue}
                          setCreatingNewRequestFromMeter={setCreatingNewRequestFromMeter}
                          navToMeter={navToMeter}
                          setNavToMeter={setNavToMeter}
                          creatingNewRequestFromMeter={creatingNewRequestFromMeter}
                          index={tabValue}
                          onChangeIndex={setTabValue}
                          scheme={scheme}
                          section={section}
                          subSection={subSection}
                          installationType={installationType}
                          selfConsumptionType={selfConsumptionType}
                          navBarTabValue={menuTabValue}
                          consumptionTabValueFromURL={consumptionTabValueFromURL}
                          billingStartDate={billingStartDate}
                          setBilingStartDate={setBilingStartDate}
                          billingEndDate={billingEndDate}
                          setBilingEndDate={setBilingEndDate}
                          contracts={contracts}
                          ongoingContracts={ongoingContracts}
                          closedContracts={closedContracts}
                          loadedContracts={loadedContracts}
                          contractsError={contractsError}
                          setContractsError={setContractsError}
                        />
                      }

                      {/* </SwipeableViews> */}
                    </Grid>
                  </Grid>
                </Grid>

                :

                !showingNoSupplyDataDialog &&
                openNoSupplyDataDialog()
            }
          </>
      }
    </div>
  )
}

export default SecurityHOC(SuppliesDetails)
