import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import reactStringReplace from 'react-string-replace'

import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import LocationModal from '../../../../new-provision/steps/request-data/location/location-modal/LocationModal'

import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import SearchIcon from '@material-ui/icons/Search'
import AlertIcon from '../../../../../../assets/icons/aviso_alerta_pop_up.svg'
import Button from '../../../../../../common/components/button/Button'
import Input from '../../../../../../common/components/input/Input'
import Spinner from '../../../../../../common/components/spinner/Spinner'

import { 
  validateCadastralReference, 
  validateCadastralReferenceEmpty
} from '../../../../../../common/lib/ValidationLib'

import { 
  setModificationCups,
  resetCadastreData,
  setCadastreDataItem,
  setCadastreDataZipcode,
 } from '../../../../../store/actions/ProvisionsActions'
import { thunkListSupplies } from '../../../../../../supplies/supplies-list/store/actions/SuppliesListThunkActions'
import { 
  hideError,
  showError
} from '../../../../../../common/store/actions/ErrorActions'

import CupsList from './cups-list/CupsList'
import CupsMosaic from './cups-mosaic/CupsMosaic'
import CupsInfo from './cups-info/CupsInfo'

import useStyles, {
  ExpansionPanel,
  ExpansionPanelSummary,
  StyledExpandMoreIcon,
  ExpansionPanelDetails
} from './CupsSearch.styles'
import DynamicSearcher from '../../../../../../common/components/searcher/DynamicSearcher'

// LCS: Importar la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../../../../core/utils/gtm'

