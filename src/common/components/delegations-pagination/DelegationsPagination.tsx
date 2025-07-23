import React from 'react'

import Grid from '@material-ui/core/Grid'
import TableFooter from '@material-ui/core/TableFooter'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

import LeftArrowIcon from '../../../assets/icons/flecha_izquierda.svg'
import RightArrowIcon from '../../../assets/icons/flecha_derecha.svg'

import useStyles, { StyledTableCell } from './DelegationsPagination.styles'

const DelegationsPagination = (props: any) => {
  const classes = useStyles({})

  const {
    totalPages,
    currentPage,
    handleChangePage
  } = props

  return (
    <>
    {
    totalPages > 1 &&
    <TableFooter>
      <TableRow>
        <StyledTableCell colSpan={4}>
          <Grid container justifyContent='center'>
            <img
              className={classes.icon}
              src={LeftArrowIcon}
              alt=''
              onClick={() => {
                if (currentPage > 1) {
                  handleChangePage(currentPage - 1)
                }
              }}
            />

            <Typography className={classes.label}><strong>{currentPage}</strong> de {totalPages}</Typography>

            <img
              className={classes.icon}
              src={RightArrowIcon}
              alt=''
              onClick={() => {
                if (currentPage < totalPages) {
                  handleChangePage(currentPage + 1)
                }
              }}
            />
          </Grid>
        </StyledTableCell>
      </TableRow>
    </TableFooter>
    }
    </>
  )
}

export default DelegationsPagination
