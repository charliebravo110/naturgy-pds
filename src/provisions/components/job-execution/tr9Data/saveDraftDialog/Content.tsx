import React from 'react'
import { Grid, Typography } from '@material-ui/core'

import { useTranslation } from 'react-i18next'
import useStyles from './savedraftDialog.style'
import Button from '../../../../../common/components/button/Button'
import CloseIcon from '../../../../../assets/icons/cerrar.svg'
import AlertIcon from '../../../../../assets/icons/info.svg'

const Content = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const { 
    handleCloseDialog,
    handleCancel,
    handleSubmit
  } = props

  return (
        <Grid>  
          <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleCloseDialog} />
          <Grid container>
            <Grid container item xs={12}  justifyContent='center' style={{marginBottom:'30px'}}>
              <img style={{width:'42px'}} src={AlertIcon} alt='' />
            </Grid>
              <Grid container item xs={12} className={classes.spanTitle} justifyContent='center'>
                <Typography variant='body1' className={classes.paragraph}>
                    {t('provisions.jobExecution.saveDraftMessage')} <strong>{t('provisions.jobExecution.saveMessage')}</strong> {t('provisions.jobExecution.saveMessageDraft')}
                </Typography>
            </Grid>

            <Grid container item xs={12} className={classes.gridText} justifyContent='center'>
              {
               t('provisions.jobExecution.saveDraftDialog')
              }
            </Grid> 
          </Grid>
          <Grid container justifyContent='center' alignItems='center' className={classes.buttons}>
            <Grid item xs={6} sm={2} className={classes.buttonGrid}>
                <Button 
                    text={t('provisions.jobExecution.no')} 
                    variant='contained' 
                    className={classes.cancelButton} 
                    onClick={handleCloseDialog}
                />
            </Grid>
            <Grid item xs={6} sm={2} className={classes.buttonGrid}>
                <Button 
                    text={t('provisions.jobExecution.yes')}  
                    variant='contained' 
                    className={classes.acceptButton}
                    onClick={() => {
                    handleCancel();
                    handleCloseDialog();
                    handleSubmit()
                    }}
                />
            </Grid>
            </Grid>

        </Grid>   
    
  )
}

export default Content