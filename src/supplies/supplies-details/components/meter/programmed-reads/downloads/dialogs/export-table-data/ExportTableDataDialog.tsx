import React from 'react'
import { withRouter } from 'react-router-dom'

import { DialogContent } from '@material-ui/core'

import Dialog from '../../../../../../../../common/components/dialog/Dialog'
import Content from './content/Content'

import useStyles from './ExportTableDataDialog.styles'

const ExportTableDataDialog = (props: any) => {
  const classes = useStyles({})

  const {
    supplyData,
    isExportTableDataDialogOpen,
    setIsExportTableDataDialogOpen
  } = props

  const handleClose = () => {
    setIsExportTableDataDialogOpen(false)
  }

  return (
    <Dialog className={classes.dialog} open={isExportTableDataDialogOpen} onClose={handleClose}>
      <DialogContent className={classes.container}>
        <Content
          supplyData={supplyData}
          handleClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  )
}

export default withRouter(ExportTableDataDialog)
