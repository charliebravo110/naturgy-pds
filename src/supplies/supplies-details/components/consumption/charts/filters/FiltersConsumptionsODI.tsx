import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import XLSX from 'xlsx'
import { ExportToCsv } from 'export-to-csv'

import moment from 'moment';

import { format } from 'date-fns';
import Button from '../../../../../../common/components/button/Button'
import Datepicker from '../../../../../../common/components/datepickerV2/DatepickerV2'
import Reload from '../../../../../../assets/icons/reload.png'
import InfoIcon from '../../../../../../assets/icons/ico_info.svg'
import { thunkGetCurrentSupplyConsumptions } from '../../../../store/actions/SuppliesDetailsThunkActions'
import CloseIcon from '../../../../../../assets/icons/cerrar.svg'
import AlertIcon from '../../../../../../assets/icons/aviso_alerta_pop_up.svg'

import { completeDateWithSlash, completeDateWithSlashNoHour, formatDate, formatDateHyphens } from '../../../../../../common/lib/FormatLib'

import { setCurrentCompareConsumptions } from '../../../../../store/actions/SuppliesActions'

import useStyles from './Filters.styles'

import useStyles_ from './error-message/SessionTimeout.styles'
import Select from '../../../../../../common/components/select/Select'
import { set } from 'lodash'
import useModal from './error-message/UseModal'
import Modales from './error-message/Modales'
import { sendGAEvent } from '../../../../../../core/utils/gtm'


