import React from 'react'

import useStyles from './Checkbox.styles'

const Checkbox = (props: any) => {
  const classes = useStyles({})

  const {
    selected,
    disabled,
    handleClick,
    error
  } = props

  return (
    <div className={`${classes.checkbox} ${selected && 'active'} ${disabled && 'disabled'} ${error && 'error'}`} onClick={handleClick} />
  )
}

export default Checkbox