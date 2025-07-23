import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'

import { formatDateBars } from '../../../../../common/lib/FormatLib'

import useStyles, { StyledTableCell } from './List.styles'
import Pagination from '../../../../../common/components/pagination/Pagination2'
import { sendGAEvent } from '../../../../../core/utils/gtm'

const List = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    listItems,
    currentPage,
    setCurrentPage,
    handleChangePage,
    itemsPerPage,
    totalPages,
    setIsLoading
  } = props

  return (
    <>
      <Table className={classes.delegationsTable}>
        <TableHead>
          <TableRow>
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
              (delegation, index) => (
                <TableRow key={index}>
                  <StyledTableCell className={classes.delegationsCups}
                    onClick={() => {
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
                    <Link
                      to={{
                        pathname: '/supplies/detail',
                        state: {
                          selectedTab: 1,
                          cups: delegation.cups
                        }
                      }}
                    >
                      {delegation.cups ? delegation.cups : ''}
                    </Link>
                  </StyledTableCell>

                  <StyledTableCell className={classes.delegationsAddress}>
                    {
                      delegation.address &&
                        (delegation.address.street ? delegation.address.street : '') + ' ' + (delegation.address.number ? delegation.address.number : '') + ', ' + (delegation.address.province ? delegation.address.province : '') + ' ' + (delegation.address.zipCode ? delegation.address.zipCode : '')
                    }
                  </StyledTableCell>

                  <StyledTableCell>{delegation.name ? delegation.name : ''}</StyledTableCell >

                  <StyledTableCell>{delegation.startDate ? formatDateBars(delegation.startDate): ''} - {delegation.endDate ? formatDateBars(delegation.endDate) : ''}</StyledTableCell>

                  <StyledTableCell>
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

                  <StyledTableCell>
                    <Link
                      to={{
                        pathname: '/supplies/detail',
                        state: {
                          selectedTab: 1,
                          cups: delegation.cups
                        }
                      }}
                      className={classes.delegationsTextLink}
                    >
                      {t('delegations.delegatesInMe.link.enter')}
                    </Link>
                  </StyledTableCell>
                </TableRow>
              )
            )
          }
        </TableBody>
      </Table>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handleChangePage={setCurrentPage}
      />
    </>
  )
}

export default List
