import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Button from '../../../../../common/components/button/Button'

import {
  setCurrentSupplyProgrammedReadsCount,
  appendCurrentSupplyProgrammedReads
} from '../../../../store/actions/SuppliesActions'
import { thunkListProgrammedReads } from '../../../store/actions/SuppliesDetailsThunkActions'

import useStyles from './Summary.styles'

const Summary = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    supplyData,
    handleClickConsult,
    isAccessible,
    setIsShowingProgrammedReadsList,
    setIsLoading,
    handleProgrammedQueryDialog
  } = props

  useEffect(() => {
    setIsLoading(true)

    setIsShowingProgrammedReadsList(false)

    const meterId = (
      supplyData &&
      supplyData.measurementEquipments &&
      supplyData.measurementEquipments.meters[0] &&
      supplyData.measurementEquipments.meters[0].meter
    ) ?
      supplyData.measurementEquipments.meters[0].meter
    :
      ''

    dispatch(thunkListProgrammedReads(meterId, 0, 1, (reads) => {
      if (reads) {
        if (reads.count && reads.count > 0) {
          dispatch(setCurrentSupplyProgrammedReadsCount(reads.count))
        }

        if (reads.items && reads.items.length > 0) {
          dispatch(appendCurrentSupplyProgrammedReads(reads.items))
        }

        setIsShowingProgrammedReadsList(true)
      }

      setIsLoading(false)
    }))
  }, [])

  return (
    <Grid container className={classes.container}>
      <Grid item md={6} sm={12} xs={12}>
        <div className={classes.label}>
          {t('supplies.suppliesDetails.components.meter.summary.consult.label')}
        </div>

        <Button
          className={classes.button}
          text={t('supplies.suppliesDetails.components.meter.buttons.consult')}
          color='primary'
          size='medium'
          variant='contained'
          onClick={handleClickConsult}
        />
      </Grid>

      <Grid item className={classes.rightColumn} md={6} sm={12} xs={12}>
        <div className={classes.label}>
          {t('supplies.suppliesDetails.components.meter.summary.program.label')}
        </div>

        <Grid container className={classes.programButtons} spacing={2}>
          <Grid item md='auto' sm={12} xs={12}>
            <Button
              className={classes.button}
              text={t('supplies.suppliesDetails.components.meter.buttons.programming')}
              color='primary'
              size='medium'
              variant='contained'
              disabled={!isAccessible}
              onClick={handleProgrammedQueryDialog}
            />
          </Grid>

          <Grid item md='auto' sm={12} xs={12}>
            <span>{t('supplies.suppliesDetails.components.meter.summary.program.viewList')}</span>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Summary
