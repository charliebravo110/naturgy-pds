import { useEffect, useState } from 'react'
import { isWeb } from '../../common/detectPlatform'
import useStyles from './ProfileSectionNotifications.styles'
import { ItemUI, UserNotificationPreferences } from './interfaces'
import { useTranslation } from 'react-i18next'
import { NOTIFICATION_NAME_LIST } from '../../common/configAndConstants'
import NotificationsPreferencesService from './NotificationsPreferencesService'
import { useSelector } from 'react-redux'
// LCS: Importa la función - Wave 3
import { sendGAEvent } from '../../../core/utils/gtm';

/** section to toggle several notification preferences */
export default function useProfileSectionNotificationsLogic() {
  const { t } = useTranslation()
  const classes = useStyles({})

  const [dataLoading, setDataLoading] = useState(true)
  const [showMe, setShowMe] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [allTurnedOn, setAllTurnedOn] = useState(false)
  const [saving, setSaving] = useState(false)
  const [userNotifPrefs, setUserNotifPrefs] = useState<UserNotificationPreferences | null>(null)
  /** array of items for the user interface, same length as NOTIFICATION_NAME_LIST,
   *  converting userNotificationPreferences.items to ItemUI[] makes it easier to work with, both here in the logic and in the UI */
  const [itemsUI, setItemsUI] = useState<ItemUI[]>([])

  const [unreadNotifications, setUnreadNotifications] = useState([])
  const notifications = useSelector((state: any) => state.notifications.list)
  

  // section shown only for mobile apps and after data is ready
  useEffect(() => {
    if (isWeb() || dataLoading || itemsUI.length === 0) return

    setShowMe(true)
  }, [dataLoading, itemsUI])

  // load and set data
  useEffect(() => {
    if (!dataLoading) return

    loadAndInitData().then(() => setDataLoading(false))

    async function loadAndInitData() {
      // get userNotificationPreferences from backend
      const service = new NotificationsPreferencesService()
      const initialUserNotifPrefs = await service.readAndAdaptUserNotificationsPreferences()
      let initialItemsUI = convertUserPreferencesToItemsUI(initialUserNotifPrefs)
      const allArrivedChecked = initialItemsUI.every((item) => item.checked)
      if (allArrivedChecked) {
        // REMINDER: according to the (weird) business/designers logic, if all items are checked, then all items appear disabled (see figma)
        initialItemsUI = initialItemsUI.map((item) => ({ ...item, disabled: true }))
      }
      setAllTurnedOn(allArrivedChecked)
      setUserNotifPrefs(initialUserNotifPrefs)
      setItemsUI(initialItemsUI)
    }
  }, [])

  // when itemsUI or userNotifPrefs change...
  useEffect(() => {
    // ...reflect itemsUI new state in enableAll
    const allAreChecked = itemsUI.every((item) => item.checked)
    if (allTurnedOn !== allAreChecked) setAllTurnedOn(allAreChecked)

    // ...enable/disable save button depending on if there are changes
    const shouldDisableButton = false === thereAreChanges()
    if (buttonDisabled !== shouldDisableButton) setButtonDisabled(shouldDisableButton)
  }, [itemsUI, userNotifPrefs])

  // when allTurnedOn becomes true (both by user's action or by code), all items must be checked and disabled (if not already).
  useEffect(() => {
    if (dataLoading || !allTurnedOn) return

    const newItemsUI = itemsUI.map((item) => ({ ...item, checked: true, disabled: true }))
    setItemsUI(newItemsUI)
  }, [allTurnedOn])

  /** user toggled a itemsUI switch */
  async function handleToggle(e) {
    const newValue = e.target.checked
    const name = e.target.id
    const newItemsUI = itemsUI.map((item) => (item.name === name ? { ...item, checked: newValue } : item))
    setItemsUI(newItemsUI)
  }

  /** user toggled allTurnedOn switch */
  async function handleEnableAllChange(e) {
    const newValue = e.target.checked
    // when allTurnedOn becomes true (both by user's action or by code), all items must be checked and disabled (if not already).
    // 👆this is done in useEffect, so here we only need to handle the opposite case
    // when allTurnedOn becomes false by user's action, all items must be unchecked and enabled (if not already).
    // when allTurnedOn becomes false by code, do nothing.
    // REMINDER: according to the (weird) business/designers logic, if all items are checked, then all items appear disabled (see figma)

    if (newValue === false) {
      const newItemsUI = itemsUI.map((item) => ({ ...item, checked: false, disabled: false }))
      // update onfy if needed
      if (JSON.stringify(newItemsUI) !== JSON.stringify(itemsUI)) setItemsUI(newItemsUI)
    }

    if (newValue !== allTurnedOn) setAllTurnedOn(newValue)
  }

  /** user pressed save button */
  async function handleSave() {
    setSaving(true)

    const service = new NotificationsPreferencesService()
    const newUserNotifPrefs = convertItemsUIToUserPreferences(itemsUI)
    const success = await service.updateUserNotificationsPreferencesAndReplyBoolean(newUserNotifPrefs)
    if (success) setUserNotifPrefs(newUserNotifPrefs)

    setSaving(false)
    
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'notifications',
      click_text: 'guardar',
      browsing_type: sessionStorage.getItem('browsing_type'),
      element_type: 'medicion de pagina',
      type_notification_enabled: 'nuevo cups disponible, finalizacion de instalacion particulares, pendiente de fecha resolucion de anomalidades',
      type_notification_disabled: 'no aplica'
    });
  }

  /** opposite of convertItemsUIToUserPreferences */
  function convertUserPreferencesToItemsUI(userNotifPrefs: UserNotificationPreferences): ItemUI[] {
    //zero trust principle: if the backend sends us something we don't expect, we ignore it
    return NOTIFICATION_NAME_LIST.map((name) => {
      const found = userNotifPrefs.items.find((item) => item.notification === name)
      return {
        name,
        title: t(`mobile-apps.notifications.${name}.title`),
        description: t(`mobile-apps.notifications.${name}.description`),
        checked: !found ? false : found.value === 'SI',
        disabled: false, // NOTE: the logic to enable/disable items is handled when values change
      }
    })
  }

  /** opposite of convertUserPreferencesToItemsUI */
  function convertItemsUIToUserPreferences(itemsUI: ItemUI[]): UserNotificationPreferences {
    return {
      items: itemsUI.map((item) => ({
        userId: userNotifPrefs.items[0].userId,
        notification: item.name,
        value: item.checked ? 'SI' : 'NO',
      })),
    } as UserNotificationPreferences
  }

  /** reflects if there are changes in the current (unsaved) values compared to the previous values (last values read from backend) */
  function thereAreChanges() {
    const currentPreferences = convertItemsUIToUserPreferences(itemsUI).items
    return currentPreferences.some((current) => {
      const previous = userNotifPrefs.items.find((item) => item.notification === current.notification)
      if (!previous) return true
      return current.value !== previous.value
    })
  }

  // Manage number of unread notifications to show in profile
  useEffect(()=> {
    setUnreadNotifications(notifications.filter(notification => notification.ind_read === '0').length)
  }, [notifications])

  return {
    t,
    classes,
    showMe,
    itemsUI,
    handleToggle,
    handleEnableAllChange,
    allTurnedOn,
    handleSave,
    buttonDisabled,
    saving,
    unreadNotifications
  }
}
