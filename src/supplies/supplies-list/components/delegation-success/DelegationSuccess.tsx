import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Button from '../../../../common/components/button/Button'
import OkIcon from '../../../../assets/icons/aviso_ok.svg'

import useStyles from './DelegationSuccess.styles'

// LCS: Importar la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm'

const SignUpSuccess = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const handleButton = () => {
    props.history.push('/login')
  }
    
  useEffect(() => {
      // LCS: Enviar evento de GdC a GA - Wave 3
      sendGAEvent({
      event: 'view',
      content_group: props.delegateType === 'US_MANAGER' ? 'mis gestores' : 'mis asesores',
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
            <Grid item className={classes.title}>{t('delegations.delegationSuccess.title')}</Grid>
          </Grid>

          <Grid item className={classes.text} xs={12}>{t('delegations.delegationSuccess.description')}</Grid>

          <Grid container justifyContent='center'>
            <Button
              className={classes.button}
              text={t('delegations.delegationSuccess.button')}
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

export default SignUpSuccess
