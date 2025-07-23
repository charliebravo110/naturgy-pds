import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'

import { DialogContent } from '@material-ui/core'

import Dialog from '../../../../../../common/components/dialog/Dialog'
import Content from './content/Content'

import useStyles from './ExportPeriodDataDialog.styles'

const ExportPeriodDataDialog = (props: any) => {
  const classes = useStyles({})

  const {
    supplyData,
    supplantedUser,
    isExportPeriodDataDialogOpen,
    closeDialog,
    isGeneration,
    isGenerationTab,
    isSelfConsumption,
    billingStartDate,
    billingEndDate
  } = props

  const handleClose = () => {
    closeDialog(false)
  }

  return (
    <Dialog className={classes.dialog} open={isExportPeriodDataDialogOpen} onClose={handleClose}>
      <DialogContent className={classes.container}>
        <Content
          supplyData={supplyData}
          supplantedUser={supplantedUser}
          isExportPeriodDataDialogOpen={isExportPeriodDataDialogOpen}
          handleClose={handleClose}
          isGeneration={isGeneration}
          isGenerationTab={isGenerationTab}
          isSelfConsumption={isSelfConsumption}
        />
      </DialogContent>
    </Dialog>
  )
}

export default withRouter(ExportPeriodDataDialog)
