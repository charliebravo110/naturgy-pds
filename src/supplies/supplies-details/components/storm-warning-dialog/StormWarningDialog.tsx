import React from 'react'
import { withRouter } from 'react-router-dom'

import { DialogContent } from '@material-ui/core'

import Dialog from '../../../../common/components/dialog/Dialog'
import Content from './content/Content'

import useStyles from './StormWarningDialog.styles'

const StormWarningDialog = (props: any) => {
  const classes = useStyles({})

  const {
    showingDialog,
    handleReturn,
    supplyData,
    user,
    setShowingStormWarningSuccessDialog,
    setStormWarningSrCode
  } = props

  return (
    <Dialog className={classes.dialog} open={showingDialog} onClose={handleReturn}>
      <DialogContent className={classes.container}>
        <Content
          handleReturn={handleReturn}
          supplyData={supplyData}
          user={user}
          setShowingStormWarningSuccessDialog={setShowingStormWarningSuccessDialog}
          setStormWarningSrCode={setStormWarningSrCode}
        />
      </DialogContent>
    </Dialog>
  )
}

export default withRouter(StormWarningDialog)
