import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import useStyles from './Mosaic.styles'

const Mosaic = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    itemIndex,
    primaryUse,
    stair,
    floor,
    door,
    tempSelectedState,
    setTempSelectedState
  } = props

  return (
    <Grid item md={12} sm={12} xs={12}>
      <div className={classes.item}>
        <div
          className={`radioButton ${classes.radioButton} ${tempSelectedState === itemIndex && 'active'}`}
          onClick={() => setTempSelectedState(itemIndex)}
        />

        <div className={classes.row}>
          <div className={classes.rowLabel}>
            {t('provisions.newProvision.requestData.location.locationModal.header.primaryUse')}
          </div>

          <div className={classes.rowValue}>{primaryUse}</div>
        </div>

        <div className={classes.row}>
          <div className={classes.rowLabel}>
            {t('provisions.newProvision.requestData.location.locationModal.header.stairs')}
          </div>

          <div className={classes.rowValue}>{stair}</div>
        </div>

        <div className={classes.row}>
          <div className={classes.rowLabel}>
            {t('provisions.newProvision.requestData.location.locationModal.header.floor')}
          </div>

          <div className={classes.rowValue}>{floor}</div>
        </div>

        <div className={classes.row}>
          <div className={classes.rowLabel}>
            {t('provisions.newProvision.requestData.location.locationModal.header.door')}
          </div>

          <div className={classes.rowValue}>{door}</div>
        </div>
      </div>
    </Grid>
  )
}

export default Mosaic
