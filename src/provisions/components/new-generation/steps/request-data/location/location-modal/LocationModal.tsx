import React from 'react'

import Dialog from '../../../../../../../common/components/dialog/Dialog'
import Content from './content/Content'

const LocationModal = (props: any) => {
  const {
    isLocationModalVisible,
    closeDialog,
    handleAcceptLocationDialog,
    stateList,
    selectedState,
    setSelectedState,
    isRustic
  } = props

  const handleCloseDialog = () => {
    setSelectedState(0)

    closeDialog(false)
  }

  return (
    <Dialog open={isLocationModalVisible} onClose={handleCloseDialog} {...props}>
      <Content
        handleCloseDialog={handleCloseDialog}
        handleAcceptDialog={handleAcceptLocationDialog}
        stateList={stateList}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        isRustic={isRustic}
      />
    </Dialog>
  )
}

export default LocationModal
