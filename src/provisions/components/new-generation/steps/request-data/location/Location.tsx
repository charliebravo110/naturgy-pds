import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { Map } from '@esri/react-arcgis'

import proj4 from 'proj4'

import LocationModal from './location-modal/LocationModal'
import Button from '../../../../../../common/components/button/Button'
import Spinner from '../../../../../../common/components/spinner/Spinner'
import Input from '../../../../../../common/components/input/Input'
import Pointer from '../../../../../../common/components/pointer/Pointer'
import Select from '../../../../../../common/components/select/Select'
import Checkbox from '../../../../../../common/components/checkbox/Checkbox'
import RepeatedDialog from '../../../dialogs/RepeatedDialog'

import AlertIcon from '../../../../../../assets/icons/aviso_alerta_pop_up.svg'

import { fixIneCodeTownLength, noAccents, getTracksTypes } from '../../../../../../common/lib/FormatLib'
import { validateCadastralReference } from '../../../../../../common/lib/ValidationLib'
import { hideError, showError } from '../../../../../../common/store/actions/ErrorActions'
import {
  setBuildingCoordinates,
  setCadastreDataCoordinates,
  setCadastreDataZipcode,
  setCadastreDataItem,
  resetCadastreData,
  setNewGeneration
} from '../../../../../store/actions/ProvisionsActions'
import { thunkGetCoverage, thunkGetDossier } from '../../../../../store/actions/ProvisionsThunkActions'

import useStyles from './Location.styles'
import Dialog from '../../../../../../sign-up/components/dialog/Dialog'

// LCS: Importa la función - Wave 3
import { sendGAEvent, getTypologySelfConsumption, removeAccents,removeEmails } from '../../../../../../core/utils/gtm'

