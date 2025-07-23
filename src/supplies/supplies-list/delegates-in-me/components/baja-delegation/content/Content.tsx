import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { DialogActions } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'

import Spinner from '../../../../../../common/components/spinner/Spinner'
import TextButton from '../../../../../../common/components/text-button/TextButton'
import Button from '../../../../../../common/components/button/Button'
import AlertIcon from '../../../../../../assets/icons/aviso_alerta_pop_up.svg'
import CloseIcon from '../../../../../../assets/icons/cerrar.svg'

import { resetDelegationsToDelete } from '../../../../../store/actions/SuppliesActions'
import { thunkDeleteDelegations } from '../../../../store/actions/SuppliesListThunkActions'

import useStyles from './Content.styles'

const Content = (props: any) => {
  let delegationsInMeToDelete = useSelector((state: any) => state.delegations.delegationsToDelete)
  
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const classes = useStyles({})

  const { closeFunction } = props

  const [ bajingDelegation, setBajingDelegation ] = useState(false)

  const deleteFunction = () => {
     
      setBajingDelegation(true)

      dispatch(thunkDeleteDelegations(delegationsInMeToDelete, () => {
        setBajingDelegation(false)

        closeFunction()

        dispatch(resetDelegationsToDelete())

        // Forzamos a que se actualice la pagina tras el borrado
        window.location.reload(true)

      }))
  }

  return (
    <>
        {
          bajingDelegation &&
            <Spinner />
        } 
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
              {t('delegations.bajaDelegation')}
            </Grid>

            <Grid item className={classes.subTitle2}>
              {t('delegations.sendNotify')}
            </Grid>
          </Grid>
        </Grid>

        <DialogActions>
          <Grid container direction='row' justifyContent='center' className={classes.buttons}>
            <Button
              className={classes.button}
              text={t('common.buttons.cancel')}
              color='inherit'
              size='large'
              variant='contained'
              onClick={closeFunction}
            />

            <Button
              className={classes.button}
              text={t('common.buttons.accept')}
              color='primary'
              size='large'
              variant='contained'
              onClick={deleteFunction}
            />
          </Grid>
        </DialogActions>
    </>
  )
}

export default Content
