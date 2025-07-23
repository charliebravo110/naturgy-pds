import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Bar } from 'react-chartjs-2'
import 'chartjs-plugin-annotation'
import Grid from '@material-ui/core/Grid'

import NoConsumptionIcon from '../../../assets/icons/aviso_alerta_pop_up.svg'

import MensajeriaDynamicLegend from './mensajeriaDynamicLegend/MensajeriaDynamicLegend'

import {
  extractDateFromDateAndHourString,
  extractHourFromDateAndHourString
} from '../../../common/lib/FormatLib'

import useStyles from './MensajeriaGraph.styles'
import { BlobProvider } from '@react-pdf/renderer'

const MensajeriaGraph = (props: any) => {
  const classes = useStyles({})
  const {
    listItemsFiltered
  } = props

  const { t } = useTranslation()

  const [listItemsGraphFiltered, setListItemsGraphFiltered] = useState([] as any)
  const [graphFecha, setGraphFecha] = useState([] as any)
  const [graphTotalEnviados, setGraphTotalEnviados] = useState([] as any)
  const [graphEnviadosCorrectamente, setGraphEnviadosCorrectamente] = useState([] as any)
  const [graphRegistrados, setGraphRegistrados] = useState([] as any)
  const [averageTotalEnviados, setAverageTotalEnviados] = useState(0)
  const [averageEnviadosCorrectamente, setAverageEnviadosCorrectamente] = useState(0)
  const [averageRegistrados, setAverageRegistrados] = useState(0)

  const [totalUsersCheckbox, setTotalUsersCheckbox] = useState(true)
  const [correctlySentCheckbox, setCorrectlySentCheckbox] = useState(true)
  const [registeredCheckbox, setRegisteredCheckbox] = useState(true)

  const [graphOption, setGraphOption] = useState(1)

  const convertToMonthAndDay = (date) => {
    return date.substr(3, 7)
  }

  const translateMonthNumberToName = (date) => {

    const month = date.split('/')[0]
    const year = date.split('/')[1]
    let monthName = ''

    switch(month) {
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

    const result = monthName + ' ' + year
    return result
  }

  const colors = {
    darkBlue: '#1a587f',
    lightBlue: '#66c2c9',
    orange: '#e57200',
    darkBlueAverage: '#13415D',
    lightBlueAverage: '#4F9398',
    orangeAverage: '#B75B00',
  }

  const chartData = {
    labels: graphFecha,
    datasets: [
      {
        label: t('controlMensajeria.graph.totalSent'),
        data: totalUsersCheckbox ? graphTotalEnviados : [],
        backgroundColor: colors.darkBlue,
        // borderRadius: 10,
        // borderColor: 'black',
        // borderWidth: 2,
        // borderSkipped: false
      },
      {
        label: t('controlMensajeria.graph.sentCorrectly'),
        data: correctlySentCheckbox ? graphEnviadosCorrectamente : [],
        backgroundColor: colors.lightBlue,
        // borderRadius: 15,
        // borderColor: 'black',
        // borderWidth: 2,
        // borderSkipped: false
      },
      {
        label: t('controlMensajeria.graph.registeredUsers'),
        data: registeredCheckbox ? graphRegistrados : [],
        backgroundColor: colors.orange,
        // borderRadius: 20,
        // borderColor: 'black',
        // borderWidth: 2,
        // borderSkipped: false
      }
    ]
  }

  const chartOptions = {
    cornerRadius: 8,
    legend: {
      display: false,
      position: 'bottom'
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        // {
        //   labels: iconos
        //   ticks: {
        //     fontColor: '#004571',
        //     fontSize: 11
        //   }
        // },
        {
          // barPercentage: 0.3,
          // id: 'xAxis1',
          // type: 'category',
          // offset: true,
          gridLines: {
            display: false,
          },
          ticks: {
            fontColor: '#004571',
            fontSize: 11
          }
        }
      ],
      yAxes: [{
        gridLines: {
          display: true,
          color: '#D8D8D8',
          borderDash: [12, 6]
        },
        ticks: {
          beginAtZero: true,
          // max: maxYAxis + 2,
          stepsSize: 50,
          fontColor: '#004571',
          fontSize: 11,
          padding: 16,
          // callback: function (label) {
          //   return label + ' kW'
          // }
        }
      }]
    },
    annotation: {
      annotations: [
        (averageTotalEnviados > 0 && totalUsersCheckbox) &&
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: averageTotalEnviados,
          borderColor: colors.darkBlueAverage,
          borderWidth: 3,
          borderDash: [5],
          borderDashOffset: 5,
          // label: {
          //   content: t('controlMensajeria.graph.totalSent'),
          //   position: 'right',
          //   enabled: true,
          //   backgroundColor: colors.darkBlueAverage,
          //   fontColor: '#e0e2e2',
          //   fontStyle: 'normal',
          //   fontSize: 11,
          //   padding: 5,
          //   xAdjust: 0,
          //   cornerRadius: 10
          // },
        },
        (averageEnviadosCorrectamente > 0 && correctlySentCheckbox) &&
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: averageEnviadosCorrectamente,
          borderColor: colors.lightBlueAverage,
          borderWidth: 3,
          borderDash: [5],
          borderDashOffset: 5,
          // label: {
          //   content: t('controlMensajeria.graph.sentCorrectly'),
          //   position: 'right',
          //   enabled: true,
          //   backgroundColor: colors.lightBlueAverage,
          //   fontColor: '#e0e2e2',
          //   fontStyle: 'normal',
          //   fontSize: 11,
          //   padding: 5,
          //   xAdjust: 0,
          //   cornerRadius: 10
          // },
        },
        (averageRegistrados > 0 && registeredCheckbox) &&
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: averageRegistrados,
          borderColor: colors.orangeAverage,
          borderWidth: 3,
          borderDash: [5],
          borderDashOffset: 5,
          // label: {
          //   content: t('controlMensajeria.graph.registeredUsers'),
          //   position: 'right',
          //   enabled: true,
          //   backgroundColor: colors.orangeAverage,
          //   fontColor: '#e0e2e2',
          //   fontStyle: 'normal',
          //   fontSize: 11,
          //   padding: 5,
          //   xAdjust: 0,
          //   cornerRadius: 10
          // },
        }
      ]
    },

    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  }

  useEffect(() => {
    if (listItemsFiltered && listItemsFiltered.length > 0) {
      //  Copiamos y filtramos la lista de la tabla, eliminando los registros que no tengan fechaMsm
      let auxList = JSON.parse(JSON.stringify(listItemsFiltered))
      auxList = auxList.filter(item => item.fechaMsm && item.fechaMsm !== '')

      // [OPCIÓN "DÍAS"]
      if (graphOption === 1) {
        //  Modificamos el campo fechaMsm para deshacernos de la hora, para que no salga en el gráfico
        auxList.map((item) => {
          item.fechaMsm = extractDateFromDateAndHourString(item.fechaMsm)
        })

        //  Ordenamos la lista por fechaMsm en orden ascendente
        auxList = auxList.sort(function (a, b) {
          let aa = a.fechaMsm.split('/')
          aa = aa[2].substring(0, 4) + '-' + aa[1] + '-' + aa[0] + ' ' + aa[2]

          let bb = b.fechaMsm.split('/')
          bb = bb[2].substring(0, 4) + '-' + bb[1] + '-' + bb[0] + ' ' + bb[2]

          return aa.localeCompare(bb)
        })
      }
      else {  // [OPCIÓN "MESES"]
        //  Modificamos el campo fechaMsm para deshacernos de la hora y el día, para que no salga en el gráfico
        auxList.map((item) => {
          item.fechaMsm = convertToMonthAndDay(item.fechaMsm)
        })

        //  Ordenamos la lista por fechaMsm en orden ascendente
        auxList = auxList.sort(function (a, b) {
          let aa = a.fechaMsm.split('/')
          aa = aa[1] + '-' + aa[0]

          let bb = b.fechaMsm.split('/')
          bb = bb[1] + '-' + bb[0]

          return aa.localeCompare(bb)
        })

        //  Una vez ordenado el array, traducimos el nombre de los meses
        auxList.map((item) => {
          item.fechaMsm = translateMonthNumberToName(item.fechaMsm)
        })
      }

      setListItemsGraphFiltered(auxList)
    }
  }, [listItemsFiltered, graphOption])

  useEffect(() => {
    //  Separamos los datos en 4 arrays distintos para poder pasárselos a la gráfica
    if (listItemsGraphFiltered && listItemsGraphFiltered.length > 0) {
      const auxGraphFecha = []
      const auxGraphTotalEnviados = []
      const auxGraphEnviadosCorrectamente = []
      const auxGraphRegistrados = []
      let fecha = ''
      let totalEnviados = 0
      let enviadosCorrectamente = 0
      let registrados = 0

      listItemsGraphFiltered.map((item, i) => {
        if (fecha !== '' && fecha !== item.fechaMsm) {
          auxGraphFecha.push(fecha)
          auxGraphTotalEnviados.push(totalEnviados)
          auxGraphEnviadosCorrectamente.push(enviadosCorrectamente)
          auxGraphRegistrados.push(registrados)
        }

        if (fecha !== item.fechaMsm) {
          fecha = item.fechaMsm
          totalEnviados = 1
          enviadosCorrectamente = item.resultadoValidacion === '1' ? 1 : 0
          registrados = (item.proceso === '11' && item.resultadoValidacion === '1') ? 1 : 0
        }
        else {
          totalEnviados++
          enviadosCorrectamente = item.resultadoValidacion === '1' ? (enviadosCorrectamente + 1) : enviadosCorrectamente
          registrados = (item.proceso === '11' && item.resultadoValidacion === '1') ? (registrados + 1) : registrados
        }

        if (i === listItemsGraphFiltered.length -1) {
          auxGraphFecha.push(fecha)
          auxGraphTotalEnviados.push(totalEnviados)
          auxGraphEnviadosCorrectamente.push(enviadosCorrectamente)
          auxGraphRegistrados.push(registrados)
        }
      })

      setGraphFecha(auxGraphFecha)
      setGraphTotalEnviados(auxGraphTotalEnviados)
      setGraphEnviadosCorrectamente(auxGraphEnviadosCorrectamente)
      setGraphRegistrados(auxGraphRegistrados)

      setAverageTotalEnviados(auxGraphTotalEnviados.reduce((a, b) => a + b, 0) / auxGraphTotalEnviados.length)
      setAverageEnviadosCorrectamente(auxGraphEnviadosCorrectamente.reduce((a, b) => a + b, 0) / auxGraphEnviadosCorrectamente.length)
      setAverageRegistrados(auxGraphRegistrados.reduce((a, b) => a + b, 0) / auxGraphRegistrados.length)
    }
  }, [listItemsGraphFiltered])

  return (
    <Grid container item md={12} className={classes.container}>
      {listItemsGraphFiltered && listItemsGraphFiltered.length > 0 ?
        <>
          <Grid container direction='row' className={classes.selectorCont}>
              <span className={(graphOption === 0) ? classes.selectedTab : classes.tab} onClick={() => setGraphOption(0)}>
                {t('controlMensajeria.graph.options.months')}
              </span>

              <span className={(graphOption === 1) ? classes.selectedTab : classes.tab} onClick={() => setGraphOption(1)}>
                {t('controlMensajeria.graph.options.days')}
              </span>
          </Grid>
          <MensajeriaDynamicLegend
            totalUsersCheckbox={totalUsersCheckbox}
            setTotalUsersCheckbox={setTotalUsersCheckbox}
            correctlySentCheckbox={correctlySentCheckbox}
            setCorrectlySentCheckbox={setCorrectlySentCheckbox}
            registeredCheckbox={registeredCheckbox}
            setRegisteredCheckbox={setRegisteredCheckbox}
          />
          <Bar
            width={800}
            height={300}
            data={chartData}
            options={chartOptions}
          />
        </>
      :
        <div className={classes.noResults}>
          <img src={NoConsumptionIcon} className={classes.icon} alt='' />

          <div className={classes.text}>{t('controlMensajeria.graph.noResults')}</div>
        </div>
      }
    </Grid>
  )
}

export default withRouter(MensajeriaGraph)
