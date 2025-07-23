import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { DialogContent, DialogActions } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'

import { useTranslation } from 'react-i18next'

import Dialog from '../../../../common/components/dialog/Dialog'
import TextButton from '../../../../common/components/text-button/TextButton'
import Button from '../../../../common/components/button/Button'
import AlertIcon from '../../../../assets/icons/aviso_alerta_pop_up.svg'
import CloseIcon from '../../../../assets/icons/cerrar.svg'

import useStyles from './RepeatedDialog.styles'

const RepeatedDialog = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { open, closeFunction } = props

  return (
    <Dialog open={open} onClose={closeFunction}>
      <DialogContent className={classes.modalContainer}>
        <Grid container justifyContent='flex-end'>
          <TextButton className={classes.closeButton} onClick={closeFunction}>
            <img src={CloseIcon} alt='' />
          </TextButton>
        </Grid>

        <Grid className={classes.modalText}>
          <Grid container direction='column' justifyContent='center' alignItems='center' spacing={1}>
            <Grid item>
              <img src={AlertIcon} alt='' />
            </Grid>

            <Grid item className={classes.title}>
              {t('provisions.newGeneration.requestData.technicalData.repeatedDescription')}
            </Grid>

          </Grid>
        </Grid>

        <DialogActions>
          <Grid container direction='row' justifyContent='center' className={classes.buttons}>
              <Button
                className={classes.button}
                text={t('common.buttons.accept')}
                color='primary'
                size='large'
                variant='contained'
                onClick={closeFunction}
              />
          </Grid>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export default RepeatedDialog
