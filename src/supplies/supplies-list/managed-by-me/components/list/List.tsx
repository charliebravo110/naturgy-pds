import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import ConsumptionIcon from '../../../../../assets/icons/ico_listado_consumo.svg'
import GenerationIcon from '../../../../../assets/icons/ico_listado_generacion.svg'
import Pagination from '../../../../../common/components/pagination/Pagination2'
import Checkbox from '../checkbox/Checkbox'
import useStyles, { StyledTableCell } from './List.styles'
import { createTheme, MuiThemeProvider, TableSortLabel } from '@material-ui/core'
import AlertaActiva from '../../../../../assets/icons/icon_AlertaActiva.svg'
import ActivarAlerta from '../../../../../assets/icons/icon_Activar alerta.svg'
import DesactivarAlerta from '../../../../../assets/icons/icon_DesactivarAlerta.svg'
import IconTextButton from '../../../../../common/components/icon-text-button/IconTextButton'
import { useDispatch, useSelector } from 'react-redux'
import { setAlerts, deleteAlerts } from '../../../../store/actions/AlertsActions'
import { thunkCreateOrUpdateAlert } from '../../../../store/actions/AlertsThunkAction'
import ArrowTooltip from '../../../../../common/components/tooltip/arrow/ArrowTooltip'
import { getUserSession } from '../../../../../common/store/actions/UserThunkActions'
import IcoGestor from '../../../../../assets/icons/ico_Gestor.svg'
import IcoAsesor from '../../../../../assets/icons/ico_Asesor.svg'
import { actualLocalDate, capitalizeFirstLetter } from '../../../../../common/lib/FormatLib'
import { useHistory } from 'react-router';
import AlertIcon from '../../../../../assets/icons/aviso_alerta_pop_up.svg'
import LoadingAnimation from '../../../../../assets/img/spinner.gif'

// LCS: Importar funciones - Wave 3
import { sendGAEvent, removeEmails } from '../../../../../core/utils/gtm'

