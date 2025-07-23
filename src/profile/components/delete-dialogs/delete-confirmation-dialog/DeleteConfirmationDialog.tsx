import React from 'react'
import { withRouter } from 'react-router-dom'

import { DialogContent } from '@material-ui/core'

import Dialog from '../../../../common/components/dialog/Dialog'
import Content from './content/Content'

import useStyles from './DeleteConfirmationDialog.styles'

const DeleteConfirmationDialog = (props: any) => {
  const classes = useStyles({})

  const {
    open,
    userId,
    userToken,
    handleOpenDeleteDelegationsConfirmationDialog,
    handleOpenDeleteDelegatedInMeConfirmationDialog
  } = props

  const handleClose = () => {
    props.closeaux(false)
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className={classes.modalContainer}>
        <Content
          userId={userId}
          userToken={userToken}
          handleClose={handleClose}
          handleOpenDeleteDelegationsConfirmationDialog={handleOpenDeleteDelegationsConfirmationDialog}
          handleOpenDeleteDelegatedInMeConfirmationDialog={handleOpenDeleteDelegatedInMeConfirmationDialog}
        />
      </DialogContent>
    </Dialog>
  )
}

export default withRouter(DeleteConfirmationDialog)
