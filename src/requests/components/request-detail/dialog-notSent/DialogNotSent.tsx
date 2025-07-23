import React, { useState, useEffect } from 'react'
import { Grid, DialogContent } from '@material-ui/core'

import { useTranslation } from 'react-i18next'
import useStyles from './DialogNotSent.styles'
import Dialog from '../../../../common/components/dialog/Dialog'
import Content from './content/Content'


const DialogNotSent = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const { 
    showingDialog,
    setShowingDialog,
  } = props

  const handleCloseDialog = () => {
    setShowingDialog(false)
  }

  return (
      <Dialog className={classes.dialog} open={showingDialog} onClose={handleCloseDialog}>
        <DialogContent className={classes.dialogContainer}>
          <Content
            handleCloseDialog={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>    
  )
}

export default DialogNotSent