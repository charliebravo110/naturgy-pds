import React from 'react'

import Grid from '@material-ui/core/Grid'
import { DialogContent } from '@material-ui/core'

import CloseIcon from '../../../../../assets/icons/cerrar.svg'

import Dialog from '../../../../../common/components/dialog/Dialog'
import TextButton from '../../../../../common/components/text-button/TextButton'

import RejectedBudget from '../RejectedBudget'

import useStyles from './Dialog.styles'

const AddPlanDialog = (props: any) => {
  const classes = useStyles({})

  const { popup, setPopup } = props

  return (
    <Dialog open={popup} onClose={() => setPopup(false)}>
      <DialogContent className={classes.modalContainer}>
        <Grid container justifyContent='flex-end'>
          <TextButton className={classes.closeButton} onClick={() => setPopup(false)}>
            <img src={CloseIcon} alt='' />
          </TextButton>
        </Grid>
        <Grid className={classes.modalText}>
          <RejectedBudget setPopup={setPopup} />
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default AddPlanDialog
