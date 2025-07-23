import React from 'react'
import { withRouter } from 'react-router-dom'

import { DialogContent } from '@material-ui/core'

import Dialog from '../../../../../../../../common/components/dialog/Dialog'
import Content from './content/Content'

import useStyles from './ExportAllDataDialog.styles'

const ExportAllDataDialog = (props: any) => {
  const classes = useStyles({})

  const {
    supplyData,
    isExportAllDataDialogOpen,
    setIsExportAllDataDialogOpen
  } = props

  const handleClose = () => {
    setIsExportAllDataDialogOpen(false)
  }

  return (
    <Dialog className={classes.dialog} open={isExportAllDataDialogOpen} onClose={handleClose}>
      <DialogContent className={classes.container}>
        <Content
          supplyData={supplyData}
          handleClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  )
}

export default withRouter(ExportAllDataDialog)
