import React, { useState, useEffect } from 'react'
import { Grid, DialogContent } from '@material-ui/core'

import { useTranslation } from 'react-i18next'
import useStyles from '../imagesDialog/DialogImages.styles'
import Dialog from '../../../../../common/components/dialog/Dialog'
import Content from './Content'


const DeleteAdvert = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const { 
    showingDialog,
    setShowingDialog,
    handleCancel
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
          />
        </DialogContent>
      </Dialog>    
  )
}

export default DeleteAdvert