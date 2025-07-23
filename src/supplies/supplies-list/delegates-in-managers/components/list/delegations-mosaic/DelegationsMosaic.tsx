import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import DelegatesItem from '../delegates-item/DelegatesItem'
import Pagination from '../../../../../../common/components/pagination/Pagination2'

import { capitalizeFirstLetter, formatDateBars } from '../../../../../../common/lib/FormatLib'

import useStyles from './DelegationsMosaic.styles'
import AlertIcon from '../../../../../../assets/icons/aviso_alerta_pop_up.svg'
import { createTheme, MuiThemeProvider, useMediaQuery } from '@material-ui/core'


// LCS: Importar funciones - Wave 3
import { sendGAEvent, removeEmails } from '../../../../../../core/utils/gtm'

const DelegationsMosaic = (props: any) => {
  const {
    listItems,
    handleSupplyCheckbox,
    handleCheckbox,
    currentPage,
    handleChangePage,
    openDetailPopup,
    openListPopup,
    rowsPerPage,
    totalPages,
    contractList,
    suppliesList
  } = props

  const { t } = useTranslation()

  const classes = useStyles({})
  const mobileRes = useMediaQuery('(max-width:576px)')

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

  // LCS: Carga de componente - Wave GdC
  useEffect(() => {
    sendGAEvent({
      event: 'component_loaded',
      info: {
        reactComponent: 'DelegationsMosaic.tsx'
      },
      page_url: removeEmails(window.location.href),
      user_id: sessionStorage.getItem('id'),
    })
  },[])

  return (
    <Grid className={classes.table}>
      {
        listItems.length === 0 ?
        <Grid>
            {t('delegates.delegatesList.noResults')}
        </Grid>
        :
          <Grid container spacing={2}>
            {
              listItems.slice(
                (currentPage - 1) * rowsPerPage,
                (currentPage - 1) * rowsPerPage + rowsPerPage
              ).map(
                (delegation, index) => {
                  let matchingContract = contractList.find(contract => contract.cups === delegation.cups);

                  //Ordenar los pasos
                  if (matchingContract && matchingContract.proceso && matchingContract.proceso.pasos && matchingContract.proceso.pasos.paso && matchingContract.proceso.pasos.paso.length > 1) {
                    matchingContract.proceso.pasos.paso.sort((a, b) => (a.fechaPaso > b.fechaPaso ? -1 : 1))
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
                    <Grid className={classes.item}>
                      <Grid className={classes.row}>
                        <Typography className={classes.title}>CUPS</Typography>

                        <Typography className={`${classes.value} bold`}>
                          <Link
                            to={{
                              pathname: '/supplies/detail',
                              state: {
                                selectedTab: 0,
                                cups: delegation.cups
                              }
                            }}                  
                            onClick={() => {
                              // LCS: Enviar evento de GdC a GA - Wave 3
                              let element = suppliesList.find(item=> item.cups === delegation.cups)
                              sendGAEvent({
                                event: 'consult_supply',
                                section_name: 'mis suministros',
                                click_text: 'ver detalle',
                                element_type: 'consulta de informacion',
                                page_url: window.origin + '/supplies',
                                tab_name: 'delegados en gestor o asesor',
                                cups: delegation.cups,
                                supply_type: element.isGenerator ? (element.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
                                click_url: window.origin + '/supplies/detail',
                                browsing_type: sessionStorage.getItem('browsing_type')
                              });
                            }}
                          >
                            {delegation.cups ? delegation.cups : ''}
                          </Link>
                        </Typography>
                      </Grid>

                      <Grid className={classes.row}>
                        <Typography className={classes.title}>{t('delegations.address')}</Typography>

                        <Typography className={classes.value}>{delegation.address ? delegation.address : ''}</Typography>
                      </Grid>

                      <Grid className={classes.row}>
                        <Typography className={classes.title}>{t('delegations.list.delegationPeriod')}</Typography>

                        {
                          listItems.find(item => item.managers.length > 0) &&
                            delegation.managers.map((manager, i) => {
                              if (manager.name && manager.startDate && manager.endDate) {
                                return  <div className={classes.periodDate}>
                                          {formatDateBars(manager.startDate) + ' - ' + formatDateBars(manager.endDate)}
                                        </div>
                              }
                            })
                        }
                        {
                          listItems.find(item => item.consultants.length > 0) &&
                            delegation.consultants.map((consultant, i) => {
                              if (consultant.name && consultant.startDate && consultant.endDate) {
                                return  <div className={classes.periodDate}>
                                          <span className={classes.consultantName}>{consultant.name + ': '}</span>{formatDateBars(consultant.startDate) + ' - ' + formatDateBars(consultant.endDate)}
                                        </div>
                              }
                            })
                        }
                      </Grid>

                      <Grid className={classes.delegates}>
                          <DelegatesItem
                            color='orange'
                            delegateType='managers'
                            cups={delegation.cups}
                            handleSupplyCheckbox={handleSupplyCheckbox}
                            handleCheckbox={handleCheckbox}
                            itemsList={delegation.managers}
                            openDetailPopup={openDetailPopup}
                            openListPopup={openListPopup}
                          />

                          <DelegatesItem
                            color='blue'
                            delegateType='consultants'
                            cups={delegation.cups}
                            handleSupplyCheckbox={handleSupplyCheckbox}
                            handleCheckbox={handleCheckbox}
                            itemsList={delegation.consultants}
                            openDetailPopup={openDetailPopup}
                            openListPopup={openListPopup}
                          />
                      </Grid>

                      <Grid container className={classes.button} justifyContent='center'>
                        <Grid item>
                          <Link
                            to={{
                              pathname: '/supplies/detail',
                              state: {
                                selectedTab: 0,
                                cups: delegation.cups
                              }
                            }}
                            className={classes.editButton}
                            onClick={() => {
                              // LCS: Enviar evento de GdC a GA - Wave 3
                              let element = suppliesList.find(item=> item.cups === delegation.cups)
                              sendGAEvent({
                                event: 'consult_supply',
                                section_name: 'mis suministros',
                                click_text: 'ver detalle',
                                element_type: 'consulta de informacion',
                                page_url: window.origin + '/supplies',
                                tab_name: 'delegados en gestor o asesor',
                                cups: delegation.cups,
                                supply_type: element.isGenerator ? (element.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
                                click_url: window.origin + '/supplies/detail',
                                browsing_type: sessionStorage.getItem('browsing_type')
                              });
                            }}
                          >
                            <p>{t('delegations.enter')}</p>
                          </Link>
                        </Grid>
                      </Grid>
                      
                      {
                           (matchingContract && matchingContract.proceso) &&

                              <Grid container style={{borderBottom:'2px solid #eb9e51',backgroundColor:'#f7ebde', padding:'4px', marginTop:'10px'}}>
                            <Grid item xs={1} alignContent='center'>
                              <img style={{ width: 18, paddingRight: '5px' }} src={AlertIcon} />
                            </Grid>
                            <Grid xs={11} item alignItems='center'>
                            <MuiThemeProvider theme={theme}>
                              <div style={{ margin: 0, color: '#004571',textAlign:'left' }}>
                              {`${capitalizeFirstLetter(matchingContract.proceso.desProceso)}.`} {
                                mobileRes ?
                                  <strong><br/>{capitalizeFirstLetter(matchingContract.proceso.estado)}.&nbsp;</strong>
                                :
                                  <strong>{capitalizeFirstLetter(matchingContract.proceso.estado)}.&nbsp;</strong>
                              }
                                <Link
                                  to={{
                                    pathname: '/supplies/detail',
                                    state: {
                                      cups: delegation.cups,
                                      dashboard: 'contracts',
                                      contract:matchingContract.proceso
                                    }
                                  }}
                                  className={classes.button}
                                  style={{color:'#1674D1'}}
                                  onClick={() => {
                                    // LCS: Enviar evento de GdC a GA - Wave 3
                                    let element = suppliesList.find(item=> item.cups === delegation.cups)
                                    sendGAEvent({
                                      event: 'consult_supply',
                                      section_name: 'mis suministros',
                                      click_text: 'ver detalle',
                                      element_type: 'consulta de informacion',
                                      page_url: removeEmails(window.origin + '/supplies'),
                                      tab_name: 'delegados en gestor o asesor',
                                      cups: delegation.cups,
                                      supply_type: element.isGenerator ? (element.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
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
              )}
              )
            }
          </Grid>
      }
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handleChangePage={handleChangePage}
        />
    </Grid>
  )
}

export default DelegationsMosaic
