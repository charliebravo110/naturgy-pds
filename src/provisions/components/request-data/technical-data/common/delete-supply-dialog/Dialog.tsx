import React, { useState } from 'react'

import Grid from '@material-ui/core/Grid'
import { DialogContent } from '@material-ui/core'

import CloseIcon from '../../../../../../assets/icons/cerrar.svg'

import Dialog from '../../../../../../common/components/dialog/Dialog'
import TextButton from '../../../../../../common/components/text-button/TextButton'

import DeleteAdvert from './delete-advert/DeleteAdvert'
import DeleteSuccess from './delete-success/DeleteSuccess'

import useStyles from './Dialog.styles'

const DeleteSupplyDialog = (props: any) => {
  const classes = useStyles({})

  const [ dialogState, setDialogState ] = useState(0)

  const {
    powerList,
    setPowerListI,
    powerListErrors,
    setPowerListErrors,
    supplyIndex,
    popup, 
    setPopup
  } = props

  return (
    <Dialog open={popup} onClose={() => setPopup(false)}>
      <DialogContent className={classes.modalContainer}>
        <Grid container justifyContent='flex-end'>
          <TextButton className={classes.closeButton} onClick={() => setPopup(false)}>
            <img src={CloseIcon} alt='' />
          </TextButton>
        </Grid>
        <Grid className={classes.modalText}>
          {
            dialogState === 0 ?
              <DeleteAdvert 
                powerList={powerList}
                setPowerListI={setPowerListI}
                powerListErrors={powerListErrors}
                setPowerListErrors={setPowerListErrors}
                supplyIndex={supplyIndex}
                setPopup={setPopup}
                setDialogState={setDialogState}
              />
            :
              <DeleteSuccess
                setPopup={setPopup}
                setDialogState={setDialogState}
              />
          }
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteSupplyDialog
