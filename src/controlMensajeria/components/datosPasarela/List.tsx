import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import useStyles, { StyledTableCell } from './List.styles'
import Grid from '@material-ui/core/Grid'
import Pagination from '../../../common/components/pagination/Pagination2'
import DynamicSearcher from '../../../common/components/searcher/DynamicSearcher'

const List = (props: any) => {

  const { t } = useTranslation()
  const classes = useStyles({})

  const {
    searcheUsers,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPagesFilter,
    setTotalPagesFilter,
    exportLimit,
    filteredData,
    setFilteredData,
    startItems,
    endItems,
    totalItems,
  } = props

  const target = document.getElementById('number') as HTMLSelectElement
  const [searchValue, setSearchValue] = useState('');

  const validResults = ['101', '102', '103', '110', '999']  
  
  useEffect(() => {
    setFilteredData(searcheUsers)
  }, [searcheUsers])

  useEffect(() => {
    if (searchValue=='') {
        setFilteredData(searcheUsers)
    }
  }, [searchValue])  

  const formatText = (text: string): string => {
    return (text.substring(0, 1) + text.substring(1, text.length).toLowerCase())
  }
  useEffect(() => {
    setTotalPagesFilter(searcheUsers.length === 0 ? 1 : Math.ceil(searcheUsers.length / itemsPerPage))
    // eslint-disable-next-line
  }, [searcheUsers, itemsPerPage])

  const cutRegisterDate = (date: string): string => {
    let arrDate = date.split(' ')
    return arrDate[0]
  }

  const onChangeSelector = () => {
    setCurrentPage(0)
    setItemsPerPage(Number(target.options[target.selectedIndex].value))
  }

  return (
    <>
      <Grid container >
          <Grid item md={6} style={{marginTop:'auto'}}>
            <Grid container className={classes.itemText}>
                  {t('controlMensajeria.payData.result')}
                </Grid>
            {
            (searcheUsers.length < exportLimit) ?
              <>
                {filteredData.length !== 0 &&
                    <span>
                      {t('common.conjunctions.del')}
                      {startItems}
                      {t('common.conjunctions.to')}
                      {endItems}
                      {t('common.conjunctions.de')}
                      {totalItems}
                    </span>
                }
              </>
              : 
              ''
            }
            
          </Grid>
          <Grid item justifyContent='flex-end' md={6} >
            <Grid container alignItems='center' className={classes.searcher}>
              <Grid item className={classes.mobileFullWidth}>
                <DynamicSearcher label={t('provisions.provisionsList.searcher')}   finalList={filteredData}   setFinalList={setFilteredData}   listItems={searcheUsers} subtype={'monitorizacionPagos'} setCurrentPage={setCurrentPage}/>
              </Grid>
            </Grid>
          </Grid>
      </Grid>
      <Table className={classes.activeUsersTable}>
        <TableHead>
          <TableRow className={classes.tableRow}>
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('controlMensajeria.payData.Fecha')}
            </StyledTableCell>
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('controlMensajeria.payData.Expediente')}
            </StyledTableCell>
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('controlMensajeria.payData.Id de orden')}
            </StyledTableCell>
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('controlMensajeria.payData.Cantidad')}
            </StyledTableCell>
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('controlMensajeria.payData.Identificación')}
            </StyledTableCell>
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('controlMensajeria.payData.Estado')}
            </StyledTableCell>
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('controlMensajeria.payData.CodigoKO')}
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            // searcheUsers && searcheUsers.usersLogin.items.length > 0 ?
            searcheUsers.length === 0 ?
              <TableRow className={classes.tableBodyRow} >
                <StyledTableCell className={classes.noResults} colSpan={12}>
                  {t('controlMensajeria.management.list.table.body.noResults')}
                </StyledTableCell>
              </TableRow>
            : 
              (searcheUsers.length < exportLimit) ?
                filteredData.slice(
                  (currentPage * itemsPerPage),
                  ((currentPage * itemsPerPage) + itemsPerPage)
                ).map((item, index) => (
                  <TableRow className={classes.tableBodyRow} key={index}>
                    <StyledTableCell className={classes.tableRow} colSpan={1}>
                      {item.requestTimestamp}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableRow} colSpan={1}>
                      {item.dossierNumber}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableRow} colSpan={1}>
                      {item.orderId}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableRow} colSpan={1}>
                      {item.amount && item.amount + ' €'}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableRow} colSpan={1}>
                      {item.custNum}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableRow} colSpan={1}>
                      {item.status}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableRow} colSpan={1}>
                      {validResults.includes(item.result) ? 
                        item.result + ' - ' + t(`controlMensajeria.payData.${item.result}`) 
                      : 
                        (item.result === undefined || item.result === '00') ? 
                          '' 
                        : 
                          `${item.result}`
                      }
                    </StyledTableCell>
                  </TableRow>
                ))
              :
                ''
            }
        </TableBody>
      </Table>
      {
        (searcheUsers.length < exportLimit) ?
          <Grid container className={classes.itemsPerPage}>
            <span style={{ marginRight: 5 }}>{t('common.pagination.show')}</span>
            <select id='number' name='number' onChange={onChangeSelector} className={classes.select}>
              <option value='20' selected>20</option>
              <option value='50'>50</option>
              <option value='100'>100</option>
            </select>
            <span style={{ marginLeft: 5 }}>{t('common.pagination.forPage')}</span>
          </Grid> 
        :
          ''
      }    
      {
        (searcheUsers.length < exportLimit) ?
          totalPagesFilter > 1 &&
            <Grid container className={classes.paginationContainer}>
              <Pagination
                totalPages={totalPagesFilter}
                currentPage={currentPage}
                handleChangePage={setCurrentPage}
              />
            </Grid>
        : 
          ''
      }
    </>
  )
}

export default List;