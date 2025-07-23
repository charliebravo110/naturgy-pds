import React from 'react'
import { withRouter } from 'react-router-dom'

import { DialogContent } from '@material-ui/core'

import Dialog from '../../../../../../common/components/dialog/Dialog'
import Content from './content/Content'

import useStyles from './ExportTableDataDialog.styles'

const ExportTableDataDialog = (props: any) => {
  const classes = useStyles({})

  const {
    supplyData,
    currentSupplyConsumptions,
    currentCompareConsumptions,
    isExportTableDataDialogOpen,
    closeDialog,
    mode,
    isGeneration,
    isGenerationTab,
    consumptionsFilters,
    isSelfConsumption,
    energiaReactiva
  } = props

  const handleClose = () => {
    closeDialog(false)
  }

  return (
    <Dialog className={classes.dialog} open={isExportTableDataDialogOpen} onClose={handleClose}>
      <DialogContent className={classes.container}>
        <Content
          supplyData={supplyData}
          handleClose={handleClose}
          currentSupplyConsumptions={currentSupplyConsumptions}
          currentCompareConsumptions={currentCompareConsumptions}
          mode={mode}
          isGeneration={isGeneration}
          isGenerationTab={isGenerationTab}
          consumptionsFilters={consumptionsFilters}
          isSelfConsumption={isSelfConsumption}
          energiaReactiva={energiaReactiva}
        />
      </DialogContent>
    </Dialog>
  )
}

export default withRouter(ExportTableDataDialog)
