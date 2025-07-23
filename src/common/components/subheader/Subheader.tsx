import React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

import Overlay from '../overlay/Overlay'
import PublicUserIcon from '../../../assets/icons/usuario_publico.svg'
import CertRibbon from '../../../assets/icons/CertRibbon.svg'
import AdminUserIcon from '../../../assets/icons/header_gestor.svg'
import ArrowDownIcon from '../../../assets/icons/flecha_down_blue.svg'
import CloseIcon from '../../../assets/icons/cerrar_submenu.svg'
import ArrowLink from '../../../assets/icons/flecha_enlace.svg'
import LogoutIcon from '../../../assets/icons/desconectar.svg'

import Button from '../../../common/components/button/Button'

import useStyles from './Subheader.styles'

import PreSignUpModal from '../../../pre-sign-up/components/modal/PreSignUpModal'
import { AppState } from '../../store/reducers/MainReducer'

const Subheader = (props: any) => {

  // mobile-apps only:  Subheader position depends on whether burguer menu is shown or not
  const { showBurguer } = useSelector((state: AppState) => state.bottomNav)
  const classes = useStyles({ showBurguer })() // NOTICE '()' to be able to use both props and theme, see Subheader.styles.ts:3

  const { t } = useTranslation()

  const {
    isUserBoxVisible,
    setIsUserBoxVisible,
    handleLogout,
    handleCancelSupplant,
    mobileRes,
    tabletRes
  } = props

  const user = useSelector((state: any) => state.user.profile)
  const admin = useSelector((state: any) => state.admin.profile)
  const searchedUser = useSelector((state: any) => state.admin.searchedUser)
  const padlock = useSelector((state: any) => state.user.padlock)

  const handleChangeUserBoxVisible = () => {
    setIsUserBoxVisible(!isUserBoxVisible)
  }

  const handleToProfile = () => {
    setIsUserBoxVisible(!isUserBoxVisible)
  }

  const [isOpen, setIsOpen] = useState(false);

  const handleDialogOpen = () => {
    setIsOpen(true)
  }

  const handleDialogClose = () => {
    setIsOpen(false)
  }

  return (
    <>
    <PreSignUpModal isOpen={isOpen} handleClose={handleDialogClose} />

	{//esta es la barra roja que aparece al top de la pantalla si el usuario no existe
      ((searchedUser && searchedUser.userId && searchedUser.userId == 0) || (user && user.userId && user.userId == 0)) &&
      <Grid container alignItems='center' className={(mobileRes || tabletRes) ? classes.notRegisteredMobile : classes.notRegistered}>
      	<Grid container xs={5} sm={4} md={10} spacing={2} className={classes.innerBar}>
          <Grid item>
            <span className={classes.barElement}>
              {t('pre-register.notRegistered')}
            </span>
          </Grid>
          <Grid item>
            <Button
              className={classes.button}
              text={t('pre-register.invite')}
              color='primary'
              variant='outlined'
              onClick={handleDialogOpen}
            />
          </Grid>
        </Grid>
      </Grid>
    }
    <Grid container className={(mobileRes || tabletRes) ? (isUserBoxVisible ? (`${classes.subheaderMobileOpen} ${admin.name ? classes.subheaderHeightAdmin : classes.subheaderHeightUser}`) : classes.subheaderMobile) : classes.subheader}>
      {
        isUserBoxVisible &&
          <Overlay handleClick={handleChangeUserBoxVisible} />
      }
      
      <Grid
        container
        className={classes.bar}
      >
        <Grid container item md={10} className={(mobileRes || tabletRes) ? classes.containerMobile : classes.container}>
          {
            (!mobileRes && !tabletRes) &&
              <Grid item className={classes.toUfd}>
                <a href='http://www.ufd.es/'>{t('header.subheader.goTo')} UFD.es</a>
              </Grid>
          }

          <Grid item={!mobileRes && !tabletRes} container={mobileRes || tabletRes}>
            <Grid container className={(mobileRes || tabletRes) ? classes.userContainerMobile : classes.userContainer}>
              <Grid
                container
                className={(mobileRes || tabletRes) ? classes.userInfoMobile : classes.userInfo}
                onClick={handleChangeUserBoxVisible}
              >
                <Grid item className={(mobileRes || tabletRes) ? classes.userIconMobile : classes.userIcon}>
                  <img src={admin.name ? AdminUserIcon : PublicUserIcon} alt='' />
                  { padlock === '1' &&
                    <div className={classes.iconCertificate}><img src={CertRibbon} alt=''/></div>
                  }
                  
                </Grid>
                {
                  (!mobileRes && !tabletRes) &&
                    <Grid item>
                      <div className={classes.hello}>{admin.name ? t('header.subheader.administrator') : t('header.subheader.hello')}</div>

                      <div className={classes.name}>{admin.name ? admin.name : user.name ? user.name + ' ' + user.surName : user.surName}</div>
                    
                      { padlock === '1' &&
                        <div className={classes.name}>{t('header.subheader.padlock')}</div>
                      }

                    </Grid>
                }
                <Grid
                  item
                  className={(mobileRes || tabletRes) ? classes.arrowIconMobile : classes.arrowIcon}
                >
                  {
                    isUserBoxVisible ?
                      <img className={classes.arrowUp} src={ArrowDownIcon} alt='' />
                    :
                    <img src={ArrowDownIcon} alt='' />
                  }
                </Grid>

              </Grid>

              {
                isUserBoxVisible &&
                  <Grid container className={(mobileRes || tabletRes) ? classes.userBoxMobile : classes.userBox}>
                    {
                      (mobileRes || tabletRes) &&
                        <>
                        <Grid item>
                          <div className={classes.hello}>{admin.name ? t('header.subheader.administrator') : t('header.subheader.hello')}</div>

                          <div className={classes.name}>{admin.name ? admin.name : user.name ? user.name + ' ' + user.surName : user.surName}</div>
                          { padlock === '1' &&
                          <div className={classes.name}>{t('header.subheader.padlock')}</div>
                          }
                        </Grid>
                        </>
                    }
                    {
                      (admin.name && (user.name || user.surName)) &&
                        <>
                          <Divider className={classes.divider} />
                          <Grid container className={classes.boxItem}>
                            <div onClick={handleCancelSupplant} className={classes.linkAdminLogout}>
                              <Grid item>{t('header.subheader.item1')}</Grid>

                              <Grid item className={`${classes.itemIcon} ${classes.closeIcon}`}><img src={CloseIcon} alt='' /></Grid>
                            </div>
                          </Grid>

                          <Divider className={classes.divider} />

                          <Grid container alignItems='center' className={`${classes.boxItem} ${classes.boxItemSecondUser}`}>
                            <Grid item className={classes.userIcon}>
                              <img src={PublicUserIcon} alt='' />
                            </Grid>

                            <Grid item>
                              <Typography className={classes.name}>
                                {
                                  (user.name && user.name !== '') ?
                                    <span>{user.name + ' ' + user.surName}</span>
                                  :
                                    <span>{user.surName}</span>
                                }
                              </Typography>
                            </Grid>
                          </Grid>
                        </>
                    }

                    {
                      (user.name || user.surName)  &&
                        <>
                          <Grid container className={classes.boxItem}>
                            <Link to='/profile' onClick={handleToProfile}>
                              <Grid item>{t('header.subheader.item2')}</Grid>

                              <Grid item className={classes.itemIcon}>
                                <img src={ArrowLink} alt='' />
                              </Grid>
                            </Link>
                          </Grid>
                        </>
                    }

                    <Divider className={classes.divider} />
                    
                    <Grid
                      container
                      className={classes.boxItem}
                    >
                      <Link to='/login' onClick={handleLogout}>
                        <Grid item>{t('header.subheader.item3')}</Grid>

                        <Grid item className={classes.itemIcon}>
                          <img src={LogoutIcon} alt='' />
                        </Grid>
                      </Link>
                    </Grid>
                  </Grid>
              }
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
    </>
  )
}

export default Subheader
