import React from 'react'

import Dialog from '../../../../../common/components/dialog/Dialog'
import Content from './content/Content'

const LocationModal = (props: any) => {
  const {
    isLocationModalVisible,
    closeDialog,
    handleAcceptLocationDialog,
    stateList,
    selectedState,
    setSelectedState,
    streetName,
    number
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
        streetName={streetName}
        number={number}
      />
    </Dialog>
  )
}

export default LocationModal
