import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import useStyles from './Summary.styles'

const Header = (props: any) => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.only('xs'))
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    supplyData,
    selectedUser
  } = props

  return (
    <Grid container item xs={11} md={10} lg={10} className={classes.block}>
      <Grid container item className={classes.container}>
        <Grid container className={classes.leftColumn} item xs={12} sm={12} md={4}>
          <Grid item xs={12} sm={12} className={classes.cupsBlock}>
            <div className={classes.cupsTitle}>CUPS</div>
            <div className={classes.cups}>{supplyData.cups}</div>
          </Grid>
        </Grid>
        <Grid container className={classes.centerColumn} item xs={12} sm={12} md={4}>
          {
            mobile &&
            <Grid container item xs={12} className={classes.divider} />
          }
          <Grid item className={classes.addressContainer} xs={12} sm={12}>
            <div className={classes.sectionTitle}>{t('averias.management.supplyPannel.summary.nif')}</div>
            <div className={classes.boldText}>{selectedUser.documentNumber}</div>
          </Grid>
        </Grid>
        <Grid container className={classes.rightColumn} item md={4} justifyContent='flex-end'>
          <Grid item className={classes.addressContainer} xs={12} sm={12}>
            <div className={classes.sectionTitle}>{t('averias.management.supplyPannel.summary.address')}</div>
            <div className={classes.boldText}>
              {
                supplyData.address && (
                  (supplyData.address.street ? supplyData.address.street : '') + ' ' + (supplyData.address.number ? supplyData.address.number : '') + ', ' + ' ' + (supplyData.address.town ? supplyData.address.town : '') + ', ' + ' ' + (supplyData.address.province ? supplyData.address.province : '') + ' ' + (supplyData.address.zipCode ? supplyData.address.zipCode : '')
                )
              }
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Header
