import React from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'

import Item from './item/Item'

import SuppliesIcon from '../../../../assets/icons/peticiones_suministros.svg'
import DossiersIcon from '../../../../assets/icons/peticiones_provisiones.svg'
import FraudIcon from '../../../../assets/icons/peticiones_denunciar_fraude.svg'
import IncidentsIcon from '../../../../assets/icons/peticiones_incidencias.svg'
import CutIcon from '../../../../assets/icons/peticiones_solicitar_corte.svg'
import ClaimIcon from '../../../../assets/icons/peticiones_reclamaciones.svg'

import { setNewRequestSteps } from '../../../store/actions/RequestsActions'

import useStyles from './Tipology.styles'

// LCS: Importa la función - Wave 3
import { removeAccents, sendGAEvent, removeEmails } from '../../../../core/utils/gtm';

const Tipology = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { setCurrentStep } = props

  const handleClickItem = (value) => {
    let click_text = ''
    switch (value) {
      case 'SUPPLY':
        click_text = 'mis suministros, daños, aportar lecturas, reportar errores'
        break;
      case 'DOSSIER':
        click_text = 'mis solicitudes de conexion a la red'
        break;
      case 'FRAUD':
        click_text = 'quiero denunciar un fraude'
        break;
      case 'INCIDENTS':
        click_text = 'quiero comunicar el estado de una instalacion de ufd'
        break;
      case 'CONSULT':
        click_text = 'quiero hacer una consulta o reportar un error del area privada'
        break;
      case 'SELFCONSUMPTION':
        click_text = 'quiero informacion general sobre autoconsumo'
        break;
    }
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis peticiones',
      subsection: 'nueva peticion',
      click_text: removeAccents(click_text),
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type')
    });

    dispatch(setNewRequestSteps({
      step1: value
    }))

    if (value === 'SUPPLY' || value === 'DOSSIER') {
      // suministro o expediente
      setCurrentStep(2)
    } else if (value === 'INCIDENTS' || value === 'SELFCONSUMPTION') {
      setCurrentStep(5)
    } else if (value === 'WORKS') {
      setCurrentStep(6)
    } else if (value === 'CONSULT') {
      setCurrentStep(7)
    } else {
      setCurrentStep(3)
    }
  }

  return (
    <div className={`${classes.block} ${window.location.pathname === '/supplies/detail' && 'without-margin'} ${window.location.pathname === '/provisions/detail' && 'with-margin'}`}>
      <Grid container className={classes.container}>
        <Grid item md={10} sm={11} xs={11}>
          <div className={`${classes.title} ${window.location.pathname === '/provisions/detail' && 'without-margin'}`}>{t('requests.newRequest.tipology.title')}</div>

          <div className={classes.description}>{t('requests.newRequest.tipology.description')}</div>

          <Grid container className={classes.items} md={12} spacing={2}>
            <Item
              type='supplies'
              icon={SuppliesIcon}
              title={<>{t('requests.newRequest.tipology.items.supplies.title')} <br/> <span style={{textAlign:'left'}}>{t('requests.newRequest.tipology.items.supplies.subtitle1')}</span> <br/> {t('requests.newRequest.tipology.items.supplies.subtitle2')} <br/> {t('requests.newRequest.tipology.items.supplies.subtitle3')} </>}
              handleClick={() => handleClickItem('SUPPLY')}
            />

            <Item
              type='dossiers'
              icon={DossiersIcon}
              title={t('requests.newRequest.tipology.items.dossiers.title')}
              handleClick={() => handleClickItem('DOSSIER')}
            />

            <Item
              type='fraud'
              icon={FraudIcon}
              title={t('requests.newRequest.tipology.items.fraud.title')}
              handleClick={() => handleClickItem('FRAUD')}
            />

            <Item
              type='incidents'
              icon={IncidentsIcon}
              title={t('requests.newRequest.tipology.items.incidents.title')}
              description={t('requests.newRequest.tipology.items.incidents.description')}
              handleClick={() => handleClickItem('INCIDENTS')}
            />

            {/* Comentado por ahora. Entrará más adelante */}
            {/* <Item
              type='works'
              icon={ClaimIcon}
              title={t('requests.newRequest.tipology.items.works.title')}
              description={t('requests.newRequest.tipology.items.works.description')}
              handleClick={() => handleClickItem('WORKS')}
            /> */}

            <Item
              type='consult'
              icon={ClaimIcon}
              title={t('requests.newRequest.tipology.items.consult.title')}
              description={t('requests.newRequest.tipology.items.consult.description')}
              handleClick={() => handleClickItem('CONSULT')}
            />

            <Item
              type='selfConsumption'
              icon={ClaimIcon}
              title={t('requests.newRequest.tipology.items.selfConsumption.title')}
              description={t('requests.newRequest.tipology.items.selfConsumption.description')}
              handleClick={() => handleClickItem('SELFCONSUMPTION')}
            />

            {/* <Item
              type='cut'
              icon={CutIcon}
              title={t('requests.newRequest.tipology.items.cut.title')}
              description={t('requests.newRequest.tipology.items.cut.description')}
              handleClick={() => handleClickItem('CUT')}
            /> */}
          </Grid>

          <div className={classes.exit}>
            <Link to='/requests'>{t('requests.newRequest.exit')}</Link>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default Tipology
