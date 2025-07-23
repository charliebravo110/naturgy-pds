import React from 'react'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'

const Calendar = (props: any) => {
  const {
   start,
   end,
  } = props

  const lang = sessionStorage.getItem('lang') || 'es'
  

  if (lang === 'es' || lang === 'gl') {
    registerLocale('es', es)
    setDefaultLocale('es')
  }

  return (
    <div>
      <DatePicker
        selected={end}
        startDate={start}
        endDate={end}
        monthsShown={1}
        inline
        locale='es'
      />
    </div>
  )
}

export default Calendar