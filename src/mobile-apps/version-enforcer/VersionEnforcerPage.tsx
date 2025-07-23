import React from 'react'
import imagePNG from '../../assets/img/version_enforcer.png'
import { Button } from '@material-ui/core'
import { AppUpdate } from '@capawesome/capacitor-app-update'
import { useTranslation } from 'react-i18next'
import { isWeb } from '../common/detectPlatform'
import useGoHomeIf from '../common/useGoHomeIf'
import useStyles from './VersionEnforcerPage.styles'

export default function VersionEnforcerPage() {
  useGoHomeIf(isWeb()) // when the user on web goes manually to this url, then redirect home.
  const { t } = useTranslation()
  const classes = useStyles()

  /** Opens the store page of the app in the Play Store (Android) or App Store (iOS) */
  async function buttonHandler() {
    try {
      await AppUpdate.openAppStore()
    } catch (e) {
      // (device offline, iOS app in TestFlight and not in App Store yet...) Do nothing
    }
  }

  return (
    <div className={classes.fullscreenOverlay}>
      <div className={classes.content}>
        <div className={classes.imageContainer}>
          <img src={imagePNG} alt='version-enforcer' />
        </div>
        <h1 className={classes.title}>{t('mobile-apps.version-enforcer.title')}</h1>
        <p className={classes.description}>{t('mobile-apps.version-enforcer.description')}</p>
        <Button variant='contained' className={classes.button} onClick={buttonHandler}>
          {t('mobile-apps.version-enforcer.button')}
        </Button>
      </div>
    </div>
  )
}
