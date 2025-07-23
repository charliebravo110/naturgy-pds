import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { withRouter } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { DialogActions } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'


import AlertIcon from '../../../../../../../assets/icons/aviso_alerta_pop_up.svg'
import CloseIcon from '../../../../../../../assets/icons/cerrar.svg'



import useStyles from './Content.styles'
import Spinner from '../../../../../../../common/components/spinner/Spinner'
import TextButton from '../../../../../../../common/components/text-button/TextButton'
import Button from '../../../../../../../common/components/button/Button'

const DeleteConfirmationDialog = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    handleClose,
    handleAddOtherDoc
  } = props

 

  const [ isLoading, setIsLoading ] = useState(false)

  const handleCancel = () => {
    handleClose()
  }

  const handleAccept = () => {
    handleClose()
    handleAddOtherDoc()
  }

  return (
    <>
      {
        isLoading &&
          <Spinner fixed={true} />
      }

        <Grid container justifyContent='flex-end'>
          <TextButton className={classes.closeButton} onClick={handleClose}>
            <img src={CloseIcon} alt='' />
          </TextButton>
        </Grid>

        <div className={classes.modalText}>
          <Grid container direction='column' justifyContent='center' alignItems='center' spacing={1}>
            <Grid item>
              <img src={AlertIcon} alt='' />
            </Grid>

            <Grid item className={classes.title}>
              {t('provisions.documentation.addOtherDocDialog.dnInfo.text1')} 
            </Grid>

            <Grid item className={classes.title}>
              <b>{t('provisions.documentation.addOtherDocDialog.dnInfo.text2')}</b>
            </Grid>

            <Grid item className={classes.title}>
              <b>{t('provisions.documentation.addOtherDocDialog.dnInfo.text3')}</b>
            </Grid>
            

          </Grid>
        </div>

        <DialogActions>
          <Grid container direction='row' justifyContent='center' className={classes.buttons}>
            <Button
              className={classes.button}
              text={t('common.buttons.cancel')}
              color='inherit'
              size='large'
              variant='contained'
              onClick={handleCancel}
            />

            <Button
              className={classes.button}
              text={t('common.buttons.accept')}
              color='primary'
              size='large'
              variant='contained'
              onClick={handleAccept}
            />
          </Grid>
        </DialogActions>
    </>
  )
}

export default withRouter(DeleteConfirmationDialog)
