import React from 'react'
import { Badge, Grid } from '@material-ui/core'
import Button from '../../../common/components/button/Button'
import Spinner from '../../../common/components/spinner/Spinner'
import Switch from '../../common/components/switch/Switch'
import useProfileSectionNotificationsLogic from './useProfileSectionNotificationsLogic'
import { Link } from 'react-router-dom'
import ArrowLink from '../../../assets/icons/flecha_enlace.svg'

/** section to toggle and save user's push notifications preferences */
export default function ProfileSectionNotifications() {
  const {
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
  } = useProfileSectionNotificationsLogic()

  return showMe === false ? null : (
    <>
      {saving && <Spinner fixed={true} />}
      <Grid container className={classes.container}>
        <Grid item className={classes.content}>
          <h3>{t('mobile-apps.notifications.heading')}</h3>
          <Link to='/notifications'>
            <Grid item>{t('mobile-apps.notifications.link')}</Grid>
            <Grid item>
              <img src={ArrowLink} alt='' />
            </Grid>
            <Grid item>
              <Badge badgeContent={unreadNotifications} color='error' overlap='circular' max={999}/>
            </Grid>
          </Link>
          <p>{t('mobile-apps.notifications.subheading')}</p>
          <hr className={classes.hrStyled} />
          <div className={[classes.toggleGroup, classes.switchAll].join(' ')}>
            <label htmlFor='switch-all'>{t('mobile-apps.notifications.switch-all')}</label>
            <Switch id='switch-all' onChange={handleEnableAllChange} checked={allTurnedOn} disabled={saving} />
          </div>
          {itemsUI.map(({ name, title, description, checked, disabled }) => (
            <div key={name} className={classes.toggleGroup}>
              <div className={classes.labelArea}>
                <label htmlFor={name}>{title}</label> <br />
                <span>{description}</span>
              </div>
              <Switch id={name} onChange={handleToggle} checked={checked} disabled={disabled || saving} />
            </div>
          ))}
          <Button
            fullWidth
            color='primary'
            variant='contained'
            onClick={handleSave}
            disabled={buttonDisabled || saving}
            text={t('mobile-apps.notifications.save-button')}
          />
        </Grid>
      </Grid>
    </>
  )
}
