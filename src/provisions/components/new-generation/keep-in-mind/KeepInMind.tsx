import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Button from '../../../../common/components/button/Button'

import LegalDeadlinesDialog from '../../legalDeadlines/LegalDeadlinesDialog'

import RequestData from '../../../../assets/icons/ten_en_cuenta_1.svg'
import Budget from '../../../../assets/icons/ten_en_cuenta_2.svg'
import Payment from '../../../../assets/icons/ten_en_cuenta_3.svg'
import RequestExecution from '../../../../assets/icons/ten_en_cuenta_4.svg'
import RequestClose from '../../../../assets/icons/ten_en_cuenta_5.svg'

import { adminCheck } from '../../../../common/lib/ValidationLib'
import { SecurityHOC } from '../../../../common/HOC/SecurityHOC'

import useStyles from './KeepInMind.styles'

// LCS: Importa la función - Wave 2
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm'



const KeepInMind = (props: any) => {
  const classes = useStyles({})
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { t } = useTranslation()

  const [ popupLegalDeadlines, setPopupLegalDeadlines ] = useState(false)
  

  /* 
    Comprobación de US_CC
  */
  useEffect(() => { adminCheck() && props.history.push('/provisions') }, [])
 
  

  function getSteps() {
    return [
      t('provisions.newProvision.keepInMind.steps.requestData'),
      t('provisions.newProvision.keepInMind.steps.connectionSolution'),
      t('provisions.newProvision.keepInMind.steps.payment'),
      t('provisions.newProvision.keepInMind.steps.requestExecution'),
      t('provisions.newProvision.keepInMind.steps.requestClose')
    ]
  }

  const steps = getSteps()

  const handleLegalDeadlines = () => {
    setPopupLegalDeadlines(true)
  }

  useEffect (() => {
    // LCS: Enviar evento de GdC a GA - Wave 2
    sendGAEvent({
      event: 'view',
      content_group: 'nueva conexion a la red',
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

  const handleClickCancel = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'browsing',
      section_name: 'mi conexion a la red',
      title_screen: 'zonas de cobertura ufd',
      click_text: 'volver',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type: sessionStorage.getItem('request_type'),
      browsing_type: sessionStorage.getItem('browsing_type')
    });
    props.history.push('/provisions/what-to-do')
  }

  const handleClickContinue = () => {    
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'browsing',
      section_name: 'mi conexion a la red',
      title_screen: 'antes de empezar',
      click_text: 'continuar',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type: sessionStorage.getItem('request_type'),
      browsing_type: sessionStorage.getItem('browsing_type')
    });
    props.history.push('/provisions/new-generation/steps')
  }

  return (
    <div className={classes.block}>
      <Grid container className={classes.container}>
        <Grid item xs={11} md={10} className={classes.maxWidthForBigScreens}>
         <div className={classes.title}>{t('provisions.newProvision.keepInMind.title')}</div>

          <Grid justifyContent='center'>
            <Grid className={classes.subtitle}>{t('provisions.newProvision.keepInMind.subtitle')}</Grid>
            <Grid className={classes.text} justifyContent='center'>{t('provisions.newProvision.keepInMind.text')}</Grid>
          </Grid>

          <Grid container justifyContent='center' alignItems='center' className={classes.items}>
            <Grid item className={classes.item} lg='auto' md={12} sm={12} xs={12}><img src={RequestData} alt='' /> </Grid>
            {mobile && <span className={classes.step}>{'1. ' + steps[0]}</span>}
            <Grid item className={classes.item} lg='auto' md={12} sm={12} xs={12}><img src={Budget} alt='' /></Grid>
            {mobile && <span className={classes.step}>{'2. ' + steps[1]}</span>}
            <Grid item className={classes.item} lg='auto' md={12} sm={12} xs={12}><img src={Payment} alt='' /></Grid>
            {mobile && <span className={classes.step}>{'3. ' + steps[2]}</span>}
            <Grid item className={classes.item} lg='auto' md={12} sm={12} xs={12}><img src={RequestExecution} alt='' /></Grid>
            {mobile && <span className={classes.step}>{'4. ' + steps[3]}</span>}
            <Grid item className={classes.item} lg='auto' md={12} sm={12} xs={12}><img src={RequestClose} alt='' /></Grid>
            {mobile && <span className={classes.step}>{'5. ' + steps[4]}</span>}
          </Grid>
          {
            !mobile &&
              <Grid container justifyContent='center' className={classes.stepper}>
                <div className={classes.root}>
                  <Stepper alternativeLabel>
                    {steps.map((label, index) => (
                      <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </div>
              </Grid>
          }

          <Grid container justifyContent='center'>
            <Grid item className={classes.legalDeadlines} onClick={handleLegalDeadlines}>{t('provisions.newProvision.keepInMind.legalDeadlines')}</Grid>
          </Grid>

          <LegalDeadlinesDialog
            popup={popupLegalDeadlines}
            setPopup={setPopupLegalDeadlines}
          />

          <Grid container className={classes.buttons}>
            <Button
              text={t('common.buttons.return')}
              color='inherit'
              size='large'
              variant='contained'
              onClick={() => { handleClickCancel() }}
            />

            <Button
              text={t('common.buttons.continue')}
              color='primary'
              size='large'
              variant='contained'
              onClick={() => { handleClickContinue() }}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default SecurityHOC(KeepInMind)
