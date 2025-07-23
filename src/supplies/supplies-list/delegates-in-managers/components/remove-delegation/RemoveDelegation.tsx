import React from 'react'

import { DialogContent } from '@material-ui/core'

import Dialog from '../../../../../common/components/dialog/Dialog'
import Content from './content/Content'

import useStyles from './RemoveDelegation.styles'

const RemoveDelegation = (props: any) => {
  const classes = useStyles({})

  const { open, closeFunction } = props

  return (
    <Dialog open={open} onClose={closeFunction}>
      <DialogContent className={classes.modalContainer}>
        <Content closeFunction={closeFunction} />
      </DialogContent>
    </Dialog>
  )
}

export default RemoveDelegation
