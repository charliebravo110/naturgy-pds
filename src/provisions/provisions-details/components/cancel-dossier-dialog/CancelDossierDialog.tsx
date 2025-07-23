import React from 'react'

import Dialog from '../../../../common/components/dialog/Dialog'

import Content from './content/Content'

import useStyles from './CancelDossierDialog.styles'

const CancelDossierDialog = (props: any) => {
  const classes = useStyles({})

  const {
    showing,
    setShowing,
    currentProvision
  } = props

  const handleCloseDialog = () => {
    setShowing(false)
  }

  return (
    <Dialog className={classes.dialog} open={showing} onClose={handleCloseDialog}>
      <Content setShowing={setShowing} handleCloseDialog={handleCloseDialog} currentProvision={currentProvision}/>
    </Dialog>
  )
}

export default CancelDossierDialog
