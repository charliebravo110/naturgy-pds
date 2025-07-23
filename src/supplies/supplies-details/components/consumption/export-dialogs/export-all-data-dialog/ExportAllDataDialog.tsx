import React from 'react'
import { withRouter } from 'react-router-dom'

import { DialogContent } from '@material-ui/core'

import Dialog from '../../../../../../common/components/dialog/Dialog'
import Content from './content/Content'

import useStyles from './ExportAllDataDialog.styles'

const ExportAllDataDialog = (props: any) => {
  const classes = useStyles({})

  const {
    supplyData,
    supplantedUser,
    isExportAllDataDialogOpen,
    closeDialog,
    isGeneration,
    isGenerationTab,
    isSelfConsumption
  } = props

  const handleClose = () => {
    closeDialog(false)
  }

  return (
    <Dialog className={classes.dialog} open={isExportAllDataDialogOpen} onClose={handleClose}>
      <DialogContent className={classes.container}>
      <Content
        supplyData={supplyData}
        supplantedUser={supplantedUser}
        handleClose={handleClose}
        isGeneration={isGeneration}
        isGenerationTab={isGenerationTab}
        isSelfConsumption={isSelfConsumption}
      />
      </DialogContent>
    </Dialog>
  )
}

export default withRouter(ExportAllDataDialog)
