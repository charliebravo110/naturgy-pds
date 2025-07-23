import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import useStyles from './Mosaic.styles'

const Mosaic = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    requestsList,
    currentPage,
    rowsPerPage
  } = props

  return (
    <>
      {requestsList.length === 0 ? (
        <Grid container spacing={2}>
          {t('requests.requestsList.list.emptyList.default')}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {requestsList
            .slice((currentPage - 1) * rowsPerPage, (currentPage - 1) * rowsPerPage + rowsPerPage)
            .map((request, index) => (
              <Grid item key={index} lg={4} md={6} sm={6} xs={12}>
                <Grid className={classes.item}>
                  <Grid className={classes.row}>
                    <Typography className={classes.title}>{t('supplies.suppliesDetails.components.consumption.exportDialogs.date')}</Typography>
                    <Typography className={classes.value}>{request.createDate}</Typography>
                  </Grid>
                  <Grid className={classes.row}>
                    <Typography className={classes.title}>{t('requests.requestsList.list.requestCode')}</Typography>
                    <Typography className={`${classes.value} ${request.indRead === 1 ? '' : 'bold'}`}>
                      {request.codSR}
                    </Typography>
                  </Grid>
                  <Grid className={classes.row}>
                    <Typography className={classes.title}>{t('requests.requestsList.list.requestType')}</Typography>
                    <Typography className={classes.value}>{(request.tipologyDescription)}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            ))}
        </Grid>
      )}
    </>
  )
}

export default Mosaic
