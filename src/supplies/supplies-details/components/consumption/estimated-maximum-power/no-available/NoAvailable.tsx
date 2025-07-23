import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Grid } from '@material-ui/core'

import Banner from '../../../../../../assets/img/picto_ordenadores.svg'
import ButtonOpen from '../../../../../../assets/img/acordeon-boton.png'
import ButtonClose from '../../../../../../assets/img/acordeon-boton-open.png'
import Counter from '../../../../../../assets/img/display.png'

import useStyles from './NoAvailable.styles'

const NoAvailable = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const [ isOpen, setIsOpen ] = useState(false)

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Grid container className={classes.container}>
      <Grid item className={classes.bannerContainer} md={5} sm={12} xs={12}>
        <img className={classes.banner} src={Banner} alt='' />
      </Grid>

      <Grid item md={6} sm={12} xs={12}>
        <div className={classes.title}>
          {t('supplies.suppliesDetails.components.maxPowerEstimated.noAvailable.title')}
        </div>

        <div className={classes.description}>
          {t('supplies.suppliesDetails.components.maxPowerEstimated.noAvailable.description')}
        </div>

        <Grid container className={classes.button} onClick={handleClick}>
          <Grid item>
            <div className={classes.checkbox}>
              {
                isOpen ?
                  <img src={ButtonClose} alt='' />
                :
                  <img src={ButtonOpen} alt='' />
              }
            </div>
          </Grid>

          <Grid item className={classes.buttonText}>
            {t('supplies.suppliesDetails.components.maxPowerEstimated.noAvailable.button')}
          </Grid>
        </Grid>

        {
          isOpen &&
            <Grid container className={classes.box}>
              <div className={classes.boxText}>
                {t('supplies.suppliesDetails.components.maxPowerEstimated.noAvailable.box.text1.normal')} <b>{t('supplies.suppliesDetails.components.maxPowerEstimated.noAvailable.box.text1.bold')}</b>.
              </div>

              <div className={classes.boxText}>
                {t('supplies.suppliesDetails.components.maxPowerEstimated.noAvailable.box.text2.normal')} <b>{t('supplies.suppliesDetails.components.maxPowerEstimated.noAvailable.box.text2.bold')}</b>.
              </div>

              <img className={classes.counter} src={Counter} alt='' />

              <div className={classes.boxText}>
                {t('supplies.suppliesDetails.components.maxPowerEstimated.noAvailable.box.text3')}
              </div>
            </Grid>
        }

        <div className={classes.footer}>
          {t('supplies.suppliesDetails.components.maxPowerEstimated.noAvailable.footer.label')} <a href='https://www.ufd.es/contacto/' target='_blank' rel='noopener noreferrer'>{t('supplies.suppliesDetails.components.maxPowerEstimated.noAvailable.footer.link')}</a>.
        </div>
      </Grid>
    </Grid>
  )
}

export default NoAvailable
