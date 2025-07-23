import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import CreditIcon from '../../../../assets/icons/pago_tarjeta_credito.svg'
import BankIcon from '../../../../assets/icons/pago_transferencia.svg'

import useStyles from './Card.styles'

const Card = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    selected,
    type,
    onClick
  } = props

  return (
    <Grid container justifyContent='center' className={classes.mobileBox}>
      <Grid item>
        <Grid
          container
          direction='column'
          alignItems='center'
          justifyContent='center'
          spacing={2}
          onClick={onClick}
          className={selected ? classes.containerSelected : classes.container}
        >
          <Grid item>
            {
              type === 0 ?
                <img src={CreditIcon} alt='' />
              :
                <img src={BankIcon} alt='' />
            }
          </Grid>
          <Grid item className={classes.title}>
            {
              type === 0 ?
                <label>{t('provisions.payment.paymentCard.credit')}</label>
              :
                <label>{t('provisions.payment.paymentCard.bank')}</label>
            }

          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Card
