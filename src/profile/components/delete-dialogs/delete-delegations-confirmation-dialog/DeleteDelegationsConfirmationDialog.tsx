import React from 'react'
import { withRouter } from 'react-router-dom'

import { DialogContent } from '@material-ui/core'

import Dialog from '../../../../common/components/dialog/Dialog'
import Content from './content/Content'

import useStyles from './DeleteDelegationsConfirmationDialog.styles'

const DeleteDelegationsConfirmationDialog = (props: any) => {
  const classes = useStyles({})

  const {
    open,
    userId,
    userToken,
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
          handleOpenDeleteDelegatedInMeConfirmationDialog={handleOpenDeleteDelegatedInMeConfirmationDialog}
          handleClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  )
}

export default withRouter(DeleteDelegationsConfirmationDialog)
