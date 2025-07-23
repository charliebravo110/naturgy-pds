import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import XLSX from 'xlsx'
import { ExportToCsv } from 'export-to-csv'

import Grid from '@material-ui/core/Grid'

import Spinner from '../../../../../../../common/components/spinner/Spinner'
import Button from '../../../../../../../common/components/button/Button'
import CloseIcon from '../../../../../../../assets/icons/cerrar.svg'
import AlertIcon from '../../../../../../../assets/icons/aviso_alerta_pop_up.svg'

import ExportExcelIcon from '../../../../../../../assets/icons/exportar_excel.svg'
import { formatDate, formatDateBars } from '../../../../../../../common/lib/FormatLib'

import {
  thunkGetCurrentSupplyConsumptions,
  thunkGetCurrentSupplyBillingPeriods
} from '../../../../../store/actions/SuppliesDetailsThunkActions'

import useStyles from './Content.styles'
import { isMobileApp } from '../../../../../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../../../../../mobile-apps/local-downloads/createFileAndOpenIt'
import Modales from '../../../charts/filters/error-message/Modales'
import useStyles_ from '../../../charts/filters/error-message/SessionTimeout.styles'
import useModal from '../../../charts/filters/error-message/UseModal'

const Content = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    supplyData,
    supplantedUser,
    isExportPeriodDataDialogOpen,
    handleClose,
    isGeneration,
    isGenerationTab,
    isSelfConsumption
  } = props

  const roles = sessionStorage.getItem('userRoles') || ''
  const suppliesListStore = useSelector((state: any) => state.supplies.list)
  const delegatesInMe = useSelector((state: any) => state.delegations.delegatesInMeList)

  const isDelegate = (roles.includes('US_MANAGER') || roles.includes('US_CONSULTANT')) && suppliesListStore.filter(supply => supply.cups === (supplyData && supplyData.cups))[0] ? false : delegatesInMe.filter(supply => supply.cups === (supplyData && supplyData.cups))[0] ? true : false

  const billingPeriods = useSelector((state: any) => state.supplies.currentSupplyBillingPeriods)

  const [isLoading, setIsLoading] = useState(true)
  const [fileType, setFileType] = useState('excel')
  const [periodSelected, setPeriodSelected] = useState(0)
  const [periodSelectedStartDate, setPeriodSelectedStartDate] = useState('')
  const [periodSelectedEndDate, setPeriodSelectedEndDate] = useState('')

  const [exportingData, setExportingData] = useState(false)

  let valueEHCR: any
  let valueEHAC: any
  let valueEHCCA: any
  let valueEHEX: any
  let valueEHNG: any
  let valueEHCSA: any
  let valueEHCRi: any
  let valueEHACi: any
  let valueEHCi: any
  let valueEHEXi: any
  let valueEHNGi: any
  let valueEHEXG: any

  let containEHCR = false as boolean
  let containEHAC = false as boolean
  let containEHCCA = false as boolean
  let containEHEX = false as boolean
  let containEHNG = false as boolean
  let containEHCSA = false as boolean
  let containEHCRi = false as boolean
  let containEHACi = false as boolean
  let containEHCi = false as boolean
  let containEHEXi = false as boolean
  let containEHNGi = false as boolean
  let containEHEXG = false as boolean


  let auxConsumptionsData = [] as any

  const insertValues = (value: any, value2: any) => {
    value2 = parseFloat(value.replace(',', '.')).toFixed(2).replace('.', ',')
    return value2
  }

  const checkSelfConsumptionEnergies = (item: any) => {

    if (item.EHCR) {
      valueEHCR = insertValues(item.EHCR, valueEHCR)
      if (!containEHCR) {
        containEHCR = true
      }
    } else {
      valueEHCR = ''
    }

    if (item.EHAC) {
      valueEHAC = insertValues(item.EHAC, valueEHAC)
      if (!containEHAC) {
        containEHAC = true
      }
    } else {
      valueEHAC = ''
    }

    if (item.EHCCA) {
      valueEHCCA = insertValues(item.EHCCA, valueEHCCA)
      if (!containEHCCA) {
        containEHCCA = true
      }
    } else {
      valueEHCCA = ''
    }

    if (item.EHEX) {
      valueEHEX = insertValues(item.EHEX, valueEHEX)
      if (!containEHEX) {
        containEHEX = true
      }
    } else {
      valueEHEX = ''
    }

    if (item.EHNG) {
      valueEHNG = insertValues(item.EHNG, valueEHNG)
      if (!containEHNG) {
        containEHNG = true
      }
    } else {
      valueEHNG = ''
    }

    if (item.EHCRi) {
      valueEHCRi = insertValues(item.EHCRi, valueEHCRi)
      if (!containEHCRi) {
        containEHCRi = true
      }
    } else {
      valueEHCRi = ''
    }

    if (item.EHACi) {
      valueEHACi = insertValues(item.EHACi, valueEHACi)
      if (!containEHACi) {
        containEHACi = true
      }
    } else {
      valueEHACi = ''
    }

    if (item.EHCi) {
      valueEHCi = insertValues(item.EHCi, valueEHCi)
      if (!containEHCi) {
        containEHCi = true
      }
    } else {
      valueEHCi = ''
    }

    if (item.EHEXi) {
      valueEHEXi = insertValues(item.EHEXi, valueEHEXi)
      if (!containEHEXi) {
        containEHEXi = true
      }
    } else {
      valueEHEXi = ''
    }

    if (item.EHNGi) {
      valueEHNGi = insertValues(item.EHNGi, valueEHNGi)
      if (!containEHNGi) {
        containEHNGi = true
      }
    } else {
      valueEHNGi = ''
    }

    if (item.EHCSA) {
      valueEHCSA = insertValues(item.EHCSA, valueEHCSA)
      if (!containEHCSA) {
        containEHCSA = true
      }
    } else {
      valueEHCSA = ''
    }

    if (item.EHEXG) {
      valueEHEXG = insertValues(item.EHEXG, valueEHEXG)
      if (!containEHEXG) {
        containEHEXG = true
      }
    } else {
      valueEHEXG = ''
    }

  }

  const selfConsumptionPush = (item: any) => {

    auxConsumptionsData.push({
      cups: supplyData.cups ? supplyData.cups : '0',
      date: item.date ? item.date : '00/00/0000',
      hour: item.hour ? (item.hour !== '' ? (item.hour + ':00') : item.hour) : '0',
      EHCR: containEHCR ? (valueEHCR !== '' ? (valueEHCR + ' kWh') : valueEHCR) : '',
      EHAC: containEHAC ? (valueEHAC !== '' ? (valueEHAC + ' kWh') : valueEHAC) : '',
      EHCCA: containEHCCA ? (valueEHCCA !== '' ? (valueEHCCA + ' kWh') : valueEHCCA) : '',
      EHEX: containEHEX ? (valueEHEX !== '' ? (valueEHEX + ' kWh') : valueEHEX) : '',
      EHNG: containEHNG ? (valueEHNG !== '' ? (valueEHNG + ' kWh') : valueEHNG) : '',
      EHCSA: containEHCSA ? (valueEHCSA !== '' ? (valueEHCSA + ' kWh') : valueEHCSA) : '',
      EHCRi: containEHCRi ? (valueEHCRi !== '' ? (valueEHCRi + ' kWh') : valueEHCRi) : '',
      EHACi: containEHACi ? (valueEHACi !== '' ? (valueEHACi + ' kWh') : valueEHACi) : '',
      EHCi: containEHCi ? (valueEHCi !== '' ? (valueEHCi + ' kWh') : valueEHCi) : '',
      EHEXi: containEHEXi ? (valueEHEXi !== '' ? (valueEHEXi + ' kWh') : valueEHEXi) : '',
      EHNGi: containEHNGi ? (valueEHNGi !== '' ? (valueEHNGi + ' kWh') : valueEHNGi) : '',
      EHEXG: containEHEXG ? (valueEHEXG !== '' ? (valueEHEXG + ' kWh') : valueEHEXG) : '',
    })
  }

  const handleClickPeriod = (period) => {
    setPeriodSelected(period)

    setPeriodSelectedStartDate(formatDateBars(billingPeriods[period].periodStartDate))

    setPeriodSelectedEndDate(formatDateBars(billingPeriods[period].periodEndDate))
  }

  useEffect(() => {
    if (isExportPeriodDataDialogOpen) {
      let endDate = new Date()
      let startDate = new Date(endDate.getFullYear() - 2, endDate.getMonth(), endDate.getDate())

      dispatch(thunkGetCurrentSupplyBillingPeriods(supplyData.cups, formatDate(startDate), formatDate(endDate), setIsLoading, (response) => {
        if (response.billingPeriods) {
          setPeriodSelectedStartDate(response.billingPeriods && formatDateBars(response.billingPeriods.items[0].periodStartDate))

          setPeriodSelectedEndDate(response.billingPeriods && formatDateBars(response.billingPeriods.items[0].periodEndDate))
        } else {
          handleClose()
        }
      }))
    }
  }, [isExportPeriodDataDialogOpen, dispatch, supplyData.cups])

  const handleExport = () => {
    setExportingData(true)

    if (isSelfConsumption) {
      dispatch(thunkGetCurrentSupplyConsumptions(false, supplyData.holderDocumentNumber, supplyData.cups, 'D', periodSelectedStartDate, periodSelectedEndDate, null, supplyData.isGenerator, supplantedUser, isDelegate, setExportingData, '1', supplyData.measurementSystem, (response) => {
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
                checkSelfConsumptionEnergies(item)
                selfConsumptionPush(item)
                return null
              }
            )

            auxConsumptionsData.map(
              (item) => {
                if (!containEHCR) {
                  delete item.EHCR
                }
                if (!containEHAC) {
                  delete item.EHAC
                }
                if (!containEHCCA) {
                  delete item.EHCCA
                }
                if (!containEHEX) {
                  delete item.EHEX
                }
                if (!containEHNG) {
                  delete item.EHNG
                }
                if (!containEHCSA) {
                  delete item.EHCSA
                }
                if (!containEHCRi) {
                  delete item.EHCRi
                }
                if (!containEHACi) {
                  delete item.EHACi
                }
                if (!containEHCi) {
                  delete item.EHCi
                }
                if (!containEHEXi) {
                  delete item.EHEXi
                }
                if (!containEHNGi) {
                  delete item.EHNGi
                }
                if (!containEHEXG) {
                  delete item.EHEXG
                }

              }
            )

            ws = XLSX.utils.json_to_sheet(auxConsumptionsData)

            fileName = 'selfconsumptions.xlsx'

            const wb = XLSX.utils.book_new()

            XLSX.utils.book_append_sheet(wb, ws, 'selfconsumptions')

            XLSX.writeFile(wb, fileName)

            // XLSX.writeFile will attempt to force a client-side download, works for web,
            // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
            if (isMobileApp()) createFileAndOpenIt({ fileName, contentAsBase64: XLSX.write(wb, { type: 'base64' }) })
            
          } else {

            response && response.map(
              (item) => {
                checkSelfConsumptionEnergies(item)
                selfConsumptionPush(item)
                return null
              }
            )

            auxConsumptionsData.map(
              (item) => {
                if (!containEHCR) {
                  delete item.EHCR
                }
                if (!containEHAC) {
                  delete item.EHAC
                }
                if (!containEHCCA) {
                  delete item.EHCCA
                }
                if (!containEHEX) {
                  delete item.EHEX
                }
                if (!containEHNG) {
                  delete item.EHNG
                }
                if (!containEHCSA) {
                  delete item.EHCSA
                }
                if (!containEHCRi) {
                  delete item.EHCRi
                }
                if (!containEHACi) {
                  delete item.EHACi
                }
                if (!containEHCi) {
                  delete item.EHCi
                }
                if (!containEHEXi) {
                  delete item.EHEXi
                }
                if (!containEHNGi) {
                  delete item.EHNGi
                }
                if (!containEHEXG) {
                  delete item.EHEXG
                }

              }
            )

            // to csv
            const csvExporter = new ExportToCsv()

            csvExporter.generateCsv(auxConsumptionsData)
          }
        }
      }))
    } else {
      dispatch(thunkGetCurrentSupplyConsumptions(false, supplyData.holderDocumentNumber, supplyData.cups, 'C', periodSelectedStartDate, periodSelectedEndDate, null, supplyData.isGenerator, supplantedUser, isDelegate, setExportingData, '0', supplyData.measurementSystem, (response) => {
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
                        auxConsumptionValue = consumption.activeOutput
                      } else {
                        auxConsumptionValue = consumption.activeInput
                      }
                    } else {
                      auxConsumptionValue = consumption.consumptionValue
                    }

                    if (auxConsumptionValue) {
                      auxConsumptionsData.push({
                        cups: supplyData.cups ? supplyData.cups : '0',
                        date: consumption.consumptionDate ? consumption.consumptionDate : '00/00/0000',
                        hour: consumption.hour ? consumption.hour : '0',
                        consumption: auxConsumptionValue ? auxConsumptionValue : '0,000',
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

            fileName = 'consumptions.xlsx'

            const wb = XLSX.utils.book_new()

            XLSX.utils.book_append_sheet(wb, ws, 'consumptions')

            XLSX.writeFile(wb, fileName)

            // XLSX.writeFile will attempt to force a client-side download, works for web,
            // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
            if (isMobileApp()) createFileAndOpenIt({ fileName, contentAsBase64: XLSX.write(wb, { type: 'base64' }) })
            
          } else {
            auxConsumptionsData.push({
              cups: t('supplies.suppliesDetails.components.consumption.exportDialogs.cups2'),
              date: t('supplies.suppliesDetails.components.consumption.exportDialogs.date'),
              hour: t('supplies.suppliesDetails.components.consumption.exportDialogs.hour'),
              value: ((isGeneration && isGenerationTab) ? t('supplies.suppliesDetails.components.consumption.exportDialogs.generation2') : t('supplies.suppliesDetails.components.consumption.exportDialogs.consumption2')),
              readingType: t('supplies.suppliesDetails.components.consumption.exportDialogs.method2')
            })

            response && response.map(
              (item) => {

                return item.consumptions && item.consumptions.items && item.consumptions.items.map(
                  (consumption) => {
                    let auxConsumptionValue

                    if (isGeneration) {
                      if (isGenerationTab) {
                        auxConsumptionValue = consumption.activeOutput
                      } else {
                        auxConsumptionValue = consumption.activeInput
                      }
                    } else {
                      auxConsumptionValue = consumption.consumptionValue
                    }

                    if (auxConsumptionValue) {
                      let cups = supplyData.cups || '0'

                      if (cups.length === 20) {
                        cups = cups + '1P'
                      }

                      let auxConsumptionsItem = {
                        cups,
                        date: consumption.consumptionDate ? consumption.consumptionDate : '00/00/0000',
                        hour: consumption.hour ? consumption.hour : '0',
                        value: auxConsumptionValue ? auxConsumptionValue : '0,000',
                        readingType: consumption.readingType ? consumption.readingType : '0'
                      }

                      auxConsumptionsData.push(auxConsumptionsItem)
                    }

                    return null
                  }
                )
              }
            )

            const options = {
              filename: 'consumptions',
              fieldSeparator: ';',
              quoteStrings: '',
              decimalSeparator: ',',
              showLabels: false,
              showTitle: false,
              useTextFile: false,
              useBom: true,
              useKeysAsHeaders: false
            }

            // to csv
            const csvExporter = new ExportToCsv(options)

            csvExporter.generateCsv(auxConsumptionsData)
          }
        }
      }))
    }
  }
  const code = useSelector((state: any) => state.error.code)
  const classes_ = useStyles_({});
  const [ModalMessage, setModalMessage] = useState('');
  const [ModalSecondMessage, setModalSecondMessage] = useState('');
  const {isOpen, toggle} = useModal();

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
      {
        (isLoading || exportingData) &&
        <Spinner />
      }

      <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleClose} />

      <div className={classes.title}>{t('supplies.suppliesDetails.components.consumption.exportDialogs.exportPeriodDataDialog.exportBilling')}</div>

      <div className={classes.advice}>{t('supplies.suppliesDetails.components.consumption.exportDialogs.exportPeriodDataDialog.periodBilling')}</div>
      {code && code === 'TE03000004' &&
        <div className={classes.adviceerror}>{t('errors.TE03000004')}</div>
      }

      <Grid container className={classes.periodsContainer}>
        <Grid item className={classes.periods}>
          <div className={classes.list}>
            {
              (!isLoading && billingPeriods) &&
              (
                billingPeriods.length === 0 ?
                  <div>no hay periodos</div>
                  :
                  billingPeriods.map(
                    (period, index) => (
                      <Grid
                        container
                        className={classes.period}
                        key={index}
                        onClick={() => handleClickPeriod(index)}
                      >
                        <Grid item className={`${classes.radioButton} ${periodSelected === index && 'active'}`} />

                        <Grid item className={classes.label}>{formatDateBars(period.periodStartDate)}{t('supplies.suppliesDetails.components.consumption.exportDialogs.exportPeriodDataDialog.to')}{formatDateBars(period.periodEndDate)}</Grid>
                      </Grid>
                    )
                  )
              )
            }
          </div>
        </Grid>
      </Grid>

      {
        !isSelfConsumption &&
        <div className={classes.options}>
          <div className={classes.boldText}>{t('supplies.suppliesDetails.components.consumption.exportDialogs.downloadFormat')}</div>

          <div className={classes.text}>
            {t('supplies.suppliesDetails.components.consumption.exportDialogs.webSimulator1')}<a href='https://facturaluz.cnmc.es/' target='_blank' rel='noopener noreferrer'>facturaluz.cnmc.es</a>{t('supplies.suppliesDetails.components.consumption.exportDialogs.webSimulator2')}
          </div>

          <Grid container className={classes.exports}>
            <Grid
              container
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

                <Grid item className={classes.label}>{t('supplies.suppliesDetails.components.consumption.exportDialogs.exportExcel')}</Grid>
              </Grid>
            </Grid>

            <Grid
              container
              item
              className={`${classes.export} marginTop`}
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

                <Grid item className={classes.label}>{t('supplies.suppliesDetails.components.consumption.exportDialogs.downloadInText')}</Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      }


      <Grid container className={classes.buttonContainer}>
        <Grid item>
          <Button
            text={t('supplies.suppliesDetails.components.consumption.exportDialogs.buttomExpot')}
            color={'primary'}
            size={'large'}
            variant={'contained'}
            onClick={handleExport}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default withRouter(Content)
