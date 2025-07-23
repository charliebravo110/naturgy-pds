import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter, Route, Redirect } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import queryString from 'query-string'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Grid from '@material-ui/core/Grid'

import BrowserDialog from '../browser-dialog/BrowserDialog'
import LoginForm from '../login-form/LoginForm'
import ResetPassword from '../reset-password/ResetPassword'
import SignUp from '../sign-up/SignUp'
import MfaInput from '../mfaInput/MfaInput';
import UpdatePassword from '../updatePassword/UpdatePassword';
import DeleteSuccessModal from '../../../profile/components/delete-dialogs/delete-success-dialog/DeleteSuccessDialog'
import Spinner from '../../../common/components/spinner/Spinner'
import { showError } from '../../../common/store/actions/ErrorActions'
import Dialog from '../../../common/components/dialog/Dialog'
import MobileAlert from '../mobile-alert/MobileAlert'

import { setUrlMessagesClientDossierPanel } from '../../../common/components/send-url/store/actions/UrlMessagesActions'
import { thunkSendFirstLogin, thunkGetConfiguredLogin } from '../../store/actions/LoginThunkActions'
import { thunkZeusSincro } from '../../../common/components/zeus-sincro/ZeusSincroThunkActions';
import ZeusWebData from '../../../common/interfaces/ZeusWebData'
import { setPassword, resetLoginState } from '../../store/actions/LoginActions';
import { thunkGetDocumentBil, thunkGetDocumentBill, thunkGetProvision } from '../../../provisions/store/actions/ProvisionsThunkActions'
import { setCurrentProvisionHasContactMeButton } from '../../../provisions/store/actions/ProvisionsActions'

import useStyles from './Login.styles'

import { isWeb } from '../../../mobile-apps/common/detectPlatform'
import useMaybeGoToCarouselAfterLogin from '../../../mobile-apps/carousel/useMaybeGoToCarouselAfterLogin'
import useDeviceDetailsBackendUpdater from '../../../mobile-apps/push-notifications/fcm-token-handling/useDeviceDetailsBackendUpdater'
import createFileAndOpenIt from '../../../mobile-apps/local-downloads/createFileAndOpenIt'

// LCS: Importa la función - Wave 1
import { sendGAEvent, getUser_type, getBrowsing_type, getGAClientId, removeEmails } from '../../../core/utils/gtm';

