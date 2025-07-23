import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import {  Grid } from '@material-ui/core'
import Button from '../../../../common/components/button/Button'
import AlertIcon from '../../../../assets/icons/aviso_alerta_pop_up.svg'



import useStyles from './DeleteUpForm.styles'


const DeleteUpForm = (props: any) => {

  // Callback para cerrar el popup.
  const {
    handleAccept,
    handleClose,
    name,
    surname,
    doc
  } = props

  // Constante para usar los estilos.
  const classes = useStyles({})

  // Función para las traducciones.
  const { t } = useTranslation()

  // Constante para usar el dispatch.
  const dispatch = useDispatch()

  // Constante con los datos del usuario buscado para suplantar.
  const user = useSelector((state: any) => state.admin.searchedUser)


  return (
    <>
    <Grid container>

      <Grid container className={classes.preRegister}>
        <Grid item>
          {(<img src={AlertIcon} alt='Alert Icon' />)}
        </Grid>
      </Grid>


    
      <Grid container className='row title'style={{ fontSize: '20px' }}>{t('gestionUsuarios.management.deleteUser.popup')}</Grid>
      {/* <Grid container className='row description'>{t('pre-register.popupDescription')}</Grid> */}

      <Grid container className='row title'style={{ fontSize: '20px' }}>{doc+' - '+name+' '+surname+' '+ t('gestionUsuarios.management.deleteUser.popupEnd')}</Grid>



      <Grid container className='buttons'>
        <Grid item className={classes.button}>
          <Button
            text={t('pre-register.buttonNo')}
            color='primary'
            size='large'
            variant='outlined'
            onClick={handleClose}
          />
        </Grid>

        <Grid item className={classes.button}>
          <Button
            text={t('pre-register.confirm')}
            color='primary'
            size='large'
            variant='contained'
            onClick={handleAccept}
          />
        </Grid>
      </Grid>
    </Grid>
    </>
  )
}

export default DeleteUpForm
