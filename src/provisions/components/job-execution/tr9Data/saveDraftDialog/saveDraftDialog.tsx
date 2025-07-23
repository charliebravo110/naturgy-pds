import React from 'react'
import {  DialogContent } from '@material-ui/core'

import useStyles from './savedraftDialog.style'
import Dialog from '../../../../../common/components/dialog/Dialog'
import Content from './Content'


const SaveDraftDialog = (props: any) => {
  const classes = useStyles({})

  const { 
    showingDialog,
    setShowingDialog,
    handleCancel,
    handleSubmit
  } = props

  const handleCloseDialog = () => {
    setShowingDialog(false)
  }

  return (
      <Dialog className={classes.dialog1} open={showingDialog} onClose={handleCloseDialog}>
        <DialogContent className={classes.dialogContainer}>
          <Content
            handleCloseDialog={handleCloseDialog}
            handleCancel={handleCancel}
            handleSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>    
  )
}

export default SaveDraftDialog