import React from 'react'
import { withRouter } from 'react-router-dom'

import { DialogContent } from '@material-ui/core'

import Dialog from '../../../../../common/components/dialog/Dialog'
import Content from './content/Content'

import useStyles from './ReconnectingDialog.styles'

const ReconnectingDialog = (props: any) => {
  const classes = useStyles({})

  const {
    isConnecting,
    timeout,
    handleReturn
  } = props

  return (
    <Dialog className={classes.dialog} open={isConnecting}>
      <DialogContent className={classes.container}>
        <Content
          timeout={timeout}
          handleReturn={handleReturn}
        />
      </DialogContent>
    </Dialog>
  )
}

export default withRouter(ReconnectingDialog)
