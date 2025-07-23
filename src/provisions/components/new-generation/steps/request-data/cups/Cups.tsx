import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Spinner from '../../../../../../common/components/spinner/Spinner'
import Dialog from '../../../../../../supplies/supplies-vinculation/components/dialog/Dialog'
import Input from '../../../../../../common/components/input/Input'
import Button from '../../../../../../common/components/button/Button'
import Checkbox from '../../../../../../supplies/supplies-list/managed-by-me/components/checkbox/Checkbox'
import RepeatedDialog from '../../../dialogs/RepeatedDialog'

import { validateCupsNumber, validateDossierCode } from '../../../../../../common/lib/ValidationLib'

import { showError, hideError } from '../../../../../../common/store/actions/ErrorActions'
import { setNewGeneration } from '../../../../../store/actions/ProvisionsActions'
import { thunkGetDossier } from '../../../../../store/actions/ProvisionsThunkActions'

import useStyles from './Cups.styles'

// LCS: Importa la función - Wave 3
import { sendGAEvent, getTypologySelfConsumption, removeAccents, removeEmails } from '../../../../../../core/utils/gtm'

const Cups = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const provisions = useSelector((state: any) => state.provisions)
  const provisionsList = useSelector((state: any) => state.provisions.provisionsList)
  
  const {
    setActiveComponent
  } = props

  const [ cupsValue, setCupsValue ] = useState('')
  const [ isFindCupsDialogVisible, setIsFindCupsDialogVisible ] = useState(false)
  const [ isCheckboxSelected, setIsCheckboxSelected ] = useState(false)
  const [ isCheckboxNoConsumptionSelected, setIsCheckboxNoConsumptionSelected ] = useState(false)
  const [ consumptionRequestNumberValue, setConsumptionRequestNumberValue ] = useState('')
  const [ isLoading, setIsLoading ] = useState(false)
  const [ repeatedDialogOpen, setRepeatedDialogOpen] = useState(false)
  const [ repeatedDialogShown, setRepeatedDialogShown] = useState(false)
  const [ cupsAssociated, setCupsAssociated] = useState([])
  const [ asyncCallsCompleted, setAsyncCallsCompleted] = useState(false)

  let dossiersOpened = 0
  let dossiersClossed = 0

  useEffect(() => {
    if (provisionsList.length > 0) {
      setIsLoading(true)
      const updatedCupsAssociated = [...cupsAssociated]
  
      provisionsList.forEach((item, index) => {
        if (item.idDossierType === 'DOSTYP002') {
          ++dossiersOpened
          dispatch(thunkGetDossier(item.dossierCod, (response) => {
            if (response && response.dossier && response.dossier.techData && response.dossier.techData.cups) {
              updatedCupsAssociated.push(response.dossier.techData.cups)
            }
            ++dossiersClossed
            if (dossiersOpened === dossiersClossed) {
              setAsyncCallsCompleted(true)
              setIsLoading(false)
            }
          }))
        } else {
          setAsyncCallsCompleted(true)
          setIsLoading(false)
        }
      })
      setCupsAssociated(updatedCupsAssociated)
    } else {
      setAsyncCallsCompleted(true)
      setIsLoading(false)
    }
  }, [provisionsList])

  const getTypologyValue = () => {
    const item = provisions.newGeneration.typologies.find(item => item.split('|')[0] === provisions.dossierSubtype)

    return item && item.split('|')[1] &&  item.split('|')[1].toLowerCase()
  }

  const getConnectionValue = () => {
    
    let item = '' as any
    
    if(provisions.newGeneration.selectedConnection.startsWith('ENLACE')){
      item = provisions.newGeneration.connections[1].subQuestions.find(item => item.key === provisions.newGeneration.selectedConnection)
    } else {
      item = provisions.newGeneration.connections.find(item => item.key === provisions.newGeneration.selectedConnection)
    }
    

    return item.value
  }

  const handleChangeCupsValue = (value: any) => {
    sessionStorage.setItem('cups', value)
    setCupsValue(value)
  }

  const handleOpenFindCupsDialog = () => {
    setIsFindCupsDialogVisible(true)
  }

  const handleCloseFindCupsDialog = () => {
    setIsFindCupsDialogVisible(false)
  }

  const handleClickCheckbox = () => {
    setIsCheckboxSelected(!isCheckboxSelected)

    dispatch(setNewGeneration({
      customerWithCups: !provisions.newGeneration.customerWithCups
    }))

    setCupsValue('')
    setConsumptionRequestNumberValue('')
  }

  const handleClickNoConsumptionCheckbox = () => {
    setIsCheckboxNoConsumptionSelected(!isCheckboxNoConsumptionSelected)

    setCupsValue('')
    setConsumptionRequestNumberValue('')
  }

  const handleChangeConsumptionRequestNumberValue = (value: any) => {
    setConsumptionRequestNumberValue(value)
  }

  const handleClickReturn = () => {
    dispatch(hideError())
    // LCS: Enviar evento de GdC a GA - Wave 3
    let auxTypology = getTypologySelfConsumption(provisions.dossierSubtype)
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      title_screen: '¿que tipo de suministro quieres conectar?',
      click_text: 'volver',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type: 'quiero una conexion de autoconsumo',
      request_step_name: 'datos de la solicitud',
      cups: cupsValue ? cupsValue : 'no aplica',
      request_subtype: auxTypology ? removeAccents(auxTypology) : 'no aplica',
      browsing_type: sessionStorage.getItem('browsing_type')
    })

    setActiveComponent(0)
  }

  const handleClickContinue = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    let auxTypology = getTypologySelfConsumption(provisions.dossierSubtype)
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      title_screen: '¿que tipo de suministro quieres conectar?',
      click_text: 'continuar',
      element_type: 'consulta de informacion',
      page_url: window.location.href,
      request_type: 'quiero una conexion de autoconsumo',
      request_step_name: 'datos de la solicitud',
      cups: cupsValue ? cupsValue : 'no aplica',
      request_subtype:  auxTypology ? removeAccents(auxTypology) : 'no aplica',
      browsing_type: sessionStorage.getItem('browsing_type')
    })

    if (cupsValue.trim() === '' && consumptionRequestNumberValue.trim() === '') {
      dispatch(showError('NG07', 'newGeneration'))
    }else if (provisions.newGeneration.selectedConnection === 'UFD_NETWORK' && isCheckboxSelected && consumptionRequestNumberValue.trim() === '' && isCheckboxNoConsumptionSelected) {
      setActiveComponent(2)
    } else if (cupsValue.trim() !== '' && !validateCupsNumber(cupsValue)) {
      dispatch(showError('NG05', 'newGeneration'))
    } else if (consumptionRequestNumberValue.trim() !== '' && !validateDossierCode(consumptionRequestNumberValue)) {
      dispatch(showError('NG06', 'newGeneration'))
    } else if (cupsAssociated.includes(cupsValue) && !repeatedDialogShown) {
      setRepeatedDialogOpen(true)
      setRepeatedDialogShown(true)
    } else {
      dispatch(hideError())
      setIsLoading(true)

      if (cupsValue !== '') {
        dispatch(setNewGeneration({cups: cupsValue, repeatedCup: cupsAssociated.includes(cupsValue)}))
        setActiveComponent(2)
      } else {
        // llamada a /dossiers
        dispatch(thunkGetDossier(consumptionRequestNumberValue, (response) => {
          if (response && response.dossier) {
            if (response.dossier.dossierCod === '') {
              // la provision no existe
              dispatch(showError('NG02', 'newGeneration'))
            } else {
              dispatch(setNewGeneration({
                dossier: response.dossier.dossierCod,
                cups: response.dossier.techData && response.dossier.techData.cups
              }))

              setActiveComponent(2)
            }
          }

          setIsLoading(false)
        }))
        
        // LCS: Enviar evento de GdC a GA - Wave 3
        let auxTypology = getTypologySelfConsumption(provisions.dossierSubtype)
        sendGAEvent({
          event: 'request_funnel',
          section_name: 'mi conexion a la red',
          title_screen: '¿que tipo de suministro quieres conectar?',
          click_text: 'continuar',
          element_type: 'consulta de informacion',
          page_url: removeEmails(window.location.href),
          request_type: 'quiero una conexion de autoconsumo',
          request_step_name: 'datos de la solicitud',
          cups: cupsValue,
          request_subtype:  auxTypology ? removeAccents(auxTypology) : 'no aplica',
          browsing_type: sessionStorage.getItem('browsing_type')
        })
      }
    }
  }

  useEffect(() => {
    dispatch(setNewGeneration({
      customerWithCups: true,
      dossier: '',
      cups: ''
    }))

  // eslint-disable-next-line
  }, [])

  return (
    <Grid container className={classes.container}>
      {
        isLoading &&
          <Spinner fixed={true} />
      }

      <Dialog
        showingDialog={isFindCupsDialogVisible}
        closeDialog={handleCloseFindCupsDialog}
      />

      <RepeatedDialog
        open={repeatedDialogOpen}
        closeFunction={() => setRepeatedDialogOpen(false)}
      />

      <Grid item md={5} sm={10} xs={12} justifyContent='center'>
        <div className={classes.title}>{t('provisions.newGeneration.cups.title')}</div>

        <div className={classes.typologyAndNetwork}>
          {t('provisions.newGeneration.cups.generation')} {getTypologyValue()} / {getConnectionValue()}
        </div>

        <div className={classes.description}>{provisions.connectionType === 'UFD_NETWORK' ? t('provisions.newGeneration.cups.descriptions.ufdNetwork') : t('provisions.newGeneration.cups.descriptions.internalCustomerNetwork')}</div>

        <Grid container className={classes.innerBox}>
          <Grid item className={classes.innerContainer} md={12} sm={12} xs={12}>
            <div className={`${classes.cupsContainer} ${isCheckboxSelected ? 'disabled' : 'enabled'}`}>
              <div className={classes.inputLabel}>CUPS</div>

              <Input
                value={cupsValue}
                fullWidth
                onChange={(e) => handleChangeCupsValue(e.target.value)}
              />

              <div className={classes.question}>
                <span onClick={handleOpenFindCupsDialog}>{t('provisions.newGeneration.cups.findCups')}</span>
              </div>
            </div>

            <Grid container className={classes.checkboxContainer}>
              <Grid item className='checkbox'>
                <Checkbox selected={isCheckboxSelected} handleClick={handleClickCheckbox} />
              </Grid>

              <Grid item className='label'>
                <span onClick={handleClickCheckbox}>{t('provisions.newGeneration.cups.withoutCups')}</span>
              </Grid>
            </Grid>

            {
              isCheckboxSelected &&
                <div className={`${classes.consumptionRequestNumberContainer} ${isCheckboxNoConsumptionSelected ? 'disabled' : 'enabled'}`}>
                  <div className={classes.inputLabel}>{t('provisions.newGeneration.cups.consumptionRequestNumber')}</div>

                  <Input
                    value={consumptionRequestNumberValue}
                    fullWidth
                    onChange={(e) => handleChangeConsumptionRequestNumberValue(e.target.value)}
                  />
                </div>
            }

            {
              (provisions.newGeneration.selectedConnection === 'UFD_NETWORK' && isCheckboxSelected) &&
                <Grid container className={classes.checkboxContainer}>
                  <Grid item className='checkbox'>
                    <Checkbox selected={isCheckboxNoConsumptionSelected} handleClick={handleClickNoConsumptionCheckbox} />
                  </Grid>

                  <Grid item className='label'>
                    <span onClick={handleClickNoConsumptionCheckbox}>{t('provisions.newGeneration.cups.withoutConsumption')}</span>
                  </Grid>
                </Grid>
            }
          </Grid>
        </Grid>
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
          onClick={handleClickContinue}
          disabled={!asyncCallsCompleted}
        />
      </Grid>
    </Grid>
  )
}

export default Cups
