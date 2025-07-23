import React from 'react'

import { Dialog, DialogContent, Grid } from '@material-ui/core'
import CloseIcon from '../../../../../assets/icons/cerrar_submenu.svg'


import useStyles from './DeleteUpModal.styles'

import DeleteUpForm from '../DeleteUpForm'




const DeleteUpModal = ({ isOpen, handleAccept, handleClose, doc, name,surname }) => {

  // Constante para usar los estilos.
  const classes = useStyles({})

  // Función para controlar el submit del formulario.
  const handleCloseDialog = () => {
    handleClose()
  }

    // Función para controlar el submit del formulario.
    const handleOpenDialog = () => {
      handleAccept()
      handleClose()
    }

  return (
    <>
      <Dialog className={classes.dialog} open={isOpen}>
        <DialogContent className={classes.dialogContainer}>
          <img src={CloseIcon} className={classes.closeButton} onClick={handleClose} />
          <Grid container className={classes.preRegister}>
            <Grid item>
              <DeleteUpForm handleClose={handleCloseDialog} doc={doc} name={name} surname={surname} handleAccept={handleOpenDialog} />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DeleteUpModal
