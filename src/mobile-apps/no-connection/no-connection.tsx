import React from 'react'
import imgConnection from './no-connection-data/actualizar.png'
import imgShadow from './no-connection-data/sombra.png'
import useStyles from './no-connection.styles'
import { useTranslation } from 'react-i18next'

export default function NoConnectionPage() {

  const { t } = useTranslation()
  const classes = useStyles({})

  return (<div className={classes.fullscreenOverlay}>
    <figure className={classes.imgContainer}>
      <img className={classes.imgPhone} src={imgConnection} alt='imagen decorativa' />
      <img className={classes.imgShadow} src={imgShadow} alt='imagen decorativa' />
    </figure>
    <div className={classes.textContainer}>
      <h1 className={classes.title}>
        {t('mobile-apps.no-network.title')}
      </h1>
      <p className={classes.text}>
        {t('mobile-apps.no-network.description')}
      </p>
    </div>
    <div className={classes.footer}/>
  </div>)
}