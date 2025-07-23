import React, { useEffect, useState } from 'react'
import useStyles from './notifications.styles'
import Grid from '@material-ui/core/Grid'
import { Notification } from './notifications.interface'
import useNotificationsLogic from './useNotificationsLogic'
import Input from '../../common/components/input/Input'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../common/store/reducers/MainReducer'
import { setNotifications } from './store/actions/NotificationsActions'
import { Redirect } from 'react-router-dom'
import SearchIcon from '@material-ui/icons/Search'

// LCS: Importa la función - Wave 3
import { removeEmails, sendGAEvent } from '../../core/utils/gtm';

export default function NotificationsPage() {

  const { t, getFilteredNotifications, markNotificationAsRead, goToNotificationDetail } = useNotificationsLogic()
  const classes = useStyles({})
  const dispatch = useDispatch()

  const [searchValue, setSearchValue] = useState('')
  const [filteredNotifications, setFilteredNotifications] = useState([])
  let notifications = useSelector((state: any) => state.notifications.list)
  const user = useSelector((state: AppState) => state.user.profile.documentNumber)
  const token = sessionStorage.getItem('token')

  useEffect(() => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'view',
      content_group: 'notificaciones',
      page_url: removeEmails(window.location.href),
      user_id: sessionStorage.getItem('id'),
      previous_path: removeEmails(sessionStorage.getItem("previousPage")),
      user_type: sessionStorage.getItem('user_type'),
      browsing_type: sessionStorage.getItem('browsing_type'),
      element_type: 'medicion de pagina',
      ga_client_id: sessionStorage.getItem('ga_client_id'),
      cups: 'no aplica',
      supply_type: 'no aplica'
    });
    sessionStorage.setItem("previousPage", window.location.href);
  },[])

  useEffect(() => {
    setFilteredNotifications(notifications)
  }, [notifications])

  const checkIfNotificationIsRead = (notification: Notification) => notification.ind_read === '1'

  /**
   * Update notifications list in storage
   * @param notification
   */
  const updateStorageNotification = async ({ notification }: { notification: Notification }) => {
    notifications = notifications.map((item: Notification) => {
      if (item.id === notification.id) {
        return notification
      }
      return item
    })
    dispatch(setNotifications(notifications))
  }

  const onNotificationClick = async ({ notification }: { notification: Notification }) => {
    if (!checkIfNotificationIsRead(notification)) {
      const updatedNotification = await markNotificationAsRead({
        user_id: notification.user_id,
        notification_id: notification.id,
        token,
      })
      if (updatedNotification.result.codResult === '0000' && updatedNotification.hasOwnProperty('id')) {
        await updateStorageNotification({ notification: updatedNotification })
      } else {
        console.error('Error updating notification', notification)
      }
    }
    goToNotificationDetail({ notification })
  }

  const handleSearchNotificationInputChange = ({ target }) => {
    setSearchValue(target.value)
    setFilteredNotifications(getFilteredNotifications({ searchValue: target.value, notifications }))
  }

  if (!token) {
    return <Redirect to='/login' />
  }

  return (
    <Grid
      container
      direction='column'
      justifyContent='space-between'
      alignItems='center'
      className={classes.container}
    >
      <Grid item className={classes.gridItem}>
        <div
          className={`${classes.title}`}
        >{t('mobile-apps.notification-list.title')}
        </div>

        {/*Render notifications when notifications variable is not []*/}
        {notifications.length > 0 && (
          <div>
            <form name='search_form'>
              <Input
                label={t('mobile-apps.notification-list.search-placeholder')}
                name='search'
                className={classes.textField}
                onChange={handleSearchNotificationInputChange}
                value={searchValue}
                InputProps={{
                  endAdornment: (
                    <div className={classes.iconInput}>
                      <SearchIcon />
                    </div>
                  )
                }}
              />
            </form>
            <div className={`${classes.notifications}`}>
              {filteredNotifications.map((notification: Notification, idx) => (
                <div
                  key={`notification-${notification.id}-${idx}`}
                  className={`${classes.notification} ${notification.ind_read === '0' ? 'unread' : 'read'}`}
                  onClick={() => onNotificationClick({ notification })}
                >
                  <div className={`status`}>
                    <span className={`status-icon`} />
                  </div>
                  <div>
                    <div className={`notification-date`}>
                      {notification.timestamp}
                    </div>
                    <div className={`notification-title`}>
                      {notification.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/*Render empty search message when filteredNotifications variable is []*/}
        {notifications.length > 0 && filteredNotifications.length === 0 && (
          <div className={`${classes.emptyMessage}`}>
            {t('mobile-apps.notification-list.empty-search')}
          </div>
        )}

        {/*Render empty message when notifications variable is []*/}
        {notifications.length === 0 && (
          <div className={`${classes.emptyMessage}`}>
            {t('mobile-apps.notification-list.empty-list')}
          </div>
        )}
      </Grid>
    </Grid>
  )
}
