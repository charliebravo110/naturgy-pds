import React from 'react'
import { Grid } from '@material-ui/core'

import { useTranslation } from 'react-i18next'
import useStyles from '../DeleteAdvert/deleteAdvert.styles'
import checkIcon from '../../../../../assets/icons/misdocumentos_rechazado.svg'
import Button from '../../../../../common/components/button/Button'
import CloseIcon from '../../../../../assets/icons/cerrar.svg'
import AlertIcon from '../../../../../assets/icons/aviso_alerta_pop_up.svg'




const Content = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()


  const { 
    handleCloseDialog,
    handleCancel
  } = props

  


  return (
        <Grid>  
          <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleCloseDialog} />
          <Grid container>
            <Grid container item xs={12}  justifyContent='center' style={{marginBottom:'30px'}}>
              <img src={AlertIcon} alt='' />
            </Grid>
              <Grid container item xs={12} className={classes.spanTitle} justifyContent='center'>
              {
               t('provisions.jobExecution.closeMessage')
              }
              </Grid>
            <Grid container item xs={12} className={classes.gridText} justifyContent='center'>
              {
               t('provisions.jobExecution.cancelMessage')
              }
            </Grid> 
          </Grid>
          <Grid container justifyContent='center' className={classes.buttons}>
            <Grid item xs={12} sm={4}  className={classes.acceptButtonGrid}>
              <Button fullWidth text={t('provisions.jobExecution.no')} variant='contained' className={classes.cancelButton} onClick={handleCloseDialog}/>
            </Grid>
            <Grid item xs={12} sm={4}  className={classes.acceptButtonGrid}>
              <Button fullWidth text={t('provisions.jobExecution.yes')} variant='outlined' className={classes.acceptButton} onClick={() => {handleCancel() ; handleCloseDialog()}}/>
            </Grid>
          </Grid>
        </Grid>   
    
  )
}

export default Content