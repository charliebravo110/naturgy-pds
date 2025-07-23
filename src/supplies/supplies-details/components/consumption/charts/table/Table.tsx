import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import MUiTable from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

import {
  formatMonthAndYear,
  formatHour,
  formatDayAndMonthAndYear
} from '../../../../../../common/lib/FormatLib'

import Legend from '../legend/Legend'

import NoConsumptionIcon from '../../../../../../assets/icons/aviso_alerta_pop_up.svg'
import MaxConsumptionIcon from '../../../../../../assets/icons/consumo_maximo.svg'
import MinConsumptionIcon from '../../../../../../assets/icons/consumo_minimo.svg'

import useStyles from './Table.styles'

const Table = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()
  let literalKw

  const {
    currentSupplyConsumptions,
    currentCompareConsumptions,
    consumptionsFilters,
    isGeneration,
    isGenerationTab,
    isAdapted,
    adaptedDate,
    energiaReactiva,
    tipoUsuario,
    supplyData
  } = props

  if (energiaReactiva) {
    literalKw = 'kVArh'
  } else {
    literalKw = 'kWh'
  }

  let splitAdaptedDate: any[] = adaptedDate && adaptedDate.split('/')

  let valuesPV = [] as any
  let valuesPL = [] as any
  let valuesPP = [] as any
  let valuesP0 = [] as any
  let valuesP1 = [] as any
  let valuesP2 = [] as any
  let valuesP3 = [] as any
  let valuesP4 = [] as any
  let valuesP5 = [] as any
  let valuesP6 = [] as any
  let labelsQ = [] as any

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

  let dateAux = consumptionsFilters.startDate.split('/')
  let enddateAux = consumptionsFilters.endDate.split('/')
  let numItems
  let i

  let adapted_P0 = false as boolean
  
  if (!(parseInt(dateAux[2]) || parseInt(splitAdaptedDate[2]))) {
    if (parseInt(dateAux[2]) < parseInt(splitAdaptedDate[2])) {
      adapted_P0 = true
    } else if (parseInt(dateAux[1]) < parseInt(splitAdaptedDate[1])) {
      adapted_P0 = true
    } else if (parseInt(dateAux[0]) < parseInt(splitAdaptedDate[0])) {
      adapted_P0 = true
    }  
  }
  

  if (consumptionsFilters.granularity === 'M') {
    //mismo año, restamos los meses y montamos el array
    if (dateAux[2] === enddateAux[2]) {
      numItems = (parseInt(enddateAux[1]) - parseInt(dateAux[1]))
      for (i = 0; i <= numItems; i++) {
        if (isAdapted === 'SI' && !energiaReactiva) {
          valuesPV.push(0.0000001)
          valuesPL.push(0.0000001)
          valuesPP.push(0.0000001)
          valuesP0.push(0.0000001)
          valuesP1.push(0.0000001)
          valuesP2.push(0.0000001)
          valuesP3.push(0.0000001)
          valuesP4.push(0.0000001)
          valuesP5.push(0.0000001)
          valuesP6.push(0.0000001)
        }
      }
    }//distinto año
    else if (dateAux[2] < enddateAux[2]) {
      //año menos uno
      if ((parseInt(dateAux[2]) + 1) === parseInt(enddateAux[2])) {
        numItems = (12 - parseInt(dateAux[1])) + parseInt(enddateAux[1])
        for (i = 0; i <= numItems; i++) {
          if (isAdapted === 'SI' && !energiaReactiva) {
            valuesPV.push(0.0000001)
            valuesPL.push(0.0000001)
            valuesPP.push(0.0000001)
            valuesP0.push(0.0000001)
            valuesP1.push(0.0000001)
            valuesP2.push(0.0000001)
            valuesP3.push(0.0000001)
            valuesP4.push(0.0000001)
            valuesP5.push(0.0000001)
            valuesP6.push(0.0000001)
          }
        }
      }
      //año menos dos
      else if ((parseInt(dateAux[2]) + 2) === parseInt(enddateAux[2])) {
        numItems = (12 - parseInt(dateAux[1]) + 12) + parseInt(enddateAux[1])
        for (i = 0; i <= numItems; i++) {
          if (isAdapted === 'SI' && !energiaReactiva) {
            valuesPV.push(0.0000001)
            valuesPL.push(0.0000001)
            valuesPP.push(0.0000001)
            valuesP0.push(0.0000001)
            valuesP1.push(0.0000001)
            valuesP2.push(0.0000001)
            valuesP3.push(0.0000001)
            valuesP4.push(0.0000001)
            valuesP5.push(0.0000001)
            valuesP6.push(0.0000001)
          }
        }
      }
    }
  } else if (consumptionsFilters.granularity === 'D' && isAdapted === 'SI' && !energiaReactiva) {
    if (currentSupplyConsumptions[0] && currentSupplyConsumptions[0].consumptions && currentSupplyConsumptions[0].consumptions.items) {
      currentSupplyConsumptions[0].consumptions.items.map(
        (item) => {
          valuesPV.push(0.0000001)
          valuesPL.push(0.0000001)
          valuesPP.push(0.0000001)
          valuesP0.push(0.0000001)
          valuesP1.push(0.0000001)
          valuesP2.push(0.0000001)
          valuesP3.push(0.0000001)
          valuesP4.push(0.0000001)
          valuesP5.push(0.0000001)
          valuesP6.push(0.0000001)
        }
      )
    } else {
      numItems = parseInt(enddateAux[0])
      for (i = 0; i <= numItems; i++) {
        valuesPV.push(0.0000001)
        valuesPL.push(0.0000001)
        valuesPP.push(0.0000001)
        valuesP0.push(0.0000001)
        valuesP1.push(0.0000001)
        valuesP2.push(0.0000001)
        valuesP3.push(0.0000001)
        valuesP4.push(0.0000001)
        valuesP5.push(0.0000001)
        valuesP6.push(0.0000001)
      }
    }
  } else if (consumptionsFilters.granularity === 'S' && isAdapted === 'SI' && !energiaReactiva) {
    //numItems = parseInt(enddateAux[0])
    for (i = 0; i < 7; i++) {
      valuesPV.push(0.0000001)
      valuesPL.push(0.0000001)
      valuesPP.push(0.0000001)
      valuesP0.push(0.0000001)
      valuesP1.push(0.0000001)
      valuesP2.push(0.0000001)
      valuesP3.push(0.0000001)
      valuesP4.push(0.0000001)
      valuesP5.push(0.0000001)
      valuesP6.push(0.0000001)
    }
  } else if (consumptionsFilters.granularity === 'H' && isAdapted === 'SI' && !energiaReactiva) {
    for (i = 0; i < 24; i++) {
      valuesPV.push(0.0000001)
      valuesPL.push(0.0000001)
      valuesPP.push(0.0000001)
      valuesP0.push(0.0000001)
      valuesP1.push(0.0000001)
      valuesP2.push(0.0000001)
      valuesP3.push(0.0000001)
      valuesP4.push(0.0000001)
      valuesP5.push(0.0000001)
      valuesP6.push(0.0000001)
    }
  } else if (consumptionsFilters.granularity === 'Q' && isAdapted === 'SI' && !energiaReactiva) {
    for (i = 0; i < 96; i++) {
      valuesPV.push(0.0000001)
      valuesPL.push(0.0000001)
      valuesPP.push(0.0000001)
      valuesP0.push(0.0000001)
      valuesP1.push(0.0000001)
      valuesP2.push(0.0000001)
      valuesP3.push(0.0000001)
      valuesP4.push(0.0000001)
      valuesP5.push(0.0000001)
      valuesP6.push(0.0000001)
    }
    labelsQ = ['00:15', '00:30', '00:45',
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
  }

  const allEqual = arr => arr.every(val => val === 0.0000001)

  const removeElementsWithValue = (arr, val) => {
    let i = arr.length
    let auxArr = [...arr]
    while (i--) {
      if (auxArr[i] === val) {
        auxArr.splice(i, 1)
      }
    }
    return auxArr
  }

  const monthsView = () => {
    let months = [] as any
    let consumptions = [] as any
    let i = 0

    if (currentSupplyConsumptions[0] && currentSupplyConsumptions[0].consumptions && currentSupplyConsumptions[0].consumptions.items) {
      currentSupplyConsumptions[0].consumptions.items.map(
        (item) => {
          months.push(formatMonthAndYear(item.consumptionDate))
          let labelAux = item.consumptionDate.split('/')

          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                item.activeOutput && consumptions.push(parseFloat(item.reactive2.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else if (consumptionsFilters.showR3 === 'S') {
                item.activeOutput && consumptions.push(parseFloat(item.reactive3.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else {
                item.activeOutput && consumptions.push(parseFloat(item.activeOutput.replace(',', '.')).toFixed(2).replace('.', ','))
              }
            } else {
              if (consumptionsFilters.showR1 === 'S') {
                item.activeInput && consumptions.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else if (consumptionsFilters.showR4 === 'S') {
                item.activeInput && consumptions.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else {
                item.activeInput && consumptions.push(parseFloat(item.activeInput.replace(',', '.')).toFixed(2).replace('.', ','))
              }

              if (isAdapted === 'SI') {
                //diferenciamos entre los dos tipos de usuario
                if (tipoUsuario === 'simple') {
                  //comprobamos por fecha de adaptación si hay que coger el valor de activeInput
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                    item.activeInput && valuesP0.splice(i, 1, parseFloat(item.activeInput.replace(',', '.')))
                  } else {
                    item.consumptionValueP1 && valuesPP.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                    item.consumptionValueP2 && valuesPL.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP3 && valuesPV.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  }
                  //en caso de ser usuario complejo (6 periodos)
                } else {
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                    item.activeInput && valuesP0.splice(i, 1, parseFloat(item.activeInput.replace(',', '.')))
                  } else {
                    item.consumptionValueP1 && valuesP1.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                    item.consumptionValueP2 && valuesP2.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP3 && valuesP3.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                    item.consumptionValueP4 && valuesP4.splice(i, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                    item.consumptionValueP5 && valuesP5.splice(i, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                    item.consumptionValueP6 && valuesP6.splice(i, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                  }
                }
              }
            }
          } else {
            if (consumptionsFilters.showR1 === 'S') {
              item.consumptionValue && consumptions.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
            }
            else if (consumptionsFilters.showR4 === 'S') {
              item.consumptionValue && consumptions.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
            }
            else {
              item.consumptionValue && consumptions.push(parseFloat(item.consumptionValue.replace(',', '.')).toFixed(2).replace('.', ','))
            }

            if (isAdapted === 'SI') {
              //diferenciamos entre los dos tipos de usuario
              if (tipoUsuario === 'simple') {
                //comprobamos por fecha de adaptación si hay que coger el valor de consumptionValue
                if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                  item.consumptionValue && valuesP0.splice(i, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                } else {
                  item.consumptionValueP1 && valuesPP.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && valuesPL.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && valuesPV.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                }
                //en caso de ser usuario complejo (6 periodos)
              } else {
                if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                  item.consumptionValue && valuesP0.splice(i, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                } else {
                  item.consumptionValueP1 && valuesP1.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && valuesP2.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && valuesP3.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  item.consumptionValueP4 && valuesP4.splice(i, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                  item.consumptionValueP5 && valuesP5.splice(i, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                  item.consumptionValueP6 && valuesP6.splice(i, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                }
              }
            }
          }
          i++
          return null
        }
      )
    } else if (currentSupplyConsumptions && currentSupplyConsumptions.consumptions && currentSupplyConsumptions.consumptions.items) {
      currentSupplyConsumptions.consumptions.items.map(
        (item) => {
          months.push(formatMonthAndYear(item.consumptionDate))
          let labelAux = item.consumptionDate.split('/')

          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                item.activeOutput && consumptions.push(parseFloat(item.reactive2.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else if (consumptionsFilters.showR3 === 'S') {
                item.activeOutput && consumptions.push(parseFloat(item.reactive3.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else {
                item.activeOutput && consumptions.push(parseFloat(item.activeOutput.replace(',', '.')).toFixed(2).replace('.', ','))
              }
            } else {
              if (consumptionsFilters.showR1 === 'S') {
                item.activeInput && consumptions.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else if (consumptionsFilters.showR4 === 'S') {
                item.activeInput && consumptions.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else {
                item.activeInput && consumptions.push(parseFloat(item.activeInput.replace(',', '.')).toFixed(2).replace('.', ','))
              }

              if (isAdapted === 'SI') {
                //diferenciamos entre los dos tipos de usuario
                if (tipoUsuario === 'simple') {
                  //comprobamos por fecha de adaptación si hay que coger el valor de activeInput
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                    item.activeInput && valuesP0.splice(i, 1, parseFloat(item.activeInput.replace(',', '.')))
                  } else {
                    item.consumptionValueP3 && valuesPV.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                    item.consumptionValueP2 && valuesPL.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP1 && valuesPP.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  }
                  //en caso de ser usuario complejo (6 periodos)
                } else {
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                    item.activeInput && valuesP0.splice(i, 1, parseFloat(item.activeInput.replace(',', '.')))
                  } else {
                    item.consumptionValueP1 && valuesP1.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                    item.consumptionValueP2 && valuesP2.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP3 && valuesP3.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                    item.consumptionValueP4 && valuesP4.splice(i, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                    item.consumptionValueP5 && valuesP5.splice(i, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                    item.consumptionValueP6 && valuesP6.splice(i, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                  }
                }
              }
            }
          } else {
            if (consumptionsFilters.showR1 === 'S') {
              item.consumptionValue && consumptions.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
            }
            else if (consumptionsFilters.showR4 === 'S') {
              item.consumptionValue && consumptions.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
            }
            else {
              item.consumptionValue && consumptions.push(parseFloat(item.consumptionValue.replace(',', '.')).toFixed(2).replace('.', ','))
            }

            if (isAdapted === 'SI') {
              //diferenciamos entre los dos tipos de usuario
              if (tipoUsuario === 'simple') {
                //comprobamos por fecha de adaptación si hay que coger el valor de consumptionValue
                if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                  item.consumptionValue && valuesP0.splice(i, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                } else {
                  item.consumptionValueP1 && valuesPP.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && valuesPL.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && valuesPV.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                }
                //en caso de ser usuario complejo (6 periodos)
              } else {
                if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                  item.consumptionValue && valuesP0.splice(i, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                } else {
                  item.consumptionValueP1 && valuesP1.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && valuesP2.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && valuesP3.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  item.consumptionValueP4 && valuesP4.splice(i, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                  item.consumptionValueP5 && valuesP5.splice(i, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                  item.consumptionValueP6 && valuesP6.splice(i, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                }
              }
            }
          }
          i++
          return null
        }
      )
    }

    if (consumptionsFilters.compare === 'C') {
      if (currentCompareConsumptions[0] && currentCompareConsumptions[0].consumptions && currentCompareConsumptions[0].consumptions.items) {
        currentCompareConsumptions[0].consumptions.items.map(
          (item) => {
            months.push(formatMonthAndYear(item.consumptionDate))

            if (isGeneration) {
              if (isGenerationTab) {
                if (consumptionsFilters.showR2 === 'S') {
                  item.activeOutput && consumptions.push(parseFloat(item.reactive2.replace(',', '.')).toFixed(2).replace('.', ','))
                }
                else if (consumptionsFilters.showR3 === 'S') {
                  item.activeOutput && consumptions.push(parseFloat(item.reactive3.replace(',', '.')).toFixed(2).replace('.', ','))
                }
                else {
                  item.activeOutput && consumptions.push(parseFloat(item.activeOutput.replace(',', '.')).toFixed(2).replace('.', ','))
                }
              } else {
                if (consumptionsFilters.showR1 === 'S') {
                  item.activeInput && consumptions.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
                }
                else if (consumptionsFilters.showR4 === 'S') {
                  item.activeInput && consumptions.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
                }
                else {
                  item.activeInput && consumptions.push(parseFloat(item.activeInput.replace(',', '.')).toFixed(2).replace('.', ','))
                }
              }
            } else {
              if (consumptionsFilters.showR1 === 'S') {
                item.consumptionValue && consumptions.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else if (consumptionsFilters.showR4 === 'S') {
                item.consumptionValue && consumptions.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else {
                item.consumptionValue && consumptions.push(parseFloat(item.consumptionValue.replace(',', '.')).toFixed(2).replace('.', ','))
              }
            }

            return null
          }
        )
      }
    }

    return (

      <MUiTable className={classes.table}>
        <TableHead className={classes.header}>
          <TableRow>
            <TableCell>{t('supplies.suppliesDetails.components.consumption.charts.table.month')}</TableCell>

            {isAdapted === 'SI' && !energiaReactiva ?
              tipoUsuario === 'simple' ?
                <>
                  {adapted_P0 === true &&
                    <TableCell>
                      {t('supplies.suppliesDetails.components.consumption.charts.table.p0')}
                    </TableCell>
                  }
                  <TableCell>
                    {t('supplies.suppliesDetails.components.consumption.charts.table.punta')}
                  </TableCell>
                  <TableCell>
                    {t('supplies.suppliesDetails.components.consumption.charts.table.llano')}
                  </TableCell>
                  <TableCell>
                    {t('supplies.suppliesDetails.components.consumption.charts.table.valle')}
                  </TableCell>
                </>
                :
                <>
                  {adapted_P0 === true &&
                    <TableCell>
                      {t('supplies.suppliesDetails.components.consumption.charts.table.p0')}
                    </TableCell>
                  }
                  {!allEqual(valuesP1) &&
                    <TableCell>
                      {t('P1')}
                    </TableCell>
                  }
                  {!allEqual(valuesP2) &&
                    <TableCell>
                      {t('P2')}
                    </TableCell>
                  }
                  {!allEqual(valuesP3) &&
                    <TableCell>
                      {t('P3')}
                    </TableCell>
                  }
                  {!allEqual(valuesP4) &&
                    <TableCell>
                      {t('P4')}
                    </TableCell>
                  }
                  {!allEqual(valuesP5) &&
                    <TableCell>
                      {t('P5')}
                    </TableCell>
                  }
                  {!allEqual(valuesP6) &&
                    <TableCell>
                      {t('P6')}
                    </TableCell>
                  }
                </>
              :
              <TableCell>
                {
                  (isGenerationTab || consumptionsFilters.showR4 === 'S' || consumptionsFilters.showR3 === 'S') && consumptionsFilters.showR2 === 'N' ?
                    t('supplies.suppliesDetails.components.consumption.charts.table.generation')
                    :
                    t('supplies.suppliesDetails.components.consumption.charts.table.consumption')
                }
              </TableCell>

            }
          </TableRow>
        </TableHead>

        <TableBody>
          {(isAdapted === 'SI' && !energiaReactiva && (tipoUsuario === 'simple' || tipoUsuario === 'complejo')) ?

            months.map(
              (month, index) => {

                return (
                  <TableRow key={index}>
                    <TableCell className={classes.index}>{month}</TableCell>
                    {tipoUsuario === 'simple' ?
                      <>
                        {adapted_P0 === true && valuesP0[index] &&
                          <TableCell>
                            <Grid container className={classes.value}>
                              <Grid item className={(Math.min.apply(null, removeElementsWithValue(valuesP0, 0.0000001)) === Math.max.apply(null, valuesP0) || allEqual(valuesP0)) ? `${classes.color}` : valuesP0[index] === Math.min.apply(null, removeElementsWithValue(valuesP0, 0.0000001)) ? `${classes.color} green` : valuesP0[index] === Math.max.apply(null, valuesP0) && `${classes.color} red`}>{valuesP0[index] === 0.0000001 ? 'N/A' : (valuesP0[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                            </Grid>
                          </TableCell>
                        }
                        {
                          !isNaN(valuesPP[index]) &&
                          <TableCell>
                            <Grid container className={classes.value}>
                              <Grid item className={(Math.min.apply(null, removeElementsWithValue(valuesPP, 0.0000001)) === Math.max.apply(null, valuesPP) || allEqual(valuesPP)) ? `${classes.color}` : valuesPP[index] === Math.min.apply(null, removeElementsWithValue(valuesPP, 0.0000001)) ? `${classes.color} green` : valuesPP[index] === Math.max.apply(null, valuesPP) && `${classes.color} red`}>{valuesPP[index] === 0.0000001 ? 'N/A' : (valuesPP[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                            </Grid>
                          </TableCell>
                        }

                        {
                          !isNaN(valuesPL[index]) &&
                          <TableCell>
                            <Grid container className={classes.value}>
                              <Grid item className={(Math.min.apply(null, removeElementsWithValue(valuesPL, 0.0000001)) === Math.max.apply(null, valuesPL) || allEqual(valuesPL)) ? `${classes.color}` : valuesPL[index] === Math.min.apply(null, removeElementsWithValue(valuesPL, 0.0000001)) ? `${classes.color} green` : valuesPL[index] === Math.max.apply(null, valuesPL) && `${classes.color} red`}>{valuesPL[index] === 0.0000001 ? 'N/A' : (valuesPL[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                            </Grid>
                          </TableCell>
                        }

                        {
                          !isNaN(valuesPV[index]) &&
                          <TableCell>
                            <Grid container className={classes.value}>
                              <Grid item className={(Math.min.apply(null, removeElementsWithValue(valuesPV, 0.0000001)) === Math.max.apply(null, valuesPV) || allEqual(valuesPV)) ? `${classes.color}` : valuesPV[index] === Math.min.apply(null, removeElementsWithValue(valuesPV, 0.0000001)) ? `${classes.color} green` : valuesPV[index] === Math.max.apply(null, valuesPV) && `${classes.color} red`}>{valuesPV[index] === 0.0000001 ? 'N/A' : (valuesPV[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                            </Grid>
                          </TableCell>
                        }
                      </>
                      :
                      <>
                        {adapted_P0 === true && !isNaN(valuesP0[index]) &&
                          <TableCell>
                            <Grid container className={classes.value}>
                              <Grid item className={(Math.min.apply(null, removeElementsWithValue(valuesP0, 0.0000001)) === Math.max.apply(null, valuesP0) || allEqual(valuesP0)) ? `${classes.color}` : valuesP0[index] === Math.min.apply(null, removeElementsWithValue(valuesP0, 0.0000001)) ? `${classes.color} green` : valuesP0[index] === Math.max.apply(null, valuesP0) && `${classes.color} red`}>{valuesP0[index] === 0.0000001 ? 'N/A' : (valuesP0[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                            </Grid>
                          </TableCell>
                        }
                        {!allEqual(valuesP1) && !isNaN(valuesP1[index]) &&
                          <TableCell>
                            <Grid container className={classes.value}>
                              <Grid item className={(Math.min.apply(null, removeElementsWithValue(valuesP1, 0.0000001)) === Math.max.apply(null, valuesP1) || allEqual(valuesP1)) ? `${classes.color}` : valuesP1[index] === Math.min.apply(null, removeElementsWithValue(valuesP1, 0.0000001)) ? `${classes.color} green` : valuesP1[index] === Math.max.apply(null, valuesP1) && `${classes.color} red`}>{valuesP1[index] === 0.0000001 ? 'N/A' : (valuesP1[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                            </Grid>
                          </TableCell>
                        }
                        {!allEqual(valuesP2) && !isNaN(valuesP2[index]) &&
                          <TableCell>
                            <Grid container className={classes.value}>
                              <Grid item className={(Math.min.apply(null, removeElementsWithValue(valuesP2, 0.0000001)) === Math.max.apply(null, valuesP2) || allEqual(valuesP2)) ? `${classes.color}` : valuesP2[index] === Math.min.apply(null, removeElementsWithValue(valuesP2, 0.0000001)) ? `${classes.color} green` : valuesP2[index] === Math.max.apply(null, valuesP2) && `${classes.color} red`}>{valuesP2[index] === 0.0000001 ? 'N/A' : (valuesP2[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                            </Grid>
                          </TableCell>
                        }
                        {!allEqual(valuesP3) && !isNaN(valuesP3[index]) &&
                          <TableCell>
                            <Grid container className={classes.value}>
                              <Grid item className={(Math.min.apply(null, removeElementsWithValue(valuesP3, 0.0000001)) === Math.max.apply(null, valuesP3) || allEqual(valuesP3)) ? `${classes.color}` : valuesP3[index] === Math.min.apply(null, removeElementsWithValue(valuesP3, 0.0000001)) ? `${classes.color} green` : valuesP3[index] === Math.max.apply(null, valuesP3) && `${classes.color} red`}>{valuesP3[index] === 0.0000001 ? 'N/A' : (valuesP3[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                            </Grid>
                          </TableCell>
                        }
                        {!allEqual(valuesP4) && !isNaN(valuesP4[index]) &&
                          <TableCell>
                            <Grid container className={classes.value}>
                              <Grid item className={(Math.min.apply(null, removeElementsWithValue(valuesP4, 0.0000001)) === Math.max.apply(null, valuesP4) || allEqual(valuesP4)) ? `${classes.color}` : valuesP4[index] === Math.min.apply(null, removeElementsWithValue(valuesP4, 0.0000001)) ? `${classes.color} green` : valuesP4[index] === Math.max.apply(null, valuesP4) && `${classes.color} red`}>{valuesP4[index] === 0.0000001 ? 'N/A' : (valuesP4[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                            </Grid>
                          </TableCell>
                        }
                        {!allEqual(valuesP5) && !isNaN(valuesP5[index]) &&
                          <TableCell>
                            <Grid container className={classes.value}>
                              <Grid item className={(Math.min.apply(null, removeElementsWithValue(valuesP5, 0.0000001)) === Math.max.apply(null, valuesP5) || allEqual(valuesP5)) ? `${classes.color}` : valuesP5[index] === Math.min.apply(null, removeElementsWithValue(valuesP5, 0.0000001)) ? `${classes.color} green` : valuesP5[index] === Math.max.apply(null, valuesP5) && `${classes.color} red`}>{valuesP5[index] === 0.0000001 ? 'N/A' : (valuesP5[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                            </Grid>
                          </TableCell>
                        }
                        {!allEqual(valuesP6) && !isNaN(valuesP6[index]) &&
                          <TableCell>
                            <Grid container className={classes.value}>
                              <Grid item className={(Math.min.apply(null, removeElementsWithValue(valuesP6, 0.0000001)) === Math.max.apply(null, valuesP6) || allEqual(valuesP6)) ? `${classes.color}` : valuesP6[index] === Math.min.apply(null, removeElementsWithValue(valuesP6, 0.0000001)) ? `${classes.color} green` : valuesP6[index] === Math.max.apply(null, valuesP6) && `${classes.color} red`}>{valuesP6[index] === 0.0000001 ? 'N/A' : (valuesP6[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                            </Grid>
                          </TableCell>
                        }
                      </>
                    }

                  </TableRow>
                )
              }
            )

            :

            months.map(
              (month, index) => {
                const consumption = consumptions[index]

                return (
                  <TableRow key={index}>
                    <TableCell className={classes.index}>{month}</TableCell>

                    <TableCell className={classes.valueCell}>
                      <Grid container className={classes.value}>
                        {
                          consumption === 0 ?
                            <img src={NoConsumptionIcon} className={classes.alert} alt='' />
                            :
                            <Grid item>{consumption} {literalKw}</Grid>
                        }

                        {
                          (currentSupplyConsumptions[0] && currentSupplyConsumptions[0].minConsumption && consumption === parseFloat(currentSupplyConsumptions[0].minConsumption.replace(',', '.'))) &&
                          <Grid item className={classes.icon}>
                            <img src={MinConsumptionIcon} alt='' />
                          </Grid>
                        }

                        {
                          (currentSupplyConsumptions[0] && currentSupplyConsumptions[0].maxConsumption && consumption === parseFloat(currentSupplyConsumptions[0].maxConsumption.replace(',', '.'))) &&
                          <Grid item className={classes.icon}>
                            <img src={MaxConsumptionIcon} alt='' />
                          </Grid>
                        }
                      </Grid>
                    </TableCell>
                  </TableRow>
                )
              }
            )
          }
        </TableBody>
      </MUiTable>

    )
  }

  const daysView = () => {
    let days = [] as any
    let daysCompare = [] as any
    let consumptions = [] as any
    let consumptions2 = [] as any
    var maxItem
    let daysMap = [] as any
    let labelAux
    let i = 0

    if (currentSupplyConsumptions[0] && currentSupplyConsumptions[0].consumptions && currentSupplyConsumptions[0].consumptions.items) {
      currentSupplyConsumptions[0].consumptions.items.map(
        (item) => {
          days.push(formatDayAndMonthAndYear(item.consumptionDate))
          labelAux = item.consumptionDate.split('/')

          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                item.activeOutput && consumptions.push(parseFloat(item.reactive2.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else if (consumptionsFilters.showR3 === 'S') {
                item.activeOutput && consumptions.push(parseFloat(item.reactive3.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else {
                item.activeOutput && consumptions.push(parseFloat(item.activeOutput.replace(',', '.')).toFixed(2).replace('.', ','))
              }
            } else {
              if (consumptionsFilters.showR1 === 'S') {
                item.activeInput && consumptions.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else if (consumptionsFilters.showR4 === 'S') {
                item.activeInput && consumptions.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else {
                item.activeInput && consumptions.push(parseFloat(item.activeInput.replace(',', '.')).toFixed(2).replace('.', ','))
              }

              if (isAdapted === 'SI') {
                //diferenciamos entre los dos tipos de usuario
                if (tipoUsuario === 'simple') {
                  //comprobamos por fecha de adaptación si hay que coger el valor de activeInput
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                    item.activeInput && valuesP0.splice(i, 1, parseFloat(item.activeInput.replace(',', '.')))
                  } else {
                    item.consumptionValueP1 && valuesPP.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                    item.consumptionValueP2 && valuesPL.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP3 && valuesPV.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))

                  }
                  //en caso de ser usuario complejo (6 periodos)
                } else {
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                    item.activeInput && valuesP0.splice(i, 1, parseFloat(item.activeInput.replace(',', '.')))
                  } else {
                    item.consumptionValueP1 && valuesP1.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                    item.consumptionValueP2 && valuesP2.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP3 && valuesP3.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                    item.consumptionValueP4 && valuesP4.splice(i, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                    item.consumptionValueP5 && valuesP5.splice(i, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                    item.consumptionValueP6 && valuesP6.splice(i, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                  }
                }
              }
            }
          } else {
            if (consumptionsFilters.showR1 === 'S') {
              item.consumptionValue && consumptions.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
            }
            else if (consumptionsFilters.showR4 === 'S') {
              item.consumptionValue && consumptions.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
            }
            else {
              item.consumptionValue && consumptions.push(parseFloat(item.consumptionValue.replace(',', '.')).toFixed(2).replace('.', ','))
            }

            if (isAdapted === 'SI') {
              //diferenciamos entre los dos tipos de usuario
              if (tipoUsuario === 'simple') {
                //comprobamos por fecha de adaptación si hay que coger el valor de consumptionValue
                if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                  item.consumptionValue && valuesP0.splice(i, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                } else {
                  item.consumptionValueP1 && valuesPP.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && valuesPL.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && valuesPV.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))

                }
                //en caso de ser usuario complejo (6 periodos)
              } else {
                if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                  item.consumptionValue && valuesP0.splice(i, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                } else {
                  item.consumptionValueP1 && valuesP1.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && valuesP2.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && valuesP3.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  item.consumptionValueP4 && valuesP4.splice(i, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                  item.consumptionValueP5 && valuesP5.splice(i, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                  item.consumptionValueP6 && valuesP6.splice(i, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                }
              }
            }
          }
          i++
          return null
        }
      )
    } else if (currentSupplyConsumptions && currentSupplyConsumptions.consumptions && currentSupplyConsumptions.consumptions.items) {
      currentSupplyConsumptions.consumptions.items.map(
        (item) => {
          days.push(formatDayAndMonthAndYear(item.consumptionDate))
          labelAux = item.consumptionDate.split('/')

          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                item.activeOutput && consumptions.push(parseFloat(item.reactive2.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else if (consumptionsFilters.showR3 === 'S') {
                item.activeOutput && consumptions.push(parseFloat(item.reactive3.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else {
                item.activeOutput && consumptions.push(parseFloat(item.activeOutput.replace(',', '.')).toFixed(2).replace('.', ','))
              }
            } else {
              if (consumptionsFilters.showR1 === 'S') {
                item.activeInput && consumptions.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else if (consumptionsFilters.showR4 === 'S') {
                item.activeInput && consumptions.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else {
                item.activeInput && consumptions.push(parseFloat(item.activeInput.replace(',', '.')).toFixed(2).replace('.', ','))
              }

              if (isAdapted === 'SI') {
                //diferenciamos entre los dos tipos de usuario
                if (tipoUsuario === 'simple') {
                  //comprobamos por fecha de adaptación si hay que coger el valor de activeInput
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                    item.activeInput && valuesP0.splice(i, 1, parseFloat(item.activeInput.replace(',', '.')))
                  } else {
                    item.consumptionValueP1 && valuesPP.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                    item.consumptionValueP2 && valuesPL.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP3 && valuesPV.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  }
                  //en caso de ser usuario complejo (6 periodos)
                } else {
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                    item.activeInput && valuesP0.splice(i, 1, parseFloat(item.activeInput.replace(',', '.')))
                  } else {
                    item.consumptionValueP1 && valuesP1.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                    item.consumptionValueP2 && valuesP2.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP3 && valuesP3.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                    item.consumptionValueP4 && valuesP4.splice(i, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                    item.consumptionValueP5 && valuesP5.splice(i, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                    item.consumptionValueP6 && valuesP6.splice(i, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                  }
                }
              }
            }
          } else {
            if (consumptionsFilters.showR1 === 'S') {
              item.consumptionValue && consumptions.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
            }
            else if (consumptionsFilters.showR4 === 'S') {
              item.consumptionValue && consumptions.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
            }
            else {
              item.consumptionValue && consumptions.push(parseFloat(item.consumptionValue.replace(',', '.')).toFixed(2).replace('.', ','))
            }

            if (isAdapted === 'SI') {
              //diferenciamos entre los dos tipos de usuario
              if (tipoUsuario === 'simple') {
                //comprobamos por fecha de adaptación si hay que coger el valor de consumptionValue
                if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                  item.consumptionValue && valuesP0.splice(i, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                } else {
                  item.consumptionValueP1 && valuesPP.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && valuesPL.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && valuesPV.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))

                }
                //en caso de ser usuario complejo (6 periodos)
              } else {
                if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                  item.consumptionValue && valuesP0.splice(i, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                } else {
                  item.consumptionValueP1 && valuesP1.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && valuesP2.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && valuesP3.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  item.consumptionValueP4 && valuesP4.splice(i, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                  item.consumptionValueP5 && valuesP5.splice(i, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                  item.consumptionValueP6 && valuesP6.splice(i, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                }
              }
            }
          }
          i++
          return null
        }
      )
    }

    if (currentSupplyConsumptions[1] && currentSupplyConsumptions[1].consumptions && currentSupplyConsumptions[1].consumptions.items) {
      currentSupplyConsumptions[1].consumptions.items.map(
        (item) => {
          days.push(formatDayAndMonthAndYear(item.consumptionDate))
          labelAux = item.consumptionDate.split('/')

          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                item.activeOutput && consumptions.push(parseFloat(item.reactive2.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else if (consumptionsFilters.showR3 === 'S') {
                item.activeOutput && consumptions.push(parseFloat(item.reactive3.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else {
                item.activeOutput && consumptions.push(parseFloat(item.activeOutput.replace(',', '.')).toFixed(2).replace('.', ','))
              }
            } else {
              if (consumptionsFilters.showR1 === 'S') {
                item.activeInput && consumptions.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else if (consumptionsFilters.showR4 === 'S') {
                item.activeInput && consumptions.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else {
                item.activeInput && consumptions.push(parseFloat(item.activeInput.replace(',', '.')).toFixed(2).replace('.', ','))
              }

              if (isAdapted === 'SI') {
                //diferenciamos entre los dos tipos de usuario
                if (tipoUsuario === 'simple') {
                  //comprobamos por fecha de adaptación si hay que coger el valor de activeInput
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                    item.activeInput && valuesP0.splice(i, 1, parseFloat(item.activeInput.replace(',', '.')))
                  } else {
                    item.consumptionValueP1 && valuesPP.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                    item.consumptionValueP2 && valuesPL.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP3 && valuesPV.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))

                  }
                  //en caso de ser usuario complejo (6 periodos)
                } else {
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                    item.activeInput && valuesP0.splice(i, 1, parseFloat(item.activeInput.replace(',', '.')))
                  } else {
                    item.consumptionValueP1 && valuesP1.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                    item.consumptionValueP2 && valuesP2.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP3 && valuesP3.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                    item.consumptionValueP4 && valuesP4.splice(i, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                    item.consumptionValueP5 && valuesP5.splice(i, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                    item.consumptionValueP6 && valuesP6.splice(i, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                  }
                }
              }
            }
          } else {
            if (consumptionsFilters.showR1 === 'S') {
              item.consumptionValue && consumptions.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
            }
            else if (consumptionsFilters.showR4 === 'S') {
              item.consumptionValue && consumptions.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
            }
            else {
              item.consumptionValue && consumptions.push(parseFloat(item.consumptionValue.replace(',', '.')).toFixed(2).replace('.', ','))
            }

            if (isAdapted === 'SI') {
              //diferenciamos entre los dos tipos de usuario
              if (tipoUsuario === 'simple') {
                //comprobamos por fecha de adaptación si hay que coger el valor de consumptionValue
                if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                  item.consumptionValue && valuesP0.splice(i, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                } else {
                  item.consumptionValueP1 && valuesPP.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && valuesPL.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && valuesPV.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                }
                //en caso de ser usuario complejo (6 periodos)
              } else {
                if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                  item.consumptionValue && valuesP0.splice(i, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                } else {
                  item.consumptionValueP1 && valuesP1.splice(i, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && valuesP2.splice(i, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && valuesP3.splice(i, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  item.consumptionValueP4 && valuesP4.splice(i, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                  item.consumptionValueP5 && valuesP5.splice(i, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                  item.consumptionValueP6 && valuesP6.splice(i, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                }
              }
            }
          }
          i++
          return null
        }
      )
    }

    if (consumptionsFilters.compare === 'C') {
      if (currentCompareConsumptions[0] && currentCompareConsumptions[0].consumptions && currentCompareConsumptions[0].consumptions.items) {
        currentCompareConsumptions[0].consumptions.items.map(
          (item) => {
            daysCompare.push(formatDayAndMonthAndYear(item.consumptionDate))

            if (isGeneration) {
              if (isGenerationTab) {
                if (consumptionsFilters.showR2 === 'S') {
                  item.activeOutput && consumptions2.push(parseFloat(item.reactive2.replace(',', '.')).toFixed(2).replace('.', ','))
                }
                else if (consumptionsFilters.showR3 === 'S') {
                  item.activeOutput && consumptions2.push(parseFloat(item.reactive3.replace(',', '.')).toFixed(2).replace('.', ','))
                }
                else {
                  item.activeOutput && consumptions2.push(parseFloat(item.activeOutput.replace(',', '.')).toFixed(2).replace('.', ','))
                }
              } else {
                if (consumptionsFilters.showR1 === 'S') {
                  item.activeInput && consumptions2.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
                }
                else if (consumptionsFilters.showR4 === 'S') {
                  item.activeInput && consumptions2.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
                }
                else {
                  item.activeInput && consumptions2.push(parseFloat(item.activeInput.replace(',', '.')).toFixed(2).replace('.', ','))
                }
              }
            } else {
              if (consumptionsFilters.showR1 === 'S') {
                item.consumptionValue && consumptions2.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else if (consumptionsFilters.showR4 === 'S') {
                item.consumptionValue && consumptions2.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else {
                item.consumptionValue && consumptions2.push(parseFloat(item.consumptionValue.replace(',', '.')).toFixed(2).replace('.', ','))
              }
            }
            return null
          }
        )
      }

      if (currentCompareConsumptions[1] && currentCompareConsumptions[1].consumptions && currentCompareConsumptions[1].consumptions.items) {
        currentCompareConsumptions[1].consumptions.items.map(
          (item) => {
            daysCompare.push(formatDayAndMonthAndYear(item.consumptionDate))

            if (isGeneration) {
              if (isGenerationTab) {
                if (consumptionsFilters.showR2 === 'S') {
                  item.activeOutput && consumptions2.push(parseFloat(item.reactive2.replace(',', '.')).toFixed(2).replace('.', ','))
                }
                else if (consumptionsFilters.showR3 === 'S') {
                  item.activeOutput && consumptions2.push(parseFloat(item.reactive3.replace(',', '.')).toFixed(2).replace('.', ','))
                }
                else {
                  item.activeOutput && consumptions2.push(parseFloat(item.activeOutput.replace(',', '.')).toFixed(2).replace('.', ','))
                }
              } else {
                if (consumptionsFilters.showR1 === 'S') {
                  item.activeInput && consumptions2.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
                }
                else if (consumptionsFilters.showR4 === 'S') {
                  item.activeInput && consumptions2.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
                }
                else {
                  item.activeInput && consumptions2.push(parseFloat(item.activeInput.replace(',', '.')).toFixed(2).replace('.', ','))
                }
              }
            } else {
              if (consumptionsFilters.showR1 === 'S') {
                item.consumptionValue && consumptions2.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else if (consumptionsFilters.showR4 === 'S') {
                item.consumptionValue && consumptions2.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else {
                item.consumptionValue && consumptions2.push(parseFloat(item.consumptionValue.replace(',', '.')).toFixed(2).replace('.', ','))
              }
            }
            return null
          }
        )
      }
      maxItem = days.length
      daysMap = days

      if (daysCompare.length > maxItem) {
        maxItem = daysCompare.length
        daysMap = daysCompare
      }
    }

    return (
      <>

        <MUiTable className={classes.table}>
          {
            (consumptionsFilters.compare !== 'C') ?
              <TableHead className={classes.header}>
                <TableRow>
                  <TableCell>{t('supplies.suppliesDetails.components.consumption.charts.table.day')}</TableCell>

                  {isAdapted !== 'SI' || energiaReactiva || ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) ?
                    <TableCell>
                      {
                        (isGenerationTab || consumptionsFilters.showR4 === 'S' || consumptionsFilters.showR3 === 'S') && consumptionsFilters.showR2 === 'N' ?
                          t('supplies.suppliesDetails.components.consumption.charts.table.generation')
                          :
                          t('supplies.suppliesDetails.components.consumption.charts.table.consumption')
                      }
                    </TableCell>
                    :
                    tipoUsuario === 'simple' ?
                      <>
                        {!allEqual(valuesP0) &&
                          <TableCell>
                            {t('supplies.suppliesDetails.components.consumption.charts.table.p0')}
                          </TableCell>
                        }
                        <TableCell>
                          {t('supplies.suppliesDetails.components.consumption.charts.table.punta')}
                        </TableCell>
                        <TableCell>
                          {t('supplies.suppliesDetails.components.consumption.charts.table.llano')}
                        </TableCell>
                        <TableCell>
                          {t('supplies.suppliesDetails.components.consumption.charts.table.valle')}
                        </TableCell>
                      </>
                      :
                      <>
                        {!allEqual(valuesP0) &&
                          <TableCell>
                            {t('supplies.suppliesDetails.components.consumption.charts.table.p0')}
                          </TableCell>
                        }
                        {!allEqual(valuesP1) &&
                          <TableCell>
                            {t('P1')}
                          </TableCell>
                        }
                        {!allEqual(valuesP2) &&
                          <TableCell>
                            {t('P2')}
                          </TableCell>
                        }
                        {!allEqual(valuesP3) &&
                          <TableCell>
                            {t('P3')}
                          </TableCell>
                        }
                        {!allEqual(valuesP4) &&
                          <TableCell>
                            {t('P4')}
                          </TableCell>
                        }
                        {!allEqual(valuesP5) &&
                          <TableCell>
                            {t('P5')}
                          </TableCell>
                        }
                        {!allEqual(valuesP6) &&
                          <TableCell>
                            {t('P6')}
                          </TableCell>
                        }
                      </>
                  }
                </TableRow>
              </TableHead>
              :
              <TableHead className={classes.header}>
                <TableRow>
                  <TableCell>{t('supplies.suppliesDetails.components.consumption.charts.table.day')}</TableCell>

                  <TableCell>
                    {
                      (isGenerationTab || consumptionsFilters.showR4 === 'S' || consumptionsFilters.showR3 === 'S') && consumptionsFilters.showR2 === 'N' ?
                        t('supplies.suppliesDetails.components.consumption.charts.table.generation')
                        :
                        t('supplies.suppliesDetails.components.consumption.charts.table.consumption')
                    }
                  </TableCell>

                  <TableCell>{t('supplies.suppliesDetails.components.consumption.charts.table.day')}</TableCell>

                  <TableCell>
                    {
                      (isGenerationTab || consumptionsFilters.showR4 === 'S' || consumptionsFilters.showR3 === 'S') && consumptionsFilters.showR2 === 'N' ?
                        t('supplies.suppliesDetails.components.consumption.charts.table.generation')
                        :
                        t('supplies.suppliesDetails.components.consumption.charts.table.consumption')
                    }
                  </TableCell>
                </TableRow>
              </TableHead>
          }

          <TableBody>
            {
              (consumptionsFilters.compare !== 'C') ?
                isAdapted !== 'SI' || energiaReactiva || ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) ?
                  days.map(
                    (day, index) => {
                      const consumption = consumptions[index]

                      return (
                        <TableRow key={index}>
                          <TableCell className={classes.index}>{day}</TableCell>

                          <TableCell className={classes.valueCell}>
                            <Grid container className={classes.value}>
                              {
                                consumption === 0 ?
                                  <img src={NoConsumptionIcon} className={classes.alert} alt='' />
                                  :
                                  <Grid item>{consumption} {literalKw}</Grid>
                              }

                              {
                                (currentSupplyConsumptions[0] && currentSupplyConsumptions[0].minConsumption && consumption === parseFloat(currentSupplyConsumptions[0].minConsumption.replace(',', '.'))) &&
                                <Grid item className={classes.icon}>
                                  <img src={MinConsumptionIcon} alt='' />
                                </Grid>
                              }

                              {
                                (currentSupplyConsumptions[0] && currentSupplyConsumptions[0].maxConsumption && consumption === parseFloat(currentSupplyConsumptions[0].maxConsumption.replace(',', '.'))) &&
                                <Grid item className={classes.icon}>
                                  <img src={MaxConsumptionIcon} alt='' />
                                </Grid>
                              }
                            </Grid>
                          </TableCell>
                        </TableRow>
                      )
                    }
                  )
                  :
                  days.map(
                    (day, index) => {
                      const consumption = consumptions[index]

                      return (
                        <TableRow key={index}>
                          <TableCell className={classes.index}>{day}</TableCell>
                          {tipoUsuario === 'simple' ?
                            <>
                              {!allEqual(valuesP0) && valuesP0[index] &&
                                <TableCell>
                                  <Grid container className={classes.value}>
                                    <Grid item className={(Math.min.apply(null, removeElementsWithValue(valuesP0, 0.0000001)) === Math.max.apply(null, valuesP0) || allEqual(valuesP0)) ? `${classes.color}` : valuesP0[index] === Math.min.apply(null, removeElementsWithValue(valuesP0, 0.0000001)) ? `${classes.color} green` : valuesP0[index] === Math.max.apply(null, valuesP0) && `${classes.color} red`}>{valuesP0[index] === 0.0000001 ? 'N/A' : (valuesP0[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                  </Grid>
                                </TableCell>
                              }
                              {
                                !isNaN(valuesPP[index]) &&
                                <TableCell>
                                  <Grid container className={classes.value}>
                                    <Grid item className={(Math.min.apply(null, removeElementsWithValue(valuesPP, 0.0000001)) === Math.max.apply(null, valuesPP) || allEqual(valuesPP)) ? `${classes.color}` : valuesPP[index] === Math.min.apply(null, removeElementsWithValue(valuesPP, 0.0000001)) ? `${classes.color} green` : valuesPP[index] === Math.max.apply(null, valuesPP) && `${classes.color} red`}>{valuesPP[index] === 0.0000001 ? 'N/A' : (valuesPP[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                  </Grid>
                                </TableCell>
                              }
                              {
                                !isNaN(valuesPL[index]) &&
                                <TableCell>
                                  <Grid container className={classes.value}>
                                    <Grid item className={(Math.min.apply(null, removeElementsWithValue(valuesPL, 0.0000001)) === Math.max.apply(null, valuesPL) || allEqual(valuesPL)) ? `${classes.color}` : valuesPL[index] === Math.min.apply(null, removeElementsWithValue(valuesPL, 0.0000001)) ? `${classes.color} green` : valuesPL[index] === Math.max.apply(null, valuesPL) && `${classes.color} red`}>{valuesPL[index] === 0.0000001 ? 'N/A' : (valuesPL[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                  </Grid>
                                </TableCell>
                              }
                              {
                                !isNaN(valuesPV[index]) &&
                                <TableCell>
                                  <Grid container className={classes.value}>
                                    <Grid item className={(Math.min.apply(null, removeElementsWithValue(valuesPV, 0.0000001)) === Math.max.apply(null, valuesPV) || allEqual(valuesPV)) ? `${classes.color}` : valuesPV[index] === Math.min.apply(null, removeElementsWithValue(valuesPV, 0.0000001)) ? `${classes.color} green` : valuesPV[index] === Math.max.apply(null, valuesPV) && `${classes.color} red`}>{valuesPV[index] === 0.0000001 ? 'N/A' : (valuesPV[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                  </Grid>
                                </TableCell>
                              }
                            </>
                            :
                            <>
                              {!allEqual(valuesP0) && valuesP0[index] &&
                                <TableCell>
                                  <Grid container className={classes.value}>
                                    <Grid item className={Math.min.apply(null, removeElementsWithValue(valuesP0, 0.0000001)) === Math.max.apply(null, valuesP0) ? `${classes.color}` : valuesP0[index] === Math.min.apply(null, removeElementsWithValue(valuesP0, 0.0000001)) ? `${classes.color} green` : valuesP0[index] === Math.max.apply(null, valuesP0) && `${classes.color} red`}>{valuesP0[index] === 0.0000001 ? 'N/A' : (valuesP0[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                  </Grid>
                                </TableCell>
                              }
                              {!allEqual(valuesP1) && !isNaN(valuesP1[index]) &&
                                <TableCell>
                                  <Grid container className={classes.value}>
                                    <Grid item className={Math.min.apply(null, removeElementsWithValue(valuesP1, 0.0000001)) === Math.max.apply(null, valuesP1) ? `${classes.color}` : valuesP1[index] === Math.min.apply(null, removeElementsWithValue(valuesP1, 0.0000001)) ? `${classes.color} green` : valuesP1[index] === Math.max.apply(null, valuesP1) && `${classes.color} red`}>{valuesP1[index] === 0.0000001 ? 'N/A' : (valuesP1[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                  </Grid>
                                </TableCell>
                              }
                              {!allEqual(valuesP2) && !isNaN(valuesP2[index]) &&
                                <TableCell>
                                  <Grid container className={classes.value}>
                                    <Grid item className={Math.min.apply(null, removeElementsWithValue(valuesP2, 0.0000001)) === Math.max.apply(null, valuesP2) ? `${classes.color}` : valuesP2[index] === Math.min.apply(null, removeElementsWithValue(valuesP2, 0.0000001)) ? `${classes.color} green` : valuesP2[index] === Math.max.apply(null, valuesP2) && `${classes.color} red`}>{valuesP2[index] === 0.0000001 ? 'N/A' : (valuesP2[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                  </Grid>
                                </TableCell>
                              }
                              {!allEqual(valuesP3) && !isNaN(valuesP3[index]) &&
                                <TableCell>
                                  <Grid container className={classes.value}>
                                    <Grid item className={Math.min.apply(null, removeElementsWithValue(valuesP3, 0.0000001)) === Math.max.apply(null, valuesP3) ? `${classes.color}` : valuesP3[index] === Math.min.apply(null, removeElementsWithValue(valuesP3, 0.0000001)) ? `${classes.color} green` : valuesP3[index] === Math.max.apply(null, valuesP3) && `${classes.color} red`}>{valuesP3[index] === 0.0000001 ? 'N/A' : (valuesP3[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                  </Grid>
                                </TableCell>
                              }
                              {!allEqual(valuesP4) && !isNaN(valuesP4[index]) &&
                                <TableCell>
                                  <Grid container className={classes.value}>
                                    <Grid item className={Math.min.apply(null, removeElementsWithValue(valuesP4, 0.0000001)) === Math.max.apply(null, valuesP4) ? `${classes.color}` : valuesP4[index] === Math.min.apply(null, removeElementsWithValue(valuesP4, 0.0000001)) ? `${classes.color} green` : valuesP4[index] === Math.max.apply(null, valuesP4) && `${classes.color} red`}>{valuesP4[index] === 0.0000001 ? 'N/A' : (valuesP4[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                  </Grid>
                                </TableCell>
                              }
                              {!allEqual(valuesP5) && !isNaN(valuesP5[index]) &&
                                <TableCell>
                                  <Grid container className={classes.value}>
                                    <Grid item className={Math.min.apply(null, removeElementsWithValue(valuesP5, 0.0000001)) === Math.max.apply(null, valuesP5) ? `${classes.color}` : valuesP5[index] === Math.min.apply(null, removeElementsWithValue(valuesP5, 0.0000001)) ? `${classes.color} green` : valuesP5[index] === Math.max.apply(null, valuesP5) && `${classes.color} red`}>{valuesP5[index] === 0.0000001 ? 'N/A' : (valuesP5[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                  </Grid>
                                </TableCell>
                              }
                              {!allEqual(valuesP6) && !isNaN(valuesP6[index]) &&
                                <TableCell>
                                  <Grid container className={classes.value}>
                                    <Grid item className={Math.min.apply(null, removeElementsWithValue(valuesP6, 0.0000001)) === Math.max.apply(null, valuesP6) ? `${classes.color}` : valuesP6[index] === Math.min.apply(null, removeElementsWithValue(valuesP6, 0.0000001)) ? `${classes.color} green` : valuesP6[index] === Math.max.apply(null, valuesP6) && `${classes.color} red`}>{valuesP6[index] === 0.0000001 ? 'N/A' : (valuesP6[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                  </Grid>
                                </TableCell>
                              }
                            </>
                          }
                        </TableRow>
                      )
                    }
                  )
                :
                daysMap.map(
                  (day, index) => {

                    const dayMostrar = days[index]
                    const dayCompare = daysCompare[index]
                    const consumption = consumptions[index]
                    const consumption2 = consumptions2[index]
                    const lengDay = days.length - 1
                    const lengDayCompare = daysCompare.length - 1

                    return (
                      <TableRow key={index}>

                        <TableCell className={classes.index}>{dayMostrar}</TableCell>

                        <TableCell className={classes.valueCell}>
                          <Grid container className={classes.value}>
                            {
                              (index <= lengDay) ?
                                consumption === 0 ?
                                  <img src={NoConsumptionIcon} className={classes.alert} alt='' />
                                  :
                                  <Grid item>
                                    {consumption} {literalKw}
                                  </Grid>
                                :
                                []
                            }
                          </Grid>
                        </TableCell>

                        <TableCell className={classes.index}>{dayCompare}</TableCell>

                        <TableCell className={classes.valueCell}>
                          <Grid container className={classes.value}>
                            {
                              (index <= lengDayCompare) ?
                                consumption2 === 0 ?
                                  <img src={NoConsumptionIcon} className={classes.alert} alt='' />
                                  :
                                  <Grid item>
                                    {consumption2} {literalKw}
                                  </Grid>
                                :
                                []
                            }
                          </Grid>
                        </TableCell>
                      </TableRow>
                    )
                  }
                )
            }
          </TableBody>
        </MUiTable>
      </>
    )
  }

  const hoursView = () => {
    let hours = [] as any
    let hoursCompare = [] as any
    let consumptions = [] as any
    let consumptions2 = [] as any
    var maxItemHours
    let hoursMap = [] as any
    let labelAux
    let counterH = 0

    if (currentSupplyConsumptions[0] && currentSupplyConsumptions[0].consumptions && currentSupplyConsumptions[0].consumptions.items) {
      currentSupplyConsumptions[0].consumptions.items.map(
        (item) => {
          hours.push(formatHour(item.hour))
          labelAux = item.consumptionDate.split('/')

          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                item.activeOutput && consumptions.push(parseFloat(item.reactive2.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else if (consumptionsFilters.showR3 === 'S') {
                item.activeOutput && consumptions.push(parseFloat(item.reactive3.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else {
                item.activeOutput && consumptions.push(parseFloat(item.activeOutput.replace(',', '.')).toFixed(2).replace('.', ','))
              }
            } else {
              if (consumptionsFilters.showR1 === 'S') {
                item.activeInput && consumptions.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else if (consumptionsFilters.showR4 === 'S') {
                item.activeInput && consumptions.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else {
                item.activeInput && consumptions.push(parseFloat(item.activeInput.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              if (isAdapted === 'SI') {
                //diferenciamos entre los dos tipos de usuario
                if (tipoUsuario === 'simple') {
                  //comprobamos por fecha de adaptación si hay que coger el valor de activeInput
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                    item.activeInput && stateConsumptions.checked0 && valuesPL.splice(counterH, 1, parseFloat(item.activeInput.replace(',', '.')))
                    item.activeInput && valuesP0.splice(counterH, 1, parseFloat(item.activeInput.replace(',', '.')))
                  } else {
                    item.consumptionValueP1 && valuesPP.splice(counterH, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                    item.consumptionValueP2 && valuesPL.splice(counterH, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP3 && valuesPV.splice(counterH, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  }
                  //en caso de ser usuario complejo (6 periodos)
                } else {
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                    item.activeInput && valuesPL.splice(counterH, 1, parseFloat(item.activeInput.replace(',', '.')))
                    item.activeInput && valuesP0.splice(counterH, 1, parseFloat(item.activeInput.replace(',', '.')))
                  } else {
                    item.consumptionValueP1 && valuesP1.splice(counterH, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                    item.consumptionValueP2 && valuesP2.splice(counterH, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP3 && valuesP3.splice(counterH, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                    item.consumptionValueP4 && valuesP4.splice(counterH, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                    item.consumptionValueP5 && valuesP5.splice(counterH, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                    item.consumptionValueP6 && valuesP6.splice(counterH, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                  }
                }
              }
            }
          } else {
            if (consumptionsFilters.showR1 === 'S') {
              item.consumptionValue && consumptions.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
            }
            else if (consumptionsFilters.showR4 === 'S') {
              item.consumptionValue && consumptions.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
            }
            else {
              item.consumptionValue && consumptions.push(parseFloat(item.consumptionValue.replace(',', '.')).toFixed(2).replace('.', ','))
            }
            if (isAdapted === 'SI') {
              //diferenciamos entre los dos tipos de usuario
              if (tipoUsuario === 'simple') {
                //comprobamos por fecha de adaptación si hay que coger el valor de consumptionValue
                if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                  item.consumptionValue && stateConsumptions.checked0 && valuesPL.splice(counterH, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                  item.consumptionValue && valuesP0.splice(counterH, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                } else {
                  item.consumptionValueP1 && valuesPP.splice(counterH, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && valuesPL.splice(counterH, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && valuesPV.splice(counterH, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))

                }
                //en caso de ser usuario complejo (6 periodos)
              } else {
                if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                  item.consumptionValue && valuesPL.splice(counterH, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                  item.consumptionValue && valuesP0.splice(counterH, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                } else {
                  item.consumptionValueP1 && valuesP1.splice(counterH, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && valuesP2.splice(counterH, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && valuesP3.splice(counterH, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  item.consumptionValueP4 && valuesP4.splice(counterH, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                  item.consumptionValueP5 && valuesP5.splice(counterH, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                  item.consumptionValueP6 && valuesP6.splice(counterH, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                }
              }
            }
          }
          counterH++
          return null
        }
      )
    } else if (currentSupplyConsumptions && currentSupplyConsumptions.consumptions && currentSupplyConsumptions.consumptions.items) {
      currentSupplyConsumptions.consumptions.items.map(
        (item) => {
          hours.push(formatHour(item.hour))
          labelAux = item.consumptionDate.split('/')

          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                item.activeOutput && consumptions.push(parseFloat(item.reactive2.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else if (consumptionsFilters.showR3 === 'S') {
                item.activeOutput && consumptions.push(parseFloat(item.reactive3.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else {
                item.activeOutput && consumptions.push(parseFloat(item.activeOutput.replace(',', '.')).toFixed(2).replace('.', ','))
              }
            } else {
              if (consumptionsFilters.showR1 === 'S') {
                item.activeInput && consumptions.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else if (consumptionsFilters.showR4 === 'S') {
                item.activeInput && consumptions.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else {
                item.activeInput && consumptions.push(parseFloat(item.activeInput.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              if (isAdapted === 'SI') {
                //diferenciamos entre los dos tipos de usuario
                if (tipoUsuario === 'simple') {
                  //comprobamos por fecha de adaptación si hay que coger el valor de activeInput
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                    item.activeInput && stateConsumptions.checked0 && valuesPL.splice(counterH, 1, parseFloat(item.activeInput.replace(',', '.')))
                    item.activeInput && valuesP0.splice(counterH, 1, parseFloat(item.activeInput.replace(',', '.')))
                  } else {
                    item.consumptionValueP1 && valuesPP.splice(counterH, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                    item.consumptionValueP2 && valuesPL.splice(counterH, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP3 && valuesPV.splice(counterH, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  }
                  //en caso de ser usuario complejo (6 periodos)
                } else {
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                    item.activeInput && valuesPL.splice(counterH, 1, parseFloat(item.activeInput.replace(',', '.')))
                    item.activeInput && valuesP0.splice(counterH, 1, parseFloat(item.activeInput.replace(',', '.')))
                  } else {
                    item.consumptionValueP1 && valuesP1.splice(counterH, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                    item.consumptionValueP2 && valuesP2.splice(counterH, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP3 && valuesP3.splice(counterH, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                    item.consumptionValueP4 && valuesP4.splice(counterH, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                    item.consumptionValueP5 && valuesP5.splice(counterH, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                    item.consumptionValueP6 && valuesP6.splice(counterH, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                  }
                }
              }
            }
          } else {
            if (consumptionsFilters.showR1 === 'S') {
              item.consumptionValue && consumptions.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
            }
            else if (consumptionsFilters.showR4 === 'S') {
              item.consumptionValue && consumptions.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
            }
            else {
              item.consumptionValue && consumptions.push(parseFloat(item.consumptionValue.replace(',', '.')).toFixed(2).replace('.', ','))
            }
            if (isAdapted === 'SI') {
              //diferenciamos entre los dos tipos de usuario
              if (tipoUsuario === 'simple') {
                //comprobamos por fecha de adaptación si hay que coger el valor de consumptionValue
                if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                  item.consumptionValue && stateConsumptions.checked0 && valuesPL.splice(counterH, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                  item.consumptionValue && valuesP0.splice(counterH, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                } else {
                  item.consumptionValueP1 && valuesPP.splice(counterH, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && valuesPL.splice(counterH, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && valuesPV.splice(counterH, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                }
                //en caso de ser usuario complejo (6 periodos)
              } else {
                if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                  item.consumptionValue && valuesPL.splice(counterH, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                  item.consumptionValue && valuesP0.splice(counterH, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                } else {
                  item.consumptionValueP1 && valuesP1.splice(counterH, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && valuesP2.splice(counterH, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && valuesP3.splice(counterH, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  item.consumptionValueP4 && valuesP4.splice(counterH, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                  item.consumptionValueP5 && valuesP5.splice(counterH, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                  item.consumptionValueP6 && valuesP6.splice(counterH, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                }
              }
            }
          }
          counterH++
          return null
        }
      )
    }

    if (consumptionsFilters.compare === 'C') {
      if (currentCompareConsumptions[0] && currentCompareConsumptions[0].consumptions && currentCompareConsumptions[0].consumptions.items) {
        currentCompareConsumptions[0].consumptions.items.map(
          (item) => {
            hoursCompare.push(formatHour(item.hour))

            if (isGeneration) {
              if (isGenerationTab) {
                if (consumptionsFilters.showR2 === 'S') {
                  item.activeOutput && consumptions2.push(parseFloat(item.reactive2.replace(',', '.')).toFixed(2).replace('.', ','))
                }
                else if (consumptionsFilters.showR3 === 'S') {
                  item.activeOutput && consumptions2.push(parseFloat(item.reactive3.replace(',', '.')).toFixed(2).replace('.', ','))
                }
                else {
                  item.activeOutput && consumptions2.push(parseFloat(item.activeOutput.replace(',', '.')).toFixed(2).replace('.', ','))
                }
              } else {
                if (consumptionsFilters.showR1 === 'S') {
                  item.activeInput && consumptions2.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
                }
                else if (consumptionsFilters.showR4 === 'S') {
                  item.activeInput && consumptions2.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
                }
                else {
                  item.activeInput && consumptions2.push(parseFloat(item.activeInput.replace(',', '.')).toFixed(2).replace('.', ','))
                }
              }
            } else {
              if (consumptionsFilters.showR1 === 'S') {
                item.consumptionValue && consumptions2.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else if (consumptionsFilters.showR4 === 'S') {
                item.consumptionValue && consumptions2.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else {
                item.consumptionValue && consumptions2.push(parseFloat(item.consumptionValue.replace(',', '.')).toFixed(2).replace('.', ','))
              }
            }
            return null
          }
        )
      }
      maxItemHours = hours.length
      hoursMap = hours

      if (hoursCompare.length > maxItemHours) {
        maxItemHours = hoursCompare.length
        hoursMap = hoursCompare
      }
    }

    return (
      <MUiTable className={classes.table}>
        {
          (consumptionsFilters.compare !== 'C') ?
            <TableHead className={classes.header}>
              <TableRow>
                <TableCell>{t('supplies.suppliesDetails.components.consumption.charts.table.hour')}</TableCell>

                {isAdapted !== 'SI' || energiaReactiva || ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) ?
                  <TableCell>
                    {
                      (isGenerationTab || consumptionsFilters.showR4 === 'S' || consumptionsFilters.showR3 === 'S') && consumptionsFilters.showR2 === 'N' ?
                        t('supplies.suppliesDetails.components.consumption.charts.table.generation')
                        :
                        t('supplies.suppliesDetails.components.consumption.charts.table.consumption')
                    }
                  </TableCell>
                  :
                  tipoUsuario === 'simple' ?
                    <>
                      <TableCell>
                        {t('supplies.suppliesDetails.components.consumption.charts.table.punta')}
                      </TableCell>
                      <TableCell>
                        {t('supplies.suppliesDetails.components.consumption.charts.table.llano')}
                      </TableCell>
                      <TableCell>
                        {t('supplies.suppliesDetails.components.consumption.charts.table.valle')}
                      </TableCell>
                    </>
                    :
                    <>
                      {!allEqual(valuesP1) &&
                        <TableCell>
                          {t('P1')}
                        </TableCell>
                      }
                      {!allEqual(valuesP2) &&
                        <TableCell>
                          {t('P2')}
                        </TableCell>
                      }
                      {!allEqual(valuesP3) &&
                        <TableCell>
                          {t('P3')}
                        </TableCell>
                      }
                      {!allEqual(valuesP4) &&
                        <TableCell>
                          {t('P4')}
                        </TableCell>
                      }
                      {!allEqual(valuesP5) &&
                        <TableCell>
                          {t('P5')}
                        </TableCell>
                      }
                      {!allEqual(valuesP6) &&
                        <TableCell>
                          {t('P6')}
                        </TableCell>
                      }
                    </>
                }
              </TableRow>
            </TableHead>
            :
            <TableHead className={classes.header}>
              <TableRow>
                <TableCell>{t('supplies.suppliesDetails.components.consumption.charts.table.hour')}</TableCell>

                <TableCell>
                  {
                    (isGenerationTab || consumptionsFilters.showR4 === 'S' || consumptionsFilters.showR3 === 'S') && consumptionsFilters.showR2 === 'N' ?
                      t('supplies.suppliesDetails.components.consumption.charts.table.generation')
                      :
                      t('supplies.suppliesDetails.components.consumption.charts.table.consumption')
                  }
                </TableCell>

                <TableCell>{t('Hora a Comparar')}</TableCell>
                <TableCell>{t('Consumo a Comparar')}</TableCell>
              </TableRow>
            </TableHead>
        }

        <TableBody>
          {
            (consumptionsFilters.compare !== 'C') ?
              isAdapted !== 'SI' || energiaReactiva || ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) ?
                hours.map(
                  (hour, index) => {
                    const consumption = consumptions[index]

                    return (
                      <TableRow key={index}>
                        <TableCell className={classes.index}>{hour}:00</TableCell>

                        <TableCell className={classes.valueCell}>
                          <Grid container className={classes.value}>
                            {
                              consumption === 0 ?
                                <img src={NoConsumptionIcon} className={classes.alert} alt='' />
                                :
                                <Grid item>{consumption} {literalKw}</Grid>
                            }

                            {
                              (currentSupplyConsumptions[0] && currentSupplyConsumptions[0].minConsumption && consumption === parseFloat(currentSupplyConsumptions[0].minConsumption.replace('.', ','))) &&
                              <Grid item className={classes.icon}>
                                <img src={MinConsumptionIcon} alt='' />
                              </Grid>
                            }

                            {
                              (currentSupplyConsumptions[0] && currentSupplyConsumptions[0].maxConsumption && consumption === parseFloat(currentSupplyConsumptions[0].maxConsumption.replace('.', ','))) &&
                              <Grid item className={classes.icon}>
                                <img src={MaxConsumptionIcon} alt='' />
                              </Grid>
                            }
                          </Grid>
                        </TableCell>
                      </TableRow>
                    )
                  }
                )
                :
                hours.map(
                  (hour, index) => {
                    const consumption = consumptions[index]

                    return (
                      <TableRow key={index}>
                        <TableCell className={classes.index}>{hour}</TableCell>

                        {tipoUsuario === 'simple' ?
                          <>
                            {
                              !isNaN(valuesPP[index]) &&
                              <TableCell>
                                <Grid container className={classes.value}>
                                  <Grid item className={(Math.min.apply(null, removeElementsWithValue(valuesPP, 0.0000001)) === Math.max.apply(null, valuesPP) || allEqual(valuesPP)) ? `${classes.color}` : valuesPP[index] === Math.min.apply(null, removeElementsWithValue(valuesPP, 0.0000001)) ? `${classes.color} green` : valuesPP[index] === Math.max.apply(null, valuesPP) && `${classes.color} red`}>{valuesPP[index] === 0.0000001 ? 'N/A' : (valuesPP[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                </Grid>
                              </TableCell>
                            }
                            {
                              !isNaN(valuesPL[index]) &&
                              <TableCell>
                                <Grid container className={classes.value}>
                                  <Grid item className={(Math.min.apply(null, removeElementsWithValue(valuesPL, 0.0000001)) === Math.max.apply(null, valuesPL) || allEqual(valuesPL)) ? `${classes.color}` : valuesPL[index] === Math.min.apply(null, removeElementsWithValue(valuesPL, 0.0000001)) ? `${classes.color} green` : valuesPL[index] === Math.max.apply(null, valuesPL) && `${classes.color} red`}>{valuesPL[index] === 0.0000001 ? 'N/A' : (valuesPL[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                </Grid>
                              </TableCell>
                            }
                            {
                              !isNaN(valuesPV[index]) &&
                              <TableCell>
                                <Grid container className={classes.value}>
                                  <Grid item className={(Math.min.apply(null, removeElementsWithValue(valuesPV, 0.0000001)) === Math.max.apply(null, valuesPV) || allEqual(valuesPV)) ? `${classes.color}` : valuesPV[index] === Math.min.apply(null, removeElementsWithValue(valuesPV, 0.0000001)) ? `${classes.color} green` : valuesPV[index] === Math.max.apply(null, valuesPV) && `${classes.color} red`}>{valuesPV[index] === 0.0000001 ? 'N/A' : (valuesPV[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                </Grid>
                              </TableCell>
                            }
                          </>
                          :
                          <>
                            {!allEqual(valuesP1) && !isNaN(valuesP1[index]) &&
                              <TableCell>
                                <Grid container className={classes.value}>
                                  <Grid item className={Math.min.apply(null, removeElementsWithValue(valuesP1, 0.0000001)) === Math.max.apply(null, valuesP1) ? `${classes.color}` : valuesP1[index] === Math.min.apply(null, removeElementsWithValue(valuesP1, 0.0000001)) ? `${classes.color} green` : valuesP1[index] === Math.max.apply(null, valuesP1) && `${classes.color} red`}>{valuesP1[index] === 0.0000001 ? 'N/A' : (valuesP1[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                </Grid>
                              </TableCell>
                            }
                            {!allEqual(valuesP2) && !isNaN(valuesP2[index]) &&
                              <TableCell>
                                <Grid container className={classes.value}>
                                  <Grid item className={Math.min.apply(null, removeElementsWithValue(valuesP2, 0.0000001)) === Math.max.apply(null, valuesP2) ? `${classes.color}` : valuesP2[index] === Math.min.apply(null, removeElementsWithValue(valuesP2, 0.0000001)) ? `${classes.color} green` : valuesP2[index] === Math.max.apply(null, valuesP2) && `${classes.color} red`}>{valuesP2[index] === 0.0000001 ? 'N/A' : (valuesP2[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                </Grid>
                              </TableCell>
                            }
                            {!allEqual(valuesP3) && !isNaN(valuesP3[index]) &&
                              <TableCell>
                                <Grid container className={classes.value}>
                                  <Grid item className={Math.min.apply(null, removeElementsWithValue(valuesP3, 0.0000001)) === Math.max.apply(null, valuesP3) ? `${classes.color}` : valuesP3[index] === Math.min.apply(null, removeElementsWithValue(valuesP3, 0.0000001)) ? `${classes.color} green` : valuesP3[index] === Math.max.apply(null, valuesP3) && `${classes.color} red`}>{valuesP3[index] === 0.0000001 ? 'N/A' : (valuesP3[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                </Grid>
                              </TableCell>
                            }
                            {!allEqual(valuesP4) && !isNaN(valuesP4[index]) &&
                              <TableCell>
                                <Grid container className={classes.value}>
                                  <Grid item className={Math.min.apply(null, removeElementsWithValue(valuesP4, 0.0000001)) === Math.max.apply(null, valuesP4) ? `${classes.color}` : valuesP4[index] === Math.min.apply(null, removeElementsWithValue(valuesP4, 0.0000001)) ? `${classes.color} green` : valuesP4[index] === Math.max.apply(null, valuesP4) && `${classes.color} red`}>{valuesP4[index] === 0.0000001 ? 'N/A' : (valuesP4[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                </Grid>
                              </TableCell>
                            }
                            {!allEqual(valuesP5) && !isNaN(valuesP5[index]) &&
                              <TableCell>
                                <Grid container className={classes.value}>
                                  <Grid item className={Math.min.apply(null, removeElementsWithValue(valuesP5, 0.0000001)) === Math.max.apply(null, valuesP5) ? `${classes.color}` : valuesP5[index] === Math.min.apply(null, removeElementsWithValue(valuesP5, 0.0000001)) ? `${classes.color} green` : valuesP5[index] === Math.max.apply(null, valuesP5) && `${classes.color} red`}>{valuesP5[index] === 0.0000001 ? 'N/A' : (valuesP5[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                </Grid>
                              </TableCell>
                            }
                            {!allEqual(valuesP6) && !isNaN(valuesP6[index]) &&
                              <TableCell>
                                <Grid container className={classes.value}>
                                  <Grid item className={Math.min.apply(null, removeElementsWithValue(valuesP6, 0.0000001)) === Math.max.apply(null, valuesP6) ? `${classes.color}` : valuesP6[index] === Math.min.apply(null, removeElementsWithValue(valuesP6, 0.0000001)) ? `${classes.color} green` : valuesP6[index] === Math.max.apply(null, valuesP6) && `${classes.color} red`}>{valuesP6[index] === 0.0000001 ? 'N/A' : (valuesP6[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                </Grid>
                              </TableCell>
                            }
                          </>
                        }
                      </TableRow>
                    )
                  }
                )
              :
              hoursMap.map(
                (hour, index) => {
                  const hourMostrar = hours[index]
                  const consumption = consumptions[index]
                  const consumption2 = consumptions2[index]
                  const lengHour = hours.length - 1
                  const lengHourCompare = hoursCompare.length - 1

                  return (
                    <TableRow key={index}>
                      <TableCell className={classes.index}>
                        {
                          (index <= lengHour) ?
                            (consumption !== 0) ?
                              <span>{hourMostrar}</span>
                              :
                              []
                            :
                            []
                        }
                      </TableCell>

                      <TableCell className={classes.valueCell}>
                        <Grid container className={classes.value}>
                          {
                            (index <= lengHour) ?
                              consumption === 0 ?
                                <img src={NoConsumptionIcon} className={classes.alert} alt='' />
                                :
                                <Grid item>{consumption} {literalKw}</Grid>
                              :
                              []
                          }
                        </Grid>
                      </TableCell>

                      <TableCell className={classes.index}>
                        {
                          (index <= lengHour) ?
                            (consumption2 !== 0) ?
                              <span>{hourMostrar}</span>
                              :
                              []
                            :
                            []
                        }
                      </TableCell>

                      <TableCell className={classes.valueCell}>
                        <Grid container className={classes.value}>
                          {
                            (index <= lengHourCompare) ?
                              consumption2 === 0 ?
                                <img src={NoConsumptionIcon} className={classes.alert} alt='' />
                                :
                                <Grid item>{consumption2} {literalKw}</Grid>
                              :
                              []
                          }
                        </Grid>
                      </TableCell>
                    </TableRow>
                  )
                }
              )
          }
        </TableBody>
      </MUiTable>
    )
  }

  const quarterHoursView = () => {
    let hours = [] as any
    let hoursCompare = [] as any
    let consumptions = [] as any
    let consumptions2 = [] as any
    var maxItemHours
    let hoursMap = [] as any
    let labelAux
    let cont = 0

    if (currentSupplyConsumptions[0] && currentSupplyConsumptions[0].consumptions && currentSupplyConsumptions[0].consumptions.items) {
      currentSupplyConsumptions[0].consumptions.items.map(
        (item) => {
          hours.push(formatHour(item.hour))
          labelAux = item.consumptionDate.split('/')

          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                item.activeOutput && consumptions.push(parseFloat(item.reactive2.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else if (consumptionsFilters.showR3 === 'S') {
                item.activeOutput && consumptions.push(parseFloat(item.reactive3.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else {
                item.activeOutput && consumptions.push(parseFloat(item.activeOutput.replace(',', '.')).toFixed(2).replace('.', ','))
              }
            } else {
              if (consumptionsFilters.showR1 === 'S') {
                item.activeInput && consumptions.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else if (consumptionsFilters.showR4 === 'S') {
                item.activeInput && consumptions.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else {
                item.activeInput && consumptions.push(parseFloat(item.activeInput.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              if (isAdapted === 'SI') {
                //diferenciamos entre los dos tipos de usuario
                if (tipoUsuario === 'simple') {
                  //comprobamos por fecha de adaptación si hay que coger el valor de activeInput
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                    item.activeInput && stateConsumptions.checked0 && valuesPL.splice(item.hour - 1, 1, parseFloat(item.activeInput.replace(',', '.')))
                    item.activeInput && valuesP0.splice(cont, 1, parseFloat(item.activeInput.replace(',', '.')))
                  } else {
                    item.consumptionValueP1 && valuesPP.splice(cont, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                    item.consumptionValueP2 && valuesPL.splice(cont, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP3 && valuesPV.splice(cont, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  }
                  //en caso de ser usuario complejo (6 periodos)
                } else {
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                    item.activeInput && valuesPL.splice(cont, 1, parseFloat(item.activeInput.replace(',', '.')))
                    item.activeInput && valuesP0.splice(cont, 1, parseFloat(item.activeInput.replace(',', '.')))
                  } else {
                    item.consumptionValueP1 && valuesP1.splice(cont, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                    item.consumptionValueP2 && valuesP2.splice(cont, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP3 && valuesP3.splice(cont, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                    item.consumptionValueP4 && valuesP4.splice(cont, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                    item.consumptionValueP5 && valuesP5.splice(cont, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                    item.consumptionValueP6 && valuesP6.splice(cont, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                  }
                }
              }
            }
          } else {
            if (consumptionsFilters.showR1 === 'S') {
              item.consumptionValue && consumptions.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
            }
            else if (consumptionsFilters.showR4 === 'S') {
              item.consumptionValue && consumptions.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
            }
            else {
              item.consumptionValue && consumptions.push(parseFloat(item.consumptionValue.replace(',', '.')).toFixed(2).replace('.', ','))
            }
            if (isAdapted === 'SI') {
              //diferenciamos entre los dos tipos de usuario
              if (tipoUsuario === 'simple') {
                //comprobamos por fecha de adaptación si hay que coger el valor de consumptionValue
                if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                  item.consumptionValue && stateConsumptions.checked0 && valuesPL.splice(item.hour - 1, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                  item.consumptionValue && valuesP0.splice(cont, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                } else {
                  item.consumptionValueP1 && valuesPP.splice(cont, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && valuesPL.splice(cont, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && valuesPV.splice(cont, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                }
                //en caso de ser usuario complejo (6 periodos)
              } else {
                if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                  item.consumptionValue && valuesPL.splice(cont, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                  item.consumptionValue && valuesP0.splice(cont, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                } else {
                  item.consumptionValueP1 && valuesP1.splice(cont, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && valuesP2.splice(cont, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && valuesP3.splice(cont, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  item.consumptionValueP4 && valuesP4.splice(cont, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                  item.consumptionValueP5 && valuesP5.splice(cont, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                  item.consumptionValueP6 && valuesP6.splice(cont, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                }
              }
            }
          }
          cont++
          return null
        }
      )
    } else if (currentSupplyConsumptions && currentSupplyConsumptions.consumptions && currentSupplyConsumptions.consumptions.items) {
      currentSupplyConsumptions.consumptions.items.map(
        (item) => {
          hours.push(formatHour(item.hour))
          labelAux = item.consumptionDate.split('/')

          if (isGeneration) {
            if (isGenerationTab) {
              if (consumptionsFilters.showR2 === 'S') {
                item.activeOutput && consumptions.push(parseFloat(item.reactive2.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else if (consumptionsFilters.showR3 === 'S') {
                item.activeOutput && consumptions.push(parseFloat(item.reactive3.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else {
                item.activeOutput && consumptions.push(parseFloat(item.activeOutput.replace(',', '.')).toFixed(2).replace('.', ','))
              }
            } else {
              if (consumptionsFilters.showR1 === 'S') {
                item.activeInput && consumptions.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else if (consumptionsFilters.showR4 === 'S') {
                item.activeInput && consumptions.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else {
                item.activeInput && consumptions.push(parseFloat(item.activeInput.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              if (isAdapted === 'SI') {
                //diferenciamos entre los dos tipos de usuario
                if (tipoUsuario === 'simple') {
                  //comprobamos por fecha de adaptación si hay que coger el valor de activeInput
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                    item.activeInput && stateConsumptions.checked0 && valuesPL.splice(cont, 1, parseFloat(item.activeInput.replace(',', '.')))
                    item.activeInput && valuesP0.splice(cont, 1, parseFloat(item.activeInput.replace(',', '.')))
                  } else {
                    item.consumptionValueP1 && valuesPP.splice(cont, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                    item.consumptionValueP2 && valuesPL.splice(cont, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP3 && valuesPV.splice(cont, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  }
                  //en caso de ser usuario complejo (6 periodos)
                } else {
                  if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                    item.activeInput && valuesPL.splice(cont, 1, parseFloat(item.activeInput.replace(',', '.')))
                    item.activeInput && valuesP0.splice(cont, 1, parseFloat(item.activeInput.replace(',', '.')))
                  } else {
                    item.consumptionValueP1 && valuesP1.splice(cont, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                    item.consumptionValueP2 && valuesP2.splice(cont, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                    item.consumptionValueP3 && valuesP3.splice(cont, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                    item.consumptionValueP4 && valuesP4.splice(cont, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                    item.consumptionValueP5 && valuesP5.splice(cont, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                    item.consumptionValueP6 && valuesP6.splice(cont, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                  }
                }
              }
            }
          } else {
            if (consumptionsFilters.showR1 === 'S') {
              item.consumptionValue && consumptions.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
            }
            else if (consumptionsFilters.showR4 === 'S') {
              item.consumptionValue && consumptions.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
            }
            else {
              item.consumptionValue && consumptions.push(parseFloat(item.consumptionValue.replace(',', '.')).toFixed(2).replace('.', ','))
            }
            if (isAdapted === 'SI') {
              //diferenciamos entre los dos tipos de usuario
              if (tipoUsuario === 'simple') {
                //comprobamos por fecha de adaptación si hay que coger el valor de consumptionValue
                if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021 /*|| (!state.checked1 && !state.checked2 && !state.checked3)*/) {
                  item.consumptionValue && stateConsumptions.checked0 && valuesPL.splice(cont, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                  item.consumptionValue && valuesP0.splice(cont, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                } else {
                  item.consumptionValueP1 && valuesPP.splice(cont, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && valuesPL.splice(cont, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && valuesPV.splice(cont, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                }
                //en caso de ser usuario complejo (6 periodos)
              } else {
                if ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) {
                  item.consumptionValue && valuesPL.splice(cont, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                  item.consumptionValue && valuesP0.splice(cont, 1, parseFloat(item.consumptionValue.replace(',', '.')))
                } else {
                  item.consumptionValueP1 && valuesP1.splice(cont, 1, parseFloat(item.consumptionValueP1.replace(',', '.')))
                  item.consumptionValueP2 && valuesP2.splice(cont, 1, parseFloat(item.consumptionValueP2.replace(',', '.')))
                  item.consumptionValueP3 && valuesP3.splice(cont, 1, parseFloat(item.consumptionValueP3.replace(',', '.')))
                  item.consumptionValueP4 && valuesP4.splice(cont, 1, parseFloat(item.consumptionValueP4.replace(',', '.')))
                  item.consumptionValueP5 && valuesP5.splice(cont, 1, parseFloat(item.consumptionValueP5.replace(',', '.')))
                  item.consumptionValueP6 && valuesP6.splice(cont, 1, parseFloat(item.consumptionValueP6.replace(',', '.')))
                }
              }
            }
          }
          cont++
          return null
        }
      )
    }

    if (consumptionsFilters.compare === 'C') {
      if (currentCompareConsumptions[0] && currentCompareConsumptions[0].consumptions && currentCompareConsumptions[0].consumptions.items) {
        currentCompareConsumptions[0].consumptions.items.map(
          (item) => {
            hoursCompare.push(formatHour(item.hour))

            if (isGeneration) {
              if (isGenerationTab) {
                if (consumptionsFilters.showR2 === 'S') {
                  item.activeOutput && consumptions2.push(parseFloat(item.reactive2.replace(',', '.')).toFixed(2).replace('.', ','))
                }
                else if (consumptionsFilters.showR3 === 'S') {
                  item.activeOutput && consumptions2.push(parseFloat(item.reactive3.replace(',', '.')).toFixed(2).replace('.', ','))
                }
                else {
                  item.activeOutput && consumptions2.push(parseFloat(item.activeOutput.replace(',', '.')).toFixed(2).replace('.', ','))
                }
              } else {
                if (consumptionsFilters.showR1 === 'S') {
                  item.activeInput && consumptions2.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
                }
                else if (consumptionsFilters.showR4 === 'S') {
                  item.activeInput && consumptions2.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
                }
                else {
                  item.activeInput && consumptions2.push(parseFloat(item.activeInput.replace(',', '.')).toFixed(2).replace('.', ','))
                }
              }
            } else {
              if (consumptionsFilters.showR1 === 'S') {
                item.consumptionValue && consumptions2.push(parseFloat(item.reactive1.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else if (consumptionsFilters.showR4 === 'S') {
                item.consumptionValue && consumptions2.push(parseFloat(item.reactive4.replace(',', '.')).toFixed(2).replace('.', ','))
              }
              else {
                item.consumptionValue && consumptions2.push(parseFloat(item.consumptionValue.replace(',', '.')).toFixed(2).replace('.', ','))
              }
            }
            return null
          }
        )
      }
      maxItemHours = hours.length
      hoursMap = hours

      if (hoursCompare.length > maxItemHours) {
        maxItemHours = hoursCompare.length
        hoursMap = hoursCompare
      }
    }

    return (
      <MUiTable className={classes.table}>
        {
          (consumptionsFilters.compare !== 'C') ?
            <TableHead className={classes.header}>
              <TableRow>
                <TableCell>{t('supplies.suppliesDetails.components.consumption.charts.table.hour')}</TableCell>

                {isAdapted !== 'SI' || energiaReactiva || ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) ?
                  <TableCell>
                    {
                      (isGenerationTab || consumptionsFilters.showR4 === 'S' || consumptionsFilters.showR3 === 'S') && consumptionsFilters.showR2 === 'N' ?
                        t('supplies.suppliesDetails.components.consumption.charts.table.generation')
                        :
                        t('supplies.suppliesDetails.components.consumption.charts.table.consumption')
                    }
                  </TableCell>
                  :
                  tipoUsuario === 'simple' ?
                    <>
                      <TableCell>
                        {t('supplies.suppliesDetails.components.consumption.charts.table.punta')}
                      </TableCell>
                      <TableCell>
                        {t('supplies.suppliesDetails.components.consumption.charts.table.llano')}
                      </TableCell>
                      <TableCell>
                        {t('supplies.suppliesDetails.components.consumption.charts.table.valle')}
                      </TableCell>
                    </>
                    :
                    <>
                      {!allEqual(valuesP1) &&
                        <TableCell>
                          {t('P1')}
                        </TableCell>
                      }
                      {!allEqual(valuesP2) &&
                        <TableCell>
                          {t('P2')}
                        </TableCell>
                      }
                      {!allEqual(valuesP3) &&
                        <TableCell>
                          {t('P3')}
                        </TableCell>
                      }
                      {!allEqual(valuesP4) &&
                        <TableCell>
                          {t('P4')}
                        </TableCell>
                      }
                      {!allEqual(valuesP5) &&
                        <TableCell>
                          {t('P5')}
                        </TableCell>
                      }
                      {!allEqual(valuesP6) &&
                        <TableCell>
                          {t('P6')}
                        </TableCell>
                      }
                    </>
                }
              </TableRow>
            </TableHead>
            :
            <TableHead className={classes.header}>
              <TableRow>
                <TableCell>{t('supplies.suppliesDetails.components.consumption.charts.table.hour')}</TableCell>

                <TableCell>
                  {
                    (isGenerationTab || consumptionsFilters.showR4 === 'S' || consumptionsFilters.showR3 === 'S') && consumptionsFilters.showR2 === 'N' ?
                      t('supplies.suppliesDetails.components.consumption.charts.table.generation')
                      :
                      t('supplies.suppliesDetails.components.consumption.charts.table.consumption')
                  }
                </TableCell>

                <TableCell>{t('Hora a Comparar')}</TableCell>
                <TableCell>{t('Consumo a Comparar')}</TableCell>
              </TableRow>
            </TableHead>
        }

        <TableBody>
          {
            (consumptionsFilters.compare !== 'C') ?
              isAdapted !== 'SI' || energiaReactiva || ((splitAdaptedDate[1] - 1 > labelAux[1] - 1 && labelAux[2] > 2020 && labelAux[2].toString() === splitAdaptedDate[2]) || labelAux[2] < 2021) ?
                labelsQ.map(
                  (hour, index) => {
                    const consumption = consumptions[index]

                    return (
                      <TableRow key={index}>
                        <TableCell className={classes.index}>{hour}:00</TableCell>

                        <TableCell className={classes.valueCell}>
                          <Grid container className={classes.value}>
                            {
                              consumption === 0 ?
                                <img src={NoConsumptionIcon} className={classes.alert} alt='' />
                                :
                                <Grid item>{consumption} {literalKw}</Grid>
                            }

                            {
                              (currentSupplyConsumptions[0] && currentSupplyConsumptions[0].minConsumption && consumption === parseFloat(currentSupplyConsumptions[0].minConsumption.replace('.', ','))) &&
                              <Grid item className={classes.icon}>
                                <img src={MinConsumptionIcon} alt='' />
                              </Grid>
                            }

                            {
                              (currentSupplyConsumptions[0] && currentSupplyConsumptions[0].maxConsumption && consumption === parseFloat(currentSupplyConsumptions[0].maxConsumption.replace('.', ','))) &&
                              <Grid item className={classes.icon}>
                                <img src={MaxConsumptionIcon} alt='' />
                              </Grid>
                            }
                          </Grid>
                        </TableCell>
                      </TableRow>
                    )
                  }
                )
                :
                labelsQ.map(
                  (hour, index) => {
                    const consumption = consumptions[index]

                    return (
                      <TableRow key={index}>
                        <TableCell className={classes.index}>{hour}</TableCell>

                        {tipoUsuario === 'simple' ?
                          <>
                            {
                              !isNaN(valuesPP[index]) &&
                              <TableCell>
                                <Grid container className={classes.value}>
                                  <Grid item className={(Math.min.apply(null, removeElementsWithValue(valuesPP, 0.0000001)) === Math.max.apply(null, valuesPP) || allEqual(valuesPP)) ? `${classes.color}` : valuesPP[index] === Math.min.apply(null, removeElementsWithValue(valuesPP, 0.0000001)) ? `${classes.color} green` : valuesPP[index] === Math.max.apply(null, valuesPP) && `${classes.color} red`}>{valuesPP[index] === 0.0000001 ? 'N/A' : (valuesPP[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                </Grid>
                              </TableCell>
                            }

                            {
                              !isNaN(valuesPL[index]) &&
                              <TableCell>
                                <Grid container className={classes.value}>
                                  <Grid item className={(Math.min.apply(null, removeElementsWithValue(valuesPL, 0.0000001)) === Math.max.apply(null, valuesPL) || allEqual(valuesPL)) ? `${classes.color}` : valuesPL[index] === Math.min.apply(null, removeElementsWithValue(valuesPL, 0.0000001)) ? `${classes.color} green` : valuesPL[index] === Math.max.apply(null, valuesPL) && `${classes.color} red`}>{valuesPL[index] === 0.0000001 ? 'N/A' : (valuesPL[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                </Grid>
                              </TableCell>
                            }
                            {
                              !isNaN(valuesPV[index]) &&
                              <TableCell>
                                <Grid container className={classes.value}>
                                  <Grid item className={(Math.min.apply(null, removeElementsWithValue(valuesPV, 0.0000001)) === Math.max.apply(null, valuesPV) || allEqual(valuesPV)) ? `${classes.color}` : valuesPV[index] === Math.min.apply(null, removeElementsWithValue(valuesPV, 0.0000001)) ? `${classes.color} green` : valuesPV[index] === Math.max.apply(null, valuesPV) && `${classes.color} red`}>{valuesPV[index] === 0.0000001 ? 'N/A' : (valuesPV[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                </Grid>
                              </TableCell>
                            }

                          </>
                          :
                          <>
                            {!allEqual(valuesP1) && !isNaN(valuesP1[index]) &&
                              <TableCell>
                                <Grid container className={classes.value}>
                                  <Grid item className={Math.min.apply(null, removeElementsWithValue(valuesP1, 0.0000001)) === Math.max.apply(null, valuesP1) ? `${classes.color}` : valuesP1[index] === Math.min.apply(null, removeElementsWithValue(valuesP1, 0.0000001)) ? `${classes.color} green` : valuesP1[index] === Math.max.apply(null, valuesP1) && `${classes.color} red`}>{valuesP1[index] === 0.0000001 ? 'N/A' : (valuesP1[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                </Grid>
                              </TableCell>
                            }
                            {!allEqual(valuesP2) && !isNaN(valuesP2[index]) &&
                              <TableCell>
                                <Grid container className={classes.value}>
                                  <Grid item className={Math.min.apply(null, removeElementsWithValue(valuesP2, 0.0000001)) === Math.max.apply(null, valuesP2) ? `${classes.color}` : valuesP2[index] === Math.min.apply(null, removeElementsWithValue(valuesP2, 0.0000001)) ? `${classes.color} green` : valuesP2[index] === Math.max.apply(null, valuesP2) && `${classes.color} red`}>{valuesP2[index] === 0.0000001 ? 'N/A' : (valuesP2[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                </Grid>
                              </TableCell>
                            }
                            {!allEqual(valuesP3) && !isNaN(valuesP3[index]) &&
                              <TableCell>
                                <Grid container className={classes.value}>
                                  <Grid item className={Math.min.apply(null, removeElementsWithValue(valuesP3, 0.0000001)) === Math.max.apply(null, valuesP3) ? `${classes.color}` : valuesP3[index] === Math.min.apply(null, removeElementsWithValue(valuesP3, 0.0000001)) ? `${classes.color} green` : valuesP3[index] === Math.max.apply(null, valuesP3) && `${classes.color} red`}>{valuesP3[index] === 0.0000001 ? 'N/A' : (valuesP3[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                </Grid>
                              </TableCell>
                            }
                            {!allEqual(valuesP4) && !isNaN(valuesP4[index]) &&
                              <TableCell>
                                <Grid container className={classes.value}>
                                  <Grid item className={Math.min.apply(null, removeElementsWithValue(valuesP4, 0.0000001)) === Math.max.apply(null, valuesP4) ? `${classes.color}` : valuesP4[index] === Math.min.apply(null, removeElementsWithValue(valuesP4, 0.0000001)) ? `${classes.color} green` : valuesP4[index] === Math.max.apply(null, valuesP4) && `${classes.color} red`}>{valuesP4[index] === 0.0000001 ? 'N/A' : (valuesP4[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                </Grid>
                              </TableCell>
                            }
                            {!allEqual(valuesP5) && !isNaN(valuesP5[index]) &&
                              <TableCell>
                                <Grid container className={classes.value}>
                                  <Grid item className={Math.min.apply(null, removeElementsWithValue(valuesP5, 0.0000001)) === Math.max.apply(null, valuesP5) ? `${classes.color}` : valuesP5[index] === Math.min.apply(null, removeElementsWithValue(valuesP5, 0.0000001)) ? `${classes.color} green` : valuesP5[index] === Math.max.apply(null, valuesP5) && `${classes.color} red`}>{valuesP5[index] === 0.0000001 ? 'N/A' : (valuesP5[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                </Grid>
                              </TableCell>
                            }
                            {!allEqual(valuesP6) && !isNaN(valuesP6[index]) &&
                              <TableCell>
                                <Grid container className={classes.value}>
                                  <Grid item className={Math.min.apply(null, removeElementsWithValue(valuesP6, 0.0000001)) === Math.max.apply(null, valuesP6) ? `${classes.color}` : valuesP6[index] === Math.min.apply(null, removeElementsWithValue(valuesP6, 0.0000001)) ? `${classes.color} green` : valuesP6[index] === Math.max.apply(null, valuesP6) && `${classes.color} red`}>{valuesP6[index] === 0.0000001 ? 'N/A' : (valuesP6[index].toFixed(2).replace('.', ',') + ' ' + literalKw)}</Grid>
                                </Grid>
                              </TableCell>
                            }
                          </>
                        }
                      </TableRow>
                    )
                  }
                )
              :
              labelsQ.map(
                (hour, index) => {
                  const hourMostrar = hours[index]
                  const consumption = consumptions[index]
                  const consumption2 = consumptions2[index]
                  const lengHour = hours.length - 1
                  const lengHourCompare = hoursCompare.length - 1

                  return (
                    <TableRow key={index}>
                      <TableCell className={classes.index}>
                        {
                          (index <= lengHour) ?
                            (consumption !== 0) ?
                              <span>{hourMostrar}</span>
                              :
                              []
                            :
                            []
                        }
                      </TableCell>

                      <TableCell className={classes.valueCell}>
                        <Grid container className={classes.value}>
                          {
                            (index <= lengHour) ?
                              consumption === 0 ?
                                <img src={NoConsumptionIcon} className={classes.alert} alt='' />
                                :
                                <Grid item>{consumption} {literalKw}</Grid>
                              :
                              []
                          }
                        </Grid>
                      </TableCell>

                      <TableCell className={classes.index}>
                        {
                          (index <= lengHour) ?
                            (consumption2 !== 0) ?
                              <span>{hourMostrar}</span>
                              :
                              []
                            :
                            []
                        }
                      </TableCell>

                      <TableCell className={classes.valueCell}>
                        <Grid container className={classes.value}>
                          {
                            (index <= lengHourCompare) ?
                              consumption2 === 0 ?
                                <img src={NoConsumptionIcon} className={classes.alert} alt='' />
                                :
                                <Grid item>{consumption2} {literalKw}</Grid>
                              :
                              []
                          }
                        </Grid>
                      </TableCell>
                    </TableRow>
                  )
                }
              )
          }
        </TableBody>
      </MUiTable>
    )
  }

  return (
    <>
      <Grid container item className={classes.container} md={12}>
        {
          consumptionsFilters.granularity === 'M' &&
          monthsView()
        }

        {
          consumptionsFilters.granularity === 'D' &&
          daysView()
        }

        {
          consumptionsFilters.granularity === 'S' &&
          daysView()
        }

        {
          consumptionsFilters.granularity === 'H' &&
          hoursView()
        }

        {
          consumptionsFilters.granularity === 'Q' &&
          quarterHoursView()
        }
      </Grid>
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

export default Table
