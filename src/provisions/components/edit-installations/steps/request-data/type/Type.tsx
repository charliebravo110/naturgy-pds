import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Select from '../../../../../../common/components/select/Select'
import Button from '../../../../../../common/components/button/Button'

import {
  setDossierSubtype
} from '../../../../../store/actions/ProvisionsActions'

import useStyles from './Type.styles'

// LCS: Importa la función - Wave 3
// LCS: Enviar evento de GdC a GA - Wave 3
import { getTypologySelfConsumption, sendGAEvent, removeEmails } from '../../../../../../core/utils/gtm'

const SupplyType = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    history,
    activeComponent,
    setActiveComponent
  } = props

  const typologies = [
    'DOSSUB025|'+t('provisions.editInstallations.type.typologies.setback'),
    // 'DOSSUB026|'+t('provisions.editInstallations.type.typologies.detour'),
    'DOSSUB027|'+t('provisions.editInstallations.type.typologies.telecomunication')
  ]

  const [ selectedTypeKey, setSelectedTypeKey ] = useState(typologies[0].split('|')[0])

  // Se setea por defecto en la store el valor default de typologies
  useEffect(() => {
    dispatch(setDossierSubtype(typologies[0].split('|')[0]))
  // eslint-disable-next-line
  }, [])

  const handleSelectType = (key: any) => {
    setSelectedTypeKey(key)

    dispatch(setDossierSubtype(key))
  }

  const handleClickReturn = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    console.log('selectedTypeKey',selectedTypeKey)
    let auxTypology = getTypologySelfConsumption(selectedTypeKey)
    console.log('auxTypology',auxTypology)
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      title_screen: '¿que tipo de modificacion de la instalacion quieres solicitar?',
      click_text: 'volver',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type: sessionStorage.getItem('request_type'),
      request_step_name: 'datos de la solicitud',
      browsing_type: sessionStorage.getItem('browsing_type'),
      request_subtype: auxTypology
    })
    history.push('/provisions/edit-installations/keep-in-mind')
  }

  const handleClickContinue = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    let auxTypology = getTypologySelfConsumption(selectedTypeKey)
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      title_screen: '¿que tipo de modificacion de la instalacion quieres solicitar?',
      click_text: 'continuar',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type: sessionStorage.getItem('request_type'),
      request_step_name: 'datos de la solicitud',
      browsing_type: sessionStorage.getItem('browsing_type'),
      request_subtype: auxTypology
    })
    setActiveComponent(activeComponent + 1)
  }

  return (
    <>
      <Grid container className={classes.container} justifyContent='center'>

        <Grid item xs={12} md={5} justifyContent='center'>
          <Grid className={classes.title}>{t('provisions.editInstallations.type.title')}</Grid>
          <Grid className={classes.text}> {t('provisions.editInstallations.type.description')}</Grid>

          <Grid className={classes.containerCombobox}>

            <Grid item className={classes.selectContainer}>
                <Grid className={classes.textComboBox}>{t('provisions.editInstallations.type.typology')}</Grid>
                <Select
                  codFiltering
                  values={typologies}
                  value={selectedTypeKey}
                  onChange={(e) => handleSelectType(e.target.value)}
                  fullWidth
                />
            </Grid>
          </Grid>
        </Grid>
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
              disabled={selectedTypeKey === ''}
            />
          </Grid>
      </Grid>
    </>

  )
}

export default SupplyType
