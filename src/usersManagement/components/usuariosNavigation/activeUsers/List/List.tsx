import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import useStyles, { StyledTableCell } from './List.styles'

import Pagination from '../../../../../common/components/pagination/Pagination2'
import { SearchRounded } from '@material-ui/icons'


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
  } = props

  const target = document.getElementById('number') as HTMLSelectElement


  let auxSurnames

  const formatText = (text: string): string => {
    return (text.substring(0, 1) + text.substring(1, text.length).toLowerCase())
  }

  const convertirFecha = (fechaStr) => {
    const [fecha, hora] = fechaStr.split(' ');
    const [dia, mes, anio] = fecha.split('/');
    const [horas, minutos, segundos] = hora.split(':');

    return new Date(anio, mes - 1, dia, horas, minutos, segundos);
};
    //revision
    const userBaja = (dateCancel:string,datelastLoginDate:string):boolean =>{
  
      if(!dateCancel){
        return false
      }else{
        if(convertirFecha(dateCancel) > convertirFecha(datelastLoginDate))
        {

          return true
        }else {  
          return false
        }
       
      }
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
      {
          searcheUsers.length > 20 && totalPagesFilter > 1 && (currentPage + 1) === totalPagesFilter ?
          <Grid container className={classes.itemText}>
            {t('gestionUsuarios.management.activeUsers.list.result') + searcheUsers.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('gestionUsuarios.management.activeUsers.list.usersFor') + searcheUsers.length}
          </Grid>
          :
          searcheUsers.length > 20 && totalPagesFilter > 1 ?
            <Grid container className={classes.itemText}>
              {t('gestionUsuarios.management.activeUsers.list.result') + t('gestionUsuarios.management.activeUsers.list.from') + currentPage * itemsPerPage+ t('gestionUsuarios.management.activeUsers.list.to')+ ((currentPage * itemsPerPage)+itemsPerPage-1) + t('gestionUsuarios.management.activeUsers.list.for') + searcheUsers.length + t('gestionUsuarios.management.activeUsers.list.users')}
            </Grid>
            :
            <Grid container className={classes.itemText}>
              {t('gestionUsuarios.management.activeUsers.list.result') + searcheUsers.length + (searcheUsers.length > 1 || searcheUsers.length === 0 ? t('gestionUsuarios.management.activeUsers.list.users') : t('gestionUsuarios.management.activeUsers.list.user'))}
            </Grid>
      }
      <Table className={classes.activeUsersTable}>
        <TableHead>
          <TableRow className={classes.tableRow}>
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('gestionUsuarios.management.activeUsers.list.document')}
            </StyledTableCell>
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('gestionUsuarios.management.activeUsers.list.name')}
            </StyledTableCell>
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('gestionUsuarios.management.activeUsers.list.email')}
            </StyledTableCell>
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('gestionUsuarios.management.deleteUser.state')}
            </StyledTableCell>
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('gestionUsuarios.management.activeUsers.list.fechaAlta')}
            </StyledTableCell>
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('gestionUsuarios.management.activeUsers.list.fechaLogin')}
            </StyledTableCell>
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('gestionUsuarios.management.deleteUser.cancelDate')}
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
              : (
                searcheUsers.slice(
                  (currentPage * itemsPerPage),
                  ((currentPage * itemsPerPage) + itemsPerPage)
                ).map((item, index) => (
                  <TableRow className={classes.tableBodyRow} key={index}>
                    <StyledTableCell className={classes.tableRow} colSpan={1}>
                      {item.document}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableRow} colSpan={1}>
                      {item.name + ' ' + item.surname}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableRow} colSpan={1}>
                      {item.email}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableRow} colSpan={1}>
                    {userBaja(item.cancelDate, item.registrationDate)?t('gestionUsuarios.management.deleteUser.baja'):t('gestionUsuarios.management.deleteUser.alta')}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableRow} colSpan={1}>
                    {!userBaja(item.cancelDate,item.registrationDate) ? (<strong>{item.registrationDate} </strong>) : ( item.registrationDate)}

                    {/* {item.registrationDate} */}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableRow} colSpan={1}>
                      {item.lastLoginDate}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableRow} colSpan={1}>

                    {!item.cancelDate ? '' : (userBaja(item.cancelDate,item.registrationDate) ? (<strong>{item.cancelDate}</strong>) : (item.cancelDate))}

                    {/* {item.cancelDate} */}
                    </StyledTableCell>
                  </TableRow>
                ))
              )
          }
        </TableBody>
      </Table>
      <Grid container className={classes.itemsPerPage}>
        <span style={{ marginRight: 5 }}>{t('common.pagination.show')}</span>
        <select id='number' name='number' onChange={onChangeSelector} className={classes.select}>
          <option value='20' selected>20</option>
          <option value='50'>50</option>
          <option value='100'>100</option>
        </select>
        <span style={{ marginLeft: 5 }}>{t('common.pagination.forPage')}</span>
      </Grid>
      {
        totalPagesFilter > 1 &&
        <Grid container className={classes.paginationContainer}>
          <Pagination
            totalPages={totalPagesFilter}
            currentPage={currentPage}
            handleChangePage={setCurrentPage}
          />
        </Grid>
      }
    </>
  )
}

export default List;