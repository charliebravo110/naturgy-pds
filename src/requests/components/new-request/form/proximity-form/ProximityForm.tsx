import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Map } from '@esri/react-arcgis'

import LocationModal from './location-modal/LocationModal'

import Grid from '@material-ui/core/Grid'

import Input from '../../../../../common/components/input/Input'
import Select from '../../../../../common/components/select/Select'
import Checkbox from '../../../../../common/components/checkbox/Checkbox'
import Pointer from '../../../../../common/components/pointer/Pointer'
import Button from '../../../../../common/components/button/Button'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import DatepickerV2 from '../../../../../common/components/datepickerV2/DatepickerV2'

import AlertIcon from '../../../../../assets/icons/aviso_alerta_pop_up.svg'

import { hideError, showError } from '../../../../../common/store/actions/ErrorActions'

import { validateNIF, validateCIF, validateMail, validateCadastralReference, validateMobileNumber } from '../../../../../common/lib/ValidationLib'
import { formatDate, getTracksTypes, noAccents } from '../../../../../common/lib/FormatLib'
import {
  setBuildingCoordinates,
  setCadastreDataCoordinates,
  setCadastreDataZipcode,
  setCadastreDataItem,
  resetCadastreData
} from '../../../../../provisions/store/actions/ProvisionsActions'

import useStyles from './ProximityForm.styles'
import { FormControlLabel } from '@material-ui/core'

// LCS: Importar la función
import { sendGAEvent } from '../../../../../core/utils/gtm'

