import React from 'react'

import Grid from '@material-ui/core/Grid'
import { DialogContent, DialogContentText, DialogActions } from '@material-ui/core'

import CloseIcon from '../../../../assets/icons/cerrar.svg'
import AlertIcon from '../../../../assets/icons/aviso_alerta_pop_up.svg'

import Dialog from '../../../../common/components/dialog/Dialog'
import Button from '../../../../common/components/button/Button'

import useStyles from './NoSupplyDataDialog.styles'

const NoSupplyDataDialog = (props: any) => {
  const classes = useStyles({})

  const { 
    showingDialog,
    setShowingDialog
  } = props

  const handleCloseDialog = () => {
    setShowingDialog(false)
    props.history.push('/supplies')
  }
  
  return (
    <Dialog 
      open={showingDialog} 
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
           setShowingDialog(false)
        }
    }}
      disableEscapeKeyDown
    >
      <DialogContent className={classes.container}>
        <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleCloseDialog} />
        <DialogContentText>
          <Grid container className={classes.content} direction='column' spacing={3} alignItems='center' justifyContent='center'>
            <Grid item>
              <img src={AlertIcon} alt='' />
            </Grid>
            <Grid item className={classes.title}>
              Lo sentimos
            </Grid>
            <Grid item className={classes.subtitle}>
              No hay datos disponibles a mostrar en este punto de suministro.
            </Grid>
          </Grid>
        </DialogContentText>
        <DialogActions>
          <Grid container alignItems='center' justifyContent='center'>
            <Button
              text='Aceptar'
              color='primary'
              size='large'
              variant='contained'
              onClick={handleCloseDialog}
            />
          </Grid>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export default NoSupplyDataDialog