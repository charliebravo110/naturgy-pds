import React, { useEffect, useState, useMemo } from 'react'
import { withRouter } from 'react-router-dom'
import { push } from 'connected-react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next';

import { DialogContent } from '@material-ui/core';
import Grid from '@material-ui/core/Grid'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import NaturgyLogo from '../../../assets/img/logotipo_UFD.svg'
import HeaderNavigation from '../header-navigation/HeaderNavigation'
import LanguageSelector from '../language-selector/LanguageSelector'
import Subheader from '../subheader/Subheader'
import ErrorMessage from '../error-message/ErrorMessage'
import CloseIcon from '../../../assets/icons/cerrar.svg'
import Overlay from '../overlay/Overlay'
import SessionTimeout from '../../../login/components/session-timeout/SessionTimeout';
import SendUrl from '../../../common/components/send-url/SendUrl'
import Dialog from '../../../common/components/dialog/Dialog';
import Button from '../../../common/components/button/Button';

import { getUserSession } from '../../store/actions/UserThunkActions'
import { resetToken, resetUserProfile } from '../../store/actions/UserActions'
import { thunkRefreshToken } from '../../../login/store/actions/LoginThunkActions';
import { resetAdminToken, resetAdminProfile } from '../../../admin/store/actions/AdminActions'
import { resetSupplies, resetDelegations } from '../../../supplies/store/actions/SuppliesActions'
import { resetProvisions } from '../../../provisions/store/actions/ProvisionsActions'
import { setRequestsList, resetRequests } from '../../../requests/store/actions/RequestsActions'
import { thunkGetRequestsList } from '../../../requests/store/actions/RequestsThunkActions'
import { resetUrlMessages } from '../../../common/components/send-url/store/actions/UrlMessagesActions'
import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg';

import { thunkGetIfMyCups } from '../../../supplies/supplies-list/store/actions/SuppliesListThunkActions'

import { actualLocalDate, generateRandomString } from '../../../common/lib/FormatLib'

import useStyles from './Header.styles'
import { adminCheck } from '../../lib/ValidationLib'
import { thunkCancelSupplantUser } from '../../../admin/store/actions/AdminThunkActions'
import { thunkCreateOrUpdateAlert, thunkGetAlerts} from '../../../supplies/store/actions/AlertsThunkAction'
import { setAlerts,deleteAlerts } from '../../../supplies/store/actions/AlertsActions'
import { AppState } from '../../store/reducers/MainReducer'
import useKeepBottomNavStateUpdated from '../../../mobile-apps/menu-bottom-nav/useKeepBottomNavStateUpdated'
import { isMobileApp } from '../../../mobile-apps/common/detectPlatform'
import Faq from '../faq/faq';

// LCS: Importa la función - Wave 1
import { sendGAEvent } from '../../../core/utils/gtm';

