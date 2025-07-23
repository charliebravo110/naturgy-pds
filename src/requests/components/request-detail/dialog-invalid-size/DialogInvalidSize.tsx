import React, { useState, useEffect } from 'react'
import { Grid, DialogContent } from '@material-ui/core'

import { useTranslation } from 'react-i18next'
import useStyles from './DialogInvalidSize.styles'
import Dialog from '../../../../common/components/dialog/Dialog'
import Content from './content/Content'


const DialogInvalidSize = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const { 
    showingDialog,
    setShowingDialog,
    stringMaxUploadFileSize
  } = props

  const handleCloseDialog = () => {
    setShowingDialog(false)
  }

  return (
      <Dialog className={classes.dialog} open={showingDialog} onClose={handleCloseDialog}>
        <DialogContent className={classes.dialogContainer}>
          <Content
            handleCloseDialog={handleCloseDialog}
            stringMaxUploadFileSize={stringMaxUploadFileSize}
          />
        </DialogContent>
      </Dialog>    
  )
}

export default DialogInvalidSize