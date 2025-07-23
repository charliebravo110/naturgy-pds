import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import CloseIcon from '../../../../../../../assets/icons/cerrar.svg'

import useStyles from './CupsInfo.styles'

const CupsInfo = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const handleDeleteCups = () => {
    setCups({})
  }

  const {
    cups,
    setCups,
    selected,
   } = props

  return (
    <Grid container className={classes.container}>
      <Grid container direction='row-reverse'>
        <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleDeleteCups} />
      </Grid>
      <Grid container spacing={2}>
        <Grid item md={3}>
          <Typography>
            {
              selected ?
                t('provisions.editProvision.requestData.cupsSearch.cupsInfo.selected')
              :
                t('provisions.editProvision.requestData.cupsSearch.cupsInfo.inserted')
            }
          </Typography>
        </Grid>
        <Grid item md={9}>
          <Grid container direction='column' spacing={2}>
            <Grid item>
              <Typography className={classes.cups}>{cups.cups}</Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.address}>{cups.address}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )

}

export default CupsInfo
