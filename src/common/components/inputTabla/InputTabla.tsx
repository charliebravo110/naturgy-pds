import React from 'react'

import InputAdornment from '@material-ui/core/InputAdornment'

import { NaturgyInput } from './InputTabla.styles'
import OkIcon from '../../../assets/icons/aviso_ok.svg'
import ErrorIcon from '../../../assets/icons/aviso_alerta_pop_up.svg'

import Spinner from '../spinner/Spinner'

import { useStyles } from './InputTabla.styles'

const getIcon = (error, errorSearch, showValidationIcon, value, isLoading) => {
  if (isLoading) {
    return {
      endAdornment: <Spinner />
    }
  }

  if ((!showValidationIcon || showValidationIcon === '0') || value === '') {
    return
  }

  return {
  endAdornment: <InputAdornment position='end'>{typeof errorSearch !== 'undefined' ? (errorSearch ? <img src={ErrorIcon} alt='' /> : <img src={OkIcon} alt='' />) : (error ? <img src={ErrorIcon} alt='' /> : <img src={OkIcon} alt='' />)}</InputAdornment>
  }
}

const InputTabla = (props: any) => {
  const {showValidationIcon, label, ...newProps} = props
  const classes = useStyles({})
  return (
      <NaturgyInput
        variant='outlined'
        label={label}
        InputProps={getIcon(props.error, props.errorSearch, props.showValidationIcon, props.value, props.isLoading)}
        classes={{root: `${(!label || label.length === 0) ? classes.noLabel : undefined}`}}
        InputLabelProps={{
          disabled: (!label || label.length === 0)
        }}
        {...newProps}
      />
  )
}

export default InputTabla
