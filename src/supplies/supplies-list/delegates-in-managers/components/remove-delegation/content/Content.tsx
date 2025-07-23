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
  let delegationsToDelete = useSelector((state: any) => state.delegations.delegationsToDelete)

  const dispatch = useDispatch()
  const { t } = useTranslation()
  const classes = useStyles({})

  const { closeFunction } = props

  const [ removingDelegation, setRemovingDelegation ] = useState(false)

  const deleteFunction = () => {
    setRemovingDelegation(true)

    dispatch(thunkDeleteDelegations(delegationsToDelete, () => {
      setRemovingDelegation(false)

      closeFunction()

      dispatch(resetDelegationsToDelete())
    }))
  }

  return (
    <>
        {
          removingDelegation &&
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
              {t('delegations.deleteDelegation')}
            </Grid>

          </Grid>
        </Grid>

        <DialogActions>
          <Grid container direction='row' justifyContent='center' className={classes.buttons}>
            <Button
              className={classes.button}
              text={t('common.buttons.no')}
              color='inherit'
              size='large'
              variant='contained'
              onClick={closeFunction}
            />

            <Button
              className={classes.button}
              text={t('common.buttons.yes')}
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
