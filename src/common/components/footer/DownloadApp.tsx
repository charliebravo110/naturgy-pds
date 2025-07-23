import _ from 'lodash'
import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import { useDispatch } from 'react-redux';


import useStyles from './DownloadApp.styles'
import ImageApple from '../../../assets/img/descargaApple.png';
import ImageGoogle from '../../../assets/img/descargaGoogle.png';

import { createBrowserHistory } from 'history';
import { thunkGetAlerts } from '../../../supplies/store/actions/AlertsThunkAction';

export const history = createBrowserHistory()

const DownloadApp = (props: any) => {

  
  const classes = useStyles({})
  const { t } = useTranslation()
  const dispatch = useDispatch();

  const [showApps, setShowApps] = useState(false)
  const [hasDevice, setHasDevice] = useState(sessionStorage.getItem('HasDevice'));


  useEffect(() => {
    
    const href = sessionStorage.getItem('href')
    setShowApps(false)
    if(href.endsWith('/login') || href.endsWith('/')){
       setShowApps(true)
    }else if(!sessionStorage.getItem('HasDevice')){
      //llamada para setear el Hasdevice
      dispatch(thunkGetAlerts((response) => {
        if(response){
          if(sessionStorage.getItem('HasDevice') == 'false' ){
            setShowApps(true)
            }else{
            setShowApps(false)
            }
        }
      }));  
    }else{
      if(sessionStorage.getItem('HasDevice') == 'false' && href.endsWith('/profile')){
        setShowApps(false);
        } else if (sessionStorage.getItem('HasDevice') == 'false' || href.endsWith('/login') || href.endsWith('/')){
          setShowApps(true)
        }else{
        setShowApps(false)
       }
    }
   
  },[props, hasDevice, setHasDevice, sessionStorage]);

  return (
    showApps &&
    <div className='footer-block'>
      <Grid container className={classes.container}>
        <Grid
          container
          item
          className={classes.breakPoint}
          md={10}
        >
         <Grid className={classes.text}>
            {t('profile.indoDownloadMobile.footer1')}
            <span style={{fontWeight: 'bold' }}>{t('profile.indoDownloadMobile.footer2')}</span>
            {t('profile.indoDownloadMobile.footer3')}
           </Grid>

          <Grid item className={classes.menu}>
            <ul>
              <a href='https://play.google.com/store/apps/details?id=es.ufd.areaprivada' title='Descargar para Android' target='_blank'>
	              <img className={classes.imagen} alt='' src={ImageGoogle} width='100' height='35'/>
              </a>
              <a href='https://apps.apple.com/es/app/ufd/id6447208107?l=es-ES' title='Descargar para IOS' target='_blank'>
	              <img alt='' src={ImageApple} width='100' height='35' />
              </a>
            </ul>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default DownloadApp