const CupsSearch = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))
  const ref = useRef(null)

  const {
    activeComponent,
    setActiveComponent,
    setRequestDataCompleted
  } = props
  const handleChangeSearcCadastralReference = (e) => {
    const value = e.target.value

    setCadastralValue(value.toUpperCase())
  }
  const provisions = useSelector((state: any) => state.provisions)
  const [ cups, setCups ] = useState({} as any)
  const [ cupsList, setCupsList ] = useState([] as any)
  const [ finalList, setFinalList ] = useState(cupsList)
  const [ searchCupsList, setSearchCupsList ] = useState([] as any)
  const [ currentSearchValue, setCurrentSearchValue ] = useState('')
  const [ selected, setSelected ] = useState(true)
  const [ isLoading, setIsLoading ] = useState(false)
  const [ openBox, setOpenBox ] = useState(false)
  const [ totalPages, setTotalPages ] = useState(0)
  const [ currentPage, setCurrentPage ] = useState(0)
  const [ cadastralValue, setCadastralValue ] = useState('')
  const [ addressValue, setAddressValue ] = useState('')
  const [ showAddress, setShowAddress ] = useState(0)
  const [ showMap, setShowMap ] = useState(0)
    // inicio "by-pass de la referencia catastral"
  const [ withoutRC, setWithoutRC ] = useState(false)
  const [ mapCoordinates, setMapCoordinates ] = useState({
    x: 0,
    y: 0
  })
  const [ utmCoordinates, setUtmCoordinates ] = useState({
    x: '',
    y: ''
  } as any)
  const [ stateList, setStateList ] = useState([] as any)
  const [ townsList, setTownsList ] = useState([] as any)
  const [ selectedState, setSelectedState ] = useState(0)
  const [ selectedAddress, setSelectedAddress ] = useState('')
  const [ selectedCadastralReference, setSelectedCadastralReference ] = useState('')
  const [ selectedPostalCode, setSelectedPostalCode ] = useState('')
  const [ isRustic, setIsRustic ] = useState(false)
  const [ isLocationModalVisible, setIsLocationModalVisible ] = useState(false)
  const handleChangeZipCode = (zipcode) => {
    dispatch(setCadastreDataZipcode(zipcode))
  }


  const handleOpenLocationDialog = () => {
    setIsLocationModalVisible(true)
  }
  const cadastreUrl = process.env.REACT_APP_CADSTRE_ENDPOINT


  const user = useSelector((state: any) => state.user)
  const supplies = useSelector((state: any) => state.supplies)

  const rowsPerPage = 15

  useEffect(() => {
    setTotalPages(supplies.list.length === 0 ? 1 : Math.ceil(supplies.list.length / rowsPerPage))
    setCupsList(supplies.list)
  // eslint-disable-next-line
  }, [ supplies.list ])

  const handleSearchCadastralReference = () => {
    setSelectedState(0)

    setShowMap(0)

    if (cadastralValue !== '') {
      
      searchByCadastralReference(cadastralValue)
    }
  }
  const handleCloseLocationDialog = () => {
    setIsLocationModalVisible(false)

    dispatch(resetCadastreData())
  }

  const handleAcceptLocationDialog = (index: any) => {
    const refCatastral = (stateList[index] && stateList[index].refCatastral && stateList[index].refCatastral.posicion1A7 && stateList[index].refCatastral.posicion8A14) && stateList[index].refCatastral.posicion1A7 + '' + stateList[index].refCatastral.posicion8A14 + '' + stateList[index].refCatastral.posicion15A19 + '' + stateList[index].refCatastral.digitoControl1 + '' + stateList[index].refCatastral.digitoControl2
    const zipcode = (stateList[index] && stateList[index].domicilioTributario && stateList[index].domicilioTributario.locBienUrbano && stateList[index].domicilioTributario.locBienUrbano.locUrbana) && stateList[index].domicilioTributario.locBienUrbano.locUrbana.codPostal
    const inecode = (stateList[index] && stateList[index].domicilioTributario) && stateList[index].domicilioTributario.codProvinciaINE
    const address = (stateList[index] && stateList[index].domicilioTributario && stateList[index].domicilioTributario.locBienUrbano && stateList[index].domicilioTributario.locBienUrbano.locUrbana && stateList[index].domicilioTributario.locBienUrbano.locUrbana.direccion) && stateList[index].domicilioTributario.locBienUrbano.locUrbana.direccion.tipoVia + ' ' + stateList[index].domicilioTributario.locBienUrbano.locUrbana.direccion.nombreVia + ' ' + stateList[index].domicilioTributario.locBienUrbano.locUrbana.direccion.numero1Policia

    setSelectedState(index)

    setSelectedAddress(address)

    setSelectedCadastralReference(refCatastral)

    setSelectedPostalCode(zipcode)

    if (stateList[index] && stateList[index].tipo === 'RU') {
      dispatch(setCadastreDataZipcode(''))
    } else {
      dispatch(setCadastreDataZipcode(zipcode))
    }

    dispatch(setCadastreDataItem(stateList[index]))

    setIsLocationModalVisible(false)

    checkIfHuso30(refCatastral && refCatastral.substring(0, 14), stateList[index].tipo === 'RU' ? inecode : zipcode)
  }
  const checkIfHuso30 = (refCatastral: string, zipcode: string) => {
    let huso = '25830'

    if (
      zipcode && (
      zipcode.startsWith('15') || // a coruña
      zipcode.startsWith('27') || // lugo
      zipcode.startsWith('36') || // pontevedra
      zipcode.startsWith('32') // ourense
      )
    ) {
      huso = '25829'
    }

    try {
      // LCS: Registrar el tiempo inicial
      const startTime = performance.now();

      fetch(cadastreUrl, {
        method: 'POST',
        body: JSON.stringify({
          'GNFHeader': {
            'IDServicio': 'CATASTRO',
            'IDOperacion': 'Consulta_CPMRC',
            'IDCliente': 'ZEUS',
            'IDPeticion': ''
          },
          'refCatastral': refCatastral,
          'sistemaCoordenadas': 'EPSG:' + huso
        })
      }).then(async (response) => {
        const responseJson = await response.json()
  
        if (responseJson && responseJson.coordenadas && responseJson.coordenadas[0] && responseJson.coordenadas[0].coordX && responseJson.coordenadas[0].coordY) {
          setUtmCoordinates({ x: responseJson.coordenadas[0].coordX, y: responseJson.coordenadas[0].coordY })
        } else {
          dispatch(showError('0002', 'cadastreMap'))
        }
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
          reactComponent: 'edit-provision/CupsSearch.tsx - checkIfHuso30',
          apiUrl: 'post /catastro',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    }
  }

  const searchByCadastralReference = (cadastralReference: string) => {

    try {
      // LCS: Registrar el tiempo inicial
      const startTime = performance.now();

      // Obtener lista de inmuebles por referencia catastral
      fetch(cadastreUrl, {
        method: 'POST',
        body: JSON.stringify({
          
          'GNFHeader': {
            'IDServicio': 'CATASTRO',
            'IDOperacion': 'Consulta_DNPRC',
            'IDCliente': 'ZEUS',
            'IDPeticion': ''
          },
          'refCatastral': cadastralReference
        })
      }).then(async (response2) => {
        const data2 = await response2.json()

        if (data2 && data2.inmuebles && data2.inmuebles.length > 0) {
          setStateList(data2.inmuebles)

          if (data2.inmuebles[0].tipo === 'RU') {
            setIsRustic(true)
          } else {
            setIsRustic(false)
          }

          handleOpenLocationDialog()
        } else {
          dispatch(showError('0002', 'cadastreMap'))
        }
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
          reactComponent: 'edit-provision/CupsSearch.tsx - searchByCadastralReference',
          apiUrl: 'post /catastro',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    }
  }
  const handleChangeWithoutRC = (value) => {
    setWithoutRC(value)

    // reset de todos los datos

    dispatch(resetCadastreData())

    if (value) {
      // creamos la estructura inicial del elemento
      dispatch(setCadastreDataItem({
        domicilioTributario: {
          nombreProvincia: '',
          nombreMunicipio: '',
          locBienUrbano: {
            locUrbana: {
              direccion: {
                tipoVia: '',
                nombreVia: '',
                numero1Policia: ''
              },
              locInterna: {
                escalera: '',
                planta: '',
                puerta: ''
              }
            }
          }
        }
      }))
    }

    dispatch(hideError())

    setAddressValue('')

    setCadastralValue('')

    setShowMap(0)

    setShowAddress(0)

    setMapCoordinates({
      x: 0,
      y: 0
    })

    setStateList([])

    setTownsList([])

    setSelectedState(0)

    setSelectedAddress('')

    setSelectedCadastralReference('')

    setSelectedPostalCode('')

    setIsRustic(false)
  }

  useEffect(() => {
    if (user.token !== '' && user.profile.documentNumber) {
      if (cupsList.length === 0) {
        if (supplies.list.length === 0) {
          const supplyPointDefaultName = t('delegations.supplyPointDefaultName')
          setIsLoading(true)
          dispatch(thunkListSupplies(
            supplyPointDefaultName,
            //1,
            //15,
            //null,
            //false,
            //0, // offset [delegatePoints]
            //15, // limit [delegatePoints]
            false, // proveniente de cupsSearch para la busqueda [delegatePoints]
            true, // accion contra supplyPoints
            true, // accion contra delegatePoints
            (response) => {
              if (response && response.supplypoints && response.supplypoints.length > 0) {
                setCupsList(response.supplypoints)
              }
              setIsLoading(false)
            }
          ))
        } else {
          setCupsList(supplies.list)
        }
      }
    }
  // eslint-disable-next-line
  }, [ user ])

  const getAddress = (item) => {
    return item.address && `${item.address.street ? item.address.street+' ' : ''}${item.address.name ? item.address.name+' ' : ''}${item.address.number ? item.address.number+', ' : ''}${item.address.street ? item.address.street+' ' : ''}${item.address.complement2 ? item.address.complement2+', ' : ''}${item.address.municipality ? item.address.municipality+', ' : ''}${item.address.province ? item.address.province : ''}`
  }

  const handleClickReturn = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    let request_type = sessionStorage.getItem('request_type')
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      title_screen: 'indicanos el cups del suministro que quieres modificar',
      click_text: 'volver',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type: request_type,
      request_step_name: 'datos de la solicitud',
      cups: cups.cups,
      browsing_type: sessionStorage.getItem('browsing_type')
    })
    setActiveComponent(activeComponent - 1)
  }

  const handleClickContinue = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    let request_type = sessionStorage.getItem('request_type')
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      title_screen: 'indicanos el cups del suministro que quieres modificar',
      click_text: 'continuar',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type: request_type,
      request_step_name: 'datos de la solicitud',
      cups: cups.cups,
      browsing_type: sessionStorage.getItem('browsing_type')
    })
    setRequestDataCompleted(true)
    window.scrollTo({
      top: 0,
      left: 0
    })
  }

  const handleOnClick = (item) => {
    setOpenBox(false)
    const cupsObj = {
      cups: item.cups && item.cups,
      address: getAddress(item),
      power: item.maxAuthorizedVoltage && item.maxAuthorizedVoltage,
      validExtentRights: item.validExtentRights && item.validExtentRights,
      CIEApprovalDate: item.CIEApprovalDate && item.CIEApprovalDate,
      maxAuthorizedVoltage: item.maxAuthorizedVoltage && item.maxAuthorizedVoltage,
      maxAvalaibleVoltage: item.maxAvalaibleVoltage && item.maxAvalaibleVoltage,
      province: item.address && item.address.province,
      town: item.address && item.address.town,
      streetType: item.address && item.address.streetType,
      streetName: item.address && item.address.street,
      zipCode: item.address && item.address.zipCode,
      number: item.address && item.address.number,
      stair: item.address && item.address.stair,
      floor: item.address && item.address.floor,
      door: item.address && item.address.door,
      mail: item.holderContactEmail && item.holderContactEmail,
      phone: item.holderContactPhone && item.holderContactPhone,
      indTimeDiscriminator: item.hasHourlyDiscrimination && item.hasHourlyDiscrimination
    }
    dispatch(setModificationCups(cupsObj))
    setCups(cupsObj)
  }

  const handleClickOutside = (e: any) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setOpenBox(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)

    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  })

  useEffect(() => {
    if (cups.cups) {
      document.getElementById('scrollInto').scrollIntoView({ block: 'end', behavior: 'smooth' })
    }
  }, [ cups ])
  return (
    <>
    <LocationModal
      isLocationModalVisible={isLocationModalVisible}
      closeDialog={handleCloseLocationDialog}
      handleAcceptLocationDialog={handleAcceptLocationDialog}
      stateList={stateList}
      selectedState={selectedState}
      setSelectedState={setSelectedState}
      isRustic={isRustic}
    />
      <Grid container className={classes.container} justifyContent='center' spacing={4}>
      
        <Grid item xs={12} md={7} justifyContent='center'>
          <Grid className={classes.title}>{t('provisions.editProvision.requestData.cupsSearch.title')}</Grid>
          <Grid className={classes.text}> {t('provisions.editProvision.requestData.cupsSearch.text')}</Grid>
        </Grid>
        
        <Grid item xs={12} md={9}>

          <ExpansionPanel disabled={isLoading && cupsList.length === 0}>

            <ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
                {
                  cupsList.length === 0 && isLoading &&
                    <Spinner />
                }
                <Typography className={classes.expansionPanelSummaryText}>{t('provisions.editProvision.requestData.cupsSearch.panelTitle')}</Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              {
                isLoading &&
                  <Spinner />
              }
              <Grid container>
                <Grid container md={12} className={classes.searchContainer}>
                  <Grid item md={6} xs={12} className={classes.inputContainer}>
                    <DynamicSearcher
                       label={t('provisions.provisionsList.searcher')}
                       finalList={finalList.length === 0 ? cupsList : finalList}
                       setFinalList={setFinalList}
                       listItems={cupsList}
                       subtype={'suministro'}
                    />
                    {
                      openBox &&
                      searchCupsList.length > 0 &&
                        <div className={classes.searchBox} ref={ref}>
                          {
                            searchCupsList.map((item, index) => {
                              return (
                                <div
                                  key={index}
                                  className={classes.searchItem}
                                  onClick={() => handleOnClick(item)}
                                >
                                  {reactStringReplace(item.cups, currentSearchValue, (match) => (
                                    <b>{match}</b>
                                  ))}
                                </div>
                              )
                            })
                          }
                        </div>
                    }
                  </Grid>
                </Grid>
                <Grid container md={12}>
                  {
                    mobile ?
                    <CupsMosaic
                      cupsList={finalList.length === 0 ? cupsList : finalList}
                      setCups={setCups}
                      setSelected={setSelected}
                      setModificationCups={setModificationCups}
                      getAddress={getAddress}
                      totalPages={totalPages}
                      rowsPerPage={rowsPerPage}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      setIsLoading={setIsLoading}
                    />
                  :
                  <CupsList
                    cupsList={finalList.length === 0 ? cupsList : finalList}
                    searchCupsList={searchCupsList}
                    setCups={setCups}
                    setSelected={setSelected}
                    setModificationCups={setModificationCups}
                    getAddress={getAddress}
                    totalPages={totalPages}
                    rowsPerPage={rowsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    setIsLoading={setIsLoading}
                  />
                  
                  }
               
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>

        {
          Object.entries(cups).length > 0 &&
            <Grid item xs={12} md={9}>
              <CupsInfo
                cups={cups}
                setCups={setCups}
                selected={selected}
                getAddress={getAddress}
              />
            </Grid>
        }
        <Grid className={classes.text}>
                  {
                  /* 1020017 - Petición referencia catastral en expedientes de ampliación de potencia
                  t('provisions.newProvision.requestData.location.text3')} 
                  <span
                    className={classes.textLink}
                    onClick={() => {
                        handleChangeWithoutRC(false)
                        setAddressValue('')
                        setShowAddress(0)
                        setShowMap(0)
                      }
                    }
                  />
                  { //REFERENCIA CATASTRAL
                  <Grid container className={classes.container} justifyContent='center'>
                    <Grid container className={classes.containerLocation}>
                      <Grid item xs={11} sm={5} md={6}>
                        <Input
                          className={classes.inputAddress}
                          label={t('provisions.newProvision.requestData.location.labelCadastralReference')}
                          onChange={handleChangeSearcCadastralReference}
                        />
                      </Grid>
                      <Grid item className={classes.locationButton}>
                        <Button
                          text={t('common.buttons.continue')}
                          color='primary'
                          size='medium'
                          variant='contained'
                          onClick={handleSearchCadastralReference}
                          disabled={!validateCadastralReference(cadastralValue)}
                        />
                      </Grid>
                  </Grid>
                  </Grid>*/
              }
               {
                       (provisions.cadastreData && Object.keys(provisions.cadastreData.item).length > 0 && selectedAddress !== '' && selectedCadastralReference !== '' && selectedPostalCode !== '') &&
                  <Grid container xs={11} sm={10} md={9} className={classes.containerLocation} justifyContent='center'>
                    <div className={classes.containerResult}>
                      <img src={AlertIcon} alt='' className={classes.imgAlert} />

                      <span>{t('provisions.newProvision.requestData.location.addressOK')}</span>
                    </div>

                    <Grid container className={classes.containerData}>
                      <Grid item className={classes.textBlueBold}>
                        <span>{t('provisions.newProvision.requestData.location.addressData')}</span>
                      </Grid>

                      <Grid item >
                        <span>{t('provisions.newProvision.requestData.location.selectAddress')}</span>
                      </Grid>
                    </Grid>

                    <Grid container className={classes.containerInput}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={6}>
                          <label className={classes.textBlue}>
                            {
                              isRustic ?
                                t('provisions.newProvision.requestData.location.labelPolygon')
                              :
                                t('provisions.newProvision.requestData.location.labelAddress')
                            }
                          </label>

                          <div className={classes.selectContainer}>
                            {
                              isRustic ?
                                <Input
                                  value={(stateList[selectedState] && stateList[selectedState].domicilioTributario && stateList[selectedState].domicilioTributario.locBienRustico && stateList[selectedState].domicilioTributario.locBienRustico.locRustica) ? stateList[selectedState].domicilioTributario.locBienRustico.locRustica.codPoligono : ''}
                                  className={classes.inputAddress}
                                  InputProps={{
                                    readOnly: true
                                  }}
                                  fullWidth
                                />
                              :
                                <Input
                                  value={(stateList[selectedState] && stateList[selectedState].domicilioTributario && stateList[selectedState].domicilioTributario.locBienUrbano && stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana && stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion) ? ((stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.tipoVia ? stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.tipoVia + ' ' : '') + (stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.nombreVia ? stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.nombreVia + ' ' : '') + (stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.numero1Policia ? stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.numero1Policia : '')) : ''}
                                  className={classes.inputAddress}
                                  InputProps={{
                                    readOnly: true
                                  }}
                                  fullWidth
                                />
                            }
                          </div>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6}>
                          <label className={classes.textBlue}>
                            {
                              isRustic ?
                                t('provisions.newProvision.requestData.location.labelLand')
                              :
                                t('provisions.newProvision.requestData.location.labelProperty')
                            }
                          </label>

                          {
                            isRustic ?
                              <Input
                                value={(stateList[selectedState] && stateList[selectedState].domicilioTributario && stateList[selectedState].domicilioTributario.locBienRustico && stateList[selectedState].domicilioTributario.locBienRustico.locRustica) ? (stateList[selectedState].domicilioTributario.locBienRustico.locRustica.codParcelaPoligono + ' ' + stateList[selectedState].domicilioTributario.locBienRustico.locRustica.nombreParaje) : ''}
                                className={classes.inputAddress}
                                InputProps={{
                                  readOnly: true,
                                  endAdornment: (
                                    <IconButton onClick={handleOpenLocationDialog} >
                                      <SearchIcon />
                                    </IconButton>
                                  )
                                }}
                                fullWidth
                              />
                            :
                              <Input
                                value={(stateList[selectedState] && stateList[selectedState].domicilioTributario && stateList[selectedState].domicilioTributario.locBienUrbano && stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana && stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.locInterna) ? 'E: ' + (stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.locInterna.escalera ? stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.locInterna.escalera : '-') + ' | Pl: ' + (stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.locInterna.planta ? stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.locInterna.planta : '-') + ' | Pu: ' + (stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.locInterna.puerta ? stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.locInterna.puerta : '-') : ''}
                                className={classes.inputAddress}
                                InputProps={{
                                  readOnly: true,
                                  endAdornment: (
                                    <IconButton onClick={handleOpenLocationDialog} >
                                      <SearchIcon />
                                    </IconButton>
                                  )
                                }}
                                fullWidth
                              />
                          }
                        </Grid>

                        <Grid item xs={12} sm={6} md={6}>
                          <label className={classes.textBlue}>{t('provisions.newProvision.requestData.location.labelCadastralReference')}</label>

                          <Input
                            value={selectedCadastralReference}
                            className={classes.inputAddress}
                            InputProps={{
                              readOnly: true
                            }}
                            fullWidth
                          />
                        </Grid>

                        {
                          isRustic &&
                            <Grid item xs={12} sm={6} md={6}>
                              <label className={classes.textBlue}>{t('provisions.newProvision.requestData.location.zipcode')}</label>

                              <Input
                                value={provisions.cadastreData.zipcode}
                                className={classes.inputAddress}
                                onChange={(e) => handleChangeZipCode(e.target.value)}
                                fullWidth
                              />
                            </Grid>
                        }
                      </Grid>
                    </Grid>
                  </Grid>
              }
                </Grid>

        <Grid container alignItems='center' className={classes.buttons}>
            <Button
              text={t('common.buttons.return')}
              color='inherit'
              size='large'
              variant='contained'
              onClick={handleClickReturn}
            />

            <Button
              text={t('common.buttons.continue')}
              color='primary'
              size='large'
              variant='contained'
              onClick={handleClickContinue}
              disabled={Object.entries(cups).length === 0 ||(!validateCadastralReferenceEmpty(cadastralValue) && (provisions.cadastreData && Object.keys(provisions.cadastreData.item).length > 0 && selectedAddress !== '' && selectedCadastralReference !== '' && selectedPostalCode !== ''))}
            />
          </Grid>
      </Grid>

      <div id='scrollInto' />

    </>
  )
}

export default CupsSearch
