import React from 'react'
import { withRouter } from 'react-router-dom'

import { DialogContent } from '@material-ui/core'

import Dialog from '../../../../../common/components/dialog/Dialog'

import useStyles from './InferiorPower.styles'
import Content from './Content/Content'

const InferiorPower = (props: any) => {
  const classes = useStyles({})

  const {
    inferiorPower,
    handleReturn,
    supply
  } = props

  return (
    <Dialog className={classes.dialog} open={inferiorPower}>
      <DialogContent className={classes.container}>
        <Content
          handleReturn={handleReturn}
          supply={supply}
        />
      </DialogContent>
    </Dialog>
  )
}

export default withRouter(InferiorPower)