const List = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()
  const alerts = useSelector((state: any) => state.alerts.list)
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  let history = useHistory();

  const {
    listItems,
    setFinalList,
    selectedItemsList,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    handleClickCheckbox,
    handleClickDelegate,
    adminToken,
    isLoadingManaged
  } = props

  const theme = createTheme({
    overrides: {
      MuiTooltip: {
        tooltip: {
          fontSize: '1em',
          backgroundColor: 'white !important',
          color: '#5985a2 !important',
          padding: '15px !important',
          boxShadow: '2px 2px 2px 2px #e2e2e2 !important',
          maxWidth: '300px !important',
          fontFamily: 'FSEmeric',
          textAlign: 'center'
        },
        tooltipArrow: {
          fontSize: '1em',
          backgroundColor: 'white !important',
          color: '#5985a2 !important',
          padding: '15px !important',
          boxShadow: '2px 2px 2px 2px #e2e2e2 !important',
          maxWidth: '300px !important',
          fontFamily: 'FSEmeric',
          textAlign: 'center'
        }
      }
    }
  });

  // const onlydescStatus = listItems.filter(item => item.descStatus == 'ACTIVO CONTRATADO');
  const onlydescStatus = listItems;

  const target = document.getElementById('number') as HTMLSelectElement

  const onChangeSelector = () => {
    setCurrentPage(0)
    setItemsPerPage(Number(target.options[target.selectedIndex].value))
  }
  //usamos estas constantes para controlar la ordenación en columnas
  const [orderByCupsAsc, setOrderByCupsAsc] = useState(false)
  const [orderByNameAsc, setOrderByNameAsc] = useState(false)
  const [orderByAdressAsc, setOrderByAdressAsc] = useState(false)
  const [directionCode, setDirectionCode] = useState('desc')
  const [showNameArrow, setShowNameArrow] = useState(false)
  const [showCupsArrow, setShowCupsArrow] = useState(false)
  const [showAddressArrow, setShowAddressArrow] = useState(false)
  const [IconAlertToShow, setIconAlertToShow] = useState(false)
  const [alertaConfigurada, setAlertaConfigurada] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    dispatch(getUserSession())
  }, [])

  useEffect(() => {
    setAlertaConfigurada((user.profile.destinatario) ? true : false)
  }, [])

  //ordenamos a partir de la columna name
  const orderByName = () => {
    setShowNameArrow(true)
    setShowCupsArrow(false)
    setShowAddressArrow(false)
    if (orderByNameAsc) {
      setFinalList([].concat(onlydescStatus).sort().reverse())
      setOrderByNameAsc(false)
      setDirectionCode('asc')
    } else {
      setFinalList([].concat(onlydescStatus).sort((a, b) => a.name.localeCompare(b.name)))
      setOrderByNameAsc(true)
      setDirectionCode('desc')
    }
  }

  //ordenamos a partir de la columna cups
  const orderByCups = () => {
    setShowNameArrow(false)
    setShowCupsArrow(true)
    setShowAddressArrow(false)
    if (orderByCupsAsc) {
      setFinalList([].concat(onlydescStatus).sort().reverse())
      setOrderByCupsAsc(false)
      setOrderByNameAsc(false)
      setDirectionCode('asc')
    } else {
      setFinalList([].concat(onlydescStatus).sort((a, b) => a.cups.localeCompare(b.cups)))
      setOrderByCupsAsc(true)
      setDirectionCode('desc')
    }
  }

  const orderByAddress = () => {
    setShowNameArrow(false)
    setShowCupsArrow(false)
    setShowAddressArrow(true)
    if (orderByAdressAsc) {
      setFinalList([].concat(onlydescStatus).sort().reverse())
      setOrderByAdressAsc(false)
      setDirectionCode('asc')
    } else {
      setFinalList([].concat(onlydescStatus).sort((a, b) => a.address.street.localeCompare(b.address.street)))
      setOrderByAdressAsc(true)
      setDirectionCode('desc')
    }
  }

  const [totalPagesFilter, setTotalPagesFilter] = useState(0)
  useEffect(() => {
    setTotalPagesFilter(onlydescStatus.length === 0 ? 1 : Math.ceil(onlydescStatus.length / itemsPerPage))
    // eslint-disable-next-line
  }, [onlydescStatus, itemsPerPage])

  // LCS: Carga de componente - Wave GdC
  useEffect(() => {
    sendGAEvent({
      event: 'component_loaded',
      info: {
        reactComponent: 'List.tsx'
      },
      page_url: removeEmails(window.location.href),
      user_id: sessionStorage.getItem('id'),
    })
  },[])

  const handleActivar = (cups) => {
    setIsLoading(true)
    const newAlert = {
      docId: user.profile.documentNumber,
      tipoAlerta: 'supplycutoff',
      tipoEntidad: 'supply',
      idEntidad: cups,
      tipoCanal: user.profile.tipoCanal,
      activo: '1',
      destinatario: user.profile.destinatario,
      franjaInicio: user.profile.franjaInicio,
      franjaFin: user.profile.franjaFin,
      franjaInicioEspecial: user.profile.franjaInicioEspecial,
      franjaFinEspecial: user.profile.franjaFinEspecial,
    };
    dispatch(thunkCreateOrUpdateAlert(newAlert, 'supplycutoff', cups, (response) => {
      if (response) {
        dispatch(setAlerts([newAlert]))
        setIsLoading(false)
      }
    }))
  }

  const handleDesactivar = (cups) => {
    setIsLoading(true)
    const fecha = new Date();
    const fechaString = actualLocalDate()
    const newAlert = {
      docId: user.profile.documentNumber,
      tipoAlerta: 'supplycutoff',
      tipoEntidad: 'supply',
      idEntidad: cups,
      tipoCanal: user.profile.tipoCanal,
      activo: '0',
      destinatario: user.profile.destinatario,
      franjaInicio: user.profile.franjaInicio,
      franjaFin: user.profile.franjaFin,
      franjaInicioEspecial: user.profile.franjaInicioEspecial,
      franjaFinEspecial: user.profile.franjaFinEspecial,
      fechaBaja: fechaString
    };
    dispatch(thunkCreateOrUpdateAlert(newAlert, 'supplycutoff', cups, (response) => {
      if (response) {
        dispatch(deleteAlerts(cups))
        setIsLoading(false)
      }
    }))
  }

  // LCS: Enviar evento de GdC a GA - Wave 3
  const sendEventManageDelegar = (item: any):void => {
    sendGAEvent({
      event: 'manage_supply',
      section_name: 'mis suministros',
      click_text: 'delegar en un gestor',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      tab_name: 'gestionados por mi',
      cups: selectedItemsList[0],
      supply_type: item.isGenerator ? (item.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      click_url: 'no aplica',
      browsing_type: sessionStorage.getItem('browsing_type'),
    })
  }

  // LCS: Enviar evento de GdC a GA - Wave 3
  const sendEventManageAsesor = (item: any):void => {
    sendGAEvent({
      event: 'manage_supply',
      section_name: 'mis suministros',
      click_text: 'autorizar a asesores',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      tab_name: 'gestionados por mi',
      cups: selectedItemsList[0],
      supply_type: item.isGenerator ? (item.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      click_url: 'no aplica',
      browsing_type: sessionStorage.getItem('browsing_type'),
    })
  }

  // LCS: Enviar evento de GdC a GA - Wave 3
  const sendEventManageEnableAlerts = (item: any):void => {
    sendGAEvent({
      event: 'manage_supply',
      section_name: 'mis suministros',
      click_text: 'activar alerta',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      tab_name: 'gestionados por mi',
      cups: item.cups,
      supply_type: item.isGenerator ? (item.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      click_url: 'no aplica',
      browsing_type: sessionStorage.getItem('browsing_type'),
    })

    if (alertaConfigurada) { handleActivar(item.cups) }
  }

  // LCS: Enviar evento de GdC a GA - Wave 3
  const sendEventManageDisableAlerts = (item):void => {
    sendGAEvent({
      event: 'manage_supply',
      section_name: 'mis suministros',
      click_text: 'desactivar alerta',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      tab_name: 'gestionados por mi',
      cups: selectedItemsList[0],
      supply_type: item.isGenerator ? (item.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      click_url: 'no aplica',
      browsing_type: sessionStorage.getItem('browsing_type'),
    })
  }

  return (
    <>
      {
        isLoading || isLoadingManaged &&
        <Grid container className={classes.loadingBox}>
          <img className={classes.loadingAnimation} src={LoadingAnimation} alt='' />
          <span className={classes.loadingText}>{t('delegations.suppliesList.loading')}</span>
        </Grid>
      }
      {
        onlydescStatus.length > 20 && totalPages > 1 && (currentPage + 1) === totalPages ?
          <Grid container className={classes.totalItems}>
            {onlydescStatus.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('delegations.suppliesList.suppliesFrom') + onlydescStatus.length}
          </Grid>
          :
          onlydescStatus.length > 20 && totalPages > 1 ?
            <Grid container className={classes.totalItems}>
              {onlydescStatus.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('delegations.suppliesList.suppliesFrom') + onlydescStatus.length}
            </Grid>
            :
            <Grid container className={classes.totalItems}>
              {onlydescStatus.length + (onlydescStatus.length > 1 ? t('delegations.suppliesList.supplies') : t('delegations.suppliesList.supply'))}
            </Grid>
      }
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <StyledTableCell>
              <Checkbox selected={selectedItemsList.length > 0 && listItems.length === selectedItemsList.length} disabled={listItems.length === 0} handleClick={() => handleClickCheckbox(null)} />
            </StyledTableCell>
            <StyledTableCell>{t('delegations.name')}
              <TableSortLabel
                active={showNameArrow}
                direction={directionCode === 'asc' ? 'asc' : 'desc'}
                onClick={orderByName}
              />
            </StyledTableCell>
            <StyledTableCell>CUPS
              <TableSortLabel
                active={showCupsArrow}
                direction={directionCode === 'asc' ? 'asc' : 'desc'}
                onClick={orderByCups}
              />
            </StyledTableCell>
            <StyledTableCell>{t('delegations.address')}
              <TableSortLabel
                active={showAddressArrow}
                direction={directionCode === 'asc' ? 'asc' : 'desc'}
                onClick={orderByAddress}
              />
            </StyledTableCell>
            <StyledTableCell>{t('delegations.supplyType')}</StyledTableCell>
            <StyledTableCell colSpan={5} />
          </TableRow>
        </TableHead>
        <TableBody>
          <MuiThemeProvider theme={theme}>
            {
              onlydescStatus.length > 0 && onlydescStatus.slice(
                (currentPage * itemsPerPage),
                ((currentPage * itemsPerPage) + itemsPerPage)
              ).map(
                (item, index) => {
                  // if (item.descStatus!=='ACTIVO CONTRATADO') return;
                  let proceso = item.proceso
                  
                  //Ordenar los pasos
                  if (proceso && proceso.pasos && proceso.pasos.paso && proceso.pasos.paso.length > 1) {
                    proceso.pasos.paso.sort((a, b) => (a.fechaPaso > b.fechaPaso ? -1 : 1))
                  }

                  return (
                    <>
                      <TableRow key={index} className={`${classes.row} ${selectedItemsList.includes(item.cups) && 'selected'}`}>
                        <StyledTableCell style={item && item.proceso && { border: 0 }} className={classes.checkboxCell}>
                          <Checkbox selected={selectedItemsList.includes(item.cups)} handleClick={() => handleClickCheckbox(item.cups)} />
                        </StyledTableCell>
                        <StyledTableCell style={item && item.proceso && { border: 0 }} className={classes.boldCell}>{item.name ? item.name : ''}</StyledTableCell>
                        <StyledTableCell
                          style={item && item.proceso && { border: 0 }}
                          className={classes.wrappedCell}
                          onClick={() => {
                            sendGAEvent({
                              event: 'consult_supply',
                              section_name: 'mis suministros',
                              click_text: 'ver detalle',
                              element_type: 'consulta de informacion',
                              page_url: removeEmails(window.origin + '/supplies'),
                              tab_name: 'gestionados por mi',
                              cups: item.cups,
                              supply_type: item.isGenerator ? (item.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
                              click_url: window.origin + '/supplies/detail',
                              browsing_type: sessionStorage.getItem('browsing_type')
                            });
                          }}
                        >
                          <Link
                            to={{
                              pathname: '/supplies/detail',
                              state: {
                                selectedTab: 0,
                                cups: item.cups
                              }
                            }}
                          >
                            {item.cups ? item.cups : ''}
                          </Link>
                        </StyledTableCell>
                        <StyledTableCell style={item && item.proceso && { border: 0 }} >
                          {
                            item.address &&
                            (item.address.street ? item.address.street : '') + ' ' +
                            (item.address.number ? item.address.number : '') + ', ' +
                            // (item.address.stair ? t('delegations.suppliesList.stair') + item.address.stair : '') + ' ' + 
                            // (item.address.floor ? t('delegations.suppliesList.floor') + item.address.floor : '') + ' ' + 
                            // (item.address.door ? t('delegations.suppliesList.door') + item.address.door : '') +', ' +
                            (item.address.town ? item.address.town : '') + ', ' +
                            (item.address.province ? item.address.province : '') + ' ' +
                            (item.address.zipCode ? item.address.zipCode : '')
                          }
                        </StyledTableCell>
                        <StyledTableCell style={item && item.proceso && { border: 0 }} >
                          <Grid container alignItems='center'>
                            <Grid item className={classes.supplyTypeIcon}>
                              {
                                item.isGenerator === '0' ?
                                  <img src={ConsumptionIcon} alt='' />
                                  :
                                  <img src={GenerationIcon} alt='' />
                              }
                            </Grid>
                            <Grid item className={classes.supplyTypeLabel}>
                              {
                                item.isGenerator === '0' ?
                                  t('delegations.suppliesList.consumption')
                                  :
                                  t('delegations.suppliesList.generation')
                              }
                            </Grid>
                          </Grid>
                        </StyledTableCell>
                        <StyledTableCell style={item && item.proceso && { border: 0 }} className={`${classes.actionCell} ${adminToken && 'disabled'} ${(selectedItemsList.length === 1 && selectedItemsList.includes(item.cups)) ? 'Display' : 'noDisplay'}`}>
                          <span className={(selectedItemsList.length === 1 && selectedItemsList.includes(item.cups)) ? 'visible' : undefined} onClick={() => {sendEventManageDelegar(item); handleClickDelegate(selectedItemsList.includes(item.cups), 'US_MANAGER')}}>
                            {
                              <ArrowTooltip title={t('delegations.managedByMe.delegateManager')} placement='bottom'>
                                <img src={IcoGestor} alt='' />
                              </ArrowTooltip>
                            }
                          </span>
                        </StyledTableCell>
                        <StyledTableCell style={item && item.proceso && { border: 0 }} className={`${classes.actionCell} ${adminToken && 'disabled'}`}>
                          <span className={(selectedItemsList.length === 1 && selectedItemsList.includes(item.cups)) ? 'visible' : undefined} onClick={() => { sendEventManageAsesor(item); handleClickDelegate(selectedItemsList.includes(item.cups), 'US_CONSULTANT')}}>
                            {
                              <ArrowTooltip title={t('delegations.managedByMe.authorizeConsultant')} placement='bottom'>
                                <img src={IcoAsesor} alt='' />
                              </ArrowTooltip>
                            }
                          </span>
                        </StyledTableCell>
                        <StyledTableCell style={item && item.proceso && { border: 0 }} className={`${classes.actionCell} ${adminToken && 'disabled'}`} onClick={() => { setIconAlertToShow(!IconAlertToShow) }}>
                          {/* <span className={(selectedItemsList.length === 1 && selectedItemsList.includes(item.cups)) ? '' : 'visible'}> */}
                          {
                            (selectedItemsList.length === 1 && selectedItemsList.includes(item.cups)) ?
                              // <span>
                              <Grid item className={classes.pointer}>
                                {
                                  ((alerts.filter((e) => {
                                    return e.idEntidad === item.cups
                                  }).length > 0) ?
                                    <ArrowTooltip title={t('supplies.dialogAlertConfirm.active')} placement='bottom' onClick={() => { sendEventManageDisableAlerts(item); handleDesactivar(item.cups) }}>
                                      <img src={ActivarAlerta} alt='' />
                                    </ArrowTooltip>
                                    :
                                    <ArrowTooltip title={(alertaConfigurada) ? t('supplies.dialogAlertConfirm.deactive') : t('supplies.dialogAlertConfirm.mustConfAlerts')} placement='bottom' onClick={() => { sendEventManageEnableAlerts(item) }}>
                                      <img src={DesactivarAlerta} alt='' />
                                    </ArrowTooltip>
                                  )
                                }
                              </Grid>
                              //</span>                            
                              :
                              // <span>
                              <Grid item className={classes.iconCell}>
                                {
                                  (alerts.filter(e => e.idEntidad === item.cups).length > 0) &&
                                  <IconTextButton icon={<img src={AlertaActiva} />} />
                                }
                              </Grid>
                            // </span>
                          }
                        </StyledTableCell>
                        <StyledTableCell style={item && item.proceso && { border: 0 }} className={classes.buttonCell}
                           onClick={() => {
                            sendGAEvent({
                              event: 'consult_supply',
                              section_name: 'mis suministros',
                              click_text: 'ver detalle',
                              element_type: 'consulta de informacion',
                              page_url: removeEmails(window.origin + '/supplies'),
                              tab_name: 'gestionados por mi',
                              cups: item.cups,
                              supply_type: item.isGenerator ? (item.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
                              click_url: window.origin + '/supplies/detail',
                              browsing_type: sessionStorage.getItem('browsing_type')
                            });
                          }}
                        >
                          <Link
                            to={{
                              pathname: '/supplies/detail',
                              state: {
                                selectedTab: 0,
                                cups: item.cups
                              }
                            }}
                            className={classes.button}
                          >
                            {t('delegations.managedByMe.enter')}
                          </Link>
                        </StyledTableCell>
                      </TableRow>

                    {
                      (item && proceso) &&

                      <TableRow  className={`${classes.row} ${selectedItemsList.includes(item.cups) && 'selected'}`}>
                        <StyledTableCell colSpan={9}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '2px solid #eb9e51',backgroundColor: '#f7ebde',marginLeft: '11px' }}>
                              <img style={{ width: 18, paddingRight: '5px' }} src={AlertIcon} />
                              <p style={{ margin: 0, whiteSpace: 'nowrap', color: '#004571' }}>
                                {`${capitalizeFirstLetter(item.proceso.desProceso)}.`} {<strong>{capitalizeFirstLetter(item.proceso.estado)}.&nbsp;</strong>}
                              </p>
                              <Link
                                to={{
                                  pathname: '/supplies/detail',
                                  state: {
                                    cups: item.cups,
                                    dashboard: 'contracts',
                                    contract:proceso
                                  }
                                }}
                                className={classes.button}
                                onClick={() => {
                                  sendGAEvent({
                                    event: 'consult_supply',
                                    section_name: 'mis suministros',
                                    click_text: 'ver detalle',
                                    element_type: 'consulta de informacion',
                                    page_url: removeEmails(window.origin + '/supplies'),
                                    tab_name: 'gestionados por mi',
                                    cups: item.cups,
                                    supply_type: item.isGenerator ? (item.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
                                    click_url: window.origin + '/supplies/detail',
                                    browsing_type: sessionStorage.getItem('browsing_type')
                                  });
                                }}
                              >
                                  {t('Ver detalle')}
                              </Link>
                            </div>
                            
                          </div>
                        </StyledTableCell>
                      </TableRow>

                    }

                    </>
                  )
                }
              )
            }
          </MuiThemeProvider>
        </TableBody>
      </Table>
      {
        onlydescStatus.length > 20 &&
        <Grid container className={classes.itemsPerPage}>
          <span style={{ marginRight: 5 }}>{t('common.pagination.show')}</span>
          <select id='number' name='number' onChange={onChangeSelector} className={classes.select}>
            <option value='20' selected>20</option>
            <option value='50'>50</option>
            <option value='100'>100</option>
          </select>
          <span style={{ marginLeft: 5 }}>{t('common.pagination.forPage')}</span>
        </Grid>
      }
      <Pagination
        totalPages={totalPagesFilter}
        currentPage={currentPage}
        handleChangePage={setCurrentPage}
      />
    </>
  )
}

export default List
