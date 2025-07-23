import React from 'react'

import useStyles from './Overlay.styles'

const Overlay = (props: any) => {
  const classes = useStyles({})

  const {
    handleClick
  } = props

  return (
    <div className={classes.overlay} onClick={handleClick} />
  )
}

export default Overlay
