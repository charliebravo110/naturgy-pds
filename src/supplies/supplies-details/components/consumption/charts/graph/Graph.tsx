import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Bar } from 'react-chartjs-2'

import 'chartjs-plugin-annotation'

import Grid from '@material-ui/core/Grid'

import Legend from '../legend/Legend'

import {
  formatDate,
  formatDateHyphens,
  formatMonthAndYear,
  formatDay,
  formatHour,
  completeDateWithSlash,
  formatDateAndHourStringWithBars,
} from '../../../../../../common/lib/FormatLib'

import useStyles from './Graph.styles'

import {
  setCurrentCompareConsumptions
} from '../../../../../store/actions/SuppliesActions'
import DynamicLegendConsumptions from '../dynamicLegend/DynamicLegendConsumptions'
import { green } from '@material-ui/core/colors'
import { kMaxLength } from 'buffer'

// Plugin para redondear las esquinas de las barras
require('../../../../../../common/components/chart/chartRounded.styles.js')

const Graph = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    setIsLoading,
    currentSupplyConsumptions,
    currentCompareConsumptions,
    consumptionsFilters,
    setConsumptionsFilters,
    isGeneration,
    isGenerationTab,
    energiaReactiva,
    isAdapted,
    adaptedDate,
    tipoUsuario,
    supplyData
  } = props

  for (let i = 0; i < currentSupplyConsumptions.length; i++) {
    if (i !== 0) {
      for (let j = 0; j < currentSupplyConsumptions[i].consumptions.items.length; j++) {
        currentSupplyConsumptions.consumptions.items.push(currentSupplyConsumptions[i].consumptions.items[j]);
      }
    }
  }
  

  const [state, setState] = useState({
    checkedEHCR: true as boolean,
    checkedEHAC: true as boolean,
    checkedEHCCA: true as boolean,
    checkedEHEX: true as boolean,
    checkedEHNG: true as boolean,
    checkedEHCSA: true as boolean
  });

  const [stateConsumptions, setStateConsumptions] = useState({
    checked0: true as boolean,
    //este seria pp en usuario simple
    checked1: true as boolean,
    //este seria pl en usuario simple
    checked2: true as boolean,
    //este seria pv en usuario simple
    checked3: true as boolean,
    checked4: true as boolean,
    checked5: true as boolean,
    checked6: true as boolean
  });

  const [disabledCheckbox, setDisabledCheckbox] = useState({
    disabled0: false as boolean,
    disabled1: false as boolean,
    disabled2: false as boolean,
    disabled3: false as boolean,
    disabled4: false as boolean,
    disabled5: false as boolean,
    disabled6: false as boolean,
  });

  let counterQ = 0 as number
  let quarter = ':00' as string
  let counterQuarter = 0 as number

  let auxLabels = [] as any
  //let auxDates = [] as any
  const [avgReactive, setavgReactive] = useState(0)
  const [avgReactiveCompare, setavgReactiveCompare] = useState(0)
  let avarage
  let avarageCompare
  let splitAdaptedDate: any[] = adaptedDate && adaptedDate.split('/')
  const redGradient = '#d3222a'
  const whiteRed = '#d57c80'
  const orange = '#e57200'
  const whiteOrange = '#f79c43'
  const yellow = '#edab46'
  const whiteYellow = '#ecc892'
  const greenGradient = '#bfbf60'
  const whiteGreenGradient = '#c4c487'
  const darkGreenGradient = '#5fad83'
  const whiteDarkGreenGradient = '#95b8a5'
  const blue = '#009aa6'
  const blueGradient = '#004571'
  const darkblueGradient = 'rgba(0, 69, 113, 1)'
  const whiteblueGradient = 'rgba(102, 195, 202, 1)'
  const transp = 'rgba(0, 69, 113, 0)'
  const white = '#ffffff'
  let barsColors = [] as any
  let barsColorsPV = [] as any
  let barsColorsPL = [] as any
  let barsColorsPP = [] as any
  let barsColorsP0 = [] as any
  let barsColorsCompare = [] as any

  /*const getQuarter = () => {
    if (counterQuarter === 0) {
      quarter = ':15'
      counterQuarter = 1
    } else if (counterQuarter === 1) {
      quarter = ':30'
      counterQuarter = 2
    } else if (counterQuarter === 2) {
      quarter = ':45'
      counterQuarter = 3
    } else if (counterQuarter === 3) {
      quarter = ':00'
      counterQuarter = 0
    }
  }*/
  
  const createDummyItem = (item: any, hour:string) => {
    const itemDummy = JSON.parse(JSON.stringify(item));
    itemDummy.hour=hour;
    itemDummy.consumptionValue='0,0';
    itemDummy.consumptionValueP1='0,0';
    itemDummy.consumptionValueP2='0,0';
    itemDummy.consumptionValueP3='0,0';
    itemDummy.consumptionValueP4='0,0';
    itemDummy.consumptionValueP5='0,0';
    itemDummy.consumptionValueP6='0,0';
    itemDummy.realReading='';
    itemDummy.estimatedReading='';
    itemDummy.collecteWithGaps='';
    itemDummy.readingType='';
    itemDummy.activeInput='0,0';
    itemDummy.activeInputP1='0,0';
    itemDummy.activeInputP2='0,0';
    itemDummy.activeInputP3='0,0';
    itemDummy.activeInputP4='0,0';
    itemDummy.activeInputP5='0,0';
    itemDummy.activeInputP6='0,0';
    itemDummy.activeOutput='0,0';
    itemDummy.reactive1='0,0';
    itemDummy.reactive2='0,0';
    itemDummy.reactive3='0,0';
    itemDummy.reactive4='0,0';
 
    return itemDummy;
  }

  ////Para insertar datos en granularidad periodico respetando los espacios en blanco del array
  const insertGranularityM = (item: any, labels: any, values: any, valuesPV?: any, valuesPL?: any, valuesPP?: any, valuesP0?: any) => { 
    let i
    let labelAux = item.consumptionDate.split('/')
    let month = formatMonthAndYear(formatDate(new Date(labelAux[2], parseInt(labelAux[1]) - 1, 1)))

    for (i = 0; i < labels.length; i++) {
      if (month === labels[i]) {
        if (isGeneration) {


          if (isGenerationTab) {
            if (consumptionsFilters.showR2 === 'S') {
              item.activeOutput && values.splice(i, 0, parseFloat(item.reactive2.replace(',', '.')))
            }
            else if (consumptionsFilters.showR3 === 'S') {
              item.activeOutput && values.splice(i, 0, parseFloat(item.reactive3.replace(',', '.')))
            }
            else {
              item.activeOutput && values.splice(i, 0, parseFloat(item.activeOutput.replace(',', '.')))
            }
          }
          else {
            if (consumptionsFilters.showR1 === 'S') {
              item.activeInput && values.splice(i, 0, parseFloat(item.reactive1.replace(',', '.')))
            }
            else if (consumptionsFilters.showR4 === 'S') {
              item.activeInput && values.splice(i, 0, parseFloat(item.reactive4.replace(',', '.')))
            }
            else {
              item.activeInput && values.splice(i, 0, parseFloat(item.activeInput.replace(',', '.')))

              //si el contador está adaptado
              if (isAdapted === 'SI') {
                if (tipoUsuario === 'simple') {

                  //comprobamos por fecha de adaptación si hay que coger el valor de consumptionValue
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                    
                    item.activeInput && stateConsumptions.checked0 && valuesPL.splice(i, 1, parseFloat(item.activeInput.replace(',', '.')))
                    item.activeInput && stateConsumptions.checked0 && valuesP0.splice(i, 1, parseFloat(item.activeInput.replace(',', '.')))
                    item.activeInput && !stateConsumptions.checked0 && valuesPL.splice(i, 1, 1e-8)
                    item.activeInput && !stateConsumptions.checked0 && valuesP0.splice(i, 1, 1e-8)
                    item.activeInput && valuesPV.splice(i, 1, 1e-8)
                    item.activeInput && valuesPP.splice(i, 1, 1e-8)
                    item.activeInput && stateConsumptions.checked0 && barsColorsPL.splice(i, 1, blueGradient)
                    item.activeInput && stateConsumptions.checked0 && barsColors.splice(i, 1, blueGradient)
                    item.activeInput && stateConsumptions.checked0 && barsColorsP0.splice(i, 1, blueGradient)
                    item.activeInput && !stateConsumptions.checked0 && barsColorsPL.splice(i, 1, transp)
                    item.activeInput && !stateConsumptions.checked0 && barsColors.splice(i, 1, transp)
                    item.activeInput && !stateConsumptions.checked0 && barsColorsP0.splice(i, 1, transp)
                    barsColorsPV.splice(i, 1, white)
                    barsColorsPP.splice(i, 1, white)
                  } else {
                    item.consumptionValueP3 && stateConsumptions.checked3 && valuesPV.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                    item.consumptionValueP2 && stateConsumptions.checked2 && valuesPL.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP1 && stateConsumptions.checked1 && valuesPP.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                    !stateConsumptions.checked3 && valuesPV.splice(i, 1, 1e-8)
                    !stateConsumptions.checked2 && valuesPL.splice(i, 1, 1e-8)
                    !stateConsumptions.checked2 && valuesP0.splice(i, 1, 1e-8)
                    !stateConsumptions.checked1 && valuesPP.splice(i, 1, 1e-8)
                    barsColorsPV.splice(i, 1, blue)
                    barsColorsPL.splice(i, 1, yellow)
                    barsColorsPP.splice(i, 1, redGradient)
                    item.consumptionValueP3 && !stateConsumptions.checked3 && barsColorsPV.splice(i, 1, transp)
                    item.consumptionValueP2 && !stateConsumptions.checked2 && barsColorsPL.splice(i, 1, transp)
                    item.consumptionValueP2 && !stateConsumptions.checked2 && barsColorsP0.splice(i, 1, transp)
                    item.consumptionValueP1 && !stateConsumptions.checked1 && barsColorsPP.splice(i, 1, transp)
                  }
                  //en caso de ser usuario complejo (6 periodos)
                } else {
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                    item.activeInput && stateConsumptions.checked0 && valuesPL.splice(i, 1, parseFloat(item.activeInput.replace(',', '.')))
                    item.activeInput && stateConsumptions.checked0 && valuesP0.splice(i, 1, parseFloat(item.activeInput.replace(',', '.')))
                    item.activeInput && stateConsumptions.checked0 && valuesPV.splice(i, 1, 1e-8)
                    item.activeInput && stateConsumptions.checked0 && valuesPP.splice(i, 1, 1e-8)
                    item.activeInput && stateConsumptions.checked0 && barsColorsPL.splice(i, 1, blueGradient)
                    item.activeInput && stateConsumptions.checked0 && barsColors.splice(i, 1, blueGradient)
                    item.activeInput && stateConsumptions.checked0 && barsColorsP0.splice(i, 1, blueGradient)
                    item.activeInput && !stateConsumptions.checked0 && barsColorsPL.splice(i, 1, transp)
                    item.activeInput && !stateConsumptions.checked0 && barsColors.splice(i, 1, transp)
                    item.activeInput && !stateConsumptions.checked0 && barsColorsP0.splice(i, 1, transp)
                    barsColorsPV.splice(i, 1, white)
                    barsColorsPP.splice(i, 1, white)
                    barsColorsP0.splice(i, 1, blueGradient)
                  } else {
                    let aux1 = false, aux2 = false, aux3 = false, aux4 = false, aux5 = false, aux6 = false
                    if (stateConsumptions.checked1 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                      item.consumptionValueP1 && valuesPV.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                      aux1 = true
                      barsColorsPV.splice(i, 1, redGradient)
                    } else if (stateConsumptions.checked2 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                      item.consumptionValueP2 && valuesPV.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                      aux2 = true
                      barsColorsPV.splice(i, 1, orange)
                    } else if (stateConsumptions.checked3 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                      item.consumptionValueP3 && valuesPV.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                      aux3 = true
                      barsColorsPV.splice(i, 1, yellow)
                    } else if (stateConsumptions.checked4 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                      item.consumptionValueP4 && valuesPV.splice(i, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                      aux4 = true
                      barsColorsPV.splice(i, 1, greenGradient)
                    } else if ((item.consumptionValueP1 && !stateConsumptions.checked1) || (item.consumptionValueP2 && !stateConsumptions.checked2) || (item.consumptionValueP3 && !stateConsumptions.checked3) || (item.consumptionValueP4 && !stateConsumptions.checked4)) {
                      barsColorsPV.splice(i, 1, transp)
                      valuesPV.splice(i, 1, 1e-8)
                    }

                    if (!aux2 && stateConsumptions.checked2 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                      item.consumptionValueP2 && valuesPL.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                      aux2 = true
                      barsColorsPL.splice(i, 1, orange)
                    } else if (!aux3 && stateConsumptions.checked3 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                      item.consumptionValueP3 && valuesPL.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                      aux3 = true
                      barsColorsPL.splice(i, 1, yellow)
                    } else if (!aux4 && stateConsumptions.checked4 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                      item.consumptionValueP4 && valuesPL.splice(i, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                      aux4 = true
                      barsColorsPL.splice(i, 1, greenGradient)
                    } else if (!aux5 && stateConsumptions.checked5 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                      item.consumptionValueP5 && valuesPL.splice(i, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                      aux5 = true
                      barsColorsPL.splice(i, 1, darkGreenGradient)
                    } else if ((item.consumptionValueP2 && !stateConsumptions.checked2) || (item.consumptionValueP3 && !stateConsumptions.checked3) || (item.consumptionValueP4 && !stateConsumptions.checked4) || (item.consumptionValueP5 && !stateConsumptions.checked5)) {
                      barsColorsPL.splice(i, 1, redGradient)
                      valuesPL.splice(i, 1, 1e-8)
                    }

                    if (!aux6 && stateConsumptions.checked6) {
                      item.consumptionValueP6 && valuesPP.splice(i, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                      aux6 = true
                      barsColorsPP.splice(i, 1, redGradient)
                    } else if (item.consumptionValueP6 && !stateConsumptions.checked6) {
                      barsColorsPP.splice(i, 1, transp)
                      valuesPP.splice(i, 1, 1e-8)
                    }
                  }
                }
              }
            }
          }
        }
        else {
          if (consumptionsFilters.showR1 === 'S') {
            item.consumptionValue && values.splice(i, 0, parseFloat(item.reactive1.replace(',', '.')))
          }
          else if (consumptionsFilters.showR4 === 'S') {
            item.consumptionValue && values.splice(i, 0, parseFloat(item.reactive4.replace(',', '.')))
          }
          else {
            item.consumptionValue && values.splice(i, 0, parseFloat(item.consumptionValue.replace(',', '.')))

            if (isAdapted === 'SI') {
              if (tipoUsuario === 'simple') {

                if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                  item.consumptionValue && stateConsumptions.checked0 && valuesPL.splice(i, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                  item.consumptionValue && stateConsumptions.checked0 && valuesP0.splice(i, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                  item.consumptionValue && !stateConsumptions.checked0 && valuesPL.splice(i, 1, 1e-8)
                  item.consumptionValue && !stateConsumptions.checked0 && valuesP0.splice(i, 1, 1e-8)
                  item.consumptionValue && valuesPV.splice(i, 1, 1e-8)
                  item.consumptionValue && valuesPP.splice(i, 1, 1e-8)
                  item.consumptionValue && stateConsumptions.checked0 && barsColorsPL.splice(i, 1, blueGradient)
                  item.consumptionValue && stateConsumptions.checked0 && barsColors.splice(i, 1, blueGradient)
                  item.consumptionValue && stateConsumptions.checked0 && barsColorsP0.splice(i, 1, blueGradient)
                  item.consumptionValue && !stateConsumptions.checked0 && barsColorsPL.splice(i, 1, redGradient)
                  item.consumptionValue && !stateConsumptions.checked0 && barsColors.splice(i, 1, redGradient)
                  item.consumptionValue && !stateConsumptions.checked0 && barsColorsP0.splice(i, 1, redGradient)
                  barsColorsPV.splice(i, 1, white)
                  barsColorsPP.splice(i, 1, white)
                } else {
                  item.consumptionValueP3 && stateConsumptions.checked3 && valuesPV.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  item.consumptionValueP2 && stateConsumptions.checked2 && valuesPL.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP1 && stateConsumptions.checked1 && valuesPP.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  !stateConsumptions.checked3 && valuesPV.splice(i, 1, 1e-8)
                  !stateConsumptions.checked2 && valuesPL.splice(i, 1, 1e-8)
                  !stateConsumptions.checked2 && valuesP0.splice(i, 1, 1e-8)
                  !stateConsumptions.checked1 && valuesPP.splice(i, 1, 1e-8)
                  barsColorsPV.splice(i, 1, blue)
                  barsColorsPL.splice(i, 1, yellow)
                  barsColorsPP.splice(i, 1, redGradient)
                  item.consumptionValueP3 && !stateConsumptions.checked3 && barsColorsPV.splice(i, 1, redGradient)
                  item.consumptionValueP2 && !stateConsumptions.checked2 && barsColorsPL.splice(i, 1, redGradient)
                  item.consumptionValueP2 && !stateConsumptions.checked2 && barsColorsP0.splice(i, 1, redGradient)
                  item.consumptionValueP1 && !stateConsumptions.checked1 && barsColorsPP.splice(i, 1, redGradient)
                }
                //en caso de ser usuario complejo (6 periodos)
              } else {

                if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                  item.consumptionValue && stateConsumptions.checked0 && valuesPL.splice(i, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                  item.consumptionValue && stateConsumptions.checked0 && valuesP0.splice(i, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                  item.consumptionValue && stateConsumptions.checked0 && valuesPV.splice(i, 1, 1e-8)
                  item.consumptionValue && stateConsumptions.checked0 && valuesPP.splice(i, 1, 1e-8)
                  item.consumptionValue && stateConsumptions.checked0 && barsColorsPL.splice(i, 1, blueGradient)
                  item.consumptionValue && stateConsumptions.checked0 && barsColors.splice(i, 1, blueGradient)
                  item.consumptionValue && stateConsumptions.checked0 && barsColorsP0.splice(i, 1, blueGradient)
                  item.consumptionValue && !stateConsumptions.checked0 && barsColorsPL.splice(i, 1, redGradient)
                  item.consumptionValue && !stateConsumptions.checked0 && barsColors.splice(i, 1, redGradient)
                  item.consumptionValue && !stateConsumptions.checked0 && barsColorsP0.splice(i, 1, redGradient)
                  barsColorsPV.splice(i, 1, white)
                  barsColorsPP.splice(i, 1, white)
                  barsColorsP0.splice(i, 1, blueGradient)
                } else {
                  let aux1 = false, aux2 = false, aux3 = false, aux4 = false, aux5 = false, aux6 = false

                  if (stateConsumptions.checked1 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {

                    item.consumptionValueP1 && valuesPV.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                    aux1 = true
                    barsColorsPV.splice(i, 1, redGradient)
                  } else if (stateConsumptions.checked2 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {

                    item.consumptionValueP2 && valuesPV.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                    aux2 = true
                    barsColorsPV.splice(i, 1, orange)

                  } else if (stateConsumptions.checked3 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                    item.consumptionValueP3 && valuesPV.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                    aux3 = true
                    barsColorsPV.splice(i, 1, yellow)
                  } else if (stateConsumptions.checked4 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {

                    item.consumptionValueP4 && valuesPV.splice(i, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                    aux4 = true
                    barsColorsPV.splice(i, 1, greenGradient)
                  } else if ((item.consumptionValueP1 && !stateConsumptions.checked1) || (item.consumptionValueP2 && !stateConsumptions.checked2) || (item.consumptionValueP3 && !stateConsumptions.checked3) || (item.consumptionValueP4 && !stateConsumptions.checked4)) {
                    barsColorsPV.splice(i, 1, redGradient)
                    valuesPV.splice(i, 1, 1e-8)
                  }
                  if ( stateConsumptions.checked2 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                    item.consumptionValueP2 && valuesPL.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                    aux2 = true
                    barsColorsPL.splice(i, 1, orange)
                  } else if (!aux3 && stateConsumptions.checked3 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                    item.consumptionValueP3 && valuesPL.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                    aux3 = true
                    barsColorsPL.splice(i, 1, yellow)
                  } else if (!aux4 && stateConsumptions.checked4 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                    item.consumptionValueP4 && valuesPL.splice(i, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                    aux4 = true
                    barsColorsPL.splice(i, 1, greenGradient)
                  } else if (!aux5 && stateConsumptions.checked5 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                    item.consumptionValueP5 && valuesPL.splice(i, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                    aux5 = true
                    barsColorsPL.splice(i, 1, darkGreenGradient)
                  } else if ((item.consumptionValueP2 && !stateConsumptions.checked2) || (item.consumptionValueP3 && !stateConsumptions.checked3) || (item.consumptionValueP4 && !stateConsumptions.checked4) || (item.consumptionValueP5 && !stateConsumptions.checked5)) {
                    barsColorsPL.splice(i, 1, transp)
                    valuesPL.splice(i, 1, 1e-8)
                  }

                  if (!aux6 && stateConsumptions.checked6) {
                    item.consumptionValueP6 && valuesPP.splice(i, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                    aux6 = true
                    barsColorsPP.splice(i, 1, blue)
                  } else if (item.consumptionValueP6 && !stateConsumptions.checked6) {
                    barsColorsPP.splice(i, 1, blue)
                    valuesPP.splice(i, 1, 1e-8)

                  } 
                }
              }
            }
          }
        }
      }
    }
  }

  //Para insertar datos en granularidad semana respetando los espacios en blanco del array
  const insertGranularityS = (item: any, values: any, valuesPV?: any, valuesPL?: any, valuesPP?: any, valuesP0?: any) => {
    let labelAux = item.consumptionDate.split('/')
    let day = new Date(labelAux[2], labelAux[1] - 1, labelAux[0]).getDay() - 1
    if (day === -1) { day = 6 }

    if (isGeneration) {
      if (isGenerationTab) {
        if (consumptionsFilters.showR2 === 'S') {
          item.activeOutput && values.splice(day, 0, parseFloat(item.reactive2.replace(',', '.')))
        }
        else if (consumptionsFilters.showR3 === 'S') {
          item.activeOutput && values.splice(day, 0, parseFloat(item.reactive3.replace(',', '.')))
        }
        else {
          item.activeOutput && values.splice(day, 0, parseFloat(item.activeOutput.replace(',', '.')))
        }
      }
      else {
        if (consumptionsFilters.showR1 === 'S') {
          item.activeInput && values.splice(day, 0, parseFloat(item.reactive1.replace(',', '.')))
        }
        else if (consumptionsFilters.showR4 === 'S') {
          item.activeInput && values.splice(day, 0, parseFloat(item.reactive4.replace(',', '.')))
        }
        else {
          item.activeInput && values.splice(day, 0, parseFloat(item.activeInput.replace(',', '.')))

          //si el contador está adaptado
          if (isAdapted === 'SI') {
            //diferenciamos entre los dos tipos de usuario
            if (tipoUsuario === 'simple') {
              //comprobamos por fecha de adaptación si hay que coger el valor de activeInput
              if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                item.activeInput && stateConsumptions.checked0 && valuesPL.splice(day, 1, parseFloat(item.activeInput.replace(',', '.')))
                item.activeInput && stateConsumptions.checked0 && valuesP0.splice(day, 1, parseFloat(item.activeInput.replace(',', '.')))
                item.activeInput && !stateConsumptions.checked0 && valuesPL.splice(day, 1, 1e-8)
                item.activeInput && !stateConsumptions.checked0 && valuesP0.splice(day, 1, 1e-8)
                item.activeInput && valuesPV.splice(day, 1, 1e-8)
                item.activeInput && valuesPP.splice(day, 1, 1e-8)
                item.activeInput && stateConsumptions.checked0 && barsColorsPL.splice(day, 1, blueGradient)
                item.activeInput && stateConsumptions.checked0 && barsColors.splice(day, 1, blueGradient)
                item.activeInput && stateConsumptions.checked0 && barsColorsP0.splice(day, 1, blueGradient)
                item.activeInput && !stateConsumptions.checked0 && barsColorsPL.splice(day, 1, greenGradient)
                item.activeInput && !stateConsumptions.checked0 && barsColors.splice(day, 1, greenGradient)
                item.activeInput && !stateConsumptions.checked0 && barsColorsP0.splice(day, 1, greenGradient)
                barsColorsPV.splice(day, 1, white)
                barsColorsPP.splice(day, 1, white)
              } else {
                item.consumptionValueP3 && stateConsumptions.checked3 && valuesPV.splice(day, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                item.consumptionValueP2 && stateConsumptions.checked2 && valuesPL.splice(day, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                item.consumptionValueP1 && stateConsumptions.checked1 && valuesPP.splice(day, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                !stateConsumptions.checked3 && valuesPV.splice(day, 1, 1e-8)
                !stateConsumptions.checked2 && valuesPL.splice(day, 1, 1e-8)
                !stateConsumptions.checked2 && valuesP0.splice(day, 1, 1e-8)
                !stateConsumptions.checked1 && valuesPP.splice(day, 1, 1e-8)
                barsColorsPV.splice(day, 1, blue)
                barsColorsPL.splice(day, 1, yellow)
                barsColorsPP.splice(day, 1, redGradient)
                item.consumptionValueP3 && !stateConsumptions.checked3 && barsColorsPV.splice(day, 1, greenGradient)
                item.consumptionValueP2 && !stateConsumptions.checked2 && barsColorsPL.splice(day, 1, greenGradient)
                item.consumptionValueP2 && !stateConsumptions.checked2 && barsColorsP0.splice(day, 1, greenGradient)
                item.consumptionValueP1 && !stateConsumptions.checked1 && barsColorsPP.splice(day, 1, greenGradient)
                //item.consumptionValue && barsColors.splice(day, 1, blueGradient)
              }
              //en caso de ser usuario complejo (6 periodos)
            }
            else {
              if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                item.activeInput && stateConsumptions.checked0 && valuesPL.splice(day, 1, parseFloat(item.activeInput.replace(',', '.')))
                item.activeInput && stateConsumptions.checked0 && valuesP0.splice(day, 1, parseFloat(item.activeInput.replace(',', '.')))
                item.activeInput && valuesPV.splice(day, 1, 1e-8)
                item.activeInput && valuesPP.splice(day, 1, 1e-8)
                item.activeInput && stateConsumptions.checked0 && barsColorsPL.splice(day, 1, blueGradient)
                item.activeInput && stateConsumptions.checked0 && barsColors.splice(day, 1, blueGradient)
                item.activeInput && stateConsumptions.checked0 && barsColorsP0.splice(day, 1, blueGradient)
                item.activeInput && !stateConsumptions.checked0 && barsColorsPL.splice(day, 1, greenGradient)
                item.activeInput && !stateConsumptions.checked0 && barsColors.splice(day, 1, greenGradient)
                item.activeInput && !stateConsumptions.checked0 && barsColorsP0.splice(day, 1, greenGradient)
                barsColorsPV.splice(day, 1, white)
                barsColorsPP.splice(day, 1, white)
                barsColorsP0.splice(day, 1, blueGradient)
              } else {
                let aux1 = false, aux2 = false, aux3 = false, aux4 = false, aux5 = false, aux6 = false

                item.activeInput && barsColors.splice(day, 1, blueGradient)

                if (stateConsumptions.checked1 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                  item.consumptionValueP1 && valuesPV.splice(day, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  aux1 = true
                  barsColorsPV.splice(day, 1, redGradient)
                } else if (stateConsumptions.checked2 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                  item.consumptionValueP2 && valuesPV.splice(day, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  aux2 = true
                  barsColorsPV.splice(day, 1, orange)
                } else if (stateConsumptions.checked3 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                  item.consumptionValueP3 && valuesPV.splice(day, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  aux3 = true
                  barsColorsPV.splice(day, 1, yellow)
                } else if (stateConsumptions.checked4 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                  item.consumptionValueP4 && valuesPV.splice(day, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                  aux4 = true
                  barsColorsPV.splice(day, 1, greenGradient)
                } else if (((item.consumptionValueP1 && !stateConsumptions.checked1) || (item.consumptionValueP2 && !stateConsumptions.checked2) || (item.consumptionValueP3 && !stateConsumptions.checked3) || (item.consumptionValueP4 && !stateConsumptions.checked4)) || (!item.consumptionValueP1 && !item.consumptionValueP2 && !item.consumptionValueP3 && !item.consumptionValueP4 && !item.consumptionValueP5)) {
                  barsColorsPV.splice(day, 1, transp)
                  valuesPV.splice(day, 1, 1e-8)
                }

                if (!aux2 && stateConsumptions.checked2 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                  item.consumptionValueP2 && valuesPL.splice(day, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  aux2 = true
                  barsColorsPL.splice(day, 1, orange)
                } else if (!aux3 && stateConsumptions.checked3 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                  item.consumptionValueP3 && valuesPL.splice(day, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  aux3 = true
                  barsColorsPL.splice(day, 1, yellow)
                } else if (!aux4 && stateConsumptions.checked4 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                  item.consumptionValueP4 && valuesPL.splice(day, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                  aux4 = true
                  barsColorsPL.splice(day, 1, greenGradient)
                } else if (!aux5 && stateConsumptions.checked5 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                  item.consumptionValueP5 && valuesPL.splice(day, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                  aux5 = true
                  barsColorsPL.splice(day, 1, darkGreenGradient)
                } else if (((item.consumptionValueP2 && !stateConsumptions.checked2) || (item.consumptionValueP3 && !stateConsumptions.checked3) || (item.consumptionValueP4 && !stateConsumptions.checked4) || (item.consumptionValueP5 && !stateConsumptions.checked5)) || (!item.consumptionValueP1 && !item.consumptionValueP2 && !item.consumptionValueP3 && !item.consumptionValueP4 && !item.consumptionValueP5)) {
                  barsColorsPL.splice(day, 1, transp)
                  valuesPL.splice(day, 1, 1e-8)
                }

                if (!aux6 && stateConsumptions.checked6) {
                  item.consumptionValueP6 && valuesPP.splice(day, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                  aux6 = true
                  barsColorsPP.splice(day, 1, blue)
                } else if (item.consumptionValueP6 && !stateConsumptions.checked6) {
                  barsColorsPP.splice(day, 1, transp)
                  valuesPP.splice(day, 1, 1e-8)
                }
              }
            }
          }
        }
      }
    }
    else {
      if (consumptionsFilters.showR1 === 'S') {
        item.consumptionValue && values.splice(day, 0, parseFloat(item.reactive1.replace(',', '.')))
      }
      else if (consumptionsFilters.showR4 === 'S') {
        item.consumptionValue && values.splice(day, 0, parseFloat(item.reactive4.replace(',', '.')))
      }
      else {
        item.consumptionValue && values.splice(day, 0, parseFloat(item.consumptionValue.replace(',', '.')))

        //si el contador está adaptado
        if (isAdapted === 'SI') {
          //diferenciamos entre los dos tipos de usuario
          if (tipoUsuario === 'simple') {
            //comprobamos por fecha de adaptación si hay que coger el valor de consumptionValue
            if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
              item.consumptionValue && stateConsumptions.checked0 && valuesPL.splice(day, 1, parseFloat(item.consumptionValue.replace(',', '.')))
              item.consumptionValue && stateConsumptions.checked0 && valuesP0.splice(day, 1, parseFloat(item.consumptionValue.replace(',', '.')))
              item.consumptionValue && !stateConsumptions.checked0 && valuesPL.splice(day, 1, 1e-8)
              item.consumptionValue && !stateConsumptions.checked0 && valuesP0.splice(day, 1, 1e-8)
              item.consumptionValue && valuesPV.splice(day, 1, 1e-8)
              item.consumptionValue && valuesPP.splice(day, 1, 1e-8)
              item.consumptionValue && stateConsumptions.checked0 && barsColorsPL.splice(day, 1, blueGradient)
              item.consumptionValue && stateConsumptions.checked0 && barsColors.splice(day, 1, blueGradient)
              item.consumptionValue && stateConsumptions.checked0 && barsColorsP0.splice(day, 1, blueGradient)
              item.consumptionValue && !stateConsumptions.checked0 && barsColorsPL.splice(day, 1, transp)
              item.consumptionValue && !stateConsumptions.checked0 && barsColors.splice(day, 1, transp)
              item.consumptionValue && !stateConsumptions.checked0 && barsColorsP0.splice(day, 1, transp)
              barsColorsPV.splice(day, 1, white)
              barsColorsPP.splice(day, 1, white)
            } else {
              item.consumptionValueP3 && stateConsumptions.checked3 && valuesPV.splice(day, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
              item.consumptionValueP2 && stateConsumptions.checked2 && valuesPL.splice(day, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
              item.consumptionValueP1 && stateConsumptions.checked1 && valuesPP.splice(day, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
              !stateConsumptions.checked3 && valuesPV.splice(day, 1, 1e-8)
              !stateConsumptions.checked2 && valuesPL.splice(day, 1, 1e-8)
              !stateConsumptions.checked2 && valuesP0.splice(day, 1, 1e-8)
              !stateConsumptions.checked1 && valuesPP.splice(day, 1, 1e-8)
              barsColorsPV.splice(day, 1, blue)
              barsColorsPL.splice(day, 1, yellow)
              barsColorsPP.splice(day, 1, redGradient)
              item.consumptionValueP3 && !stateConsumptions.checked3 && barsColorsPV.splice(day, 1, transp)
              item.consumptionValueP2 && !stateConsumptions.checked2 && barsColorsPL.splice(day, 1, transp)
              item.consumptionValueP2 && !stateConsumptions.checked2 && barsColorsP0.splice(day, 1, transp)
              item.consumptionValueP1 && !stateConsumptions.checked1 && barsColorsPP.splice(day, 1, transp)
              //item.consumptionValue && barsColors.splice(day, 1, blueGradient)
            }
            //en caso de ser usuario complejo (6 periodos)
          }
          else {
            if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
              item.consumptionValue && stateConsumptions.checked0 && valuesPL.splice(day, 1, parseFloat(item.consumptionValue.replace(',', '.')))
              item.consumptionValue && stateConsumptions.checked0 && valuesP0.splice(day, 1, parseFloat(item.consumptionValue.replace(',', '.')))
              item.consumptionValue && valuesPV.splice(day, 1, 1e-8)
              item.consumptionValue && valuesPP.splice(day, 1, 1e-8)
              //splice modifica el array 
              item.consumptionValue && stateConsumptions.checked0 && barsColorsPL.splice(day, 1, blueGradient)
              item.consumptionValue && stateConsumptions.checked0 && barsColors.splice(day, 1, blueGradient)
              item.consumptionValue && stateConsumptions.checked0 && barsColorsP0.splice(day, 1, blueGradient)
              item.consumptionValue && !stateConsumptions.checked0 && barsColorsPL.splice(day, 1, transp)
              item.consumptionValue && !stateConsumptions.checked0 && barsColors.splice(day, 1, transp)
              item.consumptionValue && !stateConsumptions.checked0 && barsColorsP0.splice(day, 1, transp)
              barsColorsPV.splice(day, 1, white)
              barsColorsPP.splice(day, 1, white)
              barsColorsP0.splice(day, 1, blueGradient)
            } else {
              let aux1 = false, aux2 = false, aux3 = false, aux4 = false, aux5 = false, aux6 = false

              item.consumptionValue && barsColors.splice(day, 1, blueGradient)

              if (stateConsumptions.checked1 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                item.consumptionValueP1 && valuesPV.splice(day, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                aux1 = true
                barsColorsPV.splice(day, 1, redGradient)
              } else if (stateConsumptions.checked2 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                item.consumptionValueP2 && valuesPV.splice(day, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                aux2 = true
                barsColorsPV.splice(day, 1, orange)
              } else if (stateConsumptions.checked3 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                item.consumptionValueP3 && valuesPV.splice(day, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                aux3 = true
                barsColorsPV.splice(day, 1, yellow)
              } else if (stateConsumptions.checked4 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                item.consumptionValueP4 && valuesPV.splice(day, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                aux4 = true
                barsColorsPV.splice(day, 1, greenGradient)
              } else if (((item.consumptionValueP1 && !stateConsumptions.checked1) || (item.consumptionValueP2 && !stateConsumptions.checked2) || (item.consumptionValueP3 && !stateConsumptions.checked3) || (item.consumptionValueP4 && !stateConsumptions.checked4)) || (!item.consumptionValueP1 && !item.consumptionValueP2 && !item.consumptionValueP3 && !item.consumptionValueP4 && !item.consumptionValueP5)) {
                barsColorsPV.splice(day, 1, transp)
                valuesPV.splice(day, 1, 1e-8)
              }

              if (!aux2 && stateConsumptions.checked2 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                item.consumptionValueP2 && valuesPL.splice(day, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                aux2 = true
                barsColorsPL.splice(day, 1, orange)
              } else if (!aux3 && stateConsumptions.checked3 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                item.consumptionValueP3 && valuesPL.splice(day, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                aux3 = true
                barsColorsPL.splice(day, 1, yellow)
              } else if (!aux4 && stateConsumptions.checked4 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                item.consumptionValueP4 && valuesPL.splice(day, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                aux4 = true
                barsColorsPL.splice(day, 1, greenGradient)
              } else if (!aux5 && stateConsumptions.checked5 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                item.consumptionValueP5 && valuesPL.splice(day, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                aux5 = true
                barsColorsPL.splice(day, 1, darkGreenGradient)
              } else if (((item.consumptionValueP2 && !stateConsumptions.checked2) || (item.consumptionValueP3 && !stateConsumptions.checked3) || (item.consumptionValueP4 && !stateConsumptions.checked4) || (item.consumptionValueP5 && !stateConsumptions.checked5)) || (!item.consumptionValueP1 && !item.consumptionValueP2 && !item.consumptionValueP3 && !item.consumptionValueP4 && !item.consumptionValueP5)) {
                barsColorsPL.splice(day, 1, transp)
                valuesPL.splice(day, 1, 1e-8)
              }

              if (!aux6 && stateConsumptions.checked6) {
                item.consumptionValueP6 && valuesPP.splice(day, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                aux6 = true
                barsColorsPP.splice(day, 1, blue)
              } else if (item.consumptionValueP6 && !stateConsumptions.checked6) {
                barsColorsPP.splice(day, 1, transp)
                valuesPP.splice(day, 1, 1e-8)
              }
            }
          }
        }
      }
    }
  }

  //Para insertar datos en granularidad dia respetando los espacios en blanco del array
  const insertGranularityD = (item: any, values: any, valuesPV?: any, valuesPL?: any, valuesPP?: any, valuesP0?: any) => {
    let labelAux = item.consumptionDate.split('/')

    if (isGeneration) {
      if (isGenerationTab) {
        if (consumptionsFilters.showR2 === 'S') {
          item.activeOutput && values.splice(labelAux[0] - 1, 0, parseFloat(item.reactive2.replace(',', '.')))
        }
        else if (consumptionsFilters.showR3 === 'S') {
          item.activeOutput && values.splice(labelAux[0] - 1, 0, parseFloat(item.reactive3.replace(',', '.')))
        }
        else {
          item.activeOutput && values.splice(labelAux[0] - 1, 0, parseFloat(item.activeOutput.replace(',', '.')))
        }
      }
      else {
        if (consumptionsFilters.showR1 === 'S') {
          item.activeInput && values.splice(labelAux[0] - 1, 0, parseFloat(item.reactive1.replace(',', '.')))
        }
        else if (consumptionsFilters.showR4 === 'S') {
          item.activeInput && values.splice(labelAux[0] - 1, 0, parseFloat(item.reactive4.replace(',', '.')))
        }
        else {
          item.activeInput && values.splice(labelAux[0] - 1, 0, parseFloat(item.activeInput.replace(',', '.')))

          //si el contador está adaptado
          if (isAdapted === 'SI') {
            //diferenciamos entre los dos tipos de usuario
            if (tipoUsuario === 'simple') {
              //comprobamos por fecha de adaptación si hay que coger el valor de activeInput
              if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                item.activeInput && stateConsumptions.checked0 && valuesPL.splice(labelAux[0] - 1, 1, parseFloat(item.activeInput.replace(',', '.')))
                item.activeInput && stateConsumptions.checked0 && valuesP0.splice(labelAux[0] - 1, 1, parseFloat(item.activeInput.replace(',', '.')))
                item.activeInput && !stateConsumptions.checked0 && valuesPL.splice(labelAux[0] - 1, 1, 1e-8)
                item.activeInput && !stateConsumptions.checked0 && valuesP0.splice(labelAux[0] - 1, 1, 1e-8)
                item.activeInput && valuesPV.splice(labelAux[0] - 1, 1, 1e-8)
                item.activeInput && valuesPP.splice(labelAux[0] - 1, 1, 1e-8)
                item.activeInput && stateConsumptions.checked0 && barsColorsPL.splice(labelAux[0] - 1, 1, blueGradient)
                item.activeInput && stateConsumptions.checked0 && barsColors.splice(labelAux[0] - 1, 1, blueGradient)
                item.activeInput && stateConsumptions.checked0 && barsColorsP0.splice(labelAux[0] - 1, 1, blueGradient)
                item.activeInput && !stateConsumptions.checked0 && barsColorsPL.splice(labelAux[0] - 1, 1, transp)
                item.activeInput && !stateConsumptions.checked0 && barsColors.splice(labelAux[0] - 1, 1, transp)
                item.activeInput && !stateConsumptions.checked0 && barsColorsP0.splice(labelAux[0] - 1, 1, transp)
                barsColorsPV.splice(labelAux[0] - 1, 1, white)
                barsColorsPP.splice(labelAux[0] - 1, 1, white)
              } else {
                item.consumptionValueP3 && stateConsumptions.checked3 && valuesPV.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                item.consumptionValueP2 && stateConsumptions.checked2 && valuesPL.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                item.consumptionValueP1 && stateConsumptions.checked1 && valuesPP.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                !stateConsumptions.checked3 && valuesPV.splice(labelAux[0] - 1, 1, 1e-8)
                !stateConsumptions.checked2 && valuesPL.splice(labelAux[0] - 1, 1, 1e-8)
                !stateConsumptions.checked2 && valuesP0.splice(labelAux[0] - 1, 1, 1e-8)
                !stateConsumptions.checked1 && valuesPP.splice(labelAux[0] - 1, 1, 1e-8)
                barsColorsPV.splice(labelAux[0] - 1, 1, blue)
                barsColorsPL.splice(labelAux[0] - 1, 1, yellow)
                barsColorsPP.splice(labelAux[0] - 1, 1, redGradient)
                item.consumptionValueP3 && !stateConsumptions.checked3 && barsColorsPV.splice(labelAux[0] - 1, 1, transp)
                item.consumptionValueP2 && !stateConsumptions.checked2 && barsColorsPL.splice(labelAux[0] - 1, 1, transp)
                item.consumptionValueP2 && !stateConsumptions.checked2 && barsColorsP0.splice(labelAux[0] - 1, 1, transp)
                item.consumptionValueP1 && !stateConsumptions.checked1 && barsColorsPP.splice(labelAux[0] - 1, 1, transp)
                //item.consumptionValue && barsColors.splice(day, 1, blueGradient)
              }
              //en caso de ser usuario complejo (6 periodos)
            }
            else {
              if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                item.activeInput && stateConsumptions.checked0 && valuesPL.splice(labelAux[0] - 1, 1, parseFloat(item.activeInput.replace(',', '.')))
                item.activeInput && stateConsumptions.checked0 && valuesP0.splice(labelAux[0] - 1, 1, parseFloat(item.activeInput.replace(',', '.')))
                item.activeInput && stateConsumptions.checked0 && valuesPV.splice(labelAux[0] - 1, 1, 1e-8)
                item.activeInput && stateConsumptions.checked0 && valuesPP.splice(labelAux[0] - 1, 1, 1e-8)
                item.activeInput && barsColorsPL.splice(labelAux[0] - 1, 1, blueGradient)
                item.activeInput && barsColors.splice(labelAux[0] - 1, 1, blueGradient)
                barsColorsPV.splice(labelAux[0] - 1, 1, white)
                barsColorsPP.splice(labelAux[0] - 1, 1, white)
                barsColorsP0.splice(labelAux[0] - 1, 1, blueGradient)
              } else {
                let aux1 = false, aux2 = false, aux3 = false, aux4 = false, aux5 = false, aux6 = false

                item.activeInput && barsColors.splice(labelAux[0] - 1, 1, blueGradient)

                if (stateConsumptions.checked1 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                  item.consumptionValueP1 && valuesPV.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  aux1 = true
                  barsColorsPV.splice(labelAux[0] - 1, 1, redGradient)
                } else if (stateConsumptions.checked2 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                  item.consumptionValueP2 && valuesPV.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  aux2 = true
                  barsColorsPV.splice(labelAux[0] - 1, 1, orange)
                } else if (stateConsumptions.checked3 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                  item.consumptionValueP3 && valuesPV.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  aux3 = true
                  barsColorsPV.splice(labelAux[0] - 1, 1, yellow)
                } else if (stateConsumptions.checked4 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                  item.consumptionValueP4 && valuesPV.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                  aux4 = true
                  barsColorsPV.splice(labelAux[0] - 1, 1, greenGradient)
                } else if (((item.consumptionValueP1 && !stateConsumptions.checked1) || (item.consumptionValueP2 && !stateConsumptions.checked2) || (item.consumptionValueP3 && !stateConsumptions.checked3) || (item.consumptionValueP4 && !stateConsumptions.checked4)) || (!item.consumptionValueP1 && !item.consumptionValueP2 && !item.consumptionValueP3 && !item.consumptionValueP4 && !item.consumptionValueP5)) {
                  barsColorsPV.splice(labelAux[0] - 1, 1, transp)
                  valuesPV.splice(labelAux[0] - 1, 1, 1e-8)
                }

                if (!aux2 && stateConsumptions.checked2 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                  item.consumptionValueP2 && valuesPL.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  aux2 = true
                  barsColorsPL.splice(labelAux[0] - 1, 1, orange)
                } else if (!aux3 && stateConsumptions.checked3 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                  item.consumptionValueP3 && valuesPL.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  aux3 = true
                  barsColorsPL.splice(labelAux[0] - 1, 1, yellow)
                } else if (!aux4 && stateConsumptions.checked4 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                  item.consumptionValueP4 && valuesPL.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                  aux4 = true
                  barsColorsPL.splice(labelAux[0] - 1, 1, greenGradient)
                } else if (!aux5 && stateConsumptions.checked5 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                  item.consumptionValueP5 && valuesPL.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                  aux5 = true
                  barsColorsPL.splice(labelAux[0] - 1, 1, darkGreenGradient)
                } else if (((item.consumptionValueP2 && !stateConsumptions.checked2) || (item.consumptionValueP3 && !stateConsumptions.checked3) || (item.consumptionValueP4 && !stateConsumptions.checked4) || (item.consumptionValueP5 && !stateConsumptions.checked5)) || (!item.consumptionValueP1 && !item.consumptionValueP2 && !item.consumptionValueP3 && !item.consumptionValueP4 && !item.consumptionValueP5)) {
                  barsColorsPL.splice(labelAux[0] - 1, 1, transp)
                  valuesPL.splice(labelAux[0] - 1, 1, 1e-8)
                }

                if (!aux6 && stateConsumptions.checked6) {
                  item.consumptionValueP6 && valuesPP.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                  aux6 = true
                  barsColorsPP.splice(labelAux[0] - 1, 1, blue)
                } else if (item.consumptionValueP6 && !stateConsumptions.checked6) {
                  barsColorsPP.splice(labelAux[0] - 1, 1, transp)
                  valuesPP.splice(labelAux[0] - 1, 1, 1e-8)
                }
              }
            }
          }
        }
      }
    }
    else {
      if (consumptionsFilters.showR1 === 'S') {
        item.consumptionValue && values.splice(labelAux[0] - 1, 0, parseFloat(item.reactive1.replace(',', '.')))
      }
      else if (consumptionsFilters.showR4 === 'S') {
        item.consumptionValue && values.splice(labelAux[0] - 1, 0, parseFloat(item.reactive4.replace(',', '.')))
      }
      else {
        item.consumptionValue && values.splice(labelAux[0] - 1, 0, parseFloat(item.consumptionValue.replace(',', '.')))

        //si el contador está adaptado
        if (isAdapted === 'SI') {
          //diferenciamos entre los dos tipos de usuario
          if (tipoUsuario === 'simple') {
            //comprobamos por fecha de adaptación si hay que coger el valor de consumptionValue
            if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
              item.consumptionValue && stateConsumptions.checked0 && valuesPL.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValue.replace(',', '.')))
              item.consumptionValue && stateConsumptions.checked0 && valuesP0.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValue.replace(',', '.')))
              item.consumptionValue && !stateConsumptions.checked0 && valuesPL.splice(labelAux[0] - 1, 1, 1e-8)
              item.consumptionValue && !stateConsumptions.checked0 && valuesP0.splice(labelAux[0] - 1, 1, 1e-8)
              item.consumptionValue && valuesPV.splice(labelAux[0] - 1, 1, 1e-8)
              item.consumptionValue && valuesPP.splice(labelAux[0] - 1, 1, 1e-8)
              item.consumptionValue && stateConsumptions.checked0 && barsColorsPL.splice(labelAux[0] - 1, 1, blueGradient)
              item.consumptionValue && stateConsumptions.checked0 && barsColors.splice(labelAux[0] - 1, 1, blueGradient)
              item.consumptionValue && stateConsumptions.checked0 && barsColorsP0.splice(labelAux[0] - 1, 1, blueGradient)
              item.consumptionValue && !stateConsumptions.checked0 && barsColorsPL.splice(labelAux[0] - 1, 1, transp)
              item.consumptionValue && !stateConsumptions.checked0 && barsColors.splice(labelAux[0] - 1, 1, transp)
              item.consumptionValue && !stateConsumptions.checked0 && barsColorsP0.splice(labelAux[0] - 1, 1, transp)
              barsColorsPV.splice(labelAux[0] - 1, 1, white)
              barsColorsPP.splice(labelAux[0] - 1, 1, white)
            } else {
              item.consumptionValueP3 && stateConsumptions.checked3 && valuesPV.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
              item.consumptionValueP2 && stateConsumptions.checked2 && valuesPL.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
              item.consumptionValueP1 && stateConsumptions.checked1 && valuesPP.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
              !stateConsumptions.checked3 && valuesPV.splice(labelAux[0] - 1, 1, 1e-8)
              !stateConsumptions.checked2 && valuesPL.splice(labelAux[0] - 1, 1, 1e-8)
              !stateConsumptions.checked2 && valuesP0.splice(labelAux[0] - 1, 1, 1e-8)
              !stateConsumptions.checked1 && valuesPP.splice(labelAux[0] - 1, 1, 1e-8)
              barsColorsPV.splice(labelAux[0] - 1, 1, blue)
              barsColorsPL.splice(labelAux[0] - 1, 1, yellow)
              barsColorsPP.splice(labelAux[0] - 1, 1, redGradient)
              item.consumptionValueP3 && !stateConsumptions.checked3 && barsColorsPV.splice(labelAux[0] - 1, 1, transp)
              item.consumptionValueP2 && !stateConsumptions.checked2 && barsColorsPL.splice(labelAux[0] - 1, 1, transp)
              item.consumptionValueP2 && !stateConsumptions.checked2 && barsColorsP0.splice(labelAux[0] - 1, 1, transp)
              item.consumptionValueP1 && !stateConsumptions.checked1 && barsColorsPP.splice(labelAux[0] - 1, 1, transp)
              //item.consumptionValue && barsColors.splice(day, 1, blueGradient)
            }
            //en caso de ser usuario complejo (6 periodos)
          }
          else {
            if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
              item.consumptionValue && stateConsumptions.checked0 && valuesPL.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValue.replace(',', '.')))
              item.consumptionValue && stateConsumptions.checked0 && valuesP0.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValue.replace(',', '.')))
              item.consumptionValue && stateConsumptions.checked0 && valuesPV.splice(labelAux[0] - 1, 1, 1e-8)
              item.consumptionValue && stateConsumptions.checked0 && valuesPP.splice(labelAux[0] - 1, 1, 1e-8)
              item.consumptionValue && barsColorsPL.splice(labelAux[0] - 1, 1, blueGradient)
              item.consumptionValue && barsColors.splice(labelAux[0] - 1, 1, blueGradient)
              barsColorsPV.splice(labelAux[0] - 1, 1, white)
              barsColorsPP.splice(labelAux[0] - 1, 1, white)
              barsColorsP0.splice(labelAux[0] - 1, 1, blueGradient)
            } else {
              let aux1 = false, aux2 = false, aux3 = false, aux4 = false, aux5 = false, aux6 = false

              item.consumptionValue && barsColors.splice(labelAux[0] - 1, 1, blueGradient)

              if (stateConsumptions.checked1 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                item.consumptionValueP1 && valuesPV.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                aux1 = true
                barsColorsPV.splice(labelAux[0] - 1, 1, redGradient)
              } else if (stateConsumptions.checked2 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                item.consumptionValueP2 && valuesPV.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                aux2 = true
                barsColorsPV.splice(labelAux[0] - 1, 1, orange)
              } else if (stateConsumptions.checked3 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                item.consumptionValueP3 && valuesPV.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                aux3 = true
                barsColorsPV.splice(labelAux[0] - 1, 1, yellow)
              } else if (stateConsumptions.checked4 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                item.consumptionValueP4 && valuesPV.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                aux4 = true
                barsColorsPV.splice(labelAux[0] - 1, 1, greenGradient)
              } else if (((item.consumptionValueP1 && !stateConsumptions.checked1) || (item.consumptionValueP2 && !stateConsumptions.checked2) || (item.consumptionValueP3 && !stateConsumptions.checked3) || (item.consumptionValueP4 && !stateConsumptions.checked4)) || (!item.consumptionValueP1 && !item.consumptionValueP2 && !item.consumptionValueP3 && !item.consumptionValueP4 && !item.consumptionValueP5)) {
                barsColorsPV.splice(labelAux[0] - 1, 1, transp)
                valuesPV.splice(labelAux[0] - 1, 1, 1e-8)
              }

              if (!aux2 && stateConsumptions.checked2 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                item.consumptionValueP2 && valuesPL.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                aux2 = true
                barsColorsPL.splice(labelAux[0] - 1, 1, orange)
              } else if (!aux3 && stateConsumptions.checked3 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                item.consumptionValueP3 && valuesPL.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                aux3 = true
                barsColorsPL.splice(labelAux[0] - 1, 1, yellow)
              } else if (!aux4 && stateConsumptions.checked4 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                item.consumptionValueP4 && valuesPL.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                aux4 = true
                barsColorsPL.splice(labelAux[0] - 1, 1, greenGradient)
              } else if (!aux5 && stateConsumptions.checked5 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                item.consumptionValueP5 && valuesPL.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                aux5 = true
                barsColorsPL.splice(labelAux[0] - 1, 1, darkGreenGradient)
              } else if (((item.consumptionValueP2 && !stateConsumptions.checked2) || (item.consumptionValueP3 && !stateConsumptions.checked3) || (item.consumptionValueP4 && !stateConsumptions.checked4) || (item.consumptionValueP5 && !stateConsumptions.checked5)) || (!item.consumptionValueP1 && !item.consumptionValueP2 && !item.consumptionValueP3 && !item.consumptionValueP4 && !item.consumptionValueP5)) {
                barsColorsPL.splice(labelAux[0] - 1, 1, transp)
                valuesPL.splice(labelAux[0] - 1, 1, 1e-8)
              }

              if (!aux6 && stateConsumptions.checked6) {
                item.consumptionValueP6 && valuesPP.splice(labelAux[0] - 1, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                aux6 = true
                barsColorsPP.splice(labelAux[0] - 1, 1, blue)
              } else if (item.consumptionValueP6 && !stateConsumptions.checked6) {
                barsColorsPP.splice(labelAux[0] - 1, 1, transp)
                valuesPP.splice(labelAux[0] - 1, 1, 1e-8)
              }
            }
          }
        }
      }
    }
  }

  //Añade los valores uno detras del otro en el array correspondiente, caso horario o diario sin compare
  const insertPushValues = (item: any, values: any, valuesPV?: any, valuesPL?: any, valuesPP?: any, valuesP0?: any, posicion?: any) => {
    let labelAux = item.consumptionDate.split('/')
    if (isGeneration) {
      if (isGenerationTab) {
        if (consumptionsFilters.showR2 === 'S') {
          //item.activeOutput && values.push(parseFloat(item.reactive2.replace(',', '.')))
          item.activeOutput && values.splice(posicion, 1, parseFloat(item.reactive2.replace(',', '.')))
        }
        else if (consumptionsFilters.showR3 === 'S') {
          //item.activeOutput && values.push(parseFloat(item.reactive3.replace(',', '.')))
          item.activeOutput && values.splice(posicion, 1, parseFloat(item.reactive3.replace(',', '.')))
        }
        else {
          //item.activeOutput && values.push(parseFloat(item.activeOutput.replace(',', '.')))
          item.activeOutput && values.splice(posicion, 1, parseFloat(item.activeOutput.replace(',', '.')))
        }
      }
      else {
        if (consumptionsFilters.showR1 === 'S') {
          //item.activeInput && values.push(parseFloat(item.reactive1.replace(',', '.')))
          item.activeInput && values.splice(posicion, 1, parseFloat(item.reactive1.replace(',', '.')))
        }
        else if (consumptionsFilters.showR4 === 'S') {
          //item.activeInput && values.push(parseFloat(item.reactive4.replace(',', '.')))
          item.activeInput && values.splice(posicion, 1, parseFloat(item.reactive4.replace(',', '.')))
        }
        else {
          //item.activeInput && values.push(parseFloat(item.activeInput.replace(',', '.')))
          item.activeInput && values.splice(posicion, 1, parseFloat(item.activeInput.replace(',', '.')))

          //si el contador está adaptado
          if (isAdapted === 'SI') {
            //diferenciamos entre los dos tipos de usuario
            if (tipoUsuario === 'simple') {
              //comprobamos por fecha de adaptación si hay que coger el valor de activeInput
              if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                item.activeInput && stateConsumptions.checked0 && valuesPL.splice(posicion, 1, parseFloat(item.activeInput.replace(',', '.')))
                item.activeInput && stateConsumptions.checked0 && valuesP0.splice(posicion, 1, parseFloat(item.activeInput.replace(',', '.')))
                item.activeInput && !stateConsumptions.checked0 && valuesPL.splice(posicion, 1, 1e-8)
                item.activeInput && !stateConsumptions.checked0 && valuesP0.splice(posicion, 1, 1e-8)
                item.activeInput && valuesPV.splice(posicion, 1, 1e-8)
                item.activeInput && valuesPP.splice(posicion, 1, 1e-8)
                item.activeInput && stateConsumptions.checked0 && barsColorsPL.splice(posicion, 1, blueGradient)
                item.activeInput && stateConsumptions.checked0 && barsColors.splice(posicion, 1, blueGradient)
                item.activeInput && stateConsumptions.checked0 && barsColorsP0.splice(posicion, 1, blueGradient)
                item.activeInput && !stateConsumptions.checked0 && barsColorsPL.splice(posicion, 1, transp)
                item.activeInput && !stateConsumptions.checked0 && barsColors.splice(posicion, 1, transp)
                item.activeInput && !stateConsumptions.checked0 && barsColorsP0.splice(posicion, 1, transp)
                barsColorsPV.splice(posicion, 1, white)
                barsColorsPP.splice(posicion, 1, white)
              } else {
                item.consumptionValueP3 && stateConsumptions.checked3 && valuesPV.splice(posicion, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                item.consumptionValueP2 && stateConsumptions.checked2 && valuesPL.splice(posicion, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                item.consumptionValueP1 && stateConsumptions.checked1 && valuesPP.splice(posicion, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                !stateConsumptions.checked3 && valuesPV.splice(posicion, 1, 1e-8)
                !stateConsumptions.checked2 && valuesPL.splice(posicion, 1, 1e-8)
                !stateConsumptions.checked2 && valuesP0.splice(posicion, 1, 1e-8)
                !stateConsumptions.checked1 && valuesPP.splice(posicion, 1, 1e-8)
                barsColorsPV.splice(posicion, 1, blue)
                barsColorsPL.splice(posicion, 1, yellow)
                barsColorsPP.splice(posicion, 1, redGradient)
                item.consumptionValueP3 && !stateConsumptions.checked3 && barsColorsPV.splice(posicion, 1, transp)
                item.consumptionValueP2 && !stateConsumptions.checked2 && barsColorsPL.splice(posicion, 1, transp)
                item.consumptionValueP2 && !stateConsumptions.checked2 && barsColorsP0.splice(posicion, 1, transp)
                item.consumptionValueP1 && !stateConsumptions.checked1 && barsColorsPP.splice(posicion, 1, transp)
                //item.consumptionValue && barsColors.splice(day, 1, blueGradient)
              }
              //en caso de ser usuario complejo (6 periodos)
            }
            else {
              if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                item.activeInput && stateConsumptions.checked0 && valuesPL.splice(posicion, 1, parseFloat(item.activeInput.replace(',', '.')))
                item.activeInput && stateConsumptions.checked0 && valuesP0.splice(posicion, 1, parseFloat(item.activeInput.replace(',', '.')))
                item.activeInput && stateConsumptions.checked0 && valuesPV.splice(posicion, 1, 1e-8)
                item.activeInput && stateConsumptions.checked0 && valuesPP.splice(posicion, 1, 1e-8)
                item.activeInput && stateConsumptions.checked0 && barsColorsPL.splice(posicion, 1, blueGradient)
                item.activeInput && stateConsumptions.checked0 && barsColors.splice(posicion, 1, blueGradient)
                item.activeInput && stateConsumptions.checked0 && barsColorsP0.splice(posicion, 1, blueGradient)
                item.activeInput && !stateConsumptions.checked0 && barsColorsPL.splice(posicion, 1, transp)
                item.activeInput && !stateConsumptions.checked0 && barsColors.splice(posicion, 1, transp)
                item.activeInput && !stateConsumptions.checked0 && barsColorsP0.splice(posicion, 1, transp)
                barsColorsPV.splice(posicion, 1, white)
                barsColorsPP.splice(posicion, 1, white)

              } else {
                let aux1 = false, aux2 = false, aux3 = false, aux4 = false, aux5 = false, aux6 = false

                item.activeInput && barsColors.splice(posicion, 1, blueGradient)

                if (stateConsumptions.checked1 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                  item.consumptionValueP1 && valuesPV.splice(posicion, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  aux1 = true
                  barsColorsPV.splice(posicion, 1, redGradient)
                } else if (stateConsumptions.checked2 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                  item.consumptionValueP2 && valuesPV.splice(posicion, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  aux2 = true
                  barsColorsPV.splice(posicion, 1, orange)
                } else if (stateConsumptions.checked3 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                  item.consumptionValueP3 && valuesPV.splice(posicion, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  aux3 = true
                  barsColorsPV.splice(posicion, 1, yellow)
                } else if (stateConsumptions.checked4 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                  item.consumptionValueP4 && valuesPV.splice(posicion, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                  aux4 = true
                  barsColorsPV.splice(posicion, 1, greenGradient)
                } else if (((item.consumptionValueP1 && !stateConsumptions.checked1) || (item.consumptionValueP2 && !stateConsumptions.checked2) || (item.consumptionValueP3 && !stateConsumptions.checked3) || (item.consumptionValueP4 && !stateConsumptions.checked4)) || (!item.consumptionValueP1 && !item.consumptionValueP2 && !item.consumptionValueP3 && !item.consumptionValueP4 && !item.consumptionValueP5)) {
                  barsColorsPV.splice(posicion, 1, transp)
                  valuesPV.splice(posicion, 1, 1e-8)
                }

                if (!aux2 && stateConsumptions.checked2 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                  item.consumptionValueP2 && valuesPL.splice(posicion, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  aux2 = true
                  barsColorsPL.splice(posicion, 1, orange)
                } else if (!aux3 && stateConsumptions.checked3 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                  item.consumptionValueP3 && valuesPL.splice(posicion, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  aux3 = true
                  barsColorsPL.splice(posicion, 1, yellow)
                } else if (!aux4 && stateConsumptions.checked4 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                  item.consumptionValueP4 && valuesPL.splice(posicion, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                  aux4 = true
                  barsColorsPL.splice(posicion, 1, greenGradient)
                } else if (!aux5 && stateConsumptions.checked5 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                  item.consumptionValueP5 && valuesPL.splice(posicion, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                  aux5 = true
                  barsColorsPL.splice(posicion, 1, darkGreenGradient)
                } else if (((item.consumptionValueP2 && !stateConsumptions.checked2) || (item.consumptionValueP3 && !stateConsumptions.checked3) || (item.consumptionValueP4 && !stateConsumptions.checked4) || (item.consumptionValueP5 && !stateConsumptions.checked5)) || (!item.consumptionValueP1 && !item.consumptionValueP2 && !item.consumptionValueP3 && !item.consumptionValueP4 && !item.consumptionValueP5)) {
                  barsColorsPL.splice(posicion, 1, transp)
                  valuesPL.splice(posicion, 1, 1e-8)
                }

                if (!aux6 && stateConsumptions.checked6) {
                  item.consumptionValueP6 && valuesPP.splice(posicion, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                  aux6 = true
                  barsColorsPP.splice(posicion, 1, blue)
                } else if (item.consumptionValueP6 && !stateConsumptions.checked6) {
                  barsColorsPP.splice(posicion, 1, transp)
                  valuesPP.splice(posicion, 1, 1e-8)
                }
              }
            }
          }
        }
      }
    }
    else {
      if (consumptionsFilters.showR1 === 'S') {
        //item.consumptionValue && values.push(parseFloat(item.reactive1.replace(',', '.')))
        item.consumptionValue && values.splice(posicion, 1, parseFloat(item.reactive1.replace(',', '.')))
      }
      else if (consumptionsFilters.showR4 === 'S') {
        //item.consumptionValue && values.push(parseFloat(item.reactive4.replace(',', '.')))
        item.consumptionValue && values.splice(posicion, 1, parseFloat(item.reactive4.replace(',', '.')))
      }
      else {
        //item.consumptionValue && values.push(parseFloat(item.consumptionValue.replace(',', '.')))
        item.consumptionValue && values.splice(posicion, 1, parseFloat(item.consumptionValue.replace(',', '.')))

        //si el contador está adaptado
        if (isAdapted === 'SI') {
          //diferenciamos entre los dos tipos de usuario
          if (tipoUsuario === 'simple') {
            //comprobamos por fecha de adaptación si hay que coger el valor de consumptionValue
            if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
              item.consumptionValue && stateConsumptions.checked0 && valuesPL.splice(posicion, 1, parseFloat(item.consumptionValue.replace(',', '.')))
              item.consumptionValue && stateConsumptions.checked0 && valuesP0.splice(posicion, 1, parseFloat(item.consumptionValue.replace(',', '.')))
              item.consumptionValue && !stateConsumptions.checked0 && valuesPL.splice(posicion, 1, 1e-8)
              item.consumptionValue && !stateConsumptions.checked0 && valuesP0.splice(posicion, 1, 1e-8)
              item.consumptionValue && valuesPV.splice(posicion, 1, 1e-8)
              item.consumptionValue && valuesPP.splice(posicion, 1, 1e-8)
              item.consumptionValue && stateConsumptions.checked0 && barsColorsPL.splice(posicion, 1, blueGradient)
              item.consumptionValue && stateConsumptions.checked0 && barsColors.splice(posicion, 1, blueGradient)
              item.consumptionValue && stateConsumptions.checked0 && barsColorsP0.splice(posicion, 1, blueGradient)
              item.consumptionValue && !stateConsumptions.checked0 && barsColorsPL.splice(posicion, 1, transp)
              item.consumptionValue && !stateConsumptions.checked0 && barsColors.splice(posicion, 1, transp)
              item.consumptionValue && !stateConsumptions.checked0 && barsColorsP0.splice(posicion, 1, transp)
              barsColorsPV.splice(posicion, 1, white)
              barsColorsPP.splice(posicion, 1, white)
            } else {
              item.consumptionValueP3 && stateConsumptions.checked3 && valuesPV.splice(posicion, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
              item.consumptionValueP2 && stateConsumptions.checked2 && valuesPL.splice(posicion, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
              item.consumptionValueP1 && stateConsumptions.checked1 && valuesPP.splice(posicion, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
              !stateConsumptions.checked3 && valuesPV.splice(posicion, 1, 1e-8)
              !stateConsumptions.checked2 && valuesPL.splice(posicion, 1, 1e-8)
              !stateConsumptions.checked2 && valuesP0.splice(posicion, 1, 1e-8)
              !stateConsumptions.checked1 && valuesPP.splice(posicion, 1, 1e-8)
              barsColorsPV.splice(posicion, 1, blue)
              barsColorsPL.splice(posicion, 1, yellow)
              barsColorsPP.splice(posicion, 1, redGradient)
              item.consumptionValueP3 && !stateConsumptions.checked3 && barsColorsPV.splice(posicion, 1, transp)
              item.consumptionValueP2 && !stateConsumptions.checked2 && barsColorsPL.splice(posicion, 1, transp)
              item.consumptionValueP2 && !stateConsumptions.checked2 && barsColorsP0.splice(posicion, 1, transp)
              item.consumptionValueP1 && !stateConsumptions.checked1 && barsColorsPP.splice(posicion, 1, transp)
              //item.consumptionValue && barsColors.splice(day, 1, blueGradient)
            }
            //en caso de ser usuario complejo (6 periodos)
          }
          else {
            if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
              item.consumptionValue && stateConsumptions.checked0 && valuesPL.splice(posicion, 1, parseFloat(item.consumptionValue.replace(',', '.')))
              item.consumptionValue && stateConsumptions.checked0 && valuesP0.splice(posicion, 1, parseFloat(item.consumptionValue.replace(',', '.')))
              item.consumptionValue && stateConsumptions.checked0 && valuesPV.splice(posicion, 1, 1e-8)
              item.consumptionValue && stateConsumptions.checked0 && valuesPP.splice(posicion, 1, 1e-8)
              item.consumptionValue && stateConsumptions.checked0 && barsColorsPL.splice(posicion, 1, blueGradient)
              item.consumptionValue && stateConsumptions.checked0 && barsColors.splice(posicion, 1, blueGradient)
              item.consumptionValue && stateConsumptions.checked0 && barsColorsP0.splice(posicion, 1, blueGradient)
              item.consumptionValue && !stateConsumptions.checked0 && barsColorsPL.splice(posicion, 1, transp)
              item.consumptionValue && !stateConsumptions.checked0 && barsColors.splice(posicion, 1, transp)
              item.consumptionValue && !stateConsumptions.checked0 && barsColorsP0.splice(posicion, 1, transp)
              barsColorsPV.splice(posicion, 1, white)
              barsColorsPP.splice(posicion, 1, white)

            } else {
              let aux1 = false, aux2 = false, aux3 = false, aux4 = false, aux5 = false, aux6 = false

              item.consumptionValue && barsColors.splice(posicion, 1, blueGradient)

              if (stateConsumptions.checked1 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                item.consumptionValueP1 && valuesPV.splice(posicion, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                aux1 = true
                barsColorsPV.splice(posicion, 1, redGradient)
              } else if (stateConsumptions.checked2 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                item.consumptionValueP2 && valuesPV.splice(posicion, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                aux2 = true
                barsColorsPV.splice(posicion, 1, orange)
              } else if (stateConsumptions.checked3 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                item.consumptionValueP3 && valuesPV.splice(posicion, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                aux3 = true
                barsColorsPV.splice(posicion, 1, yellow)
              } else if (stateConsumptions.checked4 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                item.consumptionValueP4 && valuesPV.splice(posicion, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                aux4 = true
                barsColorsPV.splice(posicion, 1, greenGradient)
              } else if (((item.consumptionValueP1 && !stateConsumptions.checked1) || (item.consumptionValueP2 && !stateConsumptions.checked2) || (item.consumptionValueP3 && !stateConsumptions.checked3) || (item.consumptionValueP4 && !stateConsumptions.checked4)) || (!item.consumptionValueP1 && !item.consumptionValueP2 && !item.consumptionValueP3 && !item.consumptionValueP4 && !item.consumptionValueP5)) {
                barsColorsPV.splice(posicion, 1, transp)
                valuesPV.splice(posicion, 1, 1e-8)
              }

              if (!aux2 && stateConsumptions.checked2 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                item.consumptionValueP2 && valuesPL.splice(posicion, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                aux2 = true
                barsColorsPL.splice(posicion, 1, orange)
              } else if (!aux3 && stateConsumptions.checked3 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                item.consumptionValueP3 && valuesPL.splice(posicion, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                aux3 = true
                barsColorsPL.splice(posicion, 1, yellow)
              } else if (!aux4 && stateConsumptions.checked4 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                item.consumptionValueP4 && valuesPL.splice(posicion, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                aux4 = true
                barsColorsPL.splice(posicion, 1, greenGradient)
              } else if (!aux5 && stateConsumptions.checked5 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                item.consumptionValueP5 && valuesPL.splice(posicion, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                aux5 = true
                barsColorsPL.splice(posicion, 1, darkGreenGradient)
              } else if (((item.consumptionValueP2 && !stateConsumptions.checked2) || (item.consumptionValueP3 && !stateConsumptions.checked3) || (item.consumptionValueP4 && !stateConsumptions.checked4) || (item.consumptionValueP5 && !stateConsumptions.checked5)) || (!item.consumptionValueP1 && !item.consumptionValueP2 && !item.consumptionValueP3 && !item.consumptionValueP4 && !item.consumptionValueP5)) {
                barsColorsPL.splice(posicion, 1, transp)
                valuesPL.splice(posicion, 1, 1e-8)
              }

              if (!aux6 && stateConsumptions.checked6) {
                item.consumptionValueP6 && valuesPP.splice(posicion, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                aux6 = true
                barsColorsPP.splice(posicion, 1, blue)
              } else if (item.consumptionValueP6 && !stateConsumptions.checked6) {
                barsColorsPP.splice(posicion, 1, transp)
                valuesPP.splice(posicion, 1, 1e-8)
              }
            }
          }
        }
      }
    }
  }

  let contadorHoras = 0

  const insertGranularityH = (item: any, values: any, valuesPV?: any, valuesPL?: any, valuesPP?: any, valuesP0?: any, compare?: boolean, realValues?: any) => {
    let labelAux = item.consumptionDate.split('/')
    if (isGeneration) {
      if (isGenerationTab) {
        if (consumptionsFilters.showR2 === 'S') {
          item.activeOutput && values.push(parseFloat(item.reactive2.replace(',', '.')))
        }
        else if (consumptionsFilters.showR3 === 'S') {
          item.activeOutput && values.push(parseFloat(item.reactive3.replace(',', '.')))
        }
        else {
          item.activeOutput && values.push(parseFloat(item.activeOutput.replace(',', '.')))
        }
      }
      else {
        if (consumptionsFilters.showR1 === 'S') {
          item.activeInput && values.push(parseFloat(item.reactive1.replace(',', '.')))
        }
        else if (consumptionsFilters.showR4 === 'S') {
          item.activeInput && values.push(parseFloat(item.reactive4.replace(',', '.')))
        }
        else {
          //si el contador está adaptado
          if (isAdapted === 'SI') {
            //diferenciamos entre los dos tipos de usuario
            if (tipoUsuario === 'simple') {
              if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                item.consumptionValue && stateConsumptions.checked0 && values.splice(contadorHoras, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                item.consumptionValue && !stateConsumptions.checked0 && values.splice(contadorHoras, 1, 1e-8)
                if (compare) {
                  item.consumptionValue && stateConsumptions.checked0 && barsColorsCompare.splice(contadorHoras, 1, whiteblueGradient)
                  item.consumptionValue && !stateConsumptions.checked0 && barsColorsCompare.splice(contadorHoras, 1, transp)
                } else {
                  item.consumptionValue && stateConsumptions.checked0 && barsColors.splice(contadorHoras, 1, darkblueGradient)
                  item.consumptionValue && !stateConsumptions.checked0 && barsColors.splice(contadorHoras, 1, transp)
                }
              } else {
                item.consumptionValueP3 && stateConsumptions.checked3 && values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                item.consumptionValueP2 && stateConsumptions.checked2 && values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                item.consumptionValueP1 && stateConsumptions.checked1 && values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                item.consumptionValueP3 && !stateConsumptions.checked3 && values.splice(contadorHoras, 1, 1e-8)
                item.consumptionValueP2 && !stateConsumptions.checked2 && values.splice(contadorHoras, 1, 1e-8)
                item.consumptionValueP1 && !stateConsumptions.checked1 && values.splice(contadorHoras, 1, 1e-8)
                if (compare) {
                  item.consumptionValueP3 && stateConsumptions.checked3 && barsColorsCompare.splice(contadorHoras, 1, whiteblueGradient)
                  item.consumptionValueP2 && stateConsumptions.checked2 && barsColorsCompare.splice(contadorHoras, 1, whiteYellow)
                  item.consumptionValueP1 && stateConsumptions.checked1 && barsColorsCompare.splice(contadorHoras, 1, whiteRed)
                  item.consumptionValueP3 && !stateConsumptions.checked3 && barsColorsCompare.splice(contadorHoras, 1, transp)
                  item.consumptionValueP2 && !stateConsumptions.checked2 && barsColorsCompare.splice(contadorHoras, 1, transp)
                  item.consumptionValueP1 && !stateConsumptions.checked1 && barsColorsCompare.splice(contadorHoras, 1, transp)
                } else {
                  item.consumptionValueP3 && stateConsumptions.checked3 && barsColors.splice(contadorHoras, 1, blue)
                  item.consumptionValueP2 && stateConsumptions.checked2 && barsColors.splice(contadorHoras, 1, yellow)
                  item.consumptionValueP1 && stateConsumptions.checked1 && barsColors.splice(contadorHoras, 1, redGradient)
                  item.consumptionValueP3 && !stateConsumptions.checked3 && barsColors.splice(contadorHoras, 1, transp)
                  item.consumptionValueP2 && !stateConsumptions.checked2 && barsColors.splice(contadorHoras, 1, transp)
                  item.consumptionValueP1 && !stateConsumptions.checked1 && barsColors.splice(contadorHoras, 1, transp)
                }
              }
              //en caso de ser usuario complejo (6 periodos)
            } else {
              if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                item.consumptionValue && stateConsumptions.checked0 && values.splice(contadorHoras, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                item.consumptionValue && stateConsumptions.checked0 && valuesPL.splice(contadorHoras, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                item.consumptionValue && stateConsumptions.checked0 && valuesP0.splice(contadorHoras, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                item.consumptionValue && stateConsumptions.checked0 && valuesPV.splice(contadorHoras, 1, 1e-8)
                item.consumptionValue && stateConsumptions.checked0 && valuesPP.splice(contadorHoras, 1, 1e-8)
                item.consumptionValue && stateConsumptions.checked0 && barsColorsP0.splice(contadorHoras, 1, blueGradient)
                item.consumptionValue && !stateConsumptions.checked0 && barsColorsPL.splice(labelAux[0] - 1, 1, transp)
                item.consumptionValue && !stateConsumptions.checked0 && barsColors.splice(labelAux[0] - 1, 1, transp)
                item.consumptionValue && !stateConsumptions.checked0 && barsColorsP0.splice(labelAux[0] - 1, 1, transp)
                item.consumptionValue && barsColorsPL.splice(contadorHoras, 1, blueGradient)
                //item.consumptionValue && barsColors.splice(contadorHoras, 1, blueGradient)
                barsColorsPV.splice(contadorHoras, 1, white)
                barsColorsPP.splice(contadorHoras, 1, white)

                if (compare) {
                  item.consumptionValue && barsColorsCompare.splice(contadorHoras, 1, whiteblueGradient)
                } else {
                  item.consumptionValue && barsColors.splice(contadorHoras, 1, blueGradient)
                }
              } else {
                let aux1 = false, aux2 = false, aux3 = false, aux4 = false, aux5 = false, aux6 = false

                if (stateConsumptions.checked1 && item.consumptionValueP1 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                  values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  aux1 = true
                  if (compare) {
                    barsColorsCompare.splice(contadorHoras, 1, whiteRed)
                  } else {
                    barsColors.splice(contadorHoras, 1, redGradient)
                  }
                } else if (stateConsumptions.checked2 && item.consumptionValueP2 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                  values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  aux2 = true
                  if (compare) {
                    barsColorsCompare.splice(contadorHoras, 1, whiteOrange)
                  } else {
                    barsColors.splice(contadorHoras, 1, orange)
                  }
                } else if (stateConsumptions.checked3 && item.consumptionValueP3 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                  values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  aux3 = true
                  if (compare) {
                    barsColorsCompare.splice(contadorHoras, 1, whiteYellow)
                  } else {
                    barsColors.splice(contadorHoras, 1, yellow)
                  }
                } else if (stateConsumptions.checked4 && item.consumptionValueP4 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                  values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                  aux4 = true
                  if (compare) {
                    barsColorsCompare.splice(contadorHoras, 1, whiteGreenGradient)
                  } else {
                    barsColors.splice(contadorHoras, 1, greenGradient)
                  }
                } else if ((item.consumptionValueP1 || item.consumptionValueP2 || item.consumptionValueP3 || item.consumptionValueP4) && !compare) {
                  barsColors.splice(contadorHoras, 1, transp)
                } else if ((item.consumptionValueP1 || item.consumptionValueP2 || item.consumptionValueP3 || item.consumptionValueP4) && compare) {
                  barsColorsCompare.splice(contadorHoras, 1, transp)
                }

                if (!aux2 && stateConsumptions.checked2 && item.consumptionValueP2 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                  values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  aux2 = true
                  if (compare) {
                    barsColorsCompare.splice(contadorHoras, 1, whiteOrange)
                  } else {
                    barsColors.splice(contadorHoras, 1, orange)
                  }
                } else if (!aux3 && stateConsumptions.checked3 && item.consumptionValueP3 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                  values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  aux3 = true
                  if (compare) {
                    barsColorsCompare.splice(contadorHoras, 1, whiteYellow)
                  } else {
                    barsColors.splice(contadorHoras, 1, yellow)
                  }
                } else if (!aux4 && stateConsumptions.checked4 && item.consumptionValueP4 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                  values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                  aux4 = true
                  if (compare) {
                    barsColorsCompare.splice(contadorHoras, 1, whiteGreenGradient)
                  } else {
                    barsColors.splice(contadorHoras, 1, greenGradient)
                  }
                } else if (!aux5 && stateConsumptions.checked5 && item.consumptionValueP5 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                  values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                  aux5 = true
                  if (compare) {
                    barsColorsCompare.splice(contadorHoras, 1, whiteDarkGreenGradient)
                  } else {
                    barsColors.splice(contadorHoras, 1, darkGreenGradient)
                  }
                }

                if (!aux6 && stateConsumptions.checked6 && item.consumptionValueP6) {
                  values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                  aux6 = true
                  if (compare) {
                    barsColorsCompare.splice(contadorHoras, 1, whiteblueGradient)
                  } else {
                    barsColors.splice(contadorHoras, 1, blue)
                  }
                } else if (item.consumptionValueP6 && !compare) {
                  barsColors.splice(contadorHoras, 1, transp)
                } else if (item.consumptionValueP6 && compare) {
                  barsColorsCompare.splice(contadorHoras, 1, transp)
                }
              }
            }
          } else {
            item.activeInput && values.push(parseFloat(item.activeInput.replace(',', '.')))
          }
        }
      }
    }
    else {
      if (consumptionsFilters.showR1 === 'S') {
        item.consumptionValue && values.push(parseFloat(item.reactive1.replace(',', '.')))
      }
      else if (consumptionsFilters.showR4 === 'S') {
        item.consumptionValue && values.push(parseFloat(item.reactive4.replace(',', '.')))
      }
      else {
        item.consumptionValue && realValues.push(parseFloat(item.consumptionValue.replace(',', '.')))
        //si el contador está adaptado
        if (isAdapted === 'SI') {
          //diferenciamos entre los dos tipos de usuario
          if (tipoUsuario === 'simple') {
            if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
              item.consumptionValue && stateConsumptions.checked0 && values.splice(contadorHoras, 1, parseFloat(item.consumptionValue.replace(',', '.')))
              item.consumptionValue && !stateConsumptions.checked0 && values.splice(contadorHoras, 1, 1e-8)
              if (compare) {
                item.consumptionValue && stateConsumptions.checked0 && barsColorsCompare.splice(contadorHoras, 1, whiteblueGradient)
                item.consumptionValue && !stateConsumptions.checked0 && barsColorsCompare.splice(contadorHoras, 1, transp)
              } else {
                item.consumptionValue && stateConsumptions.checked0 && barsColors.splice(contadorHoras, 1, darkblueGradient)
                item.consumptionValue && !stateConsumptions.checked0 && barsColors.splice(contadorHoras, 1, transp)
              }
            } else {
              item.consumptionValueP3 && stateConsumptions.checked3 && values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
              item.consumptionValueP2 && stateConsumptions.checked2 && values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
              item.consumptionValueP1 && stateConsumptions.checked1 && values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
              item.consumptionValueP3 && !stateConsumptions.checked3 && values.splice(contadorHoras, 1, 1e-8)
              item.consumptionValueP2 && !stateConsumptions.checked2 && values.splice(contadorHoras, 1, 1e-8)
              item.consumptionValueP1 && !stateConsumptions.checked1 && values.splice(contadorHoras, 1, 1e-8)
              if (compare) {
                item.consumptionValueP3 && stateConsumptions.checked3 && barsColorsCompare.splice(contadorHoras, 1, whiteblueGradient)
                item.consumptionValueP2 && stateConsumptions.checked2 && barsColorsCompare.splice(contadorHoras, 1, whiteYellow)
                item.consumptionValueP1 && stateConsumptions.checked1 && barsColorsCompare.splice(contadorHoras, 1, whiteRed)
                item.consumptionValueP3 && !stateConsumptions.checked3 && barsColorsCompare.splice(contadorHoras, 1, transp)
                item.consumptionValueP2 && !stateConsumptions.checked2 && barsColorsCompare.splice(contadorHoras, 1, transp)
                item.consumptionValueP1 && !stateConsumptions.checked1 && barsColorsCompare.splice(contadorHoras, 1, transp)
              } else {
                item.consumptionValueP3 && stateConsumptions.checked3 && barsColors.splice(contadorHoras, 1, blue)
                item.consumptionValueP2 && stateConsumptions.checked2 && barsColors.splice(contadorHoras, 1, yellow)
                item.consumptionValueP1 && stateConsumptions.checked1 && barsColors.splice(contadorHoras, 1, redGradient)
                item.consumptionValueP3 && !stateConsumptions.checked3 && barsColors.splice(contadorHoras, 1, transp)
                item.consumptionValueP2 && !stateConsumptions.checked2 && barsColors.splice(contadorHoras, 1, transp)
                item.consumptionValueP1 && !stateConsumptions.checked1 && barsColors.splice(contadorHoras, 1, transp)
              }
            }
            //en caso de ser usuario complejo (6 periodos)
          } else {
            if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
              item.consumptionValue && stateConsumptions.checked0 && values.splice(contadorHoras, 1, parseFloat(item.consumptionValue.replace(',', '.')))
              item.consumptionValue && stateConsumptions.checked0 && valuesPL.splice(contadorHoras, 1, parseFloat(item.consumptionValue.replace(',', '.')))
              item.consumptionValue && stateConsumptions.checked0 && valuesP0.splice(contadorHoras, 1, parseFloat(item.consumptionValue.replace(',', '.')))
              item.consumptionValue && stateConsumptions.checked0 && valuesPV.splice(contadorHoras, 1, 1e-8)
              item.consumptionValue && stateConsumptions.checked0 && valuesPP.splice(contadorHoras, 1, 1e-8)
              item.consumptionValue && stateConsumptions.checked0 && barsColorsP0.splice(contadorHoras, 1, blueGradient)
              item.consumptionValue && !stateConsumptions.checked0 && barsColorsPL.splice(labelAux[0] - 1, 1, transp)
              item.consumptionValue && !stateConsumptions.checked0 && barsColors.splice(labelAux[0] - 1, 1, transp)
              item.consumptionValue && !stateConsumptions.checked0 && barsColorsP0.splice(labelAux[0] - 1, 1, transp)
              item.consumptionValue && barsColorsPL.splice(contadorHoras, 1, blueGradient)
              //item.consumptionValue && barsColors.splice(contadorHoras, 1, blueGradient)
              barsColorsPV.splice(contadorHoras, 1, white)
              barsColorsPP.splice(contadorHoras, 1, white)

              if (compare) {
                item.consumptionValue && barsColorsCompare.splice(contadorHoras, 1, whiteblueGradient)
              } else {
                item.consumptionValue && barsColors.splice(contadorHoras, 1, blueGradient)
              }
            } else {
              let aux1 = false, aux2 = false, aux3 = false, aux4 = false, aux5 = false, aux6 = false

              if (stateConsumptions.checked1 && item.consumptionValueP1 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                aux1 = true
                if (compare) {
                  barsColorsCompare.splice(contadorHoras, 1, whiteRed)
                } else {
                  barsColors.splice(contadorHoras, 1, redGradient)
                }
              } else if (stateConsumptions.checked2 && item.consumptionValueP2 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                aux2 = true
                if (compare) {
                  barsColorsCompare.splice(contadorHoras, 1, whiteOrange)
                } else {
                  barsColors.splice(contadorHoras, 1, orange)
                }
              } else if (stateConsumptions.checked3 && item.consumptionValueP3 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                aux3 = true
                if (compare) {
                  barsColorsCompare.splice(contadorHoras, 1, whiteYellow)
                } else {
                  barsColors.splice(contadorHoras, 1, yellow)
                }
              } else if (stateConsumptions.checked4 && item.consumptionValueP4 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                aux4 = true
                if (compare) {
                  barsColorsCompare.splice(contadorHoras, 1, whiteGreenGradient)
                } else {
                  barsColors.splice(contadorHoras, 1, greenGradient)
                }
              } else if ((item.consumptionValueP1 || item.consumptionValueP2 || item.consumptionValueP3 || item.consumptionValueP4) && !compare) {
                barsColors.splice(contadorHoras, 1, transp)
              } else if ((item.consumptionValueP1 || item.consumptionValueP2 || item.consumptionValueP3 || item.consumptionValueP4) && compare) {
                barsColorsCompare.splice(contadorHoras, 1, transp)
              }

              if (!aux2 && stateConsumptions.checked2 && item.consumptionValueP2 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                aux2 = true
                if (compare) {
                  barsColorsCompare.splice(contadorHoras, 1, whiteOrange)
                } else {
                  barsColors.splice(contadorHoras, 1, orange)
                }
              } else if (!aux3 && stateConsumptions.checked3 && item.consumptionValueP3 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                aux3 = true
                if (compare) {
                  barsColorsCompare.splice(contadorHoras, 1, whiteYellow)
                } else {
                  barsColors.splice(contadorHoras, 1, yellow)
                }
              } else if (!aux4 && stateConsumptions.checked4 && item.consumptionValueP4 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                aux4 = true
                if (compare) {
                  barsColorsCompare.splice(contadorHoras, 1, whiteGreenGradient)
                } else {
                  barsColors.splice(contadorHoras, 1, greenGradient)
                }
              } else if (!aux5 && stateConsumptions.checked5 && item.consumptionValueP5 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                aux5 = true
                if (compare) {
                  barsColorsCompare.splice(contadorHoras, 1, whiteDarkGreenGradient)
                } else {
                  barsColors.splice(contadorHoras, 1, darkGreenGradient)
                }
              }

              if (!aux6 && stateConsumptions.checked6 && item.consumptionValueP6) {
                values.splice(contadorHoras, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                aux6 = true
                if (compare) {
                  barsColorsCompare.splice(contadorHoras, 1, whiteblueGradient)
                } else {
                  barsColors.splice(contadorHoras, 1, blue)
                }
              } else if (item.consumptionValueP6 && !compare) {
                barsColors.splice(contadorHoras, 1, transp)
              } else if (item.consumptionValueP6 && compare) {
                barsColorsCompare.splice(contadorHoras, 1, transp)
              }
            }
          }
        } else {
          item.consumptionValue && values.push(parseFloat(item.consumptionValue.replace(',', '.')))
        }
      }
    }
    contadorHoras++
  }

  const insertGranularityQ = (item: any, values: any, valuesPV?: any, valuesPL?: any, valuesPP?: any, valuesP0?: any, compare?: boolean, realValues?: any) => {
    let labelAux = item.consumptionDate.split('/')
    if (isGeneration) {
      if (isGenerationTab) {
        if (consumptionsFilters.showR2 === 'S') {
          item.activeOutput && values.push(parseFloat(item.reactive2.replace(',', '.')))
        }
        else if (consumptionsFilters.showR3 === 'S') {
          item.activeOutput && values.push(parseFloat(item.reactive3.replace(',', '.')))
        }
        else {
          item.activeOutput && values.push(parseFloat(item.activeOutput.replace(',', '.')))
        }
      }
      else {
        if (consumptionsFilters.showR1 === 'S') {
          item.activeInput && values.push(parseFloat(item.reactive1.replace(',', '.')))
        }
        else if (consumptionsFilters.showR4 === 'S') {
          item.activeInput && values.push(parseFloat(item.reactive4.replace(',', '.')))
        }
        else {
          item.activeInput && realValues.push(parseFloat(item.activeInput.replace(',', '.')))

          //si el contador está adaptado
          if (isAdapted === 'SI') {
            //diferenciamos entre los dos tipos de usuario
            if (tipoUsuario === 'simple') {
              if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                item.activeInput && stateConsumptions.checked0 && values.splice(counterQ - 1, 1, parseFloat(item.activeInput.replace(',', '.')))
                item.activeInput && !stateConsumptions.checked0 && values.splice(counterQ - 1, 1, 1e-8)
                if (compare) {
                  item.activeInput && stateConsumptions.checked0 && barsColorsCompare.splice(counterQ - 1, 1, whiteblueGradient)
                  item.activeInput && !stateConsumptions.checked0 && barsColorsCompare.splice(counterQ - 1, 1, transp)
                } else {
                  item.activeInput && stateConsumptions.checked0 && barsColors.splice(counterQ - 1, 1, darkblueGradient)
                  item.activeInput && !stateConsumptions.checked0 && barsColors.splice(counterQ - 1, 1, transp)
                }
              } else {
                item.consumptionValueP3 && stateConsumptions.checked3 && values.splice(counterQ - 1, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                item.consumptionValueP2 && stateConsumptions.checked2 && values.splice(counterQ - 1, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                item.consumptionValueP1 && stateConsumptions.checked1 && values.splice(counterQ - 1, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                item.consumptionValueP3 && !stateConsumptions.checked3 && values.splice(counterQ - 1, 1, 1e-8)
                item.consumptionValueP2 && !stateConsumptions.checked2 && values.splice(counterQ - 1, 1, 1e-8)
                item.consumptionValueP1 && !stateConsumptions.checked1 && values.splice(counterQ - 1, 1, 1e-8)
                if (compare) {
                  item.consumptionValueP3 && stateConsumptions.checked3 && barsColorsCompare.splice(counterQ - 1, 1, whiteblueGradient)
                  item.consumptionValueP2 && stateConsumptions.checked2 && barsColorsCompare.splice(counterQ - 1, 1, whiteYellow)
                  item.consumptionValueP1 && stateConsumptions.checked1 && barsColorsCompare.splice(counterQ - 1, 1, whiteRed)
                  item.consumptionValueP3 && !stateConsumptions.checked3 && barsColorsCompare.splice(counterQ - 1, 1, transp)
                  item.consumptionValueP2 && !stateConsumptions.checked2 && barsColorsCompare.splice(counterQ - 1, 1, transp)
                  item.consumptionValueP1 && !stateConsumptions.checked1 && barsColorsCompare.splice(counterQ - 1, 1, transp)
                } else {
                  item.consumptionValueP3 && stateConsumptions.checked3 && barsColors.splice(counterQ - 1, 1, blue)
                  item.consumptionValueP2 && stateConsumptions.checked2 && barsColors.splice(counterQ - 1, 1, yellow)
                  item.consumptionValueP1 && stateConsumptions.checked1 && barsColors.splice(counterQ - 1, 1, redGradient)
                  item.consumptionValueP3 && !stateConsumptions.checked3 && barsColors.splice(counterQ - 1, 1, transp)
                  item.consumptionValueP2 && !stateConsumptions.checked2 && barsColors.splice(counterQ - 1, 1, transp)
                  item.consumptionValueP1 && !stateConsumptions.checked1 && barsColors.splice(counterQ - 1, 1, transp)
                }
              }
              //en caso de ser usuario complejo (6 periodos)
            } else {
              if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                item.activeInput && stateConsumptions.checked0 && values.splice(counterQ, 1, parseFloat(item.activeInput.replace(',', '.')))
                item.activeInput && stateConsumptions.checked0 && valuesPL.splice(counterQ, 1, parseFloat(item.activeInput.replace(',', '.')))
                item.activeInput && stateConsumptions.checked0 && valuesP0.splice(counterQ, 1, parseFloat(item.activeInput.replace(',', '.')))
                item.activeInput && stateConsumptions.checked0 && valuesPV.splice(counterQ, 1, 1e-8)
                item.activeInput && stateConsumptions.checked0 && valuesPP.splice(counterQ, 1, 1e-8)
                item.activeInput && stateConsumptions.checked0 && barsColorsP0.splice(counterQ, 1, blueGradient)
                item.activeInput && stateConsumptions.checked0 && barsColorsPL.splice(counterQ, 1, blueGradient)
                item.activeInput && !stateConsumptions.checked0 && barsColorsPL.splice(labelAux[0] - 1, 1, transp)
                item.activeInput && !stateConsumptions.checked0 && barsColors.splice(labelAux[0] - 1, 1, transp)
                item.activeInput && !stateConsumptions.checked0 && barsColorsP0.splice(labelAux[0] - 1, 1, transp)
                barsColorsPV.splice(counterQ, 1, white)
                barsColorsPP.splice(counterQ, 1, white)

                if (compare) {
                  item.activeInput && barsColorsCompare.splice(counterQ, 1, whiteblueGradient)
                } else {
                  item.activeInput && barsColors.splice(counterQ, 1, blueGradient)
                }
              } else {
                let aux1 = false, aux2 = false, aux3 = false, aux4 = false, aux5 = false, aux6 = false

                if (stateConsumptions.checked1 && item.consumptionValueP1 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                  values.splice(counterQ, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  aux1 = true
                  //barsColors.splice(item.hour - 1, 1, redGradient)
                  if (compare) {
                    barsColorsCompare.splice(counterQ, 1, whiteRed)
                  } else {
                    barsColors.splice(counterQ, 1, redGradient)
                  }
                } else if (stateConsumptions.checked2 && item.consumptionValueP2 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                  values.splice(counterQ, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  aux2 = true
                  //barsColors.splice(item.hour - 1, 1, orange)
                  if (compare) {
                    barsColorsCompare.splice(counterQ, 1, whiteOrange)
                  } else {
                    barsColors.splice(counterQ, 1, orange)
                  }
                } else if (stateConsumptions.checked3 && item.consumptionValueP3 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                  values.splice(counterQ, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  aux3 = true
                  //barsColors.splice(item.hour - 1, 1, yellow)
                  if (compare) {
                    barsColorsCompare.splice(counterQ, 1, whiteYellow)
                  } else {
                    barsColors.splice(counterQ, 1, yellow)
                  }
                } else if (stateConsumptions.checked4 && item.consumptionValueP4 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                  values.splice(counterQ, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                  aux4 = true
                  //barsColors.splice(item.hour - 1, 1, greenGradient)
                  if (compare) {
                    barsColorsCompare.splice(counterQ, 1, whiteGreenGradient)
                  } else {
                    barsColors.splice(counterQ, 1, greenGradient)
                  }
                } else if ((item.consumptionValueP1 || item.consumptionValueP2 || item.consumptionValueP3 || item.consumptionValueP4) && !compare) {
                  barsColors.splice(counterQ, 1, transp)
                } else if ((item.consumptionValueP1 || item.consumptionValueP2 || item.consumptionValueP3 || item.consumptionValueP4) && compare) {
                  barsColorsCompare.splice(counterQ, 1, transp)
                }

                if (!aux2 && stateConsumptions.checked2 && item.consumptionValueP2 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                  values.splice(counterQ, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  aux2 = true
                  //barsColors.splice(item.hour - 1, 1, orange)
                  if (compare) {
                    barsColorsCompare.splice(counterQ, 1, whiteOrange)
                  } else {
                    barsColors.splice(counterQ, 1, orange)
                  }
                } else if (!aux3 && stateConsumptions.checked3 && item.consumptionValueP3 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                  values.splice(counterQ, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  aux3 = true
                  //barsColors.splice(item.hour - 1, 1, yellow)
                  if (compare) {
                    barsColorsCompare.splice(counterQ, 1, whiteYellow)
                  } else {
                    barsColors.splice(counterQ, 1, yellow)
                  }
                } else if (!aux4 && stateConsumptions.checked4 && item.consumptionValueP4 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                  values.splice(counterQ, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                  aux4 = true
                  //barsColors.splice(item.hour - 1, 1, greenGradient)
                  if (compare) {
                    barsColorsCompare.splice(counterQ, 1, whiteGreenGradient)
                  } else {
                    barsColors.splice(counterQ, 1, greenGradient)
                  }
                } else if (!aux5 && stateConsumptions.checked5 && item.consumptionValueP5 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                  values.splice(counterQ, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                  aux5 = true
                  //barsColors.splice(item.hour - 1, 1, darkGreenGradient)
                  if (compare) {
                    barsColorsCompare.splice(counterQ, 1, whiteDarkGreenGradient)
                  } else {
                    barsColors.splice(counterQ, 1, darkGreenGradient)
                  }
                }

                if (!aux6 && stateConsumptions.checked6 && item.consumptionValueP6) {
                  values.splice(counterQ, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                  aux6 = true
                  //barsColors.splice(item.hour - 1, 1, blue)
                  if (compare) {
                    barsColorsCompare.splice(counterQ, 1, whiteblueGradient)
                  } else {
                    barsColors.splice(counterQ, 1, blue)
                  }
                } else if (item.consumptionValueP6 && !compare) {
                  barsColors.splice(counterQ, 1, transp)
                } else if (item.consumptionValueP6 && compare) {
                  barsColorsCompare.splice(counterQ, 1, transp)
                }
              }
            }
          } else {
            item.activeInput && values.push(parseFloat(item.activeInput.replace(',', '.')))
          }
          counterQ++
        }
      }
    }
    else {
      if (consumptionsFilters.showR1 === 'S') {
        item.consumptionValue && values.push(parseFloat(item.reactive1.replace(',', '.')))
      }
      else if (consumptionsFilters.showR4 === 'S') {
        item.consumptionValue && values.push(parseFloat(item.reactive4.replace(',', '.')))
      }
      else {
        item.consumptionValue && realValues.push(parseFloat(item.consumptionValue.replace(',', '.')))
        //si el contador está adaptado
        if (isAdapted === 'SI') {
          //diferenciamos entre los dos tipos de usuario
          if (tipoUsuario === 'simple') {
            if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
              item.consumptionValue && stateConsumptions.checked0 && values.splice(counterQ - 1, 1, parseFloat(item.consumptionValue.replace(',', '.')))
              item.consumptionValue && !stateConsumptions.checked0 && values.splice(counterQ - 1, 1, 1e-8)
              if (compare) {
                item.consumptionValue && stateConsumptions.checked0 && barsColorsCompare.splice(counterQ - 1, 1, whiteblueGradient)
                item.consumptionValue && !stateConsumptions.checked0 && barsColorsCompare.splice(counterQ - 1, 1, transp)
              } else {
                item.consumptionValue && stateConsumptions.checked0 && barsColors.splice(counterQ - 1, 1, darkblueGradient)
                item.consumptionValue && !stateConsumptions.checked0 && barsColors.splice(counterQ - 1, 1, transp)
              }
            } else {
              item.consumptionValueP3 && stateConsumptions.checked3 && values.splice(counterQ - 1, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
              item.consumptionValueP2 && stateConsumptions.checked2 && values.splice(counterQ - 1, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
              item.consumptionValueP1 && stateConsumptions.checked1 && values.splice(counterQ - 1, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
              item.consumptionValueP3 && !stateConsumptions.checked3 && values.splice(counterQ - 1, 1, 1e-8)
              item.consumptionValueP2 && !stateConsumptions.checked2 && values.splice(counterQ - 1, 1, 1e-8)
              item.consumptionValueP1 && !stateConsumptions.checked1 && values.splice(counterQ - 1, 1, 1e-8)
              if (compare) {
                item.consumptionValueP3 && stateConsumptions.checked3 && barsColorsCompare.splice(counterQ - 1, 1, whiteblueGradient)
                item.consumptionValueP2 && stateConsumptions.checked2 && barsColorsCompare.splice(counterQ - 1, 1, whiteYellow)
                item.consumptionValueP1 && stateConsumptions.checked1 && barsColorsCompare.splice(counterQ - 1, 1, whiteRed)
                item.consumptionValueP3 && !stateConsumptions.checked3 && barsColorsCompare.splice(counterQ - 1, 1, transp)
                item.consumptionValueP2 && !stateConsumptions.checked2 && barsColorsCompare.splice(counterQ - 1, 1, transp)
                item.consumptionValueP1 && !stateConsumptions.checked1 && barsColorsCompare.splice(counterQ - 1, 1, transp)
              } else {
                item.consumptionValueP3 && stateConsumptions.checked3 && barsColors.splice(counterQ - 1, 1, blue)
                item.consumptionValueP2 && stateConsumptions.checked2 && barsColors.splice(counterQ - 1, 1, yellow)
                item.consumptionValueP1 && stateConsumptions.checked1 && barsColors.splice(counterQ - 1, 1, redGradient)
                item.consumptionValueP3 && !stateConsumptions.checked3 && barsColors.splice(counterQ - 1, 1, transp)
                item.consumptionValueP2 && !stateConsumptions.checked2 && barsColors.splice(counterQ - 1, 1, transp)
                item.consumptionValueP1 && !stateConsumptions.checked1 && barsColors.splice(counterQ - 1, 1, transp)
              }
            }
            //en caso de ser usuario complejo (6 periodos)
          } else {
            if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
              item.consumptionValue && stateConsumptions.checked0 && values.splice(counterQ, 1, parseFloat(item.consumptionValue.replace(',', '.')))
              item.consumptionValue && stateConsumptions.checked0 && valuesPL.splice(counterQ, 1, parseFloat(item.consumptionValue.replace(',', '.')))
              item.consumptionValue && stateConsumptions.checked0 && valuesP0.splice(counterQ, 1, parseFloat(item.consumptionValue.replace(',', '.')))
              item.consumptionValue && stateConsumptions.checked0 && valuesPV.splice(counterQ, 1, 1e-8)
              item.consumptionValue && stateConsumptions.checked0 && valuesPP.splice(counterQ, 1, 1e-8)
              item.consumptionValue && stateConsumptions.checked0 && barsColorsP0.splice(counterQ, 1, blueGradient)
              item.consumptionValue && stateConsumptions.checked0 && barsColorsPL.splice(counterQ, 1, blueGradient)
              item.consumptionValue && !stateConsumptions.checked0 && barsColorsPL.splice(labelAux[0] - 1, 1, transp)
              item.consumptionValue && !stateConsumptions.checked0 && barsColors.splice(labelAux[0] - 1, 1, transp)
              item.consumptionValue && !stateConsumptions.checked0 && barsColorsP0.splice(labelAux[0] - 1, 1, transp)
              barsColorsPV.splice(counterQ, 1, white)
              barsColorsPP.splice(counterQ, 1, white)

              if (compare) {
                item.consumptionValue && barsColorsCompare.splice(counterQ, 1, whiteblueGradient)
              } else {
                item.consumptionValue && barsColors.splice(counterQ, 1, blueGradient)
              }
            } else {
              let aux1 = false, aux2 = false, aux3 = false, aux4 = false, aux5 = false, aux6 = false

              if (stateConsumptions.checked1 && item.consumptionValueP1 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                values.splice(counterQ, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                aux1 = true
                //barsColors.splice(item.hour - 1, 1, redGradient)
                if (compare) {
                  barsColorsCompare.splice(counterQ, 1, whiteRed)
                } else {
                  barsColors.splice(counterQ, 1, redGradient)
                }
              } else if (stateConsumptions.checked2 && item.consumptionValueP2 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                values.splice(counterQ, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                aux2 = true
                //barsColors.splice(item.hour - 1, 1, orange)
                if (compare) {
                  barsColorsCompare.splice(counterQ, 1, whiteOrange)
                } else {
                  barsColors.splice(counterQ, 1, orange)
                }
              } else if (stateConsumptions.checked3 && item.consumptionValueP3 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                values.splice(counterQ, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                aux3 = true
                //barsColors.splice(item.hour - 1, 1, yellow)
                if (compare) {
                  barsColorsCompare.splice(counterQ, 1, whiteYellow)
                } else {
                  barsColors.splice(counterQ, 1, yellow)
                }
              } else if (stateConsumptions.checked4 && item.consumptionValueP4 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                values.splice(counterQ, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                aux4 = true
                //barsColors.splice(item.hour - 1, 1, greenGradient)
                if (compare) {
                  barsColorsCompare.splice(counterQ, 1, whiteGreenGradient)
                } else {
                  barsColors.splice(counterQ, 1, greenGradient)
                }
              } else if ((item.consumptionValueP1 || item.consumptionValueP2 || item.consumptionValueP3 || item.consumptionValueP4) && !compare) {
                barsColors.splice(counterQ, 1, transp)
              } else if ((item.consumptionValueP1 || item.consumptionValueP2 || item.consumptionValueP3 || item.consumptionValueP4) && compare) {
                barsColorsCompare.splice(counterQ, 1, transp)
              }

              if (!aux2 && stateConsumptions.checked2 && item.consumptionValueP2 && (labelAux[1] === '1' || labelAux[1] === '2' || labelAux[1] === '7' || labelAux[1] === '12' || labelAux[1] === '01' || labelAux[1] === '02' || labelAux[1] === '07')) {
                values.splice(counterQ, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                aux2 = true
                //barsColors.splice(item.hour - 1, 1, orange)
                if (compare) {
                  barsColorsCompare.splice(counterQ, 1, whiteOrange)
                } else {
                  barsColors.splice(counterQ, 1, orange)
                }
              } else if (!aux3 && stateConsumptions.checked3 && item.consumptionValueP3 && (labelAux[1] === '3' || labelAux[1] === '11' || labelAux[1] === '03')) {
                values.splice(counterQ, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                aux3 = true
                //barsColors.splice(item.hour - 1, 1, yellow)
                if (compare) {
                  barsColorsCompare.splice(counterQ, 1, whiteYellow)
                } else {
                  barsColors.splice(counterQ, 1, yellow)
                }
              } else if (!aux4 && stateConsumptions.checked4 && item.consumptionValueP4 && (labelAux[1] === '6' || labelAux[1] === '8' || labelAux[1] === '9' || labelAux[1] === '06' || labelAux[1] === '08' || labelAux[1] === '09')) {
                values.splice(counterQ, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                aux4 = true
                //barsColors.splice(item.hour - 1, 1, greenGradient)
                if (compare) {
                  barsColorsCompare.splice(counterQ, 1, whiteGreenGradient)
                } else {
                  barsColors.splice(counterQ, 1, greenGradient)
                }
              } else if (!aux5 && stateConsumptions.checked5 && item.consumptionValueP5 && (labelAux[1] === '4' || labelAux[1] === '5' || labelAux[1] === '10' || labelAux[1] === '04' || labelAux[1] === '05')) {
                values.splice(counterQ, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                aux5 = true
                //barsColors.splice(item.hour - 1, 1, darkGreenGradient)
                if (compare) {
                  barsColorsCompare.splice(counterQ, 1, whiteDarkGreenGradient)
                } else {
                  barsColors.splice(counterQ, 1, darkGreenGradient)
                }
              }

              if (!aux6 && stateConsumptions.checked6 && item.consumptionValueP6) {
                values.splice(counterQ, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                aux6 = true
                //barsColors.splice(item.hour - 1, 1, blue)
                if (compare) {
                  barsColorsCompare.splice(counterQ, 1, whiteblueGradient)
                } else {
                  barsColors.splice(counterQ, 1, blue)
                }
              } else if (item.consumptionValueP6 && !compare) {
                barsColors.splice(counterQ, 1, transp)
              } else if (item.consumptionValueP6 && compare) {
                barsColorsCompare.splice(counterQ, 1, transp)
              }
            }
          }
        } else {
          item.consumptionValue && values.push(parseFloat(item.consumptionValue.replace(',', '.')))
        }
        counterQ++
      }
    }
  }

  const insertarValorGrafica =(energiaReactiva: any, item: any, values: any, valuesPV?: any, valuesPL?: any, valuesPP?: any, valuesP0?: any, realValues?: any, posicion?: any)=>{
    if (!energiaReactiva) { 
      insertGranularityH(item, values, valuesPV, valuesPL, valuesPP, valuesP0, true, realValues)  
    } else {
      insertPushValues(item, values, valuesPV, valuesPL, valuesPP, valuesP0, posicion)
    }
  }

  const chartData = (canvas: any) => {

    let labels = [] as any
    let labelsQ = [] as any
    let values = [] as any
    let valuesPV = [] as any
    let valuesPL = [] as any
    let valuesPP = [] as any
    let valuesP0 = [] as any
    let valuesCompare = [] as any
    let valuesPVCompare = [] as any
    let valuesPLCompare = [] as any
    let valuesPPCompare = [] as any
    let valuesP0Compare = [] as any
    let realValues = [] as any
    let realValuesCompare = [] as any
    barsColors = []
    barsColorsPV = []
    barsColorsPL = []
    barsColorsPP = []
    barsColorsP0 = []
    setavgReactiveCompare(0)

    if (consumptionsFilters.compare === 'C' && consumptionsFilters.granularity === 'D') {
      labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
      values = [0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001]
      valuesCompare = [0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001]
    }
    else if (consumptionsFilters.granularity === 'S') {
      labels = getWeekDays()
      // labels = [t('supplies.suppliesDetails.components.consumption.charts.week.lunes'), t('supplies.suppliesDetails.components.consumption.charts.week.martes'), t('supplies.suppliesDetails.components.consumption.charts.week.miercoles'), t('supplies.suppliesDetails.components.consumption.charts.week.jueves'), t('supplies.suppliesDetails.components.consumption.charts.week.viernes'), t('supplies.suppliesDetails.components.consumption.charts.week.sabado'), t('supplies.suppliesDetails.components.consumption.charts.week.domingo')]
      valuesPV = [0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001]
      valuesPL = [0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001]
      valuesPP = [0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001]
      valuesP0 = [0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001]
      valuesCompare = [0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001]
      valuesPVCompare = [0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001]
      valuesPLCompare = [0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001]
      valuesPPCompare = [0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001, 0.0000001]
      barsColorsPV = ['', '', '', '', '', '', '']
      barsColorsPL = ['', '', '', '', '', '', '']
      barsColorsPP = ['', '', '', '', '', '', '']
      barsColorsP0 = ['', '', '', '', '', '', '']
    }
    else if (consumptionsFilters.granularity === 'M') {
      let dateAux = consumptionsFilters.startDate.split('/')
      let enddateAux = consumptionsFilters.endDate.split('/')
      let startDate
      let numItems
      let i

      //mismo año, restamos los meses y montamos el array
      if (dateAux[2] === enddateAux[2]) {
        numItems = (parseInt(enddateAux[1]) - parseInt(dateAux[1]))
        for (i = 0; i <= numItems; i++) {
          startDate = formatDate(new Date(dateAux[2], parseInt(dateAux[1]) - 1 + i, 1))
          values.push(0.0000001)
          labels.push(formatMonthAndYear(startDate))
          if (isAdapted === 'SI' && !energiaReactiva) {
            valuesPV.push(0.0000001)
            valuesPL.push(0.0000001)
            valuesPP.push(0.0000001)
            valuesP0.push(0.0000001)
            barsColors.push('')
            barsColorsPV.push('')
            barsColorsPL.push('')
            barsColorsPP.push('')
            barsColorsP0.push('')
          }
        }
      }
      //distinto año
      else if (dateAux[2] < enddateAux[2]) {
        //año menos uno
        if ((parseInt(dateAux[2]) + 1) === parseInt(enddateAux[2])) {
          numItems = (12 - parseInt(dateAux[1])) + parseInt(enddateAux[1])
          for (i = 0; i <= numItems; i++) {
            startDate = formatDate(new Date(dateAux[2], parseInt(dateAux[1]) - 1 + i, 1))
            values.push(0.0000001)
            labels.push(formatMonthAndYear(startDate))
            if (isAdapted === 'SI' && !energiaReactiva) {
              valuesPV.push(0.0000001)
              valuesPL.push(0.0000001)
              valuesPP.push(0.0000001)
              valuesP0.push(0.0000001)
              barsColors.push('')
              barsColorsPV.push('')
              barsColorsPL.push('')
              barsColorsPP.push('')
              barsColorsP0.push('')
            }
          }
        }
        //año menos dos
        else if ((parseInt(dateAux[2]) + 2) === parseInt(enddateAux[2])) {
          numItems = (12 - parseInt(dateAux[1]) + 12) + parseInt(enddateAux[1])
          for (i = 0; i <= numItems; i++) {
            startDate = formatDate(new Date(dateAux[2], parseInt(dateAux[1]) - 1 + i, 1))
            values.push(0.0000001)
            labels.push(formatMonthAndYear(startDate))
            if (isAdapted === 'SI' && !energiaReactiva) {
              valuesPV.push(0.0000001)
              valuesPL.push(0.0000001)
              valuesPP.push(0.0000001)
              valuesP0.push(0.0000001)
              barsColors.push('')
              barsColorsPV.push('')
              barsColorsPL.push('')
              barsColorsPP.push('')
              barsColorsP0.push('')
            }
          }
        }
      }
    } else if (consumptionsFilters.granularity === 'D' && isAdapted === 'SI' && !energiaReactiva) {
      if (currentSupplyConsumptions && currentSupplyConsumptions.consumptions && currentSupplyConsumptions.consumptions.items) {
        // INI - JAG - 20221229 - Inicializar valores hasta el primer dia con datos de consumo
        currentSupplyConsumptions.consumptions.items.map(
          (item) => {
            valuesPV.push(0.0000001)
            valuesPL.push(0.0000001)
            valuesPP.push(0.0000001)
            valuesP0.push(0.0000001)
            valuesCompare.push(0.0000001)
            valuesPVCompare.push(0.0000001)
            valuesPLCompare.push(0.0000001)
            valuesPPCompare.push(0.0000001)
            barsColors.push('')
            barsColorsPV.push('')
            barsColorsPL.push('')
            barsColorsPP.push('')
            barsColorsP0.push('')
          }
        )
        /*
        let numItems
        let i
        let auxDate
        let dateAux = consumptionsFilters.endDate.split('/')
        
        numItems = parseInt(dateAux[0])
        for (i = 0; i < numItems; i++) {
          auxDate = formatDate(new Date(dateAux[2], parseInt(dateAux[1]) - 1, i+1))
          
            values.push(0.0000001)
            valuesPV.push(0.0000001)
            valuesPL.push(0.0000001)
            valuesPP.push(0.0000001)
            valuesP0.push(0.0000001)
            valuesCompare.push(0.0000001)
            valuesPVCompare.push(0.0000001)
            valuesPLCompare.push(0.0000001)
            valuesPPCompare.push(0.0000001)
            barsColors.push('')
            barsColorsPV.push('')
            barsColorsPL.push('')
            barsColorsPP.push('')
            barsColorsP0.push('')
          
        }
        */
        // FIN - JAG - 20221229 - Inicializar valores hasta el primer dia con datos de consumo  

      } else if (currentSupplyConsumptions && currentSupplyConsumptions.consumptions && currentSupplyConsumptions.consumptions.items) {
        currentSupplyConsumptions.consumptions.items.map(
          (item) => {
            valuesPV.push(0.0000001)
            valuesPL.push(0.0000001)
            valuesPP.push(0.0000001)
            valuesP0.push(0.0000001)
            valuesCompare.push(0.0000001)
            valuesPVCompare.push(0.0000001)
            valuesPLCompare.push(0.0000001)
            valuesPPCompare.push(0.0000001)
            barsColors.push('')
            barsColorsPV.push('')
            barsColorsPL.push('')
            barsColorsPP.push('')
            barsColorsP0.push('')
          }
        )
      }
    } else if ((consumptionsFilters.granularity === 'H' || consumptionsFilters.granularity === 'Q') && isAdapted === 'SI' && !energiaReactiva) {
      //TODO Tibor -> se crea consumptionsCount para saber exactamente cuantos llegan. Hay que valdiar que tanto mdm como gmv10 se guarda el número. Ejecutar y comprobar consolelog
      let consumptionsCount = currentSupplyConsumptions && currentSupplyConsumptions.consumptions ? currentSupplyConsumptions.consumptions.count : currentSupplyConsumptions && currentSupplyConsumptions.consumptions ? currentSupplyConsumptions.consumptions.count : 0
      if (consumptionsFilters.granularity === 'H') {
        for (let i = 0; i < consumptionsCount; i++) {
          values.push(0.0000001)
          valuesCompare.push(0.0000001)
          valuesPVCompare.push(0.0000001)
          valuesPLCompare.push(0.0000001)
          valuesPPCompare.push(0.0000001)
          barsColors.push('')
          barsColorsCompare.push('')
          barsColorsPV.push('')
          barsColorsPL.push('')
          barsColorsPP.push('')
          barsColorsP0.push('')
        }
      } else if (consumptionsFilters.granularity === 'Q') {
        for (let i = 0; i < consumptionsCount; i++) {
          values.push(0.0000001)
          valuesCompare.push(0.0000001)
          valuesPVCompare.push(0.0000001)
          valuesPLCompare.push(0.0000001)
          valuesPPCompare.push(0.0000001)
          barsColors.push('')
          barsColorsCompare.push('')
          barsColorsPV.push('')
          barsColorsPL.push('')
          barsColorsPP.push('')
          barsColorsP0.push('')
        }
      }
    }

    if (currentSupplyConsumptions && currentSupplyConsumptions.consumptions && currentSupplyConsumptions.consumptions.items) {
      // if (consumptionsFilters.granularity === 'Q' && isAdapted === 'SI' && !energiaReactiva) {
      //   let auxCurrentSupplyConsumptions1 = currentSupplyConsumptions.consumptions.items.sort((a, b) => a.hour.localeCompre(b.hour))
      //   console.log('E999513 auxCurrentSupplyConsumptions 1: ', auxCurrentSupplyConsumptions1)
      //   // insertGranularityQ(item, values, valuesPV, valuesPL, valuesPP, valuesP0, false, realValues)
      // }
      let posicion = 0
      currentSupplyConsumptions.consumptions.items.map(
        (item) => {
          if (item.consumptionDate) {
            if (consumptionsFilters.granularity === 'M') {
              //labels.push(formatMonthAndYear(item.consumptionDate))
            } else if (consumptionsFilters.granularity === 'D') {
              if (consumptionsFilters.compare === 'N') {
                labels.push(formatDay(item.consumptionDate))
              }
            } else if (consumptionsFilters.granularity !== 'S') {
              if (consumptionsFilters.granularity === 'Q') {
                labelsQ.push(item.hour)
              } else {
                labels.push(formatHour(item.hour))
              }
            }

            auxLabels.push(item.consumptionDate)
          }

          //Aqui introducimos los valores que se mostraran a posteriori teniendo en cuenta condiciones
          if (consumptionsFilters.compare === 'C' && consumptionsFilters.granularity === 'D') {
            insertGranularityD(item, values, valuesPV, valuesPL, valuesPP, valuesP0)
          }
          else if (consumptionsFilters.granularity === 'S') {
            insertGranularityS(item, values, valuesPV, valuesPL, valuesPP, valuesP0)
          }
          else if (consumptionsFilters.granularity === 'M') {
            insertGranularityM(item, labels, values, valuesPV, valuesPL, valuesPP, valuesP0)
          }
          else if (consumptionsFilters.granularity === 'H' && isAdapted === 'SI' && !energiaReactiva) {
            insertGranularityH(item, values, valuesPV, valuesPL, valuesPP, valuesP0, false, realValues)
          }
          else if (consumptionsFilters.granularity === 'Q' && isAdapted === 'SI' && !energiaReactiva) {
            insertGranularityQ(item, values, valuesPV, valuesPL, valuesPP, valuesP0, false, realValues)
          }
          else {
            insertPushValues(item, values, valuesPV, valuesPL, valuesPP, valuesP0, posicion)
          }
          posicion++
          return null
        }
      )
    } else if (currentSupplyConsumptions && currentSupplyConsumptions.consumptions && currentSupplyConsumptions.consumptions.items) {
      labelsQ = []
      // if (consumptionsFilters.granularity === 'Q' && isAdapted === 'SI' && !energiaReactiva) {
      //   //let auxCurrentSupplyConsumptions2 = currentSupplyConsumptions.consumptions.items.sort((a, b) => a.hour.localeCompare(b.hour))
      //   let auxCurrentSupplyConsumptions2 = currentSupplyConsumptions.consumptions.items.sort(function(a,b){ return (a.hour - b.hour)})
      //   console.log('E999513 auxCurrentSupplyConsumptions 2: ', auxCurrentSupplyConsumptions2)
      //   // insertGranularityQ(item, values, valuesPV, valuesPL, valuesPP, valuesP0, false, realValues)
      // }
      let posicion = 0
      currentSupplyConsumptions.consumptions.items.map(
        (item) => {

          if (item.consumptionDate) {
            if (consumptionsFilters.granularity === 'M') {
              //labels.push(formatMonthAndYear(item.consumptionDate))
            } else if (consumptionsFilters.granularity === 'D') {
              if (consumptionsFilters.compare === 'N') {
                labels.push(formatDay(item.consumptionDate))
              }
            } else if (consumptionsFilters.granularity !== 'S') {
              if (consumptionsFilters.granularity === 'Q') {
                // getQuarter() E999513 cambiar lo del quarter ya viene en la hora
                // labelsQ.push(formatQuarterHour(item.hour, quarter))
                labelsQ.push(item.hour)
              } else {
                labels.push(formatHour(item.hour))
              }
            }

            auxLabels.push(item.consumptionDate)
          }

          //Aqui introducimos los valores que se mostraran a posteriori teniendo en cuenta condiciones
          if (consumptionsFilters.compare === 'C' && consumptionsFilters.granularity === 'D') {
            insertGranularityD(item, values, valuesPV, valuesPL, valuesPP, valuesP0)
          }
          else if (consumptionsFilters.granularity === 'S') {
            insertGranularityS(item, values, valuesPV, valuesPL, valuesPP, valuesP0)
          }
          else if (consumptionsFilters.granularity === 'M') {
            insertGranularityM(item, labels, values, valuesPV, valuesPL, valuesPP, valuesP0)
          }
          else if (consumptionsFilters.granularity === 'H' && isAdapted === 'SI' && !energiaReactiva) {
            insertGranularityH(item, values, valuesPV, valuesPL, valuesPP, valuesP0, false, realValues)
          }
          else if (consumptionsFilters.granularity === 'Q' && isAdapted === 'SI' && !energiaReactiva) {
            insertGranularityQ(item, values, valuesPV, valuesPL, valuesPP, valuesP0, false, realValues)
          }
          else {
            insertPushValues(item, values, valuesPV, valuesPL, valuesPP, valuesP0, posicion)
          }
          posicion++
          return null
        }
      )
    }
    //Este paso es necesario ya que en caso de coger una semana que contenga dias de 2 meses distintos se guarda en una nueva posicion del currentSupplyConsumptions
    if (currentSupplyConsumptions[1] && currentSupplyConsumptions[1].consumptions && currentSupplyConsumptions[1].consumptions.items) {
      // if (consumptionsFilters.granularity === 'Q' && isAdapted === 'SI' && !energiaReactiva) {
      //   let auxCurrentSupplyConsumptions3 = currentSupplyConsumptions[1].consumptions.items.sort((a, b) => a.hour.localeCompre(b.hour))
      //   console.log('E999513 auxCurrentSupplyConsumptions 3: ', auxCurrentSupplyConsumptions3)
      //   // insertGranularityQ(item, values, valuesPV, valuesPL, valuesPP, valuesP0, false, realValues)
      // }
      let posicion = 0
      currentSupplyConsumptions[1].consumptions.items.map(
        (item) => {
          if (item.consumptionDate) {
            if (consumptionsFilters.granularity === 'M') {
              //labels.push(formatMonthAndYear(item.consumptionDate))
            } else if (consumptionsFilters.granularity === 'D') {
              if (consumptionsFilters.compare === 'N') {
                labels.push(formatDay(item.consumptionDate))
              }
            } else if (consumptionsFilters.granularity !== 'S') {
              if (consumptionsFilters.granularity === 'Q') {
                labelsQ.push(item.hour)
              } else {
                labels.push(formatHour(item.hour))
              }
            }

            auxLabels.push(item.consumptionDate)
          }

          if (consumptionsFilters.compare === 'C' && consumptionsFilters.granularity === 'D') {
            insertGranularityD(item, values, valuesPV, valuesPL, valuesPP, valuesP0)
          }
          else if (consumptionsFilters.granularity === 'S') {
            insertGranularityS(item, values, valuesPV, valuesPL, valuesPP, valuesP0)
          }
          else if (consumptionsFilters.granularity === 'M') {
            insertGranularityM(item, labels, values, valuesPV, valuesPL, valuesPP, valuesP0)
          }
          else if (consumptionsFilters.granularity === 'H' && isAdapted === 'SI' && !energiaReactiva) {
            insertGranularityH(item, values, valuesPV, valuesPL, valuesPP, valuesP0, false, realValues)
          }
          else if (consumptionsFilters.granularity === 'Q' && isAdapted === 'SI' && !energiaReactiva) {
            insertGranularityQ(item, values, valuesPV, valuesPL, valuesPP, valuesP0, false, realValues)
          }
          else {
            insertPushValues(item, values, valuesPV, valuesPL, valuesPP, valuesP0, posicion)
          }
          posicion++
          return null
        }
      )
    }

    let max
    let min
    let sum = 0
    //let realValues = [] as any
    let i
    counterQ = 0
    contadorHoras = 0

    if (energiaReactiva || (supplyData.measurementSystem === 'G' && currentSupplyConsumptions.consumptions) || (consumptionsFilters.granularity === 'S' && currentSupplyConsumptions.length > 0)) {
      if (realValues.length < 1) {
        for (i = 0; i <= values.length; i++) {
          if (values[i] !== 0.0000001 && values[i] !== undefined) {
            realValues.push(values[i])
          }
        }
      }
      if (realValues.length > 0) {
        max = Math.max.apply(null, realValues)
        min = Math.min.apply(null, realValues)
        sum = realValues.reduce((previous, current) => current += previous)
        setavgReactive(sum / realValues.length)
      }
    }

    if (isAdapted !== 'SI' || energiaReactiva) {
      for (let i = 0; i < values.length; i++) {
        const value = values[i]

        if (consumptionsFilters.compare === 'C') {
          barsColors.push(darkblueGradient)
        }
        else {
          //separamos en caso de semana para cuando recupera una semana con dias de dos meses distintos
          if (consumptionsFilters.granularity === 'S' && currentSupplyConsumptions.length > 1) {
            let maxValue = 0
            let minValue = 0
            let maxValue2 = 0
            let minValue2 = 0

            if (!energiaReactiva && supplyData.measurementSystem === 'O') {
              maxValue = parseFloat(currentSupplyConsumptions.maxConsumption.replace(',', '.'))
              minValue = parseFloat(currentSupplyConsumptions.minConsumption.replace(',', '.'))
              maxValue2 = parseFloat(currentSupplyConsumptions[1].maxConsumption.replace(',', '.'))
              minValue2 = parseFloat(currentSupplyConsumptions[1].minConsumption.replace(',', '.'))
            }
            else {
              maxValue = Math.max.apply(null, values)
              minValue = Math.min.apply(null, values)
              maxValue2 = Math.max.apply(null, valuesCompare)
              minValue2 = Math.min.apply(null, valuesCompare)
            }

            if (maxValue2 > maxValue) {
              maxValue = maxValue2
            }

            if (minValue2 < minValue) {
              minValue = minValue2
            }

            if (supplyData.measurementSystem === 'O') {
              if (currentSupplyConsumptions && currentSupplyConsumptions.minConsumption && value === minValue) {
                barsColors.push(greenGradient)
              } else if (currentSupplyConsumptions && currentSupplyConsumptions.maxConsumption && value === maxValue) {
                barsColors.push(redGradient)
              } else if (currentSupplyConsumptions[1] && currentSupplyConsumptions[1].minConsumption && value === minValue) {
                barsColors.push(greenGradient)
              } else if (currentSupplyConsumptions[1] && currentSupplyConsumptions[1].maxConsumption && value === maxValue) {
                barsColors.push(redGradient)
              } else if (value === 0.0000001) {
                barsColors.push('rgba(0, 0, 0, 0)')
                values[i] = 0
              } else {
                barsColors.push(blueGradient)
              }
            } else {
              if (avgReactive > 0 && value === min) {
                barsColors.push(greenGradient)
              } else if (avgReactive > 0 && value === max) {
                barsColors.push(redGradient)
              } else if (value === 0.0000001) {
                barsColors.push('rgba(0, 0, 0, 0)')
                values[i] = 0
              } else {
                barsColors.push(blueGradient)
              }
            }
          }
          else {
            if (currentSupplyConsumptions && currentSupplyConsumptions.minConsumption && value === parseFloat(currentSupplyConsumptions.minConsumption.replace(',', '.'))) {
              barsColors.push(greenGradient)
            } else if (currentSupplyConsumptions && currentSupplyConsumptions.maxConsumption && value === parseFloat(currentSupplyConsumptions.maxConsumption.replace(',', '.'))) {
              barsColors.push(redGradient)
            } else if (avgReactive > 0 && value === min) {
              barsColors.push(greenGradient)
            } else if (avgReactive > 0 && value === max) {
              barsColors.push(redGradient)
            } else if (value === 0.0000001) {
              barsColors.push('rgba(0, 0, 0, 0)')
              values[i] = 0
            } else {
              barsColors.push(blueGradient)
            }
          }
        }
      }
    }

    //En caso de estar comparando cargaremos dichos consumos
    if (consumptionsFilters.compare === 'C' && currentCompareConsumptions && currentCompareConsumptions.consumptions && currentCompareConsumptions.consumptions.items) {
      // if (consumptionsFilters.granularity === 'Q' && isAdapted === 'SI' && !energiaReactiva) {
      //   let auxCurrentSupplyConsumptions4 = currentSupplyConsumptions.consumptions.items.sort((a, b) => a.hour.localeCompre(b.hour))
      //   console.log('E999513 auxCurrentSupplyConsumptions 4: ', auxCurrentSupplyConsumptions4)
      //   // insertGranularityQ(item, values, valuesPV, valuesPL, valuesPP, valuesP0, false, realValues)
      // }
      const horasDiaComparado = currentCompareConsumptions.consumptions.items.length;
      const horasDiaBase = currentSupplyConsumptions.consumptions.items.length;
      let posicion = 0
      currentCompareConsumptions.consumptions.items.map(
        (item, index) => {

          if (consumptionsFilters.granularity === 'D') {
            insertGranularityD(item, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare)
          }
          else if (consumptionsFilters.granularity === 'S') {
            insertGranularityS(item, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare)
          }
          else if (consumptionsFilters.granularity === 'H' && isAdapted === 'SI' ) {
            if (horasDiaBase === horasDiaComparado) {
              
              insertarValorGrafica( energiaReactiva, item, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare, realValuesCompare, posicion);
            } else if (horasDiaBase === 23 && horasDiaComparado >= 24) {
              if (item.hour===2){
                labels.splice(1,0,'02:00');
                values.splice(1,0,'0.0');
                barsColors.splice(1, 0, transp);
              }
              insertarValorGrafica( energiaReactiva, item, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare, realValuesCompare, posicion);
            } else if (horasDiaBase === 24 && horasDiaComparado === 23) {
              insertarValorGrafica( energiaReactiva, item, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare, realValuesCompare, posicion);
                if (item.hour === 1){
                  const itemDummy = createDummyItem(item,'2');
                  insertarValorGrafica( energiaReactiva, itemDummy, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare, realValuesCompare, posicion); 
                }
            } else if (horasDiaBase === 24 && horasDiaComparado === 25 ) {
              if(index===2){
                labels.splice(2,0,'02:00');
                values.splice(2,0,'0.0');
                barsColors.splice(2, 0, transp);
              }
              insertarValorGrafica( energiaReactiva, item, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare, realValuesCompare, posicion); 
            } else if (horasDiaBase === 25 && horasDiaComparado <= 24) {
              if (index === 1){
                 if (horasDiaComparado===24){
                  insertarValorGrafica( energiaReactiva, item, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare, realValuesCompare, posicion);
                  } 
              for (let iteraciones = 1; iteraciones <= horasDiaBase-horasDiaComparado; iteraciones++) {
                    const itemDummy = createDummyItem(item,'2');
                    insertarValorGrafica( energiaReactiva, itemDummy, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare, realValuesCompare, posicion);
                  }
              if (item.hour===3){
                insertarValorGrafica( energiaReactiva, item, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare, realValuesCompare, posicion);
              }
               }else {
                insertarValorGrafica( energiaReactiva, item, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare, realValuesCompare, posicion);
               }
            }
          }
          else if (consumptionsFilters.granularity === 'Q' && isAdapted === 'SI' && !energiaReactiva) {
            insertGranularityQ(item, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare, true, realValuesCompare)
          }
          else if (!energiaReactiva) {
            insertPushValues(item, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare, posicion)
          }
          posicion++
          return null
        }
      )

      if (consumptionsFilters.compare === 'C' && currentCompareConsumptions[1] && currentCompareConsumptions[1].consumptions && currentCompareConsumptions[1].consumptions.items) {
        let posicion = 0
        currentCompareConsumptions[1].consumptions.items.map(
          (item, index) => {

            if (consumptionsFilters.granularity === 'D') {
              insertGranularityD(item, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare)
            }
            else if (consumptionsFilters.granularity === 'S') {
              insertGranularityS(item, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare)
            }
            else if (consumptionsFilters.granularity === 'H') {
              if (horasDiaBase === horasDiaComparado) {
                insertarValorGrafica( energiaReactiva, item, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare, realValuesCompare, posicion);
              } else if (horasDiaBase === 23 && horasDiaComparado >= 24 && item.hour !== 2) {
                insertarValorGrafica( energiaReactiva, item, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare, realValuesCompare, posicion);
              } else if (horasDiaBase === 24 && horasDiaComparado === 23) {
                insertarValorGrafica( energiaReactiva, item, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare, realValuesCompare, posicion);
                  if (item.hour === 1){
                    const itemDummy = createDummyItem(item,'2');
                    insertarValorGrafica( energiaReactiva, itemDummy, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare, realValuesCompare, posicion);
                  }
              } else if (horasDiaBase === 24 && horasDiaComparado === 25 && index !== 2) {
                insertarValorGrafica( energiaReactiva, item, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare, realValuesCompare, posicion);
              } else if (horasDiaBase === 25 && horasDiaComparado <= 24) {
              if (index === 1){
                 if (horasDiaComparado===24){
                  insertarValorGrafica( energiaReactiva, item, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare, realValuesCompare, posicion);
                  } 
              for (let iteraciones = 1; iteraciones <= horasDiaBase-horasDiaComparado; iteraciones++) {
                    const itemDummy = createDummyItem(item,'2');
                    insertarValorGrafica( energiaReactiva, itemDummy, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare, realValuesCompare, posicion);
                  }
              if (item.hour===3){
                insertarValorGrafica( energiaReactiva, item, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare, realValuesCompare, posicion);
              }
               }else {
                insertarValorGrafica( energiaReactiva, item, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare, realValuesCompare, posicion); 
               }
            }
            }
            else if (!energiaReactiva){
              insertPushValues(item, valuesCompare, valuesPVCompare, valuesPLCompare, valuesPPCompare, valuesP0Compare, posicion)
            }
            posicion++
            return null
          }
        )
      }

      let maxComp
      let minComp
      let sumComp
      let i

      if (energiaReactiva || supplyData.measurementSystem === 'G' || (consumptionsFilters.granularity === 'S' && currentCompareConsumptions.length > 0)) {
        if (realValuesCompare.length < 1) {
          for (i = 0; i <= valuesCompare.length; i++) {
            if (valuesCompare[i] !== 0.0000001 && valuesCompare[i] !== undefined) {
              realValuesCompare.push(valuesCompare[i])
            }
          }
        }
        if (realValuesCompare.length > 0) {
          maxComp = Math.max.apply(null, realValuesCompare)
          minComp = Math.min.apply(null, realValuesCompare)
          sumComp = realValuesCompare.reduce((previous, current) => current += previous)
          setavgReactiveCompare(sumComp / realValuesCompare.length)
        }
      }

      if ((consumptionsFilters.granularity !== 'H' && consumptionsFilters.granularity !== 'Q') || isAdapted !== 'SI' || energiaReactiva) {
        for (let i = 0; i < valuesCompare.length; i++) {
          const value = valuesCompare[i]
          barsColorsCompare.push(whiteblueGradient)
        }
      }

      return {
        labels: consumptionsFilters.granularity === 'Q' ? labelsQ : labels,
        datasets: [
          {
            label: (consumptionsFilters.showR1 === 'S' || consumptionsFilters.showR4 === 'S' || isGenerationTab) ? t('supplies.suppliesDetails.components.consumption.charts.graph.energy') : t('supplies.suppliesDetails.components.consumption.charts.graph.consumption'),
            data: values,
            backgroundColor: barsColors
          },
          {
            label: (consumptionsFilters.showR1 === 'S' || consumptionsFilters.showR4 === 'S' || isGenerationTab) ? t('supplies.suppliesDetails.components.consumption.charts.graph.compareEnergy') : t('supplies.suppliesDetails.components.consumption.charts.graph.compareConsumption'),
            data: valuesCompare,
            backgroundColor: barsColorsCompare
          }
        ]
      }
    } else {
      if (isAdapted === 'SI' && consumptionsFilters.granularity !== 'H' && consumptionsFilters.granularity !== 'Q' && !energiaReactiva) {
        if (tipoUsuario === 'simple') {
          return {
            labels: labels,
            datasets: [
              {
                label: 'P3',
                data: valuesPV,
                backgroundColor: barsColorsPV
              },
              {
                label: 'P2',
                data: (stateConsumptions.checked2 || (!stateConsumptions.checked2 && !stateConsumptions.checked0)) ? valuesPL : valuesP0,
                backgroundColor: (stateConsumptions.checked2 || (!stateConsumptions.checked2 && !stateConsumptions.checked0)) ? barsColorsPL : barsColorsP0
              },
              {
                label: 'P1',
                data: valuesPP,
                backgroundColor: barsColorsPP
              }
            ]
          }
        } else {
          //usuario complejo adaptado
          return {
            labels: labels,
            datasets: [
              {
                label: 'P3',
                data: valuesPV,
                backgroundColor: barsColorsPV
              },
              {
                label: 'P2',
                data: valuesPL,
                backgroundColor: barsColorsPL
              },
              {
                label: 'P1',
                data: valuesPP,
                backgroundColor: barsColorsPP
              }
            ]
          }
        }
      } else {
        return {
          labels: consumptionsFilters.granularity === 'Q' ? labelsQ : labels,
          datasets: [
            {
              label: (consumptionsFilters.showR1 === 'S' || consumptionsFilters.showR4 === 'S' || isGenerationTab) ? t('supplies.suppliesDetails.components.consumption.charts.graph.energy') : t('supplies.suppliesDetails.components.consumption.charts.graph.consumption'),
              data: values,
              backgroundColor: barsColors
            }
          ]
        }

      }
    }
  }

  //Definimos la media de consumo para poder pintar la linia en el grafico junto a la de la comparativa
  if ((consumptionsFilters.granularity === 'S' && currentSupplyConsumptions[1] && currentSupplyConsumptions[1].consumptions && currentSupplyConsumptions[1].consumptions.items) || supplyData.measurementSystem === 'G') {
    avarage = avgReactive
  }
  else {
    avarage = ((!isGeneration || (isGeneration && isGenerationTab)) && currentSupplyConsumptions && currentSupplyConsumptions.avgConsumption) && parseFloat(currentSupplyConsumptions.avgConsumption.replace(',', '.'))
  }

  if ((consumptionsFilters.granularity === 'S' && currentCompareConsumptions[1] && currentCompareConsumptions[1].consumptions && currentCompareConsumptions[1].consumptions.items) || supplyData.measurementSystem === 'G') {
    avarageCompare = avgReactiveCompare
  }
  else {
    avarageCompare = ((!isGeneration || (isGeneration && isGenerationTab)) && currentCompareConsumptions && currentCompareConsumptions.avgConsumption) && parseFloat(currentCompareConsumptions.avgConsumption.replace(',', '.'))
  }

  let missingValue = t('supplies.suppliesDetails.components.consumption.charts.graph.missingData')

  const chartOptions = {
    //cornerRadius: isAdapted !== 'SI' && 8,
    cornerRadius: 2,
    fullCornerRadius: false,
    legend: {
      display: false
    },
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index',
      intersect: false,
      itemSort: consumptionsFilters.compare !== 'C' && isAdapted === 'SI' && function (a, b) {
        return b.datasetIndex - a.datasetIndex
      },
      callbacks: {
        label: function (t, d) {
          if (t.datasetIndex === 0) {
            if (t.value === '1e-7' || barsColors[t.index] === 'rgba(0, 0, 0, 0)') {
              return missingValue
            } else if (t.value === '1e-8') {
              return []
            } else {
              return (energiaReactiva ? t.yLabel.toFixed(2).replace('.', ',') + ' kVArh' : t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 1) {
            if (t.value === '1e-7' || barsColors[t.index] === 'rgba(0, 0, 0, 0)') {
              return missingValue
            } else if (t.value === '1e-8') {
              return []
            } else {
              return (energiaReactiva ? t.yLabel.toFixed(2).replace('.', ',') + ' kVArh' : t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 2) {
            if (t.value === '1e-7' || barsColors[t.index] === 'rgba(0, 0, 0, 0)') {
              return missingValue
            } else if (t.value === '1e-8') {
              return []
            } else {
              return (energiaReactiva ? t.yLabel.toFixed(2).replace('.', ',') + ' kVArh' : t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 3) {
            if (t.value === '1e-7' || barsColors[t.index] === 'rgba(0, 0, 0, 0)') {
              return missingValue
            } else if (t.value === '1e-8') {
              return []
            } else {
              return (energiaReactiva ? t.yLabel.toFixed(2).replace('.', ',') + ' kVArh' : t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 4) {
            if (t.value === '1e-7' || barsColors[t.index] === 'rgba(0, 0, 0, 0)') {
              return missingValue
            } else if (t.value === '1e-8') {
              return []
            } else {
              return (energiaReactiva ? t.yLabel.toFixed(2).replace('.', ',') + ' kVArh' : t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          } else if (t.datasetIndex === 5) {
            if (t.value === '1e-7' || barsColors[t.index] === 'rgba(0, 0, 0, 0)') {
              return missingValue
            } else if (t.value === '1e-8') {
              return []
            } else {
              return (energiaReactiva ? t.yLabel.toFixed(2).replace('.', ',') + ' kVArh' : t.yLabel.toFixed(2).replace('.', ',') + ' kWh')
            }
          }
        }
      }
    },
    scales: {
      xAxes: [{
        stacked: (isAdapted === 'SI' && consumptionsFilters.granularity !== 'H' && consumptionsFilters.granularity !== 'Q' && !energiaReactiva && consumptionsFilters.compare !== 'C') ? true : false,
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
        stacked: (isAdapted === 'SI' && consumptionsFilters.granularity !== 'H' && consumptionsFilters.granularity !== 'Q' && !energiaReactiva && consumptionsFilters.compare !== 'C') ? true : false,
        gridLines: {
          display: true,
          color: '#D8D8D8',
          borderDash: [12, 6]
        },
        ticks: {
          beginAtZero: true,
          stepsSize: 50,
          suggestedMax: 0.1,
          fontColor: '#004571',
          fontSize: 11,
          padding: 16,
          callback: function (label) {
            if (energiaReactiva) {
              return label + ' kVArh '
            }
            return label + ' kWh'
          }
        }
      }]
    },
    //consumo medio en el grafico
    annotation: {
      annotations: [{
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: (energiaReactiva || supplyData.measurementSystem === 'G') ? avgReactive : avarage,
        borderColor: consumptionsFilters.compare === 'N' ? '#0066CC' : '#004571',
        borderWidth: 4,
        borderDash: [2, 4],
        borderDashOffset: 5
      }, consumptionsFilters.compare === 'C' && (avarageCompare > 0 || avgReactiveCompare > 0) &&
      {
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: (energiaReactiva || supplyData.measurementSystem === 'G') ? avgReactiveCompare : avarageCompare,
        borderColor: consumptionsFilters.compare === 'N' ? '#0066CC' : 'rgba(102, 195, 202, 1)',
        borderWidth: 4,
        borderDash: [3, 5],
        borderDashOffset: 5,
      }]
    },
    onClick: function (c, i) {
      if (i && i[0]) {
        //setDatesRange(i[0]._chart.data.labels[0])

        let index = i[0]._index
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
    }
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
        <Bar
          width={800}
          height={300}
          data={chartData}
          options={chartOptions}
        />
      </Grid>

      {isAdapted === 'SI' && !energiaReactiva && (consumptionsFilters.compare === 'N' || consumptionsFilters.granularity === 'H' || consumptionsFilters.granularity === 'Q') &&
        <DynamicLegendConsumptions
          state={stateConsumptions}
          setState={setStateConsumptions}
          tipoUsuario={tipoUsuario}
          disabledCheckbox={disabledCheckbox}
        />
      }

      <Legend
        currentSupplyConsumptions={currentSupplyConsumptions}
        currentCompareConsumptions={currentCompareConsumptions}
        isGeneration={isGeneration}
        isGenerationTab={isGenerationTab}
        consumptionsFilters={consumptionsFilters}
        energiaReactiva={energiaReactiva}
        isAdapted={isAdapted}
        supplyData={supplyData}
        tipoUsuario={tipoUsuario}
        adaptedDate={adaptedDate}
      />
    </>
  )
}

export default Graph