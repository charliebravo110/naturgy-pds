import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import NoItemsIcon from '../../../assets/icons/aviso_alerta_pop_up.svg'

import useStyles from './NoItemsAlert.styles'

const NoItemsAlert = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  return (
    <Grid container className={classes.noItems}>
      <Grid item>
        <img src={NoItemsIcon} alt='' />

        <Grid className={classes.text}>{t('admin.noItemsAlertText')}</Grid>
      </Grid>
    </Grid>
  )
}

export default NoItemsAlert
