import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import { formatDate, formatDateHyphens } from '../../../../../../common/lib/FormatLib'

import { setCurrentCompareConsumptions, setCurrentSupplyConsumptions } from '../../../../../store/actions/SuppliesActions'

import useStyles from './Views.styles'

const ViewsConsumption = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    setIsLoading,
    downLoadFilters,
    setDownLoadFilters,
    supplyData,
    consumptionsFilters,
    setConsumptionsFilters,
    setAuxStartDate,
    setAuxEndDate
  } = props



  
  let auxStartDate
  let auxEndDate = new Date()

  const handleChangeDowloadFilter = (tipo: string) => {
//cambio por de las fechas por meses, en principio eliminar
    // if (tipo === 'periodo') {
    //   auxStartDate = new Date(auxEndDate.getFullYear(), auxEndDate.getMonth() - 6, 1)
    // }
    // else if (tipo === 'meses') {
    //   let today = new Date().getDate()

    //   if (today === 1) {
    //     auxStartDate = new Date(auxEndDate.getFullYear(), auxEndDate.getMonth() - 1, 1)
    //     auxEndDate = new Date(auxEndDate.getFullYear(), auxEndDate.getMonth(), 0)
    //   } else {
    //     auxStartDate = new Date(auxEndDate.getFullYear(), auxEndDate.getMonth(), 1)
    //   }
    // }
    // else if (tipo === 'facturacion') {
    //   let dia_milisegundos = 24 * 60 * 60 * 1000
    //   auxStartDate = new Date(auxEndDate.getTime() - dia_milisegundos)
    //   auxEndDate = auxStartDate
    // }
    // else if (tipo === '24meses') {
    //   let dayOfWeek = new Date(formatDateHyphens(auxEndDate)).getDay()
    //   let today = new Date(formatDateHyphens(auxEndDate)).getDate()
    //   let auxDate = new Date(formatDateHyphens(auxEndDate))

    //   switch (dayOfWeek) {
    //     case 0:
    //       auxStartDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 6)
    //       auxEndDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today)
    //       break;
    //     case 1:
    //       auxStartDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today)
    //       auxEndDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 6)
    //       break;

    //     case 2:
    //       auxStartDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 1)
    //       auxEndDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 5)
    //       break;
    //     case 3:
    //       auxStartDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 2)
    //       auxEndDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 4)
    //       break;
    //     case 4:
    //       auxStartDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 3)
    //       auxEndDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 3)
    //       break;
    //     case 5:
    //       auxStartDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 4)
    //       auxEndDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 2)
    //       break;
    //     case 6:
    //       auxStartDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 5)
    //       auxEndDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 1)
    //       break;
    //   }
    // }

    // setAuxStartDate(formatDate(auxStartDate))
    // setAuxEndDate(formatDate(auxEndDate))

    var tipoFinal
    switch (tipo) {
      case 'periodo':
        tipoFinal = 'entre dos fechas'
        break;
      case 'facturacion':
        tipoFinal = 'periodo de facturación'
        break;
      case '24meses':
        tipoFinal = 'últimos 24 meses'
        break;
    }

    sessionStorage.setItem('consumo_horario_option', tipoFinal)

    setDownLoadFilters({
      ...downLoadFilters,
      tipo,
      // startDate: formatDate(auxStartDate),
      // endDate: formatDate(auxEndDate),
    })

  }
  /*
  const handleChangeGranularity = (granularity: string) => {
    console.log(supplyData.measurementSystem)

    setIsLoading(true)

    setCurrentSupplyConsumptions([])
    setCurrentCompareConsumptions([])

    auxEndDate.setDate(auxEndDate.getDate())

    if (granularity === 'M') {
      auxStartDate = new Date(auxEndDate.getFullYear(), auxEndDate.getMonth() - 6, 1)
    }
    else if (granularity === 'D') {
      let today = new Date().getDate()

      if (today === 1) {
        auxStartDate = new Date(auxEndDate.getFullYear(), auxEndDate.getMonth() - 1, 1)
        auxEndDate = new Date(auxEndDate.getFullYear(), auxEndDate.getMonth(), 0)
      } else {
        auxStartDate = new Date(auxEndDate.getFullYear(), auxEndDate.getMonth(), 1)
      }
    }
    else if (granularity === 'S') {*/
      /*let today = new Date().getDate()

      if (today === 1) {
        auxStartDate = new Date(auxEndDate.getFullYear(), auxEndDate.getMonth() - 1, 1)
        auxEndDate = new Date(auxEndDate.getFullYear(), auxEndDate.getMonth(), 0)
      } else {
        auxStartDate = new Date(auxEndDate.getFullYear(), auxEndDate.getMonth(), 2)
      }*/
      //auxEndDate es la fecha que escogemos en el DataPicker 
      /*let dayOfWeek = new Date(formatDateHyphens(auxEndDate)).getDay()
      let today = new Date(formatDateHyphens(auxEndDate)).getDate()
      let auxDate = new Date(formatDateHyphens(auxEndDate))

      switch (dayOfWeek) {
        case 0:
          auxStartDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 6)
          auxEndDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today)
          break;
        case 1:
          auxStartDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today)
          auxEndDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 6)
          break;

        case 2:
          auxStartDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 1)
          auxEndDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 5)
          break;
        case 3:
          auxStartDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 2)
          auxEndDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 4)
          break;
        case 4:
          auxStartDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 3)
          auxEndDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 3)
          break;
        case 5:
          auxStartDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 4)
          auxEndDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 2)
          break;
        case 6:
          auxStartDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 5)
          auxEndDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 1)
          break;
      }
    }
    else if (granularity === 'H') {
      let dia_milisegundos = 24 * 60 * 60 * 1000
      auxStartDate = new Date(auxEndDate.getTime() - dia_milisegundos)
      auxEndDate = auxStartDate
    }
    else if (granularity === 'Q') {
      let quarter_milisegundos = 24 * 60 * 60 * 1000
      auxStartDate = new Date(auxEndDate.getTime() - quarter_milisegundos)
      auxEndDate = auxStartDate
    }

    setAuxStartDate(formatDate(auxStartDate))
    setAuxEndDate(formatDate(auxEndDate))

    setConsumptionsFilters({
      ...consumptionsFilters,
      granularity,
      startDate: formatDate(auxStartDate),
      endDate: formatDate(auxEndDate),
      compare: 'N'
    })
  }
  */

  useEffect(() => {
    sessionStorage.setItem('consumo_horario_option', 'entre dos fechas')
  },[])

  return (
    <Grid item md={12} sm={12} xs={12}>
      <Grid container className={classes.container} item sm={12} xs={12}>

        <Grid container className={classes.menu}>
          <Grid
            item
            className={`${classes.menuItem2} ${downLoadFilters.tipo === 'periodo' && 'active'}`}
            onClick={() => handleChangeDowloadFilter('periodo')}
          >
            {t('supplies.suppliesDetails.components.consumption.charts.views.betweenTwoDates')}
          </Grid>

          <Grid
            item
            className={`${classes.menuItem2} ${downLoadFilters.tipo === 'facturacion' && 'active'} ${supplyData.measurementSystem === 'G' && 'hide'}`}
            onClick={() => handleChangeDowloadFilter('facturacion')}
          >
            {t('supplies.suppliesDetails.components.consumption.charts.views.facturationPeriod')}
          </Grid>

          <Grid
            item
            className={`${classes.menuItem2} ${downLoadFilters.tipo === 'meses' && 'active'} ${supplyData.measurementSystem === 'O' && 'hide'}`}

            onClick={() => handleChangeDowloadFilter('meses')}
          >
            {t('supplies.suppliesDetails.components.consumption.charts.views.months')}
          </Grid>

          <Grid
            item
            className={`${classes.menuItem} ${downLoadFilters.tipo === '24meses' && 'active'}`}
            onClick={() => handleChangeDowloadFilter('24meses')}
          >
            {t('supplies.suppliesDetails.components.consumption.charts.views.lastMonth')}
          </Grid>



        </Grid>
      </Grid>
    </Grid>
  )
}

export default ViewsConsumption
