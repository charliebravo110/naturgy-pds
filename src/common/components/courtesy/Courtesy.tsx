import React from 'react'
import { useTranslation } from 'react-i18next'
import useStyles from './Courtesy.styles'

import Grid from '@material-ui/core/Grid'

import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg'
import generalAttentionIcon from '../../../assets/icons/phone_general.svg'
import incidenceIcon from '../../../assets/icons/phone_averias.svg'

const Courtesy = () => {
  //Declaramos las constantes
  const classes = useStyles({})
  const { t } = useTranslation()

  return (
    <Grid container className={classes.container}>
      <Grid container md={6} className={classes.backcolor}>
        <Grid item md={12} className={classes.alerticon}>
          <img src={AlertIcon} className={classes.infoIcon} alt='' />
        </Grid>
        <Grid item md={12} sm={10} xs={12} className={classes.dossierDateAdviseTitle}>
          <div className={classes.title}>{t('courtesy.alertTitle')}</div>
          <div className={classes.text}>{t('courtesy.alertText')}</div>
          <div className={classes.text}>{t('courtesy.alertText2')}</div>
        </Grid>
        <Grid container className={classes.textInfo}>
          <Grid item md={12} sm={12} xs={12} className={classes.dossierDateAdviseTitle}>
            <div className={classes.title2}>{t('courtesy.infoText')}</div>
          </Grid>
          <Grid item md={12} sm={12} xs={12} className={classes.imageContainer}>
            <img style={{paddingRight:10}} src={generalAttentionIcon} alt='' />
            <img src={incidenceIcon} alt='' />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Courtesy