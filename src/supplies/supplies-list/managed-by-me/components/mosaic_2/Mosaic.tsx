import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import ConsumptionIcon from '../../../../../assets/icons/ico_listado_consumo.svg'
import GenerationIcon from '../../../../../assets/icons/ico_listado_generacion.svg'

import Pagination from '../../../../../common/components/pagination/Pagination2'
import { useDispatch, useSelector } from 'react-redux'
import Checkbox from '../checkbox/Checkbox'

import useStyles from './Mosaic.styles'
import { thunkCreateOrUpdateAlert } from '../../../../store/actions/AlertsThunkAction'
import { deleteAlerts, setAlerts } from '../../../../store/actions/AlertsActions'
import { createTheme, MuiThemeProvider, useMediaQuery } from '@material-ui/core'
import { actualLocalDate, capitalizeFirstLetter } from '../../../../../common/lib/FormatLib'
import { useHistory } from 'react-router';
import AlertIcon from '../../../../../assets/icons/aviso_alerta_pop_up.svg'
import LoadingAnimation from '../../../../../assets/img/spinner.gif'

// LCS: Importar funciones - Wave 3
import { sendGAEvent, removeEmails } from '../../../../../core/utils/gtm'

const Mosaic_2 = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()
  const alerts = useSelector((state: any) => state.alerts.list)
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const mobileRes = useMediaQuery('(max-width:576px)')
  let history = useHistory();

  const {
    listItems,
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

  const onlydescStatus = listItems.filter(item => item.descStatus == 'ACTIVO CONTRATADO');

  const target = document.getElementById('number') as HTMLSelectElement
  const [alertaConfigurada, setAlertaConfigurada] = useState(false)

  const onChangeSelector = () => {
    setCurrentPage(0)
    setItemsPerPage(Number(target.options[target.selectedIndex].value))
  }

  const [totalPagesFilter, setTotalPagesFilter] = useState(0)
  useEffect(() => {
    setTotalPagesFilter(onlydescStatus.length === 0 ? 1 : Math.ceil(onlydescStatus.length / itemsPerPage))
    // eslint-disable-next-line
  }, [onlydescStatus, itemsPerPage])

  useEffect(() => {
    setAlertaConfigurada((user.profile.destinatario) ? true : false)
  }, [])

  const handleActivar = (cups) => {
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
        //console.log('Prueba response '+JSON.stringify(response))
        dispatch(setAlerts([newAlert]))
      }
    }))
  }

  const handleDesactivar = (cups) => {
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
        //console.log('Prueba response '+JSON.stringify(response))
        dispatch(deleteAlerts(cups))
      }
    }))
  }

  return (
    <>
      {
        isLoadingManaged &&
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
              {onlydescStatus.length + (onlydescStatus.length > 1 ? t(' suministros') : t(' suministro'))}
            </Grid>
      }
      <Grid className={classes.table}>
        {
          onlydescStatus.length > 0 &&
          <Grid container spacing={2}>
            {
              onlydescStatus.length > 0 && onlydescStatus.slice(
                (currentPage * itemsPerPage),
                ((currentPage * itemsPerPage) + itemsPerPage)
              ).map(
                (item, index) => {
                  let proceso = item.proceso
                  
                  //Ordenar los pasos
                  if (proceso && proceso.pasos && proceso.pasos.paso && proceso.pasos.paso.length > 1) {
                    proceso.pasos.paso.sort((a, b) => (a.fechaPaso > b.fechaPaso ? -1 : 1))
                  }

                  return (
                    <Grid
                      item
                      key={index}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                    >
                      <Grid className={`${classes.item} ${selectedItemsList.includes(item.cups) && 'selected'}`}>
                        <Grid className={classes.row}>
                          <div className={classes.title}>{t('delegations.name')}</div>

                          <div className={`${classes.value} bold`}>{item.name ? item.name : ''}</div>
                        </Grid>
                        <Grid className={classes.row}>
                          <div className={classes.title}>CUPS</div>

                          <div className={`${classes.value}`}>{item.cups ? item.cups : ''}</div>
                        </Grid>
                        <Grid className={classes.row}>
                          <div className={classes.title}>{t('delegations.address')}</div>

                          <div className={classes.value}>
                            {
                              item.address &&
                              (item.address.street ? item.address.street : '') + ' ' +
                              (item.address.number ? item.address.number : '') + ', ' +
                              (item.address.town ? item.address.town : '') + ', ' +
                              (item.address.province ? item.address.province : '') + ' ' +
                              (item.address.zipCode ? item.address.zipCode : '')
                            }
                          </div>
                        </Grid>
                        <Grid className={classes.row}>
                          <Checkbox selected={selectedItemsList.includes(item.cups)} handleClick={() => handleClickCheckbox(item.cups)} />
                        </Grid>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Grid container style={{ marginTop: 20 }}>

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
                          <Grid container className={classes.buttonContainer} justify='flex-end'>
                            <Grid item />

                            <Grid item>
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
                            </Grid>
                          </Grid>
                        </div>
                        {
                          (item && proceso) &&
                          <Grid container style={{borderBottom:'2px solid #eb9e51',backgroundColor:'#f7ebde', padding:'4px', marginTop:'10px'}}>
                            <Grid item xs={1} alignContent='center'>
                              <img style={{ width: 18, paddingRight: '5px' }} src={AlertIcon} />
                            </Grid>
                            <Grid xs={11} item alignItems='center' >
                              <MuiThemeProvider theme={theme}>

                              <div style={{ margin: 0, color: '#004571',textAlign:'left' }}>
                              {`${capitalizeFirstLetter(item.proceso.desProceso)}.`} {
                                mobileRes ?
                                <strong><br/>{capitalizeFirstLetter(item.proceso.estado)}.&nbsp;</strong>
                                :
                                <strong>{capitalizeFirstLetter(item.proceso.estado)}.&nbsp;</strong>
                              }
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
                                    // LCS: Enviar evento de GdC a GA - Wave 3
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
                              </MuiThemeProvider>
                            </Grid>
                          </Grid>
                          
                        }

                      </Grid>
                    </Grid>
                  )
                }
              )
            }
          </Grid>
        }
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
      </Grid>
    </>
  )
}

export default Mosaic_2
