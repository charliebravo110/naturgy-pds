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
  formatMonth
} from '../../../../../../common/lib/FormatLib'
import DynamicLegend from '../dynamicLegend/DynamicLegend'

import EnergySeaBlueIcon from '../../../../../../assets/icons/energy_sea_blue.svg'
import EnergyGreenIcon from '../../../../../../assets/icons/energy_green.svg'
import EnergyBlueIcon from '../../../../../../assets/icons/energy_blue.svg'
import EnergyOrangeIcon from '../../../../../../assets/icons/energy_orange.svg'
import EnergyDarkBlueIcon from '../../../../../../assets/icons/energy_dark_blue.svg'
import EnergyPurpleIcon from '../../../../../../assets/icons/energy_purple.svg'
import EnergyGarnetIcon from '../../../../../../assets/icons/energy_garnet.svg'

import useStyles from './EnergyTable.styles'

const Table = (props: any) => {
  const classes = useStyles({})
  let literalKw


  const {
    currentSupplyConsumptions,
    currentCompareConsumptions,
    consumptionsFilters,
    energiaReactiva,
    autoConsumption,
    mode
  } = props

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

  let valuesEHCR = []
  let valuesEHAC = []
  let valuesEHCCA = []
  let valuesEHEX = []
  let valuesEHNG = []
  let valuesEHCSA = []
  let valuesEHCRi = []
  let valuesEHACi = []
  let valuesEHCi = []
  let valuesEHEXi = []
  let valuesEHNGi = []
  let valuesEHEXG = []
  let valuesEHCRCompare = []
  let valuesEHACCompare = []
  let valuesEHCCACompare = []
  let valuesEHEXCompare = []
  let valuesEHNGCompare = []
  let valuesEHCSACompare = []
  let valuesEHCRiCompare = []
  let valuesEHACiCompare = []
  let valuesEHCiCompare = []
  let valuesEHEXiCompare = []
  let valuesEHNGiCompare = []
  let valuesEHEXGCompare = []


  if (energiaReactiva) {
    literalKw = 'kVArh'
  } else {
    literalKw = 'kWh'
  }

  let months = [] as any
  let labels = [] as any
  let labelsCompare = [] as any
  let month = ''
  let monthCompare = ''
  let dayCounter = 1

  //utilizamos estas variables para guardar máximos y mínimos ya que el array final puede contener posiciones sin valores o valores negativos (no hay datos)
  let maxEHCR = 0
  let minEHCR = 100000000
  let maxEHAC = 0
  let maxEHCCA = 0
  let maxEHEX = 0
  let maxEHNG = 0
  let maxEHCSA = 0
  let maxEHCRi = 0
  let maxEHACi = 0
  let maxEHCi = 0
  let maxEHEXi = 0
  let maxEHNGi = 0
  let maxEHEXG = 0
  let maxEHCRCompare = 0
  let maxEHACCompare = 0
  let maxEHCCACompare = 0
  let maxEHEXCompare = 0
  let maxEHNGCompare = 0
  let maxEHCSACompare = 0
  let maxEHCRiCompare = 0
  let maxEHACiCompare = 0
  let maxEHCiCompare = 0
  let maxEHEXiCompare = 0
  let maxEHNGiCompare = 0
  let maxEHEXGCompare = 0
  let minEHAC = 100000000
  let minEHCCA = 100000000
  let minEHEX = 100000000
  let minEHNG = 100000000
  let minEHCSA = 100000000
  let minEHCRi = 100000000
  let minEHACi = 100000000
  let minEHCi = 100000000
  let minEHEXi = 100000000
  let minEHNGi = 100000000
  let minEHEXG = 100000000
  let minEHCRCompare = 100000000
  let minEHACCompare = 100000000
  let minEHCCACompare = 100000000
  let minEHEXCompare = 100000000
  let minEHNGCompare = 100000000
  let minEHCSACompare = 100000000
  let minEHCRiCompare = 100000000
  let minEHACiCompare = 100000000
  let minEHCiCompare = 100000000
  let minEHEXiCompare = 100000000
  let minEHNGiCompare = 100000000
  let minEHEXGCompare = 100000000

  if (consumptionsFilters.granularity === 'S') {
    //labels = [t('supplies.suppliesDetails.components.consumption.charts.week.lunes'), t('supplies.suppliesDetails.components.consumption.charts.week.martes'), t('supplies.suppliesDetails.components.consumption.charts.week.miercoles'), t('supplies.suppliesDetails.components.consumption.charts.week.jueves'), t('supplies.suppliesDetails.components.consumption.charts.week.viernes'), t('supplies.suppliesDetails.components.consumption.charts.week.sabado'), t('supplies.suppliesDetails.components.consumption.charts.week.domingo')]
    //labelsCompare = [t('supplies.suppliesDetails.components.consumption.charts.week.lunes'), t('supplies.suppliesDetails.components.consumption.charts.week.martes'), t('supplies.suppliesDetails.components.consumption.charts.week.miercoles'), t('supplies.suppliesDetails.components.consumption.charts.week.jueves'), t('supplies.suppliesDetails.components.consumption.charts.week.viernes'), t('supplies.suppliesDetails.components.consumption.charts.week.sabado'), t('supplies.suppliesDetails.components.consumption.charts.week.domingo')]
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
    valuesEHCRiCompare = ['', '', '', '', '', '', '']
    valuesEHACiCompare = ['', '', '', '', '', '', '']
    valuesEHCiCompare = ['', '', '', '', '', '', '']
    valuesEHEXiCompare = ['', '', '', '', '', '', '']
    valuesEHNGiCompare = ['', '', '', '', '', '', '']
    valuesEHEXGCompare = ['', '', '', '', '', '', '']
    valuesEHCRCompare = ['', '', '', '', '', '', '']
    valuesEHACCompare = ['', '', '', '', '', '', '']
    valuesEHCCACompare = ['', '', '', '', '', '', '']
    valuesEHEXCompare = ['', '', '', '', '', '', '']
    valuesEHNGCompare = ['', '', '', '', '', '', '']
    valuesEHCSACompare = ['', '', '', '', '', '', '']
  }

  //función encargada de guardar los valores
  const insertValues = (value: any, values: any, labelAux: any) => {
    if (consumptionsFilters.granularity === 'S') {
      value && values.splice(labelAux, 1, parseFloat(value.replace(',', '.')).toFixed(2).replace('.', ','))
    } else {
      values.push(parseFloat(value.replace(',', '.')).toFixed(2).replace('.', ','))
    }
  }

  //con esta función calculamos máximos y minimos
  /*const calculateMaxMin = (value: any, max: any, min: any) => {
    if (parseFloat(value.replace(',', '.')) > max) {
      max = parseFloat(value.replace(',', '.'))
    } 
    if (parseFloat(value.replace(',', '.')) < min) {
      min = parseFloat(value.replace(',', '.'))
    }
  }*/

  const mapConsumptions = (consumptions: any) => {

    //Set a vacío para borrar los valores del test tipo individual
    valuesEHCR = []
    valuesEHAC = []
    valuesEHCCA = []
    valuesEHEX = []
    valuesEHNG = []
    valuesEHCSA = []

    //Set a vacío para borrar los valores del test tipo colectivo
    valuesEHCRi = []
    valuesEHACi = []
    valuesEHCi = []
    valuesEHEXi = []
    valuesEHNGi = []
    valuesEHCSA = []
    valuesEHEXG = []

    consumptions.map(
      (item, index) => {


        if (item.EHCR) {
          insertValues(item.EHCR, valuesEHCR, index)
          //TODO ver como externalizar esta funcionalidad repetitiva
          if (parseFloat(item.EHCR.replace(',', '.')) > maxEHCR) {
            maxEHCR = parseFloat(item.EHCR.replace(',', '.'))
          } 
          if (parseFloat(item.EHCR.replace(',', '.')) < minEHCR) {
            minEHCR = parseFloat(item.EHCR.replace(',', '.'))
          }
          if (!containValue.EHCR) {
            setContainValue({
              ...containValue,
              EHCR: true
            })
          }
        } else {
          valuesEHCR.push('N/A')
        }

        if (item.EHAC) {
          insertValues(item.EHAC, valuesEHAC, index)
          if (parseFloat(item.EHAC.replace(',', '.')) > maxEHAC) {
            maxEHAC = parseFloat(item.EHAC.replace(',', '.'))
          } 
          if (parseFloat(item.EHAC.replace(',', '.')) < minEHAC) {
            minEHAC = parseFloat(item.EHAC.replace(',', '.'))
          }
          if (!containValue.EHAC) {
            setContainValue({
              ...containValue,
              EHAC: true
            })
          }
        } else {
          valuesEHAC.push('N/A')
        }

        if (item.EHCCA) {
          insertValues(item.EHCCA, valuesEHCCA, index)
          if (parseFloat(item.EHCCA.replace(',', '.')) > maxEHCCA) {
            maxEHCCA = parseFloat(item.EHCCA.replace(',', '.'))
          } 
          if (parseFloat(item.EHCCA.replace(',', '.')) < minEHCCA) {
            minEHCCA = parseFloat(item.EHCCA.replace(',', '.'))
          }
          if (!containValue.EHCCA) {
            setContainValue({
              ...containValue,
              EHCCA: true
            })
          }
        } else {
          valuesEHCCA.push('N/A')
        }

        if (item.EHEX) {
          insertValues(item.EHEX, valuesEHEX, index)
          if (parseFloat(item.EHEX.replace(',', '.')) > maxEHEX) {
            maxEHEX = parseFloat(item.EHEX.replace(',', '.'))
          } 
          if (parseFloat(item.EHEX.replace(',', '.')) < minEHEX) {
            minEHEX = parseFloat(item.EHEX.replace(',', '.'))
          }
          if (!containValue.EHEX) {
            setContainValue({
              ...containValue,
              EHEX: true
            })
          }
        } else {
          valuesEHEX.push('N/A')
        }

        if (item.EHNG) {
          insertValues(item.EHNG, valuesEHNG, index)
          if (parseFloat(item.EHNG.replace(',', '.')) > maxEHNG) {
            maxEHNG = parseFloat(item.EHNG.replace(',', '.'))
          } 
          if (parseFloat(item.EHNG.replace(',', '.')) < minEHNG) {
            minEHNG = parseFloat(item.EHNG.replace(',', '.'))
          }
          if (!containValue.EHNG) {
            setContainValue({
              ...containValue,
              EHNG: true
            })
          }
        } else {
          valuesEHNG.push('N/A')
        }

        if (item.EHCSA) {
          insertValues(item.EHCSA, valuesEHCSA, index)
          if (parseFloat(item.EHCSA.replace(',', '.')) > maxEHCSA) {
            maxEHCSA = parseFloat(item.EHCSA.replace(',', '.'))
          } 
          if (parseFloat(item.EHCSA.replace(',', '.')) < minEHCSA) {
            minEHCSA = parseFloat(item.EHCSA.replace(',', '.'))
          }
          if (!containValue.EHCSA) {
            setContainValue({
              ...containValue,
              EHCSA: true
            })
          }
        } else {
          valuesEHCSA.push('N/A')
        }

        if (item.EHCRi) {
          insertValues(item.EHCRi, valuesEHCRi, index)
          if (parseFloat(item.EHCRi.replace(',', '.')) > maxEHCRi) {
            maxEHCRi = parseFloat(item.EHCRi.replace(',', '.'))
          } 
          if (parseFloat(item.EHCRi.replace(',', '.')) < minEHCRi) {
            minEHCRi = parseFloat(item.EHCRi.replace(',', '.'))
          }
          if (!containValue.EHCRi) {
            setContainValue({
              ...containValue,
              EHCRi: true
            })
          }
        } else {
          valuesEHCRi.push('N/A')
        }

        if (item.EHACi) {
          insertValues(item.EHACi, valuesEHACi, index)
          if (parseFloat(item.EHACi.replace(',', '.')) > maxEHACi) {
            maxEHACi = parseFloat(item.EHACi.replace(',', '.'))
          } 
          if (parseFloat(item.EHACi.replace(',', '.')) < minEHACi) {
            minEHACi = parseFloat(item.EHACi.replace(',', '.'))
          }
          if (!containValue.EHACi) {
            setContainValue({
              ...containValue,
              EHACi: true
            })
          }
        } else {
          valuesEHACi.push('N/A')
        }

        if (item.EHCi) {
          insertValues(item.EHCi, valuesEHCi, index)
          if (parseFloat(item.EHCi.replace(',', '.')) > maxEHCi) {
            maxEHCi = parseFloat(item.EHCi.replace(',', '.'))
          } 
          if (parseFloat(item.EHCi.replace(',', '.')) < minEHCi) {
            minEHCi = parseFloat(item.EHCi.replace(',', '.'))
          }
          if (!containValue.EHCi) {
            setContainValue({
              ...containValue,
              EHCi: true
            })
          }
        } else {
          valuesEHCi.push('N/A')
        }

        if (item.EHEXi) {
          insertValues(item.EHEXi, valuesEHEXi, index)
          if (parseFloat(item.EHEXi.replace(',', '.')) > maxEHEXi) {
            maxEHEXi = parseFloat(item.EHEXi.replace(',', '.'))
          } 
          if (parseFloat(item.EHEXi.replace(',', '.')) < minEHEXi) {
            minEHEXi = parseFloat(item.EHEXi.replace(',', '.'))
          }
          if (!containValue.EHEXi) {
            setContainValue({
              ...containValue,
              EHEXi: true
            })
          }
        } else {
          valuesEHEXi.push('N/A')
        }

        if (item.EHNGi) {
          insertValues(item.EHNGi, valuesEHNGi, index)
          if (parseFloat(item.EHNGi.replace(',', '.')) > maxEHNGi) {
            maxEHNGi = parseFloat(item.EHNGi.replace(',', '.'))
          } 
          if (parseFloat(item.EHNGi.replace(',', '.')) < minEHNGi) {
            minEHNGi = parseFloat(item.EHNGi.replace(',', '.'))
          }
          if (!containValue.EHNGi) {
            setContainValue({
              ...containValue,
              EHNGi: true
            })
          }
        } else {
          valuesEHNGi.push('N/A')
        }

        if (item.EHEXG) {
          insertValues(item.EHEXG, valuesEHEXG, index)
          if (parseFloat(item.EHEXG.replace(',', '.')) > maxEHEXG) {
            maxEHEXG = parseFloat(item.EHEXG.replace(',', '.'))
          } 
          if (parseFloat(item.EHEXG.replace(',', '.')) < minEHEXG) {
            minEHEXG = parseFloat(item.EHEXG.replace(',', '.'))
          }
          if (!containValue.EHEXG) {
            setContainValue({
              ...containValue,
              EHEXG: true
            })
          }
        } else {
          valuesEHEXG.push('N/A')
        }

        //Para periodo
        if (consumptionsFilters.granularity === 'M') {
          labels.push(formatMonthAndYear(item.date))
        } else if (consumptionsFilters.granularity === 'D') {
          labels.push(dayCounter)
          dayCounter++

          if (month === '') {
            let aux = consumptionsFilters.startDate.split('/')
            month = formatMonth(aux[1])
          }
        } else if (consumptionsFilters.granularity === 'H') {
          labels.push(item.hour)
        } else if (consumptionsFilters.granularity === 'S') {
          labels.push(item.date)
        }
      }
    )

    if (currentCompareConsumptions && !currentCompareConsumptions.consumptions && currentCompareConsumptions.length !== 0) {

      let dayCounter = 1

      currentCompareConsumptions.map(
        (item, index) => {


          if (item.EHCR) {
            insertValues(item.EHCR, valuesEHCRCompare, index)
            if (parseFloat(item.EHCR.replace(',', '.')) > maxEHCRCompare) {
              maxEHCRCompare = parseFloat(item.EHCR.replace(',', '.'))
            } 
            if (parseFloat(item.EHCR.replace(',', '.')) < minEHCRCompare) {
              minEHCRCompare = parseFloat(item.EHCR.replace(',', '.'))
            }
            if (!containValue.EHCR) {
              setContainValue({
                ...containValue,
                EHCR: true
              })
            }
          } else {
            valuesEHCRCompare.push('N/A')
          }

          if (item.EHAC) {
            insertValues(item.EHAC, valuesEHACCompare, index)
            if (parseFloat(item.EHAC.replace(',', '.')) > maxEHACCompare) {
              maxEHACCompare = parseFloat(item.EHAC.replace(',', '.'))
            } 
            if (parseFloat(item.EHAC.replace(',', '.')) < minEHACCompare) {
              minEHACCompare = parseFloat(item.EHAC.replace(',', '.'))
            }
            if (!containValue.EHAC) {
              setContainValue({
                ...containValue,
                EHAC: true
              })
            }
          } else {
            valuesEHACCompare.push('N/A')
          }

          if (item.EHCCA) {
            insertValues(item.EHCCA, valuesEHCCACompare, index)
            if (parseFloat(item.EHCCA.replace(',', '.')) > maxEHCCACompare) {
              maxEHCCACompare = parseFloat(item.EHCCA.replace(',', '.'))
            } 
            if (parseFloat(item.EHCCA.replace(',', '.')) < minEHCCACompare) {
              minEHCCACompare = parseFloat(item.EHCCA.replace(',', '.'))
            }
            if (!containValue.EHCCA) {
              setContainValue({
                ...containValue,
                EHCCA: true
              })
            }
          } else {
            valuesEHCCACompare.push('N/A')
          }

          if (item.EHEX) {
            insertValues(item.EHEX, valuesEHEXCompare, index)
            if (parseFloat(item.EHEX.replace(',', '.')) > maxEHEXCompare) {
              maxEHEXCompare = parseFloat(item.EHEX.replace(',', '.'))
            } 
            if (parseFloat(item.EHEX.replace(',', '.')) < minEHEXCompare) {
              minEHEXCompare = parseFloat(item.EHEX.replace(',', '.'))
            }
            if (!containValue.EHEX) {
              setContainValue({
                ...containValue,
                EHEX: true
              })
            }
          } else {
            valuesEHEXCompare.push('N/A')
          }

          if (item.EHNG) {
            insertValues(item.EHNG, valuesEHNGCompare, index)
            if (parseFloat(item.EHNG.replace(',', '.')) > maxEHNGCompare) {
              maxEHNGCompare = parseFloat(item.EHNG.replace(',', '.'))
            } 
            if (parseFloat(item.EHNG.replace(',', '.')) < minEHNGCompare) {
              minEHNGCompare = parseFloat(item.EHNG.replace(',', '.'))
            }
            if (!containValue.EHNG) {
              setContainValue({
                ...containValue,
                EHNG: true
              })
            }
          } else {
            valuesEHNGCompare.push('N/A')
          }

          if (item.EHCSA) {
            insertValues(item.EHCSA, valuesEHCSACompare, index)
            if (parseFloat(item.EHCSA.replace(',', '.')) > maxEHCSACompare) {
              maxEHCSACompare = parseFloat(item.EHCSA.replace(',', '.'))
            } 
            if (parseFloat(item.EHCSA.replace(',', '.')) < minEHCSACompare) {
              minEHCSACompare = parseFloat(item.EHCSA.replace(',', '.'))
            }
            if (!containValue.EHCSA) {
              setContainValue({
                ...containValue,
                EHCSA: true
              })
            }
          } else {
            valuesEHCSACompare.push('N/A')
          }

          if (item.EHCRi) {
            insertValues(item.EHCRi, valuesEHCRiCompare, index)
            if (parseFloat(item.EHCRi.replace(',', '.')) > maxEHCRiCompare) {
              maxEHCRiCompare = parseFloat(item.EHCRi.replace(',', '.'))
            } 
            if (parseFloat(item.EHCRi.replace(',', '.')) < minEHCRiCompare) {
              minEHCRiCompare = parseFloat(item.EHCRi.replace(',', '.'))
            }
            if (!containValue.EHCRi) {
              setContainValue({
                ...containValue,
                EHCRi: true
              })
            }
          } else {
            valuesEHCRiCompare.push('N/A')
          }

          if (item.EHACi) {
            insertValues(item.EHACi, valuesEHACiCompare, index)
            if (parseFloat(item.EHACi.replace(',', '.')) > maxEHACiCompare) {
              maxEHACiCompare = parseFloat(item.EHACi.replace(',', '.'))
            } 
            if (parseFloat(item.EHACi.replace(',', '.')) < minEHACiCompare) {
              minEHACiCompare = parseFloat(item.EHACi.replace(',', '.'))
            }
            if (!containValue.EHACi) {
              setContainValue({
                ...containValue,
                EHACi: true
              })
            }
          } else {
            valuesEHACiCompare.push('N/A')
          }

          if (item.EHCi) {
            insertValues(item.EHCi, valuesEHCiCompare, index)
            if (parseFloat(item.EHCi.replace(',', '.')) > maxEHCiCompare) {
              maxEHCiCompare = parseFloat(item.EHCi.replace(',', '.'))
            } 
            if (parseFloat(item.EHCi.replace(',', '.')) < minEHCiCompare) {
              minEHCiCompare = parseFloat(item.EHCi.replace(',', '.'))
            }
            if (!containValue.EHCi) {
              setContainValue({
                ...containValue,
                EHCi: true
              })
            }
          } else {
            valuesEHCiCompare.push('N/A')
          }

          if (item.EHEXi) {
            insertValues(item.EHEXi, valuesEHEXiCompare, index)
            if (parseFloat(item.EHEXi.replace(',', '.')) > maxEHEXiCompare) {
              maxEHEXiCompare = parseFloat(item.EHEXi.replace(',', '.'))
            } 
            if (parseFloat(item.EHEXi.replace(',', '.')) < minEHEXiCompare) {
              minEHEXiCompare = parseFloat(item.EHEXi.replace(',', '.'))
            }
            if (!containValue.EHEXi) {
              setContainValue({
                ...containValue,
                EHEXi: true
              })
            }
          } else {
            valuesEHEXiCompare.push('N/A')
          }

          if (item.EHNGi) {
            insertValues(item.EHNGi, valuesEHNGiCompare, index)
            if (parseFloat(item.EHNGi.replace(',', '.')) > maxEHNGiCompare) {
              maxEHNGiCompare = parseFloat(item.EHNGi.replace(',', '.'))
            } 
            if (parseFloat(item.EHNGi.replace(',', '.')) < minEHNGiCompare) {
              minEHNGiCompare = parseFloat(item.EHNGi.replace(',', '.'))
            }
            if (!containValue.EHNGi) {
              setContainValue({
                ...containValue,
                EHNGi: true
              })
            }
          } else {
            valuesEHNGiCompare.push('N/A')
          }

          if (item.EHEXG) {
            insertValues(item.EHEXG, valuesEHEXGCompare, index)
            if (parseFloat(item.EHEXG.replace(',', '.')) > maxEHEXGCompare) {
              maxEHEXGCompare = parseFloat(item.EHEXG.replace(',', '.'))
            } 
            if (parseFloat(item.EHEXG.replace(',', '.')) < minEHEXGCompare) {
              minEHEXGCompare = parseFloat(item.EHEXG.replace(',', '.'))
            }
            if (!containValue.EHEXG) {
              setContainValue({
                ...containValue,
                EHEXG: true
              })
            }
          } else {
            valuesEHEXGCompare.push('N/A')
          }

          //Para periodo
          if (consumptionsFilters.granularity === 'M') {
            labelsCompare.push(formatMonthAndYear(item.date))
          } else if (consumptionsFilters.granularity === 'D') {
            labelsCompare.push(dayCounter)
            dayCounter++

            if (monthCompare === '') {
              let aux = consumptionsFilters.startDateCompare.split('/')
              monthCompare = formatMonth(aux[1])
            }
          } else if (consumptionsFilters.granularity === 'H') {
            labelsCompare.push(item.hour)
          } else if (consumptionsFilters.granularity === 'S') {
            labelsCompare.push(item.date)
          }
        }
      )
    }
  }


  const view = () => {
    if (autoConsumption && currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length > 0) {
      mapConsumptions(currentSupplyConsumptions)
    }

    let finalLabels
    if (labels.length < labelsCompare.length) {
      finalLabels = labelsCompare
    } else {
      finalLabels = labels
    }

    

    return (
      <>
        <MUiTable className={classes.table}>
          <TableHead className={classes.headerAutoConsumption}>
            <TableRow>
              <TableCell align='center' className={classes.headerCell}>
                {consumptionsFilters.granularity === 'D' && 'Días'}
                {consumptionsFilters.granularity === 'M' && 'Mes'}
                {consumptionsFilters.granularity === 'S' && 'Días'}
                {consumptionsFilters.granularity === 'H' && 'Hora'}

              </TableCell>
              {containValue.EHCR && state.checkedEHCR &&
                <TableCell align='center' className={classes.simpleCell}><img src={EnergySeaBlueIcon} alt='' />{' EHCR (kWh)'}</TableCell>
              }
              {containValue.EHAC && state.checkedEHAC &&
                <TableCell align='center' className={classes.simpleCell}><img src={EnergyGreenIcon} alt='' />{' EHAC (kWh)'}</TableCell>
              }
              {containValue.EHCCA && state.checkedEHCCA &&
                <TableCell align='center' className={classes.simpleCell}><img src={EnergyBlueIcon} alt='' />{' EHCCA (kWh)'}</TableCell>
              }
              {containValue.EHEX && state.checkedEHEX &&
                <TableCell align='center' className={classes.simpleCell}><img src={EnergyOrangeIcon} alt='' />{' EHEX (kWh)'}</TableCell>
              }
              {containValue.EHNG && state.checkedEHNG &&
                <TableCell align='center' className={classes.simpleCell}><img src={EnergyDarkBlueIcon} alt='' />{' EHNG (kWh)'}</TableCell>
              }
              {containValue.EHCSA && state.checkedEHCSA &&
                <TableCell align='center' className={classes.simpleCell}><img src={EnergyPurpleIcon} alt='' />{' EHCSA (kWh)'}</TableCell>
              }
              {containValue.EHCRi && state.checkedEHCRi &&
                <TableCell align='center' className={classes.simpleCell}><img src={EnergySeaBlueIcon} alt='' />{' EHCRi (kWh)'}</TableCell>
              }
              {containValue.EHACi && state.checkedEHACi &&
                <TableCell align='center' className={classes.simpleCell}><img src={EnergyGreenIcon} alt='' />{' EHACi (kWh)'}</TableCell>
              }
              {containValue.EHCi && state.checkedEHCi &&
                <TableCell align='center' className={classes.simpleCell}><img src={EnergyBlueIcon} alt='' />{' EHCi (kWh)'}</TableCell>
              }
              {containValue.EHEXi && state.checkedEHEXi &&
                <TableCell align='center' className={classes.simpleCell}><img src={EnergyOrangeIcon} alt='' />{' EHEXi (kWh)'}</TableCell>
              }
              {containValue.EHNGi && state.checkedEHNGi &&
                <TableCell align='center' className={classes.simpleCell}><img src={EnergyGarnetIcon} alt='' />{' EHNGi (kWh)'}</TableCell>
              }
              {containValue.EHEXG && state.checkedEHEXG &&
                <TableCell align='center' className={classes.simpleCell}><img src={EnergyDarkBlueIcon} alt='' />{' EHEXG (kWh)'}</TableCell>
              }

              {
                consumptionsFilters.compare === 'C' &&
                <>
                  <TableCell align='center' className={classes.headerCell}>
                    {consumptionsFilters.granularity === 'D' && 'Días'}
                    {consumptionsFilters.granularity === 'M' && 'Mes'}
                    {consumptionsFilters.granularity === 'S' && 'Días'}
                    {consumptionsFilters.granularity === 'H' && 'Hora'}

                  </TableCell>
                  {containValue.EHCR && state.checkedEHCR &&
                    <TableCell align='center' className={classes.simpleCell}><img src={EnergySeaBlueIcon} alt='' />{' EHCR (kWh)'}</TableCell>
                  }
                  {containValue.EHAC && state.checkedEHAC &&
                    <TableCell align='center' className={classes.simpleCell}><img src={EnergyGreenIcon} alt='' />{' EHAC (kWh)'}</TableCell>
                  }
                  {containValue.EHCCA && state.checkedEHCCA &&
                    <TableCell align='center' className={classes.simpleCell}><img src={EnergyBlueIcon} alt='' />{' EHCCA (kWh)'}</TableCell>
                  }
                  {containValue.EHEX && state.checkedEHEX &&
                    <TableCell align='center' className={classes.simpleCell}><img src={EnergyOrangeIcon} alt='' />{' EHEX (kWh)'}</TableCell>
                  }
                  {containValue.EHNG && state.checkedEHNG &&
                    <TableCell align='center' className={classes.simpleCell}><img src={EnergyDarkBlueIcon} alt='' />{' EHNG (kWh)'}</TableCell>
                  }
                  {containValue.EHCSA && state.checkedEHCSA &&
                    <TableCell align='center' className={classes.simpleCell}><img src={EnergyPurpleIcon} alt='' />{' EHCSA (kWh)'}</TableCell>
                  }
                  {containValue.EHCRi && state.checkedEHCRi &&
                    <TableCell align='center' className={classes.simpleCell}><img src={EnergySeaBlueIcon} alt='' />{' EHCRi (kWh)'}</TableCell>
                  }
                  {containValue.EHACi && state.checkedEHACi &&
                    <TableCell align='center' className={classes.simpleCell}><img src={EnergyGreenIcon} alt='' />{' EHACi (kWh)'}</TableCell>
                  }
                  {containValue.EHCi && state.checkedEHCi &&
                    <TableCell align='center' className={classes.simpleCell}><img src={EnergyBlueIcon} alt='' />{' EHCi (kWh)'}</TableCell>
                  }
                  {containValue.EHEXi && state.checkedEHEXi &&
                    <TableCell align='center' className={classes.simpleCell}><img src={EnergyOrangeIcon} alt='' />{' EHEXi (kWh)'}</TableCell>
                  }
                  {containValue.EHNGi && state.checkedEHNGi &&
                    <TableCell align='center' className={classes.simpleCell}><img src={EnergyGarnetIcon} alt='' />{' EHNGi (kWh)'}</TableCell>
                  }
                  {containValue.EHEXG && state.checkedEHEXG &&
                    <TableCell align='center' className={classes.simpleCell}><img src={EnergyDarkBlueIcon} alt='' />{' EHEXG (kWh)'}</TableCell>
                  }
                </>
              }

            </TableRow>
          </TableHead>
          <TableBody className={classes.bodyAutoConsumption}>
            {
              finalLabels.map(
                (item, index) => {

                  return (
                    <TableRow key={index}>
                      <TableCell>
                        {consumptionsFilters.granularity === 'D' && labels[index] && labels[index] + ' ' + month}
                        {consumptionsFilters.granularity === 'M' && labels[index] && labels[index]}
                        {consumptionsFilters.granularity === 'H' && labels[index] && labels[index] + ':00'}
                        {consumptionsFilters.granularity === 'S' && labels[index] && labels[index]}
                      </TableCell>

                      {containValue.EHCR && state.checkedEHCR &&
                        <TableCell className={valuesEHCR[index] === maxEHCR.toFixed(2).replace('.', ',') ? `${classes.cellEHCR} max` : valuesEHCR[index] === minEHCR.toFixed(2).replace('.', ',') ? `${classes.cellEHCR} min` : classes.cellEHCR}>
                          {valuesEHCR[index] && valuesEHCR[index]}
                        </TableCell>
                      }
                      {containValue.EHAC && state.checkedEHAC &&
                        <TableCell className={valuesEHAC[index] === maxEHAC.toFixed(2).replace('.', ',') ? `${classes.cellEHAC} max` : valuesEHAC[index] === minEHAC.toFixed(2).replace('.', ',') ? `${classes.cellEHAC} min` : classes.cellEHAC}>
                          {valuesEHAC[index] && valuesEHAC[index]}
                        </TableCell>
                      }
                      {containValue.EHCCA && state.checkedEHCCA &&
                        <TableCell className={valuesEHCCA[index] === maxEHCCA.toFixed(2).replace('.', ',') ? `${classes.cellEHCCA} max` : valuesEHCCA[index] === minEHCCA.toFixed(2).replace('.', ',') ? `${classes.cellEHCCA} min` : classes.cellEHCCA}>
                          {valuesEHCCA[index] && valuesEHCCA[index]}
                        </TableCell>
                      }
                      {containValue.EHEX && state.checkedEHEX &&
                        <TableCell className={valuesEHEX[index] === maxEHEX.toFixed(2).replace('.', ',') ? `${classes.cellEHEX} max` : valuesEHEX[index] === minEHEX.toFixed(2).replace('.', ',') ? `${classes.cellEHEX} min` : classes.cellEHEX}>
                          {valuesEHEX[index] && valuesEHEX[index]}
                        </TableCell>
                      }
                      {containValue.EHNG && state.checkedEHNG &&
                        <TableCell className={valuesEHNG[index] === maxEHNG.toFixed(2).replace('.', ',') ? `${classes.cellEHNG} max` : valuesEHNG[index] === minEHNG.toFixed(2).replace('.', ',') ? `${classes.cellEHNG} min` : classes.cellEHNG}>
                          {valuesEHNG[index] && valuesEHNG[index]}
                        </TableCell>
                      }
                      {containValue.EHCSA && state.checkedEHCSA &&
                        <TableCell className={valuesEHCSA[index] === maxEHCSA.toFixed(2).replace('.', ',') ? `${classes.cellEHCSA} max` : valuesEHCSA[index] === minEHCSA.toFixed(2).replace('.', ',') ? `${classes.cellEHCSA} min` : classes.cellEHCSA}>
                          {valuesEHCSA[index] && valuesEHCSA[index]}
                        </TableCell>
                      }
                      {containValue.EHCRi && state.checkedEHCRi &&
                        <TableCell className={valuesEHCRi[index] === maxEHCRi.toFixed(2).replace('.', ',') ? `${classes.cellEHCR} max` : valuesEHCRi[index] === minEHCRi.toFixed(2).replace('.', ',') ? `${classes.cellEHCR} min` : classes.cellEHCR}>
                          {valuesEHCRi[index]}
                        </TableCell>
                      }
                      {containValue.EHACi && state.checkedEHACi &&
                        <TableCell className={valuesEHACi[index] === maxEHACi.toFixed(2).replace('.', ',') ? `${classes.cellEHAC} max` : valuesEHACi[index] === minEHACi.toFixed(2).replace('.', ',') ? `${classes.cellEHAC} min` : classes.cellEHAC}>
                          {valuesEHACi[index] && valuesEHACi[index]}
                        </TableCell>
                      }
                      {containValue.EHCi && state.checkedEHCi &&
                        <TableCell className={valuesEHCi[index] === maxEHCi.toFixed(2).replace('.', ',') ? `${classes.cellEHCCA} max` : valuesEHCi[index] === minEHCi.toFixed(2).replace('.', ',') ? `${classes.cellEHCCA} min` : classes.cellEHCCA}>
                          {valuesEHCi[index] && valuesEHCi[index]}
                        </TableCell>
                      }
                      {containValue.EHEXi && state.checkedEHEXi &&
                        <TableCell className={valuesEHEXi[index] === maxEHEXi.toFixed(2).replace('.', ',') ? `${classes.cellEHEX} max` : valuesEHEXi[index] === minEHEXi.toFixed(2).replace('.', ',') ? `${classes.cellEHEX} min` : classes.cellEHEX}>
                           {valuesEHEXi[index] && valuesEHEXi[index]}
                        </TableCell>
                      }
                      {containValue.EHNGi && state.checkedEHNGi &&
                        <TableCell className={valuesEHNGi[index] === maxEHNGi.toFixed(2).replace('.', ',') ? `${classes.cellEHNGi} max` : valuesEHNGi[index] === minEHNGi.toFixed(2).replace('.', ',') ? `${classes.cellEHNGi} min` : classes.cellEHNGi}>
                          {valuesEHNGi[index] && valuesEHNGi[index]}
                        </TableCell>
                      }
                      {containValue.EHEXG && state.checkedEHEXG &&
                        <TableCell className={valuesEHEXG[index] === maxEHEXG.toFixed(2).replace('.', ',') ? `${classes.cellEHNG} max` : valuesEHEXG[index] === minEHEXG.toFixed(2).replace('.', ',') ? `${classes.cellEHNG} min` : classes.cellEHNG}>
                           {valuesEHEXG[index] && valuesEHEXG[index]}
                        </TableCell>
                      }

                      {
                        consumptionsFilters.compare === 'C' &&
                        <>

                          <TableCell>
                            {consumptionsFilters.granularity === 'D' && labelsCompare[index] && labelsCompare[index] + ' ' + monthCompare}
                            {consumptionsFilters.granularity === 'M' && labelsCompare[index] && labelsCompare[index]}
                            {consumptionsFilters.granularity === 'H' && labelsCompare[index] && labelsCompare[index] + ':00'}
                            {consumptionsFilters.granularity === 'S' && labelsCompare[index] && labelsCompare[index]}
                          </TableCell>

                          {containValue.EHCR && state.checkedEHCR &&
                            <TableCell className={valuesEHCRCompare[index] === maxEHCRCompare.toFixed(2).replace('.', ',') ? `${classes.cellEHCR} max` : valuesEHCRCompare[index] === minEHCRCompare.toFixed(2).replace('.', ',') ? `${classes.cellEHCR} min` : classes.cellEHCR}>
                              {valuesEHCRCompare[index] && valuesEHCRCompare[index]}
                            </TableCell>
                          }
                          {containValue.EHAC && state.checkedEHAC &&
                            <TableCell className={valuesEHACCompare[index] === maxEHACCompare.toFixed(2).replace('.', ',') ? `${classes.cellEHAC} max` : valuesEHACCompare[index] === minEHACCompare.toFixed(2).replace('.', ',') ? `${classes.cellEHAC} min` : classes.cellEHAC}>
                              {valuesEHACCompare[index] && valuesEHACCompare[index]}
                            </TableCell>
                          }
                          {containValue.EHCCA && state.checkedEHCCA &&
                            <TableCell className={valuesEHCCACompare[index] === maxEHCCACompare.toFixed(2).replace('.', ',') ? `${classes.cellEHCCA} max` : valuesEHCCACompare[index] === minEHCCACompare.toFixed(2).replace('.', ',') ? `${classes.cellEHCCA} min` : classes.cellEHCCA}>
                              {valuesEHCCACompare[index] && valuesEHCCACompare[index]}
                            </TableCell>
                          }
                          {containValue.EHEX && state.checkedEHEX &&
                            <TableCell className={valuesEHEXCompare[index] === maxEHEXCompare.toFixed(2).replace('.', ',') ? `${classes.cellEHEX} max` : valuesEHEXCompare[index] === minEHEXCompare.toFixed(2).replace('.', ',') ? `${classes.cellEHEX} min` : classes.cellEHEX}>
                              {valuesEHEXCompare[index] && valuesEHEXCompare[index]}
                            </TableCell>
                          }
                          {containValue.EHNG && state.checkedEHNG &&
                            <TableCell className={valuesEHNGCompare[index] === maxEHNGCompare.toFixed(2).replace('.', ',') ? `${classes.cellEHNG} max` : valuesEHNGCompare[index] === minEHNGCompare.toFixed(2).replace('.', ',') ? `${classes.cellEHNG} min` : classes.cellEHNG}>
                              {valuesEHNGCompare[index] && valuesEHNGCompare[index]}
                            </TableCell>
                          }
                          {containValue.EHCSA && state.checkedEHCSA &&
                            <TableCell className={valuesEHCSACompare[index] === maxEHCSACompare.toFixed(2).replace('.', ',') ? `${classes.cellEHCSA} max` : valuesEHCSACompare[index] === minEHCSACompare.toFixed(2).replace('.', ',') ? `${classes.cellEHCSA} min` : classes.cellEHCSA}>
                              {valuesEHCSACompare[index] && valuesEHCSACompare[index]}
                            </TableCell>
                          }
                          {containValue.EHCRi && state.checkedEHCRi &&
                            <TableCell className={valuesEHCRiCompare[index] === maxEHCRiCompare.toFixed(2).replace('.', ',') ? `${classes.cellEHCR} max` : valuesEHCRiCompare[index] === minEHCRiCompare.toFixed(2).replace('.', ',') ? `${classes.cellEHCR} min` : classes.cellEHCR}>
                              {valuesEHCRiCompare[index] && valuesEHCRiCompare[index]}
                            </TableCell>
                          }
                          {containValue.EHACi && state.checkedEHACi &&
                            <TableCell className={valuesEHACiCompare[index] === maxEHACiCompare.toFixed(2).replace('.', ',') ? `${classes.cellEHAC} max` : valuesEHACiCompare[index] === minEHACiCompare.toFixed(2).replace('.', ',') ? `${classes.cellEHAC} min` : classes.cellEHAC}>
                              {valuesEHACiCompare[index] && valuesEHACiCompare[index]}
                            </TableCell>
                          }
                          {containValue.EHCi && state.checkedEHCi &&
                            <TableCell className={valuesEHCiCompare[index] === maxEHCiCompare.toFixed(2).replace('.', ',') ? `${classes.cellEHCCA} max` : valuesEHCiCompare[index] === minEHCiCompare.toFixed(2).replace('.', ',') ? `${classes.cellEHCCA} min` : classes.cellEHCCA}>
                              {valuesEHCiCompare[index] && valuesEHCiCompare[index]}
                            </TableCell>
                          }
                          {containValue.EHEXi && state.checkedEHEXi &&
                            <TableCell className={valuesEHEXiCompare[index] === maxEHEXiCompare.toFixed(2).replace('.', ',') ? `${classes.cellEHEX} max` : valuesEHEXiCompare[index] === minEHEXiCompare.toFixed(2).replace('.', ',') ? `${classes.cellEHEX} min` : classes.cellEHEX}>
                              {valuesEHEXiCompare[index] && valuesEHEXiCompare[index]}
                            </TableCell>
                          }
                          {containValue.EHNGi && state.checkedEHNGi &&
                            <TableCell className={valuesEHNGiCompare[index] === maxEHNGiCompare.toFixed(2).replace('.', ',') ? `${classes.cellEHNGi} max` : valuesEHNGiCompare[index] === minEHNGiCompare.toFixed(2).replace('.', ',') ? `${classes.cellEHNGi} min` : classes.cellEHNGi}>
                              {valuesEHNGiCompare[index] && valuesEHNGiCompare[index]}
                            </TableCell>
                          }
                          {containValue.EHEXG && state.checkedEHEXG &&
                            <TableCell className={valuesEHEXGCompare[index] === maxEHEXGCompare.toFixed(2).replace('.', ',') ? `${classes.cellEHNG} max` : valuesEHEXGCompare[index] === minEHEXGCompare.toFixed(2).replace('.', ',') ? `${classes.cellEHNG} min` : classes.cellEHNG}>
                              {valuesEHEXGCompare[index] && valuesEHEXGCompare[index]}
                            </TableCell>
                          }
                        </>
                      }

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


  return (
    <>
      {
        consumptionsFilters.compare === 'C' &&
        <>
          <div className={classes.energyTitle}>
            <strong>{'Comparativa de energía'}</strong>
          </div>
          <div className={classes.energyTitle}>
            <strong>{consumptionsFilters.granularity !== 'H' ? consumptionsFilters.startDate + ' - ' + consumptionsFilters.endDate + '   -   ' + consumptionsFilters.startDateCompare + ' - ' + consumptionsFilters.endDateCompare : consumptionsFilters.startDate + ' - ' + consumptionsFilters.startDateCompare}</strong>
          </div>
        </>
      }


      <Grid container item className={classes.containerAutoConsumption} md={12}>
        {view()}
      </Grid>

      <DynamicLegend
        state={state}
        setState={setState}
        containValue={containValue}
        compare={consumptionsFilters.compare === 'C' ? true : false}
        consumptionsFilters={consumptionsFilters}
        mode={mode}
      />
    </>
  )
}

export default Table

