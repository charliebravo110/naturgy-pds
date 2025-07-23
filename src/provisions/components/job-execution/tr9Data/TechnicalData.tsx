import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import Checkbox from '../../../../supplies/supplies-list/managed-by-me/components/checkbox/Checkbox';
import { useSelector } from 'react-redux';
import { formatDateAndHourStringWithBars } from '../../../../common/lib/FormatLib'

import { Divider, Typography, useMediaQuery } from '@material-ui/core'
import number1 from '../../../../assets/icons/numero_1.svg'

import useStyles, { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '../JobExecution.styles'

import { StyledExpandMoreIcon } from '../../new-provision/steps/Steps.styles'
import Select from '../../../../common/components/select/Select'
import Input from '../../../../common/components/input/Input'
import Button from '../../../../common/components/button/Button'
import InfoIcon from '../../../../assets/icons/Icon_informacion_estado.svg'
import ArrowTooltip from '../../../../common/components/tooltip/arrow/ArrowTooltip'
import { noAccents } from '../../../../common/lib/FormatLib'
import SaveIco from '../../../../assets/icons/guardar.svg'
import adviceIcon from '../../../../assets/icons/ico_info.svg'
import koIcon from '../../../../assets/icons/ico_ok.svg';
import errorIcon from '../../../../assets/icons/Interfaz_24_cruz_cerrar_error_rojo.svg';

import { thunkGetListProvinces, thunkGetListMunicipalities, thunkGetListStreets,  } from '../../../../../src/controlMensajeria/actions/ControlMensajeriaThunkActions';
import { thunkGetListAddresses } from '../../../../../src/gestionAverias/actions/GestionAveriasThunkActions';
import { useDispatch } from 'react-redux';
import PopUpDirections from './popUpDirections/PopUpDirections';
import Spinner from '../../../../common/components/spinner/Spinner';

import { sendGAEvent } from '../../../../core/utils/gtm';

const TecnicalData = (props: any) => {
  const {
    setForm1Ok,
    form1Ok,
    handleChangeSubpanel,
    handleSaveDraft,
    handleSubmit,
    //saveDraftBtn,
    //errorSaveDraftBtn,
    isActiveSaveDraftBtn,
    expandSubPanels,
    setShowTr9form,
    setexpandSubPanels,
    selectedTipoLocal,
    setSelectedTipoLocal,
    selectedTipoSuministro,
    setSelectedTipoSuministro,
    stairs,
    setStairs,
    floor,
    setFloor,
    door,
    setDoor,
    selectedUbicacion,
    setSelectedUbicacion,
    radioButtonCentralizacion,
    setRadioButtonCentralizacion,
    radioButton2,
    setRadioButton2,
    onlyCPMorBoth,
    setOnlyCPMorBoth,
    radioButton3,
    setRadioButton3,
    radioButton4,
    setRadioButton4,
    accessKey,
    setAccessKey,
    characters,
    setCharacters,
    disabledButton,
    setDisabledButton,
    disabledPanel1,
    setDisabledPanel2,
    power,
    setpower,
    province,
    setProvince,
    town,
    setTown,
    address,
    setAddress,
    codePostal,
    setCodePostal,
    addressType,
    setAddressType,
    addressNumber,
    setAddressNumber,
    radioButton0,
    setRadioButton0,
    radioButtonKey,
    setRadioButtonKey,
    description,
    setDescription,
    uso,
    setUso,
    showing,
    setShowing,
    noErrorForm1,
    setNoErrorForm1,
    observations,
    setObservations,
    onlyRead,
    handleCancel,
    resetKey,
    setShowingCancelDialog,
    setShowDialogDraft,
    requestType,
    totalPower,
    isAddressButtonEnabled,
    isDefAddressDeclared,
    setIsDefAddressDeclared,
    dossierSubtype,
    duplicator,
    setDuplicator,
    gasCode,
    setGasCode,
    streetGasCode,
    setStreetGasCode,
    setErrorDirection,
    isAddressSave,
    setIsAddressSave,
    addressExists,
    setAddressExists,
    idStreetSelect,
    setIdStreetSelect,
    setValidAddressManual
  } = props

  const classes = useStyles({})
  const { t } = useTranslation()

  const dispatch = useDispatch()

  //const TiposFinca = [t('SERVICIOS'),t('AGRUPACION_DE_VIVIENDAS'),t('VIVIENDA_INDIVIDUAL'),t('INDUSTRIA_INDEPENDIENTE'),t('LOCAL_DE_NEGOCIO'),t('EMP_AGRARIA_GANADERA'),t('DOCENTES_SECULARES'),t('AGRUPAC_INDUSTRIALES'),t('EDIFICIO_COMERCIAL'),t('OTRAS')];

  //const TiposLocal = {[t('SERVICIOS')]: [t('SERVICIOS_PUBLICOS'), t('DE_LA_ADMINISTRACION'), t('ESPECTACULOS')],[t('AGRUPACION_DE_VIVIENDAS')]: [t('VIVIENDAS'), t('ESCALERA_Y_PORTAL'), t('ASCENSORES'), t('CALEFACCION'), t('MOTORES'), t('LOCALES_COMERCIALES'), t('GARAJE'), t('OFICINAS'), t('SERVICIOS_GENERALES'), t('ALMACEN'), t('DEPORTIVAS')],[t('VIVIENDA_INDIVIDUAL')]: [t('VIVIENDAS')],[t('INDUSTRIA_INDEPENDIENTE')]: [t('INDUSTRIA')],[t('LOCAL_DE_NEGOCIO')]: [t('LOCALES_COMERCIALES'), t('OFICINAS')],[t('EMP_AGRARIA_GANADERA')]: [t('INDUSTRIA'), t('ALMACEN')],[t('DOCENTES_SECULARES')]: [t('EDUCATIVOS')],[t('AGRUPAC_INDUSTRIALES')]: [t('INDUSTRIA')],[t('EDIFICIO_COMERCIAL')]: [t('ASCENSORES'), t('CALEFACCION'), t('MOTORES'), t('LOCALES_COMERCIALES'), t('GARAJE'), t('OFICINAS'), t('SERVICIOS_GENERALES'), t('ALMACEN')],[t('OTRAS')]: [t('DEPENDENCIAS_MILITAR'), t('EDIFICIO_RELIGIOSO'), t('DEPORTIVAS')]};
  
  //const TiposSuministro = {[t('SERVICIOS')]: {[t('SERVICIOS_PUBLICOS')]: [t('SERVICIOS_PUBLICOS'), t('PUNTO_DE_RECARGA_VE')],[t('DE_LA_ADMINISTRACION')]: [t('SERVICIOS_PUBLICOS')],[t('ESPECTACULOS')]: [t('SERVICIOS_PUBLICOS')],},[t('AGRUPACION_DE_VIVIENDAS')]: {[t('VIVIENDAS')]: [t('PISO')],[t('ESCALERA_Y_PORTAL')]: [t('SERVICIOS_GENERALES')],[t('ASCENSORES')]: [t('SERVICIOS_GENERALES')],[t('CALEFACCION')]: [t('SERVICIOS_GENERALES')],[t('MOTORES')]: [t('SERVICIOS_GENERALES')],[t('LOCALES_COMERCIALES')]: [t('LOCAL')],[t('GARAJE')]: [t('GARAJE')],[t('OFICINAS')]: [t('OFICINAS')],[t('SERVICIOS_GENERALES')]: [t('SERVICIOS_GENERALES')],[t('ALMACEN')]: [t('ALMACEN')],[t('DEPORTIVAS')]: [t('SERVICIOS_GENERALES')],},[t('VIVIENDA_INDIVIDUAL')]: {[t('VIVIENDAS')]: [t('CASA_CHALET')],},[t('INDUSTRIA_INDEPENDIENTE')]: {[t('INDUSTRIA')]: [t('INDUSTRIA')],},[t('LOCAL_DE_NEGOCIO')]: {[t('LOCALES_COMERCIALES')]: [t('LOCAL')],[t('OFICINAS')]: [t('OFICINAS')],},[t('EMP_AGRARIA_GANADERA')]: {[t('INDUSTRIA')]: [t('INDUSTRIA')],[t('ALMACEN')]: [t('ALMACEN'), t('NAVE')],},[t('DOCENTES_SECULARES')]: {[t('EDUCATIVOS')]: [t('EDUCATIVO')],},[t('AGRUPAC_INDUSTRIALES')]: {[t('INDUSTRIA')]: [t('SERVICIOS_GENERALES'), t('INDUSTRIA'), t('NAVE'), t('ALMACEN')],},[t('EDIFICIO_COMERCIAL')]: {[t('ASCENSORES')]: [t('SERVICIOS_GENERALES')],[t('CALEFACCION')]: [t('SERVICIOS_GENERALES')],[t('MOTORES')]: [t('SERVICIOS_GENERALES')],[t('LOCALES_COMERCIALES')]: [t('LOCAL')],[t('GARAJE')]: [t('GARAJE')],[t('OFICINAS')]: [t('OFICINAS')], [t('SERVICIOS_GENERALES')]: [t('SERVICIOS_GENERALES')],[t('ALMACEN')]: [t('ALMACEN')],},[t('OTRAS')]: {[t('DEPENDENCIAS_MILITAR')]: [t('LOCAL')],[t('EDIFICIO_RELIGIOSO')]: [t('LOCAL')],[t('DEPORTIVAS')]: [t('LOCAL')],},};
  
  const TiposSuministro = {[t('SERVICIOS_PUBLICOS')]: [t('SERVICIOS_PUBLICOS'), t('PUNTO_DE_RECARGA_VE')],[t('DE_LA_ADMINISTRACION')]: [t('SERVICIOS_PUBLICOS')],[t('ESPECTACULOS')]: [t('SERVICIOS_PUBLICOS')],[t('VIVIENDAS')]: [t('PISO'), t('CASA_CHALET')],[t('ESCALERA_Y_PORTAL')]: [t('SERVICIOS_GENERALES')],[t('ASCENSORES')]: [t('SERVICIOS_GENERALES')],[t('CALEFACCION')]: [t('SERVICIOS_GENERALES')],[t('MOTORES')]: [t('SERVICIOS_GENERALES')],[t('LOCALES_COMERCIALES')]: [t('LOCAL')],[t('GARAJE')]: [t('GARAJE')],[t('OFICINAS')]: [t('OFICINAS')],[t('SERVICIOS_GENERALES')]: [t('SERVICIOS_GENERALES')],[t('ALMACEN')]: [t('ALMACEN'), t('NAVE')],[t('DEPORTIVAS')]: [t('SERVICIOS_GENERALES')],[t('INDUSTRIA')]: [t('INDUSTRIA')],[t('EDUCATIVOS')]: [t('EDUCATIVO')],[t('DEPENDENCIAS_MILITAR')]: [t('LOCAL')],[t('EDIFICIO_RELIGIOSO')]: [t('LOCAL')],};
  
  const TiposLocal = [t('SERVICIOS_PUBLICOS'),t('DE_LA_ADMINISTRACION'),t('ESPECTACULOS'),t('VIVIENDAS'),t('ESCALERA_Y_PORTAL'),t('ASCENSORES'),t('CALEFACCION'),t('MOTORES'),t('LOCALES_COMERCIALES'),t('GARAJE'),t('OFICINAS'),t('SERVICIOS_GENERALES'),t('ALMACEN'),t('DEPORTIVAS'),t('INDUSTRIA'),t('EDUCATIVOS'),t('DEPENDENCIAS_MILITAR'),t('EDIFICIO_RELIGIOSO')];

  const UbicacionesContador = [t('INTERIOR'),t('ENTRESUELO'),t('SOTANO'),t('FACHADA'),t('PORTAL')];

  const DescripcionUso= {[t('SERVICIOS_PUBLICOS')]: {[t('SERVICIOS_PUBLICOS')]: { descripcionUso: 'desplegable', items: ['SEMÁFORO', 'CARTELES INFORMATIVOS', 'SEÑALES VIALES', 'COMUNICACIONES', 'OTROS'] },[t('PUNTO_DE_RECARGA_VE')]: { descripcionUso: 'desplegable', items: ['RECARGA VE'] }},[t('DE_LA_ADMINISTRACION')]: {[t('SERVICIOS_PUBLICOS')]: { descripcionUso: 'descripción', items: [] }},[t('ESPECTACULOS')]: {[t('SERVICIOS_PUBLICOS')]: { descripcionUso: 'desplegable', items: ['CINE', 'TEATRO', 'OTROS'] }},[t('VIVIENDAS')]: {[t('PISO')]: { descripcionUso: 'ESPIMA', items: [] },[t('CASA_CHALET')]: { descripcionUso: 'ESPIMA', items: [] }},[t('ESCALERA_Y_PORTAL')]: {[t('SERVICIOS_GENERALES')]: { descripcionUso: 'ESPIMA', items: [] }},[t('ASCENSORES')]: {[t('SERVICIOS_GENERALES')]: { descripcionUso: 'ESPIMA', items: [] },[t('SERVICIOS_GENERALES')]: { descripcionUso: 'descripción', items: [] }},[t('CALEFACCION')]: {[t('SERVICIOS_GENERALES')]: { descripcionUso: 'ESPIMA', items: [] },[t('SERVICIOS_GENERALES')]: { descripcionUso: 'descripción', items: [] }},[t('MOTORES')]: {[t('SERVICIOS_GENERALES')]: { descripcionUso: 'ESPIMA', items: [] },[t('SERVICIOS_GENERALES')]: { descripcionUso: 'descripción', items: [] }},[t('LOCALES_COMERCIALES')]: {[t('LOCAL')]: { descripcionUso: 'ESPIMA', items: [] },[t('LOCAL')]: { descripcionUso: 'descripción', items: [] }},[t('GARAJE')]: {[t('GARAJE')]: { descripcionUso: 'ESPIMA', items: [] },[t('GARAJE')]: { descripcionUso: 'descripción', items: [] }},[t('OFICINAS')]: {[t('OFICINAS')]: { descripcionUso: 'ESPIMA', items: [] },[t('OFICINAS')]: { descripcionUso: 'descripción', items: [] }},[t('SERVICIOS_GENERALES')]: {[t('SERVICIOS_GENERALES')]: { descripcionUso: 'ESPIMA', items: [] },[t('SERVICIOS_GENERALES')]: { descripcionUso: 'descripción', items: [] }},[t('ALMACEN')]: {[t('ALMACEN')]: { descripcionUso: 'ESPIMA', items: [] },[t('ALMACEN')]: { descripcionUso: 'descripción', items: [] },[t('NAVE')]: { descripcionUso: 'descripción', items: [] }},[t('DEPORTIVAS')]: {[t('SERVICIOS_GENERALES')]: { descripcionUso: 'ESPIMA', items: [] }},[t('INDUSTRIA')]: {[t('INDUSTRIA')]: { descripcionUso: 'descripción', items: [] },[t('SERVICIOS_GENERALES')]: { descripcionUso: 'descripción', items: [] },[t('NAVE')]: { descripcionUso: 'descripción', items: [] },[t('ALMACEN')]: { descripcionUso: 'descripción', items: [] }},[t('EDUCATIVOS')]: {[t('EDUCATIVO')]: { descripcionUso: 'desplegable', items: ['INSTITUTO', 'COLEGIO', 'UNIVERSIDAD', 'RESIDENCIA ESTUDIANTES', 'ACADEMIA', 'GUARDERÍA', 'OTROS'] }},[t('DEPENDENCIAS_MILITAR')]: {[t('LOCAL')]: { descripcionUso: 'descripción', items: [] }},[t('EDIFICIO_RELIGIOSO')]: {[t('LOCAL')]: { descripcionUso: 'descripción', items: [] }},[t('DEPORTIVAS')]: {[t('LOCAL')]: { descripcionUso: 'descripción', items: [] }}};

  const saveDraftBtn = useSelector((state: any) => state.provisions.saveDraftBtn);
  const errorSaveDraftBtn = useSelector((state: any) => state.provisions.errorSaveDraftBtn);


  useEffect(() => {
    if (selectedTipoLocal && selectedTipoSuministro && DescripcionUso[selectedTipoLocal] && DescripcionUso[selectedTipoLocal][selectedTipoSuministro]) {
      const descripcionUso = DescripcionUso[selectedTipoLocal][selectedTipoSuministro].descripcionUso;
      if (descripcionUso === 'ESPIMA') {
        setShowing('ESPIMA');
      } else if (descripcionUso === 'descripción') {
        setShowing('descripción');
      } else if (descripcionUso === 'desplegable') {
        setShowing('desplegable');
      } else {
        setShowing('');
      }
    }
  }, [selectedTipoLocal, selectedTipoSuministro, DescripcionUso]);


  const [provinceList, setProvinceList] = useState([] as any)
  const [townList, setTownList] = useState([] as any)
  const [addressList, setAddressList] = useState([] as any)
  const [loadingStatesList, setLoadingStatesList] = useState(false)
  const [loadingTownList, setLoadingTownList] = useState(false)
  const [loadingAddressList, setLoadingAddressList] = useState(false)
  const [validStreetType, setValidStreetType] = useState(false)
  const [validAddress, setValidAddress] = useState(false)
  const [validNumber, setValidNumber] = useState(false)
  const [invalidZip, setInvalidZip] = useState(false)
  const [CharactersObs, setCharactersObs] = useState(300)
  const [validPower, setValidPower] = useState(false)
  const [openListAddress, setOpenListAddress] = useState(false)
  const [disabledAllFields, setDisabledAllFields] = useState(true)
  const [manualDirection, setManualDirection] = useState(false)
  const [searchAddress, setSearchAddress] = useState('')
  
  const cadastreUrl = process.env.REACT_APP_CADSTRE_ENDPOINT


  useEffect(() => {
    if (!validNumber && !validAddress && !validStreetType && !invalidZip) {
      setNoErrorForm1(true)
    } else {setNoErrorForm1(false)}
  }, [validNumber,validAddress,validStreetType,invalidZip])

  useEffect(() => {
    setRadioButton3(null)
  }, [radioButton0])
  
  

  useEffect(() => {
    // cargar lista de provincias

    setLoadingStatesList(true)

    try {
      // LCS: Registrar el tiempo inicial
      const startTime = performance.now();

      fetch(cadastreUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          GNFHeader: {
            IDServicio: 'CATASTRO',
            IDOperacion: 'ConsultaProvincia',
            IDCliente: 'ZEUS',
          },
        }),
      }).then(async (response) => {
        const responseJson = await response.json()
  
        const statesList = [] as any
  
        responseJson &&
          responseJson.provincias &&
          responseJson.provincias.length > 0 &&
          responseJson.provincias.map((item, key) => {
            return statesList.push(noAccents(item.nombre))
          })
  
        setProvinceList(statesList)
  
        setLoadingStatesList(false)
      })

      // LCS: Registrar el tiempo final y calcular la duración
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      // LCS: Enviar evento a GA para medir el tiempo
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'post /catastro',
          apiUrlShort: 'post /catastro',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });
    } catch (e) {
      // LCS: Enviar evento a GA
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
          error: e,
          reactComponent: 'job-execution/TechnicalData.tsx - useEffect',
          apiUrl: 'post /catastro',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    // cargar lista de poblaciones correspondientes a una provincia
    setLoadingTownList(true)

    if (province && province.startsWith('A CORU')) {
      setProvince('A CORUÑA')
    }

    const body =
      '{"GNFHeader":{"IDServicio":"CATASTRO","IDOperacion":"ConsultaMunicipio","IDCliente":"ZEUS"},"provincia":"' +
      province +
      '"}'


    try {
      // LCS: Registrar el tiempo inicial
      const startTime = performance.now();

      fetch(cadastreUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body,
      }).then(async (response) => {
        const responseJson = await response.json()
  
        const townsList = [] as any
  
        responseJson &&
          responseJson.municipios &&
          responseJson.municipios.length > 0 &&
          responseJson.municipios.map((item, key) => {
            return townsList.push(noAccents(item.nombre))
          })
  
        setTownList(townsList)
  
        setLoadingTownList(false)
      })

      // LCS: Registrar el tiempo final y calcular la duración
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      // LCS: Enviar evento a GA para medir el tiempo
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'post /catastro',
          apiUrlShort: 'post /catastro',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });
    } catch (e) {
      // LCS: Enviar evento a GA
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
          error: e,
          reactComponent: 'job-execution/TechnicalData.tsx - useEffect',
          apiUrl: 'post /catastro',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    }
    

    // eslint-disable-next-line
  }, [province])

  const handleChangeRButton = (setter, newValue) => {
    setter(newValue)
  }

  const validateZipCode = (e) => {
    if (!isNaN(e.target.value) && e.target.value.length === 5) {
      setInvalidZip(false)
    } else {
      if (e.target.value !== '') {
        setInvalidZip(true)
      } else {
        setInvalidZip(false)
      }
    }
  }

  // const handleFincaChange = (event) => {
  //   setSelectedTipoFinca(event.target.value)
  //   setSelectedTipoLocal('')
  //   setSelectedTipoSuministro('')
  // }

  const handleInput = (e) => {
    setAccessKey(e.target.value)
    setCharacters(300 - e.target.value.length)
  }

  const handleInputObservations = (e) => {
    setObservations(e.target.value)
    setCharactersObs(300 - e.target.value.length)
  }

  const handleLocalChange = (event) => {
    setSelectedTipoLocal(event.target.value)
    setSelectedTipoSuministro('')
    setDescription('')
    setShowing('')
    setUso('')
    setStairs('')
    setDoor('')
    setFloor('')
  }

  const resetFilters = (whichOne: string) => {
    if(whichOne === 'all') {
		  setProvince('');
      setTown('');
    }
    setCodePostal('');
    setAddressType('');
    setAddress('');
    setSearchAddress('');
    setAddressNumber('');
    setDuplicator('');
		setIsDefAddressDeclared(false);
    setDisabledAllFields(true);
    setManualDirection(false);
    setIsAddressSave(false);
    setAddressExists('');
    setIdStreetSelect('');
    setOpenListAddress(false);
    setAddressList([] as any);
	}

  const [loading, setLoading] = useState(false)

  const checkAddressExists = async(type: string) => {
    setLoading(true)
    let provinceCode = '';
    let municipalityCode = '';
    let idStreetItem = '';
    let streetGasCodeItem = '';
    let gasCodeItem = '';
    
    await dispatch(thunkGetListProvinces('', (listProvinces) => {
      if (listProvinces && listProvinces.provinces && listProvinces.provinces.items && listProvinces.provinces.items.length > 0) {
        const foundProvince = listProvinces.provinces.items.find(provinceItem => provinceItem.provinceName.toLowerCase() === province.toLowerCase());
        provinceCode = foundProvince.provinceCode;
      }

    }));

    await dispatch(thunkGetListMunicipalities('', '', provinceCode, '', (listMunicipalities) => {
      if (listMunicipalities && listMunicipalities.municipalities && listMunicipalities.municipalities.items && listMunicipalities.municipalities.items.length > 0) {
        const foundMunicipality = listMunicipalities.municipalities.items.find(provinceItem => provinceItem.municipalityName.toLowerCase() === town.toLowerCase());
        municipalityCode = foundMunicipality.municipalityCode;
      }
    }));

    await dispatch(thunkGetListStreets(address, provinceCode, municipalityCode, '', (listStreets) => {
      if (listStreets && listStreets.streets && listStreets.streets.items && listStreets.streets.items.length > 0) {
        if(idStreetSelect) {
          idStreetItem = idStreetSelect
        } else {
          listStreets.streets.items.map((item)=>{
            if(item.streetType.toUpperCase() === addressType.toUpperCase() && item.streetName.toUpperCase() === address.toUpperCase() && item.zipCode === codePostal){
                idStreetItem = item.idStreet
              }
            })
        }

        if(type === "searchRoute"){
          setAddressList(listStreets.streets.items)
          setOpenListAddress(true)
        }
      } else {
        if(type === "searchRoute"){
          //setAddressList(listStreets.streets.items)
          setOpenListAddress(true)
        }
      }
    }));

    //if(idStreetItem) {
      await dispatch(thunkGetListAddresses(idStreetItem, '', '', (listStreets) => {
        if (listStreets && listStreets.streets && listStreets.streets.items && listStreets.streets.items.length > 0) {

          for (let i = 0; i < listStreets.streets.items.length; i++) {
            let item = listStreets.streets.items[i]
            if (item.streetName.toUpperCase() === address.toUpperCase()) {
              gasCodeItem = item.gasCode
              streetGasCodeItem = item.streetGasCode
              break;
            }
          }
           if (gasCodeItem && streetGasCodeItem) {
            setStreetGasCode(streetGasCodeItem);
            setGasCode(gasCodeItem); 
            setAddress(address)
            setAddressNumber(addressNumber)

            if (type === 'saveAddress'){
              setAddressExists('exists');
              setIsAddressSave(true)
            }
            setValidAddressManual(false)
            setErrorDirection(false);
            setLoading(false)
          } else {
            if (type === 'saveAddress'){
              setAddressExists('doesntExist');
              setIsAddressSave(true)
            }
            setValidAddressManual(true)
            setErrorDirection(true);
            setLoading(false)
          }
        } else {
          if (type === 'saveAddress'){
            setAddressExists('doesntExist');
            setIsAddressSave(true)
          }
          setValidAddressManual(true)
          setErrorDirection(true);
          setLoading(false)
        }
      }));
    /*} else {      
      setLoading(false)
    }*/
  }

  // const getLocalOptions = () => {
  //   return selectedTipoFinca ? TiposLocal[selectedTipoFinca] || [] : []
  // }

  const getSuministroOptions = () => {
      return TiposSuministro[selectedTipoLocal] || [];
    
  }

  return (
    <>
     <PopUpDirections openDialog={openListAddress} addressList={addressList} address={address} setAddress={setAddress} searchAddress={searchAddress} setCodePostal={setCodePostal} setAddressType={setAddressType} setAddressNumber={setAddressNumber} province={province} town={town} open={setOpenListAddress} setDisabledAllFields={setDisabledAllFields} setManualDirection={setManualDirection} setIdStreetSelect={setIdStreetSelect}/>
      <Grid container justifyContent='center' alignItems='center' style={{ padding: '10px 2px 10px 0', textAlign:'left'}} key={resetKey}>
        <Grid md={12} item>
          <ExpansionPanel
            defaultExpanded
            expanded={expandSubPanels === 'panel1'}
            onChange={handleChangeSubpanel('panel1')}
            disabled={disabledPanel1}
          >
            <ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
              <img className={classes.expansionPanelSummaryIcon} src={number1} alt='' />
              <Typography className={classes.expansionPanelSummaryText}>
                {t('provisions.jobExecution.technicalData')}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails key={resetKey}>
              {
                loading &&
                  <Spinner fixed />
              }
              <Grid
                container
                justifyContent='space-between'
                spacing={4}
                alignItems='center'
                style={{ marginTop: '10px' }}
              >
                <Grid className={classes.paddingLeftTop} md={12}>
                  <Typography align='left' className={classes.titleBold}>
                    {t('provisions.jobExecution.estateData')}
                  </Typography>
                </Grid>
                <Grid container /*spacing={2}*/ className={classes.blueBlock}>
                  <Grid className={classes.smallTitle}>
                    {t('provisions.jobExecution.isTr9.defAddressNeeded')}
                  </Grid>
                <Grid container md={12} style={{ marginBlock: '5px' }}>
                  <Grid item xs={12} md={5} className={classes.input}>
                    <Typography align='left' className={classes.subtitle} variant='subtitle2'>
                      {t('provisions.jobExecution.province')  + '*'}
                    </Typography>
                    <Select
                      fullWidth
                      values={provinceList}
                      label={t(
                        'provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.provinceLabel'
                      )}
                      value={province}
                      onChange={(e) => {
                        resetFilters('notAll')
                        setProvince(e.target.value)
                      }}
                      className={classes.alignLeft}
                      disabled={onlyRead ? true : loadingStatesList}
                      isLoading={loadingStatesList}
                    />        
                  </Grid>
                </Grid>
                <Grid container /*spacing={2}*/ md={12} /*style={{ marginBlock: '5px' }}*/ className={classes.containerAddress}>
                  <Grid item xs={12} md={10} className={`${classes.input} ${classes.inputMunicipe}`}>
                    <Typography align='left' className={classes.subtitle} variant='subtitle2'>
                      {t('provisions.jobExecution.town')  + '*'}
                    </Typography>
                    <Select
                      fullWidth
                      values={townList}
                      label={t(
                        'provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.municipeLabel'
                      )}
                      value={town}
                      onChange={(e) => {
                        resetFilters('notAll')
                        setTown(e.target.value)
                      }}
                      className={classes.alignLeft}
                      disabled={province === '' || onlyRead ? true : loadingTownList}
                      isLoading={loadingTownList}
                    />                    
                  </Grid>
                  <Grid item xs={12} md={2} className={`${classes.input} ${classes.inputCodePostal}`}>
                    <Typography align='left' className={classes.subtitle} variant='subtitle2'>
                    {t('provisions.jobExecution.codePostal')  + '*'}
                    </Typography>
                    <input
                      //fullWidth
                      value={codePostal}
                      onBlur={validateZipCode}
                      onChange={(e) => {
                        setCodePostal(e.target.value)
                      }}
                      //error={invalidZip}
                      disabled={onlyRead ? true : disabledAllFields}
                      className={`${classes.inputV4} `}
                    />                    
                  </Grid>
                </Grid>
                <Grid /*spacing={2}*/ container md={12} className={classes.containerAddress}>
                  <Grid item xs={12} md={manualDirection ? 3 : 3} className={`${classes.input} ${classes.inputAddressTypeContainer}`}>
                    <Typography align='left' className={classes.subtitle} variant='subtitle2'>
                      {t('provisions.jobExecution.addressType')  + '*'}
                    </Typography>
                    <input
                      value={addressType}
                      onChange={(e) => {
                        setAddressType(e.target.value)
                      }}
                      onBlur={(e) => {
                        (addressType === '') ? setValidStreetType(true) : setValidStreetType(false)
                      }}               
                      disabled={onlyRead ? true : disabledAllFields}
                      className={`${classes.inputV4} ${classes.inputAddressType}`}
                    />
                  </Grid>
                  <Grid item xs={12} md={manualDirection ? 5 : 7} className={`${classes.input} ${classes.inputAddressContainer}`} style={{paddingRight: manualDirection ? 15 : 0}}>
                    <Typography align='left' className={classes.subtitle} variant='subtitle2'>
                      {t('provisions.jobExecution.address')  + '*'}
                    </Typography>
                    <input
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value)
                        setSearchAddress(e.target.value)
                      }}
                      disabled={onlyRead ? true : town !== '' && addressNumber === '' ? false : manualDirection ? false : true}
                      className={`${classes.inputV4} ${classes.inputAddress}`}
                    />
                  </Grid>

                  {!manualDirection &&
                    <Grid item xs={12} md={2} className={`${classes.input} ${classes.searchButtonContainer}`}>
                      <Button
                        className={classes.searchBtn}
                        text={t('provisions.jobExecution.isTr9.popUpDirections.searchRoute')}
                        color='primary'
                        //size='large'
                        variant='contained'
                        disabled={idStreetSelect !== '' && (addressNumber !== '' || onlyRead ? true : address.replace(/[^a-zA-Z0-9]/g, '').length >= 3 ? false : true)} 
                        onClick={() => checkAddressExists('searchRoute')}
                      />
                    </Grid>
                  }

                  <Grid item xs={12} md={manualDirection ? 4 : 12} className={manualDirection ? classes.gridManualContainer : classes.gridContainer}>
                    <Grid item xs={12} md={manualDirection ? 6 : 2} className={`${classes.input}`} style={{paddingRight: manualDirection ? 20 : 8}}>
                      <Typography align='left' className={classes.subtitle} variant='subtitle2'>
                        {t('provisions.jobExecution.addressNumber')  + '*'}
                      </Typography>
                      <input
                        //fullWidth
                        value={addressNumber}
                        onChange={(e) => {
                          setAddressNumber(e.target.value)
                          setIsDefAddressDeclared(false)
                          setIsAddressSave(false)
                        }}
                        onBlur={(e) => {
                          (addressNumber === '') ? setValidNumber(true) : setValidNumber(false)
                        }}
                        disabled={onlyRead ? true : address !== '' && addressType !== '' && codePostal !== '' ? false : true}
                        type='number'
                        className={`${classes.inputV4} ${classes.inputAddressNumber}`}
                      />
                    </Grid>
                    <Grid item xs={12} md={manualDirection ? 6 : 2} className={`${classes.input} ${classes.inputDuplicatorContainer}`} style={{paddingLeft: manualDirection ? 0 : 5}}>
                      <Typography align='left' className={classes.subtitle} variant='subtitle2'>
                        {t('provisions.jobExecution.duplicator')}
                      </Typography>
                      <input
                        value={duplicator}
                        onChange={(e) => {
                          setDuplicator(e.target.value)
                          setIsDefAddressDeclared(false)
                          setIsAddressSave(false)
                        }}
                        className={`${classes.inputV4} ${classes.inputDuplicator}`}
                        disabled={onlyRead ? true : address !== '' && addressType !== '' && codePostal !== '' ? false : true}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid container justifyContent='flex-start' className={classes.checkboxAdressContainer}>
                  <Grid item className={classes.checkboxBotom}>
                    {(manualDirection && codePostal !== '' && addressType !== '' && address !== '' && addressNumber !== '') || (addressNumber !== '' && idStreetSelect !== '') ?
                      <Checkbox selected={isDefAddressDeclared} handleClick={() => setIsDefAddressDeclared(!isDefAddressDeclared)} disabled={addressNumber !== '' || onlyRead ? true : false} />
                    :
                      <input type="checkbox" disabled />
                    }
                    <span className={(addressNumber !== '' || idStreetSelect !== '') || !onlyRead ? classes.checkBoxText : classes.checkBoxTextDisabled}>{t('provisions.jobExecution.isTr9.defAddressCheckboxText')}</span>
                  </Grid>
                </Grid>

                <Grid item className={classes.formFooter}>
                  <Button
                    className={classes.acceptBtn}
                    text={t('provisions.jobExecution.isTr9.saveAddress')}
                    color='primary'
                    size='large'
                    variant='contained'
                    disabled={!isAddressButtonEnabled || onlyRead}
                    onClick={() => {checkAddressExists('saveAddress')}}
                  />
                  {!onlyRead &&
                    <p className={`${classes.link} ${classes.linkReset}`} onClick={() => resetFilters('all')}>
                      {t('averias.management.searchCups.resetFilters')}
                    </p>
                  }
								</Grid>

                  {isAddressSave && !onlyRead &&
                    <Grid container spacing={2} className={classes.whiteResponseBlock}>
                      <Grid container justifyContent='center'>
                        {addressExists === 'exists' ?
                            <img src={koIcon} className={classes.iconSmall} alt='Success Icon' />
                          : 
                            <img src={adviceIcon} alt='Advice Icon' />
                        }
                      </Grid>
                      <Grid className={classes.whiteResponseBlockTextBold}>
                        {addressExists === 'exists' ?                            
                            t('provisions.jobExecution.isTr9.savedAddress')
                          :
                            t('provisions.jobExecution.isTr9.addressDoesntExistText')
                          }
                      </Grid>

                      <Grid className={classes.whiteResponseBlockText}>
                        {addressExists !== 'exists' &&
                          t('provisions.jobExecution.isTr9.addressDoesntExistSubtext')
                        }
                      </Grid>
                    </Grid>
                  }
                  {/* { 
                    (addressExists === 'exists') ?
                    <Grid container spacing={2} className={classes.whiteResponseBlock}>
                      <Grid container justifyContent='center'>
                        <img src={koIcon} className={classes.iconBig} alt='Success Icon' />
                      </Grid>
                      <Grid className={classes.whiteResponseBlockTextBold}>
                        {t('provisions.jobExecution.isTr9.addressExistsText')}
                      </Grid>
                    </Grid>
                    : (addressExists === 'doesntExist') ?
                    <Grid container spacing={2} className={classes.whiteResponseBlock}>
                      <Grid container justifyContent='center'>
                        <img src={AdviceIcon} alt='Icono informativo' />
                      </Grid>
                      <Typography  className={classes.whiteResponseBlockTextBold}>
                        {t('provisions.jobExecution.isTr9.addressDoesntExistText')}                       
                      </Typography> 
                      <Typography className={classes.whiteResponseBlockText}>
                        {t('provisions.jobExecution.isTr9.addressDoesntExistSubtext')}
                      </Typography> 
                    </Grid>
                    :
                    <></>
                  } */}
                </Grid>

                { 
                  (dossierSubtype !== 'DOSSUB011') &&
                  <>
                    <Grid xs={12} md={12}>
                      <Divider variant='middle' className={classes.dashedDivider} />
                    </Grid>
                    <Grid className={classes.paddingLeftTop} md={12}>
                      <Typography align='left' className={classes.titleBold}>
                        {t('provisions.jobExecution.isTr9.newContructionTitle')}
                      </Typography>
                    </Grid>
                    <Grid container xs={12} md={12} spacing={2} className={classes.paddingLeftTop}>
                    {
                      (onlyRead) ?
                      <>
                        <Grid xs={12} className={classes.resumeFormSubtitle}>
                          {t('provisions.jobExecution.radiobutton0') + '*'}
                          <ArrowTooltip title={t('provisions.jobExecution.info3')} placement='bottom'>
                            <img className={classes.infoIcon} src={InfoIcon} alt='' />
                          </ArrowTooltip>
                        </Grid>
                        <Grid xs={12}>
                          {
                            (radioButton0 === 1) ? t('provisions.jobExecution.yes') : t('provisions.jobExecution.no')
                          }
                        </Grid>
                      </>
                      :
                      <>
                        <Grid item md={9}>
                          <Grid className={classes.smallTitle}>
                            {t('provisions.jobExecution.isTr9.newContructionQuestion') + '*'}
                          </Grid>
                        </Grid>
                      <Grid container md={4} className={classes.buttonsContainer} spacing={4}>
                          <Grid className={classes.noPaddingItemContainer}>
                            <div
                              className={`radioButton ${classes.radioButton} ${radioButton0 === 1 && 'active'} `}
                              onClick={() => {
                                radioButton0 !== 1 && handleChangeRButton(setRadioButton0, 1)
                              }}
                            />
                            <div className={classes.radioButtonText}>{t('provisions.jobExecution.yes')}</div>
                          </Grid>
                          <Grid className={classes.noPaddingItemContainer}>
                            <div
                              className={`radioButton ${classes.radioButton} ${radioButton0 === 0 && 'active'} `}
                              onClick={() => {
                                radioButton0 !== 0 && handleChangeRButton(setRadioButton0, 0)
                              }}
                            />
                            <div className={classes.radioButtonText}>{t('provisions.jobExecution.no')}</div>
                          </Grid>
                        </Grid>
                      </>
                    }
                      
                    </Grid>
                  </>
                }

                {/* { (radioButton0 === 0) &&    
                    <>
                      <Grid xs={12} md={12}>
                        <Divider variant='middle' className={classes.dashedDivider} />
                      </Grid>

                    
                      <Grid container xs={12} md={12} spacing={2} className={classes.paddingLeftTop}>
                      {
                        (onlyRead) ?
                        <>
                          <Grid xs={12} className={classes.resumeFormSubtitle}>
                          {t('provisions.jobExecution.radiobutton3') + ':'}
                          </Grid>
                          <Grid xs={12}>
                            {
                              radioButton3 === 1 ? t('provisions.jobExecution.yes') : t('provisions.jobExecution.no')
                            }
                          </Grid>
                        </>
                        :
                        <>
                        <Grid item md={9}>
                          <Grid className={classes.smallTitle}>
                            {t('provisions.jobExecution.radiobutton3') + ':'}
                            <ArrowTooltip title={t('provisions.jobExecution.info6')} placement='bottom'>
                              <img className={classes.infoIcon} src={InfoIcon} alt='' />
                            </ArrowTooltip>
                          </Grid>
                        </Grid>
                        <Grid container md={4} className={classes.buttonsContainer} spacing={4}>
                          <Grid item>
                            <div
                              className={`radioButton ${classes.radioButton} ${radioButton3 === 1 && 'active'} `}
                              onClick={() => {
                                radioButton3 !== 1 && handleChangeRButton(setRadioButton3, 1)
                              }}
                            />
                            <div className={classes.radioButtonText}>{t('provisions.jobExecution.yes')}</div>
                          </Grid>
                          <Grid item>
                            <div
                              className={`radioButton ${classes.radioButton} ${radioButton3 === 0 && 'active'} `}
                              onClick={() => {
                                radioButton3 !== 0 && handleChangeRButton(setRadioButton3, 0)
                              }}
                            />
                            <div className={classes.radioButtonText}>{t('provisions.jobExecution.no')}</div>
                          </Grid>
                        </Grid>
                        </>
                      }
                      </Grid>
                    </>
                } */}

                <Grid xs={12}  md={12}>
                  <Divider variant='middle' className={classes.dashedDivider} />
                </Grid>

                <Grid className={classes.paddingLeftTop} md={12}>
                  <Typography align='left' className={classes.titleBold}>
                    {t('provisions.jobExecution.installInformation')}
                  </Typography>
                </Grid>

                <Grid container xs={12} md={12} spacing={2} className={classes.paddingLeftTop}>
                {
                  (onlyRead) ?
                  <>
                      <Grid xs={12} className={classes.resumeFormSubtitle} style={{paddingLeft:'5px'}}>
                        {t('provisions.jobExecution.radioButtonCentralizacion') + '*'}
                      </Grid>
                      <Grid xs={12} style={{paddingLeft:'5px'}}>
                        {
                        radioButtonCentralizacion === 1 ?  'En centralización de contadores' : 'Descentralizado (CPM)'
                        }
                      </Grid>
                    </>
                  :
                  <>
                    <Grid item md={9}>
                    <Grid className={classes.smallTitle}>
                      {t('provisions.jobExecution.radioButtonCentralizacion') + '*'}
                      <ArrowTooltip title={t('provisions.jobExecution.info3')} placement='bottom'>
                        <img className={classes.infoIcon} src={InfoIcon} alt='' />
                      </ArrowTooltip>
                    </Grid>
                  </Grid>
                  <Grid container md={12} className={classes.buttonsContainer} spacing={4}>
                    <Grid className={classes.noPaddingItemContainer}>
                      <div
                        className={`radioButton ${classes.radioButton} ${radioButtonCentralizacion === 1 && 'active'} `}
                        onClick={() => {
                          radioButtonCentralizacion !== 1 && handleChangeRButton(setRadioButtonCentralizacion, 1)
                        }}
                      />
                      <div className={classes.radioButtonText}>{'En centralización de contadores'}</div>
                      {/* <div className={classes.underline}>{'¿Qué es?'}</div> */}
                    </Grid>
                    <Grid className={classes.noPaddingItemContainer}>
                      <div
                        className={`radioButton ${classes.radioButton} ${radioButtonCentralizacion === 0 && 'active'} `}
                        onClick={() => {
                          radioButtonCentralizacion !== 0 && handleChangeRButton(setRadioButtonCentralizacion, 0)
                        }}
                      />
                      <div className={classes.radioButtonText}>{'Descentralizado (CPM)'}</div>
                      {/* <div className={classes.underline}>{'¿Qué es?'}</div> */}
                    </Grid>
                    </Grid>
                  </>
                }
                </Grid>
                <Grid item xs={12} md={6} className={classes.input} style={{ marginTop: '20px' }}>
                {
                  (onlyRead) ?
                  <>
                      <Grid xs={12} className={classes.resumeFormSubtitle}>
                      {t('provisions.jobExecution.location') + ':*'}
                      </Grid>
                      <Grid xs={12}>
                        {selectedUbicacion}
                      </Grid>
                    </>
                  :
                  <>
                    <Typography align='left' className={classes.subtitle} variant='subtitle2'>
                      {t('provisions.jobExecution.location') + ':*'}
                    </Typography>
                    <Select
                      fullWidth
                      values={UbicacionesContador}
                      value={selectedUbicacion}
                      onChange={(e) => {
                        setSelectedUbicacion(e.target.value)
                      }}
                      className={classes.alignLeft}
                      label={
                        selectedUbicacion === '' ? t('clientDigitizationControl.search.searchParameters.select') : ''
                      }
                    />
                  
                  </>
                }
                </Grid>
                

                {radioButtonCentralizacion === 0 && (
                  <Grid item xs={12} md={6} className={classes.input} style={{ marginTop: '20px' }}>
                    {
                      (onlyRead) ?
                      <>
                          <Grid xs={12} className={classes.resumeFormSubtitle}>
                          {t('provisions.jobExecution.instalation') + '*'}
                          </Grid>
                          <Grid xs={12}>
                            {onlyCPMorBoth}
                          </Grid>
                        </>
                      :
                      <>
                        <Typography align='left' className={classes.subtitle} variant='subtitle2'>
                          {t('provisions.jobExecution.instalation') + '*'}
                          <ArrowTooltip title={t('provisions.jobExecution.info4')} placement='bottom'>
                            <img className={classes.infoIcon} src={InfoIcon} alt='' />
                          </ArrowTooltip>
                        </Typography>
                        <Select
                          fullWidth
                          values={[t('onlyCPM'), t('CPMCGP')]}
                          value={onlyCPMorBoth}
                          onChange={(e) => {
                            setOnlyCPMorBoth(e.target.value)
                          }}
                          className={classes.alignLeft}
                          label={onlyCPMorBoth === '' ? t('clientDigitizationControl.search.searchParameters.select') : ''}
                        />
                      </>
                    }
                </Grid>
                )}

                <Grid xs={12}  md={12}>
                  <Divider variant='middle' className={classes.dashedDivider} />
                </Grid>

                {radioButtonCentralizacion === 0 && (
                  <>
                    <Grid container xs={12} md={12} spacing={2} className={classes.paddingLeftTop}>
                    {
                      (onlyRead) ?
                      <>
                          <Grid xs={12} className={classes.resumeFormSubtitle} style={{paddingLeft:'5px'}}>
                          {t('provisions.jobExecution.radiobutton2') + ''}
                          </Grid>
                          <Grid xs={12} style={{paddingLeft:'5px'}}>
                            {
                              radioButton2 === 0 ? '1' : '2'
                            }
                          </Grid>
                        </>
                      :
                      <>
                          <Grid className={classes.noPaddingItemContainer} md={9}>
                          <Grid className={classes.smallTitle}>
                            {t('provisions.jobExecution.radiobutton2') + ''}
                            <ArrowTooltip title={t('provisions.jobExecution.info5')} placement='bottom'>
                              <img className={classes.infoIcon} src={InfoIcon} alt='' />
                            </ArrowTooltip>
                          </Grid>
                        </Grid>
                        <Grid container md={12} className={classes.buttonsContainer} spacing={4}>
                          <Grid className={classes.noPaddingItemContainer}>
                            <div
                              className={`radioButton ${classes.radioButton} ${radioButton2 === 0 && 'active'} `}
                              onClick={() => {
                                radioButton2 !== 0 && handleChangeRButton(setRadioButton2, 0)
                              }}
                            />
                            <div className={classes.radioButtonText}>{'1'}</div>
                          </Grid>
                          <Grid className={classes.noPaddingItemContainer}>
                            <div
                              className={`radioButton ${classes.radioButton} ${radioButton2 === 1 && 'active'} `}
                              onClick={() => {
                                radioButton2 !== 1 && handleChangeRButton(setRadioButton2, 1)
                              }}
                            />
                            <div className={classes.radioButtonText}>{'2'}</div>
                          </Grid>
                          </Grid>
                      </>
                    }
                    </Grid>

                    <Grid xs={12}  md={12}>
                      <Divider variant='middle' className={classes.dashedDivider} />
                    </Grid>


                    <Grid container xs={12} md={12} spacing={2} className={classes.paddingLeftTop}>
                    {
                      (onlyRead) ?
                      <>
                          <Grid xs={12} className={classes.resumeFormSubtitle} style={{paddingLeft:'5px'}}>
                          {t('provisions.jobExecution.radiobutton4') + ''}
                          </Grid>
                          <Grid xs={12} style={{paddingLeft:'5px'}}>
                            {
                              radioButton4 === 0 ? t('provisions.jobExecution.yes') : t('provisions.jobExecution.no')
                            }
                          </Grid>
                        </>
                      :
                      <>
                          <Grid item md={9}>
                          <Grid className={classes.smallTitle}>
                            {t('provisions.jobExecution.radiobutton4') + ''}
                          </Grid>
                        </Grid>
                        <Grid container md={12} className={classes.buttonsContainer} spacing={4}>
                          <Grid item>
                            <div
                              className={`radioButton ${classes.radioButton} ${radioButton4 === 0 && 'active'} `}
                              onClick={() => {
                                radioButton4 !== 0 && handleChangeRButton(setRadioButton4, 0)
                              }}
                            />
                            <div className={classes.radioButtonText}>{t('provisions.jobExecution.yes')}</div>
                          </Grid>
                          <Grid item>
                            <div
                              className={`radioButton ${classes.radioButton} ${radioButton4 === 1 && 'active'} `}
                              onClick={() => {
                                radioButton4 !== 1 && handleChangeRButton(setRadioButton4, 1)
                              }}
                            />
                            <div className={classes.radioButtonText}>{t('provisions.jobExecution.no')}</div>
                          </Grid>
                        </Grid>
                      </>
                    }
                    </Grid>

                    <Grid xs={12}  md={12}>
                      <Divider variant='middle' className={classes.dashedDivider} />
                    </Grid>
                  </>
                )}

                <Grid className={classes.paddingLeftTop} md={12}>
                  <Typography align='left' className={classes.titleBold}>
                    {t('provisions.jobExecution.accessData')}
                  </Typography>
                </Grid>

                <Grid container xs={12} md={12} spacing={2} className={classes.paddingLeftTop}>
                {
                  (onlyRead) ?
                  <>
                      <Grid xs={12} className={classes.resumeFormSubtitle} style={{paddingLeft:'5px'}}>
                      {t('provisions.jobExecution.radioButtonKey') + '*'}
                      </Grid>
                      <Grid xs={12} style={{paddingLeft:'5px'}}>
                        {
                          radioButtonKey === 1 ? t('provisions.jobExecution.yes') : (radioButtonKey === 0) ? t('provisions.jobExecution.no') : 'No lo sé'
                        }
                      </Grid>
                    </>
                  :
                  <>
                    <Grid item md={9}>
                    <Grid className={classes.smallTitle}>
                      {t('provisions.jobExecution.radioButtonKey') + '*'}
                      <ArrowTooltip title={t('provisions.jobExecution.info10')} placement='bottom'>
                        <img className={classes.infoIcon} src={InfoIcon} alt='' />
                      </ArrowTooltip>
                    </Grid>
                  </Grid>
                  <Grid container md={12} className={classes.buttonsContainer} spacing={4}>
                    <Grid className={classes.noPaddingItemContainer}>
                      <div
                        className={`radioButton ${classes.radioButton} ${radioButtonKey === 1 && 'active'} `}
                        onClick={() => {
                          radioButtonKey !== 1 && handleChangeRButton(setRadioButtonKey, 1)
                        }}
                      />
                      <div className={classes.radioButtonText}>{'Sí'}</div>
                    </Grid>
                    <Grid className={classes.noPaddingItemContainer}>
                      <div
                        className={`radioButton ${classes.radioButton} ${radioButtonKey === 0 && 'active'} `}
                        onClick={() => {
                          radioButtonKey !== 0 && handleChangeRButton(setRadioButtonKey, 0)
                        }}
                      />
                      <div className={classes.radioButtonText}>{'No'}</div>
                    </Grid>
                    <Grid className={classes.noPaddingItemContainer}>
                      <div
                        className={`radioButton ${classes.radioButton} ${radioButtonKey === 2 && 'active'} `}
                        onClick={() => {
                          radioButtonKey !== 2 && handleChangeRButton(setRadioButtonKey, 2)
                        }}
                      />
                      <div className={classes.radioButtonText}>{'No lo sé'}</div>
                    </Grid>
                  </Grid>
                  </>
                }
                </Grid>

                {(radioButtonKey === 0 || radioButtonKey === 2) &&
                  <Grid item xs={12} md={12} className={classes.paddingLeftTop}>
                    {
                      (onlyRead) ?
                      <>
                          <Grid xs={12} className={classes.resumeFormSubtitle}>
                          {t('provisions.jobExecution.accessKeyIndication') + ':'}
                          </Grid>
                          <Grid xs={12}>
                            {accessKey}
                          </Grid>
                        </>
                      :
                      <>
                        <Typography align='left' className={classes.subtitle} variant='subtitle2'>
                          {t('provisions.jobExecution.accessKeyIndication') + ':'}
                          <ArrowTooltip title={t('provisions.jobExecution.info12')} placement='bottom'>
                            <img className={classes.infoIcon} src={InfoIcon} alt='' />
                          </ArrowTooltip>
                        </Typography>
                        <Input
                          fullWidth
                          multiline
                          rows='5'
                          value={accessKey}
                          onChange={handleInput}
                          inputProps={{
                            maxlength: '300',
                          }}
                        />
                        <Grid item className={classes.characterCount} style={{ float: 'right' }}>
                          {t(
                            'provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.textArea.characters.part1'
                          )}

                          {characters}

                          {t(
                            'provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.textArea.characters.part2'
                          )}
                        </Grid>
                      </>
                    }
                  </Grid>
                }

                <Grid xs={12}  md={12}>
                  <Divider variant='middle' className={classes.dashedDivider} />
                </Grid>

                <Grid className={classes.paddingLeftTop} md={12}>
                  <Typography align='left' className={classes.titleBold}>
                    {t('provisions.jobExecution.supplyInfo')}
                  </Typography>
                </Grid>

                <Grid container spacing={2} className={classes.blueBlock}>
                  <Grid className={classes.paddingLeftTop} md={12}>
                    <Typography align='left' >
                      <span className={classes.blueBlockText}>{t('provisions.jobExecution.isTr9.requestTypeText')}:</span> <span className={classes.blueBlockData}>{requestType}</span>
                    </Typography>
                    
                  </Grid>
                  <Grid className={classes.paddingLeftTop} md={12}>
                    <Typography align='left' >
                      <span className={classes.blueBlockText}>{t('provisions.jobExecution.isTr9.totalRequestPowerText')}:</span> <span className={classes.blueBlockData}>{totalPower} kW</span>
                    </Typography>
                  </Grid>
                </Grid>

                <Grid className={classes.paddingLeftTop} md={12}>
                  <Typography align='left' className={classes.greyColor} variant='subtitle1' style={{marginBottom:'18px'}}>
                    {t('provisions.jobExecution.supplyInfoSubtitle')}
                  </Typography>
                </Grid>

                {/* <Grid item xs={12} md={6} className={classes.input}>
                    <Typography align='left' className={classes.subtitle} variant='subtitle2'> {t('provisions.jobExecution.estateType')+':*'}</Typography>
                      <Select
                        fullWidth
                        values={TiposFinca}
                        label={selectedTipoFinca === '' ? t('clientDigitizationControl.search.searchParameters.select') : ''}
                        value={selectedTipoFinca}
                        onChange={handleFincaChange}
                        className={classes.alignLeft}
                        
                      />
                    </Grid> */}
                <Grid container spacing={3} alignItems='center' className={`${classes.paddingLeftTop} ${classes.paddingFix}`}>
                {
                  (onlyRead) ?
                  <Grid md={3}>
                      <Grid xs={12}  className={classes.resumeFormSubtitle}>
                      {t('provisions.jobExecution.localType') + ':*'}
                      </Grid>
                      <Grid xs={12}>
                        {selectedTipoLocal}
                      </Grid>
                    </Grid>
                  :
                  <>
                    <Grid item xs={12} md={3} className={classes.input}>
                    <Typography align='left' className={classes.subtitle} variant='subtitle2'>
                      {t('provisions.jobExecution.localType') + ':*'}
                    </Typography>
                    <Select
                      fullWidth
                      values={TiposLocal}
                      label={
                        selectedTipoLocal === '' ? t('clientDigitizationControl.search.searchParameters.select') : ''
                      }
                      value={selectedTipoLocal}
                      onChange={handleLocalChange}
                      className={classes.alignLeft}
                    />
                    </Grid>
                  </>
                }
                  
                  {
                    (onlyRead) ?
                    <Grid md={3}>
                        <Grid xs={12} className={classes.resumeFormSubtitle}>
                        {t('provisions.jobExecution.supplyType') + ':*'}
                        </Grid>
                        <Grid xs={12}>
                          {selectedTipoSuministro}
                        </Grid>
                      </Grid>
                    :
                    <>
                      <Grid item xs={12} md={3} className={classes.input}>
                      <Typography align='left' className={classes.subtitle} variant='subtitle2'>
                        {t('provisions.jobExecution.supplyType') + ':*'}
                        <ArrowTooltip title={t('provisions.jobExecution.info1')} placement='bottom'>
                          <img className={classes.infoIcon} src={InfoIcon} alt='' />
                        </ArrowTooltip>
                      </Typography>
                      <Select
                        fullWidth
                        values={getSuministroOptions()}
                        value={selectedTipoSuministro}
                        onChange={(e) => {
                          setSelectedTipoSuministro(e.target.value)
                        }}
                        className={classes.alignLeft}
                        label={
                          selectedTipoSuministro === ''
                            ? t('clientDigitizationControl.search.searchParameters.select')
                            : ''}
                      />
                      </Grid>
                    </>
                  }
                  
                  <>
                      {showing === 'ESPIMA' && (
                        <>
                        {
                         (selectedTipoSuministro !== 'CASA/CHALET') && 
                         <>
                            {
                                (onlyRead) ?
                                <>
                                    <Grid item xs={12} md={2} className={classes.input}>
                                      <Grid xs={12} className={classes.resumeFormSubtitle}> 
                                          {t('provisions.jobExecution.stair') + ':'}
                                      </Grid>
                                      <Grid md={12}>
                                        {stairs}
                                      </Grid>
                                    </Grid>
                                    <Grid item xs={12} md={2} className={classes.input}>
                                      <Grid xs={12} className={classes.resumeFormSubtitle}>
                                          {t('provisions.jobExecution.floor') + ':*'}
                                      </Grid>
                                      <Grid md={12}>
                                        {floor}
                                      </Grid>
                                    </Grid>
                                    <Grid item xs={12} md={2} className={classes.input}>
                                     
                                      <Grid xs={12} className={classes.resumeFormSubtitle}>
                                        {t('provisions.jobExecution.door') + ':*'}
                                      </Grid>
                                      <Grid md={12}>
                                        {door}
                                      </Grid>
                                    </Grid>
                                  </>
                                :
                                <>
                                  <Grid item xs={12} md={1} className={classes.input}>
                                  <Typography align='left' className={classes.subtitle} variant='subtitle2'>
                                    {t('provisions.jobExecution.stair') + ':'}
                                  </Typography>
                                  <Input
                                    fullWidth
                                    value={stairs}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                                      setStairs(value)
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} md={1} className={classes.input}>
                                  <Typography align='left' className={classes.subtitle} variant='subtitle2'>
                                    {t('provisions.jobExecution.floor') + ':*'}
                                  </Typography>
                                  <Input
                                    fullWidth
                                    value={floor}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                                      setFloor(value)
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} md={1} className={classes.input}>
                                  <Typography align='left' className={classes.subtitle} variant='subtitle2'>
                                    {t('provisions.jobExecution.door') + ':*'}
                                  </Typography>
                                  <Input
                                    fullWidth
                                    value={door}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                                      setDoor(value)
                                    }}
                                  />
                                </Grid>
                                </>
                            }
                          
                         
                         
                         </>

                        }
                        </>
                      )}
                      {showing === 'descripción' && (
                        
                        <Grid item xs={12} md={4} className={classes.input}>
                          {
                            (onlyRead) ?
                            <>
                                <Grid xs={12} className={classes.resumeFormSubtitle}>
                                {t('provisions.jobExecution.descriptionUso') + ':'}
                                </Grid>
                                <Grid xs={12}>
                                  {description}
                                </Grid>
                              </>
                            :
                            <>
                              <Typography align='left' className={classes.subtitle} variant='subtitle2'>
                                {t('provisions.jobExecution.descriptionUso') + ':'}
                              </Typography>
                              <Input
                                fullWidth
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                              />
                            </>
                          }
                        </Grid>
                      )}
                      {showing === 'desplegable' && (
                        <Grid item xs={12} md={4} className={classes.input}>
                          {
                            (onlyRead) ?
                            <>
                                <Grid xs={12} className={classes.resumeFormSubtitle}>
                                {t('provisions.jobExecution.descriptionUso') + ''}
                                </Grid>
                                <Grid xs={12}>
                                  {uso}
                                </Grid>
                              </>
                            :
                            <>
                              <Typography align='left' className={classes.subtitle} variant='subtitle2'>
                                {t('provisions.jobExecution.descriptionUso') + ''}
                              </Typography>
                              <Select
                                fullWidth
                                values={DescripcionUso[selectedTipoLocal][selectedTipoSuministro].items || []}
                                value={uso}
                                onChange={(e) => setUso(e.target.value)}
                                className={classes.alignLeft}
                                label={
                                  description === '' ? t('clientDigitizationControl.search.searchParameters.select') : ''
                                }
                              />
                            </>
                          }
                          
                        </Grid>
                      )}
                      {showing === '' && (
                        <Grid item xs={12} md={3} className={classes.input}/>
                      )}
                    </>
                  

                  {/* <Grid xs={12} md={2} className={classes.input} style={showing === 'ESPIMA' ? {marginLeft:'10px'}: {}}>
                  {
                    (onlyRead) ?
                    <>
                        <Grid xs={12} className={classes.resumeFormSubtitle}>
                          {t('provisions.jobExecution.power') + ':'}
                        </Grid>
                        <Grid xs={12}>
                          {power}
                        </Grid>
                      </>
                    :
                    <>
                      <Typography align='left' className={classes.subtitle} variant='subtitle2'>
                      {t('provisions.jobExecution.power') + ':'}
                      </Typography>
                    <Input
                      fullWidth
                      value={power}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setpower(value)
                      }}
                      onBlur={(e) => {
                        (power === '') ? setValidPower(true) : setValidPower(false)
                      }}
                      error={validPower}
                      // onChange={(e) => {
                      //   const value = e.target.value;
                      //   if (/^\d*$/.test(value)) { // Verifica si el valor solo contiene dígitos
                      //     setpower(value);
                      //   }
                      // }}
                    />
                    </>
                  }
                    
                  </Grid> */}
                </Grid>

                <Grid item xs={12} md={12} className={classes.paddingLeftTop}>
                {
                  (onlyRead) ?
                  <>
                      <Grid xs={12} className={classes.resumeFormSubtitle}>
                      {t('provisions.jobExecution.observations')}
                      </Grid>
                      <Grid xs={12}>
                        {observations}
                      </Grid>
                    </>
                  :
                  <>
                    <Typography align='left' className={classes.titleBold}>
                    {t('provisions.jobExecution.observations')}
                    </Typography>
                    <Typography align='left' className={classes.subtitle} variant='subtitle2'>
                      {t('provisions.jobExecution.addComment') + ':'}
                    </Typography>
                    <Input
                      fullWidth
                      multiline
                      rows='5'
                      value={observations}
                      onChange={handleInputObservations}
                      inputProps={{
                        maxlength: '300',
                      }}
                    />
                    <Grid item className={classes.characterCount} style={{ float: 'right' }}>
                      {t(
                        'provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.textArea.characters.part1'
                      )}

                      {CharactersObs}

                      {t(
                        'provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.textArea.characters.part2'
                      )}
                    </Grid>
                  </>
                }
                  
                </Grid>
              </Grid>

              <Grid
                container
                xs={12}
                md={12}
                direction='row'
                justifyContent='center'
                spacing={3}
                className={`${classes.paddingLeftTop} ${classes.buttonsContainerMobile}`}
                style={{paddingBottom: 10}}
              >
                <Grid item className='cancelButton'>
                  <Button
                    className={classes.cancelButton}
                    text={t('common.buttons.cancel')}
                    color='inherit'
                    size='large'
                    variant='contained'
                    onClick={() => {setShowingCancelDialog(true)}}
                  />
   
                </Grid>
                <Grid item className='continueButton'>
                  <Button
                    className={classes.acceptBtn}
                    text={t('provisions.jobExecution.next')}
                    color='primary'
                    size='large'
                    variant='contained'

                    //onClick={() => {setShowDialogDraft(true)}}
                    onClick={() => {
                       setDisabledPanel2(false)
                       setexpandSubPanels('panel2')
                       setForm1Ok(true)
                    }}
                    disabled={disabledButton}
                  />
                </Grid>
              
              </Grid>
              <Grid
                container
                xs={12}
                md={12}
                direction='row'
                justifyContent='center'
                spacing={3}
                className={`${classes.paddingLeftTop} ${classes.buttonsContainerMobile}`}
              >       
                <Grid item className='saveButton'>
                  <Button
                    className={classes.saveButton}
                    text={t('common.buttons.saveDraft')}
                    color='inherit'
                    variant='contained'
                    startIcon={<img src={SaveIco} alt='Save Icon' style={{ width: 20, height: 20, }} />}
                    onClick={() => {               
                     handleSaveDraft()
                    }}
                  />
                </Grid>
              
              </Grid>
              {saveDraftBtn && isActiveSaveDraftBtn && (
                <Grid container xs={12} md={12} justifyContent='center' className={classes.buttonBorderMessage}>
                  <img src={koIcon} className={classes.iconBig} alt='Success Icon' />
                  <Grid item xs={12} md={12} className={`${classes.saveDraftSubtitle} ${classes.saveDraftContainer}`}>
                    <span>{t('provisions.jobExecution.isTr9.saveDraft')}</span>
                    <span >{formatDateAndHourStringWithBars(new Date())}</span>
                  </Grid>
                </Grid>
              ) }
              { errorSaveDraftBtn && isActiveSaveDraftBtn && 
                <Grid container xs={12} md={12} justifyContent='center' className={classes.buttonBorderMessage}>
                  <img src={errorIcon} className={classes.iconBig} alt='Error Icon' />
                  <Grid item xs={12} md={12} className={classes.errorHidden}>
                    {t('provisions.jobExecution.isTr9.errorSaveDraft')}
                  </Grid>
                  <Grid item xs={12} md={12} className={classes.errorHidden2}>
                    {t('provisions.jobExecution.isTr9.errorSaveDraft2')}
                  </Grid>
                  <Grid item xs={12} md={12} className={classes.errorDraftSubtitle}>
                    {t('provisions.jobExecution.isTr9.errorContinueDraft')}
                  </Grid>
                </Grid>
              }

          
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
      </Grid>
    </>
  )
} 

export default TecnicalData
