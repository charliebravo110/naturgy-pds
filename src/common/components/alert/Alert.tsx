import React from 'react'
import Dialog from '../dialog/Dialog'

import Button from '../button/Button'
import TextButton from '../text-button/TextButton'
import CloseIcon from '../../../assets/icons/cerrar.svg'
import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg'

import Grid from '@material-ui/core/Grid'
import { DialogContent } from '@material-ui/core'

import useStyles from './Alert.styles'

const Alert = (props: any) => {
  const classes = useStyles({})
  const { openAlert, setOpenAlert, message } = props

  const handleCloseAlert = () => {
    setOpenAlert(false)
  }

  return (
    <Dialog className={classes.dialog} open={openAlert} onClose={handleCloseAlert} {...props}>
      <DialogContent>
        <TextButton className={classes.closeButton} onClick={handleCloseAlert}>
          <img src={CloseIcon} alt='' />
        </TextButton>
        <Grid
          container
          className={classes.container}
          direction='column'
          justifyContent='center'
          alignItems='center'
          spacing={2}
        > 
          <Grid item >
            <Grid container className={classes.text} spacing={1}>
              <Grid item xs={12} sm={2} md={2} className={classes.alertBlock}>
                <img src={AlertIcon} className={classes.alertIcon} alt='' onClick={handleCloseAlert} />
              </Grid>
              <Grid item xs={12} sm={10} md={10}>
                <label>{message}</label>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Button
              text='Aceptar'
              color='primary'
              size='large'
              variant='contained'
              className={classes.button}
              onClick={handleCloseAlert}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default Alert
