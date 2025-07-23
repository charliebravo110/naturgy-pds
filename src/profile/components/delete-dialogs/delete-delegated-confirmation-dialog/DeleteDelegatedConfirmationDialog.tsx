import React from 'react'
import { withRouter } from 'react-router-dom'

import { DialogContent } from '@material-ui/core'

import Dialog from '../../../../common/components/dialog/Dialog'
import Content from './content/Content'

import useStyles from './DeleteDelegatedConfirmationDialog.styles'

const DeleteDelegatedConfirmationDialog = (props: any) => {
  const classes = useStyles({})

  const {
    open,
    userId,
    userToken,
    setIsLoading
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
          setIsLoading={setIsLoading}
        />
      </DialogContent>
    </Dialog>
  )
}

export default withRouter(DeleteDelegatedConfirmationDialog)
