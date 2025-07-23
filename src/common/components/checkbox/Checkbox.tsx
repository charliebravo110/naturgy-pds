import React from 'react'

import { NaturgyCheckbox } from './Checkbox.styles'

import useStyles from './Checkbox.styles'

const Checkbox = (props: any) => {
  const classes = useStyles({})
  return (
    <NaturgyCheckbox
      icon={<div className={props.disabled ? classes.uncheckedCheckboxDisabled : classes.uncheckedCheckbox} />}
      color='primary'
      {...props}
    />
  )
}

export default Checkbox
