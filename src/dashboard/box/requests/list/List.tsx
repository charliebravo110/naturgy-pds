import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import useStyles, { StyledTableCell } from './List.styles'

const List = (props: any) => {
  const classes = useStyles({})

  const {
    requestsList,
    currentPage,
    rowsPerPage
  } = props

  return (
    <Table className={classes.table}>
      <TableBody>
        {requestsList.length === 0 ? (
          <TableRow>
            <StyledTableCell />
          </TableRow>
        ) : (
          requestsList
            .slice((currentPage - 1) * rowsPerPage, (currentPage - 1) * rowsPerPage + rowsPerPage)
            .map((request, index) => (
              <TableRow key={index} className={`${classes.row} 'unread'`}>
                <StyledTableCell className={classes.requestDate}>
                  <span className={classes.fecha}>{request.createDate}</span>
                </StyledTableCell>
                <StyledTableCell className={classes.requestInfo}>
                  <span className={classes.sr}>{request.codSR}</span>
                  <br/>
                  <span className={classes.description}>{request.tipologyDescription}</span>
                </StyledTableCell>
              </TableRow>
            ))
        )}
      </TableBody>
    </Table>
  )
}

export default List
