import React from 'react'

import { DialogContent } from '@material-ui/core'

import Content from './content/Content'

import Dialog from '../../../common/components/dialog/Dialog'

import useStyles from './Dialog.styles'

const Modal = (props: any) => {
  const classes = useStyles({})

  const {
    history,
    showingDialog,
    setShowingDialog,
    suppliesList,
    setSuppliesList,
    selectedItemsList,
    setSelectedItemsList,
    delegatesList,
    loadingDelegatesList,
    setLoadingDelegatesList,
    delegateRole,
    handleOpenAlert
  } = props

  const handleCloseDialog = () => {
    setShowingDialog(false)

    setLoadingDelegatesList(true)
  }

  return (
    <Dialog className={classes.dialog} open={showingDialog} onClose={handleCloseDialog} {...props}>
      <DialogContent className={classes.container}>
        <Content
          history={history}
          handleCloseDialog={handleCloseDialog}
          suppliesList={suppliesList}
          setSuppliesList={setSuppliesList}
          selectedItemsList={selectedItemsList}
          setSelectedItemsList={setSelectedItemsList}
          delegatesList={delegatesList}
          loadingDelegatesList={loadingDelegatesList}
          delegateRole={delegateRole}
          handleOpenAlert={handleOpenAlert}
        />
      </DialogContent>
    </Dialog>
  )
}

export default Modal
