import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'

import AlertIcon from '../../../assets/icons/misdocumentos_rechazado.svg'
import Button from '../../../common/components/button/Button'

import useStyles from './SignUpError.styles'

// LCS: Importa la función - Wave 3
import { sendGAEvent, getBrowsing_type, getGAClientId, removeEmails } from '../../../core/utils/gtm';

const SignUpNotCreate = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  useEffect(() => {    
    // LCS: Enviar evento de GdC a GA - Wave 3
    getBrowsing_type()
    getGAClientId()
    sendGAEvent({
      event: 'view',
      content_group: 'registro',
      page_url: removeEmails(window.location.href),
      user_id: 'no aplica',
      previous_path: document.referrer ? document.referrer : removeEmails(sessionStorage.getItem("previousPage")),
      user_type: 'no aplica',
      browsing_type: sessionStorage.getItem('browsing_type'),
      element_type: 'medicion de pagina',
      ga_client_id: sessionStorage.getItem('ga_client_id'),
      cups: 'no aplica',
      supply_type: 'no aplica'
    });
    sessionStorage.setItem("previousPage", window.location.href);
  },[])

  const handleButton = () => {
    props.history.push('/login')
  }
  
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
          <img src={AlertIcon} alt='' style={{ width: '52px' }} />
          
          <Grid item className={classes.title}>{t('signUp.signUpError.item8')}</Grid>

          <Grid item className={classes.text}>{t('signUp.signUpError.item5')}</Grid>
          <Grid container justifyContent='center'>
            <Button
              className={classes.button}
              text={t('signUp.signUpError.button')}
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

export default SignUpNotCreate
