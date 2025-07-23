import React from 'react'

import useStyles from './IconTextButton.styles'

const NaturgyIconTextButton = (props: any) => {
  const classes = useStyles({})

  return (
    <div style={props.style} onClick={props.onClick} className={`${classes.button} ${props.className ? props.className : ''} ${props.justifyCenter ? classes.justifyCenter : ''}`}>
      {props.icon}

      <span className={classes.text}>{props.text}</span>
    </div>
  )
}

export default NaturgyIconTextButton
