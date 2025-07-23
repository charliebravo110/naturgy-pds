import React from 'react'

import Dialog from '../../../../common/components/dialog/Dialog'

import Content from './content/Content'
import { DialogContent } from '@material-ui/core'

import useStyles from './AskReasonReview.styles'

const AskReasonReview = (props: any) => {
  const classes = useStyles({})

  const {
    showing,
    setShowing,
    tipology,
    setRevisedBudget,
    setMessage,
    setMessage2,
    propPrev,
    indAceptoFacturaDigital,
    setNewDocumentsRecieved,
    setUploaded,
    setSentDocument,
    setBigFilePopup
  } = props

  const handleCloseDialog = () => {
    setShowing(false)
  }

  return (
  <>
    <Dialog className={classes.dialog} open={showing} onClose={handleCloseDialog}>
        <DialogContent  className={classes.modalContainer}>
            <Content 
                setShowing={setShowing} 
                handleCloseDialog={handleCloseDialog} 
                tipology={tipology}
                setRevisedBudget={setRevisedBudget}
                setMessage={setMessage}
                setMessage2={setMessage2}
                propPrev={propPrev}
                indAceptoFacturaDigital={indAceptoFacturaDigital}
                setNewDocumentsRecieved={setNewDocumentsRecieved}
                setUploaded={setUploaded}
                setSentDocument={setSentDocument}
                setBigFilePopup={setBigFilePopup}
            />
        </DialogContent>
    </Dialog>
  </>
  )
}

export default AskReasonReview

