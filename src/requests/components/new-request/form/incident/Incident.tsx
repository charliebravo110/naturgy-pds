import React from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../../../../../common/components/button/Button'

import Icon from '../../../../../assets/icons/info.svg'

import useStyles from './Incident.styles'
import { sendGAEvent } from '../../../../../core/utils/gtm'

const Incident = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const handleClickButton = () => {

   // window.location.href = ''
    window.open(
      'https://www.ufd.es/comunicar-el-estado-de-una-instalacion-de-ufd', '_blank');

  }

  const sendGAEventIncident = ():any => {
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mis peticiones',
      subsection_name: 'nueva peticion',
      click_text: 'comunicar el estado de una instalacion de ufd',
      element_type: 'conversion de accion',
      page_url: window.location.href,
      request_type: 'quiero comunicar el estado de una instalacion de ufd',
      browsing_type: sessionStorage.getItem('browsing_type'),
    })
  }

  return (
    <div className={classes.container}>
      <img src={Icon} alt='' />

      <div className={classes.text}>{t('requests.newRequest.form.incident.text')}</div>

      <Button
        className={classes.button}
        text={t('requests.newRequest.form.incident.button')}
        color='primary'
        size='large'
        variant='contained'
        onClick={() => { sendGAEventIncident(); handleClickButton()}}
      />
    </div>
  )
}

export default Incident
