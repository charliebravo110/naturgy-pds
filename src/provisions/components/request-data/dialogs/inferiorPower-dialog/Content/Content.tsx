import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'


import { DialogContent, DialogActions, Grid } from '@material-ui/core'

import CloseIcon from '../../../../../../assets/icons/cerrar.svg'
import ExclamationIcon from '../../../../../../assets/icons/triangulo_exclamacion.svg'
import useStyles from './Content.styles'
import Button from '../../../../../../common/components/button/Button'


const Content = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    handleReturn,
    supply
  } = props


  return (
    <>

      <DialogContent className={classes.padding}>
        <Grid container className={classes.container}>

          <Grid item className={classes.closeButton} xs={12} sm={12} md={12}>
            <img src={CloseIcon} alt='' onClick={handleReturn} style={{color:'E97000'}}/>
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <img className={classes.icon} src={ExclamationIcon} alt='' />
          </Grid>

          <Grid item className={classes.title} xs={8} sm={8} md={12}>
            {t('provisions.newProvision.requestData.dialog.newSupplyErrorTitle')}
          </Grid>

          <Grid item className={classes.description} xs={8} sm={8} md={10}>
            {t('provisions.newProvision.requestData.dialog.newSupplyErrorDescription')}
            <br/>
            {t('provisions.newProvision.requestData.dialog.newSupplyErrorAdvert')}
          </Grid>

            
          <Grid item style={{color:'#094876',fontWeight:'bold',fontSize:'20px'}} className={classes.description} xs={8} sm={8} md={10}>
            {
                (supply && supply !== null && supply[0] && supply[0].marketer && supply[0].marketer !== '') &&
                  `${supply[0].marketer}`
                
              }
          </Grid>
            
          <Grid item className={classes.description} xs={8} sm={8} md={10}>
            {t('provisions.newProvision.requestData.dialog.newSupplyErrorAdvert2')}
          </Grid>
        </Grid>
        <Grid item xs={8} sm={8} md={12} justifyContent='center' style={{display:'flex', margin: '0 auto'}}>
          <Button
            className={classes.button}
            text={t('common.buttons.accept')}
            color='primary'
            size='large'
            variant='contained'
            onClick={handleReturn}
          />
        </Grid>
      </DialogContent>
    </>



  )
}

export default Content
