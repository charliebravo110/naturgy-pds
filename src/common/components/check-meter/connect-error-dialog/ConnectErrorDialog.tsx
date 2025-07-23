import React from 'react'
import { withRouter } from 'react-router-dom'
import Content from './content/Content'

const ConnectErrorDialog = (props: any) => {

  const {
    handleReturn,
    readingError
  } = props

  return (
    <Content handleReturn={handleReturn} readingError={readingError}/>
  )
}

export default withRouter(ConnectErrorDialog)
