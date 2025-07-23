import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import useStyles from './confirmSupplyDialog.style'
import Button from '../../../../../common/components/button/Button'
import CloseIcon from '../../../../../assets/icons/cerrar.svg'
import InfoIcon from '../../../../../assets/icons/aviso_alerta_pop_up.svg'
import { formatDateAndHourStringWithBars } from '../../../../../common/lib/FormatLib'

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
            <img style={{width:'42px'}} src={InfoIcon} alt='' />
            </Grid>
              <Grid container item xs={12} className={classes.spanTitle} justifyContent='center'>
                <Typography variant='body1' className={classes.paragraph}>
                    {t('provisions.jobExecution.confirmSupplyDialog')} <strong><span>{formatDateAndHourStringWithBars(new Date())}h</span></strong> {t('provisions.jobExecution.confirmDialogSupply')}
                </Typography>
            </Grid>
          </Grid>
          <Grid container justifyContent='center' alignItems='center' className={classes.buttons}>
            <Grid item xs={12} md={4} className={classes.buttonGrid}>
                <Button 
                    text={t('provisions.jobExecution.isTr9.cancel')} 
                    variant='contained' 
                    size='large'
                    className={classes.cancelButton} 
                    onClick={handleCloseDialog}
                />
            </Grid>
            <Grid item xs={12} md={4} className={classes.buttonGrid}>
                <Button 
                    text={t('provisions.jobExecution.isTr9.confirm')}  
                    variant='contained' 
                    size='large'
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