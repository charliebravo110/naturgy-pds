import React from 'react'
import { useTranslation } from 'react-i18next'

import { Bar } from 'react-chartjs-2'
import 'chartjs-plugin-annotation'

import Grid from '@material-ui/core/Grid'

import {
  formatDate,
  formatDateHyphens,
  formatMonthAndYear,
  formatDay,
  formatHour
} from '../../../../common/lib/FormatLib'

import useStyles from './Graph.styles'

// Plugin para redondear las esquinas de las barras
require('../../../../common/components/chart/chartRounded.styles.js')

const Graph = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    setIsLoading,
    currentSupplyConsumptions,
    consumptionsFilters,
    setConsumptionsFilters,
    isGeneration
  } = props

  let auxLabels = [] as any

  const chartData = (canvas: any) => {
    const ctx = canvas.getContext('2d')

    const whiteColor = 'rgba(255, 255, 255, 0)'

    const greenGradient = ctx.createLinearGradient(0, 0, 0, 860)
    greenGradient.addColorStop(0, '#A7B009')
    greenGradient.addColorStop(1, whiteColor)

    const redGradient = ctx.createLinearGradient(0, 0, 0, 520)
    redGradient.addColorStop(0, '#CF0E11')
    redGradient.addColorStop(1, whiteColor)

    const blueGradient = ctx.createLinearGradient(0, 0, 0, 800)
    blueGradient.addColorStop(0, '#004571')
    blueGradient.addColorStop(1, whiteColor)

    let labels = [] as any
    let values = [] as any

    if (currentSupplyConsumptions[0] && currentSupplyConsumptions[0].consumptions && currentSupplyConsumptions[0].consumptions.items) {
      currentSupplyConsumptions[0].consumptions.items.map(
        (item) => {
          if (item.consumptionDate) {
            if (consumptionsFilters.granularity === 'M') {
              let mesStringArray = formatMonthAndYear(item.consumptionDate).split(' ')
              labels.push(mesStringArray[0])
            } else if (consumptionsFilters.granularity === 'D') {
              labels.push(formatDay(item.consumptionDate))
            } else {
              labels.push(formatHour(item.hour))
            }

            auxLabels.push(item.consumptionDate)
          }

          if (isGeneration) {
            item.activeInput && values.push(parseFloat(item.activeInput.replace(',', '.')))
          } else {
            item.consumptionValue && values.push(parseFloat(item.consumptionValue.replace(',', '.')))
          }
            
          return null
        }
      )
    } else if (currentSupplyConsumptions && currentSupplyConsumptions.consumptions && currentSupplyConsumptions.consumptions.items) {
      currentSupplyConsumptions.consumptions.items.map(
        (item) => {
          if (item.consumptionDate) {
            if (consumptionsFilters.granularity === 'M') {
              let mesStringArray = formatMonthAndYear(item.consumptionDate).split(' ')
              labels.push(mesStringArray[0])
            } else if (consumptionsFilters.granularity === 'D') {
              labels.push(formatDay(item.consumptionDate))
            } else {
              labels.push(formatHour(item.hour))
            }

            auxLabels.push(item.consumptionDate)
          }

          if (isGeneration) {
            item.activeInput && values.push(parseFloat(item.activeInput.replace(',', '.')))
          } else {
            item.consumptionValue && values.push(parseFloat(item.consumptionValue.replace(',', '.')))
          }
            
          return null
        }
      )
    }

    let barsColors = [] as any

    for (let i = 0; i < values.length; i++) {
      const value = values[i]

      if (currentSupplyConsumptions[0] && currentSupplyConsumptions[0].minConsumption && value === parseFloat(currentSupplyConsumptions[0].minConsumption.replace(',', '.'))) {
        barsColors.push(greenGradient)
      } else if (currentSupplyConsumptions[0] && currentSupplyConsumptions[0].maxConsumption && value === parseFloat(currentSupplyConsumptions[0].maxConsumption.replace(',', '.'))) {
        barsColors.push(redGradient)
      } else {
        barsColors.push(blueGradient)
      }
    }

    return {
      labels: labels,
      datasets: [
        {
          barPercentage: 0.3,
          label: t('supplies.suppliesDetails.components.consumption.charts.graph.consumption') ,
          data: values,
          backgroundColor: barsColors
        }
      ]
    }
  }

  const chartOptions = {
    cornerRadius: 8,
    legend: {
      display: false
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
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
          callback: function(label) {
            return label + ' kWh'
          }
        }
      }]
    },
    onClick: function(c, i) {
      if (i && i[0]) {
        let index = i[0]._index
        let label = auxLabels[index]

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
          
        } else if (consumptionsFilters.granularity === 'D') {
          setIsLoading(true)

          setConsumptionsFilters({
            ...consumptionsFilters,
            granularity: 'H',
            startDate: label,
            endDate: label
          })
        }
      }
    }
  }

  return (
    <Grid container item md={12} className={classes.container}>
      <Bar
        width={800}
        height={300}
        data={chartData}
        options={chartOptions}
      />
    </Grid>
  )
}

export default Graph
