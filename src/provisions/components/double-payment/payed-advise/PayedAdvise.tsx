import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import useStyles from './PayedAdvise.styles'
import TabIcon from '../../../../assets/icons/tab.svg';

const PayedAdvise = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const { amount } = props

  return (
    <Grid container direction='column'>
      <Grid item className={classes.title}>
        {t('provisions.payment.payed.title')}
      </Grid>
      <Grid container justifyContent='center' alignItems='center' className={classes.container}>

        <Grid item>
          <Grid container spacing={1} justifyContent='center' alignContent='center' direction='column'>
            <Grid item className={classes.payment}>
              {amount} €
            </Grid>
            <Grid item className={classes.text}>
              {t('provisions.payment.payed.iva')}
            </Grid>
          </Grid>
        </Grid>

        <Grid container alignItems='center' justifyContent='center' style={{marginTop:'30px'}}>
            <label className={classes.policy}>
              {t('provisions.payment.privacyPolicy')}
                <a className={classes.link} target='_blank' href='https://www.ufd.es/informacion-sobre-cancelacion-de-expedientes/'>                          
                  {t('provisions.payment.here')}
                </a>
                <img src={TabIcon} alt=''  className={classes.tabIcon}/>
            </label>
          </Grid>

        {/*<Grid className={classes.separator} />
        <Grid item md={5}>
          <Grid container direction='column' justifyContent='center' alignContent='center' spacing={1}>
            <Grid item className={classes.iconContainer}>
              <img src={DocumentIcon} className={classes.icon} alt='' />
            </Grid>
            <Grid item className={classes.subtitle}>
              {t('provisions.payment.payed.subtitle')}
            </Grid>
          </Grid>
        </Grid>*/}
      </Grid>
    </Grid>
  )
}

export default PayedAdvise
