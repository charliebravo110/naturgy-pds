import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import { DialogContent } from '@material-ui/core'

import CloseIcon from '../../../../assets/icons/cerrar.svg'

import Dialog from '../../../../common/components/dialog/Dialog'
import TextButton from '../../../../common/components/text-button/TextButton'
import Location from './location/Location'

import useStyles from './AddPlanDialog.styles'

const AddPlanDialog = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const { popup, setPopup, setNewDocumentsRecieved } = props

  return (
    <Dialog open={popup} onClose={() => setPopup(false)}>
      <DialogContent className={classes.modalContainer}>
        <Grid container justifyContent='flex-end'>
          <TextButton className={classes.closeButton} onClick={() => setPopup(false)}>
            <img src={CloseIcon} alt='' />
          </TextButton>
        </Grid>
        <Grid className={classes.modalText}>
          <Grid container justifyContent='center' alignItems='center'>
            <Grid item className={classes.title}>
            {t('provisions.documentation.dialogTitle')}
            </Grid>
          </Grid>
          <Location setPopup={setPopup} setNewDocumentsRecieved={setNewDocumentsRecieved} />
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default AddPlanDialog
