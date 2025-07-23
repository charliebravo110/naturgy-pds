import React from 'react'
import { ReactComponent as AppStoreSvg } from '../../assets/img/app_store.svg'
import { ReactComponent as GooglePlaySvg } from '../../assets/img/google_play.svg'
import { Grid } from '@material-ui/core'
import { APPLE_APP_STORE_LINK, GOOGLE_PLAY_STORE_LINK } from '../common/configAndConstants'
import useAppleGoogleLinksLogic from './useAppleGoogleLinksLogic'

/** section shown only for web, not shown for mobile apps */
export default function AppleGoogleLinks() {
  const { showMe, classes } = useAppleGoogleLinksLogic()
  return showMe === false ? null : (
    <Grid container className={classes.container}>
      <Grid item className={classes.content}>
        <h3>¿Todavía no tienes la app móvil de UFD?</h3>
        <h4>Descárgatela en</h4>
        <div className={classes.links}>
          <a href={GOOGLE_PLAY_STORE_LINK} target='_blank'>
            <GooglePlaySvg title='Google Play' />
          </a>
          <a href={APPLE_APP_STORE_LINK} target='_blank'>
            <AppStoreSvg title='App Store' />
          </a>
        </div>
        <p>Descubre sus ventajas:</p>
        <ul>
          <li>Un acceso rápido a tu Área privada usando tu huella o reconocimiento facial.</li>
          <li>Podrás consultar y gestionar tus suministros y solicitudes desde el móvil​.</li>
          <li>Podrás activar y recibir notificaciones en tu móvil relacionadas con tus suministros y solicitudes​.</li>
        </ul>
      </Grid>
    </Grid>
  )
}
