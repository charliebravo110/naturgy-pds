import _ from 'lodash'
import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isMobileApp } from '../../../mobile-apps/common/detectPlatform'
import { useState, useEffect } from 'react'


import Grid from '@material-ui/core/Grid'

import useStyles from './Footer.styles'

// LCS: Importa la función - Wave 1
import { sendGAEvent } from '../../../core/utils/gtm';

const Footer = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()
  const [isMobile, setIsMobile] = useState(false)
  const [mobileLink, setMobileLink] = useState('https://www.ufd.es/politica-de-privacidad/')

  useEffect(() => {
    try {
      console.log("Cargando footer...");
    } catch (error) {
      // LCS: Enviar evento a GA - Wave 1
      sendGAEvent({
        event: 'react_error',
        info:{
          error_message: 'Fallo al cargar el footer',
          error: error,
          reactComponent: 'Footer.tsx - useEffect',
        }
      });
    }
  },[])

  useEffect(()=>{
    try {
      if (isMobileApp()) {
        setMobileLink('https://www.ufd.es/politica-de-privacidad-app/');
      }
    } catch (err) {
      console.error('Error al determinar la plataforma móvil:', err); 
      // LCS: Enviar evento a GA - Wave 1
      sendGAEvent({
        event: 'react_error',
        info:{
          error_message: 'Error al determinar la plataforma móvil.',
          error: err,
          reactComponent: 'Footer.tsx - useEffect',
        }
      });
    }
  }, [])

  const FOOTER_MENU_ITEMS = [
    {
      text: t('footer.links.contact'),
      url: 'https://www.ufd.es/contacto/',
      external: true 
    },
    {
      text: t('footer.links.legalNote'),
      url: 'https://www.ufd.es/nota-legal/',
      external: true
    },
    {
 
      text: t('footer.links.cookiesPolicy'),
      url: 'https://areaprivada.ufd.es/politica-de-cookies/',
      external: true
    },
    {     
      text: t('footer.links.cookiesPrivate'),
      url: mobileLink,
      external: true
    },
    {
      text: t('footer.links.accessibility'),
      url: 'https://www.ufd.es/accesibilidad/',
      external: true
    },
    {
      text: 'www.naturgy.com',
      url: 'https://www.naturgy.com',
      external: true
    }
  ]

  const getMenuList = () => {
    return _.map(FOOTER_MENU_ITEMS, (item) => (
      <li key={item.url}>
        {item.external ? <a target='_blank' href={item.url}>{item.text}</a> : <Link to={item.url}>{item.text}</Link>}
      </li>
    ))
  }

  return (
    <div className='footer-block'>
      <Grid container className={classes.container}>
        <Grid
          container
          item
          className={classes.breakPoint}
          md={10}
        >
          <Grid item className={classes.noFlexBasis}>
            <span>© UFD Distribución Electricidad S.A.</span>
          </Grid>

          <Grid item className={classes.menu}>
            <ul>
              {getMenuList()}
            </ul>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default Footer
