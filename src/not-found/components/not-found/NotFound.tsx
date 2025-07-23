import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Button from '../../../common/components/button/Button'
import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg'

import useStyles from './NotFound.styles'

// LCS: Importa la función - Wave 3
import { removeEmails, sendGAEvent } from '../../../core/utils/gtm';

const NotFound = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  let token = sessionStorage.getItem('token') || ''

  useEffect(() => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'view',
      content_group: 'not found',
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
  
  const handleClickButton = () => {
    props.history.push('/login')
  }

  return (
    <div className={`${classes.block} ${token ? 'logged' : ''}`}>
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
          <img src={AlertIcon} alt='' />

          <Grid item className={classes.title}>{t('notFound.title')}</Grid>

          <Grid item className={classes.text}>{t('notFound.description')}</Grid>

          <Grid container justifyContent='center'>
            <Button
              className={classes.button}
              text={t('notFound.button')}
              color='primary'
              size='large'
              variant='contained'
              onClick={handleClickButton}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default NotFound
