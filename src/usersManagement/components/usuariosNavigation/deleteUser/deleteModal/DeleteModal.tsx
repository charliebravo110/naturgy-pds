import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DialogContent, DialogContentText } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'

import Dialog from '../../../../../common/components/dialog/Dialog'
import TextButton from '../../../../../common/components/text-button/TextButton'
import OkIcon from '../../../../../assets/icons/aviso_ok.svg'
import CloseIcon from '../../../../../assets/icons/cerrar.svg'

import useStyles from './DeleteModal.styles'

const DeleteModal = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const [ open, setOpen ] = useState(false)

  const handleClose = () => {
    setOpen(false)
    
    props.closeaux(false)
  }

  return (
    <Dialog open={open} onClose={handleClose} {...props}>
      <DialogContent className={classes.modalContainer}>
        <Grid container justifyContent='flex-end'>
          <TextButton className={classes.closeButton} onClick={handleClose}>
            <img src={CloseIcon} alt='' />
          </TextButton>
        </Grid>

        <DialogContentText className={classes.modalText}>
          <Grid container direction='column' justifyContent='center' alignItems='center' spacing={1}>
            <Grid item>
              <img src={OkIcon} alt='' />
            </Grid>

            <Grid item className={classes.title}>
              {t('gestionUsuarios.management.deleteUser.popUpTitle')}
            </Grid>

            <Grid item className={classes.subTitle}>
              {t('gestionUsuarios.management.deleteUser.popUpSubtitle')}
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteModal