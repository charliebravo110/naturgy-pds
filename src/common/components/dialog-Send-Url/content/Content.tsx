import React, { useEffect, useState } from 'react'
import { Divider, Grid, IconButton, InputAdornment } from '@material-ui/core'

import { useTranslation } from 'react-i18next'
import useStyles from './Content.styles'
import Button from '../../button/Button'
import CloseIcon from '../../../../assets/icons/cerrar_blanco.svg'
import Cadena from '../../../../assets/icons/cadena.svg'
import CheckIcon from '../../../../assets/icons/check_blue.png'
import MailIcon from '../../../../assets/icons/Icon_mail.svg'
import MobileIcon from '../../../../assets/icons/Icon_sms.svg'
import AvisoOk from '../../../../assets/icons/aviso_ok.svg'
import ErrorIcon from '../../../../assets/icons/Interfaz_24_cruz_cerrar_error_rojo.svg'
import Select from '../../select/Select'
import Input from '../../input/Input'
import { useDispatch, useSelector } from 'react-redux'
import { validateMail, validateMobileNumber } from '../../../lib/ValidationLib'
import { thunkGetMasterData, thunkGetMasterDataOnlyMaster } from '../../../../supplies/supplies-details/store/actions/SuppliesDetailsThunkActions'
import { thunkSendUrlMessage } from '../../send-url/store/actions/SendUrlThunkActions'
import { 
  setUrlMessagesSupplyDataTabValue,
  setUrlMessagesSupplyDataMenuTabValue,
  setUrlMessagesSupplyDataConsumptionTabValue,
  setUrlMessagesSupplyDataGenerationTabValue,
  setUrlMessagesDossierDataPanel
} from '../../../../common/components/send-url/store/actions/UrlMessagesActions'



const Content = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const user = useSelector((state: any) => state.user.profile)
  const categoryState = useSelector((state: any) => state.urlMessages.category)
  const detailState = useSelector((state: any) => state.urlMessages.detail)
  const supplySelector = useSelector((state: any) => state.urlMessages.supplyData.supply)
  const tabValueSelector = useSelector((state: any) => state.urlMessages.supplyData.tabValue)
  const menuTabValueSelector = useSelector((state: any) => state.urlMessages.supplyData.menuTabValue)
  const consumptionTabValueSelector = useSelector((state: any) => state.urlMessages.supplyData.consumptionTabValue)
  const generationTabValueSelector = useSelector((state: any) => state.urlMessages.supplyData.generationTabValue)
  const dossierSelector = useSelector((state: any) => state.urlMessages.dossierData.dossier)
  const panelSelector = useSelector((state: any) => state.urlMessages.dossierData.panel)
  const requestSelector = useSelector((state: any) => state.urlMessages.requestData.request)
  const adminIndetifier = useSelector((state: any) => state.admin.profile.documentNumber)
  const supplyList = useSelector((state: any) => state.supplies.list)
  const panelEnablement = useSelector((state: any) => state.urlMessages.dossierData.panelEnablement)
  const reduxIsSelfConsumption = useSelector((state: any) => state.urlMessages.supplyData.isSelfConsumption)
  const reduxIsGeneration = useSelector((state: any) => state.urlMessages.supplyData.isGeneration)

  
  const dispatch = useDispatch()

  const [channel, setChannel] = useState(1)
  const [email, setEmail] = useState((user.email) ? user.email : '')
  const [mailValidity, setMailValidity] = useState(true)
  const [phoneValidity, setPhoneValidity] = useState(true)
  const [phoneNumber, setPhoneNumber] = useState((user.phone) ? user.phone : '')
  const [categoria, setCategoria] = useState((categoryState) ? t(`sendUrl.dialogSendUrl.dropDownCategories.${categoryState}`) : '')
  const [categoriasList, setCategoriasList] = useState([] as any)
  const [loadingCategoriaList, setLoadingCategoriaList] = useState(false)
  const [loadingDetailList, setLoadingDetailList] = useState(false)
  const [detail, setDetail] = useState((detailState) ? t(`sendUrl.dialogSendUrl.dropDownDetails.${detailState}`) : '')
  const [selectedDetailList, setSelectedDetailList] = useState([] as any)
  const [step, setStep] = useState(1)
  const [disabledBtnSummary, setDisabledBtnSummary] = useState(true)
  const [loadingHandleSendUrl, setLoadingHandleSendUrl] = useState(false)
  
  const dropdownCategories = [
    t('sendUrl.dialogSendUrl.dropDownCategories.SUPPLIES'),
    t('sendUrl.dialogSendUrl.dropDownCategories.BILLS'),
    t('sendUrl.dialogSendUrl.dropDownCategories.PROVISIONS'),
    t('sendUrl.dialogSendUrl.dropDownCategories.REQUESTS'),
  ]

  interface Data {
    category?: string;
    detail?: string;
    typeChannel?: number;
    channel?: string;
    userId?: string;
    mail?: string,
    sms?: string,
    url?: string;
    adminId?: string;
  }

 
  useEffect(() => {
		if (categoriasList.length === 0) {
			
			setLoadingCategoriaList(true)
      setLoadingDetailList(true)
			dispatch(thunkGetMasterDataOnlyMaster('SEND_URL',(sessionStorage.getItem('lang') || 'ES').toUpperCase(), (response) => {
				if (response && response.length >0) {

          const categoriasListConLiteral = response.map(item => {
            const literal = t(`sendUrl.dialogSendUrl.dropDownDetails.${item.value}`)
            return { ...item, literal }
          })
          loadDetailList(categoriasListConLiteral)
          setCategoriasList(categoriasListConLiteral)
          setLoadingCategoriaList(false)
          setLoadingDetailList(false)
				}
			}));
		}
	}, [categoria, detail])

  useEffect(() => {
    loadDetailList()
  }, [categoria])
  

  const { 
    handleCloseDialog
  } = props

  const loadDetailList = (list?) => {
    setLoadingDetailList(true)
 
    let categoriasListFilter 

    if (list) {
      categoriasListFilter = list
    } else {
      categoriasListFilter = categoriasList
    }

    let selectList = []
    const selectedKey = (categoria == t('sendUrl.dialogSendUrl.dropDownCategories.SUPPLIES')) ? 'SUPPLIES' : (categoria == t('sendUrl.dialogSendUrl.dropDownCategories.BILLS')) ? 'BILLS' : (categoria == t('sendUrl.dialogSendUrl.dropDownCategories.PROVISIONS')) ? 'PROVISIONS' : (categoria == t('sendUrl.dialogSendUrl.dropDownCategories.REQUESTS')) && 'REQUESTS'
    selectList = categoriasListFilter.filter(item => item.key === selectedKey); 

    let finalList = []
    if (categoryState === 'SUPPLIES') {
      const currentSupply = supplyList.filter(item => {
        return item.cups === supplySelector
      })      
      const isGenerator = (currentSupply && currentSupply[0] && currentSupply[0].isGenerator) ? currentSupply[0].isGenerator : ''
      const isSelfConsumption = (currentSupply && currentSupply[0] && currentSupply[0].isSelfConsumption && currentSupply[0].isSelfConsumption.cau && currentSupply[0].isSelfConsumption.cau != '') ? true : false
     
      
      if (detailState === 'SUPPLIES_LIST') {
        finalList = selectList.filter(item => !['PROVISIONS_PANEL_1', 'PROVISIONS_PANEL_2', 'PROVISIONS_PANEL_3', 'PROVISIONS_PANEL_4', 'PROVISIONS_PANEL_5', 'PROVISIONS_PANEL_6','SUPPLIES_GENERAL_DATA','SUPPLIES_CONSUMPTION_EC','SUPPLIES_CONSUMPTION_ERG','SUPPLIES_CONSUMPTION_ERC','SUPPLIES_GENERATION_EG','SUPPLIES_GENERATION_ERG','SUPPLIES_GENERATION_ERC','SUPPLIES_SELF_CONSUMPTION','SUPPLIES_MAX_POTENCY','SUPPLIES_CERTIFICATES','SUPPLIES_COUNTER','SUPPLIES_INCIDENCE','SUPPLIES_INCIDENCE_HISTORICAL','SUPPLIES_SR', 'REQUESTS_DETAIL', 'CONTRACTS'].includes(item.value))
      } 
      else {
        if (isGenerator === '0' && isSelfConsumption === false) {
          finalList = selectList.filter(item => !['PROVISIONS_PANEL_1', 'PROVISIONS_PANEL_2', 'PROVISIONS_PANEL_3', 'PROVISIONS_PANEL_4', 'PROVISIONS_PANEL_5', 'PROVISIONS_PANEL_6', 'REQUESTS_DETAIL','SUPPLIES_GENERATION_EG','SUPPLIES_GENERATION_ERG','SUPPLIES_GENERATION_ERC','SUPPLIES_SELF_CONSUMPTION'].includes(item.value))
        }
        else if (isGenerator === '0' && isSelfConsumption) {
          finalList = selectList.filter(item => !['PROVISIONS_PANEL_1', 'PROVISIONS_PANEL_2', 'PROVISIONS_PANEL_3', 'PROVISIONS_PANEL_4', 'PROVISIONS_PANEL_5', 'PROVISIONS_PANEL_6', 'REQUESTS_DETAIL','SUPPLIES_GENERATION_EG','SUPPLIES_GENERATION_ERG','SUPPLIES_GENERATION_ERC'].includes(item.value))
        }
        else if (isGenerator === '1' && isSelfConsumption === false) {
          finalList = selectList.filter(item => !['PROVISIONS_PANEL_1', 'PROVISIONS_PANEL_2', 'PROVISIONS_PANEL_3', 'PROVISIONS_PANEL_4', 'PROVISIONS_PANEL_5', 'PROVISIONS_PANEL_6', 'REQUESTS_DETAIL','SUPPLIES_SELF_CONSUMPTION','SUPPLIES_CERTIFICATES','SUPPLIES_COUNTER','SUPPLIES_INCIDENCE','SUPPLIES_INCIDENCE_HISTORICAL'].includes(item.value))
        }
        else if (isGenerator === '1' && isSelfConsumption) {
          finalList = selectList.filter(item => !['PROVISIONS_PANEL_1', 'PROVISIONS_PANEL_2', 'PROVISIONS_PANEL_3', 'PROVISIONS_PANEL_4', 'PROVISIONS_PANEL_5', 'PROVISIONS_PANEL_6', 'REQUESTS_DETAIL','SUPPLIES_CERTIFICATES','SUPPLIES_COUNTER','SUPPLIES_INCIDENCE','SUPPLIES_INCIDENCE_HISTORICAL'].includes(item.value))
        }
        else {
          finalList = selectList.filter(item => !['PROVISIONS_PANEL_1', 'PROVISIONS_PANEL_2', 'PROVISIONS_PANEL_3', 'PROVISIONS_PANEL_4', 'PROVISIONS_PANEL_5', 'PROVISIONS_PANEL_6', 'REQUESTS_DETAIL'].includes(item.value))
        }
      }
    } else if (categoryState === 'BILLS') {
      finalList = selectList.filter(item => !['PROVISIONS_PANEL_1', 'PROVISIONS_PANEL_2', 'PROVISIONS_PANEL_3', 'PROVISIONS_PANEL_4', 'PROVISIONS_PANEL_5', 'PROVISIONS_PANEL_6','SUPPLIES_GENERAL_DATA','SUPPLIES_CONSUMPTION_EC','SUPPLIES_CONSUMPTION_ERG','SUPPLIES_CONSUMPTION_ERC','SUPPLIES_GENERATION_EG','SUPPLIES_GENERATION_ERG','SUPPLIES_GENERATION_ERC','SUPPLIES_SELF_CONSUMPTION','SUPPLIES_MAX_POTENCY','SUPPLIES_CERTIFICATES','SUPPLIES_COUNTER','SUPPLIES_INCIDENCE','SUPPLIES_INCIDENCE_HISTORICAL','SUPPLIES_SR','REQUESTS_DETAIL', 'CONTRACTS'].includes(item.value))
    } else if (categoryState === 'PROVISIONS') {
      if (detailState === 'PROVISIONS_LIST') {
        finalList = selectList.filter(item => !['PROVISIONS_PANEL_1', 'PROVISIONS_PANEL_2','PROVISIONS_PANEL_3', 'PROVISIONS_PANEL_4', 'PROVISIONS_PANEL_5', 'PROVISIONS_PANEL_6','SUPPLIES_GENERAL_DATA','SUPPLIES_CONSUMPTION_EC','SUPPLIES_CONSUMPTION_ERG','SUPPLIES_CONSUMPTION_ERC','SUPPLIES_GENERATION_EG','SUPPLIES_GENERATION_ERG','SUPPLIES_GENERATION_ERC','SUPPLIES_SELF_CONSUMPTION','SUPPLIES_MAX_POTENCY','SUPPLIES_CERTIFICATES','SUPPLIES_COUNTER','SUPPLIES_INCIDENCE','SUPPLIES_INCIDENCE_HISTORICAL','SUPPLIES_SR','REQUESTS_DETAIL', 'CONTRACTS'].includes(item.value))
      } else {
        let arrayDelete = ['SUPPLIES_GENERAL_DATA','SUPPLIES_CONSUMPTION_EC','SUPPLIES_CONSUMPTION_ERG','SUPPLIES_CONSUMPTION_ERC','SUPPLIES_GENERATION_EG','SUPPLIES_GENERATION_ERG','SUPPLIES_GENERATION_ERC','SUPPLIES_SELF_CONSUMPTION','SUPPLIES_MAX_POTENCY','SUPPLIES_CERTIFICATES','SUPPLIES_COUNTER','SUPPLIES_INCIDENCE','SUPPLIES_INCIDENCE_HISTORICAL','SUPPLIES_SR','REQUESTS_DETAIL', 'CONTRACTS']
        for (const key in panelEnablement) {
          if (panelEnablement[key] === '') {
            const numero_panel = key.replace('panel', '')
            arrayDelete.push('PROVISIONS_PANEL_' + numero_panel)
          }
        }
        finalList = selectList.filter(item => !arrayDelete.includes(item.value))
      }
    } else if (categoryState === 'REQUESTS') {
      if (detailState === 'REQUESTS_LIST') {
        finalList = selectList.filter(item => !['PROVISIONS_PANEL_1', 'PROVISIONS_PANEL_2','PROVISIONS_PANEL_3', 'PROVISIONS_PANEL_4', 'PROVISIONS_PANEL_5', 'PROVISIONS_PANEL_6', 'SUPPLIES_GENERAL_DATA','SUPPLIES_CONSUMPTION_EC','SUPPLIES_CONSUMPTION_ERG','SUPPLIES_CONSUMPTION_ERC','SUPPLIES_GENERATION_EG','SUPPLIES_GENERATION_ERG','SUPPLIES_GENERATION_ERC','SUPPLIES_SELF_CONSUMPTION','SUPPLIES_MAX_POTENCY','SUPPLIES_CERTIFICATES','SUPPLIES_COUNTER','SUPPLIES_INCIDENCE','SUPPLIES_INCIDENCE_HISTORICAL','SUPPLIES_SR','REQUESTS_DETAIL', 'CONTRACTS'].includes(item.value))
      }
      else {
        finalList = selectList.filter(item => !['PROVISIONS_PANEL_1', 'PROVISIONS_PANEL_2','PROVISIONS_PANEL_3', 'PROVISIONS_PANEL_4', 'PROVISIONS_PANEL_5', 'PROVISIONS_PANEL_6', 'SUPPLIES_GENERAL_DATA','SUPPLIES_CONSUMPTION_EC','SUPPLIES_CONSUMPTION_ERG','SUPPLIES_CONSUMPTION_ERC','SUPPLIES_GENERATION_EG','SUPPLIES_GENERATION_ERG','SUPPLIES_GENERATION_ERC','SUPPLIES_SELF_CONSUMPTION','SUPPLIES_MAX_POTENCY','SUPPLIES_CERTIFICATES','SUPPLIES_COUNTER','SUPPLIES_INCIDENCE','SUPPLIES_INCIDENCE_HISTORICAL','SUPPLIES_SR', 'CONTRACTS'].includes(item.value))
      }
    } else if (categoryState === '') {
      finalList = selectList.filter(item => !['PROVISIONS_PANEL_1', 'PROVISIONS_PANEL_2', 'PROVISIONS_PANEL_3', 'PROVISIONS_PANEL_4', 'PROVISIONS_PANEL_5', 'PROVISIONS_PANEL_6','SUPPLIES_GENERAL_DATA','SUPPLIES_CONSUMPTION_EC','SUPPLIES_CONSUMPTION_ERG','SUPPLIES_CONSUMPTION_ERC','SUPPLIES_GENERATION_EG','SUPPLIES_GENERATION_ERG','SUPPLIES_GENERATION_ERC','SUPPLIES_SELF_CONSUMPTION','SUPPLIES_MAX_POTENCY','SUPPLIES_CERTIFICATES','SUPPLIES_COUNTER','SUPPLIES_INCIDENCE','SUPPLIES_INCIDENCE_HISTORICAL','SUPPLIES_SR','REQUESTS_DETAIL', 'CONTRACTS'].includes(item.value))
    }
    setSelectedDetailList(finalList)

    setLoadingDetailList(false)
  }

  useEffect(() => {
    if (channel === 1 && mailValidity && (email !== '') && (categoria !== '') && (detail !== '') && (selectedDetailList.length !== 0) ) {
      setDisabledBtnSummary(true)
    } else if (channel === 2 && phoneValidity && (phoneNumber !== '') && (categoria !== '') && (detail !== '') && (selectedDetailList.length !== 0) ) {
      setDisabledBtnSummary(true)
    } else {
      setDisabledBtnSummary(false)
    }
  }, [channel,mailValidity,phoneValidity,email,phoneNumber,categoria,detail,selectedDetailList])

  const handleSendUrl = () => {
      setLoadingHandleSendUrl(true)
      const selectedKey = (categoria == t('sendUrl.dialogSendUrl.dropDownCategories.SUPPLIES')) ? 'SUPPLIES' : (categoria == t('sendUrl.dialogSendUrl.dropDownCategories.BILLS')) ? 'BILLS' : (categoria == t('sendUrl.dialogSendUrl.dropDownCategories.PROVISIONS')) ? 'PROVISIONS' : (categoria == t('sendUrl.dialogSendUrl.dropDownCategories.REQUESTS')) && 'REQUESTS'
      const { value } = selectedDetailList.find(item => item.literal === detail);
      let data:Data = {
        category:selectedKey,
        detail:value,
        channel: (channel == 1) ? '0' : '1',
        //channel: (channel == 1) ? email : phoneNumber,
        mail: email,
        sms:phoneNumber,
        userId: user.documentNumber,
        adminId: adminIndetifier
      }
      //  CORRECCIÓN DE URL, GENERAMOS EL BASEPATH CORRECTAMENTE DESDE EL BACK-END
      const baseUrl = '/login?redirectTo=';
      // const baseUrl = `${process.env.REACT_APP_API_ENDPOINT}/login?redirectTo=`;
      if (selectedKey === 'SUPPLIES') {
        if (value === 'SUPPLIES_LIST') {
          data.url = baseUrl + '/supplies';
        } else if (
          value.startsWith('SUPPLIES_CONSUMPTION_') 
        ) {
          data.url = `${baseUrl}/supplies/detail&supply=${supplySelector}&tabValue=${tabValueSelector}&menuTabValue=${menuTabValueSelector}&consumptionTabValue=${consumptionTabValueSelector}`;
        } else if (
          value.startsWith('SUPPLIES_GENERATION_')
        ) {
          data.url = `${baseUrl}/supplies/detail&supply=${supplySelector}&tabValue=${tabValueSelector}&menuTabValue=${menuTabValueSelector}&generationTabValue=${generationTabValueSelector}`;
        } else if (
          value === 'SUPPLIES_GENERAL_DATA' ||
          value === 'SUPPLIES_SELF_CONSUMPTION' ||
          value === 'SUPPLIES_MAX_POTENCY' ||
          value === 'SUPPLIES_CERTIFICATES' ||
          value === 'SUPPLIES_COUNTER' ||
          value === 'SUPPLIES_INCIDENCE' ||
          value === 'SUPPLIES_INCIDENCE_HISTORICAL' ||
          value === 'SUPPLIES_SR' ||
          value === 'CONTRACTS'
        ) {
          data.url = `${baseUrl}/supplies/detail&supply=${supplySelector}&tabValue=${tabValueSelector}&menuTabValue=${menuTabValueSelector}`;
        }
      } else if (selectedKey === 'BILLS' && value === 'BILLS_LIST') {
        data.url = `${baseUrl}/provisions/bills-list`;
      } else if (selectedKey === 'PROVISIONS') {
        if (value === 'PROVISIONS_LIST') {
          data.url = `${baseUrl}/provisions`;
        } else if (value.startsWith('PROVISIONS_PANEL_')) {
          data.url = `${baseUrl}/provisions/detail&dossier=${dossierSelector}&panel=${panelSelector}`;
        }
      } else if (selectedKey === 'REQUESTS') {
        if (value === 'REQUESTS_LIST') {
          data.url = `${baseUrl}/requests`;
        } else if (value === 'REQUESTS_DETAIL') {
          data.url = `${baseUrl}/requests/detail&request=${requestSelector}`;
        }
      }
      
      dispatch(thunkSendUrlMessage(data,(response) => {
        if (response && response.result && response.result.codResult==='0000') {
          setStep(3)
        } else {
          setStep(4)
        }
        setLoadingHandleSendUrl(false)
      }))
  }

  const handleCategoriaChange = (e) => {
    setCategoria(e.target.value)
    setDetail('')
  }

  const handleSubCategoriaChange = (e) => {
    setDetail(e.target.value)
  }

  const setUrlValues = (categoryCode: string, detailCode: string) => {
    if (categoryCode === 'SUPPLIES') {
      // Detalle de un suministro - Datos generales
      if (detailCode === 'SUPPLIES_GENERAL_DATA') {
        dispatch(setUrlMessagesSupplyDataTabValue('0'))
        dispatch(setUrlMessagesSupplyDataMenuTabValue('0'))
      }
      // Detalle de un suministro - Mi consumo - gráficos de Energia Consumida
      else if (detailCode === 'SUPPLIES_CONSUMPTION_EC') {
        dispatch(setUrlMessagesSupplyDataTabValue(reduxIsGeneration ? '2' : '1'))
        dispatch(setUrlMessagesSupplyDataMenuTabValue('1'))
        dispatch(setUrlMessagesSupplyDataConsumptionTabValue('0'))
      }
      // Detalle de un suministro - Mi consumo - gráficos de Energia reactiva Generada
      else if (detailCode === 'SUPPLIES_CONSUMPTION_ERG') {
        dispatch(setUrlMessagesSupplyDataTabValue(reduxIsGeneration ? '2' : '1'))
        dispatch(setUrlMessagesSupplyDataMenuTabValue('1'))
        dispatch(setUrlMessagesSupplyDataConsumptionTabValue('1'))
      }
      // Detalle de un suministro - Mi consumo - gráficos de Energia reactiva Consumida
      else if (detailCode === 'SUPPLIES_CONSUMPTION_ERC') {
        dispatch(setUrlMessagesSupplyDataTabValue(reduxIsGeneration ? '2' : '1'))
        dispatch(setUrlMessagesSupplyDataMenuTabValue('1'))
        dispatch(setUrlMessagesSupplyDataConsumptionTabValue('2'))
      }
      // Detalle de un suministro - Generación - gráficos de Energia Generada
      else if (detailCode === 'SUPPLIES_GENERATION_EG') {
        dispatch(setUrlMessagesSupplyDataTabValue(reduxIsGeneration ? '1' : ''))
        dispatch(setUrlMessagesSupplyDataMenuTabValue(reduxIsGeneration ? '1' : ''))
        dispatch(setUrlMessagesSupplyDataGenerationTabValue(reduxIsGeneration ? '0' : ''))
      }
      // Detalle de un suministro - Generación - gráficos de Energia reactiva Generada
      else if (detailCode === 'SUPPLIES_GENERATION_ERG') {
        dispatch(setUrlMessagesSupplyDataTabValue(reduxIsGeneration ? '1' : ''))
        dispatch(setUrlMessagesSupplyDataMenuTabValue(reduxIsGeneration ? '1' : ''))
        dispatch(setUrlMessagesSupplyDataGenerationTabValue(reduxIsGeneration ? '1' : ''))
      }
      // Detalle de un suministro - Generación - gráficos de Energia reactiva Consumida
      else if (detailCode === 'SUPPLIES_GENERATION_ERC') {
        dispatch(setUrlMessagesSupplyDataTabValue(reduxIsGeneration ? '1' : ''))
        dispatch(setUrlMessagesSupplyDataMenuTabValue(reduxIsGeneration ? '1' : ''))
        dispatch(setUrlMessagesSupplyDataGenerationTabValue(reduxIsGeneration ? '2' : ''))
      }
      // Detalle de un suministro - Autoconsumo
      else if (detailCode === 'SUPPLIES_SELF_CONSUMPTION') {
        if (reduxIsSelfConsumption && reduxIsSelfConsumption.cau && reduxIsSelfConsumption.cau != '') {
          dispatch(setUrlMessagesSupplyDataTabValue(reduxIsGeneration ? '3' : '2'))
          dispatch(setUrlMessagesSupplyDataMenuTabValue('1'))
        }
        else {
          dispatch(setUrlMessagesSupplyDataTabValue(''))
          dispatch(setUrlMessagesSupplyDataMenuTabValue(''))
        }
      }
      // Detalle de un suministro - Potencia Máxima demandada
      else if (detailCode === 'SUPPLIES_MAX_POTENCY') {
        if (reduxIsSelfConsumption && reduxIsSelfConsumption.cau && reduxIsSelfConsumption.cau != '') {
          dispatch(setUrlMessagesSupplyDataTabValue(reduxIsGeneration ? '4' : '3'))
        }
        else {
          dispatch(setUrlMessagesSupplyDataTabValue(reduxIsGeneration ? '3' : '2'))
        }
        dispatch(setUrlMessagesSupplyDataMenuTabValue('1'))
      }
      // Detalle de un suministro - Mis certificados
      else if (detailCode === 'SUPPLIES_CERTIFICATES') {
        if (reduxIsGeneration) {
          dispatch(setUrlMessagesSupplyDataTabValue(''))
          dispatch(setUrlMessagesSupplyDataMenuTabValue(''))
        }
        else {
          dispatch(setUrlMessagesSupplyDataTabValue(reduxIsSelfConsumption && reduxIsSelfConsumption.cau && reduxIsSelfConsumption.cau != '' ? '4' : '3'))
          dispatch(setUrlMessagesSupplyDataMenuTabValue('1'))
        }
      }
      // Detalle de un suministro - Mi contador
      else if (detailCode === 'SUPPLIES_COUNTER') {
        if (reduxIsGeneration) {
          dispatch(setUrlMessagesSupplyDataTabValue(''))
          dispatch(setUrlMessagesSupplyDataMenuTabValue(''))
        }
        else {
          dispatch(setUrlMessagesSupplyDataTabValue(reduxIsSelfConsumption && reduxIsSelfConsumption.cau && reduxIsSelfConsumption.cau != '' ? '5' : '4'))
          dispatch(setUrlMessagesSupplyDataMenuTabValue('1'))
        }
      }
      // Detalle de un suministro - Comunica tu incidencia
      else if (detailCode === 'SUPPLIES_INCIDENCE') {
        if (reduxIsGeneration) {
          dispatch(setUrlMessagesSupplyDataTabValue(''))
          dispatch(setUrlMessagesSupplyDataMenuTabValue(''))
        }
        else {
          dispatch(setUrlMessagesSupplyDataTabValue(reduxIsSelfConsumption && reduxIsSelfConsumption.cau && reduxIsSelfConsumption.cau != '' ? '6' : '5'))
          dispatch(setUrlMessagesSupplyDataMenuTabValue('1'))
        }
      }
      // Detalle de un suministro - Historico de incidencias
      else if (detailCode === 'SUPPLIES_INCIDENCE_HISTORICAL') {
        if (reduxIsGeneration) {
          dispatch(setUrlMessagesSupplyDataTabValue(''))
          dispatch(setUrlMessagesSupplyDataMenuTabValue(''))
        }
        else {
          dispatch(setUrlMessagesSupplyDataTabValue(reduxIsSelfConsumption && reduxIsSelfConsumption.cau && reduxIsSelfConsumption.cau != '' ? '7' : '6'))
          dispatch(setUrlMessagesSupplyDataMenuTabValue('1'))
        }
      }
      // Detalle de un suministro - Peticiones
      else if (detailCode === 'SUPPLIES_SR') {
        if (reduxIsGeneration) {
          dispatch(setUrlMessagesSupplyDataTabValue(reduxIsSelfConsumption && reduxIsSelfConsumption.cau && reduxIsSelfConsumption.cau != '' ? '5' : '4'))          
        }
        else {
          dispatch(setUrlMessagesSupplyDataTabValue(reduxIsSelfConsumption && reduxIsSelfConsumption.cau && reduxIsSelfConsumption.cau != '' ? '8' : '7'))
        }
        dispatch(setUrlMessagesSupplyDataMenuTabValue('2'))
      }
      // Detalle de un suministro - Contratos
      else if (detailCode === 'CONTRACTS') {
        if (reduxIsGeneration) {
          dispatch(setUrlMessagesSupplyDataTabValue(reduxIsSelfConsumption && reduxIsSelfConsumption.cau && reduxIsSelfConsumption.cau != '' ? '6' : '5'))          
        }
        else {
          dispatch(setUrlMessagesSupplyDataTabValue(reduxIsSelfConsumption && reduxIsSelfConsumption.cau && reduxIsSelfConsumption.cau != '' ? '9' : '8'))
        }
        dispatch(setUrlMessagesSupplyDataMenuTabValue('2'))
      }
    }
    else if ( categoryCode === 'PROVISIONS') {
      // Detalle de 1 Expediente - Datos de la solicitud
      if (detailCode === 'PROVISIONS_PANEL_1') {
        dispatch(setUrlMessagesDossierDataPanel('panel1'))
      }
      // Detalle de 1 Expediente - Presupuesto
      else if (detailCode === 'PROVISIONS_PANEL_2') {
        dispatch(setUrlMessagesDossierDataPanel('panel2'))
      }
      // Detalle de 1 Expediente - Pago
      else if (detailCode === 'PROVISIONS_PANEL_3') {
        dispatch(setUrlMessagesDossierDataPanel('panel3'))
      }
      // Detalle de 1 Expediente - Tramitación
      else if (detailCode === 'PROVISIONS_PANEL_4') {
        dispatch(setUrlMessagesDossierDataPanel('panel4'))
      }
      // Detalle de 1 Expediente - Ejecución de la solicitud
      else if (detailCode === 'PROVISIONS_PANEL_5') {
        dispatch(setUrlMessagesDossierDataPanel('panel5'))
      }
      // Detalle de 1 Expediente - Cierre de la solicitud
      else if (detailCode === 'PROVISIONS_PANEL_6') {
        dispatch(setUrlMessagesDossierDataPanel('panel6'))
      }
    }
  }

  useEffect(() => {
    if (categoria !== '' && detail !== '' && categoriasList.length > 0) {
      let auxCategoryCode = ''
      let auxDetailCode = ''
      categoriasList.map((item) => {
        if (item.literal === detail) {
          auxCategoryCode = item.key
          auxDetailCode = item.value
        }
      })
      setUrlValues(auxCategoryCode, auxDetailCode)
    }
  }, [categoria, detail])

  return (
    <Grid>
      <Grid className={classes.header}>
        <img src={Cadena} className={classes.chainIcon} alt='' />
        <span className={classes.headerTitle}>{t('sendUrl.dialogSendUrl.dialogHeader')}</span>
        <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleCloseDialog} />
      </Grid>

      {
        (step == 1) ?
        <Grid>
          <Grid container>
            <Grid container item xs={12} className={classes.gridTitle}>
              <span className={classes.spanTitle}>{t('sendUrl.dialogSendUrl.dialogTitle')}</span>
            </Grid>
            <span className={classes.spanTitleSelect}>{t('sendUrl.dialogSendUrl.labelCategory')}</span>
            <Grid container item  xs={12} className={classes.gridText} justifyContent='center'>
              <Select
                className={classes.inputV2}
                value={categoria}
                values={dropdownCategories}
                onChange={handleCategoriaChange}
                disabled={!loadingCategoriaList ? false : true}
                label={categoria === '' ? t('sendUrl.dialogSendUrl.selectOption') : ''}
                error={(categoria === '') ? true : false}
                helperText={(categoria === '') ? t('sendUrl.dialogSendUrl.selectOption') : ''}
              />
            </Grid>
            <span className={classes.spanTitleSelect}>{t('sendUrl.dialogSendUrl.labelDetail')}</span>
            <Grid container item xs={12} className={classes.gridText} justifyContent='center'>
              <Select
                className={classes.inputV2}
                value={detail}
                values={selectedDetailList.map(item => item.literal)}
                onChange={handleSubCategoriaChange}
                disabled={loadingDetailList || selectedDetailList.length === 0}
                error={(detail === '') ? true : false}
                helperText={(detail === '') ? t('sendUrl.dialogSendUrl.selectDetail') : ''}
                label={detail === '' ? t('sendUrl.dialogSendUrl.selectDetail') : ''}
              />
            </Grid>
            <Grid xs={12} className={classes.divider}>
              <Divider variant='middle'/>
            </Grid>
            <Grid container item xs={12} justifyContent='center' className={classes.radioGroup}>
              <Grid container item xs={12} className={classes.radiobtn}>
                <div
                  className={`radioButton ${classes.radioButton} ${channel === 1 && 'active'}`}
                  onClick={() => {
                    if (channel !== 1) {
                      setChannel(1)
                    }
                  }}
                />
                <span className={classes.radiotext}>{t('sendUrl.dialogSendUrl.sendEmail')}</span>
              </Grid>
              <Grid container item xs={12} justifyContent='center'>
                <Input
                  showValidationIcon
                  value={email}
                  error={!mailValidity}
                  onChange={({ target }) => {
                    setMailValidity(validateMail(target.value))
                    setEmail(target.value)
                  }}
                  className={classes.inputV2}
                  helperText={(!mailValidity) ? t('sendUrl.dialogSendUrl.invalidFormat') : ''}
                  placeholder={'Email'}
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} className={classes.radioGroup} justifyContent='center'>
              <Grid container item xs={12} className={classes.radiobtn}>
                <div
                  className={`radioButton ${classes.radioButton} ${channel === 2 && 'active'}`}
                  onClick={() => {
                    if (channel !== 2) {
                      setChannel(2)
                    }
                  }}
                />
                <span className={classes.radiotext}>{t('sendUrl.dialogSendUrl.sendSMS')}</span>
              </Grid>
              <Grid container item xs={12} justifyContent='center'>
                <Input
                  showValidationIcon
                  value={phoneNumber}
                  error={!phoneValidity}
                  onChange={({ target }) => {
                    setPhoneValidity(validateMobileNumber(target.value))
                    setPhoneNumber(target.value)
                  }}
                  helperText={(!phoneValidity) ? t('sendUrl.dialogSendUrl.invalidFormat') : ''}
                  placeholder={'Teléfono'}
                  className={classes.inputV2}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={12} className={classes.divider}>
              <Divider variant='middle'/>
          </Grid>
          <Grid container justifyContent='center' className={classes.buttons}>
            <Grid item xs={4} sm={4}  className={classes.acceptButtonGrid1}>
              <Button size='large' text={t('sendUrl.dialogSendUrl.cancel')} variant='outlined' className={classes.cancelButtonM} onClick={handleCloseDialog}/>
            </Grid>
            <Grid item xs={4} sm={4}  className={classes.acceptButtonGrid1}>
              <Button size='large' color='primary' text={t('sendUrl.dialogSendUrl.next')} variant='contained' className={classes.acceptButtonM} onClick={() => {setStep(2)}} disabled={!disabledBtnSummary}/>
            </Grid>
          </Grid>
        </Grid>
        :
          (step == 2) 
          
          ? 
          <Grid>
            <Grid className={classes.GridStep2}>
              <span className={classes.spanTitleStep2}>
                {t('sendUrl.dialogSendUrl.selectedInfo')}
              </span>
              <Grid className={classes.genericMarginTop}>
                <img src={CheckIcon} className={classes.checkIconPng}  alt='' />
                <span className={classes.spanTextStep2}>{categoria}</span>
              </Grid>
              <Grid className={classes.genericMarginTop}>
                <img src={CheckIcon} className={classes.checkIconPng}  alt='' />
                <span className={classes.spanTextStep2}>{detail}</span>
              </Grid>
              
              <Grid xs={12} className={classes.fullDivider}>
                <Divider />
              </Grid>
              <span className={classes.spanTitleStep2}>
                {t('sendUrl.dialogSendUrl.sendTo')}
              </span>
              <Grid container className={classes.genericMarginTop}>
                {
                  (channel == 1) ? 
                  <img src={MailIcon} className={classes.mailIcon}  alt='' />
                  :
                  <img src={MobileIcon} className={classes.mailIcon}  alt='' />
                }
                
                <span className={classes.spanTextStep22}>{(channel ==  1) ? email : phoneNumber}</span>
              </Grid>
            </Grid>
            <Grid container justifyContent='center' className={classes.buttons}>
              <Grid item xs={4} sm={4}  className={classes.acceptButtonGrid1}>
                <Button size='large' text={t('sendUrl.dialogSendUrl.cancel')} variant='outlined' className={classes.cancelButtonM} onClick={handleCloseDialog}/>
              </Grid>
              <Grid item xs={4} sm={4}  className={classes.acceptButtonGrid1}>
                <Button size='large' color='primary' text={t('sendUrl.dialogSendUrl.send')} variant='contained' className={classes.acceptButtonM} disabled={loadingHandleSendUrl} onClick={() => {handleSendUrl()}}/>
              </Grid>
            </Grid>
          </Grid>
                
          : (step == 3) ? 
              <Grid justifyContent='center'>
                <Grid className={classes.GridStep3} justifyContent='center'>
                  <Grid item xs={12} justifyContent='center'>
                    <img src={AvisoOk} alt='' className={classes.avisoOk} />
                  </Grid>
                  <Grid className={classes.gridTitleStep3} item xs={12} justifyContent='center'>
                    <span className={classes.spanTitleStep3}>
                      {
                        (channel == 1) ?
                         t('sendUrl.dialogSendUrl.okResponseMail')
                         :
                         t('sendUrl.dialogSendUrl.okResponseSMS')
                      }
                    </span>
                  </Grid>
                  
                </Grid>
                <Grid container className={classes.buttons}>
                  <Grid item xs={12} sm={4}  className={classes.acceptButtonGridStep4}>
                    <Button size='large' fullWidth  text={t('sendUrl.dialogSendUrl.close')} variant='outlined' className={classes.buttonStep34} onClick={handleCloseDialog}/>
                  </Grid>
                </Grid>
              </Grid>
            
            : (step == 4) &&
                <Grid justifyContent='center'>
                    <Grid className={classes.GridStep4} justifyContent='center'>
                      <Grid item xs={12} justifyContent='center'>
                        <img src={ErrorIcon} alt='' className={classes.avisoOk} />
                      </Grid>
                      <Grid className={classes.gridTitleStep4} item xs={12} justifyContent='center'>
                        <span className={classes.spanTitleStep3}>
                          {t('sendUrl.dialogSendUrl.errorResponse')}
                        </span>
                      </Grid>
                      
                    </Grid>
                    <Grid container className={classes.buttons}>
                      <Grid item xs={12} sm={4}  className={classes.acceptButtonGridStep4}>
                        <Button size='large' fullWidth text={t('sendUrl.dialogSendUrl.close')} variant='outlined' className={classes.buttonStep34} onClick={handleCloseDialog}/>
                      </Grid>
                    </Grid>
                  </Grid>
          
      }
    </Grid>   

  )
}

export default Content