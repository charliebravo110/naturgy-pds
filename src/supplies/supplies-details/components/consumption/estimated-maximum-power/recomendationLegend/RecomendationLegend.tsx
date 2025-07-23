import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import LightbulbIcon from '../../../../../../assets/icons/ico_bombilla.svg'

import useStyles from './RecomendationLegend.styles'

const RecomendationLegend = (props: any) => {

  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    supplyData,
    currentSupplyPowers,
    adaptedDate,
    yearSelected
  } = props

  const [displayLegend, setDisplayLegend] = useState<boolean>(true)

  //fecha de adaptación
  let splitAdaptedDate: any[] = adaptedDate.split('/')

  const [monthsAvailable, setMonthsAvailable] = useState<number>(0)
  const [percentagePC1, setPercentagePC1] = useState<String>('')
  const [percentagePC1Type, setPercentagePC1Type] = useState<String>('')
  const [totalPercentagePC1, setTotalPercentagePC1] = useState<String>('')
  const [percentagePC2, setPercentagePC2] = useState<String>('')
  const [percentagePC2Type, setPercentagePC2Type] = useState<String>('')
  const [totalPercentagePC2, setTotalPercentagePC2] = useState<String>('')

  useEffect(() => {
    if (currentSupplyPowers && currentSupplyPowers.powers && (currentSupplyPowers.powers.length > 0)) {
      let monthsCount = 0
      let monthsCalc = 0
      let monthsCalcV = 0
      let sumaPC1 = 0 as number
      let sumaPC2 = 0 as number
      let p0 = 0 as number
      let p1 = 0 as number
      let p2 = 0 as number
      let p3 = 0 as number

      let contractedPower1 = Number(supplyData.power1.replace(',', '.'))
      let contractedPower2 = Number(supplyData.power2.replace(',', '.'))

      let percentagePC1Aux
      let percentagePC2Aux

      let maxPC1 = 0 as number
      let maxPC2 = 0 as number

      setDisplayLegend(true)

      currentSupplyPowers.powers.map((item) => {
        monthsCount++
        p1 = Number(item.PowerValueP1.replace(',', '.'))
        p2 = Number(item.PowerValueP2.replace(',', '.'))
        p3 = Number(item.PowerValueP3.replace(',', '.'))

        //Comprobación para la fecha de adaptación
        let labelAux = item.PowerDate.split('/')
        if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && yearSelected > 2020 && yearSelected.toString() === splitAdaptedDate[2]) || yearSelected < 2021) {
          p0 = Number(item.PowerValue.replace(',', '.'))
        }
        // Si alguno viene vacío no contamos ese mes
        if ((item.PowerValueP1 !== ' ') || (item.PowerValueP2 !== ' ') || (item.PowerValueP3 !== ' ')) {
          monthsCalc++
          monthsCalcV++
        } else if (item.PowerValue !== ' ') {
          monthsCalcV++
        }

        // Comprobamos la fecha de adaptación
        if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && yearSelected > 2020 && yearSelected.toString() === splitAdaptedDate[2]) || yearSelected < 2021) {
          if (!isNaN(p0)) {
            sumaPC1 = sumaPC1 + p0
            if (p0 > maxPC1) {
              maxPC1 = p0
            }
          }
        } else if ((item.PowerValueP1 !== ' ') || (item.PowerValueP2 !== ' ')) {
          if (p1 > p2) {
            if (!isNaN(p1)) {
              sumaPC1 = sumaPC1 + p1
              if (p1 > maxPC1) {
                maxPC1 = p1
              }
            }
          } else {
            if (!isNaN(p2)) {
              sumaPC1 = sumaPC1 + p2
              if (p2 > maxPC1) {
                maxPC1 = p2
              }
            }
          }
        }

        if (item.PowerValueP3 !== ' ') {
          if (!isNaN(p3)) {
            sumaPC2 = sumaPC2 + p3
            if (p3 > maxPC2) {
              maxPC2 = p3
            }
          }
        }

      })
      //Seteo porcentajes PC1
      percentagePC1Aux = ((1 - ((sumaPC1 / monthsCalcV) / contractedPower1)))
      if (percentagePC1Aux < 0) {
        setPercentagePC1Type('superior')
        percentagePC1Aux = percentagePC1Aux * -1
      } else {
        setPercentagePC1Type('inferior')
      }
      setPercentagePC1((percentagePC1Aux * 100).toFixed())
      setTotalPercentagePC1(((maxPC1 / contractedPower1) * 100).toFixed())

      //Seteo porcentajes PC2
      percentagePC2Aux = ((1 - ((sumaPC2 / monthsCalc) / contractedPower2)))
      if (percentagePC2Aux < 0) {
        setPercentagePC2Type('superior')
        percentagePC2Aux = percentagePC2Aux * -1
      } else {
        setPercentagePC2Type('inferior')
      }
      setPercentagePC2((percentagePC2Aux * 100).toFixed())
      setTotalPercentagePC2(((maxPC2 / contractedPower2) * 100).toFixed())

      setMonthsAvailable(monthsCount)
    } else {
      setDisplayLegend(false)
    }
  }, [currentSupplyPowers])

  return (
    displayLegend ?
    <Grid container md={12} className={classes.container} spacing={1}>
      <Grid item>
        <img src={LightbulbIcon} className={classes.lightIcon} />
      </Grid>
      <Grid item md={11} className={classes.title}>{t('supplies.suppliesDetails.components.maxPowerEstimated.charts.recomendationLegend.title')}</Grid>

      <Grid container className={classes.section}>
        <Grid item md={12} className={classes.subtitle}>
          <strong>{t('supplies.suppliesDetails.components.maxPowerEstimated.charts.recomendationLegend.subtitle1')}</strong><>{' ' + t('supplies.suppliesDetails.components.maxPowerEstimated.charts.recomendationLegend.type1')}</>
        </Grid>
        <Grid item className={classes.grayText}>
          {monthsAvailable != 1 ?
            t('supplies.suppliesDetails.components.maxPowerEstimated.charts.recomendationLegend.recomendationText.part1') +
            monthsAvailable +
            t('supplies.suppliesDetails.components.maxPowerEstimated.charts.recomendationLegend.recomendationText.part2') +
            percentagePC1 + '% ' + percentagePC1Type +
            t('supplies.suppliesDetails.components.maxPowerEstimated.charts.recomendationLegend.recomendationText.part3') +
            totalPercentagePC1 + '% ' +
            t('supplies.suppliesDetails.components.maxPowerEstimated.charts.recomendationLegend.recomendationText.part4')
            :
            t('supplies.suppliesDetails.components.maxPowerEstimated.charts.recomendationLegend.recomendationText.part1S') +
            t('supplies.suppliesDetails.components.maxPowerEstimated.charts.recomendationLegend.recomendationText.part2S') +
            percentagePC1 + '% ' + percentagePC1Type +
            t('supplies.suppliesDetails.components.maxPowerEstimated.charts.recomendationLegend.recomendationText.part3') +
            totalPercentagePC1 + '% ' +
            t('supplies.suppliesDetails.components.maxPowerEstimated.charts.recomendationLegend.recomendationText.part4')
          }
        </Grid>
        <Grid item md={12} className={classes.subtitle}>
          <strong>{t('supplies.suppliesDetails.components.maxPowerEstimated.charts.recomendationLegend.subtitle2')}</strong><>{' ' + t('supplies.suppliesDetails.components.maxPowerEstimated.charts.recomendationLegend.type2')}</>
        </Grid>
        <Grid item className={classes.grayText}>
          {monthsAvailable != 1 ?
            t('supplies.suppliesDetails.components.maxPowerEstimated.charts.recomendationLegend.recomendationText.part1') +
            monthsAvailable +
            t('supplies.suppliesDetails.components.maxPowerEstimated.charts.recomendationLegend.recomendationText.part2') +
            percentagePC2 + '% ' + percentagePC2Type +
            t('supplies.suppliesDetails.components.maxPowerEstimated.charts.recomendationLegend.recomendationText.part3') +
            totalPercentagePC2 + '% ' +
            t('supplies.suppliesDetails.components.maxPowerEstimated.charts.recomendationLegend.recomendationText.part4')
            :
            t('supplies.suppliesDetails.components.maxPowerEstimated.charts.recomendationLegend.recomendationText.part1S') +
            t('supplies.suppliesDetails.components.maxPowerEstimated.charts.recomendationLegend.recomendationText.part2S') +
            percentagePC2 + '% ' + percentagePC2Type +
            t('supplies.suppliesDetails.components.maxPowerEstimated.charts.recomendationLegend.recomendationText.part3') +
            totalPercentagePC2 + '% ' +
            t('supplies.suppliesDetails.components.maxPowerEstimated.charts.recomendationLegend.recomendationText.part4')
          }
        </Grid>
      </Grid>

    </Grid>
    :

    <></>
  )

}

export default RecomendationLegend
