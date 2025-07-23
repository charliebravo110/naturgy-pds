import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'

import IconTextButton from '../../../../common/components/icon-text-button/IconTextButton'
import AddIcon from '../../../../assets/icons/mas.svg'
import DelegateSupplyIcon from '../../../../assets/icons/delegar_suministro_en_gestores.svg'
import InfoIcon from '../../../../assets/icons/info.svg'
import ArrowTooltip from '../../../../common/components/tooltip/arrow/ArrowTooltip'
import IconAlertas from '../../../../assets/icons/Icon_Alertas.svg'

import useStyles from './Actions.styles'
import { createTheme, MuiThemeProvider } from '@material-ui/core'

// LCS: Importa la función - Wave 2
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm';

const Actions = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  let roles = sessionStorage.getItem('userRoles') || ''
  let rolesArray = roles.split(',')

  const theme = createTheme({
    overrides: {
      MuiTooltip: {
        tooltip: {
          fontSize: '1em',
          backgroundColor:'white !important',
          color:'#5985a2 !important',
          padding:'15px !important',
          boxShadow: '2px 2px 2px 2px #e2e2e2 !important',
          maxWidth:'300px !important',
          fontFamily: 'FSEmeric',
          textAlign:'center'
        },
        tooltipArrow: {
          fontSize: '1em',
          backgroundColor:'white !important',
          color:'#5985a2 !important',
          padding:'15px !important',
          boxShadow: '2px 2px 2px 2px #e2e2e2 !important',
          maxWidth:'300px !important',
          fontFamily: 'FSEmeric',
          textAlign:'center'
        }
        
      }
    }
  });

  const handleClickMyAlerts = () => {
    // LCS: Enviar evento de GdC a GA - Wave 2
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      click_text: 'mis alertas',
      element_type: 'consulta de informacion',
      click_url: window.location.host + '/supplies/alerts',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type')
    });
  }

  const handleClickMyManagers = () => {
    // LCS: Enviar evento de GdC a GA - Wave 2
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      click_text: 'mis gestores',
      element_type: 'consulta de informacion',
      click_url: window.location.host + '/managers',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type')
    });
  }

  const handleClickMyAdvisors = () => {
    // LCS: Enviar evento de GdC a GA - Wave 2
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      click_text: 'mis asesores',
      element_type: 'consulta de informacion',
      click_url: window.location.host + '/consultants',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type')
    });
  }

  return (
    <Grid container spacing={2} className={classes.actions}>
      <Grid item md='auto' sm='auto' xs={12}>
        {
          !rolesArray.includes('US_SUPPLYPOINT_CLIENT') &&
            <Grid container>
              <Link to='/landing' className={classes.newServiceLink}>
                <IconTextButton icon={<img src={AddIcon} className={classes.iconTextButton} alt='' />} text={t('delegations.suppliesList.linkSupply')} />
              </Link>
            </Grid>
        }
      </Grid>
     
      <Grid item>
        <Grid container spacing={2} >
        <MuiThemeProvider theme={theme}>
          <Grid item md='auto' sm='auto' xs={12} className={`${classes.delegatesButton} ${classes.marginRight}`} >
          <Link to='supplies/alerts' onClick={handleClickMyAlerts}>
              <IconTextButton icon={<img src={IconAlertas} className={classes.textIconButton} alt='' />} text={t('supplies.dialogAlertConfirm.myAlerts')} />
            </Link> 
            <ArrowTooltip title={t('supplies.dialogAlertConfirm.alertIcon')} placement='bottom'>
              <img src={InfoIcon} alt='' className={classes.delegatesInfoButton} />
            </ArrowTooltip>
          </Grid>
          <Grid item md='auto' sm='auto' xs={12} className={`${classes.delegatesButton} ${classes.marginRight}`} >
            <Link to='/managers' onClick={handleClickMyManagers}>
              <IconTextButton icon={<img src={DelegateSupplyIcon} className={classes.textIconButton} alt='' />} text={t('delegates.supplies.managersLink')} />
            </Link>
            <ArrowTooltip title={t('delegates.supplies.managersTooltip')} placement='right'>
              <img src={InfoIcon} alt='' className={classes.delegatesInfoButton} />
            </ArrowTooltip>
          </Grid>

          <Grid item md='auto' sm='auto' xs={12} className={`${classes.delegatesButton} ${classes.marginRight}`}>
            <Link to='/consultants' onClick={handleClickMyAdvisors}>
              <IconTextButton icon={<img src={DelegateSupplyIcon} className={classes.textIconButton} alt='' />} text={t('delegates.supplies.consultantsLink')} />
            </Link>
            <ArrowTooltip title={t('delegates.supplies.consultantsTooltip')} placement='right' >
              <img src={InfoIcon} alt='' className={classes.delegatesInfoButton} />
            </ArrowTooltip>
          </Grid>
       </MuiThemeProvider> </Grid>
      </Grid>
    </Grid>
  )
}

export default Actions
