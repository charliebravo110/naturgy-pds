import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import useStyles from './Legend.styles'

const Legend = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    isGenerationTab,
    consumptionsFilters,
    isAdapted,
    adaptedDate,
    tipoUsuario,
    energiaReactiva
  } = props

  let splitAdaptedDate: any[] = adaptedDate && adaptedDate.split('/')
  let splitDate: any[] = consumptionsFilters.startDate && consumptionsFilters.startDate.split('/')
  let splitDateCompare: any[] = consumptionsFilters.startDateCompare && consumptionsFilters.startDateCompare.split('/')
  let type1
  let type2

  if (splitDate[1] === '1' || splitDate[1] === '2' || splitDate[1] === '7' || splitDate[1] === '12' || splitDate[1] === '01' || splitDate[1] === '02' || splitDate[1] === '07') {
    //rojo, naranja, azul (acuamarina)
    type1 = 1
  } else if (splitDate[1] === '3' || splitDate[1] === '11' || splitDate[1] === '03') {
    //naranja, amarillo, azul (acuamarina)
    type1 = 2
  } else if (splitDate[1] === '6' || splitDate[1] === '8' || splitDate[1] === '9' || splitDate[1] === '06' || splitDate[1] === '08' || splitDate[1] === '09') {
    //amarillo, verde, azul (acuamarina)
    type1 = 3
  } else if (splitDate[1] === '4' || splitDate[1] === '5' || splitDate[1] === '10' || splitDate[1] === '04' || splitDate[1] === '05') {
    //verde, verdeoscuro, azul (acuamarina)
    type1 = 4
  }

  if (splitDateCompare[1] === '1' || splitDateCompare[1] === '2' || splitDateCompare[1] === '7' || splitDateCompare[1] === '12' || splitDateCompare[1] === '01' || splitDateCompare[1] === '02' || splitDateCompare[1] === '07') {
    //rojo, naranja, azul (acuamarina)
    type2 = 1
  } else if (splitDateCompare[1] === '3' || splitDateCompare[1] === '11' || splitDateCompare[1] === '03') {
    //naranja, amarillo, azul (acuamarina)
    type2 = 2
  } else if (splitDateCompare[1] === '6' || splitDateCompare[1] === '8' || splitDateCompare[1] === '9' || splitDateCompare[1] === '06' || splitDateCompare[1] === '08' || splitDateCompare[1] === '09') {
    //amarillo, verde, azul (acuamarina)
    type2 = 3
  } else if (splitDateCompare[1] === '4' || splitDateCompare[1] === '5' || splitDateCompare[1] === '10' || splitDateCompare[1] === '04' || splitDateCompare[1] === '05') {
    //verde, verdeOscuro, azul (acuamarina)
    type2 = 4
  }

  return (
    <>
      <Grid container className={classes.topContainer}>
        <Grid item md={12} xs={12} sm={12} className={classes.labelTop}>
          <span>
            {
              (isGenerationTab || consumptionsFilters.showR4 === 'S' || consumptionsFilters.showR3 === 'S') && consumptionsFilters.showR2 === 'N' ?
                t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.comparativaGeneracion')
                :
                t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.comparativaConsumo')
            }
          </span>
        </Grid>

        <Grid container xs='auto' sm='auto' md={6} className={classes.dateContainer}>
          {
            (consumptionsFilters.granularity !== 'H' && consumptionsFilters.granularity !== 'Q') || isAdapted !== 'SI' || energiaReactiva || ((splitAdaptedDate[1] > splitDate[1] && splitDate[2] > 2020 && splitDate[2].toString() === splitAdaptedDate[2]) || splitDate[2] < 2021) ?
              <div id='rectangle' style={{ width: 20, height: 20, backgroundColor: '#004571' }} />
              :
              tipoUsuario === 'simple' ?
                <>
                  <div id='rectangle' style={{ width: 7, height: 20, backgroundColor: '#d3222a' }} />
                  <div id='rectangle' style={{ width: 7, height: 20, backgroundColor: '#edab46' }} />
                  <div id='rectangle' style={{ width: 7, height: 20, backgroundColor: '#009aa6' }} />
                </>
                :
                <>
                  <div id='rectangle' style={{ width: 7, height: 20, backgroundColor: type1 === 1 ? '#d3222a' : type1 === 2 ? '#e57200' : type1 === 3 ? '#edab46' : type1 === 4 && '#bfbf60' }} />
                  <div id='rectangle' style={{ width: 7, height: 20, backgroundColor: type1 === 1 ? '#e57200' : type1 === 2 ? '#edab46' : type1 === 3 ? '#bfbf60' : type1 === 4 && '#5fad83' }} />
                  <div id='rectangle' style={{ width: 7, height: 20, backgroundColor: '#009aa6' }} />
                </>
          }
          <Grid item xs='auto' sm='auto' md='auto' className={classes.labelDate}>
            {
              consumptionsFilters.granularity === 'H' ?
                <span>{consumptionsFilters.startDate}</span>
                :
                <span>{consumptionsFilters.startDate} - {consumptionsFilters.endDate}</span>
            }
          </Grid>
        </Grid>

        <Grid container xs='auto' sm='auto' md={6} className={classes.dateContainer2}>
          {
            (consumptionsFilters.granularity !== 'H' && consumptionsFilters.granularity !== 'Q') || isAdapted !== 'SI' || energiaReactiva || ((splitAdaptedDate[1] > splitDateCompare[1] && splitDateCompare[2] > 2020 && splitDateCompare[2].toString() === splitAdaptedDate[2]) || splitDateCompare[2] < 2021) ?
              <div id='rectangle' style={{ width: 20, height: 20, backgroundColor: 'rgba(102, 195, 202, 1)' }} />
              :
              tipoUsuario === 'simple' ?
                <>
                  <div id='rectangle' style={{ width: 7, height: 20, backgroundColor: '#d57c80' }} />
                  <div id='rectangle' style={{ width: 7, height: 20, backgroundColor: '#ecc892' }} />
                  <div id='rectangle' style={{ width: 7, height: 20, backgroundColor: 'rgba(102, 195, 202, 1)' }} />
                </>
                :
                <>
                  <div id='rectangle' style={{ width: 7, height: 20, backgroundColor: type2 === 1 ? '#d57c80' : type2 === 2 ? '#f79c43' : type2 === 3 ? '#ecc892' : type2 === 4 && '#c4c487' }} />
                  <div id='rectangle' style={{ width: 7, height: 20, backgroundColor: type2 === 1 ? '#f79c43' : type2 === 2 ? '#ecc892' : type2 === 3 ? '#c4c487' : type2 === 4 && '#95b8a5' }} />
                  <div id='rectangle' style={{ width: 7, height: 20, backgroundColor: 'rgba(102, 195, 202, 1)' }} />
                </>
          }
          <Grid item xs='auto' sm='auto' md='auto' className={classes.labelDate}>
            {
              consumptionsFilters.granularity === 'H' ?
                <span>{consumptionsFilters.startDateCompare}</span>
                :
                <span>{consumptionsFilters.startDateCompare} - {consumptionsFilters.endDateCompare}</span>
            }
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default Legend
