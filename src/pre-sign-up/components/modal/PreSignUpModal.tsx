import React from 'react'

import { Dialog, DialogContent, Grid } from '@material-ui/core'
import CloseIcon from '../../../assets/icons/cerrar_submenu.svg'


import useStyles from './PreSignUpModal.styles'

import PreSignUpForm from '../form/PreSignUpForm'

const PreSignUpModal = (props:any) => {

   const {
    isOpen,
    handleClose,
    searchedUsersLogin,
    user
  } = props

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
         
              <PreSignUpForm 
                handleClose={handleCloseDialog} 
                searchedUsersLogin={searchedUsersLogin}
                user={user} 
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PreSignUpModal
