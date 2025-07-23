import React, { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Mode from '../mode/Mode'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Button from '../../../../../../common/components/button/Button'
import Datepicker from '../../../../../../common/components/datepicker/Datepicker'
import Reload from '../../../../../../assets/icons/reload.png'
import ArrowTooltip from '../../../../../../common/components/tooltip/arrow/ArrowTooltip'
import DownloadsSimple from '../downloads/DownloadsSimple'


import { formatDate, formatDateHyphens } from '../../../../../../common/lib/FormatLib'

import { setCurrentCompareConsumptions } from '../../../../../store/actions/SuppliesActions'

import useStyles from './Filters.styles'
import { sendGAEvent } from '../../../../../../core/utils/gtm'

const Filters = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const mobileRes = useMediaQuery('(max-width:576px)')

  const {
    consumptionsFilters,
    setConsumptionsFilters,
    setIsExportTableDataDialog,
    auxStartDate,
    selfConsumption,
    setIsExportPeriodDataDialog,
    setAuxStartDate,
    auxEndDate,
    setAuxEndDate,
    setIsExportAllDataDialog,
    mode,
    isGeneration,
    isGenerationTab,
    currentSupplyConsumptions,
    autoConsumption,
    supplyData,
    setShowingDialog,
    showingDialog
  } = props
  const handleOpenDialog = () => {
    setShowingDialog(true)
  }
  const handleChangeGranularity = (granularity: string) => {
    let startDate
    let endDate

    setCurrentCompareConsumptions([])

    if (consumptionsFilters.granularity === 'H') {
      let auxDate = new Date(formatDateHyphens(auxEndDate))
      let auxDate2 = new Date(formatDateHyphens(auxEndDate))

      startDate = formatDate(auxDate2)
      endDate = formatDate(auxDate)
    } else if (consumptionsFilters.granularity === 'Q') {
      let auxDate = new Date(formatDateHyphens(auxEndDate))
      let auxDate2 = new Date(formatDateHyphens(auxEndDate))

      startDate = formatDate(auxDate2)
      endDate = formatDate(auxDate)
    } else if (consumptionsFilters.granularity === 'H') {
      startDate = formatDate(new Date(formatDateHyphens(auxEndDate)))
      endDate = startDate
    }


    setConsumptionsFilters({
      ...consumptionsFilters,
      granularity,
      startDate,
      endDate,
      compare: 'N'
    })
  }


  const handleClickButton = () => {
    let startDate
    let endDate

    setCurrentCompareConsumptions([])

    if (consumptionsFilters.granularity === 'D') {

      let auxDate = new Date(formatDateHyphens(auxEndDate))
      auxDate = new Date(auxDate.getFullYear(), auxDate.getMonth() + 1, 0)
      let auxDate2 = new Date(formatDateHyphens(auxEndDate))
      auxDate2 = new Date(auxDate.getFullYear(), auxDate.getMonth(), 1)

      startDate = formatDate(auxDate2)
      endDate = formatDate(auxDate)
    }
    else if (consumptionsFilters.granularity === 'S') {
      //auxEndDate es la fecha que escogemos en el DataPicker 
      let dayOfWeek = new Date(formatDateHyphens(auxEndDate)).getDay()
      let today = new Date(formatDateHyphens(auxEndDate)).getDate()
      let auxDate = new Date(formatDateHyphens(auxEndDate))

      switch (dayOfWeek) {
        case 0:
          startDate = formatDate(new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 6))
          endDate = formatDate(new Date(auxDate.getFullYear(), auxDate.getMonth(), today))
          break;
        case 1:
          startDate = formatDate(new Date(auxDate.getFullYear(), auxDate.getMonth(), today))
          endDate = formatDate(new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 6))
          break;
        case 2:
          startDate = formatDate(new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 1))
          endDate = formatDate(new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 5))
          break;
        case 3:
          startDate = formatDate(new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 2))
          endDate = formatDate(new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 4))
          break;
        case 4:
          startDate = formatDate(new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 3))
          endDate = formatDate(new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 3))
          break;
        case 5:
          startDate = formatDate(new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 4))
          endDate = formatDate(new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 2))
          break;
        case 6:
          startDate = formatDate(new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 5))
          endDate = formatDate(new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 1))
          break;
      }
    }
    else {
      startDate = auxStartDate
      endDate = auxEndDate
    }
    setConsumptionsFilters({
      ...consumptionsFilters,
      startDate: consumptionsFilters.granularity === 'H' ? endDate : startDate,
      endDate: endDate,
      compare: 'N'
    })
  }

  const handleDay = (date: any) => {
    let startDate
    let endDate

    setCurrentCompareConsumptions([])

    setAuxEndDate(formatDate(date))

    let auxDate = new Date(formatDateHyphens(formatDate(date)))
    let auxDate2 = new Date(formatDateHyphens(formatDate(date)))

    startDate = formatDate(auxDate2)
    endDate = formatDate(auxDate)

    setConsumptionsFilters({
      ...consumptionsFilters,
      startDate,
      endDate,
      compare: 'N'
    })
  }

  const sendGAEventCompare = ():void => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      subsection_name: 'mi consumo',
      click_text: 'comparar',
      element_type: 'consulta de informacion',
      page_url: window.location.href,
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      tab_name: sessionStorage.getItem('tab1_MiConsumo') ? sessionStorage.getItem('tab1_MiConsumo') : 'energia consumida kwh',
      subtab_name: 'grafica',
      see_consumption: granularityCalc(consumptionsFilters.granularity),
    })
  }

  const sendGAEventSeeConsumption = ():void => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      subsection_name: 'mi consumo',
      click_text: 'ver consumo',
      element_type: 'consulta de informacion',
      page_url: window.location.href,
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      tab_name: sessionStorage.getItem('tab1_MiConsumo') ? sessionStorage.getItem('tab1_MiConsumo') : 'energia consumida kwh',
      subtab_name: 'grafica',
      see_consumption: granularityCalc(consumptionsFilters.granularity),
    })
  }

  const granularityCalc = (e:any):any => {
    switch (e) {
      case 'M':
        return 'periodo'
      case 'D':
        return 'mes'
      case 'S':
        return 'semana'
      default: 
        return 'dia'
    }
  }

  return (
    <Grid item md={12} sm={12} xs={12} className={classes.container}>
      <Grid container className={classes.menu}>

        {
          consumptionsFilters.granularity === 'M' &&
          <>
            <Grid item md={3} sm={2} xs={12} className={classes.menuItem}>
              <div className={classes.label}>{t('supplies.suppliesDetails.components.consumption.charts.filters.startDate')}</div>
              {
                currentSupplyConsumptions.length > 0 ?
                  <Datepicker date={auxStartDate} setDate={setAuxStartDate} maxDate={auxEndDate} popperPlacement={mobileRes ? 'bottom-start' : 'right-start'} />
                  :
                  <Datepicker date={auxStartDate} setDate={setAuxStartDate} maxDate={auxEndDate} popperPlacement={mobileRes ? 'bottom-start' : 'right-start'} />
              }
            </Grid>

            <Grid item md={3} sm={2} xs={12} className={classes.menuItem}>
              <div className={classes.label}>{t('supplies.suppliesDetails.components.consumption.charts.filters.endDate')}</div>
              {
                currentSupplyConsumptions.length > 0 ?
                  <Datepicker date={auxEndDate} setDate={setAuxEndDate} minDate={auxStartDate} popperPlacement={mobileRes ? 'bottom-start' : 'right-start'} />
                  :
                  <Datepicker date={auxEndDate} setDate={setAuxEndDate} minDate={auxStartDate} popperPlacement={mobileRes ? 'bottom-start' : 'right-start'} />
              }
            </Grid>
          </>
        }

        {
          consumptionsFilters.granularity === 'D' &&
          <Grid item md={3} sm={2} xs={10} className={classes.menuItem}>
            <div className={classes.label}>{t('supplies.suppliesDetails.components.consumption.charts.filters.month')}</div>
            {
              currentSupplyConsumptions.length > 0 ?
                <Datepicker date={auxEndDate} setDate={setAuxEndDate} showMonthYearPicker popperPlacement={mobileRes ? 'bottom-start' : 'right-start'} />
                :
                <Datepicker date={auxEndDate} setDate={setAuxEndDate} showMonthYearPicker popperPlacement={mobileRes ? 'bottom-start' : 'right-start'} />
            }
          </Grid>
        }

        {
          consumptionsFilters.granularity === 'S' &&
          <Grid item md={3} sm={2} xs={10} className={classes.menuItem}>
            <div className={classes.label}>{t('supplies.suppliesDetails.components.consumption.charts.filters.week')}</div>
            {
              currentSupplyConsumptions.length > 0 ?
                <Datepicker date={auxEndDate} setDate={setAuxEndDate} popperPlacement={mobileRes ? 'bottom-start' : 'right-start'} />
                :
                <Datepicker date={auxEndDate} setDate={setAuxEndDate} popperPlacement={mobileRes ? 'bottom-start' : 'right-start'} />
            }
          </Grid>
        }

        {
          (consumptionsFilters.granularity === 'H' || consumptionsFilters.granularity === 'Q') &&
          <Grid item md={3} sm={2} xs={10} className={classes.menuItem}>
            <div className={classes.label}>{t('supplies.suppliesDetails.components.consumption.charts.filters.day')}</div>
            {
              currentSupplyConsumptions.length > 0 ?
                <Datepicker date={auxEndDate} popperPlacement={mobileRes ? 'bottom-start' : 'right-start'} onChange={(e) => handleDay(e)} />
                :
                <Datepicker date={auxEndDate} popperPlacement={mobileRes ? 'bottom-start' : 'right-start'} onChange={(e) => handleDay(e)} />
            }
          </Grid>
        }
        {
          ((consumptionsFilters.granularity === 'H') || (consumptionsFilters.granularity === 'Q')) && (supplyData.measurementSystem && supplyData.measurementSystem === 'G' && !autoConsumption) &&
          <Grid item md={2} sm={2} xs={4} className={`${classes.menuItem2} ${consumptionsFilters.granularity === 'H' ? 'active' : ''}`} onClick={() => handleChangeGranularity('H')}>
            {t('supplies.suppliesDetails.components.consumption.charts.views.Hour')}
          </Grid>
        }
        {
          ((consumptionsFilters.granularity === 'H') || (consumptionsFilters.granularity === 'Q')) && (supplyData.measurementSystem && supplyData.measurementSystem === 'G' && !autoConsumption) &&
          <Grid item md={2} sm={2} xs={4} className={`${classes.menuItem2} ${consumptionsFilters.granularity === 'Q' ? 'active' : ''}`} onClick={() => handleChangeGranularity('Q')}>
            {t('supplies.suppliesDetails.components.consumption.charts.views.quarter')}
          </Grid>
        }

        {
          ((supplyData.measurementSystem && supplyData.measurementSystem === 'O') || (consumptionsFilters.granularity === 'M' || consumptionsFilters.granularity === 'D' || consumptionsFilters.granularity === 'S') || autoConsumption) &&
          <Grid item md={4} sm={4} xs={4} className={classes.buttonContainer}>
            <Button
              className={classes.button}
              text={
                !mobileRes ?
                  autoConsumption ?
                    t('supplies.suppliesDetails.components.consumption.charts.filters.buttonSeeSelfConsumption')
                    :
                    (isGeneration && isGenerationTab) ?
                      t('supplies.suppliesDetails.components.consumption.charts.filters.buttonSeeGeneration')
                      :
                      t('supplies.suppliesDetails.components.consumption.charts.filters.buttonSeeConsumption')
                  :
                  <img src={Reload} className={classes.reload} alt='' />}
              color={'primary'}
              size={'medium'}
              variant={'contained'}
              onClick={() => { sendGAEventSeeConsumption(); handleClickButton()}}
            />
          </Grid>

        }
        {/* COMPARAR */}
        {
          <Grid item className={classes.buttonContainer}>
            {
              consumptionsFilters.granularity === 'M' ?
                <ArrowTooltip title={t('supplies.suppliesDetails.components.consumption.charts.actions.tooltip')} placement='top' >
                  <span>
                    <Button
                      className={classes.button}
                      text={t('supplies.suppliesDetails.components.consumption.charts.views.compare')}
                      color={'primary'}
                      size={'medium'}
                      variant={'contained'}
                      onClick={() => { sendGAEventCompare(); handleOpenDialog()}}
                      disabled={(consumptionsFilters.granularity === 'M' || currentSupplyConsumptions.length === 0) ? true : false}
                    />
                  </span>
                </ArrowTooltip>
                :
                <Button
                  className={classes.button}
                  text={t('supplies.suppliesDetails.components.consumption.charts.views.compare')}
                  color={'primary'}
                  size={'medium'}
                  variant={'contained'}
                  onClick={() => { sendGAEventCompare(); handleOpenDialog()}}
                  disabled={(consumptionsFilters.granularity === 'M' || currentSupplyConsumptions.length === 0) ? true : false}
                />
            }
          </Grid>
        }
        <DownloadsSimple
          supplyData={supplyData}
          mode={mode}
          startDate={consumptionsFilters.startDate}
          endDate={consumptionsFilters.endDate}
          setIsExportTableDataDialog={setIsExportTableDataDialog}
          setIsExportPeriodDataDialog={setIsExportPeriodDataDialog}
          setIsExportAllDataDialog={setIsExportAllDataDialog}
          isGeneration={isGeneration}
          isGenerationTab={isGenerationTab}
          autoConsumption={selfConsumption}
          granularity={consumptionsFilters.granularity}
        />




      </Grid>
    </Grid>
  )
}

export default Filters
