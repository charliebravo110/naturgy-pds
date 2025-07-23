import { Grid } from '@material-ui/core';
import React from 'react';
import useStyles from './AlertInfo.styles';
import { useTranslation } from 'react-i18next';
import InfoIcon from '../../../../assets/icons/aviso_alerta_pop_up.svg'

export default function AlertInfo() {

  const classes = useStyles({})

  const { t } = useTranslation()

  return (
    <Grid container md={12} sm={12} xs={12} className={classes.dossierDateAdviseBox}>
      <Grid item md={12} sm={12} xs={12}>
        <Grid container justifyContent='center' alignItems='center' className={classes.dossierDateAdviseContainer}>
          <Grid
            container
            md={11}
            style={{
              maxWidth: '100%',
              flexBasis: '100%'
            }}
          >
            <Grid container alignItems='center'>
              <img src={InfoIcon} className={classes.infoIcon} alt='' />
              <Grid item md={11} sm={10} xs={12} className={classes.dossierDateAdviseTitle}>
                <div>{t('provisions.provisionsDateAdvise1')}</div>
                <div>{t('provisions.provisionsDateAdvise2')}</div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}