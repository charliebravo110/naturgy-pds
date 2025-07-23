import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import useStyles from './DeleteUser.styles'
import Spinner from '../../../../common/components/spinner/Spinner'
import Button from '../../../../common/components/button/Button'
import List from './List/List'
import CredentialInputs from './credential-inputs/CredentialInputs'

import { validateNIF, validateCIF, validateNIE } from '../../../../common/lib/ValidationLib'
import { setSearchedUser } from '../../../../admin/store/actions/AdminActions'
import { thunkDeleteUserOvde } from '../../../../common/store/actions/UserThunkActions'
import DeleteModal from './deleteModal/DeleteModal'

import { thunkGetActiveUsersByDocumentId, thunkGetLoginUsers } from '../../../actions/UsuariosThunkActions'
import DeleteUpModal from './modal/DeleteUpModal'
// import { thunkDeleteUserOvde } from '../../../../common/store/actions/UserThunkActions'

// LCS: Importa la función - Wave 3
import { sendGAEvent } from '../../../../core/utils/gtm';

const DeleteUser = (props: any) => {

  const styles = useStyles({})
  const { t } = useTranslation()
  const dispatch = useDispatch()

  //const userToken = useSelector((state: any) => state.user.token)

  const searchedUser = useSelector((state: any) => state.admin.searchedUser)
  const adminToken = useSelector((state: any) => state.admin.token)

  const [credential, setCredential] = useState<string>('')
  const [credentialType, setCredentialType] = useState('')
  const [idUser, setIdUser] = useState('')


  const [error, setError] = useState<boolean>(true)
  const [searchedUsers, setSearchedUsers] = useState({} as any)

  const [errorSearch, setErrorSearch] = useState<boolean>(true)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [open, setOpen] = useState<boolean>(false)
  
  const [activ, setActiv] = useState<boolean>(true)
 
  const [isOpen, setIsOpen] = useState(false);

  const [doc, setDoc] = useState('')
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')

  

  const handleSearch = () => {
        setIsLoading(true)
        dispatch(thunkGetLoginUsers(credential, '', null, null, (response: { usersLogin?: { items: Array<any> } }) => {
            if (response && response.usersLogin && response.usersLogin.items.length > 0) {
              let user = response.usersLogin.items[0]
              setSearchedUsers(user)
    
              setName(user.name || '')
              setDoc(user.document || '')
              setSurname(user.surname || '')
              
              setActiv(!userBaja(user.cancelDate, user.registrationDate))
              
              setIsLoading(false)
            } else {
              setIsLoading(false)
            }
        }))
        
        // LCS: Enviar evento de negocio a GA - Wave 3
        sendGAEvent({
          event: 'search_user_manage_user',
          user_id: sessionStorage.getItem('id'),
          user_type: sessionStorage.getItem('user_type'),
          //user_document: sessionStorage.getItem('userDocumentLogin')
        });
    }

    const convertirFecha = (fechaStr) => {
      const [fecha, hora] = fechaStr.split(' ');
      const [dia, mes, anio] = fecha.split('/');
      const [horas, minutos, segundos] = hora.split(':');
  
      return new Date(anio, mes - 1, dia, horas, minutos, segundos);
  };
      const userBaja = (dateCancel:string,datelastLoginDate:string):boolean =>{
       
    
        if(!dateCancel){
          return false
        }else{
          if(convertirFecha(dateCancel) > convertirFecha(datelastLoginDate))
          {
            return true
          }else {    
            return false
          }
         
        }
      }



  
  const handleAccept = () => {
    // setIsLoading(true)
    let userNotCommons = searchedUsers.userId
    if (searchedUsers.userId) {
      setIsLoading(true)
      dispatch(thunkDeleteUserOvde(userNotCommons, adminToken, 'no', setIsLoading, () => {
        dispatch(setSearchedUser({}))
        setCredential('')
        setCredentialType('')
        setErrorSearch(true)
        setError(true)
        setOpen(true)
      }))
    }

    // LCS: Enviar evento de negocio a GA - Wave 3
    sendGAEvent({
      event: 'unsubscribe_user',
      user_id: sessionStorage.getItem('id'),
      user_type: sessionStorage.getItem('user_type'),
      //user_document: sessionStorage.getItem('userDocumentLogin')
    });
  }

  const handleCloseDialog = (e) => {
    setOpen(e)
  }

  useEffect(() => {
    const validateCredentials = () => {
      switch (credentialType) {
        default:
          setError(true)
          break
        case 'NIF':
          setError(!validateNIF(credential))
          break
        case 'CIF':
          setError(!validateCIF(credential))
          break
        case 'NIE':
          setError(!validateNIE(credential))
      }
    }

    if (credential !== '') {
      validateCredentials()
    }

  }, [credentialType, credential])

  useEffect(() => {
    dispatch(setSearchedUser({}))
  }, [])

  useEffect(() => {
    if (searchedUsers) {
      if (searchedUsers.document) {
        
        setErrorSearch(false)
      }
    
    }
  }, [searchedUsers])

  const handleDialogOpen = () => {
    setIsOpen(true)
  }
  const handleDialogClose = () => {
    setIsOpen(false)
  }

  return (
    
    <>

      <DeleteUpModal isOpen={isOpen} handleClose={handleDialogClose} handleAccept={handleAccept} doc={doc} name={name} surname={surname}/>

      {isLoading &&
        <Spinner fixed={true} />
      }
      <Grid container direction='column' justify='space-between'>
        <Grid container justifyContent='center' className={styles.inputsAreaWrapper}>
          <Grid container justifyContent='center' className={styles.inputsArea}>
            <Grid container direction='row' md={10} className={styles.center}>
              <CredentialInputs
                credentialType={credentialType}
                setCredentialType={setCredentialType}
                credential={credential}
                setCredential={setCredential}
                error={error}
              />
              <Grid container spacing={2} className={styles.center}>
                <Grid item>
                  <Button
                    text={t('gestionUsuarios.management.deleteUser.searchButton')}
                    color={'primary'}
                    size={'medium'}
                    variant={'contained'}
                    onClick={handleSearch}
                    disabled={error}
                  />
                </Grid>
                <Grid item>
                  <Button
                  //DAR DE BAJA
                    text={t('gestionUsuarios.management.deleteUser.deleteButton')}
                    color={'primary'}
                    size={'medium'}
                    variant={'contained'}
                    onClick={handleDialogOpen}
                    //onClick={handleAccept}
                    disabled={errorSearch ||!activ}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid container direction='row' md={12} className={styles.listContainer}>
              <Grid className={styles.inputTitle}>{t('gestionUsuarios.management.deleteUser.searchResult')}</Grid>
              <List searchedUser={searchedUsers} activ={activ} />
            </Grid>
          </Grid>
        </Grid>

        <DeleteModal open={open} closeaux={handleCloseDialog} />

      </Grid>
    </>
  );
}
export default DeleteUser;
