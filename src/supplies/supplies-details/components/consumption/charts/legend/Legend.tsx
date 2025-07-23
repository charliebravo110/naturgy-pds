import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import { formatMonthAndYear } from '../../../../../../common/lib/FormatLib'
import TotalConsumptionIcon from '../../../../../../assets/icons/consumo_total.svg'
import PeriodIcon from '../../../../../../assets/icons/periodo.svg'
import MaxConsumptionIcon from '../../../../../../assets/icons/consumo_maximo.svg'
import MidConsumptionIcon from '../../../../../../assets/icons/consumo_medio.svg'
import MinConsumptionIcon from '../../../../../../assets/icons/consumo_minimo.svg'
import Consumption2 from '../../../../../../assets/icons/consumo2.svg'
import Consumption1 from '../../../../../../assets/icons/consumo1.svg'

import useStyles from './Legend.styles'

const Legend = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    currentSupplyConsumptions,
    currentCompareConsumptions,
    isGeneration,
    isGenerationTab,
    consumptionsFilters,
    energiaReactiva,
    isAdapted,
    supplyData,
    tipoUsuario,
    adaptedDate
  } = props

  let max
  let min
  let sum
  let sumP0
  let sumP1
  let sumP2
  let sumP3
  let sumP4
  let sumP5
  let sumP6
  let avg
  let maxCompare
  let minCompare
  let sumCompare
  let avgCompare
  let realValues = [] as any
  let realValuesP0 = [] as any
  let realValuesP1 = [] as any
  let realValuesP2 = [] as any
  let realValuesP3 = [] as any
  let realValuesP4 = [] as any
  let realValuesP5 = [] as any
  let realValuesP6 = [] as any
  let realValuesCompare = [] as any
  let i
  let splitAdaptedDate: any[] = adaptedDate && adaptedDate.split('/')
  let labelAux

  if (energiaReactiva || consumptionsFilters.granularity === 'S' || supplyData.measurementSystem === 'G' || isAdapted === 'SI') {
    if (currentSupplyConsumptions && currentSupplyConsumptions.consumptions && currentSupplyConsumptions.consumptions.items) {
      currentSupplyConsumptions.consumptions.items.map(
        (item) => {
          labelAux = item.consumptionDate.split('/')
          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                realValues.push(parseFloat(item.reactive2.replace(',', '.')))
              }
              else if (consumptionsFilters.showR3 === 'S') {
                realValues.push(parseFloat(item.reactive3.replace(',', '.')))
              }
              else {
                realValues.push(parseFloat(item.activeOutput.replace(',', '.')))
              }
            }
            else {
              if (consumptionsFilters.showR1 === 'S') {
                realValues.push(parseFloat(item.reactive1.replace(',', '.')))
              }
              else if (consumptionsFilters.showR4 === 'S') {
                realValues.push(parseFloat(item.reactive4.replace(',', '.')))
              }
              else {
                realValues.push(parseFloat(item.activeInput.replace(',', '.')))

                //en caso de estar adaptado recuperamos valores de los distintos periodos posibles
                if (isAdapted === 'SI') {
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                    item.activeInput && realValuesP0.push(parseFloat(item.activeInput.replace(',', '.')))
                  } else if (tipoUsuario === 'simple') {
                    item.consumptionValueP1 && realValuesP1.push(parseFloat(item.consumptionValueP1.replace(',', '.')))
                    item.consumptionValueP2 && realValuesP2.push(parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP3 && realValuesP3.push(parseFloat(item.consumptionValueP3.replace(',', '.')))
                  } else {
                    item.consumptionValueP1 && realValuesP1.push(parseFloat(item.consumptionValueP1.replace(',', '.')))
                    item.consumptionValueP2 && realValuesP2.push(parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP3 && realValuesP3.push(parseFloat(item.consumptionValueP3.replace(',', '.')))
                    item.consumptionValueP4 && realValuesP4.push(parseFloat(item.consumptionValueP4.replace(',', '.')))
                    item.consumptionValueP5 && realValuesP5.push(parseFloat(item.consumptionValueP5.replace(',', '.')))
                    item.consumptionValueP6 && realValuesP6.push(parseFloat(item.consumptionValueP6.replace(',', '.')))
                  }
                }
              }
            }
          }
          else {
            if (consumptionsFilters.showR1 === 'S') {
              realValues.push(parseFloat(item.reactive1.replace(',', '.')))
            }
            else if (consumptionsFilters.showR4 === 'S') {
              realValues.push(parseFloat(item.reactive4.replace(',', '.')))
            }
            else {
              realValues.push(parseFloat(item.consumptionValue.replace(',', '.')))

              //en caso de estar adaptado recuperamos valores de los distintos periodos posibles
              if (isAdapted === 'SI') {
                if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                  item.consumptionValue && realValuesP0.push(parseFloat(item.consumptionValue.replace(',', '.')))
                } else if (tipoUsuario === 'simple') {
                  item.consumptionValueP1 && realValuesP1.push(parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && realValuesP2.push(parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && realValuesP3.push(parseFloat(item.consumptionValueP3.replace(',', '.')))
                } else {
                  item.consumptionValueP1 && realValuesP1.push(parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && realValuesP2.push(parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && realValuesP3.push(parseFloat(item.consumptionValueP3.replace(',', '.')))
                  item.consumptionValueP4 && realValuesP4.push(parseFloat(item.consumptionValueP4.replace(',', '.')))
                  item.consumptionValueP5 && realValuesP5.push(parseFloat(item.consumptionValueP5.replace(',', '.')))
                  item.consumptionValueP6 && realValuesP6.push(parseFloat(item.consumptionValueP6.replace(',', '.')))
                }
              }
            }
          }
        })





      //calculamos los totales generales
      max = Math.max.apply(null, realValues).toFixed(2).replace('.', ',')
      min = Math.min.apply(null, realValues).toFixed(2).replace('.', ',')
      //sum = realValues.reduce((previous, current) => current += previous)
      // Si hay múltiples peticiones en currentSupplyConsumptions, sumamos todos sus valores de totalConsumption
      if (Array.isArray(currentSupplyConsumptions)) {
        sum = currentSupplyConsumptions.reduce((acc, consumption) => {
          const total = parseFloat(consumption.totalConsumption?.replace(',', '.') || '0'); // Convertimos a número
          return acc + total;
        }, 0);
      } else if (currentSupplyConsumptions && currentSupplyConsumptions.totalConsumption) {
        // Caso en que solo haya una petición
        sum = parseFloat(currentSupplyConsumptions.totalConsumption.replace(',', '.')) || 0;
      }
      console.log(currentSupplyConsumptions)
      console.log('aqui3', sum)
      avg = (sum / realValues.length)
      avg = avg.toFixed(2).replace('.', ',')
      sum = sum.toFixed(2).replace('.', ',')

    } else if (currentSupplyConsumptions && currentSupplyConsumptions.consumptions && currentSupplyConsumptions.consumptions.items) {
      currentSupplyConsumptions.consumptions.items.map(
        (item) => {
          labelAux = item.consumptionDate.split('/')
          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                realValues.push(parseFloat(item.reactive2.replace(',', '.')))
              }
              else if (consumptionsFilters.showR3 === 'S') {
                realValues.push(parseFloat(item.reactive3.replace(',', '.')))
              }
              else {
                realValues.push(parseFloat(item.activeOutput.replace(',', '.')))
              }
            }
            else {
              if (consumptionsFilters.showR1 === 'S') {
                realValues.push(parseFloat(item.reactive1.replace(',', '.')))
              }
              else if (consumptionsFilters.showR4 === 'S') {
                realValues.push(parseFloat(item.reactive4.replace(',', '.')))
              }
              else {
                realValues.push(parseFloat(item.activeInput.replace(',', '.')))

                //en caso de estar adaptado recuperamos valores de los distintos periodos posibles
                if (isAdapted === 'SI') {
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                    item.activeInput && realValuesP0.push(parseFloat(item.activeInput.replace(',', '.')))
                  } else if (tipoUsuario === 'simple') {
                    item.consumptionValueP1 && realValuesP1.push(parseFloat(item.consumptionValueP1.replace(',', '.')))
                    item.consumptionValueP2 && realValuesP2.push(parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP3 && realValuesP3.push(parseFloat(item.consumptionValueP3.replace(',', '.')))
                  } else {
                    item.consumptionValueP1 && realValuesP1.push(parseFloat(item.consumptionValueP1.replace(',', '.')))
                    item.consumptionValueP2 && realValuesP2.push(parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP3 && realValuesP3.push(parseFloat(item.consumptionValueP3.replace(',', '.')))
                    item.consumptionValueP4 && realValuesP4.push(parseFloat(item.consumptionValueP4.replace(',', '.')))
                    item.consumptionValueP5 && realValuesP5.push(parseFloat(item.consumptionValueP5.replace(',', '.')))
                    item.consumptionValueP6 && realValuesP6.push(parseFloat(item.consumptionValueP6.replace(',', '.')))
                  }
                }
              }
            }
          }
          else {
            if (consumptionsFilters.showR1 === 'S') {
              realValues.push(parseFloat(item.reactive1.replace(',', '.')))
            }
            else if (consumptionsFilters.showR4 === 'S') {
              realValues.push(parseFloat(item.reactive4.replace(',', '.')))
            }
            else {
              realValues.push(parseFloat(item.consumptionValue.replace(',', '.')))

              //en caso de estar adaptado recuperamos valores de los distintos periodos posibles
              if (isAdapted === 'SI') {
                if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                  item.consumptionValue && realValuesP0.push(parseFloat(item.consumptionValue.replace(',', '.')))
                } else if (tipoUsuario === 'simple') {
                  item.consumptionValueP1 && realValuesP1.push(parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && realValuesP2.push(parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && realValuesP3.push(parseFloat(item.consumptionValueP3.replace(',', '.')))
                } else {
                  item.consumptionValueP1 && realValuesP1.push(parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && realValuesP2.push(parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && realValuesP3.push(parseFloat(item.consumptionValueP3.replace(',', '.')))
                  item.consumptionValueP4 && realValuesP4.push(parseFloat(item.consumptionValueP4.replace(',', '.')))
                  item.consumptionValueP5 && realValuesP5.push(parseFloat(item.consumptionValueP5.replace(',', '.')))
                  item.consumptionValueP6 && realValuesP6.push(parseFloat(item.consumptionValueP6.replace(',', '.')))
                }
              }
            }
          }
        })
      if (realValues.length > 0) {
        max = Math.max.apply(null, realValues).toFixed(2).replace('.', ',')
        min = Math.min.apply(null, realValues).toFixed(2).replace('.', ',')
        //sum = realValues.reduce((previous, current) => current += previous)
        // Si hay múltiples peticiones en currentSupplyConsumptions, sumamos todos sus valores de totalConsumption
        if (Array.isArray(currentSupplyConsumptions)) {
          sum = currentSupplyConsumptions.reduce((acc, consumption) => {
            const total = parseFloat(consumption.totalConsumption?.replace(',', '.') || '0'); // Convertimos a número
            return acc + total;
          }, 0);
        } else if (currentSupplyConsumptions && currentSupplyConsumptions.totalConsumption) {
          // Caso en que solo haya una petición
          sum = parseFloat(currentSupplyConsumptions.totalConsumption.replace(',', '.')) || 0;
        }
        console.log('aqui2', sum)
        avg = (sum / realValues.length)
        avg = avg.toFixed(2).replace('.', ',')
        sum = sum.toFixed(2).replace('.', ',')
      }
    }

    if (currentSupplyConsumptions && currentSupplyConsumptions[1] && currentSupplyConsumptions[1].consumptions && currentSupplyConsumptions[1].consumptions.items) {
      currentSupplyConsumptions.consumptions.items.map(
        (item) => {
          labelAux = item.consumptionDate.split('/')
          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                realValues.push(parseFloat(item.reactive2.replace(',', '.')))
              }
              else if (consumptionsFilters.showR3 === 'S') {
                realValues.push(parseFloat(item.reactive3.replace(',', '.')))
              }
              else {
                realValues.push(parseFloat(item.activeOutput.replace(',', '.')))
              }
            }
            else {
              if (consumptionsFilters.showR1 === 'S') {
                realValues.push(parseFloat(item.reactive1.replace(',', '.')))
              }
              else if (consumptionsFilters.showR4 === 'S') {
                realValues.push(parseFloat(item.reactive4.replace(',', '.')))
              }
              else {
                realValues.push(parseFloat(item.activeInput.replace(',', '.')))

                //en caso de estar adaptado recuperamos valores de los distintos periodos posibles
                if (isAdapted === 'SI') {
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                    item.activeInput && realValuesP0.push(parseFloat(item.activeInput.replace(',', '.')))
                  } else if (tipoUsuario === 'simple') {
                    item.consumptionValueP1 && realValuesP1.push(parseFloat(item.consumptionValueP1.replace(',', '.')))
                    item.consumptionValueP2 && realValuesP2.push(parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP3 && realValuesP3.push(parseFloat(item.consumptionValueP3.replace(',', '.')))
                  } else {
                    item.consumptionValueP1 && realValuesP1.push(parseFloat(item.consumptionValueP1.replace(',', '.')))
                    item.consumptionValueP2 && realValuesP2.push(parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP3 && realValuesP3.push(parseFloat(item.consumptionValueP3.replace(',', '.')))
                    item.consumptionValueP4 && realValuesP4.push(parseFloat(item.consumptionValueP4.replace(',', '.')))
                    item.consumptionValueP5 && realValuesP5.push(parseFloat(item.consumptionValueP5.replace(',', '.')))
                    item.consumptionValueP6 && realValuesP6.push(parseFloat(item.consumptionValueP6.replace(',', '.')))
                  }
                }
              }
            }
          }
          else {
            if (consumptionsFilters.showR1 === 'S') {
              realValues.push(parseFloat(item.reactive1.replace(',', '.')))
            }
            else if (consumptionsFilters.showR4 === 'S') {
              realValues.push(parseFloat(item.reactive4.replace(',', '.')))
            }
            else {
              realValues.push(parseFloat(item.consumptionValue.replace(',', '.')))

              //en caso de estar adaptado recuperamos valores de los distintos periodos posibles
              if (isAdapted === 'SI') {
                if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                  item.consumptionValue && realValuesP0.push(parseFloat(item.consumptionValue.replace(',', '.')))
                } else if (tipoUsuario === 'simple') {
                  item.consumptionValueP1 && realValuesP1.push(parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && realValuesP2.push(parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && realValuesP3.push(parseFloat(item.consumptionValueP3.replace(',', '.')))
                } else {
                  item.consumptionValueP1 && realValuesP1.push(parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && realValuesP2.push(parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && realValuesP3.push(parseFloat(item.consumptionValueP3.replace(',', '.')))
                  item.consumptionValueP4 && realValuesP4.push(parseFloat(item.consumptionValueP4.replace(',', '.')))
                  item.consumptionValueP5 && realValuesP5.push(parseFloat(item.consumptionValueP5.replace(',', '.')))
                  item.consumptionValueP6 && realValuesP6.push(parseFloat(item.consumptionValueP6.replace(',', '.')))
                }
              }
            }
          }
        })
      sum = 0
      max = Math.max.apply(null, realValues).toFixed(2).replace('.', ',')
      min = Math.min.apply(null, realValues).toFixed(2).replace('.', ',')
      //sum = realValues.reduce((previous, current) => current += previous)
      // Si hay múltiples peticiones en currentSupplyConsumptions, sumamos todos sus valores de totalConsumption
      if (Array.isArray(currentSupplyConsumptions)) {
        sum = currentSupplyConsumptions.reduce((acc, consumption) => {
          const total = parseFloat(consumption.totalConsumption?.replace(',', '.') || '0'); // Convertimos a número
          return acc + total;
        }, 0);
      } else if (currentSupplyConsumptions && currentSupplyConsumptions.totalConsumption) {
        // Caso en que solo haya una petición
        sum = parseFloat(currentSupplyConsumptions.totalConsumption.replace(',', '.')) || 0;
      }
      console.log('aqui1', sum)
      avg = (sum / realValues.length)
      avg = avg.toFixed(2).replace('.', ',')
      sum = sum.toFixed(2).replace('.', ',')
    }

    if (currentCompareConsumptions[0] && currentCompareConsumptions[0].consumptions && currentCompareConsumptions[0].consumptions.items) {
      currentCompareConsumptions[0].consumptions.items.map(
        (item) => {
          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                realValuesCompare.push(parseFloat(item.reactive2.replace(',', '.')))
              }
              else if (consumptionsFilters.showR3 === 'S') {
                realValuesCompare.push(parseFloat(item.reactive3.replace(',', '.')))
              }
              else {
                realValuesCompare.push(parseFloat(item.activeOutput.replace(',', '.')))
              }
            }
            else {
              if (consumptionsFilters.showR1 === 'S') {
                realValuesCompare.push(parseFloat(item.reactive1.replace(',', '.')))
              }
              else if (consumptionsFilters.showR4 === 'S') {
                realValuesCompare.push(parseFloat(item.reactive4.replace(',', '.')))
              }
              else {
                realValuesCompare.push(parseFloat(item.activeInput.replace(',', '.')))
              }
            }
          }
          else {
            if (consumptionsFilters.showR1 === 'S') {
              realValuesCompare.push(parseFloat(item.reactive1.replace(',', '.')))
            }
            else if (consumptionsFilters.showR4 === 'S') {
              realValuesCompare.push(parseFloat(item.reactive4.replace(',', '.')))
            }
            else {
              realValuesCompare.push(parseFloat(item.consumptionValue.replace(',', '.')))
            }
          }
        })
      maxCompare = Math.max.apply(null, realValuesCompare).toFixed(2).replace('.', ',')
      minCompare = Math.min.apply(null, realValuesCompare).toFixed(2).replace('.', ',')
      sumCompare = realValuesCompare.reduce((previous, current) => current += previous)
      console.log('sumCompare', sumCompare)
      avgCompare = (sumCompare / realValuesCompare.length)
      avgCompare = avgCompare.toFixed(2).replace('.', ',')
      sumCompare = sumCompare.toFixed(2).replace('.', ',')
    }

    if (currentCompareConsumptions[1] && currentCompareConsumptions[1].consumptions && currentCompareConsumptions[1].consumptions.items) {
      currentCompareConsumptions[1].consumptions.items.map(
        (item) => {
          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                realValuesCompare.push(parseFloat(item.reactive2.replace(',', '.')))
              }
              else if (consumptionsFilters.showR3 === 'S') {
                realValuesCompare.push(parseFloat(item.reactive3.replace(',', '.')))
              }
              else {
                realValuesCompare.push(parseFloat(item.activeOutput.replace(',', '.')))
              }
            }
            else {
              if (consumptionsFilters.showR1 === 'S') {
                realValuesCompare.push(parseFloat(item.reactive1.replace(',', '.')))
              }
              else if (consumptionsFilters.showR4 === 'S') {
                realValuesCompare.push(parseFloat(item.reactive4.replace(',', '.')))
              }
              else {
                realValuesCompare.push(parseFloat(item.activeInput.replace(',', '.')))
              }
            }
          }
          else {
            if (consumptionsFilters.showR1 === 'S') {
              realValuesCompare.push(parseFloat(item.reactive1.replace(',', '.')))
            }
            else if (consumptionsFilters.showR4 === 'S') {
              realValuesCompare.push(parseFloat(item.reactive4.replace(',', '.')))
            }
            else {
              realValuesCompare.push(parseFloat(item.consumptionValue.replace(',', '.')))
            }
          }
        })
      sumCompare = 0
      maxCompare = Math.max.apply(null, realValuesCompare).toFixed(2).replace('.', ',')
      minCompare = Math.min.apply(null, realValuesCompare).toFixed(2).replace('.', ',')
      sumCompare = realValuesCompare.reduce((previous, current) => current += previous)
      console.log('sumCompare', sumCompare)
      avgCompare = (sumCompare / realValuesCompare.length)
      avgCompare = avgCompare.toFixed(2).replace('.', ',')
      sumCompare = sumCompare.toFixed(2).replace('.', ',')
    }
  }

  if ((supplyData.measurementSystem === 'O' || supplyData.measurementSystem === 'G') && currentSupplyConsumptions?.consumptions?.items) {
    realValues = []; // Initialize the array
    currentSupplyConsumptions.consumptions.items.forEach((item) => {
      if (item.consumptionValue) {
        realValues.push(parseFloat(item.consumptionValue.replace(',', '.')));
      }
    });

    if (realValues.length > 0) {
      max = Math.max(...realValues).toFixed(2).replace('.', ',');
      min = Math.min(...realValues).toFixed(2).replace('.', ',');
      sum = realValues.reduce((acc, val) => acc + val, 0).toFixed(2).replace('.', ','); // Total sum
      avg = (realValues.reduce((acc, val) => acc + val, 0) / realValues.length).toFixed(2).replace('.', ','); // Average
    }
  }

  if (isAdapted === 'SI' && !energiaReactiva) {
    sumP0 = realValuesP0.length > 0 && realValuesP0.reduce((previous, current) => current += previous)
    sumP1 = realValuesP1.length > 0 && realValuesP1.reduce((previous, current) => current += previous)
    sumP2 = realValuesP2.length > 0 && realValuesP2.reduce((previous, current) => current += previous)
    sumP3 = realValuesP3.length > 0 && realValuesP3.reduce((previous, current) => current += previous)
    sumP0 = realValuesP0.length > 0 && sumP0.toFixed(2).replace('.', ',')
    sumP1 = realValuesP1.length > 0 && sumP1.toFixed(2).replace('.', ',')
    sumP2 = realValuesP2.length > 0 && sumP2.toFixed(2).replace('.', ',')
    sumP3 = realValuesP3.length > 0 && sumP3.toFixed(2).replace('.', ',')
    if (tipoUsuario === 'complejo') {
      sumP4 = realValuesP4.length > 0 && realValuesP4.reduce((previous, current) => current += previous)
      sumP5 = realValuesP5.length > 0 && realValuesP5.reduce((previous, current) => current += previous)
      sumP6 = realValuesP6.length > 0 && realValuesP6.reduce((previous, current) => current += previous)
      sumP4 = realValuesP4.length > 0 && sumP4.toFixed(2).replace('.', ',')
      sumP5 = realValuesP5.length > 0 && sumP5.toFixed(2).replace('.', ',')
      sumP6 = realValuesP6.length > 0 && sumP6.toFixed(2).replace('.', ',')
    }
  }

  return (
    <>
      {
        isAdapted !== 'SI' || energiaReactiva || (isGeneration && isGenerationTab) ?
          ((!isGeneration || (isGeneration && isGenerationTab)) && consumptionsFilters.compare === 'C') ?

            <Grid container className={classes.container}>
              <Grid container className={classes.section}>
                <Grid item xs={12} sm={12} md='auto'>
                  <Grid container className={classes.item}>
                    <Grid item xs={1} md='auto'>
                      {
                        <img src={Consumption1} alt='' />
                      }
                    </Grid>
                    <Grid item xs={9} sm={9} md='auto' className={classes.label}>
                      <Grid container>
                        <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                          <span>
                            {
                              (isGenerationTab || consumptionsFilters.showR4 === 'S' || consumptionsFilters.showR3 === 'S') && consumptionsFilters.showR2 === 'N' ?
                                t('supplies.suppliesDetails.components.consumption.charts.legend.medGeneration2')
                                :
                                t('supplies.suppliesDetails.components.consumption.charts.legend.medConsumption2')
                            } {(consumptionsFilters.granularity === 'H' || consumptionsFilters.granularity === 'H') ? consumptionsFilters.startDate + ':' : consumptionsFilters.startDate + '-' + consumptionsFilters.endDate + ':'}
                          </span>
                        </Grid>

                        <Grid item xs={12} sm='auto'>
                          {
                            !energiaReactiva && consumptionsFilters.granularity !== 'S' && supplyData.measurementSystem === 'O' ?
                              currentSupplyConsumptions && currentSupplyConsumptions.avgConsumption && (parseFloat(currentSupplyConsumptions.avgConsumption.replace(',', '.')).toFixed(2).replace('.', ','))
                              :
                              avg
                          }
                          {
                            !energiaReactiva ?
                              t(' kWh')
                              :
                              t(' kVArh')
                          }
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md='auto'>
                  <Grid container className={classes.item}>
                    <Grid item xs={1} md='auto'>
                      {
                        <img src={Consumption2} alt='' />
                      }
                    </Grid>
                    <Grid item xs={9} sm={9} md='auto' className={classes.label}>
                      <Grid container>
                        <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                          <span>
                            {
                              (isGenerationTab || consumptionsFilters.showR4 === 'S' || consumptionsFilters.showR3 === 'S') && consumptionsFilters.showR2 === 'N' ?
                                t('supplies.suppliesDetails.components.consumption.charts.legend.medGeneration2')
                                :
                                t('supplies.suppliesDetails.components.consumption.charts.legend.medConsumption2')
                            } {(consumptionsFilters.granularity === 'H' || consumptionsFilters.granularity === 'Q') ? consumptionsFilters.startDateCompare + ':' : consumptionsFilters.startDateCompare + '-' + consumptionsFilters.endDateCompare + ':'}
                          </span>
                        </Grid>

                        <Grid item xs={12} sm='auto'>
                          {
                            !energiaReactiva && consumptionsFilters.granularity !== 'S' && supplyData.measurementSystem === 'O' ?
                              currentCompareConsumptions[0] && currentCompareConsumptions[0].avgConsumption && (parseFloat(currentCompareConsumptions[0].avgConsumption.replace(',', '.')).toFixed(2).replace('.', ','))
                              :
                              avgCompare
                          }
                          {
                            !energiaReactiva ?
                              t(' kWh')
                              :
                              t(' kVArh')
                          }
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md='auto' className={classes.label2}>
                {t('supplies.suppliesDetails.components.consumption.charts.legend.noData2')}
              </Grid>
            </Grid>

            :

            (!isGeneration || (isGeneration && isGenerationTab)) && (currentSupplyConsumptions.length > 0 || currentSupplyConsumptions.consumptions) &&
            <Grid container className={classes.container}>
              <Grid container className={classes.section}>
                {
                  <Grid item xs={12} sm={12} md={4}>
                    <Grid container className={classes.item}>
                      <Grid item xs={1} md='auto'>
                        <img src={TotalConsumptionIcon} alt='' />
                      </Grid>
                      <Grid item xs={9} sm={9} className={classes.label}>
                        <Grid container>
                          <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                            <span>
                              {
                                (isGenerationTab || consumptionsFilters.showR4 === 'S' || consumptionsFilters.showR3 === 'S') && consumptionsFilters.showR2 === 'N' ?
                                  t('supplies.suppliesDetails.components.consumption.charts.legend.totalGeneration')
                                  :
                                  t('supplies.suppliesDetails.components.consumption.charts.legend.totalConsumption')
                              }
                            </span>
                          </Grid>

                          <Grid item xs={12} sm='auto'>
                            {
                              !energiaReactiva && consumptionsFilters.granularity !== 'S' && supplyData.measurementSystem === 'O' ?
                                currentSupplyConsumptions && currentSupplyConsumptions.totalConsumption && (parseFloat(currentSupplyConsumptions.totalConsumption.replace(',', '.')).toFixed(2).replace('.', ','))
                                :
                                supplyData.measurementSystem === 'G' ?
                                  sum // totoal para  GMV10
                                  :
                                  sum
                            } {!energiaReactiva ? 'kWh' : 'kVArh'}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                }
                <Grid item xs={12} sm={12} md={5}>
                  <Grid container className={classes.item}>
                    <Grid item xs={1} md='auto'>
                      <img src={PeriodIcon} alt='' />
                    </Grid>

                    <Grid item xs={9} sm={9} className={classes.label}>
                      <Grid container>
                        <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                          <span>
                            {
                              t('supplies.suppliesDetails.components.consumption.charts.legend.period')
                            }
                          </span>
                        </Grid>

                        <Grid item xs={12} sm='auto'>
                          {
                            (consumptionsFilters.granularity === 'H' || consumptionsFilters.granularity === 'Q') ? consumptionsFilters.startDate : `${t('supplies.suppliesDetails.components.consumption.charts.legend.since')} ${consumptionsFilters.startDate} ${t('supplies.suppliesDetails.components.consumption.charts.legend.until')} ${consumptionsFilters.endDate}`
                          }
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid container className={`${classes.section} border`}>
                <Grid item xs={12} sm={12} md='auto'>
                  <Grid container className={classes.item}>
                    <Grid item xs={1} md='auto'>
                      <img src={MaxConsumptionIcon} alt='' />
                    </Grid>

                    <Grid item xs={9} sm={9} md='auto' className={classes.label}>
                      <Grid container>
                        <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                          <span>
                            {
                              (isGenerationTab || consumptionsFilters.showR4 === 'S' || consumptionsFilters.showR3 === 'S') && consumptionsFilters.showR2 === 'N' ?
                                t('supplies.suppliesDetails.components.consumption.charts.legend.maxGeneration')
                                :
                                t('supplies.suppliesDetails.components.consumption.charts.legend.maxConsumption')
                            }
                          </span>
                        </Grid>

                        <Grid item xs={12} sm='auto'>
                          {
                            !energiaReactiva && consumptionsFilters.granularity !== 'S' && supplyData.measurementSystem === 'O' ?
                              currentSupplyConsumptions && currentSupplyConsumptions.maxConsumption && (parseFloat(currentSupplyConsumptions.maxConsumption.replace(',', '.')).toFixed(2).replace('.', ','))
                              :
                              max
                          } {!energiaReactiva ? 'kWh ' : 'kVArh'}
                          {
                            !energiaReactiva && supplyData.measurementSystem === 'O' &&
                            currentSupplyConsumptions && currentSupplyConsumptions.maxConsumptionDate && formatMonthAndYear(currentSupplyConsumptions.maxConsumptionDate)
                          }
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md='auto'>
                  <Grid container className={classes.item}>
                    <Grid item xs={1} md='auto'>
                      <img src={MidConsumptionIcon} alt='' />
                    </Grid>
                    <Grid item xs={9} sm={9} md='auto' className={classes.label}>
                      <Grid container>
                        <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                          <span>
                            {
                              (isGenerationTab || consumptionsFilters.showR4 === 'S' || consumptionsFilters.showR3 === 'S') && consumptionsFilters.showR2 === 'N' ?
                                t('supplies.suppliesDetails.components.consumption.charts.legend.medGeneration')
                                :
                                t('supplies.suppliesDetails.components.consumption.charts.legend.medConsumption')
                            }
                          </span>
                        </Grid>

                        <Grid item xs={12} sm='auto'>
                          {
                            !energiaReactiva && consumptionsFilters.granularity !== 'S' && supplyData.measurementSystem === 'O' ?
                              currentSupplyConsumptions && currentSupplyConsumptions.avgConsumption && (parseFloat(currentSupplyConsumptions.avgConsumption.replace(',', '.')).toFixed(2).replace('.', ','))
                              :
                              avg
                          } {!energiaReactiva ? 'kWh' : 'kVArh'}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md='auto'>
                  <Grid container className={classes.item}>
                    <Grid item xs={1} md='auto'>
                      <img src={MinConsumptionIcon} alt='' />
                    </Grid>

                    <Grid item xs={9} sm={9} md='auto' className={classes.label}>
                      <Grid container>
                        <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                          <span>
                            {
                              (isGenerationTab || consumptionsFilters.showR4 === 'S' || consumptionsFilters.showR3 === 'S') && consumptionsFilters.showR2 === 'N' ?
                                t('supplies.suppliesDetails.components.consumption.charts.legend.minGeneration')
                                :
                                t('supplies.suppliesDetails.components.consumption.charts.legend.minConsumption')
                            }
                          </span>
                        </Grid>

                        <Grid item xs={12} sm='auto'>
                          {
                            !energiaReactiva && consumptionsFilters.granularity !== 'S' && supplyData.measurementSystem === 'O' ?
                              currentSupplyConsumptions && currentSupplyConsumptions.minConsumption && (parseFloat(currentSupplyConsumptions.minConsumption.replace(',', '.')).toFixed(2).replace('.', ','))
                              :
                              min
                          } {!energiaReactiva ? 'kWh ' : 'kVArh'}
                          {
                            !energiaReactiva && supplyData.measurementSystem === 'O' &&
                            currentSupplyConsumptions && currentSupplyConsumptions.minConsumptionDate && formatMonthAndYear(currentSupplyConsumptions.minConsumptionDate)
                          }
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          :
          ((!isGeneration || (isGeneration && isGenerationTab)) && consumptionsFilters.compare === 'C') ?

            <Grid container className={classes.container}>
              <Grid container className={classes.section}>
                <Grid item xs={12} sm={12} md='auto'>
                  <Grid container className={classes.item}>
                    <div id='rectangle' style={{ width: 20, height: 20, backgroundColor: '#004571' }} />
                    <Grid item xs={9} sm={9} md='auto' className={classes.label}>
                      <Grid container>
                        <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                          <span>
                            {
                              (isGenerationTab || consumptionsFilters.showR4 === 'S' || consumptionsFilters.showR3 === 'S') && consumptionsFilters.showR2 === 'N' ?
                                t('supplies.suppliesDetails.components.consumption.charts.legend.medGeneration2')
                                :
                                t('supplies.suppliesDetails.components.consumption.charts.legend.medConsumption2')
                            } {(consumptionsFilters.granularity === 'H' || consumptionsFilters.granularity === 'H') ? consumptionsFilters.startDate + ':' : consumptionsFilters.startDate + '-' + consumptionsFilters.endDate + ':'}
                          </span>
                        </Grid>

                        <Grid item xs={12} sm='auto'>
                          {
                            avg
                          }
                          {
                            !energiaReactiva ?
                              t(' kWh')
                              :
                              t(' kVArh')
                          }
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md='auto'>
                  <Grid container className={classes.item}>
                    <div id='rectangle' style={{ width: 20, height: 20, backgroundColor: 'rgba(102, 195, 202, 1)' }} />
                    <Grid item xs={9} sm={9} md='auto' className={classes.label}>
                      <Grid container>
                        <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                          <span>
                            {
                              (isGenerationTab || consumptionsFilters.showR4 === 'S' || consumptionsFilters.showR3 === 'S') && consumptionsFilters.showR2 === 'N' ?
                                t('supplies.suppliesDetails.components.consumption.charts.legend.medGeneration2')
                                :
                                t('supplies.suppliesDetails.components.consumption.charts.legend.medConsumption2')
                            } {(consumptionsFilters.granularity === 'H' || consumptionsFilters.granularity === 'Q') ? consumptionsFilters.startDateCompare + ':' : consumptionsFilters.startDateCompare + '-' + consumptionsFilters.endDateCompare + ':'}
                          </span>
                        </Grid>

                        <Grid item xs={12} sm='auto'>
                          {
                            avgCompare
                          }
                          {
                            !energiaReactiva ?
                              t(' kWh')
                              :
                              t(' kVArh')
                          }
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md='auto' className={classes.label2}>
                {t('supplies.suppliesDetails.components.consumption.charts.legend.noData2')}
              </Grid>
            </Grid>

            :

            (!isGeneration || (isGeneration && isGenerationTab)) && /*currentSupplyConsumptions.length > 0 &&*/
            <Grid container className={classes.container}>
              <Grid container className={classes.section}>
                {
                  <Grid item xs={12} sm={12} md={4}>
                    <Grid container className={classes.item}>
                      <Grid item xs={1} md='auto'>
                        <img src={TotalConsumptionIcon} alt='' />
                      </Grid>
                      <Grid item xs={9} sm={9} className={classes.label}>
                        <Grid container>
                          <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                            <span>
                              {
                                (isGenerationTab || consumptionsFilters.showR4 === 'S' || consumptionsFilters.showR3 === 'S') && consumptionsFilters.showR2 === 'N' ?
                                  t('supplies.suppliesDetails.components.consumption.charts.legend.totalGeneration')
                                  :
                                  t('supplies.suppliesDetails.components.consumption.charts.legend.totalConsumption')
                              }
                            </span>
                          </Grid>

                          <Grid item xs={12} sm='auto'>
                            {
                              !energiaReactiva && consumptionsFilters.granularity !== 'S' && supplyData.measurementSystem === 'O' ?
                                currentSupplyConsumptions && currentSupplyConsumptions.totalConsumption && (parseFloat(currentSupplyConsumptions.totalConsumption.replace(',', '.')).toFixed(2).replace('.', ','))
                                :
                                supplyData.measurementSystem === 'G' ?
                                  sum // Total para GMV10
                                  :
                                  sum
                            } {!energiaReactiva ? 'kWh' : 'kVArh'}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                }
                <Grid item xs={12} sm={12} md={5}>
                  <Grid container className={classes.item}>
                    <Grid item xs={1} md='auto'>
                      <img src={PeriodIcon} alt='' />
                    </Grid>

                    <Grid item xs={9} sm={9} className={classes.label}>
                      <Grid container>
                        <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                          <span>
                            {
                              t('supplies.suppliesDetails.components.consumption.charts.legend.period')
                            }
                          </span>
                        </Grid>

                        <Grid item xs={12} sm='auto'>
                          {
                            `${t('supplies.suppliesDetails.components.consumption.charts.legend.since')} ${consumptionsFilters.startDate} ${t('supplies.suppliesDetails.components.consumption.charts.legend.until')} ${consumptionsFilters.endDate}`
                          }
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container className={classes.space}>
                <Grid item xs={12} sm={12} md={4}>
                  <Grid container className={classes.item}>
                    <Grid item xs={9} sm={9} md='auto' className={classes.label4}>
                      <Grid container>
                        <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                          <span>
                            {
                              (isGenerationTab || consumptionsFilters.showR4 === 'S' || consumptionsFilters.showR3 === 'S') && consumptionsFilters.showR2 === 'N' ?
                                t('supplies.suppliesDetails.components.consumption.charts.legend.maxGeneration')
                                :
                                t('supplies.suppliesDetails.components.consumption.charts.legend.maxConsumption')
                            }
                          </span>
                        </Grid>

                        <Grid item xs={12} sm='auto'>
                          {
                            !energiaReactiva && consumptionsFilters.granularity !== 'S' && supplyData.measurementSystem === 'O' ?
                              currentSupplyConsumptions && currentSupplyConsumptions.maxConsumption && (parseFloat(currentSupplyConsumptions.maxConsumption.replace(',', '.')).toFixed(2).replace('.', ','))
                              :
                              max
                          } {!energiaReactiva ? 'kWh ' : 'kVArh'}
                          {
                            !energiaReactiva && supplyData.measurementSystem === 'O' && consumptionsFilters.granularity === 'M' &&
                            currentSupplyConsumptions && currentSupplyConsumptions.maxConsumptionDate && formatMonthAndYear(currentSupplyConsumptions.maxConsumptionDate)
                          }
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={4}>
                  <Grid container className={classes.item}>
                    <Grid item xs={9} sm={9} md='auto' className={classes.label4}>
                      <Grid container>
                        <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                          <span>
                            {
                              (isGenerationTab || consumptionsFilters.showR4 === 'S' || consumptionsFilters.showR3 === 'S') && consumptionsFilters.showR2 === 'N' ?
                                t('supplies.suppliesDetails.components.consumption.charts.legend.medGeneration')
                                :
                                t('supplies.suppliesDetails.components.consumption.charts.legend.medConsumption')
                            }
                          </span>
                        </Grid>

                        <Grid item xs={12} sm='auto'>
                          {
                            !energiaReactiva && consumptionsFilters.granularity !== 'S' && supplyData.measurementSystem === 'O' ?
                              currentSupplyConsumptions && currentSupplyConsumptions.avgConsumption && (parseFloat(currentSupplyConsumptions.avgConsumption.replace(',', '.')).toFixed(2).replace('.', ','))
                              :
                              avg
                          } {!energiaReactiva ? 'kWh' : 'kVArh'}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={4}>
                  <Grid container className={classes.item}>
                    <Grid item xs={9} sm={9} md='auto' className={classes.label4}>
                      <Grid container>
                        <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                          <span>
                            {
                              (isGenerationTab || consumptionsFilters.showR4 === 'S' || consumptionsFilters.showR3 === 'S') && consumptionsFilters.showR2 === 'N' ?
                                t('supplies.suppliesDetails.components.consumption.charts.legend.minGeneration')
                                :
                                t('supplies.suppliesDetails.components.consumption.charts.legend.minConsumption')
                            }
                          </span>
                        </Grid>

                        <Grid item xs={12} sm='auto'>
                          {
                            !energiaReactiva && consumptionsFilters.granularity !== 'S' && supplyData.measurementSystem === 'O' ?
                              currentSupplyConsumptions && currentSupplyConsumptions.minConsumption && (parseFloat(currentSupplyConsumptions.minConsumption.replace(',', '.')).toFixed(2).replace('.', ','))
                              :
                              min
                          } {!energiaReactiva ? 'kWh ' : 'kVArh'}
                          {
                            !energiaReactiva && supplyData.measurementSystem === 'O' && consumptionsFilters.granularity === 'M' &&
                            currentSupplyConsumptions && currentSupplyConsumptions.minConsumptionDate && formatMonthAndYear(currentSupplyConsumptions.minConsumptionDate)
                          }
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container className={`${classes.section} border`}>
                {
                  isNaN(sumP0) &&
                  <Grid container className={classes.item}>
                    <div id='rectangle' style={{ width: 15, height: 15, backgroundColor: '#004571' }} />
                    <Grid item xs={9} sm={9} className={classes.label}>
                      <Grid container>
                        <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                          <span>
                            {
                              (isGenerationTab || consumptionsFilters.showR4 === 'S' || consumptionsFilters.showR3 === 'S') && consumptionsFilters.showR2 === 'N' ?
                                t('supplies.suppliesDetails.components.consumption.charts.legend.totalGeneration')
                                :
                                t('supplies.suppliesDetails.components.consumption.charts.legend.preConsumption')
                            }
                          </span>
                        </Grid>

                        <Grid item xs={12} sm='auto'>
                          {
                            sumP0
                          } {!energiaReactiva ? 'kWh' : 'kVArh'}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                }

                <Grid item xs={12} sm={12} md={4}>
                  <Grid container className={classes.item}>
                    <div id='rectangle' style={{ width: 15, height: 15, backgroundColor: '#d3222a' }} />
                    <Grid item xs={9} sm={9} md='auto' className={classes.label}>
                      <Grid container>
                        <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                          <span>
                            {
                              tipoUsuario === 'complejo' ?
                                t('supplies.suppliesDetails.components.consumption.charts.legend.consumptionP1')
                                :
                                t('supplies.suppliesDetails.components.consumption.charts.legend.consumptionPP')
                            }
                          </span>
                        </Grid>

                        <Grid item xs={12} sm='auto'>
                          {
                            isNaN(sumP1) ? sumP1 : 'N/A'
                          } {!energiaReactiva ? 'kWh' : 'kVArh'}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={4}>
                  <Grid container className={classes.item}>
                    <div id='rectangle' style={{ width: 15, height: 15, backgroundColor: tipoUsuario === 'simple' ? '#edab46' : '#e57200' }} />
                    <Grid item xs={9} sm={9} md='auto' className={classes.label}>
                      <Grid container>
                        <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                          <span>
                            {
                              tipoUsuario === 'complejo' ?
                                t('supplies.suppliesDetails.components.consumption.charts.legend.consumptionP2')
                                :
                                t('supplies.suppliesDetails.components.consumption.charts.legend.consumptionPL')
                            }
                          </span>
                        </Grid>

                        <Grid item xs={12} sm='auto'>
                          {
                            isNaN(sumP2) ? sumP2 : 'N/A'
                          } {!energiaReactiva ? 'kWh' : 'kVArh'}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={4}>
                  <Grid container className={classes.item}>
                    <div id='rectangle' style={{ width: 15, height: 15, backgroundColor: tipoUsuario === 'simple' ? '#009aa6' : '#edab46' }} />

                    <Grid item xs={9} sm={9} md='auto' className={classes.label}>
                      <Grid container>
                        <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                          <span>
                            {
                              tipoUsuario === 'complejo' ?
                                t('supplies.suppliesDetails.components.consumption.charts.legend.consumptionP3')
                                :
                                t('supplies.suppliesDetails.components.consumption.charts.legend.consumptionPV')
                            }
                          </span>
                        </Grid>

                        <Grid item xs={12} sm='auto'>
                          {
                            isNaN(sumP3) ? sumP3 : 'N/A'
                          } {!energiaReactiva ? 'kWh' : 'kVArh'}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                {tipoUsuario === 'complejo' &&
                  <>
                    <Grid item xs={12} sm={12} md={4}>
                      <Grid container className={classes.item}>
                        <div id='rectangle' style={{ width: 15, height: 15, backgroundColor: '#bfbf60' }} />

                        <Grid item xs={9} sm={9} md='auto' className={classes.label}>
                          <Grid container>
                            <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                              <span>
                                {
                                  t('supplies.suppliesDetails.components.consumption.charts.legend.consumptionP4')
                                }
                              </span>
                            </Grid>

                            <Grid item xs={12} sm='auto'>
                              {
                                isNaN(sumP4) ? sumP4 : 'N/A'
                              } {'kWh'}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} md={4}>
                      <Grid container className={classes.item}>
                        <div id='rectangle' style={{ width: 15, height: 15, backgroundColor: '#5fad83' }} />

                        <Grid item xs={9} sm={9} md='auto' className={classes.label}>
                          <Grid container>
                            <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                              <span>
                                {
                                  t('supplies.suppliesDetails.components.consumption.charts.legend.consumptionP5')
                                }
                              </span>
                            </Grid>

                            <Grid item xs={12} sm='auto'>
                              {
                                isNaN(sumP5) ? sumP5 : 'N/A'
                              } {'kWh'}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} md={4}>
                      <Grid container className={classes.item}>
                        <div id='rectangle' style={{ width: 15, height: 15, backgroundColor: '#009aa6' }} />

                        <Grid item xs={9} sm={9} md='auto' className={classes.label}>
                          <Grid container>
                            <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                              <span>
                                {
                                  t('supplies.suppliesDetails.components.consumption.charts.legend.consumptionP6')
                                }
                              </span>
                            </Grid>

                            <Grid item xs={12} sm='auto'>
                              {
                                isNaN(sumP6) ? sumP6 : 'N/A'
                              } {'kWh'}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                }
              </Grid>
            </Grid>
      }

    </>
  )
}

export default Legend
