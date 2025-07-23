import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Select from '../../../../../../common/components/select/Select'
import Button from '../../../../../../common/components/button/Button'

import {
  setDossierType,
  setDossierSubtype,
  setNewGeneration
} from '../../../../../store/actions/ProvisionsActions'

import useStyles from './Type.styles'

// LCS: Importa la función - Wave 3
import { sendGAEvent, getTypologySelfConsumption, removeEmails } from '../../../../../../core/utils/gtm'

const Type = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const provisions = useSelector((state: any) => state.provisions)
  const [isAutoconsumo, setIsAutoconsumo] = useState<boolean>(provisions.dossierType === 'DOSTYP002' && provisions.dossierSubtype === 'DOSSUB000')

  const {
    history,
    setActiveComponent,
    autoconsumo,
    setGeneraCogen
  } = props

  const typologies = [
    'DOSSUB016|' + t('provisions.newGeneration.type.typologies.hydraulics'),
    'DOSSUB017|' + t('provisions.newGeneration.type.typologies.photovoltaic'),
    'DOSSUB028|' + t('provisions.newGeneration.type.typologies.accumulation'),
    'DOSSUB018|' + t('provisions.newGeneration.type.typologies.wind'),
    'DOSSUB019|' + t('provisions.newGeneration.type.typologies.solarThermal'),
    'DOSSUB020|' + t('provisions.newGeneration.type.typologies.congeneration'),
    'DOSSUB021|' + t('provisions.newGeneration.type.typologies.biomass'),
    'DOSSUB022|' + t('provisions.newGeneration.type.typologies.biogas'),
    'DOSSUB023|' + t('provisions.newGeneration.type.typologies.waste'),
    'DOSSUB024|' + t('provisions.newGeneration.type.typologies.other')
  ]

  const [autoconsuptionType] = useState([
    {
      key: '1',
      value: t('provisions.newGeneration.type.autoconsuption_type.individual')
    },
    {
      key: '2',
      value: t('provisions.newGeneration.type.autoconsuption_type.colective')
    }
  ])

  const [newCGPQuestion] = useState([
    {
      key: '1',
      value: t('provisions.newGeneration.type.question.1')
    },
    {
      key: '3',
      value: t('provisions.newGeneration.type.question.2')
    },
    {
      key: '2',
      value: t('provisions.newGeneration.type.question.3'),
      subQuestions: [
        {
          key: 'ChangePlace',
          value: t('provisions.newGeneration.type.question.4')
        },
        {
          key: 'SamePlace',
          value: t('provisions.newGeneration.type.question.5')
        }
      ]
    }
  ])

  const [newCGPQuestionSubQuestions] = useState([
    {
      key: 'ChangePlace',
      value: t('provisions.newGeneration.type.question.4')
    },
    {
      key: 'SamePlace',
      value: t('provisions.newGeneration.type.question.5')
    }
  ])

  const connectionsSubQuestions =
    [
      {
        key: 'ENLACE_CC',
        value: t('provisions.newGeneration.type.connections.enlace.2'),
      },
      {
        key: 'ENLACE_CDM',
        value: t('provisions.newGeneration.type.connections.enlace.3'),
      },
      {
        key: 'ENLACE_CPM',
        value: t('provisions.newGeneration.type.connections.enlace.4'),
      },
      {
        key: 'ENLACE_CGP',
        value: t('provisions.newGeneration.type.connections.enlace.5'),
      }
    ]


  const connections = [
    {
      key: 'INTERNAL_CUSTOMER_NETWORK',
      value_main: t('provisions.newGeneration.type.connections.internalCustomerNetworkDescription.main'),
      value_explanation: t('provisions.newGeneration.type.connections.internalCustomerNetworkDescription.explicacion')
    },
    {
      key: 'ENLACE',
      value: t('provisions.newGeneration.type.connections.enlace.1'),
      subQuestions: [
        {
          key: 'ENLACE_CC',
          value: t('provisions.newGeneration.type.connections.enlace.2'),
        },
        {
          key: 'ENLACE_CDM',
          value: t('provisions.newGeneration.type.connections.enlace.3'),
        },
        {
          key: 'ENLACE_CPM',
          value: t('provisions.newGeneration.type.connections.enlace.4'),
        },
        {
          key: 'ENLACE_CGP',
          value: t('provisions.newGeneration.type.connections.enlace.5'),
        }
      ]
    },
    {
      key: 'UFD_NETWORK',
      value_main: t('provisions.newGeneration.type.connections.ufdNetworkDescription.main'),
      value_explanation: t('provisions.newGeneration.type.connections.ufdNetworkDescription.explicacion')
    }
  ]

  const [selectedTypology, setSelectedTypology] = useState('')

  const [selectedConnection, setSelectedConnection] = useState((!provisions.connectionType || provisions.connectionType === '') ? connections[0].key : provisions.connectionType)
  const [selectedConnectionPadre, setSelectedConnectionPadre] = useState('')

  const [selectedAutoconsumo, setSelectedAutoconsumo] = useState('')

  const [CGPSelected, setCGPSelected] = useState('')
  const [CGPSelectedPadre, setCGPSelectedPadre] = useState('')

  const handleSelectTypology = (key: any) => {
    setSelectedTypology(key)

    dispatch(setDossierSubtype(key))
  }

  const handleCGPSelected = (key: any, padre: any = '') => {
    setCGPSelectedPadre(padre)

    setCGPSelected(key)
  }

  const handleSelectConnectionType = (key: any, padre: any = '') => {
    setSelectedConnectionPadre(padre)

    setSelectedConnection(key)

    dispatch(setNewGeneration({
      selectedConnection: key
    }))
  }

  const handleSelectAutoConsumosType = (key: any) => {
    setSelectedAutoconsumo(key)
  }

  const handleClickReturn = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    let auxTypology = getTypologySelfConsumption(selectedTypology)
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      title_screen: '¿que tipo de suministro quieres conectar?',
      click_text: 'volver',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type: sessionStorage.getItem('request_type'),
      request_step_name: 'datos de la solicitud',
      browsing_type: sessionStorage.getItem('browsing_type'),
      request_subtype: auxTypology ? auxTypology : 'no aplica'
    })
    history.push('/provisions/new-generation/keep-in-mind')
  }

  const handleClickContinue = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    let auxTypology = getTypologySelfConsumption(selectedTypology)
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      title_screen: '¿que tipo de suministro quieres conectar?',
      click_text: 'continuar',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type: sessionStorage.getItem('request_type'),
      request_step_name: 'datos de la solicitud',
      browsing_type: sessionStorage.getItem('browsing_type'),
      request_subtype: auxTypology ? auxTypology : 'no aplica'
    })
    if ((provisions.dossierType === 'DOSTYP002' && provisions.dossierSubtype === 'DOSSUB020') &&
      !autoconsumo) {
      setGeneraCogen(true)
    } else {
      setGeneraCogen(false)
    }

    if (fotovoltaicaCubierta !== null) {
      props.setIsOnDeck(fotovoltaicaCubierta)
    }

    if (fotovoltaicaSuperficie !== null) {
      props.setFotovoltaicaSuperficie(fotovoltaicaSuperficie)
    }

    if (selectedAutoconsumo !== '') {
      props.setTypeAutoconsumo(selectedAutoconsumo)
    }

    if (CGPSelected !== '') {
      props.setCGPSelected(CGPSelected)
    }

    props.setTypeConexion(selectedConnection)

    if (autoconsumo) {
      setActiveComponent(1)
    } else {
      setActiveComponent(2)
    }
  }

  useEffect(() => {
    if (!provisions.dossierType || provisions.dossierType === '') {
      dispatch(setDossierType('DOSTYP002'))
    }

    if (!provisions.dossierSubtype || provisions.dossierSubtype === '' || autoconsumo) {
      dispatch(setDossierSubtype(typologies && typologies.length > 0 && typologies[0].split('|')[0]))
    }

    if (!provisions.newGeneration.selectedConnection || provisions.newGeneration.selectedConnection === '') {
      dispatch(setNewGeneration({
        typologies,
        connections,
        selectedConnection: connections[0].key
      }))
    }
    // eslint-disable-next-line
  }, [])

  const [fotovoltaicaCubierta, setFotovoltaicaCubierta] = useState(null)
  const [fotovoltaicaSuperficie, setFotovoltaicaSuperficie] = useState(null)

  const disableButton = () => {
    let isDisabled = true
    if (selectedTypology !== '') {
      if (isAutoconsumo) {
        // if de autoconsumos
        if (selectedTypology === 'DOSSUB017' && fotovoltaicaCubierta !== null && fotovoltaicaSuperficie !== null && selectedAutoconsumo !== '' && selectedConnection !== '' && CGPSelected !== '') {
          isDisabled = false
          if (selectedConnection === 'ENLACE') {
            isDisabled = true
          }
          if (CGPSelected === '2') {
            isDisabled = true
          }
        } else if (selectedTypology !== 'DOSSUB017' && selectedAutoconsumo !== '' && selectedConnection !== '' && CGPSelected !== '') {
          isDisabled = false
          if (selectedConnection === 'ENLACE') {
            isDisabled = true
          }
          if (CGPSelected === '2') {
            isDisabled = true
          }
        }
      } else {
        // Disable button si no es autoconsumo
        if (selectedTypology === 'DOSSUB017' && fotovoltaicaCubierta !== null && fotovoltaicaSuperficie !== null) {
          isDisabled = false
        } else if (selectedTypology !== 'DOSSUB017') {
          isDisabled = false
        }
      }
    }
    return isDisabled
  }

  return (
    <Grid container className={classes.container}>
      <Grid item md={5} sm={10} xs={12} style={{ width: '80%', minWidth: '80%', maxWidth: '80%' }}>
        <div className={classes.title}>{t('provisions.newGeneration.type.title')}</div>

        {/*
          SELECCIONAR TIPOLOGIA / SUBTIPOLOGIA
        */}
        {/*
          SELECCIONAR TIPOLOGIA / SUBTIPOLOGIA
        */}
        <div className={classes.description}>{t('provisions.newGeneration.type.description')}</div>
        {
          typologies.length > 0 &&
          <div style={{ width: '45%', margin: 'auto' }}>
            <Grid item className={classes.textSelect}>{t('provisions.newGeneration.type.typology')}</Grid>

            <Select
              fullWidth
              codFiltering
              value={selectedTypology}
              values={typologies}
              onChange={(e) => handleSelectTypology(e.target.value)}
              error={(selectedTypology == '') ? true : false}
              helperText={(selectedTypology == '') ? t('provisions.newGeneration.type.selectWarn') : ''}
              label={t('provisions.newGeneration.type.select')}
            />
          </div>
        }

        {selectedTypology !== '' && (
          <>
            {/*
              PREGUNTAS SI ES FOTOVOLTAICA
            */}
            {
              (selectedTypology == 'DOSSUB017') && (
                <>
                  {/*
                    PREGUNTA DE LA INSTALACION
                  */}
                  <Grid item className={classes.innerContainer} md={12} sm={12} xs={12} style={{ width: '80%' }}>
                    <Grid container className={classes.textConnections}>{t('provisions.newGeneration.type.fotovoltaica.question')}</Grid>
                    <div className={classes.connectionTypes_2}>
                      <div>
                        <Grid item className='icon'>
                          <div
                            className={`${classes.radioButton} ${fotovoltaicaCubierta === true && 'active'}`}
                            onClick={() => setFotovoltaicaCubierta(true)}
                          />
                        </Grid>
                        <Grid
                          item
                          className={`label ${classes.radiobuttoText}`}
                          onClick={() => setFotovoltaicaCubierta(true)}
                        >
                          {t('common.buttons.yes')}
                        </Grid>
                      </div>
                      <div>
                        <Grid item className='icon'>
                          <div
                            className={`${classes.radioButton} ${fotovoltaicaCubierta === false && 'active'}`}
                            onClick={() => setFotovoltaicaCubierta(false)}
                          />
                        </Grid>
                        <Grid
                          item
                          className={`label ${classes.radiobuttoText}`}
                          onClick={() => setFotovoltaicaCubierta(false)}
                        >
                          {t('common.buttons.no')}
                        </Grid>
                      </div>
                    </div>
                  </Grid>
                  <hr />
                  {/*
                    PREGUNTA SUPERFICIE DE LA INSTALACION
                  */}
                  <Grid item className={classes.innerContainer} md={12} sm={12} xs={12} style={{ width: '80%' }}>
                    <Grid container className={classes.textConnections}>{t('provisions.newGeneration.type.fotovoltaica.questionSuperficie')}</Grid>
                    <div className={classes.connectionTypes_2}>
                      <div>
                        <Grid item className='icon'>
                          <div
                            className={`${classes.radioButton} ${fotovoltaicaSuperficie === false && 'active'}`}
                            onClick={() => setFotovoltaicaSuperficie(false)}
                          />
                        </Grid>
                        <Grid
                          item
                          className={`label ${classes.radiobuttoText}`}
                          onClick={() => setFotovoltaicaSuperficie(false)}
                        >
                          {t('provisions.newGeneration.type.fotovoltaica.lessThan')}
                        </Grid>
                      </div>
                      <div>
                        <Grid item className='icon'>
                          <div
                            className={`${classes.radioButton} ${fotovoltaicaSuperficie === true && 'active'}`}
                            onClick={() => setFotovoltaicaSuperficie(true)}
                          />
                        </Grid>
                        <Grid
                          item
                          className={`label ${classes.radiobuttoText}`}
                          onClick={() => setFotovoltaicaSuperficie(true)}
                        >
                          {t('provisions.newGeneration.type.fotovoltaica.moreThan')}
                        </Grid>
                      </div>
                    </div>
                  </Grid>
                  <hr />
                </>
              )
            }
            {isAutoconsumo && (
              <>
                {/*
                  SELECCIONAR TIPO DE AUTOCONSUMO
                    - INDIVIDUAL
                    - COLECTIVO
                */}
                <Grid item className={classes.innerContainer} md={12} sm={12} xs={12} style={{ width: '80%' }}>
                  <Grid container className={classes.textConnections}>{t('provisions.newGeneration.type.autoconsuption_type.title')}</Grid>
                  <div className={classes.connectionTypes_2}>
                    {
                      autoconsuptionType.map(
                        (item, index) => {
                          return (
                            <div key={index}>
                              <Grid item className='icon'>
                                <div
                                  className={`${classes.radioButton} ${selectedAutoconsumo === item.key && 'active'}`}
                                  onClick={() => handleSelectAutoConsumosType(item.key)}
                                />
                              </Grid>
                              <Grid
                                item
                                className={`label ${classes.radiobuttoText}`}
                                onClick={() => handleSelectAutoConsumosType(item.key)}
                              >
                                {item.value}
                              </Grid>
                            </div>
                          )
                        }
                      )
                    }
                  </div>
                </Grid>
                <hr />
                {/*
                  SELECCIONAR TIPO DE CONEXION
                */}
                <Grid item className={classes.innerContainer} md={12} sm={12} xs={12}>
                  <Grid container className={classes.textConnections}>{t('provisions.newGeneration.type.connection')}</Grid>
                  <Grid container className={classes.connectionTypes}>
                    {
                      connections.map(
                        (item, index) => {
                          return item.subQuestions ? (
                            <Grid key={index} container className={classes.connectionTypesItem}>
                              <Grid item className='icon'>
                                <div
                                  className={`${classes.radioButton} ${(provisions.newGeneration.selectedConnection === item.key || selectedConnectionPadre === item.key) && 'active'}`}
                                  onClick={() => handleSelectConnectionType(item.key)}
                                />
                              </Grid>
                              <Grid
                                item
                                className={`label ${classes.radiobuttoText}`}
                                style={{ width: '80%' }}
                              >
                                {item.value ? item.value : item.value_main ? item.value_main : ''}
                                {item.value_explanation ? (
                                  <>
                                    <br />
                                    {item.value_explanation}
                                  </>
                                ) : ''}
                                {(selectedConnection === item.key || selectedConnectionPadre === item.key) && (
                                  <Select
                                    fullWidth
                                    codFiltering
                                    values={connectionsSubQuestions.map((item) => `${item.key}|${item.value}`)}
                                    onChange={(e) => handleSelectConnectionType(e.target.value, item.key)}
                                    size='small'
                                    className={classes.selectMenu}
                                  />
                                )}
                              </Grid>
                            </Grid>
                          ) : (
                            <Grid key={index} container className={classes.connectionTypesItem}>
                              <Grid item className='icon'>
                                <div
                                  className={`${classes.radioButton} ${provisions.newGeneration.selectedConnection === item.key && 'active'}`}
                                  onClick={() => handleSelectConnectionType(item.key)}
                                />
                              </Grid>
                              <Grid
                                item
                                className={`label ${classes.radiobuttoText}`}
                                onClick={() => handleSelectConnectionType(item.key)}
                              >
                                {item.value ? item.value : item.value_main ? item.value_main : ''}
                                {item.value_explanation ? (
                                  <>
                                    <br />
                                    {item.value_explanation}
                                  </>
                                ) : ''}
                              </Grid>
                            </Grid>
                          )
                        }
                      )
                    }
                  </Grid>
                </Grid>
                <hr />
                {/*
                  CAJA GENERAL DE PROTECCION
                */}
                <Grid item className={classes.innerContainer} md={12} sm={12} xs={12}>
                  <Grid container className={classes.textConnections}>{t('provisions.newGeneration.type.newCGP.title')}</Grid>
                  <Grid container className={classes.connectionTypes}>
                    {
                      newCGPQuestion.map(
                        (item, index) => {
                          return (
                            <Grid key={index} container className={classes.connectionTypesItem}>
                              <Grid item className='icon'>
                                <div
                                  className={`${classes.radioButton} ${(CGPSelected === item.key || CGPSelectedPadre === item.key) && 'active'}`}
                                  onClick={() => handleCGPSelected(item.key)}
                                />
                              </Grid>
                              <Grid
                                item
                                className={`label ${classes.radiobuttoText}`}
                                style={{ width: '80%' }}
                              >
                                {item.value}
                                {(item.subQuestions && (CGPSelected === item.key || CGPSelectedPadre === item.key)) && (
                                  <Select
                                    fullWidth
                                    codFiltering
                                    values={newCGPQuestionSubQuestions.map((item) => `${item.key}|${item.value}`)}
                                    onChange={(e) => handleCGPSelected(e.target.value, item.key)}
                                    size='small'
                                    className={classes.selectMenu}
                                  />
                                )}
                              </Grid>
                            </Grid>
                          )
                        }
                      )
                    }
                  </Grid>
                </Grid>
                <hr />
              </>
            )}
          </>
        )}
      </Grid>

      <Grid container className={classes.buttons}>
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
          disabled={disableButton()}
          onClick={handleClickContinue}
        />
      </Grid>
    </Grid>
  )
}

export default Type
