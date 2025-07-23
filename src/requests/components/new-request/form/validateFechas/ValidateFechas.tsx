import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'

import useStyles from './ValidateFechas.styles'
import DatepickerV2 from '../../../../../common/components/datepickerV2/DatepickerV2'
import { formatDate } from '../../../../../common/lib/FormatLib'
import Input from '../../../../../common/components/input/Input'

const ValidateFechas = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    pvtData,
    setPvtData,
    pvtErrors,
    handleUpdateErrors
  } = props

  const [auxStartDate, setAuxStartDate] = useState()
  const [auxEndDate, setAuxEndDate] = useState()
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const today = new Date()
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15)

  const getFifteenDaysFromDate = (beginDate) => {
    const fifteenDaysFromDate = new Date(beginDate)
    fifteenDaysFromDate.setDate(fifteenDaysFromDate.getDate() + 15)
    return fifteenDaysFromDate
  }

  const validateTime = (time) => {
    let isValid = false

    if (time !== '') {
      const timeArray = time.split('')

      if (timeArray[2] === ':') {
        const hours = time.split(':')[0]
        const minutes = time.split(':')[1]

        const hoursIsNum = /^\d+$/.test(hours) // Devuelve true si 'hours' sólo contiene números
        const minutesIsNum = /^\d+$/.test(minutes)  // Devuelve true si 'minutes' sólo contiene números

        if (hours !== '' && hoursIsNum && minutes !== '' && minutesIsNum) {

          if (parseInt(hours) >= 0 && parseInt(hours) <= 23 && parseInt(minutes) >= 0 && parseInt(minutes) < 60) {

            if (hours.length === 2 && minutes.length === 2 && time.length === 5) {
              isValid = true
            }
          }
        }
      }
    }

    return isValid
  }

  useEffect(() => {
    if (auxStartDate) {
      pvtData.startdDate = formatDate(auxStartDate)

      setAuxEndDate(null)
    }
  }, [auxStartDate])

  useEffect(() => {
    if (auxEndDate) {
      pvtData.endDate = formatDate(auxEndDate)
    } else {
      pvtData.endDate = ''
    }
  }, [auxEndDate])

  return (

    < Grid >
      {/* Fechas y hora de necesidad de la actuación */}
      < div className={classes.description2} >
        {t('requests.newRequest.form.btenForm.titles.title8')}
      </div >

      <Grid container className={classes.inputs} spacing={3}>

        {/* Fecha inicio */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>
                {t('requests.newRequest.form.btenForm.inputs.labels.field22')}
              </div>
            </Grid>

            <DatepickerV2
              selectedDate={auxStartDate}
              handleChange={setAuxStartDate}
              size='s'
              minDate={minDate}
            />
          </Grid>
        </Grid>

        {/* Fecha fin */}
        {auxStartDate ?
          <Grid item md={6} sm={12} xs={12}>
            <Grid container direction='column'>
              <Grid item>
                <div className={classes.label}>
                  {t('requests.newRequest.form.btenForm.inputs.labels.field23')}
                </div>
              </Grid>

              <DatepickerV2
                selectedDate={auxEndDate}
                handleChange={setAuxEndDate}
                size='s'
                minDate={auxStartDate && new Date(auxStartDate)}
                maxDate={auxStartDate && getFifteenDaysFromDate(auxStartDate)}
              />
            </Grid>
          </Grid>
          :
          <Grid item md={6} sm={12} xs={12} />
        }

        {/* Hora inicio */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>
                {t('requests.newRequest.form.btenForm.inputs.labels.field24')}
              </div>
            </Grid>

            <Input
              fullWidth
              label={'00:00 (hh:mm)'}
              value={startTime}
              onChange={(e) => {
                const value = e.target.value

                setStartTime(value)

                if (validateTime(value)) {
                  setPvtData({
                    ...pvtData,
                    startTime: value + ':00'  // Añadimos los segundos
                  })

                  handleUpdateErrors({
                    ...pvtErrors,
                    startTime: false
                  })
                } else {
                  setPvtData({
                    ...pvtData,
                    startTime: ''
                  })

                  handleUpdateErrors({
                    ...pvtErrors,
                    startTime: true
                  })
                }
              }}
              onBlur={(e) => {
                (e.target.value === '' || !validateTime(e.target.value)) ?
                  handleUpdateErrors({
                    ...pvtErrors,
                    startTime: true
                  })
                  :
                  handleUpdateErrors({
                    ...pvtErrors,
                    startTime: false
                  })
              }}
              error={pvtErrors.startTime}
              helperText={pvtErrors.startTime &&
                (startTime === '' ?
                  t('requests.newRequest.form.btenForm.inputs.errors.required')
                  :
                  t('requests.newRequest.form.btenForm.inputs.errors.time'))
              }
            />
          </Grid>
        </Grid>

        {/* Hora fin */}
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>
                {t('requests.newRequest.form.btenForm.inputs.labels.field25')}
              </div>
            </Grid>

            <Input
              fullWidth
              label={'00:00 (hh:mm)'}
              value={endTime}
              onChange={(e) => {
                const value = e.target.value

                setEndTime(value)

                if (validateTime(value)) {
                  setPvtData({
                    ...pvtData,
                    endTime: value + ':00'  // Añadimos los segundos
                  })

                  handleUpdateErrors({
                    ...pvtErrors,
                    endTime: false
                  })
                } else {
                  setPvtData({
                    ...pvtData,
                    endTime: ''
                  })

                  handleUpdateErrors({
                    ...pvtErrors,
                    endTime: true
                  })
                }
              }}
              onBlur={(e) => {
                (e.target.value === '' || !validateTime(e.target.value)) ?
                  handleUpdateErrors({
                    ...pvtErrors,
                    endTime: true
                  })
                  :
                  handleUpdateErrors({
                    ...pvtErrors,
                    endTime: false
                  })
              }}
              error={pvtErrors.endTime}
              helperText={pvtErrors.endTime &&
                (endTime === '' ?
                  t('requests.newRequest.form.btenForm.inputs.errors.required')
                  :
                  t('requests.newRequest.form.btenForm.inputs.errors.time'))
              }
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid >
  )
}

export default ValidateFechas