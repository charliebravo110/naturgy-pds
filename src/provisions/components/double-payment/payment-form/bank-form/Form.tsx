import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import useStyles from './Form.styles'

const Form = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const { amount, dossierCod } = props

  return (
    <Grid 
      container 
      direction='column'
      spacing={3}
      className={classes.container}
    >
      <Grid item>
        <Grid container direction='column'>
          <div className={classes.title}>
            {t('provisions.payment.paymentForm.bank.transferData.title')}
          </div>
          <div className={classes.subtitle}>
            {t('provisions.payment.paymentForm.bank.transferData.text')}
          </div>
        </Grid>
      </Grid>

      <Grid item>
        <Grid container direction='column'>
          <div className={classes.title}>
            {t('provisions.payment.paymentForm.bank.incumbent.title')}
          </div>
          <div className={classes.subtitleGray}>
            {t('provisions.payment.paymentForm.bank.incumbent.text')}
          </div>
        </Grid>
      </Grid>

      <Grid item>
        <Grid container direction='column'>
          <div className={classes.title}>
            {t('provisions.payment.paymentForm.bank.number.title')}
          </div>
          <div className={classes.subtitleGray}>
            {t('provisions.payment.paymentForm.bank.number.text')}
          </div>
        </Grid>
      </Grid>

      <Grid item>
        <Grid container direction='column'>
          <div className={classes.title}>
            {t('provisions.payment.paymentForm.bank.amount.title')}
          </div>
          <div className={classes.subtitleGray}>
            {amount}
          </div>
        </Grid>
      </Grid>

      <Grid item>
        <Grid container direction='column'>
          <div className={classes.title}>
            {t('provisions.payment.paymentForm.bank.concept.title')}
          </div>
          <div className={classes.text}>
            {t('provisions.payment.paymentForm.bank.concept.text')}
          </div>
          <div className={classes.subtitleGray}>
            {dossierCod}
          </div>
        </Grid>
      </Grid>

    </Grid>
  )
}

export default Form