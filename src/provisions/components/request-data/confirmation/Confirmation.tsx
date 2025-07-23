import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Button from '../../../../common/components/button/Button'

import OKIcon from '../../../../assets/icons/aviso_ok.svg'
import KOIcon from '../../../../assets/icons/aviso_alerta_pop_up.svg'

import {
  setCurrentProvisionPreparedToSend
} from '../../../store/actions/ProvisionsActions'

import useStyles from './Confirmation.styles'
// LCS: Enviar evento de GdC a GA - Wave 3
import { getExpStatus, sendGAEvent, removeEmails } from '../../../../core/utils/gtm'

const Confirmation = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)

  const {
    dossierCod,
    setState
  } = props

  return (
    <Grid container justifyContent='center'>
      <Grid item xs={11} sm={12} >
        {
          (sessionStorage.getItem('errorDossierDocumento')) ?
          <Grid item className={classes.introMessage}>
            <img src={KOIcon} alt='' />
            <div className={classes.textBlock}>
              <p>{t('provisions.newProvision.requestData.confirmation.error1')}<b>{t('provisions.newProvision.requestData.confirmation.error2')}</b></p>
              <p>{t('provisions.newProvision.requestData.confirmation.error3')}</p>
            </div>
          </Grid>
          :
          <Grid item className={classes.introMessage}>
            <img src={OKIcon} alt='' />
            <div className={classes.textBlock}>
              <p>{t('provisions.newProvision.requestData.confirmation.yourData')}</p>
              <p>{t('provisions.newProvision.requestData.confirmation.yourCode')}</p>
            </div>
          </Grid>
        }
        <Grid item justifyContent='center' alignItems='center' xs={12} className={classes.dossierCodWrapper} >
          <b>{t('provisions.newProvision.requestData.confirmation.dossierCod')}</b>
          <div className={classes.dossierCod}>{dossierCod ? dossierCod : currentProvision.dossierCod}</div>
        </Grid>

        <Grid container alignItems='center' direction='column' item className={classes.confirmationMessage} >
          <div className={classes.textBlock}>
            <p>{t('provisions.newProvision.requestData.confirmation.mail')}</p>
            <p>{t('provisions.newProvision.requestData.confirmation.futureQueries')}</p>
            <p>{t('provisions.newProvision.requestData.confirmation.documents')}</p>
          </div>
          <div className={classes.textBlock}>
            <b>{t('provisions.newProvision.requestData.confirmation.continue')}</b>
          </div>
          <div className={classes.buttonBlock}>
            <Button
              text={t('common.buttons.continue')}
              color='primary'
              size='large'
              variant='contained'
              onClick={() => {
                // LCS: Enviar evento de GdC a GA - Wave 3
                sendGAEvent({
                  event: 'request_funnel',
                  section_name: 'mi conexion a la red',
                  subsection_name: 'detalle de solicitud',
                  title_screen: 'tus datos se han enviados correctamente',
                  click_text: 'continuar',
                  element_type: 'consulta de informacion',
                  page_url: removeEmails(window.location.href),
                  request_type: 'quiero una nueva conexion a la red',
                  request_step_name: 'datos de la solicitud',
                  request_number:  currentProvision.dossierCod ? currentProvision.dossierCod : 'no aplica',
                  request_status: currentProvision.dossierStatusId ? getExpStatus(currentProvision.dossierStatusId) : 'no aplica',
                  tab_name: 'mi conexion a la red',
                  browsing_type: sessionStorage.getItem('browsing_type')
                })

                dispatch(setCurrentProvisionPreparedToSend(false))

                setState(3)
              }}
            />
          </div>
          <div className={classes.textBlock}>
            <p className={classes.greyText}>{t('provisions.newProvision.requestData.confirmation.data')}</p>
          </div>
        </Grid>
      </Grid>
    </ Grid>
  )
}

export default Confirmation