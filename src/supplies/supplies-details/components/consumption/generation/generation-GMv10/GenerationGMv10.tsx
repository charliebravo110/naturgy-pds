import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import XLSX from 'xlsx'

import Grid from '@material-ui/core/Grid'

import ExportExcelIcon from '../../../../../../assets/icons/exportar_excel.svg'
import Datepicker from '../../../../../../common/components/datepicker/Datepicker'
import Button from '../../../../../../common/components/button/Button'

import {
  thunkGetCurrentSupplyConsumptions
} from '../../../../store/actions/SuppliesDetailsThunkActions'

import useStyles from './GenerationGMv10.styles'
import { formatDate, formatDayAndMonthToDate } from '../../../../../../common/lib/FormatLib'
import { isMobileApp } from '../../../../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../../../../mobile-apps/local-downloads/createFileAndOpenIt'
import useModal from '../../charts/filters/error-message/UseModal'
import Modales from '../../charts/filters/error-message/Modales'
import useStyles_ from '../../charts/filters/error-message/SessionTimeout.styles'
import AlertIcon from '../../../../../../assets/icons/aviso_alerta_pop_up.svg'
import CloseIcon from '../../../../../../../assets/icons/cerrar.svg'

const GenerationGMv10 = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    setIsLoading,
    supplyData,
    supplantedUser,
    isGeneration,
    isGenerationTab,
    consumptionsFilters
  } = props

  const roles = sessionStorage.getItem('userRoles') || ''
  const suppliesListStore = useSelector((state: any) => state.supplies.list)
  const delegatesInMe = useSelector((state: any) => state.delegations.delegatesInMeList)

  const isDelegate = (roles.includes('US_MANAGER') || roles.includes('US_CONSULTANT')) && suppliesListStore.filter(supply => supply.cups === (supplyData && supplyData.cups))[0] ? false : delegatesInMe.filter(supply => supply.cups === (supplyData && supplyData.cups))[0] ? true : false

  const [auxStartDate, setAuxStartDate] = useState()
  const [auxEndDate, setAuxEndDate] = useState('')
  const [auxStartDateCompare, setAuxStartDateCompare] = useState()
  const [auxEndDateCompare, setAuxEndDateCompare] = useState('')
  const [auxEndMaxDate, setAuxEndMaxDate] = useState('')
  const [auxEndMaxDateCompare, setAuxEndMaxDateCompare] = useState('')
  const [compare, setCompare] = useState('N')

  const [granularity, setGranularity] = useState('')

  let datepicker = useRef([React.createRef<HTMLDivElement>(), React.createRef<HTMLDivElement>()])

  const [fileType, setFileType] = useState('excel')

  const getLastDayDate = (dateTo: string, oneMonthMore: boolean) => {
    const arrDate = dateTo.split('/')
    const date = new Date()
    let endMonth: any = parseInt(arrDate[1])
    let endYear: any = parseInt(arrDate[2])
    if (oneMonthMore) {
      if ((endMonth >= date.getMonth() + 1) && (date.getFullYear() === endYear)) { } else {
        endMonth++
      }
      if (endMonth === 13) {
        endYear++
        endMonth = 1
      }
    }
    endMonth = endMonth.toString().length === 1 ? '0' + endMonth : endMonth
    const endDay = new Date(parseInt(endYear), parseInt(endMonth), 0).getDate()
    return endDay + '/' + endMonth + '/' + endYear
  }

  useEffect(() => {
    if (auxStartDate) {
      let dateini1 = formatDayAndMonthToDate(auxStartDate)
      let dateini2 = formatDayAndMonthToDate(auxStartDate)
      let dateini3 = formatDayAndMonthToDate(auxStartDate)
      let endDate1 = new Date(dateini1.setMonth(dateini1.getMonth()+1))
      let endDate2 = new Date(dateini2.setMonth(dateini2.getMonth()+2))
      let endDate3 = new Date(dateini3.setMonth(dateini3.getMonth()+3))
      let today = new Date()
      if (endDate1.getTime() > today.getTime()) {
        setAuxEndDate(formatDate(today))
        setAuxEndMaxDate(formatDate(today))
      } else if (endDate2.getTime() > today.getTime()) {
        setAuxEndDate(formatDate(endDate1))
        setAuxEndMaxDate(formatDate(endDate1))
      } else if (endDate3.getTime() > today.getTime()) {
        setAuxEndDate(formatDate(endDate2))
        setAuxEndMaxDate(formatDate(endDate2))
      } else {
        setAuxEndDate(formatDate(endDate3))
        setAuxEndMaxDate(formatDate(endDate3))
      }
    }
  }, [ auxStartDate ])

  useEffect(() => {
    if (auxStartDateCompare) {
      let dateinicompare1 = formatDayAndMonthToDate(auxStartDateCompare)
      let dateinicompare2 = formatDayAndMonthToDate(auxStartDateCompare)
      let dateinicompare3 = formatDayAndMonthToDate(auxStartDateCompare)
      let endDatecompare1 = new Date(dateinicompare1.setMonth(dateinicompare1.getMonth()+1))
      let endDatecompare2 = new Date(dateinicompare2.setMonth(dateinicompare2.getMonth()+2))
      let endDatecompare3 = new Date(dateinicompare3.setMonth(dateinicompare3.getMonth()+3))
      let today = new Date()
      if (endDatecompare1.getTime() > today.getTime()) {
        setAuxEndDateCompare(formatDate(today))
        setAuxEndMaxDateCompare(formatDate(today))
      } else if (endDatecompare2.getTime() > today.getTime()) {
        setAuxEndDateCompare(formatDate(endDatecompare1))
        setAuxEndMaxDateCompare(formatDate(endDatecompare1))
      } else if (endDatecompare3.getTime() > today.getTime()) {
        setAuxEndDateCompare(formatDate(endDatecompare2))
        setAuxEndMaxDateCompare(formatDate(endDatecompare2))
      } else {
        setAuxEndDateCompare(formatDate(endDatecompare3))
        setAuxEndMaxDateCompare(formatDate(endDatecompare3))
      }
    }
  }, [ auxStartDateCompare ])

  useEffect(() => {
    if (datepicker.current) {
      datepicker.current.map(item => {
        if (item.current) {
          item.current.querySelector('input').placeholder = t('supplies.suppliesDetails.components.consumption.charts.filters.placeholder')
        }

        return null
      })
    }
    // eslint-disable-next-line
  }, [datepicker])

  //Funcion que ejecutamos al pulsar comparar
  const handleCompare = () => {
    if (compare === 'N') {
      setCompare('C')
    } else {
      setCompare('N')
    }
  }

  const handleExport = () => {
    setIsLoading(true)
    const endDate = getLastDayDate(auxEndDate, false)
    const endDateCompare = getLastDayDate(auxEndDateCompare, false)
    dispatch(thunkGetCurrentSupplyConsumptions(false, supplyData.holderDocumentNumber, supplyData.cups, granularity, auxStartDate, endDate, null, supplyData.isGenerator, supplantedUser, isDelegate, setIsLoading, (supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '') ? '1' : '0', supplyData.measurementSystem, (response) => {
      if (response == 'showModalError1007') {
        setModalMessage('errors.autoconsumo.1007')
        setModalSecondMessage('')
        toggle();
        return;
      } else {
        const auxConsumptionsData = [] as any

        let ws

        let fileName

        if (fileType === 'excel') {
          response && response.map(
            (item) => {
              return item.consumptions && item.consumptions.items && item.consumptions.items.map(
                (consumption) => {
                  let auxConsumptionValue

                  if (isGeneration) {
                    if (isGenerationTab) {
                      if (consumptionsFilters.showR2 === 'S')
                      {
                        auxConsumptionValue = consumption.reactive2
                      }
                      else if (consumptionsFilters.showR3 === 'S')
                      { 
                        auxConsumptionValue = consumption.reactive3
                      }
                      else
                      {
                        auxConsumptionValue = consumption.activeOutput
                      }
                    } else {
                      if (consumptionsFilters.showR2 === 'S')
                      {
                        auxConsumptionValue = consumption.reactive2
                      }
                      else if (consumptionsFilters.showR3 === 'S')
                      {
                        auxConsumptionValue = consumption.reactive3
                      }
                      else
                      { 
                        auxConsumptionValue = consumption.activeInput
                      }
                    }
                  } else {
                    if (consumptionsFilters.showR1 === 'S')
                    {
                      auxConsumptionValue = consumption.reactive1
                    }
                    else if (consumptionsFilters.showR4 === 'S')
                    {
                      auxConsumptionValue = consumption.reactive4
                    }
                    else
                    {
                      auxConsumptionValue = consumption.consumptionValue
                    }
                  }

                  if (auxConsumptionValue) {
                    auxConsumptionsData.push({
                      cups: supplyData.cups ? supplyData.cups : '0',
                      date: consumption.consumptionDate ? consumption.consumptionDate : '00/00/0000',
                      hour: consumption.hour ? consumption.hour : '0',
                      consumption: auxConsumptionValue ? auxConsumptionValue.replace(',', '.') : '0.000',
                      obtainingMethod: consumption.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation')
                    })
                  }

                  return null
                }
              )
            }
          )
        } else {
          response && response.map(
            (item) => {
              return item.consumptions && item.consumptions.items && item.consumptions.items.map(
                (consumption) => {
                  let auxConsumptionValue

                  if (isGeneration) {
                    if (isGenerationTab) {
                      if (consumptionsFilters.showR2 === 'S')
                      {
                        auxConsumptionValue = consumption.reactive2
                      }
                      else if (consumptionsFilters.showR3 === 'S')
                      { 
                        auxConsumptionValue = consumption.reactive3
                      }
                      else
                      {
                        auxConsumptionValue = consumption.activeOutput
                      }
                    } else {
                      if (consumptionsFilters.showR2 === 'S')
                      {
                        auxConsumptionValue = consumption.reactive2
                      }
                      else if (consumptionsFilters.showR3 === 'S')
                      {
                        auxConsumptionValue = consumption.reactive3
                      }
                      else
                      { 
                        auxConsumptionValue = consumption.activeInput
                      }
                    }
                  } else {
                    if (consumptionsFilters.showR1 === 'S')
                    {
                      auxConsumptionValue = consumption.reactive1
                    }
                    else if (consumptionsFilters.showR4 === 'S')
                    {
                      auxConsumptionValue = consumption.reactive4
                    }
                    else
                    {
                      auxConsumptionValue = consumption.consumptionValue
                    }
                  }

                  if (auxConsumptionValue) {
                    let auxConsumptionsItem = [
                      supplyData.cups ? supplyData.cups : '0',
                      consumption.consumptionDate ? consumption.consumptionDate : '00/00/0000',
                      consumption.hour ? consumption.hour : '0',
                      auxConsumptionValue ? auxConsumptionValue.replace(',', '.') : '0.000',
                      consumption.readingType ? consumption.readingType : '0'
                    ]

                    auxConsumptionsData.push({
                      item: auxConsumptionsItem.join(';')
                    })
                  }

                  return null
                }
              )
            }
          )
        }
        if (compare === 'C') {
          dispatch(thunkGetCurrentSupplyConsumptions(false, supplyData.holderDocumentNumber, supplyData.cups, granularity, auxStartDateCompare, endDateCompare, null, supplyData.isGenerator, supplantedUser, isDelegate, setIsLoading, supplyData.isSelfConsumption ? '1' : '0', supplyData.measurementSystem, (response) => {
            if (response == 'showModalError1007') {
              setModalMessage('errors.autoconsumo.1007')
              setModalSecondMessage('')
              toggle();
              return;
            } else {  
              let ws

              let fileName

              if (fileType === 'excel') {
                response && response.map(
                  (item) => {
                    return item.consumptions && item.consumptions.items && item.consumptions.items.map(
                      (consumption) => {
                        let auxConsumptionValue

                        if (isGeneration) {
                          if (isGenerationTab) {
                            if (consumptionsFilters.showR2 === 'S')
                            {
                              auxConsumptionValue = consumption.reactive2
                            }
                            else if (consumptionsFilters.showR3 === 'S')
                            { 
                              auxConsumptionValue = consumption.reactive3
                            }
                            else
                            {
                              auxConsumptionValue = consumption.activeOutput
                            }
                          } else {
                            if (consumptionsFilters.showR2 === 'S')
                            {
                              auxConsumptionValue = consumption.reactive2
                            }
                            else if (consumptionsFilters.showR3 === 'S')
                            {
                              auxConsumptionValue = consumption.reactive3
                            }
                            else
                            { 
                              auxConsumptionValue = consumption.activeInput
                            }
                          }
                        } else {
                          if (consumptionsFilters.showR1 === 'S')
                          {
                            auxConsumptionValue = consumption.reactive1
                          }
                          else if (consumptionsFilters.showR4 === 'S')
                          {
                            auxConsumptionValue = consumption.reactive4
                          }
                          else
                          {
                            auxConsumptionValue = consumption.consumptionValue
                          }
                        }

                        if (auxConsumptionValue) {
                          auxConsumptionsData.push({
                            cups: supplyData.cups ? supplyData.cups : '0',
                            date: consumption.consumptionDate ? consumption.consumptionDate : '00/00/0000',
                            hour: consumption.hour ? consumption.hour : '0',
                            consumption: auxConsumptionValue ? auxConsumptionValue.replace(',', '.') : '0.000',
                            obtainingMethod: consumption.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation')
                          })
                        }

                        return null
                      }
                    )
                  }
                )

                ws = XLSX.utils.json_to_sheet(auxConsumptionsData, {
                  header: [
                    'cups',
                    'date',
                    'hour',
                    'consumption',
                    'obtainingMethod'
                  ]
                })

                ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups')
                ws['B1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
                ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')
                ws['D1'].v = (isGeneration && isGenerationTab) ? t('supplies.suppliesDetails.components.consumption.exportDialogs.generation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.consumption')
                ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.method')

                fileName = 'generated.xlsx'
              } else {
                response && response.map(
                  (item) => {
                    return item.consumptions && item.consumptions.items && item.consumptions.items.map(
                      (consumption) => {
                        let auxConsumptionValue

                        if (isGeneration) {
                          if (isGenerationTab) {
                            if (consumptionsFilters.showR2 === 'S')
                            {
                              auxConsumptionValue = consumption.reactive2
                            }
                            else if (consumptionsFilters.showR3 === 'S')
                            { 
                              auxConsumptionValue = consumption.reactive3
                            }
                            else
                            {
                              auxConsumptionValue = consumption.activeOutput
                            }
                          } else {
                            if (consumptionsFilters.showR2 === 'S')
                            {
                              auxConsumptionValue = consumption.reactive2
                            }
                            else if (consumptionsFilters.showR3 === 'S')
                            {
                              auxConsumptionValue = consumption.reactive3
                            }
                            else
                            { 
                              auxConsumptionValue = consumption.activeInput
                            }
                          }
                        } else {
                          if (consumptionsFilters.showR1 === 'S')
                          {
                            auxConsumptionValue = consumption.reactive1
                          }
                          else if (consumptionsFilters.showR4 === 'S')
                          {
                            auxConsumptionValue = consumption.reactive4
                          }
                          else
                          {
                            auxConsumptionValue = consumption.consumptionValue
                          }
                        }

                        if (auxConsumptionValue) {
                          let auxConsumptionsItem = [
                            supplyData.cups ? supplyData.cups : '0',
                            consumption.consumptionDate ? consumption.consumptionDate : '00/00/0000',
                            consumption.hour ? consumption.hour : '0',
                            auxConsumptionValue ? auxConsumptionValue.replace(',', '.') : '0.000',
                            consumption.readingType ? consumption.readingType : '0'
                          ]

                          auxConsumptionsData.push({
                            item: auxConsumptionsItem.join(';')
                          })
                        }

                        return null
                      }
                    )
                  }
                )

                ws = XLSX.utils.json_to_sheet(auxConsumptionsData, {
                  header: [
                    'item'
                  ]
                })

                ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups2') + ';' + t('supplies.suppliesDetails.components.consumption.exportDialogs.date') + ';' + t('supplies.suppliesDetails.components.consumption.exportDialogs.hour') + ';' + ((isGeneration && isGenerationTab) ? t('supplies.suppliesDetails.components.consumption.exportDialogs.generation2') : t('supplies.suppliesDetails.components.consumption.exportDialogs.consumption2')) + '_kWh;' + t('supplies.suppliesDetails.components.consumption.exportDialogs.method2')

                fileName = 'generated.csv'
              }

              const wb = XLSX.utils.book_new()

              XLSX.utils.book_append_sheet(wb, ws, 'generated')

              XLSX.writeFile(wb, fileName)

              // XLSX.writeFile will attempt to force a client-side download, works for web,
              // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
              if (isMobileApp()) createFileAndOpenIt({ fileName, contentAsBase64: XLSX.write(wb, { type: 'base64' }) })
            }  
          }))
        }
        else {
          if (fileType === 'excel') {
            ws = XLSX.utils.json_to_sheet(auxConsumptionsData, {
              header: [
                'cups',
                'date',
                'hour',
                'consumption',
                'obtainingMethod'
              ]
            })

            ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups')
            ws['B1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
            ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')
            ws['D1'].v = (isGeneration && isGenerationTab) ? t('supplies.suppliesDetails.components.consumption.exportDialogs.generation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.consumption')
            ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.method')

            fileName = 'generated.xlsx'
          }
          else {
            ws = XLSX.utils.json_to_sheet(auxConsumptionsData, {
              header: [
                'item'
              ]
            })

            ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups2') + ';' + t('supplies.suppliesDetails.components.consumption.exportDialogs.date') + ';' + t('supplies.suppliesDetails.components.consumption.exportDialogs.hour') + ';' + ((isGeneration && isGenerationTab) ? t('supplies.suppliesDetails.components.consumption.exportDialogs.generation2') : t('supplies.suppliesDetails.components.consumption.exportDialogs.consumption2')) + '_kWh;' + t('supplies.suppliesDetails.components.consumption.exportDialogs.method2')

            fileName = 'generated.csv'
          }

          const wb = XLSX.utils.book_new()

          XLSX.utils.book_append_sheet(wb, ws, 'generated')

          XLSX.writeFile(wb, fileName)

          // XLSX.writeFile will attempt to force a client-side download, works for web,
          // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
          if (isMobileApp()) createFileAndOpenIt({ fileName, contentAsBase64: XLSX.write(wb, { type: 'base64' }) })
          
        }
      }
    }))
  }
  const {isOpen, toggle} = useModal();
  const [ModalMessage, setModalMessage] = useState('')
  const [ModalSecondMessage, setModalSecondMessage] = useState('')
  const classes_ = useStyles_({})
  return (
    <>
    <Modales isOpne={isOpen} toggle={toggle}>
        <img src={CloseIcon} className={classes_.closeButton} alt='close' onClick={toggle} />
        <img src={AlertIcon}/>
        <div className={classes_.title}>
          {t(ModalMessage)}
        </div>
        <div className={classes_.body}>
          {t(ModalSecondMessage)}
        </div>
        <Grid item>
          <Grid container justifyContent='center'>
            <Button
              className={classes_.button}
              text={t('errors.date.button.accept')}
              color='primary'
              size='large'
              variant='contained'
              onClick={toggle}
            />
          </Grid>
        </Grid>
      </Modales>
    <Grid>
      <Grid
        container
        direction='column'
        md={12}
        className={classes.description}
      >
        <Grid item>
          {t('supplies.suppliesDetails.components.consumption.consumption.displayConsumptionGMv10-1-generation')}
        </Grid>
        <Grid item>
          {t('supplies.suppliesDetails.components.consumption.consumption.displayConsumptionGMv10-2')}
        </Grid>
      </Grid>

      <Grid
        container
        md={10}
        xs={12}
        className={classes.menu}
      >
        <Grid item md={4} sm={4} xs={6} className={classes.menuItem} ref={datepicker.current[0]}>
          <div className={classes.dateLabel}>{t('supplies.suppliesDetails.components.consumption.charts.filters.startDate')}</div>

          <Datepicker
            date={auxStartDate}
            setDate={setAuxStartDate}
            showMonthYearPicker
          />
        </Grid>
        <Grid item md={4} sm={4} xs={6} className={classes.menuItem} ref={datepicker.current[1]}>
          <div className={classes.dateLabel}>{t('supplies.suppliesDetails.components.consumption.charts.filters.endDate')}</div>

          <Datepicker
            disabled={!auxStartDate}
            date={auxEndDate}
            setDate={setAuxEndDate}
            minDateGMv10={auxStartDate}
            maxDateGMv10={auxEndMaxDate}
            consumptionGMv10
            showMonthYearPicker
          />
        </Grid>

        <Grid item md={4} sm={4} xs={6} className={classes.menuItem}>
          <div className={classes.dateLabel}>{t('supplies.suppliesDetails.components.consumption.charts.filters.consult')}</div>

          <Grid container className={classes.hourSelectors}>
            <Grid item className={classes.hourSelectorsItem}>
              <div
                className={`${classes.radioButton} ${granularity === 'H' && 'active'}`}
                onClick={() => setGranularity('H')}
              />

              <span>{t('supplies.suppliesDetails.components.consumption.charts.filters.hour')}</span>
            </Grid>

            <Grid item className={classes.hourSelectorsItem}>
              <div
                className={`${classes.radioButton} ${granularity === 'Q' && 'active'}`}
                onClick={() => setGranularity('Q')}
              />

              <span>{t('supplies.suppliesDetails.components.consumption.charts.filters.hour4')}</span>
            </Grid>
            <Grid container justifyContent='center' alignItems='center' className={`${classes.menuItemCompare} ${compare === 'C' && 'active'}`} onClick={() => handleCompare()} >
              <Grid item>{t('supplies.suppliesDetails.components.consumption.charts.views.compare')}</Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {compare === 'C' &&
        <Grid
          container
          md={10}
          xs={12}
          className={classes.menu}
        >
          <Grid item md={4} sm={4} xs={6} className={classes.menuItem} ref={datepicker.current[0]}>
            <div className={classes.dateLabel}>{t('supplies.suppliesDetails.components.consumption.charts.filters.startDateCompare')}</div>

            <Datepicker
              date={auxStartDateCompare}
              setDate={setAuxStartDateCompare}
              showMonthYearPicker
            />
          </Grid>
          <Grid item md={4} sm={4} xs={6} className={classes.menuItem} ref={datepicker.current[1]}>
            <div className={classes.dateLabel}>{t('supplies.suppliesDetails.components.consumption.charts.filters.endDateCompare')}</div>

            <Datepicker
              disabled={!auxStartDateCompare}
              date={auxEndDateCompare}
              setDate={setAuxEndDateCompare}
              minDateGMv10={auxStartDateCompare}
              maxDateGMv10={auxEndMaxDateCompare}
              consumptionGMv10
              showMonthYearPicker
            />
          </Grid>
        </Grid>
      }

      {
        auxEndDate &&
        <Grid container direction='column' className={classes.downloadBlock}>
          <Grid container spacing={3} className={classes.downloadTextBlock}>
            <Grid item className={classes.downloadTextBold}>
              {t('supplies.suppliesDetails.components.consumption.exportGMv10.title')}
            </Grid>
            <Grid item>
              {t('supplies.suppliesDetails.components.consumption.exportGMv10.text')}
            </Grid>
          </Grid>
          <Grid item>
            <Grid container>
              <Grid
                item
                className={classes.export}
                sm={12}
                xs={12}
                md='auto'
                onClick={() => setFileType('excel')}
              >
                <Grid container className={classes.exportContainer}>
                  <Grid item className={`${classes.checkbox} ${fileType === 'excel' && 'active'}`} />

                  <Grid item className={classes.icon}>
                    <img src={ExportExcelIcon} alt='' />
                  </Grid>

                  <Grid item className={classes.label}>{t('supplies.suppliesDetails.components.consumption.exportGMv10.exportType.excel')}</Grid>
                </Grid>
              </Grid>

              <Grid
                item
                className={`${classes.export} marginLeft marginTop`}
                sm={12}
                xs={12}
                md='auto'
                onClick={() => setFileType('csv')}
              >
                <Grid container className={classes.exportContainer}>
                  <Grid item className={`${classes.checkbox} ${fileType === 'csv' && 'active'}`} />

                  <Grid item className={classes.icon}>
                    <img src={ExportExcelIcon} alt='' />
                  </Grid>

                  <Grid item className={classes.label}>{t('supplies.suppliesDetails.components.consumption.exportGMv10.exportType.csv')}</Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }


      <Grid container justifyContent='center' className={classes.buttonBlock}>
        <Grid item>
          <Button
            text={fileType === 'excel' ? t('supplies.suppliesDetails.components.consumption.exportGMv10.exportButtons.excel') : t('supplies.suppliesDetails.components.consumption.exportGMv10.exportButtons.csv')}
            color='primary'
            size='large'
            variant='contained'
            disabled={!auxStartDate || !auxEndDate || (compare === 'S' && (!auxStartDateCompare || !auxEndDateCompare)) || fileType === '' || granularity === ''}
            onClick={handleExport}
          />
        </Grid>
      </Grid>
    </Grid>
    </>
  )
}

export default GenerationGMv10
