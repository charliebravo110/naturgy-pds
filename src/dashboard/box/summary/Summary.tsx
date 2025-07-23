import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import MeterIcon from '../../../assets/icons/contador_para_boton.svg'
import MeterIconDisabled from '../../../assets/icons/contador_para_boton_disabled.svg'
import HomeIcon from '../../../assets/icons/ico_casa_playa_blanco.svg'

import useStyles from './Summary.styles'

// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../core/utils/gtm';

const Summary = (props: any) => {

  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.only('xs'))
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    supplyData,
    selectedItemsList
  } = props
  
  const [ meterEnabled, setMeterEnabled ] = useState(false)
  const name = supplyData.name

  const user = useSelector((state: any) => state.user.profile)
  
  /* Comprobación de meter enable */
  useEffect(() => {
    if (selectedItemsList.measurementSystem === 'O') {
      if (selectedItemsList.measurementEquipments &&
        selectedItemsList.measurementEquipments.meters[0] &&
        selectedItemsList.measurementEquipments.meters[0].meter &&
        (typeof selectedItemsList.measurementEquipments.meters[0].meter !== 'object' || selectedItemsList.measurementEquipments.meters[0].meter !== '') &&
        selectedItemsList.tipoDeLectura !== 'TELEOPERABLE') {
          setMeterEnabled(true)
        } else {
          setMeterEnabled(false)
        }
    } else {
      setMeterEnabled(true)
    }
  }, [selectedItemsList.cups])

  const handleClickSuministro = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'browsing',
      section_name: 'inicio',
      click_text: 'ver suministro',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      module_name: 'datos del punto de suministro',
      cups: selectedItemsList.cups,
      click_url: window.origin + '/supplies/detail',
      supply_type: selectedItemsList.isGenerator === '0' ? 'consumo' : 'generacion',
      browsing_type: sessionStorage.getItem('browsing_type'),
    });
  }

  const handleClickAccesoContador = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'browsing',
      section_name: 'inicio',
      click_text: 'acceso al contador',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      module_name: 'datos del punto de suministro',
      cups: selectedItemsList.cups,
      click_url: window.origin + '/supplies/detail',
      supply_type: selectedItemsList.isGenerator === '0' ? 'consumo' : 'generacion',
      browsing_type: sessionStorage.getItem('browsing_type'),
    });
  }

  return (
    <Grid container className={(user && user.userId && user.userId == 0) ? classes.notRegisteredContainer : classes.container}>
      <Grid container className={classes.leftColumn} xs={12} sm={12} md={4}>
        <Grid item xs={12} sm={12}>
          <span className={classes.title}>{t('supplies.suppliesDetails.components.summary.supplyPointData')}</span>
        </Grid>
        <Grid item xs={12} sm={12} className={classes.cupsBlock}>
          <div>CUPS</div>
          <div className={classes.cups}>{selectedItemsList.cups}</div>
        </Grid>
      </Grid>
      <Grid container className={classes.centerColumn} item xs={12} sm={12} md={4}>
        <Grid item className={classes.name} xs={12} sm={12}>
          <Grid container className={classes.nameContainer}>
            <Grid item>
              <img src={HomeIcon} className={classes.nameIcon} alt='' />
              {selectedItemsList.name}
            </Grid>
            <Grid item>
              <Typography className={classes.nameLabel}>{name}</Typography>
            </Grid>
          </Grid>
        </Grid>
        {
          mobile &&
          <Grid container item xs={12} className={classes.divider} />
        }
        <Grid item className={classes.addressContainer} xs={12} sm={12}>
          <div className={classes.sectionTitle}>{t('supplies.suppliesDetails.components.summary.address')}</div>
          <div className={classes.boldText}>
            {
              selectedItemsList.address && (
                (selectedItemsList.address.street ? selectedItemsList.address.street : '') + ' ' + (selectedItemsList.address.number ? selectedItemsList.address.number : '') + ', ' + ' ' + (selectedItemsList.address.town ? selectedItemsList.address.town : '') + ', ' + ' ' + (selectedItemsList.address.province ? selectedItemsList.address.province : '') + ' ' + (selectedItemsList.address.zipCode ? selectedItemsList.address.zipCode : '')
              )
            }
          </div>
        </Grid>
        {
          <Grid item className={classes.typeContainer} xs={12} sm={12}>
            <div className={classes.sectionTitle}>{t('supplies.suppliesDetails.components.summary.typeSupplyPoint')}</div>
            <div className={classes.boldText}>{selectedItemsList.isGenerator === '0' && selectedItemsList.isSelfConsumption && selectedItemsList.isSelfConsumption.cau && selectedItemsList.isSelfConsumption.cau != '' ? t('supplies.suppliesDetails.components.summary.selfConsumptiom') : selectedItemsList.isGenerator === '0' ? t('supplies.suppliesDetails.components.summary.consumptiom') : selectedItemsList.isSelfConsumption ? t('supplies.suppliesDetails.components.summary.selfGenerator') : t('supplies.suppliesDetails.components.summary.generator')}</div>
          </Grid>
        }
      </Grid>
      <Grid container className={classes.rightColumn} item md={3} justifyContent='flex-end'>
        {
          selectedItemsList.isGenerator === '0' &&
          <Grid item xs={12} sm={12} className={classes.meterContainer}>
              <Link 
                to={{
                  pathname: '/supplies/detail',
                  state: {
                    cups: selectedItemsList.cups,
                    dashboard: 'linkContador'
                  }}}
                onClick={handleClickAccesoContador}
                style={meterEnabled ? { textDecoration: 'none' } : {textDecoration: 'none', pointerEvents: 'none'}}
              >
                <Grid container className={`${classes.meterButton} ${!meterEnabled && 'disabled'}`} alignItems='center'>
                  <Grid item className={classes.meterLabel}>
                    {t('supplies.suppliesDetails.components.summary.goMeter')}
                  </Grid>
                  <Grid item className={classes.meterIconBlock}>
                    <img src={!meterEnabled ? MeterIconDisabled : MeterIcon} className={classes.meterIcon} alt='' />
                  </Grid>
                </Grid>
              </Link>
          </Grid>
        }
        <Grid item xs={12} sm={12} className={classes.meterContainer}>
          <Link 
            to={{
              pathname: '/supplies/detail',
              state: {
                cups: selectedItemsList.cups
              }}} 
            style={{ textDecoration: 'none' }}
            onClick={handleClickSuministro}
          >
            <Grid item className={classes.meterButton2}>
            {t('dashboard.puntossuministro.Suministro')}
            </Grid>
          </Link>
        </Grid>   
      </Grid>
    </Grid>
  )
}

export default Summary
