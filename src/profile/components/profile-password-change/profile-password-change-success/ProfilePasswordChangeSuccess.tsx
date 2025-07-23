import React, { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import OkIcon from '../../../../assets/icons/aviso_ok.svg'
import ChangePasswordIcon from '../../../../assets/icons/cambiar_contrasenia.svg'
import Button from '../../../../common/components/button/Button'

import useStyles from './ProfilePasswordChangeSuccess.styles'

// LCS: Importa la función - Wave 3
import { removeEmails, sendGAEvent } from '../../../../core/utils/gtm';

const ProfilePasswordChangeSuccess = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  useEffect(() => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'view',
      content_group: 'mi perfil',
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

  const handleContinue = () => {
    props.history.push('/profile')
  }

  const getBodyContainer = () => {
    return (
      <Grid
        container
        direction='column'
        justifyContent='center'
        alignItems='center'
        className={classes.successMessageBody}
      >
        <img src={OkIcon} className={classes.okIcon} alt='' />

        <Grid item>{t('profile.profilePasswordChangeSuccess.successfulPassword')}</Grid>
      </Grid>
    )
  }

  const getButtonsContainer = () => {
    return (
      <Grid container justifyContent='center' alignItems='center'>
        <Button
          className={classes.button}
          text={t('common.buttons.continue')}
          color='primary'
          size='large'
          variant='contained'
          onClick={handleContinue}
        />
      </Grid>
    )
  }

  return (
    <Fragment>
      <Grid container justifyContent='center' alignItems='center' className={classes.container}>
        <Grid container item direction='row' xs={11} sm={11} md={10} className={classes.profileBlock}>
          <Grid container item xs={12} sm={12} md={2} className={classes.profileBlockLeft} />

          <Grid
            container
            item
            xs={12}
            sm={12}
            md={10}
            justifyContent='space-between'
            className={classes.profileBlockRight}
          >
            <Grid container direction='row'>
              <Grid item xs={1} sm={1} md={1} className={classes.avatarContainer}>
                <img src={ChangePasswordIcon} className={classes.avatar} alt='' />
              </Grid>

              <Grid item xs={8} sm={8} md={11} className={classes.titleContainer}>
                <Grid item className={classes.title}>
                  {t('profile.profilePasswordChangeSuccess.changePassword')}
                </Grid>
              </Grid>
            </Grid>

            {getBodyContainer()}

            {getButtonsContainer()}
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default ProfilePasswordChangeSuccess
