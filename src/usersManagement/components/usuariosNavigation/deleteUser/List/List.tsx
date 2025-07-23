import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import useStyles, { StyledTableCell } from './List.styles'

const List = (props: any) => {

  const { t } = useTranslation()
  const classes = useStyles({})

  const { searchedUser,activ } = props

  // let auxSurnames
  let auxName = ''
  const formatText = (text: string): string => {
    if (text && text !== '') {
      return (text.substring(0, 1) + text.substring(1, text.length).toLowerCase())
    }
    else {
      return text
    }
  }

  if (searchedUser) {
    if (searchedUser.document) {
      // auxSurnames = searchedUser.surName.split(' ')
      auxName = searchedUser.surname ? searchedUser.surname : ''
    }
  }

  const cutRegisterDate = (date: string): string => {
    let arrDate = date.split(' ')
    return arrDate[0]
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

  return (
    <>
      <Table className={classes.deleteTable}>
        <TableHead>
          <TableRow className={classes.tableRow}>
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('gestionUsuarios.management.deleteUser.documentShort')}
            </StyledTableCell>

            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('gestionUsuarios.management.deleteUser.fullName')}
            </StyledTableCell>

            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('gestionUsuarios.management.deleteUser.email')}
            </StyledTableCell>
            
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('gestionUsuarios.management.deleteUser.state')}
            </StyledTableCell>

            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
            {t('gestionUsuarios.management.deleteUser.registerDate')}
            </StyledTableCell>

            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('gestionUsuarios.management.deleteUser.lastAccess')}
            </StyledTableCell>
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
            {t('gestionUsuarios.management.deleteUser.cancelDate')}
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          
          {
            searchedUser && searchedUser.document ?
              <TableRow className={classes.tableBodyRow} >
                <StyledTableCell className={classes.tableRow} colSpan={1}>
                  {searchedUser.document}
                </StyledTableCell>
                <StyledTableCell className={classes.tableRow} colSpan={1}>
                  {(searchedUser.name) +' '+(auxName)}
                </StyledTableCell>
                <StyledTableCell className={classes.tableRow} colSpan={1}>
                  {searchedUser.email}
                </StyledTableCell>
                <StyledTableCell className={classes.tableRow} colSpan={1}>
                  {userBaja(searchedUser.cancelDate,searchedUser.registrationDate) ? t('gestionUsuarios.management.deleteUser.baja') : t('gestionUsuarios.management.deleteUser.alta')}
                </StyledTableCell>
                <StyledTableCell className={classes.tableRow} colSpan={1}>
                  {!userBaja(searchedUser.cancelDate,searchedUser.registrationDate) ? (<strong>{searchedUser.registrationDate} </strong>) : (searchedUser.registrationDate)}
                </StyledTableCell>
                <StyledTableCell className={classes.tableRow} colSpan={1}>
                  {searchedUser.lastLoginDate}
                </StyledTableCell>
                <StyledTableCell className={classes.tableRow} colSpan={1}>
                {!searchedUser.cancelDate ? '' : (userBaja(searchedUser.cancelDate,searchedUser.registrationDate) ? (<strong>{searchedUser.cancelDate}</strong>) : (searchedUser.cancelDate))}

                </StyledTableCell>
              </TableRow>
              :
              <TableRow className={classes.tableBodyRow} >
                <StyledTableCell className={classes.noResults} colSpan={12}>
                  {t('controlMensajeria.management.list.table.body.noResults')}
                </StyledTableCell>
              </TableRow>
          }
        </TableBody>
      </Table>
    </>
  )




}

export default List