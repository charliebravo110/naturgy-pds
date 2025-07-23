import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import proj4 from 'proj4'

import Grid from '@material-ui/core/Grid'

import { Map, Scene } from '@esri/react-arcgis'

import Button from '../../../../../common/components/button/Button'
import Spinner from '../../../../../common/components/spinner/Spinner'
import Input from '../../../../../common/components/input/Input'
import Pointer from '../../../../../common/components/pointer/Pointer'

import MagnifyingGlassIcon from '../../../../../assets/icons/lupa_buscador_blanca.svg'

import { hideError } from '../../../../../common/store/actions/ErrorActions'
import { setCurrentProvision } from '../../../../store/actions/ProvisionsActions'
import { thunkUpdateDossier } from '../../../../store/actions/ProvisionsThunkActions'

import useStyles from './Location.styles'

// LCS: Importar la función
import { sendGAEvent } from '../../../../../core/utils/gtm'

const Location = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const cadastreUrl = process.env.REACT_APP_CADSTRE_ENDPOINT

  // Definicion de los husos 29 y 30
  proj4.defs([
    ['EPSG:25829', '+proj=utm +zone=29 +ellps=GRS80 +units=m +no_defs'],
    ['EPSG:25830', '+proj=utm +zone=30 +ellps=GRS80 +units=m +no_defs']
  ])

  const {
    setNewDocumentsRecieved,
    setPopup
  } = props

  const user = useSelector((state: any) => state.user.profile)
  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)
  let referenciaCatastral = useSelector((state: any) => state.provisions.currentProvision.cadastralRef)
  const buildingCoordinates = useSelector((state: any) => state.provisions.buildingCoordinates)

  const [ isLoading, setIsLoading ] = useState(false)
  const [defaultCoordinates, setDefaultCoordinates] = useState<any>()
  const [ satelliteMap, setSatelliteMap ] = useState(false)

  useEffect(() => {
    if (buildingCoordinates && buildingCoordinates.x && buildingCoordinates.y) {
      setDefaultCoordinates(buildingCoordinates)
    } else {
      setIsLoading(true)

      let referenciaCatastralAux = referenciaCatastral.substring(0, referenciaCatastral.length - 6)

      try {
        // LCS: Registrar el tiempo inicial
        const startTime = performance.now();

        // Obtener coordenadas geográficas por referencia catastral
        fetch(cadastreUrl, {
          method: 'POST',
          body: JSON.stringify({
            'GNFHeader': {
              'IDServicio': 'CATASTRO',
              'IDOperacion': 'Consulta_CPMRC',
              'IDCliente': 'ZEUS',
              'IDPeticion': ''
            },
            'sistemaCoordenadas': 'EPSG:4258',
            'refCatastral': referenciaCatastralAux
          })
        }).then(async (response) => {
          const data = await response.json()

          if (data && data.coordenadas.length > 0) {
            setDefaultCoordinates({
              x: data.coordenadas[0].coordX,
              y: data.coordenadas[0].coordY
            })
          }

          setIsLoading(false)
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
            reactComponent: 'documentation/Location.tsx - useEffect',
            apiUrl: 'post /catastro',
            codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
          }
        });
      }
    }
  // eslint-disable-next-line
  }, [])

  const [ addressValue, setAddressValue ] = useState('')

  const [ showMap, setShowMap ] = useState(0)

  const [ mapCoordinates, setMapCoordinates ] = useState({
    x: 0,
    y: 0
  })

  useEffect(() => {
    if (defaultCoordinates) {
      setShowMap(1)
      setMapCoordinates(defaultCoordinates)
    }
  }, [defaultCoordinates])

  const handleChangeSearchAddress = (e) => {
    const value = e.target.value

    setAddressValue(value)
  }

  const handleSearchAddress = () => {
    setShowMap(0)

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

  const handleKeyPressAddress = (event) => {
    if (event.key === 'Enter') {
      handleSearchAddress()
    }
  }

  const [ coordinates, setCoordinates ] = useState({
    x: '',
    y: ''
  } as any)

  const [ utmCoordinates, setUtmCoordinates ] = useState({
    x: '',
    y: ''
  } as any)

  const handleClickMap = (e) => {
    dispatch(hideError())

    let coordX = e.mapPoint && e.mapPoint.longitude && e.mapPoint.longitude.toString()
    let coordY = e.mapPoint && e.mapPoint.latitude && e.mapPoint.latitude.toString()

    const coordXConst = coordX
    const coordYConst = coordY

    let huso = '25830' // antes 23030

    if (
      currentProvision.zipCode && (
        currentProvision.zipCode.startsWith('15') || // a coruña
        currentProvision.zipCode.startsWith('27') || // lugo
        currentProvision.zipCode.startsWith('36') || // pontevedra
        currentProvision.zipCode.startsWith('32') // ourense
      )
    ) {
      huso = '25829' // antes 23029
    }

    let src = new proj4.Proj('EPSG:4326')
    let dest = new proj4.Proj('EPSG:' + huso)

    let point = new proj4.toPoint([parseFloat(coordX), parseFloat(coordY)])

    let pointUtm = proj4.transform(src, dest, point)

    setCoordinates({
      x: coordXConst,
      y: coordYConst
    })

    setUtmCoordinates({
      x: pointUtm.x && pointUtm.x.toString(),
      y: pointUtm.y && pointUtm.y.toString()
    })
  }

  const handleSetCoordinates = () => {
    const data = {
      dossierCod: currentProvision.dossierCod,
      email: currentProvision.email,
      applicant: {
        docNumber: user.documentNumber
      },
      techData: {
        coordCGPX: utmCoordinates.x,
        coordCGPY: utmCoordinates.y
      }
    }

    setIsLoading(true)

    dispatch(thunkUpdateDossier(currentProvision.dossierCod, false, data, (response) => {
      if (response && response.dossier) {
        dispatch(setCurrentProvision({
          ...currentProvision,
          dossierStatusId: response.dossier.dossierStatusId,
          documentList: response.dossier.documentList
        }))

        setNewDocumentsRecieved({
          sentDocument: response.dossier.documentList && response.dossier.documentList.sentDocument ? response.dossier.documentList.sentDocument.map((item) => item) : [],
          nSentDocument: response.dossier.documentList && response.dossier.documentList.nSentDocument ? response.dossier.documentList.nSentDocument.map((item) => item) : []
        })

        setPopup(false)

        /*
        let defaultName = t('provisions.defaultName')

        dispatch(thunkGetProvision(currentProvision.dossierCod, defaultName, (response) => {
          if (response) {
            setNewDocumentsRecieved({
              sentDocument: response && response.documentList && response.documentList.sentDocument ? response.documentList.sentDocument.map((item) => item) : [],
              nSentDocument: response && response.documentList && response.documentList.nSentDocument ? response.documentList.nSentDocument.map((item) => item) : []
            })
          }

          setIsLoading(false)

          setPopup(false)
        }))
        */
      }

      setIsLoading(false)
    }))
  }

  return (
    <Grid>
      {
        isLoading &&
          <Spinner fixed={true} />
      }

      <Grid container className={classes.block} justifyContent='center'>
        <Grid container className={classes.containerLocation}>
          <Grid item className={classes.inputContainer} xs={11} sm={10} md={10}>
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

        {
          // MAPA Y OPCIONES
          showMap === 1 && (
            <>
              <Grid container className={classes.containerLocation} justifyContent='center'>
                <Grid item xs={12} sm={12} md={12} className={classes.containerMap}>
                  {
                    !satelliteMap ?
                      <Map
                        viewProperties={{
                          center: [ mapCoordinates.x, mapCoordinates.y ],
                          zoom: 19
                        }}
                        loaderOptions={{ css: true }}
                        onClick={(e) => handleClickMap(e)}
                      >
                        <Pointer x={coordinates.x} y={coordinates.y} />
                      </Map>
                    :
                      <Scene
                        mapProperties={{ basemap: 'satellite' }}
                        viewProperties={{
                          center: [ mapCoordinates.x, mapCoordinates.y ],
                          zoom: 19
                        }}
                        loaderOptions={{ css: true }}
                        onClick={(e) => handleClickMap(e)}
                      >
                        <Pointer x={coordinates.x} y={coordinates.y} />
                      </Scene>
                  }

                  <div className={classes.previewMapContainer}>
                    {
                      satelliteMap ?
                        <>
                          <div className={classes.previewMapText}>Mapa</div>

                          <Map
                            viewProperties={{
                              center: [ mapCoordinates.x, mapCoordinates.y ],
                              zoom: 19
                            }}
                            loaderOptions={{ css: true }}
                            onClick={() => setSatelliteMap(false)}
                          />
                        </>
                      :
                        <>
                          <div className={classes.previewMapText}>Satelite</div>

                          <Scene
                            mapProperties={{
                              basemap: 'satellite'
                            }}
                            viewProperties={{
                              center: [ mapCoordinates.x, mapCoordinates.y ],
                              zoom: 19
                            }}
                            loaderOptions={{ css: true }}
                            onClick={() => setSatelliteMap(true)}
                          />
                        </>
                    }
                  </div>
                </Grid>
              </Grid>

              <Grid container justifyContent='center' alignItems='center' className={classes.linkContainer}>
                <Grid item>
                  <div
                    className={`${classes.textLink} ${(utmCoordinates.x === '' && utmCoordinates.y === '') && classes.disabled}`}
                    onClick={() => (utmCoordinates.x !== '' && utmCoordinates.y !== '') && handleSetCoordinates()}
                  >
                    {t('provisions.documentation.saveLocation')}
                  </div>
                </Grid>
              </Grid>
            </>
          )
        }
      </Grid>
    </Grid>
  )
}

export default Location
