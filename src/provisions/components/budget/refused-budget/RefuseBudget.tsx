import React from 'react'

import Dialog from '../../../../common/components/dialog/Dialog'

import Content from './content/Content'
import { DialogContent } from '@material-ui/core'

import useStyles from './RefuseBudget.styles'

const RefuseBudget = (props: any) => {
  const classes = useStyles({})

  const {
    showing,
    setShowing,
    tipology,
    setRefusedBudget,
    setMessage,
    setMessage2,
    propPrev
  } = props

  const handleCloseDialog = () => {
    setShowing(false)
  }

  return (
  <>
    <Dialog className={classes.dialog} open={showing} onClose={handleCloseDialog}>
      <DialogContent className={classes.modalContainer}>
        <Content 
          setShowing={setShowing} 
          handleCloseDialog={handleCloseDialog} 
          tipology={tipology}
          setRefusedBudget={setRefusedBudget}
          setMessage={setMessage}
          setMessage2={setMessage2}
          propPrev={propPrev}
        />
      </DialogContent>
    </Dialog>
  </>
  )
}

export default RefuseBudget
