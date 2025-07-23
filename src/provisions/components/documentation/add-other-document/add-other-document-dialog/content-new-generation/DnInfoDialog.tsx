import React from 'react'
import { withRouter } from 'react-router-dom'

import { DialogContent } from '@material-ui/core'

import Dialog from '../../../../../../common/components/dialog/Dialog'
import Content from './content-dni-info/Content-dni'

import useStyles from '../AddOtherDocumentDialog.styles'

const DnInfoDialog = (props: any) => {
  const classes = useStyles({})

  const {
   popup,
   setPopup,
   handleAddOtherDoc
  } = props

  const handleClose = () => {
    setPopup(false)
  }

  return (
    <Dialog open={popup} onClose={handleClose}>
      <DialogContent className={classes.modalContainer}>
        <Content
          handleClose={handleClose}
          handleAddOtherDoc={handleAddOtherDoc}
        />
      </DialogContent>
    </Dialog>
  )
}

export default withRouter(DnInfoDialog)
