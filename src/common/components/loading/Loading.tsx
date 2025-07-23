import React from 'react'

import LinearProgress from '@material-ui/core/LinearProgress'

const Loading = (props: any) => {
  // @TODO tratamiento de error real
  const showError = (error) => {
    return (
      <div>
        `!Error de acceso! ${error.message}`
      </div>
    )
  }

  // @TODO tratar props.pastDelay y props.timedOut (https://github.com/jamiebuilds/react-loadable)
  return (
    <div>
      {props.error ? showError(props.error) : <LinearProgress color={props.color} />}
    </div>
  )
}

export default Loading
