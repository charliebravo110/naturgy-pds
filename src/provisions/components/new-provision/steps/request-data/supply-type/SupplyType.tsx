import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Select from '../../../../../../common/components/select/Select'
import Button from '../../../../../../common/components/button/Button'
import Spinner from '../../../../../../common/components/spinner/Spinner'
import AlertIcon from '../../../../../../assets/icons/aviso_alerta_pop_up.svg'

import {
  setSupplyTypes,
  setSelectedSupplyType,
  setSupplySubtypes,
  setSelectedSupplySubtype,
  setDossierSubtype,
  setTechData,
  setPowerList,
  setCustomerApplicantData,
  setCustomerApplicant,
  setCustomerOwner,
  setCustomerPayer,
  setContactList
} from '../../../../../store/actions/ProvisionsActions'
import { thunkGetMasterData } from '../../../../../store/actions/ProvisionsThunkActions'

import useStyles from './SupplyType.styles'

// LCS: Importa la función - Wave 3
import { sendGAEvent, getTypologySelfConsumption, removeAccents, removeEmails } from '../../../../../../core/utils/gtm'

const SupplyType = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    history,
    activeComponent,
    setActiveComponent,
    setState
  } = props

  const provisions = useSelector((state: any) => state.provisions)

  const [provisionsSupplyTypes, setProvisionsSupplyTypes] = useState([] as any)
  const [provisionsSupplySubtypes, setProvisionsSupplySubtypes] = useState([] as any)

  const [selectedTypeKey, setSelectedTypeKey] = useState('')
  const [selectedSubtypeKey, setSelectedSubtypeKey] = useState('')

  const [isLoadingTypesOrSubtypes, setIsLoadingTypesOrSubtypes] = useState(true)

  const [eventualMessageShow, setEventualMessageShow] = useState(false)

  useEffect(() => {
    // AL CARGAR EL COMPONENTE
    if (selectedTypeKey === '' && provisionsSupplyTypes.length === 0) {
      // LISTA DE TIPOS DEL STORE VACIA
      dispatch(thunkGetMasterData('SuministroTipoUso', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), null, (response) => {
        if (response) {
          if (response.length === 0) {
            setIsLoadingTypesOrSubtypes(false)
          } else {
            // GUARDAR LA LISTA DE TIPOS EN REDUX
            let auxResponse = [] as any

            response.map((item, index) => {
              return auxResponse.push(item.key + '|' + item.value)
            })

            dispatch(setSupplyTypes(auxResponse))
            dispatch(setSelectedSupplyType(auxResponse && auxResponse.length > 0 && auxResponse[0].split('|')[0]))
            // CAMBIAR TIPO SELECCIONADO
            setSelectedTypeKey(auxResponse && auxResponse.length > 0 && auxResponse[0].split('|')[0])
            // GUARDAR LA LISTA DE TIPOS
            setProvisionsSupplyTypes(auxResponse)
            // LCS: establecemos el valor del tipo de uso - Wave 3
            sessionStorage.setItem('use_type', auxResponse[0].split('|')[1].toLowerCase())
          }
        } else {
          setIsLoadingTypesOrSubtypes(false)
        }
      }))
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    // Comprobacion de que no haya un currentProvision
    if (!Object.keys(provisions.currentProvision).length) {
      // CUANDO EL TIPO SELECCIONADO CAMBIA
      setIsLoadingTypesOrSubtypes(true)
      dispatch(setSupplySubtypes([]))
      dispatch(setSelectedSupplySubtype(''))
      setProvisionsSupplySubtypes([])
      setSelectedSubtypeKey('')

      if (provisionsSupplyTypes.length > 0 && selectedTypeKey !== '') {
        dispatch(thunkGetMasterData('Dossier_Subtipo', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), 'DOSSUB_' + selectedTypeKey, (response) => {
          // EL "selectedTypeKey" ES LA KEY PARA FILTRAR LOS SUBTIPOS
          // QUE CORRESPONDAN A UN TIPO

          if (response) {
            if (response.length === 0) {
              dispatch(setSupplySubtypes([]))
              dispatch(setSelectedSupplySubtype(''))
              setProvisionsSupplySubtypes([])
              setSelectedSubtypeKey('')
            } else {
              let auxResponse = [] as any

              response.map((item, index) => {
                return auxResponse.push(item.value)
              })

              dispatch(setSupplySubtypes(auxResponse))
              dispatch(setSelectedSupplySubtype(auxResponse && auxResponse.length > 0 && auxResponse[0].split('|')[0]))
              dispatch(setDossierSubtype(auxResponse[0].split('|')[0]))

              // CAMBIAR SUBTIPO SELECCIONADO
              setSelectedSubtypeKey(auxResponse && auxResponse.length > 0 && auxResponse[0].split('|')[0])
              // GUARDAR LA LISTA DE SUBTIPOS
              setProvisionsSupplySubtypes(auxResponse)
              // LCS: establecemos el valor del tipo de vivienda - Wave 3
              if (auxResponse.length>1)
                sessionStorage.setItem('housing_type', auxResponse[0].split('|')[1].toLowerCase())
              else
                sessionStorage.removeItem('housing_type');
            }
          }

          setIsLoadingTypesOrSubtypes(false)
        }))
      }
    }
    // eslint-disable-next-line
  }, [selectedTypeKey, provisionsSupplyTypes])

  const handleSelectType = (key: any) => {    
    if (key === 'EVE') {
      setEventualMessageShow(true)
    } else {
      setEventualMessageShow(false)
    }
    dispatch(setSelectedSupplyType(key))

    setSelectedTypeKey(key)    
    // LCS: establecemos el valor del tipo de uso - Wave 3
    sessionStorage.setItem('use_type', provisionsSupplyTypes.find((item) => item.startsWith(key + '|')).split('|')[1].toLowerCase())
  }

  const handleSelectSubtype = (value: any) => {
    dispatch(setSelectedSupplySubtype(value.split('|')[0]))
    dispatch(setDossierSubtype(value.split('|')[0]))

    setSelectedSubtypeKey(value.split('|')[0])
    // LCS: establecemos el valor del tipo de vivienda - Wave 3
    sessionStorage.setItem('housing_type', provisionsSupplySubtypes.find((item) => item.includes(value)).split('|')[1].toLowerCase())
  }

  const handleClickReturn = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    let use_type = sessionStorage.getItem('use_type')
    let housing_type = sessionStorage.getItem('housing_type')
    let auxTypology = getTypologySelfConsumption(provisions.dossierSubtype)
    if (provisionsSupplyTypes.length > 0 && provisionsSupplySubtypes.length > 0 && use_type && housing_type){
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
        use_type: removeAccents(use_type),
        housing_type: removeAccents(housing_type)
      })
    } else if (provisionsSupplyTypes.length > 0 && use_type){
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
        use_type: removeAccents(use_type),
        housing_type: 'no aplica'
      })
    } else {
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: '¿que tipo de suministro quieres conectar?',
        click_text: 'volver',
        element_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        request_type: sessionStorage.getItem('request_type'),
        request_step_name: 'datos de la solicitud',
        request_subtype: removeAccents(auxTypology),
        browsing_type: sessionStorage.getItem('browsing_type')
      })
    }
    history.push('/provisions/new-provision/keep-in-mind')
  }

  const handleClickContinue = () => {
    /* Se resetea la store */
    dispatch(setTechData({}))
    dispatch(setPowerList([]))
    dispatch(setCustomerApplicantData({}))
    dispatch(setCustomerApplicant({}))
    dispatch(setCustomerOwner({}))
    dispatch(setCustomerPayer({}))
    dispatch(setContactList([]))
    // LCS: Enviar evento de GdC a GA - Wave 3
    let use_type = sessionStorage.getItem('use_type')
    let housing_type = sessionStorage.getItem('housing_type')
    let auxTypology = getTypologySelfConsumption(provisions.dossierSubtype)
    if (provisionsSupplyTypes.length > 0 && provisionsSupplySubtypes.length > 0 && use_type && housing_type){
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
        use_type: removeAccents(use_type),
        housing_type: removeAccents(housing_type)
      })
    } else if (provisionsSupplyTypes.length > 0 && use_type){
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
        use_type: removeAccents(use_type),
        housing_type: 'no aplica'
      })
    } else {
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        title_screen: '¿que tipo de suministro quieres conectar?',
        click_text: 'continuar',
        element_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        request_type: sessionStorage.getItem('request_type'),
        request_step_name: 'datos de la solicitud',
        request_subtype: removeAccents(auxTypology),
        browsing_type: sessionStorage.getItem('browsing_type')
      })
    }

    /* Se resetea el estado de los formularios */
    setState(0)

    setActiveComponent(activeComponent + 1)
  }

  return (
    <>
      <Grid container className={classes.container} justifyContent='center'>
        {
          isLoadingTypesOrSubtypes &&
          <Spinner fixed />
        }

        <Grid item xs={12} md={5} justifyContent='center'>
          <Grid className={classes.title}>{t('provisions.newProvision.requestData.supplyType.title')}</Grid>

          <Grid className={classes.text}> {t('provisions.newProvision.requestData.supplyType.text')}</Grid>

          <Grid className={classes.containerCombobox}>
            <Grid item className={classes.selectContainer}>
              {
                !Object.keys(provisions.currentProvision).length &&
                provisionsSupplyTypes.length > 0 &&
                <>
                  <Grid className={classes.textComboBox}>{t('provisions.newProvision.requestData.supplyType.useType')}</Grid>

                  <Select
                    fullWidth
                    codFiltering
                    value={selectedTypeKey}
                    values={provisionsSupplyTypes}// ocultado "grandes desarrollos"
                    onChange={(e) => handleSelectType(e.target.value)}
                  />
                </>
              }
            </Grid>

            {
              !isLoadingTypesOrSubtypes && (provisionsSupplySubtypes.length > 1) &&
              <Grid item className={classes.selectContainer}>
                {
                  selectedTypeKey === 'UR' &&
                  <Grid className={classes.textComboBox}>{t('provisions.newProvision.requestData.supplyType.housingType')}</Grid>
                }
                {
                  !Object.keys(provisions.currentProvision).length &&
                  <Select
                    fullWidth
                    codFiltering
                    value={selectedSubtypeKey}
                    values={provisionsSupplySubtypes}
                    onChange={(e) => handleSelectSubtype(e.target.value)}
                  />
                }
              </Grid>
            }
          </Grid>
        </Grid>
        {/* INICIO ADN - 29/02/24 - 1020768 Nueva iniciativa PDS-253 Valoracion*/}
        {
          eventualMessageShow &&
          
            <Grid container className={classes.eventualContainer} direction='column' justifyContent='center' alignItems='center'>
              <Grid item>
                <img src={AlertIcon} alt='' />
              </Grid>
              <Grid item className={classes.marginTop}>{t('provisions.newProvision.requestData.supplyType.eventual.eventualMessage1')}</Grid>
              <Grid item>{t('provisions.newProvision.requestData.supplyType.eventual.eventualMessage2')}</Grid>
              <Grid item className={classes.marginBottom}>{t('provisions.newProvision.requestData.supplyType.eventual.eventualMessage3')}</Grid>
              <strong><Grid item>{t('provisions.newProvision.requestData.supplyType.eventual.phoneNumber')}</Grid></strong>

            </Grid>
          
        }
        {/* FIN ADN */}
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
            onClick={handleClickContinue}
            disabled={(selectedTypeKey === '' && selectedSubtypeKey === '') || eventualMessageShow === true}
          />
        </Grid>
      </Grid>
    </>

  )
}

export default SupplyType
