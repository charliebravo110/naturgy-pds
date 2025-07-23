import React from 'react'

import { DialogContent } from '@material-ui/core'

import Dialog from '../../../../../../common/components/dialog/Dialog'
import Content from './content/Content'

import useStyles from './DelegationProfile.styles'

const DelegationProfile = (props: any) => {
  const { popup, setPopup, popupStatus, setPopupStatus, setIsLoading } = props

  const classes = useStyles({})

  const closePopup = () => {
    setPopup(false)
  }

  return (
    <Dialog open={popup} onClose={closePopup}>
      <DialogContent className={classes.modalContainer}>
        <Content
          closePopup={closePopup}
          popupStatus={popupStatus}
          setPopupStatus={setPopupStatus}
          setIsLoading={setIsLoading}
        />
      </DialogContent>
    </Dialog>
  )
}

export default DelegationProfile
