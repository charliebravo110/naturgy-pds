import React from 'react'

import { Dialog, DialogContent, Grid } from '@material-ui/core'
import CloseIcon from '../../../assets/icons/cerrar_submenu.svg'
import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg'

import useStyles from './PreSmsModal.styles'

import PreInviteSmsForm from '../form/PreInviteSmsForm'

 
const PreSmsModal = ({ isOpen, handleClose,user,searchedUsersLogin}) => {
 


  // Constante para usar los estilos.
  const classes = useStyles({})


  // Función para controlar el submit del formulario.
  const handleCloseDialog = () => {
    handleClose()
  }

  return (
    <>
      <Dialog className={classes.dialog} open={isOpen}>
        <DialogContent className={classes.dialogContainer}>
          <img src={CloseIcon} className={classes.closeButton} onClick={handleClose} />
          <Grid container className={classes.preRegister}>
            <Grid item>
              <img src={AlertIcon} />
              <PreInviteSmsForm handleClose={handleCloseDialog} user={user} searchedUsersLogin={searchedUsersLogin}/>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PreSmsModal
