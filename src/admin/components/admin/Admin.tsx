import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import { DialogContent } from '@material-ui/core'
import CredentialInputs from '../credential-inputs/CredentialInputs'
import EmailInput from '../email-input/EmailInput'
import UserCard from '../user-card/UserCard'
import Dialog from '../../../common/components/dialog/Dialog'
import Button from '../../../common/components/button/Button'
import Spinner from '../../../common/components/spinner/Spinner'
import CloseIcon from '../../../assets/icons/cerrar.svg'
import NoItemsIcon from '../../../assets/icons/aviso_alerta_pop_up.svg'
import InfoIcon from '../../../assets/icons/info.svg';
import { validateMail, validateNIF, validateCIF, validateNIE, validateDossierCode, validateCupsNumber, validateSrNumber } from '../../../common/lib/ValidationLib'
import { resetUrlMessages } from '../../../common/components/send-url/store/actions/UrlMessagesActions'
import { setSearchedUser } from '../../store/actions/AdminActions'
import { thunkGetSearchedUserLimit25, thunkSearchUserByParam } from '../../store/actions/AdminThunkActions'
import useStyles from './Admin.styles'
import DossierInputs from '../dossier-input/DossierInputs'
import { thunkGetDossier } from '../../../provisions/store/actions/ProvisionsThunkActions'
import CupsInput from '../cups-input/CupsInput'
import SrInput from '../sr-input/SrInput'
import { thunkGetLoginUsersLimit } from '../../../usersManagement/actions/UsuariosThunkActions'

// LCS: Importa la función - Wave 2
import { sendGAEvent, removeEmails } from '../../../core/utils/gtm';

