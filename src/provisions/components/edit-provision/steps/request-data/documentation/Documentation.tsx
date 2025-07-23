import React from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@material-ui/core/Typography'

import Grid from '@material-ui/core/Grid'
import Button from '../../../../../../common/components/button/Button'

import Ilustracion from '../../../../../../assets/icons/ten_a_mano.svg'

import useStyles from './Documentation.styles'

// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../../../../core/utils/gtm'

const Documentation = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    activeComponent,
    setActiveComponent
  } = props

  const handleClickReturn = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    let request_type = sessionStorage.getItem('request_type')
    let auxTypology = ''//getTypologySelfConsumption(provisions.dossierSubtype)
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      title_screen: 'modificacion de suministros',
      click_text: 'volver',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type: request_type,
      request_step_name: 'datos de la solicitud',
      browsing_type: sessionStorage.getItem('browsing_type')
    })
    props.history.push('/provisions/edit-provision/keep-in-mind')
  }

  const handleClickContinue = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    let request_type = sessionStorage.getItem('request_type')
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      title_screen: 'modificacion de suministros',
      click_text: 'continuar',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type: request_type,
      request_step_name: 'datos de la solicitud',
      browsing_type: sessionStorage.getItem('browsing_type')
    })
    setActiveComponent(activeComponent + 1)
  }

  return (
    <>
      <Grid container className={classes.container} justifyContent='center'>

        <Grid item xs={11} sm={11} md={7} justifyContent='center'>
          <div className={classes.title}>{t('provisions.editProvision.requestData.documentation.title')}</div>
          <Grid justifyContent='center'>
            <Grid className={classes.text}>{t('provisions.newProvision.requestData.documentation.text')}</Grid>
          </Grid>
        </Grid>
          <Grid container>
            <Grid className={classes.containerDocumentation} container item md={10} sm={12} xs={12}>
              <Grid item md={6} sm={6} xs={12}>
                <img className={classes.img} src={Ilustracion} alt='' />
              </Grid>

              <Grid item md={6} sm={6} xs={12} className={classes.openExpedientSupply}>
                <Typography className={classes.textBlueBold}>{t('provisions.newProvision.requestData.documentation.documentation')}</Typography>

                <Typography className={classes.textOrange}>{t('provisions.editProvision.requestData.documentation.title')}</Typography>

                <Typography className={classes.messageInfoExpedientSupply}>
                  <span>
                    {t('provisions.editProvision.requestData.documentation.textExpedientSupply')}
                    <a className={classes.linkDocumentation} href={t('provisions.editProvision.requestData.documentation.textExpedientSupplyUrl')} target='_blank'>
                      {t('provisions.editProvision.requestData.documentation.textExpedientSupplyUrlText')}
                    </a>
                    {t('provisions.editProvision.requestData.documentation.textExpedientSupplyFinish')}
                  </span>
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid container className={classes.button}>
            <Button
              text={t('common.buttons.return')}
              color='inherit'
              size='large'
              variant='contained'
              onClick={handleClickReturn}
            />

            <Button
              text={t('common.buttons.continue')}
              color='primary'
              size='large'
              variant='contained'
              onClick={handleClickContinue}
            />

        </Grid>
      </Grid>
    </>
  )
}
export default Documentation
