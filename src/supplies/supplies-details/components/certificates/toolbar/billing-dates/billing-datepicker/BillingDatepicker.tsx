import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Input from '../../../../../../../common/components/input/Input'

import useStyles from './BillingDatepicker.styles'

const BillingDatepicker = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    date,
    setDate,
    datesList
  } = props

  const [selectorDate, setSelectorDate] = useState(new Date().getFullYear())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const maxDate = new Date().getFullYear()
  const minDate = maxDate - 2
  let actualDatesListCont = 0

  const changeInputValue = () => {
    setShowDatePicker(!showDatePicker)
  }

  const subSelectorDate = () => {
    if (selectorDate !== minDate) {
      setSelectorDate(selectorDate - 1)
    }
  }

  const sumSelectorDate = () => {
    if (selectorDate < new Date().getFullYear()) {
      setSelectorDate(selectorDate + 1)
    }
  }

  const setDates = (date) => {
    setDate(date)
    changeInputValue()
  }

  const getTheYear = (dateToParse) => {
    return dateToParse.split('/')[2]
  }

  const checkActualDatesList = (index: number, hasARecord: boolean) => {
    if (index === 0) {
      actualDatesListCont = 0
    }
    actualDatesListCont = hasARecord ? actualDatesListCont + 1 : actualDatesListCont
  }

  return (
    <Grid container className={classes.generalCont}>
      <Input
        className={classes.input}
        value={date ? date : ''}
        onClick={changeInputValue}
        disabled={false}
        readOnly={true}
      />

      {showDatePicker &&
        <Grid container className={classes.pickerCont}>
          <Grid container className={classes.pickerHeader}>
            <Grid item className={classes.arrowLeft} onClick={subSelectorDate} />

            <Grid item className={classes.boldText}>{selectorDate}</Grid>

            <Grid item className={classes.arrowRight} onClick={sumSelectorDate} />
          </Grid>

          <Grid container className={classes.pickerList}>
            {(datesList && datesList !== null && datesList.length > 0) && datesList.map((date, i) => (
              getTheYear(date) == selectorDate ?
                <>
                  <Grid key={i} item className={classes.itemList} onClick={() => setDates(date)}>{date}</Grid>
                  {checkActualDatesList(i, true)}
                </>
                :
                checkActualDatesList(i, false)
            ))}
            {actualDatesListCont === 0 &&
              <Grid item className={classes.messageList}>
                {t('supplies.suppliesDetails.components.certificates.toolbar.billingDates.billingDatepicker.noDates')}
              </Grid>
            }
          </Grid>
        </Grid>
      }
    </Grid>
  )
}

export default BillingDatepicker
