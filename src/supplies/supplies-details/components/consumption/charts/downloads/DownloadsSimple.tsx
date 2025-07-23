import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import useStyles from './Downloads.styles'
import Mode from '../mode/Mode'
import { sendGAEvent } from '../../../../../../core/utils/gtm'

const DownloadsSimple = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()


  const {
    supplyData,
    setIsExportTableDataDialog,
    isGeneration,
    mode,
    isGenerationTab,
    autoConsumption,
    granularity
  } = props


  const handleOpenExportTableDataDialog = () => {
    setIsExportTableDataDialog(true)
      // console.log(mode)
     
  }

  const sendGAEventExportGraph = ():void => {

    var granularidad;
    switch(granularity) {
      case 'M':
        granularidad = 'periodo';
        break;
      case 'D':
        granularidad = 'mes';
        break;
      case 'S':
        granularidad = 'semana';
        break;
      case 'H':
        granularidad = 'dia';
        break;
    }
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      subsection_name: 'mi consumo',
      click_text: 'exportar datos grafica',
      element_type: 'consulta de informacion',
      page_url: window.location.href,
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      tab_name: sessionStorage.getItem('tab1_MiConsumo') ? sessionStorage.getItem('tab1_MiConsumo') : 'energia consumida kwh',
      subtab_name: 'grafica',
      see_consumption: granularidad,
    })
  }

  return (

    <Grid item className={classes.container}>
      <Grid container justifyContent='space-between' className={classes.button} onClick={() => { sendGAEventExportGraph(); handleOpenExportTableDataDialog()}}>
        <Grid item>
          {
            supplyData.measurementSystem && supplyData.measurementSystem === 'O' ?
              autoConsumption ?
              t('supplies.suppliesDetails.components.consumption.exportGMv10.exportButtons.graph')
              :
                ((isGeneration && isGenerationTab) ?
                t('supplies.suppliesDetails.components.consumption.exportGMv10.exportButtons.graph')
                :
                mode === 'graph' ? t('supplies.suppliesDetails.components.consumption.exportGMv10.exportButtons.graph') : t('supplies.suppliesDetails.components.consumption.exportGMv10.exportButtons.table')
                )
              :
              autoConsumption ?
              t('supplies.suppliesDetails.components.consumption.exportGMv10.exportButtons.graph')
              :
                ((isGeneration && isGenerationTab) ?
                  t('supplies.suppliesDetails.components.consumption.charts.downloads.exportGenerationGMv10')
                  :
                  t('supplies.suppliesDetails.components.consumption.exportGMv10.exportButtons.graph')
                )
          }
        </Grid>
      </Grid>
    </Grid>
  )
}

export default DownloadsSimple
