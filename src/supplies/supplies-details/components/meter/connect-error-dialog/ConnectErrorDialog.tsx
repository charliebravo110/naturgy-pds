import React from 'react'
import { withRouter } from 'react-router-dom'

import { DialogContent } from '@material-ui/core'

import Dialog from '../../../../../common/components/dialog/Dialog'
import Content from './content/Content'

import useStyles from './ConnectErrorDialog.styles'

const ConnectErrorDialog = (props: any) => {
  const classes = useStyles({})

  const {
    connectError,
    handleReturn,
    readingError
  } = props

  return (
    <Dialog className={classes.dialog} open={connectError}>
      <DialogContent className={classes.container}>
        <Content
          handleReturn={handleReturn}
          readingError={readingError}
        />
      </DialogContent>
    </Dialog>
  )
}

export default withRouter(ConnectErrorDialog)
