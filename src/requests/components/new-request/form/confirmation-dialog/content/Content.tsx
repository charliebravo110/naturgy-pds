import React from 'react'
import { useTranslation } from 'react-i18next'

import { DialogContent } from '@material-ui/core'

import CloseIcon from '../../../../../../assets/icons/cerrar.svg'
import AlertIcon from '../../../../../../assets/icons/aviso_alerta_pop_up.svg'

import useStyles from './Content.styles'

const Content = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const { setVisible } = props

  return (
    <DialogContent className={classes.container}>
      <img className={classes.closeIcon} src={CloseIcon} alt='' onClick={() => setVisible(false)} />

      <div className={classes.content}>
        <img src={AlertIcon} alt='' />

        <div className={classes.title}>{t('requests.newRequest.form.confirmationDialog.title')}</div>

        <div className={classes.description}>{t('requests.newRequest.form.confirmationDialog.description')} <a href='http://www.ufd.es/formulario-de-atencion-al-cliente/' target='_blank'  rel='noopener noreferrer'>{t('requests.newRequest.form.confirmationDialog.link')}</a></div>
      </div>
    </DialogContent>
  )
}

export default Content
