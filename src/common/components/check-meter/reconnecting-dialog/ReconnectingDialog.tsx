import React from 'react'
import { withRouter } from 'react-router-dom'
import Content from './content/Content'

const ReconnectingDialog = (props: any) => {
  const {
    timeout,
    handleReturn
  } = props

  return (
    <Content timeout={timeout} handleReturn={handleReturn}/>
  )
}

export default withRouter(ReconnectingDialog)