const Login = (props: any) => {
  useMaybeGoToCarouselAfterLogin()
  useDeviceDetailsBackendUpdater()

  // pre-login query string
  const { search } = props.location

  const [open, setOpen] = useState((props.location.state && props.location.state.open) || false)
  const [state] = useState(props.location.state)
  const [isLoading, setIsLoading] = useState(false)
  const [showFirstLogin, setShowFirstLogin] = useState(true);
  const [showMfa, setShowMfa] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateCode, setUpdateCode] = useState('');
  const [mfaCode, setmfaCode] = useState('');
  const [loginData, setLoginData] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const timeToShow = process.env.REACT_APP_API_TIMEOUT_MFA;
  const { t } = useTranslation()
  const user = useSelector((state: any) => state.login.user)
  const classes = useStyles({})
  const dispatch = useDispatch()

  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.only('xs'))

  const userToken = sessionStorage.getItem('token')

  const supplantedUser = sessionStorage.getItem('supplantedUser')
  const userRoles = sessionStorage.getItem('userRoles') || ''

  const [isMobileAlertVisible, setIsMobileAlertVisible] = useState(true)
  const [isBrowserDialogVisible, setIsBrowserDialogVisible] = useState(false)

  const UPDATE_PASSWORD = '2909';
  const SET_PASSWORD = '2901';
  const SHOW_MFA = '2903';
  const SET_MFA = '0001';
  let nif
  let factura

  useEffect(() => {
    try {
      console.log("Cargando login...");
      // LCS: Enviar evento de GdC a GA - Wave 3
      getBrowsing_type()
      getGAClientId()
      sendGAEvent({
        event: 'view',
        content_group: 'login',
        page_url: removeEmails(window.location.href),
        user_id: 'no aplica',
        previous_path: document.referrer ? document.referrer : (sessionStorage.getItem("previousPage") ? removeEmails(sessionStorage.getItem("previousPage")) : 'no aplica'),
        user_type: 'no aplica',
        browsing_type: sessionStorage.getItem('browsing_type'),
        element_type: 'medicion de pagina',
        ga_client_id: sessionStorage.getItem('ga_client_id'),
        cups: 'no aplica',
        supply_type: 'no aplica'
      });
      sessionStorage.setItem("previousPage", window.location.href);
    } catch (error) {
      // LCS: Enviar evento a GA - Wave 1
      sendGAEvent({
        event: 'react_error',
        info:{
          error_message: 'Fallo al cargar el login',
          error: error,
          reactComponent: 'Login.tsx - useEffect',
        }
      });
    }
  },[])

  const handleCloseDialog = (e) => {
    setOpen(e)

    props.history.replace(props.location.pathname, null)
  }

  const handleCloseMobileAlert = () => {
    setIsMobileAlertVisible(false)
  }

  const handleOpenBrowserDialog = () => {
    setIsBrowserDialogVisible(true)
  }

  const handleCloseBrowserDialog = () => {
    setIsBrowserDialogVisible(false)
  }
  const dni = useSelector((state: any) => state.user.profile.documentNumber)
  //función que utilizamos para descargar una factura
  const handleDownloadDocument = (billNumber) => {
		if (billNumber && dni) {
			setIsLoading(true)
			dispatch(thunkGetDocumentBill(billNumber, 'ZEUFACTPRO02', (response) => {
				if (response && response.documentos) {
					let attachment = response.documentos.documento.id
					if (attachment) {
						dispatch(thunkGetDocumentBil(attachment, '', 'NO', (response) => {
							if (response && response.documento) {
								const linkSource = `data:${response.documento.tipoMime};base64,${response.documento.contenido}`

                if (isWeb()) {
                  const downloadLink = window.document.createElement('a')
                  downloadLink.href = linkSource
                  downloadLink.download = response.documento.nombre
                  downloadLink.click()
                } else {
                  // downloadLink.click() will attempt to force a client-side download, works for web,
                  // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
                  createFileAndOpenIt({ fileName: response.documento.nombre, contentAsBase64: linkSource })
                } 
								setIsLoading(false)
							} else {
								setIsLoading(false)
							}
						}))
					} else {
						setIsLoading(false)
					}
				} else {
					dispatch(showError('YYY'))
					setIsLoading(false)
				}
			}))
		}
	}

  const handleFirstLogin = (data: any) => {
    setLoginData(data.user);
    setIsLoading(false);
    setShowFirstLogin(false);
    if (data.result.codResult === UPDATE_PASSWORD || data.result.codResult === SET_PASSWORD) {
      setUpdateCode(data.result.codResult)
      setShowUpdate(true);
    } else if (data.result.codResult === SHOW_MFA || data.result.codResult === SET_MFA) {
      setShowMfa(true);
      if (data.result.codResult === SHOW_MFA) {
        setmfaCode(SHOW_MFA);
      } else {
        setmfaCode('');
      }
    } else {
      setShowMfa(false);
    }

  }

  const handleSend = () => {
    setIsLoading(true);
    setShowMfa(false);
    dispatch(thunkSendFirstLogin(setIsLoading, null, (response) => {
      if (response.result && response.result.codResult === SHOW_MFA) {
        setShowMfa(true);
        setIsLoading(false);
        setmfaCode(SHOW_MFA);
      } else {
        setShowUpdate(true);
        setIsLoading(false);
        setmfaCode('');
      }
    }));
  }

  const handleContinue = () => {
    setShowFirstLogin(true);
    setShowMfa(false);
    setShowUpdate(false);
  }

  const handleCancelMfa = () => {
    dispatch(setPassword(''));
    setShowFirstLogin(true);
  }

  const manageRedirect = () => {
    const userRolesArray = sessionStorage.getItem('userRolesAux').split(',');
    
    if (sessionStorage.getItem('gdprAccepted') === '0') {
      return <Redirect to='/gdpr' />
    } else if (userRolesArray.includes('US_SUPPLYPOINT_CLIENT') || userRolesArray.includes('US_MANAGER') || userRolesArray.includes('US_CC')) {
      return <Redirect to='/dashboard' />
    } else if (userRolesArray.includes('US_CONSULTANT')) {
      return <Redirect to='/supplies' />
    } else if (userRolesArray.includes('US_DOSSIER_CLIENT')) {
      return <Redirect to='/provisions' />
    } else if (sessionStorage.getItem('mfa') !== '1') {
      return <Redirect to='/landing' />
    }
  }

  const handleConfiguration = () => {
    if (sessionStorage.getItem('0001')) {
      dispatch(thunkGetConfiguredLogin(setIsLoading, null, (response) => {
        let indLegalAccept = '1'
        let webData = {
          indLegalAccept: indLegalAccept
        } as ZeusWebData

        dispatch(thunkZeusSincro(webData, user, null))
        dispatch(resetLoginState())

        const href = sessionStorage.getItem('href')
        let href3000 = [];
        let hrefcom = [];
        let hrefes = [];
        if (sessionStorage.href) {
          href3000 = (sessionStorage.href.split(':3000'))
          hrefcom = (sessionStorage.href.split('.com'))
          hrefes = (sessionStorage.href.split('.es'))
        }
        let hrefGo

        if (href3000[1]) {
          hrefGo = (sessionStorage.href.split(':3000'))
        }
        if (hrefcom[1]) {
          hrefGo = (sessionStorage.href.split('.com'))
        }
        if (hrefes[1]) {
          hrefGo = (sessionStorage.href.split('.es'))
        }

        sessionStorage.removeItem('href')

        //si logeamos y user es igual al guardado proviniente de la url (descargar factura)
        if (user === sessionStorage.getItem('nif_factura')) {
          handleDownloadDocument(sessionStorage.getItem('factura'))
        }

        // esto trata si llegamos desde un url que no sea directamente el login
        if (href && hrefGo[1] !== '/login') {
          props.history.push(hrefGo[1])
        } else {
          const queryStringValues = queryString.parse(search) as any

          if (!queryStringValues.redirectTo) {
            props.history.push('/login')
          } else {
            if (queryStringValues.dossier) {

              // redirect to dossier details

              let defaultName = t('provisions.defaultName')

              dispatch(thunkGetProvision(queryStringValues.dossier, defaultName, (response) => {
                if (response) {
                  dispatch(setCurrentProvisionHasContactMeButton(true))

                  props.history.push('/provisions/detail')
                } else {
                  props.history.push('/provisions')
                }
              }))
            } else {
              props.history.push(queryStringValues.redirectTo)
            }
          }
        }
      }))
    } else {
      sessionStorage.removeItem('0001')
      sessionStorage.setItem('userRoles', sessionStorage.getItem('userRolesAux'));
      manageRedirect();
    }
  }

  const checkLastPath = (lastPath: any) => {
    console.log(loginData);
    if (!lastPath) return false;
    else return true;
  }

  let href = sessionStorage.getItem('href')

  //comprobamos si el href guardado en sessionStorage contiene los params para descargar factura
  if (href && href.includes('nifcliente') && href.includes('numfactura')) {
    let splitHref = href.split('=')
    let splitHref2 = splitHref[1].split('|')
    let splitNif = splitHref2[0].split('::')
    let splitFact = splitHref2[1].split('::')
    nif = splitNif[1]
    factura = splitFact[1]
    sessionStorage.setItem('nif_factura', nif)
    sessionStorage.setItem('factura', factura)
    sessionStorage.removeItem('href')
  }

  if ((userToken !== '' && userRoles !== '') || supplantedUser) {
    if (state && state.request === '/delegation/update/') {
      let path = state.request + state.delegationsIds + '/' + state.status

      return <Redirect to={path} />
    } else {
      let userRolesArray = userRoles.split(',')

      // LCS: comprobamos el rol del usuario - Wave 2
      getUser_type()
      getBrowsing_type()
      getGAClientId()
      const user_type = sessionStorage.getItem('user_type')

      const browsing_type = sessionStorage.getItem('browsing_type')
      
      // LCS: Enviar evento a GA - Wave 2
      sendGAEvent({
        event: 'login',
        page_url: removeEmails(window.location.href),
        user_id: sessionStorage.getItem('id'),
        user_type:user_type,
        browsing_type: browsing_type
      });

      const lastPath = JSON.parse(sessionStorage.getItem('lastPath'));
      if (checkLastPath(lastPath)) {
        sessionStorage.removeItem('lastPath');
        return <Redirect to={lastPath.path} />
      }

      if (userRolesArray.includes('US_CC') && !supplantedUser) {
        return <Redirect to='/admin' />
      }

      const queryStringValues = queryString.parse(search) as any

      if (queryStringValues.redirectTo) {
        // Ejemplo: http://localhost:3000/login?redirectTo=/provisions/detail&dossier=EXP918223050002
        if (queryStringValues.dossier) {
          // redirect to dossier details

          // Ejemplo: http://localhost:3000/login?redirectTo=/provisions/detail&dossier=EXP918120040067&panel=panel1
          if (queryStringValues.panel) {
            dispatch(setUrlMessagesClientDossierPanel(queryStringValues.panel))
            return <Redirect to={{ pathname: '/provisions', state: { redirectTo: queryStringValues.dossier, panel: queryStringValues.panel } }} />
          } else {
            return <Redirect to={{ pathname: '/provisions', state: { redirectTo: queryStringValues.dossier } }} />
          }

        // Ejemplo: http://localhost:3000/login?redirectTo=/supplies/detail&supply=ES0022000008361151CV1P
        } else if (queryStringValues.supply) {
          // redirect to supplies detail

          // Ejemplo 1: http://localhost:3000/login?redirectTo=/supplies/detail&supply=ES0022000008361151CV1P&tabValue=1&menuTabValue=1&consumptionTabValue=1
          // Ejemplo 2: http://localhost:3000/login?redirectTo=/supplies/detail&supply=ES0022000004974084WE1P&tabValue=1&menuTabValue=1&generationTabValue=1
          if (queryStringValues.tabValue && queryStringValues.menuTabValue) {
              return <Redirect to={{ pathname: '/supplies', state: { supply: queryStringValues.supply, tabValue: queryStringValues.tabValue, menuTabValue: queryStringValues.menuTabValue, consumptionTabValue: (queryStringValues.consumptionTabValue || queryStringValues.consumptionTabValue === '0') ? queryStringValues.consumptionTabValue : '', generationTabValue: (queryStringValues.generationTabValue || queryStringValues.generationTabValue === '0') ? queryStringValues.generationTabValue : '' }}} />
          } else {
            return <Redirect to={{ pathname: '/supplies', state: { supply: queryStringValues.supply } }} />
          }
        
        // Ejemplo: http://localhost:3000/login?redirectTo=/requests/detail&request=ES-202301-A009013522
        } else if (queryStringValues.request) {
          // redirect to requests detail

          return <Redirect to={{ pathname: '/requests', state: { request: queryStringValues.request } }} />

        // Ejemplo: http://localhost:3000/login?redirectTo=/supplies
        } else if (queryStringValues.redirectTo === '/supplies') {
          // redirect to supplies list

          return <Redirect to={{ pathname: '/supplies', state: { redirectTo: queryStringValues.redirectTo } }} />
        } else {
          return <Redirect to={queryStringValues.redirectTo} />
        }
      } else if (sessionStorage.getItem('gdprAccepted') === '0') {
        return <Redirect to='/gdpr' />
      } else if (userRolesArray.includes('US_SUPPLYPOINT_CLIENT') || userRolesArray.includes('US_MANAGER') || userRolesArray.includes('US_CC')) {
        return <Redirect to='/dashboard' />
      } else if (userRolesArray.includes('US_CONSULTANT')) {
        return <Redirect to='/supplies' />
      } else if (userRolesArray.includes('US_DOSSIER_CLIENT')) {
        return <Redirect to='/provisions' />
      } else if (sessionStorage.getItem('mfa') !== '1') {
        return <Redirect to='/landing' />
      }
    }
  }

  return (
    <div className={classes.block}>
      {mobile && isMobileAlertVisible && isWeb() && (
        <>
          <MobileAlert
            handleCloseMobileAlert={handleCloseMobileAlert}
            handleOpenBrowserDialog={handleOpenBrowserDialog}
          />

          <BrowserDialog
            isBrowserDialogVisible={isBrowserDialogVisible}
            handleCloseBrowserDialog={handleCloseBrowserDialog}
          />
        </>
      )}

      {
        showFirstLogin ?
          <Grid
            container
            justifyContent='center'
            alignItems='center'
            className={classes.container}
            direction='column'
          >
            <Grid item className={classes.maxWidthForBigScreens} xs={12} md={10}>
              {
                isLoading &&
                <Spinner fixed={true} />
              }
              <Grid
                container
                alignItems='center'
              >
                <Grid item xs={12} sm={6} md={6} className={classes.login}>
                  <Route
                    exact
                    path='/login'
                    render={(props) =>
                      <LoginForm
                        {...props}
                        search={search}
                        setIsLoading={setIsLoading}
                        handleDownloadDocument={handleDownloadDocument}
                        handleFirstLogin={handleFirstLogin}
                      />
                    }
                  />
                  {
                    window.location.pathname.endsWith('/reset') && <ResetPassword />
                  }
                </Grid>
                <Grid item xs={12} sm={6} md={6} className={classes.register}>
                  <SignUp />
                </Grid>
                <DeleteSuccessModal open={open} closeaux={handleCloseDialog} />
              </Grid>
            </Grid>
          </Grid> :
          <>
            {
              isLoading && <Spinner fixed={true} />
            }
            {
              showMfa &&
              <MfaInput data={loginData} time={timeToShow} handleCancel={handleCancelMfa} setIsLoading={setIsLoading} handleDownloadDocument={handleDownloadDocument} mfaCode={mfaCode} setmfaCode={setmfaCode} {...props} handleSend={handleSend} handleConfiguration={handleConfiguration} />
            }
            {
              showUpdate && <UpdatePassword data={loginData} handleSend={handleSend} setIsLoading={setIsLoading} handleContinue={handleContinue} updateCode={updateCode} {...props} />
            }
          </>
      }
    </div>
  )
}

export default withRouter(Login)
