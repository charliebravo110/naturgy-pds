import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import Grid from '@material-ui/core/Grid'

import { capitalizeFirstLetter, formatDateBars } from '../../../../../common/lib/FormatLib'

import useStyles, { StyledTableCell } from './List.styles'

// FSP-INI
import Checkbox from '../checkbox/Checkbox'
import Pagination from '../../../../../common/components/pagination/Pagination2'
import { createTheme, MuiThemeProvider } from '@material-ui/core'
import ArrowTooltip from '../../../../../common/components/tooltip/arrow/ArrowTooltip'
import AlertIcon from '../../../../../assets/icons/aviso_alerta_pop_up.svg'
import InfoIcon from '../../../../../assets/icons/ico_info.svg'
// FSP-FIN

// LCS: Importar funciones - Wave 3
import { sendGAEvent, removeEmails } from '../../../../../core/utils/gtm'

const List = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    listItems,
    setFinalList,
    selectedItemsList,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    setIsLoading,
    handleClickCheckbox,
    view,
    contractList
  } = props

  const target = document.getElementById('number2') as HTMLSelectElement

  const onChangeSelector = () => {
    setCurrentPage(0)
    setItemsPerPage(Number(target.options[target.selectedIndex].value))
  }

  const [totalPagesFilter, setTotalPagesFilter] = useState(0)
  useEffect(() => {
		setTotalPagesFilter(listItems.length === 0 ? 1 : Math.ceil(listItems.length / itemsPerPage))
		// eslint-disable-next-line
	}, [listItems, itemsPerPage])

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
        reactComponent: 'List.tsx'
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
      <Table className={classes.delegationsTable}>
        <TableHead>
          <TableRow>
            {/*  FSP-INI  */}
            <StyledTableCell />
            {/*  FSP-FIN  */}

            <StyledTableCell>CUPS</StyledTableCell>

            <StyledTableCell>{t('delegations.delegatesInMe.list.direction')}</StyledTableCell>

            <StyledTableCell>{t('delegations.delegatesInMe.list.name')}</StyledTableCell>

            <StyledTableCell>{t('delegations.delegatesInMe.list.delegationPeriod')}</StyledTableCell>

            <StyledTableCell colSpan={2}>{t('delegations.delegatesInMe.list.delegationType')}</StyledTableCell>

          </TableRow>
        </TableHead>

        <TableBody>
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

               return <>
                <TableRow key={index} className={`${classes.row} ${selectedItemsList.includes(delegation.cups) && 'selected'}`}>
                  {/*  FSP-INI  */}
                  <StyledTableCell style={matchingContract && matchingContract.proceso && { border: 0 }} className={classes.checkboxCell}
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
                    <Checkbox selected={selectedItemsList.includes(delegation.cups)} handleClick={() => handleClickCheckbox(delegation.cups)} />
                  </StyledTableCell>
                  {/*  FSP-FIN  */}
                  <StyledTableCell style={matchingContract && matchingContract.proceso && { border: 0 }} className={classes.delegationsCups}>
                    <Link
                      to={{
                        pathname: '/supplies/detail',
                        state: {
                          selectedTab: 1,
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
                  </StyledTableCell>

                  <StyledTableCell style={matchingContract && matchingContract.proceso && { border: 0 }} className={classes.delegationsAddress}>
                    {
                      delegation.address &&
                      (delegation.address.street ? delegation.address.street : '') + ' ' + (delegation.address.number ? delegation.address.number : '') + ', ' + (delegation.address.province ? delegation.address.province : '') + ' ' + (delegation.address.zipCode ? delegation.address.zipCode : '')
                    }
                  </StyledTableCell>

                  <StyledTableCell style={matchingContract && matchingContract.proceso && { border: 0 }}>
                    {delegation.name ? delegation.name : ''}

                  </StyledTableCell >

                  <StyledTableCell style={matchingContract && matchingContract.proceso && { border: 0 }}>
                    {delegation.startDate ? formatDateBars(delegation.startDate) : ''} - {delegation.endDate ? formatDateBars(delegation.endDate) : ''}
                  </StyledTableCell>

                  <StyledTableCell style={matchingContract && matchingContract.proceso && { border: 0 }}>
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
                  </StyledTableCell>

                  <StyledTableCell style={matchingContract && matchingContract.proceso && { border: 0 }}                  
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
                    <Link
                      to={{
                        pathname: '/supplies/detail',
                        state: {
                          selectedTab: 1,
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
                  </StyledTableCell>
                </TableRow>

                {
                      (matchingContract && matchingContract.proceso) &&

                        <TableRow  className={`${classes.tableBodyRow}`}>
                          <StyledTableCell colSpan={9}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', padding:'10px', borderBottom:'2px solid #eb9e51',backgroundColor:'#f7ebde' }}>
                                <img style={{ width: 18, paddingRight: '5px' }} src={AlertIcon} />
                                <p style={{ margin: 0, whiteSpace: 'nowrap', color: '#004571' }}>
                                   {`${capitalizeFirstLetter(matchingContract.proceso.desProceso)}.`} {<strong>{capitalizeFirstLetter(matchingContract.proceso.estado)}.&nbsp;</strong>}
                                </p>
                                <MuiThemeProvider theme={theme}>
                                 
                                  <Link
                                    to={{
                                      pathname: '/supplies/detail',
                                      state: {
                                        cups: delegation.cups,
                                        dashboard: 'contracts',
                                        contract:matchingContract.proceso
                                      }
                                    }}
                                    style={{color:'#1674D1',marginLeft:'5px'}}
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
                                </MuiThemeProvider>
                              </div>
                              
                            </div>
                          </StyledTableCell>
                        </TableRow>

                    }

      

                  </>
                

              }
            )
          }
        </TableBody>
      </Table>

      {
        listItems.length > 20 &&
        <Grid container className={classes.itemsPerPage}>
          <span style={{ marginRight: 5 }}>{t('common.pagination.show')}</span>
          <select id='number2' name='number2' onChange={onChangeSelector} className={classes.select}>
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
