import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Mode from '../mode/Mode'
import useStyles from './Actions.styles'
import Filters from '../filters/Filters'
import InfoIcon from '../../../../../../assets/icons/ico_info.svg'
import FiltersConsumptionsODI from '../filters/FiltersConsumptionsODI'
import FiltersConsumptionsGmv10 from '../filters/FiltersConsumptionsGmv10'
import { formatDate } from '../../../../../../common/lib/FormatLib'
import { thunkGetConsumptions } from '../../../../store/actions/SuppliesDetailsThunkActions'
import Spinner from '../../../../../../common/components/spinner/Spinner'
import { useDispatch, useSelector } from 'react-redux'
import { any } from 'prop-types'


const ActionsConsumption = (props: any) => {

  const classes = useStyles({})
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    toggle,
    mode,
    setMode,
    downLoadFilters,
    setDownLoadFilters,
    setIsExportTableDataDialog,
    consumptionsFilters,
    setConsumptionsFilters,
    isGeneration,
    isGenerationTab,
    currentSupplyConsumptions,
    autoConsumption,
    supplyData,
    billingStartDate,
    billingEndDate,
    isLoading,
    setIsLoading

  } = props

  const delegations = useSelector((state: any) => state.delegations)

  const [billingPeriods, setBillingPeriods] = useState([])

  // isDelegate
  let isDelegate = false

  if (delegations.delegatesInMeList.find(item => item.cups === supplyData.cups)) {
    isDelegate = true
  }

  const dowloadConsumptions = () => {
    // isSupplantedUser
    let isSupplantedUser = false
    if (delegations.delegatesInMeList.find(item => item.cups === supplyData.cups)) {
      isSupplantedUser = true
    }
    dispatch(thunkGetConsumptions(supplyData.cups, downLoadFilters.granularity, downLoadFilters.startDate, downLoadFilters.endDate, supplyData.isGenerator, isSupplantedUser, isDelegate, '0', supplyData.measurementSystem, (consumptionsResponse) => {
    }))
  }

  const handleExportConsumptions = () => {

    //Descargar datos en formato Excel
    if (downLoadFilters.tipo === 'periodo') {
      //Primero comprovamos que se ha rellenado los datos necesarios
    }
    else if (downLoadFilters.tipo === 'meses') {
    }
    else if (downLoadFilters.tipo === 'facturacion') {
    }
    else {
      //todos los datos, se pone fecha inicio 24 meses anterior a la actual
      var auxEndDate = new Date()
      var auxStartDate = new Date()
      auxStartDate.setMonth(auxStartDate.getMonth() - 24)
      setDownLoadFilters({
        ...downLoadFilters,
        endDate: formatDate(auxEndDate),
        startDate: formatDate(auxStartDate)
      })

      dowloadConsumptions()

      //poner Excel y CNMC

    }

  }

  useEffect(() => {
    //Preparamos el array de valores para el select de periodos
    if (billingStartDate && billingEndDate) {
      let values = []
      for (let i = 0; i < billingStartDate.length; i++) {
        values.push(billingStartDate[i] + '-' + billingEndDate[i])
      }
      setBillingPeriods(values)
    }
  }, [billingStartDate, billingEndDate])

  return (
    <>
   
      {supplyData.measurementSystem === 'O' ?
        <Grid container spacing={2} className={classes.container}>
          <FiltersConsumptionsODI
            downLoadFilters={downLoadFilters}
            setIsExportTableDataDialog={setIsExportTableDataDialog}
            setDownLoadFilters={setDownLoadFilters}
            consumptionsFilters={consumptionsFilters}
            setConsumptionsFilters={setConsumptionsFilters}
            isGeneration={isGeneration}
            isGenerationTab={isGenerationTab}
            currentSupplyConsumptions={currentSupplyConsumptions}
            autoConsumption={autoConsumption}
            supplyData={supplyData}
            handleExportConsumptions={handleExportConsumptions}
            billingPeriods={billingPeriods}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            
          />
        </Grid>
        :
        <Grid container spacing={2} className={classes.container}>
          <FiltersConsumptionsGmv10
            toggle={toggle}
            downLoadFilters={downLoadFilters}
            setDownLoadFilters={setDownLoadFilters}
            consumptionsFilters={consumptionsFilters}
            setConsumptionsFilters={setConsumptionsFilters}
            isGeneration={isGeneration}
            isGenerationTab={isGenerationTab}
            currentSupplyConsumptions={currentSupplyConsumptions}
            autoConsumption={autoConsumption}
            supplyData={supplyData}
            handleExportConsumptions={handleExportConsumptions}
          />
        </Grid>
      }
      {(supplyData.tipoDeLectura !== 'TELEGESTIONADO') &&
        <Grid container className={classes.containerteleoperable}>
          <Grid item className={classes.text}>
            <img className={classes.icon} src={InfoIcon} alt='' />
            <span className={classes.message}><b>{t('supplies.suppliesDetails.components.consumption.consumption.displayConsumptionteleoperable')}</b></span>
          </Grid>
        </Grid>
      }
    </>
  )
}

export default ActionsConsumption

