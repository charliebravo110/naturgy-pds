import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import useStyles from './inFoDownloadMobile.styles';
import ImageApple from '../../../assets/img/descargaApple.png';
import ImageGoogle from '../../../assets/img/descargaGoogle.png';
import { ReactComponent as SateliteNaranjaSvg } from '../../../assets/img/satelite_naranja.svg'
import React, { useEffect, useState } from 'react';




const InfoDownloadMobile = (props: any) => {
    const classes = useStyles({});
    const { t } = useTranslation();
    const [showApps, setShowApps] = useState(false)
    const [hasDevice, setHasDevice] = useState(sessionStorage.getItem('HasDevice'));
  
  
    useEffect(() => {
      const href = sessionStorage.getItem('href')
      setShowApps(false)
      
      if(sessionStorage.getItem('HasDevice') === 'false'){
        setShowApps(true)
        console.log('el has device es falso')
        }else{
        setShowApps(false)
        console.log('el has device es true')

        }
    },[hasDevice, setHasDevice, sessionStorage]);

    return (
        showApps &&
            <Grid container direction='row' className={classes.mfaContainer}>
               
                {
                    <Grid item className={classes.mfaBackgroundColor}>
                        <div className={classes.sateliteNaranja}><SateliteNaranjaSvg/></div>
                        <Grid
                            container
                            item
                            md={10}
                            xs={12}
                        >
                            <Grid item md={12} xs={12} className={classes.title}>
                                <span>{t('profile.indoDownloadMobile.title')}</span>
                            </Grid>
                            <Grid>
                            <Grid item md={12} xs={12} className={classes.textDonwload}>
                                <p>{t('profile.indoDownloadMobile.download')}</p>
                            </Grid>
                            <Grid >
                            <a href='https://play.google.com/store/apps/details?id=es.ufd.areaprivada' title='Descargar para Android' target='_blank'>
	                            <img className={classes.imagen} alt='' src={ImageGoogle} width='150' height='50'/>
                            </a>
                            <a href='https://apps.apple.com/es/app/ufd/id6447208107?l=es-ES' title='Descargar para IOS' target='_blank'>
	                            <img alt='' src={ImageApple} width='150' height='50' />
                            </a>
                            </Grid>


                            <Grid item md={12} xs={12} className={classes.textBold}>
                                <p>{t('profile.indoDownloadMobile.profit')}</p>
                            </Grid>
                            
                            <Grid item md={12} xs={12} className={classes.text}>
                                <ul>
                                    <li>
                                    {t('profile.indoDownloadMobile.profit1')}
                                    </li>
                                    <li>
                                    {t('profile.indoDownloadMobile.profit2')}
                                    </li>
                                    <li>
                                    {t('profile.indoDownloadMobile.profit3')}
                                    </li>
                                </ul>
                            </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                }

            </Grid>
            
       
    )
}

export default InfoDownloadMobile;
