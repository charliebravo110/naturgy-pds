import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'

import Checkbox from '../../../../../../common/components/checkbox/Checkbox'
import DelegatesItem from '../delegates-item/DelegatesItem'
import Pagination from '../../../../../../common/components/pagination/Pagination2'

import { capitalizeFirstLetter, formatDateBars } from '../../../../../../common/lib/FormatLib'

import useStyles, { StyledTableCell } from './DelegationsList.styles'
import AlertIcon from '../../../../../../assets/icons/aviso_alerta_pop_up.svg'
import { createTheme, MuiThemeProvider } from '@material-ui/core'

// LCS: Importar funciones - Wave 3
import { sendGAEvent, removeEmails } from '../../../../../../core/utils/gtm'

const DelegationsList = (props: any) => {
  const {
    listItems,
    handleCommonCheckbox,
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
        reactComponent: 'DelegationsList.tsx'
      },
      page_url: removeEmails(window.location.href),
      user_id: sessionStorage.getItem('id'),
    })
  },[])

  return (
    <>
      <Table className={classes.suppliesTable}>
        <TableHead>
          <TableRow className={classes.tableRow} >

            <StyledTableCell className={classes.headTableCell}>CUPS</StyledTableCell>

            <StyledTableCell className={classes.headTableCell}>{t('delegations.address')}</StyledTableCell>

            <StyledTableCell className={classes.headTableCell}>{t('delegations.list.delegationPeriod')}</StyledTableCell>

            {
              listItems.find(item => item.managers.length > 0) &&
              <StyledTableCell className={classes.headTableCell}>
                <Checkbox
                  checked={listItems.find(item => item.managers.length > 0) ? !listItems.find(item => item.managers.find(item => item.checked === false)) : false}
                  onChange={(event) => handleCommonCheckbox(event, 'managers')}
                />
                {t('delegations.manager')}
              </StyledTableCell>
            }

            {
              listItems.find(item => item.consultants.length > 0) &&
              <StyledTableCell className={classes.headTableCell}>
                <Checkbox
                  checked={listItems.find(item => item.consultants.length > 0) ? !listItems.find(item => item.consultants.find(item => item.checked === false)) : false}
                  onChange={(event) => handleCommonCheckbox(event, 'consultants')}
                />
                {t('delegations.consultants')}
              </StyledTableCell>
            }

            <StyledTableCell className={classes.onlyDesktop} />
          </TableRow>
        </TableHead>

        <TableBody>
          {
            listItems.length === 0 ?
              <TableRow className={classes.tableBodyRow} >
                <StyledTableCell className={classes.noResults} colSpan={6}>
                  {t('delegates.delegatesList.noResults')}
                </StyledTableCell>
              </TableRow>
              :
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

                  return <>
                    <TableRow key={delegation.cups} className={classes.tableBodyRow}>
                      <StyledTableCell style={matchingContract && matchingContract.proceso && { border: 0 }} className={classes.suppliesBoldCell}                      
                        onClick={() => {
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
                        <Link
                          to={{
                            pathname: '/supplies/detail',
                            state: {
                              selectedTab: 0,
                              cups: delegation.cups
                            }
                          }}
                        >
                          {delegation.cups ? delegation.cups : ''}
                        </Link>
                      </StyledTableCell>

                      <StyledTableCell style={matchingContract && matchingContract.proceso && { border: 0 }} className={classes.suppliesTableWrappedCell}>
                        {delegation.address ? delegation.address : ''}
                      </StyledTableCell>

                      <StyledTableCell style={matchingContract && matchingContract.proceso && { border: 0 }} className={classes.suppliesTableWrappedCell}>
                        {
                          listItems.find(item => item.managers.length > 0) &&
                          delegation.managers.map((manager, i) => {
                            if (manager.name && manager.startDate && manager.endDate) {
                              return (<div className={classes.periodDate} key={index}>
                                {formatDateBars(manager.startDate) + ' - ' + formatDateBars(manager.endDate)}
                              </div>)
                            } else {
                              return ''
                            }
                          })
                        }
                        {
                          listItems.find(item => item.consultants.length > 0) &&
                          delegation.consultants.map((consultant, i) => {
                            if (consultant.name && consultant.startDate && consultant.endDate) {
                              return (<div className={classes.periodDate}>
                                <span className={classes.consultantName}>{consultant.name + ': '}</span>{formatDateBars(consultant.startDate) + ' - ' + formatDateBars(consultant.endDate)}
                              </div>)
                            } else {
                              return ''
                            }
                          })
                        }
                      </StyledTableCell>

                      {
                        listItems.find(item => item.managers.length > 0) &&
                        <StyledTableCell style={matchingContract && matchingContract.proceso && { border: 0 }} >
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
                        </StyledTableCell>
                      }

                      {
                        listItems.find(item => item.consultants.length > 0) &&
                        <StyledTableCell style={matchingContract && matchingContract.proceso && { border: 0 }} >
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
                        </StyledTableCell>
                      }

                      <StyledTableCell style={matchingContract && matchingContract.proceso && { border: 0 }} className={classes.suppliesTableButtonCell}
                        onClick={() => {
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
                        <Link
                          to={{
                            pathname: '/supplies/detail',
                            state: {
                              selectedTab: 0,
                              cups: delegation.cups
                            }
                          }}
                          className={classes.editButton}
                        >
                          <p>{t('delegations.enter')}</p>
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
                                    style={{color:'#1674D1'}}
                                    onClick={() => {
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
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handleChangePage={handleChangePage}
      />
    </>
  )
}

export default DelegationsList