const Admin = () => {
  const [credentialType, setCredentialType] = useState('')
  const [credential, setCredential] = useState('')
  const [email, setEmail] = useState('')
  const [cups, setCups] = useState('')
  const [sr, setSr] = useState('')
  const [name, setName] = useState('')
  const [dossier, setDossier] = useState('')
  const [selectedInput, setSelectedInput] = useState(0)
  const [error, setError] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [searchedUsersLogin, setSearchedUsersLogin] = useState({} as any)
  const [limit25, setLimit25] = useState(false)


  const [showingDialog, setShowingDialog] = useState(false)

  const searchedUser = useSelector((state: any) => state.admin.searchedUser)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  let token = sessionStorage.getItem('token')
  let userRoles = sessionStorage.getItem('userRoles') || ''
  let userRolesArray = userRoles.split(',')

  const classes = useStyles({})

  useEffect(() => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'view',
      content_group: 'buscar usuarios',
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

  const selectInput = (n) => {
    const conditions = [
      [email, dossier, cups, sr],    
      [credential, dossier, cups, sr],
      [credential, email, cups, sr],  
      [credential, email, dossier, sr], 
      [credential, email, dossier, cups]
    ];
  
    // Verificar si todos los valores en la condición están vacíos
    const isEmpty = conditions[n - 1].every(value => value === '');
    if (isEmpty) {
      setSelectedInput(n);
    }
  }

  const handleSearchButton = () => {
    // LCS: Enviar evento de negocio a GA - Wave 2
    sendGAEvent({
      event: 'search_user_impersonate_user',
      user_id: sessionStorage.getItem('id'),
      user_type: sessionStorage.getItem('user_type'),
      //user_document: sessionStorage.getItem('userDocumentLogin')
    });

    dispatch(setSearchedUser({}))
    setShowingDialog(false)
    let docNumber = ''
    setSearchedUsersLogin('')
    setLimit25(false)
    if (!error) {
      setIsLoading(true)
      // hacemos busqueda del usuario en PDS si no existe serched user vacio
      dispatch(thunkGetLoginUsersLimit(credential, '', null, null, 25, (response) => {
        if (response && response.result && response.result.codResult && response.result.codResult === '0000') {
          let userLoginUser = response.usersLogin.items[0]
          setSearchedUsersLogin(userLoginUser)
        }
      }))
      
      searchUserByDossierOrParam(docNumber)
    }
  }
 
  const searchUserByDossierOrParam = (docNumber) => {
    if (dossier !== '') {
      searchUserByDossier(docNumber);
    } else if (cups !== '' || sr !== '') {
      searchUserByParam();
    } else {
      searchUser();
    }
  }

  const searchUserByDossier = (docNumber) => {
    dispatch(thunkGetDossier(dossier, (response) => {
      if (response && response.result && response.result.codResult && response.result.codResult === '25') {
        setLimit25(true)
        setIsLoading(false)
      } else if (response && response.dossier) {
        if (response.dossier.applicant && response.dossier.applicant.docNumber && response.dossier.applicant.docNumber !== '') {
          docNumber = response.dossier.applicant.docNumber
          dispatch(thunkGetSearchedUserLimit25(docNumber, email, cups, sr, name, setIsLoading, (response) => {
            if (response && response.result && response.result.codResult === '0000') {
              setShowingDialog(true)
              setLimit25(false)
            } else if (response.result && response.result.codResult && response.result.codResult === '0025') {
              setLimit25(true)
              setIsLoading(false)
            }
            
          }))
        } else {
          setShowingDialog(true)
          setIsLoading(false)
        }
      }
      setIsLoading(false)
    }))
  }
  const searchUserByParam = () =>{
    dispatch(thunkSearchUserByParam(cups, sr, setIsLoading, (response) => {
      if (response && response !== '') {
        dispatch(thunkGetSearchedUserLimit25(response, email, cups, sr, name, setIsLoading, (response) => {
          if (typeof response === 'boolean') {
            if (response) {
              setShowingDialog(true)
              setLimit25(false)
              setIsLoading(false)
            }
          } else if (response.result?.codResult === '0025') {
            setLimit25(true)
            setIsLoading(false)
          } else {
            setShowingDialog(true)
            setIsLoading(false)
          }
        }))
      } else {
        setShowingDialog(true)
        setIsLoading(false)
      }
      setIsLoading(false)
    }))
  }
  const searchUser = () => {
    dispatch(thunkGetSearchedUserLimit25(credential, email, cups, sr, name, setIsLoading, (response) => {
      console.log('Response from thunkGetSearchedUserLimit25:', response); // Debug the response
      if (typeof response === 'boolean') {
        if (response) {
          setShowingDialog(true)
          setLimit25(false)
          setIsLoading(false)
        }
      } else if (response?.result?.codResult === '0025') {
        setLimit25(true)
        setIsLoading(false)
      } else {
        setShowingDialog(true)
        setIsLoading(false)
      }

    }))
  }
  useEffect(() => {
    const validateCredentials = () => {
      switch (credentialType) {
        case 'NIF':
          setError(!validateNIF(credential))
          break
        case 'CIF':
          setError(!validateCIF(credential))
          break
        case 'NIE':
          setError(!validateNIE(credential))
          break
        default:
          setError(true)
          break
      }
    }

    if (credential !== '') {
      validateCredentials()
    } else if (email !== '') {
      setError(!validateMail(email))
    } else if (dossier !== '') {
      setError(!validateDossierCode(dossier))
    } else if (cups !== '') {
      setError(!validateCupsNumber(cups))
    } else if (sr !== '') {
      setError(!validateSrNumber(sr))
    } else {
      setSelectedInput(0)
    }

  }, [email, credentialType, credential, dossier, cups, sr])

  useEffect(() => {
    dispatch(resetUrlMessages())
  }, [])

  const handleCloseDialog = () => {
    setShowingDialog(false)
  }

  if (!token) {
    return <Redirect to='/login' />
  }

  if (!userRolesArray.includes('US_CC')) {
    if (userRolesArray.includes('US_SUPPLYPOINT_CLIENT') || userRolesArray.includes('US_MANAGER') || userRolesArray.includes('US_CC')) {
      return <Redirect to='/dashboard' />
    } else if (userRolesArray.includes('US_CONSULTANT')) {
      return <Redirect to='/supplies' />
    } else {
      return <Redirect to='/landing' />
    }
  }



  return (
    <>
      {
        isLoading &&
        <Spinner fixed={true} />
      }

      {/* <Dialog className={classes.dialog} open={showingDialog} onClose={handleCloseDialog}>
        <DialogContent className={classes.dialogContainer}>
          <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleCloseDialog} />

          <Grid container className={classes.noItems}>
            <Grid item>
              <img src={NoItemsIcon} alt='' />

              <Grid container>
                <Grid container className='row title'>{t('admin.dialog.title')}</Grid>

                <Grid container className='buttons'>
                  <Button
                    text='Continuar'
                    color='primary'
                    size='large'
                    variant='contained'
                    onClick={handleCloseDialog}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog> */}

      <Grid container justifyContent='center' alignItems='center' className={classes.container}>
        <Grid item xs={11} sm={10} className={classes.maxWidthForBigScreens}>
          <Grid item className={classes.headerTitle}>{t('admin.header.title')}</Grid>

          <Grid item xs={12} sm={9} md={6} className={classes.headerSubTitle}>
            <b className={classes.orangeSubtitle}>{t('admin.header.firstSubHeader')}</b>

            <p>{t('admin.header.secondSubHeader')}</p>
          </Grid>

          <Grid container justifyContent='center' className={classes.inputsAreaWrapper}>
            <Grid container justifyContent='center' className={classes.inputsArea}>
              <CredentialInputs
                credentialType={credentialType}
                setCredentialType={setCredentialType}
                credential={credential}
                setCredential={setCredential}
                error={error}
                selectedInput={selectedInput}
                selectInput={selectInput}
              />

              <DossierInputs
                dossier={dossier}
                setDossier={setDossier}
                error={error}
                selectedInput={selectedInput}
                selectInput={selectInput}
              />

              <EmailInput
                email={email}
                setEmail={setEmail}
                error={error}
                selectedInput={selectedInput}
                selectInput={selectInput}
              />

              <CupsInput
                cups={cups}
                setCups={setCups}
                error={error}
                selectedInput={selectedInput}
                selectInput={selectInput}
              />

              <SrInput
                sr={sr}
                setSr={setSr}
                error={error}
                selectedInput={selectedInput}
                selectInput={selectInput}
              />

              <Grid container item xs={11} sm={8} className={`${classes.buttonWrapper} ${error && classes.inactive}`}>
                <Button
                  text={t('admin.searchButton')}
                  color={'primary'}
                  size={'large'}
                  variant={'contained'}
                  onClick={handleSearchButton}
                  disabled={error}
                />
              </Grid>
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              {
                (!limit25 && ((searchedUser && searchedUser.userId) || showingDialog)) &&
                  <UserCard user={searchedUser} setIsLoading={setIsLoading} searchedUsersLogin={searchedUsersLogin} showingDialog={showingDialog}/>
              }
            </Grid>
          </Grid>

          { limit25 &&
            <Grid container justifyContent='center' className={classes.inputsAreaWrapper}>
              <Grid container justifyContent='center' className={classes.innerLimitBox}>
                <Grid item className={classes.limitIcon}>
                  <img src={InfoIcon} alt='' />
                </Grid>
                <Grid className={classes.limitText}>
                  {t('admin.limit25.info1')}<b>{t('admin.limit25.info2')}</b>{t('admin.limit25.info3')}<b>{t('admin.limit25.info4')}</b>{t('admin.limit25.info5')}
                </Grid>
              </Grid>
            </Grid>
          }
        </Grid>
      </Grid>

      

    </>
  )
}

export default Admin