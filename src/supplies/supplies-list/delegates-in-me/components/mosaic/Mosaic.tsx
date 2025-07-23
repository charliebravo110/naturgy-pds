import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import Typography from '@material-ui/core/Typography'

import { capitalizeFirstLetter, formatDateBars } from '../../../../../common/lib/FormatLib'

import useStyles from './Mosaic.styles'

//FSP-INI
import Checkbox from '../checkbox/Checkbox'
import Pagination from '../../../../../common/components/pagination/Pagination2'
import { createTheme, MuiThemeProvider, useMediaQuery } from '@material-ui/core'
import AlertIcon from '../../../../../assets/icons/aviso_alerta_pop_up.svg'

// LCS: Importar funciones - Wave 3
import { sendGAEvent, removeEmails } from '../../../../../core/utils/gtm'

//FSP-FIN

const Mosaic = (props: any) => {
  const classes = useStyles({})

  const { t } = useTranslation()

  const {
    listItems,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    setIsLoading,
    handleClickCheckbox,
    selectedItemsList,
    view,
    contractList
  } = props

  const target = document.getElementById('number') as HTMLSelectElement
  const mobileRes = useMediaQuery('(max-width:576px)')

  const onChangeSelector = () => {
    setItemsPerPage(target.options[target.selectedIndex].value)
  }

    useEffect(() => {
      setCurrentPage(0)
    }, [view])

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
        reactComponent: 'Mosaic.tsx'
      },
      page_url: removeEmails(window.location.href),
      user_id: sessionStorage.getItem('id'),
    })
  },[])

  return (
    <>
      {
        listItems.length > 20 && totalPages > 1 ?
          <Grid container className={classes.totalItems}>
            {itemsPerPage + t(' suministros de ') + listItems.length}
          </Grid>
          :
          <Grid container className={classes.totalItems}>
            {listItems.length + (listItems.length > 1 ? t(' suministros') : t(' suministro'))}
          </Grid>
      }
      <Grid className={classes.table}>
        <Table>
          {
            <Grid container spacing={2}>
              {
                listItems.slice(
                  (currentPage * itemsPerPage),
                  ((currentPage * itemsPerPage) + itemsPerPage)
                ).map(
                  (delegation, index) => {
                    let matchingContract = contractList.find(contract => contract.cups === delegation.cups);

                    //Ordenar los pasos
                    if (matchingContract && matchingContract.proceso && matchingContract.proceso.pasos && matchingContract.proceso.pasos.paso && matchingContract.proceso.pasos.paso.length > 1) {
                      matchingContract.proceso.pasos.paso.sort((a, b) => (a.fechaPaso > b.fechaPaso ? -1 : 1))
                    }

                    return <Grid item key={index} lg={4} md={6} sm={6} xs={12}>
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
                                      sendGAEvent({
                                        event: 'consult_supply',
                                        section_name: 'mis suministros',
                                        click_text: 'ver detalle',
                                        element_type: 'consulta de informacion',
                                        page_url: window.origin + '/supplies',
                                        tab_name: 'delegados en mi',
                                        cups: delegation.cups,
                                        supply_type: delegation.isGenerator ? (delegation.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
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
                                <Typography className={classes.title}>{t('delegations.delegatesInMe.list.direction')}</Typography>

                                <Typography className={classes.value}>
                                  {
                                    delegation.address &&
                                    (delegation.address.street ? delegation.address.street : '') + ' ' + (delegation.address.number ? delegation.address.number : '') + ', ' + (delegation.address.province ? delegation.address.province : '') + ' ' + (delegation.address.zipCode ? delegation.address.zipCode : '')
                                  }
                                </Typography>
                              </Grid>

                              <Grid className={classes.checkboxContainer}>
                                <Checkbox selected={selectedItemsList.includes(delegation.cups)} handleClick={() => handleClickCheckbox(delegation.cups)} />
                              </Grid>

                              <Grid className={classes.row}>
                                <Typography className={classes.title}>{t('delegations.delegatesInMe.list.name')}</Typography>

                                <Typography className={`${classes.value} bold`}>{delegation.name ? delegation.name : ''}</Typography>
                              </Grid>

                              <Grid className={classes.row}>
                                <Typography className={classes.title}>{t('delegations.delegatesInMe.list.delegationPeriod')}</Typography>

                                <Typography className={`${classes.value} bold`}>{delegation.startDate ? formatDateBars(delegation.startDate) : ''} {delegation.endDate ? formatDateBars(delegation.endDate) : ''}</Typography>
                              </Grid>

                              <Grid className={classes.row}>
                                <Typography className={classes.title}>{t('delegations.delegatesInMe.list.delegationType')}</Typography>
                                {
                                  delegation.role === 'US_CONSULTANT' ?
                                    <div className={classes.pointContainer}>
                                      <div className={classes.blue} />
                                      <span>{t('delegations.delegatesInMe.delegateRol.consultant')}</span>
                                    </div>
                                    :
                                    delegation.role === 'US_MANAGER' &&

                                    <div className={classes.pointContainer}>
                                      <div className={classes.orange} />
                                      <span>{t('delegations.delegatesInMe.delegateRol.manager')}</span>
                                    </div>
                                }
                              </Grid>

                              <Grid>
                                <Link
                                  to={{
                                    pathname: '/supplies/detail',
                                    state: {
                                      selectedTab: 0,
                                      cups: delegation.cups
                                    }
                                  }}
                                  className={classes.delegationsTextLink}
                                  onClick={() => {
                                    // LCS: Enviar evento de GdC a GA - Wave 3
                                    sendGAEvent({
                                      event: 'consult_supply',
                                      section_name: 'mis suministros',
                                      click_text: 'ver detalle',
                                      element_type: 'consulta de informacion',
                                      page_url: window.origin + '/supplies',
                                      tab_name: 'delegados en mi',
                                      cups: delegation.cups,
                                      supply_type: delegation.isGenerator ? (delegation.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
                                      click_url: window.origin + '/supplies/detail',
                                      browsing_type: sessionStorage.getItem('browsing_type')
                                    });
                                  }}
                                >
                                  {t('delegations.delegatesInMe.link.enter')}
                                </Link>
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
                                        style={{color:'#1674D1',marginLeft:'4px'}}
                                        onClick={() => {
                                          // LCS: Enviar evento de GdC a GA - Wave 3
                                          sendGAEvent({
                                            event: 'consult_supply',
                                            section_name: 'mis suministros',
                                            click_text: 'ver detalle',
                                            element_type: 'consulta de informacion',
                                            page_url: removeEmails(window.origin + '/supplies'),
                                            tab_name: 'delegados en mi',
                                            cups: delegation.cups,
                                            supply_type: delegation.isGenerator ? (delegation.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
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
                  }
                )
              }
            </Grid>
          }

          {
            listItems.length > 20 &&
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
            totalPages={totalPages}
            currentPage={currentPage}
            handleChangePage={setCurrentPage}
          />
        </Table>
      </Grid>
    </>
  )
}

export default Mosaic
