import React from 'react'
import { withRouter } from 'react-router-dom'

import { DialogContent } from '@material-ui/core'

import Dialog from '../../../../../common/components/dialog/Dialog'
import Content from './content/Content'

import useStyles from './ProgrammedQueryDialog.styles'

const ProgrammedQueryDialog = (props: any) => {
  const classes = useStyles({})

  const {
    modifyProgrammedQuery,
    supplyData,
    handleReturn
  } = props

  return (
    <Dialog className={classes.dialog} open={modifyProgrammedQuery}>
      <DialogContent className={classes.container}>
        <Content
          supplyData={supplyData}
          handleReturn={handleReturn}
        />
      </DialogContent>
    </Dialog>
  )
}

export default withRouter(ProgrammedQueryDialog)
