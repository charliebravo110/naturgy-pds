import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import i18n from 'i18next'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import useStyles from './Faqs.styles'
import { resetUrlMessages } from '../../../common/components/send-url/store/actions/UrlMessagesActions'

// LCS: Importa la función - Wave 1
import { removeEmails, sendGAEvent } from '../../../core/utils/gtm';

const Faqs = () => {
  const faqs = useSelector((state: any) => state.faqs.faqs)
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const language = i18n.languages[0].toUpperCase()
  let token = sessionStorage.getItem('token')

  const urlCastellano = process.env.REACT_APP_FAQS_ENDPOINT
  const subUrlEnglish = '?lang=en'
  const subUrlGallego = '?lang=gl'

  const [urlFaqs, setUrlFaqs] = useState('')

  const user = useSelector((state: any) => state.user.profile)

  useEffect(() => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'view',
      content_group: 'faqs',
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

  useEffect(() => {
    try {
      if (urlFaqs !== '') {
        handleHiddenForm()
      }
    } catch (error) {
      // LCS: Enviar evento a GA - Wave 1
      sendGAEvent({
        event: 'react_error',
        info:{
          error_message: 'Fallo de carga componente FAQs',
          error: error,
          reactComponent: 'Faqs.tsx - useEffect',
        }
      });
    }
  }, [urlFaqs])

  useEffect(() => {
    try {
      dispatch(resetUrlMessages())
    } catch (error) {
      // LCS: Enviar evento a GA - Wave 1
      sendGAEvent({
        event: 'react_error',
        info:{
          error_message: 'Fallo al reiniciar los mensajes de URL',
          error: error,
          reactComponent: 'Faqs.tsx - useEffect',
        }
      });
    }
  }, [])

  useEffect(() => {
    try {
      //dejo el lenguaje de castellano por defecto.
      let auxUrl = urlCastellano

      if (language === 'EN') {
        auxUrl = auxUrl + subUrlEnglish
      }
      if (language === 'GL') {
        auxUrl = auxUrl + subUrlGallego
      }
      setUrlFaqs(auxUrl)
    } catch (error) {
      // LCS: Enviar evento a GA - Wave 1
      sendGAEvent({
        event: 'react_error',
        info:{
          error_message: 'Fallo al establecer la URL de FAQs',
          error: error,
          reactComponent: 'Faqs.tsx - useEffect',
        }
      });
    }
  }, [])

  const handleHiddenForm = () => { 
    try {
      let hiddenForm = document.getElementById('hiddenForm2') as any
      hiddenForm.submit()
    } catch (error) {
      // LCS: Enviar evento a GA - Wave 1
      sendGAEvent({
        event: 'react_error',
        info:{
          error_message: 'Fallo al enviar el formulario oculto',
          error: error,
          reactComponent: 'Faqs.tsx - handleHiddenForm',
        }
      });
    }

  }

  if (!token) {
    return <Redirect to='/login' />
  }

  return (
    <Grid container justifyContent='center' alignItems='center' className={classes.container}>
      <Grid item container xs={11} md={10} className={classes.maxWidthForBigScreens}>
        <div className={(user && user.userId && user.userId == 0) ? classes.notRegisteredHeaderTitle : classes.headerTitle}>{t('faqs.title')}</div>
        <form
          id='hiddenForm2'
          action={urlFaqs}
          method='POST'
          target='hiddeniFrame'
        />
        <iframe id='hiddeniFrame' className={classes.iframe} name='hiddeniFrame' title='hiddeniFrame' />
      </Grid>
    </Grid>
  )
}

export default Faqs
