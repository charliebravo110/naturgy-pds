import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import WhiteArrowDownIcon from '../../../../../../assets/icons/flecha_down_blanco.svg'
import WhiteArrowUpIcon from '../../../../../../assets/icons/flecha_up_blanco.svg'
import PeriodIcon from '../../../../../../assets/icons/periodo.svg'
import ConsumptionIcon from '../../../../../../assets/icons/consumo_total.svg'

import useStyles from './Downloads.styles'

const Downloads = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const [isBoxOpen, setIsBoxOpen] = useState(false)

  const {
    supplyData,
    mode,
    setIsExportTableDataDialog,
    setIsExportPeriodDataDialog,
    setIsExportAllDataDialog,
    isGeneration,
    isGenerationTab,
    autoConsumption
  } = props

  const handleOpenBox = () => {
    setIsBoxOpen(!isBoxOpen)
  }

  const handleOpenExportTableDataDialog = () => {
    setIsExportTableDataDialog(true)

    setIsBoxOpen(!isBoxOpen)
  }

  const handleOpenExportPeriodDataDialog = () => {
    setIsExportPeriodDataDialog(true)

    setIsBoxOpen(!isBoxOpen)
  }

  const handleOpenExportAllDataDialog = () => {
    setIsExportAllDataDialog(true)

    setIsBoxOpen(!isBoxOpen)
  }

  return (
    <Grid item className={classes.container}>
       <Grid container justifyContent='space-between' className={classes.button} onClick={handleOpenBox}>
        <Grid item>
          {
            supplyData.measurementSystem && supplyData.measurementSystem === 'O' ?
              autoConsumption ?
                t('supplies.suppliesDetails.components.consumption.charts.downloads.exportSelfConsumption')
                :
                ((isGeneration && isGenerationTab) ?
                  t('supplies.suppliesDetails.components.consumption.charts.downloads.exportGeneration')
                  :
                  t('supplies.suppliesDetails.components.consumption.charts.downloads.exportConsumption')
                )
              :
              autoConsumption ?
                t('supplies.suppliesDetails.components.consumption.charts.downloads.exportSelfConsumption')
                :
                ((isGeneration && isGenerationTab) ?
                  t('supplies.suppliesDetails.components.consumption.charts.downloads.exportGenerationGMv10')
                  :
                  t('supplies.suppliesDetails.components.consumption.charts.downloads.exportConsumptionGMv10')
                )
          }
        </Grid>

        <Grid item className={classes.arrowIcon}>
          {
            isBoxOpen ?
              <img src={WhiteArrowUpIcon} alt='' />
              :
              <img src={WhiteArrowDownIcon} alt='' />
          }
        </Grid>
      </Grid>
      {
        isBoxOpen &&
        <div className={classes.box}>
          {
            supplyData.measurementSystem &&
            <Grid container className={`${classes.export} ${classes.exportWithBorder}`} onClick={handleOpenExportTableDataDialog}>
              <Grid item className={classes.exportIcon}>
                <img src={ConsumptionIcon} alt='' />
              </Grid>

              <Grid item className={classes.exportText}>{t('supplies.suppliesDetails.components.consumption.charts.downloads.exportData')} {`${mode === 'graph' ? t('supplies.suppliesDetails.components.consumption.charts.downloads.graph') : t('supplies.suppliesDetails.components.consumption.charts.downloads.table')}`}</Grid>
            </Grid>
          }
          {
            supplyData.measurementSystem === 'O' &&
            <Grid container className={`${classes.export} ${classes.exportWithBorder}`} onClick={handleOpenExportPeriodDataDialog}>
              <Grid item className={classes.exportIcon}>
                <img src={PeriodIcon} alt='' />
              </Grid>

              <Grid item className={classes.exportText}>{t('supplies.suppliesDetails.components.consumption.charts.downloads.exportBilling')}</Grid>
            </Grid>
          }
          <Grid container className={classes.export} onClick={handleOpenExportAllDataDialog}>
            <Grid item className={classes.exportIcon}>
              <img src={PeriodIcon} alt='' />
            </Grid>

            <Grid item className={classes.exportText}>{t('supplies.suppliesDetails.components.consumption.charts.downloads.exportDataAvailable')}</Grid>
          </Grid>

        </div>
      }
    </Grid>
  )
}

export default Downloads
