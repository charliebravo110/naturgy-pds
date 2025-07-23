import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import XLSX from 'xlsx'
import { ExportToCsv } from 'export-to-csv'

import Grid from '@material-ui/core/Grid'

import Spinner from '../../../../../../../common/components/spinner/Spinner'
import Button from '../../../../../../../common/components/button/Button'
import CloseIcon from '../../../../../../../assets/icons/cerrar.svg'

import ExportExcelIcon from '../../../../../../../assets/icons/exportar_excel.svg'
import GreenCheckIcon from '../../../../../../../assets/icons/aviso_ok.svg'
import RedIcon from '../../../../../../../assets/icons/misdocumentos_rechazado.svg'


import useStyles from './Content.styles'
import MensajeriaGraph from '../../../../../../../controlMensajeria/components/mensajeria-graph/MensajeriaGraph'
import { isMobileApp } from '../../../../../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../../../../../mobile-apps/local-downloads/createFileAndOpenIt'
import Consumption from '../../../consumption/Consumption'

const Content = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    supplyData,
    handleClose,
    currentSupplyConsumptions,
    currentCompareConsumptions,
    mode,
    isGeneration,
    isGenerationTab,
    consumptionsFilters,
    isSelfConsumption,
    energiaReactiva
  } = props

  const isAdapted = supplyData.measurementEquipments.meters[0] && supplyData.measurementEquipments.meters[0].isAdapted
  const adaptedDate = supplyData.measurementEquipments.meters[0] && supplyData.measurementEquipments.meters[0].adaptedDate

  let splitAdaptedDate: any[] = adaptedDate && adaptedDate.split('/')

  const tipoUsuario = supplyData.rate.toString().includes('2.') ? 'simple' : 'complejo'


  const [fileType, setFileType] = useState('excel')

  const [exportingData, setExportingData] = useState(false)

  const [popUpOk, setPopUpOk] = useState(false)

  const [popUpError, setpopUpError] = useState(false)

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


  const auxConsumptionsData = [] as any
  const auxConsumptionsData2 = [] as any
  const auxConsumptionsData3 = [] as any
  let reactiva = false
  let literalD1

  let workingDay1: boolean
  let workingDay2: boolean

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
  let valueEHCRcompare: any
  let valueEHACcompare: any
  let valueEHCCAcompare: any
  let valueEHEXcompare: any
  let valueEHNGcompare: any
  let valueEHCSAcompare: any
  let valueEHCRicompare: any
  let valueEHACicompare: any
  let valueEHCicompare: any
  let valueEHEXicompare: any
  let valueEHNGicompare: any
  let valueEHEXGcompare: any

  let containP0 = false as boolean
  let contCuarto = 0
  let labelsQ = ['00:15', '00:30', '00:45',
    '01:00', '01:15', '01:30', '01:45',
    '02:00', '02:15', '02:30', '02:45',
    '03:00', '03:15', '03:30', '03:45',
    '04:00', '04:15', '04:30', '04:45',
    '05:00', '05:15', '05:30', '05:45',
    '06:00', '06:15', '06:30', '06:45',
    '07:00', '07:15', '07:30', '07:45',
    '08:00', '08:15', '08:30', '08:45',
    '09:00', '09:15', '09:30', '09:45',
    '10:00', '10:15', '10:30', '10:45',
    '11:00', '11:15', '11:30', '11:45',
    '12:00', '12:15', '12:30', '12:45',
    '13:00', '13:15', '13:30', '13:45',
    '14:00', '14:15', '14:30', '14:45',
    '15:00', '15:15', '15:30', '15:45',
    '16:00', '16:15', '16:30', '16:45',
    '17:00', '17:15', '17:30', '17:45',
    '18:00', '18:15', '18:30', '18:45',
    '19:00', '19:15', '19:30', '19:45',
    '20:00', '20:15', '20:30', '20:45',
    '21:00', '21:15', '21:30', '21:45',
    '22:00', '22:15', '22:30', '22:45',
    '23:00', '23:15', '23:30', '23:45',
    '24:00']

  const translateMonthNumberToName = (date) => {

    const month = date.split('/')[1]
    const year = date.split('/')[2]
    let monthName = ''

    switch (month) {
      case '01':
        monthName = t('controlMensajeria.graph.months.january')
        break
      case '02':
        monthName = t('controlMensajeria.graph.months.february')
        break
      case '03':
        monthName = t('controlMensajeria.graph.months.march')
        break
      case '04':
        monthName = t('controlMensajeria.graph.months.april')
        break
      case '05':
        monthName = t('controlMensajeria.graph.months.may')
        break
      case '06':
        monthName = t('controlMensajeria.graph.months.june')
        break
      case '07':
        monthName = t('controlMensajeria.graph.months.july')
        break
      case '08':
        monthName = t('controlMensajeria.graph.months.august')
        break
      case '09':
        monthName = t('controlMensajeria.graph.months.september')
        break
      case '10':
        monthName = t('controlMensajeria.graph.months.october')
        break
      case '11':
        monthName = t('controlMensajeria.graph.months.november')
        break
      case '12':
        monthName = t('controlMensajeria.graph.months.december')
        break
    }

    const result = monthName.toLocaleLowerCase() + '-' + year
    return result
  }

  // devuelve true si la fecha que se le pasa pertenece a un día laborable
  const isWorkingDay = (date) => {
    const arrayDate = date.split(' ')[0].split('/')

    // weekDay contiene el día de la semana al que pertenece la fecha (0 = domingo, 1 = lunes, 2 = martes, etc)
    const weekDay = new Date(arrayDate[2], arrayDate[1] - 1, arrayDate[0]).getDay()

    // comprobamos si la fecha coincide con un festivo nacional
    if (date === '02/04/2021' ||
      date === '01/05/2021' ||
      date === '12/10/2021' ||
      date === '01/11/2021' ||
      date === '06/12/2021' ||
      date === '08/12/2021' ||
      date === '25/12/2021') {
      return false
    } else {
      // si no es un festivo nacional, comprobamos si es un día laborable (lunes->viernes) o festivo (sábado y domingo)      
      if (!isNaN(weekDay)) {
        if ((weekDay < 1 || weekDay > 5)) {
          return false
        } else {
          return true
        }
      }
    }
  }

  const checkSelfConsumptionEnergies = (item: any) => {

    if (item.EHCR) {
      valueEHCR = item.EHCR
      if (!containEHCR) {
        containEHCR = true
      }
    } else {
      valueEHCR = ''
    }

    if (item.EHAC) {
      valueEHAC = item.EHAC
      if (!containEHAC) {
        containEHAC = true
      }
    } else {
      valueEHAC = ''
    }

    if (item.EHCCA) {
      valueEHCCA = item.EHCCA
      if (!containEHCCA) {
        containEHCCA = true
      }
    } else {
      valueEHCCA = ''
    }

    if (item.EHEX) {
      valueEHEX = item.EHEX
      if (!containEHEX) {
        containEHEX = true
      }
    } else {
      valueEHEX = ''
    }

    if (item.EHNG) {
      valueEHNG = item.EHNG
      if (!containEHNG) {
        containEHNG = true
      }
    } else {
      valueEHNG = ''
    }

    if (item.EHCRi) {
      valueEHCRi = item.EHCRi
      if (!containEHCRi) {
        containEHCRi = true
      }
    } else {
      valueEHCRi = ''
    }

    if (item.EHACi) {
      valueEHACi = item.EHACi
      if (!containEHACi) {
        containEHACi = true
      }
    } else {
      valueEHACi = ''
    }

    if (item.EHCi) {
      valueEHCi = item.EHCi
      if (!containEHCi) {
        containEHCi = true
      }
    } else {
      valueEHCi = ''
    }

    if (item.EHEXi) {
      valueEHEXi = item.EHEXi
      if (!containEHEXi) {
        containEHEXi = true
      }
    } else {
      valueEHEXi = ''
    }

    if (item.EHNGi) {
      valueEHNGi = item.EHNGi
      if (!containEHNGi) {
        containEHNGi = true
      }
    } else {
      valueEHNGi = ''
    }

    if (item.EHCSA) {
      valueEHCSA = item.EHCSA
      if (!containEHCSA) {
        containEHCSA = true
      }
    } else {
      valueEHCSA = ''
    }

    if (item.EHEXG) {
      valueEHEXG = item.EHEXG
      if (!containEHEXG) {
        containEHEXG = true
      }
    } else {
      valueEHEXG = ''
    }

  }

  const checkSelfConsumptionCompareEnergies = (item: any) => {

    if (item.EHCR) {
      valueEHCRcompare = item.EHCR
      if (!containEHCR) {
        containEHCR = true
      }
    } else {
      valueEHCRcompare = ''
    }

    if (item.EHAC) {
      valueEHACcompare = item.EHAC
      if (!containEHAC) {
        containEHAC = true
      }
    } else {
      valueEHACcompare = ''
    }

    if (item.EHCCA) {
      valueEHCCAcompare = item.EHCCA
      if (!containEHCCA) {
        containEHCCA = true
      }
    } else {
      valueEHCCAcompare = ''
    }

    if (item.EHEX) {
      valueEHEXcompare = item.EHEX
      if (!containEHEX) {
        containEHEX = true
      }
    } else {
      valueEHEXcompare = ''
    }

    if (item.EHNG) {
      valueEHNGcompare = item.EHNG
      if (!containEHNG) {
        containEHNG = true
      }
    } else {
      valueEHNGcompare = ''
    }

    if (item.EHCRi) {
      valueEHCRicompare = item.EHCRi
      if (!containEHCRi) {
        containEHCRi = true
      }
    } else {
      valueEHCRicompare = ''
    }

    if (item.EHACi) {
      valueEHACicompare = item.EHACi
      if (!containEHACi) {
        containEHACi = true
      }
    } else {
      valueEHACicompare = ''
    }

    if (item.EHCi) {
      valueEHCicompare = item.EHCi
      if (!containEHCi) {
        containEHCi = true
      }
    } else {
      valueEHCicompare = ''
    }

    if (item.EHEXi) {
      valueEHEXicompare = item.EHEXi
      if (!containEHEXi) {
        containEHEXi = true
      }
    } else {
      valueEHEXicompare = ''
    }

    if (item.EHNGi) {
      valueEHNGicompare = item.EHNGi
      if (!containEHNGi) {
        containEHNGi = true
      }
    } else {
      valueEHNGicompare = ''
    }

    if (item.EHCSA) {
      valueEHCSAcompare = item.EHCSA
      if (!containEHCSA) {
        containEHCSA = true
      }
    } else {
      valueEHCSAcompare = ''
    }

    if (item.EHEXG) {
      valueEHEXGcompare = item.EHEXG
      if (!containEHEXG) {
        containEHEXG = true
      }
    } else {
      valueEHEXGcompare = ''
    }

  }

  const selfConsumptionPush = (item: any) => {
    //SIN HORA
    auxConsumptionsData.push({
      cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : consumptionsFilters.granularity === 'M' && item.date ? item.date.split('/')[1] + '/' + item.date.split('/')[2] : item.consumptionDate ? item.consumptionDate : item.date ? item.date : '00/00/0000',
      // hour: item.hour ? (item.hour !== '' ? (item.hour + ':00') : item.hour) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHCR: containEHCR ? (valueEHCR !== '' ? (valueEHCR) : valueEHCR) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHAC: containEHAC ? (valueEHAC !== '' ? (valueEHAC) : valueEHAC) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHCCA: containEHCCA ? (valueEHCCA !== '' ? (valueEHCCA) : valueEHCCA) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHEX: containEHEX ? (valueEHEX !== '' ? (valueEHEX) : valueEHEX) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHNG: containEHNG ? (valueEHNG !== '' ? (valueEHNG) : valueEHNG) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHCSA: containEHCSA ? (valueEHCSA !== '' ? (valueEHCSA) : valueEHCSA) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHCRi: containEHCRi ? (valueEHCRi !== '' ? (valueEHCRi) : valueEHCRi) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHACi: containEHACi ? (valueEHACi !== '' ? (valueEHACi) : valueEHACi) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHCi: containEHCi ? (valueEHCi !== '' ? (valueEHCi) : valueEHCi) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHEXi: containEHEXi ? (valueEHEXi !== '' ? (valueEHEXi) : valueEHEXi) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHNGi: containEHNGi ? (valueEHNGi !== '' ? (valueEHNGi) : valueEHNGi) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHEXG: containEHEXG ? (valueEHEXG !== '' ? (valueEHEXG) : valueEHEXG) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
    })
  }


  const selfConsumptionPushHour = (item: any) => {
    //SIN HORA
    auxConsumptionsData.push({
      cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : consumptionsFilters.granularity === 'M' && item.date ? item.date.split('/')[1] + '/' + item.date.split('/')[2] : item.consumptionDate ? item.consumptionDate : item.date ? item.date : '00/00/0000',
      hour: item.hour ? (item.hour !== '' ? (item.hour + ':00') : item.hour) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHCR: containEHCR ? (valueEHCR !== '' ? (valueEHCR) : valueEHCR) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHAC: containEHAC ? (valueEHAC !== '' ? (valueEHAC) : valueEHAC) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHCCA: containEHCCA ? (valueEHCCA !== '' ? (valueEHCCA) : valueEHCCA) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHEX: containEHEX ? (valueEHEX !== '' ? (valueEHEX) : valueEHEX) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHNG: containEHNG ? (valueEHNG !== '' ? (valueEHNG) : valueEHNG) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHCSA: containEHCSA ? (valueEHCSA !== '' ? (valueEHCSA) : valueEHCSA) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHCRi: containEHCRi ? (valueEHCRi !== '' ? (valueEHCRi) : valueEHCRi) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHACi: containEHACi ? (valueEHACi !== '' ? (valueEHACi) : valueEHACi) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHCi: containEHCi ? (valueEHCi !== '' ? (valueEHCi) : valueEHCi) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHEXi: containEHEXi ? (valueEHEXi !== '' ? (valueEHEXi) : valueEHEXi) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHNGi: containEHNGi ? (valueEHNGi !== '' ? (valueEHNGi) : valueEHNGi) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHEXG: containEHEXG ? (valueEHEXG !== '' ? (valueEHEXG) : valueEHEXG) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
    })
  }

  const selfConsumptionPush2 = (item: any) => {

    auxConsumptionsData2.push({
      cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : consumptionsFilters.granularity === 'M' && item.date ? item.date.split('/')[1] + '/' + item.date.split('/')[2] : item.consumptionDate ? item.consumptionDate : item.date ? item.date : '00/00/0000',
      hour: item.hour ? (item.hour !== '' ? (item.hour + ':00') : item.hour) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHCR: containEHCR ? (valueEHCRcompare !== '' ? (valueEHCRcompare) : valueEHCRcompare) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHAC: containEHAC ? (valueEHACcompare !== '' ? (valueEHACcompare) : valueEHACcompare) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHCCA: containEHCCA ? (valueEHCCAcompare !== '' ? (valueEHCCAcompare) : valueEHCCAcompare) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHEX: containEHEX ? (valueEHEXcompare !== '' ? (valueEHEXcompare) : valueEHEXcompare) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHNG: containEHNG ? (valueEHNGcompare !== '' ? (valueEHNGcompare) : valueEHNGcompare) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHCSA: containEHCSA ? (valueEHCSAcompare !== '' ? (valueEHCSAcompare) : valueEHCSAcompare) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHCRi: containEHCRi ? (valueEHCRicompare !== '' ? (valueEHCRicompare) : valueEHCRicompare) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHACi: containEHACi ? (valueEHACicompare !== '' ? (valueEHACicompare) : valueEHACicompare) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHCi: containEHCi ? (valueEHCicompare !== '' ? (valueEHCicompare) : valueEHCicompare) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHEXi: containEHEXi ? (valueEHEXicompare !== '' ? (valueEHEXicompare) : valueEHEXicompare) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHNGi: containEHNGi ? (valueEHNGicompare !== '' ? (valueEHNGicompare) : valueEHNGicompare) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHEXG: containEHEXG ? (valueEHEXGcompare !== '' ? (valueEHEXGcompare) : valueEHEXGcompare) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
    })
  }

  const selfConsumptionPush3 = (item: any, item2: any, index: any) => {

    auxConsumptionsData3.push({
      cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : consumptionsFilters.granularity === 'M' && item.date ? item.date.split('/')[1] + '/' + item.date.split('/')[2] : item.consumptionDate ? item.consumptionDate : item.date ? item.date : '00/00/0000',
      // date: item[index] && item[index].date ? item[index].date : '00/00/0000',
      hour: item[index] && item[index].hour ? (item[index].hour !== '' ? (item[index].hour + ':00') : item[index].hour) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHCR: item[index] && containEHCR ? (item[index].EHCR !== '' ? (item[index].EHCR) : item[index].EHCR) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHAC: item[index] && containEHAC ? (item[index].EHAC !== '' ? (item[index].EHAC) : item[index].EHAC) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHCCA: item[index] && containEHCCA ? (item[index].EHCCA !== '' ? (item[index].EHCCA) : item[index].EHCCA) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHEX: item[index] && containEHEX ? (item[index].EHEX !== '' ? (item[index].EHEX) : item[index].EHEX) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHNG: item[index] && containEHNG ? (item[index].EHNG !== '' ? (item[index].EHNG) : item[index].EHNG) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHCSA: item[index] && containEHCSA ? (item[index].EHCSA !== '' ? (item[index].EHCSA) : item[index].EHCSA) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHCRi: item[index] && containEHCRi ? (item[index].EHCRi !== '' ? (item[index].EHCRi) : item[index].EHCRi) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHACi: item[index] && containEHACi ? (item[index].EHACi !== '' ? (item[index].EHACi) : item[index].EHACi) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHCi: item[index] && containEHCi ? (item[index].EHCi !== '' ? (item[index].EHCi) : item[index].EHCi) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHEXi: item[index] && containEHEXi ? (item[index].EHEXi !== '' ? (item[index].EHEXi) : item[index].EHEXi) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHNGi: item[index] && containEHNGi ? (item[index].EHNGi !== '' ? (item[index].EHNGi) : item[index].EHNGi) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
      EHEXG: item[index] && containEHEXG ? (item[index].EHEXG !== '' ? (item[index].EHEXG) : item[index].EHEXG) : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
    })
  }

  const adaptedUserPush = (item: any, labelAux: any, valuePP: number, valuePL: number, valuePV: number, valueP0: number, obtainingMethod: any, consumption: number) => {
    //Funcion para cargar todos los consumos con 3 periodos para ODI

    if (supplyData.measurementSystem === 'O') {
      //si es odi, cargamos los datos con el metodo de obtención
      if (consumptionsFilters.granularity !== 'H' && consumptionsFilters.granularity !== 'Q') {
        if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
          auxConsumptionsData.push({
            cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
            P0: valueP0 && valueP0 !== 0.0000001 ? valueP0.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            obtainingMethod: obtainingMethod && obtainingMethod
          })
          containP0 = true
        } else {
          auxConsumptionsData.push({
            cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : item.consumptionDate ? item.consumptionDate : '00/00/0000',
            consumption: consumption && consumption !== 0.0000001 ? consumption.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            P1: valuePP && valuePP !== 0.0000001 ? valuePP.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            P2: valuePL && valuePL !== 0.0000001 ? valuePL.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            P3: valuePV && valuePV !== 0.0000001 ? valuePV.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            obtainingMethod: obtainingMethod && obtainingMethod
          })
        }
      } else {
        if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
          if (consumptionsFilters.granularity === 'H') {
            auxConsumptionsData.push({
              cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
              hour: item.hour ? item.hour : 0,
              P0: valueP0 && valueP0 !== 0.0000001 ? valueP0.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              obtainingMethod: obtainingMethod && obtainingMethod
            })
          } else {
            auxConsumptionsData.push({
              cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : item.consumptionDate ? item.consumptionDate : '00/00/0000',
              hour: labelsQ[contCuarto],
              P0: valueP0 && valueP0 !== 0.0000001 ? valueP0.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              obtainingMethod: obtainingMethod && obtainingMethod
            })
            contCuarto++
          }
          containP0 = true
        } else {
          if (consumptionsFilters.granularity === 'H') {
            auxConsumptionsData.push({
              cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
              hour: item.hour ? item.hour : 0,
              consumption: consumption && consumption !== 0.0000001 ? consumption.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P1: valuePP && valuePP !== 0.0000001 ? valuePP.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P2: valuePL && valuePL !== 0.0000001 ? valuePL.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P3: valuePV && valuePV !== 0.0000001 ? valuePV.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              obtainingMethod: obtainingMethod && obtainingMethod
            })
          } else {
            auxConsumptionsData.push({
              cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : item.consumptionDate ? item.consumptionDate : '00/00/0000',
              hour: labelsQ[contCuarto],
              consumption: consumption && consumption !== 0.0000001 ? consumption.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P1: valuePP && valuePP !== 0.0000001 ? valuePP.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P2: valuePL && valuePL !== 0.0000001 ? valuePL.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P3: valuePV && valuePV !== 0.0000001 ? valuePV.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              obtainingMethod: obtainingMethod && obtainingMethod
            })
            contCuarto++
          }
        }
      }
    }
    else {
      //para gmv10 no queremos el metodo de obtención ya que nunca llega
      if (consumptionsFilters.granularity !== 'H' && consumptionsFilters.granularity !== 'Q') {
        if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
          auxConsumptionsData.push({
            cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
            P0: valueP0 && valueP0 !== 0.0000001 ? valueP0.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
          })
          containP0 = true
        } else {
          auxConsumptionsData.push({
            cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : item.consumptionDate ? item.consumptionDate : '00/00/0000',
            consumption: consumption && consumption !== 0.0000001 ? consumption.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            P1: valuePP && valuePP !== 0.0000001 ? valuePP.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            P2: valuePL && valuePL !== 0.0000001 ? valuePL.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            P3: valuePV && valuePV !== 0.0000001 ? valuePV.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
          })
        }
      } else {
        if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
          if (consumptionsFilters.granularity === 'H') {
            auxConsumptionsData.push({
              cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
              hour: item.hour ? item.hour : 0,
              P0: valueP0 && valueP0 !== 0.0000001 ? valueP0.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            })
          } else {
            auxConsumptionsData.push({
              cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : item.consumptionDate ? item.consumptionDate : '00/00/0000',
              hour: labelsQ[contCuarto],
              P0: valueP0 && valueP0 !== 0.0000001 ? valueP0.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            })
            contCuarto++
          }
          containP0 = true
        } else {
          if (consumptionsFilters.granularity === 'H') {
            auxConsumptionsData.push({
              cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
              hour: item.hour ? item.hour : 0,
              consumption: consumption && consumption !== 0.0000001 ? consumption.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P1: valuePP && valuePP !== 0.0000001 ? valuePP.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P2: valuePL && valuePL !== 0.0000001 ? valuePL.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P3: valuePV && valuePV !== 0.0000001 ? valuePV.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            })
          } else {
            auxConsumptionsData.push({
              cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : item.consumptionDate ? item.consumptionDate : '00/00/0000',
              hour: labelsQ[contCuarto],
              consumption: consumption && consumption !== 0.0000001 ? consumption.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P1: valuePP && valuePP !== 0.0000001 ? valuePP.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P2: valuePL && valuePL !== 0.0000001 ? valuePL.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P3: valuePV && valuePV !== 0.0000001 ? valuePV.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            })
            contCuarto++
          }
        }
      }
    }

  }


  const adaptedUserPushCmpl = (item: any, labelAux: any, valueP1: number, valueP2: number, valueP3: number, valueP4: number, valueP5: number, valueP6: number, valueP0: number, obtainingMethod: any, consumption: number) => {
    //Funcion para cargar todos los consumos con 6 periodos
    if (supplyData.measurementSystem === 'O') {
      //si es odi, cargamos los datos con el metodo de obtención
      if (consumptionsFilters.granularity !== 'H' && consumptionsFilters.granularity !== 'Q') {
        if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
          auxConsumptionsData.push({
            cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
            P0: valueP0 && valueP0 !== 0.0000001 ? valueP0.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            obtainingMethod: obtainingMethod && obtainingMethod
          })
          containP0 = true
        } else {
          auxConsumptionsData.push({
            cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : item.consumptionDate ? item.consumptionDate : '00/00/0000',
            consumption: consumption && consumption !== 0.0000001 ? consumption.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            P1: valueP1 && valueP1 !== 0.0000001 ? valueP1.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            P2: valueP2 && valueP2 !== 0.0000001 ? valueP2.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            P3: valueP3 && valueP3 !== 0.0000001 ? valueP3.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            P4: valueP4 && valueP4 !== 0.0000001 ? valueP4.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            P5: valueP5 && valueP5 !== 0.0000001 ? valueP5.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            P6: valueP6 && valueP6 !== 0.0000001 ? valueP6.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            obtainingMethod: obtainingMethod && obtainingMethod
          })
        }
      } else {
        if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
          if (consumptionsFilters.granularity === 'H') {
            auxConsumptionsData.push({
              cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
              hour: item.hour ? item.hour : 0,
              P0: valueP0 && valueP0 !== 0.0000001 ? valueP0.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              obtainingMethod: obtainingMethod && obtainingMethod
            })
          } else {
            auxConsumptionsData.push({
              cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : item.consumptionDate ? item.consumptionDate : '00/00/0000',
              hour: labelsQ[contCuarto],
              P0: valueP0 && valueP0 !== 0.0000001 ? valueP0.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              obtainingMethod: obtainingMethod && obtainingMethod
            })
            contCuarto++
          }
          containP0 = true
        } else {
          if (consumptionsFilters.granularity === 'H') {
            auxConsumptionsData.push({
              cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
              hour: item.hour ? item.hour : 0,
              consumption: consumption && consumption !== 0.0000001 ? consumption.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P1: valueP1 && valueP1 !== 0.0000001 ? valueP1.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P2: valueP2 && valueP2 !== 0.0000001 ? valueP2.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P3: valueP3 && valueP3 !== 0.0000001 ? valueP3.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P4: valueP4 && valueP4 !== 0.0000001 ? valueP4.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P5: valueP5 && valueP5 !== 0.0000001 ? valueP5.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P6: valueP6 && valueP6 !== 0.0000001 ? valueP6.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              obtainingMethod: obtainingMethod && obtainingMethod
            })
          } else {
            auxConsumptionsData.push({
              cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : item.consumptionDate ? item.consumptionDate : '00/00/0000',
              hour: labelsQ[contCuarto],
              consumption: consumption && consumption !== 0.0000001 ? consumption.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P1: valueP1 && valueP1 !== 0.0000001 ? valueP1.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P2: valueP2 && valueP2 !== 0.0000001 ? valueP2.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P3: valueP3 && valueP3 !== 0.0000001 ? valueP3.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P4: valueP4 && valueP4 !== 0.0000001 ? valueP4.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P5: valueP5 && valueP5 !== 0.0000001 ? valueP5.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P6: valueP6 && valueP6 !== 0.0000001 ? valueP6.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              obtainingMethod: obtainingMethod && obtainingMethod
            })
            contCuarto++
          }
        }
      }
    }
    else {
      //para gmv10 no queremos el metodo de obtención ya que nunca llega
      if (consumptionsFilters.granularity !== 'H' && consumptionsFilters.granularity !== 'Q') {
        if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
          auxConsumptionsData.push({
            cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
            P0: valueP0 && valueP0 !== 0.0000001 ? valueP0.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
          })
          containP0 = true
        } else {
          auxConsumptionsData.push({
            cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : item.consumptionDate ? item.consumptionDate : '00/00/0000',
            consumption: consumption && consumption !== 0.0000001 ? consumption.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            P1: valueP1 && valueP1 !== 0.0000001 ? valueP1.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            P2: valueP2 && valueP2 !== 0.0000001 ? valueP2.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            P3: valueP3 && valueP3 !== 0.0000001 ? valueP3.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            P4: valueP4 && valueP4 !== 0.0000001 ? valueP4.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            P5: valueP5 && valueP5 !== 0.0000001 ? valueP5.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            P6: valueP6 && valueP6 !== 0.0000001 ? valueP6.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
          })
        }
      } else {
        if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
          if (consumptionsFilters.granularity === 'H') {
            auxConsumptionsData.push({
              cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
              hour: item.hour ? item.hour : 0,
              P0: valueP0 && valueP0 !== 0.0000001 ? valueP0.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            })
          } else {
            auxConsumptionsData.push({
              cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : item.consumptionDate ? item.consumptionDate : '00/00/0000',
              hour: labelsQ[contCuarto],
              P0: valueP0 && valueP0 !== 0.0000001 ? valueP0.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            })
            contCuarto++
          }
          containP0 = true
        } else {
          if (consumptionsFilters.granularity === 'H') {
            auxConsumptionsData.push({
              cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
              hour: item.hour ? item.hour : 0,
              consumption: consumption && consumption !== 0.0000001 ? consumption.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P1: valueP1 && valueP1 !== 0.0000001 ? valueP1.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P2: valueP2 && valueP2 !== 0.0000001 ? valueP2.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P3: valueP3 && valueP3 !== 0.0000001 ? valueP3.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P4: valueP4 && valueP4 !== 0.0000001 ? valueP4.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P5: valueP5 && valueP5 !== 0.0000001 ? valueP5.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P6: valueP6 && valueP6 !== 0.0000001 ? valueP6.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            })
          } else {
            auxConsumptionsData.push({
              cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : item.consumptionDate ? item.consumptionDate : '00/00/0000',
              hour: labelsQ[contCuarto],
              consumption: consumption && consumption !== 0.0000001 ? consumption.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P1: valueP1 && valueP1 !== 0.0000001 ? valueP1.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P2: valueP2 && valueP2 !== 0.0000001 ? valueP2.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P3: valueP3 && valueP3 !== 0.0000001 ? valueP3.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P4: valueP4 && valueP4 !== 0.0000001 ? valueP4.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P5: valueP5 && valueP5 !== 0.0000001 ? valueP5.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              P6: valueP6 && valueP6 !== 0.0000001 ? valueP6.toString() : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            })
            contCuarto++
          }
        }
      }

    }
  }

  const handleExport = () => {

    setExportingData(true)

    let consumptionsData = isSelfConsumption && currentSupplyConsumptions ? currentSupplyConsumptions : currentSupplyConsumptions[0] && currentSupplyConsumptions[0].consumptions ? currentSupplyConsumptions[0].consumptions.items : currentSupplyConsumptions && currentSupplyConsumptions.consumptions && currentSupplyConsumptions.consumptions.items
    let consumptionsData2 = currentSupplyConsumptions[1] && currentSupplyConsumptions[1].consumptions && currentSupplyConsumptions[1].consumptions.items

    if (isGeneration && consumptionsData2) {
      consumptionsData = consumptionsData.concat(consumptionsData2)
      consumptionsData2 = undefined
    }

    auxConsumptionsData.splice(0, auxConsumptionsData.length)

    let ws

    let fileName

    comprobarReactiva()


    //Entramos en este if si se descarga un Excel
    if (fileType === 'excel') {

      // en caso de ser granularidad horaria comprobamos si se trata de un día laborable o festivo
      if (isSelfConsumption && isSelfConsumption === true) {
        if (consumptionsData && consumptionsData[0].date && consumptionsFilters.granularity === 'H') {
          workingDay1 = isWorkingDay(consumptionsData[0].date)
        }
      } else {
        if (consumptionsData && consumptionsData[0].consumptionDate && consumptionsFilters.granularity === 'H') {
          workingDay1 = isWorkingDay(consumptionsData[0].consumptionDate)
        }
      }
      if (consumptionsData2 && consumptionsData2[0].consumptionDate && consumptionsFilters.granularity === 'H') {
        workingDay2 = isWorkingDay(consumptionsData2[0].consumptionDate)
      }

      consumptionsData && consumptionsData.map(
        (item) => {
          let auxConsumptionValue

          let labelAux = item.consumptionDate ? item.consumptionDate.split('/') : item.date ? item.date.split('/') : ('00/00/0000').split('/')
          let valuePV = 0.0000001
          let valuePL = 0.0000001
          let valuePP = 0.0000001
          let valueP0 = 0.0000001
          let valueP1 = 0.0000001
          let valueP2 = 0.0000001
          let valueP3 = 0.0000001
          let valueP4 = 0.0000001
          let valueP5 = 0.0000001
          let valueP6 = 0.0000001
          let consumption = 0.0000001
          let obtainingMethod = ''

          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                auxConsumptionValue = item.reactive2
              } else if (consumptionsFilters.showR3 === 'S') {
                auxConsumptionValue = item.reactive3
              } else {
                auxConsumptionValue = item.activeOutput
              }
            }
            else {
              if (consumptionsFilters.showR1 === 'S') {
                auxConsumptionValue = item.reactive1
              } else if (consumptionsFilters.showR4 === 'S') {
                auxConsumptionValue = item.reactive4
              } else {
                auxConsumptionValue = item.activeInput

                if (isAdapted === 'SI') {
                  //diferenciamos entre los dos tipos de usuario
                  if (tipoUsuario === 'simple') {
                    //comprobamos por fecha de adaptación si hay que coger el valor de activeInput
                    if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                      valuePL = item.activeInput && item.activeInput
                      valueP0 = item.activeInput && item.activeInput
                      obtainingMethod = item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                    } else {
                      consumption = item.consumptionValue && item.consumptionValue
                      valuePP = item.consumptionValueP1 && item.consumptionValueP1
                      valuePL = item.consumptionValueP2 && item.consumptionValueP2
                      valuePV = item.consumptionValueP3 && item.consumptionValueP3
                      obtainingMethod = item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                    }
                    //en caso de ser usuario complejo (6 periodos)
                  } else {
                    if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                      valueP0 = item.activeInput && item.activeInput
                      obtainingMethod = item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                    } else {
                      consumption = item.consumptionValue && item.consumptionValue
                      valueP1 = item.consumptionValueP1 && item.consumptionValueP1
                      valueP2 = item.consumptionValueP2 && item.consumptionValueP2
                      valueP3 = item.consumptionValueP3 && item.consumptionValueP3
                      valueP4 = item.consumptionValueP4 && item.consumptionValueP4
                      valueP5 = item.consumptionValueP5 && item.consumptionValueP5
                      valueP6 = item.consumptionValueP6 && item.consumptionValueP6
                      obtainingMethod = item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                    }
                  }
                }
              }
            }
          } else {
            if (consumptionsFilters.showR1 === 'S') {
              auxConsumptionValue = item.reactive1
            } else if (consumptionsFilters.showR4 === 'S') {
              auxConsumptionValue = item.reactive4
            } else {
              auxConsumptionValue = item.consumptionValue

              if (isAdapted === 'SI') {
                //diferenciamos entre los dos tipos de usuario
                if (tipoUsuario === 'simple') {
                  //comprobamos por fecha de adaptación si hay que coger el valor de consumptionValue
                  if ((!isSelfConsumption) && ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/)) {
                    valuePL = item.consumptionValue && item.consumptionValue
                    valueP0 = item.consumptionValue && item.consumptionValue
                    obtainingMethod = item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                  } else {
                    consumption = item.consumptionValue && item.consumptionValue
                    valuePP = item.consumptionValueP1 && item.consumptionValueP1
                    valuePL = item.consumptionValueP2 && item.consumptionValueP2
                    valuePV = item.consumptionValueP3 && item.consumptionValueP3
                    obtainingMethod = item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                  }
                  //en caso de ser usuario complejo (6 periodos)
                } else {
                  if ((!isSelfConsumption) && ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021)) {
                    valueP0 = item.consumptionValue && item.consumptionValue
                    obtainingMethod = item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                  } else {
                    consumption = item.consumptionValue && item.consumptionValue
                    valueP1 = item.consumptionValueP1 && item.consumptionValueP1
                    valueP2 = item.consumptionValueP2 && item.consumptionValueP2
                    valueP3 = item.consumptionValueP3 && item.consumptionValueP3
                    valueP4 = item.consumptionValueP4 && item.consumptionValueP4
                    valueP5 = item.consumptionValueP5 && item.consumptionValueP5
                    valueP6 = item.consumptionValueP6 && item.consumptionValueP6
                    obtainingMethod = item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                  }
                }
              }
            }
          }

          if (isSelfConsumption) {
            checkSelfConsumptionEnergies(item)
            auxConsumptionValue = '100'
          }

          if (auxConsumptionValue) {
            //diferenciamos cuando saca horas ya que tiene que mostrar 2 columnas más (obtainingMethod y powerPeriod)
            if (consumptionsFilters.granularity === 'H') {

              const hour = item.hour
              let powerPeriod = ''

              if (hour && workingDay1) {
                if (hour >= 1 && hour <= 8) {
                  powerPeriod = t('supplies.suppliesDetails.components.consumption.exportDialogs.valleyPeriod')
                } else if (hour === 9 || hour === 10 || (hour >= 15 && hour <= 18) || (hour >= 23 && hour <= 24)) {
                  powerPeriod = t('supplies.suppliesDetails.components.consumption.exportDialogs.plainPeriod')
                } else if ((hour >= 11 && hour <= 14) || (hour >= 19 && hour <= 22)) {
                  powerPeriod = t('supplies.suppliesDetails.components.consumption.exportDialogs.peakPeriod')
                }
              }

              if (isSelfConsumption) {
                selfConsumptionPushHour(item)
              } else if (isAdapted === 'SI' && !energiaReactiva && !isGenerationTab) {
                if (tipoUsuario === 'simple') {
                  adaptedUserPush(item, labelAux, valuePP, valuePL, valuePV, valueP0, obtainingMethod, consumption)
                } else {
                  adaptedUserPushCmpl(item, labelAux, valueP1, valueP2, valueP3, valueP4, valueP5, valueP6, valueP0, obtainingMethod, consumption)
                }
              } else if(supplyData.measurementSystem === '0'){
                //ODI
                auxConsumptionsData.push({
                  cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                  date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
                  hour: item.hour ? item.hour : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                  consumption: auxConsumptionValue ? auxConsumptionValue : '0,000',
                  obtainingMethod: item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                  //Se elimina para la energia reactiva - powerPeriod: workingDay1 ? powerPeriod : t('supplies.suppliesDetails.components.consumption.exportDialogs.valleyPeriod')
                })
              }
              else{
                //Gmv10
                auxConsumptionsData.push({
                  cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                  date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
                  hour: item.hour ? item.hour : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                  consumption: auxConsumptionValue ? auxConsumptionValue : '0,000',
                  //Se elimina para la energia reactiva - powerPeriod: workingDay1 ? powerPeriod : t('supplies.suppliesDetails.components.consumption.exportDialogs.valleyPeriod')
                })

              }


            } else {
              if (isSelfConsumption) {
                selfConsumptionPush(item)
              } else if (isAdapted === 'SI' && !energiaReactiva && !isGenerationTab) {
                if (tipoUsuario === 'simple') {
                  adaptedUserPush(item, labelAux, valuePP, valuePL, valuePV, valueP0, obtainingMethod, consumption)
                } else {
                  adaptedUserPushCmpl(item, labelAux, valueP1, valueP2, valueP3, valueP4, valueP5, valueP6, valueP0, obtainingMethod, consumption)
                }
              } else {
                //TIPO DE ENERGIA REACTIVA
                //PERIODO ODI
                if (supplyData.measurementSystem === 'O') {
                  if (consumptionsFilters.showR4 === 'S') {
                    if (consumptionsFilters.granularity === 'M') {
                      auxConsumptionsData.push({
                        cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                        date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : item.consumptionDate ? item.consumptionDate : '00/00/0000',
                        consumption: auxConsumptionValue ? auxConsumptionValue : '0,000',
                        obtainingMethod: item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                      })
                      //MES Y SEMANA
                    } else if (consumptionsFilters.granularity === 'D' || consumptionsFilters.granularity === 'S') {
                      auxConsumptionsData.push({
                        cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                        date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
                        consumption: auxConsumptionValue ? auxConsumptionValue : '0,000',
                        obtainingMethod: item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                      })
                    }
                  } else if (consumptionsFilters.showR1 === 'S') {
                    if (consumptionsFilters.granularity === 'M') {
                      auxConsumptionsData.push({
                        cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                        date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : item.consumptionDate ? item.consumptionDate : '00/00/0000',
                        consumption: auxConsumptionValue ? auxConsumptionValue : '0,000',
                        obtainingMethod: item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                      })
                      //MES Y SEMANA
                    } else if (consumptionsFilters.granularity === 'D' || consumptionsFilters.granularity === 'S') {
                      auxConsumptionsData.push({
                        cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                        date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
                        consumption: auxConsumptionValue ? auxConsumptionValue : '0,000',
                        obtainingMethod: item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                      })
                    }
                  }
                  // generación
                  else{
                    auxConsumptionsData.push({
                      cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
                      consumption: auxConsumptionValue ? auxConsumptionValue : '0,000',
                      obtainingMethod: item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                    })
                  }
                }
                //TIPO DE ENERGIA REACTIVA
                //PERIODO Gmv10
                else {
                  if (consumptionsFilters.showR4 === 'S') {
                    if (consumptionsFilters.granularity === 'M') {
                      auxConsumptionsData.push({
                        cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                        date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : item.consumptionDate ? item.consumptionDate : '00/00/0000',
                        consumption: auxConsumptionValue ? auxConsumptionValue : '0,000'
                      })
                      //MES Y SEMANA
                    } else if (consumptionsFilters.granularity === 'D' || consumptionsFilters.granularity === 'S') {
                      auxConsumptionsData.push({
                        cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                        date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
                        consumption: auxConsumptionValue ? auxConsumptionValue : '0,000'
                      })
                    }
                  } else if (consumptionsFilters.showR1 === 'S') {
                    if (consumptionsFilters.granularity === 'M') {
                      auxConsumptionsData.push({
                        cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                        date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : item.consumptionDate ? item.consumptionDate : '00/00/0000',
                        consumption: auxConsumptionValue ? auxConsumptionValue : '0,000',
  
                      })
                      //MES Y SEMANA
                    } else if (consumptionsFilters.granularity === 'D' || consumptionsFilters.granularity === 'S') {
                      auxConsumptionsData.push({
                        cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                        date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
                        consumption: auxConsumptionValue ? auxConsumptionValue : '0,000',
                      })
                    }
                    //generación
                  }
                  else{
                    auxConsumptionsData.push({
                      cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                      date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
                      consumption: auxConsumptionValue ? auxConsumptionValue : '0,000',

                    })
                  }
                }
              }
            }
          }
          return null
        }
      )

      consumptionsData2 && consumptionsData2.map(
        (item) => {
          let auxConsumptionValue
          let labelAux = item.consumptionDate && item.consumptionDate.split('/')
          let valuePV = 0.0000001
          let valuePL = 0.0000001
          let valuePP = 0.0000001
          let valueP0 = 0.0000001
          let valueP1 = 0.0000001
          let valueP2 = 0.0000001
          let valueP3 = 0.0000001
          let valueP4 = 0.0000001
          let valueP5 = 0.0000001
          let valueP6 = 0.0000001
          let consumption = 0.0000001
          let obtainingMethod = ''

          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                auxConsumptionValue = item.reactive2
              } else if (consumptionsFilters.showR3 === 'S') {
                auxConsumptionValue = item.reactive3
              } else {
                auxConsumptionValue = item.activeOutput
              }
            }
            else {
              if (consumptionsFilters.showR1 === 'S') {
                auxConsumptionValue = item.reactive1
              } else if (consumptionsFilters.showR4 === 'S') {
                auxConsumptionValue = item.reactive4
              } else {
                auxConsumptionValue = item.activeInput

                if (isAdapted === 'SI') {
                  //diferenciamos entre los dos tipos de usuario
                  if (tipoUsuario === 'simple') {
                    //comprobamos por fecha de adaptación si hay que coger el valor de activeInput
                    if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                      valuePL = item.activeInput && parseFloat(item.activeInput)
                      valueP0 = item.activeInput && parseFloat(item.activeInput)
                      obtainingMethod = item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                    } else {
                      consumption = item.consumptionValue && parseFloat(item.consumptionValue)
                      valuePP = item.consumptionValueP1 && parseFloat(item.consumptionValueP1)
                      valuePL = item.consumptionValueP2 && parseFloat(item.consumptionValueP2)
                      valuePV = item.consumptionValueP3 && parseFloat(item.consumptionValueP3)
                      obtainingMethod = item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')

                    }
                    //en caso de ser usuario complejo (6 periodos)
                  } else {
                    if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                      valueP0 = item.activeInput && parseFloat(item.activeInput)
                      obtainingMethod = item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                    } else {
                      consumption = item.consumptionValue && parseFloat(item.consumptionValue)
                      valueP1 = item.consumptionValueP1 && parseFloat(item.consumptionValueP1)
                      valueP2 = item.consumptionValueP2 && parseFloat(item.consumptionValueP2)
                      valueP3 = item.consumptionValueP3 && parseFloat(item.consumptionValueP3)
                      valueP4 = item.consumptionValueP4 && parseFloat(item.consumptionValueP4)
                      valueP5 = item.consumptionValueP5 && parseFloat(item.consumptionValueP5)
                      valueP6 = item.consumptionValueP6 && parseFloat(item.consumptionValueP6)
                      obtainingMethod = item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                    }
                  }
                }
              }
            }
          }
          else {
            if (consumptionsFilters.showR1 === 'S') {
              auxConsumptionValue = item.reactive1
            } else if (consumptionsFilters.showR4 === 'S') {
              auxConsumptionValue = item.reactive4
            } else {
              auxConsumptionValue = item.consumptionValue

              if (isAdapted === 'SI') {
                //diferenciamos entre los dos tipos de usuario
                if (tipoUsuario === 'simple') {
                  //comprobamos por fecha de adaptación si hay que coger el valor de consumptionValue
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                    valuePL = item.consumptionValue && parseFloat(item.consumptionValue)
                    valueP0 = item.consumptionValue && parseFloat(item.consumptionValue)
                    obtainingMethod = item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                  } else {
                    consumption = item.consumptionValue && parseFloat(item.consumptionValue)
                    valuePP = item.consumptionValueP1 && parseFloat(item.consumptionValueP1)
                    valuePL = item.consumptionValueP2 && parseFloat(item.consumptionValueP2)
                    valuePV = item.consumptionValueP3 && parseFloat(item.consumptionValueP3)
                    obtainingMethod = item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                  }
                  //en caso de ser usuario complejo (6 periodos)
                } else {
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                    valueP0 = item.consumptionValue && parseFloat(item.consumptionValue)
                  } else {
                    consumption = item.consumptionValue && parseFloat(item.consumptionValue)
                    valueP1 = item.consumptionValueP1 && parseFloat(item.consumptionValueP1)
                    valueP2 = item.consumptionValueP2 && parseFloat(item.consumptionValueP2)
                    valueP3 = item.consumptionValueP3 && parseFloat(item.consumptionValueP3)
                    valueP4 = item.consumptionValueP4 && parseFloat(item.consumptionValueP4)
                    valueP5 = item.consumptionValueP5 && parseFloat(item.consumptionValueP5)
                    valueP6 = item.consumptionValueP6 && parseFloat(item.consumptionValueP6)
                    obtainingMethod = item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                  }
                }
              }
            }
          }

          if (auxConsumptionValue) {
            const hour = item.hour
            let powerPeriod = ''

            if (hour && workingDay2) {
              if (hour >= 1 && hour <= 8) {
                powerPeriod = t('supplies.suppliesDetails.components.consumption.exportDialogs.valleyPeriod')
              } else if (hour === 9 || hour === 10 || (hour >= 15 && hour <= 18) || (hour >= 23 && hour <= 24)) {
                powerPeriod = t('supplies.suppliesDetails.components.consumption.exportDialogs.plainPeriod')
              } else if ((hour >= 11 && hour <= 14) || (hour >= 19 && hour <= 22)) {
                powerPeriod = t('supplies.suppliesDetails.components.consumption.exportDialogs.peakPeriod')
              }
            }

            if (isSelfConsumption) {
              selfConsumptionPush(item)
            } else if (isAdapted === 'SI') {
              if (tipoUsuario === 'simple' && !energiaReactiva) {
                adaptedUserPush(item, labelAux, valuePP, valuePL, valuePV, valueP0, obtainingMethod, consumption)
              } else {
                adaptedUserPushCmpl(item, labelAux, valueP1, valueP2, valueP3, valueP4, valueP5, valueP6, valueP0, obtainingMethod, consumption)
              }
            } else {
              auxConsumptionsData.push({
                cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
                hour: item.hour ? item.hour : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                consumption: auxConsumptionValue ? auxConsumptionValue : '0,000',
                obtainingMethod: item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                powerPeriod: workingDay2 ? powerPeriod : t('supplies.suppliesDetails.components.consumption.exportDialogs.valleyPeriod1')
              })
            }
          }

          return null
        }
      )

      if (isSelfConsumption) {
        if (consumptionsFilters.granularity !== 'H') {
          ws = XLSX.utils.json_to_sheet(auxConsumptionsData, {
            header: [
              'cups',
              'date',
            ]
          })
        } else {
          ws = XLSX.utils.json_to_sheet(auxConsumptionsData, {
            header: [
              'cups',
              'date',
              'hour',
            ]
          })
        }

      } else if (isAdapted === 'SI') {
        if (consumptionsFilters.granularity !== 'H' && consumptionsFilters.granularity !== 'Q') {
          if (tipoUsuario === 'simple') {
            if (containP0) {
              ws = XLSX.utils.json_to_sheet(auxConsumptionsData, {
                header: [
                  'cups',
                  'datefull',
                  'P0',
                  'P1',
                  'P2',
                  'P3'
                ]
              })
            } else {
              if (isGeneration) {
                auxConsumptionsData.map(
                  (item) => {
                    delete item.hour
                  }
                )
                ws = XLSX.utils.json_to_sheet(auxConsumptionsData, {
                  header: [
                    'cups',
                    'date',
                    'consumption',
                  ]
                })
              } else {
                ws = XLSX.utils.json_to_sheet(auxConsumptionsData, {
                  header: [
                    'cups',
                    'date',
                    // 'P1',
                    // 'P2',
                    // 'P3',
                  ]
                })
              }

            }
          }
          else {
            if (containP0) {
              ws = XLSX.utils.json_to_sheet(auxConsumptionsData, {
                header: [
                  'cups',
                  'date',
                  'P0',
                  'P1',
                  'P2',
                  'P3',
                  'P4',
                  'P5',
                  'P6'
                ]
              })
            } else {
              if (isGeneration) {
                auxConsumptionsData.map(
                  (item) => {
                    delete item.hour
                  }
                )
                ws = XLSX.utils.json_to_sheet(auxConsumptionsData, {
                  header: [
                    'cups',
                    'date',
                    'consumption',
                  ]
                })
              } else {
                ws = XLSX.utils.json_to_sheet(auxConsumptionsData, {
                  header: Object.keys(auxConsumptionsData[0])
                })
              }

            }
          }
        } else {
          if (isGenerationTab) {
            auxConsumptionsData.map(
              (item) => {
                delete item.obtainingMethod
                delete item.powerPeriod
              }
            )
            ws = XLSX.utils.json_to_sheet(auxConsumptionsData, {
              header: [
                'cups',
                'date',
                'hour',
                'consumption',
              ]
            })
          } else {
            ws = XLSX.utils.json_to_sheet(auxConsumptionsData, {
              header: [
                'cups',
                'date',
                'hour',
              ]
            })
          }

        }

      } else {
        if (consumptionsFilters.granularity !== 'H') {
          ws = XLSX.utils.json_to_sheet(auxConsumptionsData, {
            header: [
              'cups',
              'date',
              'consumption',
              'obtainingMethod',
              'powerPeriod'
            ]
          })
        } else {
          ws = XLSX.utils.json_to_sheet(auxConsumptionsData, {
            header: [
              'cups',
              'date',
              'hour',
              'consumption',
              'obtainingMethod',
              'powerPeriod'
            ]
          })
        }

      }
      
