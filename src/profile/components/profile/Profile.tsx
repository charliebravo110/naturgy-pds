import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import { Divider } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { InputBase } from '@material-ui/core'

import Spinner from '../../../common/components/spinner/Spinner'
import ButtonToTop from '../../../common/components/button-to-top/ButtonToTop'
import PublicUserIcon from '../../../assets/icons/usuario_publico.svg'
import DeleteIcon from '../../../assets/icons/eliminar.svg'
import EditLabel from '../../../common/components/edit-label/EditLabel'
import SaveLabel from '../../../common/components/save-label/SaveLabel'
import TextButton from '../../../common/components/text-button/TextButton'
import MfaOption from '../../../common/components/mfa-option/MfaOption'
import InfoDownloadMobile from '../../../common/components/info-download-mobile/InfoDownloadMobile'
import DeleteConfirmationDialog from '../delete-dialogs/delete-confirmation-dialog/DeleteConfirmationDialog'
import DeleteDelegationsConfirmationDialog from '../delete-dialogs/delete-delegations-confirmation-dialog/DeleteDelegationsConfirmationDialog'
import DeleteDelegatedInMeConfirmationDialog from '../delete-dialogs/delete-delegated-confirmation-dialog/DeleteDelegatedConfirmationDialog'
import Input from '../../../common/components/input/Input'

import { setUserPhone } from '../../../common/store/actions/UserActions'
import { thunkUpdateUser } from '../../../common/store/actions/UserThunkActions'
import { validateMobileNumber, validateUserCode } from '../../../common/lib/ValidationLib'
import { SecurityHOC } from '../../../common/HOC/SecurityHOC'

import useStyles from './Profile.styles'
import ZeusWebData from '../../../common/interfaces/ZeusWebData'
import { thunkZeusSincro } from '../../../common/components/zeus-sincro/ZeusSincroThunkActions'

import AppleGoogleLinks from '../../../mobile-apps/apple-google-links/AppleGoogleLinks'
import ProfileSectionNotifications from '../../../mobile-apps/push-notifications/preferences/ProfileSectionNotifications'
import ProfileSectionBiometry from '../../../mobile-apps/biometric-access/preferences/ProfileSectionBiometry'

// LCS: Importa la función - Wave 1
import { sendGAEvent, removeEmails } from '../../../core/utils/gtm';