const ProximityForm = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const cadastreUrl = process.env.REACT_APP_CADSTRE_ENDPOINT
  const provisions = useSelector((state: any) => state.provisions)

  const {
    proximityData,
    setProximityData,
    proximityErrors,
    setProximityErrors,
    setIsAddressForm
  } = props

  const [auxStartDate, setAuxStartDate] = useState()
  const [auxEndDate, setAuxEndDate] = useState()
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const [showMap, setShowMap] = useState(0)
  const [showAddress, setShowAddress] = useState(0)
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false)

  // inicio "by-pass de la referencia catastral"
  const [withoutRC, setWithoutRC] = useState(false)

  const [statesList, setStatesList] = useState([] as any)
  const [townsList, setTownsList] = useState([] as any)
  const [loadingStatesList, setLoadingStatesList] = useState(false)
  const [loadingTownsList, setLoadingTownsList] = useState(false)

  const [selectedAddress, setSelectedAddress] = useState('')
  const [selectedCadastralReference, setSelectedCadastralReference] = useState('')
  const [selectedPostalCode, setSelectedPostalCode] = useState('')

  const [isRustic, setIsRustic] = useState(false)

  const [addressValue, setAddressValue] = useState('')
  const [cadastralValue, setCadastralValue] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const today = new Date()
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15)

  const [mapCoordinates, setMapCoordinates] = useState({
    x: 0,
    y: 0
  })

  const [stateList, setStateList] = useState([] as any)
  const [selectedState, setSelectedState] = useState(0)

  const [identitySelector, setIdentitySelector] = useState('')
  const [scopeSelector, setScopeSelector] = useState('')

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
          reactComponent: 'ProximityForm.tsx - searchByCadastralReference',
          apiUrl: 'post /catastro',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    }
  }

  const [coordinates, setCoordinates] = useState({
    x: '',
    y: ''
  } as any)

  const [utmCoordinates, setUtmCoordinates] = useState({
    x: '',
    y: ''
  } as any)

  const identityValues = [
    t('requests.newRequest.form.btenForm.inputs.select6.option1'),
    t('requests.newRequest.form.btenForm.inputs.select6.option2'),
    t('requests.newRequest.form.btenForm.inputs.select6.option3'),
    t('requests.newRequest.form.btenForm.inputs.select6.option4')
  ]

  const requestReasonValues = [
    t('requests.newRequest.form.btenForm.inputs.select7.option1'),
    t('requests.newRequest.form.btenForm.inputs.select7.option2'),
    t('requests.newRequest.form.btenForm.inputs.select7.option3'),
    t('requests.newRequest.form.btenForm.inputs.select7.option4'),
    t('requests.newRequest.form.btenForm.inputs.select7.option5')
  ]

  const scopeValues = [
    t('requests.newRequest.form.btenForm.inputs.select5.option1'),
    t('requests.newRequest.form.btenForm.inputs.select5.option2'),
    t('requests.newRequest.form.btenForm.inputs.select5.option3')
  ]

  const electricalWorkValues = [
    t('requests.newRequest.form.btenForm.inputs.select4.option1'),
    t('requests.newRequest.form.btenForm.inputs.select4.option2')
  ]

  const handleUpdateErrors = (errors) => {
    setProximityErrors(errors)
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

  const handleChangeWithoutRCInput = (input, value): any => {
    if (input === 'zipcode') {
      // zipcode
      dispatch(setCadastreDataZipcode(value))
    } else {
      let itemAux = (provisions.cadastreData && provisions.cadastreData.item) ? provisions.cadastreData.item : {} as any

      if (input === 'state') {
        // provincia
        itemAux = {
          ...itemAux,
          domicilioTributario: {
            ...itemAux.domicilioTributario,
            nombreProvincia: value
          }
        }
      } else if (input === 'town') {
        // municipio
        itemAux = {
          ...itemAux,
          domicilioTributario: {
            ...itemAux.domicilioTributario,
            nombreMunicipio: value
          }
        }
      } else if (input === 'streetType') {
        // tipo de via
        itemAux = {
          ...itemAux,
          domicilioTributario: {
            ...itemAux.domicilioTributario,
            locBienUrbano: {
              ...itemAux.domicilioTributario.locBienUrbano,
              locUrbana: {
                ...itemAux.domicilioTributario.locBienUrbano.locUrbana,
                direccion: {
                  ...itemAux.domicilioTributario.locBienUrbano.locUrbana.direccion,
                  tipoVia: value
                }
              }
            }
          }
        }
      } else if (input === 'streetName') {
        // nombre de via
        itemAux = {
          ...itemAux,
          domicilioTributario: {
            ...itemAux.domicilioTributario,
            locBienUrbano: {
              ...itemAux.domicilioTributario.locBienUrbano,
              locUrbana: {
                ...itemAux.domicilioTributario.locBienUrbano.locUrbana,
                direccion: {
                  ...itemAux.domicilioTributario.locBienUrbano.locUrbana.direccion,
                  nombreVia: value
                }
              }
            }
          }
        }
      } else if (input === 'number') {
        // numero
        itemAux = {
          ...itemAux,
          domicilioTributario: {
            ...itemAux.domicilioTributario,
            locBienUrbano: {
              ...itemAux.domicilioTributario.locBienUrbano,
              locUrbana: {
                ...itemAux.domicilioTributario.locBienUrbano.locUrbana,
                direccion: {
                  ...itemAux.domicilioTributario.locBienUrbano.locUrbana.direccion,
                  numero1Policia: value
                }
              }
            }
          }
        }
      } else if (input === 'stair') {
        // escalera
        itemAux = {
          ...itemAux,
          domicilioTributario: {
            ...itemAux.domicilioTributario,
            locBienUrbano: {
              ...itemAux.domicilioTributario.locBienUrbano,
              locUrbana: {
                ...itemAux.domicilioTributario.locBienUrbano.locUrbana,
                locInterna: {
                  ...itemAux.domicilioTributario.locBienUrbano.locUrbana.locInterna,
                  escalera: value
                }
              }
            }
          }
        }
      } else if (input === 'floor') {
        // planta
        itemAux = {
          ...itemAux,
          domicilioTributario: {
            ...itemAux.domicilioTributario,
            locBienUrbano: {
              ...itemAux.domicilioTributario.locBienUrbano,
              locUrbana: {
                ...itemAux.domicilioTributario.locBienUrbano.locUrbana,
                locInterna: {
                  ...itemAux.domicilioTributario.locBienUrbano.locUrbana.locInterna,
                  planta: value
                }
              }
            }
          }
        }
      } else if (input === 'door') {
        // puerta
        itemAux = {
          ...itemAux,
          domicilioTributario: {
            ...itemAux.domicilioTributario,
            locBienUrbano: {
              ...itemAux.domicilioTributario.locBienUrbano,
              locUrbana: {
                ...itemAux.domicilioTributario.locBienUrbano.locUrbana,
                locInterna: {
                  ...itemAux.domicilioTributario.locBienUrbano.locUrbana.locInterna,
                  puerta: value
                }
              }
            }
          }
        }
      }
      dispatch(setCadastreDataItem(itemAux))
    }
  }

  const handleSearchAddress = () => {
    setSelectedState(0)

    setShowMap(0)

    dispatch(resetCadastreData())

    if (addressValue === '') {
      setShowMap(0)
    } else {
      if (addressValue) {
        const searchURL =
          'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&SingleLine=' +
          addressValue +
          '&maxLocations=6&sourceCountry=ES'

        const options = {
          method: 'GET'
        }

        fetch(searchURL, options).then(async (response) => {
          const data = await response.json()

          if (data.candidates && data.candidates.length > 0) {
            const location = data.candidates[0].location

            setMapCoordinates({
              x: location.x,
              y: location.y
            })

            setShowMap(1)
          } else {
            setShowMap(0)
          }
        })
      }
    }
  }

  const onlyHasLetters = (text) => {
    const letters = /^[A-Za-z][A-Za-z\s]*$/
    return text.match(letters) ? true : false
  }

  useEffect(() => {
    if (withoutRC && statesList.length === 0) {
      // cargar lista de provincias
      setLoadingStatesList(true)

      try {
        // LCS: Registrar el tiempo inicial
        const startTime = performance.now();

        fetch(cadastreUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify({
            'GNFHeader': {
              'IDServicio': 'CATASTRO',
              'IDOperacion': 'ConsultaProvincia',
              'IDCliente': 'ZEUS'
            }
          })
        }).then(async (response) => {
          const responseJson = await response.json()
  
          const statesList = [] as any
  
          responseJson && responseJson.provincias && responseJson.provincias.length > 0 && responseJson.provincias.map((item, key) => {
            return statesList.push(noAccents(item.nombre))
          })
  
          setStatesList(statesList)
  
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
            reactComponent: 'ProximityForm.tsx - useEffect',
            apiUrl: 'post /catastro',
            codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
          }
        });
      }
    }
    // eslint-disable-next-line
  }, [withoutRC])

  useEffect(() => {
    // cargar lista de poblaciones correspondientes a una provincia
    if (withoutRC && (provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.nombreProvincia !== '')) {
      setLoadingTownsList(true)

      let state = provisions.cadastreData.item.domicilioTributario.nombreProvincia

      if (state.startsWith('A CORU')) {
        state = 'A CORUÑA'
      }

      const body = '{"GNFHeader":{"IDServicio":"CATASTRO","IDOperacion":"ConsultaMunicipio","IDCliente":"ZEUS"},"provincia":"' + state + '"}'

      try {
        // LCS: Registrar el tiempo inicial
        const startTime = performance.now();

        fetch(cadastreUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body
        }).then(async (response) => {
          const responseJson = await response.json()
  
          const townsList = [] as any
  
          responseJson && responseJson.municipios && responseJson.municipios.length > 0 && responseJson.municipios.map((item, key) => {
            return townsList.push(noAccents(item.nombre))
          })
  
          setTownsList(townsList)
  
          setLoadingTownsList(false)
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
            reactComponent: 'ProximityForm.tsx - useEffect',
            apiUrl: 'post /catastro',
            codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
          }
        });
      }
    }
    // eslint-disable-next-line
  }, [(provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.nombreProvincia)])
  // fin "by-pass de la referencia catastral"

  const handleClickMap = (e) => {
    setIsLoading(true)

    setSelectedState(0)

    dispatch(setCadastreDataZipcode(''))

    dispatch(setCadastreDataItem({}))

    dispatch(hideError())

    const coordX = e.mapPoint && e.mapPoint.longitude && e.mapPoint.longitude.toString()
    const coordY = e.mapPoint && e.mapPoint.latitude && e.mapPoint.latitude.toString()

    setCoordinates({ x: coordX, y: coordY })
    dispatch(setBuildingCoordinates({ x: coordX, y: coordY }))
  }

  const handleChangeSearcCadastralReference = (e) => {
    const value = e.target.value

    setCadastralValue(value.toUpperCase())
  }

  const handleChangeSearchAddress = (e) => {
    const value = e.target.value

    setAddressValue(value)
  }

  const handleSearchCadastralReference = () => {
    setSelectedState(0)

    setShowMap(0)

    if (cadastralValue !== '') {
      searchByCadastralReference(cadastralValue)
    }
  }

  const handleOpenLocationDialog = () => {
    setIsLocationModalVisible(true)
  }

  const handleKeyPressAddress = (event) => {
    if (event.key === 'Enter') {
      handleSearchAddress()
    }
  }

  const handleChangeZipCode = (zipcode) => {
    dispatch(setCadastreDataZipcode(zipcode))
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
      zipcode.startsWith('15') || // a coruña
      zipcode.startsWith('27') || // lugo
      zipcode.startsWith('36') || // pontevedra
      zipcode.startsWith('32') // ourense
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
          reactComponent: 'ProximityForm.tsx - checkIfHuso30',
          apiUrl: 'post /catastro',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    }
    
  }

  const validateTime = (time) => {
    let isValid = false

    if (time !== '') {
      const timeArray = time.split('')

      if (timeArray[2] === ':') {
        const hours = time.split(':')[0]
        const minutes = time.split(':')[1]

        const hoursIsNum = /^\d+$/.test(hours) // Devuelve true si 'hours' sólo contiene números
        const minutesIsNum = /^\d+$/.test(minutes)  // Devuelve true si 'minutes' sólo contiene números

        if (hours !== '' && hoursIsNum && minutes !== '' && minutesIsNum) {

          if (parseInt(hours) >= 0 && parseInt(hours) <= 23 && parseInt(minutes) >= 0 && parseInt(minutes) < 60) {

            if (hours.length === 2 && minutes.length === 2 && time.length === 5) {
              isValid = true
            }
          }
        }
      }
    }

    return isValid
  }

  useEffect(() => {
    if (selectedCadastralReference !== '') {
      if (isRustic) {
        setProximityData({
          ...proximityData,
          cadastralRef: selectedCadastralReference,
          address: (stateList[selectedState] && stateList[selectedState].domicilioTributario && stateList[selectedState].domicilioTributario.locBienRustico && stateList[selectedState].domicilioTributario.locBienRustico.locRustica) ? stateList[selectedState].domicilioTributario.locBienRustico.locRustica.codPoligono : '',
          property: (stateList[selectedState] && stateList[selectedState].domicilioTributario && stateList[selectedState].domicilioTributario.locBienRustico && stateList[selectedState].domicilioTributario.locBienRustico.locRustica) ? (stateList[selectedState].domicilioTributario.locBienRustico.locRustica.codParcelaPoligono + ' ' + stateList[selectedState].domicilioTributario.locBienRustico.locRustica.nombreParaje) : '',
        })
      } else {
        setProximityData({
          ...proximityData,
          cadastralRef: selectedCadastralReference,
          address: (stateList[selectedState] && stateList[selectedState].domicilioTributario && stateList[selectedState].domicilioTributario.locBienUrbano && stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana && stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion && stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.numero1Policia && stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.tipoVia && stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.nombreVia) ? (stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.tipoVia + ' ' + stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.nombreVia + ' ' + stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.numero1Policia) : '',
          property: (stateList[selectedState] && stateList[selectedState].domicilioTributario && stateList[selectedState].domicilioTributario.locBienUrbano && stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana && stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.locInterna) ? 'E: ' + (stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.locInterna.escalera ? stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.locInterna.escalera : '-') + ' | Pl: ' + (stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.locInterna.planta ? stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.locInterna.planta : '-') + ' | Pu: ' + (stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.locInterna.puerta ? stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.locInterna.puerta : '-') : ''
        })
      }
    }
  }, [selectedCadastralReference])

  // useEffect(() => {
  //   if(isRustic){
  //     setProximityData({
  //       ...proximityData,
  //       address: (stateList[selectedState] && stateList[selectedState].domicilioTributario && stateList[selectedState].domicilioTributario.locBienRustico && stateList[selectedState].domicilioTributario.locBienRustico.locRustica) ? stateList[selectedState].domicilioTributario.locBienRustico.locRustica.codPoligono : '',
  //       property: (stateList[selectedState] && stateList[selectedState].domicilioTributario && stateList[selectedState].domicilioTributario.locBienRustico && stateList[selectedState].domicilioTributario.locBienRustico.locRustica) ? (stateList[selectedState].domicilioTributario.locBienRustico.locRustica.codParcelaPoligono + ' ' + stateList[selectedState].domicilioTributario.locBienRustico.locRustica.nombreParaje) : '',
  //       zipcodeRustic: (provisions && provisions.cadastreData && provisions.cadastreData.zipcode) ? provisions.cadastreData.zipcode : ''
  //     })
  //   } else {
  //     setProximityData({
  //       ...proximityData,
  //       address: (stateList[selectedState] && stateList[selectedState].domicilioTributario && stateList[selectedState].domicilioTributario.locBienUrbano && stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana && stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion && stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.numero1Policia && stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.tipoVia && stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.nombreVia) ? (stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.tipoVia + ' ' + stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.nombreVia + ' ' + stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.numero1Policia) : '',
  //       property: (stateList[selectedState] && stateList[selectedState].domicilioTributario && stateList[selectedState].domicilioTributario.locBienUrbano && stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana && stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.locInterna) ? 'E: ' + (stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.locInterna.escalera ? stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.locInterna.escalera : '-') + ' | Pl: ' + (stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.locInterna.planta ? stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.locInterna.planta : '-') + ' | Pu: ' + (stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.locInterna.puerta ? stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.locInterna.puerta : '-') : ''
  //     })
  //   }
  // }, [isRustic])

  const getFifteenDaysFromDate = (beginDate) => {
    const fifteenDaysFromDate = new Date(beginDate)
    fifteenDaysFromDate.setDate(fifteenDaysFromDate.getDate() + 15)
    return fifteenDaysFromDate
  }

  useEffect(() => {
    if (auxStartDate) {
      proximityData.startDate = formatDate(auxStartDate)

      setAuxEndDate(null)
    }
  }, [auxStartDate])

  useEffect(() => {
    if (auxEndDate) {
      proximityData.endDate = formatDate(auxEndDate)
    } else {
      proximityData.endDate = ''
    }
  }, [auxEndDate])

  useEffect(() => {
    if (coordinates.x !== '' && coordinates.y !== '') {

      try {
        // LCS: Registrar el tiempo inicial
        const startTime = performance.now();

        // Obtener referencia catastral por coordenadas
        fetch(cadastreUrl, {
          method: 'POST',
          body: JSON.stringify({
            'GNFHeader': {
              'IDServicio': 'CATASTRO',
              'IDOperacion': 'Consulta_RCCOOR',
              'IDCliente': 'ZEUS',
              'IDPeticion': ''
            },
            'coordX': coordinates.x && coordinates.x.toString(),
            'coordY': coordinates.y && coordinates.y.toString(),
            'srs': 'EPSG:4326'
          })
        }).then(async (response1) => {
          const data1 = await response1.json()

          const cadastralReference = data1 && data1.coordenadas && data1.coordenadas[0] && data1.coordenadas[0].refCatastral

          if (cadastralReference) {
            const cadastralReferenceString = cadastralReference && (cadastralReference.posicion1A7 + '' + cadastralReference.posicion8A14)

            searchByCadastralReference(cadastralReferenceString)

            setIsLoading(false)
          } else {
            setSelectedAddress('')
            setSelectedCadastralReference('')
            setSelectedPostalCode('')

            setIsLoading(false)

            dispatch(showError('0001', 'cadastreMap'))
          }
        }).catch(() => {
          setIsLoading(false)

          dispatch(showError('0001'))
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
            reactComponent: 'ProximityForm.tsx - checkIfHuso30',
            apiUrl: 'post /catastro',
            codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
          }
        });
      }
    }
    // eslint-disable-next-line
  }, [coordinates])

  useEffect(() => {
    dispatch(setCadastreDataCoordinates({
      x: utmCoordinates.x,
      y: utmCoordinates.y
    }))
    // eslint-disable-next-line
  }, [utmCoordinates])

  return (
    <div className={classes.container}>
      <LocationModal
        isLocationModalVisible={isLocationModalVisible}
        closeDialog={handleCloseLocationDialog}
        handleAcceptLocationDialog={handleAcceptLocationDialog}
        stateList={stateList}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        isRustic={isRustic}
      />
      {/* Datos del solicitante */}
      <div className={classes.description}>
        {t('requests.newRequest.form.btenForm.titles.title1')}
      </div>

      <Grid container className={classes.inputs} spacing={3}>

        {/* Nombre y Apellidos */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field1')}</div>
            </Grid>

            <Input
              fullWidth
              value={proximityData.applicantNameAndSurname}
              onChange={(e) => {
                const value = e.target.value

                setProximityData({
                  ...proximityData,
                  applicantNameAndSurname: value
                })

                if (value === '' || !onlyHasLetters(value)) {
                  handleUpdateErrors({
                    ...proximityErrors,
                    applicantNameAndSurname: true
                  })
                } else {
                  handleUpdateErrors({
                    ...proximityErrors,
                    applicantNameAndSurname: false
                  })
                }
              }}
              onBlur={(e) => {
                (e.target.value === '' || !onlyHasLetters(e.target.value)) ?
                  handleUpdateErrors({
                    ...proximityErrors,
                    applicantNameAndSurname: true
                  })
                  :
                  handleUpdateErrors({
                    ...proximityErrors,
                    applicantNameAndSurname: false
                  })
              }}
              error={proximityErrors.applicantNameAndSurname}
              helperText={proximityErrors.applicantNameAndSurname &&
                (proximityData.applicantNameAndSurname === '' ?
                  t('requests.newRequest.form.btenForm.inputs.errors.required')
                  :
                  t('requests.newRequest.form.btenForm.inputs.errors.nameAndSurname'))
              }
            />
          </Grid>
        </Grid>

        {/* DNI */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field2')}</div>
            </Grid>

            <Input
              fullWidth
              value={proximityData.docNumber}
              onChange={(e) => {
                const value = e.target.value

                setProximityData({
                  ...proximityData,
                  docNumber: value
                })

                if (value === '' || !validateNIF(value)) {
                  handleUpdateErrors({
                    ...proximityErrors,
                    docNumber: true
                  })
                } else {
                  handleUpdateErrors({
                    ...proximityErrors,
                    docNumber: false
                  })
                }
              }}
              onBlur={(e) => {
                (e.target.value === '' || !validateNIF(e.target.value)) ?
                  handleUpdateErrors({
                    ...proximityErrors,
                    docNumber: true
                  })
                  :
                  handleUpdateErrors({
                    ...proximityErrors,
                    docNumber: false
                  })
              }}
              error={proximityErrors.docNumber}
              helperText={proximityErrors.docNumber &&
                (proximityData.docNumber === '' ?
                  t('requests.newRequest.form.btenForm.inputs.errors.required')
                  :
                  t('requests.newRequest.form.btenForm.inputs.errors.docNumber'))
              }
            />
          </Grid>
        </Grid>

        {/* Teléfono móvil */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field3')}</div>
            </Grid>

            <Input
              fullWidth
              onChange={(e) => {
                const value = e.target.value

                setProximityData({
                  ...proximityData,
                  phone: value
                })

                if (value === '' || !validateMobileNumber(value)) {
                  handleUpdateErrors({
                    ...proximityErrors,
                    phone: true
                  })
                } else {
                  handleUpdateErrors({
                    ...proximityErrors,
                    phone: false
                  })
                }
              }}
              onBlur={(e) => {
                (e.target.value === '' || !validateMobileNumber(e.target.value)) ?
                  handleUpdateErrors({
                    ...proximityErrors,
                    phone: true
                  })
                  :
                  handleUpdateErrors({
                    ...proximityErrors,
                    phone: false
                  })
              }}
              error={proximityErrors.phone}
              helperText={proximityErrors.phone &&
                (proximityErrors.phone === '' ?
                  t('requests.newRequest.form.btenForm.inputs.errors.required')
                  :
                  t('requests.newRequest.form.btenForm.inputs.errors.mobile'))
              }
            />
          </Grid>
        </Grid>

        {/* E-mail */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field4')}</div>
            </Grid>

            <Input
              fullWidth
              value={proximityData.mail}
              onChange={(e) => {
                const value = e.target.value

                setProximityData({
                  ...proximityData,
                  mail: value
                })

                if (value === '' || !validateMail(value)) {
                  handleUpdateErrors({
                    ...proximityErrors,
                    mail: true
                  })
                } else {
                  handleUpdateErrors({
                    ...proximityErrors,
                    mail: false
                  })
                }
              }}
              onBlur={(e) => {
                (e.target.value === '' || !validateMail(e.target.value)) ?
                  handleUpdateErrors({
                    ...proximityErrors,
                    mail: true
                  })
                  :
                  handleUpdateErrors({
                    ...proximityErrors,
                    mail: false
                  })
              }}
              error={proximityErrors.mail}
              helperText={proximityErrors.mail &&
                (proximityData.mail === '' ?
                  t('requests.newRequest.form.btenForm.inputs.errors.required')
                  :
                  t('requests.newRequest.form.btenForm.inputs.errors.mail'))
              }
            />
          </Grid>
        </Grid>

        {/* Realiza la petición en calidad de */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field5')}</div>
            </Grid>

            <Select
              fullWidth
              label={''}
              value={identitySelector}
              values={identityValues}
              onChange={(e) => {
                const value = e.target.value

                if (value === t('requests.newRequest.form.btenForm.inputs.select6.option4')) {
                  setProximityData({
                    ...proximityData,
                    identity: ''
                  })
                } else {
                  setProximityData({
                    ...proximityData,
                    identity: value
                  })
                }

                setIdentitySelector(value)
              }}
            />
          </Grid>
        </Grid>

        {/* Indicar otro */}
        {
          (identitySelector === t('requests.newRequest.form.btenForm.inputs.select6.option4')) &&
          <Grid item md={6} sm={12} xs={12}>
            <Grid container direction='column'>
              <Grid item>
                <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field26')}</div>
              </Grid>

              <Input
                fullWidth
                value={proximityData && proximityData.identity}
                onChange={(e) => {
                  setProximityData({
                    ...proximityData,
                    identity: e.target.value
                  })
                }}
              />
            </Grid>
          </Grid>
        }
      </Grid>

      {/* Motivo de la solicitud */}
      <div className={classes.descriptionMargin}>
        {t('requests.newRequest.form.btenForm.titles.title2')}
      </div>

      <Grid container className={classes.inputs} spacing={3}>

        {/* Motivo */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field6')}</div>
            </Grid>

            <Select
              fullWidth
              label={''}
              value={proximityData && proximityData.requestReason}
              values={requestReasonValues}
              onChange={(e) => {
                setProximityData({
                  ...proximityData,
                  requestReason: e.target.value
                })
              }}
              onBlur={(e) => {
                e.target.value === '' ?
                  handleUpdateErrors({
                    ...proximityErrors,
                    requestReason: true
                  })
                  :
                  handleUpdateErrors({
                    ...proximityErrors,
                    requestReason: false
                  })
              }}
              error={proximityErrors.requestReason}
              helperText={proximityErrors.requestReason && t('requests.newRequest.form.btenForm.inputs.errors.required')}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Descripción de los trabajos que quiere realizar */}
      <div className={classes.descriptionMargin}>
        {t('requests.newRequest.form.btenForm.titles.title3')}
      </div>

      <Grid container className={classes.inputs} spacing={3}>

        {/* Descripción */}
        <Grid item md={12} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field7')}</div>
            </Grid>

            <Input
              fullWidth
              multiline
              rows='4'
              value={proximityData.workDescription}
              onChange={(e) => {
                const value = e.target.value

                setProximityData({
                  ...proximityData,
                  workDescription: value
                })

                if (value === '') {
                  handleUpdateErrors({
                    ...proximityErrors,
                    workDescription: true
                  })
                } else {
                  handleUpdateErrors({
                    ...proximityErrors,
                    workDescription: false
                  })
                }
              }}
              onBlur={(e) => {
                e.target.value === '' ?
                  handleUpdateErrors({
                    ...proximityErrors,
                    workDescription: true
                  })
                  :
                  handleUpdateErrors({
                    ...proximityErrors,
                    workDescription: false
                  })
              }}
              error={proximityErrors.workDescription}
              helperText={proximityErrors.workDescription && t('requests.newRequest.form.btenForm.inputs.errors.required')}
              inputProps={{
                maxlength: '200'
              }}
            />

            <Grid container justifyContent='flex-end'>
              <Grid item className={classes.characterCount}>
                {t('requests.newRequest.form.btenForm.inputs.comment.characterCount.part1')}

                <b>{(200 - proximityData.workDescription.length)}</b>

                {t('requests.newRequest.form.btenForm.inputs.comment.characterCount.part2')}

                <b>200</b>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Alcance de los trabajos que nos solicita */}
      <div className={classes.descriptionMargin}>
        {t('requests.newRequest.form.btenForm.titles.title4')}
      </div>

      <Grid container className={classes.inputs} spacing={3}>

        {/* Alcance */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field8')}</div>
            </Grid>

            <Select
              fullWidth
              label={''}
              value={scopeSelector}
              values={scopeValues}
              onChange={(e) => {
                const value = e.target.value

                if (value === t('requests.newRequest.form.btenForm.inputs.select5.option3')) {
                  setProximityData({
                    ...proximityData,
                    workScope: ''
                  })
                } else {
                  setProximityData({
                    ...proximityData,
                    workScope: value
                  })
                }

                setScopeSelector(value)
              }}
              onBlur={(e) => {
                scopeSelector === '' ?
                  handleUpdateErrors({
                    ...proximityErrors,
                    scopeSelector: true
                  })
                  :
                  handleUpdateErrors({
                    ...proximityErrors,
                    scopeSelector: false
                  })
              }}
              error={proximityErrors.scopeSelector}
              helperText={proximityErrors.scopeSelector && t('requests.newRequest.form.btenForm.inputs.errors.required')}
            />
          </Grid>
        </Grid>

        {/* Indicar otro */}
        {
          (scopeSelector === t('requests.newRequest.form.btenForm.inputs.select5.option3')) ?
            <Grid item md={6} sm={12} xs={12}>
              <Grid container direction='column'>
                <Grid item>
                  <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field27')}</div>
                </Grid>

                <Input
                  fullWidth
                  value={proximityData && proximityData.workScope}
                  onChange={(e) => {
                    setProximityData({
                      ...proximityData,
                      workScope: e.target.value
                    })
                  }}
                  onBlur={(e) => {
                    e.target.value === '' ?
                      handleUpdateErrors({
                        ...proximityErrors,
                        workScope: true
                      })
                      :
                      handleUpdateErrors({
                        ...proximityErrors,
                        workScope: false
                      })
                  }}
                  error={proximityErrors.workScope}
                  helperText={proximityErrors.workScope && t('requests.newRequest.form.btenForm.inputs.errors.required')}
                />
              </Grid>
            </Grid>
            :
            <Grid item md={6} sm={12} xs={12} />
        }

        {/* Observaciones */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field9')}</div>
            </Grid>

            <Input
              fullWidth
              value={proximityData && proximityData.workScopeObservations}
              onChange={(e) => {
                setProximityData({
                  ...proximityData,
                  workScopeObservations: e.target.value
                })
              }}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Empresa que va a realizar los trabajos */}
      <div className={classes.descriptionMargin}>
        {t('requests.newRequest.form.btenForm.titles.title5')}
      </div>

      <Grid container className={classes.inputs} spacing={3}>

        {/* Razón social */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field10')}</div>
            </Grid>

            <Input
              fullWidth
              value={proximityData.businessName}
              onChange={(e) => {
                const value = e.target.value

                setProximityData({
                  ...proximityData,
                  businessName: value
                })

                if (value === '') {
                  handleUpdateErrors({
                    ...proximityErrors,
                    businessName: true
                  })
                } else {
                  handleUpdateErrors({
                    ...proximityErrors,
                    businessName: false
                  })
                }
              }}
              onBlur={(e) => {
                e.target.value === '' ?
                  handleUpdateErrors({
                    ...proximityErrors,
                    businessName: true
                  })
                  :
                  handleUpdateErrors({
                    ...proximityErrors,
                    businessName: false
                  })
              }}
              error={proximityErrors.businessName}
              helperText={proximityErrors.businessName && t('requests.newRequest.form.btenForm.inputs.errors.required')}
            />
          </Grid>
        </Grid>

        {/* NIF/CIF */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field11')}</div>
            </Grid>

            <Input
              fullWidth
              value={proximityData.businessDocNum}
              onChange={(e) => {
                const value = e.target.value
                setProximityData({
                  ...proximityData,
                  businessDocNum: value
                })
              }}
              onBlur={(e) => {
                if (e.target.value !== '' && !validateCIF(e.target.value) && !validateNIF(e.target.value)) {
                  handleUpdateErrors({
                    ...proximityErrors,
                    businessDocNum: true
                  })
                } else {
                  handleUpdateErrors({
                    ...proximityErrors,
                    businessDocNum: false
                  })
                }
              }}
            />
          </Grid>
        </Grid>

        {/* Trabajo eléctrico SI/NO */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field12')}</div>
            </Grid>

            <Select
              fullWidth
              label={''}
              value={proximityData.businessElectricalWork}
              values={electricalWorkValues}
              onChange={(e) => {
                const value = e.target.value

                setProximityData({
                  ...proximityData,
                  businessElectricalWork: value
                })
              }}
            />
          </Grid>
        </Grid>

        {/* Número de registro de empresa autorizada */}
        {proximityData.businessElectricalWork === t('requests.newRequest.form.btenForm.inputs.select4.option1') ?
          <Grid item md={6} sm={12} xs={12}>
            <Grid container direction='column'>
              <Grid item>
                <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field13')}</div>
              </Grid>

              <Input
                fullWidth
                value={proximityData.businessRegistryNum}
                onChange={(e) => {
                  setProximityData({
                    ...proximityData,
                    businessRegistryNum: e.target.value
                  })
                }}
              />
            </Grid>
          </Grid>
          :
          <Grid item md={6} sm={12} xs={12} />
        }

        {/* Jefe de trabajos/Persona de contacto */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field14')}</div>
            </Grid>

            <Input
              fullWidth
              value={proximityData.businessContactPerson}
              onChange={(e) => {
                const value = e.target.value

                setProximityData({
                  ...proximityData,
                  businessContactPerson: value
                })

                if (value === '' || !onlyHasLetters(value)) {
                  handleUpdateErrors({
                    ...proximityErrors,
                    businessContactPerson: true
                  })
                } else {
                  handleUpdateErrors({
                    ...proximityErrors,
                    businessContactPerson: false
                  })
                }
              }}
              onBlur={(e) => {
                (e.target.value === '' || !onlyHasLetters(e.target.value)) ?
                  handleUpdateErrors({
                    ...proximityErrors,
                    businessContactPerson: true
                  })
                  :
                  handleUpdateErrors({
                    ...proximityErrors,
                    businessContactPerson: false
                  })
              }}
              error={proximityErrors.businessContactPerson}
              helperText={proximityErrors.businessContactPerson &&
                (proximityData.businessContactPerson === '' ?
                  t('requests.newRequest.form.btenForm.inputs.errors.required')
                  :
                  t('requests.newRequest.form.btenForm.inputs.errors.contactPerson'))
              }
            />
          </Grid>
        </Grid>

        {/* Teléfono móvil */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field15')}</div>
            </Grid>

            <Input
              fullWidth
              value={proximityData.businessContactPhoneNum}
              onChange={(e) => {
                const value = e.target.value

                setProximityData({
                  ...proximityData,
                  businessContactPhoneNum: value
                })

                if (value === '' || !validateMobileNumber(value)) {
                  handleUpdateErrors({
                    ...proximityErrors,
                    businessContactPhoneNum: true
                  })
                } else {
                  handleUpdateErrors({
                    ...proximityErrors,
                    businessContactPhoneNum: false
                  })
                }
              }}
              onBlur={(e) => {
                (e.target.value === '' || !validateMobileNumber(e.target.value)) ?
                  handleUpdateErrors({
                    ...proximityErrors,
                    businessContactPhoneNum: true
                  })
                  :
                  handleUpdateErrors({
                    ...proximityErrors,
                    businessContactPhoneNum: false
                  })
              }}
              error={proximityErrors.businessContactPhoneNum}
              helperText={proximityErrors.businessContactPhoneNum &&
                (proximityErrors.businessContactPhoneNum === '' ?
                  t('requests.newRequest.form.btenForm.inputs.errors.required')
                  :
                  t('requests.newRequest.form.btenForm.inputs.errors.mobile'))
              }
            />
          </Grid>
        </Grid>
      </Grid>
      {/* Ubicación de las instalaciones */}
      <Grid container className={classes.container} justifyContent='center'>
        <Grid container justifyContent='center'>
          <Grid item xs={11} sm={5} md={7}>
            <div className={classes.titleLocation}>{t('provisions.newProvision.requestData.location.title')}</div>
            <Grid justifyContent='center'>
              <Grid className={classes.textLocation}>
                {`${showAddress === 0 ? t('provisions.newProvision.requestData.location.text') : t('provisions.newProvision.requestData.location.text2')} `}

                <span
                  className={classes.textLink}
                  onClick={() => {
                    if (showAddress === 0) {
                      handleChangeWithoutRC(false)

                      setCadastralValue('')

                      setShowAddress(1)

                      setShowMap(0)
                    } else {
                      handleChangeWithoutRC(false)

                      setAddressValue('')

                      setShowAddress(0)

                      setShowMap(0)
                    }
                  }}
                >
                  {showAddress === 0 ?
                    t('provisions.newProvision.requestData.location.cadastralReference')
                    :
                    t('provisions.newProvision.requestData.location.cadastralReference2')
                  }
                </span>.
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container className={classes.containerWithoutCR}>
        <Grid item className={classes.checkboxWithoutCR} xs={11} sm={8} md={8}>
          <FormControlLabel
            control={
              <Checkbox
                checked={withoutRC}
                onChange={(e) => handleChangeWithoutRC(e.target.checked)}
                value='checkedB'
                color='primary'
              />
            }
            label={
              <div className={classes.checkboxLabelWithoutCR}>
                {t('provisions.newProvision.requestData.location.withoutRC')}
              </div>
            }
          />
        </Grid>
      </Grid>

      {/* si el check de "no tengo referencia catastral" esta activado*/}

      {withoutRC ? setIsAddressForm(true) : setIsAddressForm(false)}

      {withoutRC ?
        <Grid container className={classes.containerInput}>
          <Grid item md={8} sm={8} xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6}>
                <label className={classes.textBlue}>
                  {t('provisions.newProvision.requestData.location.withoutRCStateLabel')}
                </label>

                <div className={classes.selectContainer}>
                  <Select
                    fullWidth
                    className={classes.inputAddress}
                    label={t('provisions.newProvision.requestData.location.withoutRCSelectStateLabel')}
                    value={provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.nombreProvincia}
                    values={statesList}
                    onChange={(e) => {
                      handleChangeWithoutRCInput('state', e.target.value)
                      const value = e.target.value

                      setProximityData({
                        ...proximityData,
                        state: value
                      })

                      if (value === '') {
                        handleUpdateErrors({
                          ...proximityErrors,
                          state: true
                        })
                      } else {
                        handleUpdateErrors({
                          ...proximityErrors,
                          state: false
                        })
                      }
                    }}
                    onBlur={(e) => {
                      e.target.value === '' ?
                        handleUpdateErrors({
                          ...proximityErrors,
                          state: true
                        })
                        :
                        handleUpdateErrors({
                          ...proximityErrors,
                          state: false
                        })
                    }}
                    error={proximityErrors.state}
                    helperText={proximityErrors.state && t('requests.newRequest.form.btenForm.inputs.errors.required')}
                    disabled={loadingStatesList}
                    isLoading={loadingStatesList}
                  />
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <label className={classes.textBlue}>
                  {t('provisions.newProvision.requestData.location.withoutRCTownLabel')}
                </label>

                <Select
                  fullWidth
                  className={classes.inputAddress}
                  label={t('provisions.newProvision.requestData.location.withoutRCSelectTownLabel')}
                  value={provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.nombreMunicipio}
                  values={townsList}
                  onChange={(e) => {
                    handleChangeWithoutRCInput('town', e.target.value)
                    const value = e.target.value

                    setProximityData({
                      ...proximityData,
                      town: value
                    })

                    if (value === '') {
                      handleUpdateErrors({
                        ...proximityErrors,
                        town: true
                      })
                    } else {
                      handleUpdateErrors({
                        ...proximityErrors,
                        town: false
                      })
                    }
                  }}
                  onBlur={(e) => {
                    e.target.value === '' ?
                      handleUpdateErrors({
                        ...proximityErrors,
                        town: true
                      })
                      :
                      handleUpdateErrors({
                        ...proximityErrors,
                        town: false
                      })
                  }}
                  error={proximityErrors.town}
                  helperText={proximityErrors.town && t('requests.newRequest.form.btenForm.inputs.errors.required')}
                  disabled={(provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.nombreProvincia === '') || loadingTownsList}
                  isLoading={loadingTownsList}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <label className={classes.textBlue}>
                  {t('provisions.newProvision.requestData.location.withoutRCZipcodeLabel')}
                </label>

                <Input
                  value={provisions.cadastreData && provisions.cadastreData.zipcode}
                  className={classes.inputAddress}
                  onChange={(e) => {
                    handleChangeWithoutRCInput('zipcode', e.target.value)
                    const value = e.target.value

                    setProximityData({
                      ...proximityData,
                      zipcode: value
                    })

                    if (value === '') {
                      handleUpdateErrors({
                        ...proximityErrors,
                        zipcode: true
                      })
                    } else {
                      handleUpdateErrors({
                        ...proximityErrors,
                        zipcode: false
                      })
                    }
                  }}
                  onBlur={(e) => {
                    e.target.value === '' ?
                      handleUpdateErrors({
                        ...proximityErrors,
                        zipcode: true
                      })
                      :
                      handleUpdateErrors({
                        ...proximityErrors,
                        zipcode: false
                      })
                  }}
                  error={proximityErrors.zipcode}
                  helperText={proximityErrors.zipcode && t('requests.newRequest.form.btenForm.inputs.errors.required')}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6} />

              <Grid item xs={12} sm={6} md={6}>
                <label className={classes.textBlue}>
                  {t('provisions.newProvision.requestData.location.withoutRCStreetTypeLabel')}
                </label>

                <Select
                  fullWidth
                  codFiltering
                  className={classes.inputAddress}
                  label={t('provisions.newProvision.requestData.location.withoutRCSelectStreetTypeLabel')}
                  value={provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.locBienUrbano && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.direccion && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.direccion.tipoVia}
                  values={getTracksTypes()}
                  onChange={(e) => {
                    handleChangeWithoutRCInput('streetType', e.target.value)
                    const value = e.target.value

                    setProximityData({
                      ...proximityData,
                      streetType: value
                    })

                    if (value === '') {
                      handleUpdateErrors({
                        ...proximityErrors,
                        streetType: true
                      })
                    } else {
                      handleUpdateErrors({
                        ...proximityErrors,
                        streetType: false
                      })
                    }
                  }}
                  onBlur={(e) => {
                    e.target.value === '' ?
                      handleUpdateErrors({
                        ...proximityErrors,
                        streetType: true
                      })
                      :
                      handleUpdateErrors({
                        ...proximityErrors,
                        streetType: false
                      })
                  }}
                  error={proximityErrors.streetType}
                  helperText={proximityErrors.streetType && t('requests.newRequest.form.btenForm.inputs.errors.required')}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <label className={classes.textBlue}>
                  {t('provisions.newProvision.requestData.location.withoutRCStreetNameLabel')}
                </label>

                <Input
                  value={provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.locBienUrbano && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.direccion && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.direccion.nombreVia}
                  className={classes.inputAddress}
                  onChange={(e) => {
                    handleChangeWithoutRCInput('streetName', e.target.value)
                    const value = e.target.value

                    setProximityData({
                      ...proximityData,
                      streetName: value
                    })

                    if (value === '') {
                      handleUpdateErrors({
                        ...proximityErrors,
                        streetName: true
                      })
                    } else {
                      handleUpdateErrors({
                        ...proximityErrors,
                        streetName: false
                      })
                    }

                  }}
                  onBlur={(e) => {
                    e.target.value === '' ?
                      handleUpdateErrors({
                        ...proximityErrors,
                        streetName: true
                      })
                      :
                      handleUpdateErrors({
                        ...proximityErrors,
                        streetName: false
                      })
                  }}
                  error={proximityErrors.streetName}
                  helperText={proximityErrors.streetName && t('requests.newRequest.form.btenForm.inputs.errors.required')}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <label className={classes.textBlue}>
                  {t('provisions.newProvision.requestData.location.withoutRCNumberLabel')}
                </label>

                <Input
                  value={provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.locBienUrbano && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.direccion && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.direccion.numero1Policia}
                  className={classes.inputAddress}
                  onChange={(e) => {
                    handleChangeWithoutRCInput('number', e.target.value)
                    const value = e.target.value

                    setProximityData({
                      ...proximityData,
                      number: value
                    })

                    if (value === '') {
                      handleUpdateErrors({
                        ...proximityErrors,
                        number: true
                      })
                    } else {
                      handleUpdateErrors({
                        ...proximityErrors,
                        number: false
                      })
                    }
                  }}
                  onBlur={(e) => {
                    e.target.value === '' ?
                      handleUpdateErrors({
                        ...proximityErrors,
                        number: true
                      })
                      :
                      handleUpdateErrors({
                        ...proximityErrors,
                        number: false
                      })
                  }}
                  error={proximityErrors.number}
                  helperText={proximityErrors.number && t('requests.newRequest.form.btenForm.inputs.errors.required')}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6} />

              <Grid item xs={12} sm={4} md={4}>
                <label className={classes.textBlue}>
                  {t('provisions.newProvision.requestData.location.withoutRCStairLabel')}
                </label>

                <Input
                  value={provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.locBienUrbano && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.direccion && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.locInterna.escalera}
                  className={classes.inputAddress}
                  onChange={(e) => handleChangeWithoutRCInput('stair', e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4}>
                <label className={classes.textBlue}>
                  {t('provisions.newProvision.requestData.location.withoutRCFloorLabel')}
                </label>

                <Input
                  value={provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.locBienUrbano && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.direccion && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.locInterna.planta}
                  className={classes.inputAddress}
                  onChange={(e) => handleChangeWithoutRCInput('floor', e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4}>
                <label className={classes.textBlue}>
                  {t('provisions.newProvision.requestData.location.withoutRCDoorLabel')}
                </label>

                <Input
                  value={provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.locBienUrbano && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.direccion && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.locInterna.puerta}
                  className={classes.inputAddress}
                  onChange={(e) => handleChangeWithoutRCInput('door', e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        :
        <>
          { // BUSCAR POR DIRECCIÓN
            showAddress === 0 &&
            <Grid container className={classes.containerLocation}>
              <Grid item className={classes.inputContainer} xs={11} sm={7} md={7}>
                <Input
                  className={classes.inputSearch}
                  label={t('provisions.newProvision.requestData.location.address')}
                  onChange={handleChangeSearchAddress}
                  onKeyPress={handleKeyPressAddress}
                />
              </Grid>

              <Grid item className={classes.locationButton} xs={11} sm='auto' md='auto'>
                <Button
                  text={t('common.buttons.search')}
                  color='primary'
                  size='medium'
                  variant='contained'
                  //startIcon={MagnifyingGlassIcon}
                  onClick={handleSearchAddress}
                  disabled={addressValue === ''}
                />
              </Grid>
            </Grid>
          }

          { // MAPA Y OPCIONES
            showMap === 1 &&
            <Grid container className={classes.containerLocation} justifyContent='center'>
              <Grid item xs={11} sm={9} md={9} className={classes.containerMap}>
                <Map
                  className={classes.map}
                  viewProperties={{
                    center: [mapCoordinates.x, mapCoordinates.y],
                    zoom: 17
                  }}
                  loaderOptions={{ css: true }}
                  onClick={e => handleClickMap(e)}
                >
                  <Pointer x={isLoading ? '0' : coordinates.x} y={isLoading ? '0' : coordinates.y} />
                </Map>
              </Grid>
            </Grid>
          }

          { //REFERENCIA CATASTRAL
            showAddress === 1 &&
            <Grid container className={classes.container} justifyContent='center'>
              <Grid container className={classes.containerLocation}>
                <Grid item xs={11} sm={5} md={4}>
                  <Input
                    className={classes.inputSearch}
                    label={t('provisions.newProvision.requestData.location.labelCadastralReference')}
                    onChange={handleChangeSearcCadastralReference}
                  />
                </Grid>

                <Grid item className={classes.locationButton}>
                  <Button
                    //startIcon={MagnifyingGlassIcon}
                    text={t('common.buttons.continue')}
                    color='primary'
                    size='medium'
                    variant='contained'
                    onClick={handleSearchCadastralReference}
                    disabled={!validateCadastralReference(cadastralValue)}
                  />
                </Grid>
              </Grid>
            </Grid>
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
                            onChange={(e) => {
                              const value = e.target.value

                              setProximityData({
                                ...proximityData,
                                address: value
                              })

                              if (value === '') {
                                handleUpdateErrors({
                                  ...proximityErrors,
                                  address: true
                                })
                              } else {
                                handleUpdateErrors({
                                  ...proximityErrors,
                                  address: false
                                })
                              }
                            }}
                            onBlur={(e) => {
                              e.target.value === '' ?
                                handleUpdateErrors({
                                  ...proximityErrors,
                                  address: true
                                })
                                :
                                handleUpdateErrors({
                                  ...proximityErrors,
                                  address: false
                                })
                            }}
                          />
                          :
                          <Input
                            value={(stateList[selectedState] && stateList[selectedState].domicilioTributario && stateList[selectedState].domicilioTributario.locBienUrbano && stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana && stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion && stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.numero1Policia && stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.tipoVia && stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.nombreVia) ? (stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.tipoVia + ' ' + stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.nombreVia + ' ' + stateList[selectedState].domicilioTributario.locBienUrbano.locUrbana.direccion.numero1Policia) : ''}
                            className={classes.inputAddress}
                            InputProps={{
                              readOnly: true
                            }}
                            fullWidth
                            onChange={(e) => {
                              const value = e.target.value

                              setProximityData({
                                ...proximityData,
                                address: value
                              })

                              if (value === '') {
                                handleUpdateErrors({
                                  ...proximityErrors,
                                  address: true
                                })
                              } else {
                                handleUpdateErrors({
                                  ...proximityErrors,
                                  address: false
                                })
                              }
                            }}
                            onBlur={(e) => {
                              e.target.value === '' ?
                                handleUpdateErrors({
                                  ...proximityErrors,
                                  address: true
                                })
                                :
                                handleUpdateErrors({
                                  ...proximityErrors,
                                  address: false
                                })
                            }}
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
                          onChange={(e) => {
                            const value = e.target.value

                            setProximityData({
                              ...proximityData,
                              property: value
                            })

                            if (value === '') {
                              handleUpdateErrors({
                                ...proximityErrors,
                                property: true
                              })
                            } else {
                              handleUpdateErrors({
                                ...proximityErrors,
                                property: false
                              })
                            }
                          }}
                          onBlur={(e) => {
                            e.target.value === '' ?
                              handleUpdateErrors({
                                ...proximityErrors,
                                property: true
                              })
                              :
                              handleUpdateErrors({
                                ...proximityErrors,
                                property: false
                              })
                          }}
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
                          onChange={(e) => {
                            const value = e.target.value

                            setProximityData({
                              ...proximityData,
                              property: value
                            })

                            if (value === '') {
                              handleUpdateErrors({
                                ...proximityErrors,
                                property: true
                              })
                            } else {
                              handleUpdateErrors({
                                ...proximityErrors,
                                property: false
                              })
                            }
                          }}
                          onBlur={(e) => {
                            e.target.value === '' ?
                              handleUpdateErrors({
                                ...proximityErrors,
                                property: true
                              })
                              :
                              handleUpdateErrors({
                                ...proximityErrors,
                                property: false
                              })
                          }}
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
                      onChange={(e) => {
                        const value = e.target.value

                        setProximityData({
                          ...proximityData,
                          cadastralRef: value
                        })

                        if (value === '') {
                          handleUpdateErrors({
                            ...proximityErrors,
                            cadastralRef: true
                          })
                        } else {
                          handleUpdateErrors({
                            ...proximityErrors,
                            cadastralRef: false
                          })
                        }
                      }}
                      onBlur={(e) => {
                        e.target.value === '' ?
                          handleUpdateErrors({
                            ...proximityErrors,
                            cadastralRef: true
                          })
                          :
                          handleUpdateErrors({
                            ...proximityErrors,
                            cadastralRef: false
                          })
                      }}
                    />
                  </Grid>
                  {
                    isRustic &&
                    <Grid item xs={12} sm={6} md={6}>
                      <label className={classes.textBlue}>{t('provisions.newProvision.requestData.location.zipcode')}</label>
                      <Input
                        value={provisions.cadastreData.zipcode}
                        className={classes.inputAddress}
                        fullWidth
                        onChange={(e) => {
                          handleChangeZipCode(e.target.value)
                          const value = e.target.value

                          setProximityData({
                            ...proximityData,
                            zipcodeRustic: value
                          })

                          if (value === '') {
                            handleUpdateErrors({
                              ...proximityErrors,
                              zipcode: true
                            })
                          } else {
                            handleUpdateErrors({
                              ...proximityErrors,
                              zipcode: false
                            })
                          }
                        }}
                      />
                    </Grid>
                  }
                </Grid>
              </Grid>
            </Grid>
          }
        </>
      }
      {/* Titular de las instalaciones */}
      <div className={classes.descriptionMargin}>
        {t('requests.newRequest.form.btenForm.titles.title8')}
      </div>

      <Grid container className={classes.inputs} spacing={3}>

        {/* Fecha inicio */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field22')}</div>
            </Grid>

            <DatepickerV2
              selectedDate={auxStartDate}
              handleChange={setAuxStartDate}
              size='s'
              minDate={minDate}
            />
          </Grid>
        </Grid>

        {/* Fecha fin */}
        {auxStartDate ?
          <Grid item md={6} sm={12} xs={12}>
            <Grid container direction='column'>
              <Grid item>
                <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field23')}</div>
              </Grid>

              <DatepickerV2
                selectedDate={auxEndDate}
                handleChange={setAuxEndDate}
                size='s'
                minDate={auxStartDate && new Date(auxStartDate)}
                maxDate={auxStartDate && getFifteenDaysFromDate(auxStartDate)}
              />
            </Grid>
          </Grid>
          :
          <Grid item md={6} sm={12} xs={12} />
        }

        {/* Hora inicio */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field24')}</div>
            </Grid>

            <Input
              fullWidth
              label={'00:00 (hh:mm)'}
              value={startTime}
              onChange={(e) => {
                const value = e.target.value

                setStartTime(value)

                if (validateTime(value)) {
                  setProximityData({
                    ...proximityData,
                    startTime: value + ':00'  // Añadimos los segundos
                  })

                  handleUpdateErrors({
                    ...proximityErrors,
                    startTime: false
                  })
                } else {
                  setProximityData({
                    ...proximityData,
                    startTime: ''
                  })

                  handleUpdateErrors({
                    ...proximityErrors,
                    startTime: true
                  })
                }
              }}
              onBlur={(e) => {
                (e.target.value === '' || !validateTime(e.target.value)) ?
                  handleUpdateErrors({
                    ...proximityErrors,
                    startTime: true
                  })
                  :
                  handleUpdateErrors({
                    ...proximityErrors,
                    startTime: false
                  })
              }}
              error={proximityErrors.startTime}
              helperText={proximityErrors.startTime &&
                (startTime === '' ?
                  t('requests.newRequest.form.btenForm.inputs.errors.required')
                  :
                  t('requests.newRequest.form.btenForm.inputs.errors.invalidTime'))
              }
            />
          </Grid>
        </Grid>

        {/* Hora fin */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.btenForm.inputs.labels.field25')}</div>
            </Grid>

            <Input
              fullWidth
              label={'00:00 (hh:mm)'}
              value={endTime}
              onChange={(e) => {
                const value = e.target.value

                setEndTime(value)

                if (validateTime(value)) {
                  setProximityData({
                    ...proximityData,
                    endTime: value + ':00'  // Añadimos los segundos
                  })

                  handleUpdateErrors({
                    ...proximityErrors,
                    endTime: false
                  })
                } else {
                  setProximityData({
                    ...proximityData,
                    endTime: ''
                  })

                  handleUpdateErrors({
                    ...proximityErrors,
                    endTime: true
                  })
                }
              }}
              onBlur={(e) => {
                (e.target.value === '' || !validateTime(e.target.value)) ?
                  handleUpdateErrors({
                    ...proximityErrors,
                    endTime: true
                  })
                  :
                  handleUpdateErrors({
                    ...proximityErrors,
                    endTime: false
                  })
              }}
              error={proximityErrors.endTime}
              helperText={proximityErrors.endTime &&
                (endTime === '' ?
                  t('requests.newRequest.form.btenForm.inputs.errors.required')
                  :
                  t('requests.newRequest.form.btenForm.inputs.errors.invalidTime'))
              }
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  )

}

export default ProximityForm