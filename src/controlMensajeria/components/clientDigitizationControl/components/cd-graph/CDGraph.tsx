import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Bar } from 'react-chartjs-2'
import 'chartjs-plugin-annotation'
import Grid from '@material-ui/core/Grid'

import NoConsumptionIcon from '../../../../../assets/icons/aviso_alerta_pop_up.svg'

import CDDynamicLegend from './cd-dynamic-legend/CDDynamicLegend'
import { extractDateFromDateAndHourString } from '../../../../../common/lib/FormatLib'

import useStyles from './CDGraph.styles'

const CDGraph = (props: any) => {
  const classes = useStyles({})
  const {
    listItemsFiltered
  } = props

  const { t } = useTranslation()

  const [listItemsGraphFiltered, setListItemsGraphFiltered] = useState([] as any)
  const [graphFecha, setGraphFecha] = useState([] as any)

  const [graphTotalUrl, setGraphTotalUrl] = useState([] as any)
  const [graphEnviadosEmail, setGraphEnviadosEmail] = useState([] as any)
  const [graphEnviadosSms, setGraphEnviadosSms] = useState([] as any)
  const [graphOpenedUrls, setGraphOpenedUrls] = useState([] as any)

  const [averageTotalUrl, setAverageTotalUrl] = useState(0)
  const [averageEnviadosEmail, setAverageEnviadosEmail] = useState(0)
  const [averageEnviadosSms, setAverageEnviadosSms] = useState(0)
  const [averageOpenedUrls, setAverageOpenedUrls] = useState(0)

  // const [totalUsersCheckbox, setTotalUsersCheckbox] = useState(true)
  // const [correctlySentCheckbox, setCorrectlySentCheckbox] = useState(true)
  // const [registeredCheckbox, setRegisteredCheckbox] = useState(true)

  const [totalUrlCheckbox, setTotalUrlCheckbox] = useState(true)
  const [enviadosEmailCheckbox, setEnviadosEmailCheckbox] = useState(true)
  const [enviadosSmsCheckbox, setEnviadosSmsCheckbox] = useState(true)
  const [openedUrlsCheckbox, setOpenedUrlsCheckbox] = useState(true)

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
        monthName = t('common.months.january')
        break
      case '02':
        monthName = t('common.months.february')
        break
      case '03':
        monthName = t('common.months.march')
        break
      case '04':
        monthName = t('common.months.april')
        break
      case '05':
        monthName = t('common.months.may')
        break
      case '06':
        monthName = t('common.months.june')
        break
      case '07':
        monthName = t('common.months.july')
        break
      case '08':
        monthName = t('common.months.agost')
        break
      case '09':
        monthName = t('common.months.september')
        break
      case '10':
        monthName = t('common.months.october')
        break
      case '11':
        monthName = t('common.months.november')
        break
      case '12':
        monthName = t('common.months.december')
        break
    }

    const result = monthName + ' ' + year
    return result
  }

  const colors = {
    darkBlue: '#1a587f',
    lightBlue: '#66c2c9',
    orange: '#e57200',
    green: '#8e9300',
    darkBlueAverage: '#13415D',
    lightBlueAverage: '#4F9398',
    orangeAverage: '#B75B00',
    greenAverage: '#737700',
  }

  const chartData = {
    labels: graphFecha,
    datasets: [
      {
        label: t('clientDigitizationControl.search.searchParameters.resumeGraph.totalUrl'),
        data: totalUrlCheckbox ? graphTotalUrl : [],
        backgroundColor: colors.darkBlue
      },
      {
        label: t('clientDigitizationControl.search.searchParameters.resumeGraph.sentEmail'),
        data: enviadosEmailCheckbox ? graphEnviadosEmail : [],
        backgroundColor: colors.lightBlue
      },
      {
        label: t('clientDigitizationControl.search.searchParameters.resumeGraph.sentSms'),
        data: enviadosSmsCheckbox ? graphEnviadosSms : [],
        backgroundColor: colors.orange
      },
      {
        label: t('clientDigitizationControl.search.searchParameters.resumeGraph.openedUrls'),
        data: openedUrlsCheckbox ? graphOpenedUrls : [],
        backgroundColor: colors.green
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
        {
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
          padding: 16
        }
      }]
    },
    annotation: {
      annotations: [
        (averageTotalUrl > 0 && totalUrlCheckbox) &&
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: averageTotalUrl,
          borderColor: colors.darkBlueAverage,
          borderWidth: 3,
          borderDash: [5],
          borderDashOffset: 5
        },
        (averageEnviadosEmail > 0 && enviadosEmailCheckbox) &&
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: averageEnviadosEmail,
          borderColor: colors.lightBlueAverage,
          borderWidth: 3,
          borderDash: [5],
          borderDashOffset: 5
        },
        (averageEnviadosSms > 0 && enviadosSmsCheckbox) &&
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: averageEnviadosSms,
          borderColor: colors.orangeAverage,
          borderWidth: 3,
          borderDash: [5],
          borderDashOffset: 5
        },
        (averageOpenedUrls > 0 && openedUrlsCheckbox) &&
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: averageOpenedUrls,
          borderColor: colors.greenAverage,
          borderWidth: 3,
          borderDash: [5],
          borderDashOffset: 5
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
      let auxList = JSON.parse(JSON.stringify(listItemsFiltered))

      // [OPCIÓN "DÍAS"]
      if (graphOption === 1) {
        //  Modificamos el campo postDate para deshacernos de la hora, para que no salga en el gráfico
        auxList.map((item) => {
          item.postDate = extractDateFromDateAndHourString(item.postDate)
        })

        //  Ordenamos la lista por postDate en orden ascendente
        auxList = auxList.sort(function (a, b) {
          let aa = a.postDate.split('/')
          aa = aa[2].substring(0, 4) + '-' + aa[1] + '-' + aa[0] + ' ' + aa[2]

          let bb = b.postDate.split('/')
          bb = bb[2].substring(0, 4) + '-' + bb[1] + '-' + bb[0] + ' ' + bb[2]

          return aa.localeCompare(bb)
        })
      }
      // [OPCIÓN "MESES"]
      else {
        //  Modificamos el campo postDate para deshacernos de la hora y el día, para que no salga en el gráfico
        auxList.map((item) => {
          item.postDate = convertToMonthAndDay(item.postDate)
        })

        //  Ordenamos la lista por postDate en orden ascendente
        auxList = auxList.sort(function (a, b) {
          let aa = a.postDate.split('/')
          aa = aa[1] + '-' + aa[0]

          let bb = b.postDate.split('/')
          bb = bb[1] + '-' + bb[0]

          return aa.localeCompare(bb)
        })

        //  Una vez ordenado el array, traducimos el nombre de los meses
        auxList.map((item) => {
          item.postDate = translateMonthNumberToName(item.postDate)
        })
      }

      setListItemsGraphFiltered(auxList)
    }
  }, [listItemsFiltered, graphOption])

  useEffect(() => {
    //  Separamos los datos en 5 arrays distintos para poder pasárselos a la gráfica
    if (listItemsGraphFiltered && listItemsGraphFiltered.length > 0) {
      const auxGraphFecha = []
      const auxGraphTotalUrl = []
      const auxGraphEnviadosEmail = []
      const auxGraphEnviadosSms = []
      const auxGraphOpenedUrls = []

      let fecha = ''
      let totalUrl = 0
      let enviadosEmail = 0
      let enviadosSms = 0
      let openedUrls = 0

      listItemsGraphFiltered.map((item, i) => {
        if (fecha !== '' && fecha !== item.postDate) {
          auxGraphFecha.push(fecha)
          auxGraphTotalUrl.push(totalUrl)
          auxGraphEnviadosEmail.push(enviadosEmail)
          auxGraphEnviadosSms.push(enviadosSms)
          auxGraphOpenedUrls.push(openedUrls)
        }

        if (fecha !== item.postDate) {
          fecha = item.postDate
          totalUrl = 1
          enviadosEmail = item.channel === '0' ? 1 : 0
          enviadosSms = item.channel === '1' ? 1 : 0
          openedUrls = item.openUrl === '1' ? 1 : 0
        }
        else {
          totalUrl++
          enviadosEmail = item.channel === '0' ? (enviadosEmail + 1) : enviadosEmail
          enviadosSms = item.channel === '1' ? (enviadosSms + 1) : enviadosSms
          openedUrls = item.openUrl === '1' ? (openedUrls + 1) : openedUrls
        }

        if (i === listItemsGraphFiltered.length -1) {
          auxGraphFecha.push(fecha)
          auxGraphTotalUrl.push(totalUrl)
          auxGraphEnviadosEmail.push(enviadosEmail)
          auxGraphEnviadosSms.push(enviadosSms)
          auxGraphOpenedUrls.push(openedUrls)
        }
      })

      setGraphFecha(auxGraphFecha)
      setGraphTotalUrl(auxGraphTotalUrl)
      setGraphEnviadosEmail(auxGraphEnviadosEmail)
      setGraphEnviadosSms(auxGraphEnviadosSms)
      setGraphOpenedUrls(auxGraphOpenedUrls)

      setAverageTotalUrl(auxGraphTotalUrl.reduce((a, b) => a + b, 0) / auxGraphTotalUrl.length)
      setAverageEnviadosEmail(auxGraphEnviadosEmail.reduce((a, b) => a + b, 0) / auxGraphEnviadosEmail.length)
      setAverageEnviadosSms(auxGraphEnviadosSms.reduce((a, b) => a + b, 0) / auxGraphEnviadosSms.length)
      setAverageOpenedUrls(auxGraphOpenedUrls.reduce((a, b) => a + b, 0) / auxGraphOpenedUrls.length)
    }
  }, [listItemsGraphFiltered])

  return (
    <Grid container item md={12} className={classes.container}>
      {listItemsGraphFiltered && listItemsGraphFiltered.length > 0 ?
        <>
          <Grid container direction='row' className={classes.selectorCont}>
              <span className={(graphOption === 0) ? classes.selectedTab : classes.tab} onClick={() => setGraphOption(0)}>
                {t('clientDigitizationControl.cdGraph.months')}
              </span>

              <span className={(graphOption === 1) ? classes.selectedTab : classes.tab} onClick={() => setGraphOption(1)}>
                {t('clientDigitizationControl.cdGraph.days')}
              </span>
          </Grid>
          <CDDynamicLegend
            totalUrlCheckbox={totalUrlCheckbox}
            setTotalUrlCheckbox={setTotalUrlCheckbox}
            enviadosEmailCheckbox={enviadosEmailCheckbox}
            setEnviadosEmailCheckbox={setEnviadosEmailCheckbox}
            enviadosSmsCheckbox={enviadosSmsCheckbox}
            setEnviadosSmsCheckbox={setEnviadosSmsCheckbox}
            openedUrlsCheckbox={openedUrlsCheckbox}
            setOpenedUrlsCheckbox={setOpenedUrlsCheckbox}
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

          <div className={classes.text}>{t('clientDigitizationControl.cdGraph.noResults')}</div>
        </div>
      }
    </Grid>
  )
}

export default withRouter(CDGraph)
