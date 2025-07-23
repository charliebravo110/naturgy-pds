import React, { useState, useEffect } from 'react'
import { Grid, DialogContent } from '@material-ui/core'

import { useTranslation } from 'react-i18next'
import useStyles from './DialogReapertura.styles'
import Dialog from '../../../../common/components/dialog/Dialog'
import Content from './content/Content'


const DialogReapertura = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const { 
    showingDialog,
    setShowingDialog,
    user,
    codSR,
    setIsLoading,
    setReopenDone
  } = props

  const handleCloseDialog = () => {
    setShowingDialog(false)
  }

  return (
      <Dialog className={classes.dialog} open={showingDialog} onClose={handleCloseDialog}>
        <DialogContent className={classes.dialogContainer}>
          <Content
            handleCloseDialog={handleCloseDialog}
            user={user}
            codSR={codSR}
            setIsLoading={setIsLoading}
            setReopenDone={setReopenDone}
          />
        </DialogContent>
      </Dialog>    
  )
}

export default DialogReapertura