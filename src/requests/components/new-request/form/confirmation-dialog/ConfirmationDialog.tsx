import React from 'react'

import Dialog from '../../../../../common/components/dialog/Dialog'
import Content from './content/Content'

import useStyles from './ConfirmationDialog.styles'

const ConfirmationDialog = (props: any) => {
  const classes = useStyles({})

  const {
    visible,
    setVisible
  } = props

  return (
    <Dialog className={classes.dialog} open={visible} onClose={setVisible}>
      <Content setVisible={setVisible} />
    </Dialog>
  )
}

export default ConfirmationDialog
