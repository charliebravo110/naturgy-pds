import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import ThisDialog from './dialog/Dialog'

import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg'

import useStyles from './TituloHabilitante.styles'

const TituloHabilitante = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const { location } = props

  const [ isModalVisible, setIsModalVisible ] = useState(false)

  const handleClick = () => {
    setIsModalVisible(true)
  }

  const renderDescription = () => {
    switch (location) {
      case 1:
        return (
          <div>
            <span>{t('provisions.provisionsEnableTitle.description.one')}</span>
          </div>
        )
      case 2:
        return (
          <div>
            <span>{t('provisions.provisionsEnableTitle.description.two.first')}</span>
            <strong>{t('provisions.provisionsEnableTitle.description.two.second')}</strong>
            <span>{t('provisions.provisionsEnableTitle.description.two.last')}</span>
          </div>
        )
      case 3:
        return (
          <div>
            <span>{t('provisions.provisionsEnableTitle.description.three.first')}</span>
            <strong>{t('provisions.provisionsEnableTitle.description.three.second')}</strong>
            <span>{t('provisions.provisionsEnableTitle.description.three.last')}</span>
          </div>
        )
      case 4:
        return (
          <div>
            <span>{t('provisions.provisionsEnableTitle.description.four.first')}</span>
            <strong>{t('provisions.provisionsEnableTitle.description.four.second')}</strong>
            <span>{t('provisions.provisionsEnableTitle.description.four.last')}</span>
          </div>
        )
    }
  }

  return (
    <Grid container md={12} className={classes.dossierDateAdviseBox}>
      <ThisDialog
        isDialogVisible={isModalVisible}
        handleCloseDialog={() => setIsModalVisible(false)}
      />
      <Grid item md={12}>
        <Grid
          container
          md={12}
          justifyContent='center'
          alignItems='center'
          className={classes.dossierDateAdviseContainer}
        >
          <Grid container md={11} spacing={1}>
            <Grid item container alignItems='center'>
              <Grid item md={1} sm={2} xs={2} className={classes.alertIconBox}>
                <img src={AlertIcon} className={classes.alertIcon} alt='' />
              </Grid>
              <Grid item md={11} sm={10} xs={10} className={classes.dossierDateAdviseTitle}>
                <span>{t('provisions.provisionsEnableTitle.title.first')}</span>
                <strong>{t('provisions.provisionsEnableTitle.title.second')}</strong>
                <span>{t('provisions.provisionsEnableTitle.title.last')}</span>
              </Grid>
            </Grid>

            <Grid item container className={classes.description}>
              <Grid item md={1} sm={2} xs={2} />
              <Grid item md={11} sm={10} xs={10}>
                {renderDescription()}
              </Grid>
            </Grid>

            <Grid item container>
              <Grid item md={1} sm={2} xs={2} />
              <Grid item md={11} sm={10} xs={10}>
                <Grid className={classes.link} onClick={handleClick}>
                  {t('provisions.provisionsEnableTitle.moreInfo')}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default TituloHabilitante
