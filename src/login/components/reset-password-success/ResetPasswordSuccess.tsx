import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Button from '../../../common/components/button/Button'
import OkIcon from '../../../assets/icons/aviso_ok.svg'

import useStyles from './ResetPasswordSuccess.styles'

// LCS: Importa la función - Wave 3
import { removeEmails, sendGAEvent } from '../../../core/utils/gtm';

const ResetPasswordSuccess = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const urlPrev = props.location.pathname

  const handleButton = () => {
    props.history.push('/login')
  }

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
    sessionStorage.setItem("previousPage", window.location.href);
  },[])

  console.log('E999513 ResetPasswordSuccess ')
  console.log('E999513 props: ', props)
  console.log('E999513 urlPrev: ', urlPrev)

  return (
    <div className={classes.block}>
      <Grid
        container
        className={classes.container}
      >
        <Grid
          container
          item
          className={classes.box}
          xs={12}
          sm={8}
          lg={5}
        >
          <img src={OkIcon} alt='' />

          <Grid
            container
            justifyContent='center'
            alignItems='baseline'
            direction='row'
          >
            <Grid item className={classes.title}>
              <span>{t('login.resetPasswordSuccess.span')}</span>
            </Grid>
          </Grid>

          {/* 
          // Texto a modificar item o item2 
          // item para mail e item2 para sms
          */}

          {urlPrev === '/reset-message' &&
            <Grid item className={classes.text} xs={12}>
              {t('login.resetPasswordSuccess.item')}
            </Grid>
          }

          {urlPrev === '/reset-message2' &&
            <Grid item className={classes.text} xs={12}>
              {t('login.resetPasswordSuccess.item2')}
            </Grid>
          }

          <Grid container justifyContent='center'>
            <Button
              className={classes.button}
              text={t('login.resetPasswordSuccess.button')}
              color='primary'
              size='large'
              variant='contained'
              onClick={handleButton}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default ResetPasswordSuccess
