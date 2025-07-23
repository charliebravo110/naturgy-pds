import React from 'react'

import { DialogContent } from '@material-ui/core'

import Dialog from '../../../../../common/components/dialog/Dialog'
import Content from './content/Content'

import useStyles from './BajaDelegation.styles'

const BajaDelegation = (props: any) => {
  const classes = useStyles({})

  const { open, closeFunction } = props

  if(!open) {
    return (<React.Fragment/>)
  }
  else {
    return (
      <Dialog open={open} onClose={closeFunction}>
        <DialogContent className={classes.modalContainer}>
          <Content closeFunction={closeFunction} />
        </DialogContent>
      </Dialog>
    )
  }
}

export default BajaDelegation