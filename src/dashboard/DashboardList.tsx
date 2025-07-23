import React, { useEffect } from 'react'

import Grid from '@material-ui/core/Grid'

import Box from './box/Box'
import { SecurityHOC } from '../common/HOC/SecurityHOC'

import useStyles from './DashboardList.styles'

// LCS: Importa la función - Wave 2
import { removeEmails, sendGAEvent} from '../core/utils/gtm'

const DashboardList = () => {
  
  const classes = useStyles({})

    useEffect(() => {
    try {
      console.log("Cargando dashboard...");
      console.log()
      // LCS: Enviar evento de GdC a GA - Wave 2
      sendGAEvent({
        event: 'view',
        content_group: 'inicio',
        page_url: removeEmails(window.location.href),
        user_id: sessionStorage.getItem('id'),
        previous_path: document.referrer ? document.referrer : removeEmails(sessionStorage.getItem("previousPage")),
        user_type: sessionStorage.getItem('user_type'),
        browsing_type: sessionStorage.getItem('browsing_type'),
        element_type: 'medicion de pagina',
        ga_client_id: sessionStorage.getItem('ga_client_id'),
        cups: 'no aplica',
        supply_type: 'no aplica'
      });
      sessionStorage.setItem("previousPage", window.location.href);
    } catch (error) {
      // LCS: Enviar evento a GA - Wave 2
      sendGAEvent({
        event: 'react_error',
        info:{
          error_message: 'Fallo de carga del dashboard',
          error: error,
          reactComponent: 'DashboardList.tsx - useEffect',
        }
      });
    }
  },[])
  
  return (
    <Grid container className={classes.container}>
        <Grid item xs={11} md={10}>
          <div className={classes.maxWidthForBigScreens}>
            <Box />
          </div>
        </Grid>
    </Grid>
  )
}

export default SecurityHOC(DashboardList)
