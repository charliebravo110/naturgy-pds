import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import { hideError } from '../../store/actions/ErrorActions'
import closeIcon from '../../../assets/icons/cerrar_blanco.svg'

import useStyles from './ErrorMessage.styles'

export default function ErrorMessages() {
  const dispatch = useDispatch()
  const code = useSelector((state: any) => state.error.code)
  const message = useSelector((state: any) => state.error.message)
  const service = useSelector((state: any) => state.error.service)
  const { t } = useTranslation()
  const classes = useStyles({})

  const closeErrorMessage = () => {
    dispatch(hideError())
  }
  return (
    <>
      {
        ((code || message) && (code !== 'TS01000004' && message !== 'supplies-TS01000004') && code !== '2404' && code !== '2403') &&
          <Grid container justifyContent='center' className={classes.errorMessage}>
            <Grid item container justifyContent='space-between' alignItems='center' className={classes.container}>
              <Grid item md={11} xs={10}>
                {
                  message ?

                    message
                  :
                    (service && ((service === 'bindingCups' && code === '-0001') || code !== '-0001')) ?
                      t(`errors.${service}.${code}`)
                    :
                      t(`errors.${code}`)
                }
              </Grid>

              <Grid item className={classes.closeIcon} md={1} xs={2} onClick={closeErrorMessage}>
                <img src={closeIcon} alt='' />
              </Grid>
            </Grid>
          </Grid>
      }
    </>
  )
}
