import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import useStyles, { StyledTableCell } from './List.styles'
import { Grid } from '@material-ui/core'
import { noAccents } from '../../../../../common/lib/FormatLib'


const List = (props: any) => {
  const classes = useStyles({})

  const {
    candidatesList,
    setCandidatesList,
    setStreetName,
    setTown,
    setProvince,
    statesList,
    townsList,
    zipCode,
    setZipCode
  } = props

  const checkProvince = (value) => {
    let auxProvince = noAccents(value).toUpperCase()
    for (let i = 0; i < statesList.length; i++) {
      if (auxProvince.match(statesList[i])) {
        setProvince(statesList[i])
      }
    }
  }

  const checkTown = (value) => {
    let auxTown = noAccents(value).toUpperCase()
    for (let i = 0; i < townsList.length; i++) {
      if (auxTown.match(townsList[i])) {
        setTown(townsList[i])
      }
    }
  }

  const setAddress = (address) => {
    let splittedAddress = address.split(', ')
    setStreetName(splittedAddress[0])
    if (splittedAddress.length === 5) {
      checkProvince(splittedAddress[3])
      checkTown(splittedAddress[2])
      setZipCode(splittedAddress[1])
    } else if (splittedAddress.length === 4) {
      checkProvince(splittedAddress[2])
      checkTown(splittedAddress[1])
      setZipCode('')
    } else if (splittedAddress.length === 3) {
      checkProvince(splittedAddress[1])
      setTown('')
      setZipCode('')
    } else {
      setProvince('')
      setTown('')
      setZipCode('')
    }

    setCandidatesList([])
  }

  if (candidatesList) {
    return (
      <Table className={classes.table}>
        <TableBody>
          {candidatesList.length === 0 ? (
            <TableRow>
              <StyledTableCell />
            </TableRow>
          ) : (
            candidatesList.map((item, index) => (
              <TableRow key={index} className={`${classes.row} 'unread'`}>
                <StyledTableCell>
                  <Grid onClick={() => setAddress(item.address)}>
                    <span className={classes.pointer}>{item.address}</span>
                  </Grid>
                </StyledTableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    )
  } else {
    return (
      <>
      </>
    )
  }

}

export default List
