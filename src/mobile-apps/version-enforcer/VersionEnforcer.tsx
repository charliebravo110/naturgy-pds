import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { isWeb } from '../common/detectPlatform'
import { FEAT_FLAG_LASTVERSION_ENFORCEMENT } from '../common/configAndConstants'
import { AppUpdate, AppUpdateAvailability } from '@capawesome/capacitor-app-update'
import { getPreferences, setPreferences } from '../common/capacitorPreferencesFunctionality'

/** redirects to version enforcer page if needed, does nothing if platform is web */
export default function VersionEnforcer() {
  const history = useHistory()

  // check initially and then periodically
  useEffect(() => {
    if (isWeb() || !FEAT_FLAG_LASTVERSION_ENFORCEMENT) return

    checkNow()

    const interval = setInterval(() => {
      checkNow()
    }, 1000 * 60 * 60 * 5) //every 5 hours

    return () => clearInterval(interval)
  }, [])

  async function checkNow() {
    if (await mustShowVersionEnforcerPage()) history.push('/version-enforcer')
  }

  return null // nothing to render
}

async function mustShowVersionEnforcerPage() {
  // if already checked less than 5 minutes ago, return cached result as long as it's false
  // (if it was true the last time we checked, we need to check again now, in case the user just updated the app)
  const versionEnforcerCheckedAt = (await getPreferences('versionEnforcerCheckedAt')) || '0'
  const checkedAt = parseInt(versionEnforcerCheckedAt)
  const checkedAtIsRecent = Date.now() - checkedAt < 1000 * 60 * 5
  if (checkedAtIsRecent && (await getPreferences('mustEnforceVersion')) === 'false') return false

  // otherwise, check again
  let mustEnforceVersion = false
  try {
    const result = await AppUpdate.getAppUpdateInfo()
    const newVersionAvailable = result.updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE
    mustEnforceVersion = newVersionAvailable
  } catch (e) {
    // (device offline, iOS app in TestFlight and not in App Store yet...) Do nothing, will return false
  }
  setPreferences('versionEnforcerCheckedAt', Date.now().toString())
  setPreferences('mustEnforceVersion', mustEnforceVersion.toString())
  return mustEnforceVersion
}
