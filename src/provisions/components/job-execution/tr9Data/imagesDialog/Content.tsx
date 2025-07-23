import React from 'react'
import { Grid, useMediaQuery } from '@material-ui/core'

import { useTranslation } from 'react-i18next'
import useStyles from './DialogImages.styles'
import checkIcon from '../../../../../assets/icons/misdocumentos_rechazado.svg'
import Button from '../../../../../common/components/button/Button'
import CloseIcon from '../../../../../assets/icons/cerrar.svg'


const Content = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const mobileRes = useMediaQuery('(max-width:576px)')


  const { 
    handleCloseDialog,
    Text,
    Image,
    Title
  } = props

  


  return (
        <Grid>  
          <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleCloseDialog} />
          <Grid container>
            <Grid container item xs={12} className={classes.spanTitle} justifyContent='center'>
              {
                Title
              }
            </Grid>
            <Grid container item xs={12} className={classes.gridText} justifyContent='center'>
            <div>
              {Text && Text.length > 0 && Text[0] && Text[0].split('\n').length > 0 &&
                Text[0].split('\n').map((line, index) => (
                  <p key={index}>
                    {line.includes('-') ? <span>- {line.replace('-', '').trim()}</span> : line}
                  </p>
                ))
              }
            </div>
            </Grid>

            {Image && Image.length > 0 &&
              <Grid container item xs={12} justifyContent='center'>
                {Image.map((src, index) => (
                  src && src !== '' && (
                    <img key={index} src={src} style={{margin:'2px'}} alt='' width={'auto'} height={mobileRes ? '200px' : '400px'} />
                  )
                ))}
              </Grid>
            }

          
          </Grid>
          <Grid container justifyContent='center' className={classes.buttons}>
            <Grid item xs={12} sm={4}  className={classes.acceptButtonGrid}>
              <Button fullWidth text={t('requests.newRequestDetail.popupInvalidExtension.close')} variant='outlined' className={classes.acceptButton} onClick={handleCloseDialog}/>
            </Grid>
          </Grid>
        </Grid>   
    
  )
}

export default Content