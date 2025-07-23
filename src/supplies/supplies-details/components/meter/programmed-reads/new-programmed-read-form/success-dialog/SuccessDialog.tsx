import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import { DialogContent, DialogContentText, DialogActions } from '@material-ui/core'

import CloseIcon from '../../../../../../../assets/icons/cerrar.svg'
import OkIcon from '../../../../../../../assets/icons/aviso_ok.svg'
import alertaIcon from '../../../../../../../assets/icons/aviso_alerta_pop_up.svg'
import ErrorIcon from '../../../../../../../assets/icons/Interfaz_24_cruz_cerrar_error_rojo.svg'

import Dialog from '../../../../../../../common/components/dialog/Dialog'
import Button from '../../../../../../../common/components/button/Button'

import useStyles from './SuccessDialog.styles'

const StormWarningSuccessDialog = (props: any) => {
  const classes = useStyles({})

  const [minutes, setMinutes] = useState('')
  const [type, setType] = useState('')

  const { t } = useTranslation()

  const {
    showing,
    connectionError,
    handleReturn,
    deleteMessage,
    handleDeletePorgrammedQuery,
    programmedQuery
  } = props


  useEffect(() => {
    // parseamos los datos de la hora
    if (programmedQuery.hour) {
      if (programmedQuery.hour.getMinutes() === 0) {
        setMinutes('00')
      }
      else {
        setMinutes(programmedQuery.hour.getMinutes())
      }
    }
    //parseamos los datos del typo de programmedQuery
    if (programmedQuery.recurrent && programmedQuery.recurrent === 1) {

      if (programmedQuery.type === 'daily') {
        setType('diaria')
      }
      else if (programmedQuery.type === 'weekly') {
        setType('mensual')
      }
      else {
        setType('anual')
      }

    }

  }, [programmedQuery])

 
function compararFechasYProcesar(programmedDate, endDate) {
    const partesProgrammedDate = programmedDate.split('/');
    const partesEndDate = endDate ? endDate.split('/') : '';

    const programmed = new Date(partesProgrammedDate[2], partesProgrammedDate[1] - 1, partesProgrammedDate[0]);
    const end = new Date(partesEndDate[2], partesEndDate[1] - 1, partesEndDate[0]);

    if (programmed > end) {
        return endDate;
    } else {
        return programmedDate;
    }
}

  return (
    <Dialog
      open={showing}
      onClose={handleReturn}
      className={classes.dialog}
    >
      <DialogContent className={classes.container}>
        {connectionError ?
          (<>
            {/* dialog de error de connexion */}
            <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleReturn} />

            <DialogContentText>
              <Grid container className={classes.content} direction='column' spacing={3} alignItems='center' justifyContent='center'>
                <Grid item>
                  <img src={ErrorIcon} className={classes.icon} alt='' />
                </Grid>

                <Grid item className={classes.title}>
                  {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.successDialog.title2')}
                </Grid>
                <Grid item className={classes.description}>
                  {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.successDialog.description')}
                </Grid>
              </Grid>
            </DialogContentText>

            <DialogActions>
              <Grid container alignItems='center' justifyContent='center'>
                <Button
                  text='Cerrar'
                  color='primary'
                  size='large'
                  variant='contained'
                  onClick={handleReturn}
                />
              </Grid>
            </DialogActions>

          </>
          ) :
          deleteMessage ?
            (
              <>
                {/* dialog de confirmar eliminacion de lectura programada */}
                <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleReturn} />

                <DialogContentText>
                  <Grid container className={classes.content} direction='column' spacing={3} alignItems='center' justifyContent='center'>
                    <Grid item>
                      <img src={alertaIcon} className={classes.icon} alt='' />
                    </Grid>

                    {/* miramos si es recurrente o no */}
                    {programmedQuery.recurrent === 0 ?
                      (<Grid item className={classes.title2}>
                        {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.successDialog.title3')}
                        {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.successDialog.title31')}
                        {programmedQuery.programmedDate}
                        {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.successDialog.title33')}
                        {programmedQuery.hour.getHours()}
                        :
                        {minutes}
                        {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.successDialog.title34')}


                      </Grid>
                      ) : (
                        <Grid item className={classes.title2}>
                          {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.successDialog.title3')}
                          {type}
                          {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.successDialog.title31')}
                          {(programmedQuery && programmedQuery.creationDate) ? programmedQuery.creationDate : compararFechasYProcesar(programmedQuery.programmedDate,programmedQuery.endDate)}
                          {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.successDialog.title32')}
                          {programmedQuery.endDate}
                          {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.successDialog.title33')}
                          {programmedQuery.hour.getHours()}
                          :
                          {minutes}
                          {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.successDialog.title34')}
                        </Grid>)
                    }
                  </Grid>
                </DialogContentText>

                <DialogActions>
                  <Grid container alignItems='center' justifyContent='space-between'>
                    <Button
                      className={classes.button}
                      text={t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.successDialog.cancel')}
                      color='secondary'
                      size='large'
                      variant='contained'
                      onClick={handleReturn}
                    />
                    <Button
                      text={t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.successDialog.programingDelete')}
                      color='primary'
                      size='large'
                      variant='contained'
                      onClick={handleDeletePorgrammedQuery}
                    />
                  </Grid>
                </DialogActions>

              </>
            ) : (
              <>
                {/* dialog de lectura programada creada correctamente */}
                <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleReturn} />

                <DialogContentText>
                  <Grid container className={classes.content} direction='column' spacing={3} alignItems='center' justifyContent='center'>
                    <Grid item>
                      <img src={OkIcon} className={classes.icon} alt='' />
                    </Grid>

                    <Grid item className={classes.title}>
                      {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.successDialog.title')}
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
                      onClick={handleReturn}
                    />
                  </Grid>
                </DialogActions>
              </>
            )

        }


      </DialogContent>
    </Dialog>
  )
}

export default StormWarningSuccessDialog
