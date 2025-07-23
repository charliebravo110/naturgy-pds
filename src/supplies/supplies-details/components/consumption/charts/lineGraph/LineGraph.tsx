import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Line } from 'react-chartjs-2'
import 'chartjs-plugin-annotation'

import Grid from '@material-ui/core/Grid'

import {
  completeDateWithSlash,
  formatDateAndHourStringWithBars, formatDay,
  formatMonth,
} from '../../../../../../common/lib/FormatLib'

import useStyles from './LineGraph.styles'

import DynamicLegend from '../dynamicLegend/DynamicLegend'
import LegendSelfConsumption from '../legend/LegendSelfConsumption'

// Plugin para redondear las esquinas de las barras
require('../../../../../../common/components/chart/chartRounded.styles.js')

const LineGraph = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    currentSupplyConsumptions,
    currentCompareConsumptions,
    consumptionsFilters,
    autoConsumption,
    supplyData
  } = props

  const [state, setState] = useState({
    checkedALL: true as boolean,
    checkedEHCR: true as boolean,
    checkedEHAC: true as boolean,
    checkedEHCCA: true as boolean,
    checkedEHEX: true as boolean,
    checkedEHNG: true as boolean,
    checkedEHCSA: true as boolean,
    checkedEHCRi: true as boolean,
    checkedEHACi: true as boolean,
    checkedEHCi: true as boolean,
    checkedEHEXi: true as boolean,
    checkedEHNGi: true as boolean,
    checkedEHEXG: true as boolean
  });

  const [containValue, setContainValue] = useState({
    EHCR: false as boolean,
    EHAC: false as boolean,
    EHCCA: false as boolean,
    EHEX: false as boolean,
    EHNG: false as boolean,
    EHCSA: false as boolean,
    EHCRi: false as boolean,
    EHACi: false as boolean,
    EHCi: false as boolean,
    EHEXi: false as boolean,
    EHNGi: false as boolean,
    EHEXG: false as boolean
  });

  let contadorEHCR = 0
  let contadorEHAC = 0
  let contadorEHCCA = 0
  let contadorEHEX = 0
  let contadorEHNG = 0
  let contadorEHCSA = 0
  let contadorEHCRi = 0
  let contadorEHACi = 0
  let contadorEHCi = 0
  let contadorEHEXi = 0
  let contadorEHNGi = 0
  let contadorEHEXG = 0
  let contadorEHCRcompare = 0
  let contadorEHACcompare = 0
  let contadorEHCCAcompare = 0
  let contadorEHEXcompare = 0
  let contadorEHNGcompare = 0
  let contadorEHCSAcompare = 0
  let contadorEHCRicompare = 0
  let contadorEHACicompare = 0
  let contadorEHCicompare = 0
  let contadorEHEXicompare = 0
  let contadorEHNGicompare = 0
  let contadorEHEXGcompare = 0

  const [finalSum, setFinalSum] = useState({
    EHCR: 0 as any,
    EHAC: 0 as any,
    EHCCA: 0 as any,
    EHEX: 0 as any,
    EHNG: 0 as any,
    EHCSA: 0 as any,
    EHCRi: 0 as any,
    EHACi: 0 as any,
    EHCi: 0 as any,
    EHEXi: 0 as any,
    EHNGi: 0 as any,
    EHEXG: 0 as any,
    EHCRcompare: 0 as any,
    EHACcompare: 0 as any,
    EHCCAcompare: 0 as any,
    EHEXcompare: 0 as any,
    EHNGcompare: 0 as any,
    EHCSAcompare: 0 as any,
    EHCRicompare: 0 as any,
    EHACicompare: 0 as any,
    EHCicompare: 0 as any,
    EHEXicompare: 0 as any,
    EHNGicompare: 0 as any,
    EHEXGcompare: 0 as any
  })
  const [finalMax, setFinalMax] = useState({
    EHCR: 0 as any,
    EHAC: 0 as any,
    EHCCA: 0 as any,
    EHEX: 0 as any,
    EHNG: 0 as any,
    EHCSA: 0 as any,
    EHCRi: 0 as any,
    EHACi: 0 as any,
    EHCi: 0 as any,
    EHEXi: 0 as any,
    EHNGi: 0 as any,
    EHEXG: 0 as any,
    EHCRcompare: 0 as any,
    EHACcompare: 0 as any,
    EHCCAcompare: 0 as any,
    EHEXcompare: 0 as any,
    EHNGcompare: 0 as any,
    EHCSAcompare: 0 as any,
    EHCRicompare: 0 as any,
    EHACicompare: 0 as any,
    EHCicompare: 0 as any,
    EHEXicompare: 0 as any,
    EHNGicompare: 0 as any,
    EHEXGcompare: 0 as any
  })
  const [finalAvg, setFinalAvg] = useState({
    EHCR: 0 as any,
    EHAC: 0 as any,
    EHCCA: 0 as any,
    EHEX: 0 as any,
    EHNG: 0 as any,
    EHCSA: 0 as any,
    EHCRi: 0 as any,
    EHACi: 0 as any,
    EHCi: 0 as any,
    EHEXi: 0 as any,
    EHNGi: 0 as any,
    EHEXG: 0 as any,
    EHCRcompare: 0 as any,
    EHACcompare: 0 as any,
    EHCCAcompare: 0 as any,
    EHEXcompare: 0 as any,
    EHNGcompare: 0 as any,
    EHCSAcompare: 0 as any,
    EHCRicompare: 0 as any,
    EHACicompare: 0 as any,
    EHCicompare: 0 as any,
    EHEXicompare: 0 as any,
    EHNGicompare: 0 as any,
    EHEXGcompare: 0 as any
  })
  const [finalMin, setFinalMin] = useState({
    EHCR: 100000000 as any,
    EHAC: 100000000 as any,
    EHCCA: 100000000 as any,
    EHEX: 100000000 as any,
    EHNG: 100000000 as any,
    EHCSA: 100000000 as any,
    EHCRi: 100000000 as any,
    EHACi: 100000000 as any,
    EHCi: 100000000 as any,
    EHEXi: 100000000 as any,
    EHNGi: 100000000 as any,
    EHEXG: 100000000 as any,
    EHCRcompare: 100000000 as any,
    EHACcompare: 100000000 as any,
    EHCCAcompare: 100000000 as any,
    EHEXcompare: 100000000 as any,
    EHNGcompare: 100000000 as any,
    EHCSAcompare: 100000000 as any,
    EHCRicompare: 100000000 as any,
    EHACicompare: 100000000 as any,
    EHCicompare: 100000000 as any,
    EHEXicompare: 100000000 as any,
    EHNGicompare: 100000000 as any,
    EHEXGcompare: 100000000 as any
  })

  //usaremos insertValues como funcion para introducir los valores en las variables
  const insertValues = (value: any, values: any, labelAux: any) => {
    let day = new Date(labelAux[2], labelAux[1] - 1, labelAux[0]).getDay() - 1
    if (day === -1) { day = 6 }

    if (consumptionsFilters.granularity === 'S') {
      value && values.splice(day, 1, parseFloat(value.replace(',', '.')))
    } /*else if (consumptionsFilters.granularity === 'D') {
      value && values.splice(labelAux[1] - 1, 1, parseFloat(value.replace(',', '.')))
    }*/ else {
      values.push(parseFloat(value.replace(',', '.')))
    }
  }

  //usaremos pushinsertValues como funcion para introducir los valores en las variables
  const insertPushValues = (value: any, values: any, labelAux: any) => {
    let day = new Date(labelAux[2], labelAux[1] - 1, labelAux[0]).getDay() - 1
    if (day === -1) { day = 6 }

    if (consumptionsFilters.granularity === 'S') {
      value && values.splice(day, 1, 0.0000001)
    } /*else if (consumptionsFilters.granularity === 'D') {
      value && values.splice(labelAux[1] - 1, 1, 0.0000001)
    }*/ else {
      values.push(0.0000001)
    }
  }

  /*const daysInMonth = (month: any, year: any) => {
    return new Date(year, month, 0).getDate()
  }*/

  const chartData = (canvas: any) => {

    let labels = [] as any

    // Caso de prueba 1
    let valuesEHCR = []
    let valuesEHAC = []
    let valuesEHCCA = []
    let valuesEHEX = []
    let valuesEHNG = []
    let valuesEHCSA = []
    //Caso de prueba 2
    let valuesEHCRi = []
    let valuesEHACi = []
    let valuesEHCi = []
    let valuesEHEXi = []
    let valuesEHNGi = []
    let valuesEHEXG = []
    // Caso de prueba 1 compare
    let valuesEHCRcompare = []
    let valuesEHACcompare = []
    let valuesEHCCAcompare = []
    let valuesEHEXcompare = []
    let valuesEHNGcompare = []
    let valuesEHCSAcompare = []
    //Caso de prueba 2 compare
    let valuesEHCRicompare = []
    let valuesEHACicompare = []
    let valuesEHCicompare = []
    let valuesEHEXicompare = []
    let valuesEHNGicompare = []
    let valuesEHEXGcompare = []

    //En caso de estar viendo semanas le damos las posiciones iniciales a los arrays que contendrán los valores a mostrar
    if (consumptionsFilters.granularity === 'S') {
      labels = getWeekDays()
      // labels = [t('supplies.suppliesDetails.components.consumption.charts.week.lunes'), t('supplies.suppliesDetails.components.consumption.charts.week.martes'), t('supplies.suppliesDetails.components.consumption.charts.week.miercoles'), t('supplies.suppliesDetails.components.consumption.charts.week.jueves'), t('supplies.suppliesDetails.components.consumption.charts.week.viernes'), t('supplies.suppliesDetails.components.consumption.charts.week.sabado'), t('supplies.suppliesDetails.components.consumption.charts.week.domingo')]
      valuesEHCRi = ['', '', '', '', '', '', '']
      valuesEHACi = ['', '', '', '', '', '', '']
      valuesEHCi = ['', '', '', '', '', '', '']
      valuesEHEXi = ['', '', '', '', '', '', '']
      valuesEHNGi = ['', '', '', '', '', '', '']
      valuesEHEXG = ['', '', '', '', '', '', '']
      valuesEHCR = ['', '', '', '', '', '', '']
      valuesEHAC = ['', '', '', '', '', '', '']
      valuesEHCCA = ['', '', '', '', '', '', '']
      valuesEHEX = ['', '', '', '', '', '', '']
      valuesEHNG = ['', '', '', '', '', '', '']
      valuesEHCSA = ['', '', '', '', '', '', '']
      valuesEHCRicompare = ['', '', '', '', '', '', '']
      valuesEHACicompare = ['', '', '', '', '', '', '']
      valuesEHCicompare = ['', '', '', '', '', '', '']
      valuesEHEXicompare = ['', '', '', '', '', '', '']
      valuesEHNGicompare = ['', '', '', '', '', '', '']
      valuesEHEXGcompare = ['', '', '', '', '', '', '']
      valuesEHCRcompare = ['', '', '', '', '', '', '']
      valuesEHACcompare = ['', '', '', '', '', '', '']
      valuesEHCCAcompare = ['', '', '', '', '', '', '']
      valuesEHEXcompare = ['', '', '', '', '', '', '']
      valuesEHNGcompare = ['', '', '', '', '', '', '']
      valuesEHCSAcompare = ['', '', '', '', '', '', '']
    } /*else if (consumptionsFilters.granularity === 'D') {
      let labelAux = consumptionsFilters.startDate.split('/')
      let days = daysInMonth(labelAux[1], labelAux[2])

      for (let i = 0; i < days; i++) {
        valuesEHCRi.push(0.0000001)
        valuesEHACi.push(0.0000001)
        valuesEHCi.push(0.0000001)
        valuesEHEXi.push(0.0000001)
        valuesEHNGi.push(0.0000001)
        valuesEHEXG.push(0.0000001)
        valuesEHCR.push(0.0000001)
        valuesEHAC.push(0.0000001)
        valuesEHCCA.push(0.0000001)
        valuesEHEX.push(0.0000001)
        valuesEHNG.push(0.0000001)
        valuesEHCSA.push(0.0000001)
        valuesEHCRicompare.push(0.0000001)
        valuesEHACicompare.push(0.0000001)
        valuesEHCicompare.push(0.0000001)
        valuesEHEXicompare.push(0.0000001)
        valuesEHNGicompare.push(0.0000001)
        valuesEHEXGcompare.push(0.0000001)
        valuesEHCRcompare.push(0.0000001)
        valuesEHACcompare.push(0.0000001)
        valuesEHCCAcompare.push(0.0000001)
        valuesEHEXcompare.push(0.0000001)
        valuesEHNGcompare.push(0.0000001)
        valuesEHCSAcompare.push(0.0000001)
      }
    }*/

    if (supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' && currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0) {

      let dayCounter = 1
      finalSum.EHCR = 0
      finalSum.EHAC = 0
      finalSum.EHCCA = 0
      finalSum.EHEX = 0
      finalSum.EHNG = 0
      finalSum.EHCSA = 0
      finalSum.EHCRi = 0
      finalSum.EHACi = 0
      finalSum.EHCi = 0
      finalSum.EHEXi = 0
      finalSum.EHNGi = 0
      finalSum.EHEXG = 0

      contadorEHCR = 0
      contadorEHAC = 0
      contadorEHCCA = 0
      contadorEHEX = 0
      contadorEHNG = 0
      contadorEHCSA = 0
      contadorEHCRi = 0
      contadorEHACi = 0
      contadorEHCi = 0
      contadorEHEXi = 0
      contadorEHNGi = 0
      contadorEHEXG = 0
      currentSupplyConsumptions.map(
        (item) => {
          let labelAux = item.date && item.date.split('/')
          /*if (item.date) {
            labelAux = item.date.split('/')
          }*/
          //Tenemos que coger los valores que nos lleguen indistintamente de cualquier esquema
          if (item.EHCR) {
            if (item.EHCR !== '') {
              insertValues(item.EHCR, valuesEHCR, labelAux)
              finalSum.EHCR += parseFloat(item.EHCR.replace(',', '.'))
              if (parseFloat(item.EHCR.replace(',', '.')) > finalMax.EHCR) {
                finalMax.EHCR = parseFloat(item.EHCR.replace(',', '.'))
              }
              if (parseFloat(item.EHCR.replace(',', '.')) < finalMin.EHCR) {
                finalMin.EHCR = parseFloat(item.EHCR.replace(',', '.'))
              }
              contadorEHCR++
              if (!containValue.EHCR) {
                setContainValue({
                  ...containValue,
                  EHCR: true
                })
              }
            } else {
              insertPushValues(item.EHCR, valuesEHCR, labelAux)
            }
          } else {
            insertPushValues(item.EHCR, valuesEHCR, labelAux)
          }

          if (item.EHAC) {
            if (item.EHAC !== '') {
              insertValues(item.EHAC, valuesEHAC, labelAux)
              finalSum.EHAC += parseFloat(item.EHAC.replace(',', '.'))
              if (parseFloat(item.EHAC.replace(',', '.')) > finalMax.EHAC) {
                finalMax.EHAC = parseFloat(item.EHAC.replace(',', '.'))
              }
              if (parseFloat(item.EHAC.replace(',', '.')) < finalMin.EHAC) {
                finalMin.EHAC = parseFloat(item.EHAC.replace(',', '.'))
              }
              contadorEHAC++
              if (!containValue.EHAC) {
                setContainValue({
                  ...containValue,
                  EHAC: true
                })
              }
            } else {
              insertPushValues(item.EHAC, valuesEHAC, labelAux)
            }
          } else {
            insertPushValues(item.EHAC, valuesEHAC, labelAux)
          }

          if (item.EHCCA) {
            if (item.EHCCA !== '') {
              insertValues(item.EHCCA, valuesEHCCA, labelAux)
              finalSum.EHCCA += parseFloat(item.EHCCA.replace(',', '.'))
              if (parseFloat(item.EHCCA.replace(',', '.')) > finalMax.EHCCA) {
                finalMax.EHCCA = parseFloat(item.EHCCA.replace(',', '.'))
              }
              if (parseFloat(item.EHCCA.replace(',', '.')) < finalMin.EHCCA) {
                finalMin.EHCCA = parseFloat(item.EHCCA.replace(',', '.'))
              }
              contadorEHCCA++
              if (!containValue.EHCCA) {
                setContainValue({
                  ...containValue,
                  EHCCA: true
                })
              }
            } else {
              insertPushValues(item.EHCCA, valuesEHCCA, labelAux)
            }
          } else {
            insertPushValues(item.EHCCA, valuesEHCCA, labelAux)
          }

          if (item.EHEX) {
            if (item.EHEX !== '') {
              insertValues(item.EHEX, valuesEHEX, labelAux)
              finalSum.EHEX += parseFloat(item.EHEX.replace(',', '.'))
              if (parseFloat(item.EHEX.replace(',', '.')) > finalMax.EHEX) {
                finalMax.EHEX = parseFloat(item.EHEX.replace(',', '.'))
              }
              if (parseFloat(item.EHEX.replace(',', '.')) < finalMin.EHEX) {
                finalMin.EHEX = parseFloat(item.EHEX.replace(',', '.'))
              }
              contadorEHEX++
              if (!containValue.EHEX) {
                setContainValue({
                  ...containValue,
                  EHEX: true
                })
              }
            } else {
              insertPushValues(item.EHEX, valuesEHEX, labelAux)
            }
          } else {
            insertPushValues(item.EHEX, valuesEHEX, labelAux)
          }

          if (item.EHNG) {
            if (item.EHNG !== '') {
              insertValues(item.EHNG, valuesEHNG, labelAux)
              finalSum.EHNG += parseFloat(item.EHNG.replace(',', '.'))
              if (parseFloat(item.EHNG.replace(',', '.')) > finalMax.EHNG) {
                finalMax.EHNG = parseFloat(item.EHNG.replace(',', '.'))
              }
              if (parseFloat(item.EHNG.replace(',', '.')) < finalMin.EHNG) {
                finalMin.EHNG = parseFloat(item.EHNG.replace(',', '.'))
              }
              contadorEHNG++
              if (!containValue.EHNG) {
                setContainValue({
                  ...containValue,
                  EHNG: true
                })
              }
            } else {
              insertPushValues(item.EHNG, valuesEHNG, labelAux)
            }
          } else {
            insertPushValues(item.EHNG, valuesEHNG, labelAux)
          }

          if (item.EHCRi) {
            if (item.EHCRi !== '') {
              insertValues(item.EHCRi, valuesEHCRi, labelAux)
              finalSum.EHCRi += parseFloat(item.EHCRi.replace(',', '.'))
              if (parseFloat(item.EHCRi.replace(',', '.')) > finalMax.EHCRi) {
                finalMax.EHCRi = parseFloat(item.EHCRi.replace(',', '.'))
              }
              if (parseFloat(item.EHCRi.replace(',', '.')) < finalMin.EHCRi) {
                finalMin.EHCRi = parseFloat(item.EHCRi.replace(',', '.'))
              }
              contadorEHCRi++
              if (!containValue.EHCRi) {
                setContainValue({
                  ...containValue,
                  EHCRi: true
                })
              }
            } else {
              insertPushValues(item.EHCRi, valuesEHCRi, labelAux)
            }
          } else {
            insertPushValues(item.EHCRi, valuesEHCRi, labelAux)
          }

          if (item.EHACi) {
            if (item.EHACi !== '') {
              insertValues(item.EHACi, valuesEHACi, labelAux)
              finalSum.EHACi += parseFloat(item.EHACi.replace(',', '.'))
              if (parseFloat(item.EHACi.replace(',', '.')) > finalMax.EHACi) {
                finalMax.EHACi = parseFloat(item.EHACi.replace(',', '.'))
              }
              if (parseFloat(item.EHACi.replace(',', '.')) < finalMin.EHACi) {
                finalMin.EHACi = parseFloat(item.EHACi.replace(',', '.'))
              }
              contadorEHACi++
              if (!containValue.EHACi) {
                setContainValue({
                  ...containValue,
                  EHACi: true
                })
              }
            } else {
              insertPushValues(item.EHACi, valuesEHACi, labelAux)
            }
          } else {
            insertPushValues(item.EHACi, valuesEHACi, labelAux)
          }

          if (item.EHCi) {
            if (item.EHCi !== '') {
              insertValues(item.EHCi, valuesEHCi, labelAux)
              finalSum.EHCi += parseFloat(item.EHCi.replace(',', '.'))
              if (parseFloat(item.EHCi.replace(',', '.')) > finalMax.EHCi) {
                finalMax.EHCi = parseFloat(item.EHCi.replace(',', '.'))
              }
              if (parseFloat(item.EHCi.replace(',', '.')) < finalMin.EHCi) {
                finalMin.EHCi = parseFloat(item.EHCi.replace(',', '.'))
              }
              contadorEHCi++
              if (!containValue.EHCi) {
                setContainValue({
                  ...containValue,
                  EHCi: true
                })
              }
            } else {
              insertPushValues(item.EHCi, valuesEHCi, labelAux)
            }
          } else {
            insertPushValues(item.EHCi, valuesEHCi, labelAux)
          }

          if (item.EHEXi) {
            if (item.EHEXi !== '') {
              insertValues(item.EHEXi, valuesEHEXi, labelAux)
              finalSum.EHEXi += parseFloat(item.EHEXi.replace(',', '.'))
              if (parseFloat(item.EHEXi.replace(',', '.')) > finalMax.EHEXi) {
                finalMax.EHEXi = parseFloat(item.EHEXi.replace(',', '.'))
              }
              if (parseFloat(item.EHEXi.replace(',', '.')) < finalMin.EHEXi) {
                finalMin.EHEXi = parseFloat(item.EHEXi.replace(',', '.'))
              }
              contadorEHEXi++
              if (!containValue.EHEXi) {
                setContainValue({
                  ...containValue,
                  EHEXi: true
                })
              }
            } else {
              insertPushValues(item.EHEXi, valuesEHEXi, labelAux)
            }
          } else {
            insertPushValues(item.EHEXi, valuesEHEXi, labelAux)
          }

          if (item.EHNGi) {
            if (item.EHNGi !== '') {
              insertValues(item.EHNGi, valuesEHNGi, labelAux)
              finalSum.EHNGi += parseFloat(item.EHNGi.replace(',', '.'))
              if (parseFloat(item.EHNGi.replace(',', '.')) > finalMax.EHNGi) {
                finalMax.EHNGi = parseFloat(item.EHNGi.replace(',', '.'))
              }
              if (parseFloat(item.EHNGi.replace(',', '.')) < finalMin.EHNGi) {
                finalMin.EHNGi = parseFloat(item.EHNGi.replace(',', '.'))
              }
              contadorEHNGi++
              if (!containValue.EHNGi) {
                setContainValue({
                  ...containValue,
                  EHNGi: true
                })
              }
            } else {
              insertPushValues(item.EHNGi, valuesEHNGi, labelAux)
            }
          } else {
            insertPushValues(item.EHNGi, valuesEHNGi, labelAux)
          }

          if (item.EHCSA) {
            if (item.EHCSA !== '') {
              insertValues(item.EHCSA, valuesEHCSA, labelAux)
              finalSum.EHCSA += parseFloat(item.EHCSA.replace(',', '.'))
              if (parseFloat(item.EHCSA.replace(',', '.')) > finalMax.EHCSA) {
                finalMax.EHCSA = parseFloat(item.EHCSA.replace(',', '.'))
              }
              if (parseFloat(item.EHCSA.replace(',', '.')) < finalMin.EHCSA) {
                finalMin.EHCSA = parseFloat(item.EHCSA.replace(',', '.'))
              }
              contadorEHCSA++
              if (!containValue.EHCSA) {
                setContainValue({
                  ...containValue,
                  EHCSA: true
                })
              }
            } else {
              insertPushValues(item.EHCSA, valuesEHCSA, labelAux)
            }
          } else {
            insertPushValues(item.EHCSA, valuesEHCSA, labelAux)
          }

          if (item.EHEXG) {
            if (item.EHEXG !== '') {
              insertValues(item.EHEXG, valuesEHEXG, labelAux)
              finalSum.EHEXG += parseFloat(item.EHEXG.replace(',', '.'))
              if (parseFloat(item.EHEXG.replace(',', '.')) > finalMax.EHEXG) {
                finalMax.EHEXG = parseFloat(item.EHEXG.replace(',', '.'))
              }
              if (parseFloat(item.EHEXG.replace(',', '.')) < finalMin.EHEXG) {
                finalMin.EHEXG = parseFloat(item.EHEXG.replace(',', '.'))
              }
              contadorEHEXG++
              if (!containValue.EHEXG) {
                setContainValue({
                  ...containValue,
                  EHEXG: true
                })
              }
            } else {
              insertPushValues(item.EHEXG, valuesEHEXG, labelAux)
            }
          } else {
            insertPushValues(item.EHEXG, valuesEHEXG, labelAux)
          }
          // Mejora evitando duplicación bloques if
          // Se evalúa el valor de consumptionsFilters.granularity y ejecuta el bloque correspondiente basado en su valor.
          switch (consumptionsFilters.granularity) {
            case 'D': {
              if (item.date) {
                const formattedDate = formatDay(item.date);
                labels.push(formattedDate);
              } else {
                labels.push(dayCounter);
              }
              dayCounter++;
              break;
            }
            case 'M': {
              if (item.date) {
                labels.push(formatMonth(labelAux[1].toString()) + ' ' + labelAux[2].toString());
              }
              break;
            }
            case 'H': {
              labels.push(item.hour + ':00');
              break;
            }
            default: {
              // Manejar el caso en que la granularidad no es válida si es necesario
              break;
            }
          }

        }
      )
    }

    if (supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' && currentCompareConsumptions && !currentCompareConsumptions.consumptions && currentCompareConsumptions.length !== 0) {

      let dayCounter = 1

      finalSum.EHCRcompare = 0
      finalSum.EHACcompare = 0
      finalSum.EHCCAcompare = 0
      finalSum.EHEXcompare = 0
      finalSum.EHNGcompare = 0
      finalSum.EHCSAcompare = 0
      finalSum.EHCRicompare = 0
      finalSum.EHACicompare = 0
      finalSum.EHCicompare = 0
      finalSum.EHEXicompare = 0
      finalSum.EHNGicompare = 0
      finalSum.EHEXGcompare = 0

      contadorEHCRcompare = 0
      contadorEHACcompare = 0
      contadorEHCCAcompare = 0
      contadorEHEXcompare = 0
      contadorEHNGcompare = 0
      contadorEHCSAcompare = 0
      contadorEHCRicompare = 0
      contadorEHACicompare = 0
      contadorEHCicompare = 0
      contadorEHEXicompare = 0
      contadorEHNGicompare = 0
      contadorEHEXGcompare = 0

      currentCompareConsumptions.map(
        (item) => {
          let labelAux = []
          if (item.date) {
            labelAux = item.date.split('/')
          }
          //Tenemos que coger los valores que nos lleguen indistintamente de cualquier esquema
          if (item.EHCR) {
            if (item.EHCR !== '') {
              insertValues(item.EHCR, valuesEHCRcompare, labelAux)
              finalSum.EHCRcompare += parseFloat(item.EHCR.replace(',', '.'))
              if (parseFloat(item.EHCR.replace(',', '.')) > finalMax.EHCRcompare) {
                finalMax.EHCRcompare = parseFloat(item.EHCR.replace(',', '.'))
              }
              if (parseFloat(item.EHCR.replace(',', '.')) < finalMin.EHCRcompare) {
                finalMin.EHCRcompare = parseFloat(item.EHCR.replace(',', '.'))
              }
              contadorEHCRcompare++
              if (!containValue.EHCR) {
                setContainValue({
                  ...containValue,
                  EHCR: true
                })
              }
            } else {
              insertPushValues(item.EHCR, valuesEHCRcompare, labelAux)
            }
          } else {
            insertPushValues(item.EHCR, valuesEHCRcompare, labelAux)
          }

          if (item.EHAC) {
            if (item.EHAC !== '') {
              insertValues(item.EHAC, valuesEHACcompare, labelAux)
              finalSum.EHACcompare += parseFloat(item.EHAC.replace(',', '.'))
              if (parseFloat(item.EHAC.replace(',', '.')) > finalMax.EHACcompare) {
                finalMax.EHACcompare = parseFloat(item.EHAC.replace(',', '.'))
              }
              if (parseFloat(item.EHAC.replace(',', '.')) < finalMin.EHACcompare) {
                finalMin.EHACcompare = parseFloat(item.EHAC.replace(',', '.'))
              }
              contadorEHACcompare++
              if (!containValue.EHAC) {
                setContainValue({
                  ...containValue,
                  EHAC: true
                })
              }
            } else {
              insertPushValues(item.EHAC, valuesEHACcompare, labelAux)
            }
          } else {
            insertPushValues(item.EHAC, valuesEHACcompare, labelAux)
          }

          if (item.EHCCA) {
            if (item.EHCCA !== '') {
              insertValues(item.EHCCA, valuesEHCCAcompare, labelAux)
              finalSum.EHCCAcompare += parseFloat(item.EHCCA.replace(',', '.'))
              if (parseFloat(item.EHCCA.replace(',', '.')) > finalMax.EHCCAcompare) {
                finalMax.EHCCAcompare = parseFloat(item.EHCCA.replace(',', '.'))
              }
              if (parseFloat(item.EHCCA.replace(',', '.')) < finalMin.EHCCAcompare) {
                finalMin.EHCCAcompare = parseFloat(item.EHCCA.replace(',', '.'))
              }
              contadorEHCCAcompare++
              if (!containValue.EHCCA) {
                setContainValue({
                  ...containValue,
                  EHCCA: true
                })
              }
            } else {
              insertPushValues(item.EHCCA, valuesEHCCAcompare, labelAux)
            }
          } else {
            insertPushValues(item.EHCCA, valuesEHCCAcompare, labelAux)
          }

          if (item.EHEX) {
            if (item.EHEX !== '') {
              insertValues(item.EHEX, valuesEHEXcompare, labelAux)
              finalSum.EHEXcompare += parseFloat(item.EHEX.replace(',', '.'))
              if (parseFloat(item.EHEX.replace(',', '.')) > finalMax.EHEXcompare) {
                finalMax.EHEXcompare = parseFloat(item.EHEX.replace(',', '.'))
              }
              if (parseFloat(item.EHEX.replace(',', '.')) < finalMin.EHEXcompare) {
                finalMin.EHEXcompare = parseFloat(item.EHEX.replace(',', '.'))
              }
              contadorEHEXcompare++
              if (!containValue.EHEX) {
                setContainValue({
                  ...containValue,
                  EHEX: true
                })
              }
            } else {
              insertPushValues(item.EHEX, valuesEHEXcompare, labelAux)
            }
          } else {
            insertPushValues(item.EHEX, valuesEHEXcompare, labelAux)
          }

          if (item.EHNG) {
            if (item.EHNG !== '') {
              insertValues(item.EHNG, valuesEHNGcompare, labelAux)
              finalSum.EHNGcompare += parseFloat(item.EHNG.replace(',', '.'))
              if (parseFloat(item.EHNG.replace(',', '.')) > finalMax.EHNGcompare) {
                finalMax.EHNGcompare = parseFloat(item.EHNG.replace(',', '.'))
              }
              if (parseFloat(item.EHNG.replace(',', '.')) < finalMin.EHNGcompare) {
                finalMin.EHNGcompare = parseFloat(item.EHNG.replace(',', '.'))
              }
              contadorEHNGcompare++
              if (!containValue.EHNG) {
                setContainValue({
                  ...containValue,
                  EHNG: true
                })
              }
            } else {
              insertPushValues(item.EHNG, valuesEHNGcompare, labelAux)
            }
          } else {
            insertPushValues(item.EHNG, valuesEHNGcompare, labelAux)
          }

          if (item.EHCRi) {
            if (item.EHCRi !== '') {
              insertValues(item.EHCRi, valuesEHCRicompare, labelAux)
              finalSum.EHCRicompare += parseFloat(item.EHCRi.replace(',', '.'))
              if (parseFloat(item.EHCRi.replace(',', '.')) > finalMax.EHCRicompare) {
                finalMax.EHCRicompare = parseFloat(item.EHCRi.replace(',', '.'))
              }
              if (parseFloat(item.EHCRi.replace(',', '.')) < finalMin.EHCRicompare) {
                finalMin.EHCRicompare = parseFloat(item.EHCRi.replace(',', '.'))
              }
              contadorEHCRicompare++
              if (!containValue.EHCRi) {
                setContainValue({
                  ...containValue,
                  EHCRi: true
                })
              }
            } else {
              insertPushValues(item.EHCRi, valuesEHCRicompare, labelAux)
            }
          } else {
            insertPushValues(item.EHCRi, valuesEHCRicompare, labelAux)
          }

          if (item.EHACi) {
            if (item.EHACi !== '') {
              insertValues(item.EHACi, valuesEHACicompare, labelAux)
              finalSum.EHACicompare += parseFloat(item.EHACi.replace(',', '.'))
              if (parseFloat(item.EHACi.replace(',', '.')) > finalMax.EHACicompare) {
                finalMax.EHACicompare = parseFloat(item.EHACi.replace(',', '.'))
              }
              if (parseFloat(item.EHACi.replace(',', '.')) < finalMin.EHACicompare) {
                finalMin.EHACicompare = parseFloat(item.EHACi.replace(',', '.'))
              }
              contadorEHACicompare++
              if (!containValue.EHACi) {
                setContainValue({
                  ...containValue,
                  EHACi: true
                })
              }
            } else {
              insertPushValues(item.EHACi, valuesEHACicompare, labelAux)
            }
          } else {
            insertPushValues(item.EHACi, valuesEHACicompare, labelAux)
          }

          if (item.EHCi) {
            if (item.EHCi !== '') {
              insertValues(item.EHCi, valuesEHCicompare, labelAux)
              finalSum.EHCicompare += parseFloat(item.EHCi.replace(',', '.'))
              if (parseFloat(item.EHCi.replace(',', '.')) > finalMax.EHCicompare) {
                finalMax.EHCicompare = parseFloat(item.EHCi.replace(',', '.'))
              }
              if (parseFloat(item.EHCi.replace(',', '.')) < finalMin.EHCicompare) {
                finalMin.EHCicompare = parseFloat(item.EHCi.replace(',', '.'))
              }
              contadorEHCicompare++
              if (!containValue.EHCi) {
                setContainValue({
                  ...containValue,
                  EHCi: true
                })
              }
            } else {
              insertPushValues(item.EHCi, valuesEHCicompare, labelAux)
            }
          } else {
            insertPushValues(item.EHCi, valuesEHCicompare, labelAux)
          }

          if (item.EHEXi) {
            if (item.EHEXi !== '') {
              insertValues(item.EHEXi, valuesEHEXicompare, labelAux)
              finalSum.EHEXicompare += parseFloat(item.EHEXi.replace(',', '.'))
              if (parseFloat(item.EHEXi.replace(',', '.')) > finalMax.EHEXicompare) {
                finalMax.EHEXicompare = parseFloat(item.EHEXi.replace(',', '.'))
              }
              if (parseFloat(item.EHEXi.replace(',', '.')) < finalMin.EHEXicompare) {
                finalMin.EHEXicompare = parseFloat(item.EHEXi.replace(',', '.'))
              }
              contadorEHEXicompare++
              if (!containValue.EHEXi) {
                setContainValue({
                  ...containValue,
                  EHEXi: true
                })
              }
            } else {
              insertPushValues(item.EHEXi, valuesEHEXicompare, labelAux)
            }
          } else {
            insertPushValues(item.EHEXi, valuesEHEXicompare, labelAux)
          }

          if (item.EHNGi) {
            if (item.EHNGi !== '') {
              insertValues(item.EHNGi, valuesEHNGicompare, labelAux)
              finalSum.EHNGicompare += parseFloat(item.EHNGi.replace(',', '.'))
              if (parseFloat(item.EHNGi.replace(',', '.')) > finalMax.EHNGicompare) {
                finalMax.EHNGicompare = parseFloat(item.EHNGi.replace(',', '.'))
              }
              if (parseFloat(item.EHNGi.replace(',', '.')) < finalMin.EHNGicompare) {
                finalMin.EHNGicompare = parseFloat(item.EHNGi.replace(',', '.'))
              }
              contadorEHNGicompare++
              if (!containValue.EHNGi) {
                setContainValue({
                  ...containValue,
                  EHNGi: true
                })
              }
            } else {
              insertPushValues(item.EHNGi, valuesEHNGicompare, labelAux)
            }
          } else {
            insertPushValues(item.EHNGi, valuesEHNGicompare, labelAux)
          }

          if (item.EHCSA) {
            if (item.EHCSA !== '') {
              insertValues(item.EHCSA, valuesEHCSAcompare, labelAux)
              finalSum.EHCSAcompare += parseFloat(item.EHCSA.replace(',', '.'))
              if (parseFloat(item.EHCSA.replace(',', '.')) > finalMax.EHCSAcompare) {
                finalMax.EHCSAcompare = parseFloat(item.EHCSA.replace(',', '.'))
              }
              if (parseFloat(item.EHCSA.replace(',', '.')) < finalMin.EHCSAcompare) {
                finalMin.EHCSAcompare = parseFloat(item.EHCSA.replace(',', '.'))
              }
              contadorEHCSAcompare++
              if (!containValue.EHCSA) {
                setContainValue({
                  ...containValue,
                  EHCSA: true
                })
              }
            } else {
              insertPushValues(item.EHCSA, valuesEHCSAcompare, labelAux)
            }
          } else {
            insertPushValues(item.EHCSA, valuesEHCSAcompare, labelAux)
          }

          if (item.EHEXG) {
            if (item.EHEXG !== '') {
              insertValues(item.EHEXG, valuesEHEXGcompare, labelAux)
              finalSum.EHEXGcompare += parseFloat(item.EHEXG.replace(',', '.'))
              if (parseFloat(item.EHEXG.replace(',', '.')) > finalMax.EHEXGcompare) {
                finalMax.EHEXGcompare = parseFloat(item.EHEXG.replace(',', '.'))
              }
              if (parseFloat(item.EHEXG.replace(',', '.')) < finalMin.EHEXGcompare) {
                finalMin.EHEXGcompare = parseFloat(item.EHEXG.replace(',', '.'))
              }
              contadorEHEXGcompare++
              if (!containValue.EHEXG) {
                setContainValue({
                  ...containValue,
                  EHEXG: true
                })
              }
            } else {
              insertPushValues(item.EHEXG, valuesEHEXGcompare, labelAux)
            }
          } else {
            insertPushValues(item.EHEXG, valuesEHEXGcompare, labelAux)
          }
          
          if (consumptionsFilters.granularity === 'D' && labels.length < dayCounter) {
            labels.push(dayCounter)
          }
          dayCounter++
        }
      )
    }

    finalAvg.EHCR = finalSum.EHCR / contadorEHCR
    finalAvg.EHAC = finalSum.EHAC / contadorEHAC
    finalAvg.EHEX = finalSum.EHEX / contadorEHEX
    finalAvg.EHCSA = finalSum.EHCSA / contadorEHCSA
    finalAvg.EHNG = finalSum.EHNG / contadorEHNG
    finalAvg.EHCCA = finalSum.EHCCA / contadorEHCCA
    finalAvg.EHCRi = finalSum.EHCRi / contadorEHCRi
    finalAvg.EHACi = finalSum.EHACi / contadorEHACi
    finalAvg.EHCi = finalSum.EHCi / contadorEHCi
    finalAvg.EHEXi = finalSum.EHEXi / contadorEHEXi
    finalAvg.EHNGi = finalSum.EHNGi / contadorEHNGi
    finalAvg.EHEXG = finalSum.EHEXG / contadorEHEXG

    finalAvg.EHCRcompare = finalSum.EHCRcompare / contadorEHCRcompare
    finalAvg.EHACcompare = finalSum.EHACcompare / contadorEHACcompare
    finalAvg.EHEXcompare = finalSum.EHEXcompare / contadorEHEXcompare
    finalAvg.EHCSAcompare = finalSum.EHCSAcompare / contadorEHCSAcompare
    finalAvg.EHNGcompare = finalSum.EHNGcompare / contadorEHNGcompare
    finalAvg.EHCCAcompare = finalSum.EHCCAcompare / contadorEHCCAcompare
    finalAvg.EHCRicompare = finalSum.EHCRicompare / contadorEHCRicompare
    finalAvg.EHACicompare = finalSum.EHACicompare / contadorEHACicompare
    finalAvg.EHCicompare = finalSum.EHCicompare / contadorEHCicompare
    finalAvg.EHEXicompare = finalSum.EHEXicompare / contadorEHEXicompare
    finalAvg.EHNGicompare = finalSum.EHNGicompare / contadorEHNGicompare
    finalAvg.EHEXGcompare = finalSum.EHEXGcompare / contadorEHEXGcompare

    const data = [
      {
        label: 'EHCR',
        fill: false,
        borderColor: '#009aa6',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHCR && containValue.EHCR && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHCR,
        backgroundColor: '#009aa6'
      },
      {
        label: 'EHAC',
        fill: false,
        borderColor: '#a2ad00',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHAC && containValue.EHAC && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHAC,
        backgroundColor: '#a2ad00'
      },
      {
        label: 'EHCCA',
        fill: false,
        borderColor: '#0066cc',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHCCA && containValue.EHCCA && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHCCA,
        backgroundColor: '#0066cc'
      },
      {
        label: 'EHEX',
        fill: false,
        borderColor: '#e57200',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHEX && containValue.EHEX && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHEX,
        backgroundColor: '#e57200'
      },
      {
        label: 'EHNG',
        fill: false,
        borderColor: '#004571',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHNG && containValue.EHNG && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHNG,
        backgroundColor: '#004571'
      },
      {
        label: 'EHCSA',
        fill: false,
        borderColor: '#bb6bd9',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHCSA && containValue.EHCSA && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHCSA,
        backgroundColor: '#bb6bd9'
      },
      {
        label: 'EHCRi',
        fill: false,
        borderColor: '#d7af05',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHCRi && containValue.EHCRi && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHCRi,
        backgroundColor: '#d7af05'
      },
      {
        label: 'EHACi',
        fill: false,
        borderColor: '#6fcf97',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHACi && containValue.EHACi && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHACi,
        backgroundColor: '#6fcf97'
      },
      {
        label: 'EHCi',
        fill: false,
        borderColor: '#8217e5',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHCi && containValue.EHCi && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHCi,
        backgroundColor: '#8217e5'
      },
      {
        label: 'EHEXi',
        fill: false,
        borderColor: '#56ccf2',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHEXi && containValue.EHEXi && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHEXi,
        backgroundColor: '#56ccf2'
      },
      {
        label: 'EHNGi',
        fill: false,
        borderColor: '#b5474c',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHNGi && containValue.EHNGi && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHNGi,
        backgroundColor: '#b5474c'
      },
      {
        label: 'EHEXG',
        fill: false,
        borderColor: '#4e7e17',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHEXG && containValue.EHEXG && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHEXG,
        backgroundColor: '#4e7e17'
      },
      {
        label: 'EHCRcompare',
        fill: false,
        borderColor: '#009aa6',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHCR && containValue.EHCR && consumptionsFilters.compare === 'C') && valuesEHCRcompare,
        backgroundColor: '#009aa6',
        borderDash: [5],
        borderDashOffset: 5
      },
      {
        label: 'EHACcompare',
        fill: false,
        borderColor: '#a2ad00',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHAC && containValue.EHAC && consumptionsFilters.compare === 'C') && valuesEHACcompare,
        backgroundColor: '#a2ad00',
        borderDash: [5],
        borderDashOffset: 5
      },
      {
        label: 'EHCCAcompare',
        fill: false,
        borderColor: '#0066cc',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHCCA && containValue.EHCCA && consumptionsFilters.compare === 'C') && valuesEHCCAcompare,
        backgroundColor: '#0066cc',
        borderDash: [5],
        borderDashOffset: 5
      },
      {
        label: 'EHEXcompare',
        fill: false,
        borderColor: '#e57200',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHEX && containValue.EHEX && consumptionsFilters.compare === 'C') && valuesEHEXcompare,
        backgroundColor: '#e57200',
        borderDash: [5],
        borderDashOffset: 5
      },
      {
        label: 'EHNGcompare',
        fill: false,
        borderColor: '#004571',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHNG && containValue.EHNG && consumptionsFilters.compare === 'C') && valuesEHNGcompare,
        backgroundColor: '#004571',
        borderDash: [5],
        borderDashOffset: 5
      },
      {
        label: 'EHCSAcompare',
        fill: false,
        borderColor: '#bb6bd9',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHCSA && containValue.EHCSA && consumptionsFilters.compare === 'C') && valuesEHCSAcompare,
        backgroundColor: '#bb6bd9',
        borderDash: [5],
        borderDashOffset: 5
      },
      {
        label: 'EHCRicompare',
        fill: false,
        borderColor: '#d7af05',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHCRi && containValue.EHCRi && consumptionsFilters.compare === 'C') && valuesEHCRicompare,
        backgroundColor: '#d7af05',
        borderDash: [5],
        borderDashOffset: 5
      },
      {
        label: 'EHACicompare',
        fill: false,
        borderColor: '#6fcf97',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHACi && containValue.EHACi && consumptionsFilters.compare === 'C') && valuesEHACicompare,
        backgroundColor: '#6fcf97',
        borderDash: [5],
        borderDashOffset: 5
      },
      {
        label: 'EHCicompare',
        fill: false,
        borderColor: '#8217e5',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHCi && containValue.EHCi && consumptionsFilters.compare === 'C') && valuesEHCicompare,
        backgroundColor: '#8217e5',
        borderDash: [5],
        borderDashOffset: 5
      },
      {
        label: 'EHEXicompare',
        fill: false,
        borderColor: '#56ccf2',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHEXi && containValue.EHEXi && consumptionsFilters.compare === 'C') && valuesEHEXicompare,
        backgroundColor: '#56ccf2',
        borderDash: [5],
        borderDashOffset: 5
      },
      {
        label: 'EHNGicompare',
        fill: false,
        borderColor: '#b5474c',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHNGi && containValue.EHNGi && consumptionsFilters.compare === 'C') && valuesEHNGicompare,
        backgroundColor: '#b5474c',
        borderDash: [5],
        borderDashOffset: 5
      },
      {
        label: 'EHEXGcompare',
        fill: false,
        borderColor: '#4e7e17',
        borderWidth: 1,
        lineTension: 0,
        data: (state.checkedEHEXG && containValue.EHEXG && consumptionsFilters.compare === 'C') && valuesEHEXGcompare,
        backgroundColor: '#4e7e17',
        borderDash: [5],
        borderDashOffset: 5
      }
    ]
    
    for (let i = 0; i < data.length; i++) {
      if (data[i].data.length) {
        for (let j = data[i].data.length - 1; j >=0; j--) {
          if (data[i].data[j] === '') {
            data[i].data.splice(j, 1)
          }
        }
      }
    }

    return {
      labels: labels,
      datasets: data
    }
  }

  let missingValue = t('supplies.suppliesDetails.components.consumption.charts.graph.missingData')

  const chartOptions = {
    cornerRadius: 8,
    legend: {
      display: false
    },
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function (t, d) {
          if (t.datasetIndex === 0) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 1) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 2) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 3) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 4) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 5) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 6) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 7) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 8) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 9) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 10) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 11) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 12) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 13) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 14) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 15) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 16) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 17) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 18) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 19) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 20) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 21) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 22) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 23) {
            if (t.value === 'NaN' || t.value === '1e-7') {
              return missingValue
            } else {
              return (t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          }
        }
      }
    },
    scales: {
      xAxes: [{
        barPercentage: 0.3,
        gridLines: {
          display: false,
          stepsSize: 10
        },
        ticks: {
          fontColor: '#004571',
          fontSize: 11
        }
      }],
      yAxes: [{
        gridLines: {
          display: true,
          color: '#D8D8D8',
          borderDash: [12, 6]
        },
        ticks: {
          beginAtZero: true,
          stepsSize: 50,
          fontColor: '#004571',
          fontSize: 11,
          padding: 16,
          callback: function (label) {
            return label + ' kWh'
          }
        }
      }]
    }
    /*onClick: function (c, i) {
      if (i && i[0]) {
        //setDatesRange(i[0]._chart.data.labels[0])
        var elem = auxLabels[0].split('/')
        let auxIndex = parseInt(elem[1]) - 1
        let index = i[0]._index - auxIndex //El índice que viene del graph tiene dos posiciones más que los items del currentSupplyConsumption ya que hay meses vacíos delante
        let label = auxLabels[index]
        //let label = auxDates[index]

        setCurrentCompareConsumptions([])

        if (consumptionsFilters.granularity === 'M') {
          let startDate = new Date(formatDateHyphens(label))
          let endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)

          setIsLoading(true)

          setConsumptionsFilters({
            ...consumptionsFilters,
            granularity: 'D',
            startDate: label,
            endDate: formatDate(endDate)
          })
        }
        else if ((consumptionsFilters.granularity === 'D' || consumptionsFilters.granularity === 'S') && consumptionsFilters.compare === 'N') {
          setIsLoading(true)

          setConsumptionsFilters({
            ...consumptionsFilters,
            granularity: 'H',
            startDate: label,
            endDate: label,
            //compare: 'N'
          })
        }
      }
    }*/
  }

  const getWeekDays = () => {
		let weekDays = [] as any
		let fecha = new Date(completeDateWithSlash(consumptionsFilters.startDate + ' 00:00:00'))
		for(let i = 0; i < 7; i++){
			weekDays.push((formatDateAndHourStringWithBars(fecha).split(' '))[0])	
      fecha.setDate((fecha.getDate()+1))
		}
    return weekDays
	}
  return (
    <>
      <Grid container item md={12} className={classes.container}>

        <Line
          width={800}
          height={300}
          data={chartData}
          options={chartOptions}
        />

      </Grid>
      {autoConsumption === true && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0) &&
        <>
          <DynamicLegend
            state={state}
            setState={setState}
            containValue={containValue}
            compare={consumptionsFilters.compare === 'C' ? true : false}
            consumptionsFilters={consumptionsFilters}
          />
          <LegendSelfConsumption
            consumptionsFilters={consumptionsFilters}
            finalSum={finalSum}
            finalAvg={finalAvg}
            finalMax={finalMax}
            finalMin={finalMin}
            state={state}
            containValue={containValue}
            compare={consumptionsFilters.compare === 'C' ? true : false}
          />
        </>
      }
    </>
  )
}

export default LineGraph
