import React, { useState, useEffect } from 'react'
import { Grid, DialogContent } from '@material-ui/core'

import { useTranslation } from 'react-i18next'
import useStyles from './DialogSentSuccessfully.styles'
import Dialog from '../../../../common/components/dialog/Dialog'
import Content from './content/Content'


const DialogSentSuccessfully = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const { 
    showingDialog,
    setShowingDialog,
    auxUploadDocuments,
    setAuxUploadDocuments,
  } = props

  const handleCloseDialog = () => {
    setAuxUploadDocuments([])
    setShowingDialog(false)
  }

  return (
      <Dialog className={classes.dialog} open={showingDialog} onClose={handleCloseDialog}>
        <DialogContent className={classes.dialogContainer}>
          <Content
            handleCloseDialog={handleCloseDialog}
            auxUploadDocuments={auxUploadDocuments}
          />
        </DialogContent>
      </Dialog>    
  )
}

export default DialogSentSuccessfully