const Location = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const cadastreUrl = process.env.REACT_APP_CADSTRE_ENDPOINT
  const provisions = useSelector((state: any) => state.provisions)
  const provisionsList = useSelector((state: any) => state.provisions.provisionsList)

  // Definicion de los husos 29 y 30
  proj4.defs([
    ['EPSG:25829', '+proj=utm +zone=29 +ellps=GRS80 +units=m +no_defs'],
    ['EPSG:25830', '+proj=utm +zone=30 +ellps=GRS80 +units=m +no_defs']
  ])

  const {
    setActiveComponent,
    setRequestDataCompleted
  } = props

  const [addressValue, setAddressValue] = useState('')
  const [cadastralValue, setCadastralValue] = useState('')
  const [showingDialog, setShowingDialog] = useState(false)

  const [showMap, setShowMap] = useState(0)
  const [showAddress, setShowAddress] = useState(0)
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const [mapCoordinates, setMapCoordinates] = useState({
    x: 0,
    y: 0
  })

  const [stateList, setStateList] = useState([] as any)
  const [selectedState, setSelectedState] = useState(0)

  const [selectedAddress, setSelectedAddress] = useState('')
  const [selectedCadastralReference, setSelectedCadastralReference] = useState('')
  const [selectedPostalCode, setSelectedPostalCode] = useState('')

  const [isRustic, setIsRustic] = useState(false)

  // inicio "by-pass de la referencia catastral"
  const [withoutRC, setWithoutRC] = useState(false)

  const [statesList, setStatesList] = useState([] as any)
  const [townsList, setTownsList] = useState([] as any)
  const [loadingStatesList, setLoadingStatesList] = useState(false)
  const [loadingTownsList, setLoadingTownsList] = useState(false)

  const [ coordinateXInputError, setCoordinateXInputError ] = useState(false)
  const [ coordinateYInputError, setCoordinateYInputError ] = useState(false)

  const [ repeatedDialogOpen, setRepeatedDialogOpen] = useState(false)
  const [ repeatedDialogShown, setRepeatedDialogShown] = useState(false)
  const [ cadastreAssociated, setCadastreAssociated] = useState([])
  const [ asyncCallsCompleted, setAsyncCallsCompleted] = useState(false)

  let dossiersOpened = 0
  let dossiersClossed = 0

  useEffect(() => {
    if (provisionsList.length > 0) {
      const updatedCadastreAssociated = [...cadastreAssociated]
  
      provisionsList.forEach((item, index) => {
        if (item.idDossierType === 'DOSTYP002') {
          ++dossiersOpened
          dispatch(thunkGetDossier(item.dossierCod, (response) => {
            if (response && response.dossier && response.dossier.cadastralRef) {
              updatedCadastreAssociated.push(response.dossier.cadastralRef)
            }
            ++dossiersClossed
            if (dossiersOpened === dossiersClossed) {
              setAsyncCallsCompleted(true)
            }
          }))
        } else {
          setAsyncCallsCompleted(true)
        }
      })
      setCadastreAssociated(updatedCadastreAssociated)
    } else {
      setAsyncCallsCompleted(true)
    }
  }, [provisionsList])

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

  const handleCheckWithoutRCSubmit = () => {
    let isDisabled = false

    let firstObject = provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario
    let secondObject = provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.locBienUrbano && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.direccion

    if (firstObject && secondObject) {
      if (
        Object.keys(firstObject).filter((key) => firstObject[key] === '').length > 0 ||
        Object.keys(secondObject).filter((key) => secondObject[key] === '').length > 0 ||
        (
          provisions.cadastreData.zipcode === '' ||
          isNaN(provisions.cadastreData.zipcode) ||
          provisions.cadastreData.zipcode.length !== 5 || 
          inputUtmCoordinates.x === '' || 
          inputUtmCoordinates.y === ''
        )
      ) {
        isDisabled = true
      }
    }
    return isDisabled
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
            reactComponent: 'new-generation/Location.tsx - useEffect',
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
            reactComponent: 'new-generation/Location.tsx - useEffect',
            apiUrl: 'post /catastro',
            codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
          }
        });
      }
    }
    // eslint-disable-next-line
  }, [(provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.nombreProvincia)])
  // fin "by-pass de la referencia catastral"

  const handleChangeSearchAddress = (e) => {
    const value = e.target.value

    setAddressValue(value)
  }

  const inputCoordinateXValidator = (coordinateX) => {
    let isInvalid = true    
    
    if(coordinateX.toString() !== '' && !isNaN(coordinateX)) {
      if (coordinateX % 1 === 0) {
        if (coordinateX > 0 && coordinateX.length <= 6) {
          isInvalid = false
        } 
      } else {
        let naturalNumber = ''
        let decimals = ''

        if (coordinateX.toString().includes(',')) {
          naturalNumber = (coordinateX.split(','))[0]
          decimals = (coordinateX.split(','))[1]
        } else if (coordinateX.toString().includes('.')) {
          naturalNumber = (coordinateX.split('.'))[0]
          decimals = (coordinateX.split('.'))[1]
        }

        if (coordinateX > 0 && decimals && decimals !== '' && (decimals.toString().length === 1 || decimals.toString().length === 2) && naturalNumber && naturalNumber !== '') {
          isInvalid = false
        }
      }
    }    

    return isInvalid
  }

  const inputCoordinateYValidator = (coordinateY) => {
    let isInvalid = true
    
    if(coordinateY.toString() !== '' && !isNaN(coordinateY)) {
      if (coordinateY % 1 === 0) {
        if (coordinateY > 0 && coordinateY.length <= 7) {
          isInvalid = false
        } 
      } else {
        let naturalNumber = ''
        let decimals = ''

        if (coordinateY.toString().includes(',')) {
          naturalNumber = (coordinateY.split(','))[0]
          decimals = (coordinateY.split(','))[1]
        } else if (coordinateY.toString().includes('.')) {
          naturalNumber = (coordinateY.split('.'))[0]
          decimals = (coordinateY.split('.'))[1]
        }

        if (coordinateY > 0 && decimals && decimals !== '' && (decimals.toString().length === 1 || decimals.toString().length === 2) && naturalNumber && naturalNumber !== '') {
          isInvalid = false
        }
      }
    }

    return isInvalid
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

  const handleChangeSearcCadastralReference = (e) => {
    const value = e.target.value

    setCadastralValue(value.toUpperCase())
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
          const coordX = (responseJson.coordenadas[0].coordX).toString()
          const coordY = (responseJson.coordenadas[0].coordY).toString()
  
          const naturalNumbersCoordX = coordX.split('.')[0]
          const naturalNumbersCoordY = coordY.split('.')[0]
          const decimalsCoordX = coordX.split('.')[1]
          const decimalsCoordY = coordY.split('.')[1]
  
          setUtmCoordinates({ x: coordX, y: coordY })
          setInputUtmCoordinates({
            // Si los decimales de las coordenadas están a cero, mandamos las coordenadas sin decimales
            x: decimalsCoordX === '00' ? naturalNumbersCoordX : coordX,
            y: decimalsCoordY === '00' ? naturalNumbersCoordY : coordY
          }) 
  
          // Rellenamos los inputs de coordenadas con las coordenadas UTM del punto seleccionado en el mapa
          if (responseJson.coordenadas[0].srs && showMap) {
            const srs = responseJson.coordenadas[0].srs.split(':')
            let huso = srs[1]
  
            let src = new proj4.Proj('EPSG:4326')
            let dest = new proj4.Proj('EPSG:' + huso)
  
            let point = new proj4.toPoint([parseFloat(coordinates.x), parseFloat(coordinates.y)])
  
            let pointUtm = proj4.transform(src, dest, point)
  
            let pointUTMX = pointUtm.x && (pointUtm.x.toFixed(2)).toString()
            let pointUTMY = pointUtm.y && (pointUtm.y.toFixed(2)).toString()
  
            const naturalNumbersX = pointUTMX.split('.')[0]
            const naturalNumbersY = pointUTMY.split('.')[0]
            const decimalsX = pointUTMX.split('.')[1]
            const decimalsY = pointUTMY.split('.')[1]
            
            setInputUtmCoordinates({
              // Si los decimales de las coordenadas están a cero, mandamos las coordenadas sin decimales
              x: decimalsX === '00' ? naturalNumbersX : pointUTMX,
              y: decimalsY === '00' ? naturalNumbersY : pointUTMY
            }) 
          }
  
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
          reactComponent: 'new-generation/Location.tsx - checkIfHuso30',
          apiUrl: 'post /catastro',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    }
  }

  const handleClickReturn = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    let request_type = sessionStorage.getItem('request_type')
    if (request_type === 'quiero una nueva conexion de generacion'){
      let auxTypology = getTypologySelfConsumption(provisions.dossierSubtype)
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: 'localiza / ubica tu solicitud',
        click_text: 'volver',
        element_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        request_type: request_type,
        request_step_name: 'datos de la solicitud',
        browsing_type: sessionStorage.getItem('browsing_type'),
        request_subtype: removeAccents(auxTypology)
      })
    }
    setActiveComponent(2)
  }

  const handleClickContinue = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    let request_type = sessionStorage.getItem('request_type')
    if (request_type === 'quiero una nueva conexion de generacion'){
        let auxTypology = getTypologySelfConsumption(provisions.dossierSubtype)
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: 'localiza / ubica tu solicitud',
        click_text: 'continuar',
        element_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        request_type: request_type,
        request_step_name: 'datos de la solicitud',
        browsing_type: sessionStorage.getItem('browsing_type'),
        request_subtype: removeAccents(auxTypology)
      })
    }
    if (selectedPostalCode !== '' || withoutRC) {
      setIsLoading(true)

      let type = (provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.tipo) ? provisions.cadastreData.item.tipo : 'UR'

      if (type === 'UR' || withoutRC) {
        // urbano >>> zipCode / KO
        let zipCode = provisions.cadastreData && provisions.cadastreData.zipcode

        // Añadimos este condicional ya que a raíz de un evolutivo, el campo zipCode ya no es obligatorio informarlo y puede que esté vacío
        if (cadastreAssociated.includes(selectedCadastralReference) && !repeatedDialogShown) {
          setRepeatedDialogOpen(true)
          setRepeatedDialogShown(true)
          setIsLoading(false)
        } else if (zipCode && zipCode !== ''){
          dispatch(thunkGetCoverage(zipCode, null, (response) => { // zipCode
            setIsLoading(false)

            if (response && response.isCoverage) {
              window.scrollTo({
                top: 0,
                left: 0
              })

              setRequestDataCompleted(true)
            } else {
              dispatch(showError('1001', 'coverage')) // KO
            }
          }))
        } else {
          setIsLoading(false)
          setRequestDataCompleted(true)
        }
      } else {

        if (cadastreAssociated.includes(selectedCadastralReference) && !repeatedDialogShown) {
          setRepeatedDialogOpen(true)
          setRepeatedDialogShown(true)
          setIsLoading(false)
        } else {
          // rustico >>> ineCode / KO
          let ineCodeProvince = provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.codProvinciaINE
          let ineCodeTown = fixIneCodeTownLength(provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.codMunicipioINE)

          let ineCode = ineCodeProvince + '' + ineCodeTown

          dispatch(thunkGetCoverage(null, ineCode, (response) => { // ineCode
            setIsLoading(false)

            if (response && response.isCoverage) {
              window.scrollTo({
                top: 0,
                left: 0
              })

              setRequestDataCompleted(true)
            } else {
              dispatch(showError('1001', 'coverage')) // KO
            }
          }))
        }
      }
    }
    dispatch(setNewGeneration({repeatedCadastre: cadastreAssociated.includes(selectedCadastralReference)}))
  }

  const handleKeyPressAddress = (event) => {
    if (event.key === 'Enter') {
      handleSearchAddress()
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
          reactComponent: 'new-generation/Location.tsx - searchByCadastralReference',
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

  const [ inputUtmCoordinates, setInputUtmCoordinates ] = useState({
    x: '',
    y: ''
  } as any)

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

  const handleChangeZipCode = (zipcode) => {
    dispatch(setCadastreDataZipcode(zipcode))
  }

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
            reactComponent: 'new-generation/Location.tsx - useEffect',
            apiUrl: 'post /catastro',
            codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
          }
        });
      }
    }
    // eslint-disable-next-line
  }, [coordinates])

  // Mandamos las coordenadas UTM indicadas por el usuario a ZEUS
  useEffect(() => {
    dispatch(setCadastreDataCoordinates({
      x: inputUtmCoordinates.x,
      y: inputUtmCoordinates.y
    }))
    // eslint-disable-next-line
  }, [inputUtmCoordinates])

  const handleCloseDialog = () => {
    setShowingDialog(false)
  }

  useEffect(() => {
    setInputUtmCoordinates({x: '', y: ''})
    setCoordinateXInputError(false)
    setCoordinateYInputError(false)
  }, [showAddress, withoutRC])

  return (
    <>
      {isLoading &&
        <Spinner fixed={true} />
      }

      <Dialog
        showingDialog={showingDialog}
        closeDialog={handleCloseDialog}
      />

      <RepeatedDialog
        open={repeatedDialogOpen}
        closeFunction={() => setRepeatedDialogOpen(false)}
      />

      <Grid container className={classes.block} justifyContent='center'>

        <LocationModal
          isLocationModalVisible={isLocationModalVisible}
          closeDialog={handleCloseLocationDialog}
          handleAcceptLocationDialog={handleAcceptLocationDialog}
          stateList={stateList}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          isRustic={isRustic}
        />

        <Grid container className={classes.container} justifyContent='center'>
          <Grid container justifyContent='center'>
            <Grid item xs={11} sm={5} md={5}>
              <div className={classes.title}>{t('provisions.newProvision.requestData.location.title')}</div>
              <Grid justifyContent='center'>
                <Grid className={classes.text}>
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
                      onChange={(e) => handleChangeWithoutRCInput('state', e.target.value)}
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
                    onChange={(e) => handleChangeWithoutRCInput('town', e.target.value)}
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
                    onChange={(e) => handleChangeWithoutRCInput('zipcode', e.target.value)}
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
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <label className={classes.textBlue}>
                    {t('provisions.newProvision.requestData.location.withoutRCStreetNameLabel')}
                  </label>

                  <Input
                    value={provisions.cadastreData && provisions.cadastreData.item && provisions.cadastreData.item.domicilioTributario && provisions.cadastreData.item.domicilioTributario.locBienUrbano && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.direccion && provisions.cadastreData.item.domicilioTributario.locBienUrbano.locUrbana.direccion.nombreVia}
                    className={classes.inputAddress}
                    onChange={(e) => handleChangeWithoutRCInput('streetName', e.target.value)}
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
                    onChange={(e) => handleChangeWithoutRCInput('number', e.target.value)}
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

                <Grid item xs={12} sm={12} md={12}>
                  <label className={classes.coordinatesNote}>{t('provisions.newProvision.requestData.location.coordinatesNote')}</label>
                  <label className={classes.coordinatesSubNote}>{t('provisions.newProvision.requestData.location.coordinatesSubNote')}</label>
                </Grid>

                <Grid className={classes.marginBottom} item xs={12} sm={6} md={6}>
                  <label className={classes.textBlue}>{t('provisions.newProvision.requestData.location.coordinateX') + ' *'}</label>

                  <Input
                    className={classes.inputAddress}
                    value={inputUtmCoordinates.x}                          
                    InputProps={{
                      placeholder: '123456.12',
                      type: 'string'
                    }}
                    fullWidth
                    onChange={(e) => {
                      const value = e.target.value      
                      setInputUtmCoordinates({x: value, y: inputUtmCoordinates.y})
                    }}
                    onBlur={(e) => {
                      const value = e.target.value
                      setCoordinateXInputError(inputCoordinateXValidator(value) ? true : false)
                    }}
                    error={coordinateXInputError}
                    helperText={coordinateXInputError && t('provisions.newProvision.requestData.location.errors.coordinate')}
                  />
                </Grid>

                <Grid className={classes.marginBottom} item xs={12} sm={6} md={6}>
                  <label className={classes.textBlue}>{t('provisions.newProvision.requestData.location.coordinateY') + ' *'}</label>

                  <Input
                    className={classes.inputAddress}
                    value={inputUtmCoordinates.y}                            
                    InputProps={{
                      placeholder: '1234567.12',
                      type: 'string'
                    }}
                    fullWidth
                    onChange={(e) => {
                      const value = e.target.value      
                      setInputUtmCoordinates({x: inputUtmCoordinates.x, y: value})
                    }}
                    onBlur={(e) => {
                      const value = e.target.value
                      setCoordinateYInputError(inputCoordinateYValidator(value) ? true : false)
                    }}
                    error={coordinateYInputError}
                    helperText={coordinateYInputError && t('provisions.newProvision.requestData.location.errors.coordinate')}
                  />
                </Grid>

              </Grid>
            </Grid>
          </Grid>
          :
          <>
            {/* BUSCAR POR DIRECCIÓN */}

            {showAddress === 0 &&
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

            {/* MAPA Y OPCIONES */}

            {showMap === 1 &&
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

            {/* REFERENCIA CATASTRAL */}

            {showAddress === 1 &&
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

            {(provisions.cadastreData && Object.keys(provisions.cadastreData.item).length > 0 && selectedAddress !== ''
              && selectedCadastralReference !== '' && selectedPostalCode !== '') &&

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
                        {isRustic ?
                          t('provisions.newProvision.requestData.location.labelPolygon')
                          :
                          t('provisions.newProvision.requestData.location.labelAddress')
                        }
                      </label>

                      <div className={classes.selectContainer}>
                        {isRustic ?
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

                        <Grid item xs={12} sm={12} md={12}>
                          <label className={classes.coordinatesNote}>{t('provisions.newProvision.requestData.location.coordinatesNote')}</label>
                          <label className={classes.coordinatesSubNote}>{t('provisions.newProvision.requestData.location.coordinatesSubNote')}</label>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6}>
                          <label className={classes.textBlue}>{t('provisions.newProvision.requestData.location.coordinateX') + ' *'}</label>

                          <Input
                            className={classes.inputAddress}
                            value={inputUtmCoordinates.x}                          
                            InputProps={{
                              placeholder: '123456.12',
                              type: 'string'
                            }}
                            fullWidth
                            onChange={(e) => {
                              const value = e.target.value      
                              setInputUtmCoordinates({x: value, y: inputUtmCoordinates.y})
                            }}
                            onBlur={(e) => {
                              const value = e.target.value
                              setCoordinateXInputError(inputCoordinateXValidator(value) ? true : false)
                            }}
                            error={coordinateXInputError}
                            helperText={coordinateXInputError && t('provisions.newProvision.requestData.location.errors.coordinate')}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={6}>
                          <label className={classes.textBlue}>{t('provisions.newProvision.requestData.location.coordinateY') + ' *'}</label>

                          <Input
                            className={classes.inputAddress}
                            value={inputUtmCoordinates.y}                            
                            InputProps={{
                              placeholder: '1234567.12',
                              type: 'string'
                            }}
                            fullWidth
                            onChange={(e) => {
                              const value = e.target.value      
                              setInputUtmCoordinates({x: inputUtmCoordinates.x, y: value})
                            }}
                            onBlur={(e) => {
                              const value = e.target.value
                              setCoordinateYInputError(inputCoordinateYValidator(value) ? true : false)
                            }}
                            error={coordinateYInputError}
                            helperText={coordinateYInputError && t('provisions.newProvision.requestData.location.errors.coordinate')}
                          />
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

                      {isRustic ?
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

                    {isRustic &&
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
          </>
        }

        <Grid container className={classes.button}>
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
            disabled={
              withoutRC ?
                (handleCheckWithoutRCSubmit() || inputCoordinateXValidator(inputUtmCoordinates.x) || inputCoordinateYValidator(inputUtmCoordinates.y) || !asyncCallsCompleted )
              :
                (!stateList[selectedState] || selectedCadastralReference === '' || selectedPostalCode === '' || Object.keys(provisions.cadastreData.item).length === 0 || inputCoordinateXValidator(inputUtmCoordinates.x) || inputCoordinateYValidator(inputUtmCoordinates.y) || !asyncCallsCompleted)
            }
            onClick={handleClickContinue}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default Location