if(ws.A2!=null){
  

    
      // Aqui rellenamos la cabecera de la extracción, OJO si una columna está sin datos, sale null y explota
      ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups')
      if (consumptionsFilters.granularity === 'M' || consumptionsFilters.granularity === 'D' || consumptionsFilters.granularity === 'S') {
        //granularidad por periodo sin hora
        ws['B1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
        if (consumptionsFilters.showR1 && consumptionsFilters.showR1 === 'S' && supplyData.measurementSystem === 'O') {
          ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.Rkw1')
          ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.method')
          //energia reactiva generada para ODI
        }
        else if (consumptionsFilters.showR4 && consumptionsFilters.showR4 === 'S' && supplyData.measurementSystem === 'O') {
          ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.Rkw4')
          ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.method')
          //energia reactiva consumida para ODI
        }
        else if (consumptionsFilters.showR1 && consumptionsFilters.showR1 === 'S') {
          ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.Rkw1')
          //energia reactiva generada para Gmv10
        }
        else if (consumptionsFilters.showR4 && consumptionsFilters.showR4 === 'S') {
          ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.Rkw4')
          //energia reactiva consumida para Gmv10
        }
        else if (consumptionsFilters.showR1 && consumptionsFilters.showR2 && consumptionsFilters.showR3 && consumptionsFilters.showR4) {
          if (isGenerationTab) {
            // pantalla de generación
          }
          else if (tipoUsuario === 'simple' && supplyData.measurementSystem === 'O') {
            // //consumos simples para ODI


            ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.consumo')
            ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo1')
            ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo2')
            ws['F1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo3')
            ws['G1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.method')
          }
          else if (tipoUsuario === 'simple') {
            // //consumos simples para gmv10
            ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.consumo')
            ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo1')
            ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo2')
            ws['F1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo3')

          }
          else if (supplyData.measurementSystem === 'O') {
            //consumos 6 periodos ODI
            ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.consumo')
            ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo1')
            ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo2')
            ws['F1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo3')
            ws['G1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo4')
            ws['H1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo5')
            ws['I1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo6')
            ws['J1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.method')
          }
          else {
            //consumos 6 periodos Gmv10
            ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.consumo')
            ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo1')
            ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo2')
            ws['F1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo3')
            ws['G1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo4')
            ws['H1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo5')
            ws['I1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo6')
          }
        }
        else {
          //autoconsumos
          ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHCR')
          ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHAC')
          ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHCCA')
          ws['F1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHEX')
          ws['G1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHNG')
          ws['H1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHCSA')
          ws['I1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHCRi')
          ws['J1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHACi')
          ws['K1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHCi')
          ws['L1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHEXi')
          ws['M1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHNGi')
          ws['N1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHEXG')
        }
      }
      else {
        //datos con el campo hora, tenemos que crear una columna nueva para la hora
        ws['B1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
        ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')

        if (consumptionsFilters.showR1 && consumptionsFilters.showR1 === 'S' && supplyData.measurementSystem === 'O') {
          ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.Rkw1')
          ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.method')
          //energia reactiva generada ODI
        }
        else if (consumptionsFilters.showR4 && consumptionsFilters.showR4 === 'S' && supplyData.measurementSystem === 'O') {
          ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.Rkw4')
          ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.method')
          //energia reactiva consumida ODI
        }
        if (consumptionsFilters.showR1 && consumptionsFilters.showR1 === 'S') {
          ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.Rkw1')
          //energia reactiva generada Gmv10
        }
        else if (consumptionsFilters.showR4 && consumptionsFilters.showR4 === 'S') {
          ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.Rkw4')
          //energia reactiva consumida Gmv10
        }
        else if (consumptionsFilters.showR1 && consumptionsFilters.showR2 && consumptionsFilters.showR3 && consumptionsFilters.showR4) {
          if (isGenerationTab) {
            // pantalla de generación
          }
          else if (tipoUsuario === 'simple' && supplyData.measurementSystem === 'O') {
            //consumos 3 Periodos ODI
            ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.consumo')
            ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo1')
            ws['F1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo2')
            ws['G1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo3')
            ws['H1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.method')
          }
          else if (tipoUsuario === 'simple') {
            //consumos 3 Periodos Gmv10
            ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.consumo')
            ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo1')
            ws['F1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo2')
            ws['G1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo3')
          }
          else if (supplyData.measurementSystem === 'O') {
            // consumos 6 periodos ODI
            ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.consumo')
            ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo1')
            ws['F1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo2')
            ws['G1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo3')
            ws['H1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo4')
            ws['I1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo5')
            ws['J1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo6')
            ws['K1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.method')
          }
          else {
            // consumos 6 periodos Gmv10
            ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.consumo')
            ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo1')
            ws['F1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo2')
            ws['G1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo3')
            ws['H1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo4')
            ws['I1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo5')
            ws['J1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo6')

          }
        }
        else {
          //autoconsumos
          ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHCR')
          ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHAC')
          ws['F1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHCCA')
          ws['G1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHEX')
          ws['H1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHNG')
          ws['I1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHCSA')
          ws['J1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHCRi')
          ws['K1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHCi')
          ws['L1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHEXi')
          ws['M1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHEXi')
          ws['N1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHNGi')
          ws['O1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHEXG')

        }
      }

      if (isSelfConsumption) {
        fileName = 'autoconsumptions.xlsx'
      } else {
        fileName = 'consumptions.xlsx'
      }


      const wb = XLSX.utils.book_new()

      if (isSelfConsumption) {
        XLSX.utils.book_append_sheet(wb, ws, 'autoconsumptions')
      } else {
        XLSX.utils.book_append_sheet(wb, ws, 'consumptions')
      }


      XLSX.writeFile(wb, fileName)

      // XLSX.writeFile will attempt to force a client-side download, works for web,
      // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
      if (isMobileApp()) createFileAndOpenIt({ fileName, contentAsBase64: XLSX.write(wb, { type: 'base64' }) })
      }
    else{
      setpopUpError(true)
    }
    } else {
      auxConsumptionsData.push({
        cups: t('supplies.suppliesDetails.components.consumption.exportDialogs.cups2'),
        date: t('supplies.suppliesDetails.components.consumption.exportDialogs.date'),
        hour: t('supplies.suppliesDetails.components.consumption.exportDialogs.hour'),
        value: ((isGeneration && isGenerationTab) ? t('supplies.suppliesDetails.components.consumption.exportDialogs.generation2') + '(kWh)' : t('supplies.suppliesDetails.components.consumption.exportDialogs.consumption2') + '(kWh)'),
        readingType: t('supplies.suppliesDetails.components.consumption.exportDialogs.method2')
      })

      consumptionsData && consumptionsData.map(
        (item) => {
          let auxConsumptionValue

          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                auxConsumptionValue = item.reactive2
              } else if (consumptionsFilters.showR3 === 'S') {
                auxConsumptionValue = item.reactive3
              } else {
                auxConsumptionValue = item.activeOutput
              }
            }
            else {
              if (consumptionsFilters.showR1 === 'S') {
                auxConsumptionValue = item.reactive1
              } else if (consumptionsFilters.showR4 === 'S') {
                auxConsumptionValue = item.reactive4
              } else {
                auxConsumptionValue = item.activeInput
              }
            }
          }
          else {
            if (consumptionsFilters.showR1 === 'S') {
              auxConsumptionValue = item.reactive1
            } else if (consumptionsFilters.showR4 === 'S') {
              auxConsumptionValue = item.reactive4
            } else {
              auxConsumptionValue = item.consumptionValue
            }
          }

          if (auxConsumptionValue) {
            let cups = supplyData.cups || t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')

            if (cups.length === 20) {
              cups = cups + '1P'
            }

            let auxConsumptionsItem = {
              cups,
              date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
              hour: item.hour,
              value: auxConsumptionValue ? auxConsumptionValue : '0,000',
              readingType: item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.estimado') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
            }
            auxConsumptionsData.push(auxConsumptionsItem)
          }

          return null
        }
      )

      consumptionsData2 && consumptionsData2.map(
        (item) => {
          let auxConsumptionValue

          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                auxConsumptionValue = item.reactive2
              } else if (consumptionsFilters.showR3 === 'S') {
                auxConsumptionValue = item.reactive3
              } else {
                auxConsumptionValue = item.activeOutput
              }
            }
            else {
              if (consumptionsFilters.showR1 === 'S') {
                auxConsumptionValue = item.reactive1
              } else if (consumptionsFilters.showR4 === 'S') {
                auxConsumptionValue = item.reactive4
              } else {
                auxConsumptionValue = item.activeInput
              }
            }
          }
          else {
            if (consumptionsFilters.showR1 === 'S') {
              auxConsumptionValue = item.reactive1
            } else if (consumptionsFilters.showR4 === 'S') {
              auxConsumptionValue = item.reactive4
            } else {
              auxConsumptionValue = item.consumptionValue
            }
          }

          if (auxConsumptionValue) {
            let cups = supplyData.cups || t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')

            if (cups.length === 20) {
              cups = cups + '1P'
            }

            let auxConsumptionsItem = {
              cups,
              date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
              hour: item.hour,
              value: auxConsumptionValue ? auxConsumptionValue : '0,000',
              readingType: item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.cnmc.estimado') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
            }
            auxConsumptionsData.push(auxConsumptionsItem)
          }


          return null
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


    setExportingData(false)    
    setPopUpOk(true)   

  }

  const handleExportCompare = () => {
    setExportingData(true)


    const consumptionsData = isSelfConsumption && currentSupplyConsumptions ? currentSupplyConsumptions : currentSupplyConsumptions[0] && currentSupplyConsumptions[0].consumptions ? currentSupplyConsumptions[0].consumptions.items : currentSupplyConsumptions && currentSupplyConsumptions.consumptions && currentSupplyConsumptions.consumptions.items
    const consumptionsCompareData = isSelfConsumption && currentCompareConsumptions ? currentCompareConsumptions : currentCompareConsumptions[0] && currentCompareConsumptions[0].consumptions ? currentCompareConsumptions[0].consumptions.items : currentCompareConsumptions && currentCompareConsumptions.consumptions && currentCompareConsumptions.consumptions.items

    const consumptionsData2 = currentSupplyConsumptions[1] && currentSupplyConsumptions[1].consumptions && currentSupplyConsumptions[1].consumptions.items
    const consumptionsCompareData2 = currentCompareConsumptions[1] && currentCompareConsumptions[1].consumptions && currentCompareConsumptions[1].consumptions.items

    let ws

    let fileName

    comprobarReactiva()

    if (fileType === 'excel') {
      consumptionsData && consumptionsData.map(
        (item) => {
          let auxConsumptionValue

          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                auxConsumptionValue = item.reactive2
              } else if (consumptionsFilters.showR3 === 'S') {
                auxConsumptionValue = item.reactive3
              } else {
                auxConsumptionValue = item.activeOutput
              }
            }
            else {
              if (consumptionsFilters.showR1 === 'S') {
                auxConsumptionValue = item.reactive1
              } else if (consumptionsFilters.showR4 === 'S') {
                auxConsumptionValue = item.reactive4
              } else {
                auxConsumptionValue = item.activeInput
              }
            }
          }
          else {
            if (consumptionsFilters.showR1 === 'S') {
              auxConsumptionValue = item.reactive1
            } else if (consumptionsFilters.showR4 === 'S') {
              auxConsumptionValue = item.reactive4
            } else {
              auxConsumptionValue = item.consumptionValue
            }
          }

          if (isSelfConsumption) {
            checkSelfConsumptionEnergies(item)
            auxConsumptionValue = '100'
          }

          if (auxConsumptionValue) {
            if (consumptionsFilters.granularity === 'H') {
              if (isSelfConsumption) {
                selfConsumptionPush2(item)
              } else {
                auxConsumptionsData.push({
                  cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                  date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
                  hour: item.hour ? item.hour : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                  consumption: auxConsumptionValue ? auxConsumptionValue : '0,000',
                  obtainingMethod: item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                })
              }
            } else {
              if (isSelfConsumption) {
                selfConsumptionPush(item)
              } else {
                auxConsumptionsData.push({
                  cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                  date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : item.consumptionDate ? item.consumptionDate : '00/00/0000',
                  hour: item.hour ? item.hour : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                  consumption: auxConsumptionValue ? auxConsumptionValue : '0,000',
                })
              }
            }
          }

          return null
        }
      )

      consumptionsData2 && consumptionsData2.map(
        (item) => {
          let auxConsumptionValue

          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                auxConsumptionValue = item.reactive2
              } else if (consumptionsFilters.showR3 === 'S') {
                auxConsumptionValue = item.reactive3
              } else {
                auxConsumptionValue = item.activeOutput
              }
            }
            else {
              if (consumptionsFilters.showR1 === 'S') {
                auxConsumptionValue = item.reactive1
              } else if (consumptionsFilters.showR4 === 'S') {
                auxConsumptionValue = item.reactive4
              } else {
                auxConsumptionValue = item.activeInput
              }
            }
          }
          else {
            if (consumptionsFilters.showR1 === 'S') {
              auxConsumptionValue = item.reactive1
            } else if (consumptionsFilters.showR4 === 'S') {
              auxConsumptionValue = item.reactive4
            } else {
              auxConsumptionValue = item.consumptionValue
            }
          }

          if (auxConsumptionValue) {
            if (consumptionsFilters.granularity === 'H') {
              if (isSelfConsumption) {
                selfConsumptionPush(item)
              } else {
                auxConsumptionsData.push({
                  cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                  date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
                  hour: item.hour ? item.hour : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                  consumption: auxConsumptionValue ? auxConsumptionValue : '0,000',
                  obtainingMethod: item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                })
              }
            } else {
              if (isSelfConsumption) {
                selfConsumptionPush(item)
              } else {
                auxConsumptionsData.push({
                  cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                  date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : item.consumptionDate ? item.consumptionDate : '00/00/0000',
                  hour: item.hour ? item.hour : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                  consumption: auxConsumptionValue ? auxConsumptionValue : '0,000',
                })
              }
            }
          }

          return null
        }
      )

      if (isSelfConsumption) {
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
      }

      consumptionsCompareData && consumptionsCompareData.map(
        (item) => {
          let auxConsumptionCompareValue

          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                auxConsumptionCompareValue = item.reactive2
              } else if (consumptionsFilters.showR3 === 'S') {
                auxConsumptionCompareValue = item.reactive3
              } else {
                auxConsumptionCompareValue = item.activeOutput
              }
            }
            else {
              if (consumptionsFilters.showR1 === 'S') {
                auxConsumptionCompareValue = item.reactive1
              } else if (consumptionsFilters.showR4 === 'S') {
                auxConsumptionCompareValue = item.reactive4
              } else {
                auxConsumptionCompareValue = item.activeInput
              }
            }
          }
          else {
            if (consumptionsFilters.showR1 === 'S') {
              auxConsumptionCompareValue = item.reactive1
            } else if (consumptionsFilters.showR4 === 'S') {
              auxConsumptionCompareValue = item.reactive4
            } else {
              auxConsumptionCompareValue = item.consumptionValue
            }
          }

          if (isSelfConsumption) {
            checkSelfConsumptionCompareEnergies(item)
            auxConsumptionCompareValue = '100'
          }

          if (auxConsumptionCompareValue) {
            if (consumptionsFilters.granularity === 'H') {
              if (isSelfConsumption) {
                selfConsumptionPush2(item)
              } else {
                auxConsumptionsData2.push({
                  date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
                  hour: item.hour ? item.hour : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                  consumption: auxConsumptionCompareValue ? auxConsumptionCompareValue : '0,000',
                  obtainingMethod: item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                })
              }
            } else {
              if (isSelfConsumption) {
                selfConsumptionPush2(item)
              } else {
                auxConsumptionsData2.push({
                  date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : item.consumptionDate ? item.consumptionDate : '00/00/0000',
                  hour: item.hour ? item.hour : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                  consumption: auxConsumptionCompareValue ? auxConsumptionCompareValue : '0,000',
                })
              }
            }
          }
          return null
        }
      )

      consumptionsCompareData2 && consumptionsCompareData2.map(
        (item) => {
          let auxConsumptionCompareValue

          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                auxConsumptionCompareValue = item.reactive2
              } else if (consumptionsFilters.showR3 === 'S') {
                auxConsumptionCompareValue = item.reactive3
              } else {
                auxConsumptionCompareValue = item.activeOutput
              }
            }
            else {
              if (consumptionsFilters.showR1 === 'S') {
                auxConsumptionCompareValue = item.reactive1
              } else if (consumptionsFilters.showR4 === 'S') {
                auxConsumptionCompareValue = item.reactive4
              } else {
                auxConsumptionCompareValue = item.activeInput
              }
            }
          }
          else {
            if (consumptionsFilters.showR1 === 'S') {
              auxConsumptionCompareValue = item.reactive1
            } else if (consumptionsFilters.showR4 === 'S') {
              auxConsumptionCompareValue = item.reactive4
            } else {
              auxConsumptionCompareValue = item.consumptionValue
            }
          }

          if (auxConsumptionCompareValue) {
            if (consumptionsFilters.granularity === 'H') {
              if (isSelfConsumption) {
                selfConsumptionPush2(item)
              } else {
                auxConsumptionsData2.push({
                  date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
                  hour: item.hour ? item.hour : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                  consumption: auxConsumptionCompareValue ? auxConsumptionCompareValue : '0,000',
                  obtainingMethod: item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
                })
              }
            } else {
              if (isSelfConsumption) {
                selfConsumptionPush2(item)
              } else {
                auxConsumptionsData2.push({
                  date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : item.consumptionDate ? item.consumptionDate : '00/00/0000',
                  hour: item.hour ? item.hour : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                  consumption: auxConsumptionCompareValue ? auxConsumptionCompareValue : '0,000',
                })
              }
            }
          }
          return null
        }
      )

      if (isSelfConsumption) {
        auxConsumptionsData2.map(
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
      }

      let i
      var maxItem = auxConsumptionsData.length

      if (auxConsumptionsData2.length > maxItem) {
        maxItem = auxConsumptionsData2.length
      }

      maxItem = maxItem - 1


      for (i = 0; i <= maxItem; i++) {
        if (isSelfConsumption) {
          selfConsumptionPush3(auxConsumptionsData, auxConsumptionsData2, i)
        } else {
          auxConsumptionsData3.push({
            cups: auxConsumptionsData[0].cups,
            date: ((auxConsumptionsData.length - 1) >= i) ? auxConsumptionsData[i].date : '',
            hour: ((auxConsumptionsData.length - 1) >= i) ? auxConsumptionsData[i].hour : '',
            consumption: ((auxConsumptionsData.length - 1) >= i) ? auxConsumptionsData[i].consumption.replace(',', '.') : '',
            obtainingMethod: ((auxConsumptionsData.length - 1) >= i) ? auxConsumptionsData[i].obtainingMethod : '',

            dateCompare: ((auxConsumptionsData2.length - 1) >= i) ? auxConsumptionsData2[i].date : '',
            hourCompare: ((auxConsumptionsData2.length - 1) >= i) ? auxConsumptionsData2[i].hour : '',
            consumptionCompare: ((auxConsumptionsData2.length - 1) >= i) ? auxConsumptionsData2[i].consumption.replace(',', '.') : '',
            obtainingMethodCompare: ((auxConsumptionsData2.length - 1) >= i) ? auxConsumptionsData2[i].obtainingMethod : ''
          })
        }
      }

      if (isSelfConsumption) {
        auxConsumptionsData3.map(
          (item) => {
            if (!containEHCR) {
              delete item.EHCR
              delete item.ehcr
            }
            if (!containEHAC) {
              delete item.EHAC
              delete item.ehac
            }
            if (!containEHCCA) {
              delete item.EHCCA
              delete item.ehcca
            }
            if (!containEHEX) {
              delete item.EHEX
              delete item.ehex
            }
            if (!containEHNG) {
              delete item.EHNG
              delete item.ehng
            }
            if (!containEHCSA) {
              delete item.EHCSA
              delete item.ehcsa
            }
            if (!containEHCRi) {
              delete item.EHCRi
              delete item.ehcri
            }
            if (!containEHACi) {
              delete item.EHACi
              delete item.ehaci
            }
            if (!containEHCi) {
              delete item.EHCi
              delete item.ehci
            }
            if (!containEHEXi) {
              delete item.EHEXi
              delete item.ehexi
            }
            if (!containEHNGi) {
              delete item.EHNGi
              delete item.ehngi
            }
            if (!containEHEXG) {
              delete item.EHEXG
              delete item.ehexg
            }

          }
        )
      }

      if (isSelfConsumption) {

        ws = XLSX.utils.json_to_sheet(auxConsumptionsData3, {
          header: [
            'cups',
            'date',
            'hour'
          ]
        })
      } else {
        if (consumptionsFilters.granularity === 'H') {

          ws = XLSX.utils.json_to_sheet(auxConsumptionsData3, {
            header: [
              'cups',
              'date',
              'hour',
              'consumption',
              'obtainingMethod',
              ' ',
              'dateCompare',
              'hourCompare',
              'consumptionCompare',
              'obtainingMethodCompare'
            ]
          })
        } else {

          ws = XLSX.utils.json_to_sheet(auxConsumptionsData3, {
            header: [
              'cups',
              'date',
              'hour',
              'consumption',
              ' ',
              'dateCompare',
              'hourCompare',
              'consumptionCompare',
            ]
          })
        }
      }


      if (isSelfConsumption) {
        ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups')
        ws['B1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
        ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')
      } else {
        if (consumptionsFilters.granularity === 'H' && supplyData.rate.includes('2.')) {
          ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups')
          ws['B1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
          ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')
          ws['D1'].v = literalD1
          ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.method')
          ws['F1'].v = t('  ')
          ws['G1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
          ws['H1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')
          ws['I1'].v = literalD1
          ws['J1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.method')
        } else {
          ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups')
          ws['B1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
          ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')
          ws['D1'].v = literalD1
          // delete ws['E1']
          // ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.method')
          ws['E1'].v = t('  ')
          ws['F1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
          ws['G1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')
          ws['H1'].v = literalD1
          delete ws['I1']
          delete ws['J1']
          // ws['J1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.method')
        }
      }



      fileName = 'consumptionsCompare.xlsx'

      const wb = XLSX.utils.book_new()

      XLSX.utils.book_append_sheet(wb, ws, 'consumptions')

      XLSX.writeFile(wb, fileName)

      // XLSX.writeFile will attempt to force a client-side download, works for web,
      // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
      if (isMobileApp()) createFileAndOpenIt({ fileName, contentAsBase64: XLSX.write(wb, { type: 'base64' }) })
      

// NO ES EXCEL
    } else {
//HASTA ESE ELSE
      auxConsumptionsData3.push({
        cups: t('supplies.suppliesDetails.components.consumption.exportDialogs.cups'),
        date: t('supplies.suppliesDetails.components.consumption.exportDialogs.date'),
        hour: t('supplies.suppliesDetails.components.consumption.exportDialogs.hour'),
        value: literalD1,
        readingType: t('supplies.suppliesDetails.components.consumption.exportDialogs.method2'),
        dateCompare: t('supplies.suppliesDetails.components.consumption.exportDialogs.dateCompare'),
        hourCompare: t('supplies.suppliesDetails.components.consumption.exportDialogs.hourCompare'),
        valueCompare: literalD1,
        readingTypeCompare: t('supplies.suppliesDetails.components.consumption.exportDialogs.method2Compare')
      })

      consumptionsData && consumptionsData.map(
        (item) => {
          let auxConsumptionValue

          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                auxConsumptionValue = item.reactive2
              } else if (consumptionsFilters.showR3 === 'S') {
                auxConsumptionValue = item.reactive3
              } else {
                auxConsumptionValue = item.activeOutput
              }
            }
            else {
              if (consumptionsFilters.showR1 === 'S') {
                auxConsumptionValue = item.reactive1
              } else if (consumptionsFilters.showR4 === 'S') {
                auxConsumptionValue = item.reactive4
              } else {
                auxConsumptionValue = item.activeInput
              }
            }
          }
          else {
            if (consumptionsFilters.showR1 === 'S') {
              auxConsumptionValue = item.reactive1
            } else if (consumptionsFilters.showR4 === 'S') {
              auxConsumptionValue = item.reactive4
            } else {
              auxConsumptionValue = item.consumptionValue
            }
          }

          if (auxConsumptionValue) {
            let cups = supplyData.cups || t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')

            if (cups.length === 20) {
              cups = cups + '1P'
            }

            let auxConsumptionsItem = {
              cups,
              date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : item.consumptionDate ? item.consumptionDate : '00/00/0000',
              hour: item.hour ? item.hour : '0',
              value: auxConsumptionValue ? auxConsumptionValue : '0,000',
              readingType: item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
            }
            auxConsumptionsData.push(auxConsumptionsItem)
          }

          return null
        }
      )

      consumptionsData2 && consumptionsData2.map(
        (item) => {
          let auxConsumptionValue

          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                auxConsumptionValue = item.reactive2
              } else if (consumptionsFilters.showR3 === 'S') {
                auxConsumptionValue = item.reactive3
              } else {
                auxConsumptionValue = item.activeOutput
              }
            }
            else {
              if (consumptionsFilters.showR1 === 'S') {
                auxConsumptionValue = item.reactive1
              } else if (consumptionsFilters.showR4 === 'S') {
                auxConsumptionValue = item.reactive4
              } else {
                auxConsumptionValue = item.activeInput
              }
            }
          }
          else {
            if (consumptionsFilters.showR1 === 'S') {
              auxConsumptionValue = item.reactive1
            } else if (consumptionsFilters.showR4 === 'S') {
              auxConsumptionValue = item.reactive4
            } else {
              auxConsumptionValue = item.consumptionValue
            }
          }

          if (auxConsumptionValue) {
            let cups = supplyData.cups || t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')

            if (cups.length === 20) {
              cups = cups + '1P'
            }

            let auxConsumptionsItem = {
              cups,
              date: item.consumptionDate ? item.consumptionDate : '00/00/0000',
              hour: item.hour ? item.hour : '0',
              value: auxConsumptionValue ? auxConsumptionValue : '0,000',
              readingType: item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
            }
            auxConsumptionsData.push(auxConsumptionsItem)
          }

          return null
        }
      )

      consumptionsCompareData && consumptionsCompareData.map(
        (item) => {
          let auxConsumptionValue

          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                auxConsumptionValue = item.reactive2
              } else if (consumptionsFilters.showR3 === 'S') {
                auxConsumptionValue = item.reactive3
              } else {
                auxConsumptionValue = item.activeOutput
              }
            }
            else {
              if (consumptionsFilters.showR1 === 'S') {
                auxConsumptionValue = item.reactive1
              } else if (consumptionsFilters.showR4 === 'S') {
                auxConsumptionValue = item.reactive4
              } else {
                auxConsumptionValue = item.activeInput
              }
            }
          }
          else {
            if (consumptionsFilters.showR1 === 'S') {
              auxConsumptionValue = item.reactive1
            } else if (consumptionsFilters.showR4 === 'S') {
              auxConsumptionValue = item.reactive4
            } else {
              auxConsumptionValue = item.consumptionValue
            }
          }

          if (auxConsumptionValue) {
            let cups = supplyData.cups || t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')

            if (cups.length === 20) {
              cups = cups + '1P'
            }

            let auxConsumptionsItem = {
              cups,
              date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : item.consumptionDate ? item.consumptionDate : '00/00/0000',
              hour: item.hour ? item.hour : '0',
              value: auxConsumptionValue ? auxConsumptionValue : '0,000',
              readingType: item.readingType === 'R' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
            }

            auxConsumptionsData2.push(auxConsumptionsItem)
          }

          return null
        }
      )

      consumptionsCompareData2 && consumptionsCompareData2.map(
        (item) => {
          let auxConsumptionValue

          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                auxConsumptionValue = item.reactive2
              } else if (consumptionsFilters.showR3 === 'S') {
                auxConsumptionValue = item.reactive3
              } else {
                auxConsumptionValue = item.activeOutput
              }
            }
            else {
              if (consumptionsFilters.showR1 === 'S') {
                auxConsumptionValue = item.reactive1
              } else if (consumptionsFilters.showR4 === 'S') {
                auxConsumptionValue = item.reactive4
              } else {
                auxConsumptionValue = item.activeInput
              }
            }
          }
          else {
            if (consumptionsFilters.showR1 === 'S') {
              auxConsumptionValue = item.reactive1
            } else if (consumptionsFilters.showR4 === 'S') {
              auxConsumptionValue = item.reactive4
            } else {
              auxConsumptionValue = item.consumptionValue
            }
          }

          if (auxConsumptionValue) {
            let cups = supplyData.cups || t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')

            if (cups.length === 20) {
              cups = cups + '1P'
            }

            let auxConsumptionsItem = {
              cups,
              date: consumptionsFilters.granularity === 'M' && item.consumptionDate ? item.consumptionDate.split('/')[1] + '/' + item.consumptionDate.split('/')[2] : item.consumptionDate ? item.consumptionDate : '00/00/0000',
              hour: item.hour ? item.hour : '0',
              value: auxConsumptionValue ? auxConsumptionValue : '0,000',
              readingType: (item.readingType === 'R') ? t('supplies.suppliesDetails.components.consumption.exportDialogs.real') : item.readingType === 'E' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.estimation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData')
            }

            auxConsumptionsData2.push(auxConsumptionsItem)
          }

          return null
        }
      )

      let i
      var maxItem = auxConsumptionsData.length

      if (auxConsumptionsData2.length > maxItem) {
        maxItem = auxConsumptionsData2.length
      }

      maxItem = maxItem - 1

      for (i = 0; i <= maxItem; i++) {
        auxConsumptionsData3.push({
          cups: auxConsumptionsData[0].cups,
          date: ((auxConsumptionsData.length - 1) >= i) ? auxConsumptionsData[i].date : '',
          hour: ((auxConsumptionsData.length - 1) >= i) ? auxConsumptionsData[i].hour : '',
          value: ((auxConsumptionsData.length - 1) >= i) ? auxConsumptionsData[i].value : '',
          readingType: ((auxConsumptionsData.length - 1) >= i) ? auxConsumptionsData[i].readingType : '',

          dateCompare: ((auxConsumptionsData2.length - 1) >= i) ? auxConsumptionsData2[i].date : '',
          hourCompare: ((auxConsumptionsData2.length - 1) >= i) ? auxConsumptionsData2[i].hour : '',
          valueCompare: ((auxConsumptionsData2.length - 1) >= i) ? auxConsumptionsData2[i].value : '',
          readingTypeCompare: ((auxConsumptionsData2.length - 1) >= i) ? auxConsumptionsData2[i].readingType : ''
        })
      }

      const options = {
        filename: 'consumptionsCompare',
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

      csvExporter.generateCsv(auxConsumptionsData3)
    }
    setExportingData(false)
    setPopUpOk(true)
  
  }

  const comprobarReactiva = () => {
    reactiva = false
    if (consumptionsFilters.showR1 === 'S') {
      reactiva = true
    }
    if (consumptionsFilters.showR2 === 'S') {
      reactiva = true
    }
    if (consumptionsFilters.showR3 === 'S') {
      reactiva = true
    }
    if (consumptionsFilters.showR4 === 'S') {
      reactiva = true
    }
    if (reactiva) {
      if (isGenerationTab || consumptionsFilters.showR4 === 'S' || consumptionsFilters.showR3 === 'S') {
        literalD1 = t('supplies.suppliesDetails.components.reactiva.energiaGenerada1') + ' kVArh'
      } else {
        literalD1 = t('supplies.suppliesDetails.components.reactiva.energiaConsumida1') + ' kVArh'
      }
    } else if (isGenerationTab) {
      literalD1 = t('supplies.suppliesDetails.components.consumption.exportDialogs.generation') + ' KWh'
    } else {
      literalD1 = t('supplies.suppliesDetails.components.consumption.exportDialogs.consumption') + ' KWh'
    }
  }

  const popUpClose = () => {
      setPopUpOk(false)
      handleClose()
      setpopUpError(false)

  }

  useEffect(() => {
    if (popUpError) {
      setPopUpOk(false);
    }
  }, [popUpError]);


  return (
    <>
      {
        exportingData &&
        <Spinner />
      }
      

      { (!popUpOk || !popUpError) &&
        <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleClose} />

      } 
      { (popUpOk || popUpError) &&
        <img src={CloseIcon} className={classes.closeButton} alt='' onClick={popUpClose} />
      }
      { (!popUpOk && !popUpError) &&
        <div className={classes.title}>{t('supplies.suppliesDetails.components.consumption.exportDialogs.exportTableDataDialog.exportData.from')} {`${mode === 'graph' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.exportTableDataDialog.exportData.graph') : t('supplies.suppliesDetails.components.consumption.exportDialogs.exportTableDataDialog.exportData.table')}`}</div>
      }

      { popUpOk &&
        <img src={GreenCheckIcon} />
      }

      { popUpError &&
        <img src={RedIcon} className={classes.errorIcon}/>
      }
      { popUpOk &&
      <div>
        <div className={classes.title}>{t('supplies.suppliesDetails.components.consumption.exportDialogs.popupOkTitle')} </div>
        <div className={classes.textCenter}>{t('supplies.suppliesDetails.components.consumption.exportDialogs.popupOkText')}</div>
      </div>
      }

      { popUpError &&
      <div>
        <div className={classes.title}>{t('supplies.suppliesDetails.components.consumption.exportDialogs.popupErrorTitle')} </div>
        <div className={classes.textCenter}>{t('supplies.suppliesDetails.components.consumption.exportDialogs.popupErrorText')}</div>
      </div>
      }
      {
        (consumptionsFilters.granularity && consumptionsFilters.granularity === 'H' && !isSelfConsumption) || (!popUpOk && !popUpError)?
          <>
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
          </>
          :
          !isSelfConsumption && (!popUpOk && !popUpError) &&
          <div className={classes.options}>
            <div className={classes.text}>
              {t('supplies.suppliesDetails.components.consumption.exportDialogs.webSimulator3')}<a href='https://facturaluz.cnmc.es/' target='_blank' rel='noopener noreferrer'>facturaluz.cnmc.es</a>{t('supplies.suppliesDetails.components.consumption.exportDialogs.webSimulator4')}
            </div>
          </div>
      }
      {(!popUpOk && !popUpError) &&
        <Grid container className={classes.buttonContainer}>
        <Grid item>
          <Button
            text={t('supplies.suppliesDetails.components.consumption.exportDialogs.buttomExpot')}
            color={'primary'}
            size={'large'}
            variant={'contained'}
            onClick={consumptionsFilters.compare === 'C' ? handleExportCompare : handleExport}
          />
        </Grid>
      </Grid>
      }
    
    </>
  )
}

export default withRouter(Content)
