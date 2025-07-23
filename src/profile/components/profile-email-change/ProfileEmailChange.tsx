import React, { useState, Fragment, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import { SecurityHOC } from '../../../common/HOC/SecurityHOC'
import Spinner from '../../../common/components/spinner/Spinner'
import ButtonToTop from '../../../common/components/button-to-top/ButtonToTop'
import ChangeEmailIcon from '../../../assets/icons/cambiar_email.svg'
import Input from '../../../common/components/input/Input'
import Button from '../../../common/components/button/Button'

import { setUserMail } from '../../../common/store/actions/UserActions'
import { thunkUpdateUser } from '../../../common/store/actions/UserThunkActions'
import { validateMail } from '../../../common/lib/ValidationLib'

import useStyles from './ProfileEmailChange.styles'
import ZeusWebData from '../../../common/interfaces/ZeusWebData'
import { thunkZeusSincro } from '../../../common/components/zeus-sincro/ZeusSincroThunkActions'

// LCS: Importa la función - Wave 1
import { removeEmails, sendGAEvent } from '../../../core/utils/gtm';

const ProfileEmailChange = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const userToken = useSelector((state: any) => state.user.token)
  const { t } = useTranslation()

  const [ email, changeEmail ] = useState('')
  const [ emailValidity, changeEmailValidity ] = useState(false)
  const [ emailConfirmation, changeEmailConfirmation ] = useState('')
  const [ firstLoad, setFirstLoad ] = useState(true)

  const [ changingEmail, setChangingEmail ] = useState(false)

  useEffect(() => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'view',
      content_group: 'mi perfil',
      page_url: removeEmails(window.location.href),
      user_id: sessionStorage.getItem('id'),
      previous_path: removeEmails(sessionStorage.getItem("previousPage")),
      user_type: sessionStorage.getItem('user_type'),
      browsing_type: sessionStorage.getItem('browsing_type'),
      element_type: 'medicion de pagina',
      ga_client_id: sessionStorage.getItem('ga_client_id'),
      cups: 'no aplica',
      supply_type: 'no aplica'
    });
    sessionStorage.setItem("previousPage", window.location.href);
  },[])

  const handleCancel = () => {
    props.history.push('/profile')
  }

  const handleAccept = () => {
    setChangingEmail(true)

    try {
      dispatch(setUserMail(email || ''))
    } catch (error){
      // LCS: Enviar evento a GA - Wave 1
      sendGAEvent({
        event: 'react_error',
        info:{
          error_message: 'Fallo al actualizar el correo electrónico',
          error: error,
          reactComponent: 'ProfileEmailChange.tsx - handleAccept',
        }
      });
    }

    try {
      dispatch(thunkUpdateUser(setChangingEmail, () => {

        let webData = {
          webEmail: email,
          webClientId: sessionStorage.getItem('id')
        } as ZeusWebData
    
        dispatch(thunkZeusSincro(webData, null, null))

        props.history.push('/profile')

      }, null))
    } catch (e){
      // LCS: Enviar evento a GA - Wave 1
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : 'Fallo al actualizar el correo electrónico',
          error: e,
          reactComponent: 'ProfileEmailChange.tsx - handleAccept',
          codResult: (e as any).result ? (e as any).result.codResult : (e as any).status
        }
      });
    }
  }

  if (userToken === '') {
    return <Redirect to='/profile' />
  }

  const getInputsContainer = () => {
    return (
      <Grid
        container
        direction='row'
        justifyContent='space-between'
        spacing={3}
        className={classes.inputs}
      >
        {
          changingEmail &&
            <Spinner fixed={true} />
        }

        <Grid item xs={12} sm={6} md={6}>
          <Typography className={classes.label}>{t('profile.profileEmailChange.email')}</Typography>

          <Input
            fullWidth
            className={classes.textField}
            error={emailValidity}
            showValidationIcon
            onChange={({ target }) => {
              try {
                changeEmailValidity(!validateMail(target.value))

                changeEmail(target.value)

                setFirstLoad(false)
              } catch (error){
                // LCS: Enviar evento a GA - Wave 1
                sendGAEvent({
                  event: 'react_error',
                  info:{
                    error_message: 'Fallo al validar el correo electrónico',
                    error: error,
                    reactComponent: 'ProfileEmailChange.tsx - onChange',
                  }
                });
              }
            }}
            value={email}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Typography className={classes.label}>{t('profile.profileEmailChange.repeatEmail')}</Typography>

          <Input
            fullWidth
            className={classes.textField}
            error={emailConfirmation !== '' && email !== emailConfirmation}
            onChange={({ target }) => {
              try {
                changeEmailConfirmation(target.value)

                setFirstLoad(false)
              } catch (error){
                // LCS: Enviar evento a GA - Wave 1
                sendGAEvent({
                  event: 'react_error',
                  info:{
                    error_message: 'Fallo al cambiar el correo de confirmación',
                    error: error,
                    reactComponent: 'ProfileEmailChange.tsx - onChange',
                  }
                });
              }
            }}
            onPaste={(e) => {
              e.preventDefault()
              return false
            }}
            value={emailConfirmation}
          />
        </Grid>
      </Grid>
    )
  }

  const getButtonsContainer = () => {
    return (
      <Grid
        container
        direction='column'
        justifyContent='center'
        alignItems='center'
        spacing={2}
        className={classes.buttons}
      >
        <Grid item className={classes.required}>
          {t('profile.profileEmailChange.requiredFields')}
        </Grid>

        <Grid item>
          <Grid container direction='row' justifyContent='center'>
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
              disabled={firstLoad || emailValidity || email !== emailConfirmation}
              onClick={handleAccept}
            />
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <Fragment>
      <ButtonToTop />

      <Grid container justifyContent='center' alignItems='center' className={classes.container}>
        <Grid item xs={12} sm={12} md={12}>
          <div className={classes.headerTitle}>{t('profile.profileEmailChange.myProfile')}</div>
        </Grid>

        <Grid container item direction='row' xs={11} sm={11} md={10} className={classes.profileBlock}>
          <Grid container item xs={12} sm={12} md={2} className={classes.profileBlockLeft} />

          <Grid
            container
            item
            xs={12}
            sm={12}
            md={10}
            justifyContent='space-between'
            className={classes.profileBlockRight}
          >
            <Grid container direction='row'>
              <Grid item xs={1} sm={1} md={1} className={classes.avatarContainer}>
                <img src={ChangeEmailIcon} className={classes.avatar} alt='' />
              </Grid>

              <Grid
                container
                item
                direction='column'
                xs={8}
                sm={8}
                md={11}
                spacing={2}
                className={classes.titleContainer}
              >
                <Grid item className={classes.title}>
                  {t('profile.profileEmailChange.changeEmail')}
                </Grid>

                <Grid item className={classes.subTitle}>
                  {t('profile.profileEmailChange.newEmail')}
                </Grid>
              </Grid>
            </Grid>

            <Grid container direction='column' className={classes.data}>
              {getInputsContainer()}
            </Grid>

            {getButtonsContainer()}
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default SecurityHOC(ProfileEmailChange)
