import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import { adminCheck } from '../../../../common/lib/ValidationLib'
import { SecurityHOC } from '../../../../common/HOC/SecurityHOC'

import Button from '../../../../common/components/button/Button'

import useStyles from './CoverageArea.styles'

// LCS: Importa la función - Wave 2
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm'

const CoverageArea = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  /*
    Comprobación de US_CC
  */
  useEffect(() => { adminCheck() && props.history.push('/provisions') }, [])

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
      request_type: 'quiero una nueva conexion a la red',
      browsing_type: sessionStorage.getItem('browsing_type')
    });
    props.history.push('/provisions/what-to-do')
  }

  const handleClickContinue = () => {    
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'browsing',
      section_name: 'mi conexion a la red',
      title_screen: 'zonas de cobertura ufd',
      click_text: 'continuar',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type: 'quiero una nueva conexion a la red',
      browsing_type: sessionStorage.getItem('browsing_type')
    });
    props.history.push('/provisions/new-provision/keep-in-mind')
  }

  return (
    <div className={classes.block}>
      <Grid container className={classes.container}>
        <Grid item xs={11} md={10} className={classes.maxWidthForBigScreens}>
          <div className={classes.title}>{t('provisions.coverageArea.title')}</div>

          <div className={classes.description}>{t('provisions.coverageArea.description')}</div>

          <iframe
            className={classes.map}
            //src='https://gnf.maps.arcgis.com/apps/Embed/index.html?webmap=842cff19e34a46149ce0af45c3734c14&amp;extent=-15.6209,35.2804,7.1615,45.2497&amp;zoom=true&amp;previewImage=false&amp;scale=true&amp;disable_scroll=true&amp;theme=light'
            //src='https://gnf.maps.arcgis.com/apps/webappviewer/index.html?id=77814441fb5a4bb7943dc363be9ee7b3&amp;extent=-15.6209,35.2804,7.1615,45.2497&amp;zoom=true&amp;previewImage=false&amp;scale=true&amp;disable_scroll=true&amp;theme=light'
            src='https://gisoperaciones.ufd.es/portal/apps/webappviewer/index.html?id=fdc334a4960c4718bfe6f3e25597db7b&amp;extent=-15.6209,35.2804,7.1615,45.2497&amp;zoom=true&amp;previewImage=false&amp;scale=true&amp;disable_scroll=true&amp;theme=light'

            title='coverage-area'
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

export default SecurityHOC(CoverageArea)