const Profile = (props: any) => {
  const dispatch = useDispatch()
  const userToken = useSelector((state: any) => state.user.token)
  const user = useSelector((state: any) => state.user.profile)

  let token = sessionStorage.getItem('token')
  let supplantedUser = sessionStorage.getItem('supplantedUser')
  let userRoles = sessionStorage.getItem('userRoles') || ''
  let userRolesArray = userRoles.split(',')

  const classes = useStyles({})
  const { t } = useTranslation()

  const [ isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen ] = useState(false)
  const [ isDeleteDelegationsConfirmationDialogOpen, setIsDeleteDelegationsConfirmationDialogOpen ] = useState(false)
  const [ isDeleteDelegatedInMeConfirmationDialogOpen, setIsDeleteDelegatedInMeConfirmationDialogOpen ] = useState(false)
  const [ inputPhone, setInputPhone ] = useState(false)
  const [ phoneValue, setPhoneValue ] = useState()
  const [ phoneValidity, setPhoneValidity ] = useState(false)

  const [ changingPhone, setChangingPhone ] = useState(false)

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

  useEffect(() => {
    setPhoneValue(user.phone)
  }, [ user.phone ])

  const { match } = props

  const handleOpenDeleteConfirmationDialog = () => {
    if (!supplantedUser) {
      // LCS: Enviar evento de negocio a GA - Wave 1
      sendGAEvent({
        event: 'unsubscribe_user',      
        user_id: sessionStorage.getItem('id'),
        user_type: sessionStorage.getItem('user_type'),
        //user_document: sessionStorage.getItem('userDocumentLogin')
      });
      setIsDeleteConfirmationDialogOpen(true)
    }
  }

  const handleCloseDeleteConfirmationDialog = () => {
    setIsDeleteConfirmationDialogOpen(false)
  }

  const handleOpenDeleteDelegationsConfirmationDialog = () => {
    if (!supplantedUser) {
      setIsDeleteDelegationsConfirmationDialogOpen(true)
    }
  }

  const handleCloseDeleteDelegationsConfirmationDialog = () => {
    setIsDeleteDelegationsConfirmationDialogOpen(false)
  }

  const handleOpenDeleteDelegatedInMeConfirmationDialog = () => {
    if (!supplantedUser) {
      setIsDeleteDelegatedInMeConfirmationDialogOpen(true)
    }
  }

  const handleCloseDeleteDelegatedInMeConfirmationDialog = () => {
    setIsDeleteDelegatedInMeConfirmationDialogOpen(false)
  }

  const handleEditInputPhone = () => {
    if (!supplantedUser) {
      setInputPhone(!inputPhone)
    }
  }

  const handleSaveInputPhone = () => {
    setChangingPhone(true)

    setInputPhone(!inputPhone)
    try {
      dispatch(setUserPhone(phoneValue || ''))
    } catch (e){      
      // LCS: Enviar evento a GA - Wave 1
      sendGAEvent({
        event: 'react_error',
        info:{
          error_message: 'Error al guardar el teléfono',
          error: e,
          reactComponent: 'Profile.tsx - handleSaveInputPhone',
        }
      });
    }

    try {
      dispatch(thunkUpdateUser(setChangingPhone, () => {
        
        let webData = {
          webPhone: phoneValue,
          webClientId: user.userId
        } as ZeusWebData
    
        dispatch(thunkZeusSincro(webData, null, null))

      }, null))
    } catch (e){      
      // LCS: Enviar evento a GA - Wave 1
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : 'Error al guardar el teléfono',
          error: e,
          reactComponent: 'Profile.tsx - handleSaveInputPhone',
          codResult: (e as any).result ? (e as any).result.codResult : (e as any).status
        }
      });
    }
  }

  const handleKeyDown = (e) => {
    if (!phoneValidity && (e.key === 'Enter')) {
      setChangingPhone(true)

      setInputPhone(!inputPhone)      
    
      try {
        dispatch(setUserPhone(phoneValue || ''))
      } catch (e){      
        // LCS: Enviar evento a GA - Wave 1
        sendGAEvent({
          event: 'react_error',
          info:{
            error_message: 'Error al guardar el teléfono',
            error: e,
            reactComponent: 'Profile.tsx - handleSaveInputPhone',
          }
        });
      }
      
      try {
        dispatch(thunkUpdateUser(setChangingPhone, null, null))
      } catch (e){
        // LCS: Enviar evento a GA - Wave 1
        sendGAEvent({
          event: 'api_error',
          info: {
            error_message: (e as any).result ? (e as any).result.msgResult : 'Fallo al guardar el teléfono',
            error: e,
            reactComponent: 'Profile.tsx - handleSaveInputPhone',
            codResult: (e as any).result ? (e as any).result.codResult : (e as any).status
          }
        });
      }
    }
  }

  const handleClickEmail = () => {
    if (!supplantedUser) {
      props.history.push(`${match.path}/changeEmail`)
    }
  }

  const handleClickPassword = () => {
    if (!supplantedUser) {
      props.history.push(`${match.path}/changePassword`)
    }
  }

  if (!token) {
    return <Redirect to='/login' />
  }

  if (userRolesArray.includes('US_CC') && !supplantedUser) {
    return <Redirect to='/admin' />
  }

  const getWelcomeContainer = () => {
    return (
      <Grid item className={classes.welcome}>
        {t('profile.greeting')}{user && user.name ? user.name : user.surName}!
      </Grid>
    )
  }

  const getHeaderContainer = () => {
    return (
      <>
        <Grid container item xs={3} sm={2} md={1} className={classes.avatarContainer}>
          <img src={PublicUserIcon} className={classes.avatar} alt='' />
        </Grid>

        <Grid container direction='row' alignItems='center' item xs={9} sm={10} md={11}>
          <Grid item xs={12} sm={7} md={8} className={classes.title}>
            {t('profile.personalData')}
          </Grid>

          {
            !supplantedUser &&
              <Grid
                container
                direction='row-reverse'
                item
                xs={12}
                sm={4}
                md={3}
                className={classes.deleteAccount}
              >
                <TextButton onClick={handleOpenDeleteConfirmationDialog}>
                  <img src={DeleteIcon} className={classes.deleteIcon} alt='' />

                  <Typography className={classes.deleteText}>{t('profile.deleteProfile')}</Typography>
                </TextButton>

                <DeleteConfirmationDialog
                  open={isDeleteConfirmationDialogOpen}
                  closeaux={handleCloseDeleteConfirmationDialog}
                  userId={user.userId}
                  userToken={userToken}
                  handleOpenDeleteDelegationsConfirmationDialog={handleOpenDeleteDelegationsConfirmationDialog}
                  handleOpenDeleteDelegatedInMeConfirmationDialog={handleOpenDeleteDelegatedInMeConfirmationDialog}
                />

                <DeleteDelegationsConfirmationDialog
                  open={isDeleteDelegationsConfirmationDialogOpen}
                  closeaux={handleCloseDeleteDelegationsConfirmationDialog}
                  userId={user.userId}
                  userToken={userToken}
                  handleOpenDeleteDelegatedInMeConfirmationDialog={handleOpenDeleteDelegatedInMeConfirmationDialog}
                />

                <DeleteDelegatedInMeConfirmationDialog
                  open={isDeleteDelegatedInMeConfirmationDialogOpen}
                  closeaux={handleCloseDeleteDelegatedInMeConfirmationDialog}
                  userId={user.userId}
                  userToken={userToken}
                />
              </Grid>
          }
        </Grid>
      </>
    )
  }

  const isExternalUser = ():Boolean => {
    return user.documentNumber && !(validateUserCode(user.documentNumber) || /^700\d{5}$/.test(user.documentNumber.toUpperCase()));
  }

  const getDataContainer = () => {
    return (
      <>
        <Grid container justifyContent='center' alignItems='center'>
          <Grid item xs={10}>
            <Divider className={classes.divider} />
          </Grid>
        </Grid>

        <Grid container direction='column' className={classes.data}>
          <Grid item className={classes.dataRow}>
            <Grid container direction='row' spacing={4} justifyContent='space-between'>
              <Grid item xs={12} sm={6} md={6}>
                <Grid container direction='column' spacing={1}>
                  <Grid item className={classes.label}>
                    {t('profile.name')}
                  </Grid>

                  <Grid item className={classes.info}>
                    {user && user.name && user.name}
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <Grid container direction='column' spacing={1}>
                  <Grid item className={classes.label}>
                    {t('profile.surnames')}
                  </Grid>

                  <Grid item className={classes.info}>
                    {user && user.surName}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item className={classes.dataRow}>
            <Grid container direction='row'>
              <Grid item>
                <Grid container direction='column' spacing={1}>
                  <Grid item className={classes.label}>
                    {t('profile.identificationDocument')}
                  </Grid>

                  <Grid item className={classes.info}>
                    {user && user.documentNumber}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            container
            direction='row'
            spacing={4}
            justifyContent='space-between'
            className={classes.dataLastRow}
          >
            <Grid item xs={12} sm={6} md={6}>
              <Grid container direction='column' spacing={1} className={classes.ieFlexHack}>
                {
                  (!supplantedUser && inputPhone) ?
                    <>
                      <SaveLabel
                        label={t('profile.phone')}
                        onClick={handleSaveInputPhone}
                        disabled={phoneValidity}
                      />

                      <Input
                        error={phoneValidity}
                        showValidationIcon
                        onChange={({ target }) => {
                          setPhoneValidity(!validateMobileNumber(target.value))

                          setPhoneValue(target.value)
                        }}
                        onKeyDown={handleKeyDown}
                        value={phoneValue}
                      />
                    </>
                  :
                    <>
                      <>
                        <EditLabel label={t('profile.phone')} onClick={handleEditInputPhone} disabled={supplantedUser} />
                        
                        <Grid className={classes.info}>{phoneValue}</Grid>
                      </>
                    </>
                }
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <Grid container direction='column' spacing={1} className={classes.ieFlexHack}>
                 <>
                   <EditLabel label={t('profile.email')} large onClick={handleClickEmail} disabled={supplantedUser} />
                
                  <Grid item className={`${classes.info} ${classes.email}`}>
                    {user && user.email}
                 </Grid>
                  </>
              </Grid>
            </Grid>
          </Grid>

          {user.documentNumber && !validateUserCode(user.documentNumber) &&
          <Grid item>
            <Grid container direction='row'>
              <Grid item xs={12} sm={6} md={7}>
                <Grid container direction='column' spacing={1} className={classes.ieFlexHack}>
                    <EditLabel label={t('profile.password')} onClick={handleClickPassword} disabled={supplantedUser} />
                  <Grid item>
                    <InputBase className={classes.password} value='contraseña' type='password' />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          }

        </Grid>
        
      </>
    )
  }


  const getMfaContainer = () => {
    return (
      <MfaOption />
    );
  }


  return (
    <>
    
      <ButtonToTop />

      {
        changingPhone &&
          <Spinner fixed={true} />
      }

      <Grid container justifyContent='center' alignItems='center' className={classes.container}>
        <Grid item xs={12} sm={12} md={12}>
          <div className={classes.headerTitle}>{t('profile.myProfile')}</div>
        </Grid>

        <Grid container direction='row' item xs={11} sm={11} md={10} className={classes.profileBlock}>
          <Grid container className={classes.blockLeft} item xs={12} sm={12} md={3} lg={3}>
            {getWelcomeContainer()}
          </Grid>

          <Grid
            container
            className={classes.blockRight}
            item
            xs={12}
            sm={12}
            md={9}
            lg={9}
          >
            {getHeaderContainer()}

            {getDataContainer()}
            {isExternalUser() && !supplantedUser && getMfaContainer()}

            <InfoDownloadMobile/>
            <ProfileSectionBiometry />
            <ProfileSectionNotifications />
            <AppleGoogleLinks />
          </Grid>
        </Grid>
      </Grid>
    </>
  )





}

export default SecurityHOC(Profile)

