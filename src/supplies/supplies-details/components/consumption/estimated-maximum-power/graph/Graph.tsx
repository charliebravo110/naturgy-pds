import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Bar } from 'react-chartjs-2'
import 'chartjs-plugin-annotation'

import Grid from '@material-ui/core/Grid'

import useStyles from './Graph.styles'
import DynamicLegend from '../dynamicLegend/DynamicLegend'
import Legend from '../legend/Legend'
import RecomendationLegend from '../recomendationLegend/RecomendationLegend'

// Plugin para redondear las esquinas de las barras
require('../../../../../../common/components/chart/chartRounded.styles.js')

const Graph = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()
  let last = [0, 0, 0, 0, 0, 0]

  const {
    currentSupplyPowers,
    currentComparePowers,
    currentComparePowers2,
    yearSelected,
    compare,
    typecompare,
    tipoUsuario,
    isAdapted,
    adaptedDate,
    supplyData,
    disabledCheckbox,
    state,
    setState,
    setTopLegendYear,
    setShowLegendYear
  } = props

  const [years, setYears] = useState({
    year0: (new Date().getFullYear()),
    yearMinus1: ((new Date().getFullYear()) - 1),
    yearMinus2: ((new Date().getFullYear()) - 2)
  })

  const powerLabels: Array<string> = new Array<string>()
  const powerLabelsComp = ['P1   P2   P6', 'P1   P2   P6', 'P2   P3   P6', 'P4   P5   P6', 'P4   P5   P6', 'P3   P4   P6', 'P1   P2   P6', 'P3   P4   P6', 'P3   P4   P6', 'P4   P5   P6', 'P2   P3   P6', 'P1   P2   P6']
  const powerLabelsCompare = [] as any
  const valuesTooltip = ['', '', '', '', '', '', '', '', '', '', '', '']

  //Guardamos las potencias contratadas de cada periodo
  const [pCont, setPCont] = useState({
    p1: parseFloat(supplyData.power1.replace(',', '.')),
    p2: tipoUsuario === 'simple' ? parseFloat(supplyData.power1.replace(',', '.')) : parseFloat(supplyData.power2.replace(',', '.')),
    p3: tipoUsuario === 'simple' ? parseFloat(supplyData.power2.replace(',', '.')) : parseFloat(supplyData.power3.replace(',', '.')),
    p4: parseFloat(supplyData.power4.replace(',', '.')),
    p5: parseFloat(supplyData.power5.replace(',', '.')),
    p6: parseFloat(supplyData.power6.replace(',', '.'))
  })

  const checkProximityFinal = (potencia: number, indPotencia: number) => {
    //recibimos la potencia que estamos comprobando y su indicador (1,2,3,4,5 o 6)
    let diff1 = potencia - pCont.p1
    let diff2 = potencia - pCont.p2
    let diff3 = potencia - pCont.p3
    let diff4 = potencia - pCont.p4
    let diff5 = potencia - pCont.p5
    let diff6 = potencia - pCont.p6

    //comprobamos si colisionan teniendo en cuenta que no se compare contra si misma
    if (state.checked1 && indPotencia !== 1 && diff1 < 0.35 && diff1 > -0.35 && indPotencia > 1) {
      last[indPotencia - 1] = last[indPotencia - 1] + 35
    }
    if (state.checked2 && indPotencia !== 2 && diff2 < 0.35 && diff2 > -0.35 && indPotencia > 2) {
      last[indPotencia - 1] = last[indPotencia - 1] + 35
    }
    if (state.checked3 && indPotencia !== 3 && diff3 < 0.35 && diff3 > -0.35 && indPotencia > 3) {
      last[indPotencia - 1] = last[indPotencia - 1] + 35
    }
    if (state.checked4 && indPotencia !== 4 && diff4 < 0.35 && diff4 > -0.35 && indPotencia > 4) {
      last[indPotencia - 1] = last[indPotencia - 1] + 35
    }
    if (state.checked5 && indPotencia !== 5 && diff5 < 0.35 && diff5 > -0.35 && indPotencia > 5) {
      last[indPotencia - 1] = last[indPotencia - 1] + 35
    }

    //for para ordenar en caso de que alguno se acabe pisando (revisión final)
    for (let i = 1; i < 6; i++) {
      for (let x = 1; x < 6; x++) {
        if (last[i] === last[x] && i !== x && last[i] !== 0) {
          last[x] = last[x] + 35
        }
      }
    }

    return true
  }

  const chartData = (canvas: any) => {
    const ctx = canvas.getContext('2d')

    const darkblueGradient = 'rgba(0, 69, 113, 1)'
    const whiteblueGradient = 'rgba(102, 195, 202, 1)'
    const greyGradient = 'rgba(191, 184, 174, 1)'
    const redGradient = '#d3222a'
    const midRed = '#e99094'
    const whiteRed = '#f6d3d4'
    const green = '#bfbf60'
    const midGreen = '#c7c980'
    const whiteGreen = '#e8e9cc'
    const yellow = '#edab46'
    const midYellow = '#f6d5a3'
    const whiteYellow = '#fbeeda'
    const blue = '#009aa6'
    const midBlue = '#80ccd3'
    const whiteBlue = '#ccebed'
    const orange = '#e57200'
    const midOrange = '#f2b880'
    const whiteOrange = '#fae3cc'
    const darkGreen = '#5fad83'
    const midDarkGreen = '#92c7aa'
    const whiteDarkGreen = '#c7e5d5'
    const whiteP0 = '#4d7d9c'
    const white2P0 = '#90bad5'

    let labels = [t('common.months.january'), t('common.months.february'), t('common.months.march'), t('common.months.april'), t('common.months.may'), t('common.months.june'), t('common.months.july'), t('common.months.agost'), t('common.months.september'), t('common.months.october'), t('common.months.november'), t('common.months.december')] as any
    let valuesP0 = [0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001] as any
    let values = [0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001] as any
    let valuesP1 = [0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001] as any
    let valuesP2 = [0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001] as any
    let valuesP3 = [0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001] as any
    let complejoValuesP1 = [0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001] as any
    let complejoValuesP2 = [0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001] as any
    let complejoValuesP3 = [0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001] as any
    let complejoValuesP4 = [0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001] as any
    let complejoValuesP5 = [0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001] as any
    let complejoValuesP6 = [0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001] as any
    let valuesCompare = [0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001] as any
    let valuesCompare2 = [0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001] as any
    let barsColors = [] as any
    let barsColorsP1 = [] as any
    let barsColorsP2 = [] as any
    let barsColorsP3 = [] as any

    //estas 4 se usán para pintar la barras (tanto comlejo como simple) mientras no se esté comparando, solo el simple usa estas al comparar
    if (isAdapted === 'SI') {
      if (tipoUsuario === 'complejo') {
        barsColors = [greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient] as any
        barsColorsP1 = [greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient] as any
        barsColorsP2 = [greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient] as any
        barsColorsP3 = [greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient, greyGradient] as any
      }
    }
    
    //usamos estas variables para pintar las barras de potencia en caso de usuario complejo y comparar
    let complejoBarsColorsP1 = [] as any
    let complejoBarsColorsP2 = [] as any
    let complejoBarsColorsP3 = [] as any
    let complejoBarsColorsP4 = [] as any
    let complejoBarsColorsP5 = [] as any
    let complejoBarsColorsP6 = [] as any
    //fecha de adaptación
    let splitAdaptedDate: any[] = adaptedDate.split('/')

    if (currentSupplyPowers && currentSupplyPowers.powers) {
      currentSupplyPowers.powers.map(
        (item) => {
          //comprobamos que el contador esté adaptado, si no el funcionamiento no cambia
          if (isAdapted === 'SI') {
            let labelAux = item.PowerDate.split('/')
            let labelAuxP1 = item.PowerDateP1.split('/')
            let labelAuxP2 = item.PowerDateP2.split('/')
            let labelAuxP3 = item.PowerDateP3.split('/')

            //Nos guardamos P0 en su propia variable para comparar u otros posibles usos
            item.PowerValue && valuesP0.splice(labelAux[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))


            if (tipoUsuario === 'simple') {
              if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && yearSelected > 2020 && yearSelected.toString() === splitAdaptedDate[2]) || yearSelected < 2021 || (!state.checked1 && !state.checked2 && !state.checked3)) {
                item.PowerValue && state.checked0 && values.splice(labelAux[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
                item.PowerValue && state.checked0 && valuesP2.splice(labelAux[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
                valuesTooltip.splice(labelAux[1] - 1, 1, item.PowerDate + ' ' + item.hour + 'h')
              } else {
                item.PowerValueP1 && valuesP1.splice(labelAuxP1[1] - 1, 1, parseFloat(item.PowerValueP1.replace(',', '.')))
                item.PowerValueP2 && valuesP2.splice(labelAuxP2[1] - 1, 1, parseFloat(item.PowerValueP2.replace(',', '.')))
                item.PowerValueP3 && valuesP3.splice(labelAuxP3[1] - 1, 1, parseFloat(item.PowerValueP3.replace(',', '.')))
                valuesTooltip.splice(labelAux[1] - 1, 1, item.PowerDateP1 + ' ' + item.hourP1 + 'h,' + item.PowerDateP2 + ' ' + item.hourP2 + 'h,' + item.PowerDateP3 + ' ' + item.hourP3 + 'h')
                //powerLabels.push('P1','P2','P3')
              }
              if (compare && ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && yearSelected > 2020 && yearSelected.toString() === splitAdaptedDate[2]) || yearSelected < 2021)) {
                if (state.checked1) {
                  item.PowerValue && valuesP1.splice(labelAux[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
                } else if (state.checked2) {
                  item.PowerValue && valuesP2.splice(labelAux[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
                } else if (state.checked3) {
                  item.PowerValue && valuesP3.splice(labelAux[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
                }
              }
            } else if (tipoUsuario === 'complejo') {
              let labelAuxP4 = item.PowerDateP4.split('/')
              let labelAuxP5 = item.PowerDateP5.split('/')
              let labelAuxP6 = item.PowerDateP6.split('/')
              let aux1 = false, aux2 = false, aux3 = false, aux4 = false, aux5 = false, aux6 = false

              if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && yearSelected > 2020 && yearSelected.toString() === splitAdaptedDate[2]) || yearSelected < 2021) {
                item.PowerValue && state.checked0 && values.splice(labelAux[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
                item.PowerValue && state.checked0 && valuesP2.splice(labelAux[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
                //barsColorsP1.push(greyGradient)
                //barsColorsP2.push(greyGradient)
                //barsColorsP3.push(greyGradient)
                if (compare) {
                  barsColors.splice(labelAux[1] - 1, 1, darkblueGradient)
                }

                powerLabelsComp.splice(labelAux[1] - 1, 1, 'P0')
                valuesTooltip.splice(labelAux[1] - 1, 1, item.PowerDate + ' ' + item.hour + 'h')
              } else {
                //variable para controlar el valor de la fecha/hora en el tooltip del gráfico
                let auxTooltip = ''
                if (state.checked1 && (labelAuxP1[1] === '1' || labelAuxP1[1] === '2' || labelAuxP1[1] === '7' || labelAuxP1[1] === '12' || labelAuxP1[1] === '01' || labelAuxP1[1] === '02' || labelAuxP1[1] === '07')) {
                  item.PowerValueP1 && valuesP1.splice(labelAuxP1[1] - 1, 1, parseFloat(item.PowerValueP1.replace(',', '.')))
                  item.PowerValueP1 && complejoValuesP1.splice(labelAuxP1[1] - 1, 1, parseFloat(item.PowerValueP1.replace(',', '.')))
                  aux1 = true
                  //barsColorsP1.push(redGradient)
                  barsColorsP1.splice(labelAuxP1[1] - 1, 1, redGradient)
                  auxTooltip = item.PowerDateP1 + ' ' + item.hourP1 + 'h,'
                } else if (state.checked2 && (labelAuxP2[1] === '3' || labelAuxP2[1] === '11' || labelAuxP2[1] === '03')) {
                  item.PowerValueP2 && valuesP1.splice(labelAuxP2[1] - 1, 1, parseFloat(item.PowerValueP2.replace(',', '.')))
                  item.PowerValueP2 && complejoValuesP2.splice(labelAuxP2[1] - 1, 1, parseFloat(item.PowerValueP2.replace(',', '.')))
                  aux2 = true
                  //barsColorsP1.push(orange)
                  barsColorsP1.splice(labelAux[1] - 1, 1, orange)
                  auxTooltip = item.PowerDateP2 + ' ' + item.hourP2 + 'h,'
                } else if (state.checked3 && (labelAuxP3[1] === '6' || labelAuxP3[1] === '8' || labelAuxP3[1] === '9' || labelAuxP3[1] === '06' || labelAuxP3[1] === '08' || labelAuxP3[1] === '09')) {
                  item.PowerValueP3 && valuesP1.splice(labelAuxP3[1] - 1, 1, parseFloat(item.PowerValueP3.replace(',', '.')))
                  item.PowerValueP3 && complejoValuesP3.splice(labelAuxP3[1] - 1, 1, parseFloat(item.PowerValueP3.replace(',', '.')))
                  aux3 = true
                  //barsColorsP1.push(yellow)
                  barsColorsP1.splice(labelAux[1] - 1, 1, yellow)
                  auxTooltip = item.PowerDateP3 + ' ' + item.hourP3 + 'h,'
                } else if (state.checked4 && (labelAuxP4[1] === '4' || labelAuxP4[1] === '5' || labelAuxP4[1] === '10' || labelAuxP4[1] === '04' || labelAuxP4[1] === '05')) {
                  item.PowerValueP4 && valuesP1.splice(labelAuxP4[1] - 1, 1, parseFloat(item.PowerValueP4.replace(',', '.')))
                  item.PowerValueP4 && complejoValuesP4.splice(labelAuxP4[1] - 1, 1, parseFloat(item.PowerValueP4.replace(',', '.')))
                  aux4 = true
                  //barsColorsP1.push(green)
                  barsColorsP1.splice(labelAux[1] - 1, 1, green)
                  auxTooltip = item.PowerDateP4 + ' ' + item.hourP4 + 'h,'
                } else {
                  auxTooltip = ','
                  //barsColorsP1.push(greyGradient)
                }

                if (!aux2 && state.checked2 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                  item.PowerValueP2 && valuesP2.splice(labelAuxP2[1] - 1, 1, parseFloat(item.PowerValueP2.replace(',', '.')))
                  item.PowerValueP2 && complejoValuesP2.splice(labelAuxP2[1] - 1, 1, parseFloat(item.PowerValueP2.replace(',', '.')))
                  aux2 = true
                  //barsColorsP2.push(orange)
                  barsColorsP2.splice(labelAuxP1[1] - 1, 1, orange)
                  auxTooltip = auxTooltip + item.PowerDateP2 + ' ' + item.hourP2 + 'h,'
                } else if (!aux3 && state.checked3 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                  item.PowerValueP3 && valuesP2.splice(labelAuxP3[1] - 1, 1, parseFloat(item.PowerValueP3.replace(',', '.')))
                  item.PowerValueP3 && complejoValuesP3.splice(labelAuxP3[1] - 1, 1, parseFloat(item.PowerValueP3.replace(',', '.')))
                  aux3 = true
                  //barsColorsP2.push(yellow)
                  barsColorsP2.splice(labelAux[1] - 1, 1, yellow)
                  auxTooltip = auxTooltip + item.PowerDateP3 + ' ' + item.hourP3 + 'h,'
                } else if (!aux4 && state.checked4 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                  item.PowerValueP4 && valuesP2.splice(labelAuxP4[1] - 1, 1, parseFloat(item.PowerValueP4.replace(',', '.')))
                  item.PowerValueP4 && complejoValuesP4.splice(labelAuxP4[1] - 1, 1, parseFloat(item.PowerValueP4.replace(',', '.')))
                  aux4 = true
                  //barsColorsP2.push(green)
                  barsColorsP2.splice(labelAux[1] - 1, 1, green)
                  auxTooltip = auxTooltip + item.PowerDateP4 + ' ' + item.hourP4 + 'h,'
                } else if (!aux5 && state.checked5 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                  item.PowerValueP5 && valuesP2.splice(labelAuxP5[1] - 1, 1, parseFloat(item.PowerValueP5.replace(',', '.')))
                  item.PowerValueP5 && complejoValuesP5.splice(labelAuxP5[1] - 1, 1, parseFloat(item.PowerValueP5.replace(',', '.')))
                  aux5 = true
                  //barsColorsP2.push(darkGreen)
                  barsColorsP2.splice(labelAux[1] - 1, 1, darkGreen)
                  auxTooltip = auxTooltip + item.PowerDateP5 + ' ' + item.hourP5 + 'h,'
                } else {
                  //barsColorsP2.push(greyGradient)
                  auxTooltip = auxTooltip + ','
                }

                if (!aux6 && state.checked6) {
                  item.PowerValueP6 && valuesP3.splice(labelAuxP6[1] - 1, 1, parseFloat(item.PowerValueP6.replace(',', '.')))
                  item.PowerValueP6 && complejoValuesP6.splice(labelAuxP6[1] - 1, 1, parseFloat(item.PowerValueP6.replace(',', '.')))
                  aux6 = true
                  //barsColorsP3.push(blue)
                  barsColorsP3.splice(labelAux[1] - 1, 1, blue)
                  auxTooltip = auxTooltip + item.PowerDateP6 + ' ' + item.hourP6 + 'h'
                } else {
                  barsColorsP3.push(greyGradient)
                  auxTooltip = auxTooltip + ','
                }

                //en caso de que en un mes no se haya informado ninguna potencia de las que debería, mostramos P0
                if (!aux1 && !aux2 && !aux3 && !aux4 && !aux5 && !aux6 && state.checked0) {
                  item.PowerValue && state.checked0 && values.splice(labelAux[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
                  item.PowerValue && state.checked0 && valuesP2.splice(labelAux[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
                  //barsColorsP1.push(greyGradient)
                  //barsColorsP2.push(greyGradient)
                  //barsColorsP3.push(greyGradient)
                  powerLabelsComp.splice(labelAux[1] - 1, 1, 'P0')
                  valuesTooltip.splice(labelAux[1] - 1, 1, item.PowerDate + ' ' + item.hour + 'h')
                } else {
                  valuesTooltip.splice(labelAux[1] - 1, 1, auxTooltip)
                }
              }
              if (compare && ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && yearSelected > 2020 && yearSelected.toString() === splitAdaptedDate[2]) || yearSelected < 2021)) {
                if (state.checked1) {
                  item.PowerValue && valuesP1.splice(labelAuxP1[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
                  item.PowerValue && complejoValuesP1.splice(labelAuxP1[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
                  complejoBarsColorsP1.splice(labelAuxP1[1] - 1, 1, darkblueGradient)
                } else if (state.checked2) {
                  item.PowerValue && valuesP2.splice(labelAuxP2[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
                  item.PowerValue && complejoValuesP2.splice(labelAuxP2[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
                  complejoBarsColorsP2.splice(labelAuxP2[1] - 1, 1, darkblueGradient)
                } else if (state.checked3) {
                  item.PowerValue && valuesP3.splice(labelAuxP3[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
                  item.PowerValue && complejoValuesP3.splice(labelAuxP3[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
                  complejoBarsColorsP3.splice(labelAuxP3[1] - 1, 1, darkblueGradient)
                } else if (state.checked4) {
                  item.PowerValue && complejoValuesP4.splice(labelAuxP4[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
                  complejoBarsColorsP4.splice(labelAuxP4[1] - 1, 1, darkblueGradient)
                } else if (state.checked5) {
                  item.PowerValue && complejoValuesP5.splice(labelAuxP5[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
                  complejoBarsColorsP5.splice(labelAuxP5[1] - 1, 1, darkblueGradient)
                } else if (state.checked6) {
                  item.PowerValue && complejoValuesP6.splice(labelAuxP6[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
                  complejoBarsColorsP6.splice(labelAuxP6[1] - 1, 1, darkblueGradient)
                }
              }
              if (compare) {
                barsColors.splice(labelAux[1] - 1, 1, darkblueGradient)
              }
            }
            //si el contador no está adaptado, cargamos el PO
          } else {
            let labelAux = item.PowerDate.split('/')
            item.PowerValue && values.splice(labelAux[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
            valuesTooltip.splice(labelAux[1] - 1, 1, item.PowerDate + ' ' + item.hour + 'h')
          }

          return null
        }
      )
    }

    //colores de las barras de usuario simple que no esté comparando
    if (isAdapted === 'SI' && tipoUsuario === 'simple' && !compare) {
      for (let i = 0; i < values.length; i++) {
        barsColors.push(greyGradient)
        //powerLabels.push('P0')
      }
      for (let i = 0; i < valuesP1.length; i++) {
        barsColorsP1.push(redGradient)
      }
      for (let i = 0; i < valuesP2.length; i++) {
        if ((splitAdaptedDate[1] - 1 > i && yearSelected > 2020 && yearSelected.toString() === splitAdaptedDate[2]) || yearSelected < 2021 || (!state.checked1 && !state.checked2 && !state.checked3)) {
          barsColorsP2.push(greyGradient)
          powerLabels.push('P0')
        } else {
          barsColorsP2.push(yellow)
          powerLabels.push('P1   P2   P3')
        }
      }
      for (let i = 0; i < valuesP3.length; i++) {
        barsColorsP3.push(blue)
      }
    }
    //comprobamos que en caso de usuario complejo tanto label como colores sean los correctos
    else if (isAdapted === 'SI' && tipoUsuario === 'complejo' && !compare) {
      for (let i = 0; i < valuesP2.length; i++) {
        if ((splitAdaptedDate[1] - 1 > i && yearSelected.toString() === splitAdaptedDate[2]) || yearSelected < 2021) {
          powerLabelsComp.splice(i, 1, 'P0')
          barsColorsP2.splice(i, 1, greyGradient)
        }
      }
    }
    //colores de las barras de usuario complejo cuando esté comparando
    else if (isAdapted === 'SI' && tipoUsuario === 'complejo' && compare) {
      if (powerLabels.length < 12) {
        let diff = 12 - powerLabels.length
        if (state.checked1) {
          for (let i = 0; i < diff; i++) {
            powerLabelsCompare.push('P1')
          }
          for (let x = 0; x < complejoValuesP1.length; x++) {
            complejoBarsColorsP1.push(redGradient)
          }
        } else if (state.checked2) {
          for (let i = 0; i < diff; i++) {
            powerLabelsCompare.push('P2')
          }
          for (let x = 0; x < complejoValuesP2.length; x++) {
            complejoBarsColorsP2.push(orange)
          }
        } else if (state.checked3) {
          for (let i = 0; i < diff; i++) {
            powerLabelsCompare.push('P3')
          }
          for (let x = 0; x < complejoValuesP3.length; x++) {
            complejoBarsColorsP3.push(yellow)
          }
        } else if (state.checked4) {
          for (let i = 0; i < diff; i++) {
            powerLabelsCompare.push('P4')
          }
          for (let x = 0; x < complejoValuesP4.length; x++) {
            complejoBarsColorsP4.push(green)
          }
        } else if (state.checked5) {
          for (let i = 0; i < diff; i++) {
            powerLabelsCompare.push('P5')
          }
          for (let x = 0; x < complejoValuesP5.length; x++) {
            complejoBarsColorsP5.push(darkGreen)
          }
        } else if (state.checked6) {
          for (let i = 0; i < diff; i++) {
            powerLabelsCompare.push('P6')
          }
          for (let x = 0; x < complejoValuesP6.length; x++) {
            complejoBarsColorsP6.push(blue)
          }
        } else {
          for (let i = 0; i < diff; i++) {
            powerLabelsCompare.push('P0')
          }
        }
        for (let i = 0; i < values.length; i++) {
          barsColors.push(darkblueGradient)
          //powerLabels.push('P0')
        }
      }
    }
    else if (isAdapted === 'SI' && compare && tipoUsuario === 'simple') {
      if (state.checked1) {
        for (let i = 0; i < valuesP1.length; i++) {
          if ((splitAdaptedDate[1] - 1 > i && yearSelected > 2020 && yearSelected.toString() === splitAdaptedDate[2]) || yearSelected < 2021 || (!state.checked1 && !state.checked2 && !state.checked3)) {
            barsColorsP1.push(darkblueGradient)
          } else {
            barsColorsP1.push(redGradient)
          }
          powerLabelsCompare.push('P1')
        }
      } else if (state.checked2) {
        for (let i = 0; i < valuesP2.length; i++) {
          //barsColorsP2.push(yellow)
          if ((splitAdaptedDate[1] - 1 > i && yearSelected > 2020 && yearSelected.toString() === splitAdaptedDate[2]) || yearSelected < 2021 || (!state.checked1 && !state.checked2 && !state.checked3)) {
            barsColorsP2.push(darkblueGradient)
          } else {
            barsColorsP2.push(yellow)
          }
          powerLabelsCompare.push('P2')
        }
      } else if (state.checked3) {
        for (let i = 0; i < valuesP3.length; i++) {
          //barsColorsP3.push(blue)
          if ((splitAdaptedDate[1] - 1 > i && yearSelected > 2020 && yearSelected.toString() === splitAdaptedDate[2]) || yearSelected < 2021 || (!state.checked1 && !state.checked2 && !state.checked3)) {
            barsColorsP3.push(darkblueGradient)
          } else {
            barsColorsP3.push(blue)
          }
          powerLabelsCompare.push('P3')
        }
      } else {
        for (let i = 0; i < values.length; i++) {
          barsColors.push(darkblueGradient)
          powerLabelsCompare.push('P0')
        }
      }
      for (let i = 0; i < values.length; i++) {
        barsColors.push(darkblueGradient)
        //powerLabels.push('P0')
      }
    }
    else {
      for (let i = 0; i < values.length; i++) {
        const value = values[i]

        //Este parte de codigo muestra maximos y minimos en la grafica diferenciados por colores
        if (compare) {
          barsColors.push(darkblueGradient)
          powerLabels.push('P0')
        }
        else {
          barsColors.push(darkblueGradient)
          powerLabels.push('P0')
        }
      }
    }

    if (compare) {
      let barsColorsCompare = [] as any
      let barsColorsCompare2 = [] as any
      let aux, aux2

      if (currentComparePowers && currentComparePowers.powers) {
        currentComparePowers.powers.map(
          (item) => {
            if (isAdapted === 'SI') {
              let labelAux = item.PowerDate.split('/')
              let labelAuxP1 = item.PowerDateP1.split('/')
              let labelAuxP2 = item.PowerDateP2.split('/')
              let labelAuxP3 = item.PowerDateP3.split('/')
              aux = labelAux

              //TO DO acabar de probar correctamente los colores
              //if (yearSelected > splitAdaptedDate[2]) {
              if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                item.PowerValue && valuesCompare.splice(labelAuxP1[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
                setShowLegendYear(true)
              } else if (state.checked1) {
                item.PowerValueP1 && valuesCompare.splice(labelAuxP1[1] - 1, 1, parseFloat(item.PowerValueP1.replace(',', '.')))
              } else if (state.checked2) {
                item.PowerValueP2 && valuesCompare.splice(labelAuxP2[1] - 1, 1, parseFloat(item.PowerValueP2.replace(',', '.')))
              } else if (state.checked3) {
                item.PowerValueP3 && valuesCompare.splice(labelAuxP3[1] - 1, 1, parseFloat(item.PowerValueP3.replace(',', '.')))
              } else if (state.checked4) {
                let labelAuxP4 = item.PowerDateP4.split('/')
                item.PowerValueP4 && valuesCompare.splice(labelAuxP4[1] - 1, 1, parseFloat(item.PowerValueP4.replace(',', '.')))
              } else if (state.checked5) {
                let labelAuxP5 = item.PowerDateP5.split('/')
                item.PowerValueP5 && valuesCompare.splice(labelAuxP5[1] - 1, 1, parseFloat(item.PowerValueP5.replace(',', '.')))
              } else if (state.checked6) {
                let labelAuxP6 = item.PowerDateP6.split('/')
                item.PowerValueP6 && valuesCompare.splice(labelAuxP6[1] - 1, 1, parseFloat(item.PowerValueP6.replace(',', '.')))
              } else {
                item.PowerValue && valuesCompare.splice(labelAux[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
              }
              /*} else {
                item.PowerValue && valuesCompare.splice(labelAux[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
              }*/
            } else {
              let labelAux = item.PowerDate.split('/')
              item.PowerValue && valuesCompare.splice(labelAux[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
            }

            return null
          }
        )

        for (let i = 0; i < valuesCompare.length; i++) {
          const value = valuesCompare[i]

          if (isAdapted === 'SI') {
            if (splitAdaptedDate && splitAdaptedDate[1] !== undefined && aux && aux[1] !== undefined && aux[2] !== undefined) {
              if ((splitAdaptedDate[1] - 1 > aux[1] - 1 && aux[2] > 2020 && aux[2].toString() === splitAdaptedDate[2].toString()) || aux[2] < 2021) {
                barsColorsCompare.push(whiteP0);
              }
            } else if (state.checked1) {
              barsColorsCompare.push(midRed)
            } else if (state.checked2 && tipoUsuario === 'simple') {
              barsColorsCompare.push(midYellow)
            } else if (state.checked2 && tipoUsuario === 'complejo') {
              barsColorsCompare.push(midOrange)
            } else if (state.checked3 && tipoUsuario === 'simple') {
              barsColorsCompare.push(midBlue)
            } else if (state.checked3 && tipoUsuario === 'complejo') {
              barsColorsCompare.push(midYellow)
            } else if (state.checked4) {
              barsColorsCompare.push(midGreen)
            } else if (state.checked5) {
              barsColorsCompare.push(midDarkGreen)
            } else if (state.checked6) {
              barsColorsCompare.push(midBlue)
            } else {
              barsColorsCompare.push(whiteblueGradient)
            }
          } else {
            barsColorsCompare.push(whiteblueGradient)
          }
        }
      }

      if (currentComparePowers2 && currentComparePowers2.powers) {
        currentComparePowers2.powers.map(
          (item) => {
            let labelAux = item.PowerDate.split('/')
            aux2 = labelAux

            if (isAdapted === 'SI') {
              let labelAux = item.PowerDate.split('/')
              let labelAuxP1 = item.PowerDateP1.split('/')
              let labelAuxP2 = item.PowerDateP2.split('/')
              let labelAuxP3 = item.PowerDateP3.split('/')

              //TO DO acabar de probar correctamente los colores
              //if (yearSelected > splitAdaptedDate[2]) {
              if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                item.PowerValue && valuesCompare2.splice(labelAux[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
                setShowLegendYear(true)
              } else if (state.checked1) {
                item.PowerValueP1 && valuesCompare2.splice(labelAuxP1[1] - 1, 1, parseFloat(item.PowerValueP1.replace(',', '.')))
              } else if (state.checked2) {
                item.PowerValueP2 && valuesCompare2.splice(labelAuxP2[1] - 1, 1, parseFloat(item.PowerValueP2.replace(',', '.')))
              } else if (state.checked3) {
                item.PowerValueP3 && valuesCompare2.splice(labelAuxP3[1] - 1, 1, parseFloat(item.PowerValueP3.replace(',', '.')))
              } else if (state.checked4) {
                let labelAuxP4 = item.PowerDateP4.split('/')
                item.PowerValueP4 && valuesCompare2.splice(labelAuxP4[1] - 1, 1, parseFloat(item.PowerValueP4.replace(',', '.')))
              } else if (state.checked5) {
                let labelAuxP5 = item.PowerDateP5.split('/')
                item.PowerValueP5 && valuesCompare2.splice(labelAuxP5[1] - 1, 1, parseFloat(item.PowerValueP5.replace(',', '.')))
              } else if (state.checked6) {
                let labelAuxP6 = item.PowerDateP6.split('/')
                item.PowerValueP6 && valuesCompare2.splice(labelAuxP6[1] - 1, 1, parseFloat(item.PowerValueP6.replace(',', '.')))
              } else {
                item.PowerValue && valuesCompare2.splice(labelAux[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
              }
              /*} else {
                item.PowerValue && valuesCompare2.splice(labelAux[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
              }*/
            } else {
              let labelAux = item.PowerDate.split('/')
              item.PowerValue && valuesCompare2.splice(labelAux[1] - 1, 1, parseFloat(item.PowerValue.replace(',', '.')))
            }
            return null
          }
        )

        for (let i = 0; i < valuesCompare2.length; i++) {
          const value = valuesCompare2[i]

          if (currentComparePowers && currentComparePowers.powers && typecompare !== '2') {
            if (isAdapted === 'SI') {
              if ((splitAdaptedDate[1] - 1 > aux2[1] - 1 && aux2[2] > 2020 && aux2[2].toString() === splitAdaptedDate[2]) || aux2[2] < 2021) {
                barsColorsCompare2.push(white2P0)
              } else if (state.checked1) {
                barsColorsCompare2.push(whiteRed)
              } else if (state.checked2 && tipoUsuario === 'simple') {
                barsColorsCompare2.push(whiteYellow)
              } else if (state.checked2 && tipoUsuario === 'complejo') {
                barsColorsCompare2.push(whiteOrange)
              } else if (state.checked3 && tipoUsuario === 'simple') {
                barsColorsCompare2.push(whiteBlue)
              } else if (state.checked3 && tipoUsuario === 'complejo') {
                barsColorsCompare2.push(whiteYellow)
              } else if (state.checked4) {
                barsColorsCompare2.push(whiteGreen)
              } else if (state.checked5) {
                barsColorsCompare2.push(whiteDarkGreen)
              } else if (state.checked6) {
                barsColorsCompare2.push(whiteBlue)
              } else {
                barsColorsCompare2.push(greyGradient)
              }
            } else {
              barsColorsCompare2.push(greyGradient)
            }
          }
          else {
            if (isAdapted === 'SI') {
              if ((splitAdaptedDate[1] - 1 > aux2[1] - 1 && aux2[2] > 2020 && aux2[2].toString() === splitAdaptedDate[2]) || aux2[2] < 2021) {
                barsColorsCompare2.push(whiteP0)
              } else if (state.checked1) {
                barsColorsCompare2.push(whiteRed)
              } else if (state.checked2 && tipoUsuario === 'simple') {
                barsColorsCompare2.push(whiteYellow)
              } else if (state.checked2 && tipoUsuario === 'complejo') {
                barsColorsCompare2.push(whiteOrange)
              } else if (state.checked3 && tipoUsuario === 'simple') {
                barsColorsCompare2.push(whiteBlue)
              } else if (state.checked3 && tipoUsuario === 'complejo') {
                barsColorsCompare2.push(whiteYellow)
              } else if (state.checked4) {
                barsColorsCompare2.push(whiteGreen)
              } else if (state.checked5) {
                barsColorsCompare2.push(whiteDarkGreen)
              } else if (state.checked6) {
                barsColorsCompare2.push(whiteBlue)
              } else {
                barsColorsCompare2.push(greyGradient)
              }
            } else {
              barsColorsCompare2.push(whiteblueGradient)
            }
          }
        }
      }

      if (typecompare === '0') {
        return {
          labels: labels,
          datasets: [
            {
              barPercentage: 0.3,
              label: yearSelected,
              //data: isAdapted === 'SI' ? valuesP0 : values,
              data: (isAdapted === 'SI' && tipoUsuario === 'simple') ?
                state.checked0 ?
                  valuesP0
                  :
                  state.checked1 ?
                    valuesP1
                    :
                    state.checked2 ?
                      valuesP2
                      :
                      state.checked3 ?
                        valuesP3
                        : []
                : (isAdapted === 'SI' && tipoUsuario === 'complejo') ?
                  state.checked0 ?
                    valuesP0
                    :
                    state.checked1 ?
                      complejoValuesP1
                      : state.checked2 ?
                        complejoValuesP2
                        : state.checked3 ?
                          complejoValuesP3
                          : state.checked4 ?
                            complejoValuesP4
                            : state.checked5 ?
                              complejoValuesP5
                              : state.checked6 ?
                                complejoValuesP6
                                : []
                  : values,
              //backgroundColor: barsColors
              //backgroundColor: isAdapted === 'SI' ? state.checked0 ? barsColors : state.checked1 ? barsColorsP1 : state.checked2 ? barsColorsP2 : state.checked3 ? barsColorsP3 : barsColors : barsColors
              backgroundColor: (isAdapted === 'SI' && tipoUsuario === 'simple') ?
                state.checked0 ?
                  barsColors
                  :
                  state.checked1 ?
                    barsColorsP1
                    :
                    state.checked2 ?
                      barsColorsP2
                      :
                      state.checked3 ?
                        barsColorsP3
                        : []
                : (isAdapted === 'SI' && tipoUsuario === 'complejo') ?
                  state.checked0 ?
                    barsColors
                    :
                    state.checked1 ?
                      complejoBarsColorsP1
                      : state.checked2 ?
                        complejoBarsColorsP2
                        : state.checked3 ?
                          complejoBarsColorsP3
                          : state.checked4 ?
                            complejoBarsColorsP4
                            : state.checked5 ?
                              complejoBarsColorsP5
                              : state.checked6 ?
                                complejoBarsColorsP6
                                : []
                  : barsColors,
            },
            {
              barPercentage: 0.3,
              label:
                (yearSelected === years.year0) ?
                  yearSelected - 1
                  :
                  (yearSelected === years.yearMinus1) ?
                    yearSelected - 1
                    :
                    yearSelected + 1,
              data: valuesCompare,
              backgroundColor: barsColorsCompare
            },
            {
              barPercentage: 0.3,
              label:
                (yearSelected === years.year0) ?
                  yearSelected - 2
                  :
                  (yearSelected === years.yearMinus1) ?
                    yearSelected + 1
                    :
                    yearSelected + 2,
              data: valuesCompare2,
              backgroundColor: barsColorsCompare2
            }
          ]
        }
      }
      else {
        return {
          labels: labels,
          datasets: [
            {
              barPercentage: 0.3,
              label: yearSelected,
              //data: isAdapted === 'SI' ? valuesP0 : values,
              //data: isAdapted === 'SI' ? state.checked0 ? valuesP0 : state.checked1 ? valuesP1 : state.checked2 ? valuesP2 : state.checked3 ? valuesP3 : values : values,
              data: (isAdapted === 'SI' && tipoUsuario === 'simple') ?
                state.checked0 ?
                  valuesP0
                  :
                  state.checked1 ?
                    valuesP1
                    :
                    state.checked2 ?
                      valuesP2
                      :
                      state.checked3 ?
                        valuesP3
                        : []
                : (isAdapted === 'SI' && tipoUsuario === 'complejo') ?
                  state.checked0 ?
                    valuesP0
                    :
                    state.checked1 ?
                      complejoValuesP1
                      : state.checked2 ?
                        complejoValuesP2
                        : state.checked3 ?
                          complejoValuesP3
                          : state.checked4 ?
                            complejoValuesP4
                            : state.checked5 ?
                              complejoValuesP5
                              : state.checked6 ?
                                complejoValuesP6
                                : []
                  : values,
              //backgroundColor: barsColors
              //backgroundColor: isAdapted === 'SI' ? state.checked0 ? barsColors : state.checked1 ? barsColorsP1 : state.checked2 ? barsColorsP2 : state.checked3 ? barsColorsP3 : barsColors : barsColors,
              backgroundColor: (isAdapted === 'SI' && tipoUsuario === 'simple') ?
                state.checked0 ?
                  barsColors
                  :
                  state.checked1 ?
                    barsColorsP1
                    :
                    state.checked2 ?
                      barsColorsP2
                      :
                      state.checked3 ?
                        barsColorsP3
                        : []
                : (isAdapted === 'SI' && tipoUsuario === 'complejo') ?
                  state.checked0 ?
                    barsColors
                    :
                    state.checked1 ?
                      complejoBarsColorsP1
                      : state.checked2 ?
                        complejoBarsColorsP2
                        : state.checked3 ?
                          complejoBarsColorsP3
                          : state.checked4 ?
                            complejoBarsColorsP4
                            : state.checked5 ?
                              complejoBarsColorsP5
                              : state.checked6 ?
                                complejoBarsColorsP6
                                : []
                  : barsColors,
            },
            {
              barPercentage: 0.3,
              label:
                (yearSelected === years.year0 && typecompare === '1') || (yearSelected === years.yearMinus1 && typecompare === '1') ?
                  yearSelected - 1
                  :
                  (yearSelected === years.year0 && typecompare === '2') ?
                    yearSelected - 2
                    :
                    (yearSelected === years.yearMinus2 && typecompare === '1') || (yearSelected === years.yearMinus1 && typecompare === '2') ?
                      yearSelected + 1
                      :
                      yearSelected + 2,
              data: typecompare === '1' ? valuesCompare : valuesCompare2,
              backgroundColor: typecompare === '1' ? barsColorsCompare : barsColorsCompare2
            }
          ]
        }
      }
    }
    else if (isAdapted === 'SI') {
      if (tipoUsuario === 'simple') {
        return {
          labels: labels,
          datasets: [
            {
              barPercentage: 0.3,
              label: t('P1'),
              data: state.checked1 && valuesP1,
              backgroundColor: barsColorsP1
            },
            {
              barPercentage: 0.3,
              label: t('P2'),
              data: state.checked2 ? valuesP2 : values,
              backgroundColor: state.checked2 ? barsColorsP2 : barsColors
            },
            {
              barPercentage: 0.3,
              label: t('P3'),
              data: state.checked3 && valuesP3,
              backgroundColor: barsColorsP3
            }
          ]
        }
      } else if (tipoUsuario === 'complejo') {
        return {
          labels: labels,
          datasets: [
            {
              barPercentage: 0.3,
              label: t('P1'),
              data: valuesP1,
              backgroundColor: barsColorsP1
            },
            {
              barPercentage: 0.3,
              label: t('P2'),
              data: valuesP2,
              backgroundColor: barsColorsP2
            },
            {
              barPercentage: 0.3,
              label: t('P3'),
              data: valuesP3,
              backgroundColor: barsColorsP3
            }
          ]
        }
      }
    }
    else {
      return {
        labels: labels,
        datasets: [
          {
            barPercentage: 0.3,
            label: t('supplies.suppliesDetails.components.consumption.charts.graph.power'),
            data: values,
            backgroundColor: barsColors
          }
        ]
      }
    }
  }

  let maxPower, maxPower1, maxPower2
  let maxContractedPower

  if ((currentSupplyPowers && currentSupplyPowers.maxPower) || !compare) {
    maxPower = (currentSupplyPowers && currentSupplyPowers.maxPower) && parseFloat(currentSupplyPowers.maxPower.replace(',', '.'))
    maxContractedPower = supplyData.power1
    if (isAdapted === 'SI') {
      if (maxContractedPower < supplyData.power2) {
        maxContractedPower = supplyData.power2
      } if (maxContractedPower < supplyData.power3) {
        maxContractedPower = supplyData.power3
      } if (maxContractedPower < supplyData.power4) {
        maxContractedPower = supplyData.power4
      } if (maxContractedPower < supplyData.power5) {
        maxContractedPower = supplyData.power5
      } if (maxContractedPower < supplyData.power6) {
        maxContractedPower = supplyData.power6
      } if (maxContractedPower < supplyData.power7) {
        maxContractedPower = supplyData.power7
      }
    }
  }
  if (currentComparePowers && currentComparePowers.maxPower) {
    maxPower1 = (currentComparePowers && currentComparePowers.maxPower) && parseFloat(currentComparePowers.maxPower.replace(',', '.'))
    maxContractedPower = (currentComparePowers && currentComparePowers.avgPower) && parseFloat(currentComparePowers.avgPower.replace(',', '.'))
  }
  if (currentComparePowers2 && currentComparePowers2.maxPower) {
    maxPower2 = (currentComparePowers2 && currentComparePowers2.maxPower) && parseFloat(currentComparePowers2.maxPower.replace(',', '.'))
    maxContractedPower = (currentComparePowers2 && currentComparePowers2.avgPower) && parseFloat(currentComparePowers2.avgPower.replace(',', '.'))
  }

  if (maxPower < maxPower1) {
    maxPower = maxPower1
  }
  if (maxPower < maxPower2) {
    maxPower = maxPower2
  }

  // let maxYAxis = 0

  // if (maxPower >= maxContractedPower) {
  //   maxYAxis = Math.floor(maxPower)
  // } else {
  //   maxYAxis = Math.floor(maxContractedPower)
  // }

  let missingValue = t('supplies.suppliesDetails.components.consumption.charts.graph.missingData')

  const chartOptions = {
    cornerRadius: 8,
    legend: {
      display: false,
      position: 'bottom'
    },
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function (t, d) {
          if (t.datasetIndex === 0) {
            if (isAdapted === 'SI') {
              if ((tipoUsuario === 'simple' || tipoUsuario === 'complejo') && !compare) {
                if (t.value === 'NaN' || t.value === '1e-7') {
                  return missingValue
                } else {
                  if (t.xLabel !== 'P0') {
                    let index = valuesTooltip[t.index].split(',')
                    return t.yLabel.toFixed(2) + ' kW - ' + index[0]
                  } else {
                    return t.yLabel.toFixed(2) + ' kW'
                  }
                }
              } else {
                if (t.value === 'NaN' || t.value === '1e-7') {
                  return missingValue
                } else {
                  return t.yLabel.toFixed(2) + ' kW'
                }
              }
            } else {
              if (!compare && t.value !== 'NaN' && t.value !== '1e-7') {
                let index = valuesTooltip[t.index]
                return t.yLabel.toFixed(2) + ' kW - ' + index
              } else {
                if (t.value === 'NaN' || t.value === '1e-7') {
                  return missingValue
                } else {
                  return t.yLabel.toFixed(2) + ' kW'
                }
              }
            }
          } else if (t.datasetIndex === 1) {
            if ((tipoUsuario === 'simple' || tipoUsuario === 'complejo') && !compare) {
              if (t.value === 'NaN' || t.value === '1e-7') {
                return missingValue
              } else {
                if (t.xLabel === 'P0') {
                  return t.yLabel.toFixed(2) + ' kW - ' + valuesTooltip[t.index]
                } else {
                  let index = valuesTooltip[t.index].split(',')
                  return t.yLabel.toFixed(2) + ' kW - ' + index[1]
                }
              }
            } else {
              if (t.value === 'NaN' || t.value === '1e-7') {
                return missingValue
              } else {
                return t.yLabel.toFixed(2) + ' kW'
              }
            }
          } else if (t.datasetIndex === 2) {
            if ((tipoUsuario === 'simple' || tipoUsuario === 'complejo') && !compare) {
              if (t.value === 'NaN' || t.value === '1e-7') {
                return missingValue
              } else {
                if (t.xLabel !== 'P0') {
                  let index = valuesTooltip[t.index].split(',')
                  return t.yLabel.toFixed(2) + ' kW - ' + index[2]
                } else {
                  return t.yLabel.toFixed(2) + ' kW'
                }
              }
            } else {
              if (t.value === 'NaN' || t.value === '1e-7') {
                return missingValue
              } else {
                return t.yLabel.toFixed(2) + ' kW'
              }
            }
          }
        }
      }
    },
    scales: {
      xAxes: [{
        //labels: isAdapted !== 'SI' ? powerLabels : (compare || yearSelected < 2021) ? powerLabelsCompare : tipoUsuario === 'simple' ? powerLabels : powerLabelsComp,
        labels: (isAdapted === 'SI' && tipoUsuario === 'simple' && !compare) ? powerLabels : (isAdapted === 'SI' && tipoUsuario === 'complejo' && !compare) ? powerLabelsComp : (compare || yearSelected < 2021) ? powerLabelsCompare : powerLabels,
        ticks: {
          fontColor: '#004571',
          fontSize: 11
        }
      },
      {
        id: 'xAxis1',
        type: 'category',
        offset: true,
        gridLines: {
          display: false,
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
          // max: maxYAxis + 2,
          stepsSize: 50,
          fontColor: '#004571',
          fontSize: 11,
          padding: 16,
          callback: function (label) {
            return label + ' kW'
          }
        }
      }]
    },
    annotation: {
      annotations: [
        isAdapted !== 'SI' &&
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: pCont.p1,
          borderColor: '#e57200',
          borderWidth: 3,
          borderDash: [5],
          borderDashOffset: tipoUsuario === 'complejo' ? 5 : 0,
          label: {
            content: 'PC',
            position: 'right',
            enabled: true,
            backgroundColor: '#e57200',
            fontColor: '#e0e2e2',
            fontStyle: 'normal',
            fontSize: 11,
            padding: 5,
            xAdjust: 0,
            cornerRadius: 10
          },
        },
        state.checked1 && isAdapted === 'SI' &&
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: pCont.p1,
          borderColor: '#d3222a',
          borderWidth: 3,
          borderDash: [5],
          borderDashOffset: tipoUsuario === 'complejo' ? 5 : 0,
          label: {
            content: 'PC1',
            position: 'right',
            enabled: true,
            backgroundColor: '#d3222a',
            fontColor: '#e0e2e2',
            fontStyle: 'normal',
            fontSize: 11,
            padding: 5,
            xAdjust: 0,
            cornerRadius: 10
          },
        },
        state.checked2 && isAdapted === 'SI' &&
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: pCont.p2,
          borderColor: tipoUsuario === 'complejo' ? '#e57200' : '#edab46',
          borderWidth: 3,
          borderDash: [5],
          borderDashOffset: 5,
          label: {
            content: tipoUsuario === 'complejo' ? 'PC2' : 'PC1',
            position: 'right',
            enabled: true,
            backgroundColor: tipoUsuario === 'complejo' ? '#e57200' : '#edab46',
            fontColor: '#e0e2e2',
            fontStyle: 'normal',
            fontSize: 11,
            padding: 5,
            xAdjust: checkProximityFinal(pCont.p2, 2) ? last[1] : 0,
            cornerRadius: 10
          },
        },
        state.checked3 && isAdapted === 'SI' &&
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: pCont.p3,
          borderColor: tipoUsuario === 'complejo' ? '#edab46' : '#009aa6',
          borderWidth: 3,
          borderDash: [5],
          borderDashOffset: 5,
          label: {
            content: tipoUsuario === 'complejo' ? 'PC3' : 'PC2',
            position: 'right',
            enabled: true,
            backgroundColor: tipoUsuario === 'complejo' ? '#edab46' : '#009aa6',
            fontColor: '#e0e2e2',
            fontStyle: 'normal',
            fontSize: 11,
            padding: 5,
            xAdjust: checkProximityFinal(pCont.p3, 3) ? last[2] : 0,
            cornerRadius: 10
          },
        },
        state.checked4 && tipoUsuario === 'complejo' && isAdapted === 'SI' &&
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: pCont.p4,
          borderColor: '#bfbf60',
          borderWidth: 3,
          borderDash: [5],
          borderDashOffset: 5,
          label: {
            content: 'PC4',
            position: 'right',
            enabled: true,
            backgroundColor: '#bfbf60',
            fontColor: '#e0e2e2',
            fontStyle: 'normal',
            fontSize: 11,
            padding: 5,
            xAdjust: checkProximityFinal(pCont.p4, 4) ? last[3] : 0,
            cornerRadius: 10
          },
        },
        state.checked5 && tipoUsuario === 'complejo' && isAdapted === 'SI' &&
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: pCont.p5,
          borderColor: '#5fad83',
          borderWidth: 3,
          borderDash: [5],
          borderDashOffset: 5,
          label: {
            content: 'PC5',
            position: 'right',
            enabled: true,
            backgroundColor: '#5fad83',
            fontColor: '#e0e2e2',
            fontStyle: 'normal',
            fontSize: 11,
            padding: 5,
            xAdjust: checkProximityFinal(pCont.p5, 5) ? last[4] : 0,
            cornerRadius: 10
          },
        },
        state.checked6 && tipoUsuario === 'complejo' && isAdapted === 'SI' &&
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: pCont.p6,
          borderColor: '#009aa6',
          borderWidth: 3,
          borderDash: [5],
          borderDashOffset: 5,
          label: {
            content: 'PC6',
            position: 'right',
            enabled: true,
            backgroundColor: '#009aa6',
            fontColor: '#e0e2e2',
            fontStyle: 'normal',
            fontSize: 11,
            padding: 5,
            xAdjust: checkProximityFinal(pCont.p6, 6) ? last[5] : 0,
            cornerRadius: 10
          },
        }
      ]
    }
  }

  return (
    <>
      <Grid container item md={12} className={classes.container}>
        <Bar
          width={800}
          height={300}
          data={chartData}
          options={chartOptions}
        />
      </Grid>
      <Grid container item md={12} className={classes.pieGraf}>
        {t('supplies.suppliesDetails.components.consumption.charts.views.months')}
      </Grid>
      {
        isAdapted === 'SI' &&
        <DynamicLegend
          state={state}
          setState={setState}
          disabledCheckbox={disabledCheckbox}
          tipoUsuario={tipoUsuario}
          compare={compare}
          setTopLegendYear={setTopLegendYear}
        />
      }
      {
        <Legend
          values={pCont}
          tipoUsuario={tipoUsuario}
          isAdapted={isAdapted}
        />
      }
      {
        supplyData.rate.toString().includes('2.0TD') &&
        <RecomendationLegend
          supplyData={supplyData}
          currentSupplyPowers={currentSupplyPowers}
          adaptedDate={adaptedDate}
          yearSelected={yearSelected}
        />
      }
    </>
  )
}

export default Graph