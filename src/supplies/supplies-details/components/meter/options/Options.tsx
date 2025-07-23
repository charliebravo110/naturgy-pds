import React from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import MeterIcon from '../../../../../assets/icons/contador_para_boton.svg'
import QueryIcon from '../../../../../assets/icons/ico_calendario_plazos.svg'

import {
  setCurrentSupplyProgrammedReadsCount,
  appendCurrentSupplyProgrammedReads
} from '../../../../store/actions/SuppliesActions'
import { thunkListProgrammedReads } from '../../../store/actions/SuppliesDetailsThunkActions'

import useStyles from './Options.styles'

const Options = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    supplyData,
    handleClickConsult,
    isAccessible,
    setIsShowingProgrammedReadsList,
    setIsLoading
  } = props

  const handleListProgrammedReads = () => {
    if (isAccessible) {
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

      dispatch(thunkListProgrammedReads(meterId, 0, 15, (reads) => {
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
    }
  }

  return (
    <Grid container className={classes.container} spacing={2}>
      <Grid item md={3} sm={6} xs={12}>
        <div className={`${classes.item} enabled`} onClick={handleClickConsult}>
          <div>
            <img className={classes.icon} src={MeterIcon} alt='' />
          </div>

          <div className={classes.title}>
            {t('supplies.suppliesDetails.components.meter.options.meterStatus.title')}
          </div>

          <div className={classes.description}>
            {t('supplies.suppliesDetails.components.meter.options.meterStatus.description')}
          </div>
        </div>
      </Grid>

      <Grid item md={3} sm={6} xs={12}>
        <div className={`${classes.item} ${isAccessible ? 'enabled' : 'disabled'}`} onClick={handleListProgrammedReads}>
          <div>
            <img className={classes.icon} src={QueryIcon} alt='' />
          </div>

          <div className={classes.title}>
            {t('supplies.suppliesDetails.components.meter.options.programmedQueries.title')}
          </div>

          <div className={classes.description}>
            {t('supplies.suppliesDetails.components.meter.options.programmedQueries.description')}
          </div>
        </div>
      </Grid>
    </Grid>
  )
}

export default Options
