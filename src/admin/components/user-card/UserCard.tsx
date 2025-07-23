import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Button from '../../../common/components/button/Button'
import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg'
import UserProfile from '../../../common/interfaces/UserProfile'
import { thunkSupplantUser } from '../../store/actions/AdminThunkActions'

import UserIcon from '../../../assets/icons/usuario_publico.svg'

import useStyles from './UserCard.styles'
import PreSignUpModal from '../../../pre-sign-up/components/modal/PreSignUpModal'
import PreSmsModal from '../../../pre-sign-up/components/modalSms/PreSmsModal'

// LCS: Importa la función - Wave 2
import { sendGAEvent } from '../../../core/utils/gtm';

const UserCard = (props: any) => {
  const user: UserProfile = props.user
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const userId = useSelector((state: any) => state.admin.searchedUser?.userId || null)
  const adminToken = useSelector((state: any) => state.admin.token)
  const supplies = useSelector((state: any) => state.supplies)

  const { setIsLoading, searchedUsersLogin, showingDialog } = props


  const [isOpen, setIsOpen] = useState(false)
  const [isOpenSms, setIsOpenSms] = useState(false)
  const [fecha, setFecha] = useState('')



  const handleLoginButton = () => {
    setIsLoading(true)

    // LCS: Enviar evento de negocio de GA - Wave 2
    if (user.userId == 0 || showingDialog) {
      sendGAEvent({
        event: 'impersonate_unregistered_user',
        user_id: sessionStorage.getItem('id'),
        user_type: sessionStorage.getItem('user_type'),
        //user_document: sessionStorage.getItem('userDocumentLogin')
      })
    } else {
      sendGAEvent({
        event: 'impersonate_registered_user',
        user_id: sessionStorage.getItem('id'),
        user_type: sessionStorage.getItem('user_type'),
        //user_document: sessionStorage.getItem('userDocumentLogin')
      })
    }

    dispatch(thunkSupplantUser(userId, adminToken, true, setIsLoading, supplies))


  }
  const handleDialogOpen = () => {
    setIsOpen(true)
  }

  const handleDialogClose = () => {
    setIsOpen(false)
  }

  const handleDialogSmsOpen = () => {
    setIsOpenSms(true)
  }

  const handleDialogSmsClose = () => {
    setIsOpenSms(false)
  }
  useEffect(() => {
    if(searchedUsersLogin && searchedUsersLogin.cancelDate != null){
      const fechaHora = searchedUsersLogin.cancelDate;
      const [fecha, hora] = fechaHora.split(' ');
      setFecha(fecha)
  
    }
  }, [])

  return (
    <>
      <Grid container justifyContent='center' spacing={1} className={classes.userCard}>
        {
          user?.enabled === 0 && !showingDialog &&
          <div className={classes.alert}>
            <img src={AlertIcon} alt='' />

            <div>{t('admin.disabledUser')}</div>
          </div>
        }
        {  showingDialog &&

          <div className={classes.alertRelative}>
            <img src={AlertIcon} alt='' />
            <span className={classes.blue}>{t('admin.dialog.title')}</span>
          </div>
        }
        {
          !showingDialog &&

          <div className={classes.position}>
          {
            (user.userId != 0) && 
            <span className={classes.registeredPDS}>{t('pre-register.registerPDS')}</span>
          }
          {
            (user.userId == 0) && 
            <span className={classes.notRegistered}>{t('pre-register.notRegistered')}</span>
          }
          {
            (searchedUsersLogin && searchedUsersLogin.cancelDate != null) && 
            <span className={classes.userCancel}>{t('pre-register.cancel')}{fecha}</span>
          }
          </div>

        }
       
           
       { !showingDialog && 
       <Grid>
          <Grid container item xs={12} sm={11} alignItems='center' className={`${classes.row} ${classes.blue}`}>
          <div className={classes.userIcon}><img src={UserIcon} alt='Usuario' /></div>

          {/* {
            !searchedUsersLogin && (user.name && user.name !== '') ?
              <span>{user.name + ' ' + user.surName}</span>
              :(searchedUsersLogin)?
              <span>{searchedUsersLogin.name + ' ' + searchedUsersLogin.surname}</span>:
              <span>{user.surName}</span>
          } */}
            {
            searchedUsersLogin ?
            <span>{searchedUsersLogin.name + ' ' + searchedUsersLogin.surname}</span>:
            user.name && user.name !== ''?
              <span>{user.name + ' ' + user.surName}</span>
              :
              <span>{user.surName}</span>
          }
        
          
        </Grid>

        <Grid item xs={11} sm={10}  className={classes.row}>
          <div className={classes.blue}>{user.documentType}</div>

          {user.documentNumber}
        </Grid>
          </Grid>
       } 

           

            { !showingDialog &&
                <Grid item xs={11} sm={10} md={6} className={classes.row}>
                      
                <div className={classes.blue}>Email</div>
                {
                  user.email ?
                  user.email :
                  searchedUsersLogin?.email?
                  searchedUsersLogin.email:
                  t('pre-register.userNoEmail')

                 }
              </Grid>


            }
    
       
        <Grid container justifyContent='center' item xs={12} sm={10} md={12} spacing={2} className={classes.row}>
          

          {
            (user?.userId == 0 || showingDialog) &&
            <>
              <Grid item>
                <Button
                  text={t('pre-register.invite')}
                  color={'primary'}
                  size={'large'}
                  onClick={handleDialogOpen}                  
                  variant='outlined'

                />
              </Grid>

              <Grid item>
                <Button
                  text={t('admin.inviteSms')}
                  color={'primary'}
                  size={'large'}
                  variant='outlined'
                  onClick={handleDialogSmsOpen}
                />
              </Grid>
            </>
          }
          {
            !showingDialog &&
              <Grid item>
                <Button
                  text={t('admin.loginButton')}
                  color={'primary'}
                  size={'large'}
                  variant='contained'
    
                  onClick={handleLoginButton}
                />
              </Grid>
          }
        </Grid>
      </Grid>
        

      <PreSignUpModal 
        isOpen={isOpen} 
        handleClose={handleDialogClose}  
        searchedUsersLogin={searchedUsersLogin}
        user={user} 
      />

      <PreSmsModal
        isOpen={isOpenSms}
        handleClose={handleDialogSmsClose}
        searchedUsersLogin={searchedUsersLogin}
        user={user}
      />
    </>
  )
}

export default UserCard
