import React from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../../../../../common/components/button/Button'

import Icon from '../../../../../assets/icons/info.svg'

import useStyles from './AnonymousAlert.styles'
import { sendGAEvent } from '../../../../../core/utils/gtm'

const AnonymousAlert = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const handleClickButton = () => {

    window.location.href = 'https://www.ufd.es/denuncia-de-irregularidades'

  }

  const sendGAEventAnonymous = ():any => {
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mis peticiones',
      subsection_name: 'nueva peticion',
      click_text: 'cerrar sesion e ir a la web',
      element_type: 'conversion de accion',
      page_url: window.location.href,
      request_type: 'quiero denunciar un fraude',
      request_step: '2',
      request_step_name: 'informar de manera anonima',
      browsing_type: sessionStorage.getItem('browsing_type'),
    })
  }

  return (
    <div className={classes.container}>
      <img src={Icon} alt='' />

      <div className={classes.text}>{t('requests.newRequest.form.anonymousAlert.text')}</div>

      <Button
        className={classes.button}
        text={t('requests.newRequest.form.anonymousAlert.button')}
        color='primary'
        size='large'
        variant='contained'
        onClick={() => { sendGAEventAnonymous(); handleClickButton()}}
      />
    </div>
  )
}

export default AnonymousAlert
