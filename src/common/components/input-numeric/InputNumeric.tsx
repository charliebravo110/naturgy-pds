import React, { useState, useEffect } from 'react'

import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'

import Input from '../input/Input'
import UpArrowBlue from '../../../assets/icons/flecha_up_blue.svg'
import DownArrowBlue from '../../../assets/icons/flecha_down_blue.svg'
import UpArrowWhite from '../../../assets/icons/flecha_up_blanco.svg'
import DownArrowWhite from '../../../assets/icons/flecha_down_blanco.svg'

import useStyles from './InputNumeric.styles'

const InputNumeric = (props: any) => {
  const classes = useStyles({})

  const {
    value,
    disabled,
    onChange
  } = props

  const [ innerValue, setInnerValue ]  = useState(0)
  const [ upClick, setUpClick ]  = useState(false)
  const [ downClick, setDownClick ]  = useState(false)

  useEffect(() => {
    if (!isNaN(value)) {
      setInnerValue(value)
    }
  }, [ value ])

  const handleAdd = () => {
    if (!disabled) {
      const aux = innerValue ? (typeof(innerValue) === 'number' ? innerValue + 1 : parseInt(innerValue) + 1) : 1
      setInnerValue(aux)
      onChange({target: {value: aux}})
    }
  }

  const handleSubtract = () => {
    if (!disabled) {
      const aux = innerValue !== 0 ? innerValue - 1 : innerValue
      if (aux > 0) {
        setInnerValue(aux)
        onChange({target: {value: aux}})
      }
    }
  }

  const InputControl = () => {
    return (
      <Grid container direction='column' className={classes.adornmentContainer}>
        <Grid
          item
          className={upClick ? classes.adornmentItemActive : classes.adornmentItem}
          onMouseDown={() => setUpClick(true)}
          onMouseUp={() => {
            setUpClick(false)
            handleAdd()
          }}
        >
          <img src={upClick ? UpArrowWhite : UpArrowBlue} alt='' />
        </Grid>
        <Grid
          item
          className={downClick ? classes.adornmentItemActive : classes.adornmentItem}
          onMouseDown={() => setDownClick(true)}
          onMouseUp={() => {
            setDownClick(false)
            handleSubtract()
          }}
        >
          <img src={downClick ? DownArrowWhite : DownArrowBlue} alt='' />
        </Grid>
      </Grid>
    )
  }

  const adornment = <InputAdornment position='end' children={<InputControl />} />

  return (
    <Input
      {...props}
      value={innerValue}
      className={`${classes.input} ${props.className}`}
      InputProps={{ 
        endAdornment: adornment
      }}
    />
  )

}

export default InputNumeric
