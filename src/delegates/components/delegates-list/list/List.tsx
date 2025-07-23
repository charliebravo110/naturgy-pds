import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'

import Pagination from '../../../../common/components/pagination/Pagination2'
import Checkbox from '../../../../common/components/checkbox/Checkbox'

import EditIcon from '../../../../assets/icons/editar.svg'

import useStyles, { StyledTableCell } from './List.styles'

// LCS: Importar las funciones - Wave 3
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm'

const List = (props: any) => {
  const { t } = useTranslation()
  const classes = useStyles({})

  const {
    delegatesText,
    listItems,
    handleCheckbox,
    currentPage,
    handleChangePage,
    adminToken
  } = props
  const rowsPerPage = 12

  const totalPages = listItems.length === 0 ? 1 : Math.ceil(listItems.length / rowsPerPage)

 // LCS: Enviar evento de GdC a GA - Wave 3
  const sendGAEventEditManager = ():void => {
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      subsection_name: (delegatesText === 'managers' ? 'mis gestores' : 'mis asesores'),
      click_text: 'editar',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      click_url: window.location.href + '/profile',
      browsing_type: sessionStorage.getItem('browsing_type'),
    })
  }

  return (
    <>
      <Table className={classes.suppliesTable}>
        <TableHead>
          <TableRow className={classes.tableRow} >
            <StyledTableCell className={classes.onlyDesktop} />

            <StyledTableCell>{t(`delegates.${delegatesText}List.name`)}</StyledTableCell>

            <StyledTableCell>{t('delegates.delegatesList.email')}</StyledTableCell>

            <StyledTableCell>{t('delegates.delegatesList.document')}</StyledTableCell>

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
                (delegate, index) => (
                  <TableRow key={delegate.delegateId} className={classes.tableBodyRow} >
                    <StyledTableCell className={classes.suppliesBoldCell}>
                      <Checkbox
                        value={delegate.delegateId}
                        onChange={handleCheckbox}
                      />
                    </StyledTableCell>
                    <StyledTableCell className={classes.suppliesBoldCell}>{delegate.name}</StyledTableCell>

                    <StyledTableCell className={classes.suppliesTableWrappedCell}>{delegate.email}</StyledTableCell>

                    <StyledTableCell>{delegate.documentNumber}</StyledTableCell>

                    <StyledTableCell className={classes.suppliesTableButtonCell}>
                      {
                        !adminToken &&
                          <Link 
                              to={{
                                  pathname: `/${delegatesText}/profile`,
                                  state: {
                                      delegateId: delegate.delegateId
                                  }
                              }} 
                              className={classes.editButton} 
                              onClick={sendGAEventEditManager}
                          >
                            <img src={EditIcon} alt='' />
                            <p>{t('delegates.delegatesList.edit')}</p>
                          </Link>
                      }
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
        handleChangePage={handleChangePage}
      />
    </>
  )
}

export default List
