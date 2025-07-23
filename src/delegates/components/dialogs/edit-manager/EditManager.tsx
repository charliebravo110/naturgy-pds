import React from 'react'

import Grid from '@material-ui/core/Grid'
import { DialogContent } from '@material-ui/core'

import OkIcon from '../../../../assets/icons/aviso_ok.svg'
import Alert from '../../../../assets/icons/aviso_alerta_pop_up.svg'
import CloseIcon from '../../../../assets/icons/cerrar.svg'

import Dialog from '../../../../common/components/dialog/Dialog'
import TextButton from '../../../../common/components/text-button/TextButton'

import useStyles from './EditManager.styles'

const EditManager = (props: any) => {
  const classes = useStyles({})

  const { success, popup, setPopup } = props

  return (
    <Dialog open={popup} onClose={() => setPopup(false)}>
      <DialogContent className={classes.modalContainer}>
        <Grid container justifyContent='flex-end'>
          <TextButton className={classes.closeButton} onClick={() => setPopup(false)}>
            <img src={CloseIcon} alt='' />
          </TextButton>
        </Grid>
        <Grid className={classes.modalText}>
          <Grid container direction='column' justifyContent='center' alignItems='center' spacing={1}>
            <Grid item>
              {
                success ? 
                <img src={OkIcon} alt='' />
                :
                <img src={Alert} alt='' />
              }
            </Grid>

            <Grid item className={classes.title}>
              {props.children}
            </Grid>

          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default EditManager