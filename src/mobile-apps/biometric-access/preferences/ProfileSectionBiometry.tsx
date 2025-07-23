import React from 'react'
import { Grid } from '@material-ui/core'
import Switch from '../../common/components/switch/Switch'
import Button from '../../../common/components/button/Button'
import useProfileSectionBiometryLogic from './useProfileSectionBiometryLogic'
import Spinner from '../../../common/components/spinner/Spinner'

/** section to toggle biometric access */
export default function ProfileSectionBiometry() {
  const { t, classes, showMe, switchChecked, handleSwitchChange, handleSave, saving, buttonDisabled } =
    useProfileSectionBiometryLogic()

  return showMe === false ? null : (
    <>
      {saving && <Spinner fixed={true} />}
      <Grid container className={classes.container}>
        <Grid item className={classes.content}>
          <h3>{t('mobile-apps.biometric-access.preferences.heading')}</h3>
          <p>{t('mobile-apps.biometric-access.preferences.subheading')}</p>
          <div className={classes.toggleGroup}>
            <label htmlFor='biometric-access'>{t('mobile-apps.biometric-access.preferences.label')}</label>
            <Switch id='biometric-access' onChange={handleSwitchChange} checked={switchChecked} />
          </div>
          <Button
            fullWidth
            color='primary'
            variant='contained'
            onClick={handleSave}
            disabled={buttonDisabled || saving}
            text={t('mobile-apps.biometric-access.preferences.save-button')}
          />
        </Grid>
      </Grid>
    </>
  )
}
