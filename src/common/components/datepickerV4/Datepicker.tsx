import React from 'react'

import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
import './Datepicker.styles.scss'

import { formatDate, formatDateHyphens } from '../../lib/FormatLib'
import CalendarIcon from '../../../assets/icons/input_calendario.svg'
import HourIcon from '../../../assets/icons/seleccionar_hora.svg'

import useStyles from './Datepicker.styles'

const CustomInput = (props) => {
  return (
    <input
      type='text'
      value={props.value}
      onClick={props.onClick}
      readOnly={true}
    />
  )
}

const Datepicker = (props: any) => {
  const classes = useStyles({})

  const lang = sessionStorage.getItem('lang') || 'es'

  const {
    date,
    setDate,
    minDate,
    maxDate,
    minDateGMv10,
    maxDateGMv10,
    showMonthYearPicker,
    consumptionGMv10,
    fullWidth,
    isHour,
    popperPlacement,
    icon
  } = props

  const today = new Date()
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
  const monthMax = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  const minDateParsed = minDate ? new Date(formatDateHyphens(minDate)) : minDateGMv10 && new Date(formatDateHyphens(minDateGMv10))
  const maxDateParsed = maxDate ? new Date(formatDateHyphens(maxDate)) : maxDateGMv10 && new Date(formatDateHyphens(maxDateGMv10))

  if (lang === 'es' || lang === 'gl') {
    registerLocale('es', es)
    setDefaultLocale('es')
  }

  if (date instanceof Date) {
    setDate && setDate(formatDate(date))
  }

  const isValidConsumptionGMv10Date = date => {
    if (minDateParsed && maxDateParsed) {
      const minDateSeconds = minDateParsed.getTimezoneOffset() === -60 ? 3600000 : 7200000
      const maxDateSeconds = maxDateParsed.getTimezoneOffset() === -60 ? 3600000 : 7200000
      let minTime: any = minDateParsed.getTime() - minDateSeconds
      let maxTime: any = maxDateParsed.getTime() - maxDateSeconds
      if ((maxTime > today.getTime()) && (maxDateParsed.getMonth() !== date.getMonth())) {
        const arrMinDate = minDateGMv10.split('/')
        let endYear: any =  parseInt(arrMinDate[2])
        let endMonth: any = parseInt(arrMinDate[1])
        const maxDate = new Date(parseInt(endYear), parseInt(endMonth), 0)
        const maxDateSecondsAux = maxDate.getTimezoneOffset() === -60 ? 3600000 : 7200000
        maxTime = maxDate.getTime() - maxDateSecondsAux
      }
      let dateTime = date.getTime()
      return (dateTime >= minTime) && (dateTime <= maxTime)
    }
  }

  const splittedDate = date && date.split('/')
  const parsedDate = date && new Date(splittedDate[2] + '-' + splittedDate[1] + '-' + splittedDate[0])

  return (
    <div className={`${fullWidth ? classes.containerFullWidth : classes.container} ${props.disabled ? classes.disabled : ''}`}>
      <DatePicker
        customInput={<CustomInput />}
        selected={parsedDate}
        width={'50%'}
        dateFormat={showMonthYearPicker ? 'MMMM yyyy' : 'dd MMMM yyyy'}
        locale='es'
        minDate={minDate && minDateParsed.setDate(minDateParsed.getDate() + 1)}
        maxDate={showMonthYearPicker ? monthMax : maxDate ? maxDateParsed.setDate(maxDateParsed.getDate() - 1) : yesterday}
        showMonthYearPicker={showMonthYearPicker}
        popperPlacement={popperPlacement ? popperPlacement : 'bottom-start'}
        filterDate={consumptionGMv10 && isValidConsumptionGMv10Date}
        popperModifiers={{
          flip: {
            enabled: false
          },
          preventOverflow: {
            enabled: true,
            escapeWithReference: true
          }
        }}
        onChange={date => {
          setDate(formatDate(new Date(date)))
        }}
        onKeyDown={e => e.preventDefault()}
        {...props}
      />
      {
        !icon &&
          <div className={classes.icon}>
          {
            isHour ?
              <img src={HourIcon} alt='' />
            :
              <img src={CalendarIcon} alt='' />
          }
      </div>
      }
    </div>
  )
}

export default Datepicker
