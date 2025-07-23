import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import Spinner from '../../../../common/components/spinner/Spinner'

import Input from '../../../../common/components/input/Input'
import Button from '../../../../common/components/button/Button'

import { validateUserCode } from '../../../../common/lib/ValidationLib'

import { thunkGetAssignRole, thunkPutAssignRole, thunkActivateUser } from '../../../actions/UsuariosThunkActions'

import useStyles, { StyledTableCell } from './AssignRole.styles'
import { FormControl, InputLabel, MenuItem, Select, useMediaQuery, useTheme } from '@material-ui/core'
import { thunkGetMasterData } from '../../../../supplies/supplies-details/store/actions/SuppliesDetailsThunkActions'

// LCS: Importa la función - Wave 3
import { sendGAEvent } from '../../../../core/utils/gtm';

const AssignRole = (props: any) => {

  const classes = useStyles({})
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [user, setUser] = useState<string>('')
  const [error, setError] = useState<boolean>(false)
  const [searchButtonStatus, setSearchButtonStatus] = useState<boolean>(false)
  const [roleButtonStatus, setRoleButtonStatus] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [userState, setUserState] = useState<number>(0)

  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

  const userRole = 'US_USER'
  const adminRole = 'US_CC'

  const roles = [
    {
      rolename: userRole
    },
    {
      rolename: adminRole
    }
  ]

  const [userData, setUserData] = useState({
    documentNumber: '',
    name: '',
    surname: '',
    enabled: '',
    emailValidated: '',
    hash: '',
    email: '',
    oauthUserId: '',
    roles: ''
  })


  const [rolesList, setRolesList] = useState([]);
  const [rolToAssign, setRolToAssign] = useState('')

  const handleChangeSelect = (event) => {
    setRolToAssign(event.target.value as string);
  };

  const onUserChange = (user) => {
    setUser(user)

    if (validateUserCode(user)) {
      setError(false)
      setSearchButtonStatus(true)
    }
    else {
      setError(true)
      setSearchButtonStatus(false)
    }
  }

  const resetUserData = () => {
    setUserData({
      documentNumber: '',
      name: '',
      surname: '',
      enabled: '',
      emailValidated: '',
      hash: '',
      email: '',
      oauthUserId: '',
      roles: ''
    })
  }

  const checkAdminRole = (roles) => {
    return roles.includes(adminRole) ? true : false
  }

  const searchUser = (documentNumber) => {
    setIsLoading(true)

    // Llamada para recuperar la información del usuario
    dispatch(thunkGetAssignRole(documentNumber, (response) => {
      if (response && response.length > 0) {
        setUserData({
          documentNumber: response[0].document ? response[0].document : '',
          name: response[0].name ? response[0].name : '',
          surname: response[0].surname ? response[0].surname : '',
          enabled: response[0].enabled || response[0].enabled === 0 ? response[0].enabled.toString() : '',
          emailValidated: response[0].emailValidated || response[0].emailValidated === 0 ? response[0].emailValidated.toString() : '',
          hash: response[0].hash ? response[0].hash : '',
          email: response[0].email ? response[0].email : '',
          oauthUserId: response[0].oauthUserId ? response[0].oauthUserId.toString() : '',
          roles: response[0].roles ? response[0].roles : ''
        })
        setIsLoading(false)
      } else {
        resetUserData()
        setIsLoading(false)
      }
    }))
  }

  const updateUser = () => {
    setIsLoading(true)
    // Activar/habilitar usuario y asignarle roles
    if (userState === 1) {
      dispatch(thunkActivateUser(userData.hash, userData.email, (response) => {
        if (response) {
          //[{rolename:rolToAssign}]
          dispatch(thunkPutAssignRole(userData.oauthUserId, [{ rolename: rolToAssign }], (response2) => {
            if (response2) {
              // Actualizamos la información por pantalla
              if (userData.documentNumber !== '') {
                searchUser(userData.documentNumber)
              }
              else {
                setIsLoading(false)
              }
            }
            else {
              setIsLoading(false)
            }
          }))
        }
        else {
          setIsLoading(false)
        }
      }))
    }
    // Activar/habilitar usuario
    else if (userState === 2) {
      dispatch(thunkActivateUser(userData.hash, userData.email, (response) => {
        if (response) {
          // Actualizamos la información por pantalla
          if (userData.documentNumber !== '') {
            searchUser(userData.documentNumber)
          }
          else {
            setIsLoading(false)
          }
        }
        else {
          setIsLoading(false)
        }
      }))
    }
    // Asignar roles al usuario
    else if (userState === 3) {
      dispatch(thunkPutAssignRole(userData.oauthUserId, [{ rolename: rolToAssign }], (response) => {
        if (response) {
          // Actualizamos la información por pantalla
          if (userData.documentNumber !== '') {
            searchUser(userData.documentNumber)
          }
          else {
            setIsLoading(false)
          }
        }
        else {
          setIsLoading(false)
        }
      }))
    }

    // LCS: Enviar evento de negocio a GA - Wave 3
    sendGAEvent({
      event: 'assign_role',
      user_id: sessionStorage.getItem('id'),
      user_type: sessionStorage.getItem('user_type'),
      //user_document: sessionStorage.getItem('userDocumentLogin')
    });   
  }

  useEffect(() => {
    // Si el usuario no está activo (falta confirmar registro) o si no tiene el rol de Administrador, habilitamos el 2o botón
    if (userState > 0 && rolToAssign.length > 0 && validateUserCode(user)) {
      setRoleButtonStatus(true)
    } else {
      setRoleButtonStatus(false)
    }
  }, [userState, rolToAssign, user])

  useEffect(() => {
    // Llamada para conseguir lista de roles
    dispatch(thunkGetMasterData('ROLES', 'ES', '', (response) => {
      setRolesList(response);
    }));
  }, [])

  useEffect(() => {
    if (userData.enabled === '0' && userData.roles !== '' && !checkAdminRole(userData.roles)) {
      setUserState(1) // Usuario NO habilitado y sin rol de administrador
    }
    else if (userData.enabled === '0') {
      setUserState(2) // Usuario NO habilitado y con rol de administrador
    }
    else if (userData.roles !== '') {
      setUserState(3) // Usuario habilitado y sin rol de administrador
    }
    else {
      setUserState(0) // Usuario habilitado y con rol de administrador [OK]
    }
  }, [userData])

  return (
    <>
      {
        isLoading &&
        <Spinner fixed={true} />
      }

      <Grid container justifyContent='center' className={classes.inputsAreaWrapper}>
        <Grid container justifyContent='center' className={classes.inputsArea}>
          <Grid container xs={9} sm={9} md={7} justify='space-between'>
            {/* codigo agente */}
            <Grid container justifyContent='space-between' className={classes.rolContainer}>
              <Grid item xs={12} sm={12} md={5}>
                <p className={classes.inputTitle}>{t('gestionUsuarios.management.assignRole.agentCode')}</p>
                <Input
                  className={classes.input}
                  showValidationIcon
                  color={'white'}
                  fullWidth
                  error={user !== '' && error}
                  value={user}
                  onChange={({ target }) => {
                    onUserChange(target.value)
                  }}
                />
              </Grid>
              {/* Boton de buscar usuario */}
              <Grid item xs={12} sm={12} md={5} className={`${classes.buttonWrapper} ${error && classes.inactive}`}>
                <p className={classes.inputTitle}>{}</p>
                <Button
                  fullWidth
                  text={t('gestionUsuarios.management.assignRole.buttons.search')}
                  color={'primary'}
                  size={'large'}
                  variant={'contained'}
                  onClick={() => { searchUser(user) }}
                  disabled={!searchButtonStatus}
                />
              </Grid>
            </Grid>


            {userData.documentNumber === '' &&
              <Grid item className={classes.inputTitle}>
                {'* ' + t('gestionUsuarios.management.assignRole.description')}
              </Grid>
            }

            {userData.documentNumber !== '' &&

              <Grid container justifyContent='space-between' className={classes.rolContainer}>
                {/* Desplegable para asignar rol */}
                <Grid item xs={12} sm={12} md={5} className={classes.lowMargin}>
                  <FormControl fullWidth variant='outlined'>
                    <InputLabel>{t('gestionUsuarios.management.assignRole.tableRow.rol')}</InputLabel>
                    <Select
                      className={classes.select}
                      value={rolToAssign}
                      color={'primary'}
                      label={t('gestionUsuarios.management.assignRole.tableRow.rol')}
                      onChange={handleChangeSelect}
                    >
                      {
                        rolesList.map((item) => {
                          return <MenuItem key={item.key} value={item.key}>{
                            item.value
                          }</MenuItem>
                        })}
                    </Select>
                  </FormControl>
                </Grid>
                {/* Boton asignar rol */}
                <Grid container xs={12} sm={12} md={5} className={`${classes.buttonWrapper} ${error && classes.inactive}`}>
                  <p className={classes.inputTitle}> {}</p>
                  <Button
                    fullWidth
                    text={userState === 1 ? t('gestionUsuarios.management.assignRole.buttons.activateUserAndRole') :
                      userState === 2 ? t('gestionUsuarios.management.assignRole.buttons.activateUser') : t('gestionUsuarios.management.assignRole.buttons.assignRole')}
                    color={'primary'}
                    size={'large'}
                    variant={'contained'}
                    onClick={updateUser}
                    disabled={!roleButtonStatus}
                  />
                </Grid>
              </Grid>
            }

            {userData.documentNumber !== '' && !mobile &&
              <Grid container>
                <p className={classes.tableTitle}>{t('gestionUsuarios.management.assignRole.tableTitle')}</p>

                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell className={classes.headTableCell}>{t('gestionUsuarios.management.assignRole.tableRow.agent')}</StyledTableCell>

                      <StyledTableCell className={classes.headTableCell}>{t('gestionUsuarios.management.assignRole.tableRow.name')}</StyledTableCell>

                      <StyledTableCell className={classes.headTableCell}>{t('gestionUsuarios.management.assignRole.tableRow.active')}</StyledTableCell>

                      <StyledTableCell className={classes.headTableCell}>{t('gestionUsuarios.management.assignRole.tableRow.rol')}</StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow className={classes.row}>
                      <StyledTableCell className={classes.boldCell}>{userData.documentNumber}</StyledTableCell>

                      <StyledTableCell className={classes.boldCell}>{userData.name + ' ' + userData.surname}</StyledTableCell>

                      <StyledTableCell className={classes.boldCell}>
                        {userData.enabled === '1' ? t('gestionUsuarios.management.assignRole.tableRow.yes') : t('gestionUsuarios.management.assignRole.tableRow.no')}
                      </StyledTableCell>

                      <StyledTableCell className={classes.boldCell}>
                        {userData.roles.split(',').map((item, index) => {
                          // si tiene el rol de user basico
                          if (item === 'US_USER') {
                            if (index === userData.roles.split(',').length - 1) {
                              return <>{'Usuario basico'}</>
                            }
                            return <>{'Usuario basico, '}</>

                          }
                          let obj = rolesList.find(x => x.key === item)
                          if (obj) {
                            if (index === userData.roles.split(',').length - 1) {

                              return <>{obj.value}</>
                            }
                            return <>{obj.value + ', '}</>
                          }
                        })}
                      </StyledTableCell>
                      {/*
                      Desplegable para los roles del usuario
                       <StyledTableCell className={classes.boldCell}>
                        <select className={classes.select}>
                        {userData.roles.split(',').map((item) => {
                          return (<option key={item} value={item}>
                            {t(`gestionUsuarios.management.assignRole.roles.${item}`)}
                          </option>);
                        })}
                            </select>
                      </StyledTableCell> */}

                      {/* {checkAdminRole(userData.roles) ? t('gestionUsuarios.management.assignRole.tableRow.yes') : t('gestionUsuarios.management.assignRole.tableRow.no')} */}

                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            }

            {userData.documentNumber !== '' && mobile &&
              <Grid container spacing={2} style={{ marginTop: '10px', marginBottom: '10px' }}>
                <Grid item lg={4} md={6} sm={6} xs={12}>
                  <Grid className={`${classes.item}`}>
                    <Grid className={classes.rowMosaic}>
                      <div className={classes.title}>{t('Agente')}</div>
                      <div className={`${classes.value} bold`}>{userData.documentNumber}</div>
                    </Grid>

                    <Grid className={classes.rowMosaic}>
                      <div className={classes.title}>{'Nombre completo'}</div>

                      <div className={`${classes.value} bold`}>
                        {userData.name + ' ' + userData.surname}
                      </div>
                    </Grid>

                    <Grid className={classes.rowMosaic}>
                      <div className={classes.title}>{'Activo'}</div>

                      <div className={classes.value}>
                        {
                          userData.enabled === '1' ? t('gestionUsuarios.management.assignRole.tableRow.yes') : t('gestionUsuarios.management.assignRole.tableRow.no')
                        }
                      </div>
                    </Grid>

                    <Grid className={classes.rowMosaic}>
                      <div className={classes.title}>{'Rol'}</div>

                      <div className={classes.value}>
                        {userData.roles.split(',').map((item, index) => {
                          // si tiene el rol de user basico
                          if (item === 'US_USER') {
                            if (index === userData.roles.split(',').length - 1) {
                              return <div className={`${classes.value} bold`}>
                                {'Usuario basico'}
                              </div>

                            }
                            return <div className={`${classes.value} bold`}>
                              {'Usuario basico, '}
                            </div>

                          }
                          let obj = rolesList.find(x => x.key === item)
                          if (obj) {
                            if (index === userData.roles.split(',').length - 1) {

                              return <div className={`${classes.value} bold`}>{obj.value}</div>
                            }
                            return <div className={`${classes.value} bold`}>{obj.value + ', '}</div>
                          }
                        })}
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            }

          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
export default AssignRole;


