import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { withRouter } from 'react-router'

import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'

import Pagination from '../../../../common/components/pagination/Pagination2'
import DownloadPdf from '../../../../assets/icons/descargar_pdf.svg'

import useStyles, { StyledTableCell } from './List.styles'

// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm';

const List = (props: any) => {
  const {
    listItems,
    setFinalList,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    searchValue,
    handleDownloadModal,
    // handleDownloadDocument,
    type
  } = props

  const { t } = useTranslation()

  const classes = useStyles({})

  const target = document.getElementById('number') as HTMLSelectElement

  const formatDateAndTime = (date) => {
    if (date) {
      const year = date.substring(0, 4)
      const month = date.substring(5, 7)
      const day = date.substring(8, 10)
      return (day + '/' + month + '/' + year)
    }
  }

  const onChangeSelector = () => {
    setCurrentPage(0)
    setItemsPerPage(Number(target.options[target.selectedIndex].value))
  }

  //ordenar en orden ascendente/descendente
  const [orderByCodDescAsc, setOrderByCodDescAsc] = useState(false)
  const [showCodDescArrow, setShowCodDescArrow] = useState(false)
  const [orderByCodBillAsc, setOrderByCodBillAsc] = useState(false)
  const [showCodBillArrow, setShowCodBillArrow] = useState(false)
  const [orderBySendDateAsc, setOrderBySendDateAsc] = useState(false)
  const [showSendDateArrow, setShowSendDateArrow] = useState(false)
  const [showAmountArrow, setShowAmountArrow] = useState(false)
  const [orderByAmountAsc, setOrderByAmountAsc] = useState(false)
  const [directionName, setDirectionName] = useState('desc')
  const [orderByBillTypeAsc, setOrderByBillTypeAsc] = useState(false)
  const [showBillTypeArrow, setShowBillTypeArrow] = useState(false)
  const [orderByBillStatusAsc, setOrderByBillStatusAsc] = useState(false)
  const [showBillStatusArrow, setShowBillStatusArrow] = useState(false)



 const resetFilters = () => {

  setShowBillStatusArrow(false)
  setShowBillTypeArrow(false)
  setShowCodDescArrow(false)
  setShowCodBillArrow(false)
  setShowSendDateArrow(false)
  setShowAmountArrow(false)

  setOrderByBillStatusAsc(false)
  setOrderByBillTypeAsc(false)
  setOrderByCodDescAsc(false)
  setOrderByCodBillAsc(false)
  setOrderBySendDateAsc(false)
  setOrderByAmountAsc(false)

 }

 //ordenamos a partir de la columna billType
 const orderByBillStatus = () => {
  resetFilters()
  setShowBillStatusArrow(true)
  setShowBillTypeArrow(false)
  setShowCodDescArrow(false)
  setShowCodBillArrow(false)
  setShowSendDateArrow(false)
  setShowAmountArrow(false)
  setOrderByAmountAsc(false)
  setDirectionName('desc')
  if (orderByBillStatusAsc) {
    setFinalList([].concat(listItems).sort().reverse())
    setOrderByBillStatusAsc(false)
    setDirectionName('asc')
  } else {
    setFinalList([].concat(listItems).sort((a, b) => a.billStatus.localeCompare(b.billStatus)))
    setOrderByBillStatusAsc(true)
    setDirectionName('desc')
  }
}

  //ordenamos a partir de la columna billType
  const orderByBillType = () => {
    resetFilters()
    setShowBillTypeArrow(true)
    setShowBillStatusArrow(false)
    setShowCodDescArrow(false)
    setShowCodBillArrow(false)
    setShowSendDateArrow(false)
    setShowAmountArrow(false)
    setOrderByAmountAsc(false)
    setDirectionName('desc')
    if (orderByBillTypeAsc) {
      setFinalList([].concat(listItems).sort().reverse())
      setOrderByBillTypeAsc(false)
      setDirectionName('asc')
    } else {
      setFinalList([].concat(listItems).sort((a, b) => a.billType.localeCompare(b.billType)))
      setOrderByBillTypeAsc(true)
      setDirectionName('desc')
    }
  }

  //ordenamos a partir de la columna dossierCod
  const orderByCodDesc = () => {
    resetFilters()
    setShowCodDescArrow(true)
    setShowCodBillArrow(false)
    setShowSendDateArrow(false)
    setShowAmountArrow(false)
    setShowBillTypeArrow(false)
    setOrderByAmountAsc(false)
    setShowBillStatusArrow(false)
    setDirectionName('desc')
    if (orderByCodDescAsc) {
      setFinalList([].concat(listItems).sort().reverse())
      setOrderByCodDescAsc(false)
      setDirectionName('asc')
    } else {
      setFinalList([].concat(listItems).sort((a, b) => a.numberexpedient.localeCompare(b.numberexpedient)))
      setOrderByCodDescAsc(true)
      setDirectionName('desc')
    }
  }

  //ordenamos a partir de la columna codBill
  const orderByCodBill = () => {
    resetFilters()
    setShowCodDescArrow(false)
    setShowCodBillArrow(true)
    setShowSendDateArrow(false)
    setShowAmountArrow(false)
    setShowBillTypeArrow(false)
    setOrderByAmountAsc(false)
    setShowBillStatusArrow(false)
    setDirectionName('desc')
    if (orderByCodBillAsc) {
      setFinalList([].concat(listItems).sort().reverse())
      setOrderByCodBillAsc(false)
      setDirectionName('asc')
    } else {
      setFinalList([].concat(listItems).sort((a, b) => a.billNumber.localeCompare(b.billNumber)))
      setOrderByCodBillAsc(true)
      setDirectionName('desc')
    }
  }

  //ordenamos a partir de la columna sendDate
  const orderSendDateBill = () => {
    resetFilters()
    setShowCodDescArrow(false)
    setShowCodBillArrow(false)
    setShowSendDateArrow(true)
    setShowAmountArrow(false)
    setShowBillTypeArrow(false)
    setOrderByAmountAsc(false)
    setShowBillStatusArrow(false)
    setDirectionName('desc')
    if (orderBySendDateAsc) {
      setFinalList([].concat(listItems).sort().reverse())
      setOrderBySendDateAsc(false)
      setDirectionName('asc')
    } else {
      setFinalList([].concat(listItems).sort((a, b) => a.billIssueDate.localeCompare(b.billIssueDate)))
      setOrderBySendDateAsc(true)
      setDirectionName('desc')
    }
  }

  const formatText = (text: string): string => {
		return (text.substring(0, 1) + text.substring(1, text.length).toLowerCase())
	}

  //ordenamos a partir de la columna amount
  const orderAmountBill = () => {
    resetFilters()
    setShowAmountArrow(true)
    setShowBillTypeArrow(false)
    setShowCodBillArrow(false)
    setShowSendDateArrow(false)
    setShowCodDescArrow(false)
    setShowCodBillArrow(false)
    setShowBillStatusArrow(false)
    setDirectionName('desc')
    if (orderByAmountAsc) {
      setFinalList([].concat(listItems).sort((a, b) => b.import-a.import))
      setOrderByAmountAsc(false)
      setDirectionName('asc')
    } else {
      setFinalList([].concat(listItems).sort((a, b) => a.import-b.import));
      //setFinalList([].concat(listItems).sort((a, b) => a.import.localeCompare(b.import)))
      setOrderByAmountAsc(true)
      setDirectionName('desc')
    }
  }

  const handleDownload = (billNumber: String, codExp: String, status: String) => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
    const year = date.getFullYear();
    if(type == 'b'){
      sendGAEvent({
        event: 'browsing',
        section_name: 'mi conexion a la red',
        subsection_name: 'detalle de solicitud',
        click_text: 'descargar',
        element_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        request_number: codExp,
        request_status: sessionStorage.getItem('provisionDossierStatus'),
        module_name: 'facturas',
        billing_number: billNumber,
        billing_status: status.toLowerCase(),
        browsing_type: sessionStorage.getItem('browsing_type'),
        issue_date: `${day}/${month}/${year}`,
      });
    } else{
      sendGAEvent({
        event: 'browsing',
        section_name: 'mi conexion a la red',
        subsection_name: 'mis facturas de conexion a la red',
        click_text: 'descargar',
        element_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        billing_number: billNumber,
        request_number: codExp,
        billing_status: status.toLowerCase(),
        issue_date: `${day}/${month}/${year}`,
        browsing_type: sessionStorage.getItem('browsing_type')
      });
    }
    handleDownloadModal(billNumber, codExp, status)
  }

  return (
    <>
      <Table className={classes.suppliesTable}>
        <TableHead>
          <TableRow className={classes.tableRow}>
            {type === 'a' &&
              <StyledTableCell className={`${classes.headTableCell} ${classes.cell20}`}>{t('provisions.billsList.codExp')}
                <TableSortLabel
                  active={showCodDescArrow}
                  direction={directionName === 'asc' ? 'asc' : 'desc'}
                  onClick={orderByCodDesc}
                />
              </StyledTableCell>
            }
            <StyledTableCell className={`${classes.headTableCell} ${type === 'a' && classes.cell24} ${type === 'b' && classes.cell30}`}>{t('provisions.billsList.codBill')}
              <TableSortLabel
                active={showCodBillArrow}
                direction={directionName === 'asc' ? 'asc' : 'desc'}
                onClick={orderByCodBill}
              />
            </StyledTableCell>

            <StyledTableCell className={`${classes.headTableCell} ${type === 'a' && classes.cell20} ${type === 'b' && classes.cell20}`}>{t('provisions.billsList.sendDate')}
              <TableSortLabel
                active={showSendDateArrow}
                direction={directionName === 'asc' ? 'asc' : 'desc'}
                onClick={orderSendDateBill}
              />
            </StyledTableCell>
            
            <StyledTableCell className={`${classes.headTableCell} ${type === 'a' && classes.cell20} ${type === 'b' && classes.cell20}`}>{t('provisions.billsList.billType')}
              <TableSortLabel
                  active={showBillTypeArrow}
                  direction={directionName === 'asc' ? 'asc' : 'desc'}
                  onClick={orderByBillType}
              />
            </StyledTableCell>

            <StyledTableCell className={`${classes.headTableCell} ${type === 'a' && classes.cell20} ${type === 'b' && classes.cell20}`}>{t('provisions.billsList.status')}
              <TableSortLabel
                    active={showBillStatusArrow}
                    direction={directionName === 'asc' ? 'asc' : 'desc'}
                    onClick={orderByBillStatus}
              />
            </StyledTableCell>

            <StyledTableCell className={`${classes.headTableCell} ${type === 'a' && classes.cell20} ${type === 'b' && classes.cell20}`}>{t('provisions.billsList.amount')}
              <TableSortLabel
                    active={showAmountArrow}
                    direction={directionName === 'asc' ? 'asc' : 'desc'}
                    onClick={orderAmountBill}
              />
            </StyledTableCell>

            <StyledTableCell className={classes.headTableCell} />

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
                (currentPage * itemsPerPage),
                ((currentPage * itemsPerPage) + itemsPerPage)
              ).map(
                (bill, index) => (
                  <>
                    <TableRow key={index + '' + bill.numberexpedient} className={classes.tableBodyRow}>
                      {type === 'a' &&
                        <StyledTableCell className={classes.headTableCell3}>{bill.numberexpedient}</StyledTableCell>
                      }

                      <StyledTableCell className={classes.headTableCell3}>{bill.billNumber}</StyledTableCell>

                      <StyledTableCell className={classes.headTableCell3}>{formatDateAndTime(bill.billIssueDate)}</StyledTableCell>

                      <StyledTableCell className={classes.headTableCell}>{formatText(bill.billType)}</StyledTableCell>

                      <StyledTableCell className={classes.headTableCell}>{formatText(bill.billStatus)}</StyledTableCell>

                      <StyledTableCell className={classes.headTableCell}>{bill.import + '€'}</StyledTableCell>

                      <StyledTableCell className={classes.headTableCell}>
                        <div
                          onClick={() => handleDownload(bill.billNumber, bill.numberexpedient, bill.billStatus)}
                        >
                          <img className={classes.pointer} src={DownloadPdf} alt='' />

                        </div>
                      </StyledTableCell>

                    </TableRow>
                  </>
                )
              )
          }
        </TableBody>
      </Table>

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

      {
        totalPages > 1 &&
        <Grid container className={classes.paginationContainer}>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handleChangePage={setCurrentPage}
          />
        </Grid>
      }
    </>
  )
}

export default withRouter(List)
