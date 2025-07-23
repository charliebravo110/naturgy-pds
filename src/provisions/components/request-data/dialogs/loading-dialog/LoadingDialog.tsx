import React from 'react'
import { withRouter } from 'react-router-dom'

import { DialogContent } from '@material-ui/core'

import Dialog from '../../../../../common/components/dialog/Dialog'
import Content from './content/Content'

import useStyles from './LoadingDialog.styles'

const LoadingDialog = (props: any) => {
  const classes = useStyles({})

  const {
    isLoading,
    timeout,
    handleReturn
  } = props

  return (
    <Dialog className={classes.dialog} open={isLoading}>
      <DialogContent className={classes.container}>
        <Content
          handleReturn={handleReturn}
          timeout={timeout}
        />
      </DialogContent>
    </Dialog>
  )
}

export default withRouter(LoadingDialog)
