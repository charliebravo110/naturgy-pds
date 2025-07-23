import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { withRouter } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { DialogActions } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'

import Spinner from '../../../../../common/components/spinner/Spinner'
import TextButton from '../../../../../common/components/text-button/TextButton'
import Button from '../../../../../common/components/button/Button'
import AlertIcon from '../../../../../assets/icons/aviso_alerta_pop_up.svg'
import CloseIcon from '../../../../../assets/icons/cerrar.svg'

import { resetToken } from '../../../../../common/store/actions/UserActions'
import { thunkDeleteUser } from '../../../../../common/store/actions/UserThunkActions'
import { thunkGetDelegations, thunkGetDelegatedInMe } from '../../../../../supplies/supplies-list/store/actions/SuppliesListThunkActions'

import useStyles from './Content.styles'
import ZeusWebData from '../../../../../common/interfaces/ZeusWebData'
import { thunkZeusSincro } from '../../../../../common/components/zeus-sincro/ZeusSincroThunkActions'
import { formatDate } from '../../../../../common/lib/FormatLib'

const DeleteConfirmationDialog = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    userId,
    userToken,
    handleClose,
    handleOpenDeleteDelegationsConfirmationDialog,
    handleOpenDeleteDelegatedInMeConfirmationDialog
  } = props

  const [ isLoading, setIsLoading ] = useState(false)

  const handleCancel = () => {
    handleClose()
  }

  const handleAccept = () => {
    setIsLoading(true)

    dispatch(thunkGetDelegations(null, (response1) => {
      const delegations = (response1 && response1.delegations && response1.delegations.items) ? response1.delegations.items : []

      if (delegations.length === 0) {
        dispatch(thunkGetDelegatedInMe(null, (response2) => {
          const delegatedInMe = response2 ? response2 : []

          if (delegatedInMe.length === 0) {
            
            const endDate = new Date()
            const endDateAux = formatDate(endDate).split('/')
            const endDateString = endDateAux[2] + endDateAux[1] + endDateAux[0] + '000000'

            let webData = {
              webEndDate: endDateString,
              webClientId: userId
            } as ZeusWebData
        
            dispatch(thunkZeusSincro(webData, null, () => {
              dispatch(thunkDeleteUser(userId, userToken, setIsLoading, () => {

                handleClose()
  
                dispatch(resetToken())
  
                sessionStorage.clear()
  
                props.history.push({
                  pathname: '/login',
                  state: { open: true }
                })
              }))
            }))
            
          } else {
            handleClose()

            handleOpenDeleteDelegatedInMeConfirmationDialog()
          }
        }))
      } else {
        handleClose()

        handleOpenDeleteDelegationsConfirmationDialog()
      }
    }))
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
              {t('profile.deleteConfirmationDialog.item1')}
            </Grid>

            <Grid item className={classes.subTitle}>
              {t('profile.deleteConfirmationDialog.item2')}
            </Grid>

            <Grid item className={classes.subTitle}>
              {t('profile.deleteConfirmationDialog.item3')} <a href='http://www.ufd.es/nota-legal/' target='_blank' rel='noopener noreferrer'>{t('profile.deleteConfirmationDialog.item4')}</a>
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
