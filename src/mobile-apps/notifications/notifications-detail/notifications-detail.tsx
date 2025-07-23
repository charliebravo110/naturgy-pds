import React, { useEffect } from 'react'
import useStyles from './notifications-detail.styles'
import useNotificationsDetailLogic from './useNotificationsDetailLogic'
import { Grid } from '@material-ui/core'
import { Link, Redirect } from 'react-router-dom'
import BackIcon from '@material-ui/icons/ChevronLeft'
import { getNotificationPathRedirectTo } from '../../common/useCommonStuff'

// LCS: Importa la función - Wave 3
import { removeEmails, sendGAEvent } from '../../../core/utils/gtm';

export default function NotificationsDetailPage() {

  const { t, getNotification } = useNotificationsDetailLogic()
  const classes = useStyles({})

  const notification = getNotification()
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
  })

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
        <Link to={'/notifications'} className={classes.goBackContainer}>
          <Grid container alignItems='center'>
            <Grid item className={classes.goBackIcon}>
              <BackIcon />
            </Grid>
            <Grid item>
              {t('mobile-apps.notification-detail.back-button')}
            </Grid>
          </Grid>
        </Link>
      </Grid>
      <Grid item className={classes.gridItem}>
        {notification && (
          <div className={classes.notification}>
            <div className={`notification-date`}>
              {notification.timestamp}
            </div>
            <div className={`notification-title`}>
              {notification.title}
            </div>
            <div className={`notification-body`}>
              {notification.body}
            </div>
            {notification.redirect_to && (
              <Link
                to={getNotificationPathRedirectTo({ redirectTo: notification.redirect_to, search_value: notification.search_value })}
                className={'notification-action'}
              >{t('mobile-apps.notification-detail.action-button')}
              </Link>
            )}
          </div>)}
      </Grid>
    </Grid>
  )
}
