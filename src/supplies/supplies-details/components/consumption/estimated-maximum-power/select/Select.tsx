import React from 'react'

import MenuItem from '@material-ui/core/MenuItem'
import InputAdornment from '@material-ui/core/InputAdornment'

import Spinner from '../../../../../../common/components/spinner/Spinner'


import CalendarIcon from '../../../../../../assets/icons/input_calendario.svg'

import NaturgySelect from './Select.styles'

const Select = (props: any) => {
  const { values, codFiltering, isLoading } = props

  const adornment = <InputAdornment position='end'><img src={CalendarIcon} alt='' /></InputAdornment>

  const getAdornment = (isLoading) => {
    if (isLoading) {
      return {
        endAdornment: <Spinner />
      }
    } else {
      return {
        endAdornment: adornment
      }
    }
  }

  const generateMenuItems = () => {
    return values.map(value => (<MenuItem key={value} value={codFiltering ? value.split('|')[0] : value}>{codFiltering ? value.split('|')[1] : value}</MenuItem>))
  }

  return (
    <NaturgySelect
      select
      variant='outlined'
      InputProps={getAdornment(isLoading)}
      {...props}
    >
      {generateMenuItems()}
    </NaturgySelect>
  )
}

export default Select
