import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import WhiteArrowDownIcon from '../../../../../../assets/icons/flecha_down_blanco.svg'
import WhiteArrowUpIcon from '../../../../../../assets/icons/flecha_up_blanco.svg'
import PeriodIcon from '../../../../../../assets/icons/periodo.svg'
import ConsumptionIcon from '../../../../../../assets/icons/consumo_total.svg'

import useStyles from './Downloads.styles'

// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../../../../core/utils/gtm'

const Downloads = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const [ isBoxOpen, setIsBoxOpen ] = useState(false)

  const {
    setIsExportTableDataDialogOpen,
    setIsExportAllDataDialogOpen,
    supplyData
  } = props

  const handleOpenBox = () => {
    setIsBoxOpen(!isBoxOpen)
  }

  const handleClickExportTableData = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'download',
      section_name: 'mis suministros',
      subsection_name: 'mi contador',
      click_text: 'exportar datos de la tabla',
      elemet_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      module_name: 'historial de consultas'
    });
    setIsExportTableDataDialogOpen(true)

    setIsBoxOpen(false)
  }

  const handleClickExportAllData = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'download',
      section_name: 'mis suministros',
      subsection_name: 'mi contador',
      click_text: 'exportar todos los datos disponibles',
      elemet_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      module_name: 'historial de consultas',
    });
    setIsExportAllDataDialogOpen(true)

    setIsBoxOpen(false)
  }

  return (
    <Grid item className={classes.container}>
      <Grid container className={classes.button} onClick={handleOpenBox}>
        <Grid item>
          {t('supplies.suppliesDetails.components.consumption.charts.downloads.export')}
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
            <Grid container className={`${classes.export} ${classes.exportWithBorder}`} onClick={handleClickExportTableData}>
              <Grid item className={classes.exportIcon}>
                <img src={ConsumptionIcon} alt='' />
              </Grid>

              <Grid item className={classes.exportText}>{t('supplies.suppliesDetails.components.consumption.charts.downloads.exportData')} {t('supplies.suppliesDetails.components.consumption.charts.downloads.table')}</Grid>
            </Grid>

            <Grid container className={classes.export} onClick={handleClickExportAllData}>
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
