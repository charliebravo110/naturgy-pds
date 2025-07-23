import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import BillingDatepicker from './billing-datepicker/BillingDatepicker'

import useStyles from './BillingDates.styles'

const BillingDates = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    startDatesList,
    endDatesList,
  } = props

  const [startDatesListBillingDatePicker, setStartDatesListBillingDatePicker] = useState(null)
  const [endDatesListBillingDatePicker, setEndDatesListBillingDatePicker] = useState(null)

  useEffect(() => {
    if (startDate && startDate !== '') {
      let auxListDate = [] as any
      let startLabel = startDate.split('/')
      let endLabel
      endDatesList.map((fechaEndDateList, index) => {
//Se eliminar en la comparativa startLabel[1] < endLabel[1] el simbolo igual el 13/07. no se ha subido al PAP_2023_07
        endLabel = fechaEndDateList.split('/')
          if ((startLabel[2] < endLabel[2]) ||
            ((startLabel[2] === endLabel[2]) && (startLabel[1] < endLabel[1])) ||
            ((startLabel[2] === endLabel[2]) && (startLabel[1] === endLabel[1]) && (startLabel[0] < endLabel[0]))) {
            auxListDate.push(fechaEndDateList)
          }
      })
        setEndDatesListBillingDatePicker(auxListDate)
      
    }
  }, [startDate])

  useEffect(() => {
    if (endDate && endDate !== '') {
      let auxListDate = [] as any
      let startLabel
      let endLabel = endDate.split('/')   
      startDatesList.map((fechaStartDateList, index) => {
          startLabel = fechaStartDateList.split('/')
          if ((startLabel[2] < endLabel[2]) ||
            ((startLabel[2] === endLabel[2]) && (startLabel[1] < endLabel[1])) ||
            ((startLabel[2] === endLabel[2]) && (startLabel[1] === endLabel[1]) && (startLabel[0] < endLabel[0]))) {
            auxListDate.push(fechaStartDateList)
          }
      })
        setStartDatesListBillingDatePicker(auxListDate)
    }
  }, [endDate])

  useEffect(() => {
    setStartDatesListBillingDatePicker(startDatesList)
    setEndDatesListBillingDatePicker(endDatesList)
  }, [])

  return (

    <Grid container className={classes.generalCont}>
      <Grid item className={classes.billingDatepickerCont} md='auto' sm={12} xs={12}>
        <div className={classes.label}>
          {t('supplies.suppliesDetails.components.certificates.toolbar.billingDates.start')}
        </div>

        <div className={classes.billingDatepicker}>
          <BillingDatepicker
            date={startDate}
            setDate={setStartDate}
            datesList={startDatesListBillingDatePicker}
          />
        </div>
      </Grid>

      <Grid item className={classes.billingDatepickerCont} md='auto' sm={12} xs={12}>
        <div className={classes.label}>
          {t('supplies.suppliesDetails.components.certificates.toolbar.billingDates.end')}
        </div>

        <div className={classes.billingDatepicker}>
          <BillingDatepicker
            date={endDate}
            setDate={setEndDate}
            datesList={endDatesListBillingDatePicker}
          />
        </div>
      </Grid>
    </Grid>
  )
}

export default BillingDates
