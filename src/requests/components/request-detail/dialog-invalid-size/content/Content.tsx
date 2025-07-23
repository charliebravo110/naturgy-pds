import React from 'react'
import { Grid } from '@material-ui/core'

import { useTranslation } from 'react-i18next'
import useStyles from './Content.styles'
import checkIcon from '../../../../../assets/icons/misdocumentos_rechazado.svg'
import Button from '../../../../../common/components/button/Button'
import CloseIcon from '../../../../../assets/icons/cerrar.svg'


const Content = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const { 
    handleCloseDialog,
    stringMaxUploadFileSize
  } = props


  return (
        <Grid>  
          <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleCloseDialog} />
          <Grid container>
            <Grid container item xs={12} className={classes.gridIcon} justifyContent='center'>
              <img className={classes.checkIcon} src={checkIcon} alt='' /> 
            </Grid>
            <Grid container item xs={12} className={classes.gridTitle} justifyContent='center'>
              <span className={classes.spanTitle}>{t('requests.newRequestDetail.popupInvalidSize.title')}</span>
            </Grid>
            <Grid container item xs={12} className={classes.gridText} justifyContent='center'>
              <span className={classes.spanSubtitle}>{t('requests.newRequestDetail.popupInvalidSize.subtitle')}</span>
            </Grid>
            <Grid container item xs={12} className={classes.gridText} justifyContent='center'>
              <span className={classes.spanSubtitle}>
                {t('requests.newRequestDetail.popupInvalidSize.size')}
                {' '}
                {stringMaxUploadFileSize}
                {t('requests.newRequestDetail.popupInvalidSize.mb')}
                </span>
            </Grid>
          </Grid>
          <Grid container justifyContent='center' className={classes.buttons}>
            <Grid item xs={12} sm={4}  className={classes.acceptButtonGrid}>
              <Button fullWidth text={t('requests.newRequestDetail.popupInvalidSize.close')} variant='outlined' className={classes.acceptButton} onClick={handleCloseDialog}/>
            </Grid>
          </Grid>
        </Grid>   
    
  )
}

export default Content