// Inicio PPM 1007707
const FiltersConsumptionsODI = (props: any) => {
  const classes = useStyles({})
  const classes_ = useStyles_({})
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { isOpen, toggle } = useModal()
  //const [isLoading, setIsLoading] = useState<boolean>(false);

  const mobileRes = useMediaQuery('(max-width:576px)')
  const {
    downLoadFilters,
    setDownLoadFilters,
    consumptionsFilters,
    setConsumptionsFilters,
    supplantedUser,
    isDelegate,
    isSelfConsumption,
    isGeneration,
    isGenerationTab,
    autoConsumption,
    supplyData,
    mode,
    handleExportConsumptions,
    billingPeriods,
    isLoading,
    setIsLoading

  } = props


  const [exportingData, setExportingData] = useState(false)
  const [periodValue, setPeriodValue] = useState('')
  const [enableButton, setEnableButton] = useState<boolean>(false)
  const [auxStartDate, setAuxStartDate] = useState<Date>();
  const [stringStartDate, setStringStartDate] = useState('')
  const [auxEndDate, setAuxEndDate] = useState<Date>();
  const [stringEndDate, setStringEndDate] = useState('')
  const [granularity, setGranularity] = useState('F')
  const [ModalMessage, setModalMessage] = useState('')
  const [ModalSecondMessage, setModalSecondMessage] = useState('')

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

  const verifyDatas = () => {
    let distYear = auxEndDate.getFullYear() - auxStartDate.getFullYear();
    if (distYear < 0 || (distYear === 0 && auxEndDate.getDate() < auxStartDate.getDate())) {
      distYear--
    }
    if (distYear >= 2) {
      return true;
    } else {
      return false;
    }
  }

  const handleExport = (fileType: any) => {
    setIsLoading(true)
    setExportingData(true)
    auxConsumptionsData = []
    var startDate = ''
    var endDate = ''

    if (downLoadFilters.tipo === 'periodo') {

      startDate = formatDate(auxStartDate)
      endDate = formatDate(auxEndDate)
    } else if (downLoadFilters.tipo === '24meses') {

      const fecha = new Date();
      endDate = formatDate(fecha)
      fecha.setFullYear(fecha.getFullYear() - 2)
      startDate = formatDate(fecha);
    } else if (downLoadFilters.tipo === 'facturacion') {

      startDate = stringStartDate
      endDate = stringEndDate
    }
    if (consumptionsFilters.showR4 === 'S') {

      dowloadReactiveGenerated(fileType, startDate, endDate)
    }
    else if (consumptionsFilters.showR1 === 'S') {

      dowloadReactiveConsumed(fileType, startDate, endDate)
    }
    else if (autoConsumption) {

      dowloadSelfConsumptions(startDate, endDate)
    }
    else if (isGeneration) {

      dowloadConsumptionsGeneration(fileType, startDate, endDate)
    } else {

      dowloadConsumptions(fileType, startDate, endDate)
    }
 

  }

  const formatDateReverse = (stringDate: any) => {
    let st = (stringDate.replace('/', '.')).replace('/', '.');
    let pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
    st = st.replace(pattern, '$3-$2-$1');
    return st;
  }

  const dowloadReactiveGenerated = (fileType: any, startDate: any, endDate: any) => {

    dispatch(thunkGetCurrentSupplyConsumptions(false, supplyData.holderDocumentNumber, supplyData.cups, granularity, startDate, endDate, null, supplyData.isGenerator, supplantedUser, isDelegate, setExportingData, '0', supplyData.measurementSystem, (response) => {
      setIsLoading(true)

      if (response == 'showModalError1007') {
        setModalMessage('errors.autoconsumo.1007')
        setModalSecondMessage('')
        toggle();
      } else {

        let ws
        let fileName

        if (fileType === 'excel') {

          response && response.map(
            (item) => {
              return item.consumptions && item.consumptions.items && item.consumptions.items.map(
                (consumption) => {
                  let auxConsumptionValue
                  let auxDate
                  if (consumption.consumptionDate) {
                    auxDate = consumption.consumptionDate.split('/')
                  }

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
                      cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      date: consumption.consumptionDate ? supplyData.measurementSystem === 'G' ? auxDate[1] + '/' + auxDate[2] : consumption.consumptionDate : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      hour: consumption.hour ? consumption.hour : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      consumption: consumption.reactive4 ? consumption.reactive4 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      obtainingMethod: consumption.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : consumption.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
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
              'obtainingMethod',
            ]
          })

          ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups')
          ws['B1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
          ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')
          ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.Rkw4')
          ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.method')

          fileName = 'consumptions.xlsx'

          const wb = XLSX.utils.book_new()

          XLSX.utils.book_append_sheet(wb, ws, 'consumptions')

          XLSX.writeFile(wb, fileName)

        }
        
        else if (fileType === 'csv') {
          setIsLoading(true)

          let diaPrevious = ''
          let horaPrevious = ''

          response && response.map(
            (item) => {
              let auxHour: number = 1

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
                      date: consumption.consumptionDate ? consumption.consumptionDate : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      hour: consumption.hour ? consumption.hour : '0',
                      value: consumption.reactive4 ? consumption.reactive4 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      readingType: consumption.readingType ? consumption.readingType : '',
                      isCambioHora: (consumption.consumptionDate === diaPrevious && consumption.hour === horaPrevious)
                    }
                    diaPrevious = consumption.consumptionDate
                    horaPrevious = consumption.hour

                    auxConsumptionsData.push(auxConsumptionsItem)
                  }

                  auxHour++

                  return null
                }
              )
            }
          )

          let auxConsumptionsDataUnique = [];
          let exists = false;
          let duplicadoCiclo = false;
          let date = 'Fecha';
          let hour = 'Hora';
          let iniBucle = 0;
          let finBucle = auxConsumptionsDataUnique.length;
          for (let i = 1; i < auxConsumptionsData.length; i++) {
            let diaConsumptionsFormat = formatDateReverse(auxConsumptionsData[i].date);
            if (!duplicadoCiclo) {
              if (exists && date !== auxConsumptionsData[i].date && hour) {
                exists = false;
              }
              else {
                for (let j = iniBucle; j < finBucle; j++) {
                  let diaConsumptionsFormatUnique = formatDateReverse(auxConsumptionsDataUnique[j].date);
                  if ((auxConsumptionsData[i].hour === auxConsumptionsDataUnique[j].hour) && (auxConsumptionsData[i].date === auxConsumptionsDataUnique[j].date) && (!auxConsumptionsData[i].isCambioHora)) {
                    exists = true;
                    date = auxConsumptionsData[i].date;
                    hour = auxConsumptionsData[i].hour;
                    iniBucle = j;
                  }
                  else if (diaConsumptionsFormatUnique > diaConsumptionsFormat) {
                    duplicadoCiclo = true;
                    break;
                  }
                }
              }
              if (duplicadoCiclo) {
                break;
              }
              else if (!exists) {
                let auxConsumptionsItem = {
                  cups: auxConsumptionsData[i].cups,
                  date: auxConsumptionsData[i].date,
                  hour: auxConsumptionsData[i].hour,
                  value: auxConsumptionsData[i].value,
                  readingType: auxConsumptionsData[i].readingType
                }
                auxConsumptionsDataUnique.push(auxConsumptionsItem);
                finBucle = auxConsumptionsDataUnique.length;
              }
            }
          }

          auxConsumptionsDataUnique.unshift({
            cups: t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.cups'),
            date: t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.fecha'),
            hour: t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.hora'),
            value: t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.consumo'),
            readingType: t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.metodo_obtencion'),
          })

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

          csvExporter.generateCsv(auxConsumptionsDataUnique)


          setIsLoading(false)
        }
      }
      setIsLoading(false)
    
    }))
  }

  const dowloadReactiveConsumed = (fileType: any, startDate: any, endDate: any) => {
    dispatch(thunkGetCurrentSupplyConsumptions(false, supplyData.holderDocumentNumber, supplyData.cups, granularity, startDate, endDate, null, supplyData.isGenerator, supplantedUser, isDelegate, setExportingData, '0', supplyData.measurementSystem, (response) => {
      setIsLoading(true)
      if (response == 'showModalError1007') {
        setModalMessage('errors.autoconsumo.1007')
        setModalSecondMessage('')
        toggle();
      } else {
        let ws
        let fileName

        if (fileType === 'excel') {
          response && response.map(
            (item) => {
              return item.consumptions && item.consumptions.items && item.consumptions.items.map(
                (consumption) => {
                  let auxConsumptionValue
                  let auxDate
                  if (consumption.consumptionDate) {
                    auxDate = consumption.consumptionDate.split('/')
                  }

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
                      cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      date: consumption.consumptionDate ? supplyData.measurementSystem === 'G' ? auxDate[1] + '/' + auxDate[2] : consumption.consumptionDate : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      hour: consumption.hour ? consumption.hour : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      consumption: consumption.reactive1 ? consumption.reactive1 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      obtainingMethod: consumption.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : consumption.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
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
              'obtainingMethod',
            ]
          })

          ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups')
          ws['B1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
          ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')
          ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.Rkw1')
          ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.method')

          fileName = 'consumptions.xlsx'

          const wb = XLSX.utils.book_new()

          XLSX.utils.book_append_sheet(wb, ws, 'consumptions')

          XLSX.writeFile(wb, fileName)
        } 
        
        else if (fileType === 'csv') {
          let diaPrevious = ''
          let horaPrevious = ''

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
                      date: consumption.consumptionDate ? consumption.consumptionDate : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      hour: consumption.hour ? consumption.hour : '0',
                      value: consumption.reactive1 ? consumption.reactive1 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      readingType: consumption.readingType ? consumption.readingType : '',
                      isCambioHora: (consumption.consumptionDate === diaPrevious && consumption.hour === horaPrevious)
                    }
                    diaPrevious = consumption.consumptionDate
                    horaPrevious = consumption.hour

                    auxConsumptionsData.push(auxConsumptionsItem)
                  }

                  return null
                }
              )
            }
          )

          let auxConsumptionsDataUnique = [];
          let exists = false;
          let duplicadoCiclo = false;
          let date = 'Fecha';
          let hour = 'Hora';
          let iniBucle = 0;
          let finBucle = auxConsumptionsDataUnique.length;
          for (let i = 0; i < auxConsumptionsData.length; i++) {
            let diaConsumptionsFormat = formatDateReverse(auxConsumptionsData[i].date);
            if (!duplicadoCiclo) {
              if (exists && date !== auxConsumptionsData[i].date && hour) {
                exists = false;
              }
              else {
                for (let j = iniBucle; j < finBucle; j++) {
                  let diaConsumptionsFormatUnique = formatDateReverse(auxConsumptionsDataUnique[j].date);
                  if ((auxConsumptionsData[i].hour === auxConsumptionsDataUnique[j].hour) && (auxConsumptionsData[i].date === auxConsumptionsDataUnique[j].date) && (!auxConsumptionsData[i].isCambioHora)) {
                    exists = true;
                    date = auxConsumptionsData[i].date;
                    hour = auxConsumptionsData[i].hour;
                    iniBucle = j;
                  }
                  else if (diaConsumptionsFormatUnique > diaConsumptionsFormat) {
                    duplicadoCiclo = true;
                    break;
                  }
                }
              }
              if (duplicadoCiclo) {
                break;
              }
              else if (!exists) {
                let auxConsumptionsItem = {
                  cups: auxConsumptionsData[i].cups,
                  date: auxConsumptionsData[i].date,
                  hour: auxConsumptionsData[i].hour,
                  value: auxConsumptionsData[i].value,
                  readingType: auxConsumptionsData[i].readingType
                }
                auxConsumptionsDataUnique.push(auxConsumptionsItem);
                finBucle = auxConsumptionsDataUnique.length;
              }
            }
          }

          auxConsumptionsDataUnique.unshift({
            cups: t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.cups'),
            date: t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.fecha'),
            hour: t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.hora'),
            value: t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.consumo'),
            readingType: t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.metodo_obtencion'),
          })

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

          csvExporter.generateCsv(auxConsumptionsDataUnique)
        }
      }
      setIsLoading(false)
    }))
    
  }
  const dowloadSelfConsumptions = (startDate: any, endDate: any) => {
    dispatch(thunkGetCurrentSupplyConsumptions(false, supplyData.holderDocumentNumber, supplyData.cups, granularity, startDate, endDate, null, supplyData.isGenerator, supplantedUser, isDelegate, setExportingData, '1', supplyData.measurementSystem, (response) => {
      setIsLoading(true)
      if (response == 'showModalError1007') {
        setModalMessage('errors.autoconsumo.1007')
        setModalSecondMessage('')
        toggle();
      } else {
        let ws
        let fileName
        response && response.map(
          (item) => {
            auxConsumptionsData.push({
              cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              date: item.date ? item.date : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              hour: item.hour ? item.hour : '0',
              EHAC: item.EHAC ? item.EHAC : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              EHACi: item.EHACi ? item.EHACi : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              EHCCA: item.EHCCA ? item.EHCCA : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              EHCR: item.EHCR ? item.EHCR : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              EHCRi: item.EHCRi ? item.EHCRi : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              EHCSA: item.EHCSA ? item.EHCSA : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              EHCi: item.EHCi ? item.EHCi : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              EHEX: item.EHEX ? item.EHEX : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              EHEXG: item.EHEXG ? item.EHEXG : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              EHEXi: item.EHEXi ? item.EHEXi : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              EHNG: item.EHNG ? item.EHNG : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              EHNGi: item.EHNGi ? item.EHNGi : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),

            })
          }
        )
        ws = XLSX.utils.json_to_sheet(auxConsumptionsData, {
          header: [
            'cups',
            'date',
            'hour',
            'EHAC',
            'EHACi',
            'EHCCA',
            'EHCR',
            'EHCRi',
            'EHCSA',
            'EHCi',
            'EHEX',
            'EHEXG',
            'EHEXi',
            'EHNG',
            'EHNGi',
          ]
        })

        ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups')
        ws['B1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
        ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')
        ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHAC')
        ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHACi')
        ws['F1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHCCA')
        ws['G1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHCR')
        ws['H1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHCRi')
        ws['I1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHCSA')
        ws['J1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHCi')
        ws['K1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHEX')
        ws['L1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHEXG')
        ws['M1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHEXi')
        ws['N1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHNG')
        ws['O1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHNGi')

        fileName = 'Autoconsumptions.xlsx'
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'consumptions')
        XLSX.writeFile(wb, fileName)
      }
      setIsLoading(false)    
    }))
    
  }

  const dowloadConsumptionsGeneration = (fileType: any, startDate: any, endDate: any) => {
    dispatch(thunkGetCurrentSupplyConsumptions(false, supplyData.holderDocumentNumber, supplyData.cups, granularity, startDate, endDate, null, supplyData.isGenerator, supplantedUser, isDelegate, setExportingData, '0', supplyData.measurementSystem, (response) => {
      setIsLoading(true)
      if (response == 'showModalError1007') {
        setModalMessage('errors.autoconsumo.1007')
        setModalSecondMessage('')
        toggle();
      } else {
        let ws
        let fileName

        if (fileType === 'excel') {
          response && response.map(
            (item) => {
              return item.consumptions && item.consumptions.items && item.consumptions.items.map(
                (consumption) => {
                  let auxConsumptionValue
                  let auxDate
                  if (consumption.consumptionDate) {
                    auxDate = consumption.consumptionDate.split('/')
                  }

                  if (isGeneration) {
                    if (isGenerationTab) {
                      auxConsumptionValue = consumption.activeOutput
                    } else {
                      auxConsumptionValue = consumption.activeInput
                    }
                  } else {
                    auxConsumptionValue = consumption.consumptionValue
                  }

                  if (auxConsumptionValue && isGeneration) {
                    auxConsumptionsData.push({
                      cups: supplyData.cups ? supplyData.cups : '0',
                      date: consumption.consumptionDate ? supplyData.measurementSystem === 'G' ? auxDate[1] + '/' + auxDate[2] : consumption.consumptionDate : '00/00/0000',
                      hour: consumption.hour ? consumption.hour : '0',
                      consumption: auxConsumptionValue ? auxConsumptionValue : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      p1: consumption.consumptionValueP1 ? consumption.consumptionValueP1 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      p2: consumption.consumptionValueP2 ? consumption.consumptionValueP2 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      p3: consumption.consumptionValueP3 ? consumption.consumptionValueP3 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      p4: consumption.consumptionValueP4 ? consumption.consumptionValueP4 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      p5: consumption.consumptionValueP5 ? consumption.consumptionValueP5 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      p6: consumption.consumptionValueP6 ? consumption.consumptionValueP6 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      obtainingMethod: consumption.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : consumption.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
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
              'p1',
              'p2',
              'p3',
              'p4',
              'p5',
              'p6',
              'obtainingMethod'
            ]
          })

          ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups')
          ws['B1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
          ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')
          ws['D1'].v = (isGeneration && isGenerationTab) ? t('supplies.suppliesDetails.components.consumption.exportDialogs.generation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.consumption')
          ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo1')
          ws['F1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo2')
          ws['G1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo3')
          ws['H1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo4')
          ws['I1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo5')
          ws['J1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo6')
          ws['K1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.method')

          fileName = 'consumptions.xlsx'

          const wb = XLSX.utils.book_new()

          XLSX.utils.book_append_sheet(wb, ws, 'consumptions')

          XLSX.writeFile(wb, fileName)
        } else if (fileType === 'csv') {
          let diaPrevious = ''
          let horaPrevious = ''

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
                      readingType: consumption.readingType ? consumption.readingType : '',
                      isCambioHora: (consumption.consumptionDate === diaPrevious && consumption.hour === horaPrevious)
                    }
                    diaPrevious = consumption.consumptionDate
                    horaPrevious = consumption.hour

                    auxConsumptionsData.push(auxConsumptionsItem)
                  }

                  return null
                }
              )
            }
          )

          let auxConsumptionsDataUnique = [];
          let exists = false;
          let duplicadoCiclo = false;
          let date = 'Fecha';
          let hour = 'Hora';
          let iniBucle = 0;
          let finBucle = auxConsumptionsDataUnique.length;
          for (let i = 0; i < auxConsumptionsData.length; i++) {
            let diaConsumptionsFormat = formatDateReverse(auxConsumptionsData[i].date);
            if (!duplicadoCiclo) {
              if (exists && date !== auxConsumptionsData[i].date && hour) {
                exists = false;
              }
              else {
                for (let j = iniBucle; j < finBucle; j++) {
                  let diaConsumptionsFormatUnique = formatDateReverse(auxConsumptionsDataUnique[j].date);
                  if ((auxConsumptionsData[i].hour === auxConsumptionsDataUnique[j].hour) && (auxConsumptionsData[i].date === auxConsumptionsDataUnique[j].date) && (!auxConsumptionsData[i].isCambioHora)) {
                    exists = true;
                    date = auxConsumptionsData[i].date;
                    hour = auxConsumptionsData[i].hour;
                    iniBucle = j;
                  }
                  else if (diaConsumptionsFormatUnique > diaConsumptionsFormat) {
                    duplicadoCiclo = true;
                    break;
                  }
                }
              }
              if (duplicadoCiclo) {
                break;
              }
              else if (!exists) {
                let auxConsumptionsItem = {
                  cups: auxConsumptionsData[i].cups,
                  date: auxConsumptionsData[i].date,
                  hour: auxConsumptionsData[i].hour,
                  value: auxConsumptionsData[i].value,
                  readingType: auxConsumptionsData[i].readingType
                }
                auxConsumptionsDataUnique.push(auxConsumptionsItem);
                finBucle = auxConsumptionsDataUnique.length;
              }
            }
          }

          auxConsumptionsDataUnique.unshift({
            cups: t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.cups'),
            date: t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.fecha'),
            hour: t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.hora'),
            value: t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.consumo'),
            readingType: t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.metodo_obtencion'),
          })

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

          csvExporter.generateCsv(auxConsumptionsDataUnique)
        }
      }
      setIsLoading(false)
    }))

  }

  const dowloadConsumptions = (fileType: any, startDate: any, endDate: any) => {

    dispatch(thunkGetCurrentSupplyConsumptions(false, supplyData.holderDocumentNumber, supplyData.cups, granularity, startDate, endDate, null, supplyData.isGenerator, supplantedUser, isDelegate, setExportingData, '0', supplyData.measurementSystem, (response) => {
      setIsLoading(true)

      if (response == 'showModalError1007') {
        setModalMessage('errors.autoconsumo.1007')
        setModalSecondMessage('')
        toggle();
      } else {
        let ws
        let fileName

        if (fileType === 'excel') {
          let diaPrevious = ''
          let horaPrevious = ''
          if (response.indexOf(response[0], 2) !== -1) {
            response.splice(response.indexOf(response[0], 2))
          }

          response && response.map(
            (item) => {
              return item.consumptions && item.consumptions.items && item.consumptions.items.map(
                (consumption) => {
                  let auxConsumptionValue
                  let auxDate
                  if (consumption.consumptionDate) {
                    auxDate = consumption.consumptionDate.split('/')
                  }

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
                    let auxConsumptionsItem = {
                      cups: supplyData.cups ? supplyData.cups : '0',
                      date: consumption.consumptionDate ? consumption.consumptionDate : '00/00/0000',
                      hour: consumption.hour ? consumption.hour : '0',
                      consumption: auxConsumptionValue ? auxConsumptionValue : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      p1: consumption.consumptionValueP1 ? consumption.consumptionValueP1 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      p2: consumption.consumptionValueP2 ? consumption.consumptionValueP2 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      p3: consumption.consumptionValueP3 ? consumption.consumptionValueP3 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      obtainingMethod: consumption.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : consumption.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      isCambioHora: (consumption.consumptionDate === diaPrevious && consumption.hour === horaPrevious)
                    }
                    auxConsumptionsData.push(auxConsumptionsItem)
                    diaPrevious = consumption.consumptionDate
                    horaPrevious = consumption.hour
                  }

                  return null
                }
              )
            }
          )
          let auxConsumptionsDataUnique = [];
          let exists = false;
          let duplicadoCiclo = false;
          let date = 'Fecha';
          let hour = 'Hora';
          let iniBucle = 0;
          let finBucle = auxConsumptionsDataUnique.length;
          for (let i = 0; i < auxConsumptionsData.length; i++) {
            let diaConsumptionsFormat = formatDateReverse(auxConsumptionsData[i].date);
            if (!duplicadoCiclo) {
              if (exists && date !== auxConsumptionsData[i].date && hour) {
                exists = false;
              }
              else {
                for (let j = iniBucle; j < finBucle; j++) {
                  let diaConsumptionsFormatUnique = formatDateReverse(auxConsumptionsDataUnique[j].date);
                  if ((auxConsumptionsData[i].hour === auxConsumptionsDataUnique[j].hour) && (auxConsumptionsData[i].date === auxConsumptionsDataUnique[j].date) && (!auxConsumptionsData[i].isCambioHora)) {
                    exists = true;
                    date = auxConsumptionsData[i].date;
                    hour = auxConsumptionsData[i].hour;
                    iniBucle = j;
                  }
                  else if (diaConsumptionsFormatUnique > diaConsumptionsFormat) {
                    duplicadoCiclo = true;
                    break;
                  }
                }
              }
              if (duplicadoCiclo) {
                break;
              }
              else if (!exists) {
                let auxConsumptionsItem = {
                  cups: auxConsumptionsData[i].cups,
                  date: auxConsumptionsData[i].date,
                  hour: auxConsumptionsData[i].hour,
                  consumption: auxConsumptionsData[i].consumption,
                  p1:auxConsumptionsData[i].p1,
                  p2:auxConsumptionsData[i].p2,
                  p3:auxConsumptionsData[i].p3,
                  obtainingMethod:auxConsumptionsData[i].obtainingMethod,
                }
                auxConsumptionsDataUnique.push(auxConsumptionsItem);
                finBucle = auxConsumptionsDataUnique.length;
              }
            }
          }

          ws = XLSX.utils.json_to_sheet(auxConsumptionsDataUnique, {
            header: [
              'cups',
              'date',
              'hour',
              'consumption',
              'p1',
              'p2',
              'p3',
              'obtainingMethod'
            ]
          })

          ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups')
          ws['B1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
          ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')
          ws['D1'].v = (isGeneration && isGenerationTab) ? t('supplies.suppliesDetails.components.consumption.exportDialogs.generation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.consumption')
          ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo1')
          ws['F1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo2')
          ws['G1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo3')
          ws['H1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.method')

          fileName = 'consumptions.xlsx'

          const wb = XLSX.utils.book_new()

          XLSX.utils.book_append_sheet(wb, ws, 'consumptions')

          XLSX.writeFile(wb, fileName)
        } else if (fileType === 'csv') {
          let diaPrevious = ''
          let horaPrevious = ''

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
                      readingType: consumption.readingType ? consumption.readingType : '',
                      isCambioHora: (consumption.consumptionDate === diaPrevious && consumption.hour === horaPrevious)
                    }
                    diaPrevious = consumption.consumptionDate
                    horaPrevious = consumption.hour

                    auxConsumptionsData.push(auxConsumptionsItem)
                  }

                  return null
                }
              )
            }
          )

          let auxConsumptionsDataUnique = [];
          let exists = false;
          let duplicadoCiclo = false;
          let date = 'Fecha';
          let hour = 'Hora';
          let iniBucle = 0;
          let finBucle = auxConsumptionsDataUnique.length;
          for (let i = 0; i < auxConsumptionsData.length; i++) {
            let diaConsumptionsFormat = formatDateReverse(auxConsumptionsData[i].date);
            if (!duplicadoCiclo) {
              if (exists && date !== auxConsumptionsData[i].date && hour) {
                exists = false;
              }
              else {
                for (let j = iniBucle; j < finBucle; j++) {
                  let diaConsumptionsFormatUnique = formatDateReverse(auxConsumptionsDataUnique[j].date);
                  if ((auxConsumptionsData[i].hour === auxConsumptionsDataUnique[j].hour) && (auxConsumptionsData[i].date === auxConsumptionsDataUnique[j].date) && (!auxConsumptionsData[i].isCambioHora)) {
                    exists = true;
                    date = auxConsumptionsData[i].date;
                    hour = auxConsumptionsData[i].hour;
                    iniBucle = j;
                  }
                  else if (diaConsumptionsFormatUnique > diaConsumptionsFormat) {
                    duplicadoCiclo = true;
                    break;
                  }
                }
              }
              if (duplicadoCiclo) {
                break;
              }
              else if (!exists) {
                let auxConsumptionsItem = {
                  cups: auxConsumptionsData[i].cups,
                  date: auxConsumptionsData[i].date,
                  hour: auxConsumptionsData[i].hour,
                  value: auxConsumptionsData[i].value,
                  readingType: auxConsumptionsData[i].readingType
                }
                auxConsumptionsDataUnique.push(auxConsumptionsItem);
                finBucle = auxConsumptionsDataUnique.length;
              }
            }
          }

          auxConsumptionsDataUnique.unshift({
            cups: t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.cups'),
            date: t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.fecha'),
            hour: t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.hora'),
            value: t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.consumo'),
            readingType: t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.metodo_obtencion'),
          })



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

          csvExporter.generateCsv(auxConsumptionsDataUnique)
        }
      }
      setIsLoading(false)

    }))
  }

  useEffect(() => {
    let array = []
    if (periodValue) {
      array = periodValue.split('-')
      setStringStartDate((array[0]))
      setStringEndDate((array[1]))
    }
  }, [periodValue])



  useEffect(() => {
   if (downLoadFilters.tipo == 'periodo') {
      if ((auxStartDate && auxEndDate)) {
          setEnableButton(true)
        } else {
          setEnableButton(false)
      }
    } else if(downLoadFilters.tipo === 'facturacion'){
       if(stringStartDate && stringEndDate){
          setEnableButton(true)
        } else {
          setEnableButton(false)
       }
    }
  }, [auxStartDate, auxEndDate, downLoadFilters.tipo, stringStartDate, stringEndDate])

  useEffect(() => {
    //reseteamos los datos de los campos
    setPeriodValue('')
    setStringStartDate('')
    setStringEndDate('')
    setAuxStartDate(null)
    setAuxEndDate(null)
  }, [downLoadFilters.tipo])

  useEffect(() => {
    if (auxStartDate && auxEndDate) {
      if (verifyDatas()) {
        setModalMessage('errors.date.title')
        setModalSecondMessage('errors.date.text')
        toggle()
      }
    }
  }, [auxStartDate, auxEndDate])

  const sendGAEventCNMC = ():void => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'download',
      section_name: 'mis suministros',
      subsection_name: 'mi consumo',
      click_text: 'exportar en formato cnmc',
      element_type: 'consulta de informacion',
      page_url: window.location.href,
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      tab_name: sessionStorage.getItem('tab1_MiConsumo') ? sessionStorage.getItem('tab1_MiConsumo') : 'energia consumida kwh',
      subtab_name: 'consumo horario',
      see_consumption: sessionStorage.getItem('consumo_horario_option'),
    })
  }

  const sendGAEventExport = ():void => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'download',
      section_name: 'mis suministros',
      subsection_name: 'mi consumo',
      click_text: 'exportar en excel',
      element_type: 'consulta de informacion',
      page_url: window.location.href,
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      tab_name: sessionStorage.getItem('tab1_MiConsumo') ? sessionStorage.getItem('tab1_MiConsumo') : 'energia consumida kwh',
      subtab_name: 'consumo horario',
      see_consumption: sessionStorage.getItem('consumo_horario_option'),
    })
  }

  return (
    <>   
      <Modales isOpne={isOpen} toggle={toggle}>
        <img src={CloseIcon} className={classes_.closeButton} alt='close' onClick={toggle} />
        <img src={AlertIcon} />
        <div className={classes_.title}>
          {t(ModalMessage)}
        </div>
        <div className={classes_.body2}>
          {t(ModalSecondMessage)}
        </div>
        
          <Grid container justifyContent='center' className='buttons'>
            <Button
              className={classes_.button}
              text={t('errors.date.button.cancel')}
              color='primary'
              size='large'
              variant='outlined'
              onClick={toggle}
            />
            <Button
              className={classes_.button}
              text={t('errors.date.button.accept')}
              color='primary'
              size='large'
              variant='contained'
              onClick={toggle}
            />
            
          </Grid>
        
      </Modales>
      <Grid item md={12} sm={12} xs={12} className={classes.container}>
        <Grid container className={classes.menu}>

          {!autoConsumption &&
            < Grid container className={classes.containerInformativo}>
              <Grid item className={classes.text}>
                <img className={classes.icon} src={InfoIcon} alt='' />
                <span className={classes.message}>
                  {t('supplies.suppliesDetails.components.consumption.consumption.exportFormat1')}
                  <b>{t('supplies.suppliesDetails.components.consumption.consumption.exportFormat2')}</b>
                  {t('supplies.suppliesDetails.components.consumption.consumption.exportFormat3')}
                </span>
                <a className={classes.message} href='https://comparador.cnmc.gob.es/facturaluz/inicio/'>facturaluz.cnmc.es</a>

                <span className={classes.message}>
                  {t('supplies.suppliesDetails.components.consumption.consumption.exportFormat4')}
                </span>

              </Grid>
            </Grid>
          }

          {
            downLoadFilters.tipo === 'periodo' &&
            <>
              <Grid item md={3} sm={3} xs={12} className={classes.menuItem}>
                <div className={classes.label}>{t('supplies.suppliesDetails.components.consumption.charts.filters.startDate')}</div>
                {
                  <Datepicker
                    selectedDate={auxStartDate}
                    handleChange={setAuxStartDate}
                    maxDate={auxEndDate ? auxEndDate : new Date()}
                    size='s'
                  />
                }
              </Grid>

              <Grid item md={3} sm={3} xs={12} className={classes.menuItem}>
                <div className={classes.label}>{t('supplies.suppliesDetails.components.consumption.charts.filters.endDate')}</div>
                {
                  <Datepicker
                    selectedDate={auxEndDate}
                    handleChange={setAuxEndDate}
                    size='s'
                    minDate={auxStartDate}
                    maxDate={new Date()}
                  />
                }
              </Grid>
            </>
          }
          {
            downLoadFilters.tipo === 'facturacion' && billingPeriods.length !== 0 &&
            <Grid item md={4} sm={4} xs={12} className={classes.menuItem}>
              <div className={classes.label}>{t('supplies.suppliesDetails.components.consumption.exportDialogs.exportPeriodDataDialog.periodBilling')}</div>
              {
                <Select
                  className={classes.input}
                  values={billingPeriods}
                  value={periodValue}
                  onChange={(e) => setPeriodValue(e.target.value)}
                />
              }
            </Grid>
          }
          {
            downLoadFilters.tipo === 'facturacion' && billingPeriods.length === 0 &&
            <Grid item md={4} sm={4} xs={12} className={classes.menuItem}>
              <div className={classes.label}>{t('supplies.suppliesDetails.components.consumption.exportDialogs.exportPeriodDataDialog.NoPeriods')}</div>
            </Grid>
          }
          {
            (supplyData.measurementSystem && (downLoadFilters.tipo === 'periodo' || downLoadFilters.tipo === 'facturacion' || downLoadFilters.tipo === '24meses')) &&
            <Grid item md={4} sm={4} xs={12} className={classes.buttonContainer}>
              <Button
                className={classes.button}
                text={

                  autoConsumption ?
                    t('supplies.suppliesDetails.components.consumption.charts.downloads.excel')
                    :

                    (isGeneration && isGenerationTab) ?
                      t('supplies.suppliesDetails.components.consumption.charts.downloads.excel')
                      :
                      t('supplies.suppliesDetails.components.consumption.charts.downloads.excel')
                }
                color={'primary'}
                size={'medium'}
                variant={'contained'}
                disabled={!enableButton}

                /*disabled={((downLoadFilters.tipo === 'periodo' && !auxStartDate && !auxEndDate) || (downLoadFilters.tipo === 'facturacion' && !stringStartDate && !stringEndDate))}*/
                onClick={() => { sendGAEventExport(); handleExport('excel') }}
              />
            </Grid>
          }
          {
            (supplyData.measurementSystem && (downLoadFilters.tipo === 'periodo' || downLoadFilters.tipo === 'facturacion' || downLoadFilters.tipo === '24meses') && !autoConsumption) &&
            <Grid item md={4} sm={4} xs={12} className={classes.buttonContainer}>
              <Button
                className={classes.button}
                text={
                  autoConsumption ?
                    t('supplies.suppliesDetails.components.consumption.charts.downloads.cnmc')
                    :

                    (isGeneration && isGenerationTab) ?
                      t('supplies.suppliesDetails.components.consumption.charts.downloads.cnmc')
                      :
                      t('supplies.suppliesDetails.components.consumption.charts.downloads.cnmc')
                }
                color={'primary'}
                size={'medium'}
                variant={'contained'}
                disabled={!enableButton}

               /* disabled={((downLoadFilters.tipo === 'periodo' && (!auxStartDate && !auxEndDate)) || (downLoadFilters.tipo === 'facturacion' && (!stringStartDate && !stringEndDate)))}*/
                onClick={() => { sendGAEventCNMC(); handleExport('csv') }}

              />
            </Grid>
          }

        </Grid>
      </Grid >
    </>


  )
}
// FIN PPM 1007707
export default FiltersConsumptionsODI
