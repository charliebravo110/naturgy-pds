import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../../common/store/reducers/MainReducer'
import { setPassword, setUser } from '../../../login/store/actions/LoginActions'
import { getPreferences, removePreferences, setPreferences } from '../../common/capacitorPreferencesFunctionality'
import { isMobileApp, isWeb } from '../../common/detectPlatform'
import { useCommonStuff } from '../../common/useCommonStuff'
import ButtonBiometry from './ButtonBiometry'
import DialogBiometry from './DialogBiometry'
import { ButtonBiometryProps, DialogBiometryProps } from './interfaces'
import {
  BIOMETRIC_ACCESS_ENABLED_KEY,
  getStoredCreds,
  performBioCheck,
  removeStoredCreds,
  storeCredsInDevice,
} from '../nativeBiometricFunctionality'
import { setTryAutologin, setEnabled } from '../store/Actions'
import useBiometryInitializer from '../store/useBiometryInitializer'
import { useHistory } from 'react-router'

/** custom hook to login with biometry, returns two UI components and their props */
export default function useBiometricLogin(handleSubmitLoginForm: () => void) {
  useBiometryInitializer()

  const { someoneIsLoggedIn } = useCommonStuff()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { user, password } = useSelector((state: AppState) => state.login)
  const { dataInitialized, available, biometryType, enabled, tryAutologin, iconType } = useSelector(
    (state: AppState) => state.biometricAccess
  )
  // props to be passed to the button component
  const [buttonProps, setButtonProps] = useState<ButtonBiometryProps>({
    showBtn: false,
    handleButtonClick: loginWithBiometrics,
    iconType,
    disableBtn: false,
  })
  // props to be passed to the dialog component
  const [dialogProps, setDialogProps] = useState<DialogBiometryProps>({ isOpen: false, iconType })
  // flag to trigger the submit of the login form
  const [flagToTriggerSubmit, setFlagToTriggerSubmit] = useState(false)

  const history = useHistory()

  // automatically trigger loginWithBiometrics when the login form becomes visible (this was a change requested by UFD during UAT)
  // only once, try auto login the first time after the app loads
  // this way we avoid automatic login with biometrics right after the user logs out (both intentionally and via timeout)
  useEffect(() => {
    // abort if all conditions to continue are not met
    if (false === (isMobileApp() && available && enabled && !someoneIsLoggedIn && dataInitialized && tryAutologin))
      return

    autoLoginWhenFormSettledInForeground()
  }, [dataInitialized, someoneIsLoggedIn, tryAutologin])

  /** The following extra checks and delays avoids the biometric data capture dialog
   * from the OS to appear before the login form is in the foreground and visible.
   * Also avoids the biometric data capture dialog to be triggered while the user is redirected
   * somewhere else (e.g. to /version-enforcer or to /welcome )*/
  async function autoLoginWhenFormSettledInForeground() {
    // LOGIC: Wait indefinitely in 500 ms steps until route is /login
    // after that, if after 1000 ms we are still in /login then trigger autologin (only once)
    do {
      await sleep(500)
    } while (false === history.location.pathname.startsWith('/login'))
    await sleep(1000)
    if (false === history.location.pathname.startsWith('/login')) return
    dispatch(setTryAutologin(false))

    // Avoid double rendering of loginWithBiometrics function
    if (!(sessionStorage.getItem('loginWithBiometricsShown') === 'true')) {
      await loginWithBiometrics()
      sessionStorage.removeItem('loginWithBiometricsShown')
    }
  }

  // show button when login with biometrics is enabled
  useEffect(() => {
    if (!dataInitialized || isWeb()) return
    if (enabled) setButtonProps({ ...buttonProps, showBtn: true })
  }, [dataInitialized])

  // react when flagToTriggerSubmit is raised (see loginWithBiometrics())
  useEffect(() => {
    if (!flagToTriggerSubmit) return
    setFlagToTriggerSubmit(false)
    handleSubmitLoginForm()
    setButtonProps({ ...buttonProps, disableBtn: false })
    setDialogProps({ ...dialogProps, isOpen: false })
  }, [flagToTriggerSubmit])

  /** main functionality of logging in with biometric data */
  async function loginWithBiometrics() {
    // Set as true to avoid double rendering
    sessionStorage.setItem('loginWithBiometricsShown', 'true')

    let bIsEnabled = enabled
    // Sometimes system read null instead of true, so we need to check it again
    if (bIsEnabled !== true) {
      bIsEnabled = await getPreferences(BIOMETRIC_ACCESS_ENABLED_KEY) === 'yes'
    }

    //extra checks (not strictly needed, just in case storage is manipulated)
    if (isWeb() || bIsEnabled !== true) return

    // maybe check again if biometric access still available, just in case the user disabled it in the OS settings...

    // disable button while processing
    setButtonProps({ ...buttonProps, showBtn: true, disableBtn: true })

    // verify user's identity
    if (
      false ===
      (await performBioCheck({
        //ℹ️ when is iOS -> touchID the OS dialog uses the reason as title
        reason: t('mobile-apps.biometric-access.os-dialog-reason'),
        title: t('mobile-apps.biometric-access.os-dialog-title'),
        subtitle: t('mobile-apps.biometric-access.os-dialog-subtitle'),
        negativeButtonText: t('mobile-apps.biometric-access.os-dialog-negative-button'),
      }))
    ) {
      // Next line commented to improve UX, because the user already knows verification failed (OS feedback)
      // alert(t('mobile-apps.biometric-access.verification-failed'))
      setButtonProps({ ...buttonProps, disableBtn: false, showBtn: true })
      return
    }

    // Three steps to trigger login request with stored credentials:

    // 1- retrieve stored creds
    const creds = await getStoredCreds()
    if (!creds) {
      console.debug('unexpected situation, search elkddfslknjh34')
      setButtonProps({ ...buttonProps, disableBtn: false, showBtn: false })
      return
    }

    // 2- re-play the actions performed when user types username and password
    dispatch(setUser(creds.username))
    dispatch(setPassword(creds.password))

    // 3- trigger login request, instead of calling handleSubmitLoginForm() directly we raise this flag,
    // forcing a re-render, which is needed for a validation inside handleSubmitLoginForm to work OK (validateIdentityCardAmpl(user))
    // ( handleSubmitLoginForm() comes from LoginForm.tsx and arrived here as an argument in useBiometricLogin.ts )
    setFlagToTriggerSubmit(true)
  }

  /** checks if a biometrics dialog needs to be shown, shows it and replies true if is being shown, false otherwise.
   * if a dialog is shown handleSubmitLoginForm is interrupted and will be triggered when the user replies to the dialog  */
  async function aBiometricsDialogIsShown() {
    // handleSubmitLoginForm has just started and this function is called (awaited) from there

    if (isWeb() || dialogProps.isOpen || !available || !dataInitialized) return false


    // This is the logic for: someone is trying to log in, what to do?
    let aDialogIsShown = false
    const anotherUser = await userChanged()
    switch (true) {
      // if user is different from the one stored or this is the first time the user tries to log in (no stored creds)
      // then reset biometric settings (because this is a 'per user' setting) and ask to enable biometric access.
      // By asking only when the user changed we make sure the user is asked only once, wich is a requirement (but will be asked again if the username changes)
      case anotherUser:
        await resetBiometricSettings()
        openDialogAskingToEnable()
        aDialogIsShown = true
        break

      // if username is the same and password changed
      // then open dialog asking to replace password
      case anotherUser === false && (await credsChanged()):
        openDialogAskingToReplacePwd()
        aDialogIsShown = true
        break
    }

    return aDialogIsShown // false in the default case
  }

  /** opens dialog asking to enable biometric access */
  function openDialogAskingToEnable() {
    setDialogProps({
      isOpen: true,
      handleOk: async () => {
        const success = await storeCredsInDevice(user, password)
        await setPreferences(BIOMETRIC_ACCESS_ENABLED_KEY, success ? 'yes' : 'no')
        dispatch(setEnabled(success))
        setFlagToTriggerSubmit(true) // continue login process
      },
      handleCancel: async () => {
        // store creds anyway, but disable biometric access. This way, the user can enable it later from settings (profile page)
        await storeCredsInDevice(user, password)
        await setPreferences(BIOMETRIC_ACCESS_ENABLED_KEY, 'no')
        dispatch(setEnabled(false))

        // new requirement: if user cancels, we should show a message:
        // "If you change your mind you can always enable biometric access from the profile page."
        openDialogInformative()
        // login process will continue when user replies to the new dialog
      },
      title: t('mobile-apps.biometric-access.dialog-ask-to-enable.title'),
      // 👆 "Enable biometric access?"
      description: t('mobile-apps.biometric-access.dialog-ask-to-enable.description'),
      // 👆 "You will be able to access without typing username and password"
      okButtonText: t('mobile-apps.biometric-access.dialog-ask-to-enable.ok-button'),
      cancelButtonText: t('mobile-apps.biometric-access.dialog-ask-to-enable.cancel-button'),
      iconType,
    })
  }

  /** opens dialog asking to replace stored password */
  function openDialogAskingToReplacePwd() {
    setDialogProps({
      isOpen: true,
      handleOk: async () => {
        const success = await storeCredsInDevice(user.toUpperCase(), password)
        await setPreferences(BIOMETRIC_ACCESS_ENABLED_KEY, success ? 'yes' : 'no')
        dispatch(setEnabled(success))
        setFlagToTriggerSubmit(true) // continue login process
      },
      handleCancel: async () => {
        setFlagToTriggerSubmit(true) // continue login process
      },
      title: t('mobile-apps.biometric-access.dialog-ask-to-replace-pwd.title'),
      // 👆 "Biometric access was already setted up with another password.",
      description: t('mobile-apps.biometric-access.dialog-ask-to-replace-pwd.description'),
      // 👆 "Do you want to save the one you just entered instead?"
      okButtonText: t('mobile-apps.biometric-access.dialog-ask-to-replace-pwd.ok-button'),
      cancelButtonText: t('mobile-apps.biometric-access.dialog-ask-to-replace-pwd.cancel-button'),
      iconType,
    })
  }

  /** opens dialog informative when user replies NO to enable biometric access */
  function openDialogInformative() {
    setDialogProps({
      isOpen: true,
      handleOk: async () => {
        setFlagToTriggerSubmit(true) // continue login process
      },
      title: t('mobile-apps.biometric-access.dialog-informative.title'),
      // 👆 'You chose not to enable biometric access'
      description: t('mobile-apps.biometric-access.dialog-informative.description'),
      // 👆 'If you change your mind you can always enable biometric access from the profile page.'
      okButtonText: t('mobile-apps.biometric-access.dialog-informative.ok-button'),
      //cancelButtonText: 'cancel',
      //handleCancel: async () => {},
      // 👆 2 lines commented on purpose, we don't want a cancel button in this case
      iconType: null,
    })
  }

  async function resetBiometricSettings() {
    await removePreferences(BIOMETRIC_ACCESS_ENABLED_KEY)
    dispatch(setEnabled(false))
    await removeStoredCreds()
    dispatch(setTryAutologin(false))
    setButtonProps({ ...buttonProps, showBtn: false })
  }

  /** checks if creds changed (stored vs current) */
  async function credsChanged() {
    const creds = await getStoredCreds()
    if (!creds) return true
    return !(creds.username.toLowerCase() === user.toLowerCase() && creds.password === password)
  }

  /** checks if user changed (stored vs current) */
  async function userChanged() {
    const creds = await getStoredCreds()
    if (!creds) return true
    return creds.username.toLowerCase() !== user.toLowerCase()
  }

  return { ButtonBiometry, buttonProps, DialogBiometry, dialogProps, aBiometricsDialogIsShown }
}

async function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}
