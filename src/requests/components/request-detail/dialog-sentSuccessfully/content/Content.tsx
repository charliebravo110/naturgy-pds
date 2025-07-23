import React from 'react'
import { Grid } from '@material-ui/core'

import { useTranslation } from 'react-i18next'
import useStyles from './Content.styles'
import checkIcon from '../../../../../assets/icons/aviso_ok.svg'
import Button from '../../../../../common/components/button/Button'
import CloseIcon from '../../../../../assets/icons/cerrar.svg'


const Content = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const { 
    handleCloseDialog,
    auxUploadDocuments
  } = props


  return (
        <Grid>  
          <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleCloseDialog} />
          <Grid container>
            <Grid container item xs={12} className={classes.gridIcon} justifyContent='center'>
              <img className={classes.checkIcon} src={checkIcon} alt='' /> 
            </Grid>
            <Grid container item xs={12} className={classes.gridTitle} justifyContent='center'>
              <span className={classes.spanTitle}>{t('requests.newRequestDetail.popUpSentSuccessfully.title')}</span>
            </Grid>
            <Grid container item xs={12} className={classes.gridText} justifyContent='center'>
              <span className={classes.spanSubtitle}>{t('requests.newRequestDetail.popUpSentSuccessfully.subtitle')}</span>
            </Grid>
          </Grid>
          <Grid container className={classes.sentDocuments}>
            <Grid item xs={12} sm={12}  className={classes.sentDocumentsGrid}>
              <span>{t('requests.newRequestDetail.popUpSentSuccessfully.sentDocuments')}</span>
            </Grid>
            {(auxUploadDocuments && auxUploadDocuments.length > 0) &&
              auxUploadDocuments.map((item, i) => (                
                <Grid className={classes.documentBubble} key={i}>
                  {(item.nombreArchivo.includes('_') && item.nombreArchivo.split('_')[5]) ?
                    item.nombreArchivo.split('_')[5]
                  :
                    item.nombreArchivo
                  }
                </Grid>
              ))
            }
          </Grid>
          <Grid container justifyContent='center' className={classes.buttons}>
            <Grid item xs={12} sm={4}  className={classes.acceptButtonGrid}>
              <Button fullWidth text={t('requests.newRequestDetail.popUpReiteracion.accept')} variant='outlined' className={classes.acceptButton} onClick={handleCloseDialog}/>
            </Grid>
          </Grid>
        </Grid>   
    
  )
}

export default Content