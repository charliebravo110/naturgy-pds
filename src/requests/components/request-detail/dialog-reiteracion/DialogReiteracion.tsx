import React, { useState, useEffect } from 'react'
import { Grid, DialogContent } from '@material-ui/core'

import { useTranslation } from 'react-i18next'
import useStyles from './DialogReiteracion.styles'
import Dialog from '../../../../common/components/dialog/Dialog'
import Content from './content/Content'


const DialogReiteracion = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const { 
    showingDialog,
    setShowingDialog,
    user,
    codSR,
    setIsLoading,
    setReiterationDone
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
            setReiterationDone={setReiterationDone}
          />
        </DialogContent>
      </Dialog>    
  )
}

export default DialogReiteracion