const Header = (props: any) => {

  const classes = useStyles({})
  const dispatch = useDispatch()

  const tabletRes = useMediaQuery('(max-width:768px)')
  const mobileRes = useMediaQuery('(max-width:576px)')

  const user = useSelector((state: any) => state.user)
  const userToken = useSelector((state: any) => state.user.token)
  const adminToken = useSelector((state: any) => state.admin.token)
  const urlMessagesCategory = useSelector((state: any) => state.urlMessages.category)
  
  const { history } = props

  const [isContracted, setIsContracted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserBoxVisible, setIsUserBoxVisible] = useState(false)
  const [isGdpr, setIsGdpr] = useState(false)
  const [autogenFlag, setAutogenFlag] = useState(false)
  const [autogen2Flag, setAutogen2Flag] = useState(false)

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const reminder = process.env.REACT_APP_API_PASSWORD_REMINDER;
  const userRoles = useSelector((state: any) => state.user.profile.roles)
  const userRolesArray = userRoles ? userRoles.split(',') : (sessionStorage.getItem('userRoles') || '').split(',')
	const { t } = useTranslation();

  const supplies = useSelector((state: any) => state.supplies.list)
  const provisions = useSelector((state: any) => state.provisions)
  const dossierSubtype = useSelector((state: any) => state.provisions.dossierSubtype)
  const dossierType = useSelector((state: any) => state.provisions.dossierType)

  
  useEffect(() => {
    try {
      console.log("Cargando header...");
    } catch (error) {
      // LCS: Enviar evento a GA - Wave 1
      sendGAEvent({
        event: 'react_error',
        info:{
          error_message: 'Fallo al cargar el header',
          error: error,
          reactComponent: 'Header.tsx - useEffect',
        }
      });
    }
  },[])

  useKeepBottomNavStateUpdated()
  const { showBurguer } = useSelector((state: AppState) => state.bottomNav)
  
  useEffect(() => {
    const lang = sessionStorage.getItem('lang')

    if (!lang) {
      sessionStorage.setItem('lang', 'es')
    }
  }, [])

  useEffect(() => {
    if (dossierSubtype === 'DOSSUB000' && window.location.href.includes('new-generation')) {
      setAutogenFlag(true)
    }
    if (autogenFlag && !window.location.href.includes('new-generation')){
      setAutogenFlag(false)
    }
  },[dossierSubtype, window.location.href, autogenFlag])

  useEffect(() => {
    if (dossierType === 'DOSTYP002' && window.location.href.includes('provisions/detail')) {
      setAutogen2Flag(true)
    } else {
      setAutogen2Flag(false)
    }
  },[dossierType, window.location.href, autogen2Flag])

  useEffect(() => {
    setIsGdpr(history.location.pathname === '/gdpr' || sessionStorage.getItem('gdprAccepted') === '0')
  }, [history.location])

  useEffect(() => {
    dispatch(getUserSession())
  }, [dispatch])

  useEffect(() => {
    // sessionStorage.setItem('rand', generateRandomString(15))
    refreshTimer();
  }, [userToken])

  useEffect(() => {
    if (user.profile.documentNumber && history.location.pathname !== '/requests') {
      let filter = `documentNumber::${user.profile.documentNumber}|status::1`

      dispatch(thunkGetRequestsList(filter, (response) => {
        if (response && response.length > 0) {
          // ok
          dispatch(setRequestsList(response))
        }
      }))
    }
    // eslint-disable-next-line
  }, [user.profile.documentNumber])

  useEffect(() => {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.pageYOffset

      if (tabletRes || mobileRes) {
        setIsContracted(false)
      }
      else {
        setIsContracted(scrollPosition > 67)

        setIsUserBoxVisible(false)
      }
    }, false)
  }, [tabletRes, mobileRes])



  const refreshTimer = () => {
    if (userToken != '' && userToken !== null && user.profile.documentNumber !== null && user.profile.documentNumber !== '') {
      const time = user.expires !== '' ? (parseInt(user.expires) * 1000) - 120000 : 0;

      setTimeout(() => {
        dispatch(thunkRefreshToken(userToken, user.profile.documentNumber));
      }, time);
    }
  }

  useMemo(() => {
    if (user.lastPasswordChange && parseInt(user.lastPasswordChange) > 0  && parseInt(user.lastPasswordChange) < parseInt(reminder)) {
      setShowPasswordChange(true);
    }
  }, [user.lastPasswordChange])

  useEffect(() => {
    if (user.profile.documentNumber) {
      dispatch(thunkGetAlerts((response) => {
        if (response && response.result.codResult==='0000') {
          response.items.forEach(alert => {
            if(alert.fechaBaja === undefined){
              let deleteAlert = false;
              dispatch(thunkGetIfMyCups(alert.idEntidad, null, (response2) => {
                if(response2 === undefined || (response2 && response2.result && response2.result.codResult==='TS01000004')){
                  const fechaString = actualLocalDate()
                  const newAlert = {
                    docId: user.documentNumber,
                        tipoAlerta: 'supplycutoff',
                        tipoEntidad: 'supply',
                        idEntidad: alert.idEntidad,
                        tipoCanal: user.tipoCanal,
                        activo: '0',
                        destinatario: user.destinatario,
                        franjaInicio:user.franjaInicio,
                        franjaFin:user.franjaFin,
                        franjaInicioEspecial:user.franjaInicioEspecial,
                        franjaFinEspecial:user.franjaFinEspecial,
                        fechaBaja:fechaString
                  };
                  dispatch(thunkCreateOrUpdateAlert(newAlert,'supplycutoff',alert.idEntidad,(response) => {
     //prueba
                    if (response) {
                      //console.log('Prueba response '+JSON.stringify(response))
                      dispatch(deleteAlerts(alert.idEntidad))
                    }
                  }))
                }
              }))
            }
          });
          
          const array = response.items.filter((item) => item.fechaBaja===undefined)
          dispatch(setAlerts(array))
        }
      }))
    }
  }, [user.profile.documentNumber,supplies.length])
  const handleLogout = (event) => {

    if (event) {
      event.preventDefault();
    }

    if (adminCheck) {
      dispatch(resetAdminToken())
      dispatch(resetAdminProfile())
    }

    dispatch(resetToken())
    dispatch(resetUserProfile())
    dispatch(resetSupplies())
    dispatch(resetDelegations())
    dispatch(resetProvisions())
    dispatch(resetRequests())
    dispatch(resetUrlMessages())

    const lang = sessionStorage.getItem('lang') || 'es'

    sessionStorage.clear()

    sessionStorage.setItem('lang', lang)

    dispatch(push('/login'))

    setIsUserBoxVisible(false)
  }

  const handleCancelSupplant = () => {
    dispatch(thunkCancelSupplantUser());

    setIsUserBoxVisible(false)

    //LCS restablezco el userDocument al del usuario logueado
    sessionStorage.setItem('userDocument', sessionStorage.getItem('userDocumentLogin'))

    dispatch(push('/admin'))
  }

  const handleChangeMenuVisible = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const showMenu = () => {
    if (userToken || adminToken) {
      if (tabletRes || mobileRes) {
        // mobile apps only: hide hamburguer menu when username type is domestic
        return isMobileApp() && showBurguer === false ? null :(
          <>
            {
              isMenuOpen &&
              <Overlay handleClick={handleChangeMenuVisible} />
            }

            <Grid item className={classes.rightContentMobile}>
              <Grid
                item
                className={isMenuOpen ? classes.menuOpen : classes.menuClosed}
                onClick={handleChangeMenuVisible}
              >
                {
                  isMenuOpen ?
                    <img className={classes.closeIcon} src={CloseIcon} alt='' />
                    :
                    <span className={classes.menuIcon} />
                }
              </Grid>
              {
                isMenuOpen &&
                <HeaderNavigation
                  tabletRes={tabletRes}
                  mobileRes={mobileRes}
                  onClick={handleChangeMenuVisible}
                />
              }
            </Grid>
          </>
        )
      } else {
        return (
          <Grid item className={classes.rightContainer} xs={11}>
            <Grid item className={`${classes.navigationWrapper} rightContent`}>
              <HeaderNavigation tabletRes={tabletRes} mobileRes={mobileRes} handleCancelSupplant={handleCancelSupplant} />
            </Grid>
          </Grid>
        )
      }
    } else {
      return (
        <Grid item className={classes.rightContainer} xs={10}>
          <LanguageSelector />
        </Grid>
      )
    }
  }

  return (
    <>
      <div className={`${classes.header} ${isContracted && 'contracted'} ${(userToken !== '' || adminToken !== '') && 'logged'}`}>
        {
          (!isGdpr &&
            //(!tabletRes && !mobileRes) &&
            (userToken || adminToken)) &&
          <Subheader
            isUserBoxVisible={isUserBoxVisible}
            setIsUserBoxVisible={setIsUserBoxVisible}
            handleLogout={handleLogout}
            handleCancelSupplant={handleCancelSupplant}
            tabletRes={tabletRes}
            mobileRes={mobileRes}
          />
        }

        <Grid
          container
          className={classes.bar}
        >
          <Grid
            container
            item
            className={`${userRolesArray.includes('US_CC_WHITELIST') ? classes.innerBar : classes.innerBarSm} innerBar`}
            md={10}
          >
            <Grid container item className={classes.container}>
              <Grid item className={classes.logoContainer} xs={1}>
                <a
                  href='#'
                  className={`${classes.logo} logo`}
                  onClick={(e) => {
                    e.preventDefault()
                    history.push('/')
                  }}
                >
                  <img src={NaturgyLogo} alt='NaturgyLogo' />
                </a>
              </Grid>

              {
                !isGdpr && showMenu()
              }
            </Grid>
          </Grid>
        </Grid>

        {(adminToken && userToken && urlMessagesCategory) &&
          <SendUrl />
        }

        {(autogenFlag || ((!adminToken || !urlMessagesCategory) && autogen2Flag)) &&
          <Faq 
            toSpace={false}
          />
        }

        {(adminToken && userToken && urlMessagesCategory && autogen2Flag) &&
          <Faq
            toSpace={true}
          />
        }

        <SessionTimeout handleTimeoutHeader={handleLogout} />
        <ErrorMessage />
      </div>
      {
        showPasswordChange &&
        <Dialog className={classes.dialog} open={showPasswordChange} onClose={() => setShowPasswordChange(false)}>
          <DialogContent className={classes.lastPasswordContainer}>
            <img src={CloseIcon} className={classes.closeButton} alt='close' onClick={() => setShowPasswordChange(false)} />
            <img src={AlertIcon} />
            <div className={classes.title}>
              {t('login.update.warning')}
            </div>
            <div className={classes.body}>
              {t('login.update.updateText', {days: user.lastPasswordChange})}
            </div>
            <Button className={classes.button} text={t('common.buttons.accept')} color='primary' size='large' variant='contained' onClick={() => setShowPasswordChange(false)} />
          </DialogContent>
        </Dialog>
      }
    </>
  )
}

export default withRouter(Header)
