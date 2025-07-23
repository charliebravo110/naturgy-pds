import React, { useEffect, useState } from 'react'
import { isWeb } from '../../common/detectPlatform'
import useStyles from './ProfileSectionBiometry.styles'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from '../../../common/store/reducers/MainReducer'
import { setEnabled } from '../store/Actions'
import { setPreferences } from '../../common/capacitorPreferencesFunctionality'
import { BIOMETRIC_ACCESS_ENABLED_KEY } from '../nativeBiometricFunctionality'
import { useTranslation } from 'react-i18next'
import useBiometryInitializer from '../store/useBiometryInitializer'

export default function useProfileSectionBiometryLogic() {
  useBiometryInitializer()

  const { t } = useTranslation()
  const classes = useStyles({})
  const [showMe, setShowMe] = useState(false)
  const [saving, setSaving] = useState(false)
  const [switchChecked, setSwitchChecked] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(true)

  const { dataInitialized, enabled, available } = useSelector((state: AppState) => state.biometricAccess)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isWeb() || dataInitialized === false) return

    // section shown only for mobile apps when biometry is available
    // here we can assume the user was already asked to enable biometric access
    if (available) {
      setShowMe(true)
    } else {
      // Biometric access preferences section not shown,
      // most probably because biometry is not available and setted up in the mobile device
    }
    // switch starts checked when biometry is enabled, unchecked otherwise
    setSwitchChecked(enabled)
  }, [dataInitialized])

  async function handleSwitchChange(e) {
    const newValue = e.target.checked
    if (newValue !== switchChecked) setSwitchChecked(e.target.checked)
    // button disabled when there are no changes, enabled otherwise
    setButtonDisabled(newValue === enabled)
  }

  async function handleSave() {
    const newValue = switchChecked
    // no need to check if there are changes because button is disabled in that case
    setSaving(true)
    dispatch(setEnabled(newValue))
    await setPreferences(BIOMETRIC_ACCESS_ENABLED_KEY, newValue ? 'yes' : 'no')
    // spinner shown for minimum 400ms (better UX)
    setTimeout(() => {
      setButtonDisabled(true)
      setSaving(false)
    }, 400)
  }

  return { t, classes, showMe, switchChecked, handleSwitchChange, handleSave, saving, buttonDisabled }